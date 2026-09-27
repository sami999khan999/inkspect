// The browser half of bookmark sync: reads the bookmark tree as a flat list with `bar`/`other`
// roots, and applies the operations VS Code computes (see @inkspect/shared/bookmarkSync).
import type { FlatNode, RemoteOp } from '@inkspect/shared/bookmarkSync';

type TreeNode = chrome.bookmarks.BookmarkTreeNode & {
  /** Chrome 134+: which kind of root this is, and whether it syncs with the Google account. */
  folderType?: string;
  syncing?: boolean;
  /** Firefox: 'bookmark' | 'folder' | 'separator'. */
  type?: string;
};

/**
 * The two synced roots. Signed-in Chrome has account roots (which sync to the Google account)
 * next to local ones; the account's are preferred so bookmarks also reach other devices.
 */
export async function syncRoots(): Promise<{ bar: string; other: string }> {
  const [root] = (await chrome.bookmarks.getTree()) as TreeNode[];
  const kids = (root?.children ?? []) as TreeNode[];
  const find = (folderType: string, fallbacks: string[]) => {
    const typed = kids.filter((k) => k.folderType === folderType);
    return (
      typed.find((k) => k.syncing) ??
      typed[0] ??
      kids.find((k) => fallbacks.includes(k.id)) ??
      undefined
    );
  };
  const bar = find('bookmarks-bar', ['1', 'toolbar_____']) ?? kids[0];
  const other = find('other', ['2', 'unfiled_____']) ?? kids[1] ?? kids[0];
  if (!bar || !other) throw new Error('No bookmark folders found');
  return { bar: bar.id, other: other.id };
}

/** The synced part of the bookmark tree as a flat list. */
export async function snapshot(): Promise<FlatNode[]> {
  const roots = await syncRoots();
  const out: FlatNode[] = [];
  const visit = (parentId: string, children: TreeNode[]) => {
    let index = 0;
    for (const child of children) {
      if (child.type === 'separator') continue;
      out.push({
        id: child.id,
        parentId,
        index: index++,
        title: child.title,
        ...(child.url !== undefined ? { url: child.url } : {}),
      });
      if (child.url === undefined) visit(child.id, (child.children ?? []) as TreeNode[]);
    }
  };
  for (const [rootId, realId] of [
    ['bar', roots.bar],
    ['other', roots.other],
  ] as const) {
    const [node] = (await chrome.bookmarks.getSubTree(realId)) as TreeNode[];
    visit(rootId, (node?.children ?? []) as TreeNode[]);
  }
  return out;
}

/**
 * Applies VS Code's operations. Returns the ids of created nodes by `ref` and the operations
 * that failed (a later sync corrects any difference).
 */
export async function applyOps(
  ops: RemoteOp[],
): Promise<{ created: Record<string, string>; failed: string[] }> {
  const roots = await syncRoots();
  const created: Record<string, string> = {};
  const failed: string[] = [];
  const resolve = (id: string) =>
    id === 'bar'
      ? roots.bar
      : id === 'other'
        ? roots.other
        : id.startsWith('ref:')
          ? created[id.slice(4)]
          : id;
  for (const op of ops) {
    try {
      if (op.op === 'create') {
        const parentId = resolve(op.parentId);
        if (!parentId) throw new Error('parent missing');
        const node = await chrome.bookmarks.create({
          parentId,
          index: op.index,
          title: op.title,
          url: op.url,
        });
        created[op.ref] = node.id;
      } else if (op.op === 'update') {
        await chrome.bookmarks.update(
          op.id,
          op.url !== undefined ? { title: op.title, url: op.url } : { title: op.title },
        );
      } else if (op.op === 'move') {
        const parentId = resolve(op.parentId);
        if (!parentId) throw new Error('parent missing');
        const [node] = await chrome.bookmarks.get(op.id);
        let index = op.index;
        // Chromium counts the target index before taking the node out of the same folder.
        if (__BROWSER__ === 'chrome' && node?.parentId === parentId && (node.index ?? 0) < index)
          index++;
        await chrome.bookmarks.move(op.id, { parentId, index });
      } else {
        await chrome.bookmarks.removeTree(op.id).catch(() => chrome.bookmarks.remove(op.id));
      }
    } catch (error) {
      failed.push(`${op.op}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  return { created, failed };
}
