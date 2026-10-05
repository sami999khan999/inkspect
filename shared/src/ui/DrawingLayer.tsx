import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  constrain,
  hitTest,
  intersect,
  moveShape,
  placeShapes,
  PEN_TOOLS,
  SHAPE_TOOLS,
  type Anchors,
  type DrawTool,
  type Section,
  type PenTool,
  type Point,
  type Shape,
  type ShapeStyle,
  type ShapeTool,
} from '../annotations';
import { drawShapes } from '../drawing/render';

/** Where the page is on screen: enough to map pointer positions to document coordinates. */
export interface DrawMapper {
  /** Screen pixels per page CSS pixel. */
  scale: number;
  /** The page's scroll position (document CSS pixels). */
  scroll: { x: number; y: number };
  /** Where the page image is, relative to the layer's positioned container. */
  bounds: { left: number; top: number; width: number; height: number };
}

interface DrawingLayerProps {
  mapper: DrawMapper;
  shapes: Shape[];
  /** Hidden drawings stay in the list but are not shown (and cannot be edited). */
  visible: boolean;
  /** Drawing mode is on; otherwise the drawings are only shown. */
  interactive: boolean;
  tool: DrawTool;
  style: ShapeStyle;
  /** Replaces the shapes; `commit` adds an undo step. */
  onChange: (shapes: Shape[], commit: boolean) => void;
  /**
   * Redactions blur the live page behind them (CSS backdrop blur) instead of pixelating a page
   * image: for hosts, like the browser extension, that draw over the real page and have no image
   * of it. Screenshots still pixelate.
   */
  liveRedactions?: boolean;
  /**
   * An image of the page under the layer, in the canvas's pixel grid (the viewport in device
   * pixels): redactions pixelate it, like over the VS Code browser's page canvas. With
   * `liveRedactions`, the backdrop blur stands in while there is none (say, after scrolling).
   */
  pixelSource?: CanvasImageSource;
  /**
   * The page's scrolling sections (browser extension): shapes drawn on one scroll with it. New
   * shapes are anchored to the section `anchorAt` finds at the point (document coordinates).
   * It may answer later (VS Code asks the page): the shape is then moved onto the section.
   */
  anchors?: Anchors;
  anchorAt?: (point: Point) => Section | undefined | Promise<Section | undefined>;
}

let nextId = 1;
const newId = () => `s${Date.now().toString(36)}${(nextId++).toString(36)}`;

/**
 * Canvas over the page where shapes are drawn. Shapes are stored in document coordinates, so
 * they stay attached to the page while it scrolls (the wheel still scrolls the page).
 */
export function DrawingLayer({
  mapper,
  shapes,
  visible,
  interactive,
  tool,
  style,
  onChange,
  liveRedactions,
  pixelSource,
  anchors: measured,
  anchorAt,
}: DrawingLayerProps) {
  const blurRedactions = liveRedactions && !pixelSource;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draft, setDraftState] = useState<Shape | null>(null);
  // Pointer events can arrive faster than React re-renders, so handlers read the draft from a ref.
  const draftRef = useRef<Shape | null>(null);
  const setDraft = (next: Shape | null) => {
    draftRef.current = next;
    setDraftState(next);
  };
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [text, setText] = useState<{
    id: string;
    at: Point;
    anchor?: string;
    local: Point;
    value: string;
  } | null>(null);
  const drag = useRef<{ start: Point; original: Shape } | null>(null);
  const erasing = useRef(false);
  const { bounds, scale, scroll } = mapper;
  // The section of the shape being drawn, until the host measures it with the others.
  const [fresh, setFresh] = useState<Section | null>(null);
  // For sections found after the shape was drawn.
  const shapesRef = useRef(shapes);
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);
  const anchors = useMemo(
    () =>
      measured && fresh && !(fresh.id in measured)
        ? { ...measured, [fresh.id]: fresh.at }
        : measured,
    [measured, fresh],
  );

  // Draw whenever shapes, the draft, the scroll position or the size change.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = Math.round(bounds.width * dpr);
    const height = Math.round(bounds.height * dpr);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);
    if (!visible) return;
    // The page image underneath has the same pixel grid, so redactions can sample it.
    const pageCanvas = canvas
      .closest('.viewport')
      ?.querySelector<HTMLCanvasElement>('.viewport-canvas');
    drawShapes(
      ctx,
      draft ? [...shapes, draft] : shapes,
      { scale: scale * dpr, offsetX: scroll.x, offsetY: scroll.y },
      {
        pixelSource: pixelSource ?? pageCanvas ?? undefined,
        skipRedactions: blurRedactions,
        selectedId: interactive ? selectedId : undefined,
        anchors,
      },
    );
  }, [
    anchors,
    blurRedactions,
    pixelSource,
    shapes,
    draft,
    visible,
    interactive,
    selectedId,
    bounds.width,
    bounds.height,
    scale,
    scroll.x,
    scroll.y,
  ]);

  // Delete removes the selected shape.
  useEffect(() => {
    if (!selectedId) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.key === 'Delete' || event.key === 'Backspace') && !isTyping(event)) {
        event.preventDefault();
        event.stopPropagation();
        onChange(
          shapes.filter((s) => s.id !== selectedId),
          true,
        );
        setSelectedId(undefined);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [selectedId, shapes, onChange]);

  /** Pointer position → document CSS pixels. */
  const toDocument = (event: React.PointerEvent<HTMLElement>): Point => {
    const rect = event.currentTarget.getBoundingClientRect();
    return [
      (event.clientX - rect.left) / scale + scroll.x,
      (event.clientY - rect.top) / scale + scroll.y,
    ];
  };

  /** A document point in the coordinates of shapes anchored to `anchor`. */
  const inSpace = (point: Point, anchor: string | undefined): Point => {
    const at = anchor ? anchors?.[anchor] : undefined;
    return at ? [point[0] + at.x, point[1] + at.y] : point;
  };
  const hits = (shape: Shape, point: Point) =>
    (!shape.anchor || !anchors || !!anchors[shape.anchor]) &&
    hitTest(shape, inSpace(point, shape.anchor), 6 / scale);

  const erase = (point: Point) => {
    const remaining = shapes.filter((s) => !hits(s, point));
    if (remaining.length !== shapes.length) onChange(remaining, false);
  };

  const commitText = () => {
    if (text?.value.trim()) {
      onChange(
        [
          ...shapes,
          { id: text.id, kind: 'text', at: text.at, text: text.value, style, anchor: text.anchor },
        ],
        true,
      );
    }
    setText(null);
  };

  /** Moves a shape drawn on the page onto the section found under it since. */
  const settle = (id: string, section: Section) => {
    setFresh(section);
    const lift = (shape: Shape): Shape =>
      shape.id === id && !shape.anchor
        ? { ...moveShape(shape, section.at.x, section.at.y), anchor: section.id }
        : shape;
    const draft = draftRef.current;
    if (draft?.id === id) setDraft(lift(draft));
    setText((t) =>
      t?.id === id && !t.anchor
        ? { ...t, at: [t.at[0] + section.at.x, t.at[1] + section.at.y], anchor: section.id }
        : t,
    );
    if (shapesRef.current.some((shape) => shape.id === id && !shape.anchor)) {
      onChange(shapesRef.current.map(lift), false);
    }
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || !visible) return;
    event.preventDefault();
    const point = toDocument(event);
    // New shapes belong to the scrolling section under the pointer, if any.
    const id = newId();
    const found = tool === 'eraser' || tool === 'select' ? undefined : anchorAt?.(point);
    const section = found instanceof Promise ? undefined : found;
    if (found instanceof Promise) void found.then((later) => later && settle(id, later));
    const anchor = section?.id;
    if (section) setFresh(section);
    const at = section ? ([point[0] + section.at.x, point[1] + section.at.y] as Point) : point;
    if (text) commitText();
    if (tool === 'text') {
      const rect = event.currentTarget.getBoundingClientRect();
      setText({
        id,
        at,
        anchor,
        local: [event.clientX - rect.left, event.clientY - rect.top],
        value: '',
      });
      return;
    }
    if (tool === 'callout') {
      const number = Math.max(0, ...shapes.map((s) => (s.kind === 'callout' ? s.number : 0))) + 1;
      onChange([...shapes, { id, kind: 'callout', at, number, style, anchor }], true);
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    if (tool === 'eraser') {
      erasing.current = true;
      // One undo step for the whole eraser drag.
      onChange(shapes, true);
      erase(point);
      return;
    }
    if (tool === 'select') {
      const hit = [...shapes].reverse().find((s) => hits(s, point));
      setSelectedId(hit?.id);
      if (hit) {
        drag.current = { start: point, original: hit };
        onChange(shapes, true);
      }
      return;
    }
    const pressure = event.pressure || 0.5;
    if ((PEN_TOOLS as readonly string[]).includes(tool)) {
      setDraft({
        id,
        kind: 'stroke',
        tool: tool as PenTool,
        points: [[...at, pressure]],
        style,
        anchor,
      });
    } else if ((SHAPE_TOOLS as readonly string[]).includes(tool)) {
      setDraft({ id, kind: tool as ShapeTool, start: at, end: at, style, anchor });
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    let point = toDocument(event);
    if (erasing.current) {
      erase(point);
      return;
    }
    if (drag.current) {
      const { start, original } = drag.current;
      const moved = moveShape(original, point[0] - start[0], point[1] - start[1]);
      onChange(
        shapes.map((s) => (s.id === original.id ? moved : s)),
        false,
      );
      return;
    }
    const draft = draftRef.current;
    if (!draft) return;
    point = inSpace(point, draft.anchor);
    if (draft.kind === 'stroke') {
      setDraft({ ...draft, points: [...draft.points, [...point, event.pressure || 0.5]] });
    } else if (draft.kind !== 'text' && draft.kind !== 'callout') {
      setDraft({
        ...draft,
        end: event.shiftKey ? constrain(draft.kind, draft.start, point) : point,
      });
    }
  };

  const onPointerUp = () => {
    erasing.current = false;
    drag.current = null;
    const draft = draftRef.current;
    if (!draft) return;
    const tiny =
      draft.kind !== 'stroke' &&
      draft.kind !== 'text' &&
      draft.kind !== 'callout' &&
      Math.hypot(draft.end[0] - draft.start[0], draft.end[1] - draft.start[1]) * scale < 3;
    if (!tiny) onChange([...shapes, draft], true);
    setDraft(null);
  };

  const cursor =
    tool === 'select'
      ? 'default'
      : tool === 'text'
        ? 'text'
        : tool === 'eraser'
          ? 'cell'
          : 'crosshair';

  return (
    <div
      className="drawing-layer"
      style={{ ...bounds, pointerEvents: visible && interactive ? 'auto' : 'none' }}
    >
      {blurRedactions &&
        visible &&
        placeShapes(draft ? [...shapes, draft] : shapes, anchors).map((shape) => {
          if (shape.kind !== 'blur') return null;
          const [a, b] = [shape.start, shape.end];
          const box = {
            x: Math.min(a[0], b[0]),
            y: Math.min(a[1], b[1]),
            width: Math.abs(b[0] - a[0]),
            height: Math.abs(b[1] - a[1]),
          };
          // Inside its scrolling section only.
          const clip = shape.anchor && anchors?.[shape.anchor]?.clip;
          const shown = clip ? intersect(box, clip) : box;
          if (!shown) return null;
          return (
            <div
              key={shape.id}
              className="drawing-redaction"
              style={{
                left: (shown.x - scroll.x) * scale,
                top: (shown.y - scroll.y) * scale,
                width: shown.width * scale,
                height: shown.height * scale,
              }}
            />
          );
        })}
      <canvas
        ref={canvasRef}
        style={{ width: bounds.width, height: bounds.height, cursor }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onContextMenu={(event) => event.preventDefault()}
      />
      {text && (
        <textarea
          className="drawing-text-input"
          autoFocus
          value={text.value}
          placeholder="Type, then Enter"
          style={{
            left: text.local[0],
            top: text.local[1],
            color: style.color,
            fontSize: (12 + style.width * 2) * scale,
          }}
          onChange={(event) => setText({ ...text, value: event.target.value })}
          onBlur={commitText}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              commitText();
            } else if (event.key === 'Escape') {
              setText(null);
            }
          }}
        />
      )}
    </div>
  );
}

function isTyping(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  return (
    !!target &&
    (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
  );
}
