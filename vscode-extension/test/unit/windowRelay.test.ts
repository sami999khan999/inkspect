import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { WindowRelay, type RelayResult } from '../../src/bridge/windowRelay';

const FAST = { claimMs: 300, resultMs: 3_000, pollMs: 20, staleMs: 30_000 };

describe('WindowRelay', () => {
  const dirs: string[] = [];
  afterEach(() => {
    for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
  });

  /** Windows sharing one folder; each records which messages it ran. */
  function windows(names = ['a', 'b', 'c'] as const) {
    const dir = mkdtempSync(join(tmpdir(), 'relay-'));
    dirs.push(dir);
    const ran: Record<string, string[]> = {};
    const relays = Object.fromEntries(
      names.map((name) => {
        ran[name] = [];
        const relay = new WindowRelay<string>(
          dir,
          name,
          () => `Window ${name.toUpperCase()}`,
          async (message): Promise<RelayResult> => {
            ran[name]!.push(message);
            return { ok: true, path: `${name}:${message}` };
          },
          FAST,
        );
        relay.announce();
        return [name, relay];
      }),
    ) as Record<(typeof names)[number], WindowRelay<string>>;
    return { dir, ran, ...relays };
  }

  /** Lets `relay` pick up its sends, like its folder watcher would. */
  function watch(relay: WindowRelay<string>): () => void {
    const timer = setInterval(() => void relay.poll(), 20);
    return () => clearInterval(timer);
  }

  it('lists the open windows, the one used last first', async () => {
    const { a, b, c } = windows();
    b.markFocused();
    await new Promise((resolve) => setTimeout(resolve, 5));
    c.markFocused();
    expect(a.windows().map((w) => [w.id, w.name])).toEqual([
      ['c', 'Window C'],
      ['b', 'Window B'],
      ['a', 'Window A'],
    ]);
    c.leave();
    expect(a.windows().map((w) => w.id)).toEqual(['b', 'a']);
  });

  it('runs a send here when this window was used last', async () => {
    const { a, ran } = windows();
    a.markFocused();
    expect(await a.dispatch('shot')).toEqual({ ok: true, path: 'a:shot' });
    expect(ran.a).toEqual(['shot']);
  });

  it('hands a send to the window used last, and returns its result', async () => {
    const { a, b, ran, dir } = windows();
    b.markFocused();
    const stop = watch(b);
    const result = await a.dispatch('shot');
    stop();
    expect(result).toEqual({ ok: true, path: 'b:shot' });
    expect(ran.a).toEqual([]);
    expect(ran.b).toEqual(['shot']);
    // Nothing is left behind but the windows' announcements.
    expect(readdirSync(dir).filter((f) => !f.endsWith('.window'))).toEqual([]);
  });

  it('sends to the window the user picked, even if another was used last', async () => {
    const { a, b, c, ran } = windows();
    b.markFocused();
    const stop = watch(c);
    expect(await a.dispatch('picked', 'c')).toEqual({ ok: true, path: 'c:picked' });
    stop();
    expect(ran.b).toEqual([]);
    expect(ran.c).toEqual(['picked']);
  });

  it('falls back to the window used last when the picked one has closed', async () => {
    const { a, b, c, ran } = windows();
    b.markFocused();
    c.leave();
    const stop = watch(b);
    expect(await a.dispatch('late', 'c')).toEqual({ ok: true, path: 'b:late' });
    stop();
    expect(ran.b).toEqual(['late']);
  });

  it('runs the send itself when the chosen window never takes it (it hangs)', async () => {
    const { a, b, ran } = windows();
    b.markFocused();
    expect(await a.dispatch('orphan')).toEqual({ ok: true, path: 'a:orphan' });
    expect(ran.a).toEqual(['orphan']);
    // Too late for the other window: the request is gone.
    await b.poll();
    expect(ran.b).toEqual([]);
  });
});
