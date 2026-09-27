import { useCallback, useEffect, useRef, useState } from 'react';
import {
  clusterShapes,
  DEFAULT_STYLE,
  shapeBounds,
  union,
  type DrawTool,
  type Shape,
  type ShapeStyle,
} from '@shared/annotations';
import { emptyRoots, type BookmarkRoots } from '@shared/bookmarks';
import type { DevicePreset } from '@shared/devices';
import type { HistoryItem, Suggestion } from '@shared/history';
import type { ConsoleEntry, NetworkEntry } from '@shared/devtools';
import { DEFAULT_EMULATION } from '@shared/devices';
import type {
  DownloadInfo,
  EngineState,
  ExtensionInfo,
  TabState,
  InspectHover,
  InspectPurpose,
  InternalPage,
  PageData,
  Rect,
  WindowState,
} from '@shared/protocol';
import { BookmarkBar } from './components/BookmarkBar';
import { BookmarkEditor } from './components/BookmarkEditor';
import { DevDrawer } from './components/DevDrawer';
import { DeviceToolbar } from './components/DeviceToolbar';
import { DialogOverlay } from './components/DialogOverlay';
import { CrashedOverlay, EngineOverlay } from './components/EngineOverlay';
import { FindBar } from './components/FindBar';
import { InspectOverlay } from './components/InspectOverlay';
import { RegionSelect } from './components/RegionSelect';
import { Menu, type MenuItem, type MenuState } from './components/Menu';
import { TabStrip } from './components/TabStrip';
import { Toolbar } from './components/Toolbar';
import { Viewport, type ViewportMapper, type ViewportMode } from './components/Viewport';
import { compositeScreenshot } from './drawing/composite';
import { DrawingLayer } from './drawing/DrawingLayer';
import { captureMenu, DrawToolbar, TOOL_KEYS, type CaptureMode } from './drawing/DrawToolbar';
import { historyMenu, pageContextMenu, screenshotMenu } from './menus';
import { BookmarksPage } from './pages/BookmarksPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { ExtensionsPage } from './pages/ExtensionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { NewTabPage } from './pages/NewTabPage';
import { SettingsPage } from './pages/SettingsPage';
import { onHostMessage, postToHost, saveWebviewState } from './vscode';

const TOAST_MS = 2_500;

/** A tool that takes over the pointer on the page. */
type Tool = { kind: 'inspect'; purpose: InspectPurpose } | { kind: 'region' } | { kind: 'draw' };

interface DrawingState {
  tabId: string;
  shapes: Shape[];
  undo: Shape[][];
  redo: Shape[][];
}

interface CapturedImage {
  data?: Uint8Array;
  mimeType?: string;
  rect?: Rect;
  error?: string;
}

/** Tool defaults: the highlighter starts yellow and wide. */
const STARTING_STYLES: Partial<Record<DrawTool, ShapeStyle>> = {
  highlighter: { ...DEFAULT_STYLE, color: '#ffcc00', width: 8 },
  blur: { ...DEFAULT_STYLE, color: '#808080' },
};

const CAPTURE_LABELS: Record<CaptureMode, string> = {
  area: 'Drawing screenshot',
  groups: 'Drawing screenshot',
  clean: 'Screenshot (without drawings)',
  viewport: 'Screenshot with drawings',
  fullPage: 'Full-page screenshot with drawings',
};

interface EditorState {
  /** The bookmark being edited, or undefined while the star button's new bookmark is saved. */
  nodeId?: string;
  /** For a new bookmark: the page URL, to pick up its id once the host has added it. */
  pendingUrl?: string;
  x: number;
  y: number;
}

export function App() {
  const [engine, setEngine] = useState<EngineState>({ status: 'starting' });
  const [windowState, setWindowState] = useState<WindowState>({
    windowId: '',
    tabs: [],
    canReopenClosedTab: false,
  });
  const [downloads, setDownloads] = useState<DownloadInfo[]>([]);
  const [downloadsOpen, setDownloadsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<{ roots: BookmarkRoots; showBar: boolean }>({
    roots: emptyRoots(),
    showBar: false,
  });
  const [suggestions, setSuggestions] = useState<{ query: string; items: Suggestion[] }>({
    query: '',
    items: [],
  });
  const [pageData, setPageData] = useState<Partial<Record<PageData['page'], PageData>>>({});
  const [pageChanges, setPageChanges] = useState<Partial<Record<InternalPage, number>>>({});
  const [editor, setEditor] = useState<EditorState | null>(null);
  const [customDevices, setCustomDevices] = useState<DevicePreset[]>([]);
  const [pageArea, setPageArea] = useState({ width: 0, height: 0 });
  const [tool, setTool] = useState<Tool | null>(null);
  const [inspectHover, setInspectHover] = useState<InspectHover | undefined>();
  const [inspectSelection, setInspectSelection] = useState<Rect[]>([]);
  const contextPagePoint = useRef<{ x: number; y: number } | undefined>(undefined);
  const toolRef = useRef(tool);
  const [extensions, setExtensions] = useState<ExtensionInfo[]>([]);
  const [devOpen, setDevOpen] = useState(false);
  const [devHeight, setDevHeight] = useState(240);
  const [devData, setDevData] = useState<{
    tabId: string;
    console: ConsoleEntry[];
    network: NetworkEntry[];
  } | null>(null);
  const [popup, setPopup] = useState<{
    tabId: string;
    width: number;
    height: number;
    anchor: { x: number; y: number };
  } | null>(null);
  const popupAnchor = useRef({ x: innerWidth - 16, y: 72 });
  const [drawing, setDrawing] = useState<DrawingState>({
    tabId: '',
    shapes: [],
    undo: [],
    redo: [],
  });
  const [drawTool, setDrawTool] = useState<DrawTool>('pen');
  const [styles, setStyles] = useState<Partial<Record<DrawTool, ShapeStyle>>>(STARTING_STYLES);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [drawingVisible, setDrawingVisible] = useState(true);
  const drawingRef = useRef(drawing);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingCaptures = useRef(new Map<string, (image: CapturedImage) => void>());
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [findTabId, setFindTabId] = useState<string | null>(null);
  const [findFocus, setFindFocus] = useState(0);
  const [findResult, setFindResult] = useState<{
    tabId: string;
    index: number;
    count: number;
  } | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const [omniboxFocus, setOmniboxFocus] = useState(0);
  const [viewportFocus, setViewportFocus] = useState(0);
  const contextPoint = useRef({ x: 0, y: 0 });
  const windowStateRef = useRef(windowState);
  const starAnchor = useRef({ x: innerWidth - 16, y: 72 });

  const activeTab = windowState.tabs.find((tab) => tab.id === windowState.activeTabId);

  const showToast = useCallback((message: string) => setToast({ id: Date.now(), message }), []);
  const openMenu = useCallback(
    (x: number, y: number, items: MenuItem[]) => setMenu(items.length ? { x, y, items } : null),
    [],
  );
  const closeMenu = useCallback(() => setMenu(null), []);
  const closeEditor = useCallback(() => setEditor(null), []);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    drawingRef.current = drawing;
  }, [drawing]);

  /** Changes the drawings; `commit` adds an undo step. Syncs them to the host (debounced). */
  const updateShapes = useCallback((shapes: Shape[], commit: boolean) => {
    setDrawing((current) => ({
      ...current,
      shapes,
      undo: commit ? [...current.undo.slice(-99), current.shapes] : current.undo,
      redo: commit ? [] : current.redo,
    }));
    clearTimeout(syncTimer.current);
    const tabId = drawingRef.current.tabId;
    syncTimer.current = setTimeout(() => postToHost({ type: 'annotations', tabId, shapes }), 250);
  }, []);

  const undo = useCallback(() => {
    const current = drawingRef.current;
    const previous = current.undo.at(-1);
    if (!previous) return;
    setDrawing({
      ...current,
      shapes: previous,
      undo: current.undo.slice(0, -1),
      redo: [...current.redo, current.shapes],
    });
    postToHost({ type: 'annotations', tabId: current.tabId, shapes: previous });
  }, []);

  const redo = useCallback(() => {
    const current = drawingRef.current;
    const next = current.redo.at(-1);
    if (!next) return;
    setDrawing({
      ...current,
      shapes: next,
      redo: current.redo.slice(0, -1),
      undo: [...current.undo, current.shapes],
    });
    postToHost({ type: 'annotations', tabId: current.tabId, shapes: next });
  }, []);

  /** Asks the host for a clean screenshot of part of the page (to draw the shapes onto). */
  const requestCapture = useCallback(
    (tabId: string, area: 'region' | 'viewport' | 'fullPage', rect?: Rect) =>
      new Promise<CapturedImage>((resolve) => {
        const requestId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        pendingCaptures.current.set(requestId, resolve);
        postToHost({ type: 'annotationCapture', tabId, requestId, area, rect });
      }),
    [],
  );

  /** Screenshots with the drawings composited on top (see CaptureMode). */
  const captureDrawing = useCallback(
    async (mode: CaptureMode) => {
      const { tabId, shapes } = drawingRef.current;
      if (!tabId) return;
      if (!shapes.length && (mode === 'area' || mode === 'groups' || mode === 'clean')) {
        showToast('Draw something first.');
        return;
      }
      const groups = mode === 'groups' ? clusterShapes(shapes, 80) : [shapes];
      for (const [index, group] of groups.entries()) {
        const area = mode === 'viewport' ? 'viewport' : mode === 'fullPage' ? 'fullPage' : 'region';
        const rect = area === 'region' ? union(group.map(shapeBounds)) : undefined;
        const image = await requestCapture(tabId, area, rect);
        if (image.error || !image.data || !image.rect) {
          showToast(`Screenshot failed: ${image.error ?? 'no image'}`);
          return;
        }
        const base64 = await compositeScreenshot(
          image.data,
          image.mimeType ?? 'image/png',
          image.rect,
          mode === 'clean' ? [] : group,
        );
        const label =
          groups.length > 1 ? `Drawing ${index + 1} of ${groups.length}` : CAPTURE_LABELS[mode];
        postToHost({ type: 'saveImage', tabId, base64, label });
      }
    },
    [requestCapture, showToast],
  );

  /** Switches the pointer tool; leaving the element picker tells the host to clean up. */
  const changeTool = useCallback((next: Tool | null) => {
    const current = toolRef.current;
    const tabId = windowStateRef.current.activeTabId;
    if (current?.kind === 'inspect' && next?.kind !== 'inspect' && tabId) {
      postToHost({ type: 'inspect', tabId, action: 'stop' });
    }
    setInspectHover(undefined);
    if (next?.kind !== 'inspect') setInspectSelection([]);
    setTool(next);
  }, []);

  useEffect(() => {
    windowStateRef.current = windowState;
    // Remember the window id so VS Code can restore this window's tabs after a reload.
    if (windowState.windowId) saveWebviewState({ windowId: windowState.windowId });
  }, [windowState]);

  /** Star button or Ctrl+D: bookmark the page if needed, then edit the bookmark. */
  const editActiveBookmark = useCallback(() => {
    const tab = windowStateRef.current.tabs.find(
      (t) => t.id === windowStateRef.current.activeTabId,
    );
    if (!tab || tab.internalPage) return;
    const { x, y } = starAnchor.current;
    if (tab.bookmarkId) {
      setEditor({ nodeId: tab.bookmarkId, x, y });
    } else {
      postToHost({
        type: 'bookmark',
        action: 'add',
        url: tab.url,
        title: tab.title,
        favicon: tab.favicon,
      });
      setEditor({ pendingUrl: tab.url, x, y });
    }
  }, []);

  const toggleDeviceToolbar = useCallback(() => {
    const tab = windowStateRef.current.tabs.find(
      (t) => t.id === windowStateRef.current.activeTabId,
    );
    if (!tab || tab.internalPage) return;
    postToHost({
      type: 'emulation',
      tabId: tab.id,
      settings: { ...tab.emulation, enabled: !tab.emulation.enabled },
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onHostMessage((message) => {
      switch (message.type) {
        case 'engine':
          setEngine(message.state);
          break;
        case 'state':
          setWindowState(message.state);
          break;
        case 'downloads':
          setDownloads(message.downloads);
          if (message.started) setDownloadsOpen(true);
          break;
        case 'bookmarks':
          setBookmarks({ roots: message.roots, showBar: message.showBar });
          break;
        case 'suggestions':
          setSuggestions({ query: message.query, items: message.items });
          break;
        case 'pageData':
          setPageData((current) => ({ ...current, [message.data.page]: message.data }));
          break;
        case 'pageDataChanged':
          setPageChanges((current) => ({
            ...current,
            [message.page]: (current[message.page] ?? 0) + 1,
          }));
          break;
        case 'editBookmark':
          editActiveBookmark();
          break;
        case 'devices':
          setCustomDevices(message.custom);
          break;
        case 'inspectHover':
          if (message.tabId === windowStateRef.current.activeTabId) setInspectHover(message.hover);
          break;
        case 'inspectSelection':
          if (message.tabId === windowStateRef.current.activeTabId)
            setInspectSelection(message.rects);
          break;
        case 'setInspect':
          changeTool(message.purpose ? { kind: 'inspect', purpose: message.purpose } : null);
          break;
        case 'startRegionSelect':
          changeTool({ kind: 'region' });
          break;
        case 'annotations':
          if (message.tabId === windowStateRef.current.activeTabId) {
            setDrawing({ tabId: message.tabId, shapes: message.shapes, undo: [], redo: [] });
          }
          break;
        case 'annotationImage': {
          const resolve = pendingCaptures.current.get(message.requestId);
          pendingCaptures.current.delete(message.requestId);
          resolve?.(message);
          break;
        }
        case 'extensions':
          setExtensions(message.list);
          break;
        case 'devData':
          setDevData({ tabId: message.tabId, console: message.console, network: message.network });
          break;
        case 'toggleDevConsole':
          setDevOpen((open) => !open);
          break;
        case 'extensionPopup':
          setPopup({
            tabId: message.tabId,
            width: message.width,
            height: message.height,
            anchor: popupAnchor.current,
          });
          break;
        case 'extensionPopupClosed':
          setPopup(null);
          break;
        case 'setDrawing':
          changeTool(message.on ? { kind: 'draw' } : null);
          break;
        case 'captureAnnotations':
          void captureDrawing('area');
          break;
        case 'toggleDeviceToolbar':
          toggleDeviceToolbar();
          break;
        case 'contextMenu': {
          const tab = windowStateRef.current.tabs.find((t) => t.id === message.tabId);
          if (tab) {
            openMenu(
              contextPoint.current.x,
              contextPoint.current.y,
              pageContextMenu(tab, message.context, contextPagePoint.current),
            );
          }
          break;
        }
        case 'history':
          openMenu(
            contextPoint.current.x,
            contextPoint.current.y,
            historyMenu(message.tabId, message.entries),
          );
          break;
        case 'findResult':
          setFindResult({ tabId: message.tabId, index: message.index, count: message.count });
          break;
        case 'openFind': {
          const tabId = windowStateRef.current.activeTabId;
          const tab = windowStateRef.current.tabs.find((t) => t.id === tabId);
          if (tab && !tab.internalPage) {
            setFindTabId(tab.id);
            setFindFocus((n) => n + 1);
          }
          break;
        }
        case 'focusAddressBar':
          setOmniboxFocus((n) => n + 1);
          break;
        case 'focusViewport':
          setViewportFocus((n) => n + 1);
          break;
        case 'copyImage':
          void copyImage(message.data, message.mimeType).then(
            () => showToast('Image copied'),
            () => showToast('Could not copy the image'),
          );
          break;
        case 'toast':
          showToast(message.message);
          break;
      }
    });
    postToHost({ type: 'ready' });
    // Tell the host which browser window has focus, so commands and shortcuts act on it.
    const onFocus = () => postToHost({ type: 'focus' });
    window.addEventListener('focus', onFocus);
    if (document.hasFocus()) onFocus();
    return () => {
      unsubscribe();
      window.removeEventListener('focus', onFocus);
    };
  }, [openMenu, showToast, editActiveBookmark, toggleDeviceToolbar, changeTool, captureDrawing]);

  const devTabId = devOpen && activeTab && !activeTab.internalPage ? activeTab.id : undefined;
  useEffect(() => {
    if (!devTabId) return;
    postToHost({ type: 'devConsole', tabId: devTabId, open: true });
    return () => postToHost({ type: 'devConsole', tabId: devTabId, open: false });
  }, [devTabId]);

  // Drawing keys: tool letters, undo/redo, Esc to stop drawing.
  useEffect(() => {
    if (tool?.kind !== 'draw') return;
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          (target.tagName === 'TEXTAREA' && !target.classList.contains('viewport-input')))
      ) {
        return;
      }
      const primary = event.ctrlKey || event.metaKey;
      if (event.key === 'Escape') changeTool(null);
      else if (primary && event.key.toLowerCase() === 'z' && !event.shiftKey) undo();
      else if (
        primary &&
        (event.key.toLowerCase() === 'y' || (event.key.toLowerCase() === 'z' && event.shiftKey))
      )
        redo();
      else if (!primary && !event.altKey && TOOL_KEYS[event.key.toLowerCase()])
        setDrawTool(TOOL_KEYS[event.key.toLowerCase()]!);
      else if (!primary) {
        // Keep other keys away from the page while drawing.
        event.preventDefault();
        event.stopPropagation();
        return;
      } else return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [tool, changeTool, undo, redo]);

  // Element picker keys: Esc exits, arrows walk the tree, Enter copies the multi-selection.
  useEffect(() => {
    if (tool?.kind !== 'inspect') return;
    const onKeyDown = (event: KeyboardEvent) => {
      const tabId = windowStateRef.current.activeTabId;
      if (!tabId) return;
      const actions: Record<string, 'parent' | 'child' | 'copySelection' | undefined> = {
        ArrowUp: 'parent',
        ArrowDown: 'child',
        Enter: 'copySelection',
      };
      if (event.key === 'Escape') changeTool(null);
      else if (actions[event.key])
        postToHost({ type: 'inspect', tabId, action: actions[event.key]! });
      else return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [tool, changeTool]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  // Switching tabs: focus the address bar on a new tab page, otherwise the page.
  const focusKey = activeTab ? `${activeTab.id}:${activeTab.internalPage ?? ''}` : '';
  const [lastFocusKey, setLastFocusKey] = useState(focusKey);
  if (focusKey !== lastFocusKey) {
    setLastFocusKey(focusKey);
    // Tools belong to one tab.
    if (tool) setTool(null);
    if (activeTab?.internalPage === 'newtab') setOmniboxFocus((n) => n + 1);
    else if (activeTab && !activeTab.internalPage) setViewportFocus((n) => n + 1);
  }

  const fullscreen = !!activeTab?.fullscreen;
  const showFind = !!activeTab && findTabId === activeTab.id && !activeTab.internalPage;
  const barItems = bookmarks.roots.bar.children ?? [];
  const editorNodeId =
    editor?.nodeId ?? (editor?.pendingUrl === activeTab?.url ? activeTab?.bookmarkId : undefined);
  const history = pageData.history?.page === 'history' ? pageData.history.items : undefined;
  const topSites: HistoryItem[] | undefined =
    pageData.newtab?.page === 'newtab' ? pageData.newtab.topSites : undefined;
  const settings = pageData.settings?.page === 'settings' ? pageData.settings : undefined;

  return (
    <div
      className={`browser${fullscreen ? ' fullscreen' : ''}${activeTab?.private ? ' private' : ''}`}
    >
      {!fullscreen && (
        <>
          <TabStrip
            tabs={windowState.tabs}
            activeTabId={windowState.activeTabId}
            canReopenClosedTab={windowState.canReopenClosedTab}
            openMenu={openMenu}
          />
          <Toolbar
            tab={activeTab}
            canReopenClosedTab={windowState.canReopenClosedTab}
            downloads={downloads}
            downloadsOpen={downloadsOpen}
            setDownloadsOpen={setDownloadsOpen}
            omniboxFocus={omniboxFocus}
            suggestions={suggestions}
            tool={tool?.kind === 'inspect' ? tool.purpose : null}
            extensions={extensions}
            onExtension={(id, anchor) => {
              popupAnchor.current = { x: anchor.right, y: anchor.bottom + 4 };
              postToHost({ type: 'extension', action: 'openPopup', id });
            }}
            devOpen={devOpen}
            onToggleDev={() => setDevOpen((open) => !open)}
            drawing={tool?.kind === 'draw'}
            onToggleDraw={() => changeTool(tool?.kind === 'draw' ? null : { kind: 'draw' })}
            onToggleInspect={() =>
              changeTool(tool?.kind === 'inspect' ? null : { kind: 'inspect', purpose: 'copy' })
            }
            onScreenshotMenu={(x, y) => {
              if (!activeTab) return;
              openMenu(
                x,
                y,
                screenshotMenu(activeTab, {
                  region: () => changeTool({ kind: 'region' }),
                  element: () => changeTool({ kind: 'inspect', purpose: 'screenshot' }),
                }),
              );
            }}
            onStar={(anchor) => {
              starAnchor.current = { x: anchor.right, y: anchor.bottom + 4 };
              editActiveBookmark();
            }}
            focusViewport={() => setViewportFocus((n) => n + 1)}
            toggleDeviceToolbar={toggleDeviceToolbar}
            openMenu={openMenu}
            requestHistory={(direction, x, y) => {
              if (!activeTab) return;
              contextPoint.current = { x, y };
              postToHost({ type: 'requestHistory', tabId: activeTab.id, direction });
            }}
          />
          {tool?.kind === 'draw' && activeTab && !activeTab.internalPage && (
            <DrawToolbar
              tool={drawTool}
              style={styles[drawTool] ?? DEFAULT_STYLE}
              recentColors={recentColors}
              canUndo={drawing.undo.length > 0}
              canRedo={drawing.redo.length > 0}
              hasShapes={drawing.shapes.length > 0}
              visible={drawingVisible}
              onTool={setDrawTool}
              onStyle={(changes) => {
                setStyles((current) => ({
                  ...current,
                  [drawTool]: { ...(current[drawTool] ?? DEFAULT_STYLE), ...changes },
                }));
                if (changes.color) {
                  const color = changes.color;
                  setRecentColors((current) =>
                    [color, ...current.filter((c) => c !== color)].slice(0, 4),
                  );
                }
              }}
              onUndo={undo}
              onRedo={redo}
              onClear={() => updateShapes([], true)}
              onToggleVisible={() => setDrawingVisible((v) => !v)}
              onCapture={(x, y) =>
                openMenu(
                  x,
                  y,
                  captureMenu((mode) => void captureDrawing(mode)),
                )
              }
              onClose={() => changeTool(null)}
            />
          )}
          {activeTab?.emulation.enabled && !activeTab.internalPage && (
            <DeviceToolbar tab={activeTab} custom={customDevices} available={pageArea} />
          )}
          {bookmarks.showBar && barItems.length > 0 && (
            <BookmarkBar
              items={barItems}
              barId={bookmarks.roots.bar.id}
              openMenu={openMenu}
              onEdit={(nodeId, x, y) => setEditor({ nodeId, x, y })}
            />
          )}
          <div className="progress-bar" aria-hidden="true">
            {activeTab?.loading && (
              <div style={{ width: `${Math.max(5, activeTab.progress * 100)}%` }} />
            )}
          </div>
        </>
      )}
      <main className="content">
        {activeTab && (
          <Viewport
            tab={activeTab}
            hidden={!!activeTab.internalPage}
            focusSignal={viewportFocus}
            onSize={setPageArea}
            bottomInset={devOpen && !activeTab.internalPage ? devHeight : 0}
            onContextPoint={(x, y, pageX, pageY) => {
              contextPoint.current = { x, y };
              contextPagePoint.current = { x: pageX, y: pageY };
            }}
            mode={viewportMode(tool)}
            renderOverlay={
              tool || (drawing.shapes.length > 0 && drawing.tabId === activeTab.id)
                ? (mapper: ViewportMapper) => (
                    <>
                      {drawing.tabId === activeTab.id &&
                        (drawing.shapes.length > 0 || tool?.kind === 'draw') && (
                          <DrawingLayer
                            mapper={mapper}
                            shapes={drawing.shapes}
                            visible={drawingVisible}
                            interactive={tool?.kind === 'draw'}
                            tool={drawTool}
                            style={styles[drawTool] ?? DEFAULT_STYLE}
                            onChange={updateShapes}
                          />
                        )}
                      {tool?.kind === 'inspect' && (
                        <InspectOverlay
                          mapper={mapper}
                          purpose={tool.purpose}
                          hover={inspectHover}
                          selection={inspectSelection}
                        />
                      )}
                      {tool?.kind === 'region' && (
                        <RegionSelect
                          mapper={mapper}
                          onCancel={() => changeTool(null)}
                          onCapture={(rect) => {
                            changeTool(null);
                            postToHost({
                              type: 'screenshot',
                              tabId: activeTab.id,
                              mode: 'region',
                              rect,
                            });
                          }}
                        />
                      )}
                    </>
                  )
                : undefined
            }
          />
        )}
        {activeTab?.internalPage === 'newtab' && (
          <NewTabPage
            key={activeTab.id}
            tabId={activeTab.id}
            isPrivate={activeTab.private}
            topSites={topSites}
            bookmarks={barItems}
            changeSignal={pageChanges.newtab ?? 0}
          />
        )}
        {activeTab?.internalPage === 'downloads' && <DownloadsPage downloads={downloads} />}
        {activeTab?.internalPage === 'history' && (
          <HistoryPage
            tabId={activeTab.id}
            items={history}
            changeSignal={pageChanges.history ?? 0}
          />
        )}
        {activeTab?.internalPage === 'bookmarks' && <BookmarksPage roots={bookmarks.roots} />}
        {activeTab?.internalPage === 'extensions' && <ExtensionsPage extensions={extensions} />}
        {activeTab?.internalPage === 'settings' && (
          <SettingsPage
            chromiumVersion={settings?.chromiumVersion}
            profiles={settings?.profiles ?? []}
          />
        )}
        {devOpen && activeTab && !activeTab.internalPage && (
          <DevDrawer
            tabId={activeTab.id}
            console={devData?.tabId === activeTab.id ? devData.console : []}
            network={devData?.tabId === activeTab.id ? devData.network : []}
            height={devHeight}
            onResize={setDevHeight}
            onClose={() => setDevOpen(false)}
          />
        )}
        {showFind && (
          <FindBar
            key={activeTab.id}
            tabId={activeTab.id}
            result={findResult?.tabId === activeTab.id ? findResult : undefined}
            focusSignal={findFocus}
            onClose={() => {
              setFindTabId(null);
              setFindResult(null);
              setViewportFocus((n) => n + 1);
            }}
          />
        )}
        {activeTab?.crashed && !activeTab.internalPage && <CrashedOverlay tabId={activeTab.id} />}
        {activeTab?.dialog && (
          <DialogOverlay
            key={`${activeTab.id}:${activeTab.dialog.type}:${activeTab.dialog.message}`}
            dialog={activeTab.dialog}
            onRespond={(accept, promptText) => {
              postToHost({ type: 'dialogResponse', tabId: activeTab.id, accept, promptText });
              setViewportFocus((n) => n + 1);
            }}
          />
        )}
        {(!activeTab?.internalPage ||
          engine.status === 'error' ||
          engine.status === 'crashed' ||
          engine.status === 'downloading') && <EngineOverlay engine={engine} />}
      </main>
      {popup && (
        <ExtensionPopup
          popup={popup}
          onClose={() => {
            setPopup(null);
            postToHost({ type: 'closeExtensionPopup' });
          }}
        />
      )}
      {editor && (
        <BookmarkEditor
          key={editorNodeId ?? 'pending'}
          roots={bookmarks.roots}
          nodeId={editorNodeId}
          anchor={editor}
          onClose={closeEditor}
        />
      )}
      {menu && <Menu menu={menu} onClose={closeMenu} />}
      {toast && (
        <div key={toast.id} className="toast" role="status">
          {toast.message}
        </div>
      )}
    </div>
  );
}

/** An extension's toolbar popup: its own small page, streamed under the toolbar. */
function ExtensionPopup({
  popup,
  onClose,
}: {
  popup: { tabId: string; width: number; height: number; anchor: { x: number; y: number } };
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onClose]);
  const tab: TabState = {
    id: popup.tabId,
    url: '',
    title: '',
    loading: false,
    progress: 1,
    canGoBack: false,
    canGoForward: false,
    security: 'internal',
    zoom: 1,
    audible: false,
    pinned: false,
    crashed: false,
    fullscreen: false,
    private: false,
    emulation: DEFAULT_EMULATION,
  };
  const left = Math.max(4, Math.min(popup.anchor.x - popup.width, innerWidth - popup.width - 4));
  return (
    <div
      ref={ref}
      className="extension-popup"
      style={{ left, top: popup.anchor.y, width: popup.width, height: popup.height }}
    >
      <Viewport
        tab={tab}
        mode={{ kind: 'browse' }}
        hidden={false}
        focusSignal={1}
        reportSize={false}
        onSize={() => {}}
        onContextPoint={() => {}}
      />
    </div>
  );
}

function viewportMode(tool: Tool | null): ViewportMode {
  if (tool?.kind === 'inspect') return { kind: 'inspect', purpose: tool.purpose };
  if (tool) return { kind: 'overlay' };
  return { kind: 'browse' };
}

/** Puts an image on the clipboard as PNG (the format clipboards accept everywhere). */
async function copyImage(data: Uint8Array, mimeType: string): Promise<void> {
  let blob = new Blob([data as Uint8Array<ArrayBuffer>], { type: mimeType });
  if (mimeType !== 'image/png') {
    const bitmap = await createImageBitmap(blob);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0);
    bitmap.close();
    blob = await canvas.convertToBlob({ type: 'image/png' });
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
}
