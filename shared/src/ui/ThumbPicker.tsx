import { Checkbox } from './Switch';
import { cx } from './popover';

export interface ThumbItem {
  id: string;
  /** Image URL (a data or object URL); without one, a placeholder. */
  src?: string;
  /** Names it for screen readers and the tooltip ("Drawing 2 of 4"). */
  label: string;
}

/**
 * Screenshots taken together, as a grid of thumbnails with a checkbox each: the ones checked
 * are what the popup's or card's actions use ("Send 2 of 4"). Shared by the browser extension's
 * capture popup and VS Code Browser's Agent Context group cards.
 */
export function ThumbPicker({
  items,
  checked,
  onToggle,
  onOpen,
  className,
}: {
  items: readonly ThumbItem[];
  checked: ReadonlySet<string>;
  onToggle: (id: string) => void;
  /** Clicking a thumbnail opens it; without this, clicking it toggles its checkbox. */
  onOpen?: (id: string) => void;
  className?: string;
}) {
  return (
    <ul className={cx('thumb-picker', className)} aria-label="Screenshots">
      {items.map((item) => {
        const on = checked.has(item.id);
        return (
          <li key={item.id} className={cx('thumb-picker-item', on && 'on')} title={item.label}>
            <button
              type="button"
              className="thumb-picker-image"
              aria-label={onOpen ? `Open ${item.label}` : `Include ${item.label}`}
              aria-pressed={onOpen ? undefined : on}
              onClick={() => (onOpen ? onOpen(item.id) : onToggle(item.id))}
            >
              {item.src ? (
                <img src={item.src} alt="" />
              ) : (
                <span className="codicon codicon-file-media" aria-hidden="true" />
              )}
            </button>
            <Checkbox
              className="thumb-picker-check"
              checked={on}
              label={`Include ${item.label}`}
              onChange={() => onToggle(item.id)}
            />
          </li>
        );
      })}
    </ul>
  );
}
