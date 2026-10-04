import { describe, expect, it } from 'vitest';
import { pageKeyOf } from '../../src/content/pageDrawings';

describe('pageKeyOf', () => {
  it('leaves out fragments that scroll within a page', () => {
    expect(pageKeyOf('https://example.com/docs?a=1#install')).toBe('https://example.com/docs?a=1');
  });

  it('keeps hash routes, which single-page apps use as pages', () => {
    expect(pageKeyOf('https://app.test/#/settings')).toBe('https://app.test/#/settings');
    expect(pageKeyOf('https://app.test/#!/inbox')).toBe('https://app.test/#!/inbox');
  });

  it('tells paths and queries apart', () => {
    expect(pageKeyOf('https://example.com/a')).not.toBe(pageKeyOf('https://example.com/b'));
    expect(pageKeyOf('https://example.com/a?x=1')).not.toBe(pageKeyOf('https://example.com/a'));
  });
});
