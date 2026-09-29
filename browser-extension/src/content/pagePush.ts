// Makes room for the toolbar at the top of the page: the document moves down by the bar's height,
// and so do fixed and sticky elements that sit at the top (headers would hide under the bar).

interface Saved {
  value: string;
  priority: string;
}

let offset = 0;
const adjusted = new Map<HTMLElement, Saved & { applied: string }>();
let htmlSaved: Saved | undefined;
let observer: MutationObserver | undefined;
let timer: ReturnType<typeof setTimeout> | undefined;
let host: Element | undefined;

/** How far the page is pushed down (0 when the toolbar is closed). */
export function pushOffset(): number {
  return offset;
}

const px = (value: string) => parseFloat(value) || 0;

function save(el: HTMLElement, property: string): Saved {
  return {
    value: el.style.getPropertyValue(property),
    priority: el.style.getPropertyPriority(property),
  };
}

function restore(el: HTMLElement, property: string, saved: Saved): void {
  if (saved.value) el.style.setProperty(property, saved.value, saved.priority);
  else el.style.removeProperty(property);
}

/** Moves fixed and sticky elements whose top edge is set to stay below the bar. */
function adjustFixed(): void {
  for (const el of document.body?.querySelectorAll<HTMLElement>('*') ?? []) {
    if (el === host) continue;
    const mine = adjusted.get(el);
    // Ours still in place: nothing to do. The page replaced it: measure again.
    if (mine && el.style.getPropertyValue('top') === mine.applied) continue;
    const style = getComputedStyle(el);
    if (style.position !== 'fixed' && style.position !== 'sticky') {
      if (mine) adjusted.delete(el);
      continue;
    }
    if (style.top === 'auto') continue;
    const top = px(style.top);
    // Only elements anchored near the top; a bottom bar with a large `top` is left alone.
    if (top >= offset) continue;
    const saved = mine ?? save(el, 'top');
    const applied = `${top + offset}px`;
    el.style.setProperty('top', applied, 'important');
    adjusted.set(el, { ...saved, applied });
  }
}

/** At most one pass every 300 ms, even on pages that change all the time. */
function scheduleAdjust(): void {
  if (timer) return;
  timer = setTimeout(() => {
    timer = undefined;
    adjustFixed();
  }, 300);
}

/**
 * Pushes the page down by `height` pixels (0 undoes it). `toolbarHost` is our own element, which
 * is never moved.
 */
export function pushPage(height: number, toolbarHost: Element): void {
  host = toolbarHost;
  const html = document.documentElement;
  if (height <= 0) {
    unpush();
    return;
  }
  if (!htmlSaved) htmlSaved = save(html, 'margin-top');
  // Undo our own margin before measuring the page's.
  restore(html, 'margin-top', htmlSaved);
  const pageMargin = px(getComputedStyle(html).marginTop);
  html.style.setProperty('margin-top', `${pageMargin + height}px`, 'important');
  if (height !== offset) {
    // A new height: every element gets measured from its own value again.
    for (const [el, saved] of adjusted) restore(el, 'top', saved);
    adjusted.clear();
  }
  offset = height;
  adjustFixed();
  if (!observer) {
    // Headers that turn fixed on scroll, or appear later, change a class or style.
    observer = new MutationObserver(scheduleAdjust);
    observer.observe(document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });
    addEventListener('resize', scheduleAdjust);
  }
}

function unpush(): void {
  clearTimeout(timer);
  timer = undefined;
  observer?.disconnect();
  observer = undefined;
  removeEventListener('resize', scheduleAdjust);
  for (const [el, saved] of adjusted) restore(el, 'top', saved);
  adjusted.clear();
  if (htmlSaved) restore(document.documentElement, 'margin-top', htmlSaved);
  htmlSaved = undefined;
  offset = 0;
}
