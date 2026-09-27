import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cleanUserAgent, userAgentMetadata } from '../../src/browser/userAgent';
import { decodeDataUrl, sanitizeContext } from '../../src/browser/TabSession';
import { sanitizeFilename, uniqueFilename } from '../../src/features/downloads';
import { acceptToFilters } from '../../src/features/fileChooser';
import { findLocalUrls } from '../../src/features/terminalLinks';
import { stepZoom, zoomKey } from '../../src/features/zoom';
import { filenameFromUrl, languageForMime, sniffImageType } from '../../src/panel/pageActions';
import { parseInternalUrl } from '../../src/shared/internalPages';

describe('zoom', () => {
  it('steps through the zoom levels', () => {
    expect(stepZoom(1, 1)).toBe(1.1);
    expect(stepZoom(1, -1)).toBe(0.9);
    expect(stepZoom(1.05, 1)).toBe(1.1);
    expect(stepZoom(5, 1)).toBe(5);
    expect(stepZoom(0.25, -1)).toBe(0.25);
  });

  it('remembers zoom per host', () => {
    expect(zoomKey('https://example.com/a')).toBe('example.com');
    expect(zoomKey('http://localhost:3000/')).toBe('localhost:3000');
    expect(zoomKey('file:///C:/a.html')).toBe('file:');
    expect(zoomKey('about:blank')).toBeUndefined();
    expect(zoomKey('not a url')).toBeUndefined();
  });
});

describe('download file names', () => {
  it('removes characters that are invalid in file names', () => {
    expect(sanitizeFilename('a/b\\c:d*e?.txt')).toBe('a_b_c_d_e_.txt');
    expect(sanitizeFilename('  ..hidden. ')).toBe('hidden');
    expect(sanitizeFilename('')).toBe('download');
  });

  it('appends a counter when the file exists', () => {
    const existing = new Set([join('/d', 'report.pdf'), join('/d', 'report (1).pdf')]);
    const exists = (path: string) => existing.has(path);
    expect(uniqueFilename('/d', 'report.pdf', exists)).toBe(join('/d', 'report (2).pdf'));
    expect(uniqueFilename('/d', 'new.pdf', exists)).toBe(join('/d', 'new.pdf'));
  });
});

describe('page helpers', () => {
  it('picks a language for view source', () => {
    expect(languageForMime('text/html')).toBe('html');
    expect(languageForMime('application/json; charset=utf-8')).toBe('json');
    expect(languageForMime('text/javascript')).toBe('javascript');
    expect(languageForMime('image/svg+xml')).toBe('xml');
    expect(languageForMime('application/octet-stream')).toBe('plaintext');
  });

  it('detects image types', () => {
    expect(sniffImageType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0]))).toBe(
      'image/png',
    );
    expect(sniffImageType(Buffer.from([0xff, 0xd8, 0xff]))).toBe('image/jpeg');
    expect(sniffImageType(Buffer.from('GIF89a'))).toBe('image/gif');
    expect(sniffImageType(Buffer.from('RIFF\0\0\0\0WEBPVP8 '))).toBe('image/webp');
    expect(sniffImageType(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg">'))).toBe(
      'image/svg+xml',
    );
    expect(sniffImageType(Buffer.from('hello'))).toBe('application/octet-stream');
  });

  it('names files after the URL path', () => {
    expect(filenameFromUrl('https://x.dev/a/logo.png?v=2')).toBe('logo.png');
    expect(filenameFromUrl('https://x.dev/a%20b.jpg')).toBe('a b.jpg');
    expect(filenameFromUrl('https://x.dev/')).toBe('x.dev');
    expect(filenameFromUrl('data:image/png;base64,AAAA', 'image')).toBe('image');
  });
});

describe('file chooser filters', () => {
  it('converts accept values to extensions', () => {
    expect(acceptToFilters(['.pdf', 'image/png'])).toEqual({
      'Accepted files': ['pdf', 'png'],
      'All files': ['*'],
    });
    expect(acceptToFilters(['image/*'])?.['Accepted files']).toContain('jpg');
  });

  it('offers every file when nothing is recognised', () => {
    expect(acceptToFilters([])).toBeUndefined();
    expect(acceptToFilters(['application/x-unknown'])).toBeUndefined();
  });
});

describe('terminal links', () => {
  it('finds local server URLs', () => {
    expect(findLocalUrls('  ➜  Local:   http://localhost:5173/')).toEqual([
      { index: 14, length: 22, url: 'http://localhost:5173/' },
    ]);
    expect(findLocalUrls('Listening on http://0.0.0.0:8000.')).toEqual([
      { index: 13, length: 19, url: 'http://localhost:8000' },
    ]);
    expect(
      findLocalUrls('https://127.0.0.1:8443/app and http://[::1]:3000').map((m) => m.url),
    ).toEqual(['https://127.0.0.1:8443/app', 'http://[::1]:3000']);
  });

  it('ignores remote URLs', () => {
    expect(findLocalUrls('see https://example.com/docs')).toEqual([]);
  });
});

describe('internal pages', () => {
  it('parses vb:// URLs', () => {
    expect(parseInternalUrl('vb://newtab')).toBe('newtab');
    expect(parseInternalUrl('vb://Downloads/')).toBe('downloads');
    expect(parseInternalUrl('vb://unknown')).toBeUndefined();
    expect(parseInternalUrl('https://newtab')).toBeUndefined();
  });
});

describe('user agent', () => {
  const headless =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/154.0.0.0 Safari/537.36';

  it('reports a regular Chrome product token', () => {
    expect(cleanUserAgent(headless)).toContain(' Chrome/154.0.0.0 ');
    expect(cleanUserAgent(headless)).not.toContain('Headless');
  });

  it('builds client hints without the headless brand', () => {
    const metadata = userAgentMetadata(cleanUserAgent(headless), 'win32', 'x64');
    expect(metadata.platform).toBe('Windows');
    expect(metadata.brands?.map((b) => b.brand)).toEqual(['Chromium', 'Not=A?Brand']);
    expect(metadata.brands?.[0]?.version).toBe('154');
  });
});

describe('page messages', () => {
  it('keeps valid context menu fields', () => {
    expect(
      sanitizeContext({
        linkUrl: 'https://example.com/a',
        mediaType: 'img',
        srcUrl: 'data:image/png;base64,AAAA',
        selectionText: 'hi',
        editable: true,
      }),
    ).toEqual({
      linkUrl: 'https://example.com/a',
      linkText: undefined,
      mediaType: 'img',
      srcUrl: 'data:image/png;base64,AAAA',
      selectionText: 'hi',
      editable: true,
      frameUrl: undefined,
    });
  });

  it('drops dangerous or malformed values from pages', () => {
    const context = sanitizeContext({
      linkUrl: 'javascript:alert(1)',
      mediaType: 'iframe',
      srcUrl: 'https://x.dev/a.png',
      editable: 'yes',
      selectionText: 42,
    });
    expect(context.linkUrl).toBeUndefined();
    expect(context.mediaType).toBeUndefined();
    expect(context.srcUrl).toBeUndefined();
    expect(context.editable).toBe(false);
    expect(context.selectionText).toBeUndefined();
  });

  it('decodes data URLs', () => {
    expect(decodeDataUrl('data:text/plain;base64,aGk=').toString()).toBe('hi');
    expect(decodeDataUrl('data:text/plain,a%20b').toString()).toBe('a b');
    expect(() => decodeDataUrl('https://x')).toThrow();
  });
});
