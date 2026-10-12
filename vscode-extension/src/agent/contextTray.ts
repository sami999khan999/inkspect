import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import * as vscode from 'vscode';
import type { ItemMeta } from '@inkspect/shared/hub';
import { copyImageBytes, copyText } from '../features/clipboard';
import { displayPath, localWorkspaceFolder } from '../features/screenshots';
import { inboxFolder } from '../hub/paths';
import {
  emptyTrash,
  groupItems,
  itemFile,
  moveItems,
  readItem,
  readItems,
  readItemText,
  removeItems,
  restoreItems,
  STORE_FOLDER,
  storeSignature,
  TRASH_MS,
  ungroupItems,
  updateItem,
  writeItem,
} from '../hub/store';
import {
  elementSummary,
  previewText,
  type ContextItemView,
  type ContextKind,
} from '../shared/agentContext';

/** What a capture adds to the Saved list. */
export interface ContextInput {
  kind: ContextKind;
  title: string;
  detail?: string;
  /** The text sent to the agent (Markdown). */
  text?: string;
  /** An image, saved with the item. */
  image?: { bytes: Uint8Array; mimeType: string };
  /** A file already saved (a screenshot or recording), copied into the item. */
  file?: string;
  url?: string;
  /** Items with the same key replace each other (the console errors of one page). */
  key?: string;
  /**
   * Captures made together (each drawing separately, several elements) share a group: the view
   * shows them as one card, and they are sent together.
   */
  group?: string;
}

export interface AddOptions {
  /** An update that keeps its place (a growing error list): saved, nothing offered. */
  quiet?: boolean;
  /** Saved on its way to a send (or saved by the browser): the send dialog isn't offered. */
  silent?: boolean;
}

export interface ContextItem {
  id: string;
  kind: ContextKind;
  title: string;
  detail?: string;
  text?: string;
  /** The item's image or recording, in the project's `.inkspect/`. */
  file?: string;
  /** The file's type, when it is an image. */
  mimeType?: string;
  /** A small JPEG of the image, if one was saved. */
  thumb?: string;
  url?: string;
  key?: string;
  group?: string;
  groupIndex?: number;
  /** Captured in the browser (through the helper) or in VS Code. */
  source: 'browser' | 'vscode';
  /** The browser's name, for browser captures. */
  browser?: string;
  /** The folder whose `.inkspect/` holds it. */
  project: string;
  time: number;
  sentTo: string[];
}

/** How often the list checks the store for changes a file watcher missed. */
const POLL_MS = 3_000;

const IMAGE_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

const extensionOf = (mimeType: string) =>
  mimeType
    .split('/')[1]
    ?.replace('jpeg', 'jpg')
    .replace(/[^a-z0-9]/g, '') || 'png';

/** A store item as a Saved item. */
function itemFromMeta(root: string, meta: ItemMeta): ContextItem {
  const file = itemFile(root, meta, 'file');
  const text = readItemText(root, meta);
  return {
    id: meta.id,
    kind: meta.kind,
    title: meta.title,
    detail: meta.detail,
    text: text?.replace(/\n$/, ''),
    file,
    mimeType: file ? IMAGE_TYPES[extname(file).slice(1).toLowerCase()] : undefined,
    thumb: itemFile(root, meta, 'thumb'),
    url: meta.url,
    key: meta.key,
    group: meta.group,
    groupIndex: meta.groupIndex,
    source: meta.source,
    browser: meta.browser,
    time: meta.time,
    sentTo: meta.sentTo,
    project: root,
  };
}

/**
 * The Saved list: everything captured for this project, newest first, ready to send to
 * an agent. It lives in the project's `.inkspect/` folder (see src/hub/store.ts), shared with the
 * browser: captures saved there from the browser show up here, and the other way round. Without
 * a local folder, a store in global storage is used.
 */
export class ContextTray implements vscode.Disposable {
  private items: ContextItem[] = [];
  private root: string;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;
  private readonly onDidAddImageEmitter = new vscode.EventEmitter<ContextItem>();
  /** An item with an image was added (the view fetches its thumbnail). */
  readonly onDidAddImage = this.onDidAddImageEmitter.event;
  private readonly onDidCaptureEmitter = new vscode.EventEmitter<ContextItem>();
  /** Something was captured in VS Code (not a quiet update, not a send on its way): offer it. */
  readonly onDidCapture = this.onDidCaptureEmitter.event;
  private watcher?: vscode.Disposable[];
  /** The project picked in the Saved view (else the workspace's, or the Inbox). */
  private chosen?: string;
  /** The last capture time given out: captures in the same millisecond keep their order. */
  private lastTime = 0;
  private reloadTimer?: ReturnType<typeof setTimeout>;
  /** The store as it was when the list was read (see storeSignature). */
  private signature = '';
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    globalStorage: string,
    /** The folder whose store the list shows (the workspace's, else the Inbox). */
    private readonly rootOf: () => string = () =>
      localWorkspaceFolder() ?? defaultInbox(globalStorage),
  ) {
    this.root = rootOf();
    emptyTrash(this.root, 0);
    this.load();
    this.watch();
    const folders = vscode.workspace.onDidChangeWorkspaceFolders?.(() =>
      this.show(this.chosen ?? this.rootOf()),
    );
    if (folders) this.disposables.push(folders);
  }

  /** The folder whose `.inkspect/` the list shows. */
  get project(): string {
    return this.root;
  }

  /** The project the list shows unless one is picked: the workspace's, else the Inbox. */
  get defaultProject(): string {
    return this.rootOf();
  }

  /**
   * Shows another project's list (the Saved view's project switcher): captures go there too, and
   * sends go to its agents. `undefined` goes back to the workspace's (or the Inbox).
   */
  setProject(path: string | undefined): void {
    this.chosen = path && path !== this.rootOf() ? path : undefined;
    this.show(this.chosen ?? this.rootOf());
  }

  private show(root: string): void {
    if (root === this.root) return;
    this.root = root;
    this.removed = undefined;
    this.load();
    this.watch();
  }

  private fromMeta(meta: ItemMeta): ContextItem {
    return itemFromMeta(this.root, meta);
  }

  /** Items of any project's store, by id (sends that come through the hub). */
  itemsIn(project: string, ids: readonly string[]): ContextItem[] {
    // From disk when not in the list yet (just saved by the hub; the watcher catches up later).
    return ids.flatMap((id) => {
      const known = project === this.root ? this.get(id) : undefined;
      if (known) return [known];
      const meta = readItem(project, id);
      return meta ? [itemFromMeta(project, meta)] : [];
    });
  }

  /** Reads the list from the store again (it changed on disk, or the folder changed). */
  load(): void {
    this.signature = storeSignature(this.root);
    const before = new Set(this.items.map((i) => i.id));
    this.items = readItems(this.root).map((meta) => this.fromMeta(meta));
    for (const item of this.items) {
      if (!before.has(item.id) && item.mimeType) this.onDidAddImageEmitter.fire(item);
    }
    this.onDidChangeEmitter.fire();
  }

  /**
   * Follows the store: the browser and other windows add to it too. The store writes by renaming
   * whole item folders (into place, to the trash and back), so the watcher takes every change
   * under `items/`; a check every few seconds catches what a watcher misses (folders outside the
   * workspace, excluded from watching, or events lost).
   */
  private watch(): void {
    for (const d of this.watcher ?? []) d.dispose();
    this.watcher = undefined;
    const reload = () => {
      clearTimeout(this.reloadTimer);
      this.reloadTimer = setTimeout(() => this.load(), 150);
    };
    const poll = setInterval(() => {
      if (storeSignature(this.root) !== this.signature) reload();
    }, POLL_MS);
    this.watcher = [{ dispose: () => clearInterval(poll) }];
    if (typeof vscode.workspace.createFileSystemWatcher !== 'function') return;
    const watcher = vscode.workspace.createFileSystemWatcher(
      new vscode.RelativePattern(vscode.Uri.file(this.root), `${STORE_FOLDER}/items/**`),
    );
    this.watcher.push(
      watcher,
      watcher.onDidCreate(reload),
      watcher.onDidChange(reload),
      watcher.onDidDelete(reload),
    );
  }

  /**
   * Adds an item at the top, saved in the store. An item with the same `key` is replaced; with
   * `quiet`, it keeps its place (so a growing error list doesn't jump above what the user
   * captured last).
   */
  add(input: ContextInput, options: AddOptions = {}): ContextItem {
    const previous = input.key ? this.items.find((i) => i.key === input.key) : undefined;
    const keep = options.quiet && previous;
    const meta = writeItem(
      this.root,
      {
        kind: input.kind,
        title: input.title,
        detail: input.detail,
        url: input.url,
        // A capture sent again (same key) stays in its group.
        group: input.group ?? previous?.group,
        groupIndex: previous?.groupIndex,
        key: input.key,
        source: 'vscode',
        text: input.text,
        media: input.image
          ? { bytes: input.image.bytes, extension: extensionOf(input.image.mimeType) }
          : undefined,
        copyFrom: input.image ? undefined : input.file,
        time: keep ? previous.time : (this.lastTime = Math.max(Date.now(), this.lastTime + 1)),
        sentTo: keep ? previous.sentTo : [],
      },
      previous ? readItem(this.root, previous.id) : undefined,
    );
    const item = this.fromMeta(meta);
    this.items = [item, ...this.items.filter((i) => i.id !== item.id)].sort(
      (a, b) => b.time - a.time,
    );
    if (item.mimeType) this.onDidAddImageEmitter.fire(item);
    this.onDidChangeEmitter.fire();
    if (!options.quiet && !options.silent) this.onDidCaptureEmitter.fire(item);
    return item;
  }

  all(): readonly ContextItem[] {
    return this.items;
  }

  get(id: string): ContextItem | undefined {
    return this.items.find((i) => i.id === id);
  }

  /** The item captured last. */
  latest(): ContextItem | undefined {
    return [...this.items].sort((a, b) => b.time - a.time)[0];
  }

  remove(id: string): void {
    this.removeMany([id]);
  }

  /** What the last removal took (Clear all, a card, a group), for Undo: kept for a short while. */
  private removed?: { items: ContextItem[]; timer: ReturnType<typeof setTimeout> };

  removeMany(ids: readonly string[]): void {
    const gone = new Set(removeItems(this.root, ids));
    const items = this.items.filter((i) => gone.has(i.id));
    this.items = this.items.filter((i) => !gone.has(i.id));
    this.keepForUndo(items);
    this.onDidChangeEmitter.fire();
  }

  private keepForUndo(items: ContextItem[]): void {
    if (this.removed) clearTimeout(this.removed.timer);
    this.removed = undefined;
    if (!items.length) return;
    const root = this.root;
    const timer = setTimeout(() => {
      this.removed = undefined;
      emptyTrash(root, TRASH_MS);
      this.onDidChangeEmitter.fire();
    }, TRASH_MS + 1_000);
    this.removed = { items, timer };
  }

  /** "Removed 4 items", while the last removal can be undone. */
  undoLabel(): string | undefined {
    const count = this.removed?.items.length;
    if (!count) return undefined;
    return count === 1 ? `Removed "${this.removed!.items[0]!.title}"` : `Removed ${count} items`;
  }

  /** Puts back what the last removal took (it keeps its time, so its place). */
  undo(): ContextItem[] {
    const removed = this.removed;
    if (!removed) return [];
    clearTimeout(removed.timer);
    this.removed = undefined;
    const back = new Set(
      restoreItems(
        this.root,
        removed.items.map((i) => i.id),
      ),
    );
    this.load();
    return this.items.filter((i) => back.has(i.id));
  }

  /** The items of a group, in the order they were captured. */
  inGroup(group: string): ContextItem[] {
    return this.items
      .filter((i) => i.group === group)
      .sort(
        (a, b) =>
          (a.groupIndex ?? 0) - (b.groupIndex ?? 0) || a.time - b.time || (a.id < b.id ? -1 : 1),
      );
  }

  /**
   * Groups items by hand (the view's Group): they get a new group, placed where the newest of
   * them is. Returns the group, or undefined for fewer than two items.
   */
  group(ids: readonly string[]): string | undefined {
    const group = groupItems(this.root, ids);
    this.load();
    return group;
  }

  ungroup(group: string): void {
    ungroupItems(this.root, group);
    this.load();
  }

  clear(): void {
    this.removeMany(this.items.map((i) => i.id));
  }

  /** Records that an item went to an agent. */
  markSent(item: ContextItem, agent: string): void {
    const current = (item.project === this.root && this.get(item.id)) || item;
    if (current.sentTo.includes(agent)) return;
    current.sentTo = [...current.sentTo, agent];
    updateItem(item.project, item.id, (meta) => ({ ...meta, sentTo: current.sentTo }));
    this.onDidChangeEmitter.fire();
  }

  /** The item's file (images are saved as they are captured). */
  async fileOf(item: ContextItem): Promise<string | undefined> {
    return (this.get(item.id) ?? item).file;
  }

  /** Copies an item: its image (or file path), else its text. */
  async copy(item: ContextItem): Promise<void> {
    if (item.file && item.mimeType) {
      try {
        await copyImageBytes(new Uint8Array(await readFile(item.file)), item.mimeType);
        return;
      } catch {
        // Types the OS clipboard can't take: copy the file's path instead.
      }
    }
    await copyText(item.text ?? (item.file ? displayPath(item.file) : item.title));
  }

  /** The bytes of an item's thumbnail (its small JPEG, else the image itself). */
  async thumbnailOf(
    item: ContextItem,
  ): Promise<{ data: Uint8Array; mimeType: string } | undefined> {
    const path = item.thumb ?? (item.mimeType ? item.file : undefined);
    if (!path) return undefined;
    try {
      return {
        data: new Uint8Array(await readFile(path)),
        mimeType: item.thumb ? 'image/jpeg' : item.mimeType!,
      };
    } catch {
      return undefined;
    }
  }

  view(item: ContextItem): ContextItemView {
    return {
      id: item.id,
      kind: item.kind,
      title: item.title,
      detail: item.detail,
      // Element captures preview their elements' names; other text its first words.
      preview: item.text
        ? ((item.kind === 'element' ? elementSummary(item.text) : undefined) ??
          previewText(item.text))
        : undefined,
      image: !!item.mimeType,
      file: item.file ? displayPath(item.file) : undefined,
      url: item.url,
      time: item.time,
      sentTo: item.sentTo,
      group: item.group,
      groupIndex: item.groupIndex,
      // Captures from the browser say which; VS Code's own need no note.
      source: item.source === 'browser' ? (item.browser ?? 'Browser') : undefined,
    };
  }

  dispose(): void {
    if (this.removed) clearTimeout(this.removed.timer);
    clearTimeout(this.reloadTimer);
    for (const d of [...(this.watcher ?? []), ...this.disposables]) d.dispose();
    this.onDidChangeEmitter.dispose();
    this.onDidAddImageEmitter.dispose();
    this.onDidCaptureEmitter.dispose();
  }
}

let tray: ContextTray | undefined;
let inbox: string | undefined;

const PROJECT_KEY = 'vscodeBrowser.savedProject';

/** The Inbox this window saves into without a project (see defaultInbox). */
export function inboxPath(): string | undefined {
  return inbox;
}

/**
 * Creates the list (on activation), on the project picked in this workspace before (`memory`).
 * Captures of the old global-storage inbox move to the shared Inbox first.
 */
export function initContextTray(globalStorage: string, memory?: vscode.Memento): ContextTray {
  inbox = defaultInbox(globalStorage);
  migrateInbox(globalStorage);
  tray = new ContextTray(globalStorage);
  const picked = memory?.get<string>(PROJECT_KEY);
  if (picked && isFolder(picked)) tray.setProject(picked);
  if (memory) {
    tray.onDidChange(() => {
      const chosen = tray?.project !== tray?.defaultProject ? tray?.project : undefined;
      if (memory.get(PROJECT_KEY) !== chosen) void memory.update(PROJECT_KEY, chosen);
    });
  }
  return tray;
}

/**
 * Where captures go without a workspace folder: the Inbox the hub shares (Linux), else one in
 * global storage.
 */
function defaultInbox(globalStorage: string): string {
  return process.platform === 'linux' ? inboxFolder() : join(globalStorage, 'inbox');
}

/** Moves what the inbox in global storage held (older versions) to the shared Inbox. */
function migrateInbox(globalStorage: string): void {
  const old = join(globalStorage, 'inbox');
  const inbox = defaultInbox(globalStorage);
  if (old === inbox || !existsSync(join(old, STORE_FOLDER))) return;
  try {
    const ids = readItems(old).map((meta) => meta.id);
    if (ids.length) moveItems(old, inbox, ids);
  } catch {
    // Left where it was: still readable by picking that folder.
  }
}

function isFolder(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/** The Saved list. Captures add to it through `addContext`. */
export function contextTray(): ContextTray | undefined {
  return tray;
}

/** Adds a capture to the Saved list (a no-op before activation, as in unit tests). */
export function addContext(input: ContextInput, options?: AddOptions): ContextItem | undefined {
  return tray?.add(input, options);
}
