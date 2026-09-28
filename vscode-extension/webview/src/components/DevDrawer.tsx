import { useEffect, useRef, useState } from 'react';
import type { DevCommand } from '../actions';
import { withShortcut } from '../shortcuts';
import { isFailedRequest, type ConsoleEntry, type NetworkEntry } from '@shared/devtools';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Segmented } from '@inkspect/shared/ui/Segmented';
import { Select } from '@inkspect/shared/ui/Select';
import { Checkbox } from '@inkspect/shared/ui/Switch';
import { TextField } from '@inkspect/shared/ui/TextField';
import { formatBytes } from '../format';
import { postToHost } from '../vscode';

interface DevDrawerProps {
  tabId: string;
  console: ConsoleEntry[];
  network: NetworkEntry[];
  height: number;
  onResize: (height: number) => void;
  onClose: () => void;
  /** A shortcut's request (switch view, focus the filter); `seq` changes each time. */
  command?: { name: DevCommand; seq: number } | null;
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
export function DevDrawer({
  tabId,
  console,
  network,
  height,
  onResize,
  onClose,
  command,
}: DevDrawerProps) {
  const [view, setView] = useState<'console' | 'network'>('console');
  const filterRef = useRef<HTMLInputElement>(null);
  // Shortcuts switch the view while rendering (no effect needed) and focus the filter.
  const [seenSeq, setSeenSeq] = useState(command?.seq);
  if (command && command.seq !== seenSeq) {
    setSeenSeq(command.seq);
    if (command.name !== 'filter') setView(command.name);
  }
  useEffect(() => {
    if (command?.name === 'filter') filterRef.current?.focus();
  }, [command]);
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
        <Segmented
          label="Log"
          size="sm"
          value={view}
          onChange={setView}
          options={[
            {
              value: 'console',
              label: 'Console',
              icon: 'terminal',
              count: errors || undefined,
              tone: 'error',
            },
            {
              value: 'network',
              label: 'Network',
              icon: 'globe',
              count: failures || undefined,
              tone: 'error',
            },
          ]}
        />
        <TextField
          ref={filterRef}
          size="sm"
          icon="filter"
          className="dev-filter"
          placeholder={view === 'console' ? 'Filter messages' : 'Filter URLs'}
          aria-label="Filter"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          onClear={() => setFilter('')}
        />
        {view === 'console' ? (
          <Select
            size="sm"
            appearance="quiet"
            label="Level"
            value={level}
            onChange={setLevel}
            options={[
              { value: 'all', label: 'All levels' },
              { value: 'warning', label: 'Warnings and errors', icon: 'warning' },
              { value: 'error', label: 'Errors only', icon: 'error' },
            ]}
          />
        ) : (
          <Checkbox checked={failedOnly} onChange={setFailedOnly}>
            Failed only
          </Checkbox>
        )}
        <span className="dev-spacer" />
        <Button
          size="sm"
          variant="ghost"
          icon="copy"
          title="Copy console errors as Markdown"
          onClick={() => action('copyErrors')}
        >
          Errors
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon="copy"
          title="Copy failed requests as Markdown"
          onClick={() => action('copyFailedRequests')}
        >
          Failed requests
        </Button>
        <Button
          size="sm"
          variant="primary"
          icon="sparkle"
          title="Copy the URL, viewport, selection, recent errors and failed requests for an AI agent"
          onClick={() => action('copyContext')}
        >
          Copy page context
        </Button>
        <span className="toolbar-separator" />
        <IconButton
          icon="comment-discussion"
          label={withShortcut('Send page context to the agent', 'dev.contextAgent')}
          onClick={() => action('copyContext', true)}
        />
        <IconButton icon="clear-all" label="Clear" onClick={() => action('clear')} />
        <IconButton
          icon="tools"
          label="Open DevTools (F12)"
          onClick={() => action('openDevTools')}
        />
        <IconButton icon="close" label="Close" onClick={onClose} />
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
            <EmptyState
              icon="terminal"
              text={
                needle || level !== 'all' ? 'No messages match the filter.' : 'No console messages.'
              }
            />
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
          <EmptyState
            icon="globe"
            text={
              network.length
                ? 'No requests match the filter.'
                : 'No requests yet. Reload the page to record them.'
            }
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="dev-empty">
      <span className={`codicon codicon-${icon}`} aria-hidden="true" />
      {text}
    </div>
  );
}
