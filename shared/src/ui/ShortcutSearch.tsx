import { useEffect, useRef, useState } from 'react';
import { chordFromEvent, formatKey, MODIFIER_KEYS, searchKeyFromChord } from '../shortcuts';
import { TextField } from './TextField';

const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

/** The focused shortcut search box, if any: it gets every shortcut pressed. */
let active: ((binding: string) => void) | null = null;

/**
 * Puts a shortcut into the focused shortcut search box, if there is one. For keys the page never
 * sees (the browser extension's own command arrives in its background): returns false otherwise.
 */
export function fillActiveSearch(binding: string): boolean {
  if (!active) return false;
  active(binding);
  return true;
}

// One capture listener on the window, added as this module loads: it runs before the page's,
// the toolbar's or VS Code's own key handling added later, and it sees keys inside closed shadow
// roots too (the box is tracked by focus, not found through the event).
if (typeof window !== 'undefined') {
  window.addEventListener(
    'keydown',
    (event) => {
      if (!active || MODIFIER_KEYS.has(event.key)) return;
      // Everything pressed in the box stays in the box; typing still types (its default).
      event.stopImmediatePropagation();
      const key = searchKeyFromChord(chordFromEvent(event));
      if (!key) return;
      event.preventDefault();
      active(key);
    },
    true,
  );
}

/**
 * The search box of the shortcut lists. Type words or a shortcut ("alt shift k"), or press the
 * shortcut itself while the box has focus: it traps it and searches for it, e.g. "Alt+Shift+K".
 */
export function ShortcutSearch({
  value,
  onChange,
  size,
}: {
  value: string;
  onChange: (value: string) => void;
  size?: 'sm' | 'md';
}) {
  // The latest onChange, for the (stable) handler the window listener calls.
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });
  const [handler] = useState(() => (binding: string) => latest.current(formatKey(binding, isMac)));
  // A box removed while focused stops trapping keys.
  useEffect(
    () => () => {
      if (active === handler) active = null;
    },
    [handler],
  );
  return (
    <TextField
      size={size}
      icon="search"
      placeholder="Search actions or keys, or press a shortcut"
      aria-label="Search shortcuts: type, or press a shortcut"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onClear={() => onChange('')}
      onFocus={() => {
        active = handler;
      }}
      onBlur={() => {
        if (active === handler) active = null;
      }}
    />
  );
}
