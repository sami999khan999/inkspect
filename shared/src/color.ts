// Colors for the element inspector's tooltip: parsing computed style colors, hex output and
// WCAG contrast ratios.

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

/** Parses `rgb()` / `rgba()` (as `getComputedStyle` returns them) and `#rgb`/`#rrggbb`. */
export function parseColor(value: string): Rgba | undefined {
  const text = value.trim().toLowerCase();
  const fn = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/.exec(
    text,
  );
  if (fn) {
    const alpha =
      fn[4] === undefined ? 1 : fn[4].endsWith('%') ? parseFloat(fn[4]) / 100 : Number(fn[4]);
    return { r: Number(fn[1]), g: Number(fn[2]), b: Number(fn[3]), a: alpha };
  }
  const hex = /^#([\da-f]{3}|[\da-f]{6})$/.exec(text);
  if (hex) {
    const digits = hex[1]!.length === 3 ? [...hex[1]!].map((d) => d + d).join('') : hex[1]!;
    return {
      r: parseInt(digits.slice(0, 2), 16),
      g: parseInt(digits.slice(2, 4), 16),
      b: parseInt(digits.slice(4, 6), 16),
      a: 1,
    };
  }
  if (text === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  return undefined;
}

/** `#RRGGBB`, or `#RRGGBBAA` when not opaque (DevTools style). */
export function toHex({ r, g, b, a }: Rgba): string {
  const part = (n: number) => Math.round(n).toString(16).padStart(2, '0').toUpperCase();
  return `#${part(r)}${part(g)}${part(b)}${a < 1 ? part(a * 255) : ''}`;
}

/** Draws `top` over `bottom` (both colors; the result is opaque if `bottom` is). */
export function blend(top: Rgba, bottom: Rgba): Rgba {
  const a = top.a + bottom.a * (1 - top.a);
  if (a === 0) return { r: 0, g: 0, b: 0, a: 0 };
  const mix = (t: number, b: number) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
  return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
}

/** WCAG relative luminance. */
export function luminance({ r, g, b }: Rgba): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG contrast ratio between text and an opaque background (1 to 21). */
export function contrastRatio(text: Rgba, background: Rgba): number {
  const fg = luminance(blend(text, background));
  const bg = luminance(background);
  const [light, dark] = fg > bg ? [fg, bg] : [bg, fg];
  return (light + 0.05) / (dark + 0.05);
}

/** Whether a contrast ratio passes WCAG AA (4.5, or 3 for large text). */
export function passesAA(ratio: number, fontSizePx: number, fontWeight: number): boolean {
  const large = fontSizePx >= 24 || (fontSizePx >= 18.66 && fontWeight >= 700);
  return ratio >= (large ? 3 : 4.5);
}
