// The projects the hub knows: folders open in VS Code windows, agentmux threads' projects,
// projects with captures, and pinned ones. Pure (the hub gathers the inputs).
import { existsSync } from 'node:fs';
import { basename } from 'node:path';
import { isLive, type HubWindow, type Project } from '@inkspect/shared/hub';
import type { HubState } from './state';
import { storeDir } from './store';
import { agentPanes, type TmuxPane } from './tmux';

/** Every project, pinned first, then the ones with something running, then the rest. */
export function collectProjects(
  windows: readonly HubWindow[],
  panes: readonly TmuxPane[],
  state: HubState,
  hasStore: (path: string) => boolean = (path) => existsSync(storeDir(path)),
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
  for (const project of projects.values())
    if (!project.saved) project.saved = hasStore(project.path);
  const rank = (p: Project) => (p.pinned ? 0 : isLive(p) ? 1 : 2);
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

/**
 * The project a capture from `url` most likely belongs to: where this site's captures went last,
 * else the project serving it (a localhost dev server), else the project captured into last,
 * else the first one with something running.
 */
export function suggestProject(
  url: string | undefined,
  projects: readonly Project[],
  state: HubState,
  devServerProject: (url: string) => string | undefined,
): string | undefined {
  const known = new Set(projects.map((p) => p.path));
  const site = siteOf(url);
  const remembered = site ? state.sites[site] : undefined;
  if (remembered && known.has(remembered)) return remembered;
  const served = url ? devServerProject(url) : undefined;
  if (served && known.has(served)) return served;
  if (state.lastProject && known.has(state.lastProject)) return state.lastProject;
  return projects.find(isLive)?.path;
}
