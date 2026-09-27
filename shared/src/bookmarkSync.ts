// Two-way bookmark sync between the VS Code extension (the hub, "local") and a browser profile
// ("remote"), as a pure three-way merge. VS Code keeps, per linked browser, the tree both sides
// last agreed on (the base) and a map between its ids and the browser's. Every sync, live or
// after reconnecting, runs the same merge: changes made on one side win, edit beats delete,
// and nodes added on both sides with the same URL (or folder title) in the same place pair up.

/** The two synced root folders; both sides use these ids for them. */
export const SYNC_ROOTS = ['bar', 'other'] as const;
export type SyncRootId = (typeof SYNC_ROOTS)[number];

/** A bookmark (with `url`) or folder (without), in a flat list with parent and position. */
export interface FlatNode {
  id: string;
  parentId: string;
  index: number;
  title: string;
  url?: string;
}

export interface SyncState {
  /** The merged tree after the last sync, in local ids. */
  base: FlatNode[];
  /** Local id → remote id. */
  idMap: Record<string, string>;
}

/** How to treat the very first sync of a link. */
export type FirstSyncMode = 'merge' | 'useRemote' | 'useLocal';

/** An operation for the browser. `parentId` is a remote id, a root, or `ref:<localId>`. */
export type RemoteOp =
  | { op: 'create'; ref: string; parentId: string; index: number; title: string; url?: string }
  | { op: 'update'; id: string; title: string; url?: string }
  | { op: 'move'; id: string; parentId: string; index: number }
  | { op: 'remove'; id: string };

export interface SyncResult {
  /** The merged tree in local ids (becomes the new base once the browser confirms). */
  tree: FlatNode[];
  /** What the browser must do to match `tree`. Creates report back remote ids by `ref`. */
  ops: RemoteOp[];
  /** Local id → remote id for everything that already exists in the browser. */
  idMap: Record<string, string>;
  /** Whether the local tree changed (VS Code must apply `tree`). */
  localChanged: boolean;
}

const isRoot = (id: string) => (SYNC_ROOTS as readonly string[]).includes(id);
const key = (n: FlatNode) => (n.url !== undefined ? `u:${n.url}` : `f:${n.title}`);

/** Children lists by parent, sorted by index. */
function childrenOf(tree: FlatNode[]): Map<string, FlatNode[]> {
  const map = new Map<string, FlatNode[]>();
  for (const node of tree) {
    const list = map.get(node.parentId) ?? [];
    list.push(node);
    map.set(node.parentId, list);
  }
  for (const list of map.values()) list.sort((a, b) => a.index - b.index);
  return map;
}

/** Nodes in parent-before-child order (roots' children first). */
function topDown(tree: FlatNode[]): FlatNode[] {
  const children = childrenOf(tree);
  const out: FlatNode[] = [];
  const visit = (parent: string) => {
    for (const child of children.get(parent) ?? []) {
      out.push(child);
      visit(child.id);
    }
  };
  for (const root of SYNC_ROOTS) visit(root);
  return out;
}

/** Keeps only nodes reachable from the roots and renumbers indexes 0..n per folder. */
export function normalize(tree: FlatNode[]): FlatNode[] {
  const children = childrenOf(tree);
  const out: FlatNode[] = [];
  const visit = (parent: string) => {
    (children.get(parent) ?? []).forEach((child, index) => {
      out.push({ ...child, index });
      if (child.url === undefined) visit(child.id);
    });
  };
  for (const root of SYNC_ROOTS) visit(root);
  return out;
}

let counter = 0;
/** New local ids for nodes that came from the browser. */
export const newLocalId = () =>
  `s${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/**
 * Merges the local tree and the browser's tree against the base.
 * `remote` uses the browser's ids (with `bar`/`other` for the two roots).
 */
export function syncTrees(
  state: SyncState | undefined,
  localTree: FlatNode[],
  remoteTree: FlatNode[],
  mode: FirstSyncMode = 'merge',
  makeId: () => string = newLocalId,
): SyncResult {
  const local = normalize(localTree);
  const remoteRaw = normalize(remoteTree);
  const idMap = { ...(state?.idMap ?? {}) };
  const reverse = new Map(Object.entries(idMap).map(([l, r]) => [r, l]));
  // Browser nodes in local ids; unknown ones get a temporary `r:` id.
  const toLocal = (remoteId: string) =>
    isRoot(remoteId) ? remoteId : (reverse.get(remoteId) ?? `r:${remoteId}`);
  let remote = remoteRaw.map((n) => ({ ...n, id: toLocal(n.id), parentId: toLocal(n.parentId) }));
  const baseTree = state ? normalize(state.base) : [];

  let merged: FlatNode[];
  if (!state && mode === 'useRemote') {
    merged = remote;
  } else if (!state && mode === 'useLocal') {
    merged = local;
  } else {
    remote = pairNewNodes(local, remote, baseTree, idMap);
    merged = threeWay(baseTree, local, remote);
  }

  // Give browser-only nodes real local ids.
  const renamed = new Map<string, string>();
  for (const node of merged) {
    if (node.id.startsWith('r:')) renamed.set(node.id, makeId());
  }
  const rename = (id: string) => renamed.get(id) ?? id;
  const tree = normalize(
    merged.map((n) => ({ ...n, id: rename(n.id), parentId: rename(n.parentId) })),
  );
  for (const [temp, id] of renamed) idMap[id] = temp.slice(2);
  remote = normalize(remote.map((n) => ({ ...n, id: rename(n.id), parentId: rename(n.parentId) })));

  const ops = remoteOps(remote, tree, idMap);
  // Afterwards, mappings only count for nodes that exist in both the result and the browser;
  // a node the browser deleted but the merge kept is being created again.
  const inTree = new Set(tree.map((n) => n.id));
  const inRemote = new Set(remote.map((n) => n.id));
  for (const id of Object.keys(idMap)) if (!inTree.has(id) || !inRemote.has(id)) delete idMap[id];

  return { tree, ops, idMap, localChanged: !sameTree(local, tree) };
}

/**
 * Nodes added on both sides since the base, with the same parent and URL (or folder title),
 * are the same node: give the browser's copy the local id (and remember the mapping).
 */
function pairNewNodes(
  local: FlatNode[],
  remote: FlatNode[],
  base: FlatNode[],
  idMap: Record<string, string>,
): FlatNode[] {
  const inBase = new Set(base.map((n) => n.id));
  const remoteIds = new Set(remote.map((n) => n.id));
  const unpairedLocal = new Map<string, FlatNode[]>();
  for (const node of local) {
    if (inBase.has(node.id) || remoteIds.has(node.id)) continue;
    const k = `${node.parentId}|${key(node)}`;
    unpairedLocal.set(k, [...(unpairedLocal.get(k) ?? []), node]);
  }
  const renames = new Map<string, string>();
  const result: FlatNode[] = [];
  for (const node of topDown(remote)) {
    const parentId = renames.get(node.parentId) ?? node.parentId;
    let id = node.id;
    if (id.startsWith('r:')) {
      const candidates = unpairedLocal.get(`${parentId}|${key(node)}`);
      const match = candidates?.shift();
      if (match) {
        renames.set(id, match.id);
        idMap[match.id] = id.slice(2);
        id = match.id;
      }
    }
    result.push({ ...node, id, parentId });
  }
  return result;
}

type Fields = Pick<FlatNode, 'parentId' | 'index' | 'title' | 'url'>;

function threeWay(base: FlatNode[], local: FlatNode[], remote: FlatNode[]): FlatNode[] {
  const B = new Map(base.map((n) => [n.id, n]));
  const L = new Map(local.map((n) => [n.id, n]));
  const R = new Map(remote.map((n) => [n.id, n]));
  const ids = new Set([...L.keys(), ...R.keys()]);
  const changed = (a: FlatNode | undefined, b: FlatNode | undefined) =>
    !a || !b || a.title !== b.title || a.url !== b.url || a.parentId !== b.parentId;

  const kept = new Map<string, Fields & { id: string; order: [number, number] }>();
  for (const id of ids) {
    const b = B.get(id);
    const l = L.get(id);
    const r = R.get(id);
    let chosen: FlatNode | undefined;
    let orderSide: FlatNode | undefined;
    if (l && r) {
      const pick = <K extends keyof Fields>(field: K): FlatNode[K] =>
        !b
          ? l[field]
          : l[field] === b[field]
            ? r[field]
            : r[field] === b[field]
              ? l[field]
              : r[field];
      chosen = { id, title: pick('title'), url: pick('url'), parentId: pick('parentId'), index: 0 };
      // Position: whichever side moved it (the browser wins a tie).
      const movedLocally = !b || l.parentId !== b.parentId || l.index !== b.index;
      const movedRemotely = !b || r.parentId !== b.parentId || r.index !== b.index;
      orderSide = movedRemotely || !movedLocally ? r : l;
      if (orderSide.parentId !== chosen.parentId)
        orderSide = chosen.parentId === l.parentId ? l : r;
    } else if (l) {
      // Deleted in the browser, unless it was new or edited here (edit beats delete).
      if (!b || changed(l, b)) chosen = orderSide = l;
    } else if (r) {
      if (!b || changed(r, b)) chosen = orderSide = r;
    }
    if (chosen && orderSide) {
      kept.set(id, { ...chosen, order: [orderSide.index, l && orderSide === l ? 0 : 1] });
    }
  }
  // A kept node needs its folder: bring back deleted ancestors.
  for (const node of [...kept.values()]) {
    let parentId = node.parentId;
    while (!isRoot(parentId) && !kept.has(parentId)) {
      const source = L.get(parentId) ?? R.get(parentId) ?? B.get(parentId);
      if (!source) break;
      kept.set(parentId, { ...source, order: [source.index, 0] });
      parentId = source.parentId;
    }
  }
  // Nodes whose folder no longer exists anywhere go to the root they were under... or "other".
  const out = [...kept.values()].map((n) => ({
    ...n,
    parentId: isRoot(n.parentId) || kept.has(n.parentId) ? n.parentId : 'other',
  }));
  out.sort(
    (a, b) => a.order[0] - b.order[0] || a.order[1] - b.order[1] || a.id.localeCompare(b.id),
  );
  return out.map(({ order: _order, ...n }, i) => ({ ...n, index: i }));
}

function sameTree(a: FlatNode[], b: FlatNode[]): boolean {
  if (a.length !== b.length) return false;
  const B = new Map(b.map((n) => [n.id, n]));
  return a.every((n) => {
    const m = B.get(n.id);
    return (
      !!m &&
      m.parentId === n.parentId &&
      m.index === n.index &&
      m.title === n.title &&
      m.url === n.url
    );
  });
}

/**
 * Operations that turn the browser's tree (`remote`, already in local ids) into `target`.
 * Order: removals, then per folder (top down) creations and moves in final order, then updates.
 */
function remoteOps(
  remote: FlatNode[],
  target: FlatNode[],
  idMap: Record<string, string>,
): RemoteOp[] {
  const ops: RemoteOp[] = [];
  const R = new Map(remote.map((n) => [n.id, n]));
  const T = new Map(target.map((n) => [n.id, n]));
  // Browser-only nodes still carry their browser id as `r:<id>`.
  const remoteId = (localId: string) =>
    isRoot(localId) ? localId : localId.startsWith('r:') ? localId.slice(2) : idMap[localId];
  // A folder that doesn't exist in the browser yet is created earlier in the same batch.
  const parentRef = (localId: string) =>
    isRoot(localId)
      ? localId
      : R.has(localId) && remoteId(localId)
        ? remoteId(localId)!
        : `ref:${localId}`;

  // Remove what the target no longer has (only the topmost node of a removed subtree).
  for (const node of remote) {
    if (T.has(node.id)) continue;
    if (!isRoot(node.parentId) && !T.has(node.parentId) && R.has(node.parentId)) continue;
    const id = remoteId(node.id);
    if (id) ops.push({ op: 'remove', id });
  }
  // Simulated browser folder contents, to only move what is out of place.
  const contents = new Map<string, string[]>();
  for (const [parent, list] of childrenOf(remote.filter((n) => T.has(n.id))).entries()) {
    contents.set(
      parent,
      list.map((n) => n.id),
    );
  }
  const children = childrenOf(target);
  const visit = (parent: string) => {
    const wanted = children.get(parent) ?? [];
    const current = contents.get(parent) ?? [];
    wanted.forEach((node, index) => {
      const existing = R.get(node.id);
      if (!existing || !remoteId(node.id)) {
        ops.push({
          op: 'create',
          ref: node.id,
          parentId: parentRef(parent),
          index,
          title: node.title,
          ...(node.url !== undefined ? { url: node.url } : {}),
        });
        current.splice(index, 0, node.id);
      } else if (current[index] !== node.id) {
        ops.push({ op: 'move', id: remoteId(node.id)!, parentId: parentRef(parent), index });
        // Take it out of wherever it is in the simulation, then insert it here.
        for (const list of contents.values()) {
          const at = list.indexOf(node.id);
          if (at !== -1) list.splice(at, 1);
        }
        const at = current.indexOf(node.id);
        if (at !== -1) current.splice(at, 1);
        current.splice(index, 0, node.id);
      }
      if (
        existing &&
        remoteId(node.id) &&
        (existing.title !== node.title || existing.url !== node.url)
      ) {
        ops.push({
          op: 'update',
          id: remoteId(node.id)!,
          title: node.title,
          ...(node.url !== undefined ? { url: node.url } : {}),
        });
      }
    });
    contents.set(parent, current);
    for (const node of wanted) if (node.url === undefined) visit(node.id);
  };
  for (const root of SYNC_ROOTS) visit(root);
  return ops;
}

/**
 * Applies `ops` to a tree in the browser's ids (used by tests and by the browser side's
 * simulation). Returns the new tree and the ids given to created nodes, by `ref`.
 */
export function applyRemoteOps(
  tree: FlatNode[],
  ops: RemoteOp[],
  makeId: () => string,
): { tree: FlatNode[]; created: Record<string, string> } {
  const created: Record<string, string> = {};
  const nodes = new Map(tree.map((n) => [n.id, { ...n }]));
  const resolve = (id: string) => (id.startsWith('ref:') ? created[id.slice(4)]! : id);
  const siblings = (parent: string) =>
    [...nodes.values()].filter((n) => n.parentId === parent).sort((a, b) => a.index - b.index);
  const place = (node: FlatNode, parent: string, index: number) => {
    const list = siblings(parent).filter((n) => n.id !== node.id);
    list.splice(Math.min(index, list.length), 0, node);
    node.parentId = parent;
    list.forEach((n, i) => (n.index = i));
  };
  const removeTree = (id: string) => {
    for (const child of [...nodes.values()].filter((n) => n.parentId === id)) removeTree(child.id);
    nodes.delete(id);
  };
  for (const op of ops) {
    if (op.op === 'create') {
      const id = makeId();
      created[op.ref] = id;
      const node: FlatNode = { id, parentId: '', index: 0, title: op.title, url: op.url };
      nodes.set(id, node);
      place(node, resolve(op.parentId), op.index);
    } else if (op.op === 'update') {
      const node = nodes.get(op.id);
      if (node) Object.assign(node, { title: op.title, url: op.url });
    } else if (op.op === 'move') {
      const node = nodes.get(op.id);
      if (node) place(node, resolve(op.parentId), op.index);
    } else {
      const parent = nodes.get(op.id)?.parentId;
      removeTree(op.id);
      if (parent) siblings(parent).forEach((n, i) => (n.index = i));
    }
  }
  return { tree: normalize([...nodes.values()]), created };
}
