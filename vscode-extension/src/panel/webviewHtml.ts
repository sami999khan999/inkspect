import { randomBytes } from 'node:crypto';
import * as vscode from 'vscode';

/** HTML that loads one of the React apps built into `dist/webview` (`index`: the browser). */
export function renderWebviewHtml(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  entry: 'index' | 'shortcuts' | 'context' = 'index',
): string {
  const root = vscode.Uri.joinPath(extensionUri, 'dist', 'webview');
  const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(root, `${entry}.js`));
  const styleUri = webview.asWebviewUri(vscode.Uri.joinPath(root, `${entry}.css`));
  const nonce = randomBytes(16).toString('base64');
  const csp = [
    `default-src 'none'`,
    // Favicons are loaded from the sites themselves; page frames are drawn from blobs.
    `img-src ${webview.cspSource} https: http: data: blob:`,
    `style-src ${webview.cspSource}`,
    `font-src ${webview.cspSource}`,
    `script-src 'nonce-${nonce}'`,
  ].join('; ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${styleUri}">
  <title>${{ index: 'Browser', shortcuts: 'Shortcuts', context: 'Agent Context' }[entry]}</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
}
