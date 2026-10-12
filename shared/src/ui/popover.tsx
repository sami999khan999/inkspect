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

/**
 * The visible part of the window: `innerWidth` and `100vw` count the page's scrollbars, so a popup
 * placed by them can end up under one (a narrow side panel that scrolls).
 */
export function viewportSize(): { width: number; height: number } {
  const root = document.documentElement;
  return { width: root.clientWidth || innerWidth, height: root.clientHeight || innerHeight };
}

/** Positions `element` (fixed) next to `anchor`; see useAnchoredPosition. */
function placePopup(
  anchor: HTMLElement,
  element: HTMLElement,
  { align, gap, matchWidth }: { align: 'start' | 'end'; gap: number; matchWidth: boolean },
): void {
  const a = anchor.getBoundingClientRect();
  if (matchWidth) element.style.minWidth = `${a.width}px`;
  const view = viewportSize();
  const margin = 4;
  element.style.maxWidth = `${view.width - 2 * margin}px`;
  const p = element.getBoundingClientRect();
  const below = a.bottom + gap;
  const fitsBelow = below + p.height <= view.height - margin;
  const above = a.top - gap - p.height;
  const top = fitsBelow || above < margin ? below : above;
  const left = align === 'end' ? a.right - p.width : a.left;
  element.style.top = `${Math.max(margin, Math.min(top, view.height - p.height - margin))}px`;
  element.style.left = `${Math.max(margin, Math.min(left, view.width - p.width - margin))}px`;
  element.dataset.side = top === below ? 'bottom' : 'top';
}

/**
 * Calls `onOutside` for `type` events (capture phase) that happen outside all of `elements`.
 *
 * Works inside shadow roots, open or closed. A window listener can't judge events inside a
 * closed root: their `composedPath()` stops at the host, so every click in the root would look
 * like one outside. Those events are judged by a listener on the root itself, which sees the
 * whole path; the window listener only handles events outside the root.
 */
export function listenOutside<K extends keyof WindowEventMap>(
  elements: () => (Element | null | undefined)[],
  type: K,
  onOutside: (event: WindowEventMap[K]) => void,
): () => void {
  const root = elements().find(Boolean)?.getRootNode();
  const shadow = root instanceof ShadowRoot ? root : undefined;
  const inside = (event: Event) => elements().some((el) => el && event.composedPath().includes(el));
  const onWindow = (event: WindowEventMap[K]) => {
    if (shadow && event.composedPath().includes(shadow.host)) return;
    if (!inside(event)) onOutside(event);
  };
  const onRoot = (event: Event) => {
    if (!inside(event)) onOutside(event as WindowEventMap[K]);
  };
  window.addEventListener(type, onWindow, true);
  shadow?.addEventListener(type, onRoot, true);
  return () => {
    window.removeEventListener(type, onWindow, true);
    shadow?.removeEventListener(type, onRoot, true);
  };
}

// The last pointer press, so a popup can tell which button opened it (its "opener"): pressing
// that button again must close the popup, not close it and reopen it on the click that follows.
let lastPress: { element: Element; at: number } | undefined;
const trackPress = (event: Event) => {
  const target = event.composedPath()[0];
  // Only a primary press opens a popup from a button (a right press opens a context menu, and
  // a later click on the same element must still work).
  if ((event as PointerEvent).button !== 0) {
    lastPress = undefined;
    return;
  }
  if (target instanceof Element) {
    lastPress = {
      element: target.closest('button, [role="button"], a') ?? target,
      at: performance.now(),
    };
  }
};
if (typeof window !== 'undefined') window.addEventListener('pointerdown', trackPress, true);

/**
 * Tracks presses inside a closed shadow root too (from the window, they only show the host).
 * The browser extension's toolbar calls this for its root.
 */
export function trackPressesIn(root: ShadowRoot): void {
  root.addEventListener('pointerdown', trackPress, true);
}

/**
 * The button that opened a popup being opened now: the one pressed just before, if any
 * (undefined when a key opened it). Read it once, when the popup opens.
 */
export function pressedOpener(): Element | undefined {
  return lastPress && performance.now() - lastPress.at < 1000 ? lastPress.element : undefined;
}

/** Cancels the click that follows a press on `element` (its onClick would reopen the popup). */
function swallowClickOn(element: Element): void {
  const root = element.getRootNode();
  const targets: (Window | ShadowRoot)[] = [window];
  if (root instanceof ShadowRoot) targets.push(root);
  const onClick = (event: Event) => {
    if (!event.composedPath().includes(element)) return;
    event.stopPropagation();
    event.preventDefault();
    stop();
  };
  const stop = () => {
    clearTimeout(timer);
    for (const target of targets) target.removeEventListener('click', onClick, true);
  };
  const timer = setTimeout(stop, 1000);
  for (const target of targets) target.addEventListener('click', onClick, true);
}

/**
 * Calls `onClose` for a pointer press outside `elements`. A press on the popup's opener (see
 * `pressedOpener`) closes it for good: the click that follows is cancelled, so the opener
 * toggles the popup instead of reopening it. `ignore` skips presses that shouldn't close it.
 */
export function listenOutsidePress(
  elements: () => (Element | null | undefined)[],
  opener: Element | undefined,
  onClose: (event: PointerEvent) => void,
  ignore?: (event: PointerEvent) => boolean,
): () => void {
  return listenOutside(elements, 'pointerdown', (event) => {
    if (ignore?.(event)) return;
    if (opener && event.composedPath().includes(opener)) swallowClickOn(opener);
    onClose(event);
  });
}

/**
 * Closes a popup on a pointer press outside it and its anchor, on Escape (focus returns to the
 * anchor), when the window loses focus or resizes, and when something else scrolls. Works
 * inside shadow roots, open or closed (see `listenOutside`).
 */
export function useDismiss(
  refs: RefObject<HTMLElement | null>[],
  open: boolean,
  onClose: (reason: 'outside' | 'escape' | 'window') => void,
): void {
  useEffect(() => {
    if (!open) return;
    const elements = () => refs.map((ref) => ref.current);
    const stopPointer = listenOutside(elements, 'pointerdown', () => onClose('outside'));
    const stopScroll = listenOutside(elements, 'scroll', () => onClose('window'));
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose('escape');
    };
    const onWindow = () => onClose('window');
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('blur', onWindow);
    window.addEventListener('resize', onWindow);
    return () => {
      stopPointer();
      stopScroll();
      window.removeEventListener('keydown', onKeyDown, true);
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
