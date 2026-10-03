// agentmux (a tmux-based agent manager) as Inkspect uses it: show and focus the thread a capture
// went to, and start a new thread in a project. Optional: everything here does nothing useful
// without the `agentmux` program, and window focus needs Hyprland. Node only (no `vscode`).
import { execFile } from 'node:child_process';
import { accessSync, constants } from 'node:fs';
import { homedir } from 'node:os';
import { delimiter, join } from 'node:path';
import { HARNESSES, type Harness } from '@inkspect/shared/targets';
import type { ProcessInfo } from '../agent/agentDetect';
import { descendsFrom, listProcesses } from '../agent/processes';
import { listClients, paneTargets, readKittyPairs, type PaneTarget } from './agents';
import { listPanes } from './tmux';

type Env = Record<string, string | undefined>;

/** A program on the PATH (or in ~/.local/bin, where agentmux and agent CLIs often live). */
export function findProgram(
  name: string,
  env: Env = process.env,
  home = homedir(),
): string | undefined {
  const dirs = [...(env.PATH ?? '').split(delimiter), join(home, '.local', 'bin')].filter(Boolean);
  for (const dir of dirs) {
    const path = join(dir, name);
    try {
      accessSync(path, constants.X_OK);
      return path;
    } catch {
      // Not here.
    }
  }
  return undefined;
}

/** The agents agentmux can start here: the known ones that are installed. */
export function availableHarnesses(env: Env = process.env, home = homedir()): Harness[] {
  if (!findProgram('agentmux', env, home)) return [];
  return HARNESSES.filter((harness) => findProgram(harness, env, home));
}

function run(program: string, args: string[], timeoutMs = 15_000): Promise<string> {
  return new Promise((resolve, reject) =>
    execFile(program, args, { timeout: timeoutMs }, (error, stdout) =>
      error ? reject(error) : resolve(stdout),
    ),
  );
}

function agentmux(): string {
  const bin = findProgram('agentmux');
  if (!bin)
    throw new Error('agentmux is not installed (no `agentmux` on the PATH or in ~/.local/bin).');
  return bin;
}

/**
 * Focuses a window by class on Hyprland: the newest window of that class. Hyprland 0.56+ takes a
 * Lua dispatch; older versions `focuswindow`. Nothing happens elsewhere.
 */
export async function focusWindowByClass(pattern: RegExp): Promise<boolean> {
  if (!process.env.HYPRLAND_INSTANCE_SIGNATURE || !findProgram('hyprctl')) return false;
  let clients: { address?: string; class?: string; focusHistoryID?: number }[];
  try {
    clients = JSON.parse(await run('hyprctl', ['clients', '-j'])) as typeof clients;
  } catch {
    return false;
  }
  const window = clients
    .filter((c) => c.class && pattern.test(c.class) && c.address)
    .sort((a, b) => (a.focusHistoryID ?? 0) - (b.focusHistoryID ?? 0))[0];
  if (!window?.address || !/^0x[0-9a-f]+$/.test(window.address)) return false;
  try {
    await run('hyprctl', ['dispatch', `hl.dsp.focus({ window = "address:${window.address}" })`]);
  } catch {
    await run('hyprctl', ['dispatch', 'focuswindow', `address:${window.address}`]).catch(() => '');
  }
  return true;
}

/**
 * Shows an agentmux thread and brings it to the front: the kitty beside the project's VS Code
 * window when that thread is attached there (kitty-pair), else agentmux's own window.
 */
export async function showInAgentmux(
  target: PaneTarget,
  sockets: readonly string[],
): Promise<void> {
  const processes: ProcessInfo[] = await listProcesses().catch(() => []);
  const clients = await listClients(sockets);
  for (const pair of readKittyPairs(process.env.XDG_RUNTIME_DIR)) {
    const kitty = processes.find((p) => p.commandLine.includes(`kitty-pair-${pair.address}`));
    if (!kitty) continue;
    const showsIt = clients.some(
      (c) =>
        c.socket === target.socket &&
        c.session === target.session &&
        descendsFrom(processes, c.pid, kitty.pid),
    );
    if (showsIt && (await focusWindowByClass(new RegExp(`^code-term-${pair.address}$`)))) return;
  }
  await run(agentmux(), ['show', target.session]).catch(() => '');
  await focusWindowByClass(/^agentmux$/);
}

/**
 * Starts a new agentmux thread running `harness` in a project and returns it once its agent
 * runs (agentmux opens it beside the project's VS Code window). Nothing is typed into it here.
 */
export async function newAgentmuxThread(
  project: string,
  harness: Harness,
  sockets: readonly string[],
  timeoutMs = 20_000,
): Promise<PaneTarget> {
  const bin = agentmux();
  const before = new Set((await listPanes(sockets)).map((p) => `${p.socket}:${p.session}`));
  // agentmux starts new threads in its current project.
  await run(bin, ['project', project]);
  await run(bin, ['new-thread', harness], 60_000);
  for (const deadline = Date.now() + timeoutMs; Date.now() < deadline;) {
    const [panes, processes] = await Promise.all([
      listPanes(sockets),
      listProcesses().catch(() => [] as ProcessInfo[]),
    ]);
    const started = paneTargets(panes, processes).find(
      (t) => t.project === project && !before.has(`${t.socket}:${t.session}`),
    );
    if (started) {
      // Its input turns on bracketed paste as it draws; a paste before that could submit.
      await new Promise((resolve) => setTimeout(resolve, 1_500));
      return started;
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error(`The new ${harness} thread didn't start in agentmux.`);
}
