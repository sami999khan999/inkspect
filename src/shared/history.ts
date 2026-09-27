// Browsing history model and ranking. Pure functions, shared by the host and the webview.

export interface HistoryItem {
  url: string;
  title: string;
  visitCount: number;
  /** Milliseconds since the epoch. */
  lastVisit: number;
}

export const MAX_HISTORY = 20_000;

const DAY = 24 * 60 * 60 * 1000;

/** "Frecency": frequently and recently visited pages rank highest (like Firefox's address bar). */
export function frecency(item: HistoryItem, now = Date.now()): number {
  const age = now - item.lastVisit;
  const recency =
    age < 4 * DAY ? 100 : age < 14 * DAY ? 70 : age < 31 * DAY ? 50 : age < 90 * DAY ? 30 : 10;
  return item.visitCount * recency;
}

/** Whether visits to this URL are worth remembering. */
export function isRecordable(url: string): boolean {
  return /^(https?|file):/i.test(url);
}

/**
 * Records a visit. Returns the updated list, most recent first, capped at `max` entries (the
 * least recently visited are dropped).
 */
export function recordVisit(
  items: HistoryItem[],
  url: string,
  title: string,
  now = Date.now(),
  max = MAX_HISTORY,
): HistoryItem[] {
  const existing = items.find((item) => item.url === url);
  const updated: HistoryItem = existing
    ? {
        ...existing,
        title: title || existing.title,
        visitCount: existing.visitCount + 1,
        lastVisit: now,
      }
    : { url, title: title || url, visitCount: 1, lastVisit: now };
  return [updated, ...items.filter((item) => item !== existing)].slice(0, max);
}

export type ClearRange = 'hour' | 'day' | 'week' | 'all';

const RANGE_MS: Record<Exclude<ClearRange, 'all'>, number> = {
  hour: 60 * 60 * 1000,
  day: DAY,
  week: 7 * DAY,
};

/** Removes items visited within the range (or everything). */
export function clearRange(
  items: HistoryItem[],
  range: ClearRange,
  now = Date.now(),
): HistoryItem[] {
  if (range === 'all') return [];
  const since = now - RANGE_MS[range];
  return items.filter((item) => item.lastVisit < since);
}

export function searchHistory(items: HistoryItem[], query: string, limit = 500): HistoryItem[] {
  const needle = query.trim().toLowerCase();
  const matches = needle
    ? items.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) || item.url.toLowerCase().includes(needle),
      )
    : items;
  return matches.slice(0, limit);
}

/** Most visited pages, one per URL, for the new tab page. */
export function topSites(items: HistoryItem[], limit = 8, now = Date.now()): HistoryItem[] {
  return [...items].sort((a, b) => frecency(b, now) - frecency(a, now)).slice(0, limit);
}

export type SuggestionKind = 'bookmark' | 'history' | 'tab' | 'search' | 'url';

export interface Suggestion {
  kind: SuggestionKind;
  url: string;
  title: string;
  /** Tab id for `tab` suggestions (switches to the tab instead of navigating). */
  tabId?: string;
}

/** Strips the scheme and `www.` so `exa` matches `https://www.example.com`. */
function bareUrl(url: string): string {
  return url.replace(/^[a-z]+:\/\//i, '').replace(/^www\./i, '');
}

/**
 * Address bar suggestions: open tabs, bookmarks and history matching the input, best first.
 * Prefix matches on the URL count most, then word matches in the title, then anywhere.
 */
export function rankSuggestions(
  query: string,
  sources: { tabs: Suggestion[]; bookmarks: Suggestion[]; history: HistoryItem[] },
  limit = 8,
  now = Date.now(),
): Suggestion[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  const score = (url: string, title: string): number => {
    const bare = bareUrl(url).toLowerCase();
    const lowerTitle = title.toLowerCase();
    if (bare.startsWith(needle)) return 3;
    if (lowerTitle.split(/\W+/).some((word) => word.startsWith(needle))) return 2;
    if (bare.includes(needle) || lowerTitle.includes(needle)) return 1;
    return 0;
  };
  const scored: { suggestion: Suggestion; score: number }[] = [];
  const seen = new Set<string>();
  const add = (suggestion: Suggestion, bonus: number) => {
    const key = `${suggestion.kind === 'tab' ? 'tab:' : ''}${suggestion.url}`;
    if (seen.has(key)) return;
    const match = score(suggestion.url, suggestion.title);
    if (!match) return;
    seen.add(key);
    scored.push({ suggestion, score: match * 1_000_000 + bonus });
  };
  for (const tab of sources.tabs) add(tab, 900_000);
  for (const bookmark of sources.bookmarks) add(bookmark, 800_000);
  for (const item of sources.history) {
    add(
      { kind: 'history', url: item.url, title: item.title },
      Math.min(799_999, frecency(item, now)),
    );
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.suggestion);
}
