import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  gitRoot,
  listenerFolder,
  localPort,
  parseListeners,
  projectOfFolder,
} from '../../src/hub/devServer';
import { collectProjects, siteOf, suggestProject } from '../../src/hub/projects';
import { readState, writeState, type HubState } from '../../src/hub/state';
import { agentPanes, parsePanes } from '../../src/hub/tmux';

const temps: string[] = [];
function temp(): string {
  const dir = mkdtempSync(join(tmpdir(), 'inkproj-'));
  temps.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

// What `tmux -L agents list-panes -a -F PANE_FORMAT` prints for agentmux threads.
const PANES = [
  '_watch\t%0\t100\tfish\t\t\t\t1790935621\t2',
  'inkspect·1\t%36\t2524922\tsh\t/home/me/code/inkspect\tagent\tclaude\t1790938976\t1',
  'inkspect·2\t%37\t2550711\tsh\t/home/me/code/inkspect\tagent\tagy\t1790938281\t0',
  'inkspect·terms\t%40\t2550800\tfish\t/home/me/code/inkspect\tterms\t\t1790938000\t0',
  'shop·1\t%41\t2550900\tsh\t/home/me/code/shop\tagent\tcodex\t1790930000\t0',
  'broken line',
].join('\n');

const state = (over: Partial<HubState> = {}): HubState => ({
  v: 1,
  saved: [],
  pinned: [],
  sites: {},
  lastTarget: {},
  ...over,
});

describe('agentmux threads', () => {
  it('reads panes with their agentmux options', () => {
    const panes = parsePanes('agents', PANES);
    expect(panes).toHaveLength(5);
    expect(panes[1]).toEqual({
      socket: 'agents',
      session: 'inkspect·1',
      paneId: '%36',
      panePid: 2524922,
      command: 'sh',
      project: '/home/me/code/inkspect',
      kind: 'agent',
      harness: 'claude',
      activity: 1790938976,
      attached: true,
    });
    // Hidden sessions and terminal sessions are not agent threads.
    expect(agentPanes(panes).map((p) => p.session)).toEqual(['inkspect·1', 'inkspect·2', 'shop·1']);
  });
});

describe('projects', () => {
  const windows = [
    { id: 'w', name: 'inkspect', folders: ['/home/me/code/inkspect'], focusedAt: 1 },
  ];

  it('merges VS Code windows, agentmux, saved and pinned projects', () => {
    const projects = collectProjects(
      windows,
      parsePanes('agents', PANES),
      state({ saved: ['/home/me/code/old', '/home/me/code/gone'], pinned: ['/home/me/notes'] }),
      (path) => path !== '/home/me/code/gone',
    );
    expect(projects.map((p) => [p.name, p.vscode, p.agentmux, p.saved, p.pinned])).toEqual([
      ['notes', false, false, true, true],
      ['inkspect', true, true, true, false],
      ['shop', false, true, true, false],
      ['old', false, false, true, false],
    ]);
  });

  it('suggests where a capture goes: the site, its dev server, the last project, a live one', () => {
    const projects = collectProjects([], parsePanes('agents', PANES), state(), () => false);
    const remembered = state({ sites: { 'http://localhost:3000': '/home/me/code/shop' } });
    expect(suggestProject(projects, remembered, { url: 'http://localhost:3000/cart' })).toBe(
      '/home/me/code/shop',
    );
    const devServerProject = () => '/home/me/code/shop';
    expect(
      suggestProject(projects, state(), { url: 'http://localhost:5173/', devServerProject }),
    ).toBe('/home/me/code/shop');
    // A dev server in a folder that isn't a project is no suggestion (nothing could be saved there).
    expect(
      suggestProject(projects, state(), {
        url: 'http://localhost:5173/',
        devServerProject: () => '/home/me/other',
      }),
    ).toBe('/home/me/code/inkspect');
    expect(
      suggestProject(projects, state({ lastProject: '/home/me/code/shop' }), {
        url: 'https://example.com/',
      }),
    ).toBe('/home/me/code/shop');
    expect(suggestProject(projects, state(), { url: 'https://example.com/' })).toBe(
      '/home/me/code/inkspect',
    );
    // A remembered project that is gone isn't suggested.
    const gone = state({ sites: { 'https://a.dev': '/nowhere' } });
    expect(suggestProject(projects, gone, { url: 'https://a.dev/x' })).toBe(
      '/home/me/code/inkspect',
    );
    expect(siteOf('file:///tmp/x.html')).toBeUndefined();
  });

  it('then the focused VS Code window, the thread beside it, the last project, the busiest thread, the Inbox', () => {
    const panes = parsePanes('agents', PANES);
    const two = [
      { id: 'a', name: 'old', folders: ['/home/me/code/old'], focusedAt: 1 },
      { id: 'b', name: 'shop', folders: ['/home/me/code/shop'], focusedAt: 5 },
      // No folder: it doesn't count.
      { id: 'c', name: '', folders: [], focusedAt: 9 },
    ];
    const projects = collectProjects(two, panes, state(), () => false, '/data/inbox');
    expect(projects.at(-1)).toMatchObject({ path: '/data/inbox', name: 'Inbox', inbox: true });
    const last = state({ lastProject: '/home/me/code/old' });
    expect(suggestProject(projects, last, { windows: two, panes })).toBe('/home/me/code/shop');
    // Without a window folder: the agentmux thread the kitty beside VS Code shows.
    const noFolders = [{ id: 'c', name: '', folders: [], focusedAt: 9 }];
    const fewer = collectProjects(noFolders, panes, state(), () => false, '/data/inbox');
    expect(
      suggestProject(fewer, last, { windows: noFolders, panes, paired: ['/home/me/code/shop'] }),
    ).toBe('/home/me/code/shop');
    // Else the last project (here gone), then the thread used last (inkspect·1 is the busiest).
    expect(suggestProject(fewer, last, { windows: noFolders, panes })).toBe(
      '/home/me/code/inkspect',
    );
    // Nothing at all: the Inbox.
    const empty = collectProjects([], [], state(), () => false, '/data/inbox');
    expect(suggestProject(empty, state(), { url: 'https://example.com/' })).toBe('/data/inbox');
  });

  it('remembers state in a private file, and starts empty from a bad one', () => {
    const file = join(temp(), 'state', 'hub.json');
    expect(readState(file)).toEqual(state());
    writeState(file, state({ pinned: ['/p'], lastProject: '/p' }));
    expect(readState(file)).toMatchObject({ pinned: ['/p'], lastProject: '/p' });
    writeFileSync(file, '{"saved": "nope", "sites": [1]}');
    expect(readState(file)).toEqual(state());
  });
});

describe('dev servers', () => {
  it('only looks at pages served from this machine', () => {
    expect(localPort('http://localhost:5173/x')).toBe(5173);
    expect(localPort('http://app.localhost/')).toBe(80);
    expect(localPort('https://127.0.0.1/')).toBe(443);
    expect(localPort('https://example.com:5173/')).toBeUndefined();
    expect(localPort('file:///tmp/a.html')).toBeUndefined();
  });

  // Dev-server detection reads Linux's /proc.
  it.skipIf(process.platform !== 'linux')(
    'finds the folder of the process listening on a port, from /proc',
    () => {
      const proc = temp();
      const project = temp();
      mkdirSync(join(project, 'web'), { recursive: true });
      mkdirSync(join(proc, 'net'));
      // Port 5173 (0x1435) listening (0A) on socket inode 4242; 3000 only connected (01).
      const header =
        '  sl  local_address rem_address   st tx_queue rx_queue tr tm->when retrnsmt   uid  timeout inode\n';
      writeFileSync(
        join(proc, 'net', 'tcp'),
        `${header}   0: 0100007F:1435 00000000:0000 0A 00000000:00000000 00:00000000 00000000  1000        0 4242 1\n` +
          `   1: 0100007F:0BB8 0100007F:9999 01 00000000:00000000 00:00000000 00000000  1000        0 5555 1\n`,
      );
      mkdirSync(join(proc, '777', 'fd'), { recursive: true });
      symlinkSync('socket:[4242]', join(proc, '777', 'fd', '9'));
      symlinkSync(join(project, 'web'), join(proc, '777', 'cwd'));
      expect(parseListeners(`${header}`).size).toBe(0);
      expect(listenerFolder(5173, proc)).toBe(join(project, 'web'));
      expect(listenerFolder(3000, proc)).toBeUndefined();
      // The deepest known project holding it, else its git repository.
      expect(projectOfFolder(join(project, 'web'), [project, '/elsewhere'])).toBe(project);
      mkdirSync(join(project, '.git'));
      expect(gitRoot(join(project, 'web'))).toBe(project);
      expect(projectOfFolder(join(project, 'web'), [])).toBe(project);
    },
  );
});
