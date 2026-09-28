// Pure logic for the measure, accessibility-check and CSS tweak modes (shared by host and webview).
import type { Rect } from './protocol';

// ---------------------------------------------------------------------------------------------
// Measure
// ---------------------------------------------------------------------------------------------

/** An element's boxes in viewport CSS pixels (see MEASURE_FUNCTION). */
export interface MeasureBox {
  label: string;
  margin: Rect;
  border: Rect;
  padding: Rect;
  content: Rect;
  spacing: Record<'margin' | 'border' | 'padding', { t: number; r: number; b: number; l: number }>;
  font: string;
}

/** A distance line between two boxes: from (x1, y1) to (x2, y2), `length` CSS pixels long. */
export interface Gap {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  length: number;
  axis: 'x' | 'y';
}

/**
 * Distances between two elements' border boxes, like the DevTools/Figma alt-hover: the space
 * between them on each axis where they don't overlap, or from the inner box to the outer box's
 * edges when one contains the other.
 */
export function gaps(a: Rect, b: Rect): Gap[] {
  const result: Gap[] = [];
  const midY = (Math.max(a.y, b.y) + Math.min(a.y + a.height, b.y + b.height)) / 2;
  const midX = (Math.max(a.x, b.x) + Math.min(a.x + a.width, b.x + b.width)) / 2;
  const ay = a.y + a.height / 2;
  const ax = a.x + a.width / 2;
  const line = (x1: number, y1: number, x2: number, y2: number, axis: 'x' | 'y') => {
    const length = Math.round(axis === 'x' ? Math.abs(x2 - x1) : Math.abs(y2 - y1));
    if (length > 0) result.push({ x1, y1, x2, y2, length, axis });
  };
  const inside = (i: Rect, o: Rect) =>
    i.x >= o.x && i.y >= o.y && i.x + i.width <= o.x + o.width && i.y + i.height <= o.y + o.height;
  if (inside(a, b) || inside(b, a)) {
    const [inner, outer] = inside(a, b) ? [a, b] : [b, a];
    const cy = inner.y + inner.height / 2;
    const cx = inner.x + inner.width / 2;
    line(outer.x, cy, inner.x, cy, 'x');
    line(inner.x + inner.width, cy, outer.x + outer.width, cy, 'x');
    line(cx, outer.y, cx, inner.y, 'y');
    line(cx, inner.y + inner.height, cx, outer.y + outer.height, 'y');
    return result;
  }
  const y = Number.isFinite(midY) && midY >= Math.max(a.y, b.y) ? midY : ay;
  const x = Number.isFinite(midX) && midX >= Math.max(a.x, b.x) ? midX : ax;
  if (a.x + a.width <= b.x) line(a.x + a.width, y, b.x, y, 'x');
  else if (b.x + b.width <= a.x) line(b.x + b.width, y, a.x, y, 'x');
  if (a.y + a.height <= b.y) line(x, a.y + a.height, x, b.y, 'y');
  else if (b.y + b.height <= a.y) line(x, b.y + b.height, x, a.y, 'y');
  return result;
}

const px = (n: number) => `${Math.round(n * 10) / 10}px`;
const sides = (s: { t: number; r: number; b: number; l: number }) =>
  s.t === s.r && s.r === s.b && s.b === s.l
    ? px(s.t)
    : `${px(s.t)} ${px(s.r)} ${px(s.b)} ${px(s.l)}`;

/** Measurements as Markdown, for the clipboard or an agent. */
export function formatMeasurements(box: MeasureBox, other?: MeasureBox): string {
  const lines = [
    `- \`${box.label}\`: ${px(box.border.width)} × ${px(box.border.height)} at (${px(box.border.x)}, ${px(box.border.y)})`,
    `  - margin ${sides(box.spacing.margin)} · border ${sides(box.spacing.border)} · padding ${sides(box.spacing.padding)} · font ${box.font}`,
  ];
  if (other) {
    lines.push(
      `- \`${other.label}\`: ${px(other.border.width)} × ${px(other.border.height)} at (${px(other.border.x)}, ${px(other.border.y)})`,
    );
    const distances = gaps(box.border, other.border);
    if (distances.length) {
      lines.push(
        `- Distance: ${distances.map((g) => `${g.length}px ${g.axis === 'x' ? 'horizontal' : 'vertical'}`).join(', ')}`,
      );
    }
  }
  return `### Measurements\n${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------------------------
// Accessibility check
// ---------------------------------------------------------------------------------------------

export interface A11yIssue {
  kind: 'alt' | 'name' | 'label' | 'contrast' | 'lang' | 'heading' | 'tabindex';
  message: string;
  severity: 'error' | 'warning';
  element: string;
  /** Document CSS pixels (empty for page-level issues). */
  rect: Rect;
}

export interface A11yScan {
  issues: A11yIssue[];
  tabOrder: { element: string; rect: Rect }[];
  url: string;
  title: string;
}

/** Validates a scan returned by the page (page output is untrusted). */
export function sanitizeScan(value: unknown): A11yScan | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const v = value as Partial<A11yScan>;
  const isRect = (r: unknown): r is Rect =>
    !!r &&
    typeof r === 'object' &&
    ['x', 'y', 'width', 'height'].every(
      (k) => typeof (r as Record<string, unknown>)[k] === 'number',
    );
  const issues = Array.isArray(v.issues)
    ? v.issues.filter(
        (i): i is A11yIssue =>
          !!i &&
          typeof i.message === 'string' &&
          typeof i.element === 'string' &&
          (i.severity === 'error' || i.severity === 'warning') &&
          isRect(i.rect),
      )
    : [];
  const tabOrder = Array.isArray(v.tabOrder)
    ? v.tabOrder.filter((t) => !!t && typeof t.element === 'string' && isRect(t.rect))
    : [];
  return {
    issues: issues.slice(0, 300),
    tabOrder: tabOrder.slice(0, 200),
    url: typeof v.url === 'string' ? v.url : '',
    title: typeof v.title === 'string' ? v.title : '',
  };
}

/** The scan as a Markdown report: errors first, grouped by kind, for the clipboard or an agent. */
export function a11yReport(scan: A11yScan): string {
  const errors = scan.issues.filter((i) => i.severity === 'error');
  const warnings = scan.issues.filter((i) => i.severity === 'warning');
  const lines = [
    `### Accessibility check: ${scan.title || scan.url}`,
    `${scan.url}`,
    '',
    `${errors.length} errors, ${warnings.length} warnings, ${scan.tabOrder.length} elements in the tab order.`,
  ];
  for (const [title, list] of [
    ['Errors', errors],
    ['Warnings', warnings],
  ] as const) {
    if (!list.length) continue;
    lines.push('', `#### ${title}`);
    for (const issue of list) lines.push(`- ${issue.message}: \`${issue.element}\``);
  }
  if (!scan.issues.length) lines.push('', 'No issues found by the automatic checks.');
  return `${lines.join('\n')}\n`;
}

// ---------------------------------------------------------------------------------------------
// CSS tweak
// ---------------------------------------------------------------------------------------------

/** The changed properties as a CSS rule for the element's selector (empty when nothing changed). */
export function cssChanges(
  selector: string,
  original: Record<string, string>,
  current: Record<string, string>,
): string {
  const changed = Object.entries(current).filter(
    ([property, value]) => original[property] !== value,
  );
  if (!changed.length) return '';
  return `${selector} {\n${changed.map(([p, v]) => `  ${p}: ${v || 'initial'};`).join('\n')}\n}\n`;
}
