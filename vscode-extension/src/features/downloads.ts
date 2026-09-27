import { existsSync, renameSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, parse } from 'node:path';
import type { Protocol } from 'devtools-protocol';
import * as vscode from 'vscode';
import type { BrowserEngine } from '../browser/BrowserEngine';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import type { DownloadAction, DownloadInfo } from '../shared/protocol';

const STORAGE_KEY = 'vscodeBrowser.downloads';
const MAX_ENTRIES = 100;

/** Removes characters that are not allowed in file names on any platform. */
export function sanitizeFilename(name: string): string {
  const cleaned = name
    // eslint-disable-next-line no-control-regex
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, '_')
    .replace(/^[.\s]+|[.\s]+$/g, '')
    .slice(0, 200);
  return cleaned || 'download';
}

/** Returns `name`, or `name (1)`, `name (2)`... for the first one that does not exist yet. */
export function uniqueFilename(
  directory: string,
  name: string,
  exists: (path: string) => boolean = existsSync,
): string {
  const { name: stem, ext } = parse(sanitizeFilename(name));
  for (let i = 0; ; i++) {
    const candidate = join(directory, i === 0 ? `${stem}${ext}` : `${stem} (${i})${ext}`);
    if (!exists(candidate)) return candidate;
  }
}

/**
 * Tracks downloads for every browser window. Chromium saves each file as `<dir>/<guid>`; when it
 * completes it is renamed to its suggested file name.
 */
export class DownloadsManager implements vscode.Disposable {
  private downloads: DownloadInfo[];
  private engine?: BrowserEngine;
  private readonly directories = new Map<string, string>();
  private notifyTimer?: NodeJS.Timeout;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<{ started?: boolean }>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  constructor(
    private readonly memento: vscode.Memento,
    private readonly logger: vscode.LogOutputChannel,
  ) {
    // Anything still in progress when VS Code closed was interrupted.
    this.downloads = memento
      .get<DownloadInfo[]>(STORAGE_KEY, [])
      .map((d) => (d.state === 'inProgress' ? { ...d, state: 'canceled' as const } : d));
  }

  get directory(): string {
    return getConfig().downloadsDirectory || join(homedir(), 'Downloads');
  }

  list(): DownloadInfo[] {
    return this.downloads;
  }

  attach(engine: BrowserEngine): void {
    this.engine = engine;
    engine.events.on('downloadWillBegin', (event) => this.onWillBegin(event));
    engine.events.on('downloadProgress', (event) => this.onProgress(event));
  }

  async run(action: DownloadAction, id?: string): Promise<void> {
    if (action === 'clear') {
      this.downloads = this.downloads.filter((d) => d.state === 'inProgress');
      this.changed();
      return;
    }
    const download = this.downloads.find((d) => d.id === id);
    if (!download) return;
    switch (action) {
      case 'open':
        if (download.path && existsSync(download.path)) {
          await vscode.env.openExternal(vscode.Uri.file(download.path));
        } else {
          void vscode.window.showWarningMessage(`File not found: ${download.filename}`);
        }
        break;
      case 'reveal':
        if (download.path && existsSync(download.path)) {
          await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(download.path));
        }
        break;
      case 'cancel':
        await this.engine?.cancelDownload(download.id).catch((error: unknown) => {
          this.logger.warn(`Cancel download failed: ${errorMessage(error)}`);
        });
        break;
      case 'remove':
        this.downloads = this.downloads.filter((d) => d !== download);
        this.changed();
        break;
    }
  }

  dispose(): void {
    clearTimeout(this.notifyTimer);
    this.onDidChangeEmitter.dispose();
  }

  private onWillBegin(event: Protocol.Browser.DownloadWillBeginEvent): void {
    this.directories.set(event.guid, this.directory);
    this.downloads = [
      {
        id: event.guid,
        url: event.url,
        filename: sanitizeFilename(event.suggestedFilename),
        state: 'inProgress' as const,
        receivedBytes: 0,
        totalBytes: 0,
        startTime: Date.now(),
      },
      ...this.downloads,
    ].slice(0, MAX_ENTRIES);
    this.logger.info(`Download started: ${event.suggestedFilename} from ${event.url}`);
    this.changed(true);
  }

  private onProgress(event: Protocol.Browser.DownloadProgressEvent): void {
    const download = this.downloads.find((d) => d.id === event.guid);
    if (!download) return;
    download.receivedBytes = event.receivedBytes;
    download.totalBytes = event.totalBytes;
    if (event.state === 'completed') {
      download.state = 'completed';
      download.path = this.finish(download);
      this.changed();
    } else if (event.state === 'canceled') {
      download.state = 'canceled';
      this.changed();
    } else {
      this.changedSoon();
    }
  }

  /** Renames the finished `<guid>` file to its real name and returns the final path. */
  private finish(download: DownloadInfo): string | undefined {
    const directory = this.directories.get(download.id) ?? this.directory;
    this.directories.delete(download.id);
    const temporary = join(directory, download.id);
    if (!existsSync(temporary)) return undefined;
    const target = uniqueFilename(directory, download.filename);
    try {
      renameSync(temporary, target);
      this.logger.info(`Download saved: ${target}`);
      return target;
    } catch (error) {
      this.logger.warn(`Could not rename ${temporary}: ${errorMessage(error)}`);
      return temporary;
    }
  }

  private changedSoon(): void {
    this.notifyTimer ??= setTimeout(() => {
      this.notifyTimer = undefined;
      this.onDidChangeEmitter.fire({});
    }, 250);
  }

  private changed(started = false): void {
    clearTimeout(this.notifyTimer);
    this.notifyTimer = undefined;
    void this.memento.update(STORAGE_KEY, this.downloads);
    this.onDidChangeEmitter.fire({ started });
  }
}
