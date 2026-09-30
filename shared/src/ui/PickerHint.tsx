import type { CSSProperties } from 'react';
import { keyParts, type ShortcutMap } from '../shortcuts';
import { cx } from './popover';

const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

interface PickerHintProps {
  /** Picking to copy or send (all the actions), or to screenshot one element. */
  purpose: string;
  /** The current keys, so remapped keys show. */
  map: ShortcutMap;
  /** What Alt+click does: "screenshot it", "copy with a screenshot". */
  altLabel: string;
  /** Show the key that lists every picker key (where the picker has that list). */
  helpKey?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * The element picker's hint, shared by VS Code Browser and the browser extension: what a click
 * does, with each modifier (Ctrl + click sends to the chat agent, Ctrl Shift + click to a terminal
 * agent), on one row; the keys on a second row.
 * Keys come from the shortcut map, so remapped keys show. Drawn over the page, so it has its own
 * dark look.
 */
export function PickerHint({ purpose, map, altLabel, helpKey, className, style }: PickerHintProps) {
  const mod = isMac ? '⌘' : 'Ctrl';
  const shift = isMac ? '⇧' : 'Shift';
  const caps = (id: string) => {
    const binding = map[id]?.[0];
    return binding ? keyParts(binding, isMac) : [];
  };

  if (purpose === 'screenshot') {
    return (
      <div className={cx('picker-hint', className)} style={style} role="status">
        <span className="picker-hint-lead">Click an element to screenshot it</span>
        <Item caps={caps('inspect.exit')} label="cancel" />
      </div>
    );
  }
  return (
    <div className={cx('picker-hint', className)} style={style} role="status">
      <span className="picker-hint-group">
        <span className="picker-hint-item">
          <span className="picker-hint-lead">Click</span>
          <span className="picker-hint-label">copy details</span>
        </span>
        <Item caps={[mod]} click label="chat agent" />
        <Item caps={[mod, shift]} click label="terminal agent" />
        <Item caps={[shift]} click label="select" />
        <Item caps={[isMac ? '⌥' : 'Alt']} click label={altLabel} />
      </span>
      <span className="picker-hint-group">
        <Item caps={[...caps('inspect.parent'), ...caps('inspect.child')]} label="parent / child" />
        <Item caps={caps('inspect.copy')} label="copy selected" />
        <Item caps={caps('inspect.exit')} label="stop" />
        {helpKey && <Item caps={caps('inspect.help')} label="all keys" />}
      </span>
    </div>
  );
}

/** Key caps, "+ click" for a modifier click, then what it does. */
function Item({ caps, click, label }: { caps: string[]; click?: boolean; label: string }) {
  if (!caps.length) return null;
  return (
    <span className="picker-hint-item">
      <span className="keycaps size-sm">
        {caps.map((cap, index) => (
          <kbd key={index} className="keycap">
            {cap}
          </kbd>
        ))}
      </span>
      {click && <span className="picker-hint-click">+ click</span>}
      <span className="picker-hint-label">{label}</span>
    </span>
  );
}
