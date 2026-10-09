import { useMemo, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { HubTarget, ItemKind } from '../hub';
import {
  groupTitle,
  idsOf,
  KIND_ICONS,
  KIND_LABELS,
  rowsOf,
  timeAgo,
  type SavedItemView,
} from '../saved';
import { orderTargets, targetDetail, targetIcon } from '../sendModal';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { Menu, tidyMenu, type MenuState } from './Menu';
import { cx } from './popover';
import { Segmented } from './Segmented';
import { Checkbox } from './Switch';
import { ThumbPicker } from './ThumbPicker';

type Filter = 'all' | 'elements' | 'images' | 'errors' | 'other';

const FILTERS: Record<Exclude<Filter, 'all'>, readonly ItemKind[]> = {
  elements: ['element'],
  images: ['screenshot', 'recording'],
  errors: ['errors', 'network'],
  other: ['page', 'report', 'css', 'measure', 'color', 'text'],
};

export interface SavedListProps {
  /** The project's captures, newest first. */
  items: readonly SavedItemView[];
  /** Thumbnails by item id (object or data URLs). */
  thumbnails: Readonly<Record<string, string | undefined>>;
  /** Where sends can go (the project's agents), and where Send goes. */
  targets: readonly HubTarget[];
  defaultTarget?: string;
  /** Off for projects where nothing runs: their captures are kept, nothing can be sent. */
  canSend?: boolean;
  onSend: (ids: string[], target?: string) => void;
  /** Sends to an agentmux thread, then shows that thread (offered for agentmux agents). */
  onOpenInAgentmux?: (ids: string[], target: string) => void;
  onRemove: (ids: string[]) => void;
  onCopy?: (id: string) => void;
  /** Opens the item's file or text (VS Code). */
  onOpen?: (id: string) => void;
  /** Shows items as one group, sent together (VS Code). */
  onGroup?: (ids: string[]) => void;
  onUngroup?: (group: string) => void;
  onClear?: () => void;
  /** What the last removal took, while it can be undone. */
  undo?: { label: string; onUndo: () => void };
  /** Kind filters above the list. */
  filters?: boolean;
  /** Above the list, pinned with the filters: the project and agent pickers. */
  header?: ReactNode;
  /** Shows when the project has nothing saved. */
  empty: ReactNode;
  /** A note in the footer (the key that sends the latest). */
  hint?: ReactNode;
  className?: string;
}

/**
 * A project's Saved list, shared by VS Code's Saved view and the browser's side panel: its
 * captures, newest first, each with Send (to the default agent), Send to… (another), Open in
 * agentmux (send, then show the thread), Copy and Remove, with Undo. Captures made together show
 * as one group, sent together (or the checked part of it); any cards can be selected to send or
 * remove them together.
 */
export function SavedList(props: SavedListProps) {
  const { items, targets, defaultTarget, canSend = true } = props;
  const [filter, setFilter] = useState<Filter>('all');
  const [menu, setMenu] = useState<MenuState | null>(null);
  /** Selected rows (their keys). */
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  /** Items unchecked in their group card (new members start checked). */
  const [unchecked, setUnchecked] = useState<ReadonlySet<string>>(new Set());

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
      items.reduce<SavedItemView | undefined>((a, b) => (!a || b.time > a.time ? b : a), undefined)
        ?.id,
    [items],
  );

  const ordered = orderTargets(targets, defaultTarget);
  const target = targets.find((t) => t.id === defaultTarget);
  const threads = ordered.filter((t) => t.kind === 'tmux');
  const sending = canSend && targets.length > 0;
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

  const menuAt = (anchor: HTMLElement, entries: MenuState['items']) => {
    const rect = anchor.getBoundingClientRect();
    setMenu({ x: rect.left, y: rect.bottom + 2, anchor: rect, items: entries });
  };
  const openInAgentmux = props.onOpenInAgentmux;
  const actions: CardActions = {
    target,
    // One chooser: every agent; an agentmux thread has a second row that also shows it.
    canChoose: sending && (targets.length > 1 || (!!openInAgentmux && threads.length > 0)),
    sending,
    send: (ids) => props.onSend(ids),
    choose: (ids, anchor) =>
      menuAt(
        anchor,
        tidyMenu(
          ordered.flatMap((t): MenuState['items'] => {
            const send = () => props.onSend(ids, t.id);
            const name = t.kind === 'chat' ? t.label : `${t.label} (${targetDetail(t)})`;
            if (!openInAgentmux || t.kind !== 'tmux') {
              return [{ label: name, icon: targetIcon(t), onSelect: send }];
            }
            // An agentmux thread: its name, then its two actions beneath it.
            return [
              { separator: true },
              { heading: t.label, detail: targetDetail(t), icon: targetIcon(t) },
              {
                label: 'Send',
                icon: 'send',
                indent: true,
                ariaLabel: `Send to ${name}`,
                onSelect: send,
              },
              {
                label: 'Send and open in agentmux',
                icon: 'link-external',
                indent: true,
                ariaLabel: `Send to ${name} and open it in agentmux`,
                onSelect: () => openInAgentmux(ids, t.id),
              },
              { separator: true },
            ];
          }),
        ),
      ),
    copy: props.onCopy,
    open: props.onOpen,
    remove: props.onRemove,
    ungroup: props.onUngroup,
  };

  return (
    <div className={cx('saved', selectedRows.length > 0 && 'selecting', props.className)}>
      {(props.header || (props.filters && items.length > 0)) && (
        <header className="saved-header">
          {props.header}
          {props.filters && items.length > 0 && (
            <Segmented
              size="sm"
              label="Show"
              value={filter}
              onChange={setFilter}
              className="saved-filter"
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
      )}

      {items.length === 0 ? (
        props.empty
      ) : rows.length === 0 ? (
        <p className="saved-none">Nothing here yet.</p>
      ) : (
        <ul className="saved-list" aria-label="Saved captures">
          {rows.map((row) =>
            row.kind === 'item' ? (
              <ItemCard
                key={row.key}
                item={row.item}
                latest={row.item.id === latestId}
                thumbnail={props.thumbnails[row.item.id]}
                actions={actions}
                selected={selected.has(row.key)}
                onSelect={() => toggle(row.key)}
              />
            ) : (
              <GroupCard
                key={row.key}
                group={row.group}
                items={row.items}
                latest={row.items.some((i) => i.id === latestId)}
                thumbnails={props.thumbnails}
                actions={actions}
                selected={selected.has(row.key)}
                onSelect={() => toggle(row.key)}
                unchecked={unchecked}
                onToggle={toggleChecked}
              />
            ),
          )}
        </ul>
      )}

      {selectedRows.length > 0 ? (
        <footer className="saved-footer saved-selection" role="toolbar" aria-label="Selection">
          <span className="saved-selection-count">
            <span className="saved-selection-badge">{selectedIds.length}</span>
            selected
          </span>
          {sending && (
            <Button
              size="sm"
              variant="accent"
              icon="send"
              disabled={!selectedIds.length}
              title={target ? `Send to ${target.label}` : 'Send to an agent'}
              onClick={() => {
                props.onSend(selectedIds);
                clearSelection();
              }}
            >
              Send
            </Button>
          )}
          {/* Grouping joins cards: one group card on its own is a group already. */}
          {props.onGroup && selectedRows.length > 1 && (
            <Button
              size="sm"
              variant="ghost"
              icon="layers"
              disabled={selectedIds.length < 2}
              title="Show them as one group, sent together"
              onClick={() => {
                props.onGroup?.(selectedIds);
                clearSelection();
              }}
            >
              Group
            </Button>
          )}
          <IconButton
            icon="trash"
            label="Remove them"
            onClick={() => {
              props.onRemove(selectedRows.flatMap(idsOf));
              clearSelection();
            }}
          />
          <IconButton icon="close" label="Clear the selection" onClick={clearSelection} />
        </footer>
      ) : props.undo ? (
        // Just removed (Clear all, a card, a group): a moment to take it back.
        <footer className="saved-footer saved-undo" role="status">
          <span className="saved-undo-text">
            <span className="codicon codicon-trash" aria-hidden="true" />
            {props.undo.label}
          </span>
          <Button size="sm" variant="secondary" icon="discard" onClick={props.undo.onUndo}>
            Undo
          </Button>
        </footer>
      ) : (
        items.length > 0 &&
        (props.hint || props.onClear) && (
          <footer className="saved-footer">
            {props.hint && <span className="saved-hint">{props.hint}</span>}
            {props.onClear && (
              <Button variant="ghost" size="sm" icon="clear-all" onClick={props.onClear}>
                Clear all
              </Button>
            )}
          </footer>
        )
      )}

      {menu && <Menu menu={menu} onClose={() => setMenu(null)} />}
    </div>
  );
}

/** What a card's buttons do (the same for single and group cards). */
interface CardActions {
  target?: HubTarget;
  canChoose: boolean;
  sending: boolean;
  send: (ids: string[]) => void;
  choose: (ids: string[], anchor: HTMLElement) => void;
  copy?: (id: string) => void;
  open?: (id: string) => void;
  remove: (ids: string[]) => void;
  ungroup?: (group: string) => void;
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

/** Send, and a chevron for another agent (or to show an agentmux thread): shared by both cards. */
function SendControls({
  ids,
  label,
  sent,
  disabled,
  actions,
}: {
  ids: string[];
  label: string;
  sent: boolean;
  disabled?: boolean;
  actions: CardActions;
}) {
  const chooseRef = useRef<HTMLButtonElement>(null);
  if (!actions.sending) return null;
  return (
    <span className="saved-send-group">
      <span className="saved-send">
        <Button
          size="sm"
          variant={sent ? 'secondary' : 'accent'}
          icon={sent ? 'check' : 'send'}
          disabled={disabled}
          onClick={() => actions.send(ids)}
          title={actions.target ? `Send to ${actions.target.label}` : 'Send to an agent'}
        >
          {label}
        </Button>
        {actions.canChoose && (
          <Button
            ref={chooseRef}
            size="sm"
            variant={sent ? 'secondary' : 'accent'}
            icon="chevron-down"
            className="saved-send-more"
            disabled={disabled}
            aria-label="Send to…"
            title="Send to another agent"
            onClick={() => chooseRef.current && actions.choose(ids, chooseRef.current)}
          />
        )}
      </span>
    </span>
  );
}

function ItemCard({
  item,
  latest,
  thumbnail,
  actions,
  selected,
  onSelect,
}: {
  item: SavedItemView;
  latest: boolean;
  thumbnail?: string;
  actions: CardActions;
  selected: boolean;
  onSelect: () => void;
}) {
  const [broken, setBroken] = useState(false);
  const [tall, setTall] = useState(false);
  const sent = item.sentTo.length > 0;
  const picture = thumbnail && !broken ? thumbnail : undefined;
  const open = actions.open;
  return (
    <li
      className={cx('saved-card', `kind-${item.kind}`, latest && 'latest', selected && 'selected')}
      tabIndex={0}
      aria-label={`${KIND_LABELS[item.kind]}: ${item.title}`}
      aria-selected={selected}
      onDoubleClick={open && (() => open(item.id))}
      {...selectable(onSelect)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' && actions.sending) actions.send([item.id]);
        else if (event.key === ' ') {
          event.preventDefault();
          onSelect();
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
          actions.remove([item.id]);
        } else if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
          actions.copy?.(item.id);
        }
      }}
    >
      <Checkbox
        className="saved-card-select"
        checked={selected}
        label={`Select ${item.title}`}
        onChange={onSelect}
      />
      {picture &&
        (open ? (
          <button
            type="button"
            className={cx('saved-thumb', tall && 'tall')}
            aria-label={`Open ${item.title}`}
            onClick={() => open(item.id)}
          >
            <Picture src={picture} onBroken={() => setBroken(true)} onTall={setTall} />
          </button>
        ) : (
          <div className={cx('saved-thumb', 'still', tall && 'tall')}>
            <Picture src={picture} onBroken={() => setBroken(true)} onTall={setTall} />
          </div>
        ))}
      <div className="saved-card-head">
        {!picture && (
          <span className="saved-card-icon" aria-hidden="true">
            <span className={`codicon codicon-${KIND_ICONS[item.kind]}`} />
          </span>
        )}
        <div className="saved-card-heading">
          <div className="saved-card-title-row">
            <span className="saved-card-title" title={item.title}>
              {item.title}
            </span>
            {latest && <span className="saved-card-badge">Latest</span>}
          </div>
          <div className="saved-card-meta">
            <span>{KIND_LABELS[item.kind]}</span>
            {item.detail && <span title={item.url}>{item.detail}</span>}
            <span>{timeAgo(item.time)}</span>
            {item.source && <span>{item.source}</span>}
          </div>
        </div>
      </div>
      {item.preview && !picture && (
        <p className="saved-card-preview">
          <span>{item.preview}</span>
        </p>
      )}
      <div className="saved-card-actions">
        <SendControls
          ids={[item.id]}
          label={sent ? 'Send again' : 'Send'}
          sent={sent}
          actions={actions}
        />
        <span className="saved-card-tools">
          {actions.copy && (
            <IconButton icon="copy" label="Copy" onClick={() => actions.copy?.(item.id)} />
          )}
          {open && <IconButton icon="go-to-file" label="Open" onClick={() => open(item.id)} />}
          <IconButton icon="trash" label="Remove" onClick={() => actions.remove([item.id])} />
        </span>
      </div>
      {sent && <SentTo agents={item.sentTo} />}
    </li>
  );
}

function Picture({
  src,
  onBroken,
  onTall,
}: {
  src: string;
  onBroken: () => void;
  onTall: (tall: boolean) => void;
}) {
  return (
    <img
      src={src}
      alt=""
      onError={onBroken}
      onLoad={(event) => {
        const { naturalWidth: w, naturalHeight: h } = event.currentTarget;
        onTall(w > 0 && h / w > 1.1);
      }}
    />
  );
}

/**
 * Captures made (or grouped) together: one card with a thumbnail each. The checked ones are
 * sent together ("Send 2 of 4").
 */
function GroupCard({
  group,
  items,
  latest,
  thumbnails,
  actions,
  selected,
  onSelect,
  unchecked,
  onToggle: toggle,
}: {
  group: string;
  items: SavedItemView[];
  latest: boolean;
  thumbnails: Readonly<Record<string, string | undefined>>;
  actions: CardActions;
  selected: boolean;
  onSelect: () => void;
  /** Items left out (unchecked); kept by the list, so a selection's Send leaves them out too. */
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
  const open = actions.open;
  return (
    <li
      className={cx('saved-card', 'saved-group', latest && 'latest', selected && 'selected')}
      tabIndex={0}
      aria-label={`${items.length} ${what}: ${title}`}
      aria-selected={selected}
      {...selectable(onSelect)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === 'Enter' && actions.sending && picked.length) actions.send(picked);
        else if (event.key === ' ') {
          event.preventDefault();
          onSelect();
        } else if (event.key === 'Delete' || event.key === 'Backspace') {
          actions.remove(items.map((i) => i.id));
        }
      }}
    >
      <Checkbox
        className="saved-card-select"
        checked={selected}
        label={`Select ${title}`}
        onChange={onSelect}
      />
      <div className="saved-card-head">
        <span className="saved-card-icon" aria-hidden="true">
          <span className="codicon codicon-layers" />
        </span>
        <div className="saved-card-heading">
          <div className="saved-card-title-row">
            <span className="saved-card-title" title={title}>
              {title}
            </span>
            <span className="saved-card-count">{items.length}</span>
            {latest && <span className="saved-card-badge">Latest</span>}
          </div>
          <div className="saved-card-meta">
            <span>
              {all ? `${items.length} ${what}` : `${picked.length} of ${items.length} checked`}
            </span>
            {items[0]!.detail && <span title={items[0]!.url}>{items[0]!.detail}</span>}
            <span>{timeAgo(newest)}</span>
            {items[0]!.source && <span>{items[0]!.source}</span>}
          </div>
        </div>
      </div>
      {items.some((i) => i.image) ? (
        <ThumbPicker
          className="saved-group-thumbs"
          items={items.map((i) => ({ id: i.id, src: thumbnails[i.id], label: i.title }))}
          checked={new Set(picked)}
          onToggle={toggle}
          onOpen={open}
        />
      ) : (
        // Elements (and other text): a checklist, one row each.
        <ul className="saved-group-list" aria-label={title}>
          {items.map((item) => (
            <li
              key={item.id}
              className={cx('saved-group-row', !unchecked.has(item.id) && 'on')}
              onDoubleClick={open && (() => open(item.id))}
            >
              <Checkbox
                checked={!unchecked.has(item.id)}
                label={`Include ${item.title}`}
                onChange={() => toggle(item.id)}
              />
              <span
                className={`codicon codicon-${KIND_ICONS[item.kind]} saved-group-row-icon`}
                aria-hidden="true"
              />
              <span className="saved-group-row-text">
                <span className="saved-group-row-title" title={item.title}>
                  {item.title}
                </span>
                {/* Only what differs from the card's own detail (the page). */}
                {item.detail && item.detail !== items[0]!.detail && (
                  <span className="saved-group-row-detail">{item.detail}</span>
                )}
              </span>
              {open && (
                <IconButton
                  icon="go-to-file"
                  label={`Open ${item.title}`}
                  className="small saved-group-row-open"
                  onClick={() => open(item.id)}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="saved-card-actions">
        <SendControls
          ids={picked}
          label={
            all
              ? `${sent ? 'Send all again' : 'Send all'} ${items.length}`
              : `Send ${picked.length} of ${items.length}`
          }
          sent={sent}
          disabled={!picked.length}
          actions={actions}
        />
        <span className="saved-card-tools">
          {actions.ungroup && (
            <IconButton
              icon="list-flat"
              label="Ungroup (show them one by one)"
              onClick={() => actions.ungroup?.(group)}
            />
          )}
          <IconButton
            icon="trash"
            label="Remove the group"
            onClick={() => actions.remove(items.map((i) => i.id))}
          />
        </span>
      </div>
      {sentTo.length > 0 && <SentTo agents={sentTo} />}
    </li>
  );
}

function SentTo({ agents }: { agents: string[] }) {
  return (
    <div className="saved-card-sent" title={`Sent to ${agents.join(', ')}`}>
      <span className="codicon codicon-pass-filled" aria-hidden="true" />
      <span>Sent to {agents.join(', ')}</span>
    </div>
  );
}
