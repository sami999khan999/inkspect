import { useEffect, useMemo, useState } from 'react';
import {
  chordFromEvent,
  chordKey,
  defaultKeys,
  findConflicts,
  formatKey,
  keyMatchesQuery,
  MODIFIER_KEYS,
  SCOPE_ICONS,
  SCOPE_LABELS,
  shortcutPlaces,
  type ShortcutAction,
  type ShortcutMap,
  type ShortcutOverrides,
  type ShortcutScope,
} from '../shortcuts';
import { IconButton } from './IconButton';
import { KeyCaps } from './KeyCaps';

const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

/** Which key is being recorded: a new key for an action, or a replacement for one of its keys. */
interface Recording {
  id: string;
  /** Index of the key being replaced; undefined adds a key. */
  index?: number;
}

interface ShortcutListProps {
  /** The actions to list, in their groups. */
  actions: readonly ShortcutAction[];
  /** Groups, in order. */
  scopes: readonly ShortcutScope[];
  map: ShortcutMap;
  overrides: ShortcutOverrides;
  /** Filters actions by label, id, group or key ("alt shift k" finds Alt+Shift+K). */
  query?: string;
  /** Names an action (defaults to its label). */
  labelOf?: (action: ShortcutAction) => string;
  /** Names a group (defaults to `SCOPE_LABELS`). */
  scopeLabel?: (scope: ShortcutScope) => string;
  onSetKeys: (id: string, keys: string[]) => void;
  onReset: (id: string) => void;
}

/**
 * The shortcut editor: actions grouped by mode, each with its keys as key caps. Click a key and
 * press the new one (Esc cancels, Backspace removes); + adds another key; changed actions can be
 * reset; keys used twice are flagged, with a one-click fix. Used by VS Code Browser's Shortcuts
 * view and the browser extension's toolbar and settings page.
 */
export function ShortcutList({
  actions,
  scopes,
  map,
  overrides,
  query = '',
  labelOf = (action) => action.label,
  scopeLabel = (scope) => SCOPE_LABELS[scope],
  onSetKeys,
  onReset,
}: ShortcutListProps) {
  const [collapsed, setCollapsed] = useState<Set<ShortcutScope>>(new Set());
  const [recording, setRecording] = useState<Recording | null>(null);
  const shown = useMemo(() => new Set(actions.map((a) => a.id)), [actions]);
  const conflicts = useMemo(
    () => findConflicts(map).filter((c) => c.ids.every((id) => shown.has(id))),
    [map, shown],
  );
  const conflictsOf = (id: string) =>
    conflicts
      .filter((c) => c.ids.includes(id))
      .map((c) => ({ key: c.key, other: c.ids.find((x) => x !== id)! }));

  // Recording: the next key press (with its modifiers) becomes the shortcut.
  useEffect(() => {
    if (!recording) return;
    const onKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (MODIFIER_KEYS.has(event.key)) return;
      const chord = chordFromEvent(event);
      // AltGr typing is no key (see chordFromEvent).
      if (!chord.key) return;
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
      onSetKeys(recording.id, [...new Set(keys)]);
      setRecording(null);
    };
    // A press anywhere else ends the recording: the next key, much later, must not become a
    // shortcut by accident.
    const onPointerDown = (event: PointerEvent) => {
      const onChip = event
        .composedPath()
        .some(
          (target) => target instanceof HTMLElement && target.classList.contains('key-recording'),
        );
      if (!onChip) setRecording(null);
    };
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [recording, map, onSetKeys]);

  const needle = query.trim().toLowerCase();
  const matches = (action: ShortcutAction) =>
    !needle ||
    labelOf(action).toLowerCase().includes(needle) ||
    action.id.toLowerCase().includes(needle) ||
    scopeLabel(action.scope).toLowerCase().includes(needle) ||
    (map[action.id] ?? []).some(
      (k) => formatKey(k, isMac).toLowerCase().includes(needle) || keyMatchesQuery(k, needle),
    );
  const nameOf = (id: string) => {
    const action = actions.find((a) => a.id === id);
    return action ? labelOf(action) : id;
  };

  return (
    <div className="shortcut-list">
      {conflicts.length > 0 && (
        <p className="shortcuts-warning" role="alert">
          <span className="codicon codicon-warning" aria-hidden="true" />
          {conflicts.length === 1 ? '1 key is' : `${conflicts.length} keys are`} used twice.
        </p>
      )}
      {scopes.map((scope) => {
        const inScope = actions.filter((a) => a.scope === scope && matches(a));
        if (!inScope.length) return null;
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
              <span className="group-title">{scopeLabel(scope)}</span>
              <span className="group-count">{inScope.length}</span>
            </button>
            {open &&
              inScope.map((action) => (
                <ShortcutRow
                  key={action.id}
                  action={action}
                  label={labelOf(action)}
                  keys={map[action.id] ?? []}
                  changed={action.id in overrides}
                  conflicts={conflictsOf(action.id).map((c) => ({
                    ...c,
                    otherLabel: nameOf(c.other),
                  }))}
                  recording={recording?.id === action.id ? recording : null}
                  onRecord={(index) => setRecording({ id: action.id, index })}
                  onCancel={() => setRecording(null)}
                  onRemove={(index) =>
                    onSetKeys(
                      action.id,
                      (map[action.id] ?? []).filter((_, i) => i !== index),
                    )
                  }
                  onReset={() => onReset(action.id)}
                  onResolve={(other, key) =>
                    onSetKeys(
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
  label,
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
  label: string;
  keys: string[];
  changed: boolean;
  conflicts: { key: string; other: string; otherLabel: string }[];
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
  const adding = recording !== null && recording.index === undefined;
  return (
    <div
      className={`shortcut-item${changed ? ' changed' : ''}${conflicts.length ? ' conflict' : ''}`}
    >
      <div className="shortcut-main">
        <span className="shortcut-label" title={action.id}>
          {label}
        </span>
        {/* Where the key works: VS (VS Code Browser), BR (the browser toolbar). */}
        <span className="shortcut-places">
          {shortcutPlaces(action).map((place) => (
            <span key={place.id} className={`shortcut-tag ${place.id}`} title={place.title}>
              {place.label}
            </span>
          ))}
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
      {conflicts.map(({ key, other, otherLabel }) => (
        <div key={`${key}-${other}`} className="shortcut-conflict">
          <span className="codicon codicon-warning" aria-hidden="true" />
          <span>
            {formatKey(key, isMac)} is also “{otherLabel}”
          </span>
          <button type="button" className="link-button" onClick={() => onResolve(other, key)}>
            Remove it there
          </button>
        </div>
      ))}
    </div>
  );
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
