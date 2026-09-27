import type * as vscode from 'vscode';

export interface SavedTab {
  url: string;
  title: string;
  pinned: boolean;
  zoom: number;
}

export interface SavedWindow {
  tabs: SavedTab[];
  activeIndex: number;
  savedAt: number;
}

const KEY = 'vscodeBrowser.sessions';
const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_WINDOWS = 20;

/**
 * Open tabs of each browser window, saved per VS Code workspace so windows can be restored after
 * a reload. VS Code only asks to restore windows that were open, so old entries are harmless;
 * they are pruned by age.
 */
export class SessionStore {
  constructor(private readonly memento: vscode.Memento) {
    this.prune();
  }

  get(windowId: string): SavedWindow | undefined {
    return this.all()[windowId];
  }

  save(windowId: string, window: SavedWindow): void {
    void this.memento.update(KEY, { ...this.all(), [windowId]: window });
  }

  delete(windowId: string): void {
    const all = { ...this.all() };
    delete all[windowId];
    void this.memento.update(KEY, all);
  }

  private all(): Record<string, SavedWindow> {
    return this.memento.get<Record<string, SavedWindow>>(KEY, {});
  }

  private prune(): void {
    const now = Date.now();
    const kept = Object.entries(this.all())
      .filter(([, window]) => now - window.savedAt < MAX_AGE_MS)
      .sort(([, a], [, b]) => b.savedAt - a.savedAt)
      .slice(0, MAX_WINDOWS);
    void this.memento.update(KEY, Object.fromEntries(kept));
  }
}
