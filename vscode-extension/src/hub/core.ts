// What browsers ask about projects and their saved captures, answered the same way whichever
// link carries the question: the hub daemon (native messaging) or a VS Code window serving the
// WebSocket link. Node only (no `vscode`).
import { readFileSync, statSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';
import {
  CONTENT_SLICE,
  type BrowserToHub,
  type ContentType,
  type HubTarget,
  type HubToBrowser,
  type HubWindow,
  type Project,
} from '@inkspect/shared/hub';
import { parseTargetId } from '@inkspect/shared/targets';
import type { ProcessInfo } from '../agent/agentDetect';
import { listProcesses } from '../agent/processes';
import {
  chooseDefault,
  listClients,
  pairedProjects,
  pairedTarget,
  paneTargets,
  readKittyPairs,
} from './agents';
import { availableHarnesses } from './agentmux';
import { listenerFolder, localPort, projectOfFolder } from './devServer';
import { inboxFolder, type HubPaths } from './paths';
import { collectProjects, siteOf, suggestProject } from './projects';
import { readProjectState } from './projectState';
import { sendItems, type SendOptions, type SendResult } from './router';
import { readState, writeState, type HubState } from './state';
import {
  emptyTrash,
  groupItems,
  itemFile,
  moveItems,
  readItem,
  readItems,
  readItemText,
  removeItems,
  restoreItems,
  TRASH_MS,
  ungroupItems,
  writeItem,
} from './store';
import { listPanes, type TmuxPane } from './tmux';

/** A browser's question about projects or captures (the messages that carry `req`). */
export type CoreRequest = Extract<BrowserToHub, { req: string }>;

/** What HubCore needs from whoever serves the browser. */
export interface CoreHost {
  /** The VS Code windows: their folders are projects, their agents targets. */
  windows(): HubWindow[];
  /** Hands a send to a VS Code window, for one of its own targets (a terminal agent, chat). */
  runInWindow(
    window: string,
    project: string,
    ids: readonly string[],
    target: string,
    prompt?: string,
  ): Promise<{ ok: boolean; sentTo?: string; error?: string }>;
  log(line: string): void;
}

export interface CoreOptions {
  paths: Pick<HubPaths, 'state' | 'data'>;
  /** Where captures go when no project fits (the hub's Inbox unless given). */
  inbox?: string;
  /** tmux servers to look for agentmux threads on (`tmux -L <socket>`). */
  tmuxSockets?: readonly string[];
  /** Where `/proc` is (tests). */
  procRoot?: string;
}

const GONE = 'That project is not open anywhere any more.';
/** The largest item Copy fetches from the hub (in slices). */
const MAX_COPY = 50 * 1024 * 1024;

/**
 * The projects (VS Code windows' folders, agentmux threads, saved and pinned ones, the Inbox),
 * their targets, and their saved captures: listing, saving, sending, moving, removing. Only
 * projects it knows are read or changed, never an arbitrary folder.
 */
export class HubCore {
  private readonly stateFile: string;
  private state: HubState;
  private cache?: { at: number; projects: Promise<Project[]> };
  /** What the projects were found from last (for suggestProject). */
  private seen: { windows: HubWindow[]; panes: TmuxPane[]; paired: string[] } = {
    windows: [],
    panes: [],
    paired: [],
  };
  /** Each project's targets as found last, with what reaching them takes (tmux panes...). */
  private readonly agentsOf = new Map<string, HubTarget[]>();

  constructor(
    private readonly options: CoreOptions,
    private readonly host: CoreHost,
  ) {
    this.stateFile = join(options.paths.state, 'hub.json');
    this.state = readState(this.stateFile);
  }

  private get tmuxSockets(): readonly string[] {
    return this.options.tmuxSockets ?? ['agents', 'default'];
  }

  /** Answers a browser's request (errors become answers too). */
  async handle(message: CoreRequest): Promise<HubToBrowser> {
    const { req } = message;
    try {
      return await this.answer(message);
    } catch (error) {
      const text = (error as Error).message;
      this.host.log(`${message.type} failed: ${text}`);
      switch (message.type) {
        case 'projects.get':
          return { type: 'projects', req, projects: [] };
        case 'capture.save':
          return { type: 'capture.saved', req, ok: false, error: text };
        case 'item.send':
          return { type: 'item.sent', req, ok: false, error: text };
        case 'items.get':
          return { type: 'items', req, ok: false, items: [], error: text };
        case 'item.thumb':
          return { type: 'thumb', req };
        case 'item.content':
          return { type: 'content', req, ok: false, error: text };
        default:
          return { type: 'done', req, ok: false, error: text };
      }
    }
  }

  private async answer(message: CoreRequest): Promise<HubToBrowser> {
    const { req } = message;
    switch (message.type) {
      case 'projects.get':
        return { type: 'projects', req, ...(await this.projectsFor(message.url)) };
      case 'capture.save':
        return { type: 'capture.saved', req, ...(await this.saveCaptures(message)) };
      case 'item.send':
        return {
          type: 'item.sent',
          req,
          ...(await this.send(message.project, message.ids, message.target, {
            open: message.open,
            prompt: message.prompt,
          })),
        };
    }
    const known = await this.knows(message.project);
    switch (message.type) {
      case 'items.get': {
        if (!known) return { type: 'items', req, ok: false, items: [], error: GONE };
        emptyTrash(message.project, TRASH_MS);
        // The newest ones: the side panel pages through no more than this.
        return { type: 'items', req, ok: true, items: readItems(message.project).slice(0, 200) };
      }
      case 'item.thumb':
        return { type: 'thumb', req, ...(known ? this.thumbOf(message.project, message.id) : {}) };
      case 'item.content': {
        if (!known) return { type: 'content', req, ok: false, error: GONE };
        return {
          type: 'content',
          req,
          ...this.contentOf(message.project, message.id, message.offset),
        };
      }
    }
    if (!known) return { type: 'done', req, ok: false, error: GONE };
    switch (message.type) {
      case 'item.remove':
        removeItems(message.project, message.ids);
        break;
      case 'item.restore':
        restoreItems(message.project, message.ids);
        break;
      case 'items.move': {
        // Into another project it knows, never an arbitrary folder.
        if (!(await this.knows(message.to))) return { type: 'done', req, ok: false, error: GONE };
        moveItems(message.project, message.to, message.ids);
        // The site's captures go there from now on.
        const moved = readItems(message.to).find((i) => message.ids.includes(i.id));
        this.remember(message.to, moved?.url);
        break;
      }
      case 'items.group':
        groupItems(message.project, message.ids);
        break;
      case 'items.ungroup':
        ungroupItems(message.project, message.group);
        break;
      case 'project.pin': {
        const pinned = this.state.pinned.filter((p) => p !== message.project);
        this.state = {
          ...this.state,
          pinned: message.pinned ? [...pinned, message.project] : pinned,
        };
        writeState(this.stateFile, this.state);
        this.projectsChanged();
        break;
      }
    }
    return { type: 'done', req, ok: true };
  }

  /**
   * The projects right now, each with the targets its sends can go to and its default one.
   * Requests come in bursts (the side panel polls): it looks again at most every 1.5 s.
   */
  projects(): Promise<Project[]> {
    if (this.cache && Date.now() - this.cache.at < 1_500) return this.cache.projects;
    const projects = this.findProjects();
    this.cache = { at: Date.now(), projects };
    projects.catch(() => (this.cache = undefined));
    return projects;
  }

  /** Forgets the projects found last (what they depend on changed). */
  projectsChanged(): void {
    this.cache = undefined;
  }

  private async knows(path: string): Promise<boolean> {
    return (await this.projects()).some((p) => p.path === path);
  }

  private async findProjects(): Promise<Project[]> {
    const windows = this.host.windows();
    const sockets = this.tmuxSockets;
    const [panes, processes] = await Promise.all([
      listPanes(sockets),
      sockets.length ? listProcesses().catch(() => [] as ProcessInfo[]) : [],
    ]);
    const projects = collectProjects(
      windows,
      panes,
      this.state,
      undefined,
      this.options.inbox ?? inboxFolder(this.options.paths),
    );
    const clients = sockets.length ? await listClients(sockets) : [];
    const agents = paneTargets(panes, processes, clients);
    const harnesses = availableHarnesses();
    const pairs = readKittyPairs(process.env.XDG_RUNTIME_DIR);
    this.seen = { windows, panes, paired: pairedProjects(pairs, processes, clients, panes) };
    for (const project of projects) {
      const own = agents.filter((t) => t.project === project.path);
      // A window's targets, under ids that route back to it.
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
      project.targets = [
        ...own.map(({ id, kind, label, detail, closed }) => ({
          id,
          kind,
          label,
          detail,
          ...(closed ? { closed } : {}),
        })),
        ...inWindows,
      ];
      project.defaultTarget = chooseDefault([...own, ...inWindows], {
        // Shared with VS Code (`.inkspect/state.json`); hub.json only for older installs.
        last: readProjectState(project.path).lastTarget ?? this.state.lastTarget[project.path],
        paired: pairedTarget(project.path, pairs, processes, clients, own)?.id,
        preferredTerminal: inWindows.find((t) => t.kind === 'terminal')?.id,
      });
      // agentmux can start new threads only in projects it has open.
      if (project.agentmux && harnesses.length) project.harnesses = harnesses;
      this.agentsOf.set(project.path, [...own, ...inWindows]);
    }
    return projects;
  }

  /** The projects, and the one a capture of `url` most likely goes to. */
  private async projectsFor(url: string | undefined) {
    const projects = await this.projects();
    const paths = projects.map((p) => p.path);
    const suggested = suggestProject(projects, this.state, {
      url,
      devServerProject: (pageUrl) => {
        const port = localPort(pageUrl);
        const folder = port ? listenerFolder(port, this.options.procRoot) : undefined;
        return folder ? projectOfFolder(folder, paths) : undefined;
      },
      ...this.seen,
    });
    return { projects, suggested };
  }

  /**
   * Sends saved items to a target (see router.ts): pasted into an agentmux pane here, or
   * handed to the VS Code window that owns the target.
   */
  async send(
    path: string,
    ids: readonly string[],
    target: string | undefined,
    options: SendOptions = {},
  ): Promise<{ ok: boolean; sentTo?: string; error?: string }> {
    // Fresh: the agent picked may have just started or stopped.
    this.projectsChanged();
    const project = (await this.projects()).find((p) => p.path === path);
    if (!project) return { ok: false, error: GONE };
    const sent = await sendItems(
      {
        targets: this.agentsOf.get(path) ?? [],
        defaultTarget: project.defaultTarget,
        sockets: this.tmuxSockets,
        harnesses: project.harnesses ?? [],
        deliver: (id, _project, items, prompt): Promise<SendResult> => {
          const parsed = parseTargetId(id);
          if (parsed?.kind !== 'vscode') {
            return Promise.resolve({ ok: false, error: 'Unknown target.' });
          }
          return this.host
            .runInWindow(
              parsed.window,
              path,
              items.map((i) => i.id),
              parsed.target,
              prompt,
            )
            .then((r) =>
              r.ok
                ? { ok: true as const, sentTo: r.sentTo ?? 'VS Code' }
                : { ok: false as const, error: r.error ?? 'Nothing was sent.' },
            );
        },
      },
      path,
      ids,
      target ?? 'default',
      options,
    );
    this.projectsChanged();
    if (sent.ok) this.host.log(`Sent ${ids.length} item(s) of ${path} to ${sent.sentTo}.`);
    return sent;
  }

  /** An item's small JPEG; else the image itself when it fits a native message. */
  private thumbOf(project: string, id: string): { data?: string; mimeType?: string } {
    const meta = readItem(project, id);
    const thumb = meta && itemFile(project, meta, 'thumb');
    const file = meta && itemFile(project, meta, 'file');
    const path =
      thumb ??
      (file && /\.(png|jpe?g)$/i.test(file) && statSync(file).size < 600_000 ? file : undefined);
    if (!path) return {};
    return {
      data: readFileSync(path).toString('base64'),
      mimeType: /\.png$/i.test(path) ? 'image/png' : 'image/jpeg',
    };
  }

  /**
   * A slice of what Copy copies: the item's picture (PNG or JPEG), else its text, else its
   * file's path or its title (as VS Code's Copy).
   */
  private contentOf(
    project: string,
    id: string,
    offset: number,
  ): Omit<Extract<HubToBrowser, { type: 'content' }>, 'type' | 'req'> {
    const meta = readItem(project, id);
    if (!meta) return { ok: false, error: 'This item is gone.' };
    const file = itemFile(project, meta, 'file');
    const image = file?.match(/\.(png|jpe?g)$/i);
    let bytes: Buffer;
    let mimeType: ContentType;
    if (file && image) {
      bytes = readFileSync(file);
      mimeType = image[1].toLowerCase() === 'png' ? 'image/png' : 'image/jpeg';
    } else {
      bytes = Buffer.from(readItemText(project, meta) ?? file ?? meta.title, 'utf8');
      mimeType = 'text/plain';
    }
    if (bytes.length > MAX_COPY) return { ok: false, error: 'Too large to copy from here.' };
    return {
      ok: true,
      mimeType,
      size: bytes.length,
      data: bytes.subarray(offset, offset + CONTENT_SLICE).toString('base64'),
    };
  }

  /** Remembers the project as this site's, and as the one captured into last. */
  private remember(project: string, url: string | undefined): void {
    const site = siteOf(url);
    this.state = {
      ...this.state,
      saved: this.state.saved.includes(project) ? this.state.saved : [...this.state.saved, project],
      sites: site ? { ...this.state.sites, [site]: project } : this.state.sites,
      lastProject: project,
    };
    writeState(this.stateFile, this.state);
    this.projectsChanged();
  }

  /** Saves the browser's captures into a project it knows, and remembers it for the site. */
  private async saveCaptures(
    message: Extract<CoreRequest, { type: 'capture.save' }>,
  ): Promise<{ ok: boolean; ids?: string[]; error?: string; sentTo?: string }> {
    const project = message.project;
    if (!(await this.knows(project)) || !isAbsolute(project)) return { ok: false, error: GONE };
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
      this.remember(project, message.url);
      this.host.log(`Saved ${ids.length} capture(s) into ${project}.`);
      // Older browser builds save and send in one request.
      if (message.send) {
        const sent = await this.send(project, ids, message.send);
        return sent.ok
          ? { ok: true, ids, sentTo: sent.sentTo }
          : { ok: false, ids, error: `Saved, but not sent: ${sent.error}` };
      }
      return { ok: true, ids };
    } catch (error) {
      this.host.log(`Saving into ${project} failed: ${(error as Error).message}`);
      return { ok: false, error: `Could not save into ${project}: ${(error as Error).message}` };
    }
  }
}
