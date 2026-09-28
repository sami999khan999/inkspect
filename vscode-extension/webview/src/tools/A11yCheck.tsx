import { useEffect, useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import type { Rect } from '@shared/protocol';
import { a11yReport, type A11yScan } from '@shared/tools';
import type { ViewportMapper } from '../components/Viewport';
import type { ShortcutHandlers } from '../shortcuts';
import { onHostMessage, postToHost } from '../vscode';
import { ModeHint } from './ModeHint';

/**
 * Accessibility check mode: scans the page (missing text alternatives, names and labels, low
 * contrast, tab order) and marks the issues over it, with a list to step through.
 */
export function A11yCheck({
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
  const [scan, setScan] = useState<A11yScan | null>(null);
  const [failed, setFailed] = useState(false);
  const [active, setActive] = useState(0);
  const [tabOrder, setTabOrder] = useState(false);
  const issues = scan?.issues ?? [];

  const rescan = () => {
    setFailed(false);
    postToHost({ type: 'a11yScan', tabId });
  };
  useEffect(() => {
    const off = onHostMessage((message) => {
      if (message.type !== 'a11yResult' || message.tabId !== tabId) return;
      setScan(message.scan ?? null);
      setFailed(!message.scan);
      setActive(0);
    });
    postToHost({ type: 'a11yScan', tabId });
    return off;
  }, [tabId]);

  const report = () => (scan ? a11yReport(scan) : '');
  useEffect(() => {
    const step = (delta: number) => () =>
      issues.length && setActive((i) => (i + delta + issues.length) % issues.length);
    onHandlers({
      'a11y.next': step(1),
      'a11y.previous': step(-1),
      'a11y.tabOrder': () => setTabOrder((on) => !on),
      'a11y.copy': () =>
        scan &&
        postToHost({
          type: 'copyText',
          text: report(),
          toast: 'Accessibility report copied',
          kind: 'report',
          label: 'Accessibility report',
        }),
      'a11y.agent': () =>
        scan &&
        postToHost({
          type: 'sendToAgent',
          text: report(),
          label: 'accessibility report',
          kind: 'report',
        }),
    });
  });

  /** Document CSS pixels → position in this layer. */
  const place = (r: Rect) => {
    const p = mapper.toLocal(r.x - mapper.scroll.x, r.y - mapper.scroll.y);
    return {
      left: p.x - mapper.bounds.left,
      top: p.y - mapper.bounds.top,
      width: Math.max(8, r.width * mapper.scale),
      height: Math.max(8, r.height * mapper.scale),
    };
  };
  const errors = issues.filter((i) => i.severity === 'error').length;

  return (
    <div className="a11y-layer" style={mapper.bounds}>
      {issues.map((issue, index) =>
        issue.rect.width || issue.rect.height ? (
          <button
            key={index}
            type="button"
            className={`a11y-marker ${issue.severity}${index === active ? ' active' : ''}`}
            style={place(issue.rect)}
            title={`${issue.message}: ${issue.element}`}
            aria-label={`${issue.message}: ${issue.element}`}
            onClick={() => setActive(index)}
          />
        ) : null,
      )}
      {tabOrder &&
        scan?.tabOrder.map((item, index) => {
          const box = place(item.rect);
          return (
            <span
              key={index}
              className="a11y-tab"
              style={{ left: box.left - 9, top: box.top - 9 }}
              title={item.element}
            >
              {index + 1}
            </span>
          );
        })}
      <aside className="a11y-panel" aria-label="Accessibility issues">
        <header className="a11y-panel-header">
          <span className="codicon codicon-accessibility" aria-hidden="true" />
          <strong>Accessibility</strong>
          {scan && (
            <span className="a11y-counts">
              <span className="badge danger">{errors}</span>
              <span className="badge">{issues.length - errors}</span>
            </span>
          )}
          <IconButton icon="refresh" label="Scan again" className="small" onClick={rescan} />
          <IconButton icon="close" label="Close" className="small" onClick={onExit} />
        </header>
        {!scan && !failed && <p className="a11y-empty">Scanning…</p>}
        {failed && <p className="a11y-empty">The page could not be scanned.</p>}
        {scan && !issues.length && (
          <p className="a11y-empty">
            <span className="codicon codicon-pass" aria-hidden="true" /> No issues found by the
            automatic checks.
          </p>
        )}
        <ol className="a11y-list">
          {issues.map((issue, index) => (
            <li key={index}>
              <button
                type="button"
                className={`a11y-item${index === active ? ' active' : ''}`}
                onClick={() => setActive(index)}
              >
                <span
                  className={`codicon codicon-${issue.severity === 'error' ? 'error' : 'warning'} ${issue.severity}`}
                  aria-hidden="true"
                />
                <span className="a11y-item-text">
                  {issue.message}
                  <code>{issue.element}</code>
                </span>
              </button>
            </li>
          ))}
        </ol>
        {scan && (
          <footer className="a11y-panel-footer">
            <Button
              size="sm"
              variant="ghost"
              icon={tabOrder ? 'eye-closed' : 'list-ordered'}
              onClick={() => setTabOrder((on) => !on)}
            >
              Tab order
            </Button>
            <span className="dev-spacer" />
            <Button
              size="sm"
              icon="copy"
              onClick={() =>
                postToHost({
                  type: 'copyText',
                  text: report(),
                  toast: 'Accessibility report copied',
                  kind: 'report',
                  label: 'Accessibility report',
                })
              }
            >
              Copy
            </Button>
            <Button
              size="sm"
              variant="primary"
              icon="sparkle"
              onClick={() =>
                postToHost({
                  type: 'sendToAgent',
                  text: report(),
                  label: 'accessibility report',
                  kind: 'report',
                })
              }
            >
              Send to agent
            </Button>
          </footer>
        )}
      </aside>
      <ModeHint scope="a11y" ids={['a11y.next', 'a11y.tabOrder', 'a11y.agent', 'a11y.exit']} />
    </div>
  );
}
