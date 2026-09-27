// Finds installed browsers and reads their bookmarks (Chromium family and Firefox).
import {
  copyFileSync,
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
} from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseChromiumBookmarks, type ImportedNode } from './bookmarkFormats';

export interface BookmarkSource {
  /** "Google Chrome", "Firefox", ... */
  browser: string;
  /** Profile display name ("Sami", "Default", "Work"...). */
  profile: string;
  kind: 'chromium' | 'firefox';
  /** Chromium: the `Bookmarks` / `AccountBookmarks` files. Firefox: the profile folder. */
  paths: string[];
}

interface Roots {
  local: string;
  roaming: string;
  home: string;
  platform: NodeJS.Platform;
}

function defaultRoots(): Roots {
  const home = homedir();
  return {
    home,
    local: process.env.LOCALAPPDATA ?? join(home, 'AppData', 'Local'),
    roaming: process.env.APPDATA ?? join(home, 'AppData', 'Roaming'),
    platform: process.platform,
  };
}

/** User data folders of Chromium-based browsers, per platform. */
function chromiumInstalls({ local, roaming, home, platform }: Roots): [string, string][] {
  if (platform === 'win32') {
    return [
      ['Google Chrome', join(local, 'Google', 'Chrome', 'User Data')],
      ['Google Chrome Beta', join(local, 'Google', 'Chrome Beta', 'User Data')],
      ['Google Chrome Dev', join(local, 'Google', 'Chrome Dev', 'User Data')],
      ['Google Chrome Canary', join(local, 'Google', 'Chrome SxS', 'User Data')],
      ['Chromium', join(local, 'Chromium', 'User Data')],
      ['Microsoft Edge', join(local, 'Microsoft', 'Edge', 'User Data')],
      ['Microsoft Edge Beta', join(local, 'Microsoft', 'Edge Beta', 'User Data')],
      ['Microsoft Edge Dev', join(local, 'Microsoft', 'Edge Dev', 'User Data')],
      ['Microsoft Edge Canary', join(local, 'Microsoft', 'Edge SxS', 'User Data')],
      ['Brave', join(local, 'BraveSoftware', 'Brave-Browser', 'User Data')],
      ['Vivaldi', join(local, 'Vivaldi', 'User Data')],
      ['Yandex', join(local, 'Yandex', 'YandexBrowser', 'User Data')],
      [
        'Arc',
        join(
          local,
          'Packages',
          'TheBrowserCompany.Arc_ttt1ap7aakyb4',
          'LocalCache',
          'Local',
          'Arc',
          'User Data',
        ),
      ],
      ['Opera', join(roaming, 'Opera Software', 'Opera Stable')],
      ['Opera GX', join(roaming, 'Opera Software', 'Opera GX Stable')],
    ];
  }
  if (platform === 'darwin') {
    const support = join(home, 'Library', 'Application Support');
    return [
      ['Google Chrome', join(support, 'Google', 'Chrome')],
      ['Google Chrome Beta', join(support, 'Google', 'Chrome Beta')],
      ['Google Chrome Dev', join(support, 'Google', 'Chrome Dev')],
      ['Google Chrome Canary', join(support, 'Google', 'Chrome Canary')],
      ['Chromium', join(support, 'Chromium')],
      ['Microsoft Edge', join(support, 'Microsoft Edge')],
      ['Microsoft Edge Beta', join(support, 'Microsoft Edge Beta')],
      ['Brave', join(support, 'BraveSoftware', 'Brave-Browser')],
      ['Vivaldi', join(support, 'Vivaldi')],
      ['Yandex', join(support, 'Yandex', 'YandexBrowser')],
      ['Arc', join(support, 'Arc', 'User Data')],
      ['Opera', join(support, 'com.operasoftware.Opera')],
      ['Opera GX', join(support, 'com.operasoftware.OperaGX')],
    ];
  }
  const config = join(home, '.config');
  return [
    ['Google Chrome', join(config, 'google-chrome')],
    ['Google Chrome Beta', join(config, 'google-chrome-beta')],
    ['Google Chrome Dev', join(config, 'google-chrome-unstable')],
    ['Chromium', join(config, 'chromium')],
    ['Chromium (snap)', join(home, 'snap', 'chromium', 'common', 'chromium')],
    ['Microsoft Edge', join(config, 'microsoft-edge')],
    ['Microsoft Edge Beta', join(config, 'microsoft-edge-beta')],
    ['Brave', join(config, 'BraveSoftware', 'Brave-Browser')],
    ['Vivaldi', join(config, 'vivaldi')],
    ['Yandex', join(config, 'yandex-browser')],
    ['Opera', join(config, 'opera')],
    [
      'Google Chrome (Flatpak)',
      join(home, '.var', 'app', 'com.google.Chrome', 'config', 'google-chrome'),
    ],
    [
      'Chromium (Flatpak)',
      join(home, '.var', 'app', 'org.chromium.Chromium', 'config', 'chromium'),
    ],
    [
      'Brave (Flatpak)',
      join(home, '.var', 'app', 'com.brave.Browser', 'config', 'BraveSoftware', 'Brave-Browser'),
    ],
    [
      'Microsoft Edge (Flatpak)',
      join(home, '.var', 'app', 'com.microsoft.Edge', 'config', 'microsoft-edge'),
    ],
  ];
}

/** Firefox profile roots (where `profiles.ini` lives), per platform. */
function firefoxRoots({ roaming, home, platform }: Roots): string[] {
  if (platform === 'win32') return [join(roaming, 'Mozilla', 'Firefox')];
  if (platform === 'darwin') return [join(home, 'Library', 'Application Support', 'Firefox')];
  return [
    join(home, '.mozilla', 'firefox'),
    join(home, 'snap', 'firefox', 'common', '.mozilla', 'firefox'),
    join(home, '.var', 'app', 'org.mozilla.firefox', '.mozilla', 'firefox'),
  ];
}

const BOOKMARK_FILES = ['AccountBookmarks', 'Bookmarks'];

function isDir(path: string): boolean {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/** Profile folders of one Chromium install, with display names from `Local State`. */
function chromiumProfiles(userData: string): { dir: string; name: string }[] {
  // Opera keeps a single profile's files directly in its folder.
  if (BOOKMARK_FILES.some((f) => existsSync(join(userData, f)))) {
    return [{ dir: userData, name: 'Default' }];
  }
  let names: Record<string, { name?: string }> = {};
  try {
    const state = JSON.parse(readFileSync(join(userData, 'Local State'), 'utf8')) as {
      profile?: { info_cache?: Record<string, { name?: string }> };
    };
    names = state.profile?.info_cache ?? {};
  } catch {
    // No Local State: fall back to the folder names.
  }
  let dirs: string[];
  try {
    dirs = readdirSync(userData).filter(
      (d) => d === 'Default' || /^Profile \d+$/.test(d) || d in names,
    );
  } catch {
    return [];
  }
  return dirs
    .filter((d) => isDir(join(userData, d)))
    .map((d) => ({ dir: join(userData, d), name: names[d]?.name || d }));
}

/** Parses Firefox's `profiles.ini` into absolute profile folders with names. */
export function parseProfilesIni(ini: string, root: string): { dir: string; name: string }[] {
  const profiles: { dir: string; name: string }[] = [];
  let current: Record<string, string> | undefined;
  const flush = () => {
    if (current?.Path) {
      const dir =
        current.IsRelative === '1' ? join(root, ...current.Path.split('/')) : current.Path;
      profiles.push({ dir, name: current.Name || current.Path });
    }
  };
  for (const raw of ini.split(/\r?\n/)) {
    const line = raw.trim();
    const section = /^\[(.+)\]$/.exec(line);
    if (section) {
      flush();
      current = /^Profile\d+$/.test(section[1]!) ? {} : undefined;
      continue;
    }
    const pair = /^([^=]+)=(.*)$/.exec(line);
    if (current && pair) current[pair[1]!.trim()] = pair[2]!.trim();
  }
  flush();
  return profiles;
}

/** Every browser profile on this computer that has bookmarks to import. */
export function findBookmarkSources(roots: Roots = defaultRoots()): BookmarkSource[] {
  const sources: BookmarkSource[] = [];
  for (const [browser, userData] of chromiumInstalls(roots)) {
    if (!isDir(userData)) continue;
    for (const profile of chromiumProfiles(userData)) {
      const paths = BOOKMARK_FILES.map((f) => join(profile.dir, f)).filter((f) => existsSync(f));
      if (paths.length) sources.push({ browser, profile: profile.name, kind: 'chromium', paths });
    }
  }
  for (const root of firefoxRoots(roots)) {
    let ini: string;
    try {
      ini = readFileSync(join(root, 'profiles.ini'), 'utf8');
    } catch {
      continue;
    }
    for (const profile of parseProfilesIni(ini, root)) {
      const hasData =
        existsSync(join(profile.dir, 'places.sqlite')) ||
        existsSync(join(profile.dir, 'bookmarkbackups'));
      if (hasData) {
        sources.push({
          browser: 'Firefox',
          profile: profile.name,
          kind: 'firefox',
          paths: [profile.dir],
        });
      }
    }
  }
  return sources;
}

/** Folder and bookmark tree of a source, ready for `BookmarksStore.importNodes`. */
export async function readBookmarkSource(source: BookmarkSource): Promise<ImportedNode[]> {
  if (source.kind === 'chromium') {
    // Signed-in Chrome keeps the account's bookmarks in AccountBookmarks and local-only ones
    // in Bookmarks: import both.
    const bar: ImportedNode[] = [];
    const other: ImportedNode[] = [];
    const mobile: ImportedNode[] = [];
    for (const file of source.paths) {
      const parsed = parseChromiumBookmarks(readFileSync(file, 'utf8'));
      bar.push(...parsed.bar);
      other.push(...parsed.other);
      mobile.push(...parsed.mobile);
    }
    return [
      ...bar,
      ...(other.length ? [{ title: 'Other bookmarks', children: other }] : []),
      ...(mobile.length ? [{ title: 'Mobile bookmarks', children: mobile }] : []),
    ];
  }
  return readFirefoxBookmarks(source.paths[0]!);
}

/** Counts the bookmarks (not folders) in a tree. */
export function countBookmarks(nodes: ImportedNode[]): number {
  return nodes.reduce((sum, n) => sum + (n.url ? 1 : countBookmarks(n.children ?? [])), 0);
}

// ---------------------------------------------------------------------------------------------
// Firefox
// ---------------------------------------------------------------------------------------------

/** A row of Firefox's `moz_bookmarks` joined with `moz_places`. */
export interface FirefoxRow {
  id: number;
  parent: number;
  /** 1 bookmark, 2 folder, 3 separator. */
  type: number;
  title: string | null;
  url: string | null;
  position: number;
  guid: string;
  dateAdded: number | null;
}

const FIREFOX_ROOTS: [string, string][] = [
  ['toolbar_____', 'Bookmarks Toolbar'],
  ['menu________', 'Bookmarks Menu'],
  ['unfiled_____', 'Other Bookmarks'],
  ['mobile______', 'Mobile Bookmarks'],
];

/** Builds the import tree from Firefox rows: toolbar items at the top, other roots as folders. */
export function firefoxTree(rows: FirefoxRow[]): ImportedNode[] {
  const byParent = new Map<number, FirefoxRow[]>();
  for (const row of rows) {
    const list = byParent.get(row.parent) ?? [];
    list.push(row);
    byParent.set(row.parent, list);
  }
  const build = (parent: number): ImportedNode[] =>
    (byParent.get(parent) ?? [])
      .sort((a, b) => a.position - b.position)
      .flatMap((row): ImportedNode[] => {
        if (row.type === 1 && row.url && !row.url.startsWith('place:')) {
          return [
            {
              title: row.title || row.url,
              url: row.url,
              addedAt: row.dateAdded ? Math.round(row.dateAdded / 1000) : undefined,
            },
          ];
        }
        if (row.type === 2) return [{ title: row.title || 'Folder', children: build(row.id) }];
        return [];
      });
  const result: ImportedNode[] = [];
  for (const [guid, title] of FIREFOX_ROOTS) {
    const root = rows.find((r) => r.guid === guid);
    if (!root) continue;
    const children = build(root.id);
    if (!children.length) continue;
    if (guid === 'toolbar_____') result.unshift(...children);
    else result.push({ title, children });
  }
  return result;
}

interface FirefoxJsonNode {
  guid?: string;
  title?: string;
  typeCode?: number;
  uri?: string;
  dateAdded?: number;
  children?: FirefoxJsonNode[];
}

/** Converts a Firefox bookmark backup (JSON) into rows, so both sources share `firefoxTree`. */
export function firefoxBackupRows(root: FirefoxJsonNode): FirefoxRow[] {
  const rows: FirefoxRow[] = [];
  let nextId = 1;
  const walk = (node: FirefoxJsonNode, parent: number, position: number) => {
    const id = nextId++;
    rows.push({
      id,
      parent,
      type: node.typeCode ?? (node.children ? 2 : 1),
      title: node.title ?? null,
      url: node.uri ?? null,
      position,
      guid: node.guid ?? '',
      dateAdded: node.dateAdded ?? null,
    });
    (node.children ?? []).forEach((child, i) => walk(child, id, i));
  };
  walk(root, 0, 0);
  return rows;
}

/** Decodes Mozilla's `.jsonlz4` / `.mozlz4` files (magic + size + one LZ4 block). */
export function decodeMozLz4(data: Uint8Array): string {
  const magic = new TextDecoder().decode(data.subarray(0, 8));
  if (magic !== 'mozLz40\0') throw new Error('Not a mozlz4 file');
  const size = data[8]! | (data[9]! << 8) | (data[10]! << 16) | (data[11]! << 24);
  const out = new Uint8Array(size);
  let src = 12;
  let dst = 0;
  while (src < data.length) {
    const token = data[src++]!;
    let literals = token >> 4;
    if (literals === 15) {
      let byte: number;
      do {
        byte = data[src++]!;
        literals += byte;
      } while (byte === 255);
    }
    out.set(data.subarray(src, src + literals), dst);
    src += literals;
    dst += literals;
    if (src >= data.length) break;
    const offset = data[src]! | (data[src + 1]! << 8);
    src += 2;
    let match = (token & 15) + 4;
    if ((token & 15) === 15) {
      let byte: number;
      do {
        byte = data[src++]!;
        match += byte;
      } while (byte === 255);
    }
    // Byte by byte: matches may overlap the bytes they produce.
    for (let i = 0; i < match; i++, dst++) out[dst] = out[dst - offset]!;
  }
  return new TextDecoder().decode(out.subarray(0, dst));
}

async function readFirefoxBookmarks(profileDir: string): Promise<ImportedNode[]> {
  const live = await readPlacesDatabase(profileDir).catch(() => undefined);
  if (live) return firefoxTree(live);
  // Without SQLite, use Firefox's newest automatic bookmark backup.
  const folder = join(profileDir, 'bookmarkbackups');
  const backups = existsSync(folder)
    ? readdirSync(folder)
        .filter((f) => /\.(json|jsonlz4)$/.test(f))
        .map((f) => ({ file: join(folder, f), time: statSync(join(folder, f)).mtimeMs }))
        .sort((a, b) => b.time - a.time)
    : [];
  const newest = backups[0];
  if (!newest)
    throw new Error('Firefox has no bookmark backup yet. Export bookmarks to HTML instead.');
  const raw = readFileSync(newest.file);
  const json = newest.file.endsWith('lz4') ? decodeMozLz4(raw) : raw.toString('utf8');
  return firefoxTree(firefoxBackupRows(JSON.parse(json) as FirefoxJsonNode));
}

/**
 * Reads `places.sqlite` with Node's built-in SQLite (when this runtime has it). Firefox keeps the
 * database locked, so a copy (with its write-ahead log) is read instead.
 */
async function readPlacesDatabase(profileDir: string): Promise<FirefoxRow[] | undefined> {
  const database = join(profileDir, 'places.sqlite');
  if (!existsSync(database)) return undefined;
  let sqlite: typeof import('node:sqlite');
  try {
    sqlite = await import('node:sqlite');
  } catch {
    return undefined;
  }
  const dir = mkdtempSync(join(tmpdir(), 'vscode-browser-places-'));
  try {
    const copy = join(dir, 'places.sqlite');
    copyFileSync(database, copy);
    if (existsSync(`${database}-wal`)) copyFileSync(`${database}-wal`, `${copy}-wal`);
    const db = new sqlite.DatabaseSync(copy, { readOnly: true });
    try {
      return db
        .prepare(
          `SELECT b.id, b.parent, b.type, b.title, p.url, b.position, b.guid, b.dateAdded
           FROM moz_bookmarks b LEFT JOIN moz_places p ON p.id = b.fk`,
        )
        .all() as unknown as FirefoxRow[];
    } finally {
      db.close();
    }
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
