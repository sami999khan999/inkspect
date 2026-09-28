import * as vscode from 'vscode';
import { sendContextItem } from '../agent/chat';
import type { ContextItem, ContextTray } from '../agent/contextTray';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import { onDidChangeShortcuts } from '../features/shortcutSettings';
import type { AgentTerminals } from '../features/terminalSend';
import { renderWebviewHtml } from '../panel/webviewHtml';
import {
  isContextViewMessage,
  type ContextViewToHost,
  type HostToContextView,
} from '../shared/agentContext';
import { effectiveShortcuts } from '../shared/shortcuts';

export const CONTEXT_VIEW_ID = 'vscodeBrowser.agentContext';

/**
 * The Agent Context view in the Browser sidebar: everything captured in the browser (elements,
 * screenshots, console errors, reports), each with a button that sends it to an agent running
 * in a terminal, and a picker for which agent when several run.
 */
export class ContextViewProvider implements vscode.WebviewViewProvider, vscode.Disposable {
  private view?: vscode.WebviewView;
  private readonly disposables: vscode.Disposable[] = [];
  private stateTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly extensionUri: vscode.Uri,
    private readonly tray: ContextTray,
    private readonly agents: AgentTerminals,
  ) {
    this.disposables.push(
      tray.onDidChange(() => this.postStateSoon()),
      tray.onDidAddImage((item) => this.postThumbnail(item)),
      agents.onDidChange(() => this.postStateSoon()),
      onDidChangeShortcuts(() => this.postStateSoon()),
    );
  }

  resolveWebviewView(view: vscode.WebviewView): void {
    this.view = view;
    view.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this.extensionUri, 'dist', 'webview')],
    };
    view.webview.html = renderWebviewHtml(view.webview, this.extensionUri, 'context');
    view.webview.onDidReceiveMessage(
      (message: unknown) => {
        if (!isContextViewMessage(message)) return;
        this.handle(message).catch((error: unknown) =>
          vscode.window.showErrorMessage(`Agent Context: ${errorMessage(error)}`),
        );
      },
      undefined,
      this.disposables,
    );
    view.onDidChangeVisibility(
      () => {
        // Look for agents started since the view was last shown.
        if (view.visible) void this.agents.refresh().then(() => this.postState());
      },
      undefined,
      this.disposables,
    );
    view.onDidDispose(() => (this.view = undefined), undefined, this.disposables);
  }

  private async handle(message: ContextViewToHost): Promise<void> {
    const item = 'id' in message ? this.tray.get(message.id) : undefined;
    switch (message.type) {
      case 'ready':
        this.postState();
        for (const i of this.tray.all()) this.postThumbnail(i);
        await this.agents.refresh(true);
        this.postState();
        return;
      case 'send':
        if (item) await sendContextItem(item, message.target);
        return;
      case 'copy':
        if (item) {
          await this.tray.copy(item);
          vscode.window.setStatusBarMessage(`$(copy) Copied "${item.title}"`, 3_000);
        }
        return;
      case 'open': {
        if (!item) return;
        const file = await this.tray.fileOf(item);
        if (file) await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(file));
        else if (item.text) {
          const document = await vscode.workspace.openTextDocument({
            content: item.text,
            language: 'markdown',
          });
          await vscode.window.showTextDocument(document, { preview: true });
        }
        return;
      }
      case 'remove':
        if (item) this.tray.remove(item.id);
        return;
      case 'clear':
        this.tray.clear();
        return;
      case 'setTarget':
        this.agents.setDefault(message.target);
        return;
      case 'chooseTerminal':
        await this.agents.chooseTerminal();
        return;
      case 'startAgent':
        this.agents.startAgent(getConfig().agentCommand);
        return;
    }
  }

  private postStateSoon(): void {
    this.stateTimer ??= setTimeout(() => {
      this.stateTimer = undefined;
      this.postState();
    }, 50);
  }

  private postState(): void {
    if (!this.view) return;
    const isMac = process.platform === 'darwin';
    const map = effectiveShortcuts(getConfig().shortcuts, isMac);
    const key = (id: string) => {
      return map[id]?.[0] ?? '';
    };
    const message: HostToContextView = {
      type: 'state',
      items: this.tray.all().map((i) => this.tray.view(i)),
      targets: this.agents.targets(),
      target: this.agents.defaultTarget(getConfig().agentSendTarget),
      keys: { show: key('agent.showContext'), sendLatest: key('agent.sendLatest') },
    };
    void this.view.webview.postMessage(message);
  }

  private postThumbnail(item: ContextItem): void {
    if (!this.view || !item.image) return;
    const message: HostToContextView = {
      type: 'thumbnail',
      id: item.id,
      // A copy: Node buffers can be views into a larger shared pool, which doesn't survive
      // postMessage as the image alone.
      data: new Uint8Array(item.image.bytes),
      mimeType: item.image.mimeType,
    };
    void this.view.webview.postMessage(message);
  }

  dispose(): void {
    clearTimeout(this.stateTimer);
    for (const d of this.disposables) d.dispose();
  }
}
