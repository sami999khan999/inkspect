import * as vscode from 'vscode';
import { ALL_FIELDS, type DetailField } from './shared/elementInfo';
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
  screenshotAction: 'saveAndCopy' | 'save' | 'copy' | 'ask';
  annotationPadding: number;
  inspectorCopyFormat: 'markdown' | 'json' | 'selector' | 'html';
  inspectorFields: DetailField[];
  inspectorMaxHtml: number;
  inspectorWriteSelectionFile: boolean;
  drawingClearOnNavigation: boolean;
  devtoolsEnabled: boolean;
  agentConfirmNavigation: boolean;
  mcpEnabled: boolean;
  mcpPort: number;
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
    screenshotAction: oneOf(
      c.get('screenshots.defaultAction'),
      ['saveAndCopy', 'save', 'copy', 'ask'] as const,
      'saveAndCopy',
    ),
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
    mcpEnabled: c.get<boolean>('mcp.enabled', false),
    mcpPort: c.get<number>('mcp.port', 0),
    logCdp: c.get<boolean>('debug.logCdp', false),
  };
}

function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
  return options.includes(value as T) ? (value as T) : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, Math.round(value)));
}
