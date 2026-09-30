import * as vscode from 'vscode';
import type { BridgeServer } from '../bridge/bridgeServer';
import { getConfig } from '../config';
import type { BookmarksStore } from '../features/bookmarks';
import { BrowserPanel, type Services, type TabSummary } from '../panel/BrowserPanel';
import { findNode, type BookmarkNode } from '../shared/bookmarks';

/** Views in the Browser container of the Activity Bar. Pages themselves open in editor tabs. */
export function registerSidebar(services: Services, bridge: BridgeServer): vscode.Disposable {
  const actionsTree = new ActionsTree(bridge);
  const actions = vscode.window.createTreeView('vscodeBrowser.actions', {
    treeDataProvider: actionsTree,
  });
  const tabs = new TabsTree();
  const bookmarks = new BookmarksTree(services.bookmarks);
  return vscode.Disposable.from(
    actions,
    // Clicking the Activity Bar icon with no browser open opens one next to the code.
    actions.onDidChangeVisibility(({ visible }) => {
      if (visible && BrowserPanel.all().length === 0) BrowserPanel.create(services);
    }),
    vscode.window.createTreeView('vscodeBrowser.tabs', { treeDataProvider: tabs }),
    vscode.window.createTreeView('vscodeBrowser.bookmarks', { treeDataProvider: bookmarks }),
    BrowserPanel.onDidChangeTabs(() => tabs.refresh()),
    services.bookmarks.onDidChange(() => bookmarks.refresh()),
    bridge.onDidChange(() => actionsTree.refresh()),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('vscodeBrowser.bridge.enabled')) actionsTree.refresh();
    }),
  );
}

interface Action {
  label: string;
  icon: string;
  command: string;
  args?: unknown[];
  /** The browser link item's extras. */
  color?: string;
  description?: string;
  tooltip?: string;
}

const LINK_TOOLTIP =
  'Link the Inkspect browser extension with VS Code: send captures from any page to your agent, and sync bookmarks and shortcuts.';

/** The first item: the browser link's state, and the one click that pairs it. */
function linkAction(bridge: BridgeServer): Action | undefined {
  if (!getConfig().bridgeEnabled) return undefined;
  const { browsers, waiting } = bridge.linkState();
  if (browsers.length) {
    return {
      label: `Linked: ${browsers[0]}`,
      description: browsers.length > 1 ? `+${browsers.length - 1}` : undefined,
      icon: 'pass-filled',
      color: 'testing.iconPassed',
      command: 'vscodeBrowser.bridge.manage',
      tooltip: `Linked with ${browsers.join(', ')}. Click to pair another browser or unlink.`,
    };
  }
  if (waiting.length) {
    return {
      label: waiting.length === 1 ? `Pair ${waiting[0]!.browser}` : 'Pair Browser Extension',
      description: waiting.length === 1 ? 'waiting to link' : `${waiting.length} browsers waiting`,
      icon: 'plug',
      color: 'charts.yellow',
      command: 'vscodeBrowser.bridge.pair',
      tooltip: `${LINK_TOOLTIP}\n\nClick to link it. No code needed.`,
    };
  }
  return {
    label: 'Pair Browser Extension',
    icon: 'plug',
    command: 'vscodeBrowser.bridge.pair',
    tooltip: LINK_TOOLTIP,
  };
}

const ACTIONS: Action[] = [
  { label: 'Open Browser', icon: 'globe', command: 'vscodeBrowser.open' },
  { label: 'Open URL...', icon: 'link', command: 'vscodeBrowser.openUrl' },
  { label: 'New Window', icon: 'empty-window', command: 'vscodeBrowser.newWindow' },
  { label: 'New Private Tab', icon: 'eye-closed', command: 'vscodeBrowser.newPrivateTab' },
  { label: 'Bookmark Current Page', icon: 'star-add', command: 'vscodeBrowser.bookmarkPage' },
  { label: 'History', icon: 'history', command: 'vscodeBrowser.showHistory' },
  { label: 'Bookmark Manager', icon: 'bookmark', command: 'vscodeBrowser.showBookmarks' },
  { label: 'Downloads', icon: 'cloud-download', command: 'vscodeBrowser.showDownloads' },
  { label: 'Import Bookmarks...', icon: 'cloud-upload', command: 'vscodeBrowser.importBookmarks' },
  { label: 'Clear Browsing Data...', icon: 'trash', command: 'vscodeBrowser.clearBrowsingData' },
  { label: 'Settings', icon: 'settings-gear', command: 'vscodeBrowser.openSettings' },
  {
    label: 'Restart Browser Engine',
    icon: 'debug-restart',
    command: 'vscodeBrowser.restartEngine',
  },
];

class ActionsTree implements vscode.TreeDataProvider<Action> {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.onDidChangeEmitter.event;
  private lastLink = '';

  constructor(private readonly bridge: BridgeServer) {}

  /** Redraws only when the link item changed (the bridge reports often). */
  refresh(): void {
    const key = JSON.stringify(linkAction(this.bridge) ?? null);
    if (key === this.lastLink) return;
    this.lastLink = key;
    this.onDidChangeEmitter.fire();
  }

  getChildren(): Action[] {
    const link = linkAction(this.bridge);
    this.lastLink = JSON.stringify(link ?? null);
    return link ? [link, ...ACTIONS] : ACTIONS;
  }

  getTreeItem(action: Action): vscode.TreeItem {
    const item = new vscode.TreeItem(action.label);
    item.iconPath = new vscode.ThemeIcon(
      action.icon,
      action.color ? new vscode.ThemeColor(action.color) : undefined,
    );
    item.description = action.description;
    item.tooltip = action.tooltip;
    item.command = { command: action.command, title: action.label, arguments: action.args };
    return item;
  }
}

type TabNode =
  { kind: 'window'; index: number; tabs: TabSummary[] } | { kind: 'tab'; tab: TabSummary };

class TabsTree implements vscode.TreeDataProvider<TabNode> {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.onDidChangeEmitter.event;
  private timer?: NodeJS.Timeout;

  /** Tab titles change often while pages load, so updates are batched. */
  refresh(): void {
    this.timer ??= setTimeout(() => {
      this.timer = undefined;
      this.onDidChangeEmitter.fire();
    }, 150);
  }

  getChildren(node?: TabNode): TabNode[] {
    if (node?.kind === 'window') return node.tabs.map((tab) => ({ kind: 'tab', tab }));
    if (node) return [];
    const windows = BrowserPanel.all().map((panel) => panel.tabSummaries());
    // With one browser window, list its tabs directly.
    if (windows.length === 1) return windows[0]!.map((tab) => ({ kind: 'tab', tab }));
    return windows.map((tabs, index) => ({ kind: 'window', index, tabs }));
  }

  getTreeItem(node: TabNode): vscode.TreeItem {
    if (node.kind === 'window') {
      const item = new vscode.TreeItem(
        `Window ${node.index + 1}`,
        vscode.TreeItemCollapsibleState.Expanded,
      );
      item.iconPath = new vscode.ThemeIcon('window');
      item.description = `${node.tabs.length} tab${node.tabs.length === 1 ? '' : 's'}`;
      return item;
    }
    const { tab } = node;
    const item = new vscode.TreeItem(tab.title || tab.url);
    item.id = tab.id;
    item.description = tab.active ? 'active' : hostOf(tab.url);
    item.tooltip = `${tab.title}\n${tab.url}`;
    item.iconPath = tab.loading
      ? new vscode.ThemeIcon('loading~spin')
      : tab.favicon
        ? vscode.Uri.parse(tab.favicon)
        : new vscode.ThemeIcon('globe');
    item.contextValue = 'browserTab';
    item.command = { command: 'vscodeBrowser.focusTab', title: 'Show Tab', arguments: [tab.id] };
    return item;
  }
}

/** Bookmark folders and bookmarks. Elements are node ids. */
class BookmarksTree implements vscode.TreeDataProvider<string> {
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChangeTreeData = this.onDidChangeEmitter.event;

  constructor(private readonly store: BookmarksStore) {}

  refresh(): void {
    this.onDidChangeEmitter.fire();
  }

  getChildren(id?: string): string[] {
    const roots = this.store.roots;
    if (!id) {
      // Show "Other bookmarks" only when it has something in it.
      return roots.other.children?.length ? [roots.bar.id, roots.other.id] : [roots.bar.id];
    }
    return (findNode(roots, id)?.node.children ?? []).map((child) => child.id);
  }

  getTreeItem(id: string): vscode.TreeItem {
    const node = findNode(this.store.roots, id)?.node;
    if (!node) return new vscode.TreeItem('');
    return node.type === 'folder' ? this.folderItem(node) : this.bookmarkItem(node);
  }

  private folderItem(node: BookmarkNode): vscode.TreeItem {
    const isRoot = node.id === this.store.roots.bar.id || node.id === this.store.roots.other.id;
    const item = new vscode.TreeItem(
      node.title,
      isRoot ? vscode.TreeItemCollapsibleState.Expanded : vscode.TreeItemCollapsibleState.Collapsed,
    );
    item.id = node.id;
    item.iconPath = new vscode.ThemeIcon(isRoot ? 'bookmark' : 'folder');
    item.description = `${node.children?.length ?? 0}`;
    item.contextValue = isRoot ? 'bookmarkRoot' : 'bookmarkFolder';
    return item;
  }

  private bookmarkItem(node: BookmarkNode): vscode.TreeItem {
    const item = new vscode.TreeItem(node.title);
    item.id = node.id;
    item.description = hostOf(node.url ?? '');
    item.tooltip = `${node.title}\n${node.url}`;
    item.iconPath = node.favicon
      ? vscode.Uri.parse(node.favicon)
      : new vscode.ThemeIcon('star-full');
    item.contextValue = 'bookmark';
    item.command = { command: 'vscodeBrowser.openUrl', title: 'Open', arguments: [node.url] };
    return item;
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).host || url;
  } catch {
    return url;
  }
}
