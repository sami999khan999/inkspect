import { useEffect, useState } from 'react';
import type { ClearRange, HistoryItem } from '@shared/history';
import { postToHost } from '../vscode';

interface HistoryPageProps {
  tabId: string;
  items: HistoryItem[] | undefined;
  /** Incremented when history changed and the list should be fetched again. */
  changeSignal: number;
}

function dayLabel(time: number): string {
  const date = new Date(time);
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  if (time >= startOfToday) return 'Today';
  if (time >= startOfToday - 86_400_000) return 'Yesterday';
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function host(url: string): string {
  try {
    return new URL(url).host || url;
  } catch {
    return url;
  }
}

export function HistoryPage({ tabId, items, changeSignal }: HistoryPageProps) {
  const [query, setQuery] = useState('');
  const [range, setRange] = useState<ClearRange>('hour');

  useEffect(() => {
    const timer = setTimeout(
      () => postToHost({ type: 'requestPageData', page: 'history', query }),
      query ? 150 : 0,
    );
    return () => clearTimeout(timer);
  }, [query, changeSignal]);

  const groups: { label: string; items: HistoryItem[] }[] = [];
  for (const item of items ?? []) {
    const label = dayLabel(item.lastVisit);
    const last = groups.at(-1);
    if (last?.label === label) last.items.push(item);
    else groups.push({ label, items: [item] });
  }

  return (
    <div className="internal-page history-page">
      <div className="internal-page-inner">
        <header className="internal-page-header">
          <h1>History</h1>
          <div className="header-actions">
            <select
              value={range}
              onChange={(event) => setRange(event.target.value as ClearRange)}
              aria-label="Time range"
            >
              <option value="hour">Last hour</option>
              <option value="day">Last 24 hours</option>
              <option value="week">Last 7 days</option>
              <option value="all">All time</option>
            </select>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'historyAction', action: 'clear', range })}
            >
              Clear
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'clearBrowsingData' })}
            >
              Clear browsing data...
            </button>
          </div>
        </header>
        <input
          className="page-search"
          type="search"
          value={query}
          placeholder="Search history"
          aria-label="Search history"
          onChange={(event) => setQuery(event.target.value)}
        />
        {items && items.length === 0 && (
          <p className="muted empty-state">
            {query ? 'No matching pages.' : 'Pages you visit appear here.'}
          </p>
        )}
        {groups.map((group) => (
          <section key={group.label} className="history-group">
            <h2>{group.label}</h2>
            {group.items.map((item) => (
              <div key={item.url} className="list-row">
                <span className="row-time">
                  {new Date(item.lastVisit).toLocaleTimeString(undefined, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
                <button
                  type="button"
                  className="link-button row-title"
                  title={item.url}
                  onClick={(event) =>
                    postToHost({
                      type: 'navigate',
                      tabId,
                      input: item.url,
                      newTab: event.ctrlKey || event.metaKey,
                    })
                  }
                  onAuxClick={(event) => {
                    if (event.button === 1)
                      postToHost({ type: 'navigate', input: item.url, newTab: true });
                  }}
                >
                  {item.title || item.url}
                </button>
                <span className="row-detail">{host(item.url)}</span>
                <button
                  type="button"
                  className="icon-button row-action"
                  title="Remove from history"
                  aria-label="Remove from history"
                  onClick={() =>
                    postToHost({ type: 'historyAction', action: 'remove', url: item.url })
                  }
                >
                  <span className="codicon codicon-close" aria-hidden="true" />
                </button>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
