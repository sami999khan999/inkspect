import { keyParts } from '../shortcuts';

const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

/** A shortcut drawn as key caps (`Ctrl` `Shift` `C`), like VS Code's keybinding labels. */
export function KeyCaps({ binding, size = 'md' }: { binding: string; size?: 'sm' | 'md' }) {
  const parts = keyParts(binding, isMac);
  return (
    <span className={`keycaps size-${size}`} aria-label={parts.join('+')}>
      {parts.map((part, index) => (
        <kbd key={index} className="keycap">
          {part}
        </kbd>
      ))}
    </span>
  );
}
