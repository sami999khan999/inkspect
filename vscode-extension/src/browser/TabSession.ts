import { EventEmitter } from 'node:events';
import type { Protocol } from 'devtools-protocol';
import type { ProtocolMapping } from 'devtools-protocol/types/protocol-mapping';
import type { CDPSession } from 'puppeteer-core';
import type {
  FrameMetadata,
  HistoryEntry,
  JsDialog,
  KeyInput,
  MouseInput,
  PageContext,
  SecurityState,
  WheelInput,
} from '../shared/protocol';
import {
  DEFAULT_EMULATION,
  deviceUserAgent,
  NETWORK_CONDITIONS,
  type EmulationSettings,
} from '../shared/devices';
import {
  describeRemoteObject,
  formatConsoleArguments,
  type ConsoleEntry,
  type ConsoleLevel,
  type NetworkEntry,
} from '../shared/devtools';
import type { ElementDetails } from '../shared/elementInfo';
import type { BrowserEngine } from './BrowserEngine';
import {
  ANCESTRY_FUNCTION,
  COLLECT_DETAILS_FUNCTION,
  FIRST_CHILD_FUNCTION,
  PARENT_FUNCTION,
} from './inspectorScripts';
import { toCdpKeyEvent } from './input';
import { errorMessage, type Logger } from './logger';
import {
  BINDING_NAME,
  EXEC_COMMAND_FUNCTION,
  EXIT_FULLSCREEN_FUNCTION,
  FAVICON_FUNCTION,
  FIND_FUNCTION,
  OUTER_HTML_FUNCTION,
  PAGE_SCRIPT,
  PAGE_TEXT_FUNCTION,
  PASTE_FUNCTION,
  SELECTED_TEXT_FUNCTION,
  STOP_FIND_FUNCTION,
} from './pageScripts';

export interface Viewport {
  /** Size of the area the page is shown in, in CSS pixels. */
  width: number;
  height: number;
  /** Device pixel ratio of the webview. */
  dpr: number;
}

export interface FileChooserRequest {
  backendNodeId: number;
  multiple: boolean;
  /** Values of the input's `accept` attribute, e.g. `image/*` or `.pdf`. */
  accept: string[];
}

/** `closed`: the page went away. `engineLost`: the browser process is gone. */
export type CloseReason = 'closed' | 'engineLost';

export interface TabSessionEvents {
  frame: [data: Uint8Array, metadata: FrameMetadata];
  info: [url: string, title: string];
  loading: [loading: boolean, progress: number];
  navigated: [url: string];
  history: [canGoBack: boolean, canGoForward: boolean];
  security: [state: SecurityState];
  dialog: [dialog: JsDialog | undefined];
  fileChooser: [request: FileChooserRequest];
  cursor: [cursor: string];
  contextMenu: [context: PageContext];
  fullscreen: [active: boolean];
  audible: [audible: boolean];
  favicon: [url: string | undefined];
  crashed: [];
  closed: [reason: CloseReason];
  /** The console or network log changed (for the developer drawer). */
  devtools: [];
}

export interface TabSessionOptions {
  logger: Logger;
  platform: NodeJS.Platform;
  /** Log every CDP command at trace level. */
  logCdp?: boolean;
}

type Command = keyof ProtocolMapping.Commands;
type Params<M extends Command> = ProtocolMapping.Commands[M]['paramsType'][0];
type Result<M extends Command> = ProtocolMapping.Commands[M]['returnType'];

const FRAME_ACK_TIMEOUT_MS = 1_000;
const MAX_DATA_URL_LENGTH = 10_000_000;

/** Controls one page over its own CDP session: rendering, input, navigation and page events. */
export class TabSession {
  readonly events = new EventEmitter<TabSessionEvents>();
  url = 'about:blank';
  title = '';

  private mainFrameId: string;
  private viewport?: Viewport;
  private zoom = 1;
  private emulation: EmulationSettings = DEFAULT_EMULATION;
  private networkEnabled = false;
  private inspectorEnabled = false;
  /**
   * Screenshots in progress. Capturing beyond the viewport briefly resizes the page; those frames
   * are not shown, so the page does not flash.
   */
  private capturing = 0;
  /** Chrome's inspect mode is on (see `startInspect`). */
  private inspecting = false;
  /** Resolves with the element Chrome picked on the next inspect-mode click. */
  private inspectWaiter?: (backendNodeId: number) => void;
  /** Last pointer position sent to the page, in viewport CSS pixels. */
  lastMouse?: { x: number; y: number };
  /** Console messages and exceptions since the last navigation (newest last, capped). */
  readonly console: ConsoleEntry[] = [];
  /** Network requests since the last navigation (capped). Recorded once the drawer asks. */
  readonly requests = new Map<string, NetworkEntry>();
  private consoleId = 0;
  /** Network requests are being recorded (see `startNetworkLog`). */
  networkLogging = false;
  /** Whether Chromium is currently streaming (may lag behind `screencast` while queued). */
  private screencastActive = false;
  private screencastQueue: Promise<void> = Promise.resolve();
  private screencast?: { quality: number };
  private pendingAck?: { sessionId: number; timer: NodeJS.Timeout };
  private historyState?: Protocol.Page.GetNavigationHistoryResponse;
  private dialogOpen = false;
  private closed = false;
  private readonly removeEngineListeners: () => void;

  static async attach(
    engine: BrowserEngine,
    targetId: string,
    options: TabSessionOptions,
  ): Promise<TabSession> {
    const session = await engine.attach(targetId);
    const tab = new TabSession(engine, targetId, session, options);
    try {
      await tab.initialize();
    } catch (error) {
      tab.dispose();
      throw error;
    }
    return tab;
  }

  private constructor(
    private readonly engine: BrowserEngine,
    readonly targetId: string,
    private readonly session: CDPSession,
    private readonly options: TabSessionOptions,
  ) {
    // In Chromium the main frame's id is the target id.
    this.mainFrameId = targetId;
    const onInfo = (info: Protocol.Target.TargetInfo) => {
      if (info.targetId !== targetId) return;
      this.url = info.url;
      this.title = info.title;
      this.events.emit('info', info.url, info.title);
    };
    const onDestroyed = (id: string) => {
      if (id !== targetId) return;
      // When the whole browser shuts down every page is destroyed; the tabs should survive that.
      this.onClosed(engine.closing || !engine.connected ? 'engineLost' : 'closed');
    };
    const onDisconnected = () => this.onClosed('engineLost');
    engine.events.on('targetInfoChanged', onInfo);
    engine.events.on('targetDestroyed', onDestroyed);
    engine.events.on('disconnected', onDisconnected);
    this.removeEngineListeners = () => {
      engine.events.off('targetInfoChanged', onInfo);
      engine.events.off('targetDestroyed', onDestroyed);
      engine.events.off('disconnected', onDisconnected);
    };
  }

  private get logger(): Logger {
    return this.options.logger;
  }

  private send<M extends Command>(method: M, params?: Params<M>): Promise<Result<M>> {
    if (this.options.logCdp) this.logger.trace(`[${this.targetId.slice(0, 8)}] → ${method}`);
    return this.session.send(method, params);
  }

  /** Sends a command without waiting for it; failures are logged. */
  private fire<M extends Command>(method: M, params?: Params<M>): void {
    this.send(method, params).catch((error: unknown) => {
      if (!this.closed) this.logger.debug(`${method} failed: ${errorMessage(error)}`);
    });
  }

  private async initialize(): Promise<void> {
    this.listen();
    await Promise.all([
      this.send('Page.enable'),
      this.send('Page.setLifecycleEventsEnabled', { enabled: true }),
      this.send('Runtime.enable'),
      this.send('Security.enable'),
      this.send('Inspector.enable'),
      this.send('Log.enable'),
      this.send('Page.setInterceptFileChooserDialog', { enabled: true }),
      // Headless pages are never focused; without this, caret and focus events misbehave.
      this.send('Emulation.setFocusEmulationEnabled', { enabled: true }),
      this.send('Emulation.setUserAgentOverride', {
        userAgent: this.engine.userAgent,
        userAgentMetadata: this.engine.userAgentMetadata,
      }),
      this.send('Runtime.addBinding', { name: BINDING_NAME }),
    ]);
    await this.send('Page.addScriptToEvaluateOnNewDocument', {
      source: PAGE_SCRIPT,
      runImmediately: true,
    });
    const { frameTree } = await this.send('Page.getFrameTree');
    this.mainFrameId = frameTree.frame.id;
    this.url = frameTree.frame.url;
    await this.refreshHistory();
  }

  private listen(): void {
    const s = this.session;
    s.on('Page.screencastFrame', (event) => this.onScreencastFrame(event));
    s.on('Page.frameStartedLoading', (event) => {
      if (event.frameId === this.mainFrameId) this.events.emit('loading', true, 0.1);
    });
    s.on('Page.lifecycleEvent', (event) => {
      if (event.frameId !== this.mainFrameId) return;
      if (event.name === 'DOMContentLoaded') {
        this.events.emit('loading', true, 0.6);
        void this.refreshInfo();
      }
      if (event.name === 'load') {
        this.events.emit('loading', true, 0.9);
        void this.refreshInfo();
        void this.refreshFavicon();
      }
    });
    s.on('Page.frameStoppedLoading', (event) => {
      if (event.frameId === this.mainFrameId) this.events.emit('loading', false, 1);
    });
    s.on('Overlay.inspectNodeRequested', ({ backendNodeId }) => {
      const waiter = this.inspectWaiter;
      this.inspectWaiter = undefined;
      waiter?.(backendNodeId);
    });
    s.on('Runtime.consoleAPICalled', (event) => {
      const level: ConsoleLevel =
        event.type === 'error' || event.type === 'assert'
          ? 'error'
          : event.type === 'warning'
            ? 'warning'
            : event.type === 'debug'
              ? 'debug'
              : 'info';
      const frame = event.stackTrace?.callFrames[0];
      this.addConsole({
        level,
        text:
          formatConsoleArguments(event.args.map(describeRemoteObject)) || `console.${event.type}()`,
        url: frame?.url || undefined,
        line: frame?.lineNumber,
        column: frame?.columnNumber,
        source: 'console',
      });
    });
    s.on('Runtime.exceptionThrown', ({ exceptionDetails: details }) => {
      const frame = details.stackTrace?.callFrames[0];
      this.addConsole({
        level: 'error',
        text: details.exception?.description ?? details.text,
        url: frame?.url || details.url,
        line: frame?.lineNumber ?? details.lineNumber,
        column: frame?.columnNumber ?? details.columnNumber,
        source: 'exception',
      });
    });
    s.on('Log.entryAdded', ({ entry }) => {
      this.addConsole({
        level: entry.level === 'verbose' ? 'debug' : entry.level,
        text: entry.text,
        url: entry.url,
        line: entry.lineNumber,
        source: entry.source,
      });
    });
    s.on('Network.requestWillBeSent', (event) => {
      if (!this.networkLogging) return;
      this.requests.set(event.requestId, {
        id: event.requestId,
        method: event.request.method,
        url: event.request.url,
        type: event.type ?? 'Other',
        time: event.wallTime * 1000,
      });
      this.trimRequests();
      this.events.emit('devtools');
    });
    s.on('Network.responseReceived', (event) => {
      const entry = this.requests.get(event.requestId);
      if (!entry) return;
      entry.status = event.response.status;
      entry.mimeType = event.response.mimeType;
      this.events.emit('devtools');
    });
    s.on('Network.loadingFinished', (event) => {
      const entry = this.requests.get(event.requestId);
      if (!entry) return;
      entry.size = event.encodedDataLength;
      entry.duration = Date.now() - entry.time;
      this.events.emit('devtools');
    });
    s.on('Network.loadingFailed', (event) => {
      const entry = this.requests.get(event.requestId);
      if (!entry) return;
      entry.error = event.errorText || 'failed';
      entry.canceled = event.canceled;
      entry.duration = Date.now() - entry.time;
      this.events.emit('devtools');
    });
    s.on('Page.frameNavigated', (event) => {
      if (event.frame.parentId) return;
      // A new document may reset the overlay: keep inspecting it.
      if (this.inspecting) void this.setInspectMode(true);
      // A new document: start a fresh log, like DevTools without "Preserve log".
      this.console.length = 0;
      this.requests.clear();
      this.events.emit('devtools');
      this.mainFrameId = event.frame.id;
      this.url = event.frame.url;
      this.events.emit('navigated', event.frame.url);
      this.events.emit('fullscreen', false);
      this.events.emit('audible', false);
      void this.refreshHistory();
    });
    s.on('Page.navigatedWithinDocument', (event) => {
      if (event.frameId !== this.mainFrameId) return;
      this.url = event.url;
      void this.refreshHistory();
    });
    s.on('Page.javascriptDialogOpening', (event) => {
      this.dialogOpen = true;
      this.events.emit('dialog', {
        type: event.type,
        message: event.message,
        defaultPrompt: event.defaultPrompt,
        url: event.url,
      });
    });
    s.on('Page.javascriptDialogClosed', () => {
      this.dialogOpen = false;
      this.events.emit('dialog', undefined);
    });
    s.on('Page.fileChooserOpened', (event) => void this.onFileChooser(event));
    s.on('Runtime.bindingCalled', (event) => {
      if (event.name === BINDING_NAME) this.onPageMessage(event.payload);
    });
    s.on('Security.visibleSecurityStateChanged', (event) =>
      this.events.emit('security', toSecurityState(event.visibleSecurityState)),
    );
    s.on('Inspector.targetCrashed', () => {
      this.logger.warn(`Page crashed: ${this.url}`);
      this.events.emit('crashed');
    });
  }

  // -------------------------------------------------------------------------------------------
  // Rendering
  // -------------------------------------------------------------------------------------------

  /** Sizes the page to the viewport. `zoom` scales CSS pixels like the browser's zoom setting. */
  async setViewport(viewport: Viewport, zoom: number): Promise<void> {
    const changed =
      this.viewport?.width !== viewport.width ||
      this.viewport.height !== viewport.height ||
      this.viewport.dpr !== viewport.dpr ||
      this.zoom !== zoom;
    this.viewport = viewport;
    this.zoom = zoom;
    if (!changed) return;
    await this.applyMetrics();
    if (this.screencast) await this.startScreencast(this.screencast.quality);
  }

  /**
   * Device emulation: a fixed screen size, touch, a mobile user agent, network and CPU
   * throttling and emulated media features. Only what changed is sent to Chromium.
   */
  async setEmulation(emulation: EmulationSettings): Promise<void> {
    const previous = this.emulation;
    this.emulation = emulation;
    const device = emulation.enabled ? emulation.device : undefined;
    const before = previous.enabled ? previous.device : undefined;
    if (JSON.stringify(device) !== JSON.stringify(before)) {
      await this.applyMetrics();
      const touch = device?.touch ?? false;
      await this.send('Emulation.setTouchEmulationEnabled', {
        enabled: touch,
        ...(touch ? { maxTouchPoints: 5 } : {}),
      });
      await this.send('Emulation.setEmitTouchEventsForMouse', {
        enabled: touch,
        configuration: device?.mobile ? 'mobile' : 'desktop',
      });
      const userAgent = device && deviceUserAgent(device.userAgent, this.chromeVersion());
      await this.send('Emulation.setUserAgentOverride', {
        userAgent: userAgent ?? this.engine.userAgent,
        userAgentMetadata: {
          ...this.engine.userAgentMetadata,
          mobile: device?.mobile ?? false,
          ...(device?.userAgent === 'android' ? { platform: 'Android', model: 'Pixel 8' } : {}),
        },
      });
      if (this.screencast) await this.startScreencast(this.screencast.quality);
    }
    const network = emulation.enabled ? emulation.network : 'none';
    if (network !== (previous.enabled ? previous.network : 'none')) {
      const conditions = NETWORK_CONDITIONS[network];
      if (!this.networkEnabled) {
        await this.send('Network.enable');
        this.networkEnabled = true;
      }
      await this.send('Network.emulateNetworkConditions', {
        offline: conditions.offline,
        latency: conditions.latency,
        downloadThroughput: conditions.download,
        uploadThroughput: conditions.upload,
      });
    }
    await this.send('Emulation.setCPUThrottlingRate', {
      rate: emulation.enabled ? emulation.cpu : 1,
    });
    await this.send('Emulation.setEmulatedMedia', {
      media: emulation.enabled && emulation.print ? 'print' : '',
      features: [
        {
          name: 'prefers-color-scheme',
          value:
            emulation.enabled && emulation.colorScheme !== 'default' ? emulation.colorScheme : '',
        },
      ],
    });
  }

  /** The page size: the emulated device, or the browser window's size with page zoom. */
  private async applyMetrics(): Promise<void> {
    const device = this.emulation.enabled ? this.emulation.device : undefined;
    if (device) {
      const landscape = device.width > device.height;
      await this.send('Emulation.setDeviceMetricsOverride', {
        width: device.width,
        height: device.height,
        deviceScaleFactor: device.dpr,
        mobile: device.mobile,
        screenWidth: device.width,
        screenHeight: device.height,
        screenOrientation: landscape
          ? { type: 'landscapePrimary', angle: 90 }
          : { type: 'portraitPrimary', angle: 0 },
      });
      return;
    }
    const viewport = this.viewport;
    if (!viewport) return;
    await this.send('Emulation.setDeviceMetricsOverride', {
      width: Math.max(1, Math.round(viewport.width / this.zoom)),
      height: Math.max(1, Math.round(viewport.height / this.zoom)),
      deviceScaleFactor: viewport.dpr * this.zoom,
      mobile: false,
    });
  }

  private chromeVersion(): string {
    return /Chrome\/([\d.]+)/.exec(this.engine.userAgent)?.[1] ?? '0';
  }

  get screencasting(): boolean {
    return this.screencast !== undefined;
  }

  /** Starts (or restarts) streaming frames at the viewport's device-pixel size. */
  startScreencast(quality: number): Promise<void> {
    // Start and stop requests overlap (resize, emulation, tab switches); Chromium rejects a
    // start while a screencast runs, so they are applied one at a time.
    return this.serializeScreencast(async () => {
      if (!this.viewport) return;
      const restart = this.screencastActive;
      this.screencast = { quality };
      this.clearPendingAck();
      if (restart) await this.send('Page.stopScreencast');
      this.screencastActive = false;
      await this.send('Page.startScreencast', {
        format: 'jpeg',
        quality,
        maxWidth: Math.round(this.viewport.width * this.viewport.dpr),
        maxHeight: Math.round(this.viewport.height * this.viewport.dpr),
        everyNthFrame: 1,
      });
      this.screencastActive = true;
    });
  }

  stopScreencast(): Promise<void> {
    this.screencast = undefined;
    return this.serializeScreencast(async () => {
      if (!this.screencastActive || this.screencast) return;
      this.clearPendingAck();
      this.screencastActive = false;
      await this.send('Page.stopScreencast');
    });
  }

  private serializeScreencast(operation: () => Promise<void>): Promise<void> {
    const result = this.screencastQueue.then(operation, operation);
    this.screencastQueue = result.catch(() => {});
    return result;
  }

  /** Lets Chromium send the next frame. Called once the webview has drawn the current one. */
  ackFrame(): void {
    if (!this.pendingAck) return;
    const { sessionId, timer } = this.pendingAck;
    clearTimeout(timer);
    this.pendingAck = undefined;
    this.fire('Page.screencastFrameAck', { sessionId });
  }

  private onScreencastFrame(event: Protocol.Page.ScreencastFrameEvent): void {
    this.clearPendingAck();
    if (!this.screencast || this.capturing > 0) {
      this.fire('Page.screencastFrameAck', { sessionId: event.sessionId });
      return;
    }
    // If the webview never acks (e.g. it was hidden mid-frame), keep the stream going anyway.
    const timer = setTimeout(() => this.ackFrame(), FRAME_ACK_TIMEOUT_MS);
    this.pendingAck = { sessionId: event.sessionId, timer };
    const buffer = Buffer.from(event.data, 'base64');
    const { metadata } = event;
    this.events.emit('frame', new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength), {
      deviceWidth: metadata.deviceWidth,
      deviceHeight: metadata.deviceHeight,
      pageScaleFactor: metadata.pageScaleFactor,
      offsetTop: metadata.offsetTop,
      scrollOffsetX: metadata.scrollOffsetX,
      scrollOffsetY: metadata.scrollOffsetY,
    });
  }

  private clearPendingAck(): void {
    if (this.pendingAck) clearTimeout(this.pendingAck.timer);
    this.pendingAck = undefined;
  }

  // -------------------------------------------------------------------------------------------
  // Input
  // -------------------------------------------------------------------------------------------

  dispatchMouse(input: MouseInput): void {
    this.lastMouse = { x: input.x, y: input.y };
    this.fire('Input.dispatchMouseEvent', {
      type: input.type,
      x: input.x,
      y: input.y,
      button: input.button,
      buttons: input.buttons,
      clickCount: input.clickCount,
      modifiers: input.modifiers,
      pointerType: 'mouse',
    });
  }

  dispatchWheel(input: WheelInput): void {
    this.fire('Input.dispatchMouseEvent', {
      type: 'mouseWheel',
      x: input.x,
      y: input.y,
      deltaX: input.deltaX,
      deltaY: input.deltaY,
      modifiers: input.modifiers,
      button: 'none',
      pointerType: 'mouse',
    });
  }

  async dispatchKey(input: KeyInput): Promise<void> {
    await this.send('Input.dispatchKeyEvent', toCdpKeyEvent(input, this.options.platform)).catch(
      (error: unknown) => this.logger.debug(`Key event failed: ${errorMessage(error)}`),
    );
  }

  insertText(text: string): void {
    this.fire('Input.insertText', { text });
  }

  /** Pastes text: the page gets a `paste` event first and the text is typed if it ignores it. */
  async paste(text: string): Promise<void> {
    const handled = await this.call<boolean>(PASTE_FUNCTION, text);
    if (!handled) this.insertText(text);
  }

  /** Visible text of the page (`document.body.innerText`), truncated. */
  async pageText(maxLength: number): Promise<string> {
    return (await this.call<string>(PAGE_TEXT_FUNCTION, maxLength)) ?? '';
  }

  /**
   * The first element matching a CSS selector and how many match, or `undefined` if none does.
   * Throws for an invalid selector.
   */
  async querySelector(
    selector: string,
  ): Promise<{ backendNodeId: number; count: number } | undefined> {
    const quoted = JSON.stringify(selector);
    const counted = await this.send('Runtime.evaluate', {
      expression: `document.querySelectorAll(${quoted}).length`,
      returnByValue: true,
    });
    if (counted.exceptionDetails) {
      throw new Error(
        `Invalid selector ${quoted}: ${counted.exceptionDetails.exception?.description?.split('\n')[0] ?? counted.exceptionDetails.text}`,
      );
    }
    const count = Number(counted.result.value) || 0;
    if (!count) return undefined;
    const { result } = await this.send('Runtime.evaluate', {
      expression: `document.querySelector(${quoted})`,
    });
    if (!result.objectId) return undefined;
    try {
      const { node } = await this.send('DOM.describeNode', { objectId: result.objectId });
      return { backendNodeId: node.backendNodeId, count };
    } finally {
      void this.send('Runtime.releaseObject', { objectId: result.objectId }).catch(() => {});
    }
  }

  async selectedText(): Promise<string> {
    return (await this.call<string>(SELECTED_TEXT_FUNCTION)) ?? '';
  }

  /** Runs `document.execCommand` in the focused frame (e.g. `selectAll`, `delete`). */
  async execCommand(command: 'selectAll' | 'delete'): Promise<void> {
    await this.call(EXEC_COMMAND_FUNCTION, command);
  }

  exitFullscreen(): void {
    void this.call(EXIT_FULLSCREEN_FUNCTION);
  }

  // -------------------------------------------------------------------------------------------
  // Navigation
  // -------------------------------------------------------------------------------------------

  async navigate(url: string): Promise<void> {
    const result = await this.send('Page.navigate', { url });
    if (result.errorText && result.errorText !== 'net::ERR_ABORTED') {
      this.logger.info(`Navigation to ${url} failed: ${result.errorText}`);
    }
  }

  async reload(ignoreCache = false): Promise<void> {
    await this.send('Page.reload', { ignoreCache });
  }

  async stop(): Promise<void> {
    await this.send('Page.stopLoading');
  }

  async goBack(): Promise<void> {
    await this.goToOffset(-1);
  }

  async goForward(): Promise<void> {
    await this.goToOffset(1);
  }

  async goToHistoryEntry(entryId: number): Promise<void> {
    await this.send('Page.navigateToHistoryEntry', { entryId });
  }

  /** History entries behind or ahead of the current one, nearest first. */
  async historyEntries(direction: 'back' | 'forward'): Promise<HistoryEntry[]> {
    const { currentIndex, entries } = await this.send('Page.getNavigationHistory');
    const list =
      direction === 'back'
        ? entries.slice(0, currentIndex).reverse()
        : entries.slice(currentIndex + 1);
    return list.slice(0, 20).map((e) => ({ id: e.id, url: e.url, title: e.title || e.url }));
  }

  private async goToOffset(offset: number): Promise<void> {
    const { currentIndex, entries } = await this.send('Page.getNavigationHistory');
    const entry = entries[currentIndex + offset];
    if (entry) await this.send('Page.navigateToHistoryEntry', { entryId: entry.id });
  }

  private async refreshHistory(): Promise<void> {
    try {
      this.historyState = await this.send('Page.getNavigationHistory');
      const { currentIndex, entries } = this.historyState;
      this.events.emit('history', currentIndex > 0, currentIndex < entries.length - 1);
    } catch (error) {
      if (!this.closed) this.logger.debug(`History unavailable: ${errorMessage(error)}`);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Page features
  // -------------------------------------------------------------------------------------------

  async find(
    query: string,
    caseSensitive: boolean,
    direction: 'next' | 'previous' | 'restart',
  ): Promise<{ index: number; count: number }> {
    const result = await this.call<{ index: number; count: number }>(
      FIND_FUNCTION,
      query,
      caseSensitive,
      direction,
    );
    return result ?? { index: 0, count: 0 };
  }

  async stopFind(): Promise<void> {
    await this.call(STOP_FIND_FUNCTION);
  }

  async respondToDialog(accept: boolean, promptText?: string): Promise<void> {
    await this.send('Page.handleJavaScriptDialog', { accept, promptText });
  }

  async setFiles(backendNodeId: number, files: string[]): Promise<void> {
    await this.send('DOM.setFileInputFiles', { backendNodeId, files });
  }

  async printToPdf(): Promise<Buffer> {
    const { data } = await this.send('Page.printToPDF', { printBackground: true });
    return Buffer.from(data, 'base64');
  }

  /** The main document's source (or its rendered HTML if the source is not cached). */
  async pageSource(): Promise<{ content: string; mimeType: string }> {
    const { frameTree } = await this.send('Page.getResourceTree');
    const { mimeType, url } = frameTree.frame;
    try {
      const { content, base64Encoded } = await this.send('Page.getResourceContent', {
        frameId: this.mainFrameId,
        url,
      });
      return {
        content: base64Encoded ? Buffer.from(content, 'base64').toString('utf8') : content,
        mimeType,
      };
    } catch {
      return { content: (await this.call<string>(OUTER_HTML_FUNCTION)) ?? '', mimeType };
    }
  }

  /** Downloads a resource the page uses (e.g. an image), with the page's cookies. */
  async fetchResource(url: string): Promise<Buffer> {
    if (url.startsWith('data:')) return decodeDataUrl(url);
    try {
      const { content, base64Encoded } = await this.send('Page.getResourceContent', {
        frameId: this.mainFrameId,
        url,
      });
      return base64Encoded ? Buffer.from(content, 'base64') : Buffer.from(content, 'utf8');
    } catch {
      // Not in the page's resource cache; load it over the network instead.
    }
    const { resource } = await this.send('Network.loadNetworkResource', {
      frameId: this.mainFrameId,
      url,
      options: { disableCache: false, includeCredentials: true },
    });
    if (!resource.success || !resource.stream) {
      throw new Error(resource.netErrorName ?? `HTTP ${resource.httpStatusCode ?? 'error'}`);
    }
    const chunks: Buffer[] = [];
    try {
      for (;;) {
        const chunk = await this.send('IO.read', { handle: resource.stream });
        chunks.push(Buffer.from(chunk.data, chunk.base64Encoded ? 'base64' : 'utf8'));
        if (chunk.eof) break;
      }
    } finally {
      this.fire('IO.close', { handle: resource.stream });
    }
    return Buffer.concat(chunks);
  }

  // -------------------------------------------------------------------------------------------
  // Developer drawer
  // -------------------------------------------------------------------------------------------

  /** Starts recording network requests (the Network domain costs a little, so only on demand). */
  async startNetworkLog(): Promise<void> {
    if (this.networkLogging) return;
    this.networkLogging = true;
    if (!this.networkEnabled) {
      await this.send('Network.enable');
      this.networkEnabled = true;
    }
  }

  clearDevtools(): void {
    this.console.length = 0;
    this.requests.clear();
    this.events.emit('devtools');
  }

  private addConsole(entry: Omit<ConsoleEntry, 'id' | 'time'>): void {
    this.console.push({ ...entry, id: ++this.consoleId, time: Date.now() });
    if (this.console.length > 500) this.console.splice(0, this.console.length - 500);
    this.events.emit('devtools');
  }

  private trimRequests(): void {
    while (this.requests.size > 300) {
      const oldest = this.requests.keys().next().value;
      if (oldest === undefined) break;
      this.requests.delete(oldest);
    }
  }

  // -------------------------------------------------------------------------------------------
  // Element picker
  // -------------------------------------------------------------------------------------------

  private async enableInspector(): Promise<void> {
    if (this.inspectorEnabled) return;
    await this.send('DOM.enable');
    await this.send('Overlay.enable');
    this.inspectorEnabled = true;
  }

  /** The element at a point in the viewport (CSS pixels), or undefined. */
  async nodeAt(x: number, y: number): Promise<number | undefined> {
    await this.enableInspector();
    try {
      const { backendNodeId } = await this.send('DOM.getNodeForLocation', {
        x: Math.round(x),
        y: Math.round(y),
        includeUserAgentShadowDOM: false,
        ignorePointerEventsNone: true,
      });
      return this.elementOf(backendNodeId);
    } catch {
      return undefined;
    }
  }

  /** Text nodes are reported for text under the pointer; use their element instead. */
  private async elementOf(backendNodeId: number): Promise<number | undefined> {
    const { node } = await this.send('DOM.describeNode', { backendNodeId });
    if (node.nodeType === 1) return backendNodeId;
    const parent = await this.relative(backendNodeId, PARENT_FUNCTION);
    return parent;
  }

  /** Highlights an element like Chrome's inspector: box model plus Chrome's info tooltip. */
  async highlight(backendNodeId: number): Promise<void> {
    await this.enableInspector();
    await this.send('Overlay.highlightNode', { backendNodeId, highlightConfig: INSPECT_HIGHLIGHT });
  }

  /**
   * Chrome's own inspect mode (as in DevTools): Chromium highlights the element under the mouse
   * and shows its tooltip, so the webview only forwards ordinary mouse moves.
   */
  async startInspect(): Promise<void> {
    await this.enableInspector();
    this.inspecting = true;
    // Mouse input has to stay mouse input while inspecting; touch emulation would turn it into taps.
    if (this.emulation.enabled && this.emulation.device?.touch) {
      await this.send('Emulation.setEmitTouchEventsForMouse', { enabled: false });
    }
    await this.setInspectMode(true);
  }

  async stopInspect(): Promise<void> {
    if (!this.inspecting) return;
    this.inspecting = false;
    this.inspectWaiter = undefined;
    await this.setInspectMode(false);
    await this.hideHighlight();
    const device = this.emulation.enabled ? this.emulation.device : undefined;
    if (device?.touch) {
      await this.send('Emulation.setEmitTouchEventsForMouse', {
        enabled: true,
        configuration: device.mobile ? 'mobile' : 'desktop',
      });
    }
  }

  private async setInspectMode(on: boolean): Promise<void> {
    await this.send('Overlay.setInspectMode', {
      mode: on ? 'searchForNode' : 'none',
      highlightConfig: on ? INSPECT_HIGHLIGHT : {},
    }).catch((error: unknown) => {
      if (!this.closed) this.logger.debug(`Inspect mode failed: ${errorMessage(error)}`);
    });
  }

  /**
   * Clicks at a point in inspect mode and returns the element Chrome picked: exactly the one it
   * was highlighting. The click is not delivered to the page.
   */
  async inspectAt(x: number, y: number): Promise<number | undefined> {
    if (!this.inspecting) await this.startInspect();
    const picked = new Promise<number | undefined>((resolve) => {
      const timer = setTimeout(() => {
        this.inspectWaiter = undefined;
        resolve(undefined);
      }, 1500);
      this.inspectWaiter = (backendNodeId) => {
        clearTimeout(timer);
        resolve(backendNodeId);
      };
    });
    this.lastMouse = { x, y };
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased'] as const) {
      await this.send('Input.dispatchMouseEvent', {
        type,
        x,
        y,
        button: type === 'mouseMoved' ? 'none' : 'left',
        buttons: type === 'mousePressed' ? 1 : 0,
        clickCount: type === 'mouseMoved' ? 0 : 1,
        pointerType: 'mouse',
      });
    }
    const node = (await picked) ?? (await this.nodeAt(x, y));
    // Chrome leaves inspect mode after a pick; stay in it for the next one (or Shift+click).
    if (this.inspecting) await this.setInspectMode(true);
    return node === undefined ? undefined : this.elementOf(node).catch(() => node);
  }

  async hideHighlight(): Promise<void> {
    if (!this.inspectorEnabled) return;
    await this.send('Overlay.hideHighlight').catch(() => {});
  }

  async parentOf(backendNodeId: number): Promise<number | undefined> {
    return this.relative(backendNodeId, PARENT_FUNCTION);
  }

  async firstChildOf(backendNodeId: number): Promise<number | undefined> {
    return this.relative(backendNodeId, FIRST_CHILD_FUNCTION);
  }

  private async relative(backendNodeId: number, fn: string): Promise<number | undefined> {
    try {
      const { object } = await this.send('DOM.resolveNode', { backendNodeId });
      const { result } = await this.send('Runtime.callFunctionOn', {
        objectId: object.objectId,
        functionDeclaration: fn,
      });
      if (!result.objectId) return undefined;
      const { node } = await this.send('DOM.describeNode', { objectId: result.objectId });
      void this.send('Runtime.releaseObject', { objectId: result.objectId }).catch(() => {});
      return node.backendNodeId;
    } catch {
      return undefined;
    }
  }

  /** Everything the element picker shows and copies about an element. */
  async elementDetails(
    backendNodeId: number,
    maxHtml: number,
  ): Promise<
    (ElementDetails & { ancestry: string[]; scroll: { x: number; y: number } }) | undefined
  > {
    try {
      const { object } = await this.send('DOM.resolveNode', { backendNodeId });
      const call = (functionDeclaration: string, args: unknown[] = []) =>
        this.send('Runtime.callFunctionOn', {
          objectId: object.objectId,
          functionDeclaration,
          arguments: args.map((value) => ({ value })),
          returnByValue: true,
        });
      const [details, ancestry, ax] = await Promise.all([
        call(COLLECT_DETAILS_FUNCTION, [maxHtml]),
        call(ANCESTRY_FUNCTION),
        this.send('Accessibility.getPartialAXTree', { backendNodeId, fetchRelatives: false }).catch(
          () => undefined,
        ),
      ]);
      void this.send('Runtime.releaseObject', { objectId: object.objectId! }).catch(() => {});
      if (details.exceptionDetails) {
        this.logger.debug(
          `Element details failed: ${details.exceptionDetails.exception?.description}`,
        );
        return undefined;
      }
      const axNode = ax?.nodes.find((n) => n.backendDOMNodeId === backendNodeId) ?? ax?.nodes[0];
      const role = axNode?.role?.value as string | undefined;
      const name = axNode?.name?.value as string | undefined;
      return {
        ...(details.result.value as ElementDetails & { scroll: { x: number; y: number } }),
        role: role && role !== 'generic' && role !== 'none' ? role : undefined,
        name: name || undefined,
        ancestry: (ancestry.result.value as string[] | undefined) ?? [],
      };
    } catch (error) {
      this.logger.debug(`Element details failed: ${errorMessage(error)}`);
      return undefined;
    }
  }

  // -------------------------------------------------------------------------------------------
  // Screenshots
  // -------------------------------------------------------------------------------------------

  /**
   * Captures the page as an image. `rect` is in document CSS pixels for `region`. Very tall full
   * pages are scaled down to stay within Chromium's 16,384-pixel texture limit.
   */
  async screenshot(
    mode: 'viewport' | 'fullPage' | 'region' | 'element',
    options: {
      format: 'png' | 'jpeg' | 'webp';
      rect?: { x: number; y: number; width: number; height: number };
      backendNodeId?: number;
    },
  ): Promise<Buffer> {
    await this.hideHighlight();
    const format = options.format;
    const quality = format === 'png' ? undefined : 90;
    if (mode === 'viewport') {
      const { data } = await this.send('Page.captureScreenshot', {
        format,
        quality,
        fromSurface: true,
      });
      return Buffer.from(data, 'base64');
    }
    const metrics = await this.send('Page.getLayoutMetrics');
    let clip: { x: number; y: number; width: number; height: number };
    let scale = 1;
    if (mode === 'fullPage') {
      const { width, height } = metrics.cssContentSize;
      const dpr = (await this.call<number>('() => devicePixelRatio')) ?? 1;
      scale = Math.min(1, 16_384 / (height * dpr), 16_384 / (width * dpr));
      clip = { x: 0, y: 0, width, height };
    } else if (mode === 'element') {
      if (options.backendNodeId === undefined) throw new Error('No element to capture');
      await this.send('DOM.scrollIntoViewIfNeeded', { backendNodeId: options.backendNodeId }).catch(
        () => {},
      );
      const { model } = await this.send('DOM.getBoxModel', {
        backendNodeId: options.backendNodeId,
      });
      const xs = model.border.filter((_, i) => i % 2 === 0);
      const ys = model.border.filter((_, i) => i % 2 === 1);
      // Box model quads are in viewport coordinates; the clip is in document coordinates.
      const after = await this.send('Page.getLayoutMetrics');
      clip = {
        x: Math.min(...xs) + after.cssVisualViewport.pageX,
        y: Math.min(...ys) + after.cssVisualViewport.pageY,
        width: Math.max(...xs) - Math.min(...xs),
        height: Math.max(...ys) - Math.min(...ys),
      };
    } else {
      if (!options.rect) throw new Error('No region to capture');
      clip = options.rect;
    }
    const { width: pageWidth, height: pageHeight } = metrics.cssContentSize;
    const x = Math.max(0, clip.x);
    const y = Math.max(0, clip.y);
    const bounded = {
      x,
      y,
      width: Math.max(
        1,
        Math.min(
          clip.width - (x - clip.x),
          Math.max(pageWidth, metrics.cssVisualViewport.clientWidth) - x,
        ),
      ),
      height: Math.max(
        1,
        Math.min(
          clip.height - (y - clip.y),
          Math.max(pageHeight, metrics.cssVisualViewport.clientHeight) - y,
        ),
      ),
      scale,
    };
    this.capturing++;
    try {
      const { data } = await this.send('Page.captureScreenshot', {
        format,
        quality,
        clip: bounded,
        captureBeyondViewport: true,
      });
      return Buffer.from(data, 'base64');
    } finally {
      // Frames rendered during the capture can still arrive just after it.
      setTimeout(() => this.capturing--, 200);
    }
  }

  /** Size of the page's content (CSS pixels), for sizing extension popups. */
  async contentSize(): Promise<{ width: number; height: number }> {
    const size = await this.call<[number, number]>(
      `() => { const e = document.documentElement, b = document.body || e; return [Math.ceil(Math.max(e.scrollWidth, b.scrollWidth)), Math.ceil(Math.max(e.scrollHeight, b.scrollHeight))]; }`,
    );
    return { width: size?.[0] ?? 360, height: size?.[1] ?? 480 };
  }

  /** Scroll position, visible size and full size of the page (CSS pixels). */
  async layout(): Promise<{
    scrollX: number;
    scrollY: number;
    width: number;
    height: number;
    contentWidth: number;
    contentHeight: number;
  }> {
    const metrics = await this.send('Page.getLayoutMetrics');
    return {
      scrollX: metrics.cssVisualViewport.pageX,
      scrollY: metrics.cssVisualViewport.pageY,
      width: metrics.cssVisualViewport.clientWidth,
      height: metrics.cssVisualViewport.clientHeight,
      contentWidth: metrics.cssContentSize.width,
      contentHeight: metrics.cssContentSize.height,
    };
  }

  /** Scroll position of the page (document CSS pixels). */
  async scrollOffset(): Promise<{ x: number; y: number }> {
    const metrics = await this.send('Page.getLayoutMetrics');
    return { x: metrics.cssVisualViewport.pageX, y: metrics.cssVisualViewport.pageY };
  }

  // -------------------------------------------------------------------------------------------
  // Lifecycle
  // -------------------------------------------------------------------------------------------

  /**
   * Closes the page like the user closing a tab: `beforeunload` handlers run and may show a
   * dialog, in which case the page stays open until the user answers.
   */
  async close(): Promise<void> {
    if (this.closed) return;
    await Promise.race([this.send('Page.close').catch(() => {}), delay(1_000)]);
    const deadline = Date.now() + 1_500;
    while (!this.closed && !this.dialogOpen && Date.now() < deadline) await delay(50);
    if (!this.closed && !this.dialogOpen)
      await this.engine.closeTarget(this.targetId).catch(() => {});
  }

  /** Closes the page immediately to free memory. The tab keeps its URL and can reload it. */
  async discard(): Promise<void> {
    this.dispose();
    await this.engine.closeTarget(this.targetId).catch(() => {});
  }

  /** Stops emitting events. */
  dispose(): void {
    this.closed = true;
    this.clearPendingAck();
    this.removeEngineListeners();
    this.events.removeAllListeners();
  }

  private onClosed(reason: CloseReason): void {
    if (this.closed) return;
    this.closed = true;
    this.clearPendingAck();
    this.removeEngineListeners();
    this.events.emit('closed', reason);
    this.events.removeAllListeners();
  }

  // -------------------------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------------------------

  /** Calls a page-script function (a source string) in the main frame with JSON arguments. */
  private async call<T>(fn: string, ...args: unknown[]): Promise<T | undefined> {
    try {
      const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
        expression: `(${fn})(${args.map((a) => JSON.stringify(a)).join(', ')})`,
        returnByValue: true,
        awaitPromise: true,
      });
      if (exceptionDetails) {
        this.logger.debug(
          `Page script failed: ${exceptionDetails.exception?.description ?? exceptionDetails.text}`,
        );
        return undefined;
      }
      return result.value as T;
    } catch (error) {
      if (!this.closed) this.logger.debug(`Page script failed: ${errorMessage(error)}`);
      return undefined;
    }
  }

  /** `Target.targetInfoChanged` misses the title set while parsing, so re-read it after loads. */
  private async refreshInfo(): Promise<void> {
    try {
      const info = await this.engine.targetInfo(this.targetId);
      if (info.url === this.url && info.title === this.title) return;
      this.url = info.url;
      this.title = info.title;
      this.events.emit('info', info.url, info.title);
    } catch (error) {
      if (!this.closed) this.logger.debug(`Target info unavailable: ${errorMessage(error)}`);
    }
  }

  private async refreshFavicon(): Promise<void> {
    const url = await this.call<string>(FAVICON_FUNCTION);
    const safe =
      typeof url === 'string' && /^(https?:|data:image\/)/i.test(url) && url.length < 100_000;
    this.events.emit('favicon', safe ? url : undefined);
  }

  private async onFileChooser(event: Protocol.Page.FileChooserOpenedEvent): Promise<void> {
    if (event.backendNodeId === undefined) return;
    let accept: string[] = [];
    try {
      const { node } = await this.send('DOM.describeNode', { backendNodeId: event.backendNodeId });
      const attributes = node.attributes ?? [];
      const index = attributes.indexOf('accept');
      if (index !== -1 && index % 2 === 0) {
        accept = (attributes[index + 1] ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
    } catch {
      // Without the accept attribute every file type is offered.
    }
    this.events.emit('fileChooser', {
      backendNodeId: event.backendNodeId,
      multiple: event.mode === 'selectMultiple',
      accept,
    });
  }

  /** Handles a message from the page script. The page can forge these, so validate everything. */
  private onPageMessage(payload: string): void {
    let message: Record<string, unknown>;
    try {
      message = JSON.parse(payload) as Record<string, unknown>;
    } catch {
      return;
    }
    switch (message.kind) {
      case 'cursor': {
        const cursor = typeof message.cursor === 'string' ? message.cursor : '';
        this.events.emit('cursor', /^[a-z-]{1,32}$/.test(cursor) ? cursor : 'default');
        break;
      }
      case 'contextmenu':
        this.events.emit('contextMenu', sanitizeContext(message));
        break;
      case 'fullscreen':
        this.events.emit('fullscreen', message.active === true);
        break;
      case 'audible':
        this.events.emit('audible', message.audible === true);
        break;
    }
  }
}

function toSecurityState(state: Protocol.Security.VisibleSecurityState): SecurityState {
  switch (state.securityState) {
    case 'secure':
      return 'secure';
    case 'insecure':
    case 'insecure-broken':
      return 'insecure';
    case 'neutral':
    case 'info':
      return 'neutral';
    default:
      return 'unknown';
  }
}

function sanitizeString(value: unknown, maxLength: number): string | undefined {
  return typeof value === 'string' && value ? value.slice(0, maxLength) : undefined;
}

function sanitizeUrl(value: unknown, maxLength = 8_192): string | undefined {
  if (typeof value !== 'string' || value.length > maxLength) return undefined;
  return /^(https?|file|data|blob|about|ftp):/i.test(value) ? value : undefined;
}

export function sanitizeContext(message: Record<string, unknown>): PageContext {
  const mediaType =
    message.mediaType === 'img' || message.mediaType === 'video' || message.mediaType === 'audio'
      ? message.mediaType
      : undefined;
  return {
    linkUrl: sanitizeUrl(message.linkUrl),
    linkText: sanitizeString(message.linkText, 200),
    mediaType,
    srcUrl: mediaType ? sanitizeUrl(message.srcUrl, MAX_DATA_URL_LENGTH) : undefined,
    selectionText: sanitizeString(message.selectionText, 20_000),
    editable: message.editable === true,
    frameUrl: sanitizeUrl(message.frameUrl),
  };
}

export function decodeDataUrl(url: string): Buffer {
  const comma = url.indexOf(',');
  if (!url.startsWith('data:') || comma === -1) throw new Error('Invalid data URL');
  const header = url.slice(5, comma);
  const body = url.slice(comma + 1);
  return header.endsWith(';base64')
    ? Buffer.from(body, 'base64')
    : Buffer.from(decodeURIComponent(body), 'utf8');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Box-model colors and tooltip of Chrome DevTools' element inspector. */
const INSPECT_HIGHLIGHT: Protocol.Overlay.HighlightConfig = {
  showInfo: true,
  showStyles: true,
  showAccessibilityInfo: true,
  showExtensionLines: false,
  contentColor: { r: 111, g: 168, b: 220, a: 0.66 },
  paddingColor: { r: 147, g: 196, b: 125, a: 0.55 },
  borderColor: { r: 255, g: 229, b: 153, a: 0.66 },
  marginColor: { r: 246, g: 178, b: 107, a: 0.66 },
  colorFormat: 'hex',
  contrastAlgorithm: 'aa',
};
