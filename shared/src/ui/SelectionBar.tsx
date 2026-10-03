import type { CSSProperties } from 'react';
import { keyParts, type ShortcutMap } from '../shortcuts';
import { Button } from './Button';
import { IconButton } from './IconButton';
import { cx } from './popover';

const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

/** What can be done with the elements picked with Shift+click. */
export type SelectionAction = 'copy' | 'screenshot' | 'clear';

const ACTIONS: { action: SelectionAction; label: string; icon: string }[] = [
  { action: 'copy', label: 'Capture', icon: 'inspect' },
  { action: 'screenshot', label: 'Screenshot', icon: 'device-camera' },
];

/**
 * The bar over the page while elements are selected with Shift+click, shared by VS Code Browser
 * and the browser extension: capture their details (Enter) or screenshots, all at once. Like any
 * capture, they are saved, then the send dialog offers where they go.
 */
export function SelectionBar({
  count,
  map,
  onAction,
  className,
  style,
}: {
  count: number;
  /** The current keys: Enter (capture) shows its key. */
  map: ShortcutMap;
  onAction: (action: SelectionAction) => void;
  className?: string;
  style?: CSSProperties;
}) {
  const copyKey = map['inspect.copy']?.[0];
  return (
    <div
      className={cx('selection-bar', className)}
      style={style}
      role="toolbar"
      aria-label="Selected elements"
      // The picker takes presses on the page; this bar is not the page.
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span className="selection-bar-count">
        <span className="selection-bar-badge">{count}</span>
        selected
      </span>
      {ACTIONS.map(({ action, label, icon }) => (
        <Button
          key={action}
          size="sm"
          variant={action === 'copy' ? 'primary' : 'ghost'}
          icon={icon}
          onClick={() => onAction(action)}
        >
          {label}
          {action === 'copy' && copyKey && (
            <span className="keycaps size-sm">
              {keyParts(copyKey, isMac).map((cap) => (
                <kbd key={cap} className="keycap">
                  {cap}
                </kbd>
              ))}
            </span>
          )}
        </Button>
      ))}
      <IconButton
        icon="close"
        label="Clear the selection"
        className="small selection-bar-clear"
        onClick={() => onAction('clear')}
      />
    </div>
  );
}
