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
import { bracketedPaste, shellPath, typedLine } from '../agent/sendParts';
import { errorMessage } from '../browser/logger';
import {
  chooseDefault,
  listClients,
  pairedTarget,
  paneTargets,
  readKittyPairs,
  type PaneTarget,
} from '../hub/agents';
import { listPanes } from '../hub/tmux';
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
  /** The agent terminal used last, preferred for sends. */
  private preferred?: vscode.Terminal;
  private preferChat = false;
  /** Agents in agentmux threads (tmux panes) of this workspace's folders, at the last scan. */
  private panes: PaneTarget[] = [];
  /** The pane agent in the kitty beside this window (see kitty-pair), if any. */
  private pairedPane?: string;
  /** A pane agent picked as the default (or used last). */
  private chosenPane?: string;
  /** The preferred terminal was picked or used by the user (not only the first one found). */
  private chosenTerminal = false;
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
        if (this.preferred === terminal) {
          this.preferred = undefined;
          this.chosenTerminal = false;
        }
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

  /** A stable id for a terminal, used by the Agent Context view. */
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
      ...this.panes.map(({ id, label, detail }) => ({ id, kind: 'tmux' as const, label, detail })),
      ...agents.map(({ terminal, agent }) => ({
        id: this.idOf(terminal),
        kind: 'terminal' as const,
        label: agent.label,
        detail: counts.get(agent.label)! > 1 ? `${terminal.name} · terminal` : 'terminal',
      })),
      { id: CHAT_TARGET, kind: 'chat', label: 'VS Code chat', detail: 'chat view' },
    ];
  }

  /**
   * Where sends go unless one is chosen: the agent picked or used last; else the one in the kitty
   * beside this window, the terminal agent used last, the agentmux agent used most recently; else
   * chat if it was chosen.
   */
  defaultTarget(fallback: 'terminal' | 'chat'): string | undefined {
    if (this.preferChat || (fallback === 'chat' && !this.preferred && !this.panes.length)) {
      return CHAT_TARGET;
    }
    const first = this.agents()[0];
    const terminal = first ? this.idOf(first.terminal) : undefined;
    // Only a real choice beats the agent beside this window (kitty-pair).
    const explicit = this.chosenPane ?? (this.chosenTerminal ? terminal : undefined);
    return chooseDefault([...this.panes, ...this.targets().filter((t) => t.kind === 'terminal')], {
      last: explicit,
      paired: this.pairedPane,
      preferredTerminal: terminal,
    });
  }

  /** An agentmux agent by its target id. */
  paneById(id: string): PaneTarget | undefined {
    return this.panes.find((p) => p.id === id);
  }

  /** Makes a target the default for sends. */
  setDefault(target: string): void {
    if (target === CHAT_TARGET) {
      this.preferChat = true;
      this.onDidChangeEmitter.fire();
      return;
    }
    if (this.paneById(target)) {
      this.preferChat = false;
      if (this.chosenPane === target) return;
      this.chosenPane = target;
      this.chosenTerminal = false;
      this.onDidChangeEmitter.fire();
      return;
    }
    const terminal = this.terminalById(target);
    if (terminal) this.setPreferred(terminal);
  }

  private setPreferred(terminal: vscode.Terminal): void {
    this.preferChat = false;
    this.chosenPane = undefined;
    this.chosenTerminal = true;
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

  /** Agents in agentmux threads of this workspace's folders. Returns whether they changed. */
  private async scanPanes(sockets: string[], processes: ProcessInfo[]): Promise<boolean> {
    const folders = new Set(
      (vscode.workspace.workspaceFolders ?? []).flatMap((folder) => {
        if (folder.uri.scheme !== 'file') return [];
        try {
          return [realpathSync(folder.uri.fsPath)];
        } catch {
          return [folder.uri.fsPath];
        }
      }),
    );
    let panes: PaneTarget[] = [];
    let paired: string | undefined;
    if (sockets.length && folders.size) {
      panes = paneTargets(await listPanes(sockets), processes).filter((p) =>
        folders.has(p.project),
      );
      const pairs = readKittyPairs(process.env.XDG_RUNTIME_DIR).filter((p) =>
        folders.has(p.folder),
      );
      if (pairs.length && panes.length) {
        const clients = await listClients(sockets);
        for (const folder of folders) {
          paired ??= pairedTarget(folder, pairs, processes, clients, panes)?.id;
        }
      }
    }
    const before = JSON.stringify([this.panes.map((p) => [p.id, p.label]), this.pairedPane]);
    this.panes = panes;
    this.pairedPane = paired;
    if (this.chosenPane && !this.paneById(this.chosenPane)) this.chosenPane = undefined;
    return JSON.stringify([panes.map((p) => [p.id, p.label]), paired]) !== before;
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
    this.onDidChangeEmitter.fire();
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
 * The agent terminal a send goes to: `targetId`, else the default agent. With no agent running,
 * asks which terminal runs one (or offers to start one). Undefined if the user dismissed it.
 */
export async function resolveAgentTerminal(
  targetId?: string,
): Promise<{ terminal: vscode.Terminal; agent: AgentCli } | undefined> {
  const agents = getAgentTerminals();
  await agents.refresh();
  let terminal = targetId ? agents.terminalById(targetId) : undefined;
  terminal ??= agents.agents()[0]?.terminal;
  if (!terminal) {
    const choice = await vscode.window.showWarningMessage(
      'No AI agent is running in a terminal. Start one (Claude Code, Codex, Gemini CLI...), or pick the terminal it runs in.',
      'Start Agent',
      'Pick Terminal...',
    );
    if (choice === 'Start Agent') {
      terminal = agents.startAgent(getConfig().agentCommand);
      // Give the CLI a moment to draw its input before typing into it.
      await new Promise((resolve) => setTimeout(resolve, 4_000));
    } else if (choice === 'Pick Terminal...') {
      terminal = await agents.chooseTerminal();
    }
    if (!terminal) return undefined;
  }
  return { terminal, agent: agents.agentFor(terminal) ?? { id: 'custom', label: terminal.name } };
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

/** Types text into the agent's terminal (see resolveAgentTerminal). Returns the agent's name. */
export async function sendTextToTerminal(
  text: string,
  targetId?: string,
): Promise<string | undefined> {
  const found = await resolveAgentTerminal(targetId);
  if (!found) return undefined;
  pasteIntoTerminal(found.terminal, found.agent, [text]);
  return found.agent.label;
}

/** Types a file path (an image, a context file) into the agent's terminal. */
export async function sendPathToTerminal(path: string): Promise<boolean> {
  return (await sendTextToTerminal(shellPath(path))) !== undefined;
}
