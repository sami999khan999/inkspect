import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { ShortcutList } from '@inkspect/shared/ui/ShortcutList';
import { TextField } from '@inkspect/shared/ui/TextField';
import {
  effectiveShortcuts,
  SCOPE_LABELS,
  SHORTCUT_ACTIONS,
  type ShortcutOverrides,
  type ShortcutScope,
} from '@shared/shortcuts';
import type { HostToShortcutsView, ShortcutsViewToHost } from '@shared/shortcutsView';

interface VsCodeApi {
  postMessage(message: ShortcutsViewToHost): void;
}
declare function acquireVsCodeApi(): VsCodeApi;
const vscode = acquireVsCodeApi();
const post = (message: ShortcutsViewToHost) => vscode.postMessage(message);

const isMac = navigator.userAgent.includes('Macintosh');
const SCOPES = Object.keys(SCOPE_LABELS) as ShortcutScope[];

/** The Shortcuts view: every browser action grouped by mode, each with its keys. */
export function ShortcutsApp() {
  const [state, setState] = useState<HostToShortcutsView | null>(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onMessage = (event: MessageEvent<HostToShortcutsView>) => {
      if (event.data?.type === 'state') setState(event.data);
    };
    window.addEventListener('message', onMessage);
    post({ type: 'ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const overrides: ShortcutOverrides = useMemo(() => state?.overrides ?? {}, [state]);
  const map = useMemo(() => effectiveShortcuts(overrides, isMac), [overrides]);
  const setKeys = useCallback((id: string, keys: string[]) => post({ type: 'set', id, keys }), []);

  const changed = Object.keys(overrides).length;
  return (
    <div className="shortcuts">
      <header className="shortcuts-header">
        <TextField
          size="sm"
          icon="search"
          placeholder="Search actions or keys"
          aria-label="Search shortcuts"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
        />
        <IconButton
          icon="cloud-upload"
          label="Export shortcuts…"
          className="small"
          onClick={() => post({ type: 'export' })}
        />
        <IconButton
          icon="cloud-download"
          label="Import shortcuts…"
          className="small"
          onClick={() => post({ type: 'import' })}
        />
        <IconButton
          icon="discard"
          label="Reset all shortcuts"
          className="small"
          disabled={!changed}
          onClick={() => post({ type: 'resetAll' })}
        />
      </header>
      <div className="shortcuts-status">
        <span className="codicon codicon-cloud" aria-hidden="true" />
        <span className="status-text">
          <strong>{changed ? `${changed} changed` : 'Default shortcuts'}</strong>
          <span>
            Synced by Settings Sync
            {state?.browserLinked ? ' and your linked browser' : ''}
            {state && state.updated > 1e12 ? ` · changed ${timeAgo(state.updated)}` : ''}
          </span>
        </span>
        <span
          className={`status-pill${state?.browserLinked ? ' on' : ''}`}
          title={
            state?.browserLinked
              ? 'The Inkspect browser extension is linked: shortcuts also sync through your browser account.'
              : 'Pair the Inkspect browser extension to sync shortcuts through your browser account too.'
          }
        >
          <span className="codicon codicon-link" aria-hidden="true" />
          {state?.browserLinked ? 'Browser' : 'No browser'}
        </span>
      </div>
      <ShortcutList
        actions={SHORTCUT_ACTIONS}
        scopes={SCOPES}
        map={map}
        overrides={overrides}
        query={query}
        onSetKeys={setKeys}
        onReset={(id) => post({ type: 'reset', id })}
      />
    </div>
  );
}

/** "just now", "5 minutes ago", "3 days ago". */
function timeAgo(time: number): string {
  const seconds = Math.max(0, (Date.now() - time) / 1000);
  const units: [number, string][] = [
    [86_400, 'day'],
    [3_600, 'hour'],
    [60, 'minute'],
  ];
  for (const [size, name] of units) {
    const n = Math.floor(seconds / size);
    if (n >= 1) return `${n} ${name}${n === 1 ? '' : 's'} ago`;
  }
  return 'just now';
}
