/**
 * A minimal Model Context Protocol server (tools only) over JSON-RPC. Transport-independent and
 * free of VS Code dependencies so it can be unit tested; `mcpServer.ts` serves it over HTTP.
 */
import { BROWSER_TOOLS, findTool, type BrowserAgentApi } from './tools';

export const MCP_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];

interface JsonRpcRequest {
  jsonrpc: '2.0';
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

export type JsonRpcResponse =
  | { jsonrpc: '2.0'; id: string | number | null; result: unknown }
  | { jsonrpc: '2.0'; id: string | number | null; error: { code: number; message: string } };

export const RPC_PARSE_ERROR = -32700;
export const RPC_INVALID_REQUEST = -32600;
export const RPC_METHOD_NOT_FOUND = -32601;
export const RPC_INVALID_PARAMS = -32602;

export interface McpServerInfo {
  name: string;
  version: string;
}

function isRequest(value: unknown): value is JsonRpcRequest {
  if (!value || typeof value !== 'object') return false;
  const message = value as Record<string, unknown>;
  return (
    message.jsonrpc === '2.0' &&
    typeof message.method === 'string' &&
    (message.params === undefined ||
      (typeof message.params === 'object' && message.params !== null))
  );
}

const error = (id: JsonRpcRequest['id'], code: number, message: string): JsonRpcResponse => ({
  jsonrpc: '2.0',
  id: id ?? null,
  error: { code, message },
});

/**
 * Handles one JSON-RPC message. Returns the response, or `undefined` for notifications (which
 * get no response).
 */
export async function handleMcpMessage(
  message: unknown,
  agent: BrowserAgentApi,
  server: McpServerInfo,
): Promise<JsonRpcResponse | undefined> {
  if (!isRequest(message)) return error(null, RPC_INVALID_REQUEST, 'Invalid JSON-RPC request');
  const { id, method } = message;
  const params = message.params ?? {};
  // Notifications (no id), e.g. notifications/initialized: nothing to answer.
  if (id === undefined) return undefined;
  const result = (value: unknown): JsonRpcResponse => ({ jsonrpc: '2.0', id, result: value });

  switch (method) {
    case 'initialize': {
      const requested = params.protocolVersion;
      const protocolVersion =
        typeof requested === 'string' && MCP_PROTOCOL_VERSIONS.includes(requested)
          ? requested
          : MCP_PROTOCOL_VERSIONS[0];
      return result({
        protocolVersion,
        capabilities: { tools: { listChanged: false } },
        serverInfo: server,
        instructions:
          'Tools for the Chromium browser running inside VS Code (VS Code Browser extension): open pages, take screenshots, read element details, console errors and failed requests of the page the user is looking at.',
      });
    }
    case 'ping':
      return result({});
    case 'tools/list':
      return result({
        tools: BROWSER_TOOLS.map((tool) => ({
          name: tool.name,
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
          annotations: {
            title: tool.title,
            readOnlyHint: tool.readOnly,
            openWorldHint: !tool.readOnly,
          },
        })),
      });
    case 'tools/call': {
      const tool = typeof params.name === 'string' ? findTool(params.name) : undefined;
      if (!tool) return error(id, RPC_INVALID_PARAMS, `Unknown tool: ${String(params.name)}`);
      const args =
        params.arguments && typeof params.arguments === 'object'
          ? (params.arguments as Record<string, unknown>)
          : {};
      try {
        const output = await tool.run(args, agent);
        const content: unknown[] = [{ type: 'text', text: output.text }];
        if (output.image) {
          content.push({
            type: 'image',
            data: Buffer.from(output.image.data).toString('base64'),
            mimeType: output.image.mimeType,
          });
        }
        return result({ content });
      } catch (failure) {
        // Tool errors are results the model can read, not protocol errors.
        return result({
          content: [
            { type: 'text', text: failure instanceof Error ? failure.message : String(failure) },
          ],
          isError: true,
        });
      }
    }
    default:
      return error(id, RPC_METHOD_NOT_FOUND, `Method not found: ${method}`);
  }
}
