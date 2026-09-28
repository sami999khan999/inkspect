import * as vscode from 'vscode';
import { initAgentSend } from './agent/chat';
import { BrowserAgent } from './agent/BrowserAgent';
import { registerLanguageModelTools } from './agent/languageModelTools';
import { McpHttpServer, registerMcpCommands } from './agent/mcpServer';
import { BridgeServer } from './bridge/bridgeServer';
import { registerCommands } from './commands';
import { getConfig } from './config';
import { EngineHost } from './engineHost';
import { BookmarksStore } from './features/bookmarks';
import { DownloadsManager } from './features/downloads';
import { ExtensionsManager } from './features/extensions';
import { HistoryStore } from './features/historyStore';
import { SessionStore } from './features/sessions';
import { registerTerminalLinks } from './features/terminalLinks';
import { ZoomStore } from './features/zoom';
import { BrowserPanel, type Services } from './panel/BrowserPanel';
import { SHORTCUTS_VIEW_ID, ShortcutsViewProvider } from './sidebar/ShortcutsView';
import { registerSidebar } from './sidebar/views';

let engineHost: EngineHost | undefined;

export function activate(context: vscode.ExtensionContext): void {
  const logger = vscode.window.createOutputChannel('VS Code Browser', { log: true });
  const downloads = new DownloadsManager(context.globalState, logger);
  engineHost = new EngineHost(context, downloads, logger);
  const storage = context.globalStorageUri.fsPath;
  const bookmarks = new BookmarksStore(storage, context.globalState);
  const history = new HistoryStore(storage);
  const extensions = new ExtensionsManager(storage, () => engineHost!.start(), logger);
  engineHost.setLaunchHook((engine) => extensions.installAll(engine));
  const services: Services = {
    context,
    engineHost,
    downloads,
    bookmarks,
    history,
    extensions,
    sessions: new SessionStore(context.workspaceState),
    zoom: new ZoomStore(context.globalState),
    logger,
  };

  const agent = new BrowserAgent(services);
  const mcp = new McpHttpServer(context, agent, logger);
  void mcp.sync();
  initAgentSend(context.globalStorageUri.fsPath);
  const bridge = new BridgeServer(context, bookmarks, logger);
  void bridge.sync();
  const shortcutsView = new ShortcutsViewProvider(
    context.extensionUri,
    () => bridge.connected.length > 0,
    bridge.onDidChange,
  );

  const statusBarItem = vscode.window.createStatusBarItem(
    'vscodeBrowser.status',
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.name = 'VS Code Browser';
  statusBarItem.text = '$(globe) Browser';
  statusBarItem.tooltip = 'Open the VS Code Browser';
  statusBarItem.command = 'vscodeBrowser.open';
  const updateStatusBar = () => {
    if (getConfig().showStatusBarItem) statusBarItem.show();
    else statusBarItem.hide();
  };
  updateStatusBar();

  context.subscriptions.push(
    logger,
    downloads,
    engineHost,
    statusBarItem,
    bookmarks,
    history,
    extensions,
    registerCommands(services),
    ...registerLanguageModelTools(agent),
    mcp,
    ...registerMcpCommands(mcp),
    bridge,
    vscode.commands.registerCommand('vscodeBrowser.bridge.pair', () => bridge.startPairing()),
    vscode.commands.registerCommand('vscodeBrowser.bridge.forget', () => bridge.forgetAll()),
    // For the integration tests.
    vscode.commands.registerCommand('vscodeBrowser.debug.bridge', async (options?: unknown) => {
      const mode = (options as { firstSyncMode?: 'merge' } | undefined)?.firstSyncMode;
      if (mode) bridge.firstSyncModeForTests = mode;
      await bridge.sync();
      return {
        port: bridge.port,
        code: bridge.createPairingCode(),
        connected: bridge.connected,
        offers: bridge.pendingOffers(),
      };
    }),
    vscode.window.registerWebviewPanelSerializer(BrowserPanel.viewType, {
      deserializeWebviewPanel: async (panel, state: unknown) => {
        const windowId = (state as { windowId?: unknown } | undefined)?.windowId;
        BrowserPanel.restore(services, panel, typeof windowId === 'string' ? windowId : undefined);
      },
    }),
    registerSidebar(services),
    shortcutsView,
    vscode.window.registerWebviewViewProvider(SHORTCUTS_VIEW_ID, shortcutsView),
    vscode.commands.registerCommand('vscodeBrowser.editShortcuts', () =>
      vscode.commands.executeCommand(`${SHORTCUTS_VIEW_ID}.focus`),
    ),
    engineHost.onPageOpened((event) => BrowserPanel.routePageOpened(services, event)),
    registerTerminalLinks(
      () => getConfig().openLinksFromTerminal,
      (url) => BrowserPanel.open(services, url),
    ),
    vscode.workspace.onDidSaveTextDocument((document) => {
      if (document.uri.scheme !== 'file' || !getConfig().liveReloadFiles) return;
      for (const panel of BrowserPanel.all()) panel.reloadFile(document.uri.fsPath);
    }),
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('vscodeBrowser.showStatusBarItem')) updateStatusBar();
      if (event.affectsConfiguration('vscodeBrowser.mcp')) void mcp.sync();
      if (event.affectsConfiguration('vscodeBrowser.bridge')) void bridge.sync();
      if (event.affectsConfiguration('vscodeBrowser.downloads.directory')) {
        void services.engineHost.current?.setDownloadsDir(downloads.directory);
      }
    }),
  );
}

export async function deactivate(): Promise<void> {
  await engineHost?.stop();
}
