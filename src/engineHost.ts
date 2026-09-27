import { join } from 'node:path';
import type { Protocol } from 'devtools-protocol';
import * as vscode from 'vscode';
import { BrowserEngine } from './browser/BrowserEngine';
import { chromiumCacheDir, resolveChromium } from './browser/chromium';
import { errorMessage } from './browser/logger';
import { getConfig } from './config';
import type { DownloadsManager } from './features/downloads';
import type { EngineState } from './shared/protocol';

/** How long the browser keeps running after the last browser panel closes. */
const IDLE_SHUTDOWN_MS = 60_000;

export interface PageOpenedEvent {
  engine: BrowserEngine;
  info: Protocol.Target.TargetInfo;
}

/**
 * Starts the browser engine on demand (downloading Chromium the first time), shares it between
 * all browser panels, and shuts it down when no panel has used it for a while.
 */
export class EngineHost implements vscode.Disposable {
  private engine?: BrowserEngine;
  private starting?: Promise<BrowserEngine>;
  private lastAutoRestart = 0;
  private state: EngineState = { status: 'stopped' };
  private users = 0;
  private idleTimer?: NodeJS.Timeout;
  /** Runs after the browser starts and before pages are created (e.g. loading extensions). */
  private launchHook?: (engine: BrowserEngine) => Promise<void>;
  /** Browser context shared by all private tabs (created on first use). */
  private privateContextId?: Promise<string>;

  private readonly onDidChangeStateEmitter = new vscode.EventEmitter<EngineState>();
  readonly onDidChangeState = this.onDidChangeStateEmitter.event;
  private readonly onDidStartEmitter = new vscode.EventEmitter<BrowserEngine>();
  /** Fires after every (re)start, so panels can recreate their pages. */
  readonly onDidStart = this.onDidStartEmitter.event;
  private readonly onPageOpenedEmitter = new vscode.EventEmitter<PageOpenedEvent>();
  readonly onPageOpened = this.onPageOpenedEmitter.event;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly downloads: DownloadsManager,
    private readonly logger: vscode.LogOutputChannel,
  ) {}

  get current(): BrowserEngine | undefined {
    return this.engine;
  }

  getState(): EngineState {
    return this.state;
  }

  /** Returns the running engine, starting it if needed. */
  start(): Promise<BrowserEngine> {
    if (this.engine) return Promise.resolve(this.engine);
    this.starting ??= this.launch().finally(() => {
      this.starting = undefined;
    });
    return this.starting;
  }

  /** Keeps the engine alive until the returned disposable is disposed. */
  retain(): vscode.Disposable {
    this.users++;
    clearTimeout(this.idleTimer);
    let released = false;
    return new vscode.Disposable(() => {
      if (released) return;
      released = true;
      if (--this.users === 0) {
        this.idleTimer = setTimeout(() => void this.stop(), IDLE_SHUTDOWN_MS);
      }
    });
  }

  setLaunchHook(hook: (engine: BrowserEngine) => Promise<void>): void {
    this.launchHook = hook;
  }

  /** The browser context for private tabs, created on first use. */
  privateContext(): Promise<string> {
    this.privateContextId ??= this.start().then((engine) => engine.createBrowserContext());
    this.privateContextId.catch(() => {
      this.privateContextId = undefined;
    });
    return this.privateContextId;
  }

  /** Deletes the private context and everything in it. */
  async releasePrivateContext(): Promise<void> {
    const pending = this.privateContextId;
    this.privateContextId = undefined;
    const id = await pending?.catch(() => undefined);
    if (id) await this.engine?.disposeBrowserContext(id).catch(() => {});
  }

  async restart(): Promise<BrowserEngine> {
    await this.stop();
    return this.start();
  }

  async stop(): Promise<void> {
    clearTimeout(this.idleTimer);
    const engine = this.engine ?? (await this.starting?.catch(() => undefined));
    this.engine = undefined;
    this.privateContextId = undefined;
    if (engine) await engine.close();
    this.setState({ status: 'stopped' });
  }

  dispose(): void {
    clearTimeout(this.idleTimer);
    // Synchronous: the extension host may exit before an async close would finish.
    this.engine?.kill();
    this.engine = undefined;
    this.onDidChangeStateEmitter.dispose();
    this.onDidStartEmitter.dispose();
    this.onPageOpenedEmitter.dispose();
  }

  private async launch(): Promise<BrowserEngine> {
    const config = getConfig();
    const storage = this.context.globalStorageUri.fsPath;
    this.setState({ status: 'starting', message: 'Starting browser engine...' });
    const download = new DownloadProgress();
    try {
      const executablePath = await resolveChromium({
        cacheDir: chromiumCacheDir(storage),
        executablePath: config.chromiumExecutablePath || undefined,
        proxy: vscode.workspace.getConfiguration('http').get<string>('proxy') || undefined,
        logger: this.logger,
        onDownloadProgress: (received, total) => {
          download.report(received, total);
          this.setState({
            status: 'downloading',
            progress: total ? received / total : undefined,
            message: `Downloading Chromium (${Math.round(total / 1_000_000)} MB, first run only)`,
          });
        },
      });
      download.done();
      this.setState({ status: 'starting', message: 'Starting browser engine...' });

      const engine = await BrowserEngine.launch({
        executablePath,
        userDataDir: join(storage, 'profile'),
        downloadsDir: this.downloads.directory,
        extraArgs: config.chromiumExtraArgs,
        allowInsecureLocalhost: config.ignoreLocalhostCertificateErrors,
        debuggingPort: config.devtoolsEnabled,
        logger: this.logger,
      });
      engine.events.on('disconnected', (expected) => {
        if (this.engine !== engine) return;
        this.engine = undefined;
        this.privateContextId = undefined;
        if (expected) return;
        this.logger.error('The browser engine stopped unexpectedly.');
        // Restart once by itself (tabs reload); a second crash within a minute stays on the
        // "crashed" screen with its Restart button, so a crash loop cannot spin.
        if (Date.now() - this.lastAutoRestart > 60_000) {
          this.lastAutoRestart = Date.now();
          this.setState({
            status: 'starting',
            message: 'The browser engine crashed. Restarting...',
          });
          void this.start().catch(() => {});
          return;
        }
        this.setState({ status: 'crashed', message: 'The browser engine stopped unexpectedly.' });
      });
      engine.events.on('pageOpened', (info) => this.onPageOpenedEmitter.fire({ engine, info }));
      this.downloads.attach(engine);
      await this.launchHook?.(engine).catch((error: unknown) => {
        this.logger.warn(`Startup hook failed: ${errorMessage(error)}`);
      });
      this.engine = engine;
      this.setState({ status: 'running' });
      this.onDidStartEmitter.fire(engine);
      return engine;
    } catch (error) {
      download.done();
      const message = errorMessage(error);
      this.logger.error(`Browser engine failed to start: ${message}`);
      this.setState({ status: 'error', message });
      throw error;
    }
  }

  private setState(state: EngineState): void {
    this.state = state;
    this.onDidChangeStateEmitter.fire(state);
  }
}

/** Shows a notification with progress while Chromium downloads (only when a download happens). */
class DownloadProgress {
  private started = false;
  private update?: (percent: number) => void;
  private finish?: () => void;
  private reported = 0;

  report(received: number, total: number): void {
    if (!this.started) {
      this.started = true;
      void vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `VS Code Browser: downloading Chromium (${Math.round(total / 1_000_000)} MB, first run only)`,
        },
        (progress) =>
          new Promise<void>((resolve) => {
            this.finish = resolve;
            this.update = (percent) => {
              progress.report({
                increment: percent - this.reported,
                message: `${Math.floor(percent)}%`,
              });
              this.reported = percent;
            };
          }),
      );
    }
    this.update?.(total ? (received / total) * 100 : 0);
  }

  done(): void {
    this.finish?.();
  }
}
