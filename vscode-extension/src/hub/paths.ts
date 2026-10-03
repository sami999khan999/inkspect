// Where the hub keeps its files. Node only (no `vscode`): the hub runs outside VS Code.
import { chmodSync, lstatSync, mkdirSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

export interface HubPaths {
  /** Private runtime folder (0700): the socket, the token and the lock. */
  runtime: string;
  socket: string;
  token: string;
  lock: string;
  log: string;
  /** Persistent state (known projects, pins, last targets). */
  state: string;
  /** The installed hub script and its launcher. */
  data: string;
}

type Env = Record<string, string | undefined>;

const uid = () => process.getuid?.() ?? 0;

/**
 * The hub's folders, from the XDG base directories. `INKSPECT_HUB_DIR` moves the runtime folder
 * (tests run their own hub).
 */
export function hubPaths(env: Env = process.env, home = homedir()): HubPaths {
  const runtime =
    env.INKSPECT_HUB_DIR ??
    (env.XDG_RUNTIME_DIR
      ? join(env.XDG_RUNTIME_DIR, 'inkspect')
      : join(tmpdir(), `inkspect-${uid()}`));
  const state = join(env.XDG_STATE_HOME || join(home, '.local', 'state'), 'inkspect');
  const data = join(env.XDG_DATA_HOME || join(home, '.local', 'share'), 'inkspect');
  return {
    runtime,
    socket: join(runtime, 'hub.sock'),
    token: join(runtime, 'hub.token'),
    lock: join(runtime, 'hub.lock'),
    log: join(runtime, 'hub.log'),
    state,
    data,
  };
}

/**
 * Creates the runtime folder, private to this user. Refuses a folder that is a symbolic link or
 * belongs to someone else (another user could otherwise read the token or plant a socket).
 */
export function ensurePrivateDir(dir: string): void {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const stat = lstatSync(dir);
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error(`${dir} is not a folder`);
  if (process.getuid && stat.uid !== process.getuid()) {
    throw new Error(`${dir} belongs to another user`);
  }
  if ((stat.mode & 0o077) !== 0) chmodSync(dir, 0o700);
}

/**
 * The Inbox: the store for captures that belong to no project (yet), shared by the hub and VS
 * Code windows without a folder.
 */
export function inboxFolder(paths: Pick<HubPaths, 'data'> = hubPaths()): string {
  return join(paths.data, 'inbox');
}
