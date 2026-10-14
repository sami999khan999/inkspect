/**
 * Overlay scrollbars, after the glass-scroll package (whose overlay covers only the document and
 * its own React areas, and whose stylesheet can't reach a shadow root). Native scrollbars are
 * hidden (ui.css), so they take no space; a scroll draws a glass thumb over the scroller's edge,
 * which fades out once the scrolling stops. Moving the pointer to that edge shows it too, so it
 * can be grabbed and dragged.
 */

/** No movement for this long hides the thumb (glass-scroll's default). */
const HIDE_DELAY = 1100;
/** The shortest thumb, so long content still gives something to grab. */
const MIN_THUMB = 32;
/** Gap between the thumb and the scroller's edge. */
const INSET = 3;
/** How close to the edge the pointer must come to show the thumb. */
const EDGE = 14;
/** Scrollers that keep no thumb (a tab strip scrolled by the wheel). */
const OPT_OUT = '[data-glass-scroll="off"]';

type Axis = 'y' | 'x';

interface Pointer {
  path: EventTarget[];
  x: number;
  y: number;
}

interface Bar {
  thumbs: Record<Axis, HTMLDivElement>;
  timer?: ReturnType<typeof setTimeout>;
  held: boolean;
}

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Glass overlay scrollbars for every scroller in `root` (a page's document, or a shadow root that
 * holds our UI). Returns a function that removes them.
 */
export function installGlassScroll(root: Document | ShadowRoot): () => void {
  const doc = root instanceof Document ? root : root.ownerDocument;
  const layer = doc.createElement('div');
  layer.className = 'ink-scroll-layer';
  layer.setAttribute('aria-hidden', 'true');
  (root instanceof Document ? (doc.body ?? doc.documentElement) : root).append(layer);
  const bars = new Map<HTMLElement, Bar>();
  const pending = new Set<HTMLElement>();
  let frame = 0;

  /** The scroller's box on screen; the document's scroller is the viewport. */
  const box = (el: HTMLElement) =>
    el === doc.scrollingElement
      ? { left: 0, top: 0 }
      : (({ left, top }) => ({ left: left + el.clientLeft, top: top + el.clientTop }))(
          el.getBoundingClientRect(),
        );

  const place = (el: HTMLElement, bar: Bar) => {
    const { left, top } = box(el);
    for (const axis of ['y', 'x'] as const) {
      const thumb = bar.thumbs[axis];
      const viewport = axis === 'y' ? el.clientHeight : el.clientWidth;
      const content = axis === 'y' ? el.scrollHeight : el.scrollWidth;
      const scroll = axis === 'y' ? el.scrollTop : el.scrollLeft;
      const maxScroll = content - viewport;
      if (maxScroll < 1 || viewport <= 0) {
        thumb.hidden = true;
        continue;
      }
      const track = viewport - 2 * INSET;
      const size = clamp((viewport / content) * track, Math.min(MIN_THUMB, track), track);
      const offset = INSET + (clamp(scroll, 0, maxScroll) / maxScroll) * (track - size);
      thumb.hidden = false;
      if (axis === 'y') {
        thumb.style.left = `${left + el.clientWidth - INSET}px`;
        thumb.style.top = `${top + offset}px`;
        thumb.style.height = `${size}px`;
      } else {
        thumb.style.left = `${left + offset}px`;
        thumb.style.top = `${top + el.clientHeight - INSET}px`;
        thumb.style.width = `${size}px`;
      }
    }
  };

  const remove = (el: HTMLElement) => {
    const bar = bars.get(el);
    if (!bar) return;
    clearTimeout(bar.timer);
    bars.delete(el);
    for (const thumb of Object.values(bar.thumbs)) {
      thumb.classList.remove('visible');
      // After the fade.
      setTimeout(() => thumb.remove(), 300);
    }
  };

  const scheduleHide = (el: HTMLElement, bar: Bar) => {
    clearTimeout(bar.timer);
    bar.timer = setTimeout(() => {
      if (!bar.held) remove(el);
    }, HIDE_DELAY);
  };

  const create = (el: HTMLElement): Bar => {
    const bar: Bar = { thumbs: { y: thumbFor(el, 'y'), x: thumbFor(el, 'x') }, held: false };
    for (const thumb of Object.values(bar.thumbs)) {
      layer.append(thumb);
      thumb.addEventListener('pointerenter', () => {
        bar.held = true;
        clearTimeout(bar.timer);
      });
      thumb.addEventListener('pointerleave', () => {
        if (thumb.classList.contains('dragging')) return;
        bar.held = false;
        scheduleHide(el, bar);
      });
    }
    bars.set(el, bar);
    return bar;
  };

  function thumbFor(el: HTMLElement, axis: Axis): HTMLDivElement {
    const thumb = doc.createElement('div');
    thumb.className = `ink-scroll-thumb ${axis}`;
    thumb.addEventListener('pointerdown', (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.stopPropagation();
      thumb.setPointerCapture(event.pointerId);
      thumb.classList.add('dragging');
      const start = axis === 'y' ? event.clientY : event.clientX;
      const startScroll = axis === 'y' ? el.scrollTop : el.scrollLeft;
      const viewport = axis === 'y' ? el.clientHeight : el.clientWidth;
      const maxScroll = (axis === 'y' ? el.scrollHeight : el.scrollWidth) - viewport;
      const travel = viewport - 2 * INSET - (axis === 'y' ? thumb.offsetHeight : thumb.offsetWidth);
      const onMove = (move: PointerEvent) => {
        if (travel <= 0) return;
        const delta = (axis === 'y' ? move.clientY : move.clientX) - start;
        const next = clamp(startScroll + (delta / travel) * maxScroll, 0, maxScroll);
        if (axis === 'y') el.scrollTop = next;
        else el.scrollLeft = next;
      };
      const onUp = () => {
        thumb.classList.remove('dragging');
        thumb.removeEventListener('pointermove', onMove);
        thumb.removeEventListener('pointerup', onUp);
        thumb.removeEventListener('pointercancel', onUp);
        const bar = bars.get(el);
        if (bar && !thumb.matches(':hover')) {
          bar.held = false;
          scheduleHide(el, bar);
        }
      };
      thumb.addEventListener('pointermove', onMove);
      thumb.addEventListener('pointerup', onUp);
      thumb.addEventListener('pointercancel', onUp);
    });
    return thumb;
  }

  /** Shows (or keeps showing) the thumbs of `el`, placed on the next frame. */
  const show = (el: HTMLElement) => {
    if (el.closest(OPT_OUT)) return;
    const bar = bars.get(el) ?? create(el);
    scheduleHide(el, bar);
    pending.add(el);
    frame ||= requestAnimationFrame(() => {
      frame = 0;
      for (const target of pending) {
        const current = bars.get(target);
        if (!current) continue;
        if (!target.isConnected) {
          remove(target);
          continue;
        }
        place(target, current);
        for (const thumb of Object.values(current.thumbs)) thumb.classList.add('visible');
      }
      pending.clear();
    });
  };

  const onScroll = (event: Event) => {
    const target = event.target;
    if (target === doc) show(doc.scrollingElement as HTMLElement);
    else if (target instanceof HTMLElement && target !== layer) show(target);
  };

  /** Shows the nearest scroller on `path` when the pointer (`x`, `y`) is at its edge. */
  const atEdge = ({ path, x, y }: Pointer) => {
    for (const node of path) {
      if (node === root || !(node instanceof HTMLElement)) break;
      if (node.parentNode === layer) return;
      const canY = node.scrollHeight - node.clientHeight >= 1;
      const canX = node.scrollWidth - node.clientWidth >= 1;
      if (!canY && !canX) continue;
      const style = getComputedStyle(node);
      const scrollsY = canY && /auto|scroll/.test(style.overflowY);
      const scrollsX = canX && /auto|scroll/.test(style.overflowX);
      if (!scrollsY && !scrollsX) continue;
      const { left, top } = box(node);
      if (
        (scrollsY && x >= left + node.clientWidth - EDGE) ||
        (scrollsX && y >= top + node.clientHeight - EDGE)
      ) {
        show(node);
      }
      return;
    }
  };
  // Checked once a frame, at the latest position (a path can only be read during its event).
  let pointer: Pointer | undefined;
  let moveFrame = 0;
  const onPointerMove = (event: PointerEvent) => {
    if (event.buttons) return;
    pointer = { path: event.composedPath(), x: event.clientX, y: event.clientY };
    moveFrame ||= requestAnimationFrame(() => {
      moveFrame = 0;
      if (pointer) atEdge(pointer);
    });
  };

  // Scroll events don't bubble; capturing at the root sees every scroller inside it.
  root.addEventListener('scroll', onScroll, { capture: true, passive: true });
  root.addEventListener('pointermove', onPointerMove as EventListener, {
    capture: true,
    passive: true,
  });
  return () => {
    root.removeEventListener('scroll', onScroll, { capture: true });
    root.removeEventListener('pointermove', onPointerMove as EventListener, { capture: true });
    cancelAnimationFrame(frame);
    cancelAnimationFrame(moveFrame);
    for (const el of [...bars.keys()]) remove(el);
    layer.remove();
  };
}
