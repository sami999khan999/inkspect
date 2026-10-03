// Where a send goes, as one id grammar every part of Inkspect understands:
//   tmux:<socket>:<pane>        an agent in a tmux pane (agentmux threads)
//   vscode:<window>:<target>    an agent in a VS Code window's terminal, or its chat
//   terminal:<n> | chat         the same, inside that window (VS Code's own ids)
//   agentmux:new:<harness>      a new agentmux thread running that agent
//   default                     the project's default target
// Pure, so both products and the hub can share it.

/** tmux socket names: plain names only (they become an argument). */
export const TMUX_SOCKET = /^[\w.-]{1,64}$/;
/** tmux pane ids. */
export const TMUX_PANE = /^%\d{1,9}$/;

/** Agent CLIs agentmux can start a thread with. */
export const HARNESSES = ['claude', 'codex', 'opencode', 'agy'] as const;
export type Harness = (typeof HARNESSES)[number];

/** A VS Code window's own target: a terminal agent, or chat. */
const LOCAL = /^(terminal:\d{1,9}|chat)$/;
const WINDOW = /^[\w.-]{1,64}$/;

export type ParsedTarget =
  | { kind: 'tmux'; socket: string; pane: string }
  | { kind: 'vscode'; window: string; target: string }
  | { kind: 'local'; target: string }
  | { kind: 'agentmux-new'; harness: Harness }
  | { kind: 'default' };

/** A target id's parts, or undefined for anything that isn't one. */
export function parseTargetId(id: string): ParsedTarget | undefined {
  if (id === 'default') return { kind: 'default' };
  if (LOCAL.test(id)) return { kind: 'local', target: id };
  const tmux = /^tmux:([^:]+):(%\d+)$/.exec(id);
  if (tmux && TMUX_SOCKET.test(tmux[1]!) && TMUX_PANE.test(tmux[2]!)) {
    return { kind: 'tmux', socket: tmux[1]!, pane: tmux[2]! };
  }
  const vscode = /^vscode:([^:]+):(.+)$/.exec(id);
  if (vscode && WINDOW.test(vscode[1]!) && LOCAL.test(vscode[2]!)) {
    return { kind: 'vscode', window: vscode[1]!, target: vscode[2]! };
  }
  const agentmux = /^agentmux:new:(\w+)$/.exec(id);
  if (agentmux && (HARNESSES as readonly string[]).includes(agentmux[1]!)) {
    return { kind: 'agentmux-new', harness: agentmux[1] as Harness };
  }
  return undefined;
}

export const tmuxTarget = (socket: string, pane: string) => `tmux:${socket}:${pane}`;
export const vscodeTarget = (window: string, target: string) => `vscode:${window}:${target}`;
export const agentmuxNewTarget = (harness: Harness) => `agentmux:new:${harness}`;

/** Agent names for a harness, as the send modal shows them. */
export const HARNESS_LABELS: Record<Harness, string> = {
  claude: 'Claude Code',
  codex: 'Codex',
  opencode: 'opencode',
  agy: 'Antigravity',
};
