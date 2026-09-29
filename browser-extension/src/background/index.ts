// Background (service worker in Chrome, background scripts in Firefox): the toolbar's helper
// (captures, downloads, the responsive view's emulation), the link to VS Code and live two-way
// bookmark sync.
import type { RemoteOp } from '@inkspect/shared/bookmarkSync';
import { deviceUserAgent, NETWORK_CONDITIONS } from '@inkspect/shared/devices';
import type {
  BackgroundReply,
  BridgeStatus,
  EmulationRequest,
  ToBackground,
  ToContent,
} from '../messages';
import { applyOps, snapshot, syncRoots } from './bookmarks';
import { BridgeClient } from './bridge';
import { receiveShortcuts, SHORTCUTS_KEY, watchShortcuts } from './shortcutSync';

const bridge = new BridgeClient();
void bridge.start();
watchShortcuts(bridge);

/** The toolbar button shows whether the link works: "!" means "not paired yet". */
function showLinkState(status: BridgeStatus): void {
  const unpaired = status.state === 'unpaired';
  void chrome.action.setBadgeText({ text: unpaired ? '!' : '' });
  void chrome.action.setBadgeBackgroundColor({ color: '#d97706' });
  void chrome.action.setTitle({
    title:
      status.state === 'connected'
        ? `Inkspect: bookmarks sync with ${status.peer ?? 'VS Code'}`
        : unpaired
          ? 'Inkspect toolbar (Alt+Shift+I). Not paired with VS Code yet'
          : 'Inkspect toolbar (Alt+Shift+I)',
  });
}
bridge.onStatus(showLinkState);

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
    case 'send.result': {
      const resolve = pendingSends.get(message.id);
      pendingSends.delete(message.id);
      resolve?.(
        message.ok
          ? { ok: true, path: message.path }
          : { ok: false, error: message.error ?? 'Failed' },
      );
      break;
    }
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
  if (command === 'toggle-toolbar' && tab) void toggleToolbar(tab);
});
// The toolbar button opens the popup (src/popup/), which opens the toolbar with 'toggleToolbar'.

async function toggleToolbar(tab: chrome.tabs.Tab): Promise<{ ok: boolean; error?: string }> {
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
    await chrome.tabs.sendMessage(tab.id, { type: 'toggle' } satisfies ToContent);
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
    case 'send':
      return sendToVsCode(message);
    case 'openOptions':
      await chrome.runtime.openOptionsPage();
      return { ok: true };
    case 'pair': {
      const status = await bridge.pair(message.code);
      return { ok: true, status };
    }
  }
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

const pendingSends = new Map<string, (reply: BackgroundReply) => void>();

async function sendToVsCode(
  message: Extract<ToBackground, { type: 'send' }>,
): Promise<BackgroundReply> {
  if (!bridge.connected) {
    return { ok: false, error: 'Not linked with VS Code. Click the VS Code button to pair.' };
  }
  const id = crypto.randomUUID();
  const reply = new Promise<BackgroundReply>((resolve) => {
    pendingSends.set(id, resolve);
    // Choosing a terminal happens in VS Code and can take a while.
    setTimeout(() => {
      if (pendingSends.delete(id)) resolve({ ok: false, error: 'VS Code did not answer.' });
    }, 120_000);
  });
  bridge.send({
    type: 'send',
    id,
    target: message.target,
    text: message.text,
    image: message.image?.replace(/^data:image\/\w+;base64,/, ''),
    label: message.label,
    pageUrl: message.pageUrl,
    window: message.window,
    capture: message.capture,
    kind: message.kind,
  });
  return reply;
}
