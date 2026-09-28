import { useEffect, useMemo, useState } from 'react';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { TextField } from '@inkspect/shared/ui/TextField';
import {
  chordFromEvent,
  chordKey,
  defaultKeys,
  effectiveShortcuts,
  findConflicts,
  formatKey,
  MODIFIER_KEYS,
  SCOPE_ICONS,
  SCOPE_LABELS,
  SHORTCUT_ACTIONS,
  type ShortcutAction,
  type ShortcutOverrides,
  type ShortcutScope,
} from '@shared/shortcuts';
import type { HostToShortcutsView, ShortcutsViewToHost } from '@shared/shortcutsView';
import { KeyCaps } from '../components/KeyCaps';

interface VsCodeApi {
  postMessage(message: ShortcutsViewToHost): void;
}
declare function acquireVsCodeApi(): VsCodeApi;
const vscode = acquireVsCodeApi();
const post = (message: ShortcutsViewToHost) => vscode.postMessage(message);

const isMac = navigator.userAgent.includes('Macintosh');
const SCOPES = Object.keys(SCOPE_LABELS) as ShortcutScope[];

/** Which key is being recorded: a new key for an action, or a replacement for one of its keys. */
interface Recording {
  id: string;
  /** Index of the key being replaced; undefined adds a key. */
  index?: number;
}

/** The Shortcuts view: every browser action grouped by mode, each with its keys. */
export function ShortcutsApp() {
  const [state, setState] = useState<HostToShortcutsView | null>(null);
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<ShortcutScope>>(new Set());
  const [recording, setRecording] = useState<Recording | null>(null);

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
  const conflicts = useMemo(() => findConflicts(map), [map]);
  const conflictsOf = (id: string) =>
    conflicts
      .filter((c) => c.ids.includes(id))
      .map((c) => ({ key: c.key, other: c.ids.find((x) => x !== id)! }));

  const setKeys = (id: string, keys: string[]) => post({ type: 'set', id, keys });

  // Recording: the next key press (with its modifiers) becomes the shortcut.
  useEffect(() => {
    if (!recording) return;
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopPropagation();
      if (MODIFIER_KEYS.has(event.key)) return;
      const chord = chordFromEvent(event);
      const plain = !chord.ctrl && !chord.alt && !chord.meta && !chord.shift;
      const keys = [...(map[recording.id] ?? [])];
      if (plain && chord.key === 'escape') {
        setRecording(null);
        return;
      }
      if (plain && chord.key === 'backspace' && recording.index !== undefined) {
        keys.splice(recording.index, 1);
      } else {
        const key = chordKey(chord);
        if (recording.index === undefined) keys.push(key);
        else keys[recording.index] = key;
      }
      setKeys(recording.id, [...new Set(keys)]);
      setRecording(null);
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [recording, map]);

  const needle = query.trim().toLowerCase();
  const matches = (action: ShortcutAction) =>
    !needle ||
    action.label.toLowerCase().includes(needle) ||
    action.id.toLowerCase().includes(needle) ||
    SCOPE_LABELS[action.scope].toLowerCase().includes(needle) ||
    (map[action.id] ?? []).some((k) => formatKey(k, isMac).toLowerCase().includes(needle));

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
      {conflicts.length > 0 && (
        <p className="shortcuts-warning" role="alert">
          <span className="codicon codicon-warning" aria-hidden="true" />
          {conflicts.length === 1 ? '1 key is' : `${conflicts.length} keys are`} used twice.
        </p>
      )}
      {SCOPES.map((scope) => {
        const actions = SHORTCUT_ACTIONS.filter((a) => a.scope === scope && matches(a));
        if (!actions.length) return null;
        const open = needle !== '' || !collapsed.has(scope);
        return (
          <section key={scope} className="shortcut-group">
            <button
              type="button"
              className="group-header"
              aria-expanded={open}
              onClick={() =>
                setCollapsed((current) => {
                  const next = new Set(current);
                  if (next.has(scope)) next.delete(scope);
                  else next.add(scope);
                  return next;
                })
              }
            >
              <span
                className={`codicon codicon-chevron-${open ? 'down' : 'right'}`}
                aria-hidden="true"
              />
              <span
                className={`codicon codicon-${SCOPE_ICONS[scope]} group-icon`}
                aria-hidden="true"
              />
              <span className="group-title">{SCOPE_LABELS[scope]}</span>
              <span className="group-count">{actions.length}</span>
            </button>
            {open &&
              actions.map((action) => (
                <ShortcutRow
                  key={action.id}
                  action={action}
                  keys={map[action.id] ?? []}
                  changed={action.id in overrides}
                  conflicts={conflictsOf(action.id)}
                  recording={recording?.id === action.id ? recording : null}
                  onRecord={(index) => setRecording({ id: action.id, index })}
                  onCancel={() => setRecording(null)}
                  onRemove={(index) =>
                    setKeys(
                      action.id,
                      (map[action.id] ?? []).filter((_, i) => i !== index),
                    )
                  }
                  onReset={() => post({ type: 'reset', id: action.id })}
                  onResolve={(other, key) =>
                    setKeys(
                      other,
                      (map[other] ?? []).filter((k) => k !== key),
                    )
                  }
                />
              ))}
          </section>
        );
      })}
    </div>
  );
}

function ShortcutRow({
  action,
  keys,
  changed,
  conflicts,
  recording,
  onRecord,
  onCancel,
  onRemove,
  onReset,
  onResolve,
}: {
  action: ShortcutAction;
  keys: string[];
  changed: boolean;
  conflicts: { key: string; other: string }[];
  recording: Recording | null;
  onRecord: (index?: number) => void;
  onCancel: () => void;
  onRemove: (index: number) => void;
  onReset: () => void;
  onResolve: (other: string, key: string) => void;
}) {
  const defaults =
    defaultKeys(action, isMac)
      .map((k) => formatKey(k, isMac))
      .join(', ') || 'none';
  const label = (id: string) => SHORTCUT_ACTIONS.find((a) => a.id === id)?.label ?? id;
  const adding = recording !== null && recording.index === undefined;
  return (
    <div
      className={`shortcut-item${changed ? ' changed' : ''}${conflicts.length ? ' conflict' : ''}`}
    >
      <div className="shortcut-main">
        <span className="shortcut-label" title={action.id}>
          {action.label}
        </span>
        <span className="shortcut-actions">
          {changed && (
            <IconButton
              icon="discard"
              label={`Reset to default (${defaults})`}
              className="small"
              onClick={onReset}
            />
          )}
          {keys.length > 0 && !adding && (
            <IconButton
              icon="add"
              label="Add another key"
              className="small add-key"
              onClick={() => onRecord()}
            />
          )}
        </span>
        <span className="shortcut-keys-column">
          {keys.map((key, index) =>
            recording?.index === index ? (
              <RecordingChip key={key} onCancel={onCancel} />
            ) : (
              <span key={key} className="key-button-wrap">
                <button
                  type="button"
                  className="key-button"
                  title="Change: click, then press the new keys"
                  aria-label={`${formatKey(key, isMac)}: change`}
                  onClick={() => onRecord(index)}
                >
                  <KeyCaps binding={key} size="sm" />
                </button>
                <button
                  type="button"
                  className="key-remove"
                  aria-label={`Remove ${formatKey(key, isMac)}`}
                  title="Remove this key"
                  onClick={() => onRemove(index)}
                >
                  <span className="codicon codicon-close" aria-hidden="true" />
                </button>
              </span>
            ),
          )}
          {adding && <RecordingChip onCancel={onCancel} />}
          {!keys.length && !adding && (
            <button
              type="button"
              className="key-empty"
              title="Add a key: click, then press the keys"
              onClick={() => onRecord()}
            >
              <span className="codicon codicon-add" aria-hidden="true" />
              Add key
            </button>
          )}
        </span>
      </div>
      {conflicts.map(({ key, other }) => (
        <div key={`${key}-${other}`} className="shortcut-conflict">
          <span className="codicon codicon-warning" aria-hidden="true" />
          <span>
            {formatKey(key, isMac)} is also “{label(other)}”
          </span>
          <button type="button" className="link-button" onClick={() => onResolve(other, key)}>
            Remove it there
          </button>
        </div>
      ))}
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

function RecordingChip({ onCancel }: { onCancel: () => void }) {
  return (
    <span className="key-recording" role="status">
      <span className="recording-dot" aria-hidden="true" />
      Press keys…
      <button type="button" className="key-recording-cancel" aria-label="Cancel" onClick={onCancel}>
        <span className="codicon codicon-close" aria-hidden="true" />
      </button>
    </span>
  );
}
