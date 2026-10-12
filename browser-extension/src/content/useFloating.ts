// The floating toolbar's position: dragged by its handle (or moved with the arrow keys), it follows
// the pointer on a spring, settles inside the window with a little overshoot, and is remembered
// for the next page. The position is written straight to the element's transform on every
// animation frame; React only hears where it came to rest (to place the panels beside it).
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';

export interface Rest {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Point {
  x: number;
  y: number;
}

const STORAGE_KEY = 'toolbarPosition';
/** The gap kept between the toolbar and the window's edges. */
const MARGIN = 8;
/** Where it starts the first time: centered, this far from the top. */
const START_TOP = 12;
/** Stiffness and damping: snappy under the pointer, springier when let go. */
const DRAG_SPRING = { k: 700, c: 40 };
const RELEASE_SPRING = { k: 320, c: 20 };
/** How far an arrow key moves it (Shift: four times as far). */
const KEY_STEP = 24;

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

const sizeOf = (el: HTMLElement | null) => ({
  width: el?.offsetWidth ?? 0,
  height: el?.offsetHeight ?? 0,
});

/** The window's room for the toolbar: its layer, which (unlike `innerWidth`) leaves out the
    page's scrollbars. */
const roomOf = (el: HTMLElement | null) => ({
  width: el?.parentElement?.clientWidth || innerWidth,
  height: el?.parentElement?.clientHeight || innerHeight,
});

/** On whole device pixels: text placed between them is resampled, and looks blurry. */
const snap = (value: number) => Math.round(value * devicePixelRatio) / devicePixelRatio;

const paint = (el: HTMLElement | null, p: Point) => {
  if (el) el.style.transform = `translate(${snap(p.x)}px, ${snap(p.y)}px)`;
};

/**
 * Makes `ref`'s element float at a draggable position while `open`. `measure` is the part whose
 * size keeps it inside the window (the bar, not the panels hanging off it). While `docked` (the
 * responsive view), it sits at the top-left as a full-width bar and can't be moved; undocked, it
 * goes back where it was.
 */
export function useFloating(open: boolean, measure: RefObject<HTMLElement | null>, docked = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [rest, setRest] = useState<Rest | null>(null);
  const [dragging, setDragging] = useState(false);
  const pos = useRef<Point>({ x: 0, y: 0 });
  const velocity = useRef<Point>({ x: 0, y: 0 });
  const target = useRef<Point>({ x: 0, y: 0 });
  const grab = useRef<(Point & { id: number }) | null>(null);
  /** Moved by the user (now or before): until then it stays centered as its width changes. */
  const placed = useRef(false);
  const frame = useRef(0);
  const last = useRef(0);

  /** The nearest position that keeps the whole bar in the window. */
  const clamp = useCallback(
    (p: Point): Point => {
      const { width, height } = sizeOf(measure.current);
      const room = roomOf(ref.current);
      const maxX = Math.max(MARGIN, room.width - width - MARGIN);
      const maxY = Math.max(MARGIN, room.height - height - MARGIN);
      return {
        x: Math.min(maxX, Math.max(MARGIN, p.x)),
        y: Math.min(maxY, Math.max(MARGIN, p.y)),
      };
    },
    [measure],
  );

  const settle = useCallback(() => {
    const { width, height } = sizeOf(measure.current);
    setRest({ ...pos.current, width, height });
  }, [measure]);

  const step = useCallback(
    (now: number) => {
      const dt = Math.min(0.032, (now - last.current) / 1000 || 0.016);
      last.current = now;
      const { k, c } = grab.current ? DRAG_SPRING : RELEASE_SPRING;
      let moving = false;
      for (const axis of ['x', 'y'] as const) {
        const offset = target.current[axis] - pos.current[axis];
        velocity.current[axis] += (k * offset - c * velocity.current[axis]) * dt;
        pos.current[axis] += velocity.current[axis] * dt;
        if (Math.abs(offset) > 0.3 || Math.abs(velocity.current[axis]) > 4) moving = true;
      }
      if (!moving && !grab.current) {
        pos.current = { ...target.current };
        velocity.current = { x: 0, y: 0 };
        paint(ref.current, pos.current);
        frame.current = 0;
        settle();
        return;
      }
      paint(ref.current, pos.current);
      frame.current = requestAnimationFrame(step);
    },
    [settle],
  );

  /** Moves toward `to`: on the spring, or at once when motion is reduced. */
  const moveTo = useCallback(
    (to: Point) => {
      target.current = to;
      if (reducedMotion()) {
        pos.current = { ...to };
        velocity.current = { x: 0, y: 0 };
        paint(ref.current, pos.current);
        if (!grab.current) settle();
        return;
      }
      if (!frame.current) {
        last.current = performance.now();
        frame.current = requestAnimationFrame(step);
      }
    },
    [settle, step],
  );

  const save = (p: Point) => void chrome.storage.local.set({ [STORAGE_KEY]: p }).catch(() => {});

  // Opening: where it was left last time (kept inside this window), else centered at the top.
  useLayoutEffect(() => {
    if (!open) return;
    if (docked) {
      pos.current = { x: 0, y: 0 };
      target.current = { x: 0, y: 0 };
      paint(ref.current, pos.current);
      settle();
      return;
    }
    let current = true;
    const place = (saved: unknown) => {
      if (!current) return;
      const p = saved as Partial<Point> | undefined;
      placed.current = typeof p?.x === 'number' && typeof p.y === 'number';
      const start =
        p && placed.current
          ? { x: p.x!, y: p.y! }
          : { x: (roomOf(ref.current).width - sizeOf(measure.current).width) / 2, y: START_TOP };
      pos.current = clamp(start);
      target.current = { ...pos.current };
      velocity.current = { x: 0, y: 0 };
      paint(ref.current, pos.current);
      settle();
    };
    // Placed at once (no jump from the corner), then moved if a saved position arrives.
    place(undefined);
    void chrome.storage.local
      .get(STORAGE_KEY)
      .then((stored) => stored[STORAGE_KEY] && place(stored[STORAGE_KEY]))
      .catch(() => {});
    return () => {
      current = false;
      cancelAnimationFrame(frame.current);
      frame.current = 0;
      grab.current = null;
    };
  }, [open, docked, clamp, settle, measure]);

  // It stays in the window when the window shrinks, or the bar grows (the drawing tools' row).
  useEffect(() => {
    if (!open) return;
    const keepInside = () => {
      if (docked) return settle();
      if (grab.current) return;
      const centered = {
        x: (roomOf(ref.current).width - sizeOf(measure.current).width) / 2,
        y: START_TOP,
      };
      moveTo(clamp(placed.current ? target.current : centered));
    };
    const observer = new ResizeObserver(keepInside);
    if (measure.current) observer.observe(measure.current);
    // The layer narrows when the page gets a scrollbar, which doesn't resize the window.
    if (ref.current?.parentElement) observer.observe(ref.current.parentElement);
    addEventListener('resize', keepInside);
    return () => {
      observer.disconnect();
      removeEventListener('resize', keepInside);
    };
  }, [open, docked, clamp, moveTo, settle, measure]);

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || docked) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    placed.current = true;
    grab.current = {
      id: event.pointerId,
      x: event.clientX - pos.current.x,
      y: event.clientY - pos.current.y,
    };
    setDragging(true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const held = grab.current;
    if (!held || held.id !== event.pointerId) return;
    const wanted = { x: event.clientX - held.x, y: event.clientY - held.y };
    // Past the window's edge it resists, like a rubber band.
    const inside = clamp(wanted);
    moveTo({
      x: inside.x + (wanted.x - inside.x) * 0.25,
      y: inside.y + (wanted.y - inside.y) * 0.25,
    });
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    const held = grab.current;
    if (!held || held.id !== event.pointerId) return;
    grab.current = null;
    setDragging(false);
    const to = clamp(target.current);
    moveTo(to);
    save(to);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (docked) return;
    const step = event.shiftKey ? KEY_STEP * 4 : KEY_STEP;
    const delta: Record<string, Point> = {
      ArrowLeft: { x: -step, y: 0 },
      ArrowRight: { x: step, y: 0 },
      ArrowUp: { x: 0, y: -step },
      ArrowDown: { x: 0, y: step },
    };
    const d = delta[event.key];
    if (!d) return;
    event.preventDefault();
    event.stopPropagation();
    placed.current = true;
    const to = clamp({ x: target.current.x + d.x, y: target.current.y + d.y });
    moveTo(to);
    save(to);
  };

  return {
    ref,
    rest,
    dragging,
    handle: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onKeyDown,
    },
  };
}
