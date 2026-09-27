// Reading and writing bookmarks in other browsers' formats.
import { existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

/** A bookmark or folder being imported (ids are assigned when it is added to the tree). */
export interface ImportedNode {
  title: string;
  url?: string;
  children?: ImportedNode[];
  addedAt?: number;
}

interface ChromeNode {
  type?: string;
  name?: string;
  url?: string;
  date_added?: string;
  children?: ChromeNode[];
}

/** Chrome stores times as microseconds since 1601-01-01. */
function chromeTime(value: string | undefined): number | undefined {
  const micros = Number(value);
  if (!Number.isFinite(micros) || micros <= 0) return undefined;
  return Math.round(micros / 1000 - 11_644_473_600_000);
}

function fromChromeNode(node: ChromeNode): ImportedNode | undefined {
  if (node.type === 'url' && node.url) {
    return { title: node.name || node.url, url: node.url, addedAt: chromeTime(node.date_added) };
  }
  if (node.type === 'folder') {
    return {
      title: node.name || 'Folder',
      children: (node.children ?? []).map(fromChromeNode).filter((n): n is ImportedNode => !!n),
    };
  }
  return undefined;
}

/** Parses a Chromium `Bookmarks` file (Chrome, Edge, Brave...) into bar/other folders. */
export function parseChromiumBookmarks(json: string): {
  bar: ImportedNode[];
  other: ImportedNode[];
} {
  const data = JSON.parse(json) as { roots?: Record<string, ChromeNode | undefined> };
  const convert = (root: ChromeNode | undefined) =>
    (root?.children ?? []).map(fromChromeNode).filter((n): n is ImportedNode => !!n);
  return {
    bar: convert(data.roots?.bookmark_bar),
    other: [...convert(data.roots?.other), ...convert(data.roots?.synced)],
  };
}

const ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  '#39': "'",
  apos: "'",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#\d+|#x[\da-f]+|\w+);/gi, (match, code: string) => {
    if (code[0] === '#') {
      const value =
        code[1] === 'x' || code[1] === 'X'
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    }
    return ENTITIES[code.toLowerCase()] ?? match;
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Parses the Netscape bookmark HTML format every browser can export. */
export function parseNetscapeBookmarks(html: string): ImportedNode[] {
  const root: ImportedNode = { title: '', children: [] };
  const stack: ImportedNode[] = [root];
  let pendingFolder: ImportedNode | undefined;
  const token = /<(\/?)(dl|h3|a)\b([^>]*)>([^<]*)/gi;
  for (const match of html.matchAll(token)) {
    const [, closing, rawTag, attributes, text] = match;
    const tag = rawTag!.toLowerCase();
    const current = stack.at(-1)!;
    if (tag === 'dl' && !closing) {
      if (pendingFolder) {
        stack.push(pendingFolder);
        pendingFolder = undefined;
      }
    } else if (tag === 'dl' && closing) {
      if (stack.length > 1) stack.pop();
    } else if (tag === 'h3' && !closing) {
      pendingFolder = { title: decodeEntities(text!.trim()) || 'Folder', children: [] };
      current.children!.push(pendingFolder);
    } else if (tag === 'a' && !closing) {
      const href = /href\s*=\s*"([^"]*)"/i.exec(attributes!)?.[1];
      if (!href) continue;
      const added = Number(/add_date\s*=\s*"(\d+)"/i.exec(attributes!)?.[1]);
      current.children!.push({
        title: decodeEntities(text!.trim()) || href,
        url: decodeEntities(href),
        addedAt: Number.isFinite(added) && added > 0 ? added * 1000 : undefined,
      });
    }
  }
  return root.children!;
}

export interface ExportNode {
  title: string;
  url?: string;
  createdAt?: number;
  children?: ExportNode[];
}

/** Writes bookmarks in the Netscape HTML format (importable by every browser). */
export function toNetscapeHtml(folders: ExportNode[]): string {
  const lines = [
    '<!DOCTYPE NETSCAPE-Bookmark-file-1>',
    '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">',
    '<TITLE>Bookmarks</TITLE>',
    '<H1>Bookmarks</H1>',
    '<DL><p>',
  ];
  const write = (nodes: ExportNode[], indent: string) => {
    for (const node of nodes) {
      const added = node.createdAt ? ` ADD_DATE="${Math.floor(node.createdAt / 1000)}"` : '';
      if (node.url !== undefined) {
        lines.push(
          `${indent}<DT><A HREF="${escapeHtml(node.url)}"${added}>${escapeHtml(node.title)}</A>`,
        );
      } else {
        lines.push(`${indent}<DT><H3${added}>${escapeHtml(node.title)}</H3>`, `${indent}<DL><p>`);
        write(node.children ?? [], `${indent}    `);
        lines.push(`${indent}</DL><p>`);
      }
    }
  };
  write(folders, '    ');
  lines.push('</DL><p>', '');
  return lines.join('\n');
}

export interface BrowserProfile {
  name: string;
  file: string;
}

/** `Bookmarks` files of locally installed Chromium browsers (default profiles). */
export function findBrowserBookmarkFiles(): BrowserProfile[] {
  const home = homedir();
  const local = process.env.LOCALAPPDATA ?? join(home, 'AppData', 'Local');
  const candidates: [string, string][] =
    process.platform === 'win32'
      ? [
          ['Google Chrome', join(local, 'Google', 'Chrome', 'User Data', 'Default', 'Bookmarks')],
          ['Microsoft Edge', join(local, 'Microsoft', 'Edge', 'User Data', 'Default', 'Bookmarks')],
          [
            'Brave',
            join(local, 'BraveSoftware', 'Brave-Browser', 'User Data', 'Default', 'Bookmarks'),
          ],
          ['Chromium', join(local, 'Chromium', 'User Data', 'Default', 'Bookmarks')],
        ]
      : process.platform === 'darwin'
        ? [
            [
              'Google Chrome',
              join(
                home,
                'Library',
                'Application Support',
                'Google',
                'Chrome',
                'Default',
                'Bookmarks',
              ),
            ],
            [
              'Microsoft Edge',
              join(
                home,
                'Library',
                'Application Support',
                'Microsoft Edge',
                'Default',
                'Bookmarks',
              ),
            ],
            [
              'Brave',
              join(
                home,
                'Library',
                'Application Support',
                'BraveSoftware',
                'Brave-Browser',
                'Default',
                'Bookmarks',
              ),
            ],
            [
              'Chromium',
              join(home, 'Library', 'Application Support', 'Chromium', 'Default', 'Bookmarks'),
            ],
          ]
        : [
            ['Google Chrome', join(home, '.config', 'google-chrome', 'Default', 'Bookmarks')],
            ['Microsoft Edge', join(home, '.config', 'microsoft-edge', 'Default', 'Bookmarks')],
            [
              'Brave',
              join(home, '.config', 'BraveSoftware', 'Brave-Browser', 'Default', 'Bookmarks'),
            ],
            ['Chromium', join(home, '.config', 'chromium', 'Default', 'Bookmarks')],
          ];
  return candidates.filter(([, file]) => existsSync(file)).map(([name, file]) => ({ name, file }));
}
