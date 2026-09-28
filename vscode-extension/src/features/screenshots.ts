import { mkdir, writeFile } from 'node:fs/promises';
import { basename, dirname, isAbsolute, join, relative, sep } from 'node:path';
import * as vscode from 'vscode';
import { copyText } from './clipboard';
import { sendContextItem } from '../agent/chat';
import { addContext, type ContextItem } from '../agent/contextTray';
import { getAgentTerminals } from './terminalSend';
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
 * Saves a page recording (WebM) next to the screenshots, adds it to the Agent Context list and
 * offers to send it to the agent. Returns its path.
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
  const item = addContext({
    kind: 'recording',
    title: `Recording (${Math.round(seconds)} s)`,
    detail: hostOf(url),
    file: path,
    url,
  });
  offerActions(`Recording saved (${Math.round(seconds)} s) · ${displayPath(path)}`, item, path);
  return path;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host || url;
  } catch {
    return url;
  }
}

interface ScreenshotAction extends vscode.QuickPickItem {
  run: () => Thenable<unknown> | void;
}

/**
 * The notification after a capture: "Send to Agent", and "More..." with the other actions
 * (another agent or chat, copy the path, open, reveal).
 */
function offerActions(message: string, item: ContextItem | undefined, path?: string): void {
  const buttons = item ? ['Send to Agent', 'More...'] : path ? ['More...'] : [];
  void vscode.window.showInformationMessage(message, ...buttons).then(async (choice) => {
    if (choice === 'Send to Agent' && item) await sendContextItem(item);
    else if (choice === 'More...') {
      const actions = moreActions(item, path);
      const pick = await vscode.window.showQuickPick(actions, {
        title: item?.title ?? basename(path ?? ''),
        placeHolder: path ? displayPath(path) : undefined,
      });
      await pick?.run();
    }
  });
}

function moreActions(item: ContextItem | undefined, path?: string): ScreenshotAction[] {
  const actions: ScreenshotAction[] = [];
  if (item) {
    actions.push(
      {
        label: '$(sparkle) Send to Agent...',
        description: 'Choose the agent, or VS Code chat',
        run: async () => {
          const targets = getAgentTerminals().targets();
          const pick = await vscode.window.showQuickPick(
            targets.map((t) => ({ label: t.label, description: t.detail, id: t.id })),
            { title: 'Send to which agent?' },
          );
          if (pick) await sendContextItem(item, pick.id);
        },
      },
      {
        label: '$(list-unordered) Show in Agent Context',
        run: () => vscode.commands.executeCommand('vscodeBrowser.showAgentContext'),
      },
    );
  }
  if (path) {
    const uri = vscode.Uri.file(path);
    actions.push(
      {
        label: '$(copy) Copy Path',
        description: displayPath(path),
        run: () => copyText(displayPath(path)),
      },
      {
        label: '$(go-to-file) Open',
        run: () => vscode.commands.executeCommand('vscode.open', uri),
      },
      {
        label: '$(folder-opened) Reveal in File Explorer',
        description: dirname(displayPath(path)),
        run: () => vscode.commands.executeCommand('revealFileInOS', uri),
      },
    );
  }
  return actions;
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
 * Copies a screenshot to the clipboard (always), adds it to the Agent Context list, and saves it
 * as a file unless `vscodeBrowser.screenshots.saveFile` is off; then sends it to the agent
 * (`toAgent`) or shows a notification with actions. Returns the saved path, if it was saved.
 */
export async function deliverScreenshot(options: DeliverOptions): Promise<string | undefined> {
  const { bytes, format } = options;
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;
  options.copyImage(bytes, mimeType);
  const path = getConfig().screenshotSaveFile
    ? await saveScreenshot(bytes, options.url, format, options.globalStorage)
    : undefined;
  const item = addContext({
    kind: 'screenshot',
    title: options.label,
    detail: hostOf(options.url),
    image: { bytes, mimeType },
    file: path,
    url: options.url,
  });
  if (options.toAgent) {
    if (item) {
      await sendContextItem(item);
      return item.file;
    }
    return path;
  }
  offerActions(`${options.label} copied${path ? ' · saved' : ''}`, item, path);
  return path;
}
