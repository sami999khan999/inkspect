import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, sep } from 'node:path';
import * as vscode from 'vscode';
import { copyText } from './clipboard';
import { sendToAgent } from '../agent/chat';
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

/**
 * Saves a page recording (WebM) next to the screenshots and offers to send it to the agent.
 * Returns its path.
 */
export async function deliverRecording(
  bytes: Uint8Array,
  url: string,
  seconds: number,
  globalStorage: string,
): Promise<string> {
  const directory = screenshotDirectory(globalStorage);
  await mkdir(directory, { recursive: true });
  const name = screenshotName(url, 'png')
    .replace(/^screenshot/, 'recording')
    .replace(/\.png$/, '.webm');
  const path = join(directory, name);
  await writeFile(path, bytes);
  const actions = screenshotActions(path, { label: 'Recording', url });
  void vscode.window
    .showInformationMessage(
      `Recording saved (${Math.round(seconds)} s) · ${displayPath(path)}`,
      'Send to Agent',
      'More...',
    )
    .then(async (choice) => {
      if (choice === 'Send to Agent') await actions.agent.run();
      else if (choice === 'More...') {
        const pick = await vscode.window.showQuickPick(Object.values(actions), {
          title: `Recording: ${basename(path)}`,
          placeHolder: displayPath(path),
        });
        await pick?.run();
      }
    });
  return path;
}

interface ScreenshotAction extends vscode.QuickPickItem {
  run: () => Thenable<unknown> | void;
}

/** Everything that can be done with a saved screenshot (notification buttons and "More..."). */
function screenshotActions(
  path: string,
  options: { label: string; url: string },
): Record<'agent' | 'otherTarget' | 'copyPath' | 'open' | 'reveal', ScreenshotAction> {
  const uri = vscode.Uri.file(path);
  const toChat = getConfig().agentSendTarget === 'chat';
  const text = `${options.label} of ${options.url}:`;
  return {
    agent: {
      label: '$(sparkle) Send to Agent',
      description: toChat
        ? 'Attach the image in the chat view'
        : 'Type the path into the agent in a terminal',
      run: () => sendToAgent(toChat ? `${text} ${displayPath(path)}` : '', { files: [path] }),
    },
    otherTarget: toChat
      ? {
          label: '$(terminal) Send to Terminal',
          description: 'Type the path into an agent running in a terminal',
          run: () => sendToAgent('', { files: [path], target: 'terminal' }),
        }
      : {
          label: '$(comment-discussion) Send to Chat',
          description: 'Attach the image in the chat view',
          run: () => sendToAgent(`${text} ${displayPath(path)}`, { files: [path], target: 'chat' }),
        },
    copyPath: {
      label: '$(copy) Copy Path',
      description: displayPath(path),
      run: () => copyText(displayPath(path)),
    },
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
  /** Copies the image to the clipboard. */
  copyImage: (bytes: Uint8Array, mimeType: string) => void;
  /** What kind of screenshot, for the notification text. */
  label: string;
  /** Send it to the agent right away (the "and send to agent" shortcuts). */
  toAgent?: boolean;
}

/**
 * Copies a screenshot to the clipboard (always) and saves it as a file unless
 * `vscodeBrowser.screenshots.saveFile` is off, then shows a notification with actions.
 * Returns the saved path, if it was saved.
 */
export async function deliverScreenshot(options: DeliverOptions): Promise<string | undefined> {
  const { bytes, format } = options;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  options.copyImage(bytes, mimeType);
  // Sending to the agent needs a file, whatever the setting says.
  const path =
    getConfig().screenshotSaveFile || options.toAgent
      ? await saveScreenshot(bytes, options.url, format, options.globalStorage)
      : undefined;
  if (!path) {
    void vscode.window.showInformationMessage(`${options.label} copied to the clipboard`);
    return undefined;
  }
  const actions = screenshotActions(path, options);
  if (options.toAgent) {
    await actions.agent.run();
    return path;
  }
  // Notifications show about three buttons before truncating them: the agent action first,
  // the rest (with the full path) under "More...".
  void vscode.window
    .showInformationMessage(`${options.label} copied · saved`, 'Send to Agent', 'More...')
    .then(async (choice) => {
      if (choice === 'Send to Agent') await actions.agent.run();
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
