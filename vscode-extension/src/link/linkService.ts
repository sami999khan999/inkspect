import { mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { syncTrees, type FirstSyncMode, type SyncState } from '@inkspect/shared/bookmarkSync';
import {
  newerShortcuts,
  type ClientInfo,
  type ClientMessage,
  type ServerMessage,
  type ShortcutSettings,
} from '@inkspect/shared/bridge';
import { captureAndSend, sendContextItems } from '../agent/chat';
import { addContext, contextTray } from '../agent/contextTray';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import type { BookmarksStore } from '../features/bookmarks';
import { copyImageBytes } from '../features/clipboard';
import { saveContext } from '../features/context';
import { JsonStore } from '../features/jsonStore';
import { displayPath, saveScreenshot } from '../features/screenshots';
import {
  isOwnWrite,
  onDidChangeShortcuts,
  readShortcuts,
  touchShortcuts,
  writeShortcuts,
} from '../features/shortcutSettings';
import { CHAT_TARGET } from '../features/terminalSend';
import { sanitizeOverrides } from '../shared/shortcuts';

export type SendMessage = Extract<ClientMessage, { type: 'send' }>;

/** How a send ended, for the browser. */
export interface SendResult {
  ok: boolean;
  path?: string;
  error?: string;
}

/**
 * One linked, authenticated browser, whatever carries its messages (the WebSocket link, or the
 * local hub). The transport owns the connection; the link service only sends and keeps the
 * bookmark sync's reply handler on it.
 */
export interface LinkPeer {
  readonly client: ClientInfo;
  send(message: ServerMessage): void;
  /** Resolves when the browser reports the ids of nodes it created. */
  pendingApply?: (created: Record<string, string>) => void;
}

/** Messages a linked browser sends once it is authenticated. */
export type LinkedMessage = Extract<
  ClientMessage,
  { type: 'bookmarks.snapshot' | 'bookmarks.applied' | 'send' | 'settings.shortcuts' }
>;

/** Whether a message is for the link service (the transport handles hello, pairing and pings). */
export function isLinkedMessage(message: ClientMessage): message is LinkedMessage {
  return (
    message.type === 'bookmarks.snapshot' ||
    message.type === 'bookmarks.applied' ||
    message.type === 'send' ||
    message.type === 'settings.shortcuts'
  );
}

/**
 * What a linked browser does with this window, independent of how it is connected: bookmark
 * sync both ways, the shortcut settings, and sends (captures to the Agent Context list, the
 * chat, an agent or the workspace). Transports register their authenticated browsers as peers.
 */
export class LinkService implements vscode.Disposable {
  private readonly peers = new Set<LinkPeer>();
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
  /** The shortcut settings last seen, to notice edits that didn't update the time. */
  private lastShortcuts = (() => {
    const { overrides, updated } = readShortcuts();
    return { json: JSON.stringify(overrides), updated };
  })();

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly bookmarks: BookmarksStore,
    private readonly logger: vscode.LogOutputChannel,
    /**
     * Whether this window speaks for VS Code to the browsers (it holds the link): only that window
     * stamps shortcut edits made outside the extension.
     */
    private readonly isServing: () => boolean,
  ) {
    this.links = new JsonStore({
      file: join(context.globalStorageUri.fsPath, 'bookmark-links.json'),
      version: 1,
      defaults: () => ({}),
    });
    this.disposables.push(
      bookmarks.onDidChange(() => {
        if (!this.applyingLocal) this.requestSnapshotsSoon();
      }),
      // Shortcut changes go to every linked browser (and from there to its sync storage).
      onDidChangeShortcuts(() => {
        const { overrides, updated } = readShortcuts();
        const json = JSON.stringify(overrides);
        const changed = json !== this.lastShortcuts.json;
        this.lastShortcuts = { json, updated };
        // Changed outside writeShortcuts (settings.json by hand, Settings Sync): give it a new
        // time, or browsers would keep their copy. Only the serving window does; the new time
        // brings this event back as our own write, which is then sent.
        if (this.isServing() && changed && !isOwnWrite(overrides, updated)) {
          void touchShortcuts();
          return;
        }
        this.broadcast(this.shortcutsMessage());
      }),
    );
  }

  /** Starts serving a linked browser. */
  add(peer: LinkPeer): void {
    this.peers.add(peer);
  }

  remove(peer: LinkPeer): void {
    this.peers.delete(peer);
  }

  /** Whether any browser is linked to this window. */
  get hasPeers(): boolean {
    return this.peers.size > 0;
  }

  /** Sends a message to every linked browser. */
  broadcast(message: ServerMessage): void {
    for (const peer of this.peers) peer.send(message);
  }

  /** The first messages a browser gets once linked: who we are, and VS Code's shortcuts. */
  welcome(peer: LinkPeer, peerName: string): void {
    const syncBookmarks = getConfig().bridgeSyncBookmarks;
    peer.send({ type: 'welcome', peer: peerName, syncBookmarks });
    peer.send(this.shortcutsMessage());
  }

  /**
   * Handles a message from a linked browser. Sends go to `dispatchSend`, which decides which
   * window runs them (see `runSend`).
   */
  async handle(
    peer: LinkPeer,
    message: LinkedMessage,
    dispatchSend: (message: SendMessage) => Promise<SendResult>,
  ): Promise<void> {
    const client = peer.client;
    switch (message.type) {
      case 'bookmarks.snapshot':
        await this.enqueue(client.id, () => this.syncBookmarks(peer, message.tree));
        return;
      case 'bookmarks.applied':
        peer.pendingApply?.(message.created);
        peer.pendingApply = undefined;
        if (message.failed.length) {
          this.logger.warn(
            `Browser link: ${message.failed.length} bookmark changes failed in ${client.browser}.`,
          );
        }
        return;
      case 'send': {
        const result = await dispatchSend(message);
        peer.send({ type: 'send.result', id: message.id, ...result });
        return;
      }
      case 'settings.shortcuts': {
        // The browser's sync storage had newer shortcuts (changed on another device).
        const { overrides, updated } = readShortcuts();
        const local = { shortcuts: overrides as ShortcutSettings['shortcuts'], updated };
        if (newerShortcuts(local, message) === 'remote') {
          await writeShortcuts(sanitizeOverrides(message.shortcuts), message.updated);
          this.logger.info(`Browser link: shortcuts updated from ${client.browser}.`);
        }
        return;
      }
    }
  }

  /** Forgets the bookmark sync state of every browser (they were unlinked). */
  forgetLinks(): void {
    this.links.update(() => ({}));
  }

  /** VS Code's shortcut settings, for the browser to keep in its sync storage. */
  private shortcutsMessage(): ServerMessage {
    const { overrides, updated } = readShortcuts();
    return {
      type: 'settings.shortcuts',
      shortcuts: overrides as ShortcutSettings['shortcuts'],
      updated,
    };
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
    this.requestTimer = setTimeout(
      () => this.broadcast({ type: 'bookmarks.requestSnapshot' }),
      400,
    );
  }

  private async syncBookmarks(
    peer: LinkPeer,
    remote: Parameters<typeof syncTrees>[2],
  ): Promise<void> {
    const client = peer.client;
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
        peer.pendingApply = resolve;
        peer.send({ type: 'bookmarks.ops', ops: result.ops });
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

  /**
   * Runs a send in this window: added to the Agent Context list (every capture, as it is taken),
   * saved into the workspace, or sent to the chat or an agent. Sends of one capture share one
   * Agent Context item (its key).
   */
  async runSend(message: SendMessage): Promise<SendResult> {
    try {
      const globalStorage = this.context.globalStorageUri.fsPath;
      const label = message.label || 'From the browser';
      const key = message.capture ? `browser:${message.capture}` : undefined;
      const kind = message.kind ?? (message.image ? 'screenshot' : 'text');
      if (message.target === 'context') {
        // Only the list: nothing is copied (the browser did), saved or sent.
        addContext({
          kind,
          title: label,
          detail: message.pageUrl,
          text: message.image ? undefined : message.text,
          image: message.image
            ? { bytes: new Uint8Array(Buffer.from(message.image, 'base64')), mimeType: 'image/png' }
            : undefined,
          url: message.pageUrl,
          key,
          group: message.group,
        });
        return { ok: true };
      }
      if (
        message.captures?.length &&
        (message.target === 'chat' || message.target === 'terminal')
      ) {
        // Several captures, already in the list: one send with all of them.
        const tray = contextTray();
        const items = message.captures.flatMap(
          (capture) => tray?.all().find((i) => i.key === `browser:${capture}`) ?? [],
        );
        if (items.length < message.captures.length) {
          return {
            ok: false,
            error: 'Some of those screenshots are not in this VS Code window. Send them again.',
          };
        }
        const sent = await sendContextItems(
          items,
          message.target === 'terminal' ? 'terminal' : CHAT_TARGET,
        );
        return sent
          ? { ok: true }
          : { ok: false, error: 'Nothing was sent: no agent is running in a VS Code terminal.' };
      }
      let path: string | undefined;
      if (message.image) {
        const bytes = new Uint8Array(Buffer.from(message.image, 'base64'));
        path = await saveScreenshot(bytes, message.pageUrl ?? '', 'png', globalStorage);
        // Screenshots are always copied, wherever they come from.
        await copyImageBytes(bytes, 'image/png').catch((error: unknown) =>
          this.logger.warn(`Browser link: could not copy the image: ${errorMessage(error)}`),
        );
      }
      if (message.target === 'save') {
        path ??= message.text ? await saveContext(message.text, label, globalStorage) : undefined;
        if (path)
          void vscode.window.showInformationMessage(`${label} saved to ${displayPath(path)}`);
      } else {
        // Sends from the browser show in the Agent Context list too.
        const sent = await captureAndSend(
          {
            kind,
            key,
            title: label,
            detail: message.pageUrl,
            text: message.image ? undefined : message.text,
            file: path,
            url: message.pageUrl,
          },
          // The browser names the agent: the chat, or an agent in a terminal.
          message.target === 'terminal' ? 'terminal' : CHAT_TARGET,
        );
        if (!sent) {
          return {
            ok: false,
            path: path && displayPath(path),
            error: 'Nothing was sent: no agent is running in a VS Code terminal.',
          };
        }
      }
      return { ok: true, path: path && displayPath(path) };
    } catch (error) {
      return { ok: false, error: errorMessage(error) };
    }
  }

  dispose(): void {
    clearTimeout(this.requestTimer);
    this.links.flushSync();
    for (const d of this.disposables) d.dispose();
  }
}
