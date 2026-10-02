import * as vscode from 'vscode';
import { getConfig } from '../config';
import { copyText } from '../features/clipboard';
import { saveContext } from '../features/context';
import { displayPath } from '../features/screenshots';
import {
  CHAT_TARGET,
  acceptsPaste,
  getAgentTerminals,
  pasteIntoTerminal,
  resolveAgentTerminal,
} from '../features/terminalSend';
import { addContext, contextTray, type ContextInput, type ContextItem } from './contextTray';
import { pasteIntoPane } from '../hub/send';
import { fitsInline, shellPath } from './sendParts';

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

/**
 * Sends something to the agent, without pressing Enter: to an agent CLI in a terminal (each
 * file's path and the text, each pasted separately), or to VS Code chat. `target` is a target id from the Agent Context view (`terminal:<n>` or `chat`), or
 * `terminal`/`chat`; by default, the agent used last (see `vscodeBrowser.agent.sendTarget`).
 * Returns the name of the agent it went to, or undefined if nothing was sent.
 */
export async function sendToAgent(
  text: string,
  options: { files?: string[]; label?: string; target?: string } = {},
): Promise<string | undefined> {
  const files = options.files ?? [];
  const agents = getAgentTerminals();
  let target = options.target;
  if (!target || target === 'terminal') {
    await agents.refresh();
    target = target === 'terminal' ? undefined : agents.defaultTarget(getConfig().agentSendTarget);
  }
  if (target === CHAT_TARGET) {
    await sendToChat(
      text.trim() ? text : files.map(displayPath).join('\n'),
      files.map((f) => vscode.Uri.file(f)),
    );
    return 'VS Code chat';
  }
  const trimmed = text.trim();
  if (!trimmed && !files.length) return undefined;
  if (target?.startsWith('tmux:')) {
    // An agent in an agentmux thread (a tmux pane): pasted there, as in a VS Code terminal.
    await agents.refresh();
    const pane = agents.paneById(target);
    if (!pane) {
      void vscode.window.showWarningMessage(
        'That agent is not running any more. Pick another one in the Agent Context view.',
      );
      return undefined;
    }
    const parts = files.map(shellPath);
    if (trimmed) {
      parts.push(
        fitsInline(trimmed, true)
          ? trimmed
          : shellPath(await saveContext(text, options.label ?? 'context', storage)),
      );
    }
    await pasteIntoPane(pane.socket, pane.paneId, parts);
    agents.setDefault(target);
    vscode.window.setStatusBarMessage(`$(check) Sent to ${pane.label} (${pane.session})`, 4_000);
    return pane.label;
  }
  const found = await resolveAgentTerminal(target);
  if (!found) return undefined;
  const parts = files.map(shellPath);
  if (trimmed) {
    // Agent CLIs get the text itself as a paste; very long text, or a terminal that only takes
    // typing, gets the path of a file holding it.
    const inline = fitsInline(trimmed, acceptsPaste(found.agent));
    parts.push(
      inline ? trimmed : shellPath(await saveContext(text, options.label ?? 'context', storage)),
    );
  }
  pasteIntoTerminal(found.terminal, found.agent, parts);
  return found.agent.label;
}

/** Sends an item of the Agent Context list, and records where it went. */
export async function sendContextItem(
  item: ContextItem,
  target?: string,
): Promise<string | undefined> {
  return sendContextItems([item], target);
}

/**
 * Sends several items of the Agent Context list together, in one send: the chat gets every
 * image attached at once, an agent in a terminal every path in one paste. For a group, or the
 * checked part of one.
 */
export async function sendContextItems(
  items: readonly ContextItem[],
  target?: string,
): Promise<string | undefined> {
  if (!items.length) return undefined;
  const tray = contextTray();
  const texts: string[] = [];
  const files: string[] = [];
  for (const item of items) {
    const file = tray ? await tray.fileOf(item) : item.file;
    // Images are sent as their file; the text of an element with a screenshot already names it.
    const text = item.text ?? '';
    if (text) texts.push(text);
    if (file && !text.includes(displayPath(file))) files.push(file);
  }
  const label = items.length === 1 ? items[0]!.title : `${items.length} items`;
  const sent = await sendToAgent(texts.join('\n\n'), { files, label, target });
  if (sent) for (const item of items) tray?.markSent(item, sent);
  return sent;
}

/**
 * Adds a capture to the Agent Context list and sends it to the agent: the one path for every
 * "send to agent" action, so everything sent also shows in the list.
 */
export async function captureAndSend(
  input: ContextInput,
  target?: string,
): Promise<string | undefined> {
  const item = addContext(input);
  if (item) return sendContextItem(item, target);
  const files = input.file ? [input.file] : [];
  return sendToAgent(input.text ?? '', { files, label: input.title, target });
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
