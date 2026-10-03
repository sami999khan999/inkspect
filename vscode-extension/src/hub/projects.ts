// The projects the hub knows: folders open in VS Code windows, agentmux threads' projects,
// projects with captures, and pinned ones. Pure (the hub gathers the inputs).
import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { isLive, type HubWindow, type Project } from '@inkspect/shared/hub';
import type { HubState } from './state';
import { storeDir } from './store';
import { agentPanes, type TmuxPane } from './tmux';

/**
 * Every project, pinned first, then the ones with something running, then the rest, and the
 * Inbox (`inbox`) last.
 */
export function collectProjects(
  windows: readonly HubWindow[],
  panes: readonly TmuxPane[],
  state: HubState,
  hasStore: (path: string) => boolean = (path) => existsSync(storeDir(path)),
  inbox?: string,
): Project[] {
  const projects = new Map<string, Project>();
  const of = (path: string): Project => {
    let project = projects.get(path);
    if (!project) {
      project = {
        path,
        name: basename(path) || path,
        vscode: false,
        agentmux: false,
        saved: false,
        pinned: false,
      };
      projects.set(path, project);
    }
    return project;
  };
  for (const window of windows) for (const folder of window.folders) of(folder).vscode = true;
  for (const pane of agentPanes(panes)) of(pane.project!).agentmux = true;
  for (const path of state.saved) if (hasStore(path)) of(path).saved = true;
  for (const path of state.pinned) of(path).pinned = true;
  if (inbox) {
    const project = of(inbox);
    project.name = 'Inbox';
    project.inbox = true;
  }
  for (const project of projects.values())
    if (!project.saved) project.saved = hasStore(project.path);
  const rank = (p: Project) => (p.inbox ? 3 : p.pinned ? 0 : isLive(p) ? 1 : 2);
  return [...projects.values()].sort(
    (a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name) || a.path.localeCompare(b.path),
  );
}

/** The site part of a URL, for remembering where its captures go. */
export function siteOf(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const { origin } = new URL(url);
    return origin === 'null' ? undefined : origin;
  } catch {
    return undefined;
  }
}

/** What the hub knows when it guesses a page's project (see suggestProject). */
export interface SuggestOptions {
  /** The page's address. */
  url?: string;
  /** The project of the dev server serving a local page. */
  devServerProject?: (url: string) => string | undefined;
  /** The VS Code windows (the one focused last counts). */
  windows?: readonly HubWindow[];
  /** Projects of the agentmux threads shown in kitty windows paired with VS Code. */
  paired?: readonly string[];
  /** The tmux panes (the agentmux thread used last counts). */
  panes?: readonly TmuxPane[];
}

/**
 * The project a capture from a page most likely belongs to: where this site's captures went
 * last; the project serving it (a localhost dev server); the folder of the VS Code window
 * focused last; the agentmux thread in the kitty beside VS Code; the project captured into
 * last; the agentmux thread used last; else the Inbox (or the first live project).
 */
export function suggestProject(
  projects: readonly Project[],
  state: HubState,
  options: SuggestOptions = {},
): string | undefined {
  const known = new Set(projects.map((p) => p.path));
  const pick = (path: string | undefined) => (path && known.has(path) ? path : undefined);
  const { url } = options;
  const site = siteOf(url);
  const focused = [...(options.windows ?? [])]
    .filter((w) => w.folders.length)
    .sort((a, b) => b.focusedAt - a.focusedAt)[0];
  const active = agentPanes(options.panes ?? []).sort((a, b) => b.activity - a.activity)[0];
  return (
    pick(site ? state.sites[site] : undefined) ??
    pick(url ? options.devServerProject?.(url) : undefined) ??
    focused?.folders.map(pick).find(Boolean) ??
    options.paired?.map(pick).find(Boolean) ??
    pick(state.lastProject) ??
    pick(active?.project) ??
    projects.find((p) => p.inbox)?.path ??
    projects.find(isLive)?.path
  );
}
