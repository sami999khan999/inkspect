// Runs the integration tests in test/e2e/suite.ts inside VS Code.
//
// Environment variables:
//   VSCODE_EXECUTABLE        VS Code to test with (default: download the latest stable build)
//   VSCODE_BROWSER_CHROMIUM  Chromium to use (default: a copy the extension already downloaded
//                            in your normal VS Code profile, otherwise download one)
import { existsSync, readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getInstalledBrowsers } from '@puppeteer/browsers';
import { runTests } from '@vscode/test-electron';
import * as esbuild from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const suite = join(root, 'out', 'e2e', 'suite.js');

await esbuild.build({
  entryPoints: [join(root, 'test', 'e2e', 'suite.ts')],
  outfile: suite,
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'node22',
  external: ['vscode', 'bufferutil', 'utf-8-validate'],
  logLevel: 'warning',
});

const chromium = process.env.VSCODE_BROWSER_CHROMIUM ?? (await findDownloadedChromium());
if (chromium) console.log(`Using Chromium: ${chromium}`);
const results = join(root, 'out', 'e2e', 'results.log');

try {
  await runTests({
    vscodeExecutablePath: process.env.VSCODE_EXECUTABLE,
    extensionDevelopmentPath: root,
    extensionTestsPath: suite,
    extensionTestsEnv: {
      VSCODE_BROWSER_TEST_RESULTS: results,
      ...(chromium ? { VSCODE_BROWSER_CHROMIUM: chromium } : {}),
    },
    launchArgs: [
      '--disable-extensions',
      '--disable-workspace-trust',
      '--skip-welcome',
      '--skip-release-notes',
    ],
  });
} finally {
  // The extension host's console is not forwarded, so print the results the suite wrote.
  if (existsSync(results))
    console.log(`
Integration tests:
${readFileSync(results, 'utf8')}`);
}

/** Reuses the Chromium the extension downloaded in the regular VS Code profile, if any. */
async function findDownloadedChromium() {
  const userDir =
    process.platform === 'win32'
      ? join(process.env.APPDATA ?? '', 'Code', 'User')
      : process.platform === 'darwin'
        ? join(homedir(), 'Library', 'Application Support', 'Code', 'User')
        : join(homedir(), '.config', 'Code', 'User');
  const cacheDir = join(userDir, 'globalStorage', 'your-publisher.vscode-browser', 'chromium');
  if (!existsSync(cacheDir)) return undefined;
  const installed = await getInstalledBrowsers({ cacheDir });
  return installed.map((b) => b.executablePath).find((path) => existsSync(path));
}
