import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, describe, expect, it } from 'vitest';
import type { ProcessInfo } from '../../src/agent/agentDetect';
import {
  chooseDefault,
  pairedProjects,
  pairedTarget,
  paneTargets,
  readKittyPairs,
} from '../../src/hub/agents';
import { parseTargetId } from '@inkspect/shared/targets';
import { partsOf, pasteIntoPane } from '../../src/hub/send';
import { writeItem } from '../../src/hub/store';
import { parsePanes } from '../../src/hub/tmux';

const temps: string[] = [];
function temp(): string {
  const dir = mkdtempSync(join(tmpdir(), 'inksend-'));
  temps.push(dir);
  return dir;
}
afterAll(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const PANES = parsePanes(
  'agents',
  [
    'inkspect·1\t%36\t100\tsh\t/p/inkspect\tagent\tclaude\t20\t1',
    'inkspect·2\t%37\t200\tsh\t/p/inkspect\tagent\tagy\t30\t0',
    'inkspect·3\t%38\t300\tfish\t/p/inkspect\tagent\tclaude\t40\t0',
    'shop·1\t%40\t400\tsh\t/p/shop\tagent\t\t10\t0',
    // The agent exited and `exec $SHELL` left a plain sh: not an agent any more.
    'shop·2\t%41\t600\tsh\t/p/shop\tagent\tclaude\t50\t0',
  ].join('\n'),
);
const PROCESSES: ProcessInfo[] = [
  { pid: 100, ppid: 1, commandLine: 'sh -c claude --continue; exec fish' },
  { pid: 101, ppid: 100, commandLine: 'claude --continue' },
  { pid: 200, ppid: 1, commandLine: 'sh -c agy; exec fish' },
  { pid: 201, ppid: 200, commandLine: '/home/me/.local/bin/agy' },
  { pid: 300, ppid: 1, commandLine: 'fish' },
  { pid: 400, ppid: 1, commandLine: 'sh -c vim; exec fish' },
  { pid: 401, ppid: 400, commandLine: 'vim' },
  { pid: 600, ppid: 1, commandLine: 'sh' },
  // The kitty beside the VS Code window, and the tmux client in it showing inkspect·2.
  {
    pid: 500,
    ppid: 1,
    commandLine:
      'kitty --class code-term-0xabc --listen-on unix:/run/user/1000/kitty-pair-0xabc -- tmux -L agents attach -t =inkspect·2',
  },
  { pid: 501, ppid: 500, commandLine: 'tmux -L agents attach -t =inkspect·2' },
];

describe('agents in agentmux threads', () => {
  it('finds running agents, never a pane back at its shell or running something else', () => {
    const targets = paneTargets(PANES, PROCESSES);
    expect(targets.map((t) => [t.id, t.label, t.detail])).toEqual([
      ['tmux:agents:%36', 'Claude Code', 'agentmux · inkspect·1'],
      ['tmux:agents:%37', 'Antigravity', 'agentmux · inkspect·2'],
    ]);
  });

  it('reads target ids, rejecting anything else', () => {
    expect(parseTargetId('tmux:agents:%36')).toEqual({
      kind: 'tmux',
      socket: 'agents',
      pane: '%36',
    });
    expect(parseTargetId('vscode:w1:terminal:3')).toEqual({
      kind: 'vscode',
      window: 'w1',
      target: 'terminal:3',
    });
    expect(parseTargetId('tmux:-x:%1')).toEqual({ kind: 'tmux', socket: '-x', pane: '%1' });
    expect(parseTargetId('tmux:a;b:%1')).toBeUndefined();
    expect(parseTargetId('tmux:agents:1')).toBeUndefined();
  });

  it('finds the agent in the kitty beside the VS Code window', () => {
    const runtime = temp();
    writeFileSync(join(runtime, 'kitty-pair-0xabc.folder'), '/p/inkspect\n');
    writeFileSync(join(runtime, 'kitty-pair-0xdef.folder'), '/p/other');
    writeFileSync(join(runtime, 'unrelated.folder'), '/p/inkspect');
    const pairs = readKittyPairs(runtime);
    expect(pairs).toEqual(
      expect.arrayContaining([
        { address: '0xabc', folder: '/p/inkspect' },
        { address: '0xdef', folder: '/p/other' },
      ]),
    );
    const targets = paneTargets(PANES, PROCESSES);
    const clients = [
      { socket: 'agents', pid: 999, session: 'inkspect·1' },
      { socket: 'agents', pid: 501, session: 'inkspect·2' },
    ];
    expect(pairedTarget('/p/inkspect', pairs, PROCESSES, clients, targets)?.id).toBe(
      'tmux:agents:%37',
    );
    expect(pairedTarget('/p/shop', pairs, PROCESSES, clients, targets)).toBeUndefined();
    // The thread a paired kitty shows, whatever folder VS Code has (none, in a bare window).
    expect(pairedProjects(pairs, PROCESSES, clients, PANES)).toEqual(['/p/inkspect']);
    expect(pairedProjects([], PROCESSES, clients, PANES)).toEqual([]);
  });

  it('sends to the last target, else the paired agent, a VS Code terminal, the latest agent, chat', () => {
    const panes = paneTargets(PANES, PROCESSES);
    const terminal = {
      id: 'vscode:w:terminal:1',
      kind: 'terminal' as const,
      label: 'Codex',
      detail: '',
    };
    const chat = { id: 'vscode:w:chat', kind: 'chat' as const, label: 'VS Code chat', detail: '' };
    const all = [...panes, terminal, chat];
    expect(chooseDefault(all, { last: 'tmux:agents:%36', paired: 'tmux:agents:%37' })).toBe(
      'tmux:agents:%36',
    );
    expect(chooseDefault(all, { last: 'gone', paired: 'tmux:agents:%37' })).toBe('tmux:agents:%37');
    expect(chooseDefault(all, { preferredTerminal: terminal.id })).toBe(terminal.id);
    // inkspect·2 was used more recently than inkspect·1.
    expect(chooseDefault(all)).toBe('tmux:agents:%37');
    expect(chooseDefault([chat])).toBe(chat.id);
    expect(chooseDefault([])).toBeUndefined();
  });

  it('marks agents closed when no terminal shows their tmux server, and defaults to open ones', () => {
    const shown = paneTargets(PANES, PROCESSES, [
      { socket: 'agents', pid: 501, session: 'inkspect·2' },
    ]);
    expect(shown.map((t) => t.closed)).toEqual([undefined, undefined]);
    const closed = paneTargets(PANES, PROCESSES, []);
    expect(closed.map((t) => t.closed)).toEqual([true, true]);
    // Unknown (no client list): not marked.
    expect(paneTargets(PANES, PROCESSES).some((t) => t.closed)).toBe(false);
    const chat = { id: 'vscode:w:chat', kind: 'chat' as const, label: 'VS Code chat', detail: '' };
    // The last target is closed: an open one wins.
    expect(chooseDefault([...closed, chat], { last: 'tmux:agents:%36' })).toBe(chat.id);
    // Nothing open: the closed ones are still offered.
    expect(chooseDefault(closed, { last: 'tmux:agents:%36' })).toBe('tmux:agents:%36');
  });
});

describe('pasting into a tmux pane', () => {
  it('pastes image paths and the text, quoting paths, and long text as its file', () => {
    const project = temp();
    const shot = writeItem(project, {
      kind: 'screenshot',
      title: 'Shot',
      source: 'browser',
      media: { bytes: new Uint8Array([1]), extension: 'png' },
    });
    const element = writeItem(project, {
      kind: 'element',
      title: 'Element',
      source: 'browser',
      text: '## button',
    });
    const parts = partsOf(project, [shot, element]);
    expect(parts).toHaveLength(2);
    expect(parts[0]).toMatch(/capture\.png$/);
    expect(parts[1]).toBe('## button');
    const long = writeItem(project, {
      kind: 'page',
      title: 'Page',
      source: 'browser',
      text: 'x'.repeat(25_000),
    });
    expect(partsOf(project, [long])[0]).toMatch(/context\.md$/);
  });

  it('pastes the prompt written with a send first', () => {
    const project = temp();
    const element = writeItem(project, {
      kind: 'element',
      title: 'Element',
      source: 'browser',
      text: '## button',
    });
    expect(partsOf(project, [element], { prompt: '  Make it blue.  ' })).toEqual([
      'Make it blue.',
      '## button',
    ]);
    expect(partsOf(project, [element], { prompt: '   ' })).toEqual(['## button']);
  });

  let hasTmux = true;
  try {
    execFileSync('tmux', ['-V']);
  } catch {
    hasTmux = false;
  }

  it.skipIf(!hasTmux)('pastes as one bracketed paste each, and never presses Enter', async () => {
    const socket = `inkspect-test-${process.pid}`;
    const run = (...args: string[]) =>
      execFileSync('tmux', ['-L', socket, '-f', '/dev/null', ...args], { encoding: 'utf8' });
    // A program that asks for bracketed paste (as agent CLIs do), then echoes what it gets.
    run(
      'new-session',
      '-d',
      '-x',
      '200',
      '-y',
      '20',
      `sh -c 'printf "\\033[?2004h"; stty -icanon -echo; exec cat -v'`,
    );
    try {
      const pane = run('list-panes', '-F', '#{pane_id}').trim();
      await new Promise((resolve) => setTimeout(resolve, 300));
      await pasteIntoPane(socket, pane, ['/tmp/shot one.png', 'fix the header']);
      await new Promise((resolve) => setTimeout(resolve, 300));
      const screen = run('capture-pane', '-p', '-t', pane);
      // Each part one paste, a space after it.
      expect(screen.trim()).toBe('^[[200~/tmp/shot one.png^[[201~ ^[[200~fix the header^[[201~');
      // Nothing submitted: no carriage return or newline was typed.
      expect(screen).not.toContain('^M');
    } finally {
      run('kill-server');
    }
  });
});
