import * as vscode from 'vscode';
import { getConfig } from '../config';
import { copyText } from '../features/clipboard';
import { saveContext } from '../features/context';
import { sendTextToTerminal, shellPath } from '../features/terminalSend';

let lastPick: string | undefined;
let storage = '';

/** Remembers the element details the user last picked, for the `browser_get_selection` tool. */
export function rememberPick(markdown: string): void {
  lastPick = markdown;
}

export function lastPickedElement(): string | undefined {
  return lastPick;
}

/** Where context files go when no workspace folder is open (set on activation). */
export function initAgentSend(globalStorage: string): void {
  storage = globalStorage;
}

/** Text typed straight into a terminal must be short and on one line; longer text goes in a file. */
export function fitsTerminal(text: string): boolean {
  return !/[\r\n]/.test(text.trim()) && text.length <= 300;
}

/**
 * Sends something to the agent: by default the agent CLI in a terminal (the path of each file,
 * and the text, or the path of a file holding it when it is long), without pressing Enter; or
 * VS Code chat (`vscodeBrowser.agent.sendTarget`). Returns false if nothing was sent.
 */
export async function sendToAgent(
  text: string,
  options: { files?: string[]; label?: string; target?: 'terminal' | 'chat' } = {},
): Promise<boolean> {
  const files = options.files ?? [];
  const target = options.target ?? getConfig().agentSendTarget;
  if (target === 'chat') {
    await sendToChat(
      text,
      files.map((f) => vscode.Uri.file(f)),
    );
    return true;
  }
  const parts = files.map(shellPath);
  const trimmed = text.trim();
  if (trimmed) {
    parts.push(
      fitsTerminal(trimmed)
        ? trimmed
        : shellPath(await saveContext(text, options.label ?? 'context', storage)),
    );
  }
  if (!parts.length) return false;
  return sendTextToTerminal(parts.join(' '));
}

/**
 * Opens the chat view with `query` in the input (not sent, so the user can add a question) and
 * `files` attached. Falls back to the clipboard when no chat is available.
 */
export async function sendToChat(query: string, files: vscode.Uri[] = []): Promise<void> {
  try {
    await vscode.commands.executeCommand('workbench.action.chat.open', {
      query: query.endsWith('\n') ? query : `${query}\n`,
      isPartialQuery: true,
      ...(files.length ? { attachFiles: files } : {}),
    });
  } catch {
    await copyText(query);
    void vscode.window.showInformationMessage(
      'No chat is available, so the text was copied to the clipboard instead.',
    );
  }
}
