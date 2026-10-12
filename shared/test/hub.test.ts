import { describe, expect, it } from 'vitest';
import {
  encodeHub,
  parseBrowserToHub,
  parseHubAuth,
  parseHubToBrowser,
  parseHubToVsCode,
  parseVsCodeToHub,
} from '../src/hub';

describe('hub protocol', () => {
  it('round-trips valid messages, as text or as parsed JSON', () => {
    const window = {
      type: 'window' as const,
      id: 'w-1',
      name: 'inkspect',
      folders: ['/home/me/inkspect'],
      focusedAt: 1,
    };
    expect(parseVsCodeToHub(encodeHub(window))).toEqual(window);
    expect(parseVsCodeToHub(JSON.parse(encodeHub(window)))).toEqual(window);
    const status = { type: 'status' as const, vscode: true, peer: 'VS Code (inkspect)' };
    expect(parseHubToBrowser(encodeHub(status))).toEqual(status);
    const link = { type: 'link' as const, browser: 'b1', data: '{}' };
    expect(parseHubToVsCode(encodeHub(link))).toEqual(link);
  });

  it('checks the group requests', () => {
    const project = '/home/me/shop';
    const ids = ['20261009-120000-abcdef', '20261009-120001-abcdef'];
    const group = { type: 'items.group' as const, req: 'r1', project, ids };
    expect(parseBrowserToHub(encodeHub(group))).toEqual(group);
    const ungroup = { type: 'items.ungroup' as const, req: 'r2', project, group: 'a-1' };
    expect(parseBrowserToHub(encodeHub(ungroup))).toEqual(ungroup);
    expect(parseBrowserToHub(encodeHub({ ...group, ids: ['../x'] }))).toBeUndefined();
    expect(parseBrowserToHub(encodeHub({ ...ungroup, group: '../x' }))).toBeUndefined();
  });

  it('checks thread starts and their answers', () => {
    const start = {
      type: 'agentmux.start' as const,
      req: 'r',
      project: '/p',
      harness: 'codex' as const,
    };
    expect(parseBrowserToHub(encodeHub(start))).toEqual(start);
    expect(
      parseBrowserToHub(JSON.parse(encodeHub(start).replace('codex', 'bash'))),
    ).toBeUndefined();
    const started = { type: 'started' as const, req: 'r', ok: true, target: 'tmux:agents:%3' };
    expect(parseHubToBrowser(encodeHub(started))).toEqual(started);
  });

  it('checks content requests and their slices', () => {
    const ask = {
      type: 'item.content' as const,
      req: 'r',
      project: '/home/me/shop',
      id: '20261009-120000-abcdef',
      offset: 0,
    };
    expect(parseBrowserToHub(encodeHub(ask))).toEqual(ask);
    expect(parseBrowserToHub(encodeHub({ ...ask, offset: -1 }))).toBeUndefined();
    expect(parseBrowserToHub(encodeHub({ ...ask, offset: 0.5 }))).toBeUndefined();
    const slice = {
      type: 'content' as const,
      req: 'r',
      ok: true,
      mimeType: 'image/png' as const,
      size: 3,
      data: 'AQID',
    };
    expect(parseHubToBrowser(encodeHub(slice))).toEqual(slice);
    expect(
      parseHubToBrowser(JSON.parse(encodeHub(slice).replace('image/png', 'text/html'))),
    ).toBeUndefined();
  });

  it('checks the first frame of a connection', () => {
    expect(parseHubAuth(encodeHub({ type: 'auth', token: 't', role: 'vscode' }))).toEqual({
      type: 'auth',
      token: 't',
      role: 'vscode',
    });
    expect(parseHubAuth({ v: 1, type: 'auth', token: 't', role: 'admin' })).toBeUndefined();
    expect(parseHubAuth({ v: 1, type: 'link', data: '' })).toBeUndefined();
  });

  it('rejects other versions, unknown or inherited types and bad fields', () => {
    expect(parseBrowserToHub({ v: 2, type: 'ping' })).toBeUndefined();
    expect(parseBrowserToHub({ v: 1, type: 'shutdown' })).toBeUndefined();
    expect(parseBrowserToHub({ v: 1, type: 'constructor' })).toBeUndefined();
    expect(parseBrowserToHub({ v: 1, type: 'link', data: 5 })).toBeUndefined();
    // Ids are short and plain: they end up in logs and lookups.
    expect(parseVsCodeToHub({ v: 1, type: 'link', browser: '../x', data: '' })).toBeUndefined();
    expect(
      parseVsCodeToHub({ v: 1, type: 'window', id: 'w', name: 'n', folders: [1], focusedAt: 0 }),
    ).toBeUndefined();
  });
});
