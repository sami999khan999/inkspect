import * as vscode from 'vscode';
import { copyText } from './clipboard';

/** Terminal names that suggest an AI agent CLI; these are offered first. */
const AGENT_NAMES = /\b(claude|codex|gemini|aider|copilot|cursor|agent|opencode|amp|goose|qwen)\b/i;

/** A path as a shell argument: quoted when it has spaces or quotes. */
export function shellPath(path: string): string {
  return /[\s'"&()]/.test(path) ? `"${path.replace(/"/g, '\\"')}"` : path;
}

/** Agent-looking terminals first, then the active one, then the rest in their order. */
export function orderTerminals<T extends { name: string }>(
  terminals: readonly T[],
  active?: T,
): T[] {
  const score = (t: T) => (AGENT_NAMES.test(t.name) ? 0 : t === active ? 1 : 2);
  return [...terminals].sort((a, b) => score(a) - score(b));
}

/**
 * Which terminal gets sends without asking: the one chosen last (while it is open), else the
 * only agent-looking terminal, else the only terminal. Undefined means "ask".
 */
export function autoTerminal<T extends { name: string }>(
  terminals: readonly T[],
  remembered?: T,
): T | undefined {
  if (remembered && terminals.includes(remembered)) return remembered;
  const agents = terminals.filter((t) => AGENT_NAMES.test(t.name));
  if (agents.length === 1) return agents[0];
  return terminals.length === 1 ? terminals[0] : undefined;
}

let chosen: vscode.Terminal | undefined;

/**
 * The terminal to send to. Asks (and remembers the answer) when it isn't clear; `ask` forces the
 * question (the "Choose Agent Terminal" command). Undefined when there is none or it was dismissed.
 */
export async function pickTerminal(ask = false): Promise<vscode.Terminal | undefined> {
  const terminals = vscode.window.terminals;
  if (!terminals.length) return undefined;
  const automatic = ask ? undefined : autoTerminal(terminals, chosen);
  if (automatic) return automatic;
  const ordered = orderTerminals(terminals, vscode.window.activeTerminal);
  const pick = await vscode.window.showQuickPick(
    ordered.map((t) => ({
      label: t.name,
      description: AGENT_NAMES.test(t.name)
        ? 'agent'
        : t === vscode.window.activeTerminal
          ? 'active'
          : '',
      terminal: t,
    })),
    { title: 'Send to the agent in which terminal?', placeHolder: 'Your choice is remembered' },
  );
  if (pick) chosen = pick.terminal;
  return pick?.terminal;
}

/**
 * Types text into the agent's terminal input without pressing Enter, so the user can add a
 * prompt. The text must be a single line (newlines would submit it). Returns false if nothing
 * was sent.
 */
export async function sendTextToTerminal(text: string): Promise<boolean> {
  const terminal = await pickTerminal();
  if (!terminal) {
    if (!vscode.window.terminals.length) {
      const choice = await vscode.window.showWarningMessage(
        'No terminal is open. Start your agent (Claude Code, Codex, Gemini CLI...) in a terminal first, or copy the text.',
        'Copy',
      );
      if (choice) await copyText(text);
    }
    return false;
  }
  terminal.show(false);
  terminal.sendText(`${text.replace(/[\r\n]+/g, ' ')} `, false);
  return true;
}

/** Types a file path (an image, a context file) into the agent's terminal. */
export function sendPathToTerminal(path: string): Promise<boolean> {
  return sendTextToTerminal(shellPath(path));
}
