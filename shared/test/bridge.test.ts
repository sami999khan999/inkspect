import { describe, expect, it } from 'vitest';
import {
  encode,
  isExtensionOrigin,
  newerShortcuts,
  parseClientMessage,
  parseServerMessage,
} from '../src/bridge';
import { encodeHub } from '../src/hub';

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

  it('rejects message types that are only inherited object keys', () => {
    for (const type of ['toString', 'constructor', '__proto__', 'hasOwnProperty'])
      expect(parseClientMessage(JSON.stringify({ v: 1, type }))).toBeUndefined();
  });

  it('carries questions about projects and their answers, checked like the helper does', () => {
    const request = {
      type: 'hub.request' as const,
      request: JSON.parse(encodeHub({ type: 'projects.get', req: 'r1', url: 'https://a.dev/' })),
    };
    expect(parseClientMessage(encode(request))).toEqual(request);
    const reply = {
      type: 'hub.reply' as const,
      reply: JSON.parse(encodeHub({ type: 'done', req: 'r1', ok: true })),
    };
    expect(parseServerMessage(encode(reply))).toEqual(reply);
    // Only requests (they carry `req`), valid as the helper's protocol sees them.
    const bad = (inner: object) =>
      parseClientMessage(JSON.stringify({ v: 1, type: 'hub.request', request: inner }));
    expect(bad({ v: 1, type: 'ping' })).toBeUndefined();
    expect(bad({ v: 1, type: 'item.remove', req: 'r', project: '/p', ids: 'x' })).toBeUndefined();
    expect(bad({ type: 'projects.get', req: 'r' })).toBeUndefined();
    // VS Code says it answers them.
    const welcome = {
      type: 'welcome' as const,
      peer: 'VS Code',
      syncBookmarks: true,
      features: ['hub' as const],
    };
    expect(parseServerMessage(encode(welcome))).toEqual(welcome);
  });

  it('rejects malformed, unknown and other-version messages', () => {
    expect(parseClientMessage('not json')).toBeUndefined();
    expect(parseClientMessage(JSON.stringify({ v: 1, type: 'nope' }))).toBeUndefined();
    expect(parseClientMessage(JSON.stringify({ v: 2, type: 'ping' }))).toBeUndefined();
    // Sends of older versions: questions about projects took their place.
    expect(
      parseClientMessage(JSON.stringify({ v: 1, type: 'send', id: '1', target: 'chat' })),
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
