import { useEffect, useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { TextField } from '@inkspect/shared/ui/TextField';
import { cssChanges } from '@shared/tools';
import type { ViewportMapper } from '../components/Viewport';
import type { ShortcutHandlers } from '../shortcuts';
import { onHostMessage, postToHost } from '../vscode';
import { ModeHint } from './ModeHint';

interface Target {
  selector: string;
  /** Computed values when picked. */
  original: Record<string, string>;
  /** Values now (after edits). */
  current: Record<string, string>;
  /** Earlier values, for undo. */
  history: { property: string; value: string }[];
}

/**
 * CSS tweak mode: click an element, edit its styles live (applied inline in the page), then send
 * or copy the changes as a CSS rule. Leaving the mode puts the page back as it was.
 */
export function CssTweak({
  mapper,
  tabId,
  onHandlers,
  onExit,
}: {
  mapper: ViewportMapper;
  tabId: string;
  onHandlers: (handlers: ShortcutHandlers) => void;
  onExit: () => void;
}) {
  const [target, setTarget] = useState<Target | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [picking, setPicking] = useState(true);

  useEffect(() => {
    const off = onHostMessage((message) => {
      if (message.type === 'tweakTarget' && message.tabId === tabId) {
        setTarget(
          message.target
            ? {
                selector: message.target.selector,
                original: message.target.values,
                current: message.target.values,
                history: [],
              }
            : null,
        );
        setDrafts({});
        setPicking(!message.target);
      } else if (message.type === 'tweakValue' && message.tabId === tabId) {
        setTarget(
          (t) => t && { ...t, current: { ...t.current, [message.property]: message.value } },
        );
      }
    });
    // Leaving the mode (or the tab) reverts the page.
    return () => {
      off();
      postToHost({ type: 'tweak', tabId, action: 'restore' });
    };
  }, [tabId]);

  const set = (property: string, value: string, record = true) => {
    if (!target) return;
    if (record) {
      setTarget({
        ...target,
        history: [...target.history, { property, value: target.current[property] ?? '' }],
      });
    }
    postToHost({ type: 'tweak', tabId, action: 'set', property, value });
  };
  const changes = target ? cssChanges(target.selector, target.original, target.current) : '';

  useEffect(() => {
    onHandlers({
      'tweak.agent': () =>
        changes &&
        postToHost({
          type: 'sendToAgent',
          text: `Apply these CSS changes:\n\n${changes}`,
          label: 'CSS changes',
          kind: 'css',
        }),
      'tweak.copy': () =>
        changes &&
        postToHost({
          type: 'copyText',
          text: changes,
          toast: 'CSS changes copied',
          kind: 'css',
          label: 'CSS changes',
        }),
      'tweak.undo': () => {
        const last = target?.history.at(-1);
        if (!target || !last) return;
        setTarget({ ...target, history: target.history.slice(0, -1) });
        set(last.property, last.value, false);
      },
    });
  });

  return (
    <>
      {picking && (
        <div
          className="tweak-pick"
          style={mapper.bounds}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            const rect = event.currentTarget.getBoundingClientRect();
            const page = mapper.toPage(
              event.clientX - rect.left + mapper.bounds.left,
              event.clientY - rect.top + mapper.bounds.top,
            );
            postToHost({ type: 'tweak', tabId, action: 'pick', x: page.x, y: page.y });
          }}
        >
          <ModeHint scope="tweak" ids={['tweak.exit']}>
            Click the element to restyle
          </ModeHint>
        </div>
      )}
      {target && (
        <aside className="tweak-panel" aria-label="CSS tweak">
          <header className="a11y-panel-header">
            <span className="codicon codicon-symbol-color" aria-hidden="true" />
            <code className="tweak-selector" title={target.selector}>
              {target.selector}
            </code>
            <IconButton
              icon="inspect"
              label="Pick another element"
              className="small"
              active={picking}
              onClick={() => setPicking(true)}
            />
            <IconButton icon="close" label="Close and revert" className="small" onClick={onExit} />
          </header>
          <div className="tweak-list">
            {Object.keys(target.original).map((property) => {
              const changed = target.current[property] !== target.original[property];
              return (
                <label key={property} className={`tweak-row${changed ? ' changed' : ''}`}>
                  <span className="tweak-property">{property}</span>
                  <TextField
                    size="sm"
                    value={drafts[property] ?? target.current[property] ?? ''}
                    onChange={(event) => setDrafts({ ...drafts, [property]: event.target.value })}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') event.currentTarget.blur();
                    }}
                    onBlur={() => {
                      const value = drafts[property];
                      if (value === undefined) return;
                      const next = { ...drafts };
                      delete next[property];
                      setDrafts(next);
                      if (value !== target.current[property]) set(property, value);
                    }}
                  />
                </label>
              );
            })}
          </div>
          <footer className="a11y-panel-footer">
            <span className="muted tweak-count">
              {changes ? `${changes.split('\n').length - 3} changed` : 'No changes yet'}
            </span>
            <span className="dev-spacer" />
            <Button
              size="sm"
              icon="copy"
              disabled={!changes}
              onClick={() =>
                postToHost({
                  type: 'copyText',
                  text: changes,
                  toast: 'CSS changes copied',
                  kind: 'css',
                  label: 'CSS changes',
                })
              }
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon="sparkle"
              disabled={!changes}
              onClick={() =>
                postToHost({
                  type: 'sendToAgent',
                  text: `Apply these CSS changes:\n\n${changes}`,
                  label: 'CSS changes',
                  kind: 'css',
                })
              }
            >
              Send to agent
            </Button>
          </footer>
        </aside>
      )}
    </>
  );
}
