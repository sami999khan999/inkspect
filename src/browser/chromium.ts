import { existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  Browser,
  detectBrowserPlatform,
  getInstalledBrowsers,
  install,
  uninstall,
} from '@puppeteer/browsers';
import { PUPPETEER_REVISIONS } from 'puppeteer-core/internal/revisions.js';
import type { Logger } from './logger';

/** The Chrome for Testing build that matches the installed puppeteer-core version. */
export const CHROME_BUILD_ID: string = PUPPETEER_REVISIONS.chrome;

export interface ResolveChromiumOptions {
  /** Directory that holds downloaded browsers (`<globalStorage>/chromium`). */
  cacheDir: string;
  /** User-configured executable. When set, nothing is downloaded. */
  executablePath?: string;
  /** HTTP(S) proxy for the download, e.g. VS Code's `http.proxy` setting. */
  proxy?: string;
  onDownloadProgress?: (downloadedBytes: number, totalBytes: number) => void;
  logger: Logger;
}

/**
 * Returns the path of the Chromium executable to launch, downloading Chrome for Testing into
 * `cacheDir` the first time. Older downloaded builds are removed after a successful download.
 */
export async function resolveChromium(options: ResolveChromiumOptions): Promise<string> {
  const { cacheDir, executablePath, logger } = options;
  if (executablePath) {
    if (!existsSync(executablePath)) {
      throw new Error(`Chromium executable not found: ${executablePath}`);
    }
    return executablePath;
  }

  const platform = detectBrowserPlatform();
  if (!platform) throw new Error(`Chrome for Testing is not available for ${process.platform}.`);

  const installed = await getInstalledBrowsers({ cacheDir });
  const current = installed.find(
    (b) => b.browser === Browser.CHROME && b.buildId === CHROME_BUILD_ID && b.platform === platform,
  );
  if (current && existsSync(current.executablePath)) return current.executablePath;

  logger.info(`Downloading Chrome for Testing ${CHROME_BUILD_ID} to ${cacheDir}`);
  const result = await withProxy(options.proxy, () =>
    install({
      browser: Browser.CHROME,
      buildId: CHROME_BUILD_ID,
      cacheDir,
      platform,
      downloadProgressCallback: options.onDownloadProgress,
    }),
  );

  for (const old of installed) {
    if (old.buildId === CHROME_BUILD_ID) continue;
    await uninstall({
      browser: old.browser,
      buildId: old.buildId,
      platform: old.platform,
      cacheDir,
    })
      .then(() => logger.info(`Removed old browser build ${old.buildId}`))
      .catch((error: unknown) => logger.warn(`Could not remove ${old.buildId}: ${String(error)}`));
  }
  return result.executablePath;
}

/** Default location of downloaded browsers inside the extension's global storage. */
export function chromiumCacheDir(globalStoragePath: string): string {
  return join(globalStoragePath, 'chromium');
}

/** Runs `task` with the proxy environment variables that @puppeteer/browsers reads. */
async function withProxy<T>(proxy: string | undefined, task: () => Promise<T>): Promise<T> {
  if (!proxy || process.env.HTTPS_PROXY || process.env.https_proxy) return task();
  process.env.HTTPS_PROXY = proxy;
  process.env.HTTP_PROXY ??= proxy;
  try {
    return await task();
  } finally {
    delete process.env.HTTPS_PROXY;
    if (process.env.HTTP_PROXY === proxy) delete process.env.HTTP_PROXY;
  }
}
