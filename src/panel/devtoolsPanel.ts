import * as vscode from 'vscode';

const panels = new Map<string, vscode.WebviewPanel>();

/**
 * Opens Chrome's own DevTools for a page in a VS Code editor beside the browser. The frontend is
 * served by the browser's localhost debugging port and connects to the page over its WebSocket.
 */
export function openDevTools(port: number, targetId: string, title: string): void {
  const existing = panels.get(targetId);
  if (existing) {
    existing.reveal(vscode.ViewColumn.Beside);
    return;
  }
  const panel = vscode.window.createWebviewPanel(
    'vscodeBrowser.devtools',
    `DevTools: ${title.slice(0, 40)}`,
    { viewColumn: vscode.ViewColumn.Beside, preserveFocus: false },
    { enableScripts: true, retainContextWhenHidden: true },
  );
  panels.set(targetId, panel);
  panel.onDidDispose(() => panels.delete(targetId));
  const origin = `http://127.0.0.1:${port}`;
  const src = `${origin}/devtools/inspector.html?ws=127.0.0.1:${port}/devtools/page/${encodeURIComponent(targetId)}`;
  panel.webview.html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; frame-src ${origin}; style-src 'unsafe-inline'">
  <style>html, body, iframe { margin: 0; padding: 0; width: 100%; height: 100%; border: 0; overflow: hidden; }</style>
</head>
<body><iframe src="${src}" title="DevTools"></iframe></body>
</html>`;
}

/** Closes the DevTools panel of a page that went away. */
export function closeDevTools(targetId: string): void {
  panels.get(targetId)?.dispose();
}
