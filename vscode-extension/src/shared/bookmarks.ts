// Bookmark data model and tree operations. Pure functions, shared by the host and the webview.

export interface BookmarkNode {
  id: string;
  type: 'folder' | 'bookmark';
  title: string;
  /** Bookmarks only. */
  url?: string;
  favicon?: string;
  createdAt: number;
  /** Folders only. */
  children?: BookmarkNode[];
}

export interface BookmarkRoots {
  bar: BookmarkNode;
  other: BookmarkNode;
}

export const BAR_ID = 'bar';
export const OTHER_ID = 'other';

/** What a bookmark shows: its title, or its address without the scheme and "www." when untitled. */
export function bookmarkLabel(node: Pick<BookmarkNode, 'title' | 'url'>): string {
  if (node.title.trim()) return node.title;
  return (node.url ?? '').replace(/^[a-z]+:\/\/(www\.)?/i, '').replace(/\/$/, '');
}

export function emptyRoots(): BookmarkRoots {
  return {
    bar: { id: BAR_ID, type: 'folder', title: 'Bookmarks bar', createdAt: 0, children: [] },
    other: { id: OTHER_ID, type: 'folder', title: 'Other bookmarks', createdAt: 0, children: [] },
  };
}

/** Calls `visit` for every node below the roots, with its parent. Stops when it returns true. */
export function walk(
  roots: BookmarkRoots,
  visit: (node: BookmarkNode, parent: BookmarkNode) => boolean | void,
): void {
  const stack: [BookmarkNode, BookmarkNode][] = [];
  for (const root of [roots.bar, roots.other]) {
    for (const child of [...(root.children ?? [])].reverse()) stack.push([child, root]);
  }
  while (stack.length) {
    const [node, parent] = stack.pop()!;
    if (visit(node, parent)) return;
    for (const child of [...(node.children ?? [])].reverse()) stack.push([child, node]);
  }
}

export function findNode(
  roots: BookmarkRoots,
  id: string,
): { node: BookmarkNode; parent?: BookmarkNode } | undefined {
  if (id === BAR_ID) return { node: roots.bar };
  if (id === OTHER_ID) return { node: roots.other };
  let found: { node: BookmarkNode; parent: BookmarkNode } | undefined;
  walk(roots, (node, parent) => {
    if (node.id === id) found = { node, parent };
    return !!found;
  });
  return found;
}

export function findByUrl(roots: BookmarkRoots, url: string): BookmarkNode | undefined {
  let found: BookmarkNode | undefined;
  walk(roots, (node) => {
    if (node.type === 'bookmark' && node.url === url) found = node;
    return !!found;
  });
  return found;
}

/** Every bookmark (not folder), depth first. */
export function allBookmarks(roots: BookmarkRoots): BookmarkNode[] {
  const result: BookmarkNode[] = [];
  walk(roots, (node) => {
    if (node.type === 'bookmark') result.push(node);
  });
  return result;
}

/** Folders with their depth, for folder pickers. Includes both roots. */
export function folderList(roots: BookmarkRoots): { id: string; title: string; depth: number }[] {
  const result: { id: string; title: string; depth: number }[] = [];
  const add = (folder: BookmarkNode, depth: number) => {
    result.push({ id: folder.id, title: folder.title, depth });
    for (const child of folder.children ?? []) {
      if (child.type === 'folder') add(child, depth + 1);
    }
  };
  add(roots.bar, 0);
  add(roots.other, 0);
  return result;
}

export function isDescendant(ancestor: BookmarkNode, id: string): boolean {
  for (const child of ancestor.children ?? []) {
    if (child.id === id || isDescendant(child, id)) return true;
  }
  return false;
}

/**
 * Moves a node into `parentId` at `index` (end if omitted). Refuses to move a folder into itself
 * or to move a root. Returns whether anything changed.
 */
export function moveNode(
  roots: BookmarkRoots,
  id: string,
  parentId: string,
  index?: number,
): boolean {
  const source = findNode(roots, id);
  const target = findNode(roots, parentId);
  if (!source?.parent || !target || target.node.type !== 'folder') return false;
  if (source.node.id === parentId || isDescendant(source.node, parentId)) return false;
  const siblings = source.parent.children!;
  const from = siblings.indexOf(source.node);
  siblings.splice(from, 1);
  const children = (target.node.children ??= []);
  let at = index ?? children.length;
  // Moving within the same folder: the removal shifted later positions left by one.
  if (source.parent === target.node && index !== undefined && from < index) at--;
  children.splice(Math.max(0, Math.min(at, children.length)), 0, source.node);
  return true;
}

export function removeNode(roots: BookmarkRoots, id: string): boolean {
  const found = findNode(roots, id);
  if (!found?.parent) return false;
  found.parent.children = found.parent.children!.filter((child) => child !== found.node);
  return true;
}

/** Case-insensitive search over bookmark titles and URLs. */
export function searchBookmarks(roots: BookmarkRoots, query: string): BookmarkNode[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return allBookmarks(roots);
  return allBookmarks(roots).filter(
    (b) => b.title.toLowerCase().includes(needle) || (b.url ?? '').toLowerCase().includes(needle),
  );
}
