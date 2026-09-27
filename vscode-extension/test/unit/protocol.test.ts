import { describe, expect, it } from 'vitest';
import { isWebviewToHost } from '../../src/shared/protocol';

describe('isWebviewToHost', () => {
  it('accepts valid messages', () => {
    expect(isWebviewToHost({ type: 'ready' })).toBe(true);
    expect(isWebviewToHost({ type: 'viewport', width: 800, height: 600, dpr: 2 })).toBe(true);
    expect(isWebviewToHost({ type: 'navigate', tabId: 't1', input: 'example.com' })).toBe(true);
    expect(isWebviewToHost({ type: 'navigate', input: 'vb://downloads', newTab: true })).toBe(true);
    expect(isWebviewToHost({ type: 'tab', action: 'close', tabId: 't1' })).toBe(true);
    expect(
      isWebviewToHost({
        type: 'input',
        tabId: 't1',
        event: {
          kind: 'mouse',
          type: 'mousePressed',
          x: 1,
          y: 2,
          button: 'left',
          buttons: 1,
          clickCount: 1,
          modifiers: 0,
        },
      }),
    ).toBe(true);
    expect(
      isWebviewToHost({
        type: 'input',
        tabId: 't1',
        event: {
          kind: 'key',
          type: 'keyDown',
          key: 'a',
          code: 'KeyA',
          keyCode: 65,
          location: 0,
          modifiers: 0,
          repeat: false,
        },
      }),
    ).toBe(true);
    expect(
      isWebviewToHost({
        type: 'contextMenuAction',
        tabId: 't1',
        action: 'copyLink',
        context: { linkUrl: 'https://example.com', editable: false },
      }),
    ).toBe(true);
  });

  it('rejects unknown types and non-objects', () => {
    expect(isWebviewToHost(null)).toBe(false);
    expect(isWebviewToHost('ready')).toBe(false);
    expect(isWebviewToHost({ type: 'eval', code: '1' })).toBe(false);
    expect(isWebviewToHost({ type: 'toString' })).toBe(false);
  });

  it('rejects messages with wrong field types', () => {
    expect(isWebviewToHost({ type: 'viewport', width: '800', height: 600, dpr: 1 })).toBe(false);
    expect(isWebviewToHost({ type: 'viewport', width: Number.NaN, height: 600, dpr: 1 })).toBe(
      false,
    );
    expect(isWebviewToHost({ type: 'tab', action: 'formatDisk' })).toBe(false);
    expect(
      isWebviewToHost({ type: 'input', tabId: 't1', event: { kind: 'mouse', type: 'click' } }),
    ).toBe(false);
    expect(isWebviewToHost({ type: 'input', tabId: 't1', event: { kind: 'script' } })).toBe(false);
    expect(isWebviewToHost({ type: 'download', action: 'open', id: 5 })).toBe(false);
  });
});
