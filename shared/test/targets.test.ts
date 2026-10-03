import { describe, expect, it } from 'vitest';
import { agentmuxNewTarget, parseTargetId, tmuxTarget, vscodeTarget } from '../src/targets';

describe('target ids', () => {
  it('reads every kind of target', () => {
    expect(parseTargetId('default')).toEqual({ kind: 'default' });
    expect(parseTargetId('chat')).toEqual({ kind: 'local', target: 'chat' });
    expect(parseTargetId('terminal:3')).toEqual({ kind: 'local', target: 'terminal:3' });
    expect(parseTargetId(tmuxTarget('agents', '%36'))).toEqual({
      kind: 'tmux',
      socket: 'agents',
      pane: '%36',
    });
    expect(parseTargetId(vscodeTarget('w-1', 'terminal:2'))).toEqual({
      kind: 'vscode',
      window: 'w-1',
      target: 'terminal:2',
    });
    expect(parseTargetId(agentmuxNewTarget('codex'))).toEqual({
      kind: 'agentmux-new',
      harness: 'codex',
    });
  });

  it('rejects anything else', () => {
    for (const id of [
      'terminal',
      'tmux:a;b:%1',
      'tmux:agents:1',
      'vscode:w:../x',
      'vscode:w:terminal:x',
      'agentmux:new:bash',
      'agentmux:new:',
      '',
    ]) {
      expect(parseTargetId(id), id).toBeUndefined();
    }
  });
});
