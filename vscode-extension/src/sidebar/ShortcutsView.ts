import { readFile, writeFile } from 'node:fs/promises';
import * as vscode from 'vscode';
import { errorMessage } from '../browser/logger';
import { onDidChangeShortcuts, readShortcuts, writeShortcuts } from '../features/shortcutSettings';
import { renderWebviewHtml } from '../panel/webviewHtml';
import { SHORTCUT_ACTIONS, sanitizeOverrides } from '../shared/shortcuts';
import {
  isShortcutsViewMessage,
  type HostToShortcutsView,
  type ShortcutsViewToHost,
} from '../shared/shortcutsView';

export const SHORTCUTS_VIEW_ID = 'vscodeBrowser.shortcuts';

/** The shortcut editor in the Browser sidebar: every action, with its keys, remappable. */
export class ShortcutsViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  private view?: vscode.WebviewView;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly browserLinked: () => boolean,
    onLinkChange: vscode.Event<void>,
  ) {
    this.disposables.push(
      onDidChangeShortcuts(() => this.postState()),
      onLinkChange(() => this.postState()),
    );
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview')],
    };
    view.webview.html = renderWebviewHtml(view.webview, this.extensionUri, 'shortcuts');
    view.webview.onDidReceiveMessage(
      (message: unknown) => {
        if (!isShortcutsViewMessage(message)) return;
        this.handle(message).catch((error: unknown) =>
          vscode.window.showErrorMessage(`Shortcuts: ${errorMessage(error)}`),
        );
      },
      undefined,
      this.disposables,
    );
    view.onDidDispose(() => (this.view = undefined), undefined, this.disposables);
  }

  private async handle(message: ShortcutsViewToHost): Promise<void> {
    const { overrides } = readShortcuts();
    const known = SHORTCUT_ACTIONS.some((a) => 'id' in message && a.id === message.id);
    switch (message.type) {
      case 'ready':
        this.postState();
        return;
      case 'set':
        if (known) await writeShortcuts({ ...overrides, [message.id]: message.keys });
        return;
      case 'reset': {
        if (!known) return;
        const next = { ...overrides };
        delete next[message.id];
        await writeShortcuts(next);
        return;
      }
      case 'resetAll': {
        const choice = await vscode.window.showWarningMessage(
          'Reset every browser shortcut to its default?',
          { modal: true },
          'Reset All',
        );
        if (choice) await writeShortcuts({});
        return;
      }
      case 'export': {
        const uri = await vscode.window.showSaveDialog({
          title: 'Export browser shortcuts',
          defaultUri: vscode.Uri.file('browser-shortcuts.json'),
          filters: { JSON: ['json'] },
        });
        if (!uri) return;
        const file = { inkspectShortcuts: 1, shortcuts: overrides };
        await writeFile(uri.fsPath, `${JSON.stringify(file, null, 2)}\n`, 'utf8');
        void vscode.window.showInformationMessage(`Shortcuts exported to ${uri.fsPath}`);
        return;
      }
      case 'import': {
        const [uri] =
          (await vscode.window.showOpenDialog({
            title: 'Import browser shortcuts',
            canSelectMany: false,
            filters: { JSON: ['json'] },
          })) ?? [];
        if (!uri) return;
        const parsed = JSON.parse(await readFile(uri.fsPath, 'utf8')) as unknown;
        const shortcuts =
          parsed && typeof parsed === 'object' && 'shortcuts' in parsed
            ? (parsed as { shortcuts: unknown }).shortcuts
            : parsed;
        const imported = sanitizeOverrides(shortcuts);
        await writeShortcuts(imported);
        void vscode.window.showInformationMessage(
          `Imported ${Object.keys(imported).length} shortcut changes.`,
        );
        return;
      }
    }
  }

  private postState(): void {
    const { overrides, updated } = readShortcuts();
    const message: HostToShortcutsView = {
      type: 'state',
      overrides,
      updated,
      browserLinked: this.browserLinked(),
    };
    void this.view?.webview.postMessage(message);
  }

  dispose(): void {
    for (const d of this.disposables) d.dispose();
  }
}
