import { describe, expect, it } from 'vitest';
import { encode, isExtensionOrigin, parseClientMessage, parseServerMessage } from '../src/bridge';

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

  it('only accepts extension origins', () => {
    expect(isExtensionOrigin('chrome-extension://abcdefghijklmnopabcdefghijklmnop')).toBe(true);
    expect(isExtensionOrigin('moz-extension://1b2c3d4e-0000-1111-2222-333344445555')).toBe(true);
    expect(isExtensionOrigin('https://evil.example')).toBe(false);
    expect(isExtensionOrigin('null')).toBe(false);
    expect(isExtensionOrigin(undefined)).toBe(false);
  });
});
