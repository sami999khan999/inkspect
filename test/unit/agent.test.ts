import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { handleMcpMessage } from '../../src/agent/mcpProtocol';
import {
  BROWSER_TOOLS,
  agentUrl,
  languageModelToolsContribution,
  type BrowserAgentApi,
} from '../../src/agent/tools';

function fakeAgent(overrides: Partial<BrowserAgentApi> = {}): BrowserAgentApi {
  return {
    navigate: vi.fn(async (url: string) => ({ url, title: 'Title' })),
    screenshot: vi.fn(async () => ({
      displayPath: '.vscode-browser/screenshots/a.png',
      data: new Uint8Array([1, 2, 3]),
      mimeType: 'image/png',
    })),
    element: vi.fn(async (selector: string) => `### Element: \`${selector}\``),
    devText: vi.fn(async (kind: string) => `text:${kind}`),
    pageText: vi.fn(async (max: number) => `page:${max}`),
    selection: () => undefined,
    ...overrides,
  };
}

const SERVER = { name: 'vscode-browser', version: '1.0.0' };

describe('agentUrl', () => {
  it('adds a scheme', () => {
    expect(agentUrl('example.com')).toBe('https://example.com/');
    expect(agentUrl('localhost:3000/app')).toBe('http://localhost:3000/app');
    expect(agentUrl('127.0.0.1:5173')).toBe('http://127.0.0.1:5173/');
    expect(agentUrl('http://example.com/a?b=1')).toBe('http://example.com/a?b=1');
    expect(agentUrl('file:///C:/site/index.html')).toBe('file:///C:/site/index.html');
  });

  it('rejects other schemes and empty input', () => {
    expect(() => agentUrl('javascript:alert(1)')).toThrow(/Only http/);
    expect(() => agentUrl('chrome://settings')).toThrow(/Only http/);
    expect(() => agentUrl('')).toThrow(/required/);
    expect(() => agentUrl(42)).toThrow(/required/);
  });
});

describe('browser tools', () => {
  it('have unique names that VS Code and MCP accept', () => {
    const names = BROWSER_TOOLS.map((t) => t.name);
    expect(new Set(names).size).toBe(names.length);
    for (const name of names) expect(name).toMatch(/^[a-z][a-z0-9_]{0,63}$/);
  });

  it('are declared in package.json exactly as defined (run `npm run sync:tools`)', () => {
    const pkg = JSON.parse(readFileSync(join(__dirname, '..', '..', 'package.json'), 'utf8'));
    expect(pkg.contributes.languageModelTools).toEqual(languageModelToolsContribution());
  });

  it('screenshot passes mode, selector and the image through', async () => {
    const agent = fakeAgent();
    const tool = BROWSER_TOOLS.find((t) => t.name === 'browser_screenshot')!;
    const output = await tool.run({ mode: 'fullPage', selector: ' h1 ' }, agent);
    expect(agent.screenshot).toHaveBeenCalledWith('fullPage', 'h1');
    expect(output.text).toContain('.vscode-browser/screenshots/a.png');
    expect(output.image?.mimeType).toBe('image/png');
  });

  it('get_selection explains how to pick when nothing is picked', async () => {
    const tool = BROWSER_TOOLS.find((t) => t.name === 'browser_get_selection')!;
    expect((await tool.run({}, fakeAgent())).text).toMatch(/not picked/);
    expect((await tool.run({}, fakeAgent({ selection: () => 'picked' }))).text).toBe('picked');
  });

  it('page text clamps maxLength', async () => {
    const agent = fakeAgent();
    const tool = BROWSER_TOOLS.find((t) => t.name === 'browser_get_page_text')!;
    await tool.run({}, agent);
    await tool.run({ maxLength: 10_000_000 }, agent);
    expect(agent.pageText).toHaveBeenNthCalledWith(1, 20_000);
    expect(agent.pageText).toHaveBeenNthCalledWith(2, 200_000);
  });
});

describe('MCP protocol', () => {
  it('initializes with a supported protocol version', async () => {
    const reply = await handleMcpMessage(
      { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-03-26' } },
      fakeAgent(),
      SERVER,
    );
    expect(reply).toMatchObject({
      id: 1,
      result: { protocolVersion: '2025-03-26', serverInfo: SERVER, capabilities: { tools: {} } },
    });
    const unknown = await handleMcpMessage(
      { jsonrpc: '2.0', id: 2, method: 'initialize', params: { protocolVersion: '1999-01-01' } },
      fakeAgent(),
      SERVER,
    );
    expect(unknown).toMatchObject({ result: { protocolVersion: '2025-06-18' } });
  });

  it('does not answer notifications', async () => {
    expect(
      await handleMcpMessage(
        { jsonrpc: '2.0', method: 'notifications/initialized' },
        fakeAgent(),
        SERVER,
      ),
    ).toBeUndefined();
  });

  it('lists the tools with annotations', async () => {
    const reply = await handleMcpMessage(
      { jsonrpc: '2.0', id: 'a', method: 'tools/list' },
      fakeAgent(),
      SERVER,
    );
    const tools = (reply as { result: { tools: { name: string; annotations: object }[] } }).result
      .tools;
    expect(tools.map((t) => t.name)).toEqual(BROWSER_TOOLS.map((t) => t.name));
    expect(tools.find((t) => t.name === 'browser_navigate')?.annotations).toMatchObject({
      readOnlyHint: false,
    });
  });

  it('calls a tool and returns text and image content', async () => {
    const reply = await handleMcpMessage(
      { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'browser_screenshot' } },
      fakeAgent(),
      SERVER,
    );
    expect(reply).toMatchObject({
      id: 3,
      result: {
        content: [
          { type: 'text' },
          { type: 'image', data: Buffer.from([1, 2, 3]).toString('base64'), mimeType: 'image/png' },
        ],
      },
    });
  });

  it('reports tool failures as error results', async () => {
    const reply = await handleMcpMessage(
      {
        jsonrpc: '2.0',
        id: 4,
        method: 'tools/call',
        params: { name: 'browser_navigate', arguments: { url: 'javascript:alert(1)' } },
      },
      fakeAgent(),
      SERVER,
    );
    expect(reply).toMatchObject({ result: { isError: true } });
  });

  it('rejects unknown tools, unknown methods and malformed messages', async () => {
    const agent = fakeAgent();
    expect(
      await handleMcpMessage(
        { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'nope' } },
        agent,
        SERVER,
      ),
    ).toMatchObject({ error: { code: -32602 } });
    expect(
      await handleMcpMessage({ jsonrpc: '2.0', id: 6, method: 'resources/list' }, agent, SERVER),
    ).toMatchObject({ error: { code: -32601 } });
    expect(await handleMcpMessage({ hello: 1 }, agent, SERVER)).toMatchObject({
      id: null,
      error: { code: -32600 },
    });
  });
});
