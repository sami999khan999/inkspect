import { describe, expect, it } from 'vitest';
import {
  encode,
  isExtensionOrigin,
  newerShortcuts,
  parseClientMessage,
  parseServerMessage,
} from '../src/bridge';

describe('bridge protocol', () => {
  it('round-trips valid messages', () => {
    const snapshot = {
      type: 'bookmarks.snapshot' as const,
      tree: [{ id: '5', parentId: 'bar', index: 0, title: 'A', url: 'https://a.dev/' }],
    };
    expect(parseClientMessage(encode(snapshot))).toEqual(snapshot);
    const ops = {
      type: 'bookmarks.ops' as const,
      ops: [
        { op: 'create' as const, ref: 'L1', parentId: 'bar', index: 0, title: 'x' },
        { op: 'remove' as const, id: '9' },
      ],
    };
    expect(parseServerMessage(encode(ops))).toEqual(ops);
  });

  it('sends captures made together as a group, and several of them in one send', () => {
    const grouped = { type: 'send' as const, id: '1', target: 'context' as const, group: 'g' };
    expect(parseClientMessage(encode(grouped))).toEqual(grouped);
    const together = {
      type: 'send' as const,
      id: '2',
      target: 'chat' as const,
      captures: ['a', 'b'],
    };
    expect(parseClientMessage(encode(together))).toEqual(together);
    const bad = (extra: object) =>
      parseClientMessage(JSON.stringify({ v: 1, type: 'send', id: '3', target: 'chat', ...extra }));
    expect(bad({ captures: 'a' })).toBeUndefined();
    expect(bad({ captures: [1] })).toBeUndefined();
    expect(bad({ captures: Array(61).fill('a') })).toBeUndefined();
    expect(bad({ group: 5 })).toBeUndefined();
  });

  it('rejects malformed, unknown and other-version messages', () => {
    expect(parseClientMessage('not json')).toBeUndefined();
    expect(parseClientMessage(JSON.stringify({ v: 1, type: 'nope' }))).toBeUndefined();
    expect(parseClientMessage(JSON.stringify({ v: 2, type: 'ping' }))).toBeUndefined();
    expect(
      parseClientMessage(JSON.stringify({ v: 1, type: 'send', id: '1', target: 'shell' })),
    ).toBeUndefined();
    expect(
      parseServerMessage(
        JSON.stringify({ v: 1, type: 'bookmarks.ops', ops: [{ op: 'create', ref: 1 }] }),
      ),
    ).toBeUndefined();
  });

  it('carries shortcut settings both ways, within limits', () => {
    const settings = {
      type: 'settings.shortcuts' as const,
      shortcuts: { 'mode.draw': 'ctrl+alt+d', 'tab.close': [] as string[] },
      updated: 1_700_000_000_000,
    };
    expect(parseServerMessage(encode(settings))).toEqual(settings);
    expect(parseClientMessage(encode(settings))).toEqual(settings);
    const bad = (shortcuts: unknown) =>
      parseClientMessage(
        JSON.stringify({ v: 1, type: 'settings.shortcuts', shortcuts, updated: 1 }),
      );
    expect(bad({ 'mode.draw': 5 })).toBeUndefined();
    expect(bad({ 'mode.draw': 'x'.repeat(41) })).toBeUndefined();
    expect(bad(['ctrl+k'])).toBeUndefined();
  });

  it('lists VS Code windows, and sends can name one', () => {
    const windows = {
      type: 'windows' as const,
      windows: [
        { id: 'w1', name: 'shop', lastUsed: true },
        { id: 'w2', name: 'api', lastUsed: false },
      ],
    };
    expect(parseServerMessage(encode(windows))).toEqual(windows);
    expect(
      parseServerMessage(encode({ ...windows, windows: [{ id: 'w1', name: 1 }] } as never)),
    ).toBeUndefined();
    const send = { type: 'send' as const, id: 's1', target: 'save' as const, window: 'w2' };
    expect(parseClientMessage(encode(send))).toEqual(send);
    expect(parseClientMessage(encode({ ...send, window: 5 } as never))).toBeUndefined();
  });

  it('keeps the shortcut settings changed last', () => {
    const at = (updated: number) => ({ shortcuts: {}, updated });
    expect(newerShortcuts(at(2), at(1))).toBe('local');
    expect(newerShortcuts(at(1), at(2))).toBe('remote');
    expect(newerShortcuts(at(1), at(1))).toBe('same');
    expect(newerShortcuts(undefined, at(1))).toBe('remote');
    expect(newerShortcuts(undefined, undefined)).toBe('same');
  });

  it('only accepts extension origins', () => {
    expect(isExtensionOrigin('chrome-extension://abcdefghijklmnopabcdefghijklmnop')).toBe(true);
    expect(isExtensionOrigin('moz-extension://1b2c3d4e-0000-1111-2222-333344445555')).toBe(true);
    expect(isExtensionOrigin('https://evil.example')).toBe(false);
    expect(isExtensionOrigin('null')).toBe(false);
    expect(isExtensionOrigin(undefined)).toBe(false);
  });
});
