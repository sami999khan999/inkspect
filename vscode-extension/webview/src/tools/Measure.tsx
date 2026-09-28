import { useEffect, useRef, useState } from 'react';
import type { Rect } from '@shared/protocol';
import { formatMeasurements, gaps, type MeasureBox } from '@shared/tools';
import type { ViewportMapper } from '../components/Viewport';
import type { ShortcutHandlers } from '../shortcuts';
import { onHostMessage, postToHost } from '../vscode';
import { ModeHint } from './ModeHint';

const round = (n: number) => Math.round(n * 10) / 10;

/**
 * Measure mode: hovering shows an element's boxes (margin, border, padding, content) and size;
 * clicking pins it, and hovering another element shows the distances between the two.
 */
export function Measure({
  mapper,
  tabId,
  onHandlers,
}: {
  mapper: ViewportMapper;
  tabId: string;
  onHandlers: (handlers: ShortcutHandlers) => void;
}) {
  const [hovered, setHovered] = useState<MeasureBox | null>(null);
  const [pinned, setPinned] = useState<MeasureBox | null>(null);
  const [grid, setGrid] = useState(false);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const pending = useRef<{ id: string; x: number; y: number } | null>(null);
  const frame = useRef(0);

  useEffect(
    () =>
      onHostMessage((message) => {
        if (message.type === 'measureResult' && message.requestId === pending.current?.id) {
          pending.current = null;
          setHovered(message.box ?? null);
        }
      }),
    [],
  );

  useEffect(() => {
    onHandlers({
      'measure.grid': () => setGrid((on) => !on),
      'measure.clear': () => setPinned(null),
      'measure.copy': () => {
        const box = pinned ?? hovered;
        if (!box) return;
        postToHost({
          type: 'copyText',
          text: formatMeasurements(
            box,
            pinned && hovered !== pinned ? (hovered ?? undefined) : undefined,
          ),
          toast: 'Measurements copied',
          kind: 'measure',
          label: 'Measurements',
        });
      },
    });
  });

  const request = (x: number, y: number) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const id = `${Date.now()}-${Math.random()}`;
      pending.current = { id, x, y };
      postToHost({ type: 'measure', tabId, requestId: id, x, y });
    });
  };

  /** Viewport CSS pixels → position inside this layer (which sits at `bounds`). */
  const place = (r: Rect) => {
    const topLeft = mapper.toLocal(r.x, r.y);
    return {
      left: topLeft.x - mapper.bounds.left,
      top: topLeft.y - mapper.bounds.top,
      width: r.width * mapper.scale,
      height: r.height * mapper.scale,
    };
  };
  const point = (x: number, y: number) => {
    const p = mapper.toLocal(x, y);
    return { x: p.x - mapper.bounds.left, y: p.y - mapper.bounds.top };
  };

  const distances =
    pinned && hovered && hovered.label !== undefined ? gaps(pinned.border, hovered.border) : [];
  const box = hovered;
  return (
    <div
      className={`measure-layer${grid ? ' grid' : ''}`}
      style={{ ...mapper.bounds, '--grid': `${10 * mapper.scale}px` } as React.CSSProperties}
      onPointerMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const local = { x: event.clientX - rect.left, y: event.clientY - rect.top };
        setPointer(local);
        const page = mapper.toPage(local.x + mapper.bounds.left, local.y + mapper.bounds.top);
        request(page.x, page.y);
      }}
      onPointerLeave={() => setPointer(null)}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        setPinned(hovered);
      }}
    >
      {grid && pointer && (
        <>
          <div className="measure-crosshair x" style={{ top: pointer.y }} />
          <div className="measure-crosshair y" style={{ left: pointer.x }} />
          <span className="measure-coords" style={{ left: pointer.x + 10, top: pointer.y + 10 }}>
            {Math.round(
              mapper.toPage(pointer.x + mapper.bounds.left, pointer.y + mapper.bounds.top).x,
            )}
            ,{' '}
            {Math.round(
              mapper.toPage(pointer.x + mapper.bounds.left, pointer.y + mapper.bounds.top).y,
            )}
          </span>
        </>
      )}
      {box && (
        <>
          <div className="measure-box margin" style={place(box.margin)} />
          <div className="measure-box border" style={place(box.border)} />
          <div className="measure-box padding" style={place(box.padding)} />
          <div className="measure-box content" style={place(box.content)} />
          <div
            className="measure-label"
            style={{ left: place(box.border).left, top: Math.max(0, place(box.border).top - 24) }}
          >
            <strong>{box.label}</strong> {round(box.border.width)} × {round(box.border.height)}
          </div>
        </>
      )}
      {pinned && <div className="measure-box pinned" style={place(pinned.border)} />}
      {distances.map((g, index) => {
        const a = point(g.x1, g.y1);
        const b = point(g.x2, g.y2);
        return (
          <div key={index}>
            <div
              className={`measure-gap ${g.axis}`}
              style={
                g.axis === 'x'
                  ? { left: Math.min(a.x, b.x), top: a.y, width: Math.abs(b.x - a.x) }
                  : { left: a.x, top: Math.min(a.y, b.y), height: Math.abs(b.y - a.y) }
              }
            />
            <span
              className="measure-gap-label"
              style={{ left: (a.x + b.x) / 2, top: (a.y + b.y) / 2 }}
            >
              {g.length}
            </span>
          </div>
        );
      })}
      <ModeHint
        scope="measure"
        ids={['measure.grid', 'measure.copy', 'measure.clear', 'measure.exit']}
      >
        {pinned
          ? `Pinned ${pinned.label}: hover another element for distances`
          : 'Click an element to pin it'}
      </ModeHint>
    </div>
  );
}
