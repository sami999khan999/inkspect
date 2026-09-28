import { useEffect, useState } from 'react';
import type { ClearRange, HistoryItem } from '@shared/history';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Select, type SelectOption } from '@inkspect/shared/ui/Select';
import { TextField } from '@inkspect/shared/ui/TextField';
import { postToHost } from '../vscode';
import { EmptyState, PageLayout, SiteIcon } from './PageLayout';

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

  const open = (url: string, newTab: boolean) =>
    postToHost({ type: 'navigate', tabId: newTab ? undefined : tabId, input: url, newTab });

  return (
    <PageLayout
      name="history"
      icon="history"
      title="History"
      description="Pages you visited in this browser. Private tabs are not recorded."
      actions={
        <>
          <Select label="Time range to clear" value={range} onChange={setRange} options={RANGES} />
          <Button
            icon="trash"
            onClick={() => postToHost({ type: 'historyAction', action: 'clear', range })}
          >
            Clear
          </Button>
          <Button variant="ghost" onClick={() => postToHost({ type: 'clearBrowsingData' })}>
            Clear browsing data…
          </Button>
        </>
      }
      toolbar={
        <TextField
          size="lg"
          icon="search"
          type="search"
          value={query}
          placeholder="Search history"
          aria-label="Search history"
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
        />
      }
    >
      {items && items.length === 0 && (
        <EmptyState icon="history" title={query ? 'No matching pages' : 'No history yet'}>
          {query ? 'Try a different search.' : 'Pages you visit appear here.'}
        </EmptyState>
      )}
      {groups.map((group) => (
        <section key={group.label} className="card list-card" aria-label={group.label}>
          <h2 className="list-card-title">{group.label}</h2>
          {group.items.map((item) => (
            <div key={item.url} className="list-row">
              <span className="row-time">
                {new Date(item.lastVisit).toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
              <SiteIcon url={item.url} />
              <button
                type="button"
                className="link-button row-title"
                title={item.url}
                onClick={(event) => open(item.url, event.ctrlKey || event.metaKey)}
                onAuxClick={(event) => event.button === 1 && open(item.url, true)}
              >
                {item.title || item.url}
              </button>
              <span className="row-detail">{host(item.url)}</span>
              <IconButton
                icon="close"
                label="Remove from history"
                className="small row-action"
                onClick={() =>
                  postToHost({ type: 'historyAction', action: 'remove', url: item.url })
                }
              />
            </div>
          ))}
        </section>
      ))}
    </PageLayout>
  );
}

const RANGES: SelectOption<ClearRange>[] = [
  { value: 'hour', label: 'Last hour' },
  { value: 'day', label: 'Last 24 hours' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'all', label: 'All time' },
];
