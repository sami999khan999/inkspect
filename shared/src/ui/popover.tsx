import { useEffect, useLayoutEffect, type RefObject } from 'react';

/**
 * Places a `position: fixed` popup next to its anchor: below it (or above when there is no room),
 * aligned to its start (or end), and kept inside the window. Recomputed while open.
 */
export function useAnchoredPosition(
  anchor: RefObject<HTMLElement | null>,
  popup: RefObject<HTMLElement | null>,
  open: boolean,
  options: { align?: 'start' | 'end'; gap?: number; matchWidth?: boolean } = {},
): void {
  const { align = 'start', gap = 4, matchWidth = false } = options;
  useLayoutEffect(() => {
    if (!open) return;
    const place = () => {
      if (anchor.current && popup.current) {
        placePopup(anchor.current, popup.current, { align, gap, matchWidth });
      }
    };
    place();
    const observer = new ResizeObserver(place);
    if (popup.current) observer.observe(popup.current);
    return () => observer.disconnect();
  }, [anchor, popup, open, align, gap, matchWidth]);
}

/** Positions `element` (fixed) next to `anchor`; see useAnchoredPosition. */
function placePopup(
  anchor: HTMLElement,
  element: HTMLElement,
  { align, gap, matchWidth }: { align: 'start' | 'end'; gap: number; matchWidth: boolean },
): void {
  const a = anchor.getBoundingClientRect();
  if (matchWidth) element.style.minWidth = `${a.width}px`;
  const p = element.getBoundingClientRect();
  const margin = 4;
  const below = a.bottom + gap;
  const fitsBelow = below + p.height <= innerHeight - margin;
  const above = a.top - gap - p.height;
  const top = fitsBelow || above < margin ? below : above;
  const left = align === 'end' ? a.right - p.width : a.left;
  element.style.top = `${Math.max(margin, Math.min(top, innerHeight - p.height - margin))}px`;
  element.style.left = `${Math.max(margin, Math.min(left, innerWidth - p.width - margin))}px`;
  element.dataset.side = top === below ? 'bottom' : 'top';
}

/**
 * Closes a popup on a pointer press outside it and its anchor, on Escape (focus returns to the
 * anchor), when the window loses focus or resizes, and when something else scrolls.
 * Uses `composedPath()`, so it also works inside shadow roots.
 */
export function useDismiss(
  refs: RefObject<HTMLElement | null>[],
  open: boolean,
  onClose: (reason: 'outside' | 'escape' | 'window') => void,
): void {
  useEffect(() => {
    if (!open) return;
    const inside = (event: Event) =>
      refs.some((ref) => ref.current && event.composedPath().includes(ref.current));
    const onPointerDown = (event: PointerEvent) => {
      if (!inside(event)) onClose('outside');
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose('escape');
    };
    const onScroll = (event: Event) => {
      if (!inside(event)) onClose('window');
    };
    const onWindow = () => onClose('window');
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('blur', onWindow);
    window.addEventListener('resize', onWindow);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('blur', onWindow);
      window.removeEventListener('resize', onWindow);
    };
    // `refs` is a fresh array each render; the refs inside it are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);
}

/** Joins class names, skipping falsy ones. */
export function cx(...names: (string | false | null | undefined)[]): string {
  return names.filter(Boolean).join(' ');
}

/** Where to portal a popup for `element`: its shadow root when it lives in one, else the body. */
export function portalTarget(element: Element | null): Element | DocumentFragment {
  const root = element?.getRootNode();
  return root instanceof ShadowRoot ? root : document.body;
}

/**
 * Whether an event happened inside a portaled popup (a select list, a color picker). Popovers
 * that close on outside clicks use this so choosing from their own selects keeps them open.
 */
export function isInPopup(event: Event): boolean {
  return event
    .composedPath()
    .some((target) => target instanceof HTMLElement && target.dataset.inkPopup !== undefined);
}
