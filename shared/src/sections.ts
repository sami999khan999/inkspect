// Scrolling sections of a page (a sidebar, a chat log, a code panel...) that drawings are
// anchored to, so a drawing on one scrolls with it. A section is named by a CSS selector, so
// drawings kept for the page find it again after a reload.
//
// Both functions run in the page: the browser extension calls them, VS Code Browser sends them
// to Chromium as source text (`toString()`). They must stay self-contained: no imports used at
// run time, no helpers outside their bodies.

import type { Anchors } from './annotations';

/**
 * The innermost scrolling section at a point (viewport CSS pixels), as its selector, or null.
 * `skip` is our own UI over the page. `measureSections` says where it is.
 */
export function sectionAt(x: number, y: number, skip: Element | null): string | null {
  const scrolls = (el: Element): boolean => {
    if (el === document.scrollingElement || el === document.body || el === document.documentElement)
      return false;
    const style = getComputedStyle(el);
    const can = (overflow: string) => /auto|scroll|overlay/.test(overflow);
    return (
      (can(style.overflowY) && el.scrollHeight > el.clientHeight + 1) ||
      (can(style.overflowX) && el.scrollWidth > el.clientWidth + 1)
    );
  };
  const under = document
    .elementsFromPoint(x, y)
    .find((el) => !skip || (el !== skip && !skip.contains(el)));
  let el: Element | null = under ?? null;
  while (el && !scrolls(el)) el = el.parentElement;
  if (!el) return null;
  // A selector that finds it again: up to an ancestor with a unique id, else from the root.
  const steps: string[] = [];
  for (let at: Element | null = el; at && at !== document.documentElement; at = at.parentElement) {
    if (at.id && document.querySelectorAll(`#${CSS.escape(at.id)}`).length === 1) {
      steps.unshift(`#${CSS.escape(at.id)}`);
      break;
    }
    const tag = at.localName;
    const index = at.parentElement
      ? [...at.parentElement.children].filter((c) => c.localName === tag).indexOf(at) + 1
      : 1;
    steps.unshift(`${CSS.escape(tag)}:nth-of-type(${index})`);
  }
  return steps.join(' > ');
}

/**
 * Where sections are now: their scroll (added up with the sections around them) and the part of
 * the document they show. Sections no longer on the page are left out.
 */
export function measureSections(ids: string[]): Anchors {
  const scrolls = (el: Element): boolean => {
    if (el === document.scrollingElement || el === document.body || el === document.documentElement)
      return false;
    const style = getComputedStyle(el);
    const can = (overflow: string) => /auto|scroll|overlay/.test(overflow);
    return (
      (can(style.overflowY) && el.scrollHeight > el.clientHeight + 1) ||
      (can(style.overflowX) && el.scrollWidth > el.clientWidth + 1)
    );
  };
  const anchors: Anchors = {};
  for (const id of ids) {
    let el: Element | null = null;
    try {
      el = document.querySelector(id);
    } catch {
      // Not a selector (damaged saved drawings).
    }
    if (!el) continue;
    let x = 0;
    let y = 0;
    let left = -Infinity;
    let top = -Infinity;
    let right = Infinity;
    let bottom = Infinity;
    // Nested sections: the drawing moves with all of them, and shows only where they all show.
    for (let at: Element | null = el; at; at = at.parentElement) {
      if (at !== el && !scrolls(at)) continue;
      if (at === document.body || at === document.documentElement) break;
      x += at.scrollLeft;
      y += at.scrollTop;
      const rect = at.getBoundingClientRect();
      left = Math.max(left, rect.left + at.clientLeft + scrollX);
      top = Math.max(top, rect.top + at.clientTop + scrollY);
      right = Math.min(right, rect.left + at.clientLeft + at.clientWidth + scrollX);
      bottom = Math.min(bottom, rect.top + at.clientTop + at.clientHeight + scrollY);
    }
    anchors[id] = {
      x,
      y,
      clip: {
        x: left,
        y: top,
        width: Math.max(0, right - left),
        height: Math.max(0, bottom - top),
      },
    };
  }
  return anchors;
}
