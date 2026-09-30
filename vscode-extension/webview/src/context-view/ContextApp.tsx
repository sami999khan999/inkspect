import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuState } from '@inkspect/shared/ui/Menu';
import { Segmented } from '@inkspect/shared/ui/Segmented';
import { Select } from '@inkspect/shared/ui/Select';
import { Checkbox } from '@inkspect/shared/ui/Switch';
import { ThumbPicker } from '@inkspect/shared/ui/ThumbPicker';
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

/** A row of the list: one item, or the items of a group (oldest first). */
type Row =
  | { kind: 'item'; key: string; item: ContextItemView }
  | { kind: 'group'; key: string; group: string; items: ContextItemView[] };

/** Items in list order (newest first), a group once, at its newest item's place. */
function rowsOf(items: readonly ContextItemView[]): Row[] {
  const rows: Row[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.group) {
      rows.push({ kind: 'item', key: item.id, item });
      continue;
    }
    if (seen.has(item.group)) continue;
    seen.add(item.group);
    const members = items.filter((i) => i.group === item.group).reverse();
    rows.push(
      members.length > 1
        ? { kind: 'group', key: `group:${item.group}`, group: item.group, items: members }
        : { kind: 'item', key: item.id, item },
    );
  }
  return rows;
}

const idsOf = (row: Row) => (row.kind === 'item' ? [row.item.id] : row.items.map((i) => i.id));

/**
 * The Agent Context view: everything captured in the browser, newest first. Each item has a
 * Send button that types it into the agent running in a terminal (or VS Code chat). Captures
 * made together show as one group, sent together (or the checked part of it); any items can be
 * selected to send, remove or group them.
 */
export function ContextApp() {
  const [state, setState] = useState<State | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<Filter>('all');
  const [menu, setMenu] = useState<MenuState | null>(null);
  /** Selected rows (their keys). */
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  /** Items unchecked in their group card (new members start checked). */
  const [unchecked, setUnchecked] = useState<ReadonlySet<string>>(new Set());
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
  const rows = useMemo(() => rowsOf(shown), [shown]);
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
  // Only what is still in the list counts (items go away when removed elsewhere).
  const selectedRows = rows.filter((row) => selected.has(row.key));
  // A selected group counts only its checked items ("Send 2 of 4" stays 2).
  const selectedIds = selectedRows.flatMap(idsOf).filter((id) => !unchecked.has(id));
  const toggleChecked = (id: string) => {
    const next = new Set(unchecked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setUnchecked(next);
  };
  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };
  const clearSelection = () => setSelected(new Set());

  /** Sends to one of the agents (or the chat), picked from a menu under `anchor`. */
  const openTargetMenu = (ids: string[], anchor: HTMLElement) => {
    const rect = anchor.getBoundingClientRect();
    setMenu({
      x: Math.max(4, Math.min(rect.left, window.innerWidth - 224)),
      y: rect.bottom + 2,
      items: targets.map((t) => ({
        label: t.kind === 'chat' ? t.label : `${t.label} (${t.detail})`,
        icon: t.kind === 'chat' ? 'comment-discussion' : 'terminal',
        onSelect: () =>
          post(
            ids.length === 1
              ? { type: 'send', id: ids[0]!, target: t.id }
              : { type: 'sendMany', ids, target: t.id },
          ),
      })),
    });
  };

  return (
    <div className={`context${selectedRows.length ? ' selecting' : ''}`}>
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
      ) : rows.length === 0 ? (
        <p className="context-none">Nothing here yet.</p>
      ) : (
        <ul className="context-list" aria-label="Captured context">
          {rows.map((row) =>
            row.kind === 'item' ? (
              <ContextCard
                key={row.key}
                item={row.item}
                latest={row.item.id === latestId}
                thumbnail={thumbnails[row.item.id]}
                target={target}
                canChoose={targets.length > 1}
                selected={selected.has(row.key)}
                onSelect={() => toggle(row.key)}
                onChoose={(anchor) => openTargetMenu([row.item.id], anchor)}
              />
            ) : (
              <GroupCard
                key={row.key}
                group={row.group}
                items={row.items}
                latest={row.items.some((i) => i.id === latestId)}
                thumbnails={thumbnails}
                target={target}
                canChoose={targets.length > 1}
                selected={selected.has(row.key)}
                onSelect={() => toggle(row.key)}
                onChoose={(ids, anchor) => openTargetMenu(ids, anchor)}
                unchecked={unchecked}
                onToggle={toggleChecked}
              />
            ),
          )}
        </ul>
      )}

      {selectedRows.length > 0 ? (
        <footer className="context-footer context-selection" role="toolbar" aria-label="Selection">
          <span className="selection-count">
            <span className="selection-badge">{selectedIds.length}</span>
            selected
          </span>
          <Button
            size="sm"
            variant="accent"
            icon="send"
            disabled={!selectedIds.length}
            title={target ? `Send to ${target.label}` : 'Send to an agent'}
            onClick={() => {
              post({ type: 'sendMany', ids: selectedIds });
              clearSelection();
            }}
          >
            Send
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon="layers"
            disabled={selectedIds.length < 2}
            title="Show them as one group, sent together"
            onClick={() => {
              post({ type: 'group', ids: selectedIds });
              clearSelection();
            }}
          >
            Group
          </Button>
          <IconButton
            icon="trash"
            label="Remove them"
            onClick={() => {
              post({ type: 'removeMany', ids: selectedRows.flatMap(idsOf) });
              clearSelection();
            }}
          />
          <IconButton icon="close" label="Clear the selection" onClick={clearSelection} />
        </footer>
      ) : state.undo ? (
        // Just removed (Clear all, a card, a group): a moment to take it back.
        <footer className="context-footer context-undo" role="status">
          <span className="context-undo-text">
            <span className="codicon codicon-trash" aria-hidden="true" />
            {state.undo}
          </span>
          <Button
            size="sm"
            variant="secondary"
            icon="discard"
            onClick={() => post({ type: 'undo' })}
          >
            Undo
          </Button>
        </footer>
      ) : (
        items.length > 0 && (
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
        )
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

/**
 * Selecting a card: its checkbox, Ctrl/Cmd/Shift+click on the card, or Space when it has focus.
 * Returns the card's handlers.
 */
function selectable(onSelect: () => void) {
  return {
    onClick: (event: MouseEvent) => {
      if (!(event.ctrlKey || event.metaKey || event.shiftKey)) return;
      // Not a click on its buttons (they act on their own).
      if ((event.target as HTMLElement).closest('button') !== null) return;
      event.preventDefault();
      onSelect();
    },
  };
}

/** Send and the target menu, shared by single and group cards. */
function SendSplit({
  label,
  sent,
  disabled,
  target,
  canChoose,
  onSend,
  onChoose,
}: {
  label: string;
  sent: boolean;
  disabled?: boolean;
  target?: AgentTarget;
  canChoose: boolean;
  onSend: () => void;
  onChoose: (anchor: HTMLElement) => void;
}) {
  const chooseRef = useRef<HTMLButtonElement>(null);
  return (
    <div className="send-split">
      <Button
        size="sm"
        variant={sent ? 'secondary' : 'accent'}
        icon={sent ? 'check' : 'send'}
        disabled={disabled}
        onClick={onSend}
        title={target ? `Send to ${target.label}` : 'Send to an agent'}
      >
        {label}
      </Button>
      {canChoose && (
        <Button
          ref={chooseRef}
          size="sm"
          variant={sent ? 'secondary' : 'accent'}
          icon="chevron-down"
          className="send-more"
          disabled={disabled}
          aria-label="Send to another agent"
          title="Send to another agent"
          onClick={() => chooseRef.current && onChoose(chooseRef.current)}
        />
      )}
    </div>
  );
}

function ContextCard({
  item,
  latest,
  thumbnail,
  target,
  canChoose,
  selected,
  onSelect,
  onChoose,
}: {
  item: ContextItemView;
  latest: boolean;
  thumbnail?: string;
  target?: AgentTarget;
  canChoose: boolean;
  selected: boolean;
  onSelect: () => void;
  onChoose: (anchor: HTMLElement) => void;
}) {
  const [broken, setBroken] = useState(false);
  const [tall, setTall] = useState(false);
  const send = () => post({ type: 'send', id: item.id });
  const sent = item.sentTo.length > 0;
  const picture = thumbnail && !broken ? thumbnail : undefined;
  return (
    <li
      className={`context-card kind-${item.kind}${latest ? ' latest' : ''}${selected ? ' selected' : ''}`}
      tabIndex={0}
      aria-label={`${CONTEXT_KIND_LABELS[item.kind]}: ${item.title}`}
      aria-selected={selected}
      onDoubleClick={() => post({ type: 'open', id: item.id })}
      {...selectable(onSelect)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter') send();
        else if (event.key === ' ') {
          event.preventDefault();
          onSelect();
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
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
        <Checkbox
          className="card-select"
          checked={selected}
          label={`Select ${item.title}`}
          onChange={onSelect}
        />
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
        <SendSplit
          label={sent ? 'Send again' : 'Send'}
          sent={sent}
          target={target}
          canChoose={canChoose}
          onSend={send}
          onChoose={onChoose}
        />
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
      {sent && <SentTo agents={item.sentTo} />}
    </li>
  );
}

/** "Drawing 1 of 3", "Drawing 2 of 3" → "Drawing"; different titles → "Screenshots". */
function groupTitle(items: readonly ContextItemView[]): string {
  if (items.every((i) => i.kind === 'element')) return 'Elements';
  const bases = new Set(items.map((i) => i.title.replace(/\s+\d+\s+of\s+\d+$/, '')));
  const [base] = bases;
  return bases.size === 1 && base ? base : 'Screenshots';
}

/**
 * Captures made (or grouped) together: one card with a thumbnail each. The checked ones are
 * sent together ("Send 2 of 4"); a thumbnail opens its image.
 */
function GroupCard({
  group,
  items,
  latest,
  thumbnails,
  target,
  canChoose,
  selected,
  onSelect,
  onChoose,
  unchecked,
  onToggle: toggle,
}: {
  group: string;
  items: ContextItemView[];
  latest: boolean;
  thumbnails: Record<string, string>;
  target?: AgentTarget;
  canChoose: boolean;
  selected: boolean;
  onSelect: () => void;
  onChoose: (ids: string[], anchor: HTMLElement) => void;
  /** Items left out (unchecked); kept by the view, so a selection's Send leaves them out too. */
  unchecked: ReadonlySet<string>;
  onToggle: (id: string) => void;
}) {
  const picked = items.filter((i) => !unchecked.has(i.id)).map((i) => i.id);
  const all = picked.length === items.length;
  const sentTo = [...new Set(items.flatMap((i) => i.sentTo))];
  const sent =
    picked.length > 0 && picked.every((id) => items.find((i) => i.id === id)!.sentTo.length);
  const title = groupTitle(items);
  const newest = Math.max(...items.map((i) => i.time));
  const kinds = new Set(items.map((i) => i.kind));
  const what =
    kinds.size === 1 && kinds.has('screenshot')
      ? 'screenshots'
      : kinds.size === 1 && kinds.has('element')
        ? 'elements'
        : 'items';
  const send = () => {
    if (picked.length) post({ type: 'sendMany', ids: picked });
  };
  return (
    <li
      className={`context-card group-card${latest ? ' latest' : ''}${selected ? ' selected' : ''}`}
      tabIndex={0}
      aria-label={`${items.length} ${what}: ${title}`}
      aria-selected={selected}
      {...selectable(onSelect)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter') send();
        else if (event.key === ' ') {
          event.preventDefault();
          onSelect();
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
          post({ type: 'removeMany', ids: items.map((i) => i.id) });
        }
      }}
    >
      <div className="card-head">
        <Checkbox
          className="card-select"
          checked={selected}
          label={`Select ${title}`}
          onChange={onSelect}
        />
        <span className="card-icon" aria-hidden="true">
          <span className="codicon codicon-layers" />
        </span>
        <div className="card-heading">
          <div className="card-title-row">
            <span className="card-title" title={title}>
              {title}
            </span>
            <span className="card-count">{items.length}</span>
            {latest && <span className="card-badge">Latest</span>}
          </div>
          <div className="card-meta">
            <span>
              {all ? `${items.length} ${what}` : `${picked.length} of ${items.length} checked`}
            </span>
            {items[0]!.detail && <span title={items[0]!.url}>{items[0]!.detail}</span>}
            <span>{timeAgo(newest)}</span>
          </div>
        </div>
      </div>
      {items.some((i) => i.image) ? (
        <ThumbPicker
          className="group-thumbs"
          items={items.map((i) => ({ id: i.id, src: thumbnails[i.id], label: i.title }))}
          checked={new Set(picked)}
          onToggle={toggle}
          onOpen={(id) => post({ type: 'open', id })}
        />
      ) : (
        // Elements (and other text): a checklist, one row each.
        <ul className="group-list" aria-label={title}>
          {items.map((item) => (
            <li
              key={item.id}
              className={`group-row${unchecked.has(item.id) ? '' : ' on'}`}
              onDoubleClick={() => post({ type: 'open', id: item.id })}
            >
              <Checkbox
                checked={!unchecked.has(item.id)}
                label={`Include ${item.title}`}
                onChange={() => toggle(item.id)}
              />
              <span
                className={`codicon codicon-${CONTEXT_ICONS[item.kind]} group-row-icon`}
                aria-hidden="true"
              />
              <span className="group-row-text">
                <span className="group-row-title" title={item.title}>
                  {item.title}
                </span>
                {/* Only what differs from the card's own detail (the page). */}
                {item.detail && item.detail !== items[0]!.detail && (
                  <span className="group-row-detail">{item.detail}</span>
                )}
              </span>
              <IconButton
                icon="go-to-file"
                label={`Open ${item.title}`}
                className="small group-row-open"
                onClick={() => post({ type: 'open', id: item.id })}
              />
            </li>
          ))}
        </ul>
      )}
      <div className="card-actions">
        <SendSplit
          label={
            all
              ? `${sent ? 'Send all again' : 'Send all'} ${items.length}`
              : `Send ${picked.length} of ${items.length}`
          }
          sent={sent}
          disabled={!picked.length}
          target={target}
          canChoose={canChoose}
          onSend={send}
          onChoose={(anchor) => onChoose(picked, anchor)}
        />
        <span className="card-tools">
          <IconButton
            icon="list-flat"
            label="Ungroup (show them one by one)"
            onClick={() => post({ type: 'ungroup', group })}
          />
          <IconButton
            icon="trash"
            label="Remove the group"
            onClick={() => post({ type: 'removeMany', ids: items.map((i) => i.id) })}
          />
        </span>
      </div>
      {sentTo.length > 0 && <SentTo agents={sentTo} />}
    </li>
  );
}

function SentTo({ agents }: { agents: string[] }) {
  return (
    <div className="card-sent" title={`Sent to ${agents.join(', ')}`}>
      <span className="codicon codicon-pass-filled" aria-hidden="true" />
      <span>Sent to {agents.join(', ')}</span>
    </div>
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
      <p className="empty-group-tip">
        Screenshots taken together (each drawing separately, several elements) stay together as one
        group. Select any items (Ctrl+click or their checkbox) to send, remove or group them.
      </p>
    </div>
  );
}
