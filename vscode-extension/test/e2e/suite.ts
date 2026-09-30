// Integration tests. They run inside a VS Code instance (see runTests.mjs), drive the extension
// through its commands and read its state with the `vscodeBrowser.debug.state` command.
import * as assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { appendFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { join, sep } from 'node:path';
import * as vscode from 'vscode';

interface DebugTab {
  id: string;
  url: string;
  title: string;
  loading: boolean;
  zoom: number;
  internalPage?: string;
  live: boolean;
  private: boolean;
  emulation: { enabled: boolean; device?: { width: number; height: number } };
}

interface DebugPanel {
  ready: boolean;
  viewport?: { width: number; height: number; dpr: number };
  framesPosted: number;
  framesAcked: number;
  lastSavedImage?: string;
  activeTabId?: string;
  tabs: DebugTab[];
}

interface DebugState {
  engine: { status: string; message?: string; launches: number };
  bookmarks: { id: string; url: string; title: string }[];
  extensions: { id: string; name: string; enabled: boolean; popup?: string }[];
  history: { url: string; title: string; visitCount: number }[];
  panels: DebugPanel[];
  context: {
    id: string;
    kind: string;
    title: string;
    file?: string;
    url?: string;
    sentTo: string[];
    group?: string;
  }[];
  agents: { id: string; kind: string; label: string }[];
}

const state = async () =>
  (await vscode.commands.executeCommand<DebugState>('vscodeBrowser.debug.state'))!;
const exec = (command: string, ...args: unknown[]) =>
  vscode.commands.executeCommand(command, ...args);

/** Waits until `check` is true (for conditions outside the browser state). */
async function until(what: string, check: () => boolean, timeoutMs = 10_000): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (check()) return;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${what}.`);
}

async function waitFor<T>(
  what: string,
  check: (s: DebugState) => T | undefined | false | null,
  timeoutMs = 30_000,
): Promise<T> {
  const deadline = Date.now() + timeoutMs;
  let last: DebugState | undefined;
  while (Date.now() < deadline) {
    last = await state();
    const result = check(last);
    if (result) return result;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error(`Timed out waiting for ${what}. Last state: ${JSON.stringify(last, null, 2)}`);
}

const tabOf = (panel: DebugPanel | undefined) =>
  panel?.tabs.find((tab) => tab.id === panel.activeTabId);
const activeTab = (s: DebugState) => tabOf(s.panels[0]);

function startServer(): Promise<Server> {
  const page = (title: string) =>
    `<!doctype html><title>${title}</title><body style="font:16px sans-serif"><h1>${title}</h1><a href="/two">two</a></body>`;
  const server = createServer((request, response) => {
    response.writeHead(200, { 'content-type': 'text/html' });
    if (request.url === '/size') {
      // Reports the page's viewport size and touch support in its title.
      response.end(
        `<!doctype html><meta name="viewport" content="width=device-width"><title>size</title><script>document.title = innerWidth + 'x' + innerHeight + ' touch=' + navigator.maxTouchPoints;</script>`,
      );
      return;
    }
    if (request.url === '/errors') {
      // Logs an error, throws, and requests a missing file.
      response.end(
        `<!doctype html><title>errors</title><img src="/missing.png"><script>console.error('boom from fixture'); setTimeout(() => { throw new Error('uncaught fixture failure'); });</script>`,
      );
      return;
    }
    if (request.url === '/missing.png') {
      response.writeHead(404).end();
      return;
    }
    response.end(page(request.url === '/two' ? 'Page Two' : 'Page One'));
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

/** VS Code does not forward the extension host's console, so results also go to a file. */
const RESULTS_FILE = process.env.VSCODE_BROWSER_TEST_RESULTS;
function report(line: string): void {
  console.log(line);
  if (RESULTS_FILE)
    appendFileSync(
      RESULTS_FILE,
      `${line}
`,
    );
}

export async function run(): Promise<void> {
  if (RESULTS_FILE) writeFileSync(RESULTS_FILE, '');
  const server = await startServer();
  const base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const chromium = process.env.VSCODE_BROWSER_CHROMIUM;
  if (chromium) {
    await vscode.workspace
      .getConfiguration('vscodeBrowser')
      .update('chromium.executablePath', chromium, vscode.ConfigurationTarget.Global);
  }

  const failures: string[] = [];
  const test = async (name: string, body: () => Promise<void>) => {
    const started = Date.now();
    try {
      await body();
      report(`  ✓ ${name} (${Date.now() - started} ms)`);
    } catch (error) {
      console.log(
        `  ✗ ${name}\n${String(error instanceof Error ? (error.stack ?? error.message) : error)}`,
      );
      failures.push(name);
    }
  };

  try {
    await test('opens a URL in a new browser panel and loads it', async () => {
      await exec('vscodeBrowser.openUrl', `${base}/`);
      await waitFor('Page One to load', (s) => {
        const tab = activeTab(s);
        return tab?.title === 'Page One' && !tab.loading && tab;
      });
    });

    await test('streams frames that the webview draws and acknowledges', async () => {
      const panel = await waitFor('a frame to be acknowledged', (s) =>
        s.panels[0] && s.panels[0].framesAcked > 0 ? s.panels[0] : undefined,
      );
      assert.ok(panel.ready, 'webview reported ready');
      assert.ok((panel.viewport?.width ?? 0) > 0, 'webview reported its viewport size');
    });

    await test('new tab shows the new tab page', async () => {
      await exec('vscodeBrowser.newTab');
      const s = await waitFor('the new tab', (st) =>
        st.panels[0]?.tabs.length === 2 ? st : undefined,
      );
      assert.equal(activeTab(s)?.internalPage, 'newtab');
    });

    await test('opening a URL reuses the empty new tab', async () => {
      await exec('vscodeBrowser.openUrl', `${base}/two`);
      const s = await waitFor('Page Two to load', (st) =>
        activeTab(st)?.title === 'Page Two' && !activeTab(st)?.loading ? st : undefined,
      );
      assert.equal(s.panels[0]?.tabs.length, 2);
    });

    await test('home shows the new tab page and back returns to the page', async () => {
      await exec('vscodeBrowser.goHome');
      await waitFor('the home page', (s) => activeTab(s)?.internalPage === 'newtab');
      await exec('vscodeBrowser.goBack');
      await waitFor('Page Two again', (s) => activeTab(s)?.title === 'Page Two');
    });

    await test('zooms in and resets', async () => {
      await exec('vscodeBrowser.zoomIn');
      await waitFor('zoom 110%', (s) => activeTab(s)?.zoom === 1.1);
      await exec('vscodeBrowser.zoomReset');
      await waitFor('zoom 100%', (s) => activeTab(s)?.zoom === 1);
    });

    await test('closes and reopens a tab', async () => {
      await exec('vscodeBrowser.closeTab');
      await waitFor('one tab', (s) => s.panels[0]?.tabs.length === 1);
      await exec('vscodeBrowser.reopenClosedTab');
      await waitFor(
        'the reopened tab to load',
        (s) =>
          s.panels[0]?.tabs.length === 2 &&
          activeTab(s)?.title === 'Page Two' &&
          !activeTab(s)?.loading,
      );
    });

    await test('switches tabs', async () => {
      const before = activeTab(await state())?.id;
      await exec('vscodeBrowser.nextTab');
      await waitFor('another active tab', (s) => activeTab(s)?.id !== before);
    });

    await test('shows the downloads page', async () => {
      await exec('vscodeBrowser.showDownloads');
      await waitFor('the downloads page', (s) => activeTab(s)?.internalPage === 'downloads');
    });

    await test('restarts the engine and reloads the active page', async () => {
      await exec('vscodeBrowser.previousTab');
      const before = await waitFor('a web page tab', (s) => {
        const tab = activeTab(s);
        return tab && !tab.internalPage && tab.live && !tab.loading ? tab : undefined;
      });
      await exec('vscodeBrowser.restartEngine');
      await waitFor('the engine to run again', (s) => s.engine.status === 'running');
      await waitFor('the page to reload', (s) => {
        const tab = activeTab(s);
        return tab?.id === before.id && tab.live && !tab.loading && tab.url === before.url;
      });
    });

    await test('bookmarks the current page and removes the bookmark', async () => {
      // After the engine restart the page may still be loading its title.
      const page = await waitFor('the page title', (s) => {
        const tab = activeTab(s);
        return tab && !tab.loading && tab.title && !tab.url.endsWith(tab.title) ? tab : undefined;
      });
      await exec('vscodeBrowser.bookmarkPage');
      const bookmark = await waitFor('the bookmark', (s) =>
        s.bookmarks.find((b) => b.url === page?.url),
      );
      assert.equal(bookmark.title, page?.title);
      await exec('vscodeBrowser.removeBookmark', bookmark.id);
      await waitFor('the bookmark to go', (s) => !s.bookmarks.some((b) => b.id === bookmark.id));
    });

    await test('records visited pages in history', async () => {
      await waitFor('history entries', (s) =>
        [`${base}/`, `${base}/two`].every((url) => s.history.some((h) => h.url === url)),
      );
    });

    await test('private tabs do not record history', async () => {
      await exec('vscodeBrowser.newPrivateTab');
      await waitFor(
        'a private new tab',
        (s) => activeTab(s)?.private && activeTab(s)?.internalPage === 'newtab',
      );
      await exec('vscodeBrowser.openUrl', `${base}/secret`);
      await waitFor('the private page', (s) => {
        const tab = activeTab(s);
        return tab?.private && tab.url === `${base}/secret` && !tab.loading && tab.live;
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
      assert.ok(!(await state()).history.some((h) => h.url === `${base}/secret`));
      await exec('vscodeBrowser.closeTab');
    });

    await test('opens the history and bookmark manager pages', async () => {
      await exec('vscodeBrowser.showHistory');
      await waitFor('the history page', (s) => activeTab(s)?.internalPage === 'history');
      await exec('vscodeBrowser.showBookmarks');
      await waitFor('the bookmarks page', (s) => activeTab(s)?.internalPage === 'bookmarks');
    });

    await test('emulates a device and turns emulation off again', async () => {
      await exec('vscodeBrowser.openUrl', `${base}/size`);
      await waitFor(
        'the size page',
        (s) => activeTab(s)?.url === `${base}/size` && !activeTab(s)?.loading,
      );
      await exec('vscodeBrowser.emulateDevice', 'iphone-se');
      await exec('vscodeBrowser.reload');
      await waitFor('the iPhone SE viewport', (s) => activeTab(s)?.title === '375x667 touch=5');
      await exec('vscodeBrowser.toggleDeviceToolbar');
      await waitFor('emulation off', (s) => activeTab(s)?.emulation.enabled === false);
      await exec('vscodeBrowser.reload');
      await waitFor('the normal viewport', (s) => {
        const title = activeTab(s)?.title ?? '';
        return /^\d+x\d+ touch=0$/.test(title) && title !== '375x667 touch=0';
      });
    });

    await test('copies element details for AI agents', async () => {
      await exec('vscodeBrowser.openUrl', `${base}/`);
      await waitFor(
        'Page One',
        (s) => activeTab(s)?.title === 'Page One' && !activeTab(s)?.loading,
      );
      await vscode.env.clipboard.writeText('');
      // The page's <h1> is at the top left. A freshly loaded page may not be laid out yet.
      let text = '';
      for (let attempt = 0; attempt < 25 && !text; attempt++) {
        await exec('vscodeBrowser.debug.copyElementAt', 30, 30);
        text = await vscode.env.clipboard.readText();
        if (!text) await new Promise((resolve) => setTimeout(resolve, 200));
      }
      assert.match(text, /### Element: `h1`/);
      assert.match(text, /- Selector: `h1`/);
      assert.ok(text.includes('```html\n<h1>Page One</h1>'), text);
    });

    await test('saves viewport and full-page screenshots', async () => {
      for (const command of [
        'vscodeBrowser.screenshot.viewport',
        'vscodeBrowser.screenshot.fullPage',
      ]) {
        const path = await exec(command);
        assert.equal(typeof path, 'string', `${command} returned a path`);
        assert.ok(existsSync(path as string));
        const header = readFileSync(path as string).subarray(0, 8);
        assert.equal(header.toString('hex'), '89504e470d0a1a0a', 'PNG file');
      }
    });

    await test('sends the last screenshot to an agent terminal', async () => {
      let typed = '';
      const writeEmitter = new vscode.EventEmitter<string>();
      const terminal = vscode.window.createTerminal({
        name: 'claude',
        pty: {
          onDidWrite: writeEmitter.event,
          open: () => {},
          close: () => {},
          handleInput: (data: string) => (typed += data),
        },
      });
      try {
        await waitFor('the agent terminal', (s) =>
          s.agents.some((a) => a.kind === 'terminal' && a.label === 'Claude Code'),
        );
        const path = (await exec('vscodeBrowser.screenshot.viewport')) as string;
        // Every capture lands in the Agent Context list.
        const item = await waitFor('the screenshot in Agent Context', (s) =>
          s.context.find(
            (i) => i.kind === 'screenshot' && i.file && path.endsWith(i.file.replace(/\//g, sep)),
          ),
        );
        assert.equal(await exec('vscodeBrowser.screenshot.sendToTerminal'), 'Claude Code');
        for (const deadline = Date.now() + 5000; !typed && Date.now() < deadline;) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        assert.ok(typed.includes(path), typed);
        assert.ok(!/[\r\n]/.test(typed), 'Enter must not be pressed');
        await waitFor('the item marked as sent', (s) =>
          s.context.find((i) => i.id === item.id)?.sentTo.includes('Claude Code'),
        );
        // The "send latest" shortcut's command sends what was captured last.
        typed = '';
        await exec('vscodeBrowser.debug.copyElementAt', 30, 30);
        await waitFor('the element in Agent Context', (s) => s.context[0]?.kind === 'element');
        assert.equal(await exec('vscodeBrowser.sendLatestContext'), 'Claude Code');
        for (
          const deadline = Date.now() + 5000;
          !typed.includes('\x1b[201~') && Date.now() < deadline;
        ) {
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // Agent CLIs get the details themselves, as one paste (so their newlines don't submit).
        assert.ok(typed.startsWith('\x1b[200~'), JSON.stringify(typed.slice(0, 40)));
        assert.match(typed, /### Element: `h1`/);
        // Line breaks inside a paste don't submit; outside one they would.
        const outside = typed
          .split('\x1b[200~')
          .map((part) => part.split('\x1b[201~').at(-1))
          .join('');
        assert.ok(!outside.includes('\r'), 'Enter must not be pressed');
      } finally {
        terminal.dispose();
      }
    });

    await test('screenshots only the area around a drawing', async () => {
      const style = { color: '#ff3b30', width: 4, opacity: 1, dash: 'solid', fill: false };
      await exec('vscodeBrowser.debug.setAnnotations', [
        { id: 'r1', kind: 'rect', start: [50, 50], end: [150, 100], style },
      ]);
      const before = (await state()).panels[0]?.lastSavedImage;
      await exec('vscodeBrowser.screenshot.annotations');
      const path = await waitFor('the drawing screenshot', (s) => {
        const saved = s.panels[0]?.lastSavedImage;
        return saved && saved !== before ? saved : undefined;
      });
      const png = readFileSync(path);
      assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
      // Shape bounds (48,48)-(152,102) plus 40px padding: 184 × 134 CSS pixels.
      const width = png.readUInt32BE(16);
      const height = png.readUInt32BE(20);
      assert.ok(Math.abs(width / height - 184 / 134) < 0.02, `${width}x${height}`);
      assert.ok(width >= 184 && width <= 184 * 3, `${width}x${height}`);
    });

    await test('copies console errors and failed requests for AI agents', async () => {
      await exec('vscodeBrowser.openUrl', `${base}/errors`);
      await waitFor('the error page', (s) => activeTab(s)?.title === 'errors');
      let text = '';
      for (const deadline = Date.now() + 5000; Date.now() < deadline;) {
        text = String((await exec('vscodeBrowser.copyConsoleErrors')) ?? '');
        if (text.includes('uncaught fixture failure')) break;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
      assert.match(text, /boom from fixture/);
      assert.match(text, /uncaught fixture failure/);
      // Console errors are collected in Agent Context as they happen.
      await waitFor('the console errors in Agent Context', (s) =>
        s.context.some((i) => i.kind === 'errors' && i.url === `${base}/errors`),
      );
      assert.equal(await vscode.env.clipboard.readText(), text);
      const context = String(await exec('vscodeBrowser.copyPageContext'));
      assert.ok(context.includes(`${base}/errors`), context);
      assert.match(context, /boom from fixture/);
    });

    await test('opens Chrome DevTools for the active tab in an editor', async () => {
      await exec('vscodeBrowser.openDevTools');
      const devtoolsTab = () =>
        vscode.window.tabGroups.all
          .flatMap((group) => group.tabs)
          .find((tab) => tab.label.startsWith('DevTools:'));
      await waitFor('a DevTools editor', () => devtoolsTab());
      await vscode.window.tabGroups.close(devtoolsTab()!);
    });

    await test('language model tools drive the browser', async () => {
      await vscode.workspace
        .getConfiguration('vscodeBrowser')
        .update('agent.confirmNavigation', false, vscode.ConfigurationTarget.Global);
      const text = async (name: string, input: object) => {
        const result = await vscode.lm.invokeTool(name, { input, toolInvocationToken: undefined });
        return result.content
          .map((part) => (part instanceof vscode.LanguageModelTextPart ? part.value : ''))
          .join('');
      };
      assert.match(await text('browser_navigate', { url: `${base}/two` }), /Title: Page Two/);
      assert.match(await text('browser_get_element', { selector: 'h1' }), /### Element: `h1`/);
      await assert.rejects(text('browser_get_element', { selector: '#missing' }), /No element/);
      const shot = await text('browser_screenshot', { selector: 'h1' });
      const path = /saved to (.+)$/.exec(shot)?.[1];
      assert.ok(path && existsSync(path), shot);
      assert.match(await text('browser_get_page_text', {}), /URL: .*\/two[\s\S]*Page Two/);
    });

    await test('the MCP server serves the tools over HTTP with a token', async () => {
      const config = vscode.workspace.getConfiguration('vscodeBrowser');
      await config.update('mcp.enabled', true, vscode.ConfigurationTarget.Global);
      try {
        const { url, token } = (await exec('vscodeBrowser.debug.mcp')) as {
          url: string;
          token: string;
        };
        const rpc = (body: object, auth: string = token) =>
          fetch(url, {
            method: 'POST',
            headers: {
              'content-type': 'application/json',
              accept: 'application/json, text/event-stream',
              authorization: `Bearer ${auth}`,
            },
            body: JSON.stringify(body),
          });
        assert.equal((await rpc({ jsonrpc: '2.0', id: 1, method: 'ping' }, 'wrong')).status, 401);
        const init = await rpc({
          jsonrpc: '2.0',
          id: 1,
          method: 'initialize',
          params: {
            protocolVersion: '2025-06-18',
            capabilities: {},
            clientInfo: { name: 't', version: '1' },
          },
        });
        assert.equal(init.status, 200);
        assert.equal(
          (await rpc({ jsonrpc: '2.0', method: 'notifications/initialized' })).status,
          202,
        );
        const list = (await (
          await rpc({ jsonrpc: '2.0', id: 2, method: 'tools/list' })
        ).json()) as {
          result: { tools: { name: string }[] };
        };
        assert.ok(list.result.tools.some((t) => t.name === 'browser_screenshot'));
        const call = (await (
          await rpc({
            jsonrpc: '2.0',
            id: 3,
            method: 'tools/call',
            params: { name: 'browser_get_element', arguments: { selector: 'h1' } },
          })
        ).json()) as { result: { content: { text: string }[] } };
        assert.match(call.result.content[0]!.text, /### Element: `h1`/);
      } finally {
        await config.update('mcp.enabled', undefined, vscode.ConfigurationTarget.Global);
      }
    });

    await test('the browser extension link pairs, rejects strangers and syncs bookmarks', async () => {
      // Its own port: a real VS Code on this machine may already serve the default one.
      await vscode.workspace
        .getConfiguration('vscodeBrowser')
        .update('bridge.port', 47_190, vscode.ConfigurationTarget.Global);
      const { port, code } = (await exec('vscodeBrowser.debug.bridge', {
        firstSyncMode: 'merge',
      })) as {
        port: number;
        code: string;
      };
      const url = `ws://127.0.0.1:${port}/bridge`;
      const origin = 'chrome-extension://abcdefghijklmnopabcdefghijklmnop';
      // Web pages can't connect.
      const stranger = await new Promise<string>((resolve) => {
        const socket = new WebSocket(url, { origin: 'https://evil.example' });
        socket.on('error', (error) => resolve(String(error)));
        socket.on('open', () => resolve('opened'));
      });
      assert.match(stranger, /403/);
      const socket = new WebSocket(url, { origin });
      const received: { type: string; [key: string]: unknown }[] = [];
      socket.on('message', (data) => received.push(JSON.parse(String(data))));
      await new Promise((resolve, reject) => {
        socket.on('open', resolve);
        socket.on('error', reject);
      });
      const send = (message: object) => socket.send(JSON.stringify({ v: 1, ...message }));
      const next = async (type: string) => {
        for (const deadline = Date.now() + 10_000; Date.now() < deadline;) {
          const index = received.findIndex((m) => m.type === type);
          if (index !== -1) return received.splice(index, 1)[0]!;
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        throw new Error(`no ${type} (got ${JSON.stringify(received)})`);
      };
      const client = { id: 'e2e-browser', browser: 'Test Browser' };
      try {
        send({ type: 'hello', client, token: 'not-a-token' });
        assert.equal((await next('error')).code, 'unpaired');
      } catch (error) {
        socket.terminate();
        throw error;
      }
      const paired = new WebSocket(url, { origin });
      paired.on('message', (data) => received.push(JSON.parse(String(data))));
      await new Promise((resolve) => paired.on('open', resolve));
      const sendPaired = (message: object) => paired.send(JSON.stringify({ v: 1, ...message }));
      try {
        // A browser that was never paired announces itself and stays connected for pairing.
        sendPaired({ type: 'hello', client, token: '' });
        assert.equal((await next('error')).code, 'unpaired');
        await new Promise((resolve) => setTimeout(resolve, 300));
        assert.equal(paired.readyState, WebSocket.OPEN, 'the unpaired browser was disconnected');
        // Its offer is shared with every window, and so is the pairing code.
        const { code: fresh, offers } = (await exec('vscodeBrowser.debug.bridge')) as {
          code: string;
          offers: string[];
        };
        assert.ok(offers.includes(client.id), JSON.stringify(offers));
        assert.notEqual(fresh, code);
        sendPaired({ type: 'pair', code, client });
        assert.equal((await next('error')).code, 'bad-code', 'a replaced code still worked');
        sendPaired({ type: 'pair', code: fresh, client });
        assert.ok((await next('paired')).token);
        const after = (await exec('vscodeBrowser.debug.bridge')) as { offers: string[] };
        assert.ok(!after.offers.includes(client.id), 'the offer stayed after pairing');
        await next('welcome');
        sendPaired({
          type: 'bookmarks.snapshot',
          tree: [
            {
              id: 'b1',
              parentId: 'bar',
              index: 0,
              title: 'From the browser',
              url: 'https://browser-sync.dev/',
            },
          ],
        });
        await waitFor('the synced bookmark', (s) =>
          s.bookmarks.find((b) => b.url === 'https://browser-sync.dev/'),
        );
        // VS Code sends its own bookmarks for the browser to create, if it has any.
        const ops = received.find((m) => m.type === 'bookmarks.ops');
        if (ops) sendPaired({ type: 'bookmarks.applied', created: {}, failed: [] });
        // A screenshot sent from the browser is saved by VS Code.
        const png =
          'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
        sendPaired({
          type: 'send',
          id: 's1',
          target: 'save',
          image: png,
          label: 'Test shot',
          pageUrl: 'https://x.dev/',
        });
        const result = await next('send.result');
        assert.equal(result.ok, true, JSON.stringify(result));
        assert.ok(existsSync(String(result.path)), String(result.path));

        // VS Code sends its shortcuts after linking; newer ones from the browser's sync win.
        const settings = vscode.workspace.getConfiguration('vscodeBrowser');
        assert.equal(typeof (await next('settings.shortcuts')).updated, 'number');
        // Another device's clock may run ahead: its time is in the future here.
        const browserTime = Date.now() + 60_000;
        sendPaired({
          type: 'settings.shortcuts',
          shortcuts: { 'mode.draw': 'ctrl+alt+d' },
          updated: browserTime,
        });
        await until(
          'the shortcut from the browser',
          () =>
            vscode.workspace
              .getConfiguration('vscodeBrowser')
              .get<Record<string, unknown>>('shortcuts')?.['mode.draw'] === 'ctrl+alt+d',
        );
        // A change in VS Code (even edited by hand, without a new time) reaches the browser as
        // the newer copy.
        received.splice(0, received.length);
        await settings.update(
          'shortcuts',
          { 'mode.draw': 'ctrl+alt+x' },
          vscode.ConfigurationTarget.Global,
        );
        await until('the edited shortcuts sent to the browser', () =>
          received.some(
            (m) =>
              m.type === 'settings.shortcuts' &&
              (m.shortcuts as Record<string, unknown>)['mode.draw'] === 'ctrl+alt+x' &&
              (m.updated as number) > browserTime,
          ),
        );
        await settings.update('shortcuts', undefined, vscode.ConfigurationTarget.Global);
        await settings.update('shortcutsUpdated', undefined, vscode.ConfigurationTarget.Global);

        // Text for the agent is typed into the agent's terminal (without pressing Enter).
        const typed: string[] = [];
        const output = new vscode.EventEmitter<string>();
        const terminal = vscode.window.createTerminal({
          name: 'claude (test)',
          pty: {
            onDidWrite: output.event,
            open: () => {},
            close: () => {},
            handleInput: (data: string) => typed.push(data),
          },
        });
        try {
          terminal.show(true);
          await new Promise((resolve) => setTimeout(resolve, 500));
          sendPaired({ type: 'send', id: 's2', target: 'terminal', text: 'Fix the header' });
          const sent = await next('send.result');
          assert.equal(sent.ok, true, JSON.stringify(sent));
          await until('the text in the terminal', () => typed.join('').includes('Fix the header'));
          assert.ok(!typed.join('').includes('\r'), 'Enter was pressed');

          // Screenshots taken together: one group in Agent Context, and one send with both.
          const run = Date.now();
          for (const n of [1, 2]) {
            sendPaired({
              type: 'send',
              id: `g${n}`,
              target: 'context',
              image: png,
              label: `Drawings ${n} of 2`,
              capture: `group-${run}-${n}`,
              group: `group-${run}`,
              kind: 'screenshot',
            });
            assert.equal((await next('send.result')).ok, true);
          }
          const grouped = await waitFor('the grouped captures', (st) => {
            const items = st.context.filter((c) => c.title.startsWith('Drawings ') && c.group);
            return items.length === 2 ? items : undefined;
          });
          assert.equal(grouped[0]!.group, grouped[1]!.group);
          typed.length = 0;
          sendPaired({
            type: 'send',
            id: 'g3',
            target: 'terminal',
            label: '2 screenshots',
            kind: 'screenshot',
            captures: [`group-${run}-1`, `group-${run}-2`],
          });
          const together = await next('send.result');
          assert.equal(together.ok, true, JSON.stringify(together));
          // Both paths, pasted together (one after the other in the same send).
          await until(
            'both screenshots in the terminal',
            () => (typed.join('').match(/\.png/g) ?? []).length >= 2,
          );
          const marked = await waitFor('both marked as sent', (st) => {
            const items = st.context.filter((c) => c.group === grouped[0]!.group);
            return items.every((c) => c.sentTo.length) ? items : undefined;
          });
          assert.equal(marked.length, 2);
          // Captures not in this window's list are refused (the browser sends them again).
          sendPaired({
            type: 'send',
            id: 'g4',
            target: 'chat',
            captures: ['not-here'],
          });
          assert.equal((await next('send.result')).ok, false);

          // A capture reaches the Agent Context list by itself ("context"), and a later send of
          // the same capture reuses that item instead of adding another.
          const capture = `cap-${Date.now()}`;
          sendPaired({
            type: 'send',
            id: 's3',
            target: 'context',
            text: 'The header overlaps the logo',
            label: 'Element header.site',
            kind: 'element',
            capture,
            pageUrl: 'https://x.dev/',
          });
          assert.equal((await next('send.result')).ok, true);
          const shared = await waitFor('the capture in Agent Context', (st) =>
            st.context.find((c) => c.title === 'Element header.site'),
          );
          assert.equal(shared.kind, 'element');
          assert.deepEqual(shared.sentTo, []);
          sendPaired({
            type: 'send',
            id: 's4',
            target: 'terminal',
            text: 'The header overlaps the logo',
            label: 'Element header.site',
            kind: 'element',
            capture,
          });
          assert.equal((await next('send.result')).ok, true);
          const after = await waitFor('the capture sent', (st) => {
            const items = st.context.filter((c) => c.title === 'Element header.site');
            return items.length === 1 && items[0]!.sentTo.length ? items : undefined;
          });
          assert.equal(after[0]!.id, shared.id);
        } finally {
          terminal.dispose();
          output.dispose();
        }
      } finally {
        socket.terminate();
        paired.terminate();
      }
    });

    await test('a Pair click in VS Code pairs the waiting browser without a code', async () => {
      const { port } = (await exec('vscodeBrowser.debug.bridge')) as { port: number };
      const origin = 'chrome-extension://bcdefghijklmnopabcdefghijklmnopa';
      const sockets: WebSocket[] = [];
      /** A browser that was never paired: connects, says hello without a token, and waits. */
      const waiting = async (id: string) => {
        const socket = new WebSocket(`ws://127.0.0.1:${port}/bridge`, { origin });
        sockets.push(socket);
        const received: string[] = [];
        socket.on('message', (data) => received.push(String(JSON.parse(String(data)).type)));
        await new Promise((resolve) => socket.on('open', resolve));
        const client = { id, browser: `Browser ${id}` };
        socket.send(JSON.stringify({ v: 1, type: 'hello', client, token: '' }));
        await until(`${id} to wait`, () => received.includes('error'));
        return { socket, received };
      };
      try {
        const run = Date.now();
        // The click names the waiting browser: it gets a token and is linked at once.
        const a = await waiting(`click-a-${run}`);
        const { offers } = (await exec('vscodeBrowser.debug.bridge')) as { offers: string[] };
        assert.ok(offers.includes(`click-a-${run}`), JSON.stringify(offers));
        await exec('vscodeBrowser.debug.bridge', { approve: `click-a-${run}` });
        await until('the token for the clicked browser', () => a.received.includes('paired'));
        await until('the welcome', () => a.received.includes('welcome'));
        const after = (await exec('vscodeBrowser.debug.bridge')) as { offers: string[] };
        assert.ok(!after.offers.includes(`click-a-${run}`), 'the offer stayed after pairing');

        // A click without a name never picks one of two waiting browsers...
        const b = await waiting(`click-b-${run}`);
        const c = await waiting(`click-c-${run}`);
        await exec('vscodeBrowser.debug.bridge', { approve: true });
        await new Promise((resolve) => setTimeout(resolve, 1_500));
        assert.ok(!b.received.includes('paired'), 'one of two waiting browsers was picked');
        assert.ok(!c.received.includes('paired'), 'one of two waiting browsers was picked');
        // ...and pairs the one left once the other goes away.
        c.socket.terminate();
        await until('the one left waiting to be paired', () => b.received.includes('paired'));

        // A click before the browser shows up pairs it when it connects.
        await exec('vscodeBrowser.debug.bridge', { approve: true });
        const d = await waiting(`click-d-${run}`);
        await until('the browser that came after the click to be paired', () =>
          d.received.includes('paired'),
        );

        // Unlink drops linked browsers, and their tokens stop working.
        const closed = new Promise<number>((resolve) => d.socket.on('close', resolve));
        await exec('vscodeBrowser.bridge.forget', { confirm: false });
        assert.equal(await closed, 4001);
      } finally {
        for (const socket of sockets) socket.terminate();
      }
    });

    await test('loads an unpacked extension whose content script runs, then removes it', async () => {
      const root = vscode.extensions.getExtension('your-publisher.vscode-browser')!.extensionPath;
      const folder = join(root, 'test', 'fixtures', 'extensions', 'hello');
      await exec('vscodeBrowser.extensions.loadUnpacked', folder);
      const extension = await waitFor('the extension', (s) =>
        s.extensions.find((e) => e.name === 'Hello Fixture' && e.enabled),
      );
      assert.equal(extension.popup, 'popup.html');
      await exec('vscodeBrowser.openUrl', `${base}/two`);
      await waitFor('the content script', (s) => activeTab(s)?.title === 'Page Two [hello]');
      await exec('vscodeBrowser.extensions.remove', extension.id);
      await waitFor('no extensions', (s) => s.extensions.length === 0);
      await exec('vscodeBrowser.reload');
      await waitFor(
        'the page without the content script',
        (s) => activeTab(s)?.title === 'Page Two',
      );
    });

    await test('restarts by itself after the engine crashes and reloads the page', async () => {
      await exec('vscodeBrowser.openUrl', `${base}/two`);
      const before = await waitFor('a live page', (s) => {
        const tab = activeTab(s);
        return tab?.live && !tab.loading && tab.url.endsWith('/two') ? tab : undefined;
      });
      const launches = (await state()).engine.launches;
      await exec('vscodeBrowser.debug.crashEngine');
      await waitFor('the engine to restart and reload the page', (s) => {
        const tab = activeTab(s);
        return (
          s.engine.launches > launches &&
          s.engine.status === 'running' &&
          tab?.id === before.id &&
          tab.live &&
          !tab.loading
        );
      });
    });

    await test('the Activity Bar icon opens a browser when none is open', async () => {
      await vscode.commands.executeCommand('workbench.action.closeAllEditors');
      await waitFor('all browsers to close', (s) => s.panels.length === 0);
      await vscode.commands.executeCommand('workbench.view.explorer');
      await exec('workbench.view.extension.vscodeBrowser');
      await waitFor('a browser window', (s) => s.panels.length === 1 && s.panels[0]!.ready);
    });
  } finally {
    server.close();
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  }

  if (failures.length) throw new Error(`${failures.length} test(s) failed: ${failures.join(', ')}`);
}
