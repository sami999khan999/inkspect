import { createHash, randomBytes, randomInt, randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
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
  newerShortcuts,
  parseClientMessage,
  type ClientInfo,
  type ClientMessage,
  type ServerMessage,
  type ShortcutSettings,
} from '@inkspect/shared/bridge';
import { captureAndSend, sendContextItems } from '../agent/chat';
import { CHAT_TARGET } from '../features/terminalSend';
import { addContext, contextTray } from '../agent/contextTray';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import type { BookmarksStore } from '../features/bookmarks';
import { JsonStore } from '../features/jsonStore';
import { displayPath, saveScreenshot } from '../features/screenshots';
import { copyImageBytes } from '../features/clipboard';
import { saveContext } from '../features/context';
import {
  isOwnWrite,
  onDidChangeShortcuts,
  readShortcuts,
  touchShortcuts,
  writeShortcuts,
} from '../features/shortcutSettings';
import { sanitizeOverrides } from '../shared/shortcuts';
import { choosePending, parseApproval, type PairingApproval } from './pairing';
import { WindowRelay, type RelayResult } from './windowRelay';

const CLIENTS_KEY = 'vscodeBrowser.bridge.clients';
/** When each unpaired browser's "wants to link" notification was shown (see recentlyOffered). */
const OFFERS_SHOWN_KEY = 'vscodeBrowser.bridge.offersShown';
/** How long a shown "wants to link" notification stays quiet for that browser. */
const OFFER_REMIND_MS = 7 * 24 * 60 * 60_000;
/** How long a browser just unlinked comes back without a notification. */
const QUIET_MS = 60_000;
const PAIRING_MS = 2 * 60_000;
/** How long a Pair click waits for a browser that is already connected and waiting. */
const LINKING_MS = 10_000;
const MAX_MESSAGE = 32 * 1024 * 1024;
/** How long an unpaired browser's offer stays up for VS Code windows to show. */
const OFFER_MS = 10 * 60_000;
/** How often a window that couldn't bind the port tries again (the serving window may close). */
const RETRY_MS = 15_000;
// Files in globalStorage shared by all VS Code windows: only one window serves the link, but
// pairing can start from any of them.
const PAIRING_FILE = 'bridge-pairing.json';
const OFFERS_FILE = 'bridge-offers.json';
/** A Pair click in some window, for the serving window to act on (see pairing.ts). */
const APPROVE_FILE = 'bridge-approve.json';
/** An Unlink click in some window, for the serving window (which holds the connections). */
const UNLINK_FILE = 'bridge-unlink.json';
/** The serving window's linked browsers, so every window's status bar can show them. */
const LINK_FILE = 'bridge-link.json';
/** A link file this old means its window closed without saying so. */
const LINK_STALE_MS = 30_000;

interface SharedLink {
  browsers: string[];
  /** The serving window's name. */
  servedBy: string;
  at: number;
  /** What the serving window's version handles (see LINK_FEATURES); missing in older ones. */
  features?: number;
}
/**
 * Raised when the windows must agree on something new. 2: Pair clicks (APPROVE_FILE) and Unlink
 * (UNLINK_FILE) from any window. A window serving an older level can't act on them.
 */
const LINK_FEATURES = 2;
/** Sends relayed from the serving window to the window the user used last. */
const SENDS_FOLDER = 'bridge-sends';

type SendMessage = Extract<ClientMessage, { type: 'send' }>;

interface SharedPairing {
  codeHash: string;
  expires: number;
}

interface Offer {
  browser: string;
  at: number;
  /** Some window already showed it. */
  shown?: boolean;
}

interface PairedClient extends ClientInfo {
  origin: string;
  tokenHash: string;
  pairedAt: number;
}

interface Connection {
  socket: WebSocket;
  origin: string;
  client?: ClientInfo;
  /** An unpaired browser that said hello and waits to be paired. */
  pending?: ClientInfo;
  /** Resolves when the browser reports the ids of nodes it created. */
  pendingApply?: (created: Record<string, string>) => void;
}

const hash = (token: string) => createHash('sha256').update(token).digest('hex');

/** What the side panel and status bar show about the link, in any window. */
export interface LinkState {
  /** Linked browsers' names. */
  browsers: string[];
  /** Unpaired browsers that are connected and waiting to be paired. */
  waiting: { id: string; browser: string }[];
}

/**
 * The link to the Inkspect browser extension: a WebSocket server on 127.0.0.1. An unpaired
 * browser connects and waits; a Pair click in VS Code (or a short code typed in the browser)
 * pairs it. Afterwards it connects with a token (only its hash is stored).
 * Linked browsers sync bookmarks with VS Code both ways and can send screenshots and element
 * details to the chat, a terminal agent or the workspace.
 */
export class BridgeServer implements vscode.Disposable {
  private server?: Server;
  private sockets?: WebSocketServer;
  private readonly connections = new Set<Connection>();
  private readonly links: JsonStore<Record<string, SyncState>>;
  /** Per-browser sync queue: snapshots are merged one at a time. */
  private readonly queues = new Map<string, Promise<void>>();
  /** Browsers that were asked for a first sync this session and declined. */
  private readonly declined = new Set<string>();
  /** Browsers just unlinked: when they come back unpaired, no "wants to link" notification. */
  private readonly quiet = new Map<string, number>();
  private applyingLocal = false;
  /** Integration tests answer the first-sync question in advance. */
  firstSyncModeForTests?: FirstSyncMode;
  private requestTimer?: NodeJS.Timeout;
  private retryTimer?: NodeJS.Timeout;
  private loggedPortInUse = false;
  private warnedOlderServer = false;
  private readonly startedAt = Date.now();
  private readonly disposables: vscode.Disposable[] = [];
  private readonly statusItem: vscode.StatusBarItem;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;
  /** Runs sends in the VS Code window used last, not only in the one serving the link. */
  private readonly relay: WindowRelay<SendMessage>;
  private relayTimer?: NodeJS.Timeout;
  private relayTicks = 0;
  /** The window list browsers were sent last. */
  private lastWindows = '';
  /** The status bar item's last text and tooltip ('' when hidden). */
  private lastStatus: string | undefined;

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
    this.relay = new WindowRelay(
      join(context.globalStorageUri.fsPath, SENDS_FOLDER),
      randomUUID(),
      () => vscode.workspace.name ?? 'No folder',
      (message) => this.runSend(message),
    );
    if (vscode.window.state.focused) this.relay.markFocused();
    else this.relay.announce();
    // The heartbeat that keeps this window in the list, and a check for sends handed to it (the
    // folder watcher below can miss events). The serving window also tells browsers when the
    // list of windows changes.
    this.relayTimer = setInterval(() => {
      void this.relay.poll();
      if (++this.relayTicks % 10 === 0) {
        try {
          this.relay.announce();
        } catch (error) {
          this.logger.warn(`Browser link: could not announce this window: ${errorMessage(error)}`);
        }
        // The serving window's heartbeat for the others' status bar.
        if (this.server) {
          this.shareLink();
          this.pruneOffers();
        }
      }
      this.sendWindowsIfChanged();
      if (!this.server) this.updateStatus();
      // The approval file's watcher can miss events too; so could one for unlinking.
      else {
        void this.approvePending();
        void this.unlinkIfAsked();
      }
    }, 1_000);
    this.statusItem = vscode.window.createStatusBarItem(
      'vscodeBrowser.bridge',
      vscode.StatusBarAlignment.Right,
      99,
    );
    this.statusItem.name = 'Inkspect browser link';
    this.statusItem.command = 'vscodeBrowser.bridge.manage';
    this.disposables.push(
      this.statusItem,
      this.onDidChangeEmitter,
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
        if (this.server && changed && !isOwnWrite(overrides, updated)) {
          void touchShortcuts();
          return;
        }
        const message = this.shortcutsMessage();
        for (const connection of this.connections) {
          if (connection.client) this.send(connection, message);
        }
      }),
      // Offers are shown by whichever window has focus, which is rarely the serving one.
      vscode.window.onDidChangeWindowState((state) => {
        if (!state.focused) return;
        this.showOffers();
        this.relay.markFocused();
        void this.relay.poll();
        this.sendWindowsIfChanged();
      }),
    );
    // Sends handed to this window by the one serving the link.
    const sends = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.Uri.joinPath(context.globalStorageUri, SENDS_FOLDER), '*'),
    );
    this.disposables.push(
      sends,
      sends.onDidCreate(() => void this.relay.poll()),
      sends.onDidChange(() => void this.relay.poll()),
    );
    const offers = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(context.globalStorageUri, OFFERS_FILE),
    );
    this.disposables.push(
      offers,
      offers.onDidCreate(() => this.onOffersChanged()),
      offers.onDidChange(() => this.onOffersChanged()),
      offers.onDidDelete(() => this.onDidChangeEmitter.fire()),
    );
    const approvals = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(context.globalStorageUri, APPROVE_FILE),
    );
    this.disposables.push(
      approvals,
      approvals.onDidCreate(() => void this.approvePending()),
      approvals.onDidChange(() => void this.approvePending()),
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
      // Try again later, so the link moves here when that window closes.
      if (!this.loggedPortInUse) {
        this.loggedPortInUse = true;
        this.logger.info(
          `Browser link: port ${bridgePort} is in use (${errorMessage(error)}); another window serves it.`,
        );
      }
      this.retryTimer = setTimeout(() => void this.sync(), RETRY_MS);
      return;
    }
    this.server = server;
    this.sockets = sockets;
    this.logger.info(`Browser link listening on ws://127.0.0.1:${bridgePort}${BRIDGE_PATH}`);
    this.updateStatus();
  }

  private checkEnabled(): boolean {
    if (getConfig().bridgeEnabled) return true;
    void vscode.window.showWarningMessage(
      'The browser link is turned off (setting "vscodeBrowser.bridge.enabled").',
    );
    return false;
  }

  /**
   * Pairs the browser extension in one click, from any window: the browser is already connected
   * and waiting, so VS Code approves it and sends it a token. With several waiting, the user picks
   * one; with none yet, the next browser to connect in the next 2 minutes is paired.
   */
  async pair(): Promise<void> {
    if (!this.checkEnabled()) return;
    await this.sync();
    // A window that wasn't reloaded after an update holds the link: it would never act on the
    // click. It still takes codes.
    const older = this.olderServingWindow();
    if (older) {
      if (await this.warnOlderServingWindow(older, 'pair in one click')) await this.pairWithCode();
      return;
    }
    const waiting = this.linkState().waiting;
    let clientId: string | undefined;
    if (waiting.length > 1) {
      const picked = await vscode.window.showQuickPick(
        waiting.map((w) => ({ label: w.browser, id: w.id })),
        { title: 'Pair a browser', placeHolder: 'Which browser should link with VS Code?' },
      );
      if (!picked) return;
      clientId = picked.id;
    } else {
      clientId = waiting[0]?.id;
    }
    const before = this.linkState().browsers.length;
    this.approve(clientId);
    // Wait for the link: at once for a connected browser, or until one shows up (an unpaired
    // browser retries every few seconds).
    const name = waiting.find((w) => w.id === clientId)?.browser;
    type Outcome = 'linked' | 'timeout' | 'cancelled' | 'choose';
    // The serving window removes the approval when it pairs with it.
    const approvalLeft = () => this.readShared(APPROVE_FILE) !== undefined;
    const outcome = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: name
          ? `Linking ${name}…`
          : 'Waiting for your browser… Open Chrome, Edge, Brave or Firefox with the Inkspect extension.',
        cancellable: true,
      },
      (_progress, token) =>
        new Promise<Outcome>((resolve) => {
          const finish = (result: Outcome) => {
            clearTimeout(timer);
            listener.dispose();
            cancel.dispose();
            resolve(result);
          };
          // A connected browser links within a second; waiting for one to start takes longer.
          const timer = setTimeout(() => finish('timeout'), name ? LINKING_MS : PAIRING_MS);
          const listener = this.onDidChange(() => {
            const state = this.linkState();
            if (state.browsers.length > before && !approvalLeft()) finish('linked');
            // Several browsers showed up: an approval without a name can't choose, so let the user.
            else if (!clientId && state.waiting.length > 1) finish('choose');
          });
          const cancel = token.onCancellationRequested(() => finish('cancelled'));
          // It may have linked before the listener was added.
          if (this.linkState().browsers.length > before && !approvalLeft()) finish('linked');
        }),
    );
    // Never left behind: it would pair the next unpaired browser without asking.
    this.writeShared(APPROVE_FILE, undefined);
    if (outcome === 'linked') return;
    if (outcome === 'cancelled') return;
    if (outcome === 'choose') {
      await this.pair();
      return;
    }
    const choice = await vscode.window.showWarningMessage(
      name
        ? `${name} didn't answer. Check that its browser is still open, then try again.`
        : 'No browser showed up. Is the Inkspect extension installed and its browser open?',
      'Try Again',
      'Use a Code Instead',
    );
    if (choice === 'Try Again') await this.pair();
    else if (choice) await this.pairWithCode();
  }

  /** The fallback: a code for the user to type in the browser. */
  async pairWithCode(): Promise<void> {
    if (!this.checkEnabled()) return;
    // Works in any window: the code is shared with the window that serves the link.
    await this.sync();
    const code = this.createPairingCode();
    const choice = await vscode.window.showInformationMessage(
      `Browser link pairing code: ${code}. In the browser, open the Inkspect popup, choose "Use a code" and enter it within 2 minutes.`,
      'Copy Code',
    );
    if (choice) await vscode.env.clipboard.writeText(code);
  }

  /** Linked: what to do next. Unlinked: pair. (The side panel item and status bar run this.) */
  async manage(): Promise<void> {
    const { browsers } = this.linkState();
    if (!browsers.length) {
      await this.pair();
      return;
    }
    const picked = await vscode.window.showQuickPick(
      [
        { label: '$(plug) Pair Another Browser', run: () => this.pair() },
        { label: '$(debug-disconnect) Unlink All Browsers', run: () => this.forgetAll() },
      ],
      { title: `Linked with ${browsers.join(', ')}` },
    );
    await picked?.run();
  }

  /** Writes a Pair click for the serving window (this one, or another). */
  approve(clientId?: string): void {
    const approval: PairingApproval = { clientId, expires: Date.now() + PAIRING_MS };
    this.writeShared(APPROVE_FILE, approval);
    void this.approvePending();
  }

  /** Serving window: pairs the waiting browser a Pair click approved, if it is connected. */
  private async approvePending(): Promise<void> {
    if (!this.server) return;
    const waiting = [...this.connections].filter((c) => c.pending && !c.client);
    if (!waiting.length) return;
    const approval = parseApproval(this.readShared(APPROVE_FILE));
    const chosen = choosePending(
      waiting.map((c) => ({ id: c.pending!.id, connection: c })),
      approval,
      Date.now(),
    );
    if (!chosen) return;
    try {
      await this.completePairing(chosen.connection, chosen.connection.pending!);
    } catch (error) {
      this.logger.error(`Browser link: pairing failed: ${errorMessage(error)}`);
    }
  }

  /** The link state for this window's views, whichever window serves the link. */
  linkState(): LinkState {
    const waiting = Object.entries(this.readOffers()).map(([id, offer]) => ({
      id,
      browser: offer.browser,
    }));
    if (this.server) return { browsers: this.connected.map((c) => c.browser), waiting };
    return { browsers: this.sharedLink()?.browsers ?? [], waiting };
  }

  /** An unpaired browser connected: record an offer for the next focused window to show. */
  private offerPairing(client: ClientInfo): void {
    const offers = this.readOffers();
    if (!offers[client.id]) {
      // A browser the user just unlinked comes right back unpaired: no notification for it (the
      // side panel still offers to pair it).
      const quietSince = this.quiet.get(client.id);
      this.quiet.delete(client.id);
      const shown =
        (quietSince !== undefined && Date.now() - quietSince < QUIET_MS) ||
        this.recentlyOffered(client.id) ||
        undefined;
      offers[client.id] = { browser: client.browser, at: Date.now(), shown };
      this.writeShared(OFFERS_FILE, offers);
    }
    this.onOffersChanged();
  }

  private onOffersChanged(): void {
    this.showOffers();
    this.onDidChangeEmitter.fire();
  }

  /** When each browser's "wants to link" notification was last shown (any window, any session). */
  private offersShown(): Record<string, number> {
    const now = Date.now();
    const stored = this.context.globalState.get<Record<string, number>>(OFFERS_SHOWN_KEY) ?? {};
    return Object.fromEntries(
      Object.entries(stored).filter(
        ([, at]) => typeof at === 'number' && now - at < OFFER_REMIND_MS,
      ),
    );
  }

  /**
   * Its notification was shown lately: it isn't shown again each time the browser reconnects
   * (VS Code reloads, the browser restarts); the side panel still offers to pair it.
   */
  private recentlyOffered(clientId: string): boolean {
    return clientId in this.offersShown();
  }

  /** Shows offers no window has shown yet, if this window has focus (one notification each). */
  private showOffers(): void {
    if (!vscode.window.state.focused) return;
    const offers = this.readOffers();
    const fresh = Object.entries(offers).filter(([, offer]) => !offer.shown);
    if (!fresh.length) return;
    for (const [, offer] of fresh) offer.shown = true;
    this.writeShared(OFFERS_FILE, offers);
    const shownAt = {
      ...this.offersShown(),
      ...Object.fromEntries(fresh.map(([id]) => [id, Date.now()])),
    };
    void this.context.globalState.update(OFFERS_SHOWN_KEY, shownAt);
    for (const [id, offer] of fresh) {
      void vscode.window
        .showInformationMessage(`${offer.browser} wants to link with VS Code.`, 'Pair')
        .then((choice) => {
          if (!choice) return;
          const older = this.olderServingWindow();
          if (older) void this.warnOlderServingWindow(older, 'pair in one click');
          else this.approve(id);
        });
    }
  }

  private readOffers(): Record<string, Offer> {
    const stored = this.readShared<Record<string, Offer>>(OFFERS_FILE) ?? {};
    const now = Date.now();
    return Object.fromEntries(
      Object.entries(stored).filter(
        ([, offer]) =>
          typeof offer?.browser === 'string' &&
          typeof offer.at === 'number' &&
          now - offer.at < OFFER_MS,
      ),
    );
  }

  /** Ids of unpaired browsers waiting to be paired (shared by all windows). */
  pendingOffers(): string[] {
    return Object.keys(this.readOffers());
  }

  private removeOffer(clientId: string): void {
    const offers = this.readOffers();
    if (!offers[clientId]) return;
    delete offers[clientId];
    this.writeShared(OFFERS_FILE, Object.keys(offers).length ? offers : undefined);
  }

  /** A new 6-digit pairing code, valid for 2 minutes (replaces any earlier one, in any window). */
  createPairingCode(): string {
    const code = String(randomInt(0, 1_000_000)).padStart(6, '0');
    const pairing: SharedPairing = { codeHash: hash(code), expires: Date.now() + PAIRING_MS };
    this.writeShared(PAIRING_FILE, pairing);
    return code;
  }

  private readShared<T>(name: string): T | undefined {
    try {
      return JSON.parse(
        readFileSync(join(this.context.globalStorageUri.fsPath, name), 'utf8'),
      ) as T;
    } catch {
      return undefined;
    }
  }

  /** Writes (or, for `undefined`, removes) a file shared with the other windows. */
  private writeShared(name: string, value: unknown): void {
    const dir = this.context.globalStorageUri.fsPath;
    const file = join(dir, name);
    try {
      if (value === undefined) {
        rmSync(file, { force: true });
        return;
      }
      mkdirSync(dir, { recursive: true });
      const temp = `${file}.${process.pid}.tmp`;
      writeFileSync(temp, JSON.stringify(value), 'utf8');
      renameSync(temp, file);
    } catch (error) {
      this.logger.warn(`Browser link: could not write ${name}: ${errorMessage(error)}`);
    }
  }

  /**
   * Forgets every paired browser and closes their connections. Works from any window: the
   * serving window holds the connections and its own copy of the paired list, so it is told too.
   */
  async forgetAll(options: { confirm?: boolean } = {}): Promise<void> {
    const older = this.olderServingWindow();
    if (older) {
      await this.warnOlderServingWindow(older, 'unlink browsers from here');
      return;
    }
    const browsers = this.linkState().browsers;
    // Sends and bookmark sync stop, and pairing again needs the browser: ask first.
    if (options.confirm !== false) {
      const choice = await vscode.window.showWarningMessage(
        browsers.length ? `Unlink ${browsers.join(', ')}?` : 'Unlink all browsers?',
        {
          modal: true,
          detail: 'Sends from the browser and bookmark sync stop until you pair it again.',
        },
        'Unlink',
      );
      if (choice !== 'Unlink') return;
    }
    const ids = Object.keys(this.paired);
    await this.forgetHere(ids);
    if (!this.server) this.writeShared(UNLINK_FILE, { at: Date.now(), ids });
    void vscode.window.showInformationMessage(
      browsers.length
        ? `Unlinked ${browsers.join(', ')}. Pair again from the Browser side panel.`
        : 'Unlinked all browsers.',
    );
  }

  private async forgetHere(ids: readonly string[]): Promise<void> {
    for (const id of [...ids, ...Object.keys(this.paired)]) this.quiet.set(id, Date.now());
    // A Pair click still waiting would pair the unlinked browser again as it comes back.
    this.writeShared(APPROVE_FILE, undefined);
    await this.context.globalState.update(CLIENTS_KEY, {});
    for (const connection of this.connections) {
      if (connection.client) connection.socket.close(4001, 'Unpaired');
    }
    this.links.update(() => ({}));
    this.updateStatus();
  }

  /** Serving window: carries out an Unlink clicked in another window. */
  private async unlinkIfAsked(): Promise<void> {
    if (!this.server) return;
    const request = this.readShared<{ at?: unknown; ids?: unknown }>(UNLINK_FILE);
    if (!request) return;
    this.writeShared(UNLINK_FILE, undefined);
    // An old request (this window wasn't serving then) must not unlink a newer pairing.
    if (typeof request.at !== 'number' || Date.now() - request.at > LINK_STALE_MS) return;
    this.logger.info('Browser link: unlinking all browsers (asked by another window).');
    const ids = Array.isArray(request.ids)
      ? request.ids.filter((id): id is string => typeof id === 'string')
      : [];
    await this.forgetHere(ids);
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
      // A waiting browser that went away can't be paired any more.
      const gone = connection.pending;
      if (gone && ![...this.connections].some((c) => c.pending?.id === gone.id)) {
        this.removeOffer(gone.id);
        this.onDidChangeEmitter.fire();
      }
      this.updateStatus();
    });
  }

  /** Pairing approved (a code typed in the browser, or a Pair click in VS Code): send a token. */
  private async completePairing(connection: Connection, client: ClientInfo): Promise<void> {
    // Settled first, so a second approval can't pair the same connection again.
    connection.pending = undefined;
    connection.client = client;
    this.writeShared(PAIRING_FILE, undefined);
    this.writeShared(APPROVE_FILE, undefined);
    this.removeOffer(client.id);
    this.logger.info(`Browser link: paired with ${client.browser}.`);
    const token = randomBytes(32).toString('base64url');
    await this.context.globalState.update(CLIENTS_KEY, {
      ...this.paired,
      [client.id]: {
        ...client,
        origin: connection.origin,
        tokenHash: hash(token),
        pairedAt: Date.now(),
      },
    });
    this.send(connection, { type: 'paired', token, peer: this.peerName() });
    void vscode.window.showInformationMessage(`${client.browser} is now linked with VS Code.`);
    this.welcome(connection);
  }

  private async onMessage(connection: Connection, message: ClientMessage): Promise<void> {
    if (message.type === 'ping') {
      this.send(connection, { type: 'pong' });
      return;
    }
    if (message.type === 'pair') {
      const pairing = this.readShared<SharedPairing>(PAIRING_FILE);
      const codeHash = hash(message.code);
      const valid =
        typeof pairing?.codeHash === 'string' &&
        typeof pairing.expires === 'number' &&
        Date.now() < pairing.expires &&
        pairing.codeHash.length === codeHash.length &&
        timingSafeEqual(Buffer.from(codeHash), Buffer.from(pairing.codeHash));
      if (!valid) {
        this.send(connection, {
          type: 'error',
          code: 'bad-code',
          message:
            'Wrong or expired code. Run "Browser: Pair Browser Extension with a Code" in VS Code for a new one.',
        });
        return;
      }
      await this.completePairing(connection, message.client);
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
        if (message.token) {
          // A wrong token: drop the connection (the browser forgets it and asks to pair again).
          this.logger.info(`Browser link: ${message.client.browser} has an unknown token.`);
          connection.socket.close(4001, 'Unpaired');
        } else {
          // A browser that was never paired: keep the connection open for pairing, and offer it.
          this.logger.info(
            `Browser link: ${message.client.browser} connected but is not paired; offering to pair.`,
          );
          connection.pending = message.client;
          this.offerPairing(message.client);
          // A Pair click may have come first (the browser started after it).
          await this.approvePending();
        }
        return;
      }
      connection.pending = undefined;
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

  /** The shortcut settings last seen, to notice edits that didn't update the time. */
  private lastShortcuts = (() => {
    const { overrides, updated } = readShortcuts();
    return { json: JSON.stringify(overrides), updated };
  })();

  /** VS Code's shortcut settings, for the browser to keep in its sync storage. */
  private shortcutsMessage(): ServerMessage {
    const { overrides, updated } = readShortcuts();
    return {
      type: 'settings.shortcuts',
      shortcuts: overrides as ShortcutSettings['shortcuts'],
      updated,
    };
  }

  private welcome(connection: Connection): void {
    const syncBookmarks = getConfig().bridgeSyncBookmarks;
    this.send(connection, { type: 'welcome', peer: this.peerName(), syncBookmarks });
    this.send(connection, this.shortcutsMessage());
    this.send(connection, this.windowsMessage());
    this.updateStatus();
  }

  /** The open VS Code windows, for the browser to offer as places to send to. */
  private windowsMessage(): ServerMessage {
    const windows = this.relay.windows();
    return {
      type: 'windows',
      windows: windows.map((w, index) => ({ id: w.id, name: w.name, lastUsed: index === 0 })),
    };
  }

  /** Serving window: tells linked browsers when windows open, close or take focus. */
  private sendWindowsIfChanged(): void {
    if (!this.server) return;
    const message = this.windowsMessage();
    const json = JSON.stringify(message);
    if (json === this.lastWindows) return;
    this.lastWindows = json;
    for (const connection of this.connections) {
      if (connection.client) this.send(connection, message);
    }
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

  /** A send from the browser: it runs in the VS Code window used last (see WindowRelay). */
  private async handleSend(connection: Connection, message: SendMessage): Promise<void> {
    const result = await this.relay.dispatch(message, message.window);
    this.send(connection, { type: 'send.result', id: message.id, ...result });
  }

  /**
   * Runs a send in this window: added to the Agent Context list (every capture, as it is taken),
   * saved into the workspace, or sent to the chat or an agent. Sends of one capture share one
   * Agent Context item (its key).
   */
  private async runSend(message: SendMessage): Promise<RelayResult> {
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

  /**
   * Another process holds the link's port but writes no link file: an older version of this
   * extension, in a window that wasn't reloaded after an update. Browser sends then fail (it
   * doesn't know newer messages), so say which windows to reload, once per session.
   */
  private warnIfServedByOlderVersion(): void {
    if (
      this.warnedOlderServer ||
      !this.loggedPortInUse ||
      !vscode.window.state.focused ||
      Date.now() - this.startedAt < LINK_STALE_MS
    ) {
      return;
    }
    this.warnedOlderServer = true;
    void vscode.window.showWarningMessage(
      'The browser link runs in a VS Code window with an older version of VS Code Browser, so captures from the browser may not arrive. Reload your other VS Code windows (Developer: Reload Window).',
    );
  }

  /** Serving window: writes its linked browsers for the other windows' status bars. */
  private shareLink(): void {
    const link: SharedLink = {
      browsers: this.connected.map((c) => c.browser),
      servedBy: vscode.workspace.name ?? 'another window',
      at: Date.now(),
      features: LINK_FEATURES,
    };
    this.writeShared(LINK_FILE, link);
  }

  /**
   * The name of the window serving the link, if it runs an older version that can't act on Pair
   * or Unlink clicks from other windows (it wasn't reloaded after an update).
   */
  private olderServingWindow(): string | undefined {
    if (this.server) return undefined;
    const link = this.sharedLink();
    return link && (link.features ?? 0) < LINK_FEATURES ? link.servedBy : undefined;
  }

  private warnOlderServingWindow(name: string, action: string): Thenable<string | undefined> {
    return vscode.window.showWarningMessage(
      `The browser link is held by the "${name}" window, which runs an older version of VS Code Browser and can't ${action}. Reload that window (Developer: Reload Window), then try again.`,
      'Use a Code Instead',
    );
  }

  /** Serving window: waiting browsers are the ones connected now; drops offers from gone ones. */
  private pruneOffers(): void {
    const offers = this.readOffers();
    const live = new Set([...this.connections].flatMap((c) => (c.pending ? [c.pending.id] : [])));
    const stale = Object.keys(offers).filter((id) => !live.has(id));
    if (!stale.length) return;
    for (const id of stale) delete offers[id];
    this.writeShared(OFFERS_FILE, Object.keys(offers).length ? offers : undefined);
    this.onDidChangeEmitter.fire();
  }

  /** What the serving window last reported, unless that window is gone. */
  private sharedLink(): SharedLink | undefined {
    const link = this.readShared<SharedLink>(LINK_FILE);
    if (
      !link ||
      !Array.isArray(link.browsers) ||
      typeof link.at !== 'number' ||
      Date.now() - link.at >= LINK_STALE_MS
    ) {
      return undefined;
    }
    return {
      browsers: link.browsers.filter((b): b is string => typeof b === 'string'),
      servedBy: String(link.servedBy),
      at: link.at,
      features: typeof link.features === 'number' ? link.features : undefined,
    };
  }

  private updateStatus(): void {
    let status: { text: string; tooltip: string } | undefined;
    if (this.server) {
      this.shareLink();
      const connected = this.connected;
      status = connected.length
        ? {
            text: `$(plug) ${connected.length}`,
            tooltip: `Linked browsers: ${connected.map((c) => c.browser).join(', ')}`,
          }
        : {
            text: '$(debug-disconnect)',
            tooltip: 'No browser linked. Click to pair the Inkspect browser extension.',
          };
    } else {
      // Another window serves the link: show what it reports, while it is still around.
      const link = this.sharedLink();
      if (link) {
        const { browsers } = link;
        const through = `through the "${link.servedBy}" window`;
        status = browsers.length
          ? {
              text: `$(plug) ${browsers.length}`,
              tooltip: `Linked browsers: ${browsers.join(', ')} (${through}). Sends from the browser go to the window you pick, or the one you used last.`,
            }
          : {
              text: '$(debug-disconnect)',
              tooltip: `No browser linked (${through}). Click to pair the Inkspect browser extension.`,
            };
      } else {
        this.warnIfServedByOlderVersion();
      }
    }
    // Other windows check every second: only a change is applied and announced.
    const key = status
      ? `${status.text}
${status.tooltip}`
      : '';
    if (key === this.lastStatus) return;
    this.lastStatus = key;
    if (status) {
      this.statusItem.text = status.text;
      this.statusItem.tooltip = status.tooltip;
      this.statusItem.show();
    } else {
      this.statusItem.hide();
    }
    this.onDidChangeEmitter.fire();
  }

  private stop(): void {
    clearTimeout(this.retryTimer);
    for (const connection of this.connections) connection.socket.terminate();
    this.connections.clear();
    this.sockets?.close();
    // The other windows stop showing a link that is gone.
    if (this.server) this.writeShared(LINK_FILE, undefined);
    this.server?.close();
    this.server = undefined;
    this.sockets = undefined;
    this.updateStatus();
  }

  dispose(): void {
    clearTimeout(this.requestTimer);
    clearInterval(this.relayTimer);
    this.relay.leave();
    this.stop();
    this.links.flushSync();
    for (const d of this.disposables) d.dispose();
  }
}
