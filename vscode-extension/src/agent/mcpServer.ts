import { randomBytes, timingSafeEqual } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import type { AddressInfo } from 'node:net';
import * as vscode from 'vscode';
import { copyText } from '../features/clipboard';
import { errorMessage } from '../browser/logger';
import { getConfig } from '../config';
import { RPC_PARSE_ERROR, handleMcpMessage, type McpServerInfo } from './mcpProtocol';
import type { BrowserAgentApi } from './tools';

const TOKEN_KEY = 'vscodeBrowser.mcp.token';
const PORT_KEY = 'vscodeBrowser.mcp.port';
const MAX_BODY = 1024 * 1024;

/**
 * The browser tools as an MCP server (Streamable HTTP, JSON responses only) on 127.0.0.1, for
 * agents outside VS Code such as CLI agents. Requests need the bearer token from
 * **Browser: Copy MCP Server Configuration**. Off unless `vscodeBrowser.mcp.enabled` is set.
 */
export class McpHttpServer implements vscode.Disposable {
  private server?: Server;
  private token?: string;
  private starting?: Promise<void>;

  constructor(
    private readonly context: vscode.ExtensionContext,
    private readonly agent: BrowserAgentApi,
    private readonly logger: vscode.LogOutputChannel,
  ) {}

  get running(): boolean {
    return !!this.server?.listening;
  }

  get url(): string | undefined {
    const address = this.server?.address() as AddressInfo | null | undefined;
    return address ? `http://127.0.0.1:${address.port}/mcp` : undefined;
  }

  get bearerToken(): string | undefined {
    return this.token;
  }

  /** Starts or stops the server to match the settings. */
  async sync(): Promise<void> {
    await this.starting;
    const { mcpEnabled, mcpPort } = getConfig();
    const address = this.server?.address() as AddressInfo | null | undefined;
    if (!mcpEnabled) {
      this.stop();
      return;
    }
    if (address && (!mcpPort || mcpPort === address.port)) return;
    this.stop();
    this.starting = this.start(mcpPort).finally(() => (this.starting = undefined));
    await this.starting;
  }

  private async start(configuredPort: number): Promise<void> {
    this.token = await this.context.secrets.get(TOKEN_KEY);
    if (!this.token) {
      this.token = randomBytes(24).toString('base64url');
      await this.context.secrets.store(TOKEN_KEY, this.token);
    }
    // Keep the same port across restarts so client configurations keep working.
    const remembered = this.context.globalState.get<number>(PORT_KEY);
    const server = createServer((request, response) => void this.onRequest(request, response));
    const listen = (port: number) =>
      new Promise<void>((resolve, reject) => {
        server.once('error', reject);
        server.listen(port, '127.0.0.1', () => {
          server.off('error', reject);
          resolve();
        });
      });
    try {
      await listen(configuredPort || remembered || 0);
    } catch (error) {
      if (configuredPort) {
        this.logger.error(
          `MCP server: port ${configuredPort} is not available (${errorMessage(error)}).`,
        );
        void vscode.window.showErrorMessage(
          `The browser MCP server could not use port ${configuredPort}: ${errorMessage(error)}`,
        );
        return;
      }
      this.logger.warn(`MCP server: port ${remembered} is taken, using another one.`);
      await listen(0);
      void vscode.window
        .showWarningMessage(
          'The browser MCP server moved to a new port. Copy its configuration again for your agents.',
          'Copy Configuration',
        )
        .then((choice) => {
          if (choice) void vscode.commands.executeCommand('vscodeBrowser.mcp.copyConfig');
        });
    }
    this.server = server;
    const port = (server.address() as AddressInfo).port;
    if (!configuredPort) await this.context.globalState.update(PORT_KEY, port);
    this.logger.info(`MCP server listening on http://127.0.0.1:${port}/mcp`);
  }

  private stop(): void {
    if (!this.server) return;
    this.server.close();
    this.server.closeAllConnections();
    this.server = undefined;
    this.logger.info('MCP server stopped');
  }

  private async onRequest(request: IncomingMessage, response: ServerResponse): Promise<void> {
    const send = (status: number, body?: unknown, headers: Record<string, string> = {}) => {
      response.writeHead(status, {
        ...(body === undefined ? {} : { 'content-type': 'application/json' }),
        ...headers,
      });
      response.end(body === undefined ? undefined : JSON.stringify(body));
    };
    const port = (this.server?.address() as AddressInfo | null)?.port;
    const host = request.headers.host ?? '';
    const origin = request.headers.origin;
    // Guard against DNS rebinding and web pages talking to the server.
    if (host !== `127.0.0.1:${port}` && host !== `localhost:${port}`) return send(403);
    if (origin && !/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(origin)) return send(403);
    if ((request.url ?? '').split('?')[0] !== '/mcp') return send(404);
    if (!this.authorized(request.headers.authorization)) {
      return send(401, undefined, { 'www-authenticate': 'Bearer' });
    }
    // No server-to-client stream (GET) and no sessions (DELETE): JSON responses only.
    if (request.method !== 'POST') return send(405, undefined, { allow: 'POST' });

    let body: string;
    try {
      body = await readBody(request);
    } catch {
      return send(413);
    }
    let message: unknown;
    try {
      message = JSON.parse(body);
    } catch {
      return send(400, {
        jsonrpc: '2.0',
        id: null,
        error: { code: RPC_PARSE_ERROR, message: 'Parse error' },
      });
    }
    const server: McpServerInfo = {
      name: 'vscode-browser',
      version: String(this.context.extension.packageJSON.version ?? '0.0.0'),
    };
    try {
      if (Array.isArray(message)) {
        const responses = (
          await Promise.all(message.map((m) => handleMcpMessage(m, this.agent, server)))
        ).filter(Boolean);
        return responses.length ? send(200, responses) : send(202);
      }
      const reply = await handleMcpMessage(message, this.agent, server);
      return reply ? send(200, reply) : send(202);
    } catch (error) {
      this.logger.error(`MCP request failed: ${errorMessage(error)}`);
      return send(500);
    }
  }

  private authorized(header: string | undefined): boolean {
    const match = /^Bearer (.+)$/.exec(header ?? '');
    if (!match || !this.token) return false;
    const given = Buffer.from(match[1]!);
    const expected = Buffer.from(this.token);
    return given.length === expected.length && timingSafeEqual(given, expected);
  }

  dispose(): void {
    this.stop();
  }
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    request.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error('Request too large'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

/** Client configurations for the running server. */
export function mcpClientConfigs(url: string, token: string): { label: string; text: string }[] {
  return [
    {
      label: 'JSON ("mcpServers", e.g. .mcp.json)',
      text: JSON.stringify(
        {
          mcpServers: {
            'vscode-browser': { type: 'http', url, headers: { Authorization: `Bearer ${token}` } },
          },
        },
        null,
        2,
      ),
    },
    {
      label: 'Claude Code command',
      text: `claude mcp add --transport http vscode-browser ${url} --header "Authorization: Bearer ${token}"`,
    },
    { label: 'URL and token', text: `URL: ${url}\nAuthorization: Bearer ${token}` },
  ];
}

export function registerMcpCommands(server: McpHttpServer): vscode.Disposable[] {
  return [
    vscode.commands.registerCommand('vscodeBrowser.mcp.copyConfig', async () => {
      if (!server.running) {
        const choice = await vscode.window.showInformationMessage(
          'The browser MCP server is off. Turn it on? It listens on 127.0.0.1 only and needs a token.',
          'Turn On',
        );
        if (!choice) return;
        await vscode.workspace
          .getConfiguration('vscodeBrowser')
          .update('mcp.enabled', true, vscode.ConfigurationTarget.Global);
        await server.sync();
      }
      const { url, bearerToken } = server;
      if (!url || !bearerToken) return;
      const pick = await vscode.window.showQuickPick(mcpClientConfigs(url, bearerToken), {
        title: 'Copy the MCP server configuration for',
      });
      if (!pick) return;
      await copyText(pick.text);
      void vscode.window.showInformationMessage(
        'Copied. Keep the token private: anyone with it can control the browser.',
      );
    }),
    // For the integration tests.
    vscode.commands.registerCommand('vscodeBrowser.debug.mcp', async () => {
      await server.sync();
      return { url: server.url, token: server.bearerToken };
    }),
  ];
}
