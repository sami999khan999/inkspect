/**
 * Browser tools for AI agents. The same definitions back the VS Code language model tools
 * (`contributes.languageModelTools`, kept in sync by a unit test) and the local MCP server.
 * This module has no VS Code dependency; the browser is reached through `BrowserAgentApi`.
 */

export interface ScreenshotResult {
  /** Path to show an agent (workspace-relative when possible). */
  displayPath: string;
  data: Uint8Array;
  mimeType: string;
}

export interface BrowserAgentApi {
  navigate(url: string): Promise<{ url: string; title: string }>;
  screenshot(mode: 'viewport' | 'fullPage', selector?: string): Promise<ScreenshotResult>;
  /** Markdown details of the first element matching a CSS selector. */
  element(selector: string): Promise<string>;
  devText(kind: 'errors' | 'failedRequests' | 'context'): Promise<string>;
  pageText(maxLength: number): Promise<string>;
  /** The element(s) the user last picked with the element selector, as Markdown. */
  selection(): string | undefined;
}

export interface ToolOutput {
  text: string;
  image?: { data: Uint8Array; mimeType: string };
}

export interface JsonSchema {
  type: 'object';
  properties: Record<string, Record<string, unknown>>;
  required?: string[];
  additionalProperties?: boolean;
}

export interface BrowserTool {
  name: string;
  /** Shown in the tools picker. */
  title: string;
  /** Written for the model. */
  description: string;
  inputSchema: JsonSchema;
  /** Only reads from the browser (no navigation). */
  readOnly: boolean;
  run(input: Record<string, unknown>, agent: BrowserAgentApi): Promise<ToolOutput>;
}

const NO_INPUT: JsonSchema = { type: 'object', properties: {}, additionalProperties: false };

/** `example.com` → `https://example.com`; only http(s) and file pages can be opened. */
export function agentUrl(input: unknown): string {
  if (typeof input !== 'string' || !input.trim()) throw new Error('`url` is required.');
  const text = input.trim();
  const withScheme = /^[a-z][a-z0-9+.-]*:(?!\d)/i.test(text)
    ? text
    : /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?(\/|$)/i.test(text)
      ? `http://${text}`
      : `https://${text}`;
  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    throw new Error(`Not a valid URL: ${text}`);
  }
  if (!['http:', 'https:', 'file:'].includes(url.protocol))
    throw new Error(`Only http, https and file URLs can be opened (got ${url.protocol}).`);
  return url.href;
}

function selectorInput(input: Record<string, unknown>): string {
  const selector = input.selector;
  if (typeof selector !== 'string' || !selector.trim()) throw new Error('`selector` is required.');
  return selector.trim();
}

export const BROWSER_TOOLS: BrowserTool[] = [
  {
    name: 'browser_navigate',
    title: 'Open a URL in the browser',
    description:
      'Opens a URL in the active tab of the VS Code Browser (a Chromium browser inside VS Code) and waits for it to load. Use it to show or check a web page, for example a local dev server such as http://localhost:3000. Returns the final URL and page title.',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description:
            'The URL to open. http, https and file URLs; a missing scheme means https (http for localhost).',
        },
      },
      required: ['url'],
      additionalProperties: false,
    },
    readOnly: false,
    async run(input, agent) {
      const page = await agent.navigate(agentUrl(input.url));
      return { text: `Loaded ${page.url}\nTitle: ${page.title || '(none)'}` };
    },
  },
  {
    name: 'browser_screenshot',
    title: 'Screenshot the browser page',
    description:
      'Takes a screenshot of the page in the VS Code Browser and saves it as an image file. Captures the visible viewport by default, the whole page with mode "fullPage", or one element with a CSS selector. Returns the file path (and the image, where supported).',
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: ['viewport', 'fullPage'],
          description: 'What to capture when no selector is given. Default: viewport.',
        },
        selector: {
          type: 'string',
          description: 'CSS selector of an element to capture instead (the first match).',
        },
      },
      additionalProperties: false,
    },
    readOnly: true,
    async run(input, agent) {
      const mode = input.mode === 'fullPage' ? 'fullPage' : 'viewport';
      const selector =
        typeof input.selector === 'string' && input.selector.trim()
          ? input.selector.trim()
          : undefined;
      const shot = await agent.screenshot(mode, selector);
      const what = selector
        ? `element \`${selector}\``
        : mode === 'fullPage'
          ? 'full page'
          : 'viewport';
      return {
        text: `Screenshot of the ${what} saved to ${shot.displayPath}`,
        image: { data: shot.data, mimeType: shot.mimeType },
      };
    },
  },
  {
    name: 'browser_get_element',
    title: 'Get element details',
    description:
      'Returns details of the first element matching a CSS selector on the page in the VS Code Browser: a unique selector, XPath, role and accessible name, size and position, key computed styles, the UI framework component and its source file when detectable, and trimmed HTML.',
    inputSchema: {
      type: 'object',
      properties: {
        selector: { type: 'string', description: 'CSS selector, e.g. "form#login button".' },
      },
      required: ['selector'],
      additionalProperties: false,
    },
    readOnly: true,
    async run(input, agent) {
      return { text: await agent.element(selectorInput(input)) };
    },
  },
  {
    name: 'browser_get_selection',
    title: 'Get the element the user picked',
    description:
      'Returns the element(s) the user last picked with the element selector cursor of the VS Code Browser, as Markdown details. Use it when the user refers to "this element" or "the element I selected".',
    inputSchema: NO_INPUT,
    readOnly: true,
    async run(_input, agent) {
      return {
        text:
          agent.selection() ??
          'The user has not picked an element yet. They can pick one with the element selector (Ctrl+Shift+C in the browser).',
      };
    },
  },
  {
    name: 'browser_console_errors',
    title: 'Get console errors',
    description:
      'Returns console errors, warnings and uncaught exceptions of the page in the VS Code Browser since it was loaded, with source locations (workspace paths when they map to workspace files).',
    inputSchema: NO_INPUT,
    readOnly: true,
    async run(_input, agent) {
      return { text: await agent.devText('errors') };
    },
  },
  {
    name: 'browser_failed_requests',
    title: 'Get failed network requests',
    description:
      'Returns network requests of the page in the VS Code Browser that failed or returned HTTP 400 or above. Requests are recorded from the first call on (or from when the developer drawer was opened), so reload the page after the first call to see requests made while loading.',
    inputSchema: NO_INPUT,
    readOnly: true,
    async run(_input, agent) {
      return { text: await agent.devText('failedRequests') };
    },
  },
  {
    name: 'browser_page_context',
    title: 'Get page context',
    description:
      'Returns a summary of the page in the VS Code Browser: URL, title, viewport or emulated device, the text the user selected, recent console errors and failed requests.',
    inputSchema: NO_INPUT,
    readOnly: true,
    async run(_input, agent) {
      return { text: await agent.devText('context') };
    },
  },
  {
    name: 'browser_get_page_text',
    title: 'Get page text',
    description:
      'Returns the visible text of the page in the VS Code Browser (document.body.innerText), with its URL and title. Long pages are truncated.',
    inputSchema: {
      type: 'object',
      properties: {
        maxLength: {
          type: 'number',
          description: 'Maximum number of characters to return. Default 20000.',
        },
      },
      additionalProperties: false,
    },
    readOnly: true,
    async run(input, agent) {
      const max =
        typeof input.maxLength === 'number' && input.maxLength > 0
          ? Math.min(Math.floor(input.maxLength), 200_000)
          : 20_000;
      return { text: await agent.pageText(max) };
    },
  },
];

export function findTool(name: string): BrowserTool | undefined {
  return BROWSER_TOOLS.find((tool) => tool.name === name);
}

/** The `contributes.languageModelTools` entries for package.json (see scripts/sync-tools.mjs). */
export function languageModelToolsContribution(): Record<string, unknown>[] {
  return BROWSER_TOOLS.map((tool) => ({
    name: tool.name,
    displayName: tool.title,
    toolReferenceName: tool.name.replace(/_([a-z])/g, (_, c: string) => c.toUpperCase()),
    canBeReferencedInPrompt: true,
    icon: '$(globe)',
    userDescription: tool.title,
    modelDescription: tool.description,
    tags: ['browser'],
    inputSchema: tool.inputSchema,
  }));
}
