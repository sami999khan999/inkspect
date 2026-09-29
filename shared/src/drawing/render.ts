import { getStroke } from 'perfect-freehand';
import {
  arrowHeadSize,
  calloutRadius,
  shapeBounds,
  textSize,
  type PenTool,
  type Point,
  type Shape,
  type ShapeStyle,
} from '../annotations';

/** Maps document CSS pixels to canvas pixels: `(doc - offset) * scale`. */
export interface Transform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface RenderOptions {
  /** Pixels under redaction boxes are sampled from this image (in the same pixel space). */
  pixelSource?: CanvasImageSource;
  /** Redactions are drawn by someone else (the browser extension's live backdrop blur). */
  skipRedactions?: boolean;
  selectedId?: string;
}

const PEN_OPTIONS: Record<
  PenTool,
  { size: number; thinning: number; taper?: boolean; opacity?: number }
> = {
  pen: { size: 1.4, thinning: 0.5 },
  pencil: { size: 0.7, thinning: 0.25 },
  marker: { size: 2.5, thinning: 0 },
  brush: { size: 2.2, thinning: 0.75, taper: true },
  highlighter: { size: 4, thinning: 0, opacity: 0.35 },
  neon: { size: 1.4, thinning: 0.3 },
};

export function drawShapes(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  shapes: Shape[],
  t: Transform,
  options: RenderOptions = {},
): void {
  const map = ([x, y]: Point | [number, number, number]): Point => [
    (x - t.offsetX) * t.scale,
    (y - t.offsetY) * t.scale,
  ];
  // Redactions first, so drawings on top of them stay visible.
  for (const shape of shapes) {
    if (shape.kind === 'blur' && !options.skipRedactions) {
      pixelate(ctx, shape, map, options.pixelSource);
    }
  }
  for (const shape of shapes) {
    if (shape.kind === 'blur') continue;
    ctx.save();
    applyStyle(ctx, shape.style, t.scale);
    switch (shape.kind) {
      case 'stroke':
        drawStroke(ctx, shape.tool, shape.points, shape.style, t.scale, map);
        break;
      case 'line':
      case 'arrow':
      case 'doubleArrow': {
        const [a, b] = [map(shape.start), map(shape.end)];
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
        ctx.setLineDash([]);
        const head = arrowHeadSize(shape.style) * t.scale;
        if (shape.kind !== 'line') arrowHead(ctx, a, b, head);
        if (shape.kind === 'doubleArrow') arrowHead(ctx, b, a, head);
        break;
      }
      case 'rect': {
        const [a, b] = [map(shape.start), map(shape.end)];
        const [x, y, w, h] = [
          Math.min(a[0], b[0]),
          Math.min(a[1], b[1]),
          Math.abs(b[0] - a[0]),
          Math.abs(b[1] - a[1]),
        ];
        if (shape.style.fill) fillTranslucent(ctx, () => ctx.fillRect(x, y, w, h));
        ctx.strokeRect(x, y, w, h);
        break;
      }
      case 'ellipse': {
        const [a, b] = [map(shape.start), map(shape.end)];
        ctx.beginPath();
        ctx.ellipse(
          (a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2,
          Math.abs(b[0] - a[0]) / 2,
          Math.abs(b[1] - a[1]) / 2,
          0,
          0,
          Math.PI * 2,
        );
        if (shape.style.fill) fillTranslucent(ctx, () => ctx.fill());
        ctx.stroke();
        break;
      }
      case 'text': {
        const size = textSize(shape.style) * t.scale;
        const [x, y] = map(shape.at);
        ctx.font = `600 ${size}px system-ui, sans-serif`;
        ctx.textBaseline = 'top';
        ctx.setLineDash([]);
        // A contrasting outline keeps text readable on any background.
        ctx.lineWidth = Math.max(2, size / 6);
        ctx.strokeStyle = isLight(shape.style.color)
          ? 'rgba(0,0,0,0.75)'
          : 'rgba(255,255,255,0.85)';
        shape.text.split('\n').forEach((line, index) => {
          ctx.strokeText(line, x, y + index * size * 1.25);
          ctx.fillText(line, x, y + index * size * 1.25);
        });
        break;
      }
      case 'callout': {
        const r = calloutRadius(shape.style) * t.scale;
        const [x, y] = map(shape.at);
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.lineWidth = Math.max(1.5, r / 8);
        ctx.strokeStyle = 'rgba(255,255,255,0.9)';
        ctx.stroke();
        ctx.fillStyle = isLight(shape.style.color) ? '#000' : '#fff';
        ctx.font = `700 ${r * 1.1}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(shape.number), x, y + r * 0.05);
        break;
      }
    }
    ctx.restore();
    if (shape.id === options.selectedId) drawSelection(ctx, shape, t);
  }
}

function applyStyle(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  style: ShapeStyle,
  scale: number,
): void {
  ctx.globalAlpha = style.opacity;
  ctx.strokeStyle = style.color;
  ctx.fillStyle = style.color;
  ctx.lineWidth = style.width * scale;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const w = style.width * scale;
  ctx.setLineDash(
    style.dash === 'dashed' ? [w * 3, w * 2] : style.dash === 'dotted' ? [0.1, w * 2] : [],
  );
}

function drawStroke(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  tool: PenTool,
  points: [number, number, number][],
  style: ShapeStyle,
  scale: number,
  map: (p: [number, number, number]) => Point,
): void {
  const preset = PEN_OPTIONS[tool];
  if (preset.opacity !== undefined) {
    ctx.globalAlpha = style.opacity * preset.opacity;
    ctx.globalCompositeOperation = 'multiply';
  }
  if (tool === 'neon') {
    ctx.shadowColor = style.color;
    ctx.shadowBlur = 12 * scale;
  }
  const mapped = points.map((p) => [...map(p), p[2]] as [number, number, number]);
  if (style.dash !== 'solid' || mapped.length < 2) {
    // Dashed and dotted pens use a plain smoothed line (outlines cannot be dashed).
    ctx.lineWidth = style.width * scale * preset.size;
    ctx.beginPath();
    mapped.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    if (mapped.length === 1) ctx.lineTo(mapped[0]![0] + 0.1, mapped[0]![1]);
    ctx.stroke();
    return;
  }
  const outline = getStroke(mapped, {
    size: style.width * scale * preset.size,
    thinning: preset.thinning,
    smoothing: 0.5,
    streamline: 0.4,
    simulatePressure: mapped.every(([, , p]) => p === 0.5),
    start: { taper: preset.taper ? style.width * scale * 6 : 0, cap: true },
    end: { taper: preset.taper ? style.width * scale * 6 : 0, cap: true },
  });
  if (!outline.length) return;
  ctx.beginPath();
  ctx.moveTo(outline[0]![0]!, outline[0]![1]!);
  for (let i = 1; i < outline.length; i++) {
    const [x0, y0] = outline[i - 1]!;
    const [x1, y1] = outline[i]!;
    ctx.quadraticCurveTo(x0!, y0!, (x0! + x1!) / 2, (y0! + y1!) / 2);
  }
  ctx.closePath();
  ctx.fill();
  if (tool === 'neon') {
    // A bright core over the glow.
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 0.8;
    ctx.lineWidth = Math.max(1, style.width * scale * 0.3);
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    mapped.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  }
}

function arrowHead(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  from: Point,
  to: Point,
  size: number,
): void {
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  ctx.beginPath();
  ctx.moveTo(to[0], to[1]);
  ctx.lineTo(
    to[0] - size * Math.cos(angle - Math.PI / 7),
    to[1] - size * Math.sin(angle - Math.PI / 7),
  );
  ctx.lineTo(
    to[0] - size * Math.cos(angle + Math.PI / 7),
    to[1] - size * Math.sin(angle + Math.PI / 7),
  );
  ctx.closePath();
  ctx.fill();
}

function fillTranslucent(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  fill: () => void,
): void {
  const alpha = ctx.globalAlpha;
  ctx.globalAlpha = alpha * 0.25;
  fill();
  ctx.globalAlpha = alpha;
}

/** Redaction: the area is shown as large blocks of its average colours. */
function pixelate(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  shape: { start: Point; end: Point },
  map: (p: Point) => Point,
  source: CanvasImageSource | undefined,
): void {
  const [a, b] = [map(shape.start), map(shape.end)];
  const x = Math.round(Math.min(a[0], b[0]));
  const y = Math.round(Math.min(a[1], b[1]));
  const w = Math.round(Math.abs(b[0] - a[0]));
  const h = Math.round(Math.abs(b[1] - a[1]));
  if (w < 2 || h < 2) return;
  ctx.save();
  if (source) {
    // Coarse enough that text under it can't be read, even in a large box.
    const block = Math.max(10, Math.round(Math.min(w, h) / 5));
    const small = new OffscreenCanvas(
      Math.max(1, Math.ceil(w / block)),
      Math.max(1, Math.ceil(h / block)),
    );
    const smallCtx = small.getContext('2d')!;
    smallCtx.drawImage(source, x, y, w, h, 0, 0, small.width, small.height);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(small, 0, 0, small.width, small.height, x, y, w, h);
  } else {
    ctx.fillStyle = 'rgba(128,128,128,0.9)';
    ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

function drawSelection(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  shape: Shape,
  t: Transform,
): void {
  const b = shapeBounds(shape);
  ctx.save();
  ctx.setLineDash([4, 4]);
  ctx.lineWidth = 1;
  ctx.strokeStyle = '#0a84ff';
  ctx.strokeRect(
    (b.x - t.offsetX) * t.scale - 3,
    (b.y - t.offsetY) * t.scale - 3,
    b.width * t.scale + 6,
    b.height * t.scale + 6,
  );
  ctx.restore();
}

function isLight(color: string): boolean {
  const hex = color.replace('#', '');
  if (hex.length !== 6) return false;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return r! * 0.299 + g! * 0.587 + b! * 0.114 > 170;
}
