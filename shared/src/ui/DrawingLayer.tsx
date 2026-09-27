import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  constrain,
  hitTest,
  moveShape,
  PEN_TOOLS,
  SHAPE_TOOLS,
  type DrawTool,
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
}: DrawingLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [draft, setDraftState] = useState<Shape | null>(null);
  // Pointer events can arrive faster than React re-renders, so handlers read the draft from a ref.
  const draftRef = useRef<Shape | null>(null);
  const setDraft = (next: Shape | null) => {
    draftRef.current = next;
    setDraftState(next);
  };
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [text, setText] = useState<{ at: Point; local: Point; value: string } | null>(null);
  const drag = useRef<{ start: Point; original: Shape } | null>(null);
  const erasing = useRef(false);
  const { bounds, scale, scroll } = mapper;

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
      { pixelSource: pageCanvas ?? undefined, selectedId: interactive ? selectedId : undefined },
    );
  }, [
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

  const erase = (point: Point) => {
    const remaining = shapes.filter((s) => !hitTest(s, point, 6 / scale));
    if (remaining.length !== shapes.length) onChange(remaining, false);
  };

  const commitText = () => {
    if (text?.value.trim()) {
      onChange(
        [...shapes, { id: newId(), kind: 'text', at: text.at, text: text.value, style }],
        true,
      );
    }
    setText(null);
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button !== 0 || !visible) return;
    event.preventDefault();
    const point = toDocument(event);
    if (text) commitText();
    if (tool === 'text') {
      const rect = event.currentTarget.getBoundingClientRect();
      setText({
        at: point,
        local: [event.clientX - rect.left, event.clientY - rect.top],
        value: '',
      });
      return;
    }
    if (tool === 'callout') {
      const number = Math.max(0, ...shapes.map((s) => (s.kind === 'callout' ? s.number : 0))) + 1;
      onChange([...shapes, { id: newId(), kind: 'callout', at: point, number, style }], true);
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
      const hit = [...shapes].reverse().find((s) => hitTest(s, point, 6 / scale));
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
        id: newId(),
        kind: 'stroke',
        tool: tool as PenTool,
        points: [[...point, pressure]],
        style,
      });
    } else if ((SHAPE_TOOLS as readonly string[]).includes(tool)) {
      setDraft({ id: newId(), kind: tool as ShapeTool, start: point, end: point, style });
    }
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const point = toDocument(event);
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
