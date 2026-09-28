import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { copyImageBytes, copyText } from '../features/clipboard';
import { contextFolder } from '../features/context';
import { displayPath } from '../features/screenshots';
import { previewText, type ContextItemView, type ContextKind } from '../shared/agentContext';

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
}

export interface ContextItem extends ContextInput {
  id: string;
  time: number;
  sentTo: string[];
}

const MAX_ITEMS = 60;
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

  private trim(): void {
    this.items.length = Math.min(this.items.length, MAX_ITEMS);
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
    this.items = this.items.filter((i) => i.id !== id);
    this.onDidChangeEmitter.fire();
  }

  clear(): void {
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
    const path = join(folder, `${item.kind}-${Date.now()}.${extension}`);
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
      preview: item.text ? previewText(item.text) : undefined,
      image: !!item.image,
      file: item.file ? displayPath(item.file) : undefined,
      url: item.url,
      time: item.time,
      sentTo: item.sentTo,
    };
  }

  dispose(): void {
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
