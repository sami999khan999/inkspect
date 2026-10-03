// This VS Code window as part of the project model: its id among windows (the hub routes
// `vscode:<id>:…` targets to it) and the project it captures into and sends from.
import { randomUUID } from 'node:crypto';
import { realpathSync } from 'node:fs';
import { join } from 'node:path';
import * as vscode from 'vscode';
import type { HubTarget } from '@inkspect/shared/hub';
import { projectDetail } from '@inkspect/shared/saved';
import { parseTargetId, vscodeTarget } from '@inkspect/shared/targets';
import { getConfig } from '../config';
import { getAgentTerminals } from '../features/terminalSend';
import { localWorkspaceFolder } from '../features/screenshots';
import { hubPaths } from '../hub/paths';
import { collectProjects } from '../hub/projects';
import { readState } from '../hub/state';
import { listPanes } from '../hub/tmux';
import { contextTray, inboxPath } from './contextTray';

/** This window's id for the hub and for remembered targets (one per activation). */
export const WINDOW_ID = randomUUID().slice(0, 12);

/** The project the Saved view shows (the workspace folder, or the one picked there). */
export function currentProject(): string | undefined {
  return contextTray()?.project ?? localWorkspaceFolder();
}

/** A target as other processes know it: this window's `terminal:<n>`/`chat` get its id. */
export function globalTarget(id: string): string {
  return parseTargetId(id)?.kind === 'local' ? vscodeTarget(WINDOW_ID, id) : id;
}

/** A target as this window knows it: its own `vscode:<id>:…` targets lose the window part. */
export function localTarget(id: string): string {
  const parsed = parseTargetId(id);
  return parsed?.kind === 'vscode' && parsed.window === WINDOW_ID ? parsed.target : id;
}

/** A project's name: its folder's. */
export const nameOf = (path: string): string => path.split(/[\\/]/).filter(Boolean).pop() ?? path;

/**
 * Projects the Saved list can show and captures can move to: this window's folders, agentmux's,
 * saved and pinned ones, and the Inbox; `current` is always among them.
 */
export async function knownProjects(
  current: string,
): Promise<{ path: string; name: string; detail?: string }[]> {
  const folders = (vscode.workspace.workspaceFolders ?? []).flatMap((folder) => {
    if (folder.uri.scheme !== 'file') return [];
    try {
      return [realpathSync(folder.uri.fsPath)];
    } catch {
      return [];
    }
  });
  const panes = await listPanes(getConfig().agentTmuxSockets).catch(() => []);
  const projects = collectProjects(
    [{ id: WINDOW_ID, name: vscode.workspace.name ?? '', folders, focusedAt: Date.now() }],
    panes,
    readState(join(hubPaths().state, 'hub.json')),
    undefined,
    inboxPath(),
  ).map((p) => ({ path: p.path, name: p.name, detail: projectDetail(p) }));
  return projects.some((p) => p.path === current)
    ? projects
    : [{ path: current, name: nameOf(current) }, ...projects];
}

/** This window as other processes see it: its name, its folders and its own agents. */
export interface WindowInfo {
  name: string;
  /** Its local folders (real paths). */
  folders: string[];
  /** Its terminal agents and chat (agentmux agents are everyone's), under local ids. */
  targets: HubTarget[];
}

/** This window's name, folders and agents, within the protocols' limits. */
export function windowInfo(): WindowInfo {
  const folders = (vscode.workspace.workspaceFolders ?? []).flatMap((folder) => {
    if (folder.uri.scheme !== 'file') return [];
    try {
      return [realpathSync(folder.uri.fsPath)];
    } catch {
      return [];
    }
  });
  const targets = (getAgentTerminals()?.targets() ?? [])
    .filter((t) => t.kind !== 'tmux')
    .slice(0, 50)
    // A terminal can have a very long name.
    .map((t) => ({
      id: t.id,
      kind: t.kind,
      label: t.label.slice(0, 100),
      detail: (t.kind === 'chat' ? 'VS Code chat' : `VS Code ${t.detail}`).slice(0, 200),
    }));
  // The project its Saved list shows counts as its own too (another picked there, or the
  // Inbox without a folder): its terminal agents can get that project's captures.
  const shown = contextTray()?.project;
  if (shown && !folders.includes(shown)) folders.push(shown);
  return {
    name: (vscode.workspace.name ?? 'No folder').slice(0, 200),
    folders: folders.filter((f) => f.length <= 4096).slice(0, 50),
    targets,
  };
}
