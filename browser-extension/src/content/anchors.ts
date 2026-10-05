// Scrolling sections of the page that drawings are anchored to (shared `sections`), and the
// wheel while drawing.

import type { Anchor, Anchors, Shape } from '@inkspect/shared/annotations';
import { measureSections, sectionAt } from '@inkspect/shared/sections';

/** The section to anchor a drawing at this point (viewport coordinates) to, if any. */
export function anchorAt(
  x: number,
  y: number,
  host: Element,
): { id: string; at: Anchor } | undefined {
  const id = sectionAt(x, y, host);
  const at = id ? measureSections([id])[id] : undefined;
  return id && at ? { id, at } : undefined;
}

/** Where the sections the shapes are anchored to are now; sections no longer on the page are left out. */
export function measureAnchors(shapes: Shape[]): Anchors {
  const ids = [...new Set(shapes.flatMap((shape) => (shape.anchor ? [shape.anchor] : [])))];
  return ids.length ? measureSections(ids) : {};
}

function scrolls(el: Element): boolean {
  if (el === document.scrollingElement || el === document.body || el === document.documentElement) {
    return false;
  }
  const style = getComputedStyle(el);
  const can = (overflow: string) => /auto|scroll|overlay/.test(overflow);
  return (
    (can(style.overflowY) && el.scrollHeight > el.clientHeight + 1) ||
    (can(style.overflowX) && el.scrollWidth > el.clientWidth + 1)
  );
}

/**
 * Scrolls what is under the pointer by a wheel event: while drawing, our layer covers the page,
 * so the wheel would otherwise only scroll the window.
 */
export function scrollUnder(event: WheelEvent, host: Element): void {
  const unit =
    event.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? 16
      : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? innerHeight
        : 1;
  let dx = event.deltaX * unit;
  let dy = event.deltaY * unit;
  if (event.shiftKey && !dx) [dx, dy] = [dy, 0];
  let el =
    document
      .elementsFromPoint(event.clientX, event.clientY)
      .find((under) => under !== host && !host.contains(under)) ?? null;
  for (; el; el = el.parentElement) {
    if (!scrolls(el)) continue;
    const moves =
      (dy > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 1) ||
      (dy < 0 && el.scrollTop > 0) ||
      (dx > 0 && el.scrollLeft + el.clientWidth < el.scrollWidth - 1) ||
      (dx < 0 && el.scrollLeft > 0);
    if (moves) {
      el.scrollBy({ left: dx, top: dy, behavior: 'instant' });
      return;
    }
  }
  window.scrollBy({ left: dx, top: dy, behavior: 'instant' });
}
