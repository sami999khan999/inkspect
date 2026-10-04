// Background (service worker in Chrome, background scripts in Firefox): the toolbar's helper
// (captures, downloads, the responsive view's emulation), the link to VS Code and live two-way
// bookmark sync.
import type { RemoteOp } from '@inkspect/shared/bookmarkSync';
import { deviceUserAgent, NETWORK_CONDITIONS } from '@inkspect/shared/devices';
import type {
  BackgroundReply,
  BridgeStatus,
  EmulationRequest,
  ShortcutPressed,
  ToBackground,
  ToContent,
} from '../messages';
import { applyOps, snapshot, syncRoots } from './bookmarks';
import type { BrowserToHub, CaptureToSave, HubToBrowser } from '@inkspect/shared/hub';
import { BridgeClient, browserName } from './bridge';
import { receiveShortcuts, SHORTCUTS_KEY, watchShortcuts } from './shortcutSync';

const bridge = new BridgeClient();
void bridge.start();
watchShortcuts(bridge);

/** The key the browser assigned to open the toolbar (the user may have changed or cleared it). */
async function toolbarKey(): Promise<string | undefined> {
  // Chrome rejects extension calls made while the service worker is still starting ("No SW");
  // the title then goes without the key until the next status change.
  const commands = await chrome.commands.getAll().catch(() => []);
  return commands.find((c) => c.name === 'toggle-toolbar')?.shortcut || undefined;
}

/** The toolbar button shows whether the link works: "!" means "not paired yet". */
async function showLinkState(status: BridgeStatus): Promise<void> {
  const unpaired = status.state === 'unpaired';
  const key = await toolbarKey();
  const toolbar = key ? `Inkspect toolbar (${key})` : 'Inkspect toolbar';
  await Promise.all([
    chrome.action.setBadgeText({ text: unpaired ? '!' : '' }),
    chrome.action.setBadgeBackgroundColor({ color: '#d97706' }),
    chrome.action.setTitle({
      title:
        status.state === 'connected'
          ? `Inkspect: bookmarks sync with ${status.peer ?? 'VS Code'}`
          : unpaired
            ? `${toolbar}. Not paired with VS Code yet`
            : toolbar,
    }),
  ]);
}
bridge.onStatus((status) =>
  // Same "No SW" case at startup: try again once the service worker is up.
  showLinkState(status).catch(() =>
    setTimeout(() => void showLinkState(bridge.status).catch(() => undefined), 1000),
  ),
);

/** What the side panel may ask the browser helper. */
type PanelRequest = Extract<
  BrowserToHub,
  {
    type:
      | 'projects.get'
      | 'items.get'
      | 'item.thumb'
      | 'item.remove'
      | 'item.restore'
      | 'item.send'
      | 'items.move'
      | 'project.pin';
  }
>;
const PANEL_REQUESTS = new Set([
  'projects.get',
  'items.get',
  'item.thumb',
  'item.remove',
  'item.restore',
  'item.send',
  'items.move',
  'project.pin',
]);
function isPanelRequest(value: unknown): value is PanelRequest {
  const type = (value as { type?: unknown } | undefined)?.type;
  // The helper validates every field; here only the kinds of request a page may make.
  return typeof type === 'string' && PANEL_REQUESTS.has(type);
}

// Messages from the options page (pairing).
chrome.runtime.onMessage.addListener(
  (message: { type?: string; code?: string }, sender, sendResponse) => {
    // Only our own pages. The settings page opens in a tab, so `sender.tab` can't tell them apart.
    if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(''))) {
      return false;
    }
    if (message.type === 'pair' && message.code) {
      void bridge.pair(message.code).then((status) => sendResponse(status));
      return true;
    }
    if (message.type === 'unpair') {
      void bridge.unpair().then(() => sendResponse(bridge.status));
      return true;
    }
    if (message.type === 'status') {
      sendResponse(bridge.status satisfies BridgeStatus);
      return false;
    }
    // The side panel's questions for the browser helper (projects, their items, sends).
    if (message.type === 'hub' && isPanelRequest((message as { request?: unknown }).request)) {
      const request = (message as { request: PanelRequest }).request;
      // A send can wait for VS Code; the helper gives up after 2 minutes.
      void bridge
        .hubRequest(request, request.type === 'item.send' ? 130_000 : 30_000)
        .then((reply) => sendResponse(reply ?? null));
      return true;
    }
    if (message.type === 'toggleToolbar') {
      // From the popup: its opening granted activeTab for the tab it was opened on.
      void chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async ([tab]) => {
        if (!tab) return sendResponse({ ok: false, error: 'No tab' });
        sendResponse(await toggleToolbar(tab));
      });
      return true;
    }
    return false;
  },
);

// ---------------------------------------------------------------------------------------------
// Bookmark sync
// ---------------------------------------------------------------------------------------------

let syncEnabled = false;
let applying = false;
let importing = false;
let snapshotTimer: ReturnType<typeof setTimeout> | undefined;

/** A change arrived while VS Code's operations were being applied. */
let changedWhileApplying = false;

function sendSnapshotSoon(delay = 500): void {
  if (applying) {
    changedWhileApplying = true;
    return;
  }
  if (!syncEnabled || importing) return;
  clearTimeout(snapshotTimer);
  snapshotTimer = setTimeout(async () => {
    try {
      bridge.send({ type: 'bookmarks.snapshot', tree: await snapshot() });
    } catch (error) {
      console.warn('Inkspect: could not read bookmarks', error);
    }
  }, delay);
}

async function applyFromVsCode(ops: RemoteOp[]): Promise<void> {
  applying = true;
  try {
    const { created, failed } = await applyOps(ops);
    bridge.send({ type: 'bookmarks.applied', created, failed });
  } finally {
    // Let the change events of our own edits arrive, then check once more: the user may have
    // changed something at the same time (a no-op snapshot costs one message).
    setTimeout(() => {
      applying = false;
      if (changedWhileApplying) {
        changedWhileApplying = false;
        sendSnapshotSoon();
      }
    }, 300);
  }
}

bridge.onMessage((message) => {
  switch (message.type) {
    case 'welcome':
      syncEnabled = message.syncBookmarks;
      sendSnapshotSoon(0);
      break;
    case 'bookmarks.requestSnapshot':
      sendSnapshotSoon(0);
      break;
    case 'bookmarks.ops':
      void applyFromVsCode(message.ops);
      break;
    case 'settings.shortcuts':
      void receiveShortcuts(bridge, message);
      break;
  }
});

const onBookmarkChange = () => sendSnapshotSoon();
chrome.bookmarks.onCreated.addListener(onBookmarkChange);
chrome.bookmarks.onRemoved.addListener(onBookmarkChange);
chrome.bookmarks.onChanged.addListener(onBookmarkChange);
chrome.bookmarks.onMoved.addListener(onBookmarkChange);
chrome.bookmarks.onChildrenReordered?.addListener(onBookmarkChange);
chrome.bookmarks.onImportBegan?.addListener(() => (importing = true));
chrome.bookmarks.onImportEnded?.addListener(() => {
  importing = false;
  sendSnapshotSoon();
});

// Reconnect whenever the background starts again.
chrome.runtime.onStartup.addListener(() => bridge.ensureConnected());
chrome.runtime.onInstalled.addListener((details) => {
  bridge.ensureConnected();
  // First install: open the settings page, where the pairing code goes.
  if (details.reason === 'install') void chrome.runtime.openOptionsPage();
});

// For the end-to-end tests: toggle the toolbar without a real key press.
(globalThis as typeof globalThis & { __inkspectTest?: unknown }).__inkspectTest = {
  toggleToolbar: async (tabId: number) => toggleToolbar(await chrome.tabs.get(tabId)),
  bridgeStatus: () => bridge.status,
  reconnect: () => bridge.reconnect(),
  syncState: () => ({ syncEnabled, applying, importing, connected: bridge.connected }),
  pair: (code: string) => bridge.pair(code),
  syncedShortcuts: async () => (await chrome.storage.sync.get(SHORTCUTS_KEY))[SHORTCUTS_KEY],
};

// ---------------------------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------------------------

chrome.commands.onCommand.addListener((command, tab) => {
  if (command !== 'toggle-toolbar' || !tab) return;
  void toolbarKey().then((shown) => {
    const key = shown && commandBinding(shown);
    // On the extension's own pages (the settings page) the toolbar can't open: the key goes to
    // the page, whose shortcut search box may want it.
    if (tab.url?.startsWith(chrome.runtime.getURL(''))) {
      if (key) {
        void chrome.runtime
          .sendMessage({ type: 'shortcutPressed', key } satisfies ShortcutPressed)
          .catch(() => undefined);
      }
      return;
    }
    void toggleToolbar(tab, key);
  });
});

/** A key as Chrome shows it ("Alt+Shift+K", "⌥⇧K" on macOS) in the shortcut map's form. */
function commandBinding(shown: string): string {
  const mac: Record<string, string> = { '⌃': 'ctrl+', '⌥': 'alt+', '⇧': 'shift+', '⌘': 'cmd+' };
  return shown
    .replace(/[⌃⌥⇧⌘]/g, (symbol) => mac[symbol]!)
    .replace(/^MacCtrl\+/i, 'ctrl+')
    .replace(/Command\+/i, 'cmd+')
    .toLowerCase();
}

// The toolbar button opens the popup (src/popup/), which opens the toolbar with 'toggleToolbar'.

async function toggleToolbar(
  tab: chrome.tabs.Tab,
  key?: string,
): Promise<{ ok: boolean; error?: string }> {
  bridge.ensureConnected();
  if (!tab.id) return { ok: false, error: 'No tab' };
  try {
    const [probe] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => !!(window as Window & { __inkspect?: boolean }).__inkspect,
    });
    if (!probe?.result) {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['main-world.js'],
        world: 'MAIN',
      });
    }
    await chrome.tabs.sendMessage(tab.id, { type: 'toggle', key } satisfies ToContent);
    return { ok: true };
  } catch {
    // chrome://, the Web Store, the PDF viewer... extensions can't run there.
    await chrome.action.setBadgeText({ tabId: tab.id, text: '✕' });
    await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#b3261e' });
    await chrome.action.setTitle({ tabId: tab.id, title: 'Inkspect can’t run on this page' });
    return {
      ok: false,
      error: 'Inkspect can’t run on this page (browser pages, the Web Store...).',
    };
  }
}

bridge.onStatus((status) => {
  void broadcast({ type: 'bridgeStatus', status });
});

/** Tells every tab with the toolbar about a change (tabs without it ignore the error). */
async function broadcast(message: ToContent): Promise<void> {
  for (const tab of await chrome.tabs.query({})) {
    if (tab.id) chrome.tabs.sendMessage(tab.id, message).catch(() => {});
  }
}

// ---------------------------------------------------------------------------------------------
// Requests from the toolbar
// ---------------------------------------------------------------------------------------------

chrome.runtime.onMessage.addListener((message: ToBackground, sender, sendResponse) => {
  // Only the toolbar in a page; the settings page has its own listener above.
  if (!sender.tab || sender.url?.startsWith(chrome.runtime.getURL(''))) return false;
  bridge.ensureConnected();
  handle(message, sender)
    .then(sendResponse)
    .catch((error: unknown) =>
      sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }),
    );
  return true;
});

async function handle(
  message: ToBackground,
  sender: chrome.runtime.MessageSender,
): Promise<BackgroundReply> {
  const tab = sender.tab;
  switch (message.type) {
    case 'openSaved': {
      // Browsers open it only in answer to a click: called before anything is awaited.
      if (!tab?.windowId) return { ok: false, error: 'No tab' };
      try {
        if (__BROWSER__ === 'firefox') {
          const sidebar = (
            globalThis as { browser?: { sidebarAction?: { open(): Promise<void> } } }
          ).browser?.sidebarAction;
          await sidebar?.open();
        } else {
          await chrome.sidePanel.open({ windowId: tab.windowId });
        }
        return { ok: true };
      } catch {
        return {
          ok: false,
          error: 'The browser didn’t open the side panel: open Saved from the Inkspect button.',
        };
      }
    }
    case 'capture': {
      if (!tab?.windowId) return { ok: false, error: 'No tab' };
      return { ok: true, dataUrl: await capture(tab.windowId) };
    }
    case 'download':
      await chrome.downloads.download({
        url: message.dataUrl,
        filename: message.filename,
        saveAs: false,
      });
      return { ok: true };
    case 'bookmarkPage': {
      const existing = await chrome.bookmarks.search({ url: message.url });
      if (existing.length) return { ok: true, bookmarked: true };
      const { bar } = await syncRoots();
      await chrome.bookmarks.create({ parentId: bar, title: message.title, url: message.url });
      return { ok: true, bookmarked: true };
    }
    case 'unbookmarkPage': {
      for (const node of await chrome.bookmarks.search({ url: message.url })) {
        await chrome.bookmarks.remove(node.id);
      }
      return { ok: true, bookmarked: false };
    }
    case 'isBookmarked':
      return {
        ok: true,
        bookmarked: (await chrome.bookmarks.search({ url: message.url })).length > 0,
      };
    case 'emulate':
      if (!tab?.id) return { ok: false, error: 'No tab' };
      await emulate(tab.id, message.request);
      return { ok: true };
    case 'allowFraming':
      if (!tab?.id) return { ok: false, error: 'No tab' };
      await allowFraming(tab.id, message.url);
      return { ok: true };
    case 'endFraming':
      if (tab?.id) await endFraming(tab.id);
      return { ok: true };
    case 'bridgeStatus':
      return { ok: true, status: bridge.status };
    case 'openOptions':
      await chrome.runtime.openOptionsPage();
      return { ok: true };
    case 'pair': {
      const status = await bridge.pair(message.code);
      return { ok: true, status };
    }
    case 'projects': {
      const reply = await bridge.hubRequest<Extract<HubToBrowser, { type: 'projects' }>>(
        { type: 'projects.get', req: crypto.randomUUID(), url: message.url?.slice(0, 4096) },
        10_000,
      );
      if (!reply) return { ok: false, error: 'Not linked with VS Code or the browser helper.' };
      return { ok: true, projects: reply.projects, suggested: reply.suggested };
    }
    case 'saveCapture':
      return saveCaptures(message);
    case 'sendSaved': {
      const reply = await bridge.hubRequest<Extract<HubToBrowser, { type: 'item.sent' }>>(
        {
          type: 'item.send',
          req: crypto.randomUUID(),
          project: message.project,
          ids: message.ids,
          target: message.target,
          open: message.open,
        },
        // A send can wait for VS Code (choosing a terminal); the helper gives up after 2 minutes.
        130_000,
      );
      if (!reply) return { ok: false, error: 'The browser helper did not answer.' };
      return reply.ok
        ? { ok: true, sentTo: reply.sentTo }
        : { ok: false, error: reply.error ?? 'Nothing was sent.' };
    }
    case 'moveSaved': {
      const reply = await bridge.hubRequest<Extract<HubToBrowser, { type: 'done' }>>({
        type: 'items.move',
        req: crypto.randomUUID(),
        project: message.project,
        ids: message.ids,
        to: message.to,
      });
      if (!reply) return { ok: false, error: 'The browser helper did not answer.' };
      return reply.ok ? { ok: true } : { ok: false, error: reply.error ?? 'Not moved.' };
    }
  }
}

/** Native messages to the helper are limited to 64 MiB: big saves go in several. */
const MAX_SAVE = 40 * 1024 * 1024;

/**
 * Saves captures into a project through the helper, and sends them with `send`. Several large
 * screenshots are saved one request at a time, then sent together.
 */
async function saveCaptures(
  message: Extract<ToBackground, { type: 'saveCapture' }>,
): Promise<BackgroundReply> {
  const size = (c: CaptureToSave) => (c.image?.length ?? 0) + (c.text?.length ?? 0) + 1000;
  const batches: CaptureToSave[][] = [];
  for (const capture of message.captures) {
    if (size(capture) > MAX_SAVE) {
      return { ok: false, error: 'That screenshot is too large to save. Download it instead.' };
    }
    const last = batches.at(-1);
    if (last && last.reduce((total, c) => total + size(c), 0) + size(capture) <= MAX_SAVE) {
      last.push(capture);
    } else batches.push([capture]);
  }
  const ids: string[] = [];
  let sentTo: string | undefined;
  for (const [index, captures] of batches.entries()) {
    const last = index === batches.length - 1;
    const reply = await bridge.hubRequest<Extract<HubToBrowser, { type: 'capture.saved' }>>(
      {
        type: 'capture.save',
        req: crypto.randomUUID(),
        project: message.project,
        url: message.url?.slice(0, 4096),
        browser: browserName(),
        captures,
        // Sent once, all together, with the last part.
        send: batches.length === 1 ? message.send : undefined,
      },
      // A send can wait for VS Code (choosing a terminal); the helper gives up after 2 minutes.
      130_000,
    );
    if (!reply) return { ok: false, error: 'The browser helper did not answer.' };
    if (!reply.ok) return { ok: false, error: reply.error ?? 'Saving failed.' };
    ids.push(...(reply.ids ?? []));
    sentTo = reply.sentTo;
    if (last && batches.length > 1 && message.send) {
      const sent = await bridge.hubRequest<Extract<HubToBrowser, { type: 'item.sent' }>>(
        {
          type: 'item.send',
          req: crypto.randomUUID(),
          project: message.project,
          ids,
          target: message.send,
        },
        130_000,
      );
      if (!sent?.ok) {
        return { ok: false, error: `Saved, but not sent: ${sent?.error ?? 'no answer.'}` };
      }
      sentTo = sent.sentTo;
    }
  }
  return { ok: true, ids, sentTo };
}

// ---------------------------------------------------------------------------------------------
// Screenshots: Chrome allows about two captures per second.
// ---------------------------------------------------------------------------------------------

let lastCapture = 0;
let captureQueue: Promise<unknown> = Promise.resolve();

function capture(windowId: number): Promise<string> {
  const next = captureQueue.then(async () => {
    const wait = lastCapture + 550 - Date.now();
    if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
    lastCapture = Date.now();
    return chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
  });
  captureQueue = next.catch(() => {});
  return next;
}

// ---------------------------------------------------------------------------------------------
// Devices
// ---------------------------------------------------------------------------------------------

const debugging = new Set<number>();

async function command(
  tabId: number,
  method: string,
  params?: Record<string, unknown>,
): Promise<void> {
  await chrome.debugger.sendCommand({ tabId }, method, params);
}

/**
 * The responsive view's emulation through the debugger (Chrome shows its "debugging this browser"
 * bar): the device's user agent and touch, network, CPU and media. Not the size: the debugger's
 * device metrics always draw the page at the tab's top-left, so the size comes from the
 * responsive view's centered frame instead.
 */
async function emulate(tabId: number, request: EmulationRequest): Promise<void> {
  if (__BROWSER__ !== 'chrome') throw new Error('Emulation needs Chrome, Edge or Brave.');
  const device = request.agent;
  const userAgent = device
    ? deviceUserAgent(
        device.userAgent,
        /Chrome\/([\d.]+)/.exec(navigator.userAgent)?.[1] ?? '130.0.0.0',
      )
    : undefined;
  const idle =
    !userAgent &&
    !device?.touch &&
    request.network === 'none' &&
    request.cpu === 1 &&
    request.colorScheme === 'default' &&
    !request.print;
  if (idle) {
    if (debugging.has(tabId)) {
      debugging.delete(tabId);
      await chrome.debugger.detach({ tabId }).catch(() => {});
    }
    return;
  }
  if (!debugging.has(tabId)) {
    await chrome.debugger.attach({ tabId }, '1.3');
    debugging.add(tabId);
  }
  await command(tabId, 'Emulation.setTouchEmulationEnabled', {
    enabled: !!device?.touch,
    ...(device?.touch ? { maxTouchPoints: 5 } : {}),
  });
  // An empty string restores the browser's own user agent.
  await command(tabId, 'Emulation.setUserAgentOverride', { userAgent: userAgent ?? '' });
  const network = NETWORK_CONDITIONS[request.network];
  await command(tabId, 'Network.emulateNetworkConditions', {
    offline: request.network === 'offline',
    latency: network?.latency ?? 0,
    downloadThroughput: network?.download ?? -1,
    uploadThroughput: network?.upload ?? -1,
  });
  await command(tabId, 'Emulation.setCPUThrottlingRate', { rate: request.cpu });
  await command(tabId, 'Emulation.setEmulatedMedia', {
    media: request.print ? 'print' : '',
    features:
      request.colorScheme === 'default'
        ? []
        : [{ name: 'prefers-color-scheme', value: request.colorScheme }],
  });
}

if (__BROWSER__ === 'chrome') {
  chrome.debugger.onDetach.addListener(({ tabId }) => {
    // The user closed Chrome's debugging bar: emulation is over.
    if (tabId !== undefined) debugging.delete(tabId);
  });
}

// ---------------------------------------------------------------------------------------------
// The responsive view's frame
// ---------------------------------------------------------------------------------------------

/** One session rule per tab; ids stay clear of any other rules. */
const framingRuleId = (tabId: number) => 1_000_000 + (tabId % 1_000_000);

/**
 * The responsive view shows the page in a frame of its own tab. Many sites forbid being framed
 * (X-Frame-Options, CSP frame-ancestors), so while the view is open their headers are dropped for
 * frames of the page's own origin, in this tab only. activeTab gives the host access this needs.
 */
async function allowFraming(tabId: number, url: string): Promise<void> {
  const origin = new URL(url).origin;
  if (!/^https?:$/.test(new URL(url).protocol)) return;
  const id = framingRuleId(tabId);
  await chrome.declarativeNetRequest.updateSessionRules({
    removeRuleIds: [id],
    addRules: [
      {
        id,
        priority: 1,
        action: {
          type: 'modifyHeaders' as chrome.declarativeNetRequest.RuleActionType,
          responseHeaders: [
            {
              header: 'x-frame-options',
              operation: 'remove' as chrome.declarativeNetRequest.HeaderOperation,
            },
            {
              header: 'content-security-policy',
              operation: 'remove' as chrome.declarativeNetRequest.HeaderOperation,
            },
          ],
        },
        condition: {
          tabIds: [tabId],
          urlFilter: `|${origin}/`,
          resourceTypes: ['sub_frame' as chrome.declarativeNetRequest.ResourceType],
        },
      },
    ],
  });
}

async function endFraming(tabId: number): Promise<void> {
  await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [framingRuleId(tabId)] });
}

chrome.tabs.onRemoved.addListener((tabId) => void endFraming(tabId).catch(() => {}));

// ---------------------------------------------------------------------------------------------
// Sending to VS Code
// ---------------------------------------------------------------------------------------------
