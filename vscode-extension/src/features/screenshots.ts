import { mkdir, writeFile } from 'node:fs/promises';
import { isAbsolute, join, relative, sep } from 'node:path';
import * as vscode from 'vscode';
import { sendContextItems } from '../agent/chat';
import { addContext, contextTray } from '../agent/contextTray';
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

/**
 * Writes `bytes` to `path`, or to `name-2.png`, `name-3.png`... when that file exists: names
 * go down to the second, and several screenshots taken together (a group) share one.
 */
async function writeUnique(path: string, bytes: Uint8Array): Promise<string> {
  const dot = path.lastIndexOf('.');
  for (let n = 1; ; n++) {
    const candidate = n === 1 ? path : `${path.slice(0, dot)}-${n}${path.slice(dot)}`;
    try {
      // 'wx': fails if the file exists, so two writes can't pick the same name.
      await writeFile(candidate, bytes, { flag: 'wx' });
      return candidate;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST' || n > 999) throw error;
    }
  }
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
  const path = await writeUnique(join(directory, screenshotName(url, format)), bytes);
  lastScreenshot = path;
  return path;
}

/**
 * Saves a page recording (WebM) next to the screenshots, adds it to the Saved list and
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
  const path = await writeUnique(join(directory, name), bytes);
  // Saved; the send dialog offers it (see SendFlow).
  addContext({
    kind: 'recording',
    title: `Recording (${Math.round(seconds)} s)`,
    detail: hostOf(url),
    file: path,
    url,
  });
  return path;
}

function hostOf(url: string): string {
  try {
    return new URL(url).host || url;
  } catch {
    return url;
  }
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
  /**
   * Screenshots taken together (each drawing separately, several elements): they join one group
   * in the Saved list, and the last one sends or offers the whole group, once.
   */
  group?: { id: string; index: number; count: number };
}

/**
 * Copies a screenshot to the clipboard (always), adds it to the Saved list, and saves it
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
  const group = options.group;
  // The group's other screenshots are still coming: it is sent or offered with the last one
  // (the send dialog offers the whole group).
  const last = !group || group.index >= group.count - 1;
  const item = addContext(
    {
      kind: 'screenshot',
      title: options.label,
      detail: hostOf(options.url),
      image: { bytes, mimeType },
      file: path,
      url: options.url,
      group: group?.id,
    },
    { silent: !last || options.toAgent },
  );
  if (!last) return path;
  if (options.toAgent) {
    const items = group ? (contextTray()?.inGroup(group.id) ?? []) : item ? [item] : [];
    if (items.length) await sendContextItems(items);
    return item?.file ?? path;
  }
  return path;
}
