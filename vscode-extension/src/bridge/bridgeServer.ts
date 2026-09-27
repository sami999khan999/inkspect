import { createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { createServer, type IncomingMessage, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { WebSocket, WebSocketServer } from 'ws';
import { syncTrees, type FirstSyncMode, type SyncState } from '@inkspect/shared/bookmarkSync';
import {
  BRIDGE_PATH,
  encode,
  isExtensionOrigin,
  parseClientMessage,
  type ClientInfo,
  type ClientMessage,
  type ServerMessage,
} from '@inkspect/shared/bridge';
import { sendToChat } from '../agent/chat';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import type { BookmarksStore } from '../features/bookmarks';
import { JsonStore } from '../features/jsonStore';
import { displayPath, localWorkspaceFolder, saveScreenshot } from '../features/screenshots';
import { sendPathToTerminal } from '../features/terminalSend';

const CLIENTS_KEY = 'vscodeBrowser.bridge.clients';
const PAIRING_MS = 2 * 60_000;
const MAX_MESSAGE = 32 * 1024 * 1024;

interface PairedClient extends ClientInfo {
  origin: string;
  tokenHash: string;
  pairedAt: number;
}

interface Connection {
  socket: WebSocket;
  origin: string;
  client?: ClientInfo;
  /** Resolves when the browser reports the ids of nodes it created. */
  pendingApply?: (created: Record<string, string>) => void;
}

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

/**
 * The link to the Inkspect browser extension: a WebSocket server on 127.0.0.1. Browsers pair
 * once with a short code; afterwards they connect with a token (only its hash is stored).
 * Linked browsers sync bookmarks with VS Code both ways and can send screenshots and element
 * details to the chat, a terminal agent or the workspace.
 */
export class BridgeServer implements vscode.Disposable {
  private server?: Server;
  private sockets?: WebSocketServer;
  private readonly connections = new Set<Connection>();
  private pairing?: { code: string; expires: number };
  private readonly links: JsonStore<Record<string, SyncState>>;
  /** Per-browser sync queue: snapshots are merged one at a time. */
  private readonly queues = new Map<string, Promise<void>>();
  /** Browsers that were asked for a first sync this session and declined. */
  private readonly declined = new Set<string>();
  private applyingLocal = false;
  /** Integration tests answer the first-sync question in advance. */
  firstSyncModeForTests?: FirstSyncMode;
  private requestTimer?: NodeJS.Timeout;
  private readonly disposables: vscode.Disposable[] = [];
  private readonly statusItem: vscode.StatusBarItem;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly bookmarks: BookmarksStore,
    private readonly logger: vscode.LogOutputChannel,
  ) {
    this.links = new JsonStore({
      file: join(context.globalStorageUri.fsPath, 'bookmark-links.json'),
      version: 1,
      defaults: () => ({}),
    });
    this.statusItem = vscode.window.createStatusBarItem(
      'vscodeBrowser.bridge',
      vscode.StatusBarAlignment.Right,
      99,
    );
    this.statusItem.name = 'Inkspect browser link';
    this.statusItem.command = 'vscodeBrowser.bridge.pair';
    this.disposables.push(
      this.statusItem,
      this.onDidChangeEmitter,
      bookmarks.onDidChange(() => {
        if (!this.applyingLocal) this.requestSnapshotsSoon();
      }),
    );
  }

  /** Browsers connected right now. */
  get connected(): ClientInfo[] {
    return [...this.connections].flatMap((c) => (c.client ? [c.client] : []));
  }

  get port(): number | undefined {
    return (this.server?.address() as AddressInfo | null)?.port;
  }

  /** Starts or stops the server to match the settings. */
  async sync(): Promise<void> {
    const { bridgeEnabled, bridgePort } = getConfig();
    if (!bridgeEnabled) {
      this.stop();
      return;
    }
    if (this.server && this.port === bridgePort) return;
    this.stop();
    const server = createServer((_request, response) => response.writeHead(404).end());
    const sockets = new WebSocketServer({ noServer: true, maxPayload: MAX_MESSAGE });
    server.on('upgrade', (request, socket, head) => {
      if (!this.acceptable(request, bridgePort)) {
        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
        socket.destroy();
        return;
      }
      sockets.handleUpgrade(request, socket, head, (ws) =>
        this.onConnection(ws, request.headers.origin!),
      );
    });
    try {
      await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(bridgePort, '127.0.0.1', () => {
          server.off('error', reject);
          resolve();
        });
      });
    } catch (error) {
      // Another VS Code window already serves the link; it shares the same bookmarks file.
      this.logger.info(
        `Browser link: port ${bridgePort} is in use (${errorMessage(error)}), not serving.`,
      );
      return;
    }
    this.server = server;
    this.sockets = sockets;
    this.logger.info(`Browser link listening on ws://127.0.0.1:${bridgePort}${BRIDGE_PATH}`);
    this.updateStatus();
  }

  /** Shows a pairing code for the browser extension. */
  async startPairing(): Promise<void> {
    await this.sync();
    if (!this.server) {
      void vscode.window.showWarningMessage(
        'The browser link is not running in this window (another VS Code window may serve it, or it is turned off in settings).',
      );
      return;
    }
    const code = this.createPairingCode();
    const choice = await vscode.window.showInformationMessage(
      `Browser link pairing code: ${code}. In the browser, open the Inkspect toolbar (Alt+Shift+I), click the VS Code button and enter this code within 2 minutes.`,
      'Copy Code',
    );
    if (choice) await vscode.env.clipboard.writeText(code);
  }

  /** A new 6-digit pairing code, valid for 2 minutes (replaces any earlier one). */
  createPairingCode(): string {
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    this.pairing = { code, expires: Date.now() + PAIRING_MS };
    return code;
  }

  /** Forgets every paired browser and closes their connections. */
  async forgetAll(): Promise<void> {
    await this.context.globalState.update(CLIENTS_KEY, {});
    for (const connection of this.connections) connection.socket.close(4001, 'Unpaired');
    this.links.update(() => ({}));
    this.updateStatus();
  }

  private acceptable(request: IncomingMessage, port: number): boolean {
    const host = request.headers.host ?? '';
    const path = (request.url ?? '').split('?')[0];
    return (
      path === BRIDGE_PATH &&
      (host === `127.0.0.1:${port}` || host === `localhost:${port}`) &&
      isExtensionOrigin(request.headers.origin)
    );
  }

  private get paired(): Record<string, PairedClient> {
    return this.context.globalState.get<Record<string, PairedClient>>(CLIENTS_KEY) ?? {};
  }

  private onConnection(socket: WebSocket, origin: string): void {
    const connection: Connection = { socket, origin };
    this.connections.add(connection);
    socket.on('message', (data) => {
      const message = parseClientMessage(data.toString());
      if (!message) {
        this.send(connection, { type: 'error', message: 'Invalid message' });
        return;
      }
      this.onMessage(connection, message).catch((error: unknown) => {
        this.logger.error(`Browser link: ${errorMessage(error)}`);
        this.send(connection, { type: 'error', message: errorMessage(error) });
      });
    });
    socket.on('close', () => {
      this.connections.delete(connection);
      this.updateStatus();
    });
  }

  private async onMessage(connection: Connection, message: ClientMessage): Promise<void> {
    if (message.type === 'ping') {
      this.send(connection, { type: 'pong' });
      return;
    }
    if (message.type === 'pair') {
      const pairing = this.pairing;
      const valid =
        pairing &&
        Date.now() < pairing.expires &&
        message.code.length === pairing.code.length &&
        timingSafeEqual(Buffer.from(message.code), Buffer.from(pairing.code));
      if (!valid) {
        this.send(connection, {
          type: 'error',
          code: 'bad-code',
          message:
            'Wrong or expired code. Run "Browser: Connect Browser Extension" in VS Code for a new one.',
        });
        return;
      }
      this.pairing = undefined;
      const token = randomBytes(32).toString('base64url');
      await this.context.globalState.update(CLIENTS_KEY, {
        ...this.paired,
        [message.client.id]: {
          ...message.client,
          origin: connection.origin,
          tokenHash: hash(token),
          pairedAt: Date.now(),
        },
      });
      connection.client = message.client;
      this.send(connection, { type: 'paired', token, peer: this.peerName() });
      void vscode.window.showInformationMessage(
        `${message.client.browser} is now linked with VS Code.`,
      );
      this.welcome(connection);
      return;
    }
    if (message.type === 'hello') {
      const known = this.paired[message.client.id];
      const ok =
        known &&
        known.origin === connection.origin &&
        timingSafeEqual(Buffer.from(hash(message.token)), Buffer.from(known.tokenHash));
      if (!ok) {
        this.send(connection, {
          type: 'error',
          code: 'unpaired',
          message: 'This browser is not paired with VS Code.',
        });
        connection.socket.close(4001, 'Unpaired');
        return;
      }
      connection.client = message.client;
      this.welcome(connection);
      return;
    }
    // Everything else needs a paired, authenticated connection.
    const client = connection.client;
    if (!client) {
      this.send(connection, { type: 'error', code: 'unauthorized', message: 'Say hello first.' });
      return;
    }
    switch (message.type) {
      case 'bookmarks.snapshot':
        await this.enqueue(client.id, () => this.syncBookmarks(connection, client, message.tree));
        return;
      case 'bookmarks.applied':
        connection.pendingApply?.(message.created);
        connection.pendingApply = undefined;
        if (message.failed.length) {
          this.logger.warn(
            `Browser link: ${message.failed.length} bookmark changes failed in ${client.browser}.`,
          );
        }
        return;
      case 'send':
        await this.handleSend(connection, message);
        return;
    }
  }

  private welcome(connection: Connection): void {
    const syncBookmarks = getConfig().bridgeSyncBookmarks;
    this.send(connection, { type: 'welcome', peer: this.peerName(), syncBookmarks });
    this.updateStatus();
  }

  private peerName(): string {
    return `VS Code (${vscode.workspace.name ?? 'no folder'})`;
  }

  private send(connection: Connection, message: ServerMessage): void {
    if (connection.socket.readyState === WebSocket.OPEN) connection.socket.send(encode(message));
  }

  private enqueue(clientId: string, task: () => Promise<void>): Promise<void> {
    const next = (this.queues.get(clientId) ?? Promise.resolve()).then(task, task);
    this.queues.set(
      clientId,
      next.catch(() => {}),
    );
    return next;
  }

  /** VS Code's bookmarks changed: ask linked browsers for their tree to merge (debounced). */
  private requestSnapshotsSoon(): void {
    if (!getConfig().bridgeSyncBookmarks) return;
    clearTimeout(this.requestTimer);
    this.requestTimer = setTimeout(() => {
      for (const connection of this.connections) {
        if (connection.client) this.send(connection, { type: 'bookmarks.requestSnapshot' });
      }
    }, 400);
  }

  private async syncBookmarks(
    connection: Connection,
    client: ClientInfo,
    remote: Parameters<typeof syncTrees>[2],
  ): Promise<void> {
    if (!getConfig().bridgeSyncBookmarks || this.declined.has(client.id)) return;
    const state = this.links.data[client.id];
    const local = this.bookmarks.flatTree();
    let mode: FirstSyncMode = 'merge';
    if (!state) {
      const chosen =
        this.firstSyncModeForTests ??
        (await this.askFirstSync(
          client,
          local.filter((n) => n.url !== undefined).length,
          remote.filter((n) => n.url !== undefined).length,
        ));
      if (!chosen) {
        this.declined.add(client.id);
        return;
      }
      mode = chosen;
      await this.backup(`before first sync with ${client.browser}`);
    }
    const result = syncTrees(state, local, remote, mode);
    if (result.localChanged) {
      const removed = local.filter((n) => !result.tree.some((m) => m.id === n.id)).length;
      if (state && removed > 20) await this.backup(`before removing ${removed} bookmarks`);
      this.applyingLocal = true;
      try {
        this.bookmarks.replaceTree(result.tree);
      } finally {
        this.applyingLocal = false;
      }
    }
    const idMap = { ...result.idMap };
    if (result.ops.length) {
      const created = await new Promise<Record<string, string>>((resolve) => {
        connection.pendingApply = resolve;
        this.send(connection, { type: 'bookmarks.ops', ops: result.ops });
        // A browser that disappears mid-sync resyncs from the base next time.
        setTimeout(() => resolve({}), 30_000);
      });
      Object.assign(idMap, created);
    }
    this.links.update((links) => ({ ...links, [client.id]: { base: result.tree, idMap } }));
    this.logger.info(
      `Browser link: synced bookmarks with ${client.browser} (${result.ops.length} changes there${result.localChanged ? ', VS Code updated' : ''}).`,
    );
  }

  private async askFirstSync(
    client: ClientInfo,
    localCount: number,
    remoteCount: number,
  ): Promise<FirstSyncMode | undefined> {
    const pick = await vscode.window.showQuickPick(
      [
        {
          label: 'Merge',
          description: 'Recommended',
          detail: `Keep bookmarks from both (${localCount} in VS Code, ${remoteCount} in ${client.browser}); duplicates are combined.`,
          mode: 'merge' as const,
        },
        {
          label: `Use ${client.browser}'s bookmarks`,
          detail: `Replace VS Code's ${localCount} bookmarks with ${client.browser}'s ${remoteCount}.`,
          mode: 'useRemote' as const,
        },
        {
          label: "Use VS Code's bookmarks",
          detail: `Replace ${client.browser}'s ${remoteCount} bookmarks with VS Code's ${localCount}.`,
          mode: 'useLocal' as const,
        },
      ],
      {
        title: `Sync bookmarks with ${client.browser}`,
        placeHolder:
          'How should the bookmarks be combined the first time? (A backup is saved first.)',
        ignoreFocusOut: true,
      },
    );
    return pick?.mode;
  }

  /** Saves the bookmarks as HTML in global storage (keeps the last 5). */
  private async backup(reason: string): Promise<void> {
    const folder = join(this.context.globalStorageUri.fsPath, 'bookmark-backups');
    await mkdir(folder, { recursive: true });
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    await writeFile(join(folder, `bookmarks-${stamp}.html`), this.bookmarks.exportHtml(), 'utf8');
    const files = (await readdir(folder)).filter((f) => f.startsWith('bookmarks-')).sort();
    for (const old of files.slice(0, -5)) await rm(join(folder, old), { force: true });
    this.logger.info(`Bookmarks backed up (${reason}) in ${folder}`);
  }

  private async handleSend(
    connection: Connection,
    message: Extract<ClientMessage, { type: 'send' }>,
  ): Promise<void> {
    const reply = (ok: boolean, extra: { path?: string; error?: string } = {}) =>
      this.send(connection, { type: 'send.result', id: message.id, ok, ...extra });
    try {
      const globalStorage = this.context.globalStorageUri.fsPath;
      const label = message.label || 'From the browser';
      let path: string | undefined;
      if (message.image) {
        path = await saveScreenshot(
          new Uint8Array(Buffer.from(message.image, 'base64')),
          message.pageUrl ?? '',
          'png',
          globalStorage,
        );
      } else if (message.text && message.target !== 'chat') {
        // Multi-line text can't be typed into a terminal safely: agents read it from a file.
        path = await this.saveContext(message.text, label);
      }
      if (message.target === 'chat') {
        await sendToChat(
          message.text ??
            `${label}${message.pageUrl ? ` of ${message.pageUrl}` : ''}: ${path ? displayPath(path) : ''}`,
          path ? [vscode.Uri.file(path)] : [],
        );
      } else if (message.target === 'terminal' && path) {
        const sent = await sendPathToTerminal(path);
        if (!sent) {
          reply(false, { path, error: 'No terminal was chosen in VS Code.' });
          return;
        }
      } else if (message.target === 'save' && path) {
        void vscode.window.showInformationMessage(`${label} saved to ${displayPath(path)}`);
      }
      reply(true, { path: path && displayPath(path) });
    } catch (error) {
      reply(false, { error: errorMessage(error) });
    }
  }

  /** Writes text (element details, console summaries) where agents can read it. */
  private async saveContext(text: string, label: string): Promise<string> {
    const workspace = localWorkspaceFolder();
    const folder = workspace
      ? join(workspace, '.vscode-browser', 'context')
      : join(this.context.globalStorageUri.fsPath, 'context');
    await mkdir(folder, { recursive: true });
    const slug =
      label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 40) || 'context';
    const path = join(folder, `${slug}-${Date.now()}.md`);
    await writeFile(path, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
    return path;
  }

  private updateStatus(): void {
    const connected = this.connected;
    if (!this.server) {
      this.statusItem.hide();
    } else {
      this.statusItem.text = connected.length
        ? `$(plug) ${connected.length}`
        : '$(debug-disconnect)';
      this.statusItem.tooltip = connected.length
        ? `Linked browsers: ${connected.map((c) => c.browser).join(', ')}`
        : 'No browser linked. Click to pair the Inkspect browser extension.';
      this.statusItem.show();
    }
    this.onDidChangeEmitter.fire();
  }

  private stop(): void {
    for (const connection of this.connections) connection.socket.terminate();
    this.connections.clear();
    this.sockets?.close();
    this.server?.close();
    this.server = undefined;
    this.sockets = undefined;
    this.updateStatus();
  }

  dispose(): void {
    clearTimeout(this.requestTimer);
    this.stop();
    this.links.flushSync();
    for (const d of this.disposables) d.dispose();
  }
}
