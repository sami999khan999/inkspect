import * as vscode from 'vscode';
import { copyText } from '../features/clipboard';

let lastPick: string | undefined;

/** Remembers the element details the user last picked, for the `browser_get_selection` tool. */
export function rememberPick(markdown: string): void {
  lastPick = markdown;
}

export function lastPickedElement(): string | undefined {
  return lastPick;
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
