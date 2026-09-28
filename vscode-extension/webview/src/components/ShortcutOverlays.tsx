import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { TextField } from '@inkspect/shared/ui/TextField';
import { SCOPE_LABELS, SHORTCUT_ACTIONS, formatKey, type ShortcutScope } from '@shared/shortcuts';
import { isMac, scopeShortcuts, useShortcutMap } from '../shortcuts';
import { postToHost } from '../vscode';

/** Closes an overlay on Escape or a click outside its card. */
function useClose(onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, [onClose]);
  return ref;
}

function Keys({ keys }: { keys: string[] }) {
  if (!keys.length) return <span className="muted shortcut-none">—</span>;
  return (
    <span className="shortcut-keys">
      {keys.map((key) => (
        <kbd key={key}>{key}</kbd>
      ))}
    </span>
  );
}

/** The keys of the current mode (or of the browser), and the keys that turn modes on. */
export function CheatSheet({ scope, onClose }: { scope: ShortcutScope; onClose: () => void }) {
  useShortcutMap();
  const ref = useClose(onClose);
  const modeKeys = scopeShortcuts('global').filter((a) => a.id.startsWith('mode.'));
  const sections: { title: string; items: ReturnType<typeof scopeShortcuts> }[] =
    scope === 'global'
      ? [
          { title: 'Modes', items: modeKeys },
          {
            title: 'Browser',
            items: scopeShortcuts('global').filter((a) => !a.id.startsWith('mode.')),
          },
        ]
      : [
          { title: SCOPE_LABELS[scope], items: scopeShortcuts(scope) },
          { title: 'Modes', items: modeKeys },
        ];
  return (
    <div
      className="shortcut-overlay"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={ref} className="shortcut-card" role="dialog" aria-label="Keyboard shortcuts">
        <header className="shortcut-card-header">
          <span className="codicon codicon-keyboard" aria-hidden="true" />
          <h2>{scope === 'global' ? 'Keyboard shortcuts' : `${SCOPE_LABELS[scope]} shortcuts`}</h2>
          <Button
            size="sm"
            variant="ghost"
            icon="edit"
            onClick={() => {
              onClose();
              postToHost({ type: 'command', command: 'vscodeBrowser.editShortcuts' });
            }}
          >
            Change shortcuts
          </Button>
        </header>
        <div className="shortcut-columns">
          {sections.map((section) => (
            <section key={section.title}>
              <h3>{section.title}</h3>
              <dl>
                {section.items.map((item) => (
                  <div key={item.id} className="shortcut-row">
                    <dt>{item.label}</dt>
                    <dd>
                      <Keys keys={item.keys} />
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Ctrl+K: every browser action, searchable, with its shortcut. */
export function QuickActions({
  scope,
  run,
  onClose,
}: {
  scope: ShortcutScope;
  run: (id: string) => void;
  onClose: () => void;
}) {
  const map = useShortcutMap();
  const ref = useClose(onClose);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const actions = useMemo(
    () =>
      SHORTCUT_ACTIONS.filter(
        (a) =>
          (a.scope === 'global' || a.scope === scope) &&
          !a.id.endsWith('.help') &&
          a.id !== 'open.quickActions',
      ),
    [scope],
  );
  const needle = query.trim().toLowerCase();
  const matches = actions.filter(
    (a) =>
      !needle ||
      a.label.toLowerCase().includes(needle) ||
      SCOPE_LABELS[a.scope].toLowerCase().includes(needle),
  );
  const current = Math.min(active, Math.max(0, matches.length - 1));

  useEffect(() => {
    list.current?.querySelector(`[data-index="${current}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [current]);

  const choose = (id: string | undefined) => {
    if (!id) return;
    onClose();
    run(id);
  };

  return (
    <div
      className="shortcut-overlay top"
      onPointerDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div ref={ref} className="quick-actions" role="dialog" aria-label="Quick actions">
        <TextField
          size="lg"
          icon="search"
          autoFocus
          placeholder="Type an action…"
          aria-label="Search actions"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActive(0);
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
              event.preventDefault();
              const delta = event.key === 'ArrowDown' ? 1 : -1;
              setActive((current + delta + matches.length) % Math.max(1, matches.length));
            } else if (event.key === 'Enter') {
              event.preventDefault();
              choose(matches[current]?.id);
            }
          }}
        />
        <div ref={list} className="quick-list" role="listbox" aria-label="Actions">
          {matches.map((action, index) => (
            <div
              key={action.id}
              data-index={index}
              role="option"
              aria-selected={index === current}
              className={`quick-item${index === current ? ' active' : ''}`}
              onPointerMove={() => setActive(index)}
              onClick={() => choose(action.id)}
            >
              <span className="quick-label">{action.label}</span>
              {action.scope !== 'global' && (
                <span className="badge outline">{SCOPE_LABELS[action.scope]}</span>
              )}
              <Keys keys={(map[action.id] ?? []).map((k) => formatKey(k, isMac))} />
            </div>
          ))}
          {!matches.length && <p className="quick-empty">No matching actions.</p>}
        </div>
      </div>
    </div>
  );
}
