import { randomUUID } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

/** What a send produces, whichever window runs it. */
export interface RelayResult {
  ok: boolean;
  path?: string;
  error?: string;
}

/** An open VS Code window, as the others see it. */
export interface RelayWindow {
  id: string;
  /** What the user knows it by: its workspace's name. */
  name: string;
  /** When it last had focus (0: not yet). */
  focusedAt: number;
}

interface Presence extends RelayWindow {
  /** Last heartbeat. */
  seen: number;
}

interface Request<T> {
  id: string;
  /** The window that should run it. */
  to: string;
  at: number;
  message: T;
}

export interface RelayTimings {
  /** How long the chosen window has to take a request before the sender runs it itself. */
  claimMs: number;
  /** Sends can wait on the user (choosing a terminal), so results may take a while. */
  resultMs: number;
  pollMs: number;
  /** A window that hasn't sent a heartbeat for this long is gone (closed or crashed). */
  staleMs: number;
}

const DEFAULT_TIMINGS: RelayTimings = {
  claimMs: 3_000,
  resultMs: 120_000,
  pollMs: 150,
  staleMs: 30_000,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs browser sends in the VS Code window the user chose, or else in the one used last. Only
 * one window serves the browser link (it owns the port), so the windows meet in a shared folder:
 *
 * - `<window>.window` announces a window (its name, when it last had focus), refreshed by a
 *   heartbeat (`announce`), so the others can list the open windows.
 * - `<id>.json` is a send for one window; renaming it to `<id>.taken.json` claims it (renames are
 *   atomic, so exactly one window runs it), and `<id>.result.json` carries the outcome back.
 *
 * A send nobody takes in time (its window closed) runs in the serving window.
 */
export class WindowRelay<T> {
  private readonly running = new Set<string>();
  private focusedAt = 0;

  constructor(
    private readonly dir: string,
    /** This window's id (new for every window session). */
    readonly windowId: string,
    /** This window's name, read at every announcement (the workspace can change). */
    private readonly name: () => string,
    private readonly run: (message: T) => Promise<RelayResult>,
    private readonly timings: RelayTimings = DEFAULT_TIMINGS,
  ) {
    mkdirSync(dir, { recursive: true });
  }

  private now(): number {
    return Date.now();
  }

  /** This window has focus: sends go here unless the user picks another. */
  markFocused(): void {
    this.focusedAt = this.now();
    this.announce();
  }

  /** Tells the other windows this one is open (call regularly, as a heartbeat). */
  announce(): void {
    const presence: Presence = {
      id: this.windowId,
      name: this.name(),
      focusedAt: this.focusedAt,
      seen: this.now(),
    };
    this.write(`${this.windowId}.window`, presence);
  }

  /** This window is closing: the others stop listing it. */
  leave(): void {
    this.remove(`${this.windowId}.window`);
  }

  /** The open windows, the one used last first. */
  windows(): RelayWindow[] {
    const alive: RelayWindow[] = [];
    for (const name of this.list()) {
      if (!name.endsWith('.window')) continue;
      const presence = this.read<Presence>(name);
      if (
        !presence ||
        typeof presence.id !== 'string' ||
        typeof presence.seen !== 'number' ||
        this.now() - presence.seen > this.timings.staleMs
      ) {
        // Closed without saying so (a crash): tidy up after a while.
        if (presence && this.now() - presence.seen > this.timings.staleMs * 10) this.remove(name);
        continue;
      }
      alive.push({
        id: presence.id,
        name: typeof presence.name === 'string' ? presence.name : 'VS Code',
        focusedAt: typeof presence.focusedAt === 'number' ? presence.focusedAt : 0,
      });
    }
    return alive.sort((a, b) => b.focusedAt - a.focusedAt);
  }

  /** The open window that had focus last, if any. */
  lastFocused(): string | undefined {
    return this.windows()[0]?.id;
  }

  /**
   * Runs a send in window `to` when it is open, else in the window used last: here, or relayed
   * to it.
   */
  async dispatch(message: T, to?: string): Promise<RelayResult> {
    const open = this.windows();
    const target = (to && open.find((w) => w.id === to)?.id) ?? open[0]?.id;
    if (!target || target === this.windowId) return this.run(message);
    const id = randomUUID();
    const request: Request<T> = { id, to: target, at: this.now(), message };
    this.write(`${id}.json`, request);
    const deadline = this.now() + this.timings.claimMs;
    while (this.now() < deadline) {
      await sleep(this.timings.pollMs);
      if (!existsSync(this.path(`${id}.json`))) return this.awaitResult(id);
    }
    // Nobody took it (that window closed or hangs): run it here, unless the other window
    // claims it at this very moment.
    if (!this.claim(id)) return this.awaitResult(id);
    this.remove(`${id}.taken.json`);
    return this.run(message);
  }

  /** Takes and runs the sends addressed to this window (call when the folder changes). */
  async poll(): Promise<void> {
    if (Math.random() < 0.02) this.tidy();
    for (const name of this.list()) {
      const id = /^([\w-]+)\.json$/.exec(name)?.[1];
      if (!id || this.running.has(id)) continue;
      const request = this.read<Request<T>>(name);
      if (!request) continue;
      if (request.to !== this.windowId) {
        // Left behind by a window that closed mid-send: clean up after a while.
        if (this.now() - request.at > this.timings.resultMs) this.remove(name);
        continue;
      }
      if (!this.claim(id)) continue;
      this.running.add(id);
      void this.run(request.message)
        .catch((error: unknown): RelayResult => ({ ok: false, error: String(error) }))
        .then((result) => {
          this.write(`${id}.result.json`, result);
          this.remove(`${id}.taken.json`);
        })
        .finally(() => this.running.delete(id));
    }
  }

  private async awaitResult(id: string): Promise<RelayResult> {
    const deadline = this.now() + this.timings.resultMs;
    while (this.now() < deadline) {
      const result = this.read<RelayResult>(`${id}.result.json`);
      if (result) {
        this.remove(`${id}.result.json`);
        return result;
      }
      await sleep(this.timings.pollMs);
    }
    return { ok: false, error: 'The VS Code window did not answer.' };
  }

  /** Claims a request; false when another window got it first. */
  private claim(id: string): boolean {
    try {
      renameSync(this.path(`${id}.json`), this.path(`${id}.taken.json`));
      return true;
    } catch {
      return false;
    }
  }

  private list(): string[] {
    try {
      return readdirSync(this.dir);
    } catch {
      return [];
    }
  }

  private path(name: string): string {
    return join(this.dir, name);
  }

  private read<R>(name: string): R | undefined {
    try {
      return JSON.parse(readFileSync(this.path(name), 'utf8')) as R;
    } catch {
      return undefined;
    }
  }

  /**
   * Atomic: written to a temporary name, then renamed (a reader never sees half a file). On
   * Windows the rename fails while another window has the file open for reading; it is retried,
   * then written in place (a reader may then see a half-written file, which reads as nothing
   * and is read again later).
   */
  private write(name: string, value: unknown): void {
    mkdirSync(this.dir, { recursive: true });
    const text = JSON.stringify(value);
    const temp = this.path(`.${name}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`);
    writeFileSync(temp, text, 'utf8');
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        renameSync(temp, this.path(name));
        return;
      } catch {
        // Busy: try again at once (the reader holds it for a moment only).
      }
    }
    rmSync(temp, { force: true });
    writeFileSync(this.path(name), text, 'utf8');
  }

  /** Temporary files left by writes interrupted before their rename (a window was closed). */
  private tidy(): void {
    for (const name of this.list()) {
      if (!name.startsWith('.') || !name.endsWith('.tmp')) continue;
      try {
        if (this.now() - statSync(this.path(name)).mtimeMs > 60_000) this.remove(name);
      } catch {
        // Gone already.
      }
    }
  }

  private remove(name: string): void {
    rmSync(this.path(name), { force: true });
  }
}
