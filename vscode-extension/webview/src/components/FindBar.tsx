import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { TextField } from '@inkspect/shared/ui/TextField';
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
      <TextField
        ref={inputRef}
        size="sm"
        icon="search"
        className="find-input"
        value={query}
        placeholder="Find in page"
        aria-label="Find in page"
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
        trailing={
          <>
            <span className="find-count" aria-live="polite">
              {query ? (result?.count ? `${result.index} of ${result.count}` : 'No results') : ''}
            </span>
            <IconButton
              icon="case-sensitive"
              label="Match case"
              className="find-option"
              active={caseSensitive}
              onClick={() => setCaseSensitive(!caseSensitive)}
            />
          </>
        }
      />
      <IconButton
        icon="arrow-up"
        label="Previous match (Shift+Enter)"
        className="small"
        disabled={!result?.count}
        onClick={() => step('previous')}
      />
      <IconButton
        icon="arrow-down"
        label="Next match (Enter)"
        className="small"
        disabled={!result?.count}
        onClick={() => step('next')}
      />
      <IconButton icon="close" label="Close (Escape)" className="small" onClick={close} />
    </div>
  );
}
