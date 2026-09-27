import * as vscode from 'vscode';

/** The VS Code container a browser window is shown in (an editor tab). */
export interface BrowserHost {
  readonly webview: vscode.Webview;
  readonly visible: boolean;
  /** Whether this is the active editor. */
  readonly active: boolean;
  setTitle(title: string): void;
  reveal(): void;
  /** Closes the editor tab. */
  dispose(): void;
  readonly onDidChangeViewState: vscode.Event<unknown>;
  readonly onDidDispose: vscode.Event<unknown>;
}

export function webviewOptions(extensionUri: vscode.Uri): vscode.WebviewOptions {
  return {
    enableScripts: true,
    localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'dist', 'webview')],
  };
}

export function editorHost(panel: vscode.WebviewPanel, extensionUri: vscode.Uri): BrowserHost {
  panel.iconPath = {
    light: vscode.Uri.joinPath(extensionUri, 'media', 'globe-light.svg'),
    dark: vscode.Uri.joinPath(extensionUri, 'media', 'globe-dark.svg'),
  };
  return {
    webview: panel.webview,
    get visible() {
      return panel.visible;
    },
    get active() {
      return panel.active;
    },
    setTitle: (title) => {
      panel.title = title;
    },
    reveal: () => panel.reveal(),
    dispose: () => panel.dispose(),
    onDidChangeViewState: panel.onDidChangeViewState,
    onDidDispose: panel.onDidDispose,
  };
}
