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
import { SHORTCUT_ACTIONS, type ShortcutScope } from '@shared/shortcuts';
import type { DevicePreset } from '@shared/devices';
import type { HistoryItem, Suggestion } from '@shared/history';
import type { ConsoleEntry, NetworkEntry } from '@shared/devtools';
import { DEFAULT_EMULATION, responsiveDevice } from '@shared/devices';
import type {
  DownloadInfo,
  EngineState,
  ExtensionInfo,
  TabState,
  InspectPurpose,
  InternalPage,
  PageData,
  Rect,
  SavedOffer,
  WindowState,
} from '@shared/protocol';
import { SendModal } from '@inkspect/shared/ui/SendModal';
import { BookmarkBar } from './components/BookmarkBar';
import { BookmarkEditor } from './components/BookmarkEditor';
import { DevDrawer } from './components/DevDrawer';
import { DeviceToolbar } from './components/DeviceToolbar';
import { DialogOverlay } from './components/DialogOverlay';
import { IconButton } from './components/IconButton';
import { CrashedOverlay, EngineOverlay } from './components/EngineOverlay';
import { FindBar } from './components/FindBar';
import { InspectOverlay } from './components/InspectOverlay';
import { RegionSelect } from './components/RegionSelect';
import { Menu, type MenuItem, type MenuState } from './components/Menu';
import { listenOutsidePress, pressedOpener } from '@inkspect/shared/ui/popover';
import { TabStrip } from './components/TabStrip';
import { Toolbar } from './components/Toolbar';
import { Viewport, type ViewportMapper, type ViewportMode } from './components/Viewport';
import { compositeScreenshot } from './drawing/composite';
import { DrawingLayer } from './drawing/DrawingLayer';
import { captureMenu, DrawToolbar, type CaptureMode } from './drawing/DrawToolbar';
import { buildHandlers, type DevCommand } from './actions';
import { CheatSheet, QuickActions } from './components/ShortcutOverlays';
import { A11yCheck } from './tools/A11yCheck';
import { CssTweak } from './tools/CssTweak';
import { DesignOverlay, type OverlayState } from './tools/DesignOverlay';
import { Eyedropper } from './tools/Eyedropper';
import { Measure } from './tools/Measure';
import { Recorder } from './tools/Recorder';
import {
  setShortcutOverrides,
  shortcutLabel,
  useShortcutDispatch,
  useShortcutMap,
  type ShortcutHandlers,
} from './shortcuts';
import { historyMenu, pageContextMenu, screenshotMenu, toolsMenu } from './menus';
import { BookmarksPage } from './pages/BookmarksPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { ExtensionsPage } from './pages/ExtensionsPage';
import { HistoryPage } from './pages/HistoryPage';
import { NewTabPage } from './pages/NewTabPage';
import { SettingsPage } from './pages/SettingsPage';
import { onHostMessage, postToHost, saveWebviewState } from './vscode';

const TOAST_MS = 2_500;
/** Errors stay longer: they are read, not glanced at (and they can be dismissed). */
const ERROR_TOAST_MS = 8_000;
/** Messages about a failure (the host's and the webview's), shown as errors. */
const FAILURE =
  /\b(failed|could not|can't|cannot|did not|didn't|nothing was|not linked|not running|error)\b/i;

/** A tool that takes over the pointer on the page. */
type Tool =
  | { kind: 'inspect'; purpose: InspectPurpose }
  | { kind: 'region' }
  | { kind: 'draw' }
  | { kind: 'measure' }
  | { kind: 'eyedropper' }
  | { kind: 'tweak' }
  | { kind: 'a11y' };

/** Modes that take over the pointer on the page (a Tool), by shortcut scope. */
const TOOL_SCOPES = ['inspect', 'draw', 'measure', 'eyedropper', 'tweak', 'a11y'] as const;

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
  const pageAreaRef = useRef(pageArea);
  useEffect(() => {
    pageAreaRef.current = pageArea;
  }, [pageArea]);
  const [tool, setTool] = useState<Tool | null>(null);
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
  /** The screenshot chooser is a menu whose letters are shortcuts (the `screenshot` scope). */
  const [menuScope, setMenuScope] = useState<ShortcutScope | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [quickOpen, setQuickOpen] = useState(false);
  const [devCommand, setDevCommand] = useState<{ name: DevCommand; seq: number } | null>(null);
  /** Design overlays per tab. */
  const [overlays, setOverlays] = useState<Record<string, OverlayState>>({});
  const [recording, setRecording] = useState(false);
  const [recordMaxSeconds, setRecordMaxSeconds] = useState(60);
  /**
   * Shortcut handlers registered by mode components (measure, overlay, recorder...), one entry
   * per component. A scope's keys only run while that scope is active, so stale entries are inert.
   */
  const toolHandlers = useRef<Record<string, ShortcutHandlers>>({});
  const registerToolHandlers = useCallback(
    (key: string) => (handlers: ShortcutHandlers) => {
      toolHandlers.current[key] = handlers;
    },
    [],
  );
  // Re-render when the user changes a shortcut, so labels and tooltips show the new keys.
  const shortcutMap = useShortcutMap();
  // The send dialog after a capture (see SendFlow on the host): its offer and thumbnails.
  const [saved, setSaved] = useState<{
    offer: SavedOffer;
    images: string[];
    status?: { tone: 'busy' | 'ok' | 'error'; text: string };
  } | null>(null);
  const closeSaved = useCallback((notify: boolean) => {
    setSaved((current) => {
      if (current) {
        for (const url of current.images) URL.revokeObjectURL(url);
        if (notify) {
          postToHost({ type: 'savedAction', offerId: current.offer.id, action: 'close' });
        }
      }
      return null;
    });
  }, []);
  const [findTabId, setFindTabId] = useState<string | null>(null);
  const [findFocus, setFindFocus] = useState(0);
  const [findResult, setFindResult] = useState<{
    tabId: string;
    index: number;
    count: number;
  } | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string; error: boolean } | null>(null);
  const [omniboxFocus, setOmniboxFocus] = useState(0);
  const [viewportFocus, setViewportFocus] = useState(0);
  const contextPoint = useRef({ x: 0, y: 0 });
  const windowStateRef = useRef(windowState);
  const starAnchor = useRef({ x: innerWidth - 16, y: 72 });

  const activeTab = windowState.tabs.find((tab) => tab.id === windowState.activeTabId);

  const showToast = useCallback(
    (message: string) => setToast({ id: Date.now(), message, error: FAILURE.test(message) }),
    [],
  );
  const openMenu = useCallback((x: number, y: number, items: MenuItem[]) => {
    setMenuScope(null);
    setMenu(items.length ? { x, y, items } : null);
  }, []);
  const closeMenu = useCallback(() => {
    setMenu(null);
    setMenuScope(null);
  }, []);
  const closeEditor = useCallback(() => setEditor(null), []);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    drawingRef.current = drawing;
  }, [drawing]);

  /** Changes the drawings; `commit` adds an undo step. Syncs them to the host (debounced). */
  const updateShapes = useCallback((shapes: Shape[], commit: boolean) => {
    // Edits always belong to the tab being shown.
    const tabId = windowStateRef.current.activeTabId ?? '';
    setDrawing((current) =>
      current.tabId === tabId
        ? {
            ...current,
            shapes,
            undo: commit ? [...current.undo.slice(-99), current.shapes] : current.undo,
            redo: commit ? [] : current.redo,
          }
        : { tabId, shapes, undo: commit ? [[]] : [], redo: [] },
    );
    clearTimeout(syncTimer.current);
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
    async (mode: CaptureMode, toAgent = false) => {
      const { tabId, shapes } = drawingRef.current;
      if (!tabId) return;
      if (!shapes.length && (mode === 'area' || mode === 'groups' || mode === 'clean')) {
        showToast('Draw something first.');
        return;
      }
      const groups = mode === 'groups' ? clusterShapes(shapes, 80) : [shapes];
      // Every screenshot first, then all of them: a group is only as big as what was captured
      // (one that fails ends it, with what came before still delivered and offered).
      const images: string[] = [];
      for (const group of groups) {
        const area = mode === 'viewport' ? 'viewport' : mode === 'fullPage' ? 'fullPage' : 'region';
        const rect = area === 'region' ? union(group.map(shapeBounds)) : undefined;
        const image = await requestCapture(tabId, area, rect);
        if (image.error || !image.data || !image.rect) {
          showToast(`Screenshot failed: ${image.error ?? 'no image'}`);
          break;
        }
        images.push(
          await compositeScreenshot(
            image.data,
            image.mimeType ?? 'image/png',
            image.rect,
            mode === 'clean' ? [] : group,
          ),
        );
      }
      // Several screenshots at once: one group in Agent Context, sent together.
      const groupId = images.length > 1 ? crypto.randomUUID() : undefined;
      for (const [index, base64] of images.entries()) {
        const label =
          groups.length > 1 ? `Drawing ${index + 1} of ${images.length}` : CAPTURE_LABELS[mode];
        postToHost({
          type: 'saveImage',
          tabId,
          base64,
          label,
          toAgent,
          group: groupId && { id: groupId, index, count: images.length },
        });
      }
    },
    [requestCapture, showToast],
  );

  /** Switches the pointer tool (the element picker starts and stops in an effect below). */
  const changeTool = useCallback((next: Tool | null) => {
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
    const enabled = !tab.emulation.enabled;
    postToHost({
      type: 'emulation',
      tabId: tab.id,
      settings: {
        ...tab.emulation,
        enabled,
        // Like Chrome, the device toolbar opens with a resizable screen filling the page area.
        device:
          enabled && !tab.emulation.device
            ? responsiveDevice(pageAreaRef.current)
            : tab.emulation.device,
      },
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
        case 'inspectSelection':
          if (message.tabId === windowStateRef.current.activeTabId)
            setInspectSelection(message.rects);
          break;
        case 'setInspect': {
          // "Select an Element" from the command palette toggles the picker, like its shortcut.
          const current = toolRef.current;
          const same = current?.kind === 'inspect' && current.purpose === message.purpose;
          changeTool(
            message.purpose && !same ? { kind: 'inspect', purpose: message.purpose } : null,
          );
          break;
        }
        case 'startRegionSelect':
          changeTool({ kind: 'region' });
          break;
        case 'annotations':
          // The host sends these as it activates a tab, which can arrive before the new tab
          // state has rendered, so do not filter on the active tab here.
          setDrawing({ tabId: message.tabId, shapes: message.shapes, undo: [], redo: [] });
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
          changeTool(message.on && toolRef.current?.kind !== 'draw' ? { kind: 'draw' } : null);
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
        case 'convertImage':
          void toPng(message.data, message.mimeType).then(
            (png) =>
              postToHost({ type: 'convertedImage', requestId: message.requestId, base64: png }),
            () => postToHost({ type: 'convertedImage', requestId: message.requestId }),
          );
          break;
        case 'toast':
          showToast(message.message);
          break;
        case 'saved': {
          const images = message.offer.images.map((image) =>
            URL.createObjectURL(
              new Blob([image.data as Uint8Array<ArrayBuffer>], { type: image.mimeType }),
            ),
          );
          setSaved((current) => {
            for (const url of current?.images ?? []) URL.revokeObjectURL(url);
            return { offer: message.offer, images };
          });
          break;
        }
        case 'savedStatus':
          setSaved((current) =>
            current?.offer.id === message.offerId
              ? { ...current, status: { tone: message.tone, text: message.text } }
              : current,
          );
          // Sent: the dialog shows it a moment, then closes.
          if (message.close) setTimeout(() => closeSaved(false), 900);
          break;
        case 'shortcuts':
          setShortcutOverrides(message.overrides);
          break;
        case 'settings':
          setRecordMaxSeconds(message.recordMaxSeconds);
          break;
        case 'overlayImage': {
          const url = URL.createObjectURL(
            new Blob([message.data as Uint8Array<ArrayBuffer>], { type: message.mimeType }),
          );
          setOverlays((current) => {
            const previous = current[message.tabId];
            if (previous) URL.revokeObjectURL(previous.url);
            return {
              ...current,
              [message.tabId]: {
                url,
                name: message.name,
                opacity: previous?.opacity ?? 0.5,
                x: previous?.x ?? 0,
                y: previous?.y ?? 0,
                difference: previous?.difference ?? false,
                hidden: false,
              },
            };
          });
          break;
        }
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
  }, [
    openMenu,
    showToast,
    editActiveBookmark,
    toggleDeviceToolbar,
    changeTool,
    captureDrawing,
    closeSaved,
  ]);

  // Chrome's inspect mode runs in the page while the element picker is on (per tab).
  const inspectTabId = tool?.kind === 'inspect' && activeTab ? activeTab.id : undefined;
  useEffect(() => {
    if (!inspectTabId) return;
    postToHost({ type: 'inspect', tabId: inspectTabId, action: 'start' });
    return () => postToHost({ type: 'inspect', tabId: inspectTabId, action: 'stop' });
  }, [inspectTabId]);

  const devTabId = devOpen && activeTab && !activeTab.internalPage ? activeTab.id : undefined;
  useEffect(() => {
    if (!devTabId) return;
    postToHost({ type: 'devConsole', tabId: devTabId, open: true });
    return () => postToHost({ type: 'devConsole', tabId: devTabId, open: false });
  }, [devTabId]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), toast.error ? ERROR_TOAST_MS : TOAST_MS);
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

  // Keyboard: the mode's keys first, then the concurrent panels, then browser-wide keys.
  const pageTab = activeTab && !activeTab.internalPage ? activeTab : undefined;
  const toolScope: ShortcutScope | undefined = TOOL_SCOPES.find((scope) => scope === tool?.kind);
  const overlay = pageTab ? overlays[pageTab.id] : undefined;
  const updateOverlay = (changes: Partial<OverlayState>) =>
    pageTab &&
    setOverlays((current) => {
      const existing = current[pageTab.id];
      return existing ? { ...current, [pageTab.id]: { ...existing, ...changes } } : current;
    });
  const closeOverlay = () => {
    if (!pageTab || !overlay) return;
    URL.revokeObjectURL(overlay.url);
    setOverlays((current) => {
      const next = { ...current };
      delete next[pageTab.id];
      return next;
    });
  };
  const openOverlay = () => pageTab && postToHost({ type: 'overlayOpen', tabId: pageTab.id });
  const helpScope: ShortcutScope = menuScope ?? toolScope ?? 'global';
  const scopes: ShortcutScope[] =
    helpOpen || quickOpen
      ? ['global']
      : ([
          menuScope,
          toolScope,
          recording ? 'record' : undefined,
          overlay ? 'overlay' : undefined,
          devOpen && pageTab ? 'devtools' : undefined,
          pageTab?.emulation.enabled ? 'device' : undefined,
          'global',
        ].filter(Boolean) as ShortcutScope[]);
  const drawStyle = styles[drawTool] ?? DEFAULT_STYLE;
  const setDrawStyle = (changes: Partial<ShapeStyle>) => {
    setStyles((current) => ({
      ...current,
      [drawTool]: { ...(current[drawTool] ?? DEFAULT_STYLE), ...changes },
    }));
    if (changes.color) {
      const color = changes.color;
      setRecentColors((current) => [color, ...current.filter((c) => c !== color)].slice(0, 4));
    }
  };
  const openScreenshotChooser = () => {
    if (!pageTab) return;
    // Under the toolbar's camera button (or the tools group when the toolbar is narrow).
    const anchor = (
      document.querySelector('.toolbar-tools .icon-button:nth-of-type(3)') ??
      document.querySelector('.toolbar-tools')
    )?.getBoundingClientRect();
    setMenu({
      x: anchor?.left ?? innerWidth / 2,
      y: (anchor?.bottom ?? 40) + 2,
      items: screenshotMenu(pageTab, {
        region: () => changeTool({ kind: 'region' }),
        element: () => changeTool({ kind: 'inspect', purpose: 'screenshot' }),
        drawing: drawing.shapes.length ? () => void captureDrawing('area') : undefined,
      }),
    });
    setMenuScope('screenshot');
  };
  // Built when a key is pressed (not during render): the handlers read refs and post messages.
  const handlers = (): ShortcutHandlers => ({
    ...buildHandlers({
      tab: pageTab,
      customDevices,
      pageArea,
      toggleMode: (mode) => {
        if (mode === 'inspect') {
          changeTool(tool?.kind === 'inspect' ? null : { kind: 'inspect', purpose: 'copy' });
        } else if (mode === 'draw') {
          if (pageTab) changeTool(tool?.kind === 'draw' ? null : { kind: 'draw' });
        } else if (mode === 'screenshot') {
          if (menuScope === 'screenshot') closeMenu();
          else openScreenshotChooser();
        } else if (mode === 'devtools') {
          setDevOpen((open) => !open);
        } else if (mode === 'device') {
          toggleDeviceToolbar();
        } else if (mode === 'overlay') {
          if (overlay) closeOverlay();
          else openOverlay();
        } else if (mode === 'record') {
          if (recording) toolHandlers.current.record?.['record.stop']?.();
          else if (pageTab) setRecording(true);
        } else if (
          pageTab &&
          (mode === 'measure' || mode === 'eyedropper' || mode === 'tweak' || mode === 'a11y')
        ) {
          changeTool(tool?.kind === mode ? null : { kind: mode });
        }
      },
      exitMode: () => {
        if (menuScope) closeMenu();
        else changeTool(null);
      },
      showHelp: () => setHelpOpen(true),
      openQuickActions: () => setQuickOpen(true),
      setDrawTool,
      drawStyle,
      setDrawStyle,
      undo,
      redo,
      clearDrawing: () => updateShapes([], true),
      toggleDrawingVisible: () => setDrawingVisible((v) => !v),
      captureDrawing: (toAgent) => void captureDrawing('area', toAgent),
      captureDrawingAs: (mode) => void captureDrawing(mode),
      openCaptureMenu: () => {
        const button = document.querySelector('.draw-capture');
        if (!button) return;
        const rect = button.getBoundingClientRect();
        openMenu(
          rect.left,
          rect.bottom + 2,
          captureMenu((mode) => void captureDrawing(mode), shortcutLabel),
        );
      },
      screenshotRegion: () => {
        closeMenu();
        changeTool({ kind: 'region' });
      },
      screenshotElement: () => {
        closeMenu();
        changeTool({ kind: 'inspect', purpose: 'screenshot' });
      },
      devCommand: (name) => {
        setDevOpen(true);
        setDevCommand((current) => ({ name, seq: (current?.seq ?? 0) + 1 }));
      },
      closeDev: () => setDevOpen(false),
    }),
    ...Object.assign({}, ...Object.values(toolHandlers.current)),
  });
  useShortcutDispatch(scopes, handlers);
  /** Runs an action from the quick actions list (like its shortcut would). */
  const runAction = (id: string) => {
    const handler = handlers()[id];
    const command = SHORTCUT_ACTIONS.find((a) => a.id === id)?.command;
    if (handler) handler();
    else if (command) postToHost({ type: 'command', command });
  };

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
            onScreenshotMenu={openScreenshotChooser}
            toolsActive={
              !!(toolScope && !['inspect', 'draw'].includes(toolScope)) || !!overlay || recording
            }
            onToolsMenu={(x, y) =>
              openMenu(
                x,
                y,
                toolsMenu(runAction, {
                  measure: tool?.kind === 'measure',
                  eyedropper: tool?.kind === 'eyedropper',
                  tweak: tool?.kind === 'tweak',
                  a11y: tool?.kind === 'a11y',
                  overlay: !!overlay,
                  record: recording,
                }),
              )
            }
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
              onStyle={setDrawStyle}
              keyOf={shortcutLabel}
              onUndo={undo}
              onRedo={redo}
              onClear={() => updateShapes([], true)}
              onToggleVisible={() => setDrawingVisible((v) => !v)}
              onCapture={(x, y) =>
                openMenu(
                  x,
                  y,
                  captureMenu((mode) => void captureDrawing(mode), shortcutLabel),
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
            onResizeDevice={(size) => {
              const emulation = activeTab.emulation;
              postToHost({
                type: 'emulation',
                tabId: activeTab.id,
                settings: {
                  ...emulation,
                  enabled: true,
                  device: responsiveDevice(pageArea, emulation.device, size),
                },
              });
            }}
            bottomInset={devOpen && !activeTab.internalPage ? devHeight : 0}
            onContextPoint={(x, y, pageX, pageY) => {
              contextPoint.current = { x, y };
              contextPagePoint.current = { x: pageX, y: pageY };
            }}
            mode={viewportMode(tool)}
            renderOverlay={
              tool || overlay || (drawing.shapes.length > 0 && drawing.tabId === activeTab.id)
                ? (mapper: ViewportMapper) => (
                    <>
                      {((drawing.tabId === activeTab.id && drawing.shapes.length > 0) ||
                        tool?.kind === 'draw') && (
                        <DrawingLayer
                          mapper={mapper}
                          shapes={drawing.tabId === activeTab.id ? drawing.shapes : []}
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
                          selection={inspectSelection}
                          onSelectionAction={(action) =>
                            postToHost({ type: 'selectionAction', tabId: activeTab.id, action })
                          }
                        />
                      )}
                      {overlay && (
                        <DesignOverlay
                          mapper={mapper}
                          overlay={overlay}
                          onChange={updateOverlay}
                          onOpen={openOverlay}
                          onClose={closeOverlay}
                          onHandlers={registerToolHandlers('overlay')}
                        />
                      )}
                      {tool?.kind === 'measure' && (
                        <Measure
                          mapper={mapper}
                          tabId={activeTab.id}
                          onHandlers={registerToolHandlers('tool')}
                        />
                      )}
                      {tool?.kind === 'eyedropper' && (
                        <Eyedropper mapper={mapper} onHandlers={registerToolHandlers('tool')} />
                      )}
                      {tool?.kind === 'tweak' && (
                        <CssTweak
                          mapper={mapper}
                          tabId={activeTab.id}
                          onHandlers={registerToolHandlers('tool')}
                          onExit={() => changeTool(null)}
                        />
                      )}
                      {tool?.kind === 'a11y' && (
                        <A11yCheck
                          mapper={mapper}
                          tabId={activeTab.id}
                          onHandlers={registerToolHandlers('tool')}
                          onExit={() => changeTool(null)}
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
            command={devCommand}
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
        {saved && (
          <SendModal
            title={saved.offer.title}
            images={saved.images}
            project={saved.offer.project}
            projects={saved.offer.projects}
            onProject={(project) =>
              postToHost({
                type: 'savedAction',
                offerId: saved.offer.id,
                action: 'project',
                project,
              })
            }
            targets={saved.offer.targets}
            defaultTarget={saved.offer.defaultTarget}
            harnesses={saved.offer.harnesses}
            onSend={(target, { open }) =>
              postToHost({
                type: 'savedAction',
                offerId: saved.offer.id,
                action: 'send',
                target,
                open,
              })
            }
            onCopy={() =>
              postToHost({ type: 'savedAction', offerId: saved.offer.id, action: 'copy' })
            }
            onDownload={() =>
              postToHost({ type: 'savedAction', offerId: saved.offer.id, action: 'reveal' })
            }
            downloadLabel="Reveal"
            status={saved.status}
            map={shortcutMap}
            onClose={() => {
              closeSaved(true);
              setViewportFocus((n) => n + 1);
            }}
          />
        )}
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
      {recording && pageTab && (
        <Recorder
          tabId={pageTab.id}
          maxSeconds={recordMaxSeconds}
          onDone={() => setRecording(false)}
          onHandlers={registerToolHandlers('record')}
        />
      )}
      {menu && <Menu menu={menu} onClose={closeMenu} />}
      {helpOpen && <CheatSheet scope={helpScope} onClose={() => setHelpOpen(false)} />}
      {quickOpen && (
        <QuickActions scope={helpScope} run={runAction} onClose={() => setQuickOpen(false)} />
      )}
      {toast && (
        <div
          key={toast.id}
          className={`toast${toast.error ? ' error' : ''}`}
          role={toast.error ? 'alert' : 'status'}
        >
          {toast.error && <span className="codicon codicon-error" aria-hidden="true" />}
          <span className="toast-message">{toast.message}</span>
          {toast.error && (
            <IconButton
              icon="close"
              label="Dismiss"
              className="small toast-dismiss"
              onClick={() => setToast(null)}
            />
          )}
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
  // The extension's button: pressing it again closes the popup (see listenOutsidePress).
  const [opener] = useState(pressedOpener);
  useEffect(() => {
    const stopPointer = listenOutsidePress(
      () => [ref.current],
      opener,
      () => onClose(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => {
      stopPointer();
      window.removeEventListener('keydown', onKeyDown, true);
    };
  }, [onClose, opener]);
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
/** Decodes any image the webview can show (WebP, AVIF, GIF, SVG...) and re-encodes it as PNG. */
async function toPng(data: Uint8Array, mimeType: string): Promise<string> {
  const blob = new Blob([data as Uint8Array<ArrayBuffer>], { type: mimeType });
  const url = URL.createObjectURL(blob);
  try {
    // An <img> also decodes SVG, which createImageBitmap does not.
    const image = new Image();
    image.src = url;
    await image.decode();
    const width = image.naturalWidth || 512;
    const height = image.naturalHeight || 512;
    const canvas = new OffscreenCanvas(width, height);
    canvas.getContext('2d')!.drawImage(image, 0, 0, width, height);
    const png = await canvas.convertToBlob({ type: 'image/png' });
    const bytes = new Uint8Array(await png.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  } finally {
    URL.revokeObjectURL(url);
  }
}

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
