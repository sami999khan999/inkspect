import { describe, expect, it } from 'vitest';
import type { HubTarget } from '../src/hub';
import { orderTargets, sentText, targetDetail, targetForKey, targetIcon } from '../src/sendModal';

const t = (id: string, kind: HubTarget['kind'] = 'tmux'): HubTarget => ({
  id,
  kind,
  label: id,
  detail: '',
});

describe('the send dialog', () => {
  it('lists the default first, then the others as given', () => {
    const targets = [t('a'), t('b'), t('c', 'chat')];
    expect(orderTargets(targets, 'b').map((x) => x.id)).toEqual(['b', 'a', 'c']);
    expect(orderTargets(targets, 'gone').map((x) => x.id)).toEqual(['a', 'b', 'c']);
    expect(orderTargets(targets, undefined).map((x) => x.id)).toEqual(['a', 'b', 'c']);
  });

  it('lists agents agentmux cannot show after the open ones, and says so', () => {
    const closed = { ...t('a'), detail: 'agentmux · x·1', closed: true };
    const targets = [closed, t('b'), t('c', 'chat')];
    expect(orderTargets(targets, undefined).map((x) => x.id)).toEqual(['b', 'c', 'a']);
    expect(orderTargets(targets, 'a').map((x) => x.id)).toEqual(['a', 'b', 'c']);
    expect(targetDetail(closed)).toBe('agentmux · x·1 · agentmux is closed');
    expect(sentText(closed, 'Claude Code')).toBe(
      'agentmux was closed: opened it and sent to Claude Code',
    );
    expect(sentText(t('b'), 'Codex')).toBe('Sent to Codex');
    expect(sentText(undefined, 'Codex')).toBe('Sent to Codex');
  });

  it('gives the first nine a number key', () => {
    const ordered = Array.from({ length: 11 }, (_, i) => t(`t${i}`));
    expect(targetForKey('1', ordered)?.id).toBe('t0');
    expect(targetForKey('9', ordered)?.id).toBe('t8');
    expect(targetForKey('0', ordered)).toBeUndefined();
    expect(targetForKey('a', ordered)).toBeUndefined();
    expect(targetForKey('3', ordered.slice(0, 2))).toBeUndefined();
  });

  it('shows agentmux, terminal and chat targets with their own icons', () => {
    expect(targetIcon(t('x', 'tmux'))).toBe('terminal-tmux');
    expect(targetIcon(t('x', 'terminal'))).toBe('terminal');
    expect(targetIcon(t('x', 'chat'))).toBe('comment-discussion');
  });
});
