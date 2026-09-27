import { useEffect, useRef, useState } from 'react';
import type { Rect } from '@shared/protocol';
import type { ViewportMapper } from './Viewport';

interface RegionSelectProps {
  mapper: ViewportMapper;
  onCapture: (rect: Rect) => void;
  onCancel: () => void;
}

/**
 * Drag a rectangle over the page to capture it. Drag again to redo; Enter or the Capture button
 * takes the screenshot, Esc cancels. The rectangle is reported in viewport CSS pixels.
 */
export function RegionSelect({ mapper, onCapture, onCancel }: RegionSelectProps) {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [end, setEnd] = useState<{ x: number; y: number } | null>(null);
  const dragging = useRef(false);

  const local =
    start && end
      ? {
          x: Math.min(start.x, end.x),
          y: Math.min(start.y, end.y),
          width: Math.abs(end.x - start.x),
          height: Math.abs(end.y - start.y),
        }
      : undefined;
  const pageRect = (): Rect | undefined => {
    if (!local || local.width < 4 || local.height < 4) return undefined;
    const topLeft = mapper.toPage(local.x, local.y);
    return {
      x: topLeft.x,
      y: topLeft.y,
      width: local.width / mapper.scale,
      height: local.height / mapper.scale,
    };
  };
  const rect = pageRect();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onCancel();
      } else if (event.key === 'Enter' && rect) {
        event.preventDefault();
        event.stopPropagation();
        onCapture(rect);
      }
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [rect, onCapture, onCancel]);

  /** Pointer position → position in the viewport element (this overlay sits at `bounds`). */
  const toLocal = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: event.clientX - rect.left + mapper.bounds.left,
      y: event.clientY - rect.top + mapper.bounds.top,
    };
  };
  const clamp = (point: { x: number; y: number }) => ({
    x: Math.max(mapper.bounds.left, Math.min(point.x, mapper.bounds.left + mapper.bounds.width)),
    y: Math.max(mapper.bounds.top, Math.min(point.y, mapper.bounds.top + mapper.bounds.height)),
  });

  return (
    <div
      className="region-select"
      style={mapper.bounds}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragging.current = true;
        const point = clamp(toLocal(event));
        setStart(point);
        setEnd(point);
      }}
      onPointerMove={(event) => {
        if (dragging.current) setEnd(clamp(toLocal(event)));
      }}
      onPointerUp={() => {
        dragging.current = false;
      }}
      onContextMenu={(event) => {
        event.preventDefault();
        onCancel();
      }}
    >
      {!local && <div className="region-hint">Drag to select an area · Esc to cancel</div>}
      {local && (
        <div
          className="region-box"
          style={{
            left: local.x - mapper.bounds.left,
            top: local.y - mapper.bounds.top,
            width: local.width,
            height: local.height,
          }}
        >
          {rect && (
            <>
              <span className="region-size">
                {Math.round(rect.width)} × {Math.round(rect.height)}
              </span>
              <div className="region-actions" onPointerDown={(event) => event.stopPropagation()}>
                <button
                  type="button"
                  className="button primary small"
                  onClick={() => onCapture(rect)}
                >
                  Capture
                </button>
                <button type="button" className="button secondary small" onClick={onCancel}>
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
