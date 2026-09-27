import { describe, expect, it } from 'vitest';
import { DEFAULT_SEARCH_URL, normalizeInput } from '../../src/shared/url';

const search = (query: string) => DEFAULT_SEARCH_URL.replace('%s', encodeURIComponent(query));

describe('normalizeInput', () => {
  it('returns undefined for empty input', () => {
    expect(normalizeInput('')).toBeUndefined();
    expect(normalizeInput('   ')).toBeUndefined();
  });

  it('keeps URLs with a known scheme', () => {
    expect(normalizeInput('https://example.com/a?b=c#d')).toBe('https://example.com/a?b=c#d');
    expect(normalizeInput('http://localhost:3000')).toBe('http://localhost:3000/');
    expect(normalizeInput('about:blank')).toBe('about:blank');
    expect(normalizeInput('vb://newtab')).toBe('vb://newtab');
  });

  it('adds https:// to domains', () => {
    expect(normalizeInput('example.com')).toBe('https://example.com/');
    expect(normalizeInput('  github.com/anthropics  ')).toBe('https://github.com/anthropics');
    expect(normalizeInput('example.com:8080/x')).toBe('https://example.com:8080/x');
  });

  it('adds http:// to local addresses', () => {
    expect(normalizeInput('localhost')).toBe('http://localhost/');
    expect(normalizeInput('localhost:3000')).toBe('http://localhost:3000/');
    expect(normalizeInput('localhost:5173/app')).toBe('http://localhost:5173/app');
    expect(normalizeInput('app.localhost:8080')).toBe('http://app.localhost:8080/');
    expect(normalizeInput('127.0.0.1:8000')).toBe('http://127.0.0.1:8000/');
    expect(normalizeInput('[::1]:3000')).toBe('http://[::1]:3000/');
  });

  it('turns absolute file paths into file URLs', () => {
    expect(normalizeInput('C:\\Users\\me\\index.html')).toBe('file:///C:/Users/me/index.html');
    expect(normalizeInput('/home/me/index.html')).toBe('file:///home/me/index.html');
  });

  it('searches for anything else', () => {
    expect(normalizeInput('hello world')).toBe(search('hello world'));
    expect(normalizeInput('react')).toBe(search('react'));
    expect(normalizeInput('1.5')).toBe(search('1.5'));
    expect(normalizeInput('mailto:someone')).toBe(search('mailto:someone'));
  });

  it('uses a custom search URL', () => {
    expect(normalizeInput('cats', 'https://duckduckgo.com/?q=%s')).toBe(
      'https://duckduckgo.com/?q=cats',
    );
  });
});
