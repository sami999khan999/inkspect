// The hub daemon: one per user, on a Unix socket in a private folder. Browsers reach it through
// the native messaging shim, VS Code windows directly. It forwards the browser link to one VS
// Code window (the leader) and exits when nobody has used it for a while.
import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';
import {
  appendFileSync,
  closeSync,
  openSync,
  readFileSync,
  statSync as statFile,
  rmSync,
  statSync,
  writeFileSync,
  writeSync,
} from 'node:fs';
import { createConnection, createServer, type Server, type Socket } from 'node:net';
import { isAbsolute, join } from 'node:path';
import { parseClientMessage, type ClientInfo } from '@inkspect/shared/bridge';
import {
  encodeHub,
  MAX_FRAME,
  MAX_TO_BROWSER,
  parseBrowserToHub,
  parseHubAuth,
  parseVsCodeToHub,
  type HubBrowser,
  type HubRole,
  type HubToBrowser,
  type HubToVsCode,
  type HubTarget,
  type HubWindow,
  type ItemMeta,
  type Project,
} from '@inkspect/shared/hub';
import type { ProcessInfo } from '../agent/agentDetect';
import { listProcesses } from '../agent/processes';
import {
  chooseDefault,
  listClients,
  pairedTarget,
  paneTargets,
  parseTargetId,
  readKittyPairs,
} from './agents';
import { listenerFolder, localPort, projectOfFolder } from './devServer';
import { frame, FrameDecoder } from './framing';
import { ensurePrivateDir, type HubPaths } from './paths';
import { collectProjects, siteOf, suggestProject } from './projects';
import { readState, writeState, type HubState } from './state';
import { partsOf, pasteIntoPane } from './send';
import {
  emptyTrash,
  itemFile,
  readItem,
  readItems,
  removeItems,
  TRASH_MS,
  updateItem,
  writeItem,
} from './store';
import { listPanes } from './tmux';

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
  private readonly stateFile: string;
  private state: HubState;
  private projectsCache?: { at: number; projects: Promise<Project[]> };
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
    this.stateFile = join(paths.state, 'hub.json');
    this.state = readState(this.stateFile);
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
    if (message.type === 'projects.get') {
      this.projectsFor(message.url).then(
        ({ projects, suggested }) =>
          this.sendToBrowser(connection, {
            type: 'projects',
            req: message.req,
            projects,
            suggested,
          }),
        (error: unknown) => {
          this.log(`Listing projects failed: ${(error as Error).message}`);
          this.sendToBrowser(connection, { type: 'projects', req: message.req, projects: [] });
        },
      );
      return;
    }
    if (message.type === 'capture.save') {
      this.saveCaptures(message)
        .catch((error: unknown) => ({ ok: false, error: (error as Error).message }))
        .then((reply) =>
          this.sendToBrowser(connection, { type: 'capture.saved', req: message.req, ...reply }),
        );
      return;
    }
    if (message.type === 'item.send') {
      this.sendItems(message.project, message.ids, message.target)
        .catch((error: unknown) => ({ ok: false, error: (error as Error).message }))
        .then((reply) =>
          this.sendToBrowser(connection, { type: 'item.sent', req: message.req, ...reply }),
        );
      return;
    }
    if (
      message.type === 'items.get' ||
      message.type === 'item.thumb' ||
      message.type === 'item.remove' ||
      message.type === 'project.pin'
    ) {
      this.onPanelRequest(connection, message).catch((error: unknown) => {
        const text = (error as Error).message;
        this.log(`${message.type} failed: ${text}`);
        const { req } = message;
        if (message.type === 'items.get') {
          this.sendToBrowser(connection, { type: 'items', req, ok: false, items: [], error: text });
        } else if (message.type === 'item.thumb') {
          this.sendToBrowser(connection, { type: 'thumb', req });
        } else this.sendToBrowser(connection, { type: 'done', req, ok: false, error: text });
      });
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

  private get tmuxSockets(): string[] {
    return this.options.tmuxSockets ?? ['agents', 'default'];
  }

  /**
   * The projects right now (VS Code windows, agentmux threads, saved and pinned ones), each with
   * the targets its sends can go to and its default one.
   */
  private projects(): Promise<Project[]> {
    // Requests come in bursts (the side panel polls): look again at most every 1.5 s.
    if (this.projectsCache && Date.now() - this.projectsCache.at < 1_500) {
      return this.projectsCache.projects;
    }
    const projects = this.findProjects();
    this.projectsCache = { at: Date.now(), projects };
    projects.catch(() => (this.projectsCache = undefined));
    return projects;
  }

  /** Forgets the projects found last (what they depend on changed). */
  private projectsChanged(): void {
    this.projectsCache = undefined;
  }

  private async findProjects(): Promise<Project[]> {
    const windows = this.ofRole('vscode').flatMap((c) => (c.window ? [c.window] : []));
    const [panes, processes] = await Promise.all([
      listPanes(this.tmuxSockets),
      this.tmuxSockets.length ? listProcesses().catch(() => [] as ProcessInfo[]) : [],
    ]);
    const projects = collectProjects(windows, panes, this.state);
    const agents = paneTargets(panes, processes);
    const pairs = readKittyPairs(process.env.XDG_RUNTIME_DIR);
    const clients = pairs.length ? await listClients(this.tmuxSockets) : [];
    for (const project of projects) {
      const own = agents.filter((t) => t.project === project.path);
      // A window's targets, under ids the hub can route back to it.
      const inWindows = windows
        .filter((w) => w.folders.includes(project.path))
        .sort((a, b) => b.focusedAt - a.focusedAt)
        .flatMap((w) =>
          (w.targets ?? []).map((t): HubTarget => ({
            ...t,
            id: `vscode:${w.id}:${t.id}`,
            detail: `${t.detail} · ${w.name}`.slice(0, 300),
          })),
        );
      const targets: HubTarget[] = [
        ...own.map(({ id, kind, label, detail }) => ({ id, kind, label, detail })),
        ...inWindows,
      ];
      project.targets = targets;
      project.defaultTarget = chooseDefault([...own, ...inWindows], {
        last: this.state.lastTarget[project.path],
        paired: pairedTarget(project.path, pairs, processes, clients, own)?.id,
        preferredTerminal: inWindows.find((t) => t.kind === 'terminal')?.id,
      });
    }
    return projects;
  }

  /**
   * Sends saved items to a target: pasted into an agentmux pane by the hub, or handed to the VS
   * Code window that owns the target. Records where they went.
   */
  private async sendItems(
    path: string,
    ids: readonly string[],
    target: string | undefined,
  ): Promise<{ ok: boolean; sentTo?: string; error?: string }> {
    const project = (await this.projects()).find((p) => p.path === path);
    if (!project) return { ok: false, error: 'That project is not open anywhere any more.' };
    const id = !target || target === 'default' ? project.defaultTarget : target;
    const chosen = project.targets?.find((t) => t.id === id);
    if (!id || !chosen) {
      return {
        ok: false,
        error: `No agent is running for ${project.name}. Start one in agentmux or a VS Code terminal.`,
      };
    }
    const items = ids.flatMap((itemId) => readItem(path, itemId) ?? []);
    if (!items.length) return { ok: false, error: 'Those captures are gone.' };
    const parsed = parseTargetId(id);
    let reply: { ok: boolean; sentTo?: string; error?: string };
    if (parsed?.kind === 'tmux') {
      try {
        await pasteIntoPane(parsed.socket, parsed.pane, partsOf(path, items));
        reply = { ok: true, sentTo: chosen.label };
      } catch (error) {
        reply = {
          ok: false,
          error: `Could not paste into ${chosen.detail}: ${(error as Error).message}`,
        };
      }
      // Pasted: a failure to note it doesn't make the send fail.
      if (reply.ok) {
        try {
          this.markSent(path, items, chosen.label);
        } catch (error) {
          this.log(`Could not mark items as sent: ${(error as Error).message}`);
        }
      }
    } else if (parsed?.kind === 'vscode') {
      reply = await this.runInWindow(parsed.window, path, ids, parsed.target);
    } else {
      reply = { ok: false, error: 'Unknown target.' };
    }
    if (reply.ok) {
      this.state = { ...this.state, lastTarget: { ...this.state.lastTarget, [path]: id } };
      writeState(this.stateFile, this.state);
      this.projectsChanged();
      this.log(`Sent ${items.length} item(s) of ${path} to ${chosen.label} (${chosen.detail}).`);
    }
    return reply;
  }

  /**
   * The side panel's requests: a project's items and their thumbnails, removing items, pinning
   * a project. Only projects the hub knows are read or changed.
   */
  private async onPanelRequest(
    connection: Connection,
    message: Extract<
      ReturnType<typeof parseBrowserToHub>,
      { type: 'items.get' | 'item.thumb' | 'item.remove' | 'project.pin' }
    >,
  ): Promise<void> {
    const known = (await this.projects()).some((p) => p.path === message.project);
    const { req } = message;
    if (!known) {
      const error = 'That project is not open anywhere any more.';
      if (message.type === 'items.get') {
        this.sendToBrowser(connection, { type: 'items', req, ok: false, items: [], error });
      } else if (message.type === 'item.thumb')
        this.sendToBrowser(connection, { type: 'thumb', req });
      else this.sendToBrowser(connection, { type: 'done', req, ok: false, error });
      return;
    }
    switch (message.type) {
      case 'items.get': {
        emptyTrash(message.project, TRASH_MS);
        // The newest ones: the side panel pages through no more than this.
        const items = readItems(message.project).slice(0, 200);
        this.sendToBrowser(connection, { type: 'items', req, ok: true, items });
        return;
      }
      case 'item.thumb': {
        const meta = readItem(message.project, message.id);
        const thumb = meta && itemFile(message.project, meta, 'thumb');
        const file = meta && itemFile(message.project, meta, 'file');
        // The small JPEG; else the image itself when it fits a native message.
        const path =
          thumb ??
          (file && /\.(png|jpe?g)$/i.test(file) && statFile(file).size < 600_000
            ? file
            : undefined);
        if (!path) {
          this.sendToBrowser(connection, { type: 'thumb', req });
          return;
        }
        this.sendToBrowser(connection, {
          type: 'thumb',
          req,
          data: readFileSync(path).toString('base64'),
          mimeType: /\.png$/i.test(path) ? 'image/png' : 'image/jpeg',
        });
        return;
      }
      case 'item.remove':
        removeItems(message.project, message.ids);
        this.sendToBrowser(connection, { type: 'done', req, ok: true });
        return;
      case 'project.pin': {
        const pinned = this.state.pinned.filter((p) => p !== message.project);
        this.state = {
          ...this.state,
          pinned: message.pinned ? [...pinned, message.project] : pinned,
        };
        writeState(this.stateFile, this.state);
        this.projectsChanged();
        this.sendToBrowser(connection, { type: 'done', req, ok: true });
        return;
      }
    }
  }

  private markSent(path: string, items: readonly ItemMeta[], label: string): void {
    for (const item of items) {
      updateItem(path, item.id, (meta) => ({
        ...meta,
        sentTo: meta.sentTo.includes(label) ? meta.sentTo : [...meta.sentTo, label],
      }));
    }
  }

  /** Asks a VS Code window to send items to one of its own targets (a terminal agent, chat). */
  private runInWindow(
    windowId: string,
    project: string,
    ids: readonly string[],
    target: string,
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
      this.sendToVsCode(window, { type: 'run.send', req, project, ids: [...ids], target });
    });
  }

  /** The projects, and the one a capture of `url` most likely goes to. */
  private async projectsFor(url: string | undefined) {
    const projects = await this.projects();
    const paths = projects.map((p) => p.path);
    const suggested = suggestProject(url, projects, this.state, (pageUrl) => {
      const port = localPort(pageUrl);
      const folder = port ? listenerFolder(port, this.options.procRoot) : undefined;
      return folder ? projectOfFolder(folder, paths) : undefined;
    });
    return { projects, suggested };
  }

  /**
   * Saves the browser's captures into a project the hub knows (never an arbitrary folder), and
   * remembers it as this site's project.
   */
  private async saveCaptures(
    message: Extract<ReturnType<typeof parseBrowserToHub>, { type: 'capture.save' }>,
  ): Promise<{ ok: boolean; ids?: string[]; error?: string; sentTo?: string }> {
    const project = message.project;
    const known = (await this.projects()).some((p) => p.path === project);
    if (!known || !isAbsolute(project)) {
      return { ok: false, error: 'That project is not open anywhere any more.' };
    }
    try {
      const ids = message.captures.map(
        (capture) =>
          writeItem(project, {
            kind: capture.kind,
            title: capture.title,
            detail: capture.detail,
            url: message.url,
            group: capture.group,
            groupIndex: capture.groupIndex,
            source: 'browser',
            browser: message.browser,
            text: capture.text,
            media: capture.image
              ? { bytes: Buffer.from(capture.image, 'base64'), extension: 'png' }
              : undefined,
            thumb: capture.thumb ? Buffer.from(capture.thumb, 'base64') : undefined,
          }).id,
      );
      const site = siteOf(message.url);
      this.state = {
        ...this.state,
        saved: this.state.saved.includes(project)
          ? this.state.saved
          : [...this.state.saved, project],
        sites: site ? { ...this.state.sites, [site]: project } : this.state.sites,
        lastProject: project,
      };
      writeState(this.stateFile, this.state);
      this.projectsChanged();
      this.log(`Saved ${ids.length} capture(s) into ${project}.`);
      if (message.send) {
        const sent = await this.sendItems(project, ids, message.send);
        return sent.ok
          ? { ok: true, ids, sentTo: sent.sentTo }
          : { ok: false, ids, error: `Saved, but not sent: ${sent.error}` };
      }
      return { ok: true, ids };
    } catch (error) {
      this.log(`Saving into ${project} failed: ${(error as Error).message}`);
      return { ok: false, error: `Could not save into ${project}: ${(error as Error).message}` };
    }
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
        this.projectsChanged();
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
      this.projectsChanged();
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
    return this.leader
      ? { type: 'status', vscode: true, peer: `VS Code (${this.leader.window?.name ?? '?'})` }
      : { type: 'status', vscode: false };
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
