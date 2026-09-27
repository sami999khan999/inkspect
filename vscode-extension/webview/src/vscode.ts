import type { HostToWebview, WebviewToHost } from '@shared/protocol';

interface VsCodeApi {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VsCodeApi;

// acquireVsCodeApi() may only be called once per webview, so it lives at module level.
const vscode = acquireVsCodeApi();

export function postToHost(message: WebviewToHost): void {
  vscode.postMessage(message);
}

/** Saved by VS Code with the webview and handed back when it restores the panel. */
export function saveWebviewState(state: { windowId: string }): void {
  vscode.setState(state);
}

/** Subscribes to messages from the extension host. Returns an unsubscribe function. */
export function onHostMessage(handler: (message: HostToWebview) => void): () => void {
  const listener = (event: MessageEvent<HostToWebview>) => handler(event.data);
  window.addEventListener('message', listener);
  return () => window.removeEventListener('message', listener);
}
