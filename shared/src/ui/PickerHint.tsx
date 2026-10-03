import type { CSSProperties } from 'react';
import { keyParts, type ShortcutMap } from '../shortcuts';
import { cx } from './popover';

const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

interface PickerHintProps {
  /** Picking to capture (details, a screenshot with Alt), or to screenshot one element. */
  purpose: string;
  /** The current keys, so remapped keys show. */
  map: ShortcutMap;
  /** Show the key that lists every picker key (where the picker has that list). */
  helpKey?: boolean;
  className?: string;
  style?: CSSProperties;
}

/**
 * The element picker's hint, shared by VS Code Browser and the browser extension, on one line:
 * a click captures the element's details, Alt+click a screenshot of it, Shift+click adds it to a
 * selection (Enter captures them all). Every capture is saved, then the send dialog offers where
 * it goes. Keys come from the shortcut map, so remapped keys show. Drawn over the page, so it has
 * its own dark look.
 */
export function PickerHint({ purpose, map, helpKey, className, style }: PickerHintProps) {
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
      <span className="picker-hint-item">
        <span className="picker-hint-lead">Click</span>
        <span className="picker-hint-label">to capture</span>
      </span>
      <Item caps={[isMac ? '⌥' : 'Alt']} click label="screenshot" />
      <Item caps={[isMac ? '⇧' : 'Shift']} click label="to add" />
      <Item caps={caps('inspect.exit')} label="stop" />
      {helpKey && <Item caps={caps('inspect.help')} label="keys" />}
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
