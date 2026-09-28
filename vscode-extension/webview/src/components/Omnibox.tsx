import { useEffect, useRef, useState } from 'react';
import type { Suggestion } from '@shared/history';
import type { SecurityState, TabState } from '@shared/protocol';
import { displayUrl } from '../format';
import { withShortcut } from '../shortcuts';
import { postToHost } from '../vscode';

const SECURITY_ICON: Record<SecurityState, { icon: string; label: string }> = {
  secure: { icon: 'lock', label: 'Connection is secure' },
  insecure: { icon: 'warning', label: 'Not secure' },
  neutral: { icon: 'info', label: 'Connection is not encrypted' },
  internal: { icon: 'home', label: 'Browser page' },
  unknown: { icon: 'globe', label: '' },
};

const SUGGESTION_ICON: Record<Suggestion['kind'], string> = {
  tab: 'window',
  bookmark: 'star-full',
  history: 'history',
  search: 'search',
  url: 'globe',
};

interface OmniboxProps {
  tab: TabState | undefined;
  /** Incremented to focus and select the address bar. */
  focusSignal: number;
  /** Suggestions the host returned for the latest query. */
  suggestions: { query: string; items: Suggestion[] };
  /** The star button was clicked (or Ctrl+D): edit or add the bookmark. */
  onStar: (anchor: DOMRect) => void;
  onDone: () => void;
}

export function Omnibox({ tab, focusSignal, suggestions, onStar, onDone }: OmniboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const starRef = useRef<HTMLButtonElement>(null);
  const shown = displayUrl(tab);
  const [text, setText] = useState(shown);
  const [editing, setEditing] = useState(false);
  const [lastShown, setLastShown] = useState(shown);
  const [selected, setSelected] = useState(-1);

  // Follow navigation unless the user is typing.
  if (shown !== lastShown) {
    setLastShown(shown);
    if (!editing) setText(shown);
  }

  useEffect(() => {
    if (!focusSignal) return;
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [focusSignal]);

  // Ask for suggestions as the user types.
  useEffect(() => {
    if (!editing) return;
    const timer = setTimeout(() => postToHost({ type: 'suggest', query: text }), 60);
    return () => clearTimeout(timer);
  }, [editing, text]);

  const items = editing && suggestions.query === text ? suggestions.items : [];

  const finish = () => {
    setEditing(false);
    setSelected(-1);
    inputRef.current?.blur();
    onDone();
  };

  const choose = (suggestion: Suggestion) => {
    if (!tab) return;
    if (suggestion.kind === 'tab' && suggestion.tabId) {
      postToHost({ type: 'focusTab', tabId: suggestion.tabId });
    } else {
      postToHost({ type: 'navigate', tabId: tab.id, input: suggestion.url });
    }
    finish();
  };

  const security = tab?.url.startsWith('file:')
    ? { icon: 'file', label: 'Local file' }
    : tab?.private
      ? { icon: 'eye-closed', label: 'Private tab: no history, separate cookies' }
      : SECURITY_ICON[tab?.security ?? 'unknown'];
  const canBookmark = !!tab && !tab.internalPage && /^(https?|file):/.test(tab.url);

  return (
    <form
      className="address-bar"
      onSubmit={(event) => {
        event.preventDefault();
        const suggestion = items[selected];
        if (suggestion) {
          choose(suggestion);
          return;
        }
        if (!tab || !text.trim()) return;
        postToHost({ type: 'navigate', tabId: tab.id, input: text });
        finish();
      }}
    >
      <span
        className={`codicon codicon-${security.icon} security-${tab?.security ?? 'unknown'}`}
        title={security.label}
        aria-label={security.label}
      />
      <input
        ref={inputRef}
        type="text"
        value={text}
        placeholder="Search or enter address"
        aria-label="Address and search bar"
        aria-autocomplete="list"
        aria-expanded={items.length > 0}
        spellCheck={false}
        autoComplete="off"
        onChange={(event) => {
          setEditing(true);
          setSelected(-1);
          setText(event.target.value);
        }}
        onFocus={(event) => event.target.select()}
        onBlur={() => {
          setEditing(false);
          setSelected(-1);
          setText(displayUrl(tab));
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            if (!items.length) return;
            event.preventDefault();
            const step = event.key === 'ArrowDown' ? 1 : -1;
            // -1 is the typed text itself; the selection wraps around through it.
            setSelected((index) => {
              const next = index + step;
              if (next < -1) return items.length - 1;
              return next >= items.length ? -1 : next;
            });
            return;
          }
          if (event.key !== 'Escape') return;
          event.preventDefault();
          if (items.length && editing) {
            setEditing(false);
            return;
          }
          setEditing(false);
          setText(displayUrl(tab));
          onDone();
        }}
      />
      {canBookmark && (
        <button
          ref={starRef}
          type="button"
          className={`icon-button star-button${tab.bookmarkId ? ' active' : ''}`}
          title={withShortcut(
            tab.bookmarkId ? 'Edit bookmark' : 'Bookmark this page',
            'page.bookmark',
          )}
          aria-label={tab.bookmarkId ? 'Edit bookmark' : 'Bookmark this page'}
          onClick={() => onStar(starRef.current!.getBoundingClientRect())}
        >
          <span
            className={`codicon codicon-${tab.bookmarkId ? 'star-full' : 'star-empty'}`}
            aria-hidden="true"
          />
        </button>
      )}
      {items.length > 0 && (
        <ul className="suggestions" role="listbox">
          {items.map((item, index) => (
            <li
              key={`${item.kind}:${item.tabId ?? item.url}`}
              role="option"
              aria-selected={index === selected}
              className={index === selected ? 'selected' : undefined}
              // Keep focus in the input so the list stays open until the click completes.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(item)}
            >
              <span
                className={`codicon codicon-${SUGGESTION_ICON[item.kind]}`}
                aria-hidden="true"
              />
              <span className="suggestion-title">{item.title}</span>
              <span className="suggestion-url">
                {item.kind === 'tab' ? 'Switch to tab' : item.url}
              </span>
            </li>
          ))}
        </ul>
      )}
    </form>
  );
}
