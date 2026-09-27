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
 * Types an image path into a terminal's input without pressing Enter, so an agent running there
 * (Claude Code, Codex, Gemini CLI...) picks up the image and the user can add a prompt. Asks which
 * terminal when there are several. Returns false if nothing was sent.
 */
export async function sendPathToTerminal(path: string): Promise<boolean> {
  const terminals = vscode.window.terminals;
  if (!terminals.length) {
    const choice = await vscode.window.showWarningMessage(
      'No terminal is open. Start your agent in a terminal first, or copy the path.',
      'Copy Path',
    );
    if (choice) await copyText(path);
    return false;
  }
  let terminal: vscode.Terminal | undefined = terminals[0];
  if (terminals.length > 1) {
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
      { title: 'Send the screenshot to which terminal?' },
    );
    terminal = pick?.terminal;
  }
  if (!terminal) return false;
  terminal.show(false);
  terminal.sendText(`${shellPath(path)} `, false);
  return true;
}
