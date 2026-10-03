// A project's captures: `<project>/.inkspect/items/<id>/` holds `item.json` and the item's files
// (image or recording, `context.md`, `thumb.jpg`). The hub writes the browser's captures, VS Code
// its own, and both read every item, so the store is plain files: each item is written in a
// temporary folder and renamed into place, and there is no shared index to lose updates in.
// Node only (no `vscode`).
import { randomBytes } from 'node:crypto';
import {
  copyFileSync,
  cpSync,
  existsSync,
  linkSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { basename, extname, join } from 'node:path';
import { ITEM_FILE, ITEM_ID, isItemMeta, type ItemKind, type ItemMeta } from '@inkspect/shared/hub';

/** The store's folder name, in a project. */
export const STORE_FOLDER = '.inkspect';
/** Removed items stay this long for Undo. */
export const TRASH_MS = 15_000;

/** The store folder of a project. */
export function storeDir(project: string): string {
  return join(project, STORE_FOLDER);
}

/** A new item id: the UTC time (sortable) and a random part. */
export function newItemId(now = Date.now()): string {
  const iso = new Date(now).toISOString(); // 2026-10-02T12:16:00.249Z
  const stamp = `${iso.slice(0, 10).replace(/-/g, '')}-${iso.slice(11, 19).replace(/:/g, '')}`;
  return `${stamp}-${randomBytes(3).toString('hex')}`;
}

/**
 * Creates the store if needed. Its `.gitignore` ignores everything in it, itself included, so
 * captures never end up in a commit. A store that is a symbolic link is refused (it could point
 * anywhere).
 */
export function ensureStore(project: string): string {
  const dir = storeDir(project);
  if (existsSync(dir) && lstatSync(dir).isSymbolicLink()) {
    throw new Error(`${dir} is a symbolic link`);
  }
  if (!storeFolder(project, 'items') || !storeFolder(project, '.trash')) {
    throw new Error(`${dir} holds a symbolic link`);
  }
  mkdirSync(join(dir, 'items'), { recursive: true });
  const ignore = join(dir, '.gitignore');
  if (!existsSync(ignore)) {
    writeFileSync(ignore, '# Inkspect captures: never committed.\n*\n');
  }
  return dir;
}

/** What a new item is made of. */
export interface NewItem {
  kind: ItemKind;
  title: string;
  detail?: string;
  url?: string;
  group?: string;
  groupIndex?: number;
  key?: string;
  source: 'browser' | 'vscode';
  browser?: string;
  /** Text for the agent (Markdown), saved as `context.md`. */
  text?: string;
  /** Image or recording bytes and their extension (png, jpg, webm...). */
  media?: { bytes: Uint8Array; extension: string };
  /** A file already saved elsewhere, copied in (a screenshot or recording). */
  copyFrom?: string;
  /** A small JPEG for lists. */
  thumb?: Uint8Array;
  time?: number;
  sentTo?: string[];
}

const PREVIEW_LENGTH = 300;

function extensionOf(name: string): string {
  const extension = extname(name).slice(1).toLowerCase();
  return /^[a-z0-9]{1,5}$/.test(extension) ? extension : 'bin';
}

/**
 * Writes an item and returns it. With `replace`, that item's id and folder are reused (a capture
 * sent again with the same key).
 */
export function writeItem(project: string, input: NewItem, replace?: ItemMeta): ItemMeta {
  const dir = ensureStore(project);
  const id = replace?.id ?? newItemId(input.time);
  const temp = join(dir, 'items', `.tmp-${id}-${randomBytes(3).toString('hex')}`);
  mkdirSync(temp, { recursive: true });
  try {
    const files: ItemMeta['files'] = {};
    if (input.media) {
      files.file = `capture.${extensionOf(`x.${input.media.extension}`)}`;
      writeFileSync(join(temp, files.file), input.media.bytes);
    } else if (input.copyFrom) {
      files.file = `capture.${extensionOf(input.copyFrom)}`;
      // A hard link when it can (the same disk): no second copy of a large recording.
      try {
        linkSync(input.copyFrom, join(temp, files.file));
      } catch {
        copyFileSync(input.copyFrom, join(temp, files.file));
      }
    }
    if (input.text) {
      files.text = 'context.md';
      writeFileSync(
        join(temp, files.text),
        input.text.endsWith('\n') ? input.text : `${input.text}\n`,
      );
    }
    if (input.thumb) {
      files.thumb = 'thumb.jpg';
      writeFileSync(join(temp, files.thumb), input.thumb);
    }
    const meta: ItemMeta = {
      v: 1,
      id,
      kind: input.kind,
      title: input.title.slice(0, 300),
      detail: input.detail?.slice(0, 1000),
      url: input.url?.slice(0, 4096),
      time: input.time ?? replace?.time ?? Date.now(),
      group: input.group,
      groupIndex: input.groupIndex,
      key: input.key?.slice(0, 200),
      source: input.source,
      browser: input.browser,
      preview: input.text ? input.text.slice(0, PREVIEW_LENGTH) : undefined,
      files,
      sentTo: input.sentTo ?? [],
    };
    writeFileSync(join(temp, 'item.json'), `${JSON.stringify(meta, null, 2)}\n`);
    const target = join(dir, 'items', id);
    if (existsSync(target)) {
      // Replaced in two renames; the old folder goes to the trash for a moment.
      const old = join(dir, '.trash', `${id}-replaced-${randomBytes(3).toString('hex')}`);
      mkdirSync(join(dir, '.trash'), { recursive: true });
      renameSync(target, old);
      renameSync(temp, target);
      rmSync(old, { recursive: true, force: true });
    } else {
      renameSync(temp, target);
    }
    return meta;
  } catch (error) {
    rmSync(temp, { recursive: true, force: true });
    throw error;
  }
}

/** An item's folder, or undefined for an id that isn't one. */
function itemDir(project: string, id: string): string | undefined {
  return ITEM_ID.test(id) ? join(storeDir(project), 'items', id) : undefined;
}

/** Reads one item; undefined if it is missing or not valid. */
export function readItem(project: string, id: string): ItemMeta | undefined {
  const dir = itemDir(project, id);
  if (!dir) return undefined;
  try {
    const value: unknown = JSON.parse(readFileSync(join(dir, 'item.json'), 'utf8'));
    if (!isItemMeta(value)) return undefined;
    const meta = value as ItemMeta;
    // The folder names the item: an item.json copied elsewhere doesn't count.
    return meta.id === id ? meta : undefined;
  } catch {
    return undefined;
  }
}

/** Every item of a project, newest first. Folders that aren't valid items are skipped. */
export function readItems(project: string): ItemMeta[] {
  const items = storeFolder(project, 'items');
  if (!items) return [];
  let names: string[];
  try {
    names = readdirSync(items);
  } catch {
    return [];
  }
  return names
    .filter((name) => ITEM_ID.test(name))
    .flatMap((id) => readItem(project, id) ?? [])
    .sort((a, b) => b.time - a.time || (b.id < a.id ? -1 : 1));
}

/** Changes an item's metadata (its files stay). Returns the new metadata. */
export function updateItem(
  project: string,
  id: string,
  change: (meta: ItemMeta) => ItemMeta,
): ItemMeta | undefined {
  const meta = readItem(project, id);
  const dir = itemDir(project, id);
  if (!meta || !dir) return undefined;
  const next = change(structuredClone(meta));
  next.id = id;
  const temp = join(dir, `.item-${randomBytes(3).toString('hex')}.json`);
  writeFileSync(temp, `${JSON.stringify(next, null, 2)}\n`);
  renameSync(temp, join(dir, 'item.json'));
  return next;
}

/**
 * A folder of the store that is really a folder: the store itself, `items` or `.trash`. A link
 * there (a cloned repository can contain one) is refused, so removing or emptying the trash can
 * never reach outside the project.
 */
function storeFolder(project: string, ...parts: string[]): string | undefined {
  let path = storeDir(project);
  for (const part of ['', ...parts]) {
    if (part) path = join(path, part);
    try {
      if (lstatSync(path).isSymbolicLink()) return undefined;
    } catch {
      // Not there yet: created below, as a real folder.
    }
  }
  return path;
}

/** Trash entries: removed items (`<id>`) and items replaced in place (`<id>-replaced-<hex>`). */
const TRASH_NAME = /^\d{8}-\d{6}-[0-9a-f]{6}(-replaced-[0-9a-f]{6})?$/;

/** Moves items to the trash (Undo can bring them back for a while). Returns the ids moved. */
export function removeItems(project: string, ids: readonly string[]): string[] {
  const trash = storeFolder(project, '.trash');
  if (!trash || !storeFolder(project, 'items')) return [];
  mkdirSync(trash, { recursive: true });
  const moved: string[] = [];
  const now = new Date();
  for (const id of ids) {
    const dir = itemDir(project, id);
    if (!dir || !existsSync(dir)) continue;
    rmSync(join(trash, id), { recursive: true, force: true });
    try {
      renameSync(dir, join(trash, id));
    } catch {
      continue; // Removed elsewhere meanwhile.
    }
    // A rename keeps the folder's time: the trash counts from now (see emptyTrash).
    utimesSync(join(trash, id), now, now);
    moved.push(id);
  }
  return moved;
}

/**
 * Moves items to another project's store (a capture saved in the wrong project). Copied when
 * the projects are on different disks. Returns the ids moved.
 */
export function moveItems(from: string, to: string, ids: readonly string[]): string[] {
  if (!storeFolder(from, 'items')) return [];
  ensureStore(to);
  const target = storeFolder(to, 'items');
  if (!target) return [];
  const moved: string[] = [];
  for (const id of ids) {
    const dir = itemDir(from, id);
    if (!dir || !existsSync(dir) || existsSync(join(target, id))) continue;
    try {
      renameSync(dir, join(target, id));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EXDEV') throw error;
      cpSync(dir, join(target, id), { recursive: true });
      rmSync(dir, { recursive: true, force: true });
    }
    moved.push(id);
  }
  return moved;
}

/** Brings removed items back from the trash. */
export function restoreItems(project: string, ids: readonly string[]): string[] {
  const trash = storeFolder(project, '.trash');
  if (!trash || !storeFolder(project, 'items')) return [];
  const restored: string[] = [];
  for (const id of ids) {
    const dir = itemDir(project, id);
    const trashed = join(trash, id);
    if (!dir || !existsSync(trashed) || existsSync(dir)) continue;
    renameSync(trashed, dir);
    restored.push(id);
  }
  return restored;
}

/**
 * Deletes what has been in the trash longer than `olderThanMs`: only entries named like trashed
 * items, and never through a link.
 */
export function emptyTrash(project: string, olderThanMs = TRASH_MS): void {
  const trash = storeFolder(project, '.trash');
  if (!trash) return;
  let names: string[];
  try {
    names = readdirSync(trash);
  } catch {
    return;
  }
  const now = Date.now();
  for (const name of names) {
    if (!TRASH_NAME.test(name)) continue;
    const path = join(trash, name);
    try {
      const stat = lstatSync(path);
      if (stat.isDirectory() && now - stat.mtimeMs >= olderThanMs) {
        rmSync(path, { recursive: true, force: true });
      }
    } catch {
      // Gone already.
    }
  }
}

/**
 * The absolute path of one of an item's files. Only names that are plain file names inside the
 * item's folder are followed (an edited item.json can't point elsewhere).
 */
export function itemFile(
  project: string,
  meta: ItemMeta,
  which: keyof ItemMeta['files'],
): string | undefined {
  const name = meta.files[which];
  const dir = itemDir(project, meta.id);
  if (!name || !dir || !ITEM_FILE.test(name) || basename(name) !== name) return undefined;
  const path = join(dir, name);
  try {
    return lstatSync(path).isFile() ? path : undefined;
  } catch {
    return undefined;
  }
}

/** An item's text, or undefined. */
export function readItemText(project: string, meta: ItemMeta): string | undefined {
  const path = itemFile(project, meta, 'text');
  try {
    return path ? readFileSync(path, 'utf8') : undefined;
  } catch {
    return undefined;
  }
}
