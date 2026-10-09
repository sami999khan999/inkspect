import { useEffect, useRef, useState } from 'react';
import { MAX_PROMPT, type HubTarget } from '../hub';
import { orderTargets, targetDetail, targetForKey, targetIcon } from '../sendModal';
import { actionForChord, chordFromEvent, type ShortcutMap } from '../shortcuts';
import { agentmuxNewTarget, HARNESS_LABELS, parseTargetId, type Harness } from '../targets';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { KeyCaps } from './KeyCaps';
import { Menu, type MenuState } from './Menu';
import { cx } from './popover';
import { Select } from './Select';
import { TextArea } from './TextArea';

export interface SendModalProps {
  /** What was saved ("Screenshot saved"). */
  title: string;
  /** A second line ("Copied too"). */
  detail?: string;
  /** Previews of the saved images. */
  images?: readonly string[];
  /** The project it was saved in, and the others it can move to. */
  project?: { path: string; name: string };
  projects?: readonly { path: string; name: string; detail?: string }[];
  onProject?: (path: string) => void;
  /** Where it can be sent: the project's agents (agentmux, VS Code terminals, chat). */
  targets: readonly HubTarget[];
  defaultTarget?: string;
  /** Agents a new agentmux thread can run (only where agentmux has the project open). */
  harnesses?: readonly Harness[];
  /**
   * Starts a new agentmux thread without sending to it; the dialog stays open and lists it.
   * Without it, picking one starts the thread and sends there.
   */
  onNewThread?: (harness: Harness) => void;
  /** What shows when there is nowhere to send ("No agent is running for this project."). */
  emptyText?: string;
  /**
   * `open`: also show the agentmux thread and bring it to the front. `prompt`: what the user
   * wrote for the agent, pasted before the captures.
   */
  onSend: (target: string, options: { open: boolean; prompt?: string }) => void;
  /** Offers the prompt field (false: the hub answering is too old to carry it). */
  canPrompt?: boolean;
  onCopy?: () => void;
  onDownload?: () => void;
  /** The download button's label ("Download", "Reveal in folder"). */
  downloadLabel?: string;
  /** Esc: the capture stays saved, nothing is sent. */
  onClose: () => void;
  /** What happens now ("Sending to Claude Code…", an error). */
  status?: { tone: 'busy' | 'ok' | 'error'; text: string };
  /** The shortcut map (the dialog's own keys are the `send` scope). */
  map: ShortcutMap;
}

const FOCUSABLE = 'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])';

/**
 * The dialog after every capture: it was saved already; this says where to send it. One click
 * (or number key) per agent, the default first (Enter); a new agentmux thread; another project;
 * copy or download. Centered, it holds the focus until it closes.
 */
export function SendModal(props: SendModalProps) {
  const { targets, defaultTarget, harnesses = [], onClose, map, canPrompt = true } = props;
  const ref = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState('');
  // The target of the send under way (a new agentmux thread takes a while: the dialog says so).
  const [sending, setSending] = useState<string>();
  const onSend = (target: string, options: { open: boolean }) => {
    setSending(target);
    const asked = prompt.trim();
    props.onSend(target, asked ? { ...options, prompt: asked } : options);
  };
  const threadButton = useRef<HTMLButtonElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const ordered = orderTargets(targets, defaultTarget);
  // The agent Enter sends to: the default until an arrow key picks another.
  const [chosen, setChosen] = useState<string>();
  const activeId = ordered.some((t) => t.id === chosen) ? chosen : ordered[0]?.id;
  const busy = props.status?.tone === 'busy';
  const hasThreads = ordered.some((t) => t.kind === 'tmux');
  const allClosed = ordered.length > 0 && ordered.every((t) => t.closed);
  const starting = sending ? parseTargetId(sending) : undefined;
  const statusText =
    busy && starting?.kind === 'agentmux-new'
      ? `Starting a new ${HARNESS_LABELS[starting.harness]} thread in agentmux…`
      : props.status?.text;
  const key = (id: string) => map[id]?.[0];

  // The dialog takes the focus as it opens (and gives it back when it closes).
  useEffect(() => {
    const before = (ref.current?.getRootNode() as Document | ShadowRoot | undefined)
      ?.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => before?.focus?.();
  }, []);

  // The page behind doesn't scroll while the dialog is open, and focus can't leave it (Tab, or a
  // script moving it): both are undone when it closes.
  useEffect(() => {
    const dialog = ref.current;
    const backdrop = dialog?.parentElement;
    if (!dialog || !backdrop) return;
    const root = dialog.getRootNode() as Document | ShadowRoot;
    const host = root instanceof ShadowRoot ? root.host : undefined;
    const doc = dialog.ownerDocument;
    const html = doc.documentElement;
    const was = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: doc.body.style.overflow,
      paddingRight: html.style.paddingRight,
    };
    const gap = doc.defaultView ? doc.defaultView.innerWidth - html.clientWidth : 0;
    html.style.overflow = 'hidden';
    doc.body.style.overflow = 'hidden';
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    // Wheel and touch over the backdrop would scroll the page; inside the dialog they scroll it.
    const stopScroll = (event: Event) => {
      if (!dialog.contains(event.target as Node) || dialog.scrollHeight <= dialog.clientHeight) {
        event.preventDefault();
      }
    };
    backdrop.addEventListener('wheel', stopScroll, { passive: false });
    backdrop.addEventListener('touchmove', stopScroll, { passive: false });
    const keep = (event: FocusEvent) => {
      const target = event.target as Node | null;
      // From inside a closed shadow root, focus shows as the host element.
      if (!target || target === host || dialog.contains(target)) return;
      if ((target as Element).closest?.('[data-ink-popup]')) return;
      (dialog.querySelector<HTMLElement>(FOCUSABLE) ?? dialog).focus();
    };
    doc.addEventListener('focusin', keep, true);
    return () => {
      html.style.overflow = was.htmlOverflow;
      doc.body.style.overflow = was.bodyOverflow;
      html.style.paddingRight = was.paddingRight;
      backdrop.removeEventListener('wheel', stopScroll);
      backdrop.removeEventListener('touchmove', stopScroll);
      doc.removeEventListener('focusin', keep, true);
    };
  }, []);

  /** Moves the selection through the agents (arrow keys), wrapping at the ends. */
  const move = (step: number) => {
    if (!ordered.length) return;
    const at = ordered.findIndex((t) => t.id === activeId);
    const next = ordered[(at + step + ordered.length) % ordered.length]!;
    setChosen(next.id);
    ref.current?.querySelector<HTMLElement>(`[data-target="${CSS.escape(next.id)}"]`)?.focus();
  };

  const openThreads = () => {
    const rect = threadButton.current?.getBoundingClientRect();
    if (!rect) return;
    setMenu({
      x: rect.left,
      y: rect.bottom + 4,
      anchor: rect,
      items: harnesses.map((harness) => ({
        label: HARNESS_LABELS[harness],
        icon: 'terminal-tmux',
        onSelect: () => {
          if (!props.onNewThread) return onSend(agentmuxNewTarget(harness), { open: false });
          // The new thread becomes the chosen one once it is listed.
          setChosen(undefined);
          props.onNewThread(harness);
        },
      })),
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.defaultPrevented) return;
    if (event.key === 'Tab') {
      // Focus stays in the dialog.
      const items = [...(ref.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])];
      if (!items.length) return;
      const root = ref.current!.getRootNode() as Document | ShadowRoot;
      const at = items.indexOf(root.activeElement as HTMLElement);
      const next = event.shiftKey ? (at <= 0 ? items.length - 1 : at - 1) : (at + 1) % items.length;
      items[next]!.focus();
      event.preventDefault();
      return;
    }
    // While it saves or sends, Esc still closes it (it stays saved; a send carries on).
    if (busy) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    const native = event.nativeEvent;
    // Typing a prompt: Enter sends it to the chosen agent (Shift+Enter: a new line), Esc closes;
    // every other key is text.
    if (event.target === promptRef.current) {
      if (event.key === 'Enter' && !event.shiftKey && !native.isComposing) {
        event.preventDefault();
        if (activeId) onSend(activeId, { open: false });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
      event.stopPropagation();
      return;
    }
    // Up and Down pick the agent (Enter sends to it); menus and lists take their own arrows.
    const inList = (event.target as HTMLElement).closest('[role="menu"], [role="listbox"], input');
    if ((event.key === 'ArrowDown' || event.key === 'ArrowUp') && !inList && ordered.length) {
      event.preventDefault();
      event.stopPropagation();
      move(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }
    // Number keys pick an agent; with Shift, an agentmux one also comes to the front.
    const digit = /^Digit([1-9])$/.exec(native.code)?.[1];
    const picked =
      digit && !event.ctrlKey && !event.altKey && !event.metaKey
        ? targetForKey(digit, ordered)
        : undefined;
    if (picked) {
      event.preventDefault();
      event.stopPropagation();
      onSend(picked.id, { open: event.shiftKey && picked.kind === 'tmux' });
      return;
    }
    // Enter on a focused button presses it; the dialog's own Enter only when nothing is focused.
    const onButton = (event.target as HTMLElement).closest('button') && event.key === 'Enter';
    if (onButton) return;
    const action = actionForChord(map, ['send'], chordFromEvent(native))?.id;
    const run: Record<string, (() => void) | undefined> = {
      'send.default': activeId ? () => onSend(activeId, { open: false }) : undefined,
      'send.newThread': harnesses.length ? openThreads : undefined,
      'send.prompt': canPrompt ? () => promptRef.current?.focus() : undefined,
      'send.project': props.onProject
        ? () => projectRef.current?.querySelector('button')?.click()
        : undefined,
      'send.copy': props.onCopy,
      'send.download': props.onDownload,
      'send.close': onClose,
    };
    const handler = action ? run[action] : event.key === 'Escape' ? onClose : undefined;
    if (!handler) return;
    event.preventDefault();
    event.stopPropagation();
    handler();
  };

  return (
    <div
      className="ink-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <div
        ref={ref}
        className="ink-modal"
        role="dialog"
        aria-modal="true"
        aria-label={props.title}
        tabIndex={-1}
        onKeyDown={onKeyDown}
      >
        <div className="ink-modal-head">
          <div className="ink-modal-heading">
            <div className="ink-modal-title">
              <span className="codicon codicon-pass-filled" aria-hidden="true" />
              <span className="ink-modal-title-text" title={props.title}>
                {props.title}
              </span>
            </div>
            {props.project && (
              <div className="ink-modal-project" ref={projectRef}>
                <span className="ink-muted">Saved in</span>
                {props.projects && props.projects.length > 1 && props.onProject ? (
                  <Select
                    size="sm"
                    appearance="quiet"
                    label="Project"
                    icon="folder"
                    value={props.project.path}
                    onChange={props.onProject}
                    options={props.projects.map((p) => ({
                      value: p.path,
                      label: p.name,
                      detail: p.detail,
                      icon: 'folder',
                    }))}
                  />
                ) : (
                  <span className="ink-modal-project-name">{props.project.name}</span>
                )}
              </div>
            )}
            {props.detail && <div className="ink-modal-detail">{props.detail}</div>}
          </div>
          <IconButton icon="close" label="Close (it stays saved)" onClick={onClose} />
        </div>

        {!!props.images?.length && (
          <div className="ink-modal-thumbs" aria-hidden="true">
            {props.images.slice(0, 4).map((src, index, shown) => (
              <span key={index} className="ink-modal-thumb">
                <img src={src} alt="" />
                {index === shown.length - 1 && props.images!.length > shown.length && (
                  <span className="ink-modal-more">+{props.images!.length - shown.length}</span>
                )}
              </span>
            ))}
          </div>
        )}

        {canPrompt && (
          <TextArea
            ref={promptRef}
            className="ink-modal-prompt"
            aria-label="Prompt for the agent"
            placeholder="Add a prompt (optional). Enter sends, Shift+Enter adds a line."
            value={prompt}
            maxLength={MAX_PROMPT}
            disabled={busy}
            onChange={(event) => setPrompt(event.target.value)}
          />
        )}

        <div className="ink-modal-label">
          Send to
          {ordered.length > 0 && <span className="ink-modal-count">{ordered.length}</span>}
        </div>
        {ordered.length ? (
          <ul className="ink-modal-targets" role="list">
            {ordered.map((target, index) => (
              <li
                key={target.id}
                className={cx(
                  'ink-modal-target',
                  target.id === activeId && 'default',
                  target.closed && 'closed',
                )}
              >
                <button
                  type="button"
                  className="ink-modal-send"
                  data-target={target.id}
                  aria-current={target.id === activeId ? 'true' : undefined}
                  disabled={busy}
                  onClick={() => onSend(target.id, { open: false })}
                  aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
                >
                  <span className="ink-modal-icon" aria-hidden="true">
                    <span className={`codicon codicon-${targetIcon(target)}`} />
                  </span>
                  <span className="ink-modal-text">
                    <span className="ink-modal-agent">{target.label}</span>
                    <span className="ink-modal-where">{targetDetail(target)}</span>
                  </span>
                  <span className="ink-modal-keys">
                    {index < 9 && <span className="ink-modal-number">{index + 1}</span>}
                    {target.id === activeId && key('send.default') && (
                      <KeyCaps binding={key('send.default')!} size="sm" />
                    )}
                  </span>
                </button>
                {target.kind === 'tmux' ? (
                  <IconButton
                    icon="link-external"
                    label={`Send and open ${target.detail} in agentmux`}
                    disabled={busy}
                    onClick={() => onSend(target.id, { open: true })}
                  />
                ) : (
                  // Keeps every row as wide as those with the button.
                  hasThreads && <span className="ink-modal-open-space" aria-hidden="true" />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="ink-modal-empty">
            {props.emptyText ?? 'No agent is running for this project.'}
          </div>
        )}
        {allClosed && (
          <div className="ink-modal-note">
            agentmux is closed and no VS Code agent is open. Sending opens agentmux first.
          </div>
        )}
        {harnesses.length > 0 && (
          <Button
            ref={threadButton}
            size="sm"
            variant="ghost"
            icon="add"
            iconEnd="chevron-down"
            className="ink-modal-thread"
            disabled={busy}
            onClick={openThreads}
          >
            New agentmux thread
            {key('send.newThread') && <KeyCaps binding={key('send.newThread')!} size="sm" />}
          </Button>
        )}

        <div className="ink-modal-foot">
          <span
            className={cx('ink-modal-status', props.status && `tone-${props.status.tone}`)}
            role="status"
          >
            {statusText ?? 'Esc keeps it saved.'}
          </span>
          {props.onCopy && (
            <Button size="sm" variant="ghost" icon="copy" disabled={busy} onClick={props.onCopy}>
              Copy
              {key('send.copy') && <KeyCaps binding={key('send.copy')!} size="sm" />}
            </Button>
          )}
          {props.onDownload && (
            <Button
              size="sm"
              variant="ghost"
              icon="desktop-download"
              disabled={busy}
              onClick={props.onDownload}
            >
              {props.downloadLabel ?? 'Download'}
              {key('send.download') && <KeyCaps binding={key('send.download')!} size="sm" />}
            </Button>
          )}
        </div>
        {menu && <Menu menu={menu} onClose={() => setMenu(null)} />}
      </div>
    </div>
  );
}
