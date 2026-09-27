import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, sep } from 'node:path';
import * as vscode from 'vscode';
import { copyText } from './clipboard';
import { sendPathToTerminal } from './terminalSend';
import { sendToChat } from '../agent/chat';
import { getConfig } from '../config';

export type ScreenshotFormat = 'png' | 'jpeg' | 'webp';

/**
 * The first workspace folder when it is on this machine. The extension runs on the UI side, so
 * in a remote window (SSH, WSL, containers) files are saved to global storage instead.
 */
export function localWorkspaceFolder(): string | undefined {
  const folder = vscode.workspace.workspaceFolders?.[0]?.uri;
  return folder?.scheme === 'file' ? folder.fsPath : undefined;
}

/** Where screenshots go: the setting, else `.vscode-browser/screenshots` in the workspace. */
export function screenshotDirectory(globalStorage: string): string {
  const configured = getConfig().screenshotsDirectory;
  const workspace = localWorkspaceFolder();
  if (configured) {
    if (isAbsolute(configured)) return configured;
    return join(workspace ?? globalStorage, configured);
  }
  return workspace
    ? join(workspace, '.vscode-browser', 'screenshots')
    : join(globalStorage, 'screenshots');
}

/** `screenshot-2026-09-27_14-03-12-example.com.png` */
export function screenshotName(url: string, format: ScreenshotFormat, now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  let site = 'page';
  try {
    site = new URL(url).hostname || 'page';
  } catch {
    // Keep "page".
  }
  const slug = site.replace(/[^a-z0-9.-]+/gi, '-').slice(0, 40);
  return `screenshot-${stamp}-${slug}.${format === 'jpeg' ? 'jpg' : format}`;
}

/** A path to put in text for an AI agent: workspace-relative when possible. */
export function displayPath(path: string): string {
  const workspace = localWorkspaceFolder();
  if (workspace) {
    const rel = relative(workspace, path);
    if (!rel.startsWith('..') && !isAbsolute(rel)) return rel.split(sep).join('/');
  }
  return path;
}

let lastScreenshot: string | undefined;

/** The most recently saved screenshot (any kind), for "send the last screenshot" actions. */
export function lastScreenshotPath(): string | undefined {
  return lastScreenshot;
}

export async function saveScreenshot(
  bytes: Uint8Array,
  url: string,
  format: ScreenshotFormat,
  globalStorage: string,
): Promise<string> {
  const directory = screenshotDirectory(globalStorage);
  await mkdir(directory, { recursive: true });
  const path = join(directory, screenshotName(url, format));
  await writeFile(path, bytes);
  lastScreenshot = path;
  return path;
}

interface ScreenshotAction extends vscode.QuickPickItem {
  run: () => Thenable<unknown> | void;
}

/** Everything that can be done with a saved screenshot (notification buttons and "More..."). */
function screenshotActions(
  path: string,
  options: { label: string; url: string },
  copyImage: () => void,
): Record<'terminal' | 'chat' | 'copyPath' | 'copyImage' | 'open' | 'reveal', ScreenshotAction> {
  const uri = vscode.Uri.file(path);
  return {
    terminal: {
      label: '$(terminal) Send to Terminal',
      description: 'Type the path into an agent running in a terminal',
      run: () => sendPathToTerminal(path),
    },
    chat: {
      label: '$(comment-discussion) Send to Chat',
      description: 'Attach the image in the chat view',
      run: () => sendToChat(`${options.label} of ${options.url}: ${displayPath(path)}`, [uri]),
    },
    copyPath: {
      label: '$(copy) Copy Path',
      description: displayPath(path),
      run: () => copyText(displayPath(path)),
    },
    copyImage: { label: '$(file-media) Copy Image', run: copyImage },
    open: {
      label: '$(go-to-file) Open',
      run: () => vscode.commands.executeCommand('vscode.open', uri),
    },
    reveal: {
      label: '$(folder-opened) Reveal in File Explorer',
      description: dirname(displayPath(path)),
      run: () => vscode.commands.executeCommand('revealFileInOS', uri),
    },
  };
}

export interface DeliverOptions {
  bytes: Uint8Array;
  url: string;
  format: ScreenshotFormat;
  globalStorage: string;
  /** Copies the image to the clipboard (done by the webview, which can write images). */
  copyImage: (bytes: Uint8Array, mimeType: string) => void;
  /** What kind of screenshot, for the notification text. */
  label: string;
}

/**
 * Saves and/or copies a screenshot according to `vscodeBrowser.screenshots.defaultAction`, then
 * shows a notification with actions. Returns the saved path, if it was saved.
 */
export async function deliverScreenshot(options: DeliverOptions): Promise<string | undefined> {
  const { bytes, format } = options;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  let action = getConfig().screenshotAction;
  if (action === 'ask') {
    const choice = await vscode.window.showQuickPick(
      [
        { label: 'Save and copy the image', id: 'saveAndCopy' as const },
        { label: 'Save and copy the file path', id: 'save' as const },
        { label: 'Copy the image only', id: 'copy' as const },
      ],
      { title: `${options.label} captured` },
    );
    if (!choice) return undefined;
    action = choice.id;
  }
  const path =
    action === 'copy'
      ? undefined
      : await saveScreenshot(bytes, options.url, format, options.globalStorage);
  if (action === 'copy' || action === 'saveAndCopy') options.copyImage(bytes, mimeType);
  if (action === 'save' && path) await copyText(displayPath(path));

  const copied = action === 'save' ? 'path copied' : 'image copied';
  if (!path) {
    void vscode.window.showInformationMessage(`${options.label} copied to the clipboard`);
    return undefined;
  }
  // Notifications show about three buttons before truncating them, so keep the two agent
  // actions and put the rest (with the full path) under "More...".
  const actions = screenshotActions(path, options, () => options.copyImage(bytes, mimeType));
  void vscode.window
    .showInformationMessage(
      `${options.label} saved · ${copied}`,
      'Send to Terminal',
      'Send to Chat',
      'More...',
    )
    .then(async (choice) => {
      if (choice === 'Send to Terminal') await actions.terminal.run();
      else if (choice === 'Send to Chat') await actions.chat.run();
      else if (choice === 'More...') {
        const pick = await vscode.window.showQuickPick(Object.values(actions), {
          title: `${options.label}: ${basename(path)}`,
          placeHolder: displayPath(path),
        });
        await pick?.run();
      }
    });
  return path;
}
