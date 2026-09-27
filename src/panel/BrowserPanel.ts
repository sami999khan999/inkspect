import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import * as vscode from 'vscode';
import type { BrowserEngine } from '../browser/BrowserEngine';
import { clipboardShortcut, Modifier } from '../browser/input';
import { errorMessage } from '../browser/logger';
import { TabSession, type FileChooserRequest, type Viewport } from '../browser/TabSession';
import { getConfig } from '../config';
import type { EngineHost, PageOpenedEvent } from '../engineHost';
import type { BookmarksStore } from '../features/bookmarks';
import type { DownloadsManager } from '../features/downloads';
import type { ExtensionsManager } from '../features/extensions';
import type { HistoryStore } from '../features/historyStore';
import { deliverScreenshot, displayPath, saveScreenshot } from '../features/screenshots';
import { formatDetails } from '../shared/elementInfo';
import type { SavedWindow, SessionStore } from '../features/sessions';
import { acceptToFilters } from '../features/fileChooser';
import { stepZoom, type ZoomStore } from '../features/zoom';
import { normalizeSourcePath } from '../features/sourcePaths';
import { sanitizeShapes } from '../shared/annotations';
import {
  formatConsoleErrors,
  formatFailedRequests,
  formatPageContext,
  type ConsoleEntry,
} from '../shared/devtools';
import {
  customPresets,
  DEFAULT_EMULATION,
  DEVICE_PRESETS,
  presetToDevice,
  sanitizeEmulation,
} from '../shared/devices';
import { parseInternalUrl } from '../shared/internalPages';
import {
  isWebviewToHost,
  type ContextMenuAction,
  type HostToWebview,
  type InputEvent,
  type InternalPage,
  type InspectPurpose,
  type Rect,
  type KeyInput,
  type PageContext,
  type TabAction,
  type WebviewToHost,
} from '../shared/protocol';
import type { Suggestion } from '../shared/history';
import { normalizeInput } from '../shared/url';
import {
  openInSystemBrowser,
  saveResource,
  savePageAsPdf,
  sniffImageType,
  viewPageSource,
} from './pageActions';
import { Tab } from './Tab';
import {
  bookmarksMessage,
  clearBrowsingData,
  pageData,
  runBookmarkAction,
  suggestions,
} from './browserData';
import { editorHost, webviewOptions, type BrowserHost } from './hosts';
import { sendToChat } from '../agent/chat';
import type { ScreenshotResult } from '../agent/tools';
import { closeDevTools, openDevTools } from './devtoolsPanel';
import { Inspector, workspaceComponentPath } from './inspector';
import { renderWebviewHtml } from './webviewHtml';

export interface Services {
  context: vscode.ExtensionContext;
  engineHost: EngineHost;
  downloads: DownloadsManager;
  bookmarks: BookmarksStore;
  history: HistoryStore;
  extensions: ExtensionsManager;
  sessions: SessionStore;
  zoom: ZoomStore;
  logger: vscode.LogOutputChannel;
}

/** A tab as listed in the sidebar's Open Tabs view. */
export interface TabSummary {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  loading: boolean;
  active: boolean;
}

const MAX_CLOSED_TABS = 25;
/** Popups within this time after a middle-click or Ctrl+click open in the background. */
const BACKGROUND_OPEN_WINDOW_MS = 1_000;

/** A browser window with its own tabs, shown in an editor tab. */
export class BrowserPanel implements vscode.Disposable {
  static readonly viewType = 'vscodeBrowser.browser';

  private static readonly panels = new Set<BrowserPanel>();
  private static lastActive?: BrowserPanel;
  private static readonly onDidChangeTabsEmitter = new vscode.EventEmitter<void>();
  /** Fires when any window's tabs change (opened, closed, renamed, activated). */
  static readonly onDidChangeTabs = BrowserPanel.onDidChangeTabsEmitter.event;

  /** Finds a tab in any window, shows that window and switches to the tab. */
  static focusTab(tabId: string): void {
    for (const panel of BrowserPanel.panels) {
      const tab = panel.tabs.find((t) => t.id === tabId);
      if (!tab) continue;
      panel.reveal();
      panel.activateTab(tab);
      return;
    }
  }

  static async closeTabById(tabId: string): Promise<void> {
    for (const panel of BrowserPanel.panels) {
      const tab = panel.tabs.find((t) => t.id === tabId);
      if (tab) await panel.closeTab(tab);
    }
  }

  /** The panel that was focused most recently. */
  static active(): BrowserPanel | undefined {
    const last = BrowserPanel.lastActive;
    return last && BrowserPanel.panels.has(last) ? last : [...BrowserPanel.panels].at(-1);
  }

  static all(): BrowserPanel[] {
    return [...BrowserPanel.panels];
  }

  /** Opens a browser window in an editor tab. */
  static create(
    services: Services,
    init: WindowInit = {},
    column: vscode.ViewColumn = vscode.ViewColumn.Active,
  ): BrowserPanel {
    const panel = vscode.window.createWebviewPanel(
      BrowserPanel.viewType,
      'New Tab',
      column,
      webviewOptions(services.context.extensionUri),
    );
    return new BrowserPanel(editorHost(panel, services.context.extensionUri), services, init);
  }

  /** Recreates a window VS Code restored after a reload (see the webview panel serializer). */
  static restore(services: Services, panel: vscode.WebviewPanel, windowId?: string): BrowserPanel {
    panel.webview.options = webviewOptions(services.context.extensionUri);
    const saved = windowId ? services.sessions.get(windowId) : undefined;
    const restore = getConfig().sessionRestore === 'always' ? saved : undefined;
    return new BrowserPanel(editorHost(panel, services.context.extensionUri), services, {
      windowId,
      saved: restore,
    });
  }

  /** Open tabs of every window, as address bar suggestions. */
  private static tabSuggestions(): Suggestion[] {
    return BrowserPanel.all().flatMap((panel) =>
      panel.tabs
        .filter((tab) => !tab.internalPage && !tab.private)
        .map((tab) => ({ kind: 'tab' as const, url: tab.url, title: tab.title, tabId: tab.id })),
    );
  }

  /** Opens `url` in a new tab of the active browser window, creating a window if needed. */
  static open(services: Services, url?: string): BrowserPanel {
    const panel = BrowserPanel.active();
    if (!panel) return BrowserPanel.create(services, { url });
    panel.reveal();
    panel.openUrl(url);
    return panel;
  }

  /** Puts a page opened by a page (popup, `target=_blank`) into its opener's window. */
  static routePageOpened(services: Services, { engine, info }: PageOpenedEvent): void {
    const opener = info.openerId
      ? BrowserPanel.all().find((panel) => panel.ownsTarget(info.openerId!))
      : undefined;
    const panel = opener ?? BrowserPanel.active() ?? BrowserPanel.create(services);
    panel.adoptPage(engine, info.targetId, info.url, info.title, info.openerId);
  }

  private readonly tabs: Tab[] = [];
  private activeTabId?: string;
  private readonly closedTabs: { url: string; title: string }[] = [];
  private viewport?: Viewport;
  private ready = false;
  private disposed = false;
  private stateTimer?: NodeJS.Timeout;
  private backgroundOpenUntil = 0;
  private framesPosted = 0;
  /** Last image saved from a webview composite (drawing screenshots), for tests. */
  private lastSavedImage?: string;
  private framesAcked = 0;
  private sessionTimer?: NodeJS.Timeout;
  private readonly windowId: string;
  private readonly inspector: Inspector;
  /** The tab whose console/network log streams to the open developer drawer. */
  private devConsoleTabId?: string;
  private devDataTimer?: NodeJS.Timeout;
  /** An open extension popup (streamed into an overlay, not a tab). */
  private popup?: { tab: Tab; extensionId: string };
  private readonly disposables: vscode.Disposable[] = [];

  private constructor(
    private readonly host: BrowserHost,
    private readonly services: Services,
    init: WindowInit,
  ) {
    this.windowId = init.windowId ?? randomUUID();
    this.inspector = new Inspector({
      post: (message) => this.post(message),
      toast: (message) => this.post({ type: 'toast', message }),
      globalStorage: services.context.globalStorageUri.fsPath,
      logger: services.logger,
    });
    BrowserPanel.panels.add(this);
    BrowserPanel.lastActive = this;
    host.webview.html = renderWebviewHtml(host.webview, services.context.extensionUri);
    this.disposables.push(
      services.engineHost.retain(),
      host.webview.onDidReceiveMessage((message: unknown) => this.onMessage(message)),
      host.onDidDispose(() => this.dispose()),
      host.onDidChangeViewState(() => this.onViewStateChanged()),
      services.engineHost.onDidChangeState((state) => this.post({ type: 'engine', state })),
      services.engineHost.onDidStart(() => this.onEngineStarted()),
      services.downloads.onDidChange(({ started }) =>
        this.post({ type: 'downloads', downloads: services.downloads.list(), started }),
      ),
      services.bookmarks.onDidChange(() => {
        this.post(bookmarksMessage(services));
        this.queueState();
        this.refreshInternalPage('bookmarks');
      }),
      services.extensions.onDidChange(() =>
        this.post({ type: 'extensions', list: services.extensions.list() }),
      ),
      services.history.onDidChange(() => {
        this.refreshInternalPage('history');
        this.refreshInternalPage('newtab');
      }),
      vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('vscodeBrowser.showBookmarksBar')) {
          this.post(bookmarksMessage(services));
        }
        if (event.affectsConfiguration('vscodeBrowser.devices.custom')) this.postDevices();
      }),
    );
    if (init.tab) this.adoptTab(init.tab);
    else if (init.saved?.tabs.length) this.restoreTabs(init.saved);
    else this.openTab(init.url, { private: init.private });
    // Start the engine right away so the first page loads quickly.
    services.engineHost.start().catch(() => {
      // The error is shown in the panel through the engine state.
    });
  }

  private get logger(): vscode.LogOutputChannel {
    return this.services.logger;
  }

  private get activeTab(): Tab | undefined {
    return this.tabs.find((tab) => tab.id === this.activeTabId);
  }

  private tab(id: string | undefined): Tab | undefined {
    return id === undefined ? this.activeTab : this.tabs.find((tab) => tab.id === id);
  }

  ownsTarget(targetId: string): boolean {
    return this.tabs.some((tab) => tab.session?.targetId === targetId);
  }

  reveal(): void {
    this.host.reveal();
  }

  tabSummaries(): TabSummary[] {
    return this.tabs.map((tab) => ({
      id: tab.id,
      title: tab.title || tab.url,
      url: tab.url,
      favicon: tab.favicon,
      loading: tab.loading,
      active: tab.id === this.activeTabId,
    }));
  }

  /** Snapshot for the `vscodeBrowser.debug.state` command (used by integration tests). */
  debugState() {
    return {
      ready: this.ready,
      viewport: this.viewport,
      framesPosted: this.framesPosted,
      framesAcked: this.framesAcked,
      lastSavedImage: this.lastSavedImage,
      activeTabId: this.activeTabId,
      tabs: this.tabs.map((tab) => ({ ...tab.toState(), live: !!tab.session })),
    };
  }

  // -------------------------------------------------------------------------------------------
  // Commands (called from VS Code keybindings and the command palette)
  // -------------------------------------------------------------------------------------------

  /** Opens `url` (or the new tab page) in a new tab, reusing an empty new tab page. */
  openUrl(url: string | undefined): void {
    const active = this.activeTab;
    if (url && active?.internalPage === 'newtab' && !active.hasPageBehind) {
      void this.load(active, url);
    } else {
      this.openTab(url);
    }
  }

  focusAddressBar(): void {
    this.post({ type: 'focusAddressBar' });
  }

  cycleTab(step: 1 | -1): void {
    if (this.tabs.length < 2) return;
    const index = this.tabs.findIndex((tab) => tab.id === this.activeTabId);
    const next = this.tabs[(index + step + this.tabs.length) % this.tabs.length];
    if (next) this.activateTab(next);
  }

  /** Reloads tabs showing a local file after it is saved in the editor. */
  reloadFile(fsPath: string): void {
    for (const tab of this.tabs) {
      if (!tab.session || !tab.url.startsWith('file:')) continue;
      try {
        if (samePath(fileURLToPath(tab.url), fsPath)) void tab.session.reload();
      } catch {
        // Not a valid file URL.
      }
    }
  }

  async runTabAction(action: TabAction, tabId?: string): Promise<void> {
    const tab = this.tab(tabId);
    const session = tab?.session;
    switch (action) {
      case 'new':
        this.openTab(undefined);
        return;
      case 'newPrivate':
        this.openTab(undefined, { private: true });
        return;
      case 'newWindow':
        BrowserPanel.create(this.services);
        return;
      case 'reopenClosed': {
        const last = this.closedTabs.pop();
        if (last) this.openTab(last.url);
        this.queueState();
        return;
      }
      case 'find':
        this.post({ type: 'openFind' });
        return;
    }
    if (!tab) return;
    switch (action) {
      case 'close':
        await this.closeTab(tab);
        break;
      case 'activate':
        this.activateTab(tab);
        break;
      case 'reload':
      case 'hardReload':
        if (tab.internalPage) break;
        if (tab.crashed || !session) await this.load(tab, tab.url);
        else await session.reload(action === 'hardReload');
        break;
      case 'stop':
        await session?.stop();
        break;
      case 'back':
        if (tab.internalPage && tab.hasPageBehind) this.leaveInternalPage(tab);
        else await session?.goBack();
        break;
      case 'forward':
        await session?.goForward();
        break;
      case 'home':
        await this.navigate(tab, getConfig().homepage);
        break;
      case 'duplicate':
        this.openTab(tab.url, { index: this.tabs.indexOf(tab) + 1 });
        break;
      case 'pin':
      case 'unpin':
        this.setPinned(tab, action === 'pin');
        break;
      case 'moveToNewWindow':
        this.moveTabToNewWindow(tab);
        break;
      case 'closeOthers':
        await Promise.all(
          this.tabs.filter((t) => t !== tab && !t.pinned).map((t) => this.closeTab(t)),
        );
        break;
      case 'closeToRight':
        await Promise.all(
          this.tabs
            .slice(this.tabs.indexOf(tab) + 1)
            .filter((t) => !t.pinned)
            .map((t) => this.closeTab(t)),
        );
        break;
      case 'zoomIn':
      case 'zoomOut':
      case 'zoomReset':
        await this.setZoom(
          tab,
          action === 'zoomReset' ? 1 : stepZoom(tab.zoom, action === 'zoomIn' ? 1 : -1),
        );
        break;
      case 'savePdf':
        if (session && !tab.internalPage) {
          await savePageAsPdf(session, tab.title, this.services.downloads.directory);
        }
        break;
      case 'viewSource':
        if (session && !tab.internalPage) await viewPageSource(session);
        break;
      case 'openExternal':
        await openInSystemBrowser(tab.url);
        break;
      case 'bookmark':
        this.editBookmark();
        break;
      case 'copyUrl':
        await vscode.env.clipboard.writeText(tab.url);
        this.post({ type: 'toast', message: 'Link copied' });
        break;
    }
  }

  // -------------------------------------------------------------------------------------------
  // Webview messages
  // -------------------------------------------------------------------------------------------

  private onMessage(message: unknown): void {
    if (!isWebviewToHost(message)) {
      this.logger.debug(
        `Ignored invalid webview message: ${JSON.stringify(message)?.slice(0, 200)}`,
      );
      return;
    }
    this.handle(message).catch((error: unknown) => {
      this.logger.error(`Handling "${message.type}" failed: ${errorMessage(error)}`);
      this.post({ type: 'toast', message: errorMessage(error) });
    });
  }

  private async handle(message: WebviewToHost): Promise<void> {
    switch (message.type) {
      case 'ready':
        this.onReady();
        return;
      case 'focus':
        BrowserPanel.lastActive = this;
        return;
      case 'viewport':
        this.viewport = { width: message.width, height: message.height, dpr: message.dpr };
        if (this.activeTab) await this.showTab(this.activeTab);
        return;
      case 'frameAck':
        this.framesAcked++;
        (this.tab(message.tabId) ?? this.popupTab(message.tabId))?.session?.ackFrame();
        return;
      case 'input':
        await this.onInput(message.tabId, message.event);
        return;
      case 'navigate': {
        const tab = message.newTab ? undefined : this.tab(message.tabId);
        if (tab) await this.navigate(tab, message.input);
        else this.openTab(normalizeInput(message.input, getConfig().searchUrl));
        return;
      }
      case 'tab':
        await this.runTabAction(message.action, message.tabId);
        return;
      case 'moveTab':
        this.moveTab(message.tabId, message.index);
        return;
      case 'requestHistory': {
        const entries =
          (await this.tab(message.tabId)?.session?.historyEntries(message.direction)) ?? [];
        this.post({ type: 'history', tabId: message.tabId, direction: message.direction, entries });
        return;
      }
      case 'goToHistoryEntry':
        await this.tab(message.tabId)?.session?.goToHistoryEntry(message.entryId);
        return;
      case 'find': {
        const session = this.tab(message.tabId)?.session;
        if (!session) return;
        const result = await session.find(message.query, message.caseSensitive, message.direction);
        this.post({ type: 'findResult', tabId: message.tabId, ...result });
        return;
      }
      case 'stopFind':
        await this.tab(message.tabId)?.session?.stopFind();
        return;
      case 'dialogResponse': {
        const tab = this.tab(message.tabId);
        if (!tab?.session) return;
        tab.dialog = undefined;
        this.queueState();
        await tab.session.respondToDialog(message.accept, message.promptText);
        return;
      }
      case 'contextMenuAction': {
        const tab = this.tab(message.tabId);
        if (tab) {
          await this.runContextMenuAction(tab, message.action, message.context, message.point);
        }
        return;
      }
      case 'download':
        await this.services.downloads.run(message.action, message.id);
        return;
      case 'restartEngine':
        await this.services.engineHost.restart();
        return;
      case 'suggest':
        this.post({
          type: 'suggestions',
          query: message.query,
          items: suggestions(this.services, message.query, BrowserPanel.tabSuggestions()),
        });
        return;
      case 'focusTab':
        BrowserPanel.focusTab(message.tabId);
        return;
      case 'requestPageData': {
        const data = await pageData(this.services, message.page, message.query);
        if (data) this.post({ type: 'pageData', data });
        return;
      }
      case 'bookmark': {
        // The webview's copy of the tab can lag behind (e.g. just after a reload): fill in the title.
        const action =
          message.action === 'add' && !message.title
            ? {
                ...message,
                title: this.tabs.find((t) => t.url === message.url && t.title)?.title ?? '',
              }
            : message;
        await runBookmarkAction(this.services, action, (url, newTab) => {
          const active = this.activeTab;
          if (newTab || !active) this.openTab(url, { activate: !newTab });
          else void this.load(active, url);
        });
        return;
      }
      case 'historyAction':
        if (message.action === 'remove' && message.url) this.services.history.remove(message.url);
        if (message.action === 'clear' && message.range) this.services.history.clear(message.range);
        return;
      case 'clearBrowsingData':
        await clearBrowsingData(this.services, this.openOrigins());
        return;
      case 'inspect': {
        const tab = this.tab(message.tabId);
        const session = tab?.session;
        if (!tab || !session) return;
        switch (message.action) {
          case 'hover':
            this.inspector.hover(tab.id, session, message.x, message.y);
            return;
          case 'pick':
            await this.inspector.pick(tab.id, session, { ...message, url: tab.url });
            return;
          case 'parent':
          case 'child':
            await this.inspector.traverse(tab.id, session, message.action);
            return;
          case 'copySelection':
            await this.inspector.copySelection();
            return;
          case 'stop':
            await this.inspector.stop(session);
            return;
        }
        return;
      }
      case 'screenshot': {
        const tab = this.tab(message.tabId);
        if (tab) await this.captureScreenshot(tab, message.mode, message.rect);
        return;
      }
      case 'annotations': {
        const tab = this.tab(message.tabId);
        if (tab) tab.annotations = sanitizeShapes(message.shapes);
        return;
      }
      case 'annotationCapture': {
        const tab = this.tab(message.tabId);
        await this.captureForAnnotations(tab, message.requestId, message.area, message.rect);
        return;
      }
      case 'saveImage': {
        const tab = this.tab(message.tabId);
        const bytes = Buffer.from(message.base64, 'base64');
        if (!tab || bytes.length < 8 || bytes.length > 200_000_000) return;
        this.lastSavedImage = await deliverScreenshot({
          bytes,
          url: tab.url,
          format: 'png',
          globalStorage: this.services.context.globalStorageUri.fsPath,
          copyImage: (data, mimeType) => this.post({ type: 'copyImage', data, mimeType }),
          label: message.label.slice(0, 80),
        });
        return;
      }
      case 'extension':
        await this.runExtensionAction(message);
        return;
      case 'devConsole': {
        this.devConsoleTabId = message.open ? message.tabId : undefined;
        const session = this.tab(message.tabId)?.session;
        if (message.open && session) {
          await session.startNetworkLog();
          this.postDevData();
        }
        return;
      }
      case 'devAction':
        await this.runDevAction(message.tabId, message.action, message.chat);
        return;
      case 'openSource':
        await this.openSource(message.url, message.line, message.column);
        return;
      case 'closeExtensionPopup':
        await this.closeExtensionPopup();
        return;
      case 'emulation': {
        const tab = this.tab(message.tabId);
        if (!tab) return;
        tab.emulation = sanitizeEmulation(message.settings);
        this.queueState();
        await tab.session?.setEmulation(tab.emulation);
        return;
      }
      case 'saveCustomDevice': {
        const config = vscode.workspace.getConfiguration('vscodeBrowser');
        const existing = config.get<unknown[]>('devices.custom', []);
        const device = sanitizeEmulation({ device: message.device }).device;
        if (!device) return;
        const saved: Record<string, unknown> = { name: message.name.slice(0, 60), ...device };
        delete saved.presetId;
        await config.update(
          'devices.custom',
          [...existing, saved],
          vscode.ConfigurationTarget.Global,
        );
        this.post({ type: 'toast', message: `Saved "${message.name}"` });
        return;
      }
      case 'toggleBookmarksBar':
        await vscode.workspace
          .getConfiguration('vscodeBrowser')
          .update(
            'showBookmarksBar',
            !getConfig().showBookmarksBar,
            vscode.ConfigurationTarget.Global,
          );
        return;
      case 'openSettings':
        await vscode.commands.executeCommand(
          'workbench.action.openSettings',
          `@ext:${this.services.context.extension.id}`,
        );
        return;
    }
  }

  private onReady(): void {
    this.ready = true;
    this.post({ type: 'engine', state: this.services.engineHost.getState() });
    this.post({ type: 'downloads', downloads: this.services.downloads.list() });
    this.post(bookmarksMessage(this.services));
    this.post({ type: 'extensions', list: this.services.extensions.list() });
    this.postDevices();
    this.postState();
    const active = this.activeTab;
    if (active) this.post({ type: 'annotations', tabId: active.id, shapes: active.annotations });
    // The webview was (re)loaded, so its canvas is empty: restart the stream for a fresh frame.
    if (this.activeTab) void this.showTab(this.activeTab, true);
  }

  private onViewStateChanged(): void {
    if (this.host.active) BrowserPanel.lastActive = this;
    if (!this.host.visible) {
      // The webview is destroyed while hidden; it reports `ready` again when shown.
      this.ready = false;
      if (this.activeTab) this.hideTab(this.activeTab);
    }
  }

  private async onInput(tabId: string, event: InputEvent): Promise<void> {
    const popup = this.popupTab(tabId);
    const tab = popup ?? this.tab(tabId);
    const session = tab?.session;
    if (!tab || !session || (!popup && tab.id !== this.activeTabId)) return;
    switch (event.kind) {
      case 'mouse':
        if (
          event.type === 'mousePressed' &&
          (event.button === 'middle' || (event.modifiers & (Modifier.Ctrl | Modifier.Meta)) !== 0)
        ) {
          this.backgroundOpenUntil = Date.now() + BACKGROUND_OPEN_WINDOW_MS;
        }
        session.dispatchMouse(event);
        return;
      case 'wheel':
        session.dispatchWheel(event);
        return;
      case 'text':
        session.insertText(event.text);
        return;
      case 'key':
        await this.onKey(tab, session, event);
        return;
    }
  }

  /** Forwards a key, bridging copy/cut/paste between the page and the system clipboard. */
  private async onKey(tab: Tab, session: TabSession, event: KeyInput): Promise<void> {
    const shortcut = clipboardShortcut(event, process.platform);
    if (shortcut === 'paste') {
      const text = await vscode.env.clipboard.readText();
      if (text) await session.paste(text);
      return;
    }
    if (shortcut === 'cut') {
      const text = await session.selectedText();
      if (text) await vscode.env.clipboard.writeText(text);
    }
    await session.dispatchKey(event);
    if (shortcut === 'copy') {
      const text = await session.selectedText();
      if (text) await vscode.env.clipboard.writeText(text);
    }
    if (event.type === 'keyDown' && event.key === 'Escape' && tab.fullscreen) {
      session.exitFullscreen();
    }
  }

  private async runContextMenuAction(
    tab: Tab,
    action: ContextMenuAction,
    context: PageContext,
    point?: { x: number; y: number },
  ): Promise<void> {
    const session = tab.session;
    const nextIndex = this.tabs.indexOf(tab) + 1;
    const clipboard = async (text: string | undefined, toast: string) => {
      if (!text) return;
      await vscode.env.clipboard.writeText(text);
      this.post({ type: 'toast', message: toast });
    };
    switch (action) {
      case 'openLinkInNewTab':
        if (context.linkUrl) this.openTab(context.linkUrl, { activate: false, index: nextIndex });
        break;
      case 'openLinkExternal':
        if (context.linkUrl) await openInSystemBrowser(context.linkUrl);
        break;
      case 'copyLink':
        await clipboard(context.linkUrl, 'Link copied');
        break;
      case 'openMediaInNewTab':
        if (context.srcUrl) this.openTab(context.srcUrl, { index: nextIndex });
        break;
      case 'copyMediaUrl':
        await clipboard(context.srcUrl, 'Address copied');
        break;
      case 'copyImage':
        if (session && context.srcUrl) {
          const bytes = await session.fetchResource(context.srcUrl);
          this.post({
            type: 'copyImage',
            data: new Uint8Array(bytes),
            mimeType: sniffImageType(bytes),
          });
        }
        break;
      case 'saveMedia':
        if (session && context.srcUrl) {
          await saveResource(session, context.srcUrl, this.services.downloads.directory);
        }
        break;
      case 'copySelection':
        await clipboard(context.selectionText, 'Copied');
        break;
      case 'searchSelection':
        if (context.selectionText) {
          const query = context.selectionText.trim().slice(0, 500);
          this.openTab(getConfig().searchUrl.replace('%s', encodeURIComponent(query)), {
            index: nextIndex,
          });
        }
        break;
      case 'cut':
        if (session) {
          const text = await session.selectedText();
          if (text) {
            await vscode.env.clipboard.writeText(text);
            await session.execCommand('delete');
          }
        }
        break;
      case 'copy':
        await clipboard((await session?.selectedText()) || context.selectionText, 'Copied');
        break;
      case 'paste':
        if (session) {
          const text = await vscode.env.clipboard.readText();
          if (text) await session.paste(text);
        }
        break;
      case 'selectAll':
        await session?.execCommand('selectAll');
        break;
      case 'copyElement':
        if (session && point) {
          await this.inspector.pick(tab.id, session, {
            ...point,
            purpose: 'copy',
            add: false,
            screenshot: false,
            url: tab.url,
          });
          await this.inspector.stop(session);
        }
        break;
      case 'screenshot':
        await this.captureScreenshot(tab, 'viewport');
        break;
    }
  }

  // -------------------------------------------------------------------------------------------
  // Tabs
  // -------------------------------------------------------------------------------------------

  /** Opens a new tab with `url`, or the new tab page when `url` is undefined. */
  private openTab(url: string | undefined, options: OpenTabOptions = {}): Tab {
    const tab = new Tab();
    tab.private = options.private ?? false;
    tab.pinned = options.pinned ?? false;
    const target = url ?? 'vb://newtab';
    const internal = parseInternalUrl(target);
    if (internal) {
      tab.showInternalPage(internal);
    } else {
      tab.url = target;
      tab.title = options.title ?? target;
      tab.loading = !options.lazy;
      tab.progress = options.lazy ? 0 : 0.05;
      tab.zoom = options.zoom ?? this.services.zoom.get(target);
    }
    this.insertTab(tab, options.index);
    if (options.activate !== false) this.activateTab(tab);
    else this.queueState();
    // Lazy tabs (restored sessions) load when first activated.
    if (!internal && !options.lazy && !tab.session && !tab.sessionPromise) {
      void this.ensureSession(tab, target);
    }
    this.enforceLiveTabLimit();
    return tab;
  }

  /** Reopens the tabs saved for this window; only the active one loads right away. */
  private restoreTabs(saved: SavedWindow): void {
    const tabs = saved.tabs.map((t) =>
      this.openTab(t.url, {
        lazy: true,
        activate: false,
        title: t.title,
        pinned: t.pinned,
        zoom: t.zoom,
      }),
    );
    const active = tabs[saved.activeIndex] ?? tabs[0];
    if (active) this.activateTab(active);
  }

  /** Opens the bookmark editor for the active page (adding the bookmark if needed). */
  editBookmark(): void {
    const tab = this.activeTab;
    if (!tab || tab.internalPage || !/^(https?|file):/.test(tab.url)) {
      void vscode.window.showInformationMessage('Open a web page in the browser to bookmark it.');
      return;
    }
    this.reveal();
    this.post({ type: 'editBookmark' });
  }

  /** Tells an internal page that is showing to fetch its data again. */
  private refreshInternalPage(page: InternalPage): void {
    if (this.activeTab?.internalPage === page) this.post({ type: 'pageDataChanged', page });
  }

  private openOrigins(): string[] {
    return this.tabs.flatMap((tab) => {
      try {
        const origin = new URL(tab.url).origin;
        return origin === 'null' ? [] : [origin];
      } catch {
        return [];
      }
    });
  }

  /** Adds a tab that already has a session (moved from another window). */
  private adoptTab(tab: Tab): void {
    this.insertTab(tab);
    if (tab.session) this.bindSession(tab, tab.session);
    this.activateTab(tab);
  }

  /** Adds a tab for a page Chromium opened by itself (popup or `target=_blank`). */
  private adoptPage(
    engine: BrowserEngine,
    targetId: string,
    url: string,
    title: string,
    openerId?: string,
  ): void {
    const opener = openerId ? this.tabs.find((t) => t.session?.targetId === openerId) : undefined;
    this.logger.info(
      `Page opened ${opener ? 'by a tab' : 'by the browser'}: ${url || 'about:blank'}`,
    );
    const tab = new Tab();
    tab.url = url || 'about:blank';
    tab.title = title || tab.url;
    tab.loading = true;
    tab.progress = 0.05;
    this.insertTab(tab, opener ? this.tabs.indexOf(opener) + 1 : undefined);
    tab.sessionPromise = (async () => {
      const session = await TabSession.attach(engine, targetId, this.sessionOptions());
      if (tab.closed || this.disposed) {
        await session.discard();
        return;
      }
      this.bindSession(tab, session);
      tab.zoom = this.services.zoom.get(session.url);
      await this.showTab(tab);
    })()
      .catch((error: unknown) =>
        this.logger.error(`Could not attach to popup: ${errorMessage(error)}`),
      )
      .finally(() => {
        tab.sessionPromise = undefined;
      });
    if (Date.now() < this.backgroundOpenUntil) this.queueState();
    else this.activateTab(tab);
    this.enforceLiveTabLimit();
  }

  private insertTab(tab: Tab, index?: number): void {
    const pinnedCount = this.tabs.filter((t) => t.pinned).length;
    const min = tab.pinned ? 0 : pinnedCount;
    const max = tab.pinned ? pinnedCount : this.tabs.length;
    const at = Math.min(max, Math.max(min, index ?? max));
    this.tabs.splice(at, 0, tab);
  }

  private activateTab(tab: Tab): void {
    if (this.activeTabId === tab.id) return;
    const previous = this.activeTab;
    this.activeTabId = tab.id;
    tab.lastActive = Date.now();
    this.post({ type: 'annotations', tabId: tab.id, shapes: tab.annotations });
    if (previous) this.hideTab(previous);
    if (!tab.session && !tab.sessionPromise && !tab.internalPage) {
      // A discarded tab, or one whose engine went away: load it again.
      void this.ensureSession(tab, tab.url);
    } else {
      void this.showTab(tab);
    }
    this.enforceLiveTabLimit();
    this.queueState();
  }

  private async closeTab(tab: Tab): Promise<void> {
    const session = tab.session;
    if (!session) {
      this.removeTab(tab);
      return;
    }
    await session.close();
    if (tab.session === session && !tab.dialog) {
      // The page did not go away (e.g. the engine is unresponsive); drop it anyway.
      tab.unbind?.();
      tab.session = undefined;
      void session.discard();
      this.removeTab(tab);
    } else if (tab.dialog) {
      // A beforeunload dialog is asking the user whether to leave.
      this.activateTab(tab);
    }
  }

  private removeTab(tab: Tab): void {
    const index = this.tabs.indexOf(tab);
    if (index === -1) return;
    tab.closed = true;
    this.tabs.splice(index, 1);
    if (!tab.internalPage && !tab.private && tab.url && tab.url !== 'about:blank') {
      this.closedTabs.push({ url: tab.url, title: tab.title });
      if (this.closedTabs.length > MAX_CLOSED_TABS) this.closedTabs.shift();
    }
    if (tab.private) BrowserPanel.releasePrivateContextIfUnused(this.services);
    if (this.tabs.length === 0) {
      this.host.dispose();
      return;
    }
    if (this.activeTabId === tab.id) {
      this.activeTabId = undefined;
      const next = this.tabs[index] ?? this.tabs[index - 1];
      if (next) this.activateTab(next);
    }
    this.queueState();
  }

  /** Removes a tab from this window without closing its page (to move it elsewhere). */
  private detachTab(tab: Tab): void {
    const index = this.tabs.indexOf(tab);
    if (index === -1) return;
    this.hideTab(tab);
    tab.unbind?.();
    tab.unbind = undefined;
    this.tabs.splice(index, 1);
    if (this.tabs.length === 0) {
      this.host.dispose();
      return;
    }
    if (this.activeTabId === tab.id) {
      this.activeTabId = undefined;
      const next = this.tabs[index] ?? this.tabs[index - 1];
      if (next) this.activateTab(next);
    }
    this.queueState();
  }

  private moveTabToNewWindow(tab: Tab): void {
    if (this.tabs.length < 2) return;
    this.detachTab(tab);
    BrowserPanel.create(this.services, { tab }, vscode.ViewColumn.Beside);
  }

  private moveTab(tabId: string, index: number): void {
    const tab = this.tab(tabId);
    if (!tab) return;
    const from = this.tabs.indexOf(tab);
    this.tabs.splice(from, 1);
    this.insertTab(tab, index > from ? index - 1 : index);
    this.queueState();
  }

  private setPinned(tab: Tab, pinned: boolean): void {
    if (tab.pinned === pinned) return;
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    tab.pinned = pinned;
    // Pinning moves the tab to the end of the pinned tabs; unpinning to just after them.
    this.insertTab(tab, pinned ? this.tabs.length : 0);
    this.queueState();
  }

  /** Frees memory by closing the pages of the least recently used background tabs. */
  private enforceLiveTabLimit(): void {
    const max = getConfig().maxLiveTabs;
    let live = this.tabs.filter((t) => t.session).length;
    const candidates = this.tabs
      .filter((t) => t.session && t.id !== this.activeTabId && !t.audible && !t.dialog)
      .sort((a, b) => a.lastActive - b.lastActive);
    for (const tab of candidates) {
      if (live <= max) break;
      this.discardTab(tab);
      live--;
    }
  }

  private discardTab(tab: Tab): void {
    const session = tab.session;
    if (!session) return;
    this.logger.info(`Discarding background tab: ${tab.url}`);
    tab.unbind?.();
    tab.unbind = undefined;
    tab.session = undefined;
    tab.loading = false;
    void session.discard();
    this.queueState();
  }

  private onEngineStarted(): void {
    const tab = this.activeTab;
    if (tab && !tab.session && !tab.sessionPromise && !tab.internalPage) {
      void this.ensureSession(tab, tab.url);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Pages
  // -------------------------------------------------------------------------------------------

  private sessionOptions() {
    return { logger: this.logger, platform: process.platform, logCdp: getConfig().logCdp };
  }

  /** Creates a Chromium page for the tab (if it has none) and loads `url` in it. */
  private ensureSession(tab: Tab, url?: string): Promise<void> {
    if (tab.session) return Promise.resolve();
    tab.sessionPromise ??= (async () => {
      const engine = await this.services.engineHost.start();
      const context = tab.private ? await this.services.engineHost.privateContext() : undefined;
      const targetId = await engine.createPage(context);
      const session = await TabSession.attach(engine, targetId, this.sessionOptions());
      if (tab.closed || this.disposed) {
        await session.discard();
        return;
      }
      this.bindSession(tab, session);
      if (tab.emulation.enabled) await session.setEmulation(tab.emulation);
      await this.showTab(tab);
      if (url) await session.navigate(url);
    })()
      .catch((error: unknown) => {
        this.logger.error(`Could not open page: ${errorMessage(error)}`);
        tab.loading = false;
        this.queueState();
      })
      .finally(() => {
        tab.sessionPromise = undefined;
      });
    return tab.sessionPromise;
  }

  private async navigate(tab: Tab, input: string): Promise<void> {
    const url = normalizeInput(input, getConfig().searchUrl);
    if (url) await this.load(tab, url);
  }

  private async load(tab: Tab, url: string): Promise<void> {
    const internal = parseInternalUrl(url);
    if (internal) {
      tab.showInternalPage(internal);
      this.hideTab(tab);
      this.queueState();
      return;
    }
    tab.internalPage = undefined;
    tab.url = url;
    tab.title = url;
    tab.crashed = false;
    tab.loading = true;
    tab.progress = 0.05;
    tab.security = 'unknown';
    tab.favicon = undefined;
    this.queueState();
    if (tab.session) {
      await this.showTab(tab);
      await tab.session.navigate(url);
    } else {
      await this.ensureSession(tab, url);
    }
  }

  private leaveInternalPage(tab: Tab): void {
    const session = tab.session;
    if (!session) return;
    tab.internalPage = undefined;
    tab.url = session.url;
    tab.title = session.title || session.url;
    tab.security = 'unknown';
    void this.showTab(tab);
    this.queueState();
  }

  private async setZoom(tab: Tab, zoom: number): Promise<void> {
    tab.zoom = zoom;
    await this.services.zoom.set(tab.url, zoom);
    await this.showTab(tab);
    this.queueState();
  }

  /** Streams the tab's page into the webview if it is the visible, active tab. */
  private async showTab(tab: Tab, restart = false): Promise<void> {
    const session = tab.session;
    if (
      !session ||
      !this.viewport ||
      !this.ready ||
      !this.host.visible ||
      tab.internalPage ||
      tab.crashed ||
      tab.id !== this.activeTabId
    ) {
      return;
    }
    try {
      await this.services.engineHost.current?.activateTarget(session.targetId);
      await session.setViewport(this.viewport, tab.zoom);
      if (tab.session !== session || tab.id !== this.activeTabId) return;
      if (restart || !session.screencasting) await session.startScreencast(getConfig().jpegQuality);
    } catch (error) {
      this.logger.debug(`Could not show tab: ${errorMessage(error)}`);
    }
  }

  private hideTab(tab: Tab): void {
    tab.session?.stopScreencast().catch((error: unknown) => {
      this.logger.debug(`Could not stop screencast: ${errorMessage(error)}`);
    });
  }

  private bindSession(tab: Tab, session: TabSession): void {
    tab.session = session;
    const events = session.events;
    const isActive = () => tab.id === this.activeTabId && tab.session === session;

    events.on('frame', (data, metadata) => {
      if (!isActive() || !this.ready) {
        session.ackFrame();
        return;
      }
      const message: HostToWebview = { type: 'frame', tabId: tab.id, data, metadata };
      this.framesPosted++;
      void this.host.webview.postMessage(message).then((delivered) => {
        if (!delivered) session.ackFrame();
      });
    });
    events.on('info', (url, title) => {
      if (tab.internalPage) return;
      tab.url = url;
      tab.title = title || url;
      if (!tab.private) this.services.history.updateTitle(url, title);
      this.queueState();
    });
    events.on('loading', (loading, progress) => {
      if (tab.internalPage) return;
      tab.loading = loading;
      tab.progress = progress;
      this.queueState();
    });
    events.on('navigated', (url) => {
      tab.favicon = undefined;
      tab.crashed = false;
      tab.fullscreen = false;
      if (!tab.internalPage) tab.url = url;
      if (!tab.private) this.services.history.recordVisit(url, tab.title);
      if (tab.annotations.length && getConfig().drawingClearOnNavigation) {
        tab.annotations = [];
        this.post({ type: 'annotations', tabId: tab.id, shapes: [] });
      }
      const zoom = this.services.zoom.get(url);
      if (zoom !== tab.zoom) {
        tab.zoom = zoom;
        void this.showTab(tab);
      }
      this.queueState();
    });
    events.on('history', (canGoBack, canGoForward) => {
      tab.canGoBack = canGoBack;
      tab.canGoForward = canGoForward;
      this.queueState();
    });
    events.on('security', (state) => {
      if (!tab.internalPage) tab.security = state;
      this.queueState();
    });
    events.on('dialog', (dialog) => {
      tab.dialog = dialog;
      this.queueState();
    });
    events.on('fileChooser', (request) => void this.chooseFiles(session, request));
    events.on('cursor', (cursor) => {
      if (isActive()) this.post({ type: 'cursor', tabId: tab.id, cursor });
    });
    events.on('contextMenu', (context) => {
      if (isActive()) this.post({ type: 'contextMenu', tabId: tab.id, context });
    });
    events.on('fullscreen', (active) => {
      tab.fullscreen = active;
      this.queueState();
    });
    events.on('audible', (audible) => {
      tab.audible = audible;
      this.queueState();
    });
    events.on('favicon', (url) => {
      tab.favicon = url;
      this.queueState();
    });
    events.on('devtools', () => {
      if (tab.id === this.devConsoleTabId) this.postDevDataSoon();
    });
    events.on('crashed', () => {
      tab.crashed = true;
      tab.loading = false;
      this.hideTab(tab);
      this.queueState();
    });
    events.on('closed', (reason) => {
      if (tab.session !== session) return;
      tab.session = undefined;
      tab.unbind = undefined;
      closeDevTools(session.targetId);
      if (reason === 'closed') {
        this.removeTab(tab);
      } else {
        // The engine went away; the tab reloads when the engine restarts.
        tab.loading = false;
        this.queueState();
      }
    });
    tab.unbind = () => events.removeAllListeners();
  }

  private async chooseFiles(session: TabSession, request: FileChooserRequest): Promise<void> {
    const uris = await vscode.window.showOpenDialog({
      canSelectMany: request.multiple,
      openLabel: 'Upload',
      filters: acceptToFilters(request.accept),
    });
    if (!uris?.length) return;
    await session
      .setFiles(
        request.backendNodeId,
        uris.map((uri) => uri.fsPath),
      )
      .catch((error: unknown) => this.logger.warn(`Upload failed: ${errorMessage(error)}`));
  }

  // -------------------------------------------------------------------------------------------
  // State
  // -------------------------------------------------------------------------------------------

  private queueState(): void {
    if (this.stateTimer || this.disposed) return;
    this.stateTimer = setTimeout(() => {
      this.stateTimer = undefined;
      this.postState();
    }, 16);
  }

  private postState(): void {
    if (this.disposed) return;
    BrowserPanel.onDidChangeTabsEmitter.fire();
    const active = this.activeTab;
    const title = active ? active.title || active.url : 'Browser';
    this.host.setTitle(title.length > 40 ? `${title.slice(0, 39)}…` : title);
    this.saveSessionSoon();
    this.post({
      type: 'state',
      state: {
        windowId: this.windowId,
        tabs: this.tabs.map((tab) => tab.toState(this.services.bookmarks.findByUrl(tab.url)?.id)),
        activeTabId: this.activeTabId,
        canReopenClosedTab: this.closedTabs.length > 0,
      },
    });
  }

  private postDevices(): void {
    const custom = vscode.workspace.getConfiguration('vscodeBrowser').get('devices.custom', []);
    this.post({ type: 'devices', custom: customPresets(custom) });
  }

  /**
   * Emulates a device preset in the active tab (asks which one when `presetId` is missing).
   * `responsive` turns device emulation off.
   */
  async emulateDevice(presetId?: string): Promise<void> {
    const tab = this.activeTab;
    if (!tab || tab.internalPage) return;
    const presets = [
      ...DEVICE_PRESETS,
      ...customPresets(vscode.workspace.getConfiguration('vscodeBrowser').get('devices.custom')),
    ];
    let id = presetId;
    if (!id) {
      const picked = await vscode.window.showQuickPick(
        [
          { label: 'Responsive (no device)', id: 'responsive', description: '' },
          ...presets.map((p) => ({
            label: p.name,
            id: p.id,
            description: `${p.width}×${p.height} @${p.dpr}x · ${p.group}`,
          })),
        ],
        { title: 'Emulate device' },
      );
      id = picked?.id;
    }
    if (!id) return;
    const preset = presets.find((p) => p.id === id);
    tab.emulation =
      id === 'responsive'
        ? { ...tab.emulation, enabled: false }
        : {
            ...DEFAULT_EMULATION,
            ...tab.emulation,
            enabled: true,
            device: preset && presetToDevice(preset),
          };
    this.queueState();
    await tab.session?.setEmulation(tab.emulation);
  }

  /**
   * A clean screenshot of part of the page for the webview to draw annotations on. Regions get
   * `screenshots.annotationPadding` around them, kept inside the page.
   */
  private async captureForAnnotations(
    tab: Tab | undefined,
    requestId: string,
    area: 'region' | 'viewport' | 'fullPage',
    rect?: Rect,
  ): Promise<void> {
    const session = tab?.session;
    if (!session) {
      this.post({ type: 'annotationImage', requestId, error: 'The page is not loaded.' });
      return;
    }
    try {
      const layout = await session.layout();
      let captured: Rect;
      if (area === 'fullPage') {
        captured = { x: 0, y: 0, width: layout.contentWidth, height: layout.contentHeight };
      } else if (area === 'viewport') {
        captured = {
          x: layout.scrollX,
          y: layout.scrollY,
          width: layout.width,
          height: layout.height,
        };
      } else {
        if (!rect) throw new Error('No area to capture');
        const padding = getConfig().annotationPadding;
        const x = Math.max(0, rect.x - padding);
        const y = Math.max(0, rect.y - padding);
        const right = Math.min(
          Math.max(layout.contentWidth, layout.width),
          rect.x + rect.width + padding,
        );
        const bottom = Math.min(
          Math.max(layout.contentHeight, layout.height),
          rect.y + rect.height + padding,
        );
        captured = { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y) };
      }
      const bytes =
        area === 'fullPage'
          ? await session.screenshot('fullPage', { format: 'png' })
          : await session.screenshot('region', { format: 'png', rect: captured });
      this.post({
        type: 'annotationImage',
        requestId,
        data: new Uint8Array(bytes),
        mimeType: 'image/png',
        rect: captured,
      });
    } catch (error) {
      this.post({ type: 'annotationImage', requestId, error: errorMessage(error) });
    }
  }

  private popupTab(tabId: string): Tab | undefined {
    return this.popup?.tab.id === tabId ? this.popup.tab : undefined;
  }

  private async runExtensionAction(
    message: Extract<WebviewToHost, { type: 'extension' }>,
  ): Promise<void> {
    const extensions = this.services.extensions;
    try {
      switch (message.action) {
        case 'loadUnpacked':
          await extensions.loadUnpacked(message.value);
          return;
        case 'installFile':
          await extensions.installFile(message.value);
          return;
        case 'installWebStore':
          await extensions.installWebStore(message.value);
          return;
        case 'checkUpdates': {
          const count = await extensions.checkUpdates();
          this.post({
            type: 'toast',
            message: count ? `Updated ${count} extension(s)` : 'Extensions are up to date',
          });
          return;
        }
      }
      const id = message.id!;
      switch (message.action) {
        case 'remove':
          await extensions.remove(id);
          return;
        case 'enable':
        case 'disable':
          await extensions.setEnabled(id, message.action === 'enable');
          return;
        case 'pin':
        case 'unpin':
          extensions.setPinned(id, message.action === 'pin');
          return;
        case 'openOptions': {
          const page = extensions.get(id)?.optionsPage;
          if (page) this.openTab(`chrome-extension://${id}/${page.replace(/^\//, '')}`);
          return;
        }
        case 'openPopup':
          await this.openExtensionPopup(id);
          return;
      }
    } catch (error) {
      void vscode.window.showErrorMessage(`Extension: ${errorMessage(error)}`);
    }
  }

  /**
   * Opens an extension's toolbar popup as its own page, sized to its content and streamed into an
   * overlay under the toolbar. Extensions without a popup open their options page instead.
   */
  async openExtensionPopup(extensionId: string): Promise<void> {
    const record = this.services.extensions.get(extensionId);
    if (!record) return;
    if (!record.popup) {
      if (record.optionsPage) {
        this.openTab(`chrome-extension://${extensionId}/${record.optionsPage.replace(/^\//, '')}`);
      } else {
        this.post({ type: 'toast', message: `${record.name} has no popup or options page.` });
      }
      return;
    }
    await this.closeExtensionPopup();
    const engine = await this.services.engineHost.start();
    const targetId = await engine.createPage();
    const session = await TabSession.attach(engine, targetId, this.sessionOptions());
    const tab = new Tab();
    tab.url = `chrome-extension://${extensionId}/${record.popup.replace(/^\//, '')}`;
    tab.session = session;
    this.popup = { tab, extensionId };
    session.events.on('frame', (data, metadata) => {
      if (this.popup?.tab !== tab || !this.ready) {
        session.ackFrame();
        return;
      }
      void this.host.webview.postMessage({
        type: 'frame',
        tabId: tab.id,
        data,
        metadata,
      } satisfies HostToWebview);
    });
    session.events.on('cursor', (cursor) => this.post({ type: 'cursor', tabId: tab.id, cursor }));
    session.events.on('closed', () => {
      // `window.close()` in the popup closes it.
      if (this.popup?.tab !== tab) return;
      this.popup = undefined;
      this.post({ type: 'extensionPopupClosed' });
    });
    const dpr = this.viewport?.dpr ?? 1;
    await session.setViewport({ width: 360, height: 480, dpr }, 1);
    await session.navigate(tab.url);
    // Size the popup to its content, like Chrome does (within Chrome's 800×600 limit).
    await new Promise((resolve) => setTimeout(resolve, 300));
    const size = await session.contentSize();
    const width = Math.max(25, Math.min(800, size.width));
    const height = Math.max(25, Math.min(600, size.height));
    await session.setViewport({ width, height, dpr }, 1);
    if (this.popup?.tab !== tab) return;
    this.post({ type: 'extensionPopup', tabId: tab.id, extensionId, width, height });
    await session.startScreencast(getConfig().jpegQuality);
  }

  async closeExtensionPopup(): Promise<void> {
    const popup = this.popup;
    this.popup = undefined;
    if (!popup) return;
    popup.tab.session?.events.removeAllListeners();
    await popup.tab.session?.discard();
    this.post({ type: 'extensionPopupClosed' });
  }

  /** Opens Chrome DevTools for the active tab, beside the browser. */
  openDevToolsForActiveTab(): void {
    const tab = this.activeTab;
    const port = this.services.engineHost.current?.debuggingPort;
    if (!tab?.session || tab.internalPage) {
      this.post({ type: 'toast', message: 'Open a web page to inspect it.' });
      return;
    }
    if (!port) {
      void vscode.window.showWarningMessage(
        'DevTools needs the debugging port. Turn on "vscodeBrowser.devtools.enabled" and restart the browser engine.',
      );
      return;
    }
    openDevTools(port, tab.session.targetId, tab.title || tab.url);
  }

  toggleDevConsole(): void {
    this.reveal();
    this.post({ type: 'toggleDevConsole' });
  }

  /** Copy-for-AI summaries of the console and network log; returns the copied text. */
  async runDevAction(
    tabId: string | undefined,
    action: 'clear' | 'copyErrors' | 'copyFailedRequests' | 'copyContext' | 'openDevTools',
    chat = false,
  ): Promise<string | undefined> {
    const tab = this.tab(tabId);
    const session = tab?.session;
    if (!tab || !session) return undefined;
    if (action === 'openDevTools') {
      this.openDevToolsForActiveTab();
      return undefined;
    }
    if (action === 'clear') {
      session.clearDevtools();
      return undefined;
    }
    const text = await this.devText(
      tab,
      session,
      action === 'copyErrors'
        ? 'errors'
        : action === 'copyFailedRequests'
          ? 'failedRequests'
          : 'context',
    );
    if (chat) {
      await sendToChat(text);
    } else {
      await vscode.env.clipboard.writeText(text);
      this.post({ type: 'toast', message: 'Copied for AI' });
    }
    return text;
  }

  private async devText(
    tab: Tab,
    session: TabSession,
    kind: 'errors' | 'failedRequests' | 'context',
  ): Promise<string> {
    const console = this.workspaceConsole(session.console);
    const network = [...session.requests.values()];
    if (kind === 'errors') return formatConsoleErrors(console, tab.url);
    if (kind === 'failedRequests') return formatFailedRequests(network, tab.url);
    const layout = await session.layout().catch(() => undefined);
    const device = tab.emulation.enabled ? tab.emulation.device : undefined;
    return formatPageContext({
      url: tab.url,
      title: tab.title,
      viewport: { width: layout?.width ?? 0, height: layout?.height ?? 0 },
      device: device ? `${device.width}×${device.height} @${device.dpr}x` : undefined,
      selection: (await session.selectedText()) || undefined,
      console,
      network,
    });
  }

  // -------------------------------------------------------------------------------------------
  // Agent API (language model tools and the MCP server): works on the active tab
  // -------------------------------------------------------------------------------------------

  /** Loads a URL in the active tab and waits until it has loaded. */
  async agentNavigate(url: string): Promise<{ url: string; title: string }> {
    const active = this.activeTab;
    const tab = active ?? this.openTab(url);
    if (active) await this.load(active, url);
    await this.waitForLoad(tab, 30_000);
    if (tab.closed) throw new Error('The tab was closed.');
    return { url: tab.url, title: tab.title };
  }

  private async waitForLoad(tab: Tab, timeoutMs: number): Promise<void> {
    const deadline = Date.now() + timeoutMs;
    await tab.sessionPromise;
    while ((tab.loading || !tab.session) && !tab.closed && Date.now() < deadline) {
      if (!tab.session && !tab.sessionPromise && !tab.internalPage) break;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  /** The active tab's page, loaded; errors are written for the model. */
  private async agentPage(): Promise<{ tab: Tab; session: TabSession }> {
    const tab = this.activeTab;
    if (!tab || tab.internalPage)
      throw new Error('The browser is not showing a web page. Open one with browser_navigate.');
    if (!tab.session) {
      await this.ensureSession(tab, tab.url);
      tab.loading = true;
    }
    await this.waitForLoad(tab, 15_000);
    if (!tab.session) throw new Error('The page could not be loaded.');
    return { tab, session: tab.session };
  }

  async agentScreenshot(
    mode: 'viewport' | 'fullPage',
    selector?: string,
  ): Promise<ScreenshotResult> {
    const { tab, session } = await this.agentPage();
    const format = getConfig().screenshotFormat;
    let bytes: Uint8Array;
    if (selector) {
      const match = await session.querySelector(selector);
      if (!match) throw new Error(`No element matches \`${selector}\`.`);
      bytes = await session.screenshot('element', { format, backendNodeId: match.backendNodeId });
    } else {
      bytes = await session.screenshot(mode, { format });
    }
    const path = await saveScreenshot(
      bytes,
      tab.url,
      format,
      this.services.context.globalStorageUri.fsPath,
    );
    this.lastSavedImage = path;
    return {
      displayPath: displayPath(path),
      data: bytes,
      mimeType: format === 'jpeg' ? 'image/jpeg' : `image/${format}`,
    };
  }

  async agentElement(selector: string): Promise<string> {
    const { session } = await this.agentPage();
    const match = await session.querySelector(selector);
    if (!match) throw new Error(`No element matches \`${selector}\`.`);
    const config = getConfig();
    const details = await session.elementDetails(match.backendNodeId, config.inspectorMaxHtml);
    if (!details) throw new Error(`Could not read the element \`${selector}\`.`);
    workspaceComponentPath(details);
    const text = formatDetails([details], 'markdown', config.inspectorFields);
    return match.count > 1
      ? `${match.count} elements match \`${selector}\`; this is the first.\n\n${text}`
      : text;
  }

  async agentDevText(kind: 'errors' | 'failedRequests' | 'context'): Promise<string> {
    const { tab, session } = await this.agentPage();
    const recording = session.networkLogging;
    await session.startNetworkLog();
    const text = await this.devText(tab, session, kind);
    return kind !== 'errors' && !recording
      ? `${text}\n\n(Network recording started just now; reload the page to include requests made while loading.)`
      : text;
  }

  async agentPageText(maxLength: number): Promise<string> {
    const { tab, session } = await this.agentPage();
    const text = await session.pageText(maxLength);
    return `# ${tab.title || tab.url}\nURL: ${tab.url}\n\n${text}`;
  }

  /** Console locations with dev-server URLs turned into workspace paths where possible. */
  private workspaceConsole(entries: ConsoleEntry[]): ConsoleEntry[] {
    const roots = (vscode.workspace.workspaceFolders ?? []).map((f) => f.uri.fsPath);
    return entries.map((entry) =>
      entry.url && /^(https?|webpack|file):/.test(entry.url)
        ? { ...entry, url: normalizeSourcePath(entry.url, roots) }
        : entry,
    );
  }

  private postDevDataSoon(): void {
    this.devDataTimer ??= setTimeout(() => {
      this.devDataTimer = undefined;
      this.postDevData();
    }, 250);
  }

  private postDevData(): void {
    const tab = this.tab(this.devConsoleTabId);
    const session = tab?.session;
    if (!tab || !session) return;
    this.post({
      type: 'devData',
      tabId: tab.id,
      console: this.workspaceConsole(session.console),
      network: [...session.requests.values()],
    });
  }

  /** Opens a console source location in the editor when it maps to a workspace file. */
  private async openSource(url: string, line?: number, column?: number): Promise<void> {
    const roots = (vscode.workspace.workspaceFolders ?? []).map((f) => f.uri);
    const relative = normalizeSourcePath(
      url,
      roots.map((r) => r.fsPath),
    );
    const candidates = /^([a-z]:[\\/]|\/)/i.test(relative)
      ? [vscode.Uri.file(relative)]
      : roots.map((root) => vscode.Uri.joinPath(root, relative));
    for (const uri of candidates) {
      try {
        await vscode.workspace.fs.stat(uri);
        const position = new vscode.Position(line ?? 0, column ?? 0);
        await vscode.window.showTextDocument(uri, {
          selection: new vscode.Range(position, position),
          viewColumn: vscode.ViewColumn.Beside,
        });
        return;
      } catch {
        // Try the next workspace folder.
      }
    }
    // Not a workspace file: show it in the browser instead.
    if (/^https?:/.test(url)) this.openTab(url);
  }

  /** Turns drawing mode on or off (command). */
  setDrawing(on: boolean): void {
    this.reveal();
    this.post({ type: 'setDrawing', on });
  }

  /** Screenshot of the area around the drawings (command). */
  captureAnnotations(): void {
    this.reveal();
    this.post({ type: 'captureAnnotations' });
  }

  /** Turns the element picker on or off in this window. */
  setInspect(purpose: InspectPurpose | null): void {
    this.reveal();
    this.post({ type: 'setInspect', purpose });
  }

  /**
   * Screenshot commands: capture now (returns the saved file, if any), or let the user pick a
   * region or element first.
   */
  async screenshot(
    mode: 'viewport' | 'fullPage' | 'region' | 'element',
  ): Promise<string | undefined> {
    const tab = this.activeTab;
    if (!tab) return undefined;
    this.reveal();
    if (mode === 'region') this.post({ type: 'startRegionSelect' });
    else if (mode === 'element') this.setInspect('screenshot');
    else return this.captureScreenshot(tab, mode);
    return undefined;
  }

  /** Replaces the active tab's drawings (tests and automation). */
  setAnnotations(shapes: unknown): void {
    const tab = this.activeTab;
    if (!tab) return;
    tab.annotations = sanitizeShapes(shapes);
    this.post({ type: 'annotations', tabId: tab.id, shapes: tab.annotations });
  }

  /** Copies the details of the element at a point (viewport CSS pixels) in the active tab. */
  async copyElementAt(x: number, y: number): Promise<void> {
    const tab = this.activeTab;
    if (!tab?.session) return;
    await this.inspector.pick(tab.id, tab.session, {
      x,
      y,
      purpose: 'copy',
      add: false,
      screenshot: false,
      url: tab.url,
    });
    await this.inspector.stop(tab.session);
  }

  private async captureScreenshot(
    tab: Tab,
    mode: 'viewport' | 'fullPage' | 'region',
    rect?: Rect,
  ): Promise<string | undefined> {
    const session = tab.session;
    if (!session || tab.internalPage) {
      this.post({ type: 'toast', message: 'Open a web page to take a screenshot.' });
      return undefined;
    }
    const format = getConfig().screenshotFormat;
    let clip = rect;
    if (mode === 'region' && rect) {
      // The region was drawn over the viewport; the capture clip is in document coordinates.
      const scroll = await session.scrollOffset();
      clip = { ...rect, x: rect.x + scroll.x, y: rect.y + scroll.y };
    }
    const bytes = await session.screenshot(mode, { format, rect: clip });
    return deliverScreenshot({
      bytes,
      url: tab.url,
      format,
      globalStorage: this.services.context.globalStorageUri.fsPath,
      copyImage: (data, mimeType) => this.post({ type: 'copyImage', data, mimeType }),
      label: {
        viewport: 'Screenshot',
        fullPage: 'Full-page screenshot',
        region: 'Region screenshot',
      }[mode],
    });
  }

  /** Shows or hides the device toolbar (device emulation) of the active tab. */
  toggleDeviceToolbar(): void {
    this.post({ type: 'toggleDeviceToolbar' });
  }

  /** Remembers this window's tabs so they can be restored after VS Code reloads. */
  private saveSessionSoon(): void {
    clearTimeout(this.sessionTimer);
    this.sessionTimer = setTimeout(() => {
      const tabs = this.tabs.filter((tab) => !tab.private);
      const active = tabs.findIndex((tab) => tab.id === this.activeTabId);
      this.services.sessions.save(this.windowId, {
        tabs: tabs.map((tab) => ({
          url: tab.url,
          title: tab.title,
          pinned: tab.pinned,
          zoom: tab.zoom,
        })),
        activeIndex: Math.max(0, active),
        savedAt: Date.now(),
      });
    }, 1_000);
  }

  /** Private tabs share one browser context; drop it (and its data) when the last one closes. */
  private static releasePrivateContextIfUnused(services: Services): void {
    const anyPrivate = BrowserPanel.all().some((panel) => panel.tabs.some((tab) => tab.private));
    if (!anyPrivate) void services.engineHost.releasePrivateContext();
  }

  private post(message: HostToWebview): void {
    if (this.ready && !this.disposed) void this.host.webview.postMessage(message);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    BrowserPanel.panels.delete(this);
    BrowserPanel.onDidChangeTabsEmitter.fire();
    clearTimeout(this.stateTimer);
    clearTimeout(this.sessionTimer);
    const hadPrivate = this.tabs.some((tab) => tab.private);
    for (const tab of this.tabs) {
      tab.closed = true;
      tab.unbind?.();
      void tab.session?.discard();
    }
    this.tabs.length = 0;
    if (hadPrivate) BrowserPanel.releasePrivateContextIfUnused(this.services);
    void this.popup?.tab.session?.discard();
    for (const disposable of this.disposables.splice(0)) disposable.dispose();
    this.host.dispose();
  }
}

interface WindowInit {
  url?: string;
  /** A tab moved from another window. */
  tab?: Tab;
  /** Id of a window being restored after a reload. */
  windowId?: string;
  /** Tabs to restore. */
  saved?: SavedWindow;
  /** Open the first tab as a private tab. */
  private?: boolean;
}

interface OpenTabOptions {
  activate?: boolean;
  index?: number;
  private?: boolean;
  pinned?: boolean;
  zoom?: number;
  title?: string;
  /** Do not load the page until the tab is activated. */
  lazy?: boolean;
}

function samePath(a: string, b: string): boolean {
  return process.platform === 'win32' || process.platform === 'darwin'
    ? a.toLowerCase() === b.toLowerCase()
    : a === b;
}
