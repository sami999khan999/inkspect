import { describe, expect, it } from 'vitest';
import {
  describeRemoteObject,
  formatConsoleArguments,
  formatConsoleErrors,
  formatFailedRequests,
  formatPageContext,
  type ConsoleEntry,
  type NetworkEntry,
} from '../src/devtools';

const error: ConsoleEntry = {
  id: 1,
  level: 'error',
  text: "Uncaught TypeError: Cannot read properties of undefined (reading 'x')",
  url: 'src/App.tsx',
  line: 11,
  column: 4,
  source: 'exception',
  time: 0,
};
const warning: ConsoleEntry = {
  ...error,
  id: 2,
  level: 'warning',
  text: 'Deprecated API',
  url: undefined,
};
const ok: NetworkEntry = {
  id: 'a',
  method: 'GET',
  url: 'http://x/app.js',
  type: 'Script',
  status: 200,
  time: 0,
};
const failed: NetworkEntry = {
  id: 'b',
  method: 'POST',
  url: 'http://x/api',
  type: 'Fetch',
  status: 500,
  mimeType: 'application/json',
  duration: 120.4,
  time: 0,
};
const dns: NetworkEntry = {
  id: 'c',
  method: 'GET',
  url: 'https://cdn.invalid/x.css',
  type: 'Stylesheet',
  error: 'net::ERR_NAME_NOT_RESOLVED',
  time: 0,
};

describe('devtools summaries', () => {
  it('lists console errors with their source location', () => {
    expect(formatConsoleErrors([error, warning], 'http://localhost:3000/')).toBe(
      [
        '### Console errors: http://localhost:3000/ (1)',
        "1. Uncaught TypeError: Cannot read properties of undefined (reading 'x')",
        '   at src/App.tsx:12:5',
      ].join('\n'),
    );
    expect(formatConsoleErrors([warning], 'p', true)).toContain('[warning] Deprecated API');
    expect(formatConsoleErrors([], 'p')).toContain('No errors.');
  });

  it('lists failed requests only', () => {
    expect(formatFailedRequests([ok, failed, dns], 'http://x/')).toBe(
      [
        '### Failed network requests: http://x/ (2)',
        '- POST http://x/api → 500 application/json (Fetch, 120 ms)',
        '- GET https://cdn.invalid/x.css → net::ERR_NAME_NOT_RESOLVED (Stylesheet)',
      ].join('\n'),
    );
  });

  it('summarises the page', () => {
    const text = formatPageContext({
      url: 'http://x/',
      title: 'X',
      viewport: { width: 375, height: 667 },
      device: 'iPhone SE',
      selection: 'hello',
      console: [error],
      network: [ok, failed],
    });
    expect(text).toContain('- Viewport: 375×667 (emulating iPhone SE)');
    expect(text).toContain('- Selected text: "hello"');
    expect(text).toContain('(src/App.tsx:12:5)');
    expect(text).toContain('POST http://x/api → 500');
    expect(text).not.toContain('app.js');
  });
});

describe('console values', () => {
  it('describes remote objects', () => {
    expect(describeRemoteObject({ type: 'string', value: 'hi' })).toBe('hi');
    expect(describeRemoteObject({ type: 'number', value: 3 })).toBe('3');
    expect(describeRemoteObject({ type: 'number', unserializableValue: 'NaN' })).toBe('NaN');
    expect(describeRemoteObject({ type: 'object', subtype: 'null', value: null })).toBe('null');
    expect(
      describeRemoteObject({
        type: 'object',
        description: 'Object',
        preview: {
          overflow: false,
          properties: [
            { name: 'a', value: '1', type: 'number' },
            { name: 'b', value: 'x', type: 'string' },
          ],
        },
      }),
    ).toBe('{a: 1, b: "x"}');
    expect(
      describeRemoteObject({
        type: 'object',
        subtype: 'array',
        preview: { overflow: true, properties: [{ name: '0', value: '1', type: 'number' }] },
      }),
    ).toBe('[1, …]');
  });

  it('applies console format specifiers', () => {
    expect(formatConsoleArguments(['%s has %d items', 'cart', '3.7', 'extra'])).toBe(
      'cart has 3 items extra',
    );
    expect(formatConsoleArguments(['%cstyled', 'color:red'])).toBe('styled');
    expect(formatConsoleArguments(['plain', 'a', 'b'])).toBe('plain a b');
    // Next.js replays server logs with a styled " Server " badge.
    expect(
      formatConsoleArguments([
        '%c%s%c Query failed: %s',
        'background: #e6e6e6; border-radius: 2px',
        ' Server ',
        '',
        'timeout',
      ]),
    ).toBe(' Server  Query failed: timeout');
  });
});
