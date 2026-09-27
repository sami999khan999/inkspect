import { rmSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import * as vscode from 'vscode';
import type { BrowserEngine } from '../browser/BrowserEngine';
import { errorMessage } from '../browser/logger';
import type { ExtensionInfo } from '../shared/protocol';
import {
  compareVersions,
  extractPackage,
  iconDataUrl,
  localize,
  parseUpdateCheck,
  readManifest,
  webStoreDownloadUrl,
  webStoreId,
  webStoreUpdateUrl,
} from './extensionFiles';
import { JsonStore } from './jsonStore';

interface ExtensionRecord extends ExtensionInfo {
  /** Unpacked folder Chromium loads the extension from. */
  path: string;
  /** Whether `path` was created by us (deleted on removal) or is the user's own folder. */
  managed: boolean;
  webStoreId?: string;
}

/**
 * Chrome extensions installed in the browser. Chromium does not remember extensions loaded over
 * CDP, so every enabled extension is loaded again each time the browser starts.
 */
export class ExtensionsManager implements vscode.Disposable {
  private readonly store: JsonStore<ExtensionRecord[]>;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  constructor(
    private readonly storageDir: string,
    private readonly startEngine: () => Promise<BrowserEngine>,
    private readonly logger: vscode.LogOutputChannel,
  ) {
    this.store = new JsonStore({
      file: join(storageDir, 'extensions', 'registry.json'),
      version: 1,
      defaults: () => [],
      delayMs: 100,
    });
  }

  list(): ExtensionInfo[] {
    return this.store.data.map((r) => ({
      id: r.id,
      name: r.name,
      version: r.version,
      description: r.description,
      enabled: r.enabled,
      pinned: r.pinned,
      icon: r.icon,
      source: r.source,
      permissions: r.permissions,
      popup: r.popup,
      optionsPage: r.optionsPage,
      error: r.error,
    }));
  }

  get(id: string): ExtensionRecord | undefined {
    return this.store.data.find((r) => r.id === id);
  }

  /** Loads every enabled extension into a freshly started browser. */
  async installAll(engine: BrowserEngine): Promise<void> {
    for (const record of this.store.data) {
      if (!record.enabled) continue;
      try {
        const id = await engine.installExtension(record.path);
        record.error = undefined;
        if (id !== record.id) this.logger.warn(`Extension ${record.name} got a new id ${id}`);
      } catch (error) {
        record.error = errorMessage(error);
        this.logger.warn(`Could not load extension ${record.name}: ${record.error}`);
      }
    }
    this.changed();
  }

  /** Loads an unpacked extension folder (asks for it when `folder` is missing). */
  async loadUnpacked(folder?: string): Promise<ExtensionInfo | undefined> {
    const directory =
      folder ??
      (
        await vscode.window.showOpenDialog({
          canSelectFolders: true,
          canSelectFiles: false,
          openLabel: 'Load extension',
          title: 'Select an unpacked extension folder (with manifest.json)',
        })
      )?.[0]?.fsPath;
    if (!directory) return undefined;
    return this.add(directory, { source: 'folder', managed: false });
  }

  /** Installs a `.crx` or `.zip` file (asks for it when `file` is missing). */
  async installFile(file?: string): Promise<ExtensionInfo | undefined> {
    const path =
      file ??
      (
        await vscode.window.showOpenDialog({
          canSelectMany: false,
          filters: { 'Chrome extension': ['crx', 'zip'] },
          openLabel: 'Install',
        })
      )?.[0]?.fsPath;
    if (!path) return undefined;
    const directory = join(
      this.storageDir,
      'extensions',
      `${basename(path).replace(/\W+/g, '-')}-${Date.now()}`,
    );
    extractPackage(await readFile(path), directory);
    return this.add(directory, { source: 'file', managed: true });
  }

  /** Installs from the Chrome Web Store, given a store URL or an extension id. */
  async installWebStore(input?: string): Promise<ExtensionInfo | undefined> {
    const value =
      input ??
      (await vscode.window.showInputBox({
        title: 'Install from the Chrome Web Store',
        prompt: 'Paste the extension page URL from chromewebstore.google.com, or its id',
        placeHolder: 'https://chromewebstore.google.com/detail/…',
      }));
    if (!value) return undefined;
    const id = webStoreId(value);
    if (!id) throw new Error('That is not a Chrome Web Store extension URL or id.');
    const directory = await this.downloadWebStore(id);
    return this.add(directory, { source: 'webstore', managed: true, webStoreId: id });
  }

  async remove(id: string): Promise<void> {
    const record = this.get(id);
    if (!record) return;
    if (record.enabled) await this.unload(id);
    if (record.managed) rmSync(record.path, { recursive: true, force: true });
    this.store.update((records) => records.filter((r) => r.id !== id));
    this.changed();
  }

  async setEnabled(id: string, enabled: boolean): Promise<void> {
    const record = this.get(id);
    if (!record || record.enabled === enabled) return;
    if (enabled) {
      const engine = await this.startEngine();
      await engine.installExtension(record.path);
    } else {
      await this.unload(id);
    }
    this.store.update(() => {
      record.enabled = enabled;
      record.error = undefined;
    });
    this.changed();
  }

  setPinned(id: string, pinned: boolean): void {
    const record = this.get(id);
    if (!record) return;
    this.store.update(() => {
      record.pinned = pinned;
    });
    this.changed();
  }

  /** Updates Web Store extensions that have a newer version. Returns how many were updated. */
  async checkUpdates(): Promise<number> {
    const engine = await this.startEngine();
    const chrome = (await engine.version()).replace(/^\D+/, '');
    let updated = 0;
    for (const record of [...this.store.data]) {
      if (!record.webStoreId) continue;
      try {
        const response = await fetch(webStoreUpdateUrl(record.webStoreId, record.version, chrome));
        const latest = parseUpdateCheck(await response.text());
        if (!latest || compareVersions(latest, record.version) <= 0) continue;
        const directory = await this.downloadWebStore(record.webStoreId);
        const old = record.path;
        await this.unload(record.id);
        await this.add(directory, {
          source: 'webstore',
          managed: true,
          webStoreId: record.webStoreId,
        });
        rmSync(old, { recursive: true, force: true });
        updated++;
      } catch (error) {
        this.logger.warn(`Update check failed for ${record.name}: ${errorMessage(error)}`);
      }
    }
    return updated;
  }

  dispose(): void {
    this.store.flushSync();
    this.onDidChangeEmitter.dispose();
  }

  private async downloadWebStore(id: string): Promise<string> {
    const engine = await this.startEngine();
    const chrome = (await engine.version()).replace(/^\D+/, '');
    const response = await fetch(webStoreDownloadUrl(id, chrome));
    if (!response.ok) throw new Error(`Download failed (HTTP ${response.status})`);
    const data = new Uint8Array(await response.arrayBuffer());
    if (data.length < 100) throw new Error('The Web Store did not return an extension package.');
    const directory = join(this.storageDir, 'extensions', `${id}-${Date.now()}`);
    extractPackage(data, directory);
    return directory;
  }

  private async unload(id: string): Promise<void> {
    const engine = await this.startEngine();
    await engine.uninstallExtension(id).catch((error: unknown) => {
      this.logger.warn(`Could not unload extension ${id}: ${errorMessage(error)}`);
    });
  }

  private async add(
    directory: string,
    origin: { source: ExtensionInfo['source']; managed: boolean; webStoreId?: string },
  ): Promise<ExtensionInfo> {
    const manifest = readManifest(directory);
    if (manifest.manifest_version !== 3) {
      if (origin.managed) rmSync(directory, { recursive: true, force: true });
      throw new Error(
        `Only Manifest V3 extensions are supported (this one is version ${manifest.manifest_version ?? '?'}).`,
      );
    }
    const engine = await this.startEngine();
    const id = await engine.installExtension(directory);
    const record: ExtensionRecord = {
      id,
      name: localize(directory, manifest, manifest.name) || basename(directory),
      version: manifest.version ?? '0',
      description: localize(directory, manifest, manifest.description),
      enabled: true,
      pinned: this.store.data.filter((r) => r.pinned).length < 4,
      icon: iconDataUrl(directory, manifest),
      source: origin.source,
      permissions: [...(manifest.permissions ?? []), ...(manifest.host_permissions ?? [])],
      popup: manifest.action?.default_popup ?? manifest.browser_action?.default_popup,
      optionsPage: manifest.options_ui?.page ?? manifest.options_page,
      path: directory,
      managed: origin.managed,
      webStoreId: origin.webStoreId,
    };
    this.store.update((records) => [...records.filter((r) => r.id !== id), record]);
    this.logger.info(`Installed extension ${record.name} ${record.version} (${id})`);
    this.changed();
    return this.list().find((e) => e.id === id)!;
  }

  private changed(): void {
    this.onDidChangeEmitter.fire();
  }
}
