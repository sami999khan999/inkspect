// What the hub remembers between runs: projects that have captures, pinned projects, which
// project each site's captures went to, and the target each project sent to last. Node only.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export interface HubState {
  v: 1;
  /** Projects that have (had) a `.inkspect/` store. */
  saved: string[];
  pinned: string[];
  /** Site origin to the project its captures went to last. */
  sites: Record<string, string>;
  /** The project captured into last. */
  lastProject?: string;
  /** Project to the target it sent to last. */
  lastTarget: Record<string, string>;
}

const empty = (): HubState => ({ v: 1, saved: [], pinned: [], sites: {}, lastTarget: {} });

const strings = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string').slice(0, 1000) : [];
const stringRecord = (v: unknown): Record<string, string> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)
    ? Object.fromEntries(
        Object.entries(v)
          .filter((e): e is [string, string] => typeof e[1] === 'string')
          .slice(0, 1000),
      )
    : {};

/** Reads the state file; anything missing or malformed starts empty. */
export function readState(file: string): HubState {
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>;
    return {
      v: 1,
      saved: strings(raw.saved),
      pinned: strings(raw.pinned),
      sites: stringRecord(raw.sites),
      lastProject: typeof raw.lastProject === 'string' ? raw.lastProject : undefined,
      lastTarget: stringRecord(raw.lastTarget),
    };
  } catch {
    return empty();
  }
}

/** Writes the state file (private to this user), in one step. */
export function writeState(file: string, state: HubState): void {
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${process.pid}.tmp`;
  writeFileSync(temp, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
  renameSync(temp, file);
}
