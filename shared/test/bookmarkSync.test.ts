import { describe, expect, it } from 'vitest';
import {
  applyRemoteOps,
  normalize,
  syncTrees,
  type FirstSyncMode,
  type FlatNode,
  type SyncState,
} from '../src/bookmarkSync';

const bm = (
  id: string,
  parentId: string,
  index: number,
  title: string,
  url = `https://${title}.dev/`,
): FlatNode => ({
  id,
  parentId,
  index,
  title,
  url,
});
const folder = (id: string, parentId: string, index: number, title: string): FlatNode => ({
  id,
  parentId,
  index,
  title,
});

let seq = 0;
const localIds = () => `L${++seq}`;
const remoteIds = () => `R${++seq}`;

/** One full sync round: VS Code merges, the browser applies the ops and reports created ids. */
function round(
  state: SyncState | undefined,
  local: FlatNode[],
  remote: FlatNode[],
  mode?: FirstSyncMode,
) {
  const result = syncTrees(state, local, remote, mode, localIds);
  const applied = applyRemoteOps(remote, result.ops, remoteIds);
  const idMap = { ...result.idMap };
  for (const [ref, id] of Object.entries(applied.created)) idMap[ref] = id;
  return { result, state: { base: result.tree, idMap }, local: result.tree, remote: applied.tree };
}

/** The browser tree expressed in local ids (to compare with the merged tree). */
function inLocalIds(remote: FlatNode[], idMap: Record<string, string>): FlatNode[] {
  const reverse = new Map(Object.entries(idMap).map(([l, r]) => [r, l]));
  const map = (id: string) => (id === 'bar' || id === 'other' ? id : (reverse.get(id) ?? `?${id}`));
  return normalize(remote.map((n) => ({ ...n, id: map(n.id), parentId: map(n.parentId) })));
}

const titles = (tree: FlatNode[], parent = 'bar') =>
  tree
    .filter((n) => n.parentId === parent)
    .sort((a, b) => a.index - b.index)
    .map((n) => n.title);

function expectConverged(state: SyncState, local: FlatNode[], remote: FlatNode[]) {
  expect(inLocalIds(remote, state.idMap)).toEqual(normalize(local));
  const again = syncTrees(state, local, remote, 'merge', localIds);
  expect(again.ops).toEqual([]);
  expect(again.localChanged).toBe(false);
}

describe('first sync', () => {
  it('pairs identical trees without duplicating or changing anything', () => {
    const local = [
      bm('a', 'bar', 0, 'alpha'),
      folder('f', 'bar', 1, 'Docs'),
      bm('b', 'f', 0, 'beta'),
    ];
    const remote = [
      bm('1', 'bar', 0, 'alpha'),
      folder('2', 'bar', 1, 'Docs'),
      bm('3', '2', 0, 'beta'),
    ];
    const { result, state } = round(undefined, local, remote);
    expect(result.ops).toEqual([]);
    expect(result.localChanged).toBe(false);
    expect(state.idMap).toEqual({ a: '1', f: '2', b: '3' });
  });

  it('merges different trees into their union', () => {
    const local = [bm('a', 'bar', 0, 'alpha')];
    const remote = [bm('1', 'bar', 0, 'beta'), bm('2', 'other', 0, 'gamma')];
    const r = round(undefined, local, remote);
    expect(titles(r.local).sort()).toEqual(['alpha', 'beta']);
    expect(titles(r.local, 'other')).toEqual(['gamma']);
    expectConverged(r.state, r.local, r.remote);
  });

  it("can take the browser's tree or VS Code's tree instead", () => {
    const local = [bm('a', 'bar', 0, 'alpha')];
    const remote = [bm('1', 'bar', 0, 'beta')];
    const useRemote = round(undefined, local, remote, 'useRemote');
    expect(titles(useRemote.local)).toEqual(['beta']);
    expectConverged(useRemote.state, useRemote.local, useRemote.remote);
    const useLocal = round(undefined, local, remote, 'useLocal');
    expect(titles(useLocal.remote)).toEqual(['alpha']);
    expectConverged(useLocal.state, useLocal.local, useLocal.remote);
  });
});

describe('later syncs', () => {
  const start = () =>
    round(
      undefined,
      [bm('a', 'bar', 0, 'alpha'), folder('f', 'bar', 1, 'Docs'), bm('b', 'f', 0, 'beta')],
      [],
    );

  it('brings a bookmark added in the browser into VS Code, and the other way round', () => {
    let s = start();
    const remote = [...s.remote, bm('x', 'bar', 2, 'chrome-new')];
    s = round(s.state, s.local, remote);
    expect(titles(s.local)).toEqual(['alpha', 'Docs', 'chrome-new']);
    const local = [...s.local, bm('v', 'other', 0, 'vscode-new')];
    s = round(s.state, local, s.remote);
    expect(titles(s.remote, 'other')).toEqual(['vscode-new']);
    expectConverged(s.state, s.local, s.remote);
  });

  it('applies renames, moves and deletions made on either side', () => {
    let s = start();
    const remoteB = s.state.idMap.b!;
    const remoteA = s.state.idMap.a!;
    // Browser: rename beta, delete alpha. VS Code: move Docs folder to "other".
    const remote = s.remote
      .filter((n) => n.id !== remoteA)
      .map((n) => (n.id === remoteB ? { ...n, title: 'beta 2' } : n));
    const local = s.local.map((n) => (n.id === 'f' ? { ...n, parentId: 'other', index: 0 } : n));
    s = round(s.state, local, remote);
    expect(s.local.find((n) => n.id === 'a')).toBeUndefined();
    expect(s.local.find((n) => n.id === 'b')?.title).toBe('beta 2');
    expect(titles(s.remote, 'other')).toEqual(['Docs']);
    expectConverged(s.state, s.local, s.remote);
  });

  it('lets the browser win when both sides rename the same bookmark', () => {
    let s = start();
    const remote = s.remote.map((n) =>
      n.id === s.state.idMap.a ? { ...n, title: 'from chrome' } : n,
    );
    const local = s.local.map((n) => (n.id === 'a' ? { ...n, title: 'from vscode' } : n));
    s = round(s.state, local, remote);
    expect(s.local.find((n) => n.id === 'a')?.title).toBe('from chrome');
    expectConverged(s.state, s.local, s.remote);
  });

  it('keeps a bookmark deleted on one side but edited on the other', () => {
    let s = start();
    const remote = s.remote.filter((n) => n.id !== s.state.idMap.a);
    const local = s.local.map((n) => (n.id === 'a' ? { ...n, title: 'edited' } : n));
    s = round(s.state, local, remote);
    expect(titles(s.remote)).toContain('edited');
    expectConverged(s.state, s.local, s.remote);
  });

  it('brings back a deleted folder when something new was added inside it', () => {
    let s = start();
    const remoteFolder = s.state.idMap.f!;
    const remote = s.remote.filter((n) => n.id !== remoteFolder && n.parentId !== remoteFolder);
    const local = [...s.local, bm('n', 'f', 1, 'new-inside')];
    s = round(s.state, local, remote);
    // The browser deleted "beta" with its folder; the new bookmark keeps the folder alive.
    expect(titles(s.remote, s.state.idMap.f)).toEqual(['new-inside']);
    expectConverged(s.state, s.local, s.remote);
  });

  it('follows reordering in the browser', () => {
    let s = start();
    const remote = s.remote.map((n) =>
      n.parentId === 'bar' ? { ...n, index: n.id === s.state.idMap.a ? 1 : 0 } : n,
    );
    s = round(s.state, s.local, remote);
    expect(titles(s.local)).toEqual(['Docs', 'alpha']);
    expectConverged(s.state, s.local, s.remote);
  });
});

describe('random edits on both sides', () => {
  // A small deterministic random generator, so failures reproduce.
  const rng = (seed: number) => () => {
    seed = (seed * 1_103_515_245 + 12_345) % 2_147_483_648;
    return seed / 2_147_483_648;
  };

  function mutate(tree: FlatNode[], random: () => number, makeId: () => string): FlatNode[] {
    const nodes = normalize(tree).map((n) => ({ ...n }));
    const folders = ['bar', 'other', ...nodes.filter((n) => n.url === undefined).map((n) => n.id)];
    const pick = <T>(list: T[]) => list[Math.floor(random() * list.length)]!;
    const action = random();
    if (action < 0.35 || !nodes.length) {
      const parent = pick(folders);
      const isFolder = random() < 0.25;
      const title = `n${Math.floor(random() * 50)}`;
      nodes.push(
        isFolder
          ? folder(makeId(), parent, Math.floor(random() * 5), title)
          : bm(makeId(), parent, Math.floor(random() * 5), title),
      );
    } else if (action < 0.55) {
      pick(nodes).title = `t${Math.floor(random() * 50)}`;
    } else if (action < 0.75) {
      const node = pick(nodes);
      const descendants = new Set([node.id]);
      for (let grew = true; grew;) {
        grew = false;
        for (const n of nodes)
          if (descendants.has(n.parentId) && !descendants.has(n.id))
            grew = descendants.add(n.id) && true;
      }
      const targets = folders.filter((f) => !descendants.has(f));
      node.parentId = pick(targets);
      node.index = Math.floor(random() * 5) - 0.5;
    } else {
      const node = pick(nodes);
      return nodes.filter((n) => n.id !== node.id);
    }
    return normalize(nodes);
  }

  it("always converges and never loses the other side's additions", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const random = rng(seed);
      let s = round(undefined, [], []);
      for (let step = 0; step < 20; step++) {
        const local = random() < 0.6 ? mutate(s.local, random, localIds) : s.local;
        const remote = random() < 0.6 ? mutate(s.remote, random, remoteIds) : s.remote;
        const addedRemotely = remote.filter((n) => !s.remote.some((m) => m.id === n.id));
        s = round(s.state, local, remote);
        // Everything the browser added this round exists in VS Code now.
        for (const node of addedRemotely) {
          const localId = Object.entries(s.state.idMap).find(([, r]) => r === node.id)?.[0];
          expect(localId, `seed ${seed} step ${step}: ${node.title} lost`).toBeDefined();
        }
        expectConverged(s.state, s.local, s.remote);
      }
    }
    // 200 seeds x 20 rounds: about 2 s alone, over the 5 s default on a busy machine.
  }, 30_000);
});
