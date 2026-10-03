import * as vscode from 'vscode';
import { DEFAULT_BRIDGE_PORT } from '@inkspect/shared/bridge';
import { ALL_FIELDS, type DetailField } from './shared/elementInfo';
import { sanitizeOverrides, type ShortcutOverrides } from './shared/shortcuts';
import { DEFAULT_SEARCH_URL } from './shared/url';

const SEARCH_ENGINES: Record<string, string> = {
  google: DEFAULT_SEARCH_URL,
  bing: 'https://www.bing.com/search?q=%s',
  duckduckgo: 'https://duckduckgo.com/?q=%s',
};

export interface BrowserConfig {
  homepage: string;
  /** Search URL with `%s` where the query goes. */
  searchUrl: string;
  chromiumExecutablePath: string;
  chromiumExtraArgs: string[];
  jpegQuality: number;
  maxLiveTabs: number;
  downloadsDirectory: string;
  ignoreLocalhostCertificateErrors: boolean;
  openLinksFromTerminal: boolean;
  liveReloadFiles: boolean;
  showStatusBarItem: boolean;
  showBookmarksBar: boolean;
  sessionRestore: 'always' | 'never';
  screenshotsDirectory: string;
  screenshotFormat: 'png' | 'jpeg' | 'webp';
  /** Also save screenshots as files (they are always copied). */
  screenshotSaveFile: boolean;
  annotationPadding: number;
  inspectorCopyFormat: 'markdown' | 'json' | 'selector' | 'html';
  inspectorFields: DetailField[];
  inspectorMaxHtml: number;
  inspectorWriteSelectionFile: boolean;
  drawingClearOnNavigation: boolean;
  devtoolsEnabled: boolean;
  agentConfirmNavigation: boolean;
  agentSendTarget: 'terminal' | 'chat';
  agentCommand: string;
  agentCollectConsoleErrors: boolean;
  shortcuts: ShortcutOverrides;
  shortcutsUpdated: number;
  recordMaxSeconds: number;
  mcpEnabled: boolean;
  mcpPort: number;
  bridgeEnabled: boolean;
  bridgePort: number;
  bridgeSyncBookmarks: boolean;
  /** Register the local hub with browsers and link through it (Linux). */
  hubEnabled: boolean;
  /** tmux servers (`tmux -L <name>`) to look for agents on (agentmux threads, tmux panes). */
  agentTmuxSockets: string[];
  logCdp: boolean;
}

export function getConfig(): BrowserConfig {
  const c = vscode.workspace.getConfiguration('vscodeBrowser');
  const engine = c.get<string>('searchEngine', 'google');
  const customSearch = c.get<string>('searchEngineUrl', '');
  return {
    homepage: c.get<string>('homepage', 'vb://newtab') || 'vb://newtab',
    searchUrl:
      engine === 'custom' && customSearch.includes('%s')
        ? customSearch
        : (SEARCH_ENGINES[engine] ?? DEFAULT_SEARCH_URL),
    chromiumExecutablePath: c.get<string>('chromium.executablePath', '').trim(),
    chromiumExtraArgs: c.get<string[]>('chromium.extraArgs', []),
    jpegQuality: clamp(c.get<number>('render.jpegQuality', 85), 30, 100),
    maxLiveTabs: clamp(c.get<number>('tabs.maxLive', 10), 1, 100),
    downloadsDirectory: c.get<string>('downloads.directory', '').trim(),
    ignoreLocalhostCertificateErrors: c.get<boolean>('ignoreLocalhostCertificateErrors', false),
    openLinksFromTerminal: c.get<boolean>('openLinksFromTerminal', true),
    liveReloadFiles: c.get<boolean>('liveReloadFiles', true),
    showStatusBarItem: c.get<boolean>('showStatusBarItem', true),
    showBookmarksBar: c.get<boolean>('showBookmarksBar', true),
    sessionRestore: c.get<string>('session.restore', 'always') === 'never' ? 'never' : 'always',
    screenshotsDirectory: c.get<string>('screenshots.directory', '').trim(),
    screenshotFormat: oneOf(c.get('screenshots.format'), ['png', 'jpeg', 'webp'] as const, 'png'),
    screenshotSaveFile: screenshotSaveFile(c),
    annotationPadding: clamp(c.get<number>('screenshots.annotationPadding', 40), 0, 500),
    inspectorCopyFormat: oneOf(
      c.get('inspector.copyFormat'),
      ['markdown', 'json', 'selector', 'html'] as const,
      'markdown',
    ),
    inspectorFields: (c.get<string[]>('inspector.fields') ?? [...ALL_FIELDS]).filter(
      (f): f is DetailField => (ALL_FIELDS as readonly string[]).includes(f),
    ),
    inspectorMaxHtml: clamp(c.get<number>('inspector.maxHtmlLength', 1500), 100, 50_000),
    inspectorWriteSelectionFile: c.get<boolean>('inspector.writeSelectionFile', false),
    drawingClearOnNavigation: c.get<boolean>('drawing.clearOnNavigation', true),
    devtoolsEnabled: c.get<boolean>('devtools.enabled', true),
    agentConfirmNavigation: c.get<boolean>('agent.confirmNavigation', true),
    agentSendTarget: oneOf(c.get('agent.sendTarget'), ['terminal', 'chat'] as const, 'terminal'),
    agentCommand: c.get<string>('agent.command', 'claude').trim() || 'claude',
    agentCollectConsoleErrors: c.get<boolean>('agent.collectConsoleErrors', true),
    shortcuts: sanitizeOverrides(c.get('shortcuts')),
    shortcutsUpdated: c.get<number>('shortcutsUpdated', 0),
    recordMaxSeconds: clamp(c.get<number>('record.maxSeconds', 60), 5, 600),
    mcpEnabled: c.get<boolean>('mcp.enabled', false),
    mcpPort: c.get<number>('mcp.port', 0),
    bridgeEnabled: c.get<boolean>('bridge.enabled', true),
    bridgePort: c.get<number>('bridge.port', DEFAULT_BRIDGE_PORT),
    bridgeSyncBookmarks: c.get<boolean>('bridge.syncBookmarks', true),
    hubEnabled: c.get<boolean>('hub.enabled', true),
    // INKSPECT_TMUX_SOCKETS overrides it (as for the hub): tests keep off this machine's tmux.
    agentTmuxSockets: (process.env.INKSPECT_TMUX_SOCKETS !== undefined
      ? process.env.INKSPECT_TMUX_SOCKETS.split(',')
      : c.get<unknown>('agent.tmuxSockets') instanceof Array
        ? c.get<unknown[]>('agent.tmuxSockets')!
        : ['agents', 'default']
    )
      .filter((s): s is string => typeof s === 'string' && /^[\w.-]{1,64}$/.test(s))
      .slice(0, 10),
    logCdp: c.get<boolean>('debug.logCdp', false),
  };
}

function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

/**
 * `screenshots.saveFile`, or for settings made before it existed, the old
 * `screenshots.defaultAction` ("copy" meant: don't save a file).
 */
function screenshotSaveFile(c: vscode.WorkspaceConfiguration): boolean {
  const set = c.inspect<boolean>('screenshots.saveFile');
  const value = set?.workspaceFolderValue ?? set?.workspaceValue ?? set?.globalValue;
  if (typeof value === 'boolean') return value;
  return c.get<string>('screenshots.defaultAction') !== 'copy';
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}
