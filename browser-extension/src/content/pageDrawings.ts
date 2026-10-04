// Drawings belong to the page they were drawn on: each page (its address) keeps its own, in
// local storage, so they come back when you return to it, also after a reload.

import { drawingPageKey, sanitizeShapes, type Shape } from '@inkspect/shared/annotations';

const STORAGE_KEY = 'inkspectDrawings';
/** Pages whose drawings are kept; the ones drawn on longest ago are dropped first. */
const MAX_PAGES = 30;

type Stored = Record<string, { shapes: Shape[]; at: number }>;

/** The page an address shows (see `drawingPageKey`). */
export const pageKeyOf = drawingPageKey;

async function readAll(): Promise<Stored> {
  const stored = (await chrome.storage.local.get(STORAGE_KEY).catch(() => ({}))) as {
    [STORAGE_KEY]?: unknown;
  };
  const value = stored[STORAGE_KEY];
  return value && typeof value === 'object' ? (value as Stored) : {};
}

// Saves run one after another, so a slow one can't overwrite a newer one.
let queue: Promise<unknown> = Promise.resolve();
let pending: { page: string; shapes: Shape[]; timer: ReturnType<typeof setTimeout> } | undefined;

export async function loadDrawings(page: string): Promise<Shape[]> {
  if (pending?.page === page) return pending.shapes;
  await queue;
  return sanitizeShapes((await readAll())[page]?.shapes);
}

function write(page: string, shapes: Shape[]): void {
  queue = queue
    .then(async () => {
      const all = await readAll();
      if (shapes.length) all[page] = { shapes, at: Date.now() };
      else delete all[page];
      const kept = Object.entries(all)
        .sort(([, a], [, b]) => b.at - a.at)
        .slice(0, MAX_PAGES);
      await chrome.storage.local.set({ [STORAGE_KEY]: Object.fromEntries(kept) });
    })
    .catch(() => {
      // Storage full or gone: the drawings stay on screen for now.
    });
}

/** Writes what is waiting at once (before leaving the page). */
export function flushDrawings(): void {
  if (!pending) return;
  clearTimeout(pending.timer);
  write(pending.page, pending.shapes);
  pending = undefined;
}

/** Saves a page's drawings shortly (dragging a shape changes them on every move). */
export function saveDrawings(page: string, shapes: Shape[]): void {
  if (pending && pending.page !== page) flushDrawings();
  if (pending) clearTimeout(pending.timer);
  pending = { page, shapes, timer: setTimeout(flushDrawings, 400) };
}
