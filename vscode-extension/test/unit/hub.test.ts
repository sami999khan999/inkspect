import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { createConnection, type Socket } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CHROME_EXTENSION_ID,
  HUB_FEATURES,
  HUB_HOST_NAME,
  MAX_TO_BROWSER,
} from '@inkspect/shared/hub';
import { HubDaemon } from '../../src/hub/daemon';
import { readItems } from '../../src/hub/store';
import { frame, FrameDecoder } from '../../src/hub/framing';
import {
  hostFolders,
  hostManifest,
  installHub,
  launcherScript,
  uninstallHub,
} from '../../src/hub/install';
import { hubPaths } from '../../src/hub/paths';
import { originFromArgs } from '../../src/hub/shim';

const temps: string[] = [];
/** A temporary folder with a short path (Unix socket paths are limited to about 100 bytes). */
function temp(): string {
  const dir = mkdtempSync(join(tmpdir(), 'ih-'));
  temps.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('hub frames', () => {
  it('splits frames across and within chunks', () => {
    const got: string[] = [];
    const decoder = new FrameDecoder(
      1024,
      (t) => got.push(t),
      () => {},
    );
    const bytes = Buffer.concat([frame('{"a":1}'), frame('{"b":"é"}'), frame('{}')]);
    decoder.push(bytes.subarray(0, 3));
    decoder.push(bytes.subarray(3, 12));
    decoder.push(bytes.subarray(12));
    expect(got).toEqual(['{"a":1}', '{"b":"é"}', '{}']);
  });

  it('reads a large frame sent in many small chunks, quickly', () => {
    const got: string[] = [];
    const decoder = new FrameDecoder(
      1 << 26,
      (t) => got.push(t),
      () => {},
    );
    const big = JSON.stringify({ data: 'x'.repeat(20 * 1024 * 1024) });
    const bytes = Buffer.concat([frame(big), frame('{}')]);
    const started = Date.now();
    for (let i = 0; i < bytes.length; i += 64 * 1024)
      decoder.push(bytes.subarray(i, i + 64 * 1024));
    expect(got.map((t) => t.length)).toEqual([big.length, 2]);
    // Joined once, not copied again for every chunk.
    expect(Date.now() - started).toBeLessThan(1_500);
  });

  it('fails on a frame over the limit and ignores what follows', () => {
    const got: string[] = [];
    const errors: Error[] = [];
    const decoder = new FrameDecoder(
      4,
      (t) => got.push(t),
      (e) => errors.push(e),
    );
    decoder.push(frame('too long'));
    decoder.push(frame('{}'));
    expect(got).toEqual([]);
    expect(errors).toHaveLength(1);
  });
});

// The hub is registered and run on Linux only (see hubSupported): its paths, launcher and Unix
// socket are tested there.
const linux = process.platform === 'linux';

describe.skipIf(!linux)('hub registration', () => {
  it('finds browsers in the XDG config folder and both Firefox locations', () => {
    const folders = hostFolders({ XDG_CONFIG_HOME: '/c' }, '/h');
    expect(folders.find((f) => f.browser === 'Brave')?.hosts).toBe(
      '/c/BraveSoftware/Brave-Browser/NativeMessagingHosts',
    );
    expect(folders.filter((f) => f.kind === 'firefox').map((f) => f.hosts)).toEqual([
      '/h/.mozilla/native-messaging-hosts',
      '/c/mozilla/native-messaging-hosts',
    ]);
    expect(hostFolders({}, '/h')[0]?.config).toBe('/h/.config/google-chrome');
  });

  it('allows only the Inkspect extension', () => {
    expect(hostManifest('/x/inkspect-hub', 'chromium')).toEqual({
      name: HUB_HOST_NAME,
      description: expect.any(String),
      path: '/x/inkspect-hub',
      type: 'stdio',
      allowed_origins: [`chrome-extension://${CHROME_EXTENSION_ID}/`],
    });
    expect(hostManifest('/x/inkspect-hub', 'firefox')).toMatchObject({
      allowed_extensions: ['inkspect@inkspect.dev'],
    });
  });

  it("runs the hub with VS Code's Node, quoting paths", () => {
    const script = launcherScript("/opt/it's code/code", '/d/hub.js');
    expect(script).toContain(
      `ELECTRON_RUN_AS_NODE=1 exec '/opt/it'\\''s code/code' '/d/hub.js' "$@"`,
    );
    expect(script).toContain(`exec node '/d/hub.js' "$@"`);
  });

  it('installs for the browsers that exist, and removes everything again', () => {
    const home = temp();
    const config = join(home, 'config');
    mkdirSync(join(config, 'google-chrome'), { recursive: true });
    mkdirSync(join(config, 'vivaldi'), { recursive: true });
    const source = join(home, 'hub.js');
    writeFileSync(source, '// hub v1');
    const env = { XDG_CONFIG_HOME: config };
    const dataDir = join(home, 'data');
    const first = installHub({ source, execPath: '/usr/bin/code', dataDir, env, home });
    expect(first.updated).toBe(true);
    expect(first.registered.map((r) => r.browser)).toEqual(['Google Chrome', 'Vivaldi']);
    expect(existsSync(join(config, 'chromium', 'NativeMessagingHosts'))).toBe(false);
    const manifest = JSON.parse(readFileSync(first.registered[0]!.file, 'utf8'));
    expect(manifest.path).toBe(first.launcher);
    expect(statSync(first.launcher).mode & 0o111).toBeTruthy();
    // Unchanged: nothing to replace.
    expect(installHub({ source, execPath: '/usr/bin/code', dataDir, env, home }).updated).toBe(
      false,
    );
    writeFileSync(source, '// hub v2');
    expect(installHub({ source, execPath: '/usr/bin/code', dataDir, env, home }).updated).toBe(
      true,
    );
    expect(uninstallHub({ dataDir, env, home })).toEqual(['Google Chrome', 'Vivaldi']);
    expect(existsSync(first.registered[0]!.file)).toBe(false);
    expect(existsSync(first.hubScript)).toBe(false);
  });

  it("reads the extension's origin from the browser's arguments", () => {
    expect(originFromArgs([`chrome-extension://${CHROME_EXTENSION_ID}/`])).toBe(
      `chrome-extension://${CHROME_EXTENSION_ID}`,
    );
    expect(originFromArgs(['/m/dev.inkspect.hub.json', 'inkspect@inkspect.dev'])).toBe(
      'firefox:inkspect@inkspect.dev',
    );
    expect(originFromArgs(['chrome-extension://not-an-id/'])).toBe('unknown');
  });
});

/** A client of the hub that collects what it receives. */
async function client(
  socketPath: string,
): Promise<{ socket: Socket; got: Record<string, unknown>[] }> {
  const socket = createConnection(socketPath);
  await new Promise<void>((resolve) => socket.once('connect', () => resolve()));
  const got: Record<string, unknown>[] = [];
  const decoder = new FrameDecoder(
    1 << 26,
    (t) => got.push(JSON.parse(t)),
    () => {},
  );
  socket.on('data', (c) => decoder.push(c));
  return { socket, got };
}

const send = (socket: Socket, message: object) =>
  socket.write(frame(JSON.stringify({ v: 1, ...message })));
/** A short pause, for checking that something does *not* arrive. */
const settle = () => new Promise((resolve) => setTimeout(resolve, 60));
/** Waits until `check` holds: timings vary on a busy machine. */
async function until(check: () => unknown, timeoutMs = 5_000): Promise<void> {
  for (const deadline = Date.now() + timeoutMs; !check();) {
    if (Date.now() > deadline) throw new Error(`Timed out waiting for ${check.toString()}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}
const linkHello = JSON.stringify({
  v: 1,
  type: 'hello',
  client: { id: 'c1', browser: 'Google Chrome' },
  token: '',
});

describe.skipIf(!linux)('hub daemon', () => {
  it('authenticates, links a browser to the leader window and exits when idle', async () => {
    const paths = hubPaths({ INKSPECT_HUB_DIR: join(temp(), 'rt') }, temp());
    let exited = false;
    const daemon = new HubDaemon(paths, {
      idleMs: 300,
      build: 'b1',
      exit: () => (exited = true),
    });
    expect(await daemon.start()).toBe(true);
    // A second hub doesn't start while this one runs.
    expect(await new HubDaemon(paths, { idleMs: 300, build: 'b2', exit: () => {} }).start()).toBe(
      false,
    );
    expect(statSync(paths.runtime).mode & 0o777).toBe(0o700);
    expect(statSync(paths.token).mode & 0o777).toBe(0o600);
    const token = readFileSync(paths.token, 'utf8');

    const stranger = await client(paths.socket);
    send(stranger.socket, { type: 'auth', token: 'wrong', role: 'vscode' });
    await until(() => stranger.socket.destroyed || stranger.socket.readableEnded);

    const browser = await client(paths.socket);
    send(browser.socket, { type: 'auth', token, role: 'browser', origin: 'chrome-extension://x' });
    await until(() => browser.got.length);
    // It says what it can do beyond the first version (newer browser builds check).
    expect(browser.got).toEqual([
      { v: 1, type: 'status', vscode: false, features: [...HUB_FEATURES] },
    ]);

    const window = await client(paths.socket);
    send(window.socket, { type: 'auth', token, role: 'vscode' });
    send(window.socket, { type: 'window', id: 'w1', name: 'inkspect', folders: [], focusedAt: 1 });
    await until(() => window.got.length >= 3 && browser.got.length >= 3);
    expect(window.got.map((m) => m.type)).toEqual(['welcome', 'browsers', 'leader']);
    expect(browser.got.slice(1).map((m) => m.type)).toEqual(['relink', 'status']);

    // The browser's hello goes to the leader; a message the bridge doesn't allow doesn't.
    send(browser.socket, { type: 'link', data: linkHello });
    send(browser.socket, { type: 'link', data: '{"v":1,"type":"toString"}' });
    await until(() => window.got.some((m) => m.type === 'link'));
    await settle();
    const links = window.got.filter((m) => m.type === 'link');
    expect(links).toHaveLength(1);
    const browserId = links[0]!.browser as string;
    expect(window.got.at(-2)).toMatchObject({
      type: 'browsers',
      browsers: [{ id: browserId, name: 'Google Chrome', origin: 'chrome-extension://x' }],
    });

    // The leader answers that browser; a reply too large for native messaging is dropped.
    const welcome = JSON.stringify({ v: 1, type: 'welcome', peer: 'VS Code', syncBookmarks: true });
    send(window.socket, { type: 'link', browser: browserId, data: welcome });
    send(window.socket, { type: 'link', browser: browserId, data: 'x'.repeat(MAX_TO_BROWSER) });
    await until(() => browser.got.some((m) => m.type === 'link'));
    await settle();
    expect(browser.got.filter((m) => m.type === 'link')).toEqual([
      { v: 1, type: 'link', data: welcome },
    ]);

    browser.socket.destroy();
    await until(() => window.got.at(-1)?.type === 'browsers');
    expect(window.got.at(-1)).toEqual({ v: 1, type: 'browsers', browsers: [] });
    window.socket.destroy();
    await until(() => exited);
    expect(existsSync(paths.socket)).toBe(false);
    expect(existsSync(paths.lock)).toBe(false);
  });

  it("lists projects, suggests one, and saves the browser's captures only into known ones", async () => {
    const project = temp();
    const stateHome = temp();
    const paths = hubPaths(
      { INKSPECT_HUB_DIR: join(temp(), 'rt'), XDG_STATE_HOME: stateHome },
      temp(),
    );
    const daemon = new HubDaemon(paths, {
      idleMs: 60_000,
      build: 'b1',
      tmuxSockets: [],
      exit: () => {},
    });
    expect(await daemon.start()).toBe(true);
    const token = readFileSync(paths.token, 'utf8');
    const window = await client(paths.socket);
    send(window.socket, { type: 'auth', token, role: 'vscode' });
    send(window.socket, { type: 'window', id: 'w1', name: 'p', folders: [project], focusedAt: 1 });
    const browser = await client(paths.socket);
    send(browser.socket, { type: 'auth', token, role: 'browser', origin: 'chrome-extension://x' });
    await until(() => browser.got.some((m) => m.type === 'status' && m.vscode));

    send(browser.socket, { type: 'projects.get', req: 'r1', url: 'https://shop.dev/cart' });
    await until(() => browser.got.some((m) => m.req === 'r1'));
    const projects = browser.got.find((m) => m.type === 'projects')!;
    expect(projects.suggested).toBe(project);
    // The window's folder, and the Inbox (where captures go when no project fits).
    expect(projects.projects).toMatchObject([
      { path: project, vscode: true, saved: false },
      { path: join(paths.data, 'inbox'), name: 'Inbox', inbox: true },
    ]);

    const image = Buffer.from([0x89, 0x50, 0x4e, 0x47]).toString('base64');
    send(browser.socket, {
      type: 'capture.save',
      req: 'r2',
      project,
      url: 'https://shop.dev/cart',
      browser: 'Brave',
      captures: [
        { kind: 'screenshot', title: 'Screenshot', image, group: 'g', groupIndex: 0 },
        { kind: 'element', title: 'Element button', text: '## button' },
      ],
    });
    // Never into a folder the hub doesn't know as a project.
    send(browser.socket, {
      type: 'capture.save',
      req: 'r3',
      project: '/tmp',
      captures: [{ kind: 'text', title: 'x', text: 'x' }],
    });
    await until(
      () => browser.got.some((m) => m.req === 'r2') && browser.got.some((m) => m.req === 'r3'),
    );
    const saved = browser.got.find((m) => m.type === 'capture.saved' && m.req === 'r2')!;
    expect(saved).toMatchObject({ ok: true, ids: [expect.any(String), expect.any(String)] });
    expect(browser.got.find((m) => m.req === 'r3')).toMatchObject({ ok: false });
    const items = readItems(project);
    expect(items.map((i) => [i.kind, i.source, i.browser, i.url])).toEqual(
      expect.arrayContaining([
        ['screenshot', 'browser', 'Brave', 'https://shop.dev/cart'],
        ['element', 'browser', 'Brave', 'https://shop.dev/cart'],
      ]),
    );
    // The site's captures go to this project next time, even with its window closed.
    // The hub tells the browser VS Code is gone once it noticed.
    const statuses = browser.got.filter((m) => m.type === 'status').length;
    window.socket.destroy();
    await until(() => browser.got.filter((m) => m.type === 'status').length > statuses);
    send(browser.socket, { type: 'projects.get', req: 'r4', url: 'https://shop.dev/' });
    await until(() => browser.got.some((m) => m.req === 'r4'));
    const later = browser.got.find((m) => m.req === 'r4')!;
    expect(later.suggested).toBe(project);
    expect(later.projects).toMatchObject([
      { path: project, vscode: false, saved: true },
      { name: 'Inbox', inbox: true },
    ]);
    browser.socket.destroy();
    daemon.stop('test');
  });
});
