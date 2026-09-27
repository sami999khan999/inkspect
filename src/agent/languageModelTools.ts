import * as vscode from 'vscode';
import { getConfig } from '../config';
import { BROWSER_TOOLS, agentUrl, type BrowserAgentApi } from './tools';

type ToolInput = Record<string, unknown>;

/** `LanguageModelDataPart` is newer than the VS Code API version this extension targets. */
const DataPart = (
  vscode as unknown as {
    LanguageModelDataPart?: { image(data: Uint8Array, mimeType: string): unknown };
  }
).LanguageModelDataPart;

/** Registers the browser tools for agents in VS Code chat (see `contributes.languageModelTools`). */
export function registerLanguageModelTools(agent: BrowserAgentApi): vscode.Disposable[] {
  if (typeof vscode.lm?.registerTool !== 'function') return [];
  return BROWSER_TOOLS.map((tool) =>
    vscode.lm.registerTool<ToolInput>(tool.name, {
      prepareInvocation(options) {
        if (tool.name !== 'browser_navigate') return { invocationMessage: `${tool.title}…` };
        let url: string;
        try {
          url = agentUrl(options.input.url);
        } catch {
          url = String(options.input.url);
        }
        return {
          invocationMessage: `Opening ${url}`,
          confirmationMessages: getConfig().agentConfirmNavigation
            ? {
                title: 'Open a page in the browser?',
                message: new vscode.MarkdownString(
                  `The agent wants to open \`${url}\` in the browser.`,
                ),
              }
            : undefined,
        };
      },
      async invoke(options) {
        const output = await tool.run(options.input ?? {}, agent);
        const parts: unknown[] = [new vscode.LanguageModelTextPart(output.text)];
        if (output.image && DataPart)
          parts.push(DataPart.image(output.image.data, output.image.mimeType));
        // Image parts come from the newer API, which the typings here do not know about yet.
        return new vscode.LanguageModelToolResult(parts as vscode.LanguageModelTextPart[]);
      },
    }),
  );
}
