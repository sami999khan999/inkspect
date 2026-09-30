// Bookmarks, history and the data behind the internal pages (vb://history, vb://bookmarks...).
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import { parseNetscapeBookmarks, type ImportedNode } from '../features/bookmarkFormats';
import { countBookmarks, findBookmarkSources, readBookmarkSource } from '../features/browserImport';
import { allBookmarks, findNode } from '../shared/bookmarks';
import { rankSuggestions, type Suggestion } from '../shared/history';
import type { BookmarkAction, HostToWebview, InternalPage, PageData } from '../shared/protocol';
import type { Services } from './BrowserPanel';

export function bookmarksMessage(services: Services): HostToWebview {
  return {
    type: 'bookmarks',
    roots: services.bookmarks.roots,
    showBar: getConfig().showBookmarksBar,
  };
}

export async function pageData(
  services: Services,
  page: InternalPage,
  query = '',
): Promise<PageData | undefined> {
  switch (page) {
    case 'history':
      return { page, query, items: services.history.search(query) };
    case 'bookmarks':
      return { page, roots: services.bookmarks.roots };
    case 'newtab':
      return { page, topSites: services.history.topSites(8) };
    case 'settings': {
      const engine = services.engineHost.current;
      return {
        page,
        chromiumVersion: engine ? await engine.version().catch(() => undefined) : undefined,
        profiles: findBookmarkSources().map((s) => `${s.browser} (${s.profile})`),
      };
    }
    default:
      return undefined;
  }
}

/** Address bar suggestions for `query`, given the open tabs of every window. */
export function suggestions(services: Services, query: string, tabs: Suggestion[]): Suggestion[] {
  return rankSuggestions(query, {
    tabs,
    bookmarks: allBookmarks(services.bookmarks.roots).map((b) => ({
      kind: 'bookmark' as const,
      url: b.url ?? '',
      title: b.title,
    })),
    history: services.history.items,
  });
}

/**
 * Asks before removing a folder that holds bookmarks: they all go, in linked browsers too.
 * A single bookmark or an empty folder goes without asking.
 */
export async function confirmRemoveBookmark(
  store: Services['bookmarks'],
  id: string,
): Promise<boolean> {
  const node = findNode(store.roots, id)?.node;
  if (node?.type !== 'folder' || !node.children?.length) return true;
  const count = (folder: typeof node): number =>
    (folder.children ?? []).reduce(
      (n, child) => n + (child.type === 'folder' ? count(child) : 1),
      0,
    );
  const inside = count(node);
  const choice = await vscode.window.showWarningMessage(
    `Delete the folder "${node.title}" and the ${inside} bookmark${inside === 1 ? '' : 's'} in it?`,
    {
      modal: true,
      detail: 'They are removed from browsers linked with VS Code too.',
    },
    'Delete',
  );
  return choice === 'Delete';
}

export async function runBookmarkAction(
  services: Services,
  action: BookmarkAction,
  open: (url: string, newTab: boolean) => void,
): Promise<void> {
  const store = services.bookmarks;
  switch (action.action) {
    case 'add':
      store.add({ url: action.url, title: action.title, favicon: action.favicon }, action.parentId);
      return;
    case 'update':
      store.update(action.id, { title: action.title, url: action.url });
      return;
    case 'move':
      store.move(action.id, action.parentId, action.index);
      return;
    case 'remove':
      if (await confirmRemoveBookmark(store, action.id)) store.remove(action.id);
      return;
    case 'addFolder':
      store.addFolder(action.parentId, action.title);
      return;
    case 'open':
      open(action.url, action.newTab);
      return;
    case 'openAll': {
      const folder = findNode(store.roots, action.id)?.node;
      const urls = (folder?.children ?? []).filter((n) => n.type === 'bookmark').map((n) => n.url!);
      if (urls.length > 15) {
        const choice = await vscode.window.showWarningMessage(
          `Open ${urls.length} tabs?`,
          { modal: true },
          'Open',
        );
        if (choice !== 'Open') return;
      }
      for (const url of urls) open(url, true);
      return;
    }
    case 'import':
      await importBookmarks(services);
      return;
    case 'export':
      await exportBookmarks(services);
      return;
  }
}

/** Imports from any installed browser profile (Chromium family, Firefox) or an HTML file. */
export async function importBookmarks(services: Services): Promise<void> {
  const sources = findBookmarkSources();
  // Read every source up front so the list can show how many bookmarks each one has.
  const items = await Promise.all(
    sources.map(async (source) => {
      try {
        const nodes = await readBookmarkSource(source);
        return { source, nodes, count: countBookmarks(nodes) };
      } catch (error) {
        return { source, nodes: [] as ImportedNode[], count: 0, error: errorMessage(error) };
      }
    }),
  );
  items.sort((a, b) => Number(b.count > 0) - Number(a.count > 0));
  const htmlChoice = {
    label: '$(file) Bookmarks HTML file...',
    description: 'Exported from any browser, including Safari',
    item: undefined,
  };
  const choice = await vscode.window.showQuickPick(
    [
      ...items.map((item) => ({
        label: `$(globe) ${item.source.browser}`,
        description: item.source.profile,
        detail: item.error ?? `${item.count} bookmark${item.count === 1 ? '' : 's'}`,
        item,
      })),
      htmlChoice,
    ],
    {
      title: 'Import bookmarks from',
      placeHolder: sources.length ? undefined : 'No browser profiles found. Import an HTML file.',
    },
  );
  if (!choice) return;
  try {
    let count: number;
    if (!choice.item) {
      const [uri] =
        (await vscode.window.showOpenDialog({
          canSelectMany: false,
          filters: { 'Bookmarks HTML': ['html', 'htm'] },
          openLabel: 'Import',
        })) ?? [];
      if (!uri) return;
      const nodes = parseNetscapeBookmarks(await readFile(uri.fsPath, 'utf8'));
      count = services.bookmarks.importNodes(nodes, 'Imported');
    } else {
      const { source, nodes, error } = choice.item;
      if (error) throw new Error(error);
      count = services.bookmarks.importNodes(
        nodes,
        `Imported from ${source.browser} (${source.profile})`,
      );
    }
    void vscode.window.showInformationMessage(`Imported ${count} bookmarks.`);
  } catch (error) {
    void vscode.window.showErrorMessage(`Could not import bookmarks: ${errorMessage(error)}`);
  }
}

export async function exportBookmarks(services: Services): Promise<void> {
  const uri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(join(services.downloads.directory, 'bookmarks.html')),
    filters: { 'Bookmarks HTML': ['html'] },
    saveLabel: 'Export',
  });
  if (!uri) return;
  await vscode.workspace.fs.writeFile(uri, Buffer.from(services.bookmarks.exportHtml(), 'utf8'));
  void vscode.window.showInformationMessage(`Exported bookmarks to ${uri.fsPath}`);
}

/** Asks what to clear (history, cookies and site data, cache, downloads list) and clears it. */
export async function clearBrowsingData(services: Services, openOrigins: string[]): Promise<void> {
  const items = [
    { label: 'Browsing history', id: 'history', picked: true },
    { label: 'Cookies and other site data', id: 'cookies', picked: true },
    { label: 'Cached images and files', id: 'cache', picked: true },
    { label: 'Download list', id: 'downloads', picked: false },
  ];
  const picked = await vscode.window.showQuickPick(items, {
    title: 'Clear browsing data (all time)',
    canPickMany: true,
  });
  if (!picked?.length) return;
  const ids = new Set(picked.map((p) => p.id));
  const origins = new Set(openOrigins);
  for (const item of services.history.items) {
    try {
      const origin = new URL(item.url).origin;
      if (origin !== 'null') origins.add(origin);
    } catch {
      // Not a URL.
    }
  }
  if (ids.has('history')) services.history.clear('all');
  if (ids.has('downloads')) await services.downloads.run('clear');
  if (ids.has('cookies') || ids.has('cache')) {
    const engine = await services.engineHost.start();
    if (ids.has('cookies')) {
      await engine.clearCookies();
      await engine.clearSiteData(origins);
    }
    if (ids.has('cache')) await engine.clearCache();
  }
  void vscode.window.showInformationMessage('Browsing data cleared.');
}
