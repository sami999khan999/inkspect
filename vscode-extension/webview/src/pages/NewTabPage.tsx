import { useEffect, useState } from 'react';
import type { BookmarkNode } from '@shared/bookmarks';
import type { HistoryItem } from '@shared/history';
import { TextField } from '@inkspect/shared/ui/TextField';
import { KeyCaps } from '../components/KeyCaps';
import { useShortcutMap } from '../shortcuts';
import { postToHost } from '../vscode';

/** Shortcut tiles on the new tab page: [action id, label, codicon]. */
const TIPS: [string, string, string][] = [
  ['open.quickActions', 'Quick actions', 'zap'],
  ['mode.inspect', 'Select an element', 'inspect'],
  ['mode.draw', 'Draw on the page', 'edit'],
  ['mode.screenshot', 'Screenshot', 'device-camera'],
  ['mode.measure', 'Measure', 'symbol-ruler'],
  ['open.cheatSheet', 'All shortcuts', 'keyboard'],
];

interface NewTabPageProps {
  tabId: string;
  isPrivate: boolean;
  topSites: HistoryItem[] | undefined;
  bookmarks: BookmarkNode[];
  changeSignal: number;
}

function host(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, '') || url;
  } catch {
    return url;
  }
}

export function NewTabPage({
  tabId,
  isPrivate,
  topSites,
  bookmarks,
  changeSignal,
}: NewTabPageProps) {
  const [text, setText] = useState('');
  const map = useShortcutMap();

  useEffect(() => {
    if (!isPrivate) postToHost({ type: 'requestPageData', page: 'newtab' });
  }, [isPrivate, changeSignal]);

  const open = (url: string, newTab: boolean) =>
    postToHost({ type: 'navigate', tabId, input: url, newTab });
  const tiles = isPrivate
    ? []
    : [
        ...(topSites ?? []).map((site) => ({
          url: site.url,
          title: site.title,
          icon: undefined as string | undefined,
        })),
        ...bookmarks
          .filter((b) => b.type === 'bookmark')
          .map((b) => ({ url: b.url!, title: b.title, icon: b.favicon })),
      ]
        .filter((tile, index, all) => all.findIndex((t) => t.url === tile.url) === index)
        .slice(0, 8);

  return (
    <div className={`internal-page newtab-page${isPrivate ? ' private' : ''}`}>
      <div className="newtab-inner">
        <span
          className={`codicon codicon-${isPrivate ? 'eye-closed' : 'globe'} newtab-logo`}
          aria-hidden="true"
        />
        {isPrivate && (
          <p className="muted private-note">
            Private tab: pages you visit are not saved to history, and cookies and site data are
            deleted when you close the last private tab.
          </p>
        )}
        <form
          className="newtab-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (text.trim()) postToHost({ type: 'navigate', tabId, input: text });
          }}
        >
          <TextField
            size="lg"
            icon="search"
            className="newtab-search"
            value={text}
            placeholder="Search the web or enter an address"
            aria-label="Search the web or enter an address"
            onChange={(event) => setText(event.target.value)}
          />
        </form>
        {tiles.length > 0 && (
          <div className="top-sites">
            {tiles.map((tile) => (
              <button
                key={tile.url}
                type="button"
                className="top-site"
                title={`${tile.title}\n${tile.url}`}
                onClick={(event) => open(tile.url, event.ctrlKey || event.metaKey)}
                onAuxClick={(event) => {
                  if (event.button === 1) open(tile.url, true);
                }}
              >
                <span className="top-site-icon">
                  {tile.icon ? (
                    <img src={tile.icon} alt="" referrerPolicy="no-referrer" />
                  ) : (
                    host(tile.url).charAt(0).toUpperCase()
                  )}
                </span>
                <span className="top-site-title">{tile.title || host(tile.url)}</span>
              </button>
            ))}
          </div>
        )}
        <section className="newtab-shortcuts" aria-label="Keyboard shortcuts">
          <header>
            <span className="codicon codicon-keyboard" aria-hidden="true" />
            <span>Keyboard shortcuts</span>
            <button
              type="button"
              className="link-button"
              onClick={() =>
                postToHost({ type: 'command', command: 'vscodeBrowser.editShortcuts' })
              }
            >
              Customize
            </button>
          </header>
          <ul>
            {TIPS.filter(([id]) => map[id]?.length).map(([id, label, icon]) => (
              <li key={id}>
                <span className={`codicon codicon-${icon}`} aria-hidden="true" />
                <span className="newtab-shortcut-label">{label}</span>
                <KeyCaps binding={map[id]![0]!} size="sm" />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
