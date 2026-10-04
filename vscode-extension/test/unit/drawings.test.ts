import { describe, expect, it } from 'vitest';
import { MAX_DRAWING_PAGES, withPageDrawings } from '../../src/features/drawings';
import { DEFAULT_STYLE, type Shape } from '../../src/shared/annotations';

const shape: Shape = { id: 's', kind: 'rect', start: [0, 0], end: [5, 5], style: DEFAULT_STYLE };

describe('withPageDrawings', () => {
  it('keeps each page’s drawings, and removes a page with none', () => {
    let all = withPageDrawings({}, 'https://a.test/', [shape], 1);
    all = withPageDrawings(all, 'https://b.test/', [shape], 2);
    expect(Object.keys(all).sort()).toEqual(['https://a.test/', 'https://b.test/']);
    all = withPageDrawings(all, 'https://a.test/', [], 3);
    expect(Object.keys(all)).toEqual(['https://b.test/']);
  });

  it('drops the pages drawn on longest ago', () => {
    let all = {};
    for (let i = 0; i <= MAX_DRAWING_PAGES; i++) {
      all = withPageDrawings(all, `https://p${i}.test/`, [shape], i);
    }
    expect(Object.keys(all)).toHaveLength(MAX_DRAWING_PAGES);
    expect(all).not.toHaveProperty(['https://p0.test/']);
  });
});
