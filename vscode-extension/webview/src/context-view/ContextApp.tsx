import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuState } from '@inkspect/shared/ui/Menu';
import { Segmented } from '@inkspect/shared/ui/Segmented';
import { Select } from '@inkspect/shared/ui/Select';
import {
  CONTEXT_ICONS,
  CONTEXT_KIND_LABELS,
  timeAgo,
  type AgentTarget,
  type ContextItemView,
  type ContextKind,
  type ContextViewToHost,
  type HostToContextView,
} from '@shared/agentContext';
import { KeyCaps } from '../components/KeyCaps';

interface VsCodeApi {
  postMessage(message: ContextViewToHost): void;
}
declare function acquireVsCodeApi(): VsCodeApi;
const vscode = acquireVsCodeApi();
const post = (message: ContextViewToHost) => vscode.postMessage(message);

type State = Extract<HostToContextView, { type: 'state' }>;
type Filter = 'all' | 'elements' | 'images' | 'errors' | 'other';

const FILTERS: Record<Exclude<Filter, 'all'>, readonly ContextKind[]> = {
  elements: ['element'],
  images: ['screenshot', 'recording'],
  errors: ['errors', 'network'],
  other: ['page', 'report', 'css', 'measure', 'color', 'text'],
};

/**
 * The Agent Context view: everything captured in the browser, newest first. Each item has a
 * Send button that types it into the agent running in a terminal (or VS Code chat).
 */
export function ContextApp() {
  const [state, setState] = useState<State | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>('all');
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [, setNow] = useState(0);

  useEffect(() => {
    const onMessage = (event: MessageEvent<HostToContextView>) => {
      const message = event.data;
      if (message?.type === 'state') {
        setState(message);
        // Frees the images of removed items.
        const ids = new Set(message.items.map((i) => i.id));
        setThumbnails((previous) => {
          const gone = Object.keys(previous).filter((id) => !ids.has(id));
          if (!gone.length) return previous;
          const next = { ...previous };
          for (const id of gone) {
            URL.revokeObjectURL(next[id]!);
            delete next[id];
          }
          return next;
        });
      } else if (message?.type === 'thumbnail') {
        const url = URL.createObjectURL(
          new Blob([message.data as Uint8Array<ArrayBuffer>], { type: message.mimeType }),
        );
        setThumbnails((previous) => ({ ...previous, [message.id]: url }));
      }
    };
    window.addEventListener('message', onMessage);
    post({ type: 'ready' });
    // Keeps "5 min ago" current.
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      window.removeEventListener('message', onMessage);
      clearInterval(timer);
    };
  }, []);

  const items = useMemo(() => state?.items ?? [], [state]);
  const counts = useMemo(() => {
    const result: Record<Filter, number> = {
      all: items.length,
      elements: 0,
      images: 0,
      errors: 0,
      other: 0,
    };
    for (const item of items) {
      for (const [name, kinds] of Object.entries(FILTERS)) {
        if (kinds.includes(item.kind)) result[name as Filter]++;
      }
    }
    return result;
  }, [items]);
  const shown = filter === 'all' ? items : items.filter((i) => FILTERS[filter].includes(i.kind));
  const latestId = useMemo(
    () =>
      items.reduce<ContextItemView | undefined>(
        (a, b) => (!a || b.time > a.time ? b : a),
        undefined,
      )?.id,
    [items],
  );

  if (!state) return null;
  const targets = state.targets;
  const terminalAgents = targets.filter((t) => t.kind === 'terminal');
  const target = targets.find((t) => t.id === state.target);

  const openTargetMenu = (item: ContextItemView, anchor: HTMLElement) => {
    const rect = anchor.getBoundingClientRect();
    setMenu({
      x: Math.max(4, Math.min(rect.left, window.innerWidth - 224)),
      y: rect.bottom + 2,
      items: targets.map((t) => ({
        label: t.kind === 'chat' ? t.label : `${t.label} (${t.detail})`,
        icon: t.kind === 'chat' ? 'comment-discussion' : 'terminal',
        onSelect: () => post({ type: 'send', id: item.id, target: t.id }),
      })),
    });
  };

  return (
    <div className="context">
      <header className="context-header">
        <AgentPicker targets={targets} value={state.target} />
        {!terminalAgents.length && <NoAgent />}
        {items.length > 0 && (
          <Segmented
            size="sm"
            label="Show"
            value={filter}
            onChange={setFilter}
            className="context-filter"
            options={[
              { value: 'all', label: 'All', icon: 'list-flat', count: counts.all },
              {
                value: 'elements',
                label: 'Elements',
                icon: 'inspect',
                count: counts.elements || undefined,
              },
              {
                value: 'images',
                label: 'Images',
                icon: 'file-media',
                count: counts.images || undefined,
              },
              {
                value: 'errors',
                label: 'Errors',
                icon: 'error',
                count: counts.errors || undefined,
                tone: counts.errors ? 'error' : undefined,
              },
              {
                value: 'other',
                label: 'Other',
                icon: 'ellipsis',
                count: counts.other || undefined,
              },
            ]}
          />
        )}
      </header>

      {items.length === 0 ? (
        <EmptyState keys={state.keys} />
      ) : shown.length === 0 ? (
        <p className="context-none">Nothing here yet.</p>
      ) : (
        <ul className="context-list" aria-label="Captured context">
          {shown.map((item) => (
            <ContextCard
              key={item.id}
              item={item}
              latest={item.id === latestId}
              thumbnail={thumbnails[item.id]}
              target={target}
              canChoose={targets.length > 1}
              onChoose={(anchor) => openTargetMenu(item, anchor)}
            />
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <footer className="context-footer">
          {state.keys.sendLatest && (
            <span className="context-hint">
              <KeyCaps binding={state.keys.sendLatest} size="sm" /> sends the latest
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            icon="clear-all"
            onClick={() => post({ type: 'clear' })}
          >
            Clear all
          </Button>
        </footer>
      )}

      {menu && <Menu menu={menu} onClose={() => setMenu(null)} />}
    </div>
  );
}

/** Where Send goes: the agents running in terminals, and VS Code chat. */
function AgentPicker({ targets, value }: { targets: AgentTarget[]; value?: string }) {
  const terminals = targets.filter((t) => t.kind === 'terminal');
  return (
    <div className="agent-picker">
      <span className={`agent-dot ${terminals.length ? 'on' : ''}`} aria-hidden="true" />
      <Select
        size="sm"
        appearance="quiet"
        label="Send to"
        className="agent-select"
        placeholder="No agent running"
        value={value}
        onChange={(target) => post({ type: 'setTarget', target })}
        renderValue={(option) => (
          <span className="agent-value">
            <span className="agent-value-prefix">Send to</span> {option.label}
          </span>
        )}
        options={targets.map((t) => ({
          value: t.id,
          label: t.label,
          detail: t.detail,
          icon: t.kind === 'chat' ? 'comment-discussion' : 'terminal',
          group: t.kind === 'chat' ? 'Other' : 'Running agents',
        }))}
      />
      <IconButton
        icon="terminal"
        label="Pick the terminal your agent runs in"
        onClick={() => post({ type: 'chooseTerminal' })}
      />
    </div>
  );
}

function NoAgent() {
  return (
    <div className="no-agent" role="status">
      <span className="codicon codicon-info" aria-hidden="true" />
      <div>
        <strong>No agent is running in a terminal</strong>
        <span>Start one, or pick the terminal it runs in. Plain shells never get sends.</span>
        <div className="no-agent-actions">
          <Button
            size="sm"
            variant="accent"
            icon="play"
            onClick={() => post({ type: 'startAgent' })}
          >
            Start agent
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon="terminal"
            onClick={() => post({ type: 'chooseTerminal' })}
          >
            Pick terminal
          </Button>
        </div>
      </div>
    </div>
  );
}

function ContextCard({
  item,
  latest,
  thumbnail,
  target,
  canChoose,
  onChoose,
}: {
  item: ContextItemView;
  latest: boolean;
  thumbnail?: string;
  target?: AgentTarget;
  canChoose: boolean;
  onChoose: (anchor: HTMLElement) => void;
}) {
  const chooseRef = useRef<HTMLButtonElement>(null);
  const [broken, setBroken] = useState(false);
  const [tall, setTall] = useState(false);
  const send = () => post({ type: 'send', id: item.id });
  const sent = item.sentTo.length > 0;
  const picture = thumbnail && !broken ? thumbnail : undefined;
  return (
    <li
      className={`context-card kind-${item.kind}${latest ? ' latest' : ''}`}
      tabIndex={0}
      aria-label={`${CONTEXT_KIND_LABELS[item.kind]}: ${item.title}`}
      onDoubleClick={() => post({ type: 'open', id: item.id })}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter') send();
        else if (event.key === 'Delete' || event.key === 'Backspace') {
          post({ type: 'remove', id: item.id });
        } else if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
          post({ type: 'copy', id: item.id });
        }
      }}
    >
      {picture && (
        <button
          type="button"
          className={`card-thumb${tall ? ' tall' : ''}`}
          aria-label={`Open ${item.title}`}
          onClick={() => post({ type: 'open', id: item.id })}
        >
          <img
            src={picture}
            alt=""
            onError={() => setBroken(true)}
            onLoad={(event) => {
              const { naturalWidth: w, naturalHeight: h } = event.currentTarget;
              setTall(w > 0 && h / w > 1.1);
            }}
          />
        </button>
      )}
      <div className="card-head">
        {!picture && (
          <span className="card-icon" aria-hidden="true">
            <span className={`codicon codicon-${CONTEXT_ICONS[item.kind]}`} />
          </span>
        )}
        <div className="card-heading">
          <div className="card-title-row">
            <span className="card-title" title={item.title}>
              {item.title}
            </span>
            {latest && <span className="card-badge">Latest</span>}
          </div>
          <div className="card-meta">
            <span>{CONTEXT_KIND_LABELS[item.kind]}</span>
            {item.detail && <span title={item.url}>{item.detail}</span>}
            <span>{timeAgo(item.time)}</span>
          </div>
        </div>
      </div>
      {item.preview && !picture && (
        <p className="card-preview">
          <span>{item.preview}</span>
        </p>
      )}
      <div className="card-actions">
        <div className="send-split">
          <Button
            size="sm"
            variant={sent ? 'secondary' : 'accent'}
            icon={sent ? 'check' : 'send'}
            onClick={send}
            title={target ? `Send to ${target.label}` : 'Send to an agent'}
          >
            {sent ? 'Send again' : 'Send'}
          </Button>
          {canChoose && (
            <Button
              ref={chooseRef}
              size="sm"
              variant={sent ? 'secondary' : 'accent'}
              icon="chevron-down"
              className="send-more"
              aria-label="Send to another agent"
              title="Send to another agent"
              onClick={() => chooseRef.current && onChoose(chooseRef.current)}
            />
          )}
        </div>
        <span className="card-tools">
          <IconButton
            icon="copy"
            label="Copy"
            onClick={() => post({ type: 'copy', id: item.id })}
          />
          <IconButton
            icon="go-to-file"
            label="Open"
            onClick={() => post({ type: 'open', id: item.id })}
          />
          <IconButton
            icon="trash"
            label="Remove"
            onClick={() => post({ type: 'remove', id: item.id })}
          />
        </span>
      </div>
      {sent && (
        <div className="card-sent" title={`Sent to ${item.sentTo.join(', ')}`}>
          <span className="codicon codicon-pass-filled" aria-hidden="true" />
          <span>Sent to {item.sentTo.join(', ')}</span>
        </div>
      )}
    </li>
  );
}

function EmptyState({ keys }: { keys: State['keys'] }) {
  const tips: { icon: string; text: string }[] = [
    { icon: 'inspect', text: 'Pick an element with the element picker' },
    { icon: 'device-camera', text: 'Take a screenshot (any kind)' },
    { icon: 'error', text: 'Console errors show up here as they happen' },
    { icon: 'checklist', text: 'Copy a report, measurements or CSS changes' },
  ];
  return (
    <div className="context-empty">
      <span className="codicon codicon-sparkle empty-icon" aria-hidden="true" />
      <h2>Nothing captured yet</h2>
      <p>Everything you capture in the browser lands here, ready to send to your agent.</p>
      <ul className="empty-tips">
        {tips.map((tip) => (
          <li key={tip.icon}>
            <span className={`codicon codicon-${tip.icon}`} aria-hidden="true" />
            {tip.text}
          </li>
        ))}
      </ul>
      {(keys.sendLatest || keys.show) && (
        <dl className="empty-keys">
          {keys.sendLatest && (
            <>
              <dt>
                <KeyCaps binding={keys.sendLatest} size="sm" />
              </dt>
              <dd>Send the latest capture to the agent</dd>
            </>
          )}
          {keys.show && (
            <>
              <dt>
                <KeyCaps binding={keys.show} size="sm" />
              </dt>
              <dd>Show this list</dd>
            </>
          )}
        </dl>
      )}
    </div>
  );
}
