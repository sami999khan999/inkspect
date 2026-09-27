import { describe, expect, it } from 'vitest';
import {
  captureArea,
  clusterShapes,
  constrain,
  DEFAULT_STYLE,
  hitTest,
  moveShape,
  sanitizeShapes,
  shapeBounds,
  type Shape,
} from '../../src/shared/annotations';

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
