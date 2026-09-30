// Renders the logo (logo.svg; logo-small.svg below 48 px) to the PNGs both products ship, with
// the Chrome for Testing copy VS Code Browser downloads (or CHROME_PATH).
//   npm run logo
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Browser, getInstalledBrowsers } from '@puppeteer/browsers';
import puppeteer from 'puppeteer-core';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const OUTPUTS = [
  { svg: 'logo.svg', size: 256, file: 'vscode-extension/media/icon.png' },
  { svg: 'logo.svg', size: 128, file: 'browser-extension/icons/128.png' },
  { svg: 'logo.svg', size: 48, file: 'browser-extension/icons/48.png' },
  { svg: 'logo-small.svg', size: 32, file: 'browser-extension/icons/32.png' },
  { svg: 'logo-small.svg', size: 16, file: 'browser-extension/icons/16.png' },
];

async function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const cacheDir = join(
    process.env.APPDATA ?? join(homedir(), '.config'),
    'Code/User/globalStorage/your-publisher.vscode-browser/chromium',
  );
  const found = (await getInstalledBrowsers({ cacheDir })).find(
    (b) => b.browser === Browser.CHROME,
  );
  if (!found)
    throw new Error('No Chrome for Testing found: open VS Code Browser once, or set CHROME_PATH.');
  return found.executablePath;
}

const browser = await puppeteer.launch({ executablePath: await chromePath(), headless: true });
try {
  const page = await browser.newPage();
  for (const { svg, size, file } of OUTPUTS) {
    const data = readFileSync(join(here, svg)).toString('base64');
    await page.setViewport({ width: size, height: size });
    await page.setContent(
      `<style>html,body{margin:0;background:transparent}img{display:block;width:${size}px;height:${size}px}</style>` +
        `<img src="data:image/svg+xml;base64,${data}">`,
    );
    await page.waitForFunction(() => document.querySelector('img')?.complete);
    writeFileSync(join(root, file), await page.screenshot({ omitBackground: true, type: 'png' }));
    console.log(`${file} (${size} px)`);
  }
} finally {
  await browser.close();
}
