import type { InspectPurpose, Rect } from '@shared/protocol';
import type { ViewportMapper } from './Viewport';

interface InspectOverlayProps {
  mapper: ViewportMapper;
  purpose: InspectPurpose;
  /** Multi-selection (Shift+click), in document CSS pixels. */
  selection: Rect[];
}

/**
 * Element picker overlay: a hint and the numbered multi-selection boxes. The highlight and the
 * tooltip under the pointer are drawn by Chrome itself (its inspect mode), like in DevTools.
 */
export function InspectOverlay({ mapper, purpose, selection }: InspectOverlayProps) {
  return (
    <>
      <div
        className="inspect-hint"
        style={{ left: mapper.bounds.left + 8, top: mapper.bounds.top + 8 }}
      >
        {purpose === 'screenshot'
          ? 'Click an element to capture it · Esc to cancel'
          : 'Click: copy details · Ctrl+click: send to chat · Shift+click: add to selection · Alt+click: with screenshot · ↑↓ parent/child, Enter: copy · Esc: exit'}
      </div>
      {selection.map((rect, index) => {
        const point = mapper.toLocal(rect.x - mapper.scroll.x, rect.y - mapper.scroll.y);
        return (
          <div
            key={index}
            className="selection-box"
            style={{
              left: point.x,
              top: point.y,
              width: rect.width * mapper.scale,
              height: rect.height * mapper.scale,
            }}
          >
            <span className="selection-badge">{index + 1}</span>
          </div>
        );
      })}
    </>
  );
}
