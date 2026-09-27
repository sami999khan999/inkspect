import { describe, expect, it } from 'vitest';
import { orderTerminals, shellPath } from '../../src/features/terminalSend';

describe('sending screenshots to a terminal agent', () => {
  it('quotes paths only when needed', () => {
    expect(shellPath('/home/me/shot.png')).toBe('/home/me/shot.png');
    expect(shellPath('C:\\Users\\me\\My Shots\\a.png')).toBe('"C:\\Users\\me\\My Shots\\a.png"');
    expect(shellPath('/tmp/say "hi".png')).toBe('"/tmp/say \\"hi\\".png"');
  });

  it('offers agent terminals first, then the active one', () => {
    const bash = { name: 'bash' };
    const example = { name: 'example' };
    const claude = { name: 'Claude Code' };
    const codex = { name: 'codex' };
    expect(orderTerminals([bash, example, claude, codex], example).map((t) => t.name)).toEqual([
      'Claude Code',
      'codex',
      'example',
      'bash',
    ]);
  });
});
