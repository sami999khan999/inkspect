import { describe, expect, it } from 'vitest';
import {
  agentFromTitle,
  agentUnder,
  matchAgent,
  parsePs,
  parseWindowsProcesses,
  splitCommandLine,
} from '../../src/agent/agentDetect';
import { fitsInline, pasteText, typedLine } from '../../src/agent/sendParts';
import { bracketedPaste, shellPath } from '../../src/features/terminalSend';
import {
  elementSummary,
  isContextViewMessage,
  previewText,
  timeAgo,
} from '../../src/shared/agentContext';

describe('sending to a terminal agent', () => {
  it('quotes paths only when needed', () => {
    expect(shellPath('/home/me/shot.png')).toBe('/home/me/shot.png');
    expect(shellPath('C:\\Users\\me\\My Shots\\a.png')).toBe('"C:\\Users\\me\\My Shots\\a.png"');
    expect(shellPath('/tmp/say "hi".png')).toBe('"/tmp/say \\"hi\\".png"');
  });
});

describe('pasting into an agent', () => {
  it('wraps text as one bracketed paste that the text cannot end early', () => {
    expect(bracketedPaste('a\r\nb')).toBe('\x1b[200~a\nb\x1b[201~');
    expect(bracketedPaste('x\x1b[201~\ry')).toBe('\x1b[200~x\ny\x1b[201~');
  });
});

describe('putting a send into an agent', () => {
  it('keeps text inline when the agent can take it', () => {
    expect(fitsInline('a\nb', true)).toBe(true);
    expect(fitsInline('x'.repeat(20_001), true)).toBe(false);
    expect(fitsInline('a\nb', false)).toBe(false);
    expect(fitsInline('one short line', false)).toBe(true);
  });

  it('drops paste markers for a paste someone else wraps', () => {
    expect(pasteText('a\x1b[200~b\x1b[201~\r\nc')).toBe('ab\nc');
  });

  it('types one line without control characters into a plain terminal', () => {
    expect(typedLine(['/tmp/a.png', 'look\r\nhere'])).toBe('/tmp/a.png look here');
    expect(typedLine(['rm\x0f -rf\x1b#8 x\x7f'])).toBe('rm -rf#8 x');
    expect(typedLine(['tab\tkept'])).toBe('tab\tkept');
  });
});

describe('finding agents in terminals', () => {
  it('recognizes agent CLIs by their program or script', () => {
    expect(matchAgent('claude')?.label).toBe('Claude Code');
    expect(matchAgent('/home/me/.local/bin/agy')?.id).toBe('agy');
    expect(matchAgent('claude --resume')?.id).toBe('claude');
    expect(matchAgent('C:\\Users\\me\\.local\\bin\\claude.exe')?.id).toBe('claude');
    expect(
      matchAgent(
        '"C:\\Program Files\\nodejs\\node.exe" "C:\\Users\\me\\AppData\\Roaming\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js"',
      )?.id,
    ).toBe('claude');
    expect(
      matchAgent('/usr/local/bin/node /usr/lib/node_modules/@openai/codex/bin/codex.js')?.id,
    ).toBe('codex');
    expect(matchAgent('C:\\Users\\me\\AppData\\Roaming\\npm\\codex.cmd')?.label).toBe('Codex');
    expect(
      matchAgent(
        '"C:\\Program Files\\nodejs\\node.exe" C:\\Users\\me\\AppData\\Roaming\\npm\\node_modules\\@openai\\codex\\bin\\codex.js',
      )?.id,
    ).toBe('codex');
    expect(
      matchAgent(
        'C:\\Users\\me\\AppData\\Roaming\\npm\\node_modules\\opencode-ai\\bin\\opencode.exe',
      )?.label,
    ).toBe('opencode');
    expect(matchAgent('opencode --continue')?.id).toBe('opencode');
    expect(matchAgent('"C:\\Users\\me\\AppData\\Local\\Programs\\agy\\agy.exe" chat')?.label).toBe(
      'Antigravity',
    );
    expect(matchAgent('gemini -m pro')?.label).toBe('Gemini CLI');
    expect(matchAgent('python -m aider')?.id).toBe('aider');
    expect(matchAgent('npx @anthropic-ai/claude-code')?.id).toBe('claude');
  });

  it('ignores shells and commands that only mention an agent', () => {
    expect(matchAgent('pwsh.exe -NoLogo')).toBeUndefined();
    expect(matchAgent('git commit -m "fix claude send"')).toBeUndefined();
    expect(matchAgent('node C:\\Users\\me\\.claude\\hooks\\run.js')).toBeUndefined();
    expect(matchAgent('code C:\\projects\\claude')).toBeUndefined();
    expect(matchAgent('')).toBeUndefined();
  });

  it('splits command lines with quotes', () => {
    expect(splitCommandLine(`node "a b/cli.js" --x 'y z'`)).toEqual([
      'node',
      'a b/cli.js',
      '--x',
      'y z',
    ]);
  });

  it('finds the agent under a terminal shell, not elsewhere', () => {
    const processes = [
      { pid: 10, ppid: 1, commandLine: 'pwsh.exe' },
      { pid: 11, ppid: 10, commandLine: 'cmd.exe /d /s /c claude.cmd' },
      {
        pid: 12,
        ppid: 11,
        commandLine: 'node C:\\npm\\node_modules\\@anthropic-ai\\claude-code\\cli.js',
      },
      { pid: 20, ppid: 1, commandLine: 'pwsh.exe' },
      { pid: 21, ppid: 20, commandLine: 'npm run dev' },
      { pid: 30, ppid: 1, commandLine: 'codex' },
    ];
    expect(agentUnder(processes, 10)?.id).toBe('claude');
    expect(agentUnder(processes, 20)).toBeUndefined();
    // A process that is its own parent doesn't loop forever.
    expect(agentUnder([{ pid: 5, ppid: 5, commandLine: 'x' }], 5)).toBeUndefined();
  });

  it('reads agents from terminal titles', () => {
    expect(agentFromTitle('✳ Fix the login form')?.id).toBe('claude');
    expect(agentFromTitle('Claude Code')?.id).toBe('claude');
    expect(agentFromTitle('codex')?.id).toBe('codex');
    expect(agentFromTitle('pwsh')).toBeUndefined();
    expect(agentFromTitle('powershell')).toBeUndefined();
  });

  it('parses process listings', () => {
    expect(parsePs('  1     0 /sbin/init\n 42     1 node /x/cli.js --flag\n')).toEqual([
      { pid: 1, ppid: 0, commandLine: '/sbin/init' },
      { pid: 42, ppid: 1, commandLine: 'node /x/cli.js --flag' },
    ]);
    expect(
      parseWindowsProcesses(
        JSON.stringify([
          { ProcessId: 4, ParentProcessId: 0, Name: 'System', CommandLine: null },
          { ProcessId: 9, ParentProcessId: 4, Name: 'claude.exe', CommandLine: 'claude.exe' },
        ]),
      ),
    ).toEqual([
      { pid: 4, ppid: 0, commandLine: 'System' },
      { pid: 9, ppid: 4, commandLine: 'claude.exe' },
    ]);
    // One process comes back as an object, not an array.
    expect(
      parseWindowsProcesses('{"ProcessId":1,"ParentProcessId":0,"Name":"a","CommandLine":"a b"}'),
    ).toEqual([{ pid: 1, ppid: 0, commandLine: 'a b' }]);
  });
});

describe('the Agent Context view', () => {
  it('validates its messages', () => {
    expect(isContextViewMessage({ type: 'send', id: 'a' })).toBe(true);
    expect(isContextViewMessage({ type: 'send', id: 'a', target: 'terminal:1' })).toBe(true);
    expect(isContextViewMessage({ type: 'send', id: 5 })).toBe(false);
    expect(isContextViewMessage({ type: 'setTarget' })).toBe(false);
    expect(isContextViewMessage({ type: 'run', command: 'x' })).toBe(false);
    expect(isContextViewMessage(null)).toBe(false);
  });

  it('validates the messages for several items (a group, a selection)', () => {
    expect(isContextViewMessage({ type: 'sendMany', ids: ['a', 'b'] })).toBe(true);
    expect(isContextViewMessage({ type: 'sendMany', ids: ['a'], target: 'chat' })).toBe(true);
    expect(isContextViewMessage({ type: 'sendMany', ids: [] })).toBe(false);
    expect(isContextViewMessage({ type: 'sendMany', ids: 'a' })).toBe(false);
    expect(isContextViewMessage({ type: 'removeMany', ids: Array(61).fill('a') })).toBe(false);
    expect(isContextViewMessage({ type: 'group', ids: ['a', 'b'] })).toBe(true);
    expect(isContextViewMessage({ type: 'group', ids: [1, 2] })).toBe(false);
    expect(isContextViewMessage({ type: 'ungroup', group: 'g' })).toBe(true);
    expect(isContextViewMessage({ type: 'ungroup' })).toBe(false);
  });

  it('previews text on one line, without Markdown marks', () => {
    expect(previewText('# Title\n\n```html\n<div>\n```')).toBe('Title <div>');
    expect(previewText('**Error** in `app.js`')).toBe('Error in app.js');
    expect(previewText('x'.repeat(200), 10)).toBe(`${'x'.repeat(9)}…`);
  });

  it('previews element details by their elements', () => {
    const one = '### Element: `h2#title.big`\n- Page: http://x.dev';
    expect(elementSummary(one)).toBe('h2#title.big');
    const many = [1, 2, 3, 4, 5]
      .map((n) => `### ${n}. Element: \`div.card-${n}\`\n- Selector: \`.card-${n}\``)
      .join('\n\n');
    expect(elementSummary(many)).toBe('div.card-1 · div.card-2 · div.card-3 · +2 more');
    expect(elementSummary('Just some text')).toBeUndefined();
  });

  it('says how long ago', () => {
    const now = 10_000_000;
    expect(timeAgo(now - 5_000, now)).toBe('just now');
    expect(timeAgo(now - 5 * 60_000, now)).toBe('5 min ago');
    expect(timeAgo(now - 3 * 3_600_000, now)).toBe('3 h ago');
  });
});
