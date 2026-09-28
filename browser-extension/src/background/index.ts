// Background (service worker in Chrome, background scripts in Firefox): the link to VS Code
// and live two-way bookmark sync. That is all the extension does for now.
//
// The toolbar features (element selector, screenshots, drawing, devices, console, sending to
// VS Code) are switched off. Their code is kept: commented out at the end of this file, in
// src/content/ and src/main-world/ (no longer built), in the build entries of scripts/build.mjs
// and in manifest/toolbar.json (not merged). Restore those to bring the toolbar back.
// import { deviceUserAgent, NETWORK_CONDITIONS } from '@inkspect/shared/devices';
import type { RemoteOp } from '@inkspect/shared/bookmarkSync';
import type { BridgeStatus } from '../messages';
// import {
//   type BackgroundReply,
//   type BridgeStatus,
//   type EmulationRequest,
//   type ToBackground,
//   type ToContent,
// } from '../messages';
import { applyOps, snapshot } from './bookmarks';
// import { applyOps, snapshot, syncRoots } from './bookmarks';
import { BridgeClient } from './bridge';
import { receiveShortcuts, SHORTCUTS_KEY, watchShortcuts } from './shortcutSync';

const bridge = new BridgeClient();
void bridge.start();
watchShortcuts(bridge);

// The toolbar button opens the settings page: link status and pairing with VS Code.
chrome.action.onClicked.addListener(() => {
  bridge.ensureConnected();
  void chrome.runtime.openOptionsPage();
});

/** The toolbar button shows whether the link works: "!" means "click to pair". */
function showLinkState(status: BridgeStatus): void {
  const unpaired = status.state === 'unpaired';
  void chrome.action.setBadgeText({ text: unpaired ? '!' : '' });
  void chrome.action.setBadgeBackgroundColor({ color: '#d97706' });
  void chrome.action.setTitle({
    title:
      status.state === 'connected'
        ? `Inkspect: bookmarks sync with ${status.peer ?? 'VS Code'}`
        : unpaired
          ? 'Inkspect: click to link with VS Code'
          : 'Inkspect: VS Code is not running',
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
    //     case 'send.result': {
    //       const resolve = pendingSends.get(message.id);
    //       pendingSends.delete(message.id);
    //       resolve?.(
    //         message.ok
    //           ? { ok: true, path: message.path }
    //           : { ok: false, error: message.error ?? 'Failed' },
    //       );
    //       break;
    //     }
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
  //   toggleToolbar: async (tabId: number) => toggleToolbar(await chrome.tabs.get(tabId)),
  bridgeStatus: () => bridge.status,
  reconnect: () => bridge.reconnect(),
  syncState: () => ({ syncEnabled, applying, importing, connected: bridge.connected }),
  pair: (code: string) => bridge.pair(code),
  syncedShortcuts: async () => (await chrome.storage.sync.get(SHORTCUTS_KEY))[SHORTCUTS_KEY],
};

// =============================================================================================
// Disabled: toolbar features (kept for later; see the note at the top)
// =============================================================================================

// // ---------------------------------------------------------------------------------------------
// // Toolbar
// // ---------------------------------------------------------------------------------------------
//
// chrome.commands.onCommand.addListener((command, tab) => {
//   if (command === 'toggle-toolbar' && tab) void toggleToolbar(tab);
// });
// chrome.action.onClicked.addListener((tab) => void toggleToolbar(tab));
//
// async function toggleToolbar(tab: chrome.tabs.Tab): Promise<void> {
//   bridge.ensureConnected();
//   if (!tab.id) return;
//   try {
//     const [probe] = await chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: () => !!(window as Window & { __inkspect?: boolean }).__inkspect,
//     });
//     if (!probe?.result) {
//       await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
//       await chrome.scripting.executeScript({
//         target: { tabId: tab.id },
//         files: ['main-world.js'],
//         world: 'MAIN',
//       });
//     }
//     await chrome.tabs.sendMessage(tab.id, { type: 'toggle' } satisfies ToContent);
//   } catch {
//     // chrome://, the Web Store, the PDF viewer... extensions can't run there.
//     await chrome.action.setBadgeText({ tabId: tab.id, text: '✕' });
//     await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: '#b3261e' });
//     await chrome.action.setTitle({ tabId: tab.id, title: 'Inkspect can’t run on this page' });
//   }
// }
//
// bridge.onStatus((status) => {
//   void broadcast({ type: 'bridgeStatus', status });
// });
//
// /** Tells every tab with the toolbar about a change (tabs without it ignore the error). */
// async function broadcast(message: ToContent): Promise<void> {
//   for (const tab of await chrome.tabs.query({})) {
//     if (tab.id) chrome.tabs.sendMessage(tab.id, message).catch(() => {});
//   }
// }
//
// // ---------------------------------------------------------------------------------------------
// // Requests from the toolbar
// // ---------------------------------------------------------------------------------------------
//
// chrome.runtime.onMessage.addListener((message: ToBackground, sender, sendResponse) => {
//   bridge.ensureConnected();
//   handle(message, sender)
//     .then(sendResponse)
//     .catch((error: unknown) =>
//       sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) }),
//     );
//   return true;
// });
//
// async function handle(
//   message: ToBackground,
//   sender: chrome.runtime.MessageSender,
// ): Promise<BackgroundReply> {
//   const tab = sender.tab;
//   switch (message.type) {
//     case 'capture': {
//       if (!tab?.windowId) return { ok: false, error: 'No tab' };
//       return { ok: true, dataUrl: await capture(tab.windowId) };
//     }
//     case 'download':
//       await chrome.downloads.download({
//         url: message.dataUrl,
//         filename: message.filename,
//         saveAs: false,
//       });
//       return { ok: true };
//     case 'bookmarkPage': {
//       const existing = await chrome.bookmarks.search({ url: message.url });
//       if (existing.length) return { ok: true, bookmarked: true };
//       const { bar } = await syncRoots();
//       await chrome.bookmarks.create({ parentId: bar, title: message.title, url: message.url });
//       return { ok: true, bookmarked: true };
//     }
//     case 'emulate':
//       if (!tab?.id) return { ok: false, error: 'No tab' };
//       await emulate(tab.id, message.request);
//       return { ok: true };
//     case 'windowMode':
//       if (!tab?.id) return { ok: false, error: 'No tab' };
//       await windowMode(tab, message.width, message.height);
//       return { ok: true };
//     case 'restoreWindow':
//       if (!tab?.id) return { ok: false, error: 'No tab' };
//       await restoreWindow(tab.id);
//       return { ok: true };
//     case 'bridgeStatus':
//       return { ok: true, status: bridge.status };
//     case 'send':
//       return sendToVsCode(message);
//     case 'openOptions':
//       await chrome.runtime.openOptionsPage();
//       return { ok: true };
//     case 'pair': {
//       const status = await bridge.pair(message.code);
//       return { ok: true, status };
//     }
//   }
// }
//

// // ---------------------------------------------------------------------------------------------
// // Screenshots: Chrome allows about two captures per second.
// // ---------------------------------------------------------------------------------------------
//
// let lastCapture = 0;
// let captureQueue: Promise<unknown> = Promise.resolve();
//
// function capture(windowId: number): Promise<string> {
//   const next = captureQueue.then(async () => {
//     const wait = lastCapture + 550 - Date.now();
//     if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
//     lastCapture = Date.now();
//     return chrome.tabs.captureVisibleTab(windowId, { format: 'png' });
//   });
//   captureQueue = next.catch(() => {});
//   return next;
// }
//
// // ---------------------------------------------------------------------------------------------
// // Devices
// // ---------------------------------------------------------------------------------------------
//
// const debugging = new Set<number>();
//
// async function command(
//   tabId: number,
//   method: string,
//   params?: Record<string, unknown>,
// ): Promise<void> {
//   await chrome.debugger.sendCommand({ tabId }, method, params);
// }
//
// /** Full emulation through the debugger (Chrome shows its "debugging this browser" bar). */
// async function emulate(tabId: number, request: EmulationRequest): Promise<void> {
//   if (__BROWSER__ !== 'chrome') throw new Error('Full emulation needs Chrome, Edge or Brave.');
//   const idle =
//     !request.device &&
//     request.network === 'none' &&
//     request.cpu === 1 &&
//     request.colorScheme === 'default' &&
//     !request.print;
//   if (idle) {
//     if (debugging.has(tabId)) {
//       debugging.delete(tabId);
//       await chrome.debugger.detach({ tabId }).catch(() => {});
//     }
//     return;
//   }
//   if (!debugging.has(tabId)) {
//     await chrome.debugger.attach({ tabId }, '1.3');
//     debugging.add(tabId);
//   }
//   const device = request.device;
//   if (device) {
//     await command(tabId, 'Emulation.setDeviceMetricsOverride', {
//       width: device.width,
//       height: device.height,
//       deviceScaleFactor: device.dpr,
//       mobile: device.mobile,
//     });
//     await command(tabId, 'Emulation.setTouchEmulationEnabled', {
//       enabled: device.touch,
//       ...(device.touch ? { maxTouchPoints: 5 } : {}),
//     });
//     const version = /Chrome\/([\d.]+)/.exec(navigator.userAgent)?.[1] ?? '130.0.0.0';
//     const userAgent = deviceUserAgent(device.userAgent, version);
//     if (userAgent) await command(tabId, 'Emulation.setUserAgentOverride', { userAgent });
//   } else {
//     await command(tabId, 'Emulation.clearDeviceMetricsOverride');
//     await command(tabId, 'Emulation.setTouchEmulationEnabled', { enabled: false });
//   }
//   const network = NETWORK_CONDITIONS[request.network];
//   await command(tabId, 'Network.emulateNetworkConditions', {
//     offline: request.network === 'offline',
//     latency: network?.latency ?? 0,
//     downloadThroughput: network?.download ?? -1,
//     uploadThroughput: network?.upload ?? -1,
//   });
//   await command(tabId, 'Emulation.setCPUThrottlingRate', { rate: request.cpu });
//   await command(tabId, 'Emulation.setEmulatedMedia', {
//     media: request.print ? 'print' : '',
//     features:
//       request.colorScheme === 'default'
//         ? []
//         : [{ name: 'prefers-color-scheme', value: request.colorScheme }],
//   });
// }
//
// if (__BROWSER__ === 'chrome') {
//   chrome.debugger.onDetach.addListener(({ tabId }) => {
//     // The user closed Chrome's debugging bar: emulation is over.
//     if (tabId !== undefined) debugging.delete(tabId);
//   });
// }
//
// /** Where a tab lived before it was moved into a device-sized window. */
// const homes = new Map<number, { windowId: number; index: number }>();
//
// /** Moves the tab into a popup window whose page area is `width` × `height`. */
// async function windowMode(tab: chrome.tabs.Tab, width: number, height: number): Promise<void> {
//   if (!homes.has(tab.id!)) homes.set(tab.id!, { windowId: tab.windowId, index: tab.index });
//   const win = await chrome.windows.create({
//     tabId: tab.id,
//     type: 'popup',
//     width,
//     height,
//     focused: true,
//   });
//   // Window sizes include the frame: grow the window by the difference once the page reports in.
//   const [result] = await chrome.scripting.executeScript({
//     target: { tabId: tab.id! },
//     func: () => [window.innerWidth, window.innerHeight],
//   });
//   const [innerWidth, innerHeight] = (result?.result as number[] | undefined) ?? [width, height];
//   if (win?.id && (innerWidth !== width || innerHeight !== height)) {
//     await chrome.windows.update(win.id, {
//       width: width + (width - innerWidth!),
//       height: height + (height - innerHeight!),
//     });
//   }
// }
//
// async function restoreWindow(tabId: number): Promise<void> {
//   const home = homes.get(tabId);
//   if (!home) return;
//   homes.delete(tabId);
//   const tab = await chrome.tabs.get(tabId);
//   await chrome.tabs.move(tabId, { windowId: home.windowId, index: home.index }).catch(async () => {
//     // The original window is gone: open a normal one.
//     await chrome.windows.create({ tabId });
//   });
//   await chrome.tabs.update(tabId, { active: true });
//   if (tab.windowId !== home.windowId)
//     await chrome.windows.update(home.windowId, { focused: true }).catch(() => {});
// }
//
// // ---------------------------------------------------------------------------------------------
// // Sending to VS Code
// // ---------------------------------------------------------------------------------------------
//
// const pendingSends = new Map<string, (reply: BackgroundReply) => void>();
//
// async function sendToVsCode(
//   message: Extract<ToBackground, { type: 'send' }>,
// ): Promise<BackgroundReply> {
//   if (!bridge.connected) {
//     return { ok: false, error: 'Not linked with VS Code. Click the VS Code button to pair.' };
//   }
//   const id = crypto.randomUUID();
//   const reply = new Promise<BackgroundReply>((resolve) => {
//     pendingSends.set(id, resolve);
//     // Choosing a terminal happens in VS Code and can take a while.
//     setTimeout(() => {
//       if (pendingSends.delete(id)) resolve({ ok: false, error: 'VS Code did not answer.' });
//     }, 120_000);
//   });
//   bridge.send({
//     type: 'send',
//     id,
//     target: message.target,
//     text: message.text,
//     image: message.image?.replace(/^data:image\/\w+;base64,/, ''),
//     label: message.label,
//     pageUrl: message.pageUrl,
//   });
//   return reply;
// }
//
