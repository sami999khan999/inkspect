import { describe, expect, it } from 'vitest';
import {
  captureArea,
  clusterShapes,
  constrain,
  DEFAULT_STYLE,
  drawingPageKey,
  hitTest,
  intersect,
  moveShape,
  placeShapes,
  sanitizeAnchors,
  sanitizeShapes,
  shapeBounds,
  type Shape,
} from '../src/annotations';

const style = { ...DEFAULT_STYLE, width: 4 };
const rect = (id: string, x: number, y: number, w: number, h: number): Shape => ({
  id,
  kind: 'rect',
  start: [x, y],
  end: [x + w, y + h],
  style,
});

describe('annotation geometry', () => {
  it('includes half the stroke width in bounds', () => {
    expect(shapeBounds(rect('a', 10, 20, 100, 50))).toEqual({
      x: 8,
      y: 18,
      width: 104,
      height: 54,
    });
  });

  it('includes arrow heads', () => {
    const arrow: Shape = { id: 'a', kind: 'arrow', start: [100, 100], end: [200, 100], style };
    expect(shapeBounds(arrow).y).toBeLessThan(100 - 10);
  });

  it('captures all shapes plus padding, clamped to the page', () => {
    expect(captureArea([rect('a', 10, 10, 50, 50), rect('b', 200, 100, 20, 20)], 40)).toEqual({
      x: 0,
      y: 0,
      width: 262,
      height: 162,
    });
    expect(captureArea([], 40)).toBeUndefined();
  });

  it('groups nearby shapes and keeps far ones apart, top to bottom', () => {
    const groups = clusterShapes(
      [rect('far', 0, 1000, 10, 10), rect('a', 0, 0, 10, 10), rect('b', 30, 0, 10, 10)],
      40,
    );
    expect(groups.map((g) => g.map((s) => s.id))).toEqual([['a', 'b'], ['far']]);
  });

  it('merges groups bridged by a later shape', () => {
    const groups = clusterShapes(
      [rect('a', 0, 0, 10, 10), rect('c', 200, 0, 10, 10), rect('b', 60, 0, 70, 10)],
      70,
    );
    expect(groups).toHaveLength(1);
  });

  it('hits strokes near their points and lines near the segment', () => {
    const stroke: Shape = {
      id: 's',
      kind: 'stroke',
      tool: 'pen',
      points: [
        [0, 0, 0.5],
        [50, 0, 0.5],
      ],
      style,
    };
    expect(hitTest(stroke, [50, 3], 4)).toBe(true);
    expect(hitTest(stroke, [25, 40], 4)).toBe(false);
    const line: Shape = { id: 'l', kind: 'line', start: [0, 0], end: [100, 100], style };
    expect(hitTest(line, [50, 52], 4)).toBe(true);
    expect(hitTest(line, [90, 10], 4)).toBe(false);
  });

  it('moves shapes and constrains drags', () => {
    const moved = moveShape(rect('a', 0, 0, 10, 10), 5, 7);
    expect(moved.kind === 'rect' && moved.start).toEqual([5, 7]);
    expect(constrain('rect', [0, 0], [10, 30])).toEqual([30, 30]);
    const [x, y] = constrain('line', [0, 0], [100, 10]);
    expect(Math.round(x)).toBe(100);
    expect(Math.round(y)).toBe(0);
  });

  it('drops malformed shapes from the webview', () => {
    const shapes = sanitizeShapes([
      rect('ok', 0, 0, 1, 1),
      { id: 'x', kind: 'rect', start: [0], end: [1, 1], style },
      { id: 'y', kind: 'script', style },
      'nope',
    ]);
    expect(shapes.map((s) => s.id)).toEqual(['ok']);
    expect(sanitizeShapes('bad')).toEqual([]);
  });
});

describe('anchored shapes (scrolling sections)', () => {
  const anchors = { '#list': { x: 0, y: 300, clip: { x: 0, y: 100, width: 200, height: 400 } } };

  it('places shapes on a section by its scroll, and drops those whose section is gone', () => {
    const onList = { ...rect('a', 10, 500, 20, 20), anchor: '#list' };
    const gone = { ...rect('b', 0, 0, 5, 5), anchor: '#gone' };
    const placed = placeShapes([rect('p', 1, 2, 3, 4), onList, gone], anchors);
    expect(placed.map((s) => s.id)).toEqual(['p', 'a']);
    expect(shapeBounds(placed[1]!).y).toBe(200 - 2);
    // Without anchors (VS Code), shapes are where they were drawn.
    expect(placeShapes([onList], undefined)).toEqual([onList]);
  });

  it('intersects rectangles', () => {
    expect(
      intersect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 10, height: 10 }),
    ).toEqual({ x: 5, y: 5, width: 5, height: 5 });
    expect(
      intersect({ x: 0, y: 0, width: 1, height: 1 }, { x: 5, y: 5, width: 1, height: 1 }),
    ).toBeUndefined();
  });

  it('keeps anchors when sanitizing, and drops shapes with a malformed one', () => {
    const kept = sanitizeShapes([{ ...rect('a', 0, 0, 1, 1), anchor: '#list' }]);
    expect(kept[0]?.anchor).toBe('#list');
    expect(sanitizeShapes([{ ...rect('a', 0, 0, 1, 1), anchor: 42 }])).toEqual([]);
  });
});

describe('drawingPageKey', () => {
  it('leaves out fragments within a page, keeps hash routes', () => {
    expect(drawingPageKey('https://a.test/docs?x=1#install')).toBe('https://a.test/docs?x=1');
    expect(drawingPageKey('https://a.test/#/settings')).toBe('https://a.test/#/settings');
    expect(drawingPageKey('not a url')).toBe('not a url');
  });
});

describe('sanitizeAnchors', () => {
  it('keeps well-formed anchors and drops the rest', () => {
    const good = { x: 1, y: 2, clip: { x: 0, y: 0, width: 10, height: 10 } };
    expect(
      sanitizeAnchors({ '#a': good, '#b': { x: 'no', y: 0, clip: good.clip }, '#c': null }),
    ).toEqual({ '#a': good });
    expect(sanitizeAnchors({ '#a': { ...good, x: Infinity } })).toEqual({});
    expect(sanitizeAnchors('nope')).toEqual({});
  });
});
