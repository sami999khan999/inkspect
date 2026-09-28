import { describe, expect, it } from 'vitest';
import {
  blend,
  contrastRatio,
  hsvToRgb,
  normalizeHex,
  parseColor,
  passesAA,
  rgbToHsv,
  toHslText,
  toHex,
} from '../src/color';

describe('colors', () => {
  it('parses computed style colors and hex', () => {
    expect(parseColor('rgb(37, 99, 235)')).toEqual({ r: 37, g: 99, b: 235, a: 1 });
    expect(parseColor('rgba(0, 0, 0, 0.5)')).toEqual({ r: 0, g: 0, b: 0, a: 0.5 });
    expect(parseColor('rgb(10 20 30 / 50%)')).toEqual({ r: 10, g: 20, b: 30, a: 0.5 });
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255, a: 1 });
    expect(parseColor('transparent')!.a).toBe(0);
    expect(parseColor('oklch(50% 0.1 20)')).toBeUndefined();
  });

  it('prints hex like DevTools', () => {
    expect(toHex({ r: 37, g: 99, b: 235, a: 1 })).toBe('#2563EB');
    expect(toHex({ r: 0, g: 0, b: 0, a: 0.5 })).toBe('#00000080');
  });

  it('computes WCAG contrast (white on #2563EB is 5.17)', () => {
    const white = parseColor('#ffffff')!;
    const blue = parseColor('#2563eb')!;
    expect(contrastRatio(white, blue)).toBeCloseTo(5.17, 2);
    expect(contrastRatio(parseColor('#000')!, white)).toBeCloseTo(21, 5);
    expect(passesAA(5.17, 16, 400)).toBe(true);
    expect(passesAA(3.5, 16, 400)).toBe(false);
    expect(passesAA(3.5, 24, 400)).toBe(true);
  });

  it('blends translucent colors over the background', () => {
    const mixed = blend({ r: 0, g: 0, b: 0, a: 0.5 }, { r: 255, g: 255, b: 255, a: 1 });
    expect(Math.round(mixed.r)).toBe(128);
    expect(mixed.a).toBe(1);
  });
});

describe('color picker math', () => {
  it('converts between RGB and HSV both ways', () => {
    for (const hex of [
      '#ff0000',
      '#00ff00',
      '#0000ff',
      '#e11d48',
      '#123456',
      '#ffffff',
      '#000000',
      '#808080',
    ]) {
      const rgb = parseColor(hex)!;
      expect(toHex(hsvToRgb(rgbToHsv(rgb))).toLowerCase()).toBe(hex);
    }
    expect(rgbToHsv(parseColor('#ff0000')!)).toEqual({ h: 0, s: 1, v: 1 });
    expect(rgbToHsv(parseColor('#00ffff')!).h).toBeCloseTo(180);
  });

  it('normalizes typed hex values', () => {
    expect(normalizeHex('ABC')).toBe('#aabbcc');
    expect(normalizeHex(' #E11D48 ')).toBe('#e11d48');
    expect(normalizeHex('#12')).toBeUndefined();
    expect(normalizeHex('red')).toBeUndefined();
  });
});

describe('hsl text', () => {
  it('formats colors as CSS hsl()', () => {
    expect(toHslText(parseColor('#ff0000')!)).toBe('hsl(0 100% 50%)');
    expect(toHslText(parseColor('#808080')!)).toBe('hsl(0 0% 50%)');
    expect(toHslText(parseColor('#3b82f6')!)).toBe('hsl(217 91% 60%)');
  });
});
