import { execFileSync } from 'node:child_process';
import { chmodSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import type { HubTarget, ItemMeta } from '@inkspect/shared/hub';
import { availableHarnesses, findProgram, focusWindowByClass } from '../../src/hub/agentmux';
import { readProjectState, writeLastTarget } from '../../src/hub/projectState';
import { sendItems, type SendContext } from '../../src/hub/router';
import { readItem, writeItem } from '../../src/hub/store';

const temps: string[] = [];
function temp(): string {
  const dir = mkdtempSync(join(tmpdir(), 'inkroute-'));
  temps.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const chat: HubTarget = { id: 'chat', kind: 'chat', label: 'VS Code chat', detail: '' };
const terminal: HubTarget = { id: 'terminal:1', kind: 'terminal', label: 'Codex', detail: '' };

/** A context whose VS Code targets record what they were given. */
function context(over: Partial<SendContext> = {}) {
  const delivered: { target: string; ids: string[] }[] = [];
  const ctx: SendContext = {
    targets: [terminal, chat],
    defaultTarget: 'chat',
    sockets: [],
    harnesses: [],
    deliver: async (target, _project, items: readonly ItemMeta[]) => {
      delivered.push({ target, ids: items.map((i) => i.id) });
      return { ok: true, sentTo: target === 'chat' ? 'VS Code chat' : 'Codex' };
    },
    // Like VS Code's: only its own ids get the window part.
    globalId: (id) => (/^(terminal:\d+|chat)$/.test(id) ? `vscode:w1:${id}` : id),
    ...over,
  };
  return { ctx, delivered };
}

describe('sending saved items', () => {
  it('sends to the default, records it on the items and as the last target', async () => {
    const project = temp();
    const item = writeItem(project, { kind: 'text', title: 'A', source: 'vscode', text: 'x' });
    const { ctx, delivered } = context();
    expect(await sendItems(ctx, project, [item.id])).toEqual({ ok: true, sentTo: 'VS Code chat' });
    expect(delivered).toEqual([{ target: 'chat', ids: [item.id] }]);
    expect(readItem(project, item.id)?.sentTo).toEqual(['VS Code chat']);
    // Remembered under its global id, for the browser and other windows.
    expect(readProjectState(project).lastTarget).toBe('vscode:w1:chat');
  });

  it('takes "terminal" (older browsers) as the default agent other than chat', async () => {
    const project = temp();
    const item = writeItem(project, { kind: 'text', title: 'A', source: 'vscode', text: 'x' });
    const { ctx, delivered } = context();
    await sendItems(ctx, project, [item.id], 'terminal');
    expect(delivered[0]?.target).toBe('terminal:1');
  });

  it('fails clearly for a target that is gone, missing items, or agentmux it cannot use', async () => {
    const project = temp();
    const item = writeItem(project, { kind: 'text', title: 'A', source: 'vscode', text: 'x' });
    const { ctx } = context({ defaultTarget: undefined });
    expect(await sendItems(ctx, project, [item.id])).toMatchObject({ ok: false });
    expect(await sendItems(ctx, project, [item.id], 'tmux:agents:%9')).toMatchObject({
      ok: false,
      error: expect.stringMatching(/not running/),
    });
    expect(await sendItems(ctx, project, ['20260101-000000-abcdef'], 'chat')).toMatchObject({
      ok: false,
      error: expect.stringMatching(/gone/),
    });
    expect(await sendItems(ctx, project, [item.id], 'agentmux:new:claude')).toMatchObject({
      ok: false,
    });
    expect(readItem(project, item.id)?.sentTo).toEqual([]);
  });

  it('keeps the last target per project in its store', () => {
    const project = temp();
    expect(readProjectState(project)).toEqual({});
    writeLastTarget(project, 'tmux:agents:%1');
    expect(readProjectState(project)).toEqual({ lastTarget: 'tmux:agents:%1' });
  });
});

describe.skipIf(process.platform !== 'linux')('agentmux and window focus', () => {
  /** A folder of fake programs, put first on the PATH while `body` runs. */
  async function withPrograms(
    programs: Record<string, string>,
    body: (dir: string) => Promise<void>,
    env: Record<string, string> = {},
  ) {
    const dir = temp();
    for (const [name, script] of Object.entries(programs)) {
      writeFileSync(join(dir, name), `#!/bin/sh\n${script}\n`);
      chmodSync(join(dir, name), 0o755);
    }
    const saved = { ...process.env };
    process.env.PATH = `${dir}:${process.env.PATH}`;
    Object.assign(process.env, env);
    try {
      await body(dir);
    } finally {
      process.env = saved;
    }
  }

  it('offers only the agents that are installed, and only with agentmux', async () => {
    const home = temp();
    await withPrograms({ claude: 'true', opencode: 'true' }, async (dir) => {
      const env = { PATH: dir };
      expect(availableHarnesses(env, home)).toEqual([]);
      writeFileSync(join(dir, 'agentmux'), '#!/bin/sh\n');
      chmodSync(join(dir, 'agentmux'), 0o755);
      expect(availableHarnesses(env, home)).toEqual(['claude', 'opencode']);
      expect(findProgram('codex', env, home)).toBeUndefined();
    });
  });

  it('focuses the newest window of a class with Hyprland', async () => {
    const log = join(temp(), 'calls');
    const clients = JSON.stringify([
      { address: '0xaa', class: 'agentmux', focusHistoryID: 4 },
      { address: '0xbb', class: 'agentmux', focusHistoryID: 1 },
      { address: '0xcc', class: 'code', focusHistoryID: 0 },
    ]);
    await withPrograms(
      {
        hyprctl: `if [ "$1" = clients ]; then echo '${clients}'; else echo "$@" >> '${log}'; fi`,
      },
      async () => {
        expect(await focusWindowByClass(/^agentmux$/)).toBe(true);
        expect(execFileSync('cat', [log], { encoding: 'utf8' })).toContain('address:0xbb');
        expect(await focusWindowByClass(/^nothing$/)).toBe(false);
      },
      { HYPRLAND_INSTANCE_SIGNATURE: 'test' },
    );
  });

  let hasTmux = true;
  try {
    execFileSync('tmux', ['-V']);
  } catch {
    hasTmux = false;
  }

  it.skipIf(!hasTmux)(
    'starts a new agentmux thread and pastes the capture into it',
    async () => {
      const project = temp();
      const socket = `inkspect-test-${process.pid}`;
      const log = join(temp(), 'agentmux-calls');
      const bin = temp();
      // The "agent": a program named claude that echoes what it gets.
      execFileSync('ln', ['-s', '/bin/cat', join(bin, 'claude')]);
      const tmux = `tmux -L ${socket} -f /dev/null`;
      await withPrograms(
        {
          agentmux: [
            `echo "$@" >> '${log}'`,
            'if [ "$1" = new-thread ]; then',
            `  ${tmux} new-session -d -s 'proj·9' "sh -c '${bin}/claude; exec sh'"`,
            `  ${tmux} set-option -t 'proj·9' @project '${project}'`,
            `  ${tmux} set-option -t 'proj·9' @kind agent`,
            `  ${tmux} set-option -t 'proj·9' @harness claude`,
            'fi',
          ].join('\n'),
        },
        async () => {
          try {
            const item = writeItem(project, {
              kind: 'text',
              title: 'A',
              source: 'browser',
              text: 'fix the header',
            });
            const { ctx } = context({ sockets: [socket], harnesses: ['claude'] });
            const sent = await sendItems(ctx, project, [item.id], 'agentmux:new:claude');
            expect(sent).toEqual({ ok: true, sentTo: 'Claude Code' });
            expect(execFileSync('cat', [log], { encoding: 'utf8' })).toBe(
              `project ${project}\nnew-thread claude\n`,
            );
            await new Promise((resolve) => setTimeout(resolve, 300));
            const screen = execFileSync(
              'tmux',
              ['-L', socket, 'capture-pane', '-p', '-t', '=proj·9:'],
              { encoding: 'utf8' },
            );
            expect(screen).toContain('fix the header');
            // The new thread is where this project's sends go next.
            expect(readProjectState(project).lastTarget).toMatch(/^tmux:inkspect-test-\d+:%\d+$/);
          } finally {
            execFileSync('tmux', ['-L', socket, 'kill-server']);
          }
        },
      );
    },
    30_000,
  );
});
