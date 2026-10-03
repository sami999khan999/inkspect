import { useEffect, useRef, useState } from 'react';
import type { HubTarget } from '../hub';
import { orderTargets, targetForKey, targetIcon } from '../sendModal';
import { actionForChord, chordFromEvent, type ShortcutMap } from '../shortcuts';
import { agentmuxNewTarget, HARNESS_LABELS, type Harness } from '../targets';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { KeyCaps } from './KeyCaps';
import { Menu, type MenuState } from './Menu';
import { cx } from './popover';
import { Select } from './Select';

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
  /** What shows when there is nowhere to send ("No agent is running for this project."). */
  emptyText?: string;
  /** `open`: also show the agentmux thread and bring it to the front. */
  onSend: (target: string, options: { open: boolean }) => void;
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
  const { targets, defaultTarget, harnesses = [], onSend, onClose, map } = props;
  const ref = useRef<HTMLDivElement>(null);
  const threadButton = useRef<HTMLButtonElement>(null);
  const projectRef = useRef<HTMLDivElement>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const ordered = orderTargets(targets, defaultTarget);
  const busy = props.status?.tone === 'busy';
  const key = (id: string) => map[id]?.[0];

  // The dialog takes the focus as it opens (and gives it back when it closes).
  useEffect(() => {
    const before = (ref.current?.getRootNode() as Document | ShadowRoot | undefined)
      ?.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => before?.focus?.();
  }, []);

  const openThreads = () => {
    const rect = threadButton.current?.getBoundingClientRect();
    if (!rect) return;
    setMenu({
      x: rect.left,
      y: rect.bottom + 4,
      items: harnesses.map((harness) => ({
        label: HARNESS_LABELS[harness],
        icon: 'terminal-tmux',
        onSelect: () => onSend(agentmuxNewTarget(harness), { open: false }),
      })),
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.defaultPrevented) return;
    // While it saves or sends, Esc still closes it (it stays saved; a send carries on).
    if (busy) {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      onClose();
      return;
    }
    const native = event.nativeEvent;
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
      'send.default': ordered[0] ? () => onSend(ordered[0]!.id, { open: false }) : undefined,
      'send.newThread': harnesses.length ? openThreads : undefined,
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
          {!!props.images?.length && (
            <div className="ink-modal-thumbs" aria-hidden="true">
              {props.images.slice(0, 4).map((src, index) => (
                <img key={index} src={src} alt="" />
              ))}
            </div>
          )}
          <div className="ink-modal-heading">
            <div className="ink-modal-title">
              <span className="codicon codicon-pass-filled" aria-hidden="true" />
              {props.title}
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

        <div className="ink-modal-label">Send to</div>
        {ordered.length ? (
          <ul className="ink-modal-targets" role="list">
            {ordered.map((target, index) => (
              <li key={target.id} className={cx('ink-modal-target', index === 0 && 'default')}>
                <button
                  type="button"
                  className="ink-modal-send"
                  disabled={busy}
                  onClick={() => onSend(target.id, { open: false })}
                  aria-keyshortcuts={index < 9 ? String(index + 1) : undefined}
                >
                  {index < 9 && <span className="ink-modal-number">{index + 1}</span>}
                  <span className={`codicon codicon-${targetIcon(target)}`} aria-hidden="true" />
                  <span className="ink-modal-agent">{target.label}</span>
                  <span className="ink-modal-where">{target.detail}</span>
                  {index === 0 && key('send.default') && (
                    <KeyCaps binding={key('send.default')!} size="sm" />
                  )}
                </button>
                {target.kind === 'tmux' && (
                  <IconButton
                    icon="link-external"
                    label={`Send and open ${target.detail} in agentmux`}
                    disabled={busy}
                    onClick={() => onSend(target.id, { open: true })}
                  />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="ink-modal-empty">
            {props.emptyText ?? 'No agent is running for this project.'}
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
            {props.status?.text ?? 'Esc keeps it saved without sending.'}
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
