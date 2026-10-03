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
          () => ({
            name: `Window ${name.toUpperCase()}`,
            folders: [`/p/${name}`],
            targets: [{ id: 'terminal:1', kind: 'terminal', label: 'Codex', detail: 'terminal' }],
          }),
          async (message): Promise<RelayResult> => {
            ran[name]!.push(message);
            return { ok: true, sentTo: `${name}:${message}` };
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

  it('lists the open windows, the one used last first, with their folders and agents', async () => {
    const { a, b, c } = windows();
    b.markFocused();
    await new Promise((resolve) => setTimeout(resolve, 5));
    c.markFocused();
    expect(a.windows().map((w) => [w.id, w.name])).toEqual([
      ['c', 'Window C'],
      ['b', 'Window B'],
      ['a', 'Window A'],
    ]);
    expect(a.windows()[0]).toMatchObject({
      folders: ['/p/c'],
      targets: [{ id: 'terminal:1', label: 'Codex' }],
    });
    c.leave();
    expect(a.windows().map((w) => w.id)).toEqual(['b', 'a']);
  });

  it('runs a send for this window here', async () => {
    const { a, ran } = windows();
    expect(await a.dispatch('shot', 'a')).toEqual({ ok: true, sentTo: 'a:shot' });
    expect(ran.a).toEqual(['shot']);
  });

  it('hands a send to the window it is for, and returns its result', async () => {
    const { a, b, ran, dir } = windows();
    const stop = watch(b);
    const result = await a.dispatch('shot', 'b');
    stop();
    expect(result).toEqual({ ok: true, sentTo: 'b:shot' });
    expect(ran.a).toEqual([]);
    expect(ran.b).toEqual(['shot']);
    // Nothing is left behind but the windows' announcements.
    expect(readdirSync(dir).filter((f) => !f.endsWith('.window'))).toEqual([]);
  });

  it('fails a send for a window that closed, or never takes it (it hangs)', async () => {
    const { a, b, c, ran } = windows();
    c.leave();
    expect(await a.dispatch('late', 'c')).toEqual({
      ok: false,
      error: 'That VS Code window is closed.',
    });
    expect(await a.dispatch('orphan', 'b')).toEqual({
      ok: false,
      error: 'That VS Code window did not answer.',
    });
    // Too late for the other window: the request is gone; nothing ran anywhere.
    await b.poll();
    expect([...ran.a!, ...ran.b!, ...ran.c!]).toEqual([]);
  });
});
