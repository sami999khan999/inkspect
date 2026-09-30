import { CONTEXT_KINDS, type ContextKind } from './agentContext';
import type { Shape } from './annotations';
import type { BookmarkRoots } from './bookmarks';
import type { ConsoleEntry, NetworkEntry } from './devtools';
import type { DevicePreset, EmulationSettings } from './devices';
import type { ClearRange, HistoryItem, Suggestion } from './history';
import type { ShortcutOverrides } from './shortcuts';
import type { A11yScan, MeasureBox } from './tools';

// Messages exchanged between the extension host (src/panel) and the webview (webview/src).
// Both sides import this file, so every message type is defined exactly once.

// ---------------------------------------------------------------------------------------------
// Shared state
// ---------------------------------------------------------------------------------------------

/** State of the Chromium process that renders pages. */
export type EngineStatus = 'stopped' | 'downloading' | 'starting' | 'running' | 'crashed' | 'error';

export interface EngineState {
  status: EngineStatus;
  /** Human-readable detail, e.g. an error message. */
  message?: string;
  /** Download progress from 0 to 1 while `status` is `downloading`. */
  progress?: number;
}

/** Security indicator shown in the address bar. */
export type SecurityState = 'secure' | 'insecure' | 'neutral' | 'internal' | 'unknown';

/** Pages rendered by the webview itself instead of Chromium (`vb://<name>`). */
export type InternalPage =
  'newtab' | 'downloads' | 'history' | 'bookmarks' | 'settings' | 'extensions';

export interface JsDialog {
  type: 'alert' | 'confirm' | 'prompt' | 'beforeunload';
  message: string;
  defaultPrompt?: string;
  url: string;
}

export interface TabState {
  id: string;
  url: string;
  title: string;
  favicon?: string;
  loading: boolean;
  /** Load progress from 0 to 1. */
  progress: number;
  canGoBack: boolean;
  canGoForward: boolean;
  security: SecurityState;
  zoom: number;
  audible: boolean;
  pinned: boolean;
  crashed: boolean;
  fullscreen: boolean;
  internalPage?: InternalPage;
  dialog?: JsDialog;
  /** Id of the bookmark for this page, if it is bookmarked. */
  bookmarkId?: string;
  /** Private tab: separate cookies and storage, no history. */
  private: boolean;
  emulation: EmulationSettings;
}

export interface WindowState {
  /** Stable id used to restore this window's tabs after VS Code reloads. */
  windowId: string;
  tabs: TabState[];
  activeTabId?: string;
  canReopenClosedTab: boolean;
}

export interface FrameMetadata {
  /** Emulated viewport size in CSS pixels. */
  deviceWidth: number;
  deviceHeight: number;
  pageScaleFactor: number;
  offsetTop: number;
  scrollOffsetX: number;
  scrollOffsetY: number;
}

export type DownloadState = 'inProgress' | 'completed' | 'canceled';

export interface DownloadInfo {
  id: string;
  url: string;
  filename: string;
  /** Final path on disk once the download has completed. */
  path?: string;
  state: DownloadState;
  receivedBytes: number;
  totalBytes: number;
  startTime: number;
}

/** What was under the pointer when the page's context menu was requested. */
export interface PageContext {
  linkUrl?: string;
  linkText?: string;
  mediaType?: 'img' | 'video' | 'audio';
  srcUrl?: string;
  selectionText?: string;
  editable: boolean;
  frameUrl?: string;
}

/** Data for the internal pages, requested with `requestPageData`. */
export type PageData =
  | { page: 'history'; query: string; items: HistoryItem[] }
  | { page: 'bookmarks'; roots: BookmarkRoots }
  | { page: 'newtab'; topSites: HistoryItem[] }
  | { page: 'settings'; chromiumVersion?: string; profiles: string[] };

export type BookmarkAction =
  | { action: 'add'; url: string; title: string; favicon?: string; parentId?: string }
  | { action: 'update'; id: string; title?: string; url?: string }
  | { action: 'move'; id: string; parentId: string; index?: number }
  | { action: 'remove'; id: string }
  | { action: 'addFolder'; parentId: string; title: string }
  | { action: 'open'; url: string; newTab: boolean }
  | { action: 'openAll'; id: string }
  | { action: 'import' }
  | { action: 'export' };

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Why the element picker is on: copy details for an AI agent, or pick an element to capture. */
export type InspectPurpose = 'copy' | 'screenshot';

export type ScreenshotMode = 'viewport' | 'fullPage' | 'region' | 'element' | 'annotations';

/** An installed Chrome extension, as shown in the toolbar and on vb://extensions. */
export interface ExtensionInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  enabled: boolean;
  pinned: boolean;
  /** Data URL. */
  icon?: string;
  source: 'folder' | 'file' | 'webstore';
  permissions: string[];
  /** Popup page path, when the toolbar button opens one. */
  popup?: string;
  optionsPage?: string;
  /** Why it failed to load the last time the browser started. */
  error?: string;
}

export interface HistoryEntry {
  id: number;
  url: string;
  title: string;
}

// ---------------------------------------------------------------------------------------------
// Input events (webview → host → Chromium)
// ---------------------------------------------------------------------------------------------

export type MouseButton = 'none' | 'left' | 'middle' | 'right' | 'back' | 'forward';

export interface MouseInput {
  kind: 'mouse';
  type: 'mousePressed' | 'mouseReleased' | 'mouseMoved';
  /** Position in page CSS pixels. */
  x: number;
  y: number;
  button: MouseButton;
  /** Pressed buttons bitmask, same as `MouseEvent.buttons`. */
  buttons: number;
  clickCount: number;
  /** Alt=1, Ctrl=2, Meta=4, Shift=8. */
  modifiers: number;
}

export interface WheelInput {
  kind: 'wheel';
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
  modifiers: number;
}

export interface KeyInput {
  kind: 'key';
  type: 'keyDown' | 'keyUp';
  key: string;
  code: string;
  keyCode: number;
  location: number;
  modifiers: number;
  repeat: boolean;
}

/** Text committed by an IME, the emoji picker or similar. */
export interface TextInput {
  kind: 'text';
  text: string;
}

export type InputEvent = MouseInput | WheelInput | KeyInput | TextInput;

// ---------------------------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------------------------

export type TabAction =
  | 'new'
  | 'newPrivate'
  | 'newWindow'
  | 'close'
  | 'activate'
  | 'reload'
  | 'hardReload'
  | 'stop'
  | 'back'
  | 'forward'
  | 'home'
  | 'duplicate'
  | 'pin'
  | 'unpin'
  | 'moveToNewWindow'
  | 'closeOthers'
  | 'closeToRight'
  | 'reopenClosed'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'savePdf'
  | 'viewSource'
  | 'openExternal'
  | 'copyUrl'
  | 'bookmark'
  | 'find';

export type ContextMenuAction =
  | 'openLinkInNewTab'
  | 'openLinkExternal'
  | 'copyLink'
  | 'openMediaInNewTab'
  | 'copyMediaUrl'
  | 'copyImage'
  | 'saveMedia'
  | 'copySelection'
  | 'searchSelection'
  | 'cut'
  | 'copy'
  | 'paste'
  | 'selectAll'
  | 'copyElement'
  | 'screenshot';

export type DownloadAction = 'open' | 'reveal' | 'cancel' | 'remove' | 'clear';

// ---------------------------------------------------------------------------------------------
// Messages
// ---------------------------------------------------------------------------------------------

/** Messages sent from the extension host to the webview. */
export type HostToWebview =
  | { type: 'engine'; state: EngineState }
  | { type: 'state'; state: WindowState }
  | { type: 'frame'; tabId: string; data: Uint8Array; metadata: FrameMetadata }
  | { type: 'cursor'; tabId: string; cursor: string }
  | { type: 'contextMenu'; tabId: string; context: PageContext }
  | { type: 'history'; tabId: string; direction: 'back' | 'forward'; entries: HistoryEntry[] }
  | { type: 'findResult'; tabId: string; index: number; count: number }
  | { type: 'downloads'; downloads: DownloadInfo[]; started?: boolean }
  /** Last-resort image copy in the webview (the host normally uses the OS clipboard). */
  | { type: 'copyImage'; data: Uint8Array; mimeType: string }
  /** Decode an image the OS clipboard cannot take (WebP, SVG, ...) and send it back as PNG. */
  | { type: 'convertImage'; requestId: string; data: Uint8Array; mimeType: string }
  | { type: 'bookmarks'; roots: BookmarkRoots; showBar: boolean }
  | { type: 'suggestions'; query: string; items: Suggestion[] }
  | { type: 'pageData'; data: PageData }
  /** The data behind an internal page changed; the page should request it again. */
  | { type: 'pageDataChanged'; page: InternalPage }
  | { type: 'editBookmark' }
  | { type: 'devices'; custom: DevicePreset[] }
  /** Elements added to a multi-selection (Shift+click), in document CSS pixels. */
  | { type: 'inspectSelection'; tabId: string; rects: Rect[] }
  /** Turns the element picker on (with a purpose) or off (`null`). */
  | { type: 'setInspect'; purpose: InspectPurpose | null }
  | { type: 'startRegionSelect' }
  /** The drawings of a tab (sent when the tab is shown, or cleared after navigating). */
  | { type: 'annotations'; tabId: string; shapes: Shape[] }
  /** A clean screenshot for the webview to draw the annotations onto. */
  | {
      type: 'annotationImage';
      requestId: string;
      data?: Uint8Array;
      mimeType?: string;
      /** The document area (CSS pixels) the image shows. */
      rect?: Rect;
      error?: string;
    }
  | { type: 'setDrawing'; on: boolean }
  | { type: 'extensions'; list: ExtensionInfo[] }
  /** An extension popup is open: its page streams with `tabId`, at this size. */
  | { type: 'extensionPopup'; tabId: string; extensionId: string; width: number; height: number }
  | { type: 'extensionPopupClosed' }
  /** Console and network log of a tab, while the developer drawer is open. */
  | { type: 'devData'; tabId: string; console: ConsoleEntry[]; network: NetworkEntry[] }
  | { type: 'toggleDevConsole' }
  | { type: 'captureAnnotations' }
  | { type: 'toggleDeviceToolbar' }
  | { type: 'focusAddressBar' }
  | { type: 'focusViewport' }
  | { type: 'openFind' }
  | { type: 'toast'; message: string }
  /** The user's shortcut changes (see src/shared/shortcuts.ts). */
  | { type: 'shortcuts'; overrides: ShortcutOverrides }
  /** Settings the webview's modes need. */
  | { type: 'settings'; recordMaxSeconds: number }
  | { type: 'measureResult'; requestId: string; box?: MeasureBox }
  | { type: 'a11yResult'; tabId: string; scan?: A11yScan }
  /** CSS tweak: the picked element and its current values (undefined when nothing was hit). */
  | {
      type: 'tweakTarget';
      tabId: string;
      target?: { selector: string; values: Record<string, string> };
    }
  | { type: 'tweakValue'; tabId: string; property: string; value: string }
  /** Design overlay: the chosen image. */
  | { type: 'overlayImage'; tabId: string; data: Uint8Array; mimeType: string; name: string };

/** Messages sent from the webview to the extension host. */
export type WebviewToHost =
  /** The webview has loaded and is ready to receive messages. */
  | { type: 'ready' }
  /** The webview received keyboard focus (so commands target this browser window). */
  | { type: 'focus' }
  /** Size of the page viewport in CSS pixels, and the webview's device pixel ratio. */
  | { type: 'viewport'; width: number; height: number; dpr: number }
  /** A frame has been drawn; Chromium may send the next one. */
  | { type: 'frameAck'; tabId: string }
  | { type: 'input'; tabId: string; event: InputEvent }
  /** Address bar input (a URL or a search). Without `tabId`, opens a new tab. */
  | { type: 'navigate'; tabId?: string; input: string; newTab?: boolean }
  | { type: 'tab'; action: TabAction; tabId?: string }
  | { type: 'moveTab'; tabId: string; index: number }
  | { type: 'requestHistory'; tabId: string; direction: 'back' | 'forward' }
  | { type: 'goToHistoryEntry'; tabId: string; entryId: number }
  | {
      type: 'find';
      tabId: string;
      query: string;
      caseSensitive: boolean;
      direction: 'next' | 'previous' | 'restart';
    }
  | { type: 'stopFind'; tabId: string }
  | { type: 'dialogResponse'; tabId: string; accept: boolean; promptText?: string }
  | {
      type: 'contextMenuAction';
      tabId: string;
      action: ContextMenuAction;
      context: PageContext;
      /** Where the menu was opened, in viewport CSS pixels (for "Copy element details"). */
      point?: { x: number; y: number };
    }
  | { type: 'download'; action: DownloadAction; id?: string }
  | { type: 'restartEngine' }
  | { type: 'openSettings' }
  /** Address bar input changed: asks for suggestions. */
  | { type: 'suggest'; query: string }
  /** Switches to a tab in any browser window. */
  | { type: 'focusTab'; tabId: string }
  | { type: 'requestPageData'; page: InternalPage; query?: string }
  | ({ type: 'bookmark' } & BookmarkAction)
  | { type: 'historyAction'; action: 'remove'; url: string }
  | { type: 'historyAction'; action: 'clear'; range: ClearRange }
  | { type: 'clearBrowsingData' }
  | { type: 'toggleBookmarksBar' }
  /** A shortcut's VS Code command (only registry commands are run). */
  | { type: 'command'; command: string }
  /** Copies text for the webview (the host's clipboard handles every platform); `toast` confirms. */
  /** Copies text; with `kind`, also adds it to the Agent Context list under `label`. */
  | { type: 'copyText'; text: string; toast?: string; kind?: ContextKind; label?: string }
  /** Sends text (measurements, reports, CSS changes) to the agent, through the Agent Context list. */
  | { type: 'sendToAgent'; text: string; label: string; kind?: ContextKind }
  /** Measure mode: the boxes of the element at a point (viewport CSS pixels). */
  | { type: 'measure'; tabId: string; requestId: string; x: number; y: number }
  /** Accessibility check: scan the page. */
  | { type: 'a11yScan'; tabId: string }
  /** CSS tweak: pick the element at a point, set one property, or put everything back. */
  | { type: 'tweak'; tabId: string; action: 'pick'; x: number; y: number }
  | { type: 'tweak'; tabId: string; action: 'set'; property: string; value: string }
  | { type: 'tweak'; tabId: string; action: 'restore' }
  /** Design overlay: choose an image file. */
  | { type: 'overlayOpen'; tabId: string }
  /** Record mode: the finished recording (WebM). */
  | { type: 'saveRecording'; tabId: string; data: Uint8Array; seconds: number }
  /** Device emulation for a tab (validated with `sanitizeEmulation` by the host). */
  | { type: 'emulation'; tabId: string; settings: EmulationSettings }
  | { type: 'saveCustomDevice'; name: string; device: EmulationSettings['device'] }
  | {
      type: 'inspect';
      tabId: string;
      action: 'pick';
      x: number;
      y: number;
      purpose: InspectPurpose;
      /** Shift+click: add to the multi-selection instead of copying right away. */
      add: boolean;
      /** Alt+click: also save a screenshot of the element. */
      screenshot: boolean;
      /** Ctrl+click: send the details to the chat agent; Ctrl+Shift+click: a terminal agent. */
      send?: 'chat' | 'terminal';
    }
  | {
      type: 'inspect';
      tabId: string;
      /** `screenshot` and `agent` act on the element reached with the pointer or arrow keys. */
      action: 'start' | 'parent' | 'child' | 'copySelection' | 'screenshot' | 'agent' | 'stop';
    }
  /** The bar over a Shift+click selection: act on every selected element. */
  | {
      type: 'selectionAction';
      tabId: string;
      action: 'copy' | 'chat' | 'terminal' | 'screenshot' | 'save' | 'clear';
    }
  | { type: 'annotations'; tabId: string; shapes: Shape[] }
  /** Screenshot for compositing drawings; `rect` in document CSS pixels for `region`. */
  | {
      type: 'annotationCapture';
      tabId: string;
      requestId: string;
      area: 'region' | 'viewport' | 'fullPage';
      rect?: Rect;
    }
  | {
      type: 'extension';
      action: 'loadUnpacked' | 'installFile' | 'installWebStore' | 'checkUpdates';
      value?: string;
    }
  | {
      type: 'extension';
      action: 'remove' | 'enable' | 'disable' | 'pin' | 'unpin' | 'openOptions' | 'openPopup';
      id: string;
    }
  | { type: 'closeExtensionPopup' }
  /** The developer drawer opened or closed (the host only streams logs while it is open). */
  | { type: 'devConsole'; tabId: string; open: boolean }
  | {
      type: 'devAction';
      tabId: string;
      action: 'clear' | 'copyErrors' | 'copyFailedRequests' | 'copyContext' | 'openDevTools';
      /** Send the text to the chat instead of the clipboard. */
      chat?: boolean;
    }
  /** Opens a script location from the console in the editor (when it is a workspace file). */
  | { type: 'openSource'; url: string; line?: number; column?: number }
  /** A finished (composited) PNG to save and copy like other screenshots. */
  | {
      type: 'saveImage';
      tabId: string;
      base64: string;
      label: string;
      toAgent?: boolean;
      /** Screenshots taken together (each drawing separately): one group in Agent Context. */
      group?: { id: string; index: number; count: number };
    }
  /** Types the last screenshot's path into a terminal (for an agent running there). */
  | { type: 'screenshotToTerminal' }
  /** Reply to `convertImage`; no `base64` if the image could not be decoded. */
  | { type: 'convertedImage'; requestId: string; base64?: string }
  /** `rect` (viewport CSS pixels) for `region`. */
  | {
      type: 'screenshot';
      tabId: string;
      mode: 'viewport' | 'fullPage' | 'region';
      rect?: Rect;
      /** Also send it to the agent. */
      toAgent?: boolean;
    };

// ---------------------------------------------------------------------------------------------
// Validation of messages from the webview
// ---------------------------------------------------------------------------------------------

type Check = (value: unknown) => boolean;

const isString: Check = (v) => typeof v === 'string';
const isNumber: Check = (v) => typeof v === 'number' && Number.isFinite(v);
const isBoolean: Check = (v) => typeof v === 'boolean';
const isObject: Check = (v) => typeof v === 'object' && v !== null;
/** Text the webview asks to copy or send (reports, measurements): bounded. */
const isShortText: Check = (v) => typeof v === 'string' && v.length <= 1_000_000;
const optional =
  (check: Check): Check =>
  (v) =>
    v === undefined || check(v);
const oneOf =
  (...values: readonly unknown[]): Check =>
  (v) =>
    values.includes(v);
const shape =
  (fields: Record<string, Check>): Check =>
  (v) =>
    typeof v === 'object' &&
    v !== null &&
    Object.entries(fields).every(([key, check]) => check((v as Record<string, unknown>)[key]));

const TAB_ACTIONS: readonly TabAction[] = [
  'new',
  'newPrivate',
  'newWindow',
  'close',
  'activate',
  'reload',
  'hardReload',
  'stop',
  'back',
  'forward',
  'home',
  'duplicate',
  'pin',
  'unpin',
  'moveToNewWindow',
  'closeOthers',
  'closeToRight',
  'reopenClosed',
  'zoomIn',
  'zoomOut',
  'zoomReset',
  'savePdf',
  'viewSource',
  'openExternal',
  'copyUrl',
  'bookmark',
  'find',
];

const CONTEXT_MENU_ACTIONS: readonly ContextMenuAction[] = [
  'openLinkInNewTab',
  'openLinkExternal',
  'copyLink',
  'openMediaInNewTab',
  'copyMediaUrl',
  'copyImage',
  'saveMedia',
  'copySelection',
  'searchSelection',
  'cut',
  'copy',
  'paste',
  'selectAll',
  'copyElement',
  'screenshot',
];

const isInputEvent: Check = (v) => {
  if (typeof v !== 'object' || v === null) return false;
  switch ((v as { kind?: unknown }).kind) {
    case 'mouse':
      return shape({
        type: oneOf('mousePressed', 'mouseReleased', 'mouseMoved'),
        x: isNumber,
        y: isNumber,
        button: oneOf('none', 'left', 'middle', 'right', 'back', 'forward'),
        buttons: isNumber,
        clickCount: isNumber,
        modifiers: isNumber,
      })(v);
    case 'wheel':
      return shape({
        x: isNumber,
        y: isNumber,
        deltaX: isNumber,
        deltaY: isNumber,
        modifiers: isNumber,
      })(v);
    case 'key':
      return shape({
        type: oneOf('keyDown', 'keyUp'),
        key: isString,
        code: isString,
        keyCode: isNumber,
        location: isNumber,
        modifiers: isNumber,
        repeat: isBoolean,
      })(v);
    case 'text':
      return shape({ text: isString })(v);
    default:
      return false;
  }
};

const isPageContext = shape({
  linkUrl: optional(isString),
  linkText: optional(isString),
  mediaType: optional(oneOf('img', 'video', 'audio')),
  srcUrl: optional(isString),
  selectionText: optional(isString),
  editable: isBoolean,
  frameUrl: optional(isString),
});

const MESSAGE_FIELDS: Record<WebviewToHost['type'], Record<string, Check>> = {
  ready: {},
  focus: {},
  viewport: { width: isNumber, height: isNumber, dpr: isNumber },
  frameAck: { tabId: isString },
  input: { tabId: isString, event: isInputEvent },
  navigate: { tabId: optional(isString), input: isString, newTab: optional(isBoolean) },
  tab: { action: oneOf(...TAB_ACTIONS), tabId: optional(isString) },
  moveTab: { tabId: isString, index: isNumber },
  requestHistory: { tabId: isString, direction: oneOf('back', 'forward') },
  goToHistoryEntry: { tabId: isString, entryId: isNumber },
  find: {
    tabId: isString,
    query: isString,
    caseSensitive: isBoolean,
    direction: oneOf('next', 'previous', 'restart'),
  },
  stopFind: { tabId: isString },
  dialogResponse: { tabId: isString, accept: isBoolean, promptText: optional(isString) },
  contextMenuAction: {
    tabId: isString,
    action: oneOf(...CONTEXT_MENU_ACTIONS),
    context: isPageContext,
    point: optional(shape({ x: isNumber, y: isNumber })),
  },
  download: {
    action: oneOf('open', 'reveal', 'cancel', 'remove', 'clear'),
    id: optional(isString),
  },
  restartEngine: {},
  openSettings: {},
  suggest: { query: isString },
  focusTab: { tabId: isString },
  requestPageData: {
    page: oneOf('newtab', 'downloads', 'history', 'bookmarks', 'settings', 'extensions'),
    query: optional(isString),
  },
  // Each bookmark action has its own fields; see isValidBookmarkAction.
  bookmark: { action: isString },
  historyAction: {
    action: oneOf('remove', 'clear'),
    url: optional(isString),
    range: optional(oneOf('hour', 'day', 'week', 'all')),
  },
  clearBrowsingData: {},
  toggleBookmarksBar: {},
  command: { command: isString },
  copyText: {
    text: isShortText,
    toast: optional(isString),
    kind: optional(oneOf(...CONTEXT_KINDS)),
    label: optional(isString),
  },
  sendToAgent: { text: isShortText, label: isString, kind: optional(oneOf(...CONTEXT_KINDS)) },
  measure: { tabId: isString, requestId: isString, x: isNumber, y: isNumber },
  a11yScan: { tabId: isString },
  // Each tweak action has its own fields; see isValidTweak.
  tweak: { tabId: isString, action: oneOf('pick', 'set', 'restore') },
  overlayOpen: { tabId: isString },
  saveRecording: {
    tabId: isString,
    data: (v) => v instanceof Uint8Array && v.length > 0 && v.length <= 500_000_000,
    seconds: isNumber,
  },
  emulation: { tabId: isString, settings: isObject },
  annotations: { tabId: isString, shapes: (v) => Array.isArray(v) },
  annotationCapture: {
    tabId: isString,
    requestId: isString,
    area: oneOf('region', 'viewport', 'fullPage'),
    rect: optional(shape({ x: isNumber, y: isNumber, width: isNumber, height: isNumber })),
  },
  saveImage: {
    tabId: isString,
    base64: isString,
    label: isString,
    toAgent: optional(isBoolean),
    group: optional(shape({ id: isString, index: isNumber, count: isNumber })),
  },
  screenshotToTerminal: {},
  convertedImage: { requestId: isString, base64: optional(isString) },
  extension: {
    action: oneOf(
      'loadUnpacked',
      'installFile',
      'installWebStore',
      'checkUpdates',
      'remove',
      'enable',
      'disable',
      'pin',
      'unpin',
      'openOptions',
      'openPopup',
    ),
    value: optional(isString),
    id: optional(isString),
  },
  closeExtensionPopup: {},
  devConsole: { tabId: isString, open: isBoolean },
  devAction: {
    tabId: isString,
    action: oneOf('clear', 'copyErrors', 'copyFailedRequests', 'copyContext', 'openDevTools'),
    chat: optional(isBoolean),
  },
  openSource: { url: isString, line: optional(isNumber), column: optional(isNumber) },
  inspect: {
    tabId: isString,
    action: oneOf(
      'start',
      'pick',
      'parent',
      'child',
      'copySelection',
      'screenshot',
      'agent',
      'stop',
    ),
    x: optional(isNumber),
    y: optional(isNumber),
    purpose: optional(oneOf('copy', 'screenshot')),
    add: optional(isBoolean),
    screenshot: optional(isBoolean),
    send: optional(oneOf('chat', 'terminal')),
  },
  selectionAction: {
    tabId: isString,
    action: oneOf('copy', 'chat', 'terminal', 'screenshot', 'save', 'clear'),
  },
  screenshot: {
    tabId: isString,
    mode: oneOf('viewport', 'fullPage', 'region'),
    rect: optional(shape({ x: isNumber, y: isNumber, width: isNumber, height: isNumber })),
    toAgent: optional(isBoolean),
  },
  saveCustomDevice: { name: isString, device: isObject },
};

/** Validates untrusted input from the webview before the host acts on it. */
export function isWebviewToHost(value: unknown): value is WebviewToHost {
  if (typeof value !== 'object' || value === null) return false;
  const type = (value as { type?: unknown }).type;
  if (typeof type !== 'string' || !Object.hasOwn(MESSAGE_FIELDS, type)) return false;
  if (!shape(MESSAGE_FIELDS[type as WebviewToHost['type']])(value)) return false;
  if (type === 'tweak') return isValidTweak(value as Record<string, unknown>);
  return type !== 'bookmark' || isValidBookmarkAction(value as Record<string, unknown>);
}

function isValidTweak(message: Record<string, unknown>): boolean {
  if (message.action === 'pick') return isNumber(message.x) && isNumber(message.y);
  if (message.action === 'set') {
    return (
      isString(message.property) &&
      isString(message.value) &&
      (message.value as string).length <= 500
    );
  }
  return message.action === 'restore';
}

const BOOKMARK_ACTION_FIELDS: Record<BookmarkAction['action'], Record<string, Check>> = {
  add: {
    url: isString,
    title: isString,
    favicon: optional(isString),
    parentId: optional(isString),
  },
  update: { id: isString, title: optional(isString), url: optional(isString) },
  move: { id: isString, parentId: isString, index: optional(isNumber) },
  remove: { id: isString },
  addFolder: { parentId: isString, title: isString },
  open: { url: isString, newTab: isBoolean },
  openAll: { id: isString },
  import: {},
  export: {},
};

function isValidBookmarkAction(message: Record<string, unknown>): boolean {
  const action = message.action;
  if (typeof action !== 'string' || !Object.hasOwn(BOOKMARK_ACTION_FIELDS, action)) return false;
  return shape(BOOKMARK_ACTION_FIELDS[action as BookmarkAction['action']])(message);
}
