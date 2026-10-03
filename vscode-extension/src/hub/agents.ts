// Agents in agentmux threads (tmux panes) as send targets, and which target a project's sends go
// to by default. Node only (no `vscode`): the hub and the VS Code extension both use it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { HubTarget } from '@inkspect/shared/hub';
import { agentUnder, type ProcessInfo } from '../agent/agentDetect';
import { descendsFrom } from '../agent/processes';
import { tmuxTarget } from '@inkspect/shared/targets';
import { agentPanes, tmux, type TmuxPane } from './tmux';

/** An agent running in a tmux pane. */
export interface PaneTarget extends HubTarget {
  kind: 'tmux';
  project: string;
  socket: string;
  paneId: string;
  session: string;
  /** When its session was last used (seconds since the epoch). */
  activity: number;
}

/**
 * The agents running in agentmux threads. agentmux starts an agent as `sh -c '<agent>; exec
 * $SHELL'`: an agent is recognized under the pane's process, else by the thread's `@harness`
 * while `sh` still runs it. A thread back at its shell is no target (never type into a shell).
 */
export function paneTargets(
  panes: readonly TmuxPane[],
  processes: readonly ProcessInfo[],
): PaneTarget[] {
  return agentPanes(panes).flatMap((pane): PaneTarget[] => {
    const agent = agentUnder(processes, pane.panePid);
    // `sh -c '<agent>; exec $SHELL'` still running its agent has a child; a shell alone doesn't.
    const running =
      pane.command === 'sh' && processes.some((p) => p.ppid === pane.panePid && p.pid !== p.ppid);
    const label = agent?.label ?? (pane.harness && running ? pane.harness : '');
    if (!label) return [];
    return [
      {
        id: tmuxTarget(pane.socket, pane.paneId),
        kind: 'tmux',
        label,
        detail: `agentmux · ${pane.session}`,
        project: pane.project!,
        socket: pane.socket,
        paneId: pane.paneId,
        session: pane.session,
        activity: pane.activity,
      },
    ];
  });
}

/** A kitty window paired with a VS Code window (see kitty-pair): its id and project folder. */
export interface KittyPair {
  address: string;
  folder: string;
}

/** The kitty windows paired with VS Code windows, from `$XDG_RUNTIME_DIR/kitty-pair-*.folder`. */
export function readKittyPairs(runtimeDir: string | undefined): KittyPair[] {
  if (!runtimeDir) return [];
  let names: string[];
  try {
    names = readdirSync(runtimeDir);
  } catch {
    return [];
  }
  return names.flatMap((name) => {
    const match = /^kitty-pair-(0x[0-9a-f]+)\.folder$/.exec(name);
    if (!match) return [];
    try {
      return [{ address: match[1]!, folder: readFileSync(join(runtimeDir, name), 'utf8').trim() }];
    } catch {
      return [];
    }
  });
}

/** A tmux client (an attached terminal) and the session it shows. */
export interface TmuxClient {
  socket: string;
  pid: number;
  session: string;
}

/** The tmux clients on these sockets. */
export async function listClients(sockets: readonly string[]): Promise<TmuxClient[]> {
  const lists = await Promise.all(
    sockets.map((socket) =>
      tmux(socket, ['list-clients', '-F', '#{client_pid}\t#{client_session}']).then(
        (output) =>
          output.split('\n').flatMap((line) => {
            const [pid, session] = line.split('\t');
            return pid && session ? [{ socket, pid: Number(pid), session }] : [];
          }),
        () => [],
      ),
    ),
  );
  return lists.flat();
}

/**
 * The agent beside the project's VS Code window: the kitty paired with that window shows a tmux
 * session (its tmux client runs under the kitty), and an agent runs in it.
 */
export function pairedTarget(
  project: string,
  pairs: readonly KittyPair[],
  processes: readonly ProcessInfo[],
  clients: readonly TmuxClient[],
  targets: readonly PaneTarget[],
): PaneTarget | undefined {
  for (const pair of pairs) {
    if (pair.folder !== project) continue;
    const kitty = processes.find((p) => p.commandLine.includes(`kitty-pair-${pair.address}`));
    if (!kitty) continue;
    for (const client of clients) {
      if (!descendsFrom(processes, client.pid, kitty.pid)) continue;
      const target = targets.find(
        (t) => t.socket === client.socket && t.session === client.session,
      );
      if (target) return target;
    }
  }
  return undefined;
}

/**
 * The projects of the agentmux threads that kitty windows paired with VS Code show (see
 * pairedTarget), the thread used last first.
 */
export function pairedProjects(
  pairs: readonly KittyPair[],
  processes: readonly ProcessInfo[],
  clients: readonly TmuxClient[],
  panes: readonly TmuxPane[],
): string[] {
  const shown = pairs.flatMap((pair) => {
    const kitty = processes.find((p) => p.commandLine.includes(`kitty-pair-${pair.address}`));
    if (!kitty) return [];
    return clients
      .filter((client) => descendsFrom(processes, client.pid, kitty.pid))
      .flatMap((client) =>
        agentPanes(panes).filter((p) => p.socket === client.socket && p.session === client.session),
      );
  });
  shown.sort((a, b) => b.activity - a.activity);
  return [...new Set(shown.map((p) => p.project!))];
}

/**
 * Where a project's Send goes: the target it used last (if it still runs), else the agent beside
 * its VS Code window, else an agent in its VS Code terminals, else its agentmux agent used most
 * recently, else VS Code chat.
 */
export function chooseDefault(
  targets: readonly HubTarget[],
  options: { last?: string; paired?: string; preferredTerminal?: string } = {},
): string | undefined {
  const has = (id: string | undefined) => !!id && targets.some((t) => t.id === id);
  if (has(options.last)) return options.last;
  if (has(options.paired)) return options.paired;
  if (has(options.preferredTerminal)) return options.preferredTerminal;
  const panes = targets
    .filter((t): t is PaneTarget => t.kind === 'tmux')
    .sort((a, b) => b.activity - a.activity);
  if (panes[0]) return panes[0].id;
  return (targets.find((t) => t.kind === 'terminal') ?? targets.find((t) => t.kind === 'chat'))?.id;
}
