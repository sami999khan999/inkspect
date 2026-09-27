// End-to-end tests: Chrome for Testing with the unpacked extension (test build), a local
// fixture site, and a fake VS Code link server that uses the real shared sync code.
//   npm run test:e2e -w browser-extension
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Browser,
  computeExecutablePath,
  detectBrowserPlatform,
  install,
  resolveBuildId,
} from '@puppeteer/browsers';
import * as esbuild from 'esbuild';
import puppeteer from 'puppeteer-core';
import { WebSocketServer } from 'ws';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const extension = join(root, 'dist', 'chrome-test');

// The shared protocol and merge code, bundled for Node.
const { outputFiles } = await esbuild.build({
  stdin: {
    contents: `export * from '@inkspect/shared/bridge'; export * from '@inkspect/shared/bookmarkSync';`,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
});
const shared = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
);

/** Chrome for Testing: the copy VS Code Browser downloaded, else download one into .cache. */
async function chromePath() {
  if (process.env.CHROME_PATH) return process.env.CHROME_PATH;
  const vscodeCopy = join(
    process.env.APPDATA ?? join(homedir(), '.config'),
    'Code',
    'User',
    'globalStorage',
    'your-publisher.vscode-browser',
    'chromium',
  );
  const platform = detectBrowserPlatform();
  for (const cacheDir of [vscodeCopy, join(root, '.cache')]) {
    if (!existsSync(cacheDir)) continue;
    const { getInstalledBrowsers } = await import('@puppeteer/browsers');
    const found = (await getInstalledBrowsers({ cacheDir })).find(
      (b) => b.browser === Browser.CHROME,
    );
    if (found) return found.executablePath;
  }
  const buildId = await resolveBuildId(Browser.CHROME, platform, 'stable');
  const cacheDir = join(root, '.cache');
  await install({ browser: Browser.CHROME, buildId, cacheDir });
  return computeExecutablePath({ browser: Browser.CHROME, buildId, cacheDir });
}

// ---------------------------------------------------------------------------------------------
// Fixture site
// ---------------------------------------------------------------------------------------------

const rows = Array.from({ length: 80 }, (_, i) => `<p class="row">Row ${i}</p>`).join('');
const page = `<!doctype html><html><head><title>Fixture</title><style>
body{font:16px system-ui;margin:0;padding:24px;background:#f6f7f9}
.card{background:#fff;border:2px solid #cbd5e1;border-radius:8px;padding:16px;margin:20px}
button.primary{background:#2563eb;color:#fff;border:0;padding:10px 18px;border-radius:6px;margin:8px}
header{position:sticky;top:0;background:#0f172a;color:#fff;padding:8px}
</style></head><body><header>Sticky header</header>
<div class="card" id="login"><h2>Sign in</h2><button class="primary" aria-label="Sign in now">Sign in</button></div>
${rows}
<script>
document.querySelector('button').addEventListener('click', () => { document.title = 'clicked'; });
window.logError = () => { console.error('boom from fixture'); fetch('/missing.json'); };
</script></body></html>`;

const site = createServer((request, response) => {
  if (request.url === '/') response.writeHead(200, { 'content-type': 'text/html' }).end(page);
  else response.writeHead(404).end('not found');
});
await new Promise((resolve) => site.listen(0, '127.0.0.1', resolve));
const url = `http://127.0.0.1:${site.address().port}/`;

// ---------------------------------------------------------------------------------------------
// Fake VS Code link (same protocol and merge as the real one)
// ---------------------------------------------------------------------------------------------

const fake = {
  code: '424242',
  local: [
    {
      id: 'vs1',
      parentId: 'bar',
      index: 0,
      title: 'From VS Code',
      url: 'https://from-vscode.dev/',
    },
  ],
  state: undefined,
  snapshots: [],
  socket: undefined,
};
const linkServer = createServer();
const wss = new WebSocketServer({ server: linkServer, path: shared.BRIDGE_PATH });
wss.on('connection', (socket, request) => {
  if (!shared.isExtensionOrigin(request.headers.origin)) return socket.close();
  fake.socket = socket;
  const send = (message) => socket.send(shared.encode(message));
  let pending;
  socket.on('message', (data) => {
    const message = shared.parseClientMessage(String(data));
    if (!message) return;
    if (message.type === 'pair') {
      if (message.code !== fake.code)
        return send({ type: 'error', code: 'bad-code', message: 'Wrong code' });
      send({ type: 'paired', token: 'test-token', peer: 'Fake VS Code' });
      send({ type: 'welcome', peer: 'Fake VS Code', syncBookmarks: true });
    } else if (message.type === 'hello') {
      send({ type: 'welcome', peer: 'Fake VS Code', syncBookmarks: true });
    } else if (message.type === 'ping') {
      send({ type: 'pong' });
    } else if (message.type === 'bookmarks.snapshot') {
      fake.snapshots.push(message.tree);
      const result = shared.syncTrees(fake.state, fake.local, message.tree, 'merge');
      fake.local = result.tree;
      pending = result;
      if (result.ops.length) send({ type: 'bookmarks.ops', ops: result.ops });
      else fake.state = { base: result.tree, idMap: result.idMap };
    } else if (message.type === 'bookmarks.applied' && pending) {
      fake.state = { base: pending.tree, idMap: { ...pending.idMap, ...message.created } };
    }
  });
});
await new Promise((resolve) => linkServer.listen(0, '127.0.0.1', resolve));
const linkPort = linkServer.address().port;

// ---------------------------------------------------------------------------------------------
// Runner
// ---------------------------------------------------------------------------------------------

const results = [];
async function test(name, body) {
  const started = Date.now();
  try {
    await body();
    results.push(true);
    console.log(`  ✓ ${name} (${Date.now() - started} ms)`);
  } catch (error) {
    results.push(false);
    console.log(`  ✗ ${name}\n    ${error?.stack ?? error}`);
  }
}
function assert(condition, message) {
  if (!condition) throw new Error(message);
}
async function until(what, check, timeout = 8000) {
  const deadline = Date.now() + timeout;
  let last;
  while (Date.now() < deadline) {
    last = await check();
    if (last) return last;
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Timed out waiting for ${what} (last: ${JSON.stringify(last)})`);
}

const browser = await puppeteer.launch({
  executablePath: await chromePath(),
  headless: true,
  pipe: true,
  enableExtensions: true,
  defaultViewport: { width: 1200, height: 800 },
  args: ['--no-first-run'],
});
const extensionId = await browser.installExtension(extension);
const worker = await (
  await browser.waitForTarget(
    (t) =>
      t.type() === 'service_worker' && t.url().startsWith(`chrome-extension://${extensionId}/`),
  )
).worker();
await browser
  .defaultBrowserContext()
  .overridePermissions(new URL(url).origin, [
    'clipboard-read',
    'clipboard-write',
    'clipboard-sanitized-write',
  ]);

const tab = await browser.newPage();
await tab.goto(url);
await tab.bringToFront();
const tabId = await worker.evaluate(async (u) => (await chrome.tabs.query({ url: u }))[0]?.id, url);

/** Runs a query inside the toolbar's (open, test-build) shadow root. */
const inToolbar = (fn, ...args) =>
  tab.evaluate(
    (source, args) => {
      const shadow = document.querySelector('inkspect-toolbar')?.shadowRoot;
      return shadow
        ? new Function('shadow', 'args', `return (${source})(shadow, ...args)`)(shadow, args)
        : undefined;
    },
    fn.toString(),
    args,
  );
const clickButton = (label) =>
  inToolbar((shadow, label) => {
    const button = [...shadow.querySelectorAll('button')].find((b) =>
      (b.getAttribute('aria-label') ?? b.textContent ?? '').startsWith(label),
    );
    button?.click();
    return !!button;
  }, label);
const toastText = () => inToolbar((shadow) => shadow.querySelector('.toast')?.textContent ?? '');
const clipboardText = () => tab.evaluate(() => navigator.clipboard.readText());
const clipboardImage = () =>
  tab.evaluate(async () => {
    for (const item of await navigator.clipboard.read()) {
      if (item.types.includes('image/png')) {
        const bitmap = await createImageBitmap(await item.getType('image/png'));
        return { width: bitmap.width, height: bitmap.height };
      }
    }
    return undefined;
  });
const clearClipboard = () => tab.evaluate(() => navigator.clipboard.writeText(''));

console.log('Inkspect browser extension end-to-end tests');

await test('the shortcut opens the toolbar on the page', async () => {
  await worker.evaluate((id) => globalThis.__inkspectTest.toggleToolbar(id), tabId);
  const buttons = await until('toolbar', () =>
    inToolbar((shadow) => shadow.querySelectorAll('.toolbar button').length),
  );
  assert(buttons >= 9, `only ${buttons} buttons`);
});

await test('the element selector highlights with a Chrome-style tooltip and copies details', async () => {
  assert(await clickButton('Select an element'), 'no inspect button');
  const box = await (await tab.$('button.primary')).boundingBox();
  await tab.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  const tip = await until('tooltip', () =>
    inToolbar((shadow) => shadow.querySelector('.tip')?.textContent ?? ''),
  );
  assert(tip.includes('button.primary'), `tooltip: ${tip}`);
  assert(/Contrast.*5\.1\d/.test(tip), `no contrast: ${tip}`);
  assert(tip.includes('Sign in now') && tip.includes('button'), `no name/role: ${tip}`);
  await clearClipboard();
  await tab.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  const text = await until('copied details', async () => {
    const t = await clipboardText();
    return t.includes('### Element') ? t : undefined;
  });
  assert(text.includes('button.primary') || text.includes('Sign in'), text);
  assert((await tab.title()) === 'Fixture', 'the click reached the page');
  await tab.keyboard.press('Escape');
});

await test('viewport and full-page screenshots are copied as images', async () => {
  for (const [item, expectTall] of [
    ['Visible area', false],
    ['Full page', true],
  ]) {
    await clearClipboard();
    await clickButton('Screenshot');
    await until('menu', () => inToolbar((shadow) => shadow.querySelectorAll('.menu-item').length));
    await inToolbar(
      (shadow, item) =>
        [...shadow.querySelectorAll('.menu-item')]
          .find((b) => b.textContent.includes(item))
          ?.click(),
      item,
    );
    const image = await until(`${item} image`, clipboardImage, 20_000);
    const pageHeight = await tab.evaluate(() => document.documentElement.scrollHeight);
    if (expectTall)
      assert(image.height >= pageHeight - 2, `full page ${image.height} < ${pageHeight}`);
    else
      assert(image.height <= 800 && image.width >= 1100, `viewport ${image.width}x${image.height}`);
    await until('toast', async () => (await toastText()).includes('copied'));
  }
});

await test('drawing, then "screenshot drawing area" captures just the drawing', async () => {
  assert(await clickButton('Draw on the page'), 'no draw button');
  await until('drawing layer', () =>
    inToolbar((shadow) => !!shadow.querySelector('.drawing-layer canvas')),
  );
  await tab.mouse.move(300, 400);
  await tab.mouse.down();
  for (let i = 1; i <= 10; i++) await tab.mouse.move(300 + i * 20, 400 + i * 5);
  await tab.mouse.up();
  await clearClipboard();
  // The drawing toolbar's own screenshot button (not the main toolbar's).
  assert(
    await inToolbar((shadow) => {
      const b = shadow.querySelector('.draw-capture');
      b?.click();
      return !!b;
    }),
    'no draw screenshot button',
  );
  await until('capture menu', () =>
    inToolbar((shadow) => shadow.querySelectorAll('.menu-item').length),
  );
  await inToolbar((shadow) =>
    [...shadow.querySelectorAll('.menu-item')]
      .find((b) => b.textContent.includes('Drawing area'))
      ?.click(),
  );
  const image = await until('drawing image', clipboardImage, 20_000);
  // 200 × 50 of stroke plus 40 px padding on each side (at DPR 1).
  assert(
    image.width > 250 && image.width < 320 && image.height > 110 && image.height < 170,
    `area ${image.width}x${image.height}`,
  );
  await tab.keyboard.press('Escape');
});

await test('console errors and failed requests are captured and copied for AI', async () => {
  await tab.evaluate(() => window.logError());
  assert(await clickButton('Console and network'), 'no console button');
  await until('console entry', () =>
    inToolbar((shadow) => shadow.querySelector('.log')?.textContent.includes('boom from fixture')),
  );
  await clearClipboard();
  await clickButton('Copy errors');
  const text = await until('copied errors', async () => {
    const t = await clipboardText();
    return t.includes('boom from fixture') ? t : undefined;
  });
  assert(text.includes('Console errors'), text);
  await clearClipboard();
  await clickButton('Copy failed requests');
  const failed = await until('copied failed requests', async () => {
    const t = await clipboardText();
    return t.includes('missing.json') ? t : undefined;
  }).catch(async (error) => {
    console.log('    clipboard:', JSON.stringify(await clipboardText()));
    console.log('    toast:', JSON.stringify(await toastText()));
    throw error;
  });
  assert(failed.includes('404'), failed);
  await clickButton('Close');
});

await test('pairs with VS Code and syncs bookmarks both ways', async () => {
  await worker.evaluate(async (port) => {
    await chrome.storage.local.set({ port });
    await globalThis.__inkspectTest.reconnect();
  }, linkPort);
  await until('unpaired state', () =>
    worker.evaluate(() => globalThis.__inkspectTest.bridgeStatus().state === 'unpaired'),
  );
  const status = await worker.evaluate((code) => globalThis.__inkspectTest.pair(code), fake.code);
  assert(status.state === 'connected', JSON.stringify(status));
  // VS Code's bookmark arrives in the browser's bookmarks bar.
  await until('bookmark from VS Code', () =>
    worker.evaluate(
      async () => (await chrome.bookmarks.search({ url: 'https://from-vscode.dev/' })).length > 0,
    ),
  );
  // A bookmark made in the browser reaches VS Code.
  await worker.evaluate(async () => {
    await chrome.bookmarks.create({
      parentId: '1',
      title: 'From Chrome',
      url: 'https://from-chrome.dev/',
    });
  });
  await until('bookmark in VS Code', () =>
    fake.local.some((n) => n.url === 'https://from-chrome.dev/'),
  ).catch(async (error) => {
    console.log(
      '    snapshots received:',
      fake.snapshots.length,
      JSON.stringify(fake.snapshots.at(-1)),
    );
    console.log('    state:', JSON.stringify(fake.state));
    console.log(
      '    background:',
      JSON.stringify(await worker.evaluate(() => globalThis.__inkspectTest.syncState())),
    );
    console.log(
      '    browser tree:',
      JSON.stringify(
        await worker.evaluate(async () =>
          (await chrome.bookmarks.getTree())[0].children.map((c) => ({
            id: c.id,
            title: c.title,
            folderType: c.folderType,
            n: c.children?.length,
          })),
        ),
      ),
    );
    throw error;
  });
  // A rename in VS Code reaches the browser.
  const node = fake.local.find((n) => n.url === 'https://from-chrome.dev/');
  fake.local = fake.local.map((n) => (n === node ? { ...n, title: 'Renamed in VS Code' } : n));
  fake.socket.send(shared.encode({ type: 'bookmarks.requestSnapshot' }));
  await until('rename in the browser', () =>
    worker.evaluate(
      async () =>
        (await chrome.bookmarks.search({ url: 'https://from-chrome.dev/' }))[0]?.title ===
        'Renamed in VS Code',
    ),
  );
  // Nothing is duplicated after all that.
  const count = await worker.evaluate(
    async () => (await chrome.bookmarks.search({ url: 'https://from-vscode.dev/' })).length,
  );
  assert(count === 1, `duplicated: ${count}`);
});

await browser.close();
site.close();
linkServer.close();
wss.close();
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
