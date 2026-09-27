import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  countBookmarks,
  decodeMozLz4,
  findBookmarkSources,
  firefoxBackupRows,
  firefoxTree,
  parseProfilesIni,
  readBookmarkSource,
  type FirefoxRow,
} from '../../src/features/browserImport';

const chromeFile = (bar: unknown[], other: unknown[] = []) =>
  JSON.stringify({ roots: { bookmark_bar: { children: bar }, other: { children: other } } });
const url = (name: string) => ({ type: 'url', name, url: `https://${name}.dev/` });

let dirs: string[] = [];
const tempDir = () => {
  const dir = mkdtempSync(join(tmpdir(), 'vb-import-'));
  dirs.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true });
  dirs = [];
});

describe('finding browser profiles', () => {
  it('reads every Chrome profile, with names from Local State, and both bookmark files', async () => {
    const local = tempDir();
    const userData = join(local, 'Google', 'Chrome', 'User Data');
    mkdirSync(join(userData, 'Default'), { recursive: true });
    mkdirSync(join(userData, 'Profile 2'), { recursive: true });
    mkdirSync(join(userData, 'Crashpad'), { recursive: true });
    writeFileSync(
      join(userData, 'Local State'),
      JSON.stringify({
        profile: { info_cache: { Default: { name: 'Sami' }, 'Profile 2': { name: 'Work' } } },
      }),
    );
    // Signed in: the account's bookmarks live in AccountBookmarks; Bookmarks has local ones.
    writeFileSync(join(userData, 'Default', 'AccountBookmarks'), chromeFile([url('a'), url('b')]));
    writeFileSync(join(userData, 'Default', 'Bookmarks'), chromeFile([], [url('c')]));
    writeFileSync(join(userData, 'Profile 2', 'Bookmarks'), chromeFile([url('d')]));

    const sources = findBookmarkSources({
      local,
      roaming: tempDir(),
      home: tempDir(),
      platform: 'win32',
    });
    expect(sources.map((s) => `${s.browser}/${s.profile}/${s.paths.length}`)).toEqual([
      'Google Chrome/Sami/2',
      'Google Chrome/Work/1',
    ]);
    const sami = await readBookmarkSource(sources[0]!);
    expect(countBookmarks(sami)).toBe(3);
    expect(sami.map((n) => n.title)).toEqual(['a', 'b', 'Other bookmarks']);
  });

  it('finds Opera, which keeps its profile directly in its folder', () => {
    const roaming = tempDir();
    const opera = join(roaming, 'Opera Software', 'Opera Stable');
    mkdirSync(opera, { recursive: true });
    writeFileSync(join(opera, 'Bookmarks'), chromeFile([url('o')]));
    const sources = findBookmarkSources({
      local: tempDir(),
      roaming,
      home: tempDir(),
      platform: 'win32',
    });
    expect(sources).toMatchObject([{ browser: 'Opera', profile: 'Default' }]);
  });

  it('parses Firefox profiles.ini (relative and absolute paths)', () => {
    const ini = [
      '[Install308046B0AF4A39CB]',
      'Default=Profiles/abc.default-release',
      '[Profile1]',
      'Name=default',
      'IsRelative=1',
      'Path=Profiles/xyz.default',
      '[Profile0]',
      'Name=default-release',
      'IsRelative=0',
      'Path=/data/firefox/abc',
      '[General]',
      'Version=2',
    ].join('\n');
    expect(parseProfilesIni(ini, '/root')).toEqual([
      { dir: join('/root', 'Profiles', 'xyz.default'), name: 'default' },
      { dir: '/data/firefox/abc', name: 'default-release' },
    ]);
  });
});

describe('Firefox bookmarks', () => {
  const rows: FirefoxRow[] = [
    {
      id: 1,
      parent: 0,
      type: 2,
      title: '',
      url: null,
      position: 0,
      guid: 'root________',
      dateAdded: null,
    },
    {
      id: 2,
      parent: 1,
      type: 2,
      title: 'menu',
      url: null,
      position: 0,
      guid: 'menu________',
      dateAdded: null,
    },
    {
      id: 3,
      parent: 1,
      type: 2,
      title: 'toolbar',
      url: null,
      position: 1,
      guid: 'toolbar_____',
      dateAdded: null,
    },
    {
      id: 4,
      parent: 1,
      type: 2,
      title: 'unfiled',
      url: null,
      position: 2,
      guid: 'unfiled_____',
      dateAdded: null,
    },
    {
      id: 10,
      parent: 3,
      type: 1,
      title: 'Second',
      url: 'https://2.dev/',
      position: 1,
      guid: 'b',
      dateAdded: 1_700_000_000_000_000,
    },
    {
      id: 11,
      parent: 3,
      type: 1,
      title: 'First',
      url: 'https://1.dev/',
      position: 0,
      guid: 'a',
      dateAdded: null,
    },
    {
      id: 12,
      parent: 3,
      type: 3,
      title: null,
      url: null,
      position: 2,
      guid: 'sep',
      dateAdded: null,
    },
    {
      id: 13,
      parent: 4,
      type: 2,
      title: 'Docs',
      url: null,
      position: 0,
      guid: 'f',
      dateAdded: null,
    },
    {
      id: 14,
      parent: 13,
      type: 1,
      title: 'MDN',
      url: 'https://developer.mozilla.org/',
      position: 0,
      guid: 'm',
      dateAdded: null,
    },
    {
      id: 15,
      parent: 2,
      type: 1,
      title: 'Recent',
      url: 'place:sort=8',
      position: 0,
      guid: 'q',
      dateAdded: null,
    },
  ];

  it('puts toolbar items at the top and other roots in folders, skipping queries and separators', () => {
    const tree = firefoxTree(rows);
    expect(tree.map((n) => n.title)).toEqual(['First', 'Second', 'Other Bookmarks']);
    expect(tree[1]!.addedAt).toBe(1_700_000_000_000);
    expect(tree[2]!.children![0]).toMatchObject({ title: 'Docs', children: [{ title: 'MDN' }] });
    expect(countBookmarks(tree)).toBe(3);
  });

  it('reads the backup JSON format the same way', () => {
    const backup = {
      guid: 'root________',
      typeCode: 2,
      children: [
        {
          guid: 'toolbar_____',
          typeCode: 2,
          children: [{ typeCode: 1, title: 'Site', uri: 'https://site.dev/' }],
        },
      ],
    };
    expect(firefoxTree(firefoxBackupRows(backup))).toEqual([
      { title: 'Site', url: 'https://site.dev/', addedAt: undefined },
    ]);
  });

  it('decodes mozlz4 files (literal runs and overlapping matches)', () => {
    const header = (size: number) => [...new TextEncoder().encode('mozLz40\0'), size, 0, 0, 0];
    // "abc" + a 9-byte match 3 bytes back ("abcabcabc") + "!"
    const small = new Uint8Array([...header(13), 0x35, 97, 98, 99, 3, 0, 0x10, 33]);
    expect(decodeMozLz4(small)).toBe('abcabcabcabc!');
    // A 20-byte literal run needs a length extension byte.
    const text = 'twenty chars of text';
    const long = new Uint8Array([...header(20), 0xf0, 5, ...new TextEncoder().encode(text)]);
    expect(decodeMozLz4(long)).toBe(text);
    expect(() => decodeMozLz4(new Uint8Array(12))).toThrow(/mozlz4/);
  });
});
