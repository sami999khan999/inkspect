import { realpathSync } from 'node:fs';
import * as vscode from 'vscode';
import {
  agentFromTitle,
  agentUnder,
  matchAgent,
  type AgentCli,
  type ProcessInfo,
} from '../agent/agentDetect';
import { listProcesses } from '../agent/processes';
import { bracketedPaste, typedLine } from '../agent/sendParts';
import { errorMessage } from '../browser/logger';
import {
  chooseDefault,
  listClients,
  pairedTarget,
  paneTargets,
  readKittyPairs,
  type PaneTarget,
} from '../hub/agents';
import { availableHarnesses } from '../hub/agentmux';
import { readProjectState, writeLastTarget } from '../hub/projectState';
import { agentPanes, listPanes } from '../hub/tmux';
import { currentProject, globalTarget, localTarget } from '../agent/projects';
import type { HubTarget } from '@inkspect/shared/hub';
import { agentmuxNewTarget, HARNESS_LABELS, type Harness } from '@inkspect/shared/targets';
import { getConfig } from '../config';
import type { AgentTarget } from '../shared/agentContext';

export { bracketedPaste, shellPath } from '../agent/sendParts';

/** The target id of VS Code chat (terminal agents have `terminal:<n>` ids). */
export const CHAT_TARGET = 'chat';

/**
 * The AI agents running in VS Code terminals (Claude Code, Codex, Gemini CLI...). An agent is
 * recognized by the processes under the terminal's shell, the commands started in it (shell
 * integration), its title, or because the user picked the terminal as an agent. Plain shells
 * never receive sends unless the user picked them.
 */
export class AgentTerminals implements vscode.Disposable {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  /** The agents or the preferred one changed. */
  readonly onDidChange = this.onDidChangeEmitter.event;
  private readonly ids = new WeakMap<vscode.Terminal, string>();
  private nextId = 1;
  /** Agents seen starting through shell integration, until their command ends. */
  private readonly started = new Map<vscode.Terminal, AgentCli>();
  /** Terminals the user picked as agents themselves. */
  private readonly marked = new Set<vscode.Terminal>();
  /** Agents found in each terminal's process tree at the last scan. */
  private scanned = new Map<vscode.Terminal, AgentCli>();
  private scanning?: Promise<void>;
  private scanTimer?: ReturnType<typeof setTimeout>;
  private lastScan = 0;
  /** The agent terminal used last, listed first. */
  private preferred?: vscode.Terminal;
  /** Agents in agentmux threads (tmux panes) of the current project, at the last scan. */
  private panes: PaneTarget[] = [];
  /** The pane agent in the kitty beside this window (see kitty-pair), if any. */
  private pairedPane?: string;
  /** agentmux has the current project open (it can start new threads there). */
  private agentmuxOpen = false;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(private readonly logger?: vscode.LogOutputChannel) {
    const window = vscode.window as typeof vscode.window & {
      onDidStartTerminalShellExecution?: vscode.Event<vscode.TerminalShellExecutionStartEvent>;
      onDidEndTerminalShellExecution?: vscode.Event<vscode.TerminalShellExecutionEndEvent>;
    };
    this.disposables.push(
      this.onDidChangeEmitter,
      vscode.window.onDidOpenTerminal(() => this.scanSoon()),
      vscode.window.onDidCloseTerminal((terminal) => {
        this.started.delete(terminal);
        this.marked.delete(terminal);
        this.scanned.delete(terminal);
        if (this.preferred === terminal) this.preferred = undefined;
        this.onDidChangeEmitter.fire();
      }),
      vscode.window.onDidChangeActiveTerminal((terminal) => {
        // Working in an agent's terminal makes it the one sends go to.
        if (terminal && this.agentOf(terminal)) this.setPreferred(terminal);
      }),
      vscode.window.onDidChangeTerminalState(() => this.scanSoon()),
    );
    if (window.onDidStartTerminalShellExecution && window.onDidEndTerminalShellExecution) {
      this.disposables.push(
        window.onDidStartTerminalShellExecution((event) => {
          const agent = matchAgent(event.execution.commandLine.value);
          if (!agent) return;
          this.started.set(event.terminal, agent);
          this.preferred ??= event.terminal;
          this.onDidChangeEmitter.fire();
        }),
        window.onDidEndTerminalShellExecution((event) => {
          if (!this.started.delete(event.terminal)) return;
          this.onDidChangeEmitter.fire();
        }),
      );
    }
    this.scanSoon(0);
  }

  /** A stable id for a terminal, used by the Saved view. */
  idOf(terminal: vscode.Terminal): string {
    let id = this.ids.get(terminal);
    if (!id) {
      id = `terminal:${this.nextId++}`;
      this.ids.set(terminal, id);
    }
    return id;
  }

  /** The agent running in a terminal, if one was found or the user picked it. */
  agentFor(terminal: vscode.Terminal): AgentCli | undefined {
    return this.agentOf(terminal);
  }

  private agentOf(terminal: vscode.Terminal): AgentCli | undefined {
    return (
      this.started.get(terminal) ??
      this.scanned.get(terminal) ??
      agentFromTitle(terminal.name) ??
      (this.marked.has(terminal) ? { id: 'custom', label: 'Agent' } : undefined)
    );
  }

  /** The terminals running an agent, the preferred one first. */
  agents(): { terminal: vscode.Terminal; agent: AgentCli }[] {
    const list = vscode.window.terminals.flatMap((terminal) => {
      const agent = this.agentOf(terminal);
      return agent ? [{ terminal, agent }] : [];
    });
    return list.sort(
      (a, b) => Number(b.terminal === this.preferred) - Number(a.terminal === this.preferred),
    );
  }

  /** Every place a send can go: agentmux agents, the terminal agents, then VS Code chat. */
  targets(): AgentTarget[] {
    const agents = this.agents();
    const counts = new Map<string, number>();
    for (const { agent } of agents) counts.set(agent.label, (counts.get(agent.label) ?? 0) + 1);
    return [
      ...this.panes.map(({ id, label, detail, closed }) => ({
        id,
        kind: 'tmux' as const,
        label,
        detail,
        ...(closed ? { closed } : {}),
      })),
      ...agents.map(({ terminal, agent }) => ({
        id: this.idOf(terminal),
        kind: 'terminal' as const,
        label: agent.label,
        detail: counts.get(agent.label)! > 1 ? `${terminal.name} · terminal` : 'terminal',
      })),
      { id: CHAT_TARGET, kind: 'chat', label: 'VS Code chat', detail: 'chat view' },
    ];
  }

  /** Every target with what reaching it takes (agentmux panes keep their tmux details). */
  sendTargets(): HubTarget[] {
    return [...this.panes, ...this.targets().filter((t) => t.kind !== 'tmux')];
  }

  /**
   * Where Send goes unless a target is picked: the one the project sent to last (shared with the
   * browser, see projectState.ts); else the agent in the kitty beside this window, a terminal
   * agent, the agentmux agent used most recently; else chat. `vscodeBrowser.agent.sendTarget`
   * "chat" prefers chat when nothing was used yet.
   */
  defaultTarget(fallback: 'terminal' | 'chat'): string | undefined {
    const project = currentProject();
    const remembered = project ? readProjectState(project).lastTarget : undefined;
    const last = remembered ? localTarget(remembered) : undefined;
    const targets = this.sendTargets();
    if (!targets.some((t) => t.id === last) && fallback === 'chat') return CHAT_TARGET;
    const first = this.agents()[0];
    return chooseDefault(targets, {
      last,
      paired: this.pairedPane,
      preferredTerminal: first ? this.idOf(first.terminal) : undefined,
    });
  }

  /** An agentmux agent by its target id. */
  paneById(id: string): PaneTarget | undefined {
    return this.panes.find((p) => p.id === id);
  }

  /** Agents a new agentmux thread can run in the current project (none without agentmux). */
  harnesses(): Harness[] {
    return this.agentmuxOpen ? availableHarnesses() : [];
  }

  /** Makes a target the default for sends (for the browser too: the project remembers it). */
  setDefault(target: string): void {
    const project = currentProject();
    if (!project) return;
    try {
      writeLastTarget(project, globalTarget(target));
    } catch (error) {
      this.logger?.warn(`Could not remember the default agent: ${errorMessage(error)}`);
    }
    this.onDidChangeEmitter.fire();
  }

  private setPreferred(terminal: vscode.Terminal): void {
    if (this.preferred === terminal) return;
    this.preferred = terminal;
    this.onDidChangeEmitter.fire();
  }

  terminalById(id: string): vscode.Terminal | undefined {
    return vscode.window.terminals.find((t) => this.ids.get(t) === id);
  }

  /** Looks for agents again (the processes under each terminal), at most every few seconds. */
  refresh(force = false): Promise<void> {
    if (this.scanning) return this.scanning;
    if (!force && Date.now() - this.lastScan < 2_000) return Promise.resolve();
    this.scanning = this.scan().finally(() => {
      this.scanning = undefined;
      this.lastScan = Date.now();
    });
    return this.scanning;
  }

  private scanSoon(delay = 1_500): void {
    clearTimeout(this.scanTimer);
    this.scanTimer = setTimeout(() => void this.refresh(true), delay);
  }

  private async scan(): Promise<void> {
    const terminals = vscode.window.terminals;
    const sockets = getConfig().agentTmuxSockets;
    if (!terminals.length && !sockets.length) {
      if (this.scanned.size || this.panes.length) this.onDidChangeEmitter.fire();
      this.scanned = new Map();
      this.panes = [];
      return;
    }
    let processes: ProcessInfo[];
    try {
      processes = await listProcesses();
    } catch (error) {
      this.logger?.warn(`Could not list processes to find agents: ${errorMessage(error)}`);
      return;
    }
    const next = new Map<vscode.Terminal, AgentCli>();
    for (const terminal of terminals) {
      const pid = await terminal.processId;
      const agent = pid === undefined ? undefined : agentUnder(processes, pid);
      if (agent) next.set(terminal, agent);
    }
    const panesChanged = await this.scanPanes(sockets, processes);
    const changed =
      panesChanged ||
      next.size !== this.scanned.size ||
      [...next].some(([terminal, agent]) => this.scanned.get(terminal)?.id !== agent.id);
    this.scanned = next;
    if (!this.preferred && next.size) this.preferred = next.keys().next().value;
    if (changed) this.onDidChangeEmitter.fire();
  }

  /** Agents in agentmux threads of the current project. Returns whether they changed. */
  private async scanPanes(sockets: string[], processes: ProcessInfo[]): Promise<boolean> {
    const project = currentProject();
    const folders = new Set<string>();
    if (project) {
      folders.add(project);
      try {
        folders.add(realpathSync(project));
      } catch {
        // Gone: no agents there.
      }
    }
    let panes: PaneTarget[] = [];
    let paired: string | undefined;
    let agentmuxOpen = false;
    if (sockets.length && folders.size) {
      const all = await listPanes(sockets);
      agentmuxOpen = agentPanes(all).some((p) => folders.has(p.project!));
      const clients = await listClients(sockets);
      panes = paneTargets(all, processes, clients).filter((p) => folders.has(p.project));
      const pairs = readKittyPairs(process.env.XDG_RUNTIME_DIR).filter((p) =>
        folders.has(p.folder),
      );
      if (pairs.length && panes.length) {
        for (const folder of folders) {
          paired ??= pairedTarget(folder, pairs, processes, clients, panes)?.id;
        }
      }
    }
    const before = JSON.stringify([
      this.panes.map((p) => [p.id, p.label, p.closed]),
      this.pairedPane,
      this.agentmuxOpen,
    ]);
    this.panes = panes;
    this.pairedPane = paired;
    this.agentmuxOpen = agentmuxOpen;
    return (
      JSON.stringify([panes.map((p) => [p.id, p.label, p.closed]), paired, agentmuxOpen]) !== before
    );
  }

  /**
   * Asks which terminal runs the agent (when none was found). The answer is remembered for as
   * long as the terminal is open.
   */
  async chooseTerminal(): Promise<vscode.Terminal | undefined> {
    await this.refresh(true);
    const agents = new Set(this.agents().map((a) => a.terminal));
    type Item = vscode.QuickPickItem & { terminal?: vscode.Terminal; start?: boolean };
    const items: Item[] = vscode.window.terminals.map((terminal) => ({
      label: `$(terminal) ${terminal.name}`,
      description: agents.has(terminal) ? this.agentOf(terminal)!.label : 'no agent found',
      terminal,
    }));
    items.push({ label: '$(add) Start an agent in a new terminal', start: true });
    const pick = await vscode.window.showQuickPick(items, {
      title: 'Which terminal runs your agent?',
      placeHolder: 'Sends go to this terminal while it is open',
    });
    if (!pick) return undefined;
    if (pick.start) return this.startAgent();
    this.marked.add(pick.terminal!);
    this.setPreferred(pick.terminal!);
    this.setDefault(this.idOf(pick.terminal!));
    return pick.terminal;
  }

  /** Opens a terminal running `vscodeBrowser.agent.command` (Claude Code by default). */
  startAgent(command = 'claude'): vscode.Terminal {
    const terminal = vscode.window.createTerminal({ name: matchAgent(command)?.label ?? 'Agent' });
    terminal.show(false);
    terminal.sendText(command, true);
    this.marked.add(terminal);
    this.setPreferred(terminal);
    this.scanSoon(3_000);
    return terminal;
  }

  dispose(): void {
    clearTimeout(this.scanTimer);
    for (const d of this.disposables) d.dispose();
  }
}

let agentTerminals: AgentTerminals | undefined;

/** Starts tracking agent terminals (on activation). */
export function initAgentTerminals(logger: vscode.LogOutputChannel): AgentTerminals {
  agentTerminals = new AgentTerminals(logger);
  return agentTerminals;
}

export function getAgentTerminals(): AgentTerminals {
  agentTerminals ??= new AgentTerminals();
  return agentTerminals;
}

/**
 * No agent to send to: asks the user to start one (in a VS Code terminal, or a new agentmux
 * thread where agentmux has the project open) or to pick the terminal one runs in. Returns the
 * target to send to, or undefined if dismissed.
 */
export async function askForAgent(): Promise<string | undefined> {
  const agents = getAgentTerminals();
  const harnesses = agents.harnesses();
  const choice = await vscode.window.showWarningMessage(
    'No AI agent is running for this project. Start one, or pick the terminal it runs in.',
    'Start Agent',
    'Pick Terminal...',
    ...(harnesses.length ? ['New agentmux Thread...'] : []),
  );
  if (choice === 'Start Agent') {
    const terminal = agents.startAgent(getConfig().agentCommand);
    // Give the CLI a moment to draw its input before typing into it.
    await new Promise((resolve) => setTimeout(resolve, 4_000));
    return agents.idOf(terminal);
  }
  if (choice === 'Pick Terminal...') {
    const terminal = await agents.chooseTerminal();
    return terminal && agents.idOf(terminal);
  }
  if (choice === 'New agentmux Thread...') {
    const pick = await vscode.window.showQuickPick(
      harnesses.map((harness) => ({ label: HARNESS_LABELS[harness], harness })),
      { title: 'New agentmux thread', placeHolder: 'Which agent should it run?' },
    );
    return pick && agentmuxNewTarget(pick.harness);
  }
  return undefined;
}

/** Whether an agent's input takes bracketed pastes (every known agent CLI does; plain shells may not). */
export function acceptsPaste(agent: AgentCli): boolean {
  return agent.id !== 'custom';
}

/**
 * Puts text into an agent's input without pressing Enter (so the user can add a prompt) and
 * without focusing its terminal. Agent CLIs get each part as a paste (bracketed paste, like
 * Ctrl+V): multi-line text stays one message, and an image path becomes an attached image.
 * Other terminals get the parts typed on one line.
 */
export function pasteIntoTerminal(
  terminal: vscode.Terminal,
  agent: AgentCli,
  parts: readonly string[],
): void {
  if (acceptsPaste(agent)) {
    for (const part of parts) terminal.sendText(`${bracketedPaste(part)} `, false);
  } else {
    terminal.sendText(`${typedLine(parts)} `, false);
  }
  vscode.window.setStatusBarMessage(`$(check) Sent to ${agent.label}`, 4_000);
}
