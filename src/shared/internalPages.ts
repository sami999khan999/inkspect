import type { InternalPage } from './protocol';

export const INTERNAL_SCHEME = 'vb:';

const TITLES: Record<InternalPage, string> = {
  newtab: 'New Tab',
  downloads: 'Downloads',
  history: 'History',
  bookmarks: 'Bookmarks',
  settings: 'Settings',
  extensions: 'Extensions',
};

export function internalUrl(page: InternalPage): string {
  return `vb://${page}`;
}

/** Returns the internal page for a `vb://` URL, or `undefined` for other URLs. */
export function parseInternalUrl(url: string): InternalPage | undefined {
  const match = /^vb:\/\/([a-z]+)\/?$/i.exec(url.trim());
  const name = match?.[1]?.toLowerCase();
  return name && Object.hasOwn(TITLES, name) ? (name as InternalPage) : undefined;
}

export function internalTitle(page: InternalPage): string {
  return TITLES[page];
}
