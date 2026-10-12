// The hub daemon: one per user, on a Unix socket in a private folder. Browsers reach it through
// the native messaging shim, VS Code windows directly. It forwards the browser link to one VS
// Code window (the leader) and exits when nobody has used it for a while.
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import {
  appendFileSync,
  closeSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
  writeSync,
} from 'node:fs';
import { createConnection, createServer, type Server, type Socket } from 'node:net';
import { parseClientMessage, type ClientInfo } from '@inkspect/shared/bridge';
import {
  encodeHub,
  HUB_FEATURES,
  MAX_FRAME,
  MAX_TO_BROWSER,
  parseBrowserToHub,
  parseHubAuth,
  parseVsCodeToHub,
  type HubBrowser,
  type HubRole,
  type HubToBrowser,
  type HubToVsCode,
  type HubWindow,
} from '@inkspect/shared/hub';
import { HubCore } from './core';
import { frame, FrameDecoder } from './framing';
import { ensurePrivateDir, type HubPaths } from './paths';

export interface DaemonOptions {
  /** Exit after this long without connections. */
  idleMs: number;
  /** Identifies this hub's code, so a newer VS Code extension can replace it. */
  build: string;
  /** tmux servers to look for agentmux threads on (`tmux -L <socket>`). */
  tmuxSockets?: string[];
  /** Where `/proc` is (tests). */
  procRoot?: string;
  /** Ends the process once stopped (tests run the daemon in their own process). */
  exit?: () => void;
  /** Stop on SIGTERM, SIGINT and SIGHUP (the real daemon). */
  handleSignals?: boolean;
}

interface Connection {
  id: string;
  socket: Socket;
  role?: HubRole;
  /** When it authenticated: the oldest window leads. */
  since: number;
  origin?: string;
  client?: ClientInfo;
  window?: HubWindow;
}

/** Whether a process with this pid exists (EPERM: it does, as another user). */
function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'EPERM';
  }
}

/** Whether something answers on the socket. */
export function socketAnswers(path: string, timeoutMs = 1_000): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = createConnection(path);
    const done = (answer: boolean) => {
      clearTimeout(timer);
      socket.destroy();
      resolve(answer);
    };
    const timer = setTimeout(() => done(false), timeoutMs);
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
  });
}

export class HubDaemon {
  private server?: Server;
  private readonly connections = new Set<Connection>();
  private token = '';
  private idleTimer?: NodeJS.Timeout;
  private leader?: Connection;
  private stopped = false;
  /** Projects and their captures: what browsers ask about. */
  private readonly core: HubCore;
  /** Sends handed to VS Code windows, waiting for their answer. */
  private readonly runs = new Map<
    string,
    {
      window: Connection;
      resolve: (reply: { ok: boolean; sentTo?: string; error?: string }) => void;
    }
  >();

  constructor(
    private readonly paths: HubPaths,
    private readonly options: DaemonOptions,
  ) {
    this.core = new HubCore(
      { paths, tmuxSockets: options.tmuxSockets, procRoot: options.procRoot },
      {
        windows: () => this.ofRole('vscode').flatMap((c) => (c.window ? [c.window] : [])),
        runInWindow: (window, project, ids, target, prompt) =>
          this.runInWindow(window, project, ids, target, prompt),
        log: (line) => this.log(line),
      },
    );
  }

  /** Starts serving; false if another hub already runs. */
  async start(): Promise<boolean> {
    ensurePrivateDir(this.paths.runtime);
    if (!(await this.takeLock())) return false;
    try {
      // Starts over once the log grows past 1 MB.
      if (statSync(this.paths.log).size > 1024 * 1024) rmSync(this.paths.log, { force: true });
    } catch {
      // No log yet.
    }
    try {
      this.token = randomBytes(32).toString('base64url');
      rmSync(this.paths.token, { force: true });
      writeFileSync(this.paths.token, this.token, { mode: 0o600, flag: 'wx' });
      rmSync(this.paths.socket, { force: true });
      const server = createServer((socket) => this.onConnection(socket));
      await new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(this.paths.socket, () => {
          server.off('error', reject);
          resolve();
        });
      });
      this.server = server;
    } catch (error) {
      // A lock left behind would keep every later hub from starting.
      this.log(`Could not start: ${(error as Error).message}`);
      rmSync(this.paths.token, { force: true });
      rmSync(this.paths.lock, { force: true });
      throw error;
    }
    this.log(`Hub ${this.options.build} listening (pid ${process.pid}).`);
    this.armIdle();
    if (this.options.handleSignals) {
      for (const signal of ['SIGTERM', 'SIGINT', 'SIGHUP'] as const) {
        process.on(signal, () => this.stop(`signal ${signal}`));
      }
    }
    return true;
  }

  /**
   * One hub per user: the lock file holds the running hub's pid. A lock whose process is gone,
   * or whose socket doesn't answer (the pid was reused), is stale.
   */
  private async takeLock(): Promise<boolean> {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const fd = openSync(this.paths.lock, 'wx', 0o600);
        writeSync(fd, String(process.pid));
        closeSync(fd);
        return true;
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      }
      const pid = Number(readFileSync(this.paths.lock, 'utf8').trim());
      const fresh = Date.now() - statSync(this.paths.lock).mtimeMs < 5_000;
      // Being written by another hub that is starting right now: not stale.
      if (!pid && fresh) return false;
      if (pid && alive(pid) && (fresh || (await socketAnswers(this.paths.socket)))) return false;
      rmSync(this.paths.lock, { force: true });
    }
    return false;
  }

  private onConnection(socket: Socket): void {
    const connection: Connection = { id: randomUUID().slice(0, 8), socket, since: 0 };
    this.connections.add(connection);
    clearTimeout(this.idleTimer);
    const decoder = new FrameDecoder(
      MAX_FRAME,
      (text) => this.onFrame(connection, text),
      (error) => {
        this.log(`Dropping a connection: ${error.message}`);
        socket.destroy();
      },
    );
    socket.on('data', (chunk) => decoder.push(chunk));
    socket.on('error', () => socket.destroy());
    socket.on('close', () => this.onClose(connection));
  }

  private onFrame(connection: Connection, text: string): void {
    let value: unknown;
    try {
      value = JSON.parse(text);
    } catch {
      return;
    }
    if (!connection.role) {
      const auth = parseHubAuth(value);
      if (!auth || !this.tokenMatches(auth.token)) {
        this.log('Refused a connection with a wrong token.');
        connection.socket.destroy();
        return;
      }
      connection.role = auth.role;
      connection.since = Date.now();
      connection.origin = auth.origin;
      if (auth.role === 'browser') {
        this.log(`Browser connected (${auth.origin ?? 'unknown origin'}).`);
        this.sendToBrowser(connection, this.statusMessage());
      } else {
        this.log('VS Code window connected.');
        this.sendToVsCode(connection, {
          type: 'welcome',
          build: this.options.build,
          leader: false,
        });
      }
      return;
    }
    if (connection.role === 'browser') this.onBrowserMessage(connection, value);
    else this.onVsCodeMessage(connection, value);
  }

  private tokenMatches(token: string): boolean {
    const a = Buffer.from(token);
    const b = Buffer.from(this.token);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  private onBrowserMessage(connection: Connection, value: unknown): void {
    const message = parseBrowserToHub(value);
    if (!message) return;
    if (message.type === 'ping') {
      this.sendToBrowser(connection, { type: 'pong' });
      return;
    }
    if ('req' in message) {
      void this.core.handle(message).then((reply) => this.sendToBrowser(connection, reply));
      return;
    }
    // The link: checked here too, so the leader only gets what the bridge protocol allows.
    const link = parseClientMessage(message.data);
    if (!link) return;
    if (link.type === 'hello' || link.type === 'pair') {
      connection.client = link.client;
      this.sendBrowsers();
    }
    if (!this.leader) {
      this.sendToBrowser(connection, { type: 'status', vscode: false });
      return;
    }
    this.sendToVsCode(this.leader, { type: 'link', browser: connection.id, data: message.data });
  }

  /** Asks a VS Code window to send items to one of its own targets (a terminal agent, chat). */
  private runInWindow(
    windowId: string,
    project: string,
    ids: readonly string[],
    target: string,
    prompt?: string,
  ): Promise<{ ok: boolean; sentTo?: string; error?: string }> {
    const window = this.ofRole('vscode').find((c) => c.window?.id === windowId);
    if (!window) return Promise.resolve({ ok: false, error: 'That VS Code window is closed.' });
    const req = randomUUID();
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        this.runs.delete(req);
        resolve({ ok: false, error: 'VS Code did not answer.' });
      }, 120_000);
      this.runs.set(req, {
        window,
        resolve: (reply) => {
          clearTimeout(timer);
          resolve(reply);
        },
      });
      this.sendToVsCode(window, {
        type: 'run.send',
        req,
        project,
        ids: [...ids],
        target,
        ...(prompt ? { prompt } : {}),
      });
    });
  }

  private onVsCodeMessage(connection: Connection, value: unknown): void {
    const message = parseVsCodeToHub(value);
    if (!message) return;
    switch (message.type) {
      case 'ping':
        this.sendToVsCode(connection, { type: 'pong' });
        return;
      case 'window': {
        const first = !connection.window;
        const { id, name, folders, focusedAt, targets } = message;
        connection.window = { id, name, folders, focusedAt, targets };
        this.core.projectsChanged();
        if (first) this.sendToVsCode(connection, { type: 'browsers', browsers: this.browsers() });
        this.electLeader();
        return;
      }
      case 'link': {
        const browser = [...this.connections].find(
          (c) => c.role === 'browser' && c.id === message.browser,
        );
        if (browser) this.sendToBrowser(browser, { type: 'link', data: message.data });
        return;
      }
      case 'shutdown':
        this.stop('a newer hub replaces it');
        return;
      case 'run.sent': {
        const waiting = this.runs.get(message.req);
        this.runs.delete(message.req);
        waiting?.resolve({ ok: message.ok, sentTo: message.sentTo, error: message.error });
        return;
      }
    }
  }

  private onClose(connection: Connection): void {
    this.connections.delete(connection);
    if (connection.role === 'browser') {
      this.log(`Browser disconnected (${connection.client?.browser ?? connection.origin ?? '?'}).`);
      if (this.leader) this.sendToVsCode(this.leader, { type: 'gone', browser: connection.id });
      this.sendBrowsers();
    } else if (connection.role === 'vscode') {
      this.log(`VS Code window disconnected (${connection.window?.name ?? '?'}).`);
      this.core.projectsChanged();
      // Its sends won't be answered.
      for (const [req, run] of this.runs) {
        if (run.window !== connection) continue;
        this.runs.delete(req);
        run.resolve({ ok: false, error: 'That VS Code window closed.' });
      }
      if (this.leader === connection) this.leader = undefined;
      this.electLeader();
    }
    if (!this.connections.size) this.armIdle();
  }

  /** The window connected longest answers for the link; browsers say hello again when it changes. */
  private electLeader(): void {
    const windows = [...this.connections]
      .filter((c) => c.role === 'vscode' && c.window)
      .sort((a, b) => a.since - b.since);
    const next = windows[0];
    if (next !== this.leader) {
      const previous = this.leader;
      this.leader = next;
      if (previous && this.connections.has(previous)) {
        this.sendToVsCode(previous, { type: 'leader', leader: false });
      }
      if (next) {
        this.log(`Leader: ${next.window?.name}.`);
        this.sendToVsCode(next, { type: 'leader', leader: true });
      }
      for (const browser of this.ofRole('browser')) this.sendToBrowser(browser, { type: 'relink' });
    }
    for (const browser of this.ofRole('browser')) {
      this.sendToBrowser(browser, this.statusMessage());
    }
  }

  private statusMessage(): HubToBrowser {
    const features = [...HUB_FEATURES];
    return this.leader
      ? {
          type: 'status',
          vscode: true,
          peer: `VS Code (${this.leader.window?.name ?? '?'})`,
          features,
        }
      : { type: 'status', vscode: false, features };
  }

  private browsers(): HubBrowser[] {
    return this.ofRole('browser').flatMap((c) =>
      c.client ? [{ id: c.id, name: c.client.browser, origin: c.origin ?? '' }] : [],
    );
  }

  private sendBrowsers(): void {
    const message: HubToVsCode = { type: 'browsers', browsers: this.browsers() };
    for (const window of this.ofRole('vscode')) this.sendToVsCode(window, message);
  }

  private ofRole(role: HubRole): Connection[] {
    return [...this.connections].filter((c) => c.role === role);
  }

  private sendToBrowser(connection: Connection, message: HubToBrowser): void {
    const text = encodeHub(message);
    // Browsers drop larger native messages (and the port with them).
    if (Buffer.byteLength(text) > MAX_TO_BROWSER) {
      this.log(`Dropped a ${message.type} message too large for the browser.`);
      return;
    }
    this.write(connection, text);
  }

  private sendToVsCode(connection: Connection, message: HubToVsCode): void {
    this.write(connection, encodeHub(message));
  }

  private write(connection: Connection, text: string): void {
    if (!connection.socket.destroyed) connection.socket.write(frame(text));
  }

  private armIdle(): void {
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (!this.connections.size) this.stop('idle');
    }, this.options.idleMs);
  }

  /** Closes everything and removes the hub's files, then exits. */
  stop(reason: string): void {
    if (this.stopped) return;
    this.stopped = true;
    this.log(`Stopping: ${reason}.`);
    clearTimeout(this.idleTimer);
    for (const connection of this.connections) connection.socket.destroy();
    this.server?.close();
    try {
      // Only our own files: a newer hub may have started already.
      if (readFileSync(this.paths.lock, 'utf8').trim() === String(process.pid)) {
        rmSync(this.paths.socket, { force: true });
        rmSync(this.paths.token, { force: true });
        rmSync(this.paths.lock, { force: true });
      }
    } catch {
      // Already gone.
    }
    const exit = this.options.exit ?? (() => process.exit(0));
    setTimeout(exit, 50).unref();
  }

  private log(line: string): void {
    try {
      appendFileSync(this.paths.log, `${new Date().toISOString()} ${line}\n`, { mode: 0o600 });
    } catch {
      // Logging must never stop the hub.
    }
  }
}
