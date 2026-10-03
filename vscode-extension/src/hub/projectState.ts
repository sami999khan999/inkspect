// What a project remembers about sending, next to its captures: `.inkspect/state.json`. The hub
// and every VS Code window read and write it, so Send goes to the same agent everywhere.
// Node only (no `vscode`).
import { lstatSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ensureStore, storeDir } from './store';

export interface ProjectState {
  /** The target the project sent to last (a global id: never a window's local one). */
  lastTarget?: string;
}

const FILE = 'state.json';

/** The project's state; empty when there is none (or the store isn't a real folder). */
export function readProjectState(project: string): ProjectState {
  try {
    if (lstatSync(storeDir(project)).isSymbolicLink()) return {};
    const raw = JSON.parse(readFileSync(join(storeDir(project), FILE), 'utf8')) as unknown;
    const lastTarget = (raw as { lastTarget?: unknown } | null)?.lastTarget;
    return typeof lastTarget === 'string' && lastTarget.length <= 200 ? { lastTarget } : {};
  } catch {
    return {};
  }
}

/** Records where the project sent last (in one step: other processes read it). */
export function writeLastTarget(project: string, target: string): void {
  const dir = ensureStore(project);
  const state: ProjectState = { ...readProjectState(project), lastTarget: target };
  const temp = join(dir, `.${FILE}.${process.pid}.tmp`);
  writeFileSync(temp, `${JSON.stringify(state, null, 2)}\n`);
  renameSync(temp, join(dir, FILE));
}
