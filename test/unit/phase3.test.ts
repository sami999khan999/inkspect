import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  parseChromiumBookmarks,
  parseNetscapeBookmarks,
  toNetscapeHtml,
} from '../../src/features/bookmarkFormats';
import { JsonStore } from '../../src/features/jsonStore';
import {
  BAR_ID,
  emptyRoots,
  findByUrl,
  folderList,
  moveNode,
  OTHER_ID,
  removeNode,
  searchBookmarks,
  type BookmarkNode,
} from '../../src/shared/bookmarks';
import {
  clearRange,
  frecency,
  rankSuggestions,
  recordVisit,
  topSites,
  type HistoryItem,
} from '../../src/shared/history';

const bookmark = (id: string, url: string, title = id): BookmarkNode => ({
  id,
  type: 'bookmark',
  title,
  url,
  createdAt: 0,
});
const folder = (id: string, children: BookmarkNode[] = []): BookmarkNode => ({
  id,
  type: 'folder',
  title: id,
  createdAt: 0,
  children,
});

describe('JsonStore', () => {
  it('writes atomically and reads back', async () => {
    const file = join(mkdtempSync(join(tmpdir(), 'vb-store-')), 'data.json');
    const store = new JsonStore({ file, version: 1, defaults: () => ({ count: 0 }), delayMs: 10 });
    store.update((data) => {
      data.count = 5;
    });
    await store.flush();
    expect(JSON.parse(readFileSync(file, 'utf8'))).toEqual({ version: 1, data: { count: 5 } });
    expect(new JsonStore({ file, version: 1, defaults: () => ({ count: 0 }) }).data.count).toBe(5);
  });

  it('migrates old versions and falls back to defaults on bad data', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vb-store-'));
    const old = join(dir, 'old.json');
    writeFileSync(old, JSON.stringify({ version: 1, data: ['a', 'b'] }));
    const migrated = new JsonStore<{ items: string[] }>({
      file: old,
      version: 2,
      defaults: () => ({ items: [] }),
      migrate: (data) => ({ items: data as string[] }),
    });
    expect(migrated.data.items).toEqual(['a', 'b']);
    const broken = join(dir, 'broken.json');
    writeFileSync(broken, '{ not json');
    expect(new JsonStore({ file: broken, version: 1, defaults: () => 7 }).data).toBe(7);
  });
});

describe('bookmark tree', () => {
  const tree = () => {
    const roots = emptyRoots();
    roots.bar.children = [
      bookmark('a', 'https://a.dev'),
      folder('f', [bookmark('b', 'https://b.dev')]),
    ];
    roots.other.children = [bookmark('c', 'https://c.dev', 'Cats')];
    return roots;
  };

  it('finds, searches and lists folders', () => {
    const roots = tree();
    expect(findByUrl(roots, 'https://b.dev')?.id).toBe('b');
    expect(searchBookmarks(roots, 'cat').map((b) => b.id)).toEqual(['c']);
    expect(folderList(roots).map((f) => [f.id, f.depth])).toEqual([
      [BAR_ID, 0],
      ['f', 1],
      [OTHER_ID, 0],
    ]);
  });

  it('moves nodes between and within folders', () => {
    const roots = tree();
    expect(moveNode(roots, 'c', 'f')).toBe(true);
    expect(roots.bar.children![1]!.children!.map((n) => n.id)).toEqual(['b', 'c']);
    expect(moveNode(roots, 'a', BAR_ID, 2)).toBe(true);
    expect(roots.bar.children!.map((n) => n.id)).toEqual(['f', 'a']);
  });

  it('refuses to move a folder into itself or move a root', () => {
    const roots = tree();
    expect(moveNode(roots, 'f', 'f')).toBe(false);
    expect(moveNode(roots, BAR_ID, OTHER_ID)).toBe(false);
  });

  it('removes nodes', () => {
    const roots = tree();
    expect(removeNode(roots, 'f')).toBe(true);
    expect(findByUrl(roots, 'https://b.dev')).toBeUndefined();
  });
});

describe('bookmark formats', () => {
  it('reads Chromium bookmark files', () => {
    const json = JSON.stringify({
      roots: {
        bookmark_bar: {
          children: [
            { type: 'url', name: 'A', url: 'https://a.dev', date_added: '13300000000000000' },
            {
              type: 'folder',
              name: 'F',
              children: [{ type: 'url', name: 'B', url: 'https://b.dev' }],
            },
          ],
        },
        other: { children: [{ type: 'url', name: 'C', url: 'https://c.dev' }] },
      },
    });
    const parsed = parseChromiumBookmarks(json);
    expect(parsed.bar.map((n) => n.title)).toEqual(['A', 'F']);
    expect(parsed.bar[1]!.children![0]!.url).toBe('https://b.dev');
    expect(parsed.other[0]!.url).toBe('https://c.dev');
    expect(parsed.bar[0]!.addedAt).toBeGreaterThan(Date.UTC(2020, 0, 1));
  });

  it('round-trips the Netscape HTML format', () => {
    const html = toNetscapeHtml([
      { title: 'Bar & more', children: [{ title: 'A <b>', url: 'https://a.dev/?x=1&y=2' }] },
      { title: 'Top', url: 'https://top.dev' },
    ]);
    const parsed = parseNetscapeBookmarks(html);
    expect(parsed).toEqual([
      {
        title: 'Bar & more',
        children: [{ title: 'A <b>', url: 'https://a.dev/?x=1&y=2', addedAt: undefined }],
      },
      { title: 'Top', url: 'https://top.dev', addedAt: undefined },
    ]);
  });
});

describe('history', () => {
  const now = Date.UTC(2026, 0, 31);
  const DAY = 86_400_000;

  it('records visits, most recent first, with a cap', () => {
    let items: HistoryItem[] = [];
    items = recordVisit(items, 'https://a.dev', 'A', now - 10);
    items = recordVisit(items, 'https://b.dev', 'B', now - 5);
    items = recordVisit(items, 'https://a.dev', '', now, 2);
    expect(items.map((i) => [i.url, i.visitCount, i.title])).toEqual([
      ['https://a.dev', 2, 'A'],
      ['https://b.dev', 1, 'B'],
    ]);
    expect(recordVisit(items, 'https://c.dev', 'C', now, 2).map((i) => i.url)).toEqual([
      'https://c.dev',
      'https://a.dev',
    ]);
  });

  it('ranks by frequency and recency', () => {
    const recent = { url: 'r', title: '', visitCount: 2, lastVisit: now - DAY };
    const old = { url: 'o', title: '', visitCount: 5, lastVisit: now - 100 * DAY };
    expect(frecency(recent, now)).toBeGreaterThan(frecency(old, now));
    expect(topSites([old, recent], 1, now)[0]!.url).toBe('r');
  });

  it('clears a time range', () => {
    const items = [
      { url: 'new', title: '', visitCount: 1, lastVisit: now - 1000 },
      { url: 'old', title: '', visitCount: 1, lastVisit: now - 3 * DAY },
    ];
    expect(clearRange(items, 'hour', now).map((i) => i.url)).toEqual(['old']);
    expect(clearRange(items, 'all', now)).toEqual([]);
  });

  it('suggests open tabs, bookmarks and history for address bar input', () => {
    const suggestions = rankSuggestions(
      'gith',
      {
        tabs: [{ kind: 'tab', url: 'https://github.com/a', title: 'Repo', tabId: 't1' }],
        bookmarks: [{ kind: 'bookmark', url: 'https://docs.github.com', title: 'GitHub Docs' }],
        history: [
          { url: 'https://github.com/b', title: 'B', visitCount: 3, lastVisit: now },
          { url: 'https://example.com', title: 'Unrelated', visitCount: 50, lastVisit: now },
        ],
      },
      8,
      now,
    );
    expect(suggestions.map((s) => s.kind)).toEqual(['tab', 'history', 'bookmark']);
    expect(rankSuggestions('', { tabs: [], bookmarks: [], history: [] })).toEqual([]);
  });
});
