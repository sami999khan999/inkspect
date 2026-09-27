import type {
  ContextMenuAction,
  HistoryEntry,
  PageContext,
  TabAction,
  TabState,
} from '@shared/protocol';
import { tidyMenu, type MenuItem } from './components/Menu';
import { truncate } from './format';
import { shortcutLabel } from './keyboard';
import { postToHost } from './vscode';

const tabAction = (action: TabAction, tabId?: string) => () =>
  postToHost({ type: 'tab', action, tabId });

/** Menu for a right-click in the page that the page did not handle itself. */
export function pageContextMenu(
  tab: TabState,
  context: PageContext,
  point?: { x: number; y: number },
): MenuItem[] {
  const run = (action: ContextMenuAction) => () =>
    postToHost({ type: 'contextMenuAction', tabId: tab.id, action, context, point });
  const items: MenuItem[] = [];

  if (context.linkUrl) {
    items.push(
      { label: 'Open link in new tab', icon: 'link-external', onSelect: run('openLinkInNewTab') },
      { label: 'Open link in system browser', icon: 'globe', onSelect: run('openLinkExternal') },
      { label: 'Copy link address', icon: 'link', onSelect: run('copyLink') },
      { separator: true },
    );
  }
  if (context.mediaType && context.srcUrl) {
    const noun = context.mediaType === 'img' ? 'image' : context.mediaType;
    items.push(
      { label: `Open ${noun} in new tab`, icon: 'file-media', onSelect: run('openMediaInNewTab') },
      { label: `Save ${noun} as...`, icon: 'save', onSelect: run('saveMedia') },
      ...(context.mediaType === 'img'
        ? [{ label: 'Copy image', icon: 'copy', onSelect: run('copyImage') }]
        : []),
      { label: `Copy ${noun} address`, icon: 'link', onSelect: run('copyMediaUrl') },
      { separator: true },
    );
  }
  if (context.editable) {
    const hasSelection = !!context.selectionText;
    items.push(
      { label: 'Cut', icon: 'blank', disabled: !hasSelection, onSelect: run('cut') },
      { label: 'Copy', icon: 'copy', disabled: !hasSelection, onSelect: run('copy') },
      { label: 'Paste', icon: 'clippy', onSelect: run('paste') },
      { label: 'Select all', icon: 'blank', onSelect: run('selectAll') },
      { separator: true },
    );
  } else if (context.selectionText) {
    items.push(
      { label: 'Copy', icon: 'copy', onSelect: run('copySelection') },
      {
        label: `Search the web for "${truncate(context.selectionText, 24)}"`,
        icon: 'search',
        onSelect: run('searchSelection'),
      },
      { separator: true },
    );
  }
  if (!context.linkUrl && !context.mediaType && !context.selectionText && !context.editable) {
    items.push(
      {
        label: 'Back',
        icon: 'arrow-left',
        disabled: !tab.canGoBack,
        onSelect: tabAction('back', tab.id),
      },
      {
        label: 'Forward',
        icon: 'arrow-right',
        disabled: !tab.canGoForward,
        onSelect: tabAction('forward', tab.id),
      },
      { label: 'Reload', icon: 'refresh', onSelect: tabAction('reload', tab.id) },
      { separator: true },
      { label: 'Save as PDF...', icon: 'file-pdf', onSelect: tabAction('savePdf', tab.id) },
      {
        label: 'View page source',
        icon: 'code',
        shortcut: shortcutLabel('vscodeBrowser.viewSource'),
        onSelect: tabAction('viewSource', tab.id),
      },
      { label: 'Copy page URL', icon: 'link', onSelect: tabAction('copyUrl', tab.id) },
      {
        label: 'Open in system browser',
        icon: 'globe',
        onSelect: tabAction('openExternal', tab.id),
      },
    );
  }
  items.push(
    { separator: true },
    {
      label: 'Copy element details (for AI)',
      icon: 'inspect',
      disabled: !point,
      onSelect: run('copyElement'),
    },
    { label: 'Take screenshot', icon: 'device-camera', onSelect: run('screenshot') },
  );
  return tidyMenu(items);
}

/** The toolbar's camera button. */
export function screenshotMenu(
  tab: TabState,
  pick: { region: () => void; element: () => void },
): MenuItem[] {
  const capture = (mode: 'viewport' | 'fullPage') => () =>
    postToHost({ type: 'screenshot', tabId: tab.id, mode });
  return [
    { label: 'Visible area', icon: 'device-camera', onSelect: capture('viewport') },
    { label: 'Full page', icon: 'file-media', onSelect: capture('fullPage') },
    { label: 'Select region...', icon: 'screen-full', onSelect: pick.region },
    { label: 'Select element...', icon: 'inspect', onSelect: pick.element },
  ];
}

export function tabContextMenu(tab: TabState, tabCount: number, canReopen: boolean): MenuItem[] {
  return tidyMenu([
    {
      label: 'New tab',
      icon: 'add',
      shortcut: shortcutLabel('vscodeBrowser.newTab'),
      onSelect: tabAction('new'),
    },
    { separator: true },
    {
      label: 'Reload',
      icon: 'refresh',
      disabled: !!tab.internalPage,
      onSelect: tabAction('reload', tab.id),
    },
    { label: 'Duplicate', icon: 'copy', onSelect: tabAction('duplicate', tab.id) },
    {
      label: tab.pinned ? 'Unpin' : 'Pin',
      icon: tab.pinned ? 'pinned' : 'pin',
      onSelect: tabAction(tab.pinned ? 'unpin' : 'pin', tab.id),
    },
    {
      label: 'Move to new window',
      icon: 'multiple-windows',
      disabled: tabCount < 2,
      onSelect: tabAction('moveToNewWindow', tab.id),
    },
    { separator: true },
    {
      label: 'Close',
      icon: 'close',
      shortcut: shortcutLabel('vscodeBrowser.closeTab'),
      onSelect: tabAction('close', tab.id),
    },
    {
      label: 'Close other tabs',
      icon: 'blank',
      disabled: tabCount < 2,
      onSelect: tabAction('closeOthers', tab.id),
    },
    {
      label: 'Close tabs to the right',
      icon: 'blank',
      onSelect: tabAction('closeToRight', tab.id),
    },
    { separator: true },
    {
      label: 'Reopen closed tab',
      icon: 'history',
      shortcut: shortcutLabel('vscodeBrowser.reopenClosedTab'),
      disabled: !canReopen,
      onSelect: tabAction('reopenClosed'),
    },
  ]);
}

export function mainMenu(tab: TabState | undefined, canReopen: boolean): MenuItem[] {
  const webPage = !!tab && !tab.internalPage;
  const zoom = Math.round((tab?.zoom ?? 1) * 100);
  return tidyMenu([
    {
      label: 'New tab',
      icon: 'add',
      shortcut: shortcutLabel('vscodeBrowser.newTab'),
      onSelect: tabAction('new'),
    },
    { label: 'New window', icon: 'empty-window', onSelect: tabAction('newWindow') },
    { label: 'New private tab', icon: 'eye-closed', onSelect: tabAction('newPrivate') },
    {
      label: 'Reopen closed tab',
      icon: 'history',
      shortcut: shortcutLabel('vscodeBrowser.reopenClosedTab'),
      disabled: !canReopen,
      onSelect: tabAction('reopenClosed'),
    },
    { separator: true },
    {
      label: 'Zoom in',
      icon: 'zoom-in',
      shortcut: shortcutLabel('vscodeBrowser.zoomIn'),
      disabled: !webPage,
      onSelect: tabAction('zoomIn', tab?.id),
    },
    {
      label: `Reset zoom (${zoom}%)`,
      icon: 'screen-normal',
      shortcut: shortcutLabel('vscodeBrowser.zoomReset'),
      disabled: !webPage || zoom === 100,
      onSelect: tabAction('zoomReset', tab?.id),
    },
    {
      label: 'Zoom out',
      icon: 'zoom-out',
      shortcut: shortcutLabel('vscodeBrowser.zoomOut'),
      disabled: !webPage,
      onSelect: tabAction('zoomOut', tab?.id),
    },
    { separator: true },
    {
      label: 'Find in page...',
      icon: 'search',
      shortcut: shortcutLabel('vscodeBrowser.find'),
      disabled: !webPage,
      onSelect: tabAction('find'),
    },
    {
      label: 'Save page as PDF...',
      icon: 'file-pdf',
      disabled: !webPage,
      onSelect: tabAction('savePdf', tab?.id),
    },
    {
      label: 'View page source',
      icon: 'code',
      shortcut: shortcutLabel('vscodeBrowser.viewSource'),
      disabled: !webPage,
      onSelect: tabAction('viewSource', tab?.id),
    },
    {
      label: 'Copy page URL',
      icon: 'link',
      disabled: !webPage,
      onSelect: tabAction('copyUrl', tab?.id),
    },
    {
      label: 'Open in system browser',
      icon: 'globe',
      disabled: !webPage,
      onSelect: tabAction('openExternal', tab?.id),
    },
    { separator: true },
    {
      label: 'Bookmark this page',
      icon: 'star-add',
      disabled: !webPage,
      onSelect: tabAction('bookmark', tab?.id),
    },
    { label: 'Bookmarks', icon: 'bookmark', onSelect: () => openPage('bookmarks') },
    {
      label: 'Show or hide bookmarks bar',
      icon: 'layout-panel-off',
      onSelect: () => postToHost({ type: 'toggleBookmarksBar' }),
    },
    { label: 'History', icon: 'history', onSelect: () => openPage('history') },
    { label: 'Extensions', icon: 'extensions', onSelect: () => openPage('extensions') },
    { separator: true },
    {
      label: 'Open DevTools',
      icon: 'tools',
      shortcut: shortcutLabel('vscodeBrowser.openDevTools'),
      disabled: !webPage,
      onSelect: () =>
        tab && postToHost({ type: 'devAction', tabId: tab.id, action: 'openDevTools' }),
    },
    {
      label: 'Copy page context (for AI)',
      icon: 'copy',
      disabled: !webPage,
      onSelect: () =>
        tab && postToHost({ type: 'devAction', tabId: tab.id, action: 'copyContext' }),
    },
    {
      label: 'Downloads',
      icon: 'cloud-download',
      onSelect: () => postToHost({ type: 'navigate', input: 'vb://downloads', newTab: true }),
    },
    {
      label: 'Clear browsing data...',
      icon: 'trash',
      onSelect: () => postToHost({ type: 'clearBrowsingData' }),
    },
    { label: 'Settings', icon: 'settings-gear', onSelect: () => openPage('settings') },
    {
      label: 'Restart browser engine',
      icon: 'debug-restart',
      onSelect: () => postToHost({ type: 'restartEngine' }),
    },
  ]);
}

function openPage(page: 'history' | 'bookmarks' | 'settings' | 'extensions'): void {
  postToHost({ type: 'navigate', input: `vb://${page}`, newTab: true });
}

export function historyMenu(tabId: string, entries: HistoryEntry[]): MenuItem[] {
  return entries.map((entry) => ({
    label: truncate(entry.title || entry.url, 60),
    icon: 'globe',
    onSelect: () => postToHost({ type: 'goToHistoryEntry', tabId, entryId: entry.id }),
  }));
}
