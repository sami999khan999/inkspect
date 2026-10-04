// Drawing model: shapes drawn over a page, in document CSS pixels (so they stay attached to the
// page while it scrolls). Shared by the webview (drawing and compositing) and the host (storage).

export type Point = [x: number, y: number];

export type PenTool = 'pen' | 'pencil' | 'marker' | 'brush' | 'highlighter' | 'neon';
export type ShapeTool = 'line' | 'arrow' | 'doubleArrow' | 'rect' | 'ellipse' | 'blur';
export type DrawTool = PenTool | ShapeTool | 'text' | 'callout' | 'eraser' | 'select';

export const PEN_TOOLS: readonly PenTool[] = [
  'pen',
  'pencil',
  'marker',
  'brush',
  'highlighter',
  'neon',
];
export const SHAPE_TOOLS: readonly ShapeTool[] = [
  'line',
  'arrow',
  'doubleArrow',
  'rect',
  'ellipse',
  'blur',
];

export interface ShapeStyle {
  color: string;
  /** Stroke width in CSS pixels. */
  width: number;
  opacity: number;
  dash: 'solid' | 'dashed' | 'dotted';
  fill: boolean;
}

export type Shape = (
  | {
      id: string;
      kind: 'stroke';
      tool: PenTool;
      points: [number, number, number][];
      style: ShapeStyle;
    }
  | { id: string; kind: ShapeTool; start: Point; end: Point; style: ShapeStyle }
  | { id: string; kind: 'text'; at: Point; text: string; style: ShapeStyle }
  | { id: string; kind: 'callout'; at: Point; number: number; style: ShapeStyle }
) & {
  /**
   * The scrolling section of the page the shape was drawn on (a key into `Anchors`). Its
   * coordinates are then that section's content: document coordinates plus the section's scroll,
   * so the shape moves with the section when it scrolls.
   */
  anchor?: string;
};

export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Where a scrolling section is now: its scroll, and the part of the document it shows. */
export interface Anchor {
  x: number;
  y: number;
  clip: Bounds;
}

export type Anchors = Record<string, Anchor>;

/** A scrolling section of the page (its selector), and where it is now. */
export interface Section {
  id: string;
  at: Anchor;
}

/** Makes anchors measured in a page safe to use (the page can change what its scripts return). */
export function sanitizeAnchors(value: unknown): Anchors {
  const anchors: Anchors = {};
  if (typeof value !== 'object' || value === null) return anchors;
  const finite = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);
  for (const [id, raw] of Object.entries(value as Record<string, unknown>).slice(0, 200)) {
    const a = raw as { x?: unknown; y?: unknown; clip?: Record<string, unknown> } | null;
    const clip = a?.clip;
    if (
      id.length <= 1_000 &&
      finite(a?.x) &&
      finite(a.y) &&
      clip &&
      finite(clip.x) &&
      finite(clip.y) &&
      finite(clip.width) &&
      finite(clip.height)
    ) {
      anchors[id] = {
        x: a.x,
        y: a.y,
        clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height },
      };
    }
  }
  return anchors;
}

/**
 * Shapes in document coordinates, as they are on screen now: anchored ones moved by their
 * section's scroll. Shapes whose section is gone are left out.
 */
export function placeShapes(shapes: Shape[], anchors: Anchors | undefined): Shape[] {
  if (!anchors) return shapes;
  const placed: Shape[] = [];
  for (const shape of shapes) {
    if (!shape.anchor) {
      placed.push(shape);
      continue;
    }
    const anchor = anchors[shape.anchor];
    if (anchor) placed.push(moveShape(shape, -anchor.x, -anchor.y));
  }
  return placed;
}

/**
 * The page drawings belong to, from its address. The fragment is left out (it scrolls within a
 * page), unless it is a route (`#/settings`, `#!/inbox`), which single-page apps use as pages.
 */
export function drawingPageKey(href: string): string {
  try {
    const url = new URL(href);
    if (!/^#!?\//.test(url.hash)) url.hash = '';
    return url.href;
  } catch {
    return href;
  }
}

/** The part of two rectangles they share, or undefined. */
export function intersect(a: Bounds, b: Bounds): Bounds | undefined {
  const x = Math.max(a.x, b.x);
  const y = Math.max(a.y, b.y);
  const right = Math.min(a.x + a.width, b.x + b.width);
  const bottom = Math.min(a.y + a.height, b.y + b.height);
  return right > x && bottom > y ? { x, y, width: right - x, height: bottom - y } : undefined;
}

export const COLORS = [
  '#ff3b30',
  '#ff9500',
  '#ffcc00',
  '#34c759',
  '#00c7be',
  '#007aff',
  '#af52de',
  '#ffffff',
  '#000000',
] as const;

export const DEFAULT_STYLE: ShapeStyle = {
  color: '#ff3b30',
  width: 4,
  opacity: 1,
  dash: 'solid',
  fill: false,
};

/** Font size of text labels for a style (text grows with the chosen width). */
export function textSize(style: ShapeStyle): number {
  return 12 + style.width * 2;
}

/** Radius of numbered callout badges. */
export function calloutRadius(style: ShapeStyle): number {
  return 10 + style.width;
}

/** The area a shape covers, including half its stroke width. */
export function shapeBounds(shape: Shape): Bounds {
  const pad = shape.style.width / 2 + (shape.kind === 'stroke' && shape.tool === 'neon' ? 8 : 0);
  let points: Point[];
  switch (shape.kind) {
    case 'stroke':
      points = shape.points.map(([x, y]) => [x, y]);
      break;
    case 'text': {
      const size = textSize(shape.style);
      // Rough width: text measured in the webview is not available here.
      const lines = shape.text.split('\n');
      const width = Math.max(...lines.map((l) => l.length)) * size * 0.6;
      points = [shape.at, [shape.at[0] + width, shape.at[1] + lines.length * size * 1.25]];
      break;
    }
    case 'callout': {
      const r = calloutRadius(shape.style);
      points = [
        [shape.at[0] - r, shape.at[1] - r],
        [shape.at[0] + r, shape.at[1] + r],
      ];
      break;
    }
    default: {
      // Arrow heads stick out beyond the line ends.
      const head =
        shape.kind === 'arrow' || shape.kind === 'doubleArrow' ? arrowHeadSize(shape.style) : 0;
      points = [shape.start, shape.end];
      return expand(boundsOf(points), pad + head);
    }
  }
  return expand(boundsOf(points), pad);
}

export function arrowHeadSize(style: ShapeStyle): number {
  return 8 + style.width * 2.5;
}

function boundsOf(points: Point[]): Bounds {
  const xs = points.map((p) => p[0]);
  const ys = points.map((p) => p[1]);
  const x = Math.min(...xs);
  const y = Math.min(...ys);
  return { x, y, width: Math.max(...xs) - x, height: Math.max(...ys) - y };
}

export function expand(bounds: Bounds, by: number): Bounds {
  return {
    x: bounds.x - by,
    y: bounds.y - by,
    width: bounds.width + by * 2,
    height: bounds.height + by * 2,
  };
}

export function union(all: Bounds[]): Bounds | undefined {
  if (!all.length) return undefined;
  const x = Math.min(...all.map((b) => b.x));
  const y = Math.min(...all.map((b) => b.y));
  const right = Math.max(...all.map((b) => b.x + b.width));
  const bottom = Math.max(...all.map((b) => b.y + b.height));
  return { x, y, width: right - x, height: bottom - y };
}

/** Keeps a rectangle inside the document (it cannot start above or left of the page). */
export function clampToPage(bounds: Bounds, page?: { width: number; height: number }): Bounds {
  const x = Math.max(0, bounds.x);
  const y = Math.max(0, bounds.y);
  const right = page ? Math.min(page.width, bounds.x + bounds.width) : bounds.x + bounds.width;
  const bottom = page ? Math.min(page.height, bounds.y + bounds.height) : bounds.y + bounds.height;
  return { x, y, width: Math.max(1, right - x), height: Math.max(1, bottom - y) };
}

/** The area to capture for "screenshot the drawing": all shapes plus padding. */
export function captureArea(shapes: Shape[], padding: number): Bounds | undefined {
  const all = union(shapes.map(shapeBounds));
  return all && clampToPage(expand(all, padding));
}

function near(a: Bounds, b: Bounds, gap: number): boolean {
  return (
    a.x - gap <= b.x + b.width &&
    b.x - gap <= a.x + a.width &&
    a.y - gap <= b.y + b.height &&
    b.y - gap <= a.y + a.height
  );
}

/**
 * Groups shapes that are close together (within `gap`), for "each drawing separately". Groups are
 * ordered top to bottom.
 */
export function clusterShapes(shapes: Shape[], gap: number): Shape[][] {
  const groups: { shapes: Shape[]; bounds: Bounds }[] = [];
  for (const shape of shapes) {
    const bounds = shapeBounds(shape);
    const touching = groups.filter((g) => near(g.bounds, bounds, gap));
    const merged = {
      shapes: [...touching.flatMap((g) => g.shapes), shape],
      bounds: union([bounds, ...touching.map((g) => g.bounds)])!,
    };
    for (const g of touching) groups.splice(groups.indexOf(g), 1);
    groups.push(merged);
  }
  return groups.sort((a, b) => a.bounds.y - b.bounds.y).map((g) => g.shapes);
}

/** Distance from a point to a shape's outline (approximate; used by the eraser and selection). */
export function hitTest(shape: Shape, point: Point, tolerance: number): boolean {
  const b = expand(shapeBounds(shape), tolerance);
  const inside =
    point[0] >= b.x && point[0] <= b.x + b.width && point[1] >= b.y && point[1] <= b.y + b.height;
  if (!inside) return false;
  if (shape.kind === 'stroke') {
    const limit = tolerance + shape.style.width / 2;
    return shape.points.some(([x, y]) => Math.hypot(x - point[0], y - point[1]) <= limit + 4);
  }
  if (shape.kind === 'line' || shape.kind === 'arrow' || shape.kind === 'doubleArrow') {
    return distanceToSegment(point, shape.start, shape.end) <= tolerance + shape.style.width / 2;
  }
  return true;
}

function distanceToSegment(p: Point, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const length = dx * dx + dy * dy;
  const t = length
    ? Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / length))
    : 0;
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

export function moveShape(shape: Shape, dx: number, dy: number): Shape {
  const shift = ([x, y]: Point): Point => [x + dx, y + dy];
  switch (shape.kind) {
    case 'stroke':
      return { ...shape, points: shape.points.map(([x, y, p]) => [x + dx, y + dy, p]) };
    case 'text':
    case 'callout':
      return { ...shape, at: shift(shape.at) };
    default:
      return { ...shape, start: shift(shape.start), end: shift(shape.end) };
  }
}

/** Constrains a shape drag with Shift: lines to 45° steps, rectangles and ellipses to squares. */
export function constrain(kind: ShapeTool, start: Point, end: Point): Point {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (kind === 'rect' || kind === 'ellipse' || kind === 'blur') {
    const size = Math.max(Math.abs(dx), Math.abs(dy));
    return [start[0] + Math.sign(dx || 1) * size, start[1] + Math.sign(dy || 1) * size];
  }
  const angle = Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) * (Math.PI / 4);
  const length = Math.hypot(dx, dy);
  return [start[0] + Math.cos(angle) * length, start[1] + Math.sin(angle) * length];
}

/** Makes shapes from the webview safe to keep (drops malformed ones, caps the amount). */
export function sanitizeShapes(value: unknown): Shape[] {
  if (!Array.isArray(value)) return [];
  const isPoint = (p: unknown): p is Point =>
    Array.isArray(p) &&
    p.length >= 2 &&
    p.every((n) => typeof n === 'number' && Number.isFinite(n));
  return value
    .filter((s): s is Shape => {
      if (typeof s !== 'object' || s === null) return false;
      const shape = s as Record<string, unknown>;
      const style = shape.style as Record<string, unknown> | undefined;
      if (
        typeof shape.id !== 'string' ||
        (shape.anchor !== undefined &&
          (typeof shape.anchor !== 'string' || shape.anchor.length > 1_000)) ||
        typeof style?.color !== 'string' ||
        typeof style.width !== 'number'
      ) {
        return false;
      }
      switch (shape.kind) {
        case 'stroke':
          return (
            Array.isArray(shape.points) &&
            shape.points.length > 0 &&
            shape.points.length < 20_000 &&
            shape.points.every(isPoint)
          );
        case 'text':
          return isPoint(shape.at) && typeof shape.text === 'string' && shape.text.length < 5_000;
        case 'callout':
          return isPoint(shape.at) && typeof shape.number === 'number';
        default:
          return (
            (SHAPE_TOOLS as readonly unknown[]).includes(shape.kind) &&
            isPoint(shape.start) &&
            isPoint(shape.end)
          );
      }
    })
    .slice(0, 2_000);
}
