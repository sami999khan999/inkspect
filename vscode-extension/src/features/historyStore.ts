import { join } from 'node:path';
import * as vscode from 'vscode';
import {
  clearRange,
  isRecordable,
  recordVisit,
  searchHistory,
  topSites,
  type ClearRange,
  type HistoryItem,
} from '../shared/history';
import { JsonStore } from './jsonStore';

/** Pages visited in normal (not private) tabs. */
export class HistoryStore implements vscode.Disposable {
  private readonly store: JsonStore<HistoryItem[]>;
  private readonly onDidChangeEmitter = new vscode.EventEmitter<void>();
  readonly onDidChange = this.onDidChangeEmitter.event;
  private changeTimer?: NodeJS.Timeout;

  constructor(storageDir: string) {
    this.store = new JsonStore({
      file: join(storageDir, 'history.json'),
      version: 1,
      defaults: () => [],
      delayMs: 2_000,
    });
  }

  get items(): HistoryItem[] {
    return this.store.data;
  }

  recordVisit(url: string, title: string): void {
    if (!isRecordable(url)) return;
    this.store.update((items) => recordVisit(items, url, title));
    this.changed();
  }

  /** Titles often arrive after the visit was recorded. */
  updateTitle(url: string, title: string): void {
    const item = this.items.find((i) => i.url === url);
    if (!item || !title || item.title === title) return;
    this.store.update(() => {
      item.title = title;
    });
    this.changed();
  }

  search(query: string, limit?: number): HistoryItem[] {
    return searchHistory(this.items, query, limit);
  }

  topSites(limit?: number): HistoryItem[] {
    return topSites(this.items, limit);
  }

  remove(url: string): void {
    this.store.update((items) => items.filter((item) => item.url !== url));
    this.changed();
  }

  clear(range: ClearRange): void {
    this.store.update((items) => clearRange(items, range));
    this.changed();
  }

  dispose(): void {
    clearTimeout(this.changeTimer);
    this.store.flushSync();
    this.onDidChangeEmitter.dispose();
  }

  private changed(): void {
    this.changeTimer ??= setTimeout(() => {
      this.changeTimer = undefined;
      this.onDidChangeEmitter.fire();
    }, 300);
  }
}
