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
