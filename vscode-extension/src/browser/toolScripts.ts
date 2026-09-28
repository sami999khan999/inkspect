// Page scripts for the measure, CSS tweak and accessibility-check modes. Like the other page
// scripts they are fixed source strings (or self-contained functions) with JSON arguments; the
// element ones run with `this` bound to the element (`Runtime.callFunctionOn`).
import { buildSelector } from '@inkspect/shared/elementInfo';

/**
 * An element's boxes in viewport CSS pixels (margin, border, padding, content), its label and
 * the scroll position, for the measure overlay.
 */
export const MEASURE_FUNCTION = `function () {
  const el = this;
  const r = el.getBoundingClientRect();
  const cs = getComputedStyle(el);
  const n = (v) => parseFloat(v) || 0;
  const m = { t: n(cs.marginTop), r: n(cs.marginRight), b: n(cs.marginBottom), l: n(cs.marginLeft) };
  const b = { t: n(cs.borderTopWidth), r: n(cs.borderRightWidth), b: n(cs.borderBottomWidth), l: n(cs.borderLeftWidth) };
  const p = { t: n(cs.paddingTop), r: n(cs.paddingRight), b: n(cs.paddingBottom), l: n(cs.paddingLeft) };
  const rect = (x, y, w, h) => ({ x, y, width: Math.max(0, w), height: Math.max(0, h) });
  const border = rect(r.left, r.top, r.width, r.height);
  const margin = rect(r.left - m.l, r.top - m.t, r.width + m.l + m.r, r.height + m.t + m.b);
  const padding = rect(r.left + b.l, r.top + b.t, r.width - b.l - b.r, r.height - b.t - b.b);
  const content = rect(padding.x + p.l, padding.y + p.t, padding.width - p.l - p.r, padding.height - p.t - p.b);
  const classes = Array.from(el.classList || []).slice(0, 2).map((c) => '.' + c).join('');
  return {
    label: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + classes,
    margin, border, padding, content,
    spacing: { margin: m, border: b, padding: p },
    font: cs.fontSize + ' ' + cs.fontFamily.split(',')[0].replace(/["']/g, ''),
  };
}`;

/** Style properties the CSS tweak panel shows (their computed values), in this order. */
export const TWEAK_PROPERTIES = [
  'display',
  'position',
  'width',
  'height',
  'margin',
  'padding',
  'gap',
  'color',
  'background-color',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-align',
  'border',
  'border-radius',
  'box-shadow',
  'opacity',
  'flex-direction',
  'justify-content',
  'align-items',
  'z-index',
] as const;

/** Picks an element for CSS tweaking: its selector, current `style` attribute and values. */
export const TWEAK_READ_FUNCTION = `function (properties) {
  const buildSelector = ${buildSelector.toString()};
  const cs = getComputedStyle(this);
  const values = {};
  for (const p of properties) values[p] = cs.getPropertyValue(p);
  return { selector: buildSelector(this), styleText: this.getAttribute('style') || '', values };
}`;

/** Sets one property inline (an empty value removes it) and returns the new computed value. */
export const TWEAK_SET_FUNCTION = `function (property, value) {
  if (value) this.style.setProperty(property, value);
  else this.style.removeProperty(property);
  return getComputedStyle(this).getPropertyValue(property);
}`;

/** Puts the element's original `style` attribute back. */
export const TWEAK_RESTORE_FUNCTION = `function (styleText) {
  if (styleText) this.setAttribute('style', styleText);
  else this.removeAttribute('style');
}`;

/**
 * Scans the page for common accessibility problems and the keyboard tab order. Rects are in
 * document CSS pixels. Self-contained: the contrast math is inlined (see shared/src/color.ts).
 */
export const A11Y_SCAN_FUNCTION = `() => {
  const issues = [];
  const MAX = 300;
  const scrollX = window.scrollX, scrollY = window.scrollY;
  const rectOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height };
  };
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.01;
  };
  const label = (el) => {
    const classes = Array.from(el.classList || []).slice(0, 2).map((c) => '.' + c).join('');
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + classes;
  };
  const add = (el, kind, message, severity) => {
    if (issues.length < MAX) issues.push({ kind, message, severity, element: label(el), rect: rectOf(el) });
  };
  const nameOf = (el) => {
    const labelledby = el.getAttribute('aria-labelledby');
    if (labelledby) {
      const text = labelledby.split(/\\s+/).map((id) => document.getElementById(id)?.textContent || '').join(' ').trim();
      if (text) return text;
    }
    const aria = el.getAttribute('aria-label');
    if (aria && aria.trim()) return aria.trim();
    if (el.labels && el.labels.length) {
      const text = Array.from(el.labels).map((l) => l.textContent || '').join(' ').trim();
      if (text) return text;
    }
    const title = el.getAttribute('title');
    if (title && title.trim()) return title.trim();
    const text = (el.innerText || el.textContent || '').trim();
    if (text) return text;
    const img = el.querySelector && el.querySelector('img[alt]:not([alt=""]), svg title');
    return img ? (img.getAttribute('alt') || img.textContent || '').trim() : '';
  };

  // Images without a text alternative.
  for (const img of document.querySelectorAll('img')) {
    if (visible(img) && !img.hasAttribute('alt') && img.getAttribute('role') !== 'presentation') {
      add(img, 'alt', 'Image has no alt text', 'error');
    }
  }
  // Buttons and links without a name.
  for (const el of document.querySelectorAll('button, a[href], [role="button"], [role="link"]')) {
    if (visible(el) && !nameOf(el)) {
      add(el, 'name', (el.tagName === 'A' ? 'Link' : 'Button') + ' has no accessible name', 'error');
    }
  }
  // Form controls without a label.
  for (const el of document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea')) {
    if (visible(el) && !nameOf(el) && !el.getAttribute('placeholder')) {
      add(el, 'label', 'Form field has no label', 'error');
    } else if (visible(el) && !nameOf(el)) {
      add(el, 'label', 'Form field is labelled only by its placeholder', 'warning');
    }
  }
  // Text contrast (WCAG AA): the element's own text against the nearest opaque background.
  const parse = (value) => {
    const m = /rgba?\\(([\\d.]+)[,\\s]+([\\d.]+)[,\\s]+([\\d.]+)(?:[,\\s/]+([\\d.]+%?))?/.exec(value);
    if (!m) return null;
    const a = m[4] === undefined ? 1 : m[4].endsWith('%') ? parseFloat(m[4]) / 100 : Number(m[4]);
    return { r: +m[1], g: +m[2], b: +m[3], a };
  };
  const blend = (top, bottom) => {
    const a = top.a + bottom.a * (1 - top.a);
    if (!a) return { r: 0, g: 0, b: 0, a: 0 };
    const mix = (t, b) => (t * top.a + b * bottom.a * (1 - top.a)) / a;
    return { r: mix(top.r, bottom.r), g: mix(top.g, bottom.g), b: mix(top.b, bottom.b), a };
  };
  const lum = (c) => {
    const f = (v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const background = (el) => {
    const layers = [];
    for (let node = el; node && node.nodeType === 1; node = node.parentElement) {
      const cs = getComputedStyle(node);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null; // Can't tell.
      const color = parse(cs.backgroundColor);
      if (color && color.a > 0) {
        layers.push(color);
        if (color.a >= 1) break;
      }
    }
    let result = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) result = blend(layers[i], result);
    return result;
  };
  let checked = 0;
  const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (walker.nextNode() && checked < 2000) {
    const text = walker.currentNode;
    const el = text.parentElement;
    if (!el || seen.has(el) || !(text.textContent || '').trim()) continue;
    seen.add(el);
    if (!visible(el)) continue;
    checked++;
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    const bg = background(el);
    if (!fg || !bg) continue;
    const l1 = lum(blend(fg, bg)), l2 = lum(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    const size = parseFloat(cs.fontSize), weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    if (ratio < (large ? 3 : 4.5)) {
      add(el, 'contrast', 'Low text contrast ' + ratio.toFixed(2) + ':1 (needs ' + (large ? '3' : '4.5') + ':1)', 'warning');
    }
  }
  // Page-level checks.
  if (!document.documentElement.getAttribute('lang')) {
    issues.push({ kind: 'lang', message: 'The page has no lang attribute', severity: 'warning', element: 'html', rect: { x: 0, y: 0, width: 0, height: 0 } });
  }
  if (!document.querySelector('h1')) {
    issues.push({ kind: 'heading', message: 'The page has no h1 heading', severity: 'warning', element: 'body', rect: { x: 0, y: 0, width: 0, height: 0 } });
  }
  // Keyboard tab order.
  const focusable = Array.from(document.querySelectorAll('a[href], button, input, select, textarea, summary, [tabindex], [contenteditable="true"]'))
    .filter((el) => !el.disabled && el.getAttribute('tabindex') !== '-1' && visible(el));
  const positive = focusable.filter((el) => el.tabIndex > 0).sort((a, b) => a.tabIndex - b.tabIndex);
  const natural = focusable.filter((el) => el.tabIndex <= 0);
  const tabOrder = positive.concat(natural).slice(0, 200).map((el) => ({ element: label(el), rect: rectOf(el) }));
  for (const el of positive) add(el, 'tabindex', 'Positive tabindex changes the tab order', 'warning');
  return { issues, tabOrder, url: location.href, title: document.title };
}`;
