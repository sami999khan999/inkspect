import { EventEmitter } from 'node:events';
import { mkdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import type { Protocol } from 'devtools-protocol';
import puppeteer, { type Browser, type CDPSession } from 'puppeteer-core';
import { errorMessage, type Logger } from './logger';
import { cleanUserAgent, userAgentMetadata } from './userAgent';

export interface EngineOptions {
  executablePath: string;
  userDataDir: string;
  downloadsDir: string;
  extraArgs?: readonly string[];
  /** Accept self-signed certificates on localhost (`--allow-insecure-localhost`). */
  allowInsecureLocalhost?: boolean;
  /**
   * Also open a localhost debugging port (random) so Chrome's DevTools frontend can connect.
   * Control stays on the pipe.
   */
  debuggingPort?: boolean;
  logger: Logger;
}

export interface EngineEvents {
  /** A page the engine did not create itself: `window.open`, `target=_blank`, extensions. */
  pageOpened: [info: Protocol.Target.TargetInfo];
  targetInfoChanged: [info: Protocol.Target.TargetInfo];
  targetDestroyed: [targetId: string];
  downloadWillBegin: [event: Protocol.Browser.DownloadWillBeginEvent];
  downloadProgress: [event: Protocol.Browser.DownloadProgressEvent];
  /** The browser process exited or the connection was lost. `expected` is true after `close()`. */
  disconnected: [expected: boolean];
}

/**
 * Owns one headless Chromium process. Pages are created with `createPage()` and controlled
 * through their own CDP sessions (see `TabSession`); this class handles the browser-wide parts.
 */
export class BrowserEngine {
  readonly events = new EventEmitter<EngineEvents>();
  readonly userAgent: string;
  readonly userAgentMetadata: Protocol.Emulation.UserAgentMetadata;
  /** Localhost port serving the DevTools frontend, when enabled. */
  debuggingPort?: number;

  /** Pages created by `createPage()` or already reported through `pageOpened`. */
  private readonly knownTargets = new Set<string>();
  private readonly pendingCreates = new Set<Promise<unknown>>();
  /** Private browser contexts (see `createBrowserContext`). */
  private readonly contexts = new Set<string>();
  private downloadsDir?: string;
  private shuttingDown = false;

  static async launch(options: EngineOptions): Promise<BrowserEngine> {
    const args = [
      // The initial window size only matters until each page gets a device metrics override.
      '--window-size=1280,800',
      // Headless screencast frames are capped at the window's own scale factor (1), whatever
      // `deviceScaleFactor` a page emulates, so HiDPI displays got CSS-pixel frames stretched up
      // (blurry). A higher cap lets frames reach the emulated scale; `maxWidth`/`maxHeight` of
      // the screencast still size each frame to exactly what the webview needs.
      '--force-device-scale-factor=3',
      ...(options.allowInsecureLocalhost ? ['--allow-insecure-localhost'] : []),
      // Puppeteer adds `--remote-debugging-pipe` itself unless another `--remote-debugging-*`
      // switch is present, so both are passed when the port is wanted.
      ...(options.debuggingPort ? ['--remote-debugging-pipe', '--remote-debugging-port=0'] : []),
      ...(options.extraArgs ?? []),
    ];
    options.logger.info(`Launching ${options.executablePath}`);
    const portFile = join(options.userDataDir, 'DevToolsActivePort');
    rmSync(portFile, { force: true });
    const browser = await puppeteer.launch({
      executablePath: options.executablePath,
      userDataDir: options.userDataDir,
      headless: true,
      pipe: true,
      enableExtensions: true,
      defaultViewport: null,
      // Keep scrollbars, audio and the normal popup blocker, like a regular browser.
      ignoreDefaultArgs: ['--hide-scrollbars', '--mute-audio', '--disable-popup-blocking'],
      args,
      handleSIGINT: false,
      handleSIGTERM: false,
      handleSIGHUP: false,
      timeout: 60_000,
      protocolTimeout: 60_000,
    });
    try {
      const session = await browser.target().createCDPSession();
      const userAgent = cleanUserAgent(await browser.userAgent());
      const engine = new BrowserEngine(browser, session, userAgent, options.logger);
      if (options.debuggingPort) {
        try {
          engine.debuggingPort = Number(readFileSync(portFile, 'utf8').split('\n')[0]) || undefined;
        } catch {
          options.logger.warn('The DevTools debugging port is not available.');
        }
      }
      await engine.initialize(options.downloadsDir);
      options.logger.info(`Browser started: ${await browser.version()}`);
      return engine;
    } catch (error) {
      await browser.close().catch(() => {});
      throw error;
    }
  }

  private constructor(
    private readonly browser: Browser,
    private readonly session: CDPSession,
    userAgent: string,
    private readonly logger: Logger,
  ) {
    this.userAgent = userAgent;
    this.userAgentMetadata = userAgentMetadata(userAgent, process.platform, process.arch);
  }

  version(): Promise<string> {
    return this.browser.version();
  }

  get connected(): boolean {
    return this.browser.connected;
  }

  /** True once `close()` or `kill()` was called; pages closing after that are not user actions. */
  get closing(): boolean {
    return this.shuttingDown;
  }

  private async initialize(downloadsDir: string): Promise<void> {
    // Pages that exist before discovery (Puppeteer's initial about:blank) are never shown. That
    // page also keeps the browser alive when the user closes every tab.
    const { targetInfos } = await this.session.send('Target.getTargets');
    for (const info of targetInfos) this.knownTargets.add(info.targetId);

    this.session.on('Target.targetCreated', (event) => void this.onTargetCreated(event.targetInfo));
    this.session.on('Target.targetInfoChanged', (event) =>
      this.events.emit('targetInfoChanged', event.targetInfo),
    );
    this.session.on('Target.targetDestroyed', (event) => {
      this.knownTargets.delete(event.targetId);
      this.events.emit('targetDestroyed', event.targetId);
    });
    this.session.on('Browser.downloadWillBegin', (event) =>
      this.events.emit('downloadWillBegin', event),
    );
    this.session.on('Browser.downloadProgress', (event) =>
      this.events.emit('downloadProgress', event),
    );
    this.browser.on('disconnected', () => {
      this.logger.info(this.shuttingDown ? 'Browser closed' : 'Browser disconnected unexpectedly');
      this.events.emit('disconnected', this.shuttingDown);
    });

    await this.session.send('Target.setDiscoverTargets', { discover: true });
    await this.setDownloadsDir(downloadsDir);
  }

  private async onTargetCreated(info: Protocol.Target.TargetInfo): Promise<void> {
    if (info.type !== 'page') return;
    // `Target.targetCreated` can arrive before the `Target.createTarget` response, so wait for
    // in-flight creations before deciding whether this page is new to us.
    if (this.pendingCreates.size) await Promise.allSettled([...this.pendingCreates]);
    if (this.knownTargets.has(info.targetId)) return;
    this.knownTargets.add(info.targetId);
    this.events.emit('pageOpened', info);
  }

  /**
   * Creates a blank page in its own window (so every tab can render at the same time). Pages in a
   * `browserContextId` share cookies and storage only with each other (private tabs).
   */
  async createPage(browserContextId?: string): Promise<string> {
    const request = this.session.send('Target.createTarget', {
      url: 'about:blank',
      newWindow: true,
      browserContextId,
    });
    this.pendingCreates.add(request);
    try {
      const { targetId } = await request;
      this.knownTargets.add(targetId);
      return targetId;
    } finally {
      this.pendingCreates.delete(request);
    }
  }

  /** Opens a dedicated CDP session for a page. */
  async attach(targetId: string): Promise<CDPSession> {
    const { sessionId } = await this.session.send('Target.attachToTarget', {
      targetId,
      flatten: true,
    });
    const session = this.session.connection()?.session(sessionId);
    if (!session) throw new Error(`No CDP session for target ${targetId}`);
    return session;
  }

  async targetInfo(targetId: string): Promise<Protocol.Target.TargetInfo> {
    const { targetInfo } = await this.session.send('Target.getTargetInfo', { targetId });
    return targetInfo;
  }

  /** Makes the page the foreground tab of its window, so it renders and can be screencast. */
  async activateTarget(targetId: string): Promise<void> {
    await this.session.send('Target.activateTarget', { targetId });
  }

  /** Closes a page without running `beforeunload` handlers. */
  async closeTarget(targetId: string): Promise<void> {
    await this.session.send('Target.closeTarget', { targetId });
  }

  /** Loads an unpacked extension (CDP `Extensions.loadUnpacked`). Returns its id. */
  installExtension(path: string): Promise<string> {
    return this.browser.installExtension(path);
  }

  uninstallExtension(id: string): Promise<void> {
    return this.browser.uninstallExtension(id);
  }

  async setDownloadsDir(downloadsDir: string): Promise<void> {
    mkdirSync(downloadsDir, { recursive: true });
    this.downloadsDir = downloadsDir;
    for (const browserContextId of [undefined, ...this.contexts]) {
      await this.applyDownloadBehavior(browserContextId);
    }
  }

  /** Files are saved as `<downloadsDir>/<guid>` and renamed when complete (see DownloadsManager). */
  private async applyDownloadBehavior(browserContextId?: string): Promise<void> {
    if (!this.downloadsDir) return;
    await this.session.send('Browser.setDownloadBehavior', {
      behavior: 'allowAndName',
      downloadPath: this.downloadsDir,
      eventsEnabled: true,
      browserContextId,
    });
  }

  /** A fresh, isolated profile (like an incognito window). Nothing in it is saved to disk. */
  async createBrowserContext(): Promise<string> {
    const { browserContextId } = await this.session.send('Target.createBrowserContext', {});
    this.contexts.add(browserContextId);
    await this.applyDownloadBehavior(browserContextId);
    return browserContextId;
  }

  /** Closes every page in the context and deletes its cookies and storage. */
  async disposeBrowserContext(browserContextId: string): Promise<void> {
    this.contexts.delete(browserContextId);
    await this.session.send('Target.disposeBrowserContext', { browserContextId });
  }

  /** Deletes all cookies of the regular profile. */
  async clearCookies(): Promise<void> {
    await this.session.send('Storage.clearCookies', {});
  }

  /** Deletes local storage, IndexedDB, caches, service workers and so on for these origins. */
  async clearSiteData(origins: Iterable<string>): Promise<void> {
    for (const origin of origins) {
      await this.session
        .send('Storage.clearDataForOrigin', { origin, storageTypes: 'all' })
        .catch(() => {});
    }
  }

  /** Empties the HTTP cache (this needs a page session, so a temporary page is used). */
  async clearCache(): Promise<void> {
    const targetId = await this.createPage();
    try {
      const page = await this.attach(targetId);
      await page.send('Network.clearBrowserCache');
    } finally {
      await this.closeTarget(targetId).catch(() => {});
    }
  }

  async cancelDownload(guid: string): Promise<void> {
    await this.session.send('Browser.cancelDownload', { guid });
  }

  /** Kills the browser process immediately (for when the extension host is shutting down). */
  /** Kills the process as if it had crashed (tests of crash recovery). */
  simulateCrash(): void {
    this.browser.process()?.kill();
  }

  kill(): void {
    this.shuttingDown = true;
    this.browser.process()?.kill();
  }

  async close(): Promise<void> {
    if (this.shuttingDown) return;
    this.shuttingDown = true;
    const process = this.browser.process();
    const timeout = setTimeout(() => process?.kill(), 5_000);
    try {
      await this.browser.close();
    } catch (error) {
      this.logger.warn(`Closing the browser failed: ${errorMessage(error)}`);
      process?.kill();
    } finally {
      clearTimeout(timeout);
    }
  }
}
