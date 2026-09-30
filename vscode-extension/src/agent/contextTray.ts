import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { copyImageBytes, copyText } from '../features/clipboard';
import { contextFolder } from '../features/context';
import { displayPath } from '../features/screenshots';
import {
  elementSummary,
  previewText,
  type ContextItemView,
  type ContextKind,
} from '../shared/agentContext';

/** What a capture adds to the Agent Context list. */
export interface ContextInput {
  kind: ContextKind;
  title: string;
  detail?: string;
  /** The text sent to the agent (Markdown). */
  text?: string;
  /** An image kept in memory until it is sent (then written to a file). */
  image?: { bytes: Uint8Array; mimeType: string };
  /** A file already saved (a screenshot or recording). */
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

export interface ContextItem extends ContextInput {
  id: string;
  time: number;
  sentTo: string[];
}

const MAX_ITEMS = 60;
/** How long a removal can be undone. */
const UNDO_MS = 15_000;
/** Images older than this many items drop their bytes (their file stays, if any). */
const MAX_IMAGES = 20;

/**
 * The Agent Context list: everything captured in the browser, newest first, ready to send to an
 * agent. It lives for the VS Code session.
 */
export class ContextTray implements vscode.Disposable {
  private items: ContextItem[] = [];
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;
  private readonly onDidAddImageEmitter = new vscode.EventEmitter<ContextItem>();
  /** An item with an image was added (the view fetches its thumbnail). */
  readonly onDidAddImage = this.onDidAddImageEmitter.event;

  constructor(private readonly globalStorage: string) {}

  /**
   * Adds an item at the top. An item with the same `key` is replaced; with `quiet`, it keeps its
   * place (so a growing error list doesn't jump above what the user captured last).
   */
  add(input: ContextInput, options: { quiet?: boolean } = {}): ContextItem {
    const index = input.key ? this.items.findIndex((i) => i.key === input.key) : -1;
    const previous = index >= 0 ? this.items[index] : undefined;
    const item: ContextItem = {
      ...input,
      // A capture sent again (same key) stays in its group.
      group: input.group ?? previous?.group,
      id: previous?.id ?? randomUUID(),
      time: options.quiet && previous ? previous.time : Date.now(),
      sentTo: previous && options.quiet ? previous.sentTo : [],
    };
    if (previous && options.quiet) this.items[index] = item;
    else {
      if (index >= 0) this.items.splice(index, 1);
      this.items.unshift(item);
    }
    this.trim();
    if (item.image) this.onDidAddImageEmitter.fire(item);
    this.onDidChangeEmitter.fire();
    return item;
  }

  /** Keeps the newest MAX_ITEMS; a group is kept or dropped whole, never cut in half. */
  private trim(): void {
    if (this.items.length > MAX_ITEMS) {
      // A group reaching past the limit goes whole, unless it holds the newest item (which
      // always stays).
      const dropped = new Set(this.items.slice(MAX_ITEMS).map((i) => i.group));
      dropped.delete(this.items[0]!.group);
      dropped.delete(undefined);
      this.items = this.items.filter(
        (item, index) => index < MAX_ITEMS && !(item.group && dropped.has(item.group)),
      );
    }
    let images = 0;
    for (const item of this.items) {
      if (item.image && ++images > MAX_IMAGES && item.file) item.image = undefined;
    }
  }

  all(): readonly ContextItem[] {
    return this.items;
  }

  get(id: string): ContextItem | undefined {
    return this.items.find((i) => i.id === id);
  }

  /** The item captured last (updates of kept items don't count). */
  latest(): ContextItem | undefined {
    return [...this.items].sort((a, b) => b.time - a.time)[0];
  }

  remove(id: string): void {
    this.removeMany([id]);
  }

  removeMany(ids: readonly string[]): void {
    const gone = new Set(ids);
    this.keepForUndo(this.items.filter((i) => gone.has(i.id)));
    this.items = this.items.filter((i) => !gone.has(i.id));
    this.onDidChangeEmitter.fire();
  }

  /**
   * What the last removal took (Clear all, a card, a group), for Undo: kept for a short while,
   * then gone (the list is the only place in-memory screenshots live).
   */
  private removed?: {
    items: ContextItem[];
    before: ContextItem[];
    timer: ReturnType<typeof setTimeout>;
  };

  private keepForUndo(items: ContextItem[]): void {
    if (this.removed) clearTimeout(this.removed.timer);
    this.removed = undefined;
    if (!items.length) return;
    const timer = setTimeout(() => {
      this.removed = undefined;
      this.onDidChangeEmitter.fire();
    }, UNDO_MS);
    this.removed = { items, before: [...this.items], timer };
  }

  /** "Removed 4 items", while the last removal can be undone. */
  undoLabel(): string | undefined {
    const count = this.removed?.items.length;
    if (!count) return undefined;
    return count === 1 ? `Removed "${this.removed!.items[0]!.title}"` : `Removed ${count} items`;
  }

  /** Puts back what the last removal took, where it was (anything captured since stays on top). */
  undo(): ContextItem[] {
    const removed = this.removed;
    if (!removed) return [];
    clearTimeout(removed.timer);
    this.removed = undefined;
    const back = new Set(removed.items.map((i) => i.id));
    const now = new Set(this.items.map((i) => i.id));
    const before = new Set(removed.before.map((i) => i.id));
    const added = this.items.filter((i) => !before.has(i.id));
    this.items = [...added, ...removed.before.filter((i) => back.has(i.id) || now.has(i.id))];
    this.trim();
    this.onDidChangeEmitter.fire();
    return removed.items;
  }

  /** The items of a group, oldest first (the order they were captured in). */
  inGroup(group: string): ContextItem[] {
    return this.items.filter((i) => i.group === group).reverse();
  }

  /**
   * Groups items by hand (the view's Group): they get a new group, placed where the newest of
   * them is. Returns the group, or undefined for fewer than two items.
   */
  group(ids: readonly string[]): string | undefined {
    const members = this.items.filter((i) => ids.includes(i.id));
    if (members.length < 2) return undefined;
    const group = randomUUID();
    const newest = Math.max(...members.map((m) => m.time));
    for (const member of members) {
      member.group = group;
      member.time = newest;
    }
    // Together in the list, at the newest one's place.
    const first = this.items.findIndex((i) => members.includes(i));
    const rest = this.items.filter((i) => !members.includes(i));
    rest.splice(first, 0, ...members);
    this.items = rest;
    this.onDidChangeEmitter.fire();
    return group;
  }

  ungroup(group: string): void {
    for (const item of this.items) if (item.group === group) item.group = undefined;
    this.onDidChangeEmitter.fire();
  }

  clear(): void {
    this.keepForUndo(this.items);
    this.items = [];
    this.onDidChangeEmitter.fire();
  }

  /** Records that an item went to an agent. */
  markSent(item: ContextItem, agent: string): void {
    if (!item.sentTo.includes(agent)) item.sentTo.push(agent);
    this.onDidChangeEmitter.fire();
  }

  /** The item's file, writing its image first when it has none yet. */
  async fileOf(item: ContextItem): Promise<string | undefined> {
    if (item.file || !item.image) return item.file;
    const folder = contextFolder(this.globalStorage);
    await mkdir(folder, { recursive: true });
    const extension = item.image.mimeType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'png';
    // The id keeps images written in the same millisecond (a group) apart.
    const path = join(folder, `${item.kind}-${Date.now()}-${item.id.slice(0, 8)}.${extension}`);
    await writeFile(path, item.image.bytes);
    item.file = path;
    this.onDidChangeEmitter.fire();
    return path;
  }

  /** Copies an item: its image (or file path), else its text. */
  async copy(item: ContextItem): Promise<void> {
    if (item.image) {
      try {
        await copyImageBytes(item.image.bytes, item.image.mimeType);
        return;
      } catch {
        // Types the OS clipboard can't take: copy the file's path instead.
      }
    }
    const file = await this.fileOf(item);
    await copyText(item.text ?? (file ? displayPath(file) : item.title));
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
      image: !!item.image,
      file: item.file ? displayPath(item.file) : undefined,
      url: item.url,
      time: item.time,
      sentTo: item.sentTo,
      group: item.group,
    };
  }

  dispose(): void {
    if (this.removed) clearTimeout(this.removed.timer);
    this.onDidChangeEmitter.dispose();
    this.onDidAddImageEmitter.dispose();
  }
}

let tray: ContextTray | undefined;

/** Creates the list (on activation). */
export function initContextTray(globalStorage: string): ContextTray {
  tray = new ContextTray(globalStorage);
  return tray;
}

/** The Agent Context list. Captures add to it through `addContext`. */
export function contextTray(): ContextTray | undefined {
  return tray;
}

/** Adds a capture to the Agent Context list (a no-op before activation, as in unit tests). */
export function addContext(
  input: ContextInput,
  options?: { quiet?: boolean },
): ContextItem | undefined {
  return tray?.add(input, options);
}
