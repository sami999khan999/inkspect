// The browser side of the link to VS Code (see @inkspect/shared/bridge).
import {
  BRIDGE_PATH,
  BRIDGE_PORT_RANGE,
  DEFAULT_BRIDGE_PORT,
  encode,
  parseServerMessage,
  type ClientInfo,
  type ClientMessage,
  type ServerMessage,
} from '@inkspect/shared/bridge';
import type { BridgeStatus } from '../messages';

interface Stored {
  clientId?: string;
  token?: string;
  port?: number;
}

/** A friendly browser name for VS Code's messages ("Google Chrome", "Microsoft Edge"...). */
export function browserName(): string {
  if (__BROWSER__ === 'firefox') return 'Firefox';
  const nav = navigator as Navigator & {
    userAgentData?: { brands: { brand: string }[] };
    brave?: unknown;
  };
  if (nav.brave) return 'Brave';
  const brands = nav.userAgentData?.brands.map((b) => b.brand) ?? [];
  for (const name of ['Microsoft Edge', 'Opera', 'Vivaldi', 'Google Chrome']) {
    if (brands.includes(name)) return name;
  }
  return 'Chromium';
}

type Listener = (message: ServerMessage) => void;

/**
 * Whether something listens on the port. Chrome logs every refused WebSocket on the extension's
 * Errors page (JS can't catch it), and the link retries while VS Code is closed, so a plain
 * request goes first: a refused `fetch` only rejects. VS Code answers it with a 404; a timeout
 * also means something is there.
 */
async function listening(port: number): Promise<boolean> {
  try {
    await fetch(`http://127.0.0.1:${port}${BRIDGE_PATH}`, {
      mode: 'no-cors',
      cache: 'no-store',
      signal: AbortSignal.timeout(2_000),
    });
    return true;
  } catch (error) {
    return error instanceof DOMException && error.name === 'TimeoutError';
  }
}

export class BridgeClient {
  status: BridgeStatus = { state: 'offline' };
  private socket?: WebSocket;
  private client?: ClientInfo;
  private token?: string;
  private retry?: ReturnType<typeof setTimeout>;
  private keepAlive?: ReturnType<typeof setInterval>;
  private delay = 1000;
  /** Counts connection attempts, so a probe that a newer attempt replaced is dropped. */
  private attempt = 0;
  private probing = false;
  /** First port to try (a stored override exists for tests). */
  private basePort = DEFAULT_BRIDGE_PORT;
  private readonly listeners = new Set<Listener>();
  private readonly statusListeners = new Set<(status: BridgeStatus) => void>();
  private pairWaiter?: (reply: ServerMessage) => void;

  onMessage(listener: Listener): void {
    this.listeners.add(listener);
  }

  onStatus(listener: (status: BridgeStatus) => void): void {
    this.statusListeners.add(listener);
  }

  get connected(): boolean {
    return this.status.state === 'connected';
  }

  async start(): Promise<void> {
    const stored = (await chrome.storage.local.get(['clientId', 'token', 'port'])) as Stored;
    let clientId = stored.clientId;
    if (!clientId) {
      clientId = crypto.randomUUID();
      await chrome.storage.local.set({ clientId });
    }
    this.client = { id: clientId, browser: browserName() };
    this.token = stored.token;
    this.basePort = stored.port ?? DEFAULT_BRIDGE_PORT;
    this.connect();
  }

  /** Connects now if not connected (called on any wake-up of the background). */
  ensureConnected(): void {
    if (!this.socket && !this.retry && !this.probing) this.connect();
  }

  send(message: ClientMessage): boolean {
    if (this.socket?.readyState !== WebSocket.OPEN) return false;
    this.socket.send(encode(message));
    return true;
  }

  /** Pairs with the code VS Code shows. */
  async pair(code: string): Promise<BridgeStatus> {
    // Wait for a connection that is still opening (or start one).
    if (!this.socket && !this.probing) this.connect();
    for (
      let i = 0;
      i < 30 && (this.probing || this.socket?.readyState === WebSocket.CONNECTING);
      i++
    ) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    if (!this.client || !this.send({ type: 'pair', code: code.trim(), client: this.client })) {
      return {
        state: 'offline',
        error: 'VS Code is not running, or its browser link is turned off.',
      };
    }
    const reply = await new Promise<ServerMessage | undefined>((resolve) => {
      this.pairWaiter = resolve;
      setTimeout(() => resolve(undefined), 10_000);
    });
    this.pairWaiter = undefined;
    if (reply?.type === 'paired') return this.status;
    return {
      ...this.status,
      error: reply?.type === 'error' ? reply.message : 'No answer from VS Code.',
    };
  }

  /** Reads the stored port again and reconnects (tests). */
  async reconnect(): Promise<void> {
    const stored = (await chrome.storage.local.get(['port', 'token'])) as Stored;
    this.basePort = stored.port ?? DEFAULT_BRIDGE_PORT;
    this.token = stored.token;
    this.socket?.close();
    this.socket = undefined;
    this.delay = 1000;
    this.connect();
  }

  async unpair(): Promise<void> {
    this.token = undefined;
    await chrome.storage.local.remove('token');
    this.socket?.close();
    this.setStatus({ state: 'unpaired' });
  }

  private setStatus(status: BridgeStatus): void {
    this.status = status;
    for (const listener of this.statusListeners) listener(status);
  }

  private connect(port?: number, attempt = 0): void {
    clearTimeout(this.retry);
    this.retry = undefined;
    const target = port ?? this.basePort;
    this.setStatus({ ...this.status, state: this.token ? 'connecting' : this.status.state });
    const current = ++this.attempt;
    this.probing = true;
    void listening(target).then((up) => {
      if (current !== this.attempt) return;
      this.probing = false;
      if (up) this.open(target, attempt);
      else this.closed(target, attempt, false);
    });
  }

  private open(target: number, attempt: number): void {
    let socket: WebSocket;
    try {
      socket = new WebSocket(`ws://127.0.0.1:${target}${BRIDGE_PATH}`);
    } catch {
      this.scheduleRetry();
      return;
    }
    this.socket = socket;
    let opened = false;
    socket.onopen = () => {
      opened = true;
      // The retry delay resets only once VS Code accepts us (see handle), so a server that keeps
      // closing the connection gets slower and slower retries instead of one per second.
      if (this.client) {
        // Without a token this announces an unpaired browser, so VS Code can offer to pair it.
        socket.send(encode({ type: 'hello', client: this.client, token: this.token ?? '' }));
      }
      if (!this.token) this.setStatus({ state: 'unpaired' });
      // Keeps the connection (and Chrome's service worker) alive while VS Code runs.
      clearInterval(this.keepAlive);
      this.keepAlive = setInterval(() => this.send({ type: 'ping' }), 20_000);
    };
    socket.onmessage = (event) => {
      const message = parseServerMessage(String(event.data));
      if (message) void this.handle(message);
    };
    socket.onclose = () => {
      // A socket we already replaced (reconnect) must not touch the current one.
      if (this.socket !== socket) return;
      clearInterval(this.keepAlive);
      this.socket = undefined;
      this.closed(target, attempt, opened);
    };
  }

  /** Nothing (more) on this port: try the next one, or wait and start over. */
  private closed(target: number, attempt: number, opened: boolean): void {
    if (!opened && attempt < BRIDGE_PORT_RANGE - 1) {
      // Nothing on this port: try the next one (another VS Code install may use it).
      this.connect(target + 1, attempt + 1);
      return;
    }
    if (this.status.state !== 'unpaired') this.setStatus({ state: 'offline' });
    this.scheduleRetry();
  }

  private scheduleRetry(): void {
    clearTimeout(this.retry);
    this.retry = setTimeout(() => {
      this.retry = undefined;
      this.connect();
    }, this.delay);
    this.delay = Math.min(this.delay * 2, 30_000);
  }

  private async handle(message: ServerMessage): Promise<void> {
    if (message.type === 'paired') {
      this.token = message.token;
      await chrome.storage.local.set({ token: message.token });
      this.pairWaiter?.(message);
    } else if (message.type === 'welcome') {
      this.delay = 1000;
      this.setStatus({ state: 'connected', peer: message.peer });
    } else if (message.type === 'windows') {
      if (this.status.state === 'connected') {
        this.setStatus({ ...this.status, windows: message.windows });
      }
    } else if (message.type === 'error') {
      if (message.code === 'unpaired') {
        this.token = undefined;
        await chrome.storage.local.remove('token');
        this.setStatus({ state: 'unpaired', error: message.message });
      }
      this.pairWaiter?.(message);
    }
    for (const listener of this.listeners) listener(message);
  }
}
