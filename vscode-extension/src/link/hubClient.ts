import type { Socket } from 'node:net';
import * as vscode from 'vscode';
import { encode, parseClientMessage, type ServerMessage } from '@inkspect/shared/bridge';
import {
  encodeHub,
  MAX_FRAME,
  parseHubToVsCode,
  type HubBrowser,
  type HubAuth,
  type HubToVsCode,
  type VsCodeToHub,
} from '@inkspect/shared/hub';
import { deliverLocal, savedItems } from '../agent/chat';
import { contextTray } from '../agent/contextTray';
import { WINDOW_ID, windowInfo } from '../agent/projects';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import { frame, FrameDecoder } from '../hub/framing';
import { fileHash, installHub, uninstallHub, type InstallResult } from '../hub/install';
import { hubPaths } from '../hub/paths';
import { connectToHub } from '../hub/shim';
import { getAgentTerminals } from '../features/terminalSend';
import { isLinkedMessage, type LinkPeer, type LinkService } from './linkService';

/** What the hub client tells the WebSocket link's bookkeeping. */
export interface LinkWindows {
  /** Browsers linked through the hub, for the status bar and side panel. */
  setHubBrowsers(names: string[]): void;
}

/** Whether this platform gets the hub (only Linux is supported for now). */
export function hubSupported(): boolean {
  return process.platform === 'linux';
}

/**
 * This window's connection to the local Inkspect hub, which browsers reach through native
 * messaging (no pairing). The hub picks one window to answer for the browser link (the leader);
 * that window serves the hub's browsers with the same link service as WebSocket browsers.
 */
export class HubClient implements vscode.Disposable {
  private socket?: Socket;
  private readonly windowId = WINDOW_ID;
  private leader = false;
  /** Browsers served while this window leads, by the hub's connection id. */
  private readonly peers = new Map<string, LinkPeer>();
  private browsers: HubBrowser[] = [];
  private retry?: NodeJS.Timeout;
  private delay = 1_000;
  private stopped = false;
  /** A connection is being made: a second one must not start meanwhile. */
  private connecting = false;
  private replacedOld = false;
  private installed?: InstallResult;
  private focusedAt = Date.now();
  /** The window message sent last (a new connection sends it again). */
  private lastWindow = '';
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly service: LinkService,
    private readonly windows: LinkWindows,
    private readonly logger: vscode.LogOutputChannel,
  ) {
    this.disposables.push(
      vscode.window.onDidChangeWindowState((state) => {
        if (!state.focused) return;
        this.focusedAt = Date.now();
        this.sendWindow();
      }),
      vscode.workspace.onDidChangeWorkspaceFolders(() => this.sendWindow()),
    );
    // The agents in this window's terminals are targets the browser can send to; the project
    // its Saved list shows is its project too.
    const agents = getAgentTerminals();
    if (agents) this.disposables.push(agents.onDidChange(() => this.sendWindow()));
    const tray = contextTray();
    if (tray) this.disposables.push(tray.onDidChange(() => this.sendWindow()));
  }

  /** Registers the hub with the browsers and connects, if the setting allows it. */
  async sync(): Promise<void> {
    if (!hubSupported() || !getConfig().hubEnabled) {
      this.disconnect();
      return;
    }
    this.stopped = false;
    try {
      this.installed = this.install();
    } catch (error) {
      this.logger.error(`Inkspect hub: could not register it: ${errorMessage(error)}`);
      return;
    }
    if (!this.socket) await this.connect();
  }

  /** Writes the hub, its launcher and the browsers' host manifests. */
  install(): InstallResult {
    const result = installHub({
      source: this.context.asAbsolutePath('dist/hub.js'),
      execPath: process.execPath,
      dataDir: hubPaths().data,
    });
    if (result.updated) this.logger.info(`Inkspect hub: installed ${result.hubScript}`);
    return result;
  }

  /** Registers the hub again and reports which browsers can start it (a command). */
  async register(): Promise<void> {
    if (!hubSupported()) {
      void vscode.window.showWarningMessage(
        'The browser helper is only available on Linux for now.',
      );
      return;
    }
    const result = this.install();
    this.installed = result;
    const names = [...new Set(result.registered.map((r) => r.browser))];
    void vscode.window.showInformationMessage(
      names.length
        ? `Browser helper registered for ${names.join(', ')}. Restart the browser if it was open.`
        : 'No supported browser was found (Chrome, Chromium, Brave, Vivaldi, Edge, Opera or Firefox).',
    );
    if (!this.socket) await this.connect();
  }

  /** Removes the hub's registration from every browser (a command). */
  unregister(): void {
    const removed = uninstallHub({ dataDir: hubPaths().data });
    this.disconnect();
    void vscode.window.showInformationMessage(
      removed.length
        ? `Browser helper removed from ${[...new Set(removed)].join(', ')}.`
        : 'The browser helper was not registered.',
    );
  }

  /** What the integration tests check. */
  debugState(): object {
    return {
      connected: !!this.socket,
      leader: this.leader,
      browsers: this.browsers,
      peers: [...this.peers.keys()],
      hubScript: this.installed?.hubScript,
      launcher: this.installed?.launcher,
      registered: this.installed?.registered,
    };
  }

  private async connect(): Promise<void> {
    clearTimeout(this.retry);
    this.retry = undefined;
    const script = this.installed?.hubScript;
    if (!script || this.stopped || this.connecting || this.socket) return;
    this.connecting = true;
    const hub = await connectToHub(hubPaths(), script).finally(() => (this.connecting = false));
    if (!hub) {
      this.logger.warn('Inkspect hub: could not reach or start the hub.');
      this.scheduleRetry();
      return;
    }
    if (this.stopped) {
      hub.socket.destroy();
      return;
    }
    const socket = hub.socket;
    this.socket = socket;
    const decoder = new FrameDecoder(
      MAX_FRAME,
      (text) => this.onFrame(text),
      (error) => {
        this.logger.warn(`Inkspect hub: ${error.message}`);
        socket.destroy();
      },
    );
    socket.on('data', (chunk) => decoder.push(chunk));
    socket.on('error', () => socket.destroy());
    socket.on('close', () => {
      if (this.socket !== socket) return;
      this.socket = undefined;
      this.dropPeers();
      this.leader = false;
      this.setBrowsers([]);
      this.scheduleRetry();
    });
    this.post({ type: 'auth', token: hub.token, role: 'vscode' });
    this.lastWindow = '';
    this.sendWindow();
  }

  private scheduleRetry(): void {
    if (this.stopped || this.retry) return;
    this.retry = setTimeout(() => {
      this.retry = undefined;
      void this.connect();
    }, this.delay);
    this.delay = Math.min(this.delay * 2, 30_000);
  }

  private post(message: VsCodeToHub | HubAuth): void {
    if (this.socket && !this.socket.destroyed) this.socket.write(frame(encodeHub(message)));
  }

  /** Tells the hub this window's name, folders, agents and focus (when they change). */
  private sendWindow(): void {
    const message = {
      type: 'window' as const,
      id: this.windowId,
      focusedAt: this.focusedAt,
      ...windowInfo(),
    };
    const json = JSON.stringify(message);
    if (json === this.lastWindow) return;
    this.lastWindow = json;
    this.post(message);
  }

  private onFrame(text: string): void {
    const message = parseHubToVsCode(text);
    if (!message) return;
    void this.onMessage(message).catch((error: unknown) =>
      this.logger.error(`Inkspect hub: ${errorMessage(error)}`),
    );
  }

  private async onMessage(message: HubToVsCode): Promise<void> {
    switch (message.type) {
      case 'welcome': {
        this.delay = 1_000;
        // A hub from an older version of this extension still runs: replace it, once.
        const installed = this.installed && fileHash(this.installed.hubScript);
        if (installed && installed !== message.build && !this.replacedOld) {
          this.replacedOld = true;
          this.logger.info('Inkspect hub: replacing an older hub.');
          this.post({ type: 'shutdown' });
          return;
        }
        this.logger.info('Inkspect hub: connected.');
        return;
      }
      case 'leader':
        this.leader = message.leader;
        if (!message.leader) this.dropPeers();
        return;
      case 'browsers':
        this.setBrowsers(message.browsers);
        return;
      case 'gone': {
        const peer = this.peers.get(message.browser);
        if (peer) this.service.remove(peer);
        this.peers.delete(message.browser);
        return;
      }
      case 'link':
        if (this.leader) await this.onLink(message.browser, message.data);
        return;
      case 'pong':
        return;
      case 'run.send': {
        // The hub sends items of a project to one of this window's agents (or its chat); it
        // records where they went.
        const items = savedItems(message.project, message.ids);
        try {
          const sent = items.length
            ? await deliverLocal(message.target, message.project, items)
            : ({ ok: false, error: 'Those captures are gone.' } as const);
          this.post(
            sent.ok
              ? { type: 'run.sent', req: message.req, ok: true, sentTo: sent.sentTo }
              : { type: 'run.sent', req: message.req, ok: false, error: sent.error },
          );
          contextTray()?.load();
        } catch (error) {
          this.post({ type: 'run.sent', req: message.req, ok: false, error: errorMessage(error) });
        }
        return;
      }
    }
  }

  /**
   * A browser's link message. Browsers on the hub are trusted (only the Inkspect extension can
   * start the hub), so their hello links them without pairing.
   */
  private async onLink(browser: string, data: string): Promise<void> {
    const message = parseClientMessage(data);
    if (!message) return;
    const send = (reply: ServerMessage) =>
      this.post({ type: 'link', browser, data: encode(reply) });
    if (message.type === 'ping') {
      send({ type: 'pong' });
      return;
    }
    if (message.type === 'hello' || message.type === 'pair') {
      const previous = this.peers.get(browser);
      if (previous) this.service.remove(previous);
      const peer: LinkPeer = { client: message.client, send };
      this.peers.set(browser, peer);
      this.service.add(peer);
      this.service.welcome(peer, `VS Code (${vscode.workspace.name ?? 'no folder'})`);
      return;
    }
    const peer = this.peers.get(browser);
    if (!peer) {
      send({ type: 'error', code: 'unauthorized', message: 'Say hello first.' });
      return;
    }
    // Questions about projects go to the hub itself, not through the link.
    if (isLinkedMessage(message)) await this.service.handle(peer, message);
  }

  private setBrowsers(browsers: HubBrowser[]): void {
    this.browsers = browsers;
    this.windows.setHubBrowsers(browsers.map((b) => b.name));
  }

  private dropPeers(): void {
    for (const peer of this.peers.values()) this.service.remove(peer);
    this.peers.clear();
  }

  private disconnect(): void {
    this.stopped = true;
    clearTimeout(this.retry);
    this.retry = undefined;
    const socket = this.socket;
    this.socket = undefined;
    socket?.destroy();
    this.dropPeers();
    this.leader = false;
    this.setBrowsers([]);
  }

  dispose(): void {
    this.disconnect();
    for (const d of this.disposables) d.dispose();
  }
}
