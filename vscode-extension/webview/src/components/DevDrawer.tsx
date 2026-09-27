import { useState } from 'react';
import { isFailedRequest, type ConsoleEntry, type NetworkEntry } from '@shared/devtools';
import { formatBytes } from '../format';
import { postToHost } from '../vscode';

interface DevDrawerProps {
  tabId: string;
  console: ConsoleEntry[];
  network: NetworkEntry[];
  height: number;
  onResize: (height: number) => void;
  onClose: () => void;
}

const LEVEL_ICON: Record<ConsoleEntry['level'], string> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  debug: 'debug',
};

function shortUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.pathname.split('/').pop() || parsed.host}${parsed.search ? '?…' : ''}`;
  } catch {
    return url.split('/').pop() ?? url;
  }
}

/** Console and network log docked under the page, with "copy for AI" summaries. */
export function DevDrawer({ tabId, console, network, height, onResize, onClose }: DevDrawerProps) {
  const [view, setView] = useState<'console' | 'network'>('console');
  const [level, setLevel] = useState<'all' | 'error' | 'warning'>('all');
  const [filter, setFilter] = useState('');
  const [failedOnly, setFailedOnly] = useState(false);
  const action = (
    name: 'clear' | 'copyErrors' | 'copyFailedRequests' | 'copyContext' | 'openDevTools',
    chat = false,
  ) => postToHost({ type: 'devAction', tabId, action: name, chat });
  const needle = filter.trim().toLowerCase();

  const logs = console.filter(
    (e) =>
      (level === 'all' || e.level === level || (level === 'warning' && e.level === 'error')) &&
      (!needle ||
        e.text.toLowerCase().includes(needle) ||
        (e.url ?? '').toLowerCase().includes(needle)),
  );
  const requests = network.filter(
    (r) => (!failedOnly || isFailedRequest(r)) && (!needle || r.url.toLowerCase().includes(needle)),
  );
  const errors = console.filter((e) => e.level === 'error').length;
  const failures = network.filter(isFailedRequest).length;

  return (
    <div className="dev-drawer" style={{ height }}>
      <div
        className="dev-resize"
        role="separator"
        aria-orientation="horizontal"
        aria-label="Resize"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          const startY = event.clientY;
          const startHeight = height;
          const move = (e: PointerEvent) =>
            onResize(Math.max(100, Math.min(innerHeight - 150, startHeight + startY - e.clientY)));
          const up = () => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
          };
          window.addEventListener('pointermove', move);
          window.addEventListener('pointerup', up);
        }}
      />
      <div className="dev-toolbar">
        <div className="dev-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={view === 'console'}
            className={view === 'console' ? 'active' : ''}
            onClick={() => setView('console')}
          >
            Console {errors > 0 && <span className="dev-count error">{errors}</span>}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === 'network'}
            className={view === 'network' ? 'active' : ''}
            onClick={() => setView('network')}
          >
            Network {failures > 0 && <span className="dev-count error">{failures}</span>}
          </button>
        </div>
        <input
          type="search"
          placeholder="Filter"
          aria-label="Filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        />
        {view === 'console' ? (
          <select
            value={level}
            aria-label="Level"
            onChange={(event) => setLevel(event.target.value as typeof level)}
          >
            <option value="all">All levels</option>
            <option value="warning">Warnings and errors</option>
            <option value="error">Errors</option>
          </select>
        ) : (
          <label className="toggle">
            <input
              type="checkbox"
              checked={failedOnly}
              onChange={(event) => setFailedOnly(event.target.checked)}
            />
            Failed only
          </label>
        )}
        <span className="dev-spacer" />
        <button
          type="button"
          className="button secondary small"
          title="Copy console errors as Markdown"
          onClick={() => action('copyErrors')}
        >
          Copy errors
        </button>
        <button
          type="button"
          className="button secondary small"
          title="Copy failed requests as Markdown"
          onClick={() => action('copyFailedRequests')}
        >
          Copy failed requests
        </button>
        <button
          type="button"
          className="button primary small"
          title="URL, viewport, selection, recent errors and failed requests"
          onClick={() => action('copyContext')}
        >
          Copy page context
        </button>
        <button
          type="button"
          className="icon-button"
          title="Send page context to chat"
          aria-label="Send page context to chat"
          onClick={() => action('copyContext', true)}
        >
          <span className="codicon codicon-comment-discussion" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title="Clear"
          aria-label="Clear"
          onClick={() => action('clear')}
        >
          <span className="codicon codicon-clear-all" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title="Open DevTools (F12)"
          aria-label="Open DevTools"
          onClick={() => action('openDevTools')}
        >
          <span className="codicon codicon-tools" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title="Close"
          aria-label="Close"
          onClick={onClose}
        >
          <span className="codicon codicon-close" aria-hidden="true" />
        </button>
      </div>
      <div className="dev-content">
        {view === 'console' ? (
          logs.length ? (
            logs.map((entry) => (
              <div key={entry.id} className={`dev-row level-${entry.level}`}>
                <span className={`codicon codicon-${LEVEL_ICON[entry.level]}`} aria-hidden="true" />
                <span className="dev-text">{entry.text}</span>
                {entry.url && (
                  <button
                    type="button"
                    className="link-button dev-source"
                    title={entry.url}
                    onClick={() =>
                      postToHost({
                        type: 'openSource',
                        url: entry.url!,
                        line: entry.line,
                        column: entry.column,
                      })
                    }
                  >
                    {shortUrl(entry.url)}
                    {entry.line !== undefined ? `:${entry.line + 1}` : ''}
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="muted dev-empty">No console messages.</p>
          )
        ) : requests.length ? (
          <table className="dev-network">
            <thead>
              <tr>
                <th>Status</th>
                <th>Method</th>
                <th>Name</th>
                <th>Type</th>
                <th>Size</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr
                  key={request.id}
                  className={isFailedRequest(request) ? 'failed' : undefined}
                  title={request.url}
                >
                  <td>
                    {request.error
                      ? request.canceled
                        ? 'canceled'
                        : 'failed'
                      : (request.status ?? '…')}
                  </td>
                  <td>{request.method}</td>
                  <td className="dev-name">{shortUrl(request.url)}</td>
                  <td>{request.type}</td>
                  <td>{request.size !== undefined ? formatBytes(request.size) : ''}</td>
                  <td>
                    {request.duration !== undefined ? `${Math.round(request.duration)} ms` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted dev-empty">No requests yet. Reload the page to record them.</p>
        )}
      </div>
    </div>
  );
}
