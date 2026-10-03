import { pathToFileURL } from 'node:url';
import * as vscode from 'vscode';
import { agentmuxNewTarget, HARNESS_LABELS } from '@inkspect/shared/targets';
import { sendContextItem, sendContextItems, sendSaved } from './agent/chat';
import { contextTray, type ContextItem } from './agent/contextTray';
import { sendFlow } from './agent/sendFlow';
import { getAgentTerminals } from './features/terminalSend';
import { getConfig } from './config';
import { BrowserPanel, type Services } from './panel/BrowserPanel';
import {
  clearBrowsingData,
  confirmRemoveBookmark,
  exportBookmarks,
  importBookmarks,
} from './panel/browserData';
import { BAR_ID, findNode } from './shared/bookmarks';
import type { TabAction } from './shared/protocol';
import { normalizeInput } from './shared/url';

/** Commands that act on the active browser tab, mapped to the tab action they run. */
const TAB_COMMANDS: Record<string, TabAction> = {
  'vscodeBrowser.newTab': 'new',
  'vscodeBrowser.closeTab': 'close',
  'vscodeBrowser.reopenClosedTab': 'reopenClosed',
  'vscodeBrowser.reload': 'reload',
  'vscodeBrowser.hardReload': 'hardReload',
  'vscodeBrowser.stop': 'stop',
  'vscodeBrowser.goBack': 'back',
  'vscodeBrowser.goForward': 'forward',
  'vscodeBrowser.goHome': 'home',
  'vscodeBrowser.find': 'find',
  'vscodeBrowser.zoomIn': 'zoomIn',
  'vscodeBrowser.zoomOut': 'zoomOut',
  'vscodeBrowser.zoomReset': 'zoomReset',
  'vscodeBrowser.viewSource': 'viewSource',
  'vscodeBrowser.savePdf': 'savePdf',
  'vscodeBrowser.openInSystemBrowser': 'openExternal',
  'vscodeBrowser.copyUrl': 'copyUrl',
  'vscodeBrowser.duplicateTab': 'duplicate',
};

const asString = (value: unknown) => (typeof value === 'string' ? value : undefined);

/** Runs an extension-management action, showing failures as error notifications. */
async function reportErrors<T>(action: () => Promise<T>): Promise<T | undefined> {
  try {
    return await action();
  } catch (error) {
    void vscode.window.showErrorMessage(error instanceof Error ? error.message : String(error));
    return undefined;
  }
}

export function registerCommands(services: Services): vscode.Disposable {
  const withPanel = (run: (panel: BrowserPanel) => unknown) => () => {
    const panel = BrowserPanel.active();
    if (panel) return run(panel);
  };

  return vscode.Disposable.from(
    vscode.commands.registerCommand('vscodeBrowser.open', () => {
      const panel = BrowserPanel.active();
      if (panel) panel.reveal();
      else BrowserPanel.create(services);
    }),
    vscode.commands.registerCommand('vscodeBrowser.newWindow', () => BrowserPanel.create(services)),
    vscode.commands.registerCommand('vscodeBrowser.openUrl', async (url?: unknown) => {
      const input =
        typeof url === 'string'
          ? url
          : await vscode.window.showInputBox({
              title: 'Open in Browser',
              prompt: 'Enter a URL or search term',
              placeHolder: 'localhost:3000',
            });
      const target = input ? normalizeInput(input, getConfig().searchUrl) : undefined;
      if (target) BrowserPanel.open(services, target);
    }),
    vscode.commands.registerCommand('vscodeBrowser.openFile', (uri?: unknown) => {
      const target = uri instanceof vscode.Uri ? uri : vscode.window.activeTextEditor?.document.uri;
      if (target?.scheme !== 'file') {
        void vscode.window.showWarningMessage('Open a local file to view it in the browser.');
        return;
      }
      BrowserPanel.open(services, pathToFileURL(target.fsPath).href);
    }),
    vscode.commands.registerCommand('vscodeBrowser.bookmarkPage', () => {
      const panel = BrowserPanel.active();
      if (panel) panel.editBookmark();
      else
        void vscode.window.showInformationMessage('Open a web page in the browser to bookmark it.');
    }),
    // Tree view items pass themselves as the argument: a bookmark id, or a tab node.
    vscode.commands.registerCommand('vscodeBrowser.removeBookmark', async (id: unknown) => {
      if (typeof id !== 'string') return;
      if (await confirmRemoveBookmark(services.bookmarks, id)) services.bookmarks.remove(id);
    }),
    vscode.commands.registerCommand('vscodeBrowser.renameBookmark', async (id: unknown) => {
      if (typeof id !== 'string') return;
      const node = findNode(services.bookmarks.roots, id)?.node;
      if (!node) return;
      const title = await vscode.window.showInputBox({ prompt: 'Name', value: node.title });
      if (title !== undefined) services.bookmarks.update(id, { title });
    }),
    vscode.commands.registerCommand('vscodeBrowser.newBookmarkFolder', async (id: unknown) => {
      const title = await vscode.window.showInputBox({
        prompt: 'Folder name',
        value: 'New folder',
      });
      if (title) services.bookmarks.addFolder(typeof id === 'string' ? id : BAR_ID, title);
    }),
    vscode.commands.registerCommand('vscodeBrowser.importBookmarks', () =>
      importBookmarks(services),
    ),
    vscode.commands.registerCommand('vscodeBrowser.exportBookmarks', () =>
      exportBookmarks(services),
    ),
    vscode.commands.registerCommand('vscodeBrowser.clearBrowsingData', () =>
      clearBrowsingData(services, []),
    ),
    vscode.commands.registerCommand('vscodeBrowser.extensions.manage', () =>
      BrowserPanel.open(services, 'vb://extensions'),
    ),
    // These accept an argument (folder, file, or Web Store URL) so they can be scripted.
    vscode.commands.registerCommand('vscodeBrowser.extensions.loadUnpacked', (folder?: unknown) =>
      reportErrors(() => services.extensions.loadUnpacked(asString(folder))),
    ),
    vscode.commands.registerCommand('vscodeBrowser.extensions.installFile', (file?: unknown) =>
      reportErrors(() => services.extensions.installFile(asString(file))),
    ),
    vscode.commands.registerCommand('vscodeBrowser.extensions.installWebStore', (url?: unknown) =>
      reportErrors(() => services.extensions.installWebStore(asString(url))),
    ),
    vscode.commands.registerCommand('vscodeBrowser.extensions.remove', (id?: unknown) =>
      typeof id === 'string' ? services.extensions.remove(id) : undefined,
    ),
    vscode.commands.registerCommand('vscodeBrowser.showHistory', () =>
      BrowserPanel.open(services, 'vb://history'),
    ),
    vscode.commands.registerCommand('vscodeBrowser.showBookmarks', () =>
      BrowserPanel.open(services, 'vb://bookmarks'),
    ),
    vscode.commands.registerCommand('vscodeBrowser.newPrivateTab', () => {
      const panel = BrowserPanel.active();
      if (panel) {
        panel.reveal();
        return panel.runTabAction('newPrivate');
      }
      BrowserPanel.create(services, { private: true });
    }),
    vscode.commands.registerCommand('vscodeBrowser.focusTab', (tabId: unknown) => {
      if (typeof tabId === 'string') BrowserPanel.focusTab(tabId);
    }),
    vscode.commands.registerCommand('vscodeBrowser.closeTabById', (node: unknown) => {
      const tabId = typeof node === 'string' ? node : (node as { tab?: { id?: unknown } })?.tab?.id;
      if (typeof tabId === 'string') return BrowserPanel.closeTabById(tabId);
    }),
    vscode.commands.registerCommand('vscodeBrowser.openSettings', () =>
      vscode.commands.executeCommand(
        'workbench.action.openSettings',
        `@ext:${services.context.extension.id}`,
      ),
    ),
    vscode.commands.registerCommand('vscodeBrowser.showDownloads', () =>
      BrowserPanel.open(services, 'vb://downloads'),
    ),
    vscode.commands.registerCommand('vscodeBrowser.restartEngine', () =>
      services.engineHost.restart().catch(() => {
        // Shown in the browser panels through the engine state.
      }),
    ),
    // Not contributed to the command palette; used by integration tests and for debugging.
    vscode.commands.registerCommand(
      'vscodeBrowser.debug.copyElementAt',
      (x: unknown, y: unknown, options?: { screenshot?: unknown }) =>
        typeof x === 'number' && typeof y === 'number'
          ? BrowserPanel.active()?.copyElementAt(x, y, options?.screenshot === true)
          : undefined,
    ),
    vscode.commands.registerCommand('vscodeBrowser.debug.setAnnotations', (shapes: unknown) =>
      BrowserPanel.active()?.setAnnotations(shapes),
    ),
    vscode.commands.registerCommand('vscodeBrowser.debug.crashEngine', () =>
      services.engineHost.current?.simulateCrash(),
    ),
    // The send dialog's choice, as if clicked (integration tests).
    vscode.commands.registerCommand('vscodeBrowser.debug.savedAction', async (action: unknown) => {
      const replies: unknown[] = [];
      await sendFlow()?.handle(
        { type: 'savedAction', ...(action as { offerId: string; action: 'send' }) },
        (reply) => replies.push(reply),
      );
      return replies;
    }),
    vscode.commands.registerCommand('vscodeBrowser.debug.state', () => ({
      engine: { ...services.engineHost.getState(), launches: services.engineHost.launches },
      bookmarks: services.bookmarks.list(),
      extensions: services.extensions.list(),
      history: services.history.items.slice(0, 50),
      panels: BrowserPanel.all().map((panel) => panel.debugState()),
      context:
        contextTray()
          ?.all()
          .map((item) => contextTray()!.view(item)) ?? [],
      agents: getAgentTerminals().targets(),
      offer: sendFlow()?.lastOffer && {
        ...sendFlow()!.lastOffer!,
        images: sendFlow()!.lastOffer!.images.length,
      },
    })),
    vscode.commands.registerCommand(
      'vscodeBrowser.nextTab',
      withPanel((panel) => panel.cycleTab(1)),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.previousTab',
      withPanel((panel) => panel.cycleTab(-1)),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.openDevTools',
      withPanel((panel) => panel.openDevToolsForActiveTab()),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.toggleDevConsole',
      withPanel((panel) => panel.toggleDevConsole()),
    ),
    // These return the copied text, for tests and other extensions.
    ...Object.entries({
      'vscodeBrowser.copyConsoleErrors': 'copyErrors',
      'vscodeBrowser.copyFailedRequests': 'copyFailedRequests',
      'vscodeBrowser.copyPageContext': 'copyContext',
    } as const).map(([command, action]) =>
      vscode.commands.registerCommand(
        command,
        withPanel((panel) => panel.runDevAction(undefined, action)),
      ),
    ),
    vscode.commands.registerCommand('vscodeBrowser.screenshot.sendToTerminal', async () => {
      const item = contextTray()
        ?.all()
        .find((i) => i.kind === 'screenshot');
      if (!item) {
        void vscode.window.showInformationMessage('Take a screenshot first.');
        return undefined;
      }
      return sendContextItem(item);
    }),
    // Sends what was captured last (an element, a screenshot, errors...) to the agent.
    vscode.commands.registerCommand('vscodeBrowser.sendLatestContext', async () => {
      const item = contextTray()?.latest();
      if (!item) {
        void vscode.window.showInformationMessage(
          'Nothing captured yet. Pick an element, take a screenshot or copy the console errors first.',
        );
        return undefined;
      }
      // The latest capture with the rest of its group (the drawings taken together).
      const items = item.group ? (contextTray()?.inGroup(item.group) ?? [item]) : [item];
      const sent = await sendContextItems(items);
      const what = items.length === 1 ? `"${item.title}"` : `${items.length} screenshots`;
      if (sent) BrowserPanel.active()?.toast(`Sent ${what} to ${sent}`);
      return sent;
    }),
    // agentmux: paste a saved capture into a thread of this project and show it.
    vscode.commands.registerCommand('vscodeBrowser.openInAgentmux', async (itemId?: unknown) => {
      const items = savedFor(itemId);
      if (!items) return undefined;
      const agents = getAgentTerminals();
      await agents.refresh(true);
      const panes = agents.sendTargets().filter((t) => t.kind === 'tmux');
      if (!panes.length) {
        void vscode.window.showInformationMessage('No agent runs in agentmux for this project.');
        return undefined;
      }
      // One thread: that one. Several: ask, the default first.
      const preferred = agents.defaultTarget('terminal');
      const ordered = [...panes].sort(
        (a, b) => Number(b.id === preferred) - Number(a.id === preferred),
      );
      const pane =
        ordered.length === 1
          ? ordered[0]
          : (
              await vscode.window.showQuickPick(
                ordered.map((p) => ({ label: p.label, description: p.detail, target: p })),
                { title: 'Open in agentmux', placeHolder: 'Which thread gets it?' },
              )
            )?.target;
      return pane && sendSaved(items, pane.id, { open: true });
    }),
    vscode.commands.registerCommand('vscodeBrowser.newAgentmuxThread', async (itemId?: unknown) => {
      const items = savedFor(itemId);
      if (!items) return undefined;
      const agents = getAgentTerminals();
      await agents.refresh(true);
      const harnesses = agents.harnesses();
      if (!harnesses.length) {
        void vscode.window.showInformationMessage('agentmux does not have this project open.');
        return undefined;
      }
      const pick = await vscode.window.showQuickPick(
        harnesses.map((harness) => ({ label: HARNESS_LABELS[harness], harness })),
        { title: 'New agentmux thread', placeHolder: 'Which agent should it run?' },
      );
      return pick && sendSaved(items, agentmuxNewTarget(pick.harness));
    }),
    vscode.commands.registerCommand('vscodeBrowser.chooseAgentTerminal', async () => {
      await getAgentTerminals().chooseTerminal();
    }),
    vscode.commands.registerCommand(
      'vscodeBrowser.sendPageContextToChat',
      withPanel((panel) => panel.runDevAction(undefined, 'copyContext', true)),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.toggleDrawing',
      withPanel((panel) => panel.setDrawing(true)),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.screenshot.annotations',
      withPanel((panel) => panel.captureAnnotations()),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.toggleInspector',
      withPanel((panel) => panel.setInspect('copy')),
    ),
    ...(['viewport', 'fullPage', 'region', 'element'] as const).map((mode) =>
      vscode.commands.registerCommand(
        `vscodeBrowser.screenshot.${mode}`,
        withPanel((panel) => panel.screenshot(mode)),
      ),
    ),
    vscode.commands.registerCommand('vscodeBrowser.emulateDevice', (presetId?: unknown) =>
      BrowserPanel.active()?.emulateDevice(typeof presetId === 'string' ? presetId : undefined),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.toggleDeviceToolbar',
      withPanel((panel) => panel.toggleDeviceToolbar()),
    ),
    vscode.commands.registerCommand(
      'vscodeBrowser.focusAddressBar',
      withPanel((panel) => panel.focusAddressBar()),
    ),
    ...Object.entries(TAB_COMMANDS).map(([command, action]) =>
      vscode.commands.registerCommand(
        command,
        withPanel((panel) => panel.runTabAction(action)),
      ),
    ),
  );
}

/**
 * The saved items a command acts on: the one with this id, else the latest capture, with the
 * rest of its group. Undefined (and a message) when there is nothing.
 */
function savedFor(itemId: unknown): ContextItem[] | undefined {
  const tray = contextTray();
  const item = typeof itemId === 'string' ? tray?.get(itemId) : tray?.latest();
  if (!item || !tray) {
    void vscode.window.showInformationMessage(
      'Nothing saved yet. Pick an element, take a screenshot or copy the console errors first.',
    );
    return undefined;
  }
  return item.group ? tray.inGroup(item.group) : [item];
}
