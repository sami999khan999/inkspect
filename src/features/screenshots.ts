import { mkdir, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative, sep } from 'node:path';
import * as vscode from 'vscode';
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
  return path;
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
  if (action === 'save' && path) await vscode.env.clipboard.writeText(displayPath(path));

  const copied = action === 'save' ? 'path copied' : 'image copied';
  const message = path
    ? `${options.label} saved to ${displayPath(path)} (${copied})`
    : `${options.label} copied to the clipboard`;
  const buttons = path ? ['Send to Chat', 'Copy Path', 'Copy Image', 'Open', 'Reveal'] : [];
  void vscode.window.showInformationMessage(message, ...buttons).then(async (choice) => {
    if (!path) return;
    if (choice === 'Send to Chat')
      await sendToChat(`${options.label} of ${options.url}: ${displayPath(path)}`, [
        vscode.Uri.file(path),
      ]);
    if (choice === 'Copy Path') await vscode.env.clipboard.writeText(displayPath(path));
    if (choice === 'Copy Image') options.copyImage(bytes, mimeType);
    if (choice === 'Open')
      await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(path));
    if (choice === 'Reveal')
      await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(path));
  });
  return path;
}
