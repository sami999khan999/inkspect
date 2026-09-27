import { randomUUID } from 'node:crypto';
import { join } from 'node:path';
import * as vscode from 'vscode';
import {
  allBookmarks,
  BAR_ID,
  emptyRoots,
  findByUrl,
  findNode,
  moveNode,
  OTHER_ID,
  removeNode,
  type BookmarkNode,
  walk,
  type BookmarkRoots,
} from '../shared/bookmarks';
import type { FlatNode } from '@inkspect/shared/bookmarkSync';
import { toNetscapeHtml, type ExportNode, type ImportedNode } from './bookmarkFormats';
import { JsonStore } from './jsonStore';

/** The flat list stored by the first version (in global state). */
const LEGACY_KEY = 'vscodeBrowser.bookmarks';

/** Bookmarks in two root folders (bookmarks bar, other bookmarks), saved in global storage. */
export class BookmarksStore implements vscode.Disposable {
  private readonly store: JsonStore<BookmarkRoots>;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;

  constructor(storageDir: string, memento: vscode.Memento) {
    this.store = new JsonStore({
      file: join(storageDir, 'bookmarks.json'),
      version: 1,
      defaults: emptyRoots,
    });
    this.migrateLegacy(memento);
  }

  get roots(): BookmarkRoots {
    return this.store.data;
  }

  /** Every bookmark, flattened. */
  list(): BookmarkNode[] {
    return allBookmarks(this.roots);
  }

  findByUrl(url: string): BookmarkNode | undefined {
    return findByUrl(this.roots, url);
  }

  /** Adds a bookmark to a folder (the bookmarks bar by default), or updates an existing one. */
  add(page: { url: string; title: string; favicon?: string }, parentId = BAR_ID): BookmarkNode {
    const existing = this.findByUrl(page.url);
    if (existing) {
      this.change(() => {
        existing.title = page.title || existing.title;
        existing.favicon = page.favicon ?? existing.favicon;
      });
      return existing;
    }
    const node: BookmarkNode = {
      id: randomUUID(),
      type: 'bookmark',
      title: page.title || page.url,
      url: page.url,
      favicon: page.favicon,
      createdAt: Date.now(),
    };
    this.change((roots) => {
      const parent = findNode(roots, parentId)?.node ?? roots.bar;
      (parent.children ??= []).push(node);
    });
    return node;
  }

  addFolder(parentId: string, title: string): BookmarkNode {
    const folder: BookmarkNode = {
      id: randomUUID(),
      type: 'folder',
      title: title || 'New folder',
      createdAt: Date.now(),
      children: [],
    };
    this.change((roots) => {
      const parent = findNode(roots, parentId)?.node ?? roots.other;
      (parent.children ??= []).push(folder);
    });
    return folder;
  }

  update(id: string, changes: { title?: string; url?: string }): void {
    this.change((roots) => {
      const node = findNode(roots, id)?.node;
      if (!node || node.id === BAR_ID || node.id === OTHER_ID) return;
      if (changes.title !== undefined) node.title = changes.title;
      if (changes.url !== undefined && node.type === 'bookmark') node.url = changes.url;
    });
  }

  move(id: string, parentId: string, index?: number): void {
    this.change((roots) => void moveNode(roots, id, parentId, index));
  }

  remove(id: string): void {
    this.change((roots) => void removeNode(roots, id));
  }

  /** Adds imported bookmarks as a new folder inside `parentId`. Returns the number of bookmarks. */
  importNodes(nodes: ImportedNode[], folderTitle: string, parentId = BAR_ID): number {
    let count = 0;
    const convert = (node: ImportedNode): BookmarkNode => {
      if (node.url !== undefined) {
        count++;
        return {
          id: randomUUID(),
          type: 'bookmark',
          title: node.title,
          url: node.url,
          createdAt: node.addedAt ?? Date.now(),
        };
      }
      return {
        id: randomUUID(),
        type: 'folder',
        title: node.title,
        createdAt: Date.now(),
        children: (node.children ?? []).map(convert),
      };
    };
    const folder = convert({ title: folderTitle, children: nodes });
    this.change((roots) => {
      const parent = findNode(roots, parentId)?.node ?? roots.bar;
      (parent.children ??= []).push(folder);
    });
    return count;
  }

  /** Both root folders as a flat list, for bookmark sync (roots are `bar` and `other`). */
  flatTree(): FlatNode[] {
    const out: FlatNode[] = [];
    const visit = (folder: BookmarkNode) =>
      (folder.children ?? []).forEach((node, index) => {
        out.push({
          id: node.id,
          parentId: folder.id,
          index,
          title: node.title,
          ...(node.type === 'bookmark' ? { url: node.url ?? '' } : {}),
        });
        if (node.type === 'folder') visit(node);
      });
    visit(this.roots.bar);
    visit(this.roots.other);
    return out;
  }

  /**
   * Replaces both root folders with a synced tree. Nodes keep their favicon and creation time
   * when their id already existed.
   */
  replaceTree(flat: FlatNode[]): void {
    const known = new Map<string, BookmarkNode>();
    walk(this.roots, (node) => void known.set(node.id, node));
    const byParent = new Map<string, FlatNode[]>();
    for (const node of flat)
      byParent.set(node.parentId, [...(byParent.get(node.parentId) ?? []), node]);
    const build = (parentId: string): BookmarkNode[] =>
      (byParent.get(parentId) ?? [])
        .sort((a, b) => a.index - b.index)
        .map((node) => {
          const old = known.get(node.id);
          return node.url !== undefined
            ? {
                id: node.id,
                type: 'bookmark' as const,
                title: node.title,
                url: node.url,
                favicon: old?.url === node.url ? old.favicon : undefined,
                createdAt: old?.createdAt ?? Date.now(),
              }
            : {
                id: node.id,
                type: 'folder' as const,
                title: node.title,
                createdAt: old?.createdAt ?? Date.now(),
                children: build(node.id),
              };
        });
    this.change((roots) => {
      roots.bar.children = build(BAR_ID);
      roots.other.children = build(OTHER_ID);
    });
  }

  exportHtml(): string {
    const convert = (node: BookmarkNode): ExportNode => ({
      title: node.title,
      url: node.type === 'bookmark' ? node.url : undefined,
      createdAt: node.createdAt || undefined,
      children: node.children?.map(convert),
    });
    return toNetscapeHtml([convert(this.roots.bar), convert(this.roots.other)]);
  }

  dispose(): void {
    this.store.flushSync();
    this.onDidChangeEmitter.dispose();
  }

  private change(mutate: (roots: BookmarkRoots) => void): void {
    this.store.update((roots) => void mutate(roots));
    this.onDidChangeEmitter.fire();
  }

  private migrateLegacy(memento: vscode.Memento): void {
    const legacy =
      memento.get<{ url: string; title: string; favicon?: string; createdAt: number }[]>(
        LEGACY_KEY,
      );
    if (!legacy?.length) return;
    this.change((roots) => {
      for (const old of legacy) {
        if (findByUrl(roots, old.url)) continue;
        roots.bar.children!.push({
          id: randomUUID(),
          type: 'bookmark',
          title: old.title,
          url: old.url,
          favicon: old.favicon,
          createdAt: old.createdAt,
        });
      }
    });
    void memento.update(LEGACY_KEY, undefined);
  }
}
