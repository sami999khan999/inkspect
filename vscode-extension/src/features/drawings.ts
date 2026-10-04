import { join } from 'node:path';
import { sanitizeShapes, type Shape } from '../shared/annotations';
import { JsonStore } from './jsonStore';

/** Pages whose drawings are kept; the ones drawn on longest ago are dropped first. */
export const MAX_DRAWING_PAGES = 30;

export type PageDrawings = Record<string, { shapes: Shape[]; at: number }>;

/** The pages' drawings after one changes: empty ones removed, at most `MAX_DRAWING_PAGES`. */
export function withPageDrawings(
  all: PageDrawings,
  page: string,
  shapes: Shape[],
  now: number,
): PageDrawings {
  const next = { ...all };
  if (shapes.length) next[page] = { shapes, at: now };
  else delete next[page];
  return Object.fromEntries(
    Object.entries(next)
      .sort(([, a], [, b]) => b.at - a.at)
      .slice(0, MAX_DRAWING_PAGES),
  );
}

/**
 * Drawings belong to the page they were drawn on (`drawingPageKey`): each page keeps its own,
 * in globalStorage, so they come back when a tab returns to the page, also after a restart.
 */
export class DrawingStore {
  private readonly store: JsonStore<PageDrawings>;

  constructor(storageDir: string) {
    this.store = new JsonStore<PageDrawings>({
      file: join(storageDir, 'drawings.json'),
      version: 1,
      defaults: () => ({}),
      delayMs: 1_000,
    });
  }

  get(page: string): Shape[] {
    return sanitizeShapes(this.store.data[page]?.shapes);
  }

  set(page: string, shapes: Shape[]): void {
    this.store.update((all) => withPageDrawings(all, page, shapes, Date.now()));
  }

  dispose(): void {
    this.store.flushSync();
  }
}
