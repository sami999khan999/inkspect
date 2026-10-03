// End-to-end tests: Chrome for Testing with the unpacked extension (test build) and a fake
// VS Code link server that uses the real shared sync code, plus a fixture site for the toolbar.
//   npm run test:e2e -w browser-extension
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { createConnection } from 'node:net';
import { homedir, tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
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
const { outputFiles: hubFiles } = await esbuild.build({
  stdin: { contents: `export * from '@inkspect/shared/hub';`, resolveDir: root, loader: 'ts' },
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
});
const hub = await import(
  `data:text/javascript;base64,${Buffer.from(hubFiles[0].text).toString('base64')}`
);
// VS Code's answers about projects and their saved captures (the same code as the extension's).
const coreDir = mkdtempSync(join(tmpdir(), 'ink-core-'));
await esbuild.build({
  entryPoints: [join(root, '..', 'vscode-extension', 'src', 'hub', 'core.ts')],
  outfile: join(coreDir, 'core.mjs'),
  bundle: true,
  format: 'esm',
  platform: 'node',
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  logLevel: 'warning',
});
const { HubCore } = await import(pathToFileURL(join(coreDir, 'core.mjs')).href);

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

/** The fake VS Code window's project: captures over the link are saved here. */
const fakeProject = join(coreDir, 'shop');
mkdirSync(fakeProject);
const WELCOME = { type: 'welcome', peer: 'Fake VS Code', syncBookmarks: true, features: ['hub'] };

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
  /** Sends the window ran for its own agents (a terminal agent, chat). */
  runs: [],
  socket: undefined,
  /** A Pair click in VS Code: pairs the browser waiting on the open connection, without a code. */
  approve() {
    for (const message of [
      { type: 'paired', token: 'test-token', peer: 'Fake VS Code' },
      WELCOME,
    ]) {
      fake.socket.send(shared.encode(message));
    }
  },
};
const core = new HubCore(
  { paths: { state: join(coreDir, 'state'), data: join(coreDir, 'data') }, tmuxSockets: [] },
  {
    windows: () => [
      {
        id: 'w1',
        name: 'shop',
        folders: [fakeProject],
        focusedAt: 1,
        targets: [
          {
            id: 'terminal:1',
            kind: 'terminal',
            label: 'Terminal agent',
            detail: 'VS Code terminal',
          },
          { id: 'chat', kind: 'chat', label: 'Chat', detail: 'VS Code chat' },
        ],
      },
    ],
    runInWindow: async (window, project, ids, target) => {
      fake.runs.push({ window, project, ids: [...ids], target });
      return { ok: true, sentTo: target === 'chat' ? 'Chat' : 'Terminal agent' };
    },
    log: () => {},
  },
);
// Like VS Code's server, answers plain requests (the extension probes the port first).
const linkServer = createServer((_request, response) => response.writeHead(404).end());
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
      send(WELCOME);
    } else if (message.type === 'hello') {
      // Like VS Code: only the paired token gets in; an unpaired browser stays connected.
      if (message.token !== 'test-token')
        send({ type: 'error', code: 'unpaired', message: 'Not paired' });
      else send(WELCOME);
    } else if (message.type === 'hub.request') {
      const request = hub.parseBrowserToHub(message.request);
      if (request) {
        void core
          .handle(request)
          .then((reply) => send({ type: 'hub.reply', reply: JSON.parse(hub.encodeHub(reply)) }));
      }
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
    } else if (message.type === 'settings.shortcuts') {
      fake.shortcutsFromBrowser = message;
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

// The settings page opens on install; closed first, or it can take focus from the fixture tab
// (a background tab doesn't paint, and the tests would wait on it).
await (
  await (await browser.waitForTarget((t) => t.url().includes('options.html'))).page()
)?.close();
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
/** The send dialog's text (shown after every capture), or undefined while it is closed. */
const dialogText = () => inToolbar((shadow) => shadow.querySelector('.ink-modal')?.textContent);
/** Waits for the send dialog to show `text`, then closes it with Esc (the capture stays). */
const closeDialog = async (text = '') => {
  const shown = await until(
    `the send dialog${text ? ` for "${text}"` : ''}`,
    async () => {
      const t = await dialogText();
      return t?.includes(text) ? t : undefined;
    },
    20_000,
  );
  await tab.keyboard.press('Escape');
  await until('the send dialog closed', async () => (await dialogText()) === undefined);
  return shown;
};
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
    inToolbar((shadow) => shadow.querySelectorAll('.bar button').length),
  );
  assert(buttons >= 9, `only ${buttons} buttons`);
});

await test('the toolbar spans the top and pushes the page, and its sticky header, down', async () => {
  const layout = await until('pushed page', () =>
    tab.evaluate(() => {
      const bar = document
        .querySelector('inkspect-toolbar')
        .shadowRoot.querySelector('.bar')
        .getBoundingClientRect();
      const margin = parseFloat(getComputedStyle(document.documentElement).marginTop);
      const header = parseFloat(getComputedStyle(document.querySelector('header')).top);
      // Measured once the bar has slid in.
      return margin > 0 && header > 0 && bar.top === 0
        ? { top: bar.top, width: bar.width, height: bar.height, margin, header }
        : undefined;
    }),
  );
  const innerWidth = await tab.evaluate(() => innerWidth);
  assert(layout.top === 0 && layout.width === innerWidth, `bar: ${JSON.stringify(layout)}`);
  assert(Math.abs(layout.margin - layout.height) < 1, `page: ${JSON.stringify(layout)}`);
  assert(Math.abs(layout.header - layout.height) < 1, `header: ${JSON.stringify(layout)}`);
});

await test('the responsive view shows the page in a centered device-sized frame', async () => {
  assert(await clickButton('Responsive view'), 'no responsive button');
  const view = await until(
    'framed page',
    () =>
      tab.evaluate(() => {
        const frame = document.querySelector('inkspect-toolbar').shadowRoot.querySelector('iframe');
        const width = frame?.contentWindow?.innerWidth;
        const loaded = frame?.contentDocument?.querySelector('#login');
        if (!frame || !loaded) return undefined;
        const rect = frame.parentElement.getBoundingClientRect();
        return { width, center: rect.left + rect.width / 2, middle: innerWidth / 2 };
      }),
    15_000,
  );
  assert(view.width < 500, `frame width ${view.width}`);
  assert(Math.abs(view.center - view.middle) < 20, `not centered: ${JSON.stringify(view)}`);
  // Real clicks (not element.click()): the device list is a popup in the shadow root, which must
  // take the pointer, and the width box replaces its value when typed into.
  const center = (selector, text) =>
    inToolbar(
      (shadow, selector, text) => {
        const el = [...shadow.querySelectorAll(selector)].find((e) =>
          (e.getAttribute('aria-label') ?? e.textContent).includes(text),
        );
        const r = el?.getBoundingClientRect();
        return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      },
      selector,
      text,
    );
  const frameWidth = () =>
    inToolbar((shadow) => shadow.querySelector('iframe')?.contentWindow?.innerWidth);
  let point = await center('.rv-device', 'Device');
  await tab.mouse.click(point.x, point.y);
  point = await until('device list', () => center('.select-option', 'iPad'));
  await tab.mouse.click(point.x, point.y);
  await until('iPad width', async () => (await frameWidth()) >= 700);
  point = await center('input', 'Width');
  await tab.mouse.click(point.x, point.y);
  await tab.keyboard.type('500');
  await tab.keyboard.press('Enter');
  await until('typed width', async () => (await frameWidth()) === 500);
  // Dragging the corner handle resizes the screen (to a custom size).
  point = await center('.rv-handle', 'Drag to change the size');
  await tab.mouse.move(point.x, point.y);
  await tab.mouse.down();
  await tab.mouse.move(point.x + 50, point.y, { steps: 5 });
  await tab.mouse.up();
  await until('dragged width', async () => (await frameWidth()) > 540);
  assert(await clickButton('Close the responsive view'), 'no close button');
  await until('view closed', () =>
    inToolbar((shadow) => !shadow.querySelector('iframe') && !shadow.querySelector('.rv')),
  );
  const overflow = await tab.evaluate(() => document.documentElement.style.overflow);
  assert(overflow === '', `page scroll still locked: ${overflow}`);
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
  // Every capture opens the send dialog (nothing is linked yet: it says so).
  const offered = await closeDialog('Element');
  assert(offered.includes('Not linked'), offered);
  // Alt+click is a screenshot of the element, and only that (no details copied).
  await clearClipboard();
  await tab.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await tab.keyboard.down('Alt');
  await tab.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await tab.keyboard.up('Alt');
  const shot = await until('element screenshot', clipboardImage, 20_000);
  assert(shot.width > 20 && shot.height > 10, `element image ${shot.width}x${shot.height}`);
  await closeDialog('Element screenshot');
  // The picker is still on; Esc leaves it.
  await tab.keyboard.press('Escape');
  await until(
    'picker off',
    async () => !(await inToolbar((s) => !!s.querySelector('.inspect-hint'))),
  );
});

await test('viewport and full-page screenshots are copied as images', async () => {
  for (const [item, expectTall] of [
    ['Visible area', false],
    ['Full page', true],
  ]) {
    await clearClipboard();
    await clickButton('Screenshot');
    await until('menu', () => inToolbar((shadow) => shadow.querySelectorAll('.menu-item').length));
    // A real click: menus in the shadow root must not take it for a click outside them.
    const point = await inToolbar((shadow, item) => {
      const r = [...shadow.querySelectorAll('.menu-item')]
        .find((b) => b.textContent.includes(item))
        ?.getBoundingClientRect();
      return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, item);
    await tab.mouse.click(point.x, point.y);
    const image = await until(`${item} image`, clipboardImage, 20_000);
    // The page's own height: the room made for the toolbar above it isn't captured.
    const pageHeight = await tab.evaluate(
      () =>
        document.documentElement.scrollHeight -
        parseFloat(getComputedStyle(document.documentElement).marginTop),
    );
    if (expectTall)
      assert(image.height >= pageHeight - 2, `full page ${image.height} < ${pageHeight}`);
    else
      assert(image.height <= 800 && image.width >= 1100, `viewport ${image.width}x${image.height}`);
    const offered = await closeDialog('creenshot');
    assert(offered.includes('Copied'), offered);
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
  await closeDialog('Drawing');
  // Drawing is still on; Esc leaves it.
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
  await closeDialog('Console errors');
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
  await closeDialog('Failed requests');
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
  // Unpaired, the toolbar button asks to be clicked.
  await until('the "!" badge', () =>
    worker.evaluate(async () => (await chrome.action.getBadgeText({})) === '!'),
  );
  // Pair the way a user does: the settings page, which opens in a tab of its own.
  const options = await browser.newPage();
  await options.goto(`chrome-extension://${extensionId}/options.html`);
  await until('the settings page to show the unpaired link', () =>
    options.evaluate(() =>
      document.querySelector('.status-chip')?.textContent?.includes('Not paired'),
    ),
  );
  // One click in VS Code: it approves the waiting browser and sends a token, no code typed.
  fake.approve();
  await until('the settings page to show the one-click link', () =>
    options.evaluate(() =>
      document.querySelector('.status-chip')?.textContent?.startsWith('Linked'),
    ),
  );
  // The link, drawn: a lit branch to the VS Code window that answers.
  const graph = await options.evaluate(() =>
    [...document.querySelectorAll('.graph-target')].map((row) => ({
      name: row.querySelector('.graph-name')?.textContent,
      lit: row.classList.contains('lit'),
    })),
  );
  assert(
    JSON.stringify(graph) === JSON.stringify([{ name: 'Fake VS Code', lit: true }]),
    JSON.stringify(graph),
  );
  // Unlink (it takes a second click: the first only arms it), then pair the fallback way: a
  // code typed on the settings page.
  await options.evaluate(() =>
    [...document.querySelectorAll('button')]
      .find((b) => b.textContent?.trim() === 'Unlink')
      .click(),
  );
  const stillLinked = await options.evaluate(() =>
    document.querySelector('.status-chip')?.textContent?.startsWith('Linked'),
  );
  assert(stillLinked, 'one click unlinked');
  await options.evaluate(() =>
    [...document.querySelectorAll('button')]
      .find((b) => b.textContent?.includes('Click again to unlink'))
      .click(),
  );
  await until('the settings page to offer a code', () =>
    options.evaluate(() => {
      document.querySelector('.use-code')?.click();
      return !!document.querySelector('.code-box');
    }),
  );
  // One box per digit: typing moves through them, and the last digit pairs.
  await options.type('.code-box', fake.code);
  await until('the settings page to show the link', () =>
    options.evaluate(() =>
      document.querySelector('.status-chip')?.textContent?.startsWith('Linked'),
    ),
  );
  // The Shortcuts tab lists every shortcut, VS Code Browser's own included (tagged), in every group.
  await options.goto(`chrome-extension://${extensionId}/options.html#shortcuts`);
  const list = await until('the full shortcut list', () =>
    options.evaluate(() => {
      const groups = [...document.querySelectorAll('.group-title')].map((g) => g.textContent);
      const rows = [...document.querySelectorAll('.shortcut-item')];
      const tagsOf = (row) =>
        [...row.querySelectorAll('.shortcut-tag')].map((t) => t.textContent).join(' ');
      // Toolbar keys work in both (VS BR); VS Code Browser's own only there (VS).
      const tagged =
        rows.some((r) => tagsOf(r) === 'VS BR') && rows.some((r) => tagsOf(r) === 'VS');
      return groups.includes('Measure') && tagged ? { groups, tagged } : undefined;
    }),
  );
  assert(list.groups.includes('Drawing') && list.groups.includes('Record'), JSON.stringify(list));
  // Pressing a shortcut in the search box searches for it; typing it as words works too.
  await options.focus('.shortcuts-bar input');
  await options.keyboard.down('Control');
  await options.keyboard.down('Shift');
  await options.keyboard.press('KeyC');
  await options.keyboard.up('Shift');
  await options.keyboard.up('Control');
  const searched = () =>
    options.evaluate(() => ({
      query: document.querySelector('.shortcuts-bar input').value,
      rows: [...document.querySelectorAll('.shortcut-item .shortcut-label')].map(
        (label) => label.textContent,
      ),
    }));
  const pressed = await until('the pressed shortcut as the search', async () => {
    const result = await searched();
    return result.query === 'Ctrl+Shift+C' ? result : undefined;
  });
  assert(pressed.rows.length > 0 && pressed.rows.length < 5, JSON.stringify(pressed));
  await options.evaluate(() => {
    const input = document.querySelector('.shortcuts-bar input');
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, '');
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await options.type('.shortcuts-bar input', 'ctrl shift c');
  const typed = await searched();
  assert(JSON.stringify(typed.rows) === JSON.stringify(pressed.rows), JSON.stringify(typed));
  await options.close();
  const status = await worker.evaluate(() => globalThis.__inkspectTest.bridgeStatus());
  assert(status.state === 'connected', JSON.stringify(status));
  // VS Code's shortcuts go into the browser's sync storage (they follow the browser account)...
  fake.socket.send(
    shared.encode({
      type: 'settings.shortcuts',
      shortcuts: { 'mode.draw': 'ctrl+alt+d' },
      updated: 5,
    }),
  );
  await until('the shortcuts in sync storage', () =>
    worker.evaluate(async () => (await globalThis.__inkspectTest.syncedShortcuts())?.updated === 5),
  );
  // ...and newer ones arriving through sync (another device) go to VS Code.
  await worker.evaluate(() =>
    chrome.storage.sync.set({
      inkspectShortcuts: { shortcuts: { 'mode.draw': 'alt+d' }, updated: 10 },
    }),
  );
  await until('the synced shortcuts in VS Code', () => fake.shortcutsFromBrowser?.updated === 10);
  assert(fake.shortcutsFromBrowser.shortcuts['mode.draw'] === 'alt+d', 'wrong shortcuts');
  await until('the badge to clear', () =>
    worker.evaluate(async () => (await chrome.action.getBadgeText({})) === ''),
  );
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

await test('shortcuts: changed in the toolbar, they reach VS Code and work; VS Code changes arrive', async () => {
  if (!(await inToolbar((shadow) => !!shadow.querySelector('.bar')))) {
    await worker.evaluate((id) => globalThis.__inkspectTest.toggleToolbar(id), tabId);
  }
  await until('toolbar', () =>
    inToolbar((shadow) => shadow.querySelector('.bar')?.getBoundingClientRect().top === 0),
  );
  fake.shortcutsFromBrowser = undefined;
  // Record a new key for "Draw on the page" in the shortcuts panel.
  assert(await clickButton('Keyboard shortcuts'), 'no shortcuts button');
  await until('shortcuts panel', () =>
    inToolbar((shadow) => !!shadow.querySelector('.shortcut-list')),
  );
  await inToolbar((shadow) => {
    const row = [...shadow.querySelectorAll('.shortcut-item')].find(
      (r) => r.querySelector('.shortcut-label')?.textContent === 'Draw on the page',
    );
    row?.querySelector('.key-button')?.click();
  });
  await until('recording', () => inToolbar((shadow) => !!shadow.querySelector('.key-recording')));
  await tab.keyboard.down('Control');
  await tab.keyboard.down('Alt');
  await tab.keyboard.press('KeyX');
  await tab.keyboard.up('Alt');
  await tab.keyboard.up('Control');
  // It reaches VS Code through the link.
  const sent = await until('shortcuts sent to VS Code', () =>
    fake.shortcutsFromBrowser?.shortcuts?.['mode.draw'] ? fake.shortcutsFromBrowser : undefined,
  );
  assert(JSON.stringify(sent.shortcuts['mode.draw']) === '["ctrl+alt+x"]', JSON.stringify(sent));
  // The search box traps shortcuts: one pressed there is searched for, not run...
  await inToolbar((shadow) => shadow.querySelector('.shortcuts-bar input')?.focus());
  await tab.keyboard.down('Control');
  await tab.keyboard.down('Alt');
  await tab.keyboard.press('KeyX');
  await tab.keyboard.up('Alt');
  await tab.keyboard.up('Control');
  await until('the pressed key searched for', () =>
    inToolbar((shadow) => shadow.querySelector('.shortcuts-bar input')?.value === 'Ctrl+Alt+X'),
  );
  assert(!(await inToolbar((shadow) => !!shadow.querySelector('.draw-toolbar'))), 'draw ran');
  // ...and so is the browser's own toolbar key, which the page never sees (the background passes
  // it on instead of closing the toolbar).
  await worker.evaluate(
    (id) => chrome.tabs.sendMessage(id, { type: 'toggle', key: 'alt+shift+k' }),
    tabId,
  );
  await until('the toolbar key searched for', () =>
    inToolbar((shadow) => shadow.querySelector('.shortcuts-bar input')?.value === 'Alt+Shift+K'),
  );
  assert(await inToolbar((shadow) => !!shadow.querySelector('.bar')), 'the toolbar closed');
  // And works on the page, as does the drawing toolbar's Screenshot menu key (with its keys shown).
  await inToolbar((shadow) => shadow.querySelector('.panel-head button')?.click());
  await tab.keyboard.down('Control');
  await tab.keyboard.down('Alt');
  await tab.keyboard.press('KeyX');
  await tab.keyboard.up('Alt');
  await tab.keyboard.up('Control');
  await until('drawing on', () => inToolbar((shadow) => !!shadow.querySelector('.draw-toolbar')));
  // Every drawing tool has its key, pencil (I) included.
  await tab.keyboard.press('KeyI');
  await until('the pencil picked by its key', () =>
    inToolbar(
      (shadow) =>
        shadow.querySelector('.draw-toolbar button[aria-label="Pencil"]')?.ariaPressed === 'true',
    ),
  );
  await tab.keyboard.press('KeyS');
  const menu = await until('capture menu', () =>
    inToolbar((shadow) =>
      [...shadow.querySelectorAll('.menu-item')].map((m) => m.textContent).join('|'),
    ),
  );
  assert(menu.includes('Each drawing separately') && menu.includes('Alt'), menu);
  await tab.keyboard.press('Escape');
  await tab.keyboard.press('Escape');

  // Popups close when the toolbar is pressed elsewhere, and their own button toggles them
  // (real mouse presses: the closing happens on pointerdown).
  const pressOn = async (selector) => {
    const box = await inToolbar((shadow, selector) => {
      const r = shadow.querySelector(selector)?.getBoundingClientRect();
      return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    }, selector);
    assert(box, `nothing at ${selector}`);
    await tab.mouse.click(box.x, box.y);
  };
  const has = (selector) => inToolbar((shadow, s) => !!shadow.querySelector(s), selector);
  const settle = () => new Promise((resolve) => setTimeout(resolve, 300));
  const consoleButton = '.bar button[aria-label^="Console and network"]';
  await pressOn(consoleButton);
  await until('the console panel', () => has('.panel-dock'));
  await pressOn('.bar-spacer');
  await until('the panel closed by a toolbar press', async () => !(await has('.panel-dock')));
  await pressOn(consoleButton);
  await until('the console panel again', () => has('.panel-dock'));
  await pressOn(consoleButton);
  await settle();
  assert(!(await has('.panel-dock')), 'its button reopened the panel instead of closing it');
  await pressOn('.shot-button');
  await until('the screenshot menu', () => has('.menu-item'));
  await pressOn('.shot-button');
  await settle();
  assert(!(await has('.menu-item')), 'its button reopened the menu instead of closing it');
  await pressOn('.shot-button');
  await until('the screenshot menu again', () => has('.menu-item'));
  await pressOn('.bar-spacer');
  await until('the menu closed by a toolbar press', async () => !(await has('.menu-item')));

  // A change made in VS Code (newer) arrives in the toolbar.
  fake.socket.send(
    shared.encode({
      type: 'settings.shortcuts',
      shortcuts: { 'mode.draw': 'ctrl+alt+y' },
      updated: Date.now() + 60_000,
    }),
  );
  await until('VS Code change applied', () =>
    inToolbar((shadow) =>
      [...shadow.querySelectorAll('.bar button')].some((b) =>
        b.getAttribute('aria-label')?.includes('Ctrl+Alt+Y'),
      ),
    ),
  );
});

await test('over the link, captures are saved into the window’s project and the dialog sends them', async () => {
  // Linked by the previous test.
  if (!(await inToolbar((shadow) => !!shadow.querySelector('.bar')))) {
    await worker.evaluate((id) => globalThis.__inkspectTest.toggleToolbar(id), tabId);
  }
  await until('linked toolbar', () =>
    inToolbar(
      (shadow) =>
        shadow.querySelector('.link-connected') !== null &&
        // Slid in: clicks land where the boxes are measured.
        shadow.querySelector('.bar').getBoundingClientRect().top === 0,
    ),
  );
  const pointOf = (selector, text) =>
    inToolbar(
      (shadow, selector, text) => {
        const r = [...shadow.querySelectorAll(selector)]
          .find((e) => (e.getAttribute('aria-label') ?? e.textContent).includes(text))
          ?.getBoundingClientRect();
        return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
      },
      selector,
      text,
    );
  const clickAt = async (selector, text) => {
    const point = await until(`${selector} "${text}"`, () => pointOf(selector, text));
    await tab.mouse.click(point.x, point.y);
  };
  const shoot = async () => {
    await clickAt('button', 'Screenshot');
    await clickAt('.menu-item', 'Visible area');
    let last;
    return until(
      'the send dialog',
      async () => {
        const text = (last = await dialogText());
        return text?.includes('Terminal agent') && !text.includes('Saving') ? text : undefined;
      },
      20_000,
    ).catch((error) => {
      console.log('    dialog:', JSON.stringify(last));
      throw error;
    });
  };
  const closed = () => until('the dialog closed', async () => (await dialogText()) === undefined);

  const itemsDir = join(fakeProject, '.inkspect', 'items');
  const saved = () => {
    try {
      return readdirSync(itemsDir)
        .filter((name) => !name.startsWith('.'))
        .map((id) => JSON.parse(readFileSync(join(itemsDir, id, 'item.json'), 'utf8')));
    } catch {
      return [];
    }
  };

  // Taken: saved into the window's project at once, then offered with its agents.
  let before = saved().length;
  const offered = await shoot();
  assert(offered.includes('shop') && offered.includes('Chat'), offered);
  assert(saved().length === before + 1, 'not saved into the project');
  // Enter sends it to the default agent (the terminal one), run in its window.
  let runs = fake.runs.length;
  await tab.keyboard.press('Enter');
  const sent = await until('the send', () => fake.runs[runs]);
  assert(
    sent.window === 'w1' && sent.target === 'terminal:1' && sent.ids.length === 1,
    JSON.stringify(sent),
  );
  await closed();
  // A number key picks an agent: 2 is the chat.
  await shoot();
  runs = fake.runs.length;
  await tab.keyboard.press('2');
  const toChat = await until('the chat send', () => fake.runs[runs]);
  assert(toChat.target === 'chat', JSON.stringify(toChat));
  await closed();
  // Esc keeps it saved without sending.
  before = saved().length;
  await shoot();
  runs = fake.runs.length;
  await tab.keyboard.press('Escape');
  await closed();
  await new Promise((resolve) => setTimeout(resolve, 300));
  assert(fake.runs.length === runs && saved().length === before + 1, 'Esc sent it, or lost it');
  // Even while it says "Saving…".
  before = saved().length;
  await clickAt('button', 'Screenshot');
  await clickAt('.menu-item', 'Visible area');
  await until('the dialog', async () => (await dialogText()) !== undefined, 20_000);
  await tab.keyboard.press('Escape');
  await closed();
  await until('saved anyway', () => saved().length === before + 1);

  // The element picker: Shift+click selects several; the bar over them captures all of them.
  await clickAt('button', 'Select an element');
  await until('picker on', () => inToolbar((shadow) => !!shadow.querySelector('.inspect-hint')));
  const hint = await inToolbar((shadow) => shadow.querySelector('.inspect-hint')?.textContent);
  assert(/to capture/.test(hint) && /screenshot/.test(hint) && /to add/.test(hint), hint);
  const centerOf = async (selector) => {
    const b = await (await tab.$(selector)).boundingBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  };
  const modClick = async (selector, ...mods) => {
    const p = await centerOf(selector);
    await tab.mouse.move(p.x, p.y);
    for (const mod of mods) await tab.keyboard.down(mod);
    await tab.mouse.click(p.x, p.y);
    for (const mod of [...mods].reverse()) await tab.keyboard.up(mod);
  };
  await modClick('#login h2', 'Shift');
  await modClick('button.primary', 'Shift');
  const bar = await until('the selection bar', () =>
    inToolbar((shadow) => shadow.querySelector('.selection-bar')?.textContent),
  );
  assert(/2\s*selected/.test(bar) && bar.includes('Capture') && bar.includes('Screenshot'), bar);
  before = saved().length;
  await clickAt('.selection-bar button', 'Capture');
  await until('the dialog for both', async () =>
    (await dialogText())?.includes('2 elements') ? true : undefined,
  );
  const elements = await until('both saved', () => {
    const items = saved();
    return items.length === before + 2 ? items.filter((i) => i.kind === 'element') : undefined;
  });
  const group = elements.find((i) => i.group)?.group;
  assert(group && elements.filter((i) => i.group === group).length === 2, 'not saved as a group');
  assert(!(await inToolbar((shadow) => !!shadow.querySelector('.selection-bar'))), 'bar stayed');
  runs = fake.runs.length;
  await clickAt('.ink-modal-send', 'Chat');
  const both = await until('the group send', () => fake.runs[runs]);
  assert(both.target === 'chat' && both.ids.length === 2, JSON.stringify(both));
  await closed();
  // Screenshots of several: one group, offered together.
  await modClick('#login h2', 'Shift');
  await modClick('button.primary', 'Shift');
  await until('the selection bar again', () =>
    inToolbar((shadow) => !!shadow.querySelector('.selection-bar')),
  );
  before = saved().length;
  await clickAt('.selection-bar button', 'Screenshot');
  await until('two images in the dialog', async () =>
    (await inToolbar((shadow) => shadow.querySelectorAll('.ink-modal-thumbs img').length)) === 2
      ? true
      : undefined,
  );
  await until('both screenshots saved', () => saved().length === before + 2);
  await tab.keyboard.press('Escape');
  await closed();
  await tab.keyboard.press('Escape');
  await until(
    'picker off',
    async () => !(await inToolbar((s) => !!s.querySelector('.inspect-hint'))),
  );

  // The console panel's page context is a capture like the others.
  await clickAt('button', 'Console and network');
  await clickAt('.panel-group button', 'Copy page context');
  await closeDialog('Page context');
  assert(
    saved().some((i) => i.kind === 'page'),
    'page context not saved',
  );
  await clickAt('button', 'Console and network');
});

await test('the star shows whether the page is bookmarked, and toggles it', async () => {
  if (!(await inToolbar((shadow) => !!shadow.querySelector('.bar')))) {
    await worker.evaluate((id) => globalThis.__inkspectTest.toggleToolbar(id), tabId);
  }
  const star = () =>
    inToolbar((shadow) => {
      const b = [...shadow.querySelectorAll('.bar button')].find((x) =>
        /bookmark/i.test(x.getAttribute('aria-label') ?? ''),
      );
      return b?.querySelector('.codicon')?.className ?? '';
    });
  const count = () =>
    worker.evaluate(async (u) => (await chrome.bookmarks.search({ url: u })).length, url);
  await until('empty star', async () => (await star()).includes('star-empty'));
  assert(await clickButton('Bookmark this page'), 'no star');
  await until('filled star', async () => (await star()).includes('star-full'));
  assert((await count()) === 1, 'not bookmarked');
  assert(await clickButton('Remove bookmark'), 'no remove');
  await until('empty again', async () => (await star()).includes('star-empty'));
  assert((await count()) === 0, 'bookmark kept');
});

await browser.close();

// ---------------------------------------------------------------------------------------------
// The real build: a closed shadow root, opened through the extension's button (activeTab)
// ---------------------------------------------------------------------------------------------

// The test build opens its shadow root, which hides bugs of the real one: from outside a closed
// root, events don't show what they hit inside it. These tests use the real build and reach its
// elements through the DevTools protocol, which sees closed roots, with real mouse clicks.
const realBrowser = await puppeteer.launch({
  executablePath: await chromePath(),
  headless: true,
  pipe: true,
  enableExtensions: true,
  defaultViewport: { width: 1200, height: 800 },
  args: ['--no-first-run'],
});
const realId = await realBrowser.installExtension(join(root, 'dist', 'chrome'));
// The settings page opens on install and would take focus from the page.
await (
  await (await realBrowser.waitForTarget((t) => t.url().includes('options.html'))).page()
)?.close();
const real = await realBrowser.newPage();
for (const other of await realBrowser.pages()) if (other !== real) await other.close();
await realBrowser
  .defaultBrowserContext()
  .overridePermissions(new URL(url).origin, [
    'clipboard-read',
    'clipboard-write',
    'clipboard-sanitized-write',
  ]);
await real.goto(url);
await real.bringToFront();
const cdp = await real.createCDPSession();

/** Nodes of the page, closed shadow roots included, matching `test` on their attributes/text. */
async function findNode(test) {
  const { root: doc } = await cdp.send('DOM.getDocument', { depth: -1, pierce: true });
  const found = [];
  const walk = (node) => {
    const attrs = {};
    for (let i = 0; i < (node.attributes?.length ?? 0); i += 2)
      attrs[node.attributes[i]] = node.attributes[i + 1];
    const text = (node.children ?? [])
      .filter((c) => c.nodeType === 3)
      .map((c) => c.nodeValue)
      .join('');
    if (node.nodeType === 1 && test(attrs, text, node.nodeName)) found.push(node);
    for (const child of [
      ...(node.children ?? []),
      ...(node.shadowRoots ?? []),
      ...(node.contentDocument ? [node.contentDocument] : []),
    ])
      walk(child);
  };
  walk(doc);
  return found[0];
}
async function clickNode(test, what) {
  const node = await until(what, () => findNode(test));
  const { model } = await cdp.send('DOM.getBoxModel', { backendNodeId: node.backendNodeId });
  const [x1, y1, , , x3, y3] = model.border;
  await real.mouse.click((x1 + x3) / 2, (y1 + y3) / 2);
}
const byLabel = (label) => (attrs) => attrs['aria-label']?.startsWith(label);
const withText = (text) => (_attrs, own) => own.includes(text);

await test('real build: opens from its button, and its menus and lists take real clicks', async () => {
  const session = await realBrowser.target().createCDPSession();
  const { targetInfos } = await session.send('Target.getTargets', { filter: [{ type: 'tab' }] });
  const tabTarget = targetInfos.find((t) => t.url === url)?.targetId;
  // The button opens the popup; its first button opens the toolbar on the page.
  await session.send('Extensions.triggerAction', { id: realId, targetId: tabTarget });
  const popup = await (
    await realBrowser.waitForTarget((t) => t.url().endsWith('/popup.html'), { timeout: 10_000 })
  ).asPage();
  await popup.waitForSelector('.open-toolbar');
  const popupText = await popup.evaluate(() => document.body.textContent ?? '');
  assert(/Open toolbar on this page/.test(popupText), popupText);
  assert(/Element picker/.test(popupText) && /Open Inkspect/.test(popupText), popupText);
  await popup.click('.open-toolbar');
  await until('toolbar', () => real.evaluate(() => !!document.querySelector('inkspect-toolbar')));
  // Let the bar finish sliding in, so clicks land where the boxes were measured.
  await new Promise((resolve) => setTimeout(resolve, 500));
  // A menu item: the screenshot is taken and copied.
  await clickNode(byLabel('Screenshot'), 'screenshot button');
  await clickNode(withText('Visible area'), 'menu item');
  // The send dialog, closed with a real click on its button (it stays saved).
  await until('the send dialog', () => findNode((a) => a.role === 'dialog'), 20_000);
  await clickNode(byLabel('Close (it stays saved)'), 'dialog close');
  await until('the dialog closed', async () => !(await findNode((a) => a.role === 'dialog')));
  // A select list in the responsive view: the device changes.
  await clickNode(byLabel('Responsive view'), 'responsive button');
  await clickNode((a) => a.role === 'combobox' && a['aria-label'] === 'Device', 'device list');
  await clickNode(withText('iPad Mini'), 'device option');
  await until('iPad size', () =>
    findNode((a, own) => a.class === 'rv-caption' && own.includes('768')),
  );
  // "Custom size" keeps the size editable, with typing going to the width box.
  await clickNode((a) => a.role === 'combobox' && a['aria-label'] === 'Device', 'device list');
  await clickNode(withText('Custom size'), 'custom size option');
  await new Promise((resolve) => setTimeout(resolve, 200));
  await real.keyboard.type('500');
  await real.keyboard.press('Enter');
  await until('custom size', () =>
    findNode(
      (a, own) => a.class === 'rv-caption' && own.includes('Custom size') && own.includes('500'),
    ),
  );
  // Esc leaves the element picker even though focus stays on its button.
  await clickNode(byLabel('Close the responsive view'), 'close view');
  await clickNode(byLabel('Select an element'), 'picker button');
  await until('picker on', () => findNode((a) => a.class?.split(' ').includes('inspect-hint')));
  await real.keyboard.press('Escape');
  await until(
    'picker off',
    async () => !(await findNode((a) => a.class?.split(' ').includes('inspect-hint'))),
  );
});

await realBrowser.close();

// ---------------------------------------------------------------------------------------------
// The browser helper (native messaging): Chrome starts the real hub, which links the browser to
// a VS Code window without pairing.
// ---------------------------------------------------------------------------------------------

await test('links through the browser helper, without pairing', async () => {
  // A short folder: Unix socket paths are limited to about 100 bytes.
  const home = mkdtempSync(join(tmpdir(), 'ink-'));
  const hubDir = join(home, 'hub');
  const profile = join(home, 'profile');
  const hubScript = join(home, 'hub.js');
  await esbuild.build({
    entryPoints: [join(root, '..', 'vscode-extension', 'src', 'hub', 'main.ts')],
    outfile: hubScript,
    bundle: true,
    platform: 'node',
    format: 'cjs',
    logLevel: 'warning',
  });
  const launcher = join(home, 'inkspect-hub');
  writeFileSync(
    launcher,
    // Its own state and data too: the machine's hub state (last project, sites) must not leak in.
    `#!/bin/sh\nINKSPECT_HUB_DIR='${hubDir}' XDG_STATE_HOME='${home}/state' XDG_DATA_HOME='${home}/data' INKSPECT_HUB_IDLE_MS=3000 INKSPECT_TMUX_SOCKETS= exec '${process.execPath}' '${hubScript}' "$@"\n`,
    { mode: 0o755 },
  );
  // Chrome reads user-level hosts from the profile's NativeMessagingHosts folder.
  mkdirSync(join(profile, 'NativeMessagingHosts'), { recursive: true });
  const { CHROME_EXTENSION_ID, HUB_HOST_NAME } = hub;
  writeFileSync(
    join(profile, 'NativeMessagingHosts', `${HUB_HOST_NAME}.json`),
    JSON.stringify({
      name: HUB_HOST_NAME,
      description: 'test',
      path: launcher,
      type: 'stdio',
      allowed_origins: [`chrome-extension://${CHROME_EXTENSION_ID}/`],
    }),
  );
  const helperBrowser = await puppeteer.launch({
    executablePath: await chromePath(),
    headless: true,
    pipe: true,
    enableExtensions: true,
    userDataDir: profile,
    args: ['--no-first-run'],
  });
  let vscode;
  try {
    const id = await helperBrowser.installExtension(extension);
    assert(id === CHROME_EXTENSION_ID, `the manifest key gives ${id}`);
    const helperWorker = await (
      await helperBrowser.waitForTarget(
        (t) => t.type() === 'service_worker' && t.url().startsWith(`chrome-extension://${id}/`),
      )
    ).worker();
    // The browser starts the hub; with no VS Code window yet, it says so.
    await until('the hub to start', () => existsSync(join(hubDir, 'hub.token')));
    await until('the status from the helper', () =>
      helperWorker.evaluate(() => {
        const status = globalThis.__inkspectTest.bridgeStatus();
        return status.via === 'hub' && status.state === 'offline' ? status : undefined;
      }),
    );
    // A VS Code window connects to the hub and answers the browser's hello.
    vscode = createConnection(join(hubDir, 'hub.sock'));
    await new Promise((resolve) => vscode.once('connect', resolve));
    const frame = (message) => {
      const body = Buffer.from(JSON.stringify({ v: 1, ...message }));
      const head = Buffer.alloc(4);
      head.writeUInt32LE(body.length);
      return Buffer.concat([head, body]);
    };
    const hellos = [];
    const runs = [];
    let buffer = Buffer.alloc(0);
    vscode.on('data', (chunk) => {
      buffer = Buffer.concat([buffer, chunk]);
      while (buffer.length >= 4 && buffer.length >= 4 + buffer.readUInt32LE(0)) {
        const message = JSON.parse(buffer.subarray(4, 4 + buffer.readUInt32LE(0)).toString());
        buffer = buffer.subarray(4 + buffer.readUInt32LE(0));
        if (message.type === 'run.send') {
          // The window's agent gets it.
          runs.push(message);
          vscode.write(
            frame({ type: 'run.sent', req: message.req, ok: true, sentTo: 'Claude Code' }),
          );
          continue;
        }
        if (message.type !== 'link') continue;
        const inner = JSON.parse(message.data);
        if (inner.type !== 'hello') continue;
        hellos.push(inner);
        const reply = (m) =>
          vscode.write(frame({ type: 'link', browser: message.browser, data: shared.encode(m) }));
        reply({ type: 'welcome', peer: 'VS Code (hub test)', syncBookmarks: false });
      }
    });
    const token = readFileSync(join(hubDir, 'hub.token'), 'utf8');
    vscode.write(frame({ type: 'auth', token, role: 'vscode' }));
    // The window has a project open: captures can be saved into it.
    const project = join(home, 'shop');
    mkdirSync(project);
    vscode.write(
      frame({
        type: 'window',
        id: 'w1',
        name: 'hub test',
        folders: [project],
        focusedAt: 1,
        // An agent in one of the window's terminals.
        targets: [{ id: 'terminal:1', kind: 'terminal', label: 'Claude Code', detail: 'terminal' }],
      }),
    );
    const status = await until('the link through the helper', () =>
      helperWorker.evaluate(() => {
        const status = globalThis.__inkspectTest.bridgeStatus();
        return status.state === 'connected' ? status : undefined;
      }),
    );
    assert(status.via === 'hub' && status.peer === 'VS Code (hub test)', JSON.stringify(status));
    // No token was needed or sent.
    assert(hellos[0]?.token === '', JSON.stringify(hellos));

    // A screenshot from the toolbar, saved into the project picked in its popup.
    const page = await helperBrowser.newPage();
    await page.goto(url);
    await page.bringToFront();
    const pageTab = await helperWorker.evaluate(
      async (u) => (await chrome.tabs.query({ url: u }))[0]?.id,
      url,
    );
    await helperWorker.evaluate((t) => globalThis.__inkspectTest.toggleToolbar(t), pageTab);
    const shadowCall = (fn, ...args) =>
      page.evaluate(
        (source, args) => {
          const shadow = document.querySelector('inkspect-toolbar')?.shadowRoot;
          return shadow
            ? new Function('shadow', 'args', `return (${source})(shadow, ...args)`)(shadow, args)
            : undefined;
        },
        fn.toString(),
        args,
      );
    await until('toolbar', () =>
      shadowCall((shadow) => shadow.querySelectorAll('.bar button').length),
    );
    await shadowCall((shadow) =>
      [...shadow.querySelectorAll('button')]
        .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('Screenshot'))
        ?.click(),
    );
    await until('menu', () => shadowCall((shadow) => shadow.querySelectorAll('.menu-item').length));
    const point = await shadowCall((shadow) => {
      const r = [...shadow.querySelectorAll('.menu-item')]
        .find((b) => b.textContent.includes('Visible area'))
        ?.getBoundingClientRect();
      return r && { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await page.mouse.click(point.x, point.y);
    // Saved at once into the suggested project (the window's folder); the dialog says so and
    // lists the project's agent.
    const dialog = () => shadowCall((shadow) => shadow.querySelector('.ink-modal')?.textContent);
    let lastDialog;
    const offered = await until(
      'the send dialog',
      async () => {
        const text = (lastDialog = await dialog());
        return text?.includes('Claude Code') && !text.includes('Saving') ? text : undefined;
      },
      20_000,
    ).catch((error) => {
      console.log('    dialog:', JSON.stringify(lastDialog));
      throw error;
    });
    assert(offered.includes('shop'), offered);
    const items = join(project, '.inkspect', 'items');
    const saved = await until('the capture in the project', () => {
      try {
        const [id] = readdirSync(items).filter((name) => !name.startsWith('.'));
        return id && readdirSync(join(items, id)).sort();
      } catch {
        return undefined;
      }
    });
    assert(
      JSON.stringify(saved) === JSON.stringify(['capture.png', 'item.json', 'thumb.jpg']),
      JSON.stringify(saved),
    );
    // Esc: it stays saved, nothing is sent.
    await page.keyboard.press('Escape');
    await until('the dialog closed', async () => (await dialog()) === undefined);
    assert(runs.length === 0, JSON.stringify(runs));

    // Element details: saved, then Enter hands them to the window's agent.
    const pickPoint = await page.evaluate(() => {
      const r = document.querySelector('#login h2').getBoundingClientRect();
      return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
    });
    await shadowCall((shadow) =>
      [...shadow.querySelectorAll('button')]
        .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('Select an element'))
        ?.click(),
    );
    await new Promise((resolve) => setTimeout(resolve, 300));
    await page.mouse.click(pickPoint.x, pickPoint.y);
    await until('the element in the dialog', async () => {
      const text = await dialog();
      return text?.includes('Element') && !text.includes('Saving') ? text : undefined;
    });
    await page.keyboard.press('Enter');
    await until('the sent status', async () => (await dialog())?.includes('Sent to Claude Code'));
    assert(runs.length === 1 && runs[0].target === 'terminal:1', JSON.stringify(runs));
    assert(runs[0].project === project && runs[0].ids.length === 1, JSON.stringify(runs));
    await until('the dialog closed after sending', async () => (await dialog()) === undefined);
    await page.keyboard.press('Escape');

    // The side panel: the page's project, its two captures, and their actions.
    const panel = await helperBrowser.newPage();
    await panel.goto(`chrome-extension://${id}/sidepanel.html`);
    await until('the project in the side panel', () =>
      panel.evaluate(() =>
        document.querySelector('.sp-project .select')?.textContent.includes('shop'),
      ),
    );
    const titlesIn = () =>
      panel.evaluate(() =>
        [...document.querySelectorAll('.saved-card-title')].map((e) => e.textContent),
      );
    const cards = await until('its captures', async () => {
      const titles = await titlesIn();
      return titles.length === 2 ? titles : undefined;
    });
    assert(
      cards.some((t) => t.startsWith('Element')),
      JSON.stringify(cards),
    );
    assert(
      await panel.evaluate(() =>
        document.querySelector('.sp-target')?.textContent.includes('Claude Code'),
      ),
      'no default agent shown',
    );
    const cardWith = (title, selector) =>
      panel.evaluate(
        (title, selector) =>
          [...document.querySelectorAll('.saved-card')]
            .find((li) => li.querySelector('.saved-card-title').textContent.startsWith(title))
            ?.querySelector(selector)
            ?.click(),
        title,
        selector,
      );
    // Send the screenshot from the panel: the window's agent gets it.
    await cardWith('Screenshot', '.saved-send button');
    await until('the send from the panel', () => runs.length === 2);
    assert(runs[1].ids.length === 1 && runs[1].target === 'terminal:1', JSON.stringify(runs[1]));
    await until('the sent note', () =>
      panel.evaluate(() =>
        document.querySelector('.sp-note')?.textContent.includes('Sent to Claude Code'),
      ),
    );
    // Remove the element capture, then take it back.
    await cardWith('Element', '[aria-label="Remove"]');
    await until('one capture left', async () => (await titlesIn()).length === 1);
    await panel.evaluate(() =>
      [...document.querySelectorAll('.saved-undo button')]
        .find((b) => b.textContent.includes('Undo'))
        ?.click(),
    );
    await until('the capture back', async () => (await titlesIn()).length === 2);

    // Change project in the dialog: the capture moves (here to the Inbox).
    await page.bringToFront();
    await shadowCall((shadow) =>
      [...shadow.querySelectorAll('button')]
        .find((b) => (b.getAttribute('aria-label') ?? '').startsWith('Screenshot'))
        ?.click(),
    );
    await until('menu again', () =>
      shadowCall((shadow) => shadow.querySelectorAll('.menu-item').length),
    );
    await shadowCall((shadow) =>
      [...shadow.querySelectorAll('.menu-item')]
        .find((b) => b.textContent.includes('Visible area'))
        ?.click(),
    );
    await until('the third dialog', async () => {
      const text = await dialog();
      return text?.includes('shop') && !text.includes('Saving') ? text : undefined;
    });
    const before = new Set(readdirSync(items));
    const third = readdirSync(items).length;
    assert(third === 3, `${third} items in shop`);
    await shadowCall((shadow) => shadow.querySelector('.ink-modal-project .select')?.click());
    await until('the project list', () =>
      shadowCall((shadow) =>
        [...shadow.querySelectorAll('.select-option')].some((o) => o.textContent.includes('Inbox')),
      ),
    );
    await shadowCall((shadow) =>
      [...shadow.querySelectorAll('.select-option')]
        .find((o) => o.textContent.includes('Inbox'))
        ?.click(),
    );
    await until('the dialog on the Inbox', async () => (await dialog())?.includes('Inbox'));
    const inboxItems = join(home, 'data', 'inkspect', 'inbox', '.inkspect', 'items');
    const moved = await until('the capture in the Inbox', () => {
      try {
        const ids = readdirSync(inboxItems);
        return ids.length === 1 ? ids[0] : undefined;
      } catch {
        return undefined;
      }
    });
    assert(before.has(moved) && !existsSync(join(items, moved)), 'not moved');
    await page.keyboard.press('Escape');
  } finally {
    vscode?.destroy();
    await helperBrowser.close();
    rmSync(home, { recursive: true, force: true });
  }
});

site.close();
linkServer.close();
wss.close();
rmSync(coreDir, { recursive: true, force: true });
const failed = results.filter((r) => !r).length;
console.log(`\n${results.length - failed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
