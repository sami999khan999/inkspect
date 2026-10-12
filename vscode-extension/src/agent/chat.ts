import * as vscode from 'vscode';
import type { ItemMeta } from '@inkspect/shared/hub';
import { getConfig } from '../config';
import { copyText } from '../features/clipboard';
import { displayPath } from '../features/screenshots';
import {
  acceptsPaste,
  askForAgent,
  CHAT_TARGET,
  getAgentTerminals,
  pasteIntoTerminal,
} from '../features/terminalSend';
import { chooseDefault, listClients, paneTargets } from '../hub/agents';
import { availableHarnesses } from '../hub/agentmux';
import { readProjectState } from '../hub/projectState';
import { sendItems, type SendContext, type SendOptions, type SendResult } from '../hub/router';
import { agentPanes, listPanes } from '../hub/tmux';
import { listProcesses } from './processes';
import { partsOf } from '../hub/send';
import { itemFile, readItem, readItemText } from '../hub/store';
import { addContext, contextTray, type ContextInput, type ContextItem } from './contextTray';
import { currentProject, globalTarget, localTarget } from './projects';

let lastPick: string | undefined;

/** Remembers the element details the user last picked, for the `browser_get_selection` tool. */
export function rememberPick(markdown: string): void {
  lastPick = markdown;
}

export function lastPickedElement(): string | undefined {
  return lastPick;
}

/**
 * What a send of these items puts into a chat: their text (or, without text, their files' names)
 * and the files to attach, the ones the text doesn't already name.
 */
function chatContentOf(project: string, items: readonly ItemMeta[]) {
  const texts: string[] = [];
  const files: string[] = [];
  for (const item of items) {
    const text = readItemText(project, item)?.trim() ?? '';
    if (text) texts.push(text);
    const file = itemFile(project, item, 'file');
    if (file && !text.includes(displayPath(file))) files.push(file);
  }
  return { text: texts.join('\n\n') || files.map(displayPath).join('\n'), files };
}

/**
 * Puts saved items into one of this window's own targets: an agent in a VS Code terminal (each
 * file's path and the text, pasted, never Enter, no focus) or VS Code chat (text in the input,
 * files attached). The router (and the hub, for the browser's sends) records where they went.
 */
export async function deliverLocal(
  target: string,
  project: string,
  items: readonly ItemMeta[],
  prompt?: string,
): Promise<SendResult> {
  const id = localTarget(target);
  if (id === CHAT_TARGET) {
    const { text, files } = chatContentOf(project, items);
    const asked = prompt?.trim();
    await sendToChat(
      asked ? `${asked}\n\n${text}` : text,
      files.map((f) => vscode.Uri.file(f)),
    );
    return { ok: true, sentTo: 'VS Code chat' };
  }
  const agents = getAgentTerminals();
  const terminal = agents.terminalById(id);
  if (!terminal) return { ok: false, error: 'That terminal is closed.' };
  const agent = agents.agentFor(terminal) ?? { id: 'custom', label: terminal.name };
  pasteIntoTerminal(
    terminal,
    agent,
    partsOf(project, items, { acceptsPaste: acceptsPaste(agent), prompt }),
  );
  return { ok: true, sentTo: agent.label };
}

/**
 * Sends saved items, without pressing Enter: to `target` (a target id from the Saved view, a
 * tmux pane, `agentmux:new:<agent>`), else the project's default agent. With no agent at all,
 * asks to start or pick one. Returns the agent's name, or undefined if nothing was sent.
 */
export async function sendSaved(
  items: readonly ContextItem[],
  target?: string,
  options: SendOptions = {},
): Promise<string | undefined> {
  const project = items[0]?.project;
  if (!project) return undefined;
  const ids = items.filter((i) => i.project === project).map((i) => i.id);
  const send = async (to: string | undefined) =>
    sendItems(await sendContextFor(project), project, ids, to ?? 'default', options);
  let result = await send(target);
  if (
    !result.ok &&
    project === currentProject() &&
    (!target || target === 'default' || target === 'terminal')
  ) {
    const picked = await askForAgent();
    if (!picked) return undefined;
    await getAgentTerminals().refresh(true);
    result = await send(picked);
  }
  if (!result.ok) {
    void vscode.window.showWarningMessage(result.error);
    return undefined;
  }
  vscode.window.setStatusBarMessage(`$(check) Sent to ${result.sentTo}`, 4_000);
  contextTray()?.load();
  return result.sentTo;
}

/**
 * Where a project's sends can go from this window: for its own project, its terminal agents,
 * its chat and the project's agentmux agents; for another project, that project's agentmux
 * agents.
 */
export async function sendContextFor(project: string): Promise<SendContext> {
  const sockets = getConfig().agentTmuxSockets;
  const agents = getAgentTerminals();
  if (project === currentProject()) {
    await agents.refresh();
    return {
      targets: agents.sendTargets(),
      defaultTarget: agents.defaultTarget(getConfig().agentSendTarget),
      sockets,
      harnesses: agents.harnesses(),
      deliver: deliverLocal,
      globalId: globalTarget,
    };
  }
  const [panes, processes, clients] = await Promise.all([
    listPanes(sockets),
    listProcesses().catch(() => []),
    listClients(sockets),
  ]);
  const targets = paneTargets(panes, processes, clients).filter((t) => t.project === project);
  const open = agentPanes(panes).some((p) => p.project === project);
  return {
    targets,
    defaultTarget: chooseDefault(targets, { last: readProjectState(project).lastTarget }),
    sockets,
    harnesses: open ? availableHarnesses() : [],
    globalId: globalTarget,
  };
}

/** Sends an item of the Saved list. */
export async function sendContextItem(
  item: ContextItem,
  target?: string,
): Promise<string | undefined> {
  return sendSaved([item], target);
}

/**
 * Sends several items of the Saved list together, in one send: the chat gets every image
 * attached at once, an agent every path in one paste. For a group, or the checked part of one.
 */
export async function sendContextItems(
  items: readonly ContextItem[],
  target?: string,
): Promise<string | undefined> {
  return sendSaved(items, target);
}

/**
 * Saves a capture in the Saved list and sends it to the agent: the one path for every "send to
 * agent" action, so everything sent is also saved.
 */
export async function captureAndSend(
  input: ContextInput,
  target?: string,
): Promise<string | undefined> {
  const item = addContext(input, { silent: true });
  return item ? sendSaved([item], target) : undefined;
}

/** The saved items of a project, by id (sends that come through the hub). */
export function savedItems(project: string, ids: readonly string[]): ItemMeta[] {
  return ids.flatMap((id) => readItem(project, id) ?? []);
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
