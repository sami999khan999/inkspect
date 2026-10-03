// tmux panes on the hub's configured sockets, with the session options agentmux sets
// (`@project`, `@kind`, `@harness`). Node only. Parsing is pure and unit-tested.
import { execFile } from 'node:child_process';
import { TMUX_PANE, TMUX_SOCKET } from '@inkspect/shared/targets';

export { TMUX_PANE, TMUX_SOCKET };

export interface TmuxPane {
  /** The tmux server (`tmux -L <socket>`). */
  socket: string;
  session: string;
  /** `%12`: the pane's id, stable while it exists. */
  paneId: string;
  panePid: number;
  /** What runs in the pane right now (agentmux runs agents under `sh`). */
  command: string;
  /** agentmux: the project folder of the thread. */
  project?: string;
  /** agentmux: `agent` or `terms`. */
  kind?: string;
  /** agentmux: the agent it started (`claude`, `codex`...). */
  harness?: string;
  /** When the session was last used (seconds since the epoch). */
  activity: number;
  attached: boolean;
}

export const PANE_FORMAT = [
  '#{session_name}',
  '#{pane_id}',
  '#{pane_pid}',
  '#{pane_current_command}',
  '#{@project}',
  '#{@kind}',
  '#{@harness}',
  '#{session_activity}',
  '#{session_attached}',
].join('\t');

/** Parses `list-panes -a -F PANE_FORMAT`. */
export function parsePanes(socket: string, output: string): TmuxPane[] {
  return output.split('\n').flatMap((line): TmuxPane[] => {
    const [session, paneId, pid, command, project, kind, harness, activity, attached] =
      line.split('\t');
    if (!session || !paneId || !TMUX_PANE.test(paneId) || !pid) return [];
    return [
      {
        socket,
        session,
        paneId,
        panePid: Number(pid),
        command: command ?? '',
        project: project || undefined,
        kind: kind || undefined,
        harness: harness || undefined,
        activity: Number(activity) || 0,
        attached: Number(attached) > 0,
      },
    ];
  });
}

/** Runs tmux on a socket; rejects if tmux fails (no server on that socket, no tmux). */
export function tmux(socket: string, args: string[], input?: string): Promise<string> {
  if (!TMUX_SOCKET.test(socket)) return Promise.reject(new Error(`Bad tmux socket: ${socket}`));
  return new Promise((resolve, reject) => {
    const child = execFile(
      'tmux',
      ['-L', socket, ...args],
      { timeout: 5_000, maxBuffer: 4 * 1024 * 1024 },
      (error, stdout) => (error ? reject(error) : resolve(stdout)),
    );
    if (input !== undefined) child.stdin?.end(input);
  });
}

/** Every pane on these sockets; a socket with no server has none. */
export async function listPanes(sockets: readonly string[]): Promise<TmuxPane[]> {
  const lists = await Promise.all(
    sockets.map((socket) =>
      tmux(socket, ['list-panes', '-a', '-F', PANE_FORMAT]).then(
        (output) => parsePanes(socket, output),
        () => [],
      ),
    ),
  );
  return lists.flat();
}

/** agentmux threads that run (or ran) an agent: not its terminals, not its hidden sessions. */
export function agentPanes(panes: readonly TmuxPane[]): TmuxPane[] {
  return panes.filter((p) => p.project && p.kind !== 'terms' && !p.session.startsWith('_'));
}
