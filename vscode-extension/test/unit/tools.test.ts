import { describe, expect, it } from 'vitest';
import {
  a11yReport,
  cssChanges,
  formatMeasurements,
  gaps,
  sanitizeScan,
  type MeasureBox,
} from '../../src/shared/tools';

const rect = (x: number, y: number, width: number, height: number) => ({ x, y, width, height });

describe('measure', () => {
  it('measures the gap between side-by-side and stacked boxes', () => {
    expect(gaps(rect(0, 0, 100, 50), rect(130, 10, 50, 20)).map((g) => [g.axis, g.length])).toEqual(
      [['x', 30]],
    );
    expect(gaps(rect(0, 0, 100, 50), rect(20, 80, 50, 20)).map((g) => [g.axis, g.length])).toEqual([
      ['y', 30],
    ]);
    // Diagonal: both distances.
    expect(gaps(rect(0, 0, 10, 10), rect(20, 30, 10, 10)).map((g) => g.length)).toEqual([10, 20]);
  });

  it('measures from a box to the edges of the box around it', () => {
    const lengths = gaps(rect(10, 20, 80, 40), rect(0, 0, 100, 100)).map((g) => g.length);
    expect(lengths).toEqual([10, 10, 20, 40]);
  });

  it('formats measurements for an agent', () => {
    const box: MeasureBox = {
      label: 'button.primary',
      margin: rect(0, 0, 120, 40),
      border: rect(0, 0, 120, 40),
      padding: rect(1, 1, 118, 38),
      content: rect(17, 9, 86, 22),
      spacing: {
        margin: { t: 0, r: 0, b: 0, l: 0 },
        border: { t: 1, r: 1, b: 1, l: 1 },
        padding: { t: 8, r: 16, b: 8, l: 16 },
      },
      font: '14px Inter',
    };
    const text = formatMeasurements(box, { ...box, label: 'a', border: rect(150, 0, 20, 20) });
    expect(text).toContain('`button.primary`: 120px × 40px');
    expect(text).toContain('padding 8px 16px 8px 16px');
    expect(text).toContain('Distance: 30px horizontal');
  });
});

describe('accessibility check', () => {
  it('drops malformed issues from the page and reports errors first', () => {
    const scan = sanitizeScan({
      url: 'https://a.dev/',
      title: 'A',
      issues: [
        {
          kind: 'contrast',
          message: 'Low contrast',
          severity: 'warning',
          element: 'p',
          rect: rect(0, 0, 1, 1),
        },
        {
          kind: 'alt',
          message: 'No alt',
          severity: 'error',
          element: 'img',
          rect: rect(0, 0, 1, 1),
        },
        { message: 5 },
        null,
      ],
      tabOrder: [{ element: 'a', rect: rect(0, 0, 1, 1) }, { element: 1 }],
    })!;
    expect(scan.issues).toHaveLength(2);
    expect(scan.tabOrder).toHaveLength(1);
    const report = a11yReport(scan);
    expect(report.indexOf('#### Errors')).toBeLessThan(report.indexOf('#### Warnings'));
    expect(report).toContain('1 errors, 1 warnings, 1 elements in the tab order.');
    expect(sanitizeScan('nope')).toBeUndefined();
  });
});

describe('css tweak', () => {
  it('lists only changed properties as a rule', () => {
    expect(cssChanges('.card', { color: 'red', gap: '4px' }, { color: 'blue', gap: '4px' })).toBe(
      '.card {\n  color: blue;\n}\n',
    );
    expect(cssChanges('.card', { color: 'red' }, { color: 'red' })).toBe('');
  });
});
