import { useEffect, useRef, useState } from 'react';
import { postToHost } from '../vscode';

interface FindBarProps {
  tabId: string;
  result?: { index: number; count: number };
  /** Incremented to focus the search field again (Ctrl+F while open). */
  focusSignal: number;
  onClose: () => void;
}

export function FindBar({ tabId, result, focusSignal, onClose }: FindBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, [focusSignal]);

  // Search as you type.
  useEffect(() => {
    const timer = setTimeout(
      () => postToHost({ type: 'find', tabId, query, caseSensitive, direction: 'restart' }),
      120,
    );
    return () => clearTimeout(timer);
  }, [tabId, query, caseSensitive]);

  const step = (direction: 'next' | 'previous') =>
    postToHost({ type: 'find', tabId, query, caseSensitive, direction });

  const close = () => {
    postToHost({ type: 'stopFind', tabId });
    onClose();
  };

  return (
    <div className="find-bar" role="search">
      <input
        ref={inputRef}
        type="text"
        value={query}
        placeholder="Find in page"
        aria-label="Find in page"
        spellCheck={false}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            step(event.shiftKey ? 'previous' : 'next');
          } else if (event.key === 'Escape') {
            event.preventDefault();
            close();
          }
        }}
      />
      <span className="find-count" aria-live="polite">
        {query ? (result?.count ? `${result.index} of ${result.count}` : 'No results') : ''}
      </span>
      <button
        type="button"
        className={`icon-button${caseSensitive ? ' active' : ''}`}
        title="Match case"
        aria-label="Match case"
        aria-pressed={caseSensitive}
        onClick={() => setCaseSensitive(!caseSensitive)}
      >
        <span className="codicon codicon-case-sensitive" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="icon-button"
        title="Previous match (Shift+Enter)"
        aria-label="Previous match"
        disabled={!result?.count}
        onClick={() => step('previous')}
      >
        <span className="codicon codicon-arrow-up" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="icon-button"
        title="Next match (Enter)"
        aria-label="Next match"
        disabled={!result?.count}
        onClick={() => step('next')}
      >
        <span className="codicon codicon-arrow-down" aria-hidden="true" />
      </button>
      <button
        type="button"
        className="icon-button"
        title="Close (Escape)"
        aria-label="Close find bar"
        onClick={close}
      >
        <span className="codicon codicon-close" aria-hidden="true" />
      </button>
    </div>
  );
}
