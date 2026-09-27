import type { InspectHover, InspectPurpose, Rect } from '@shared/protocol';
import type { ViewportMapper } from './Viewport';

interface InspectOverlayProps {
  mapper: ViewportMapper;
  purpose: InspectPurpose;
  hover?: InspectHover;
  /** Multi-selection (Shift+click), in document CSS pixels. */
  selection: Rect[];
}

const CARD_WIDTH = 300;

/** Element picker overlay: the details card next to the hovered element and selection badges. */
export function InspectOverlay({ mapper, purpose, hover, selection }: InspectOverlayProps) {
  const card = hover ? cardPosition(mapper, hover.rect) : undefined;
  return (
    <>
      <div
        className="inspect-hint"
        style={{ left: mapper.bounds.left + 8, top: mapper.bounds.top + 8 }}
      >
        {purpose === 'screenshot'
          ? 'Click an element to capture it · Esc to cancel'
          : 'Click: copy details · Ctrl+click: send to chat · Shift+click: add to selection · Alt+click: with screenshot · ↑↓ parent/child · Enter: copy selection · Esc: exit'}
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
      {hover && card && (
        <div
          className="inspect-card"
          style={{ left: card.x, top: card.y, width: CARD_WIDTH }}
          role="status"
        >
          <div className="inspect-card-title">
            <span className="inspect-tag">{hover.label}</span>
            <span className="muted">
              {Math.round(hover.rect.width)} × {Math.round(hover.rect.height)}
            </span>
          </div>
          {hover.role && (
            <div className="inspect-row">
              <span className="muted">Role</span> {hover.role}
              {hover.name ? ` "${hover.name.slice(0, 60)}"` : ''}
            </div>
          )}
          {hover.component && (
            <div className="inspect-row">
              <span className="muted">Component</span> &lt;{hover.component}&gt;
            </div>
          )}
          {Object.entries(hover.styles).map(([name, value]) => (
            <div key={name} className="inspect-row">
              <span className="muted">{name}</span> {value}
            </div>
          ))}
          <div className="inspect-breadcrumb">{hover.ancestry.join(' › ')}</div>
        </div>
      )}
    </>
  );
}

/** Below the element if there is room, otherwise above; kept inside the page area. */
function cardPosition(mapper: ViewportMapper, rect: Rect): { x: number; y: number } {
  const topLeft = mapper.toLocal(rect.x, rect.y);
  const bottom = mapper.toLocal(rect.x, rect.y + rect.height).y;
  const { left, top, width, height } = mapper.bounds;
  const cardHeight = 150;
  const x = Math.max(left + 4, Math.min(topLeft.x, left + width - CARD_WIDTH - 4));
  const below = bottom + 8;
  const y =
    below + cardHeight < top + height ? below : Math.max(top + 4, topLeft.y - cardHeight - 8);
  return { x, y };
}
