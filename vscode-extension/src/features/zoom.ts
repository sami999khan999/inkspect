import type * as vscode from 'vscode';

/** Zoom steps, the same as Chrome's. */
export const ZOOM_LEVELS = [
  0.25, 0.33, 0.5, 0.67, 0.75, 0.8, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3, 4, 5,
] as const;

/** Returns the next zoom step in `direction` from `current`, staying within the supported range. */
export function stepZoom(current: number, direction: 1 | -1): number {
  if (direction > 0) return ZOOM_LEVELS.find((level) => level > current + 0.001) ?? current;
  return [...ZOOM_LEVELS].reverse().find((level) => level < current - 0.001) ?? current;
}

/** Zoom is remembered per site (host), like in Chrome. Other URLs share one key per scheme. */
export function zoomKey(url: string): string | undefined {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'http:' || parsed.protocol === 'https:') return parsed.host;
    if (parsed.protocol === 'file:') return 'file:';
  } catch {
    // Not a URL.
  }
  return undefined;
}

export class ZoomStore {
  private static readonly KEY = 'vscodeBrowser.zoomBySite';

  constructor(private readonly memento: vscode.Memento) {}

  get(url: string): number {
    const key = zoomKey(url);
    if (!key) return 1;
    return this.all()[key] ?? 1;
  }

  async set(url: string, zoom: number): Promise<void> {
    const key = zoomKey(url);
    if (!key) return;
    const all = { ...this.all() };
    if (Math.abs(zoom - 1) < 0.001) delete all[key];
    else all[key] = zoom;
    await this.memento.update(ZoomStore.KEY, all);
  }

  private all(): Record<string, number> {
    return this.memento.get<Record<string, number>>(ZoomStore.KEY, {});
  }
}
