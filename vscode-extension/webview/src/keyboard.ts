import type { KeyInput } from '@shared/protocol';
import { BROWSER_SHORTCUTS, chordFromEvent, chordsEqual, parseChord } from '@shared/shortcuts';

export const isMac = navigator.userAgent.includes('Macintosh');

const RESERVED = BROWSER_SHORTCUTS.map((shortcut) =>
  parseChord(isMac ? shortcut.mac : shortcut.key),
);

/**
 * Browser shortcuts are VS Code keybindings. The webview lets these keys bubble up to VS Code
 * (which runs the command) instead of sending them to the page.
 */
export function isBrowserShortcut(event: KeyboardEvent): boolean {
  const chord = chordFromEvent(event);
  return RESERVED.some((reserved) => chordsEqual(reserved, chord));
}

/** Label for a shortcut in menus, e.g. `Ctrl+T` or `⌘T`. */
export function shortcutLabel(command: string): string | undefined {
  const shortcut = BROWSER_SHORTCUTS.find((s) => s.command === command);
  if (!shortcut) return undefined;
  const chord = parseChord(isMac ? shortcut.mac : shortcut.key);
  const key =
    chord.key.length === 1
      ? chord.key.toUpperCase()
      : chord.key[0]!.toUpperCase() + chord.key.slice(1);
  if (isMac) {
    return `${chord.ctrl ? '⌃' : ''}${chord.alt ? '⌥' : ''}${chord.shift ? '⇧' : ''}${chord.meta ? '⌘' : ''}${key}`;
  }
  return [chord.ctrl && 'Ctrl', chord.alt && 'Alt', chord.shift && 'Shift', key]
    .filter(Boolean)
    .join('+');
}

/** CDP modifier bitmask. AltGr (reported as Ctrl+Alt on Windows) types characters, so it is dropped. */
export function modifiersOf(event: KeyboardEvent | MouseEvent): number {
  const altGraph = event.getModifierState('AltGraph');
  const alt = event.altKey && !altGraph;
  const ctrl = event.ctrlKey && !altGraph;
  return (alt ? 1 : 0) | (ctrl ? 2 : 0) | (event.metaKey ? 4 : 0) | (event.shiftKey ? 8 : 0);
}

export function keyInput(event: KeyboardEvent, type: 'keyDown' | 'keyUp'): KeyInput {
  return {
    kind: 'key',
    type,
    key: event.key,
    code: event.code,
    keyCode: event.keyCode,
    location: event.location,
    modifiers: modifiersOf(event),
    repeat: event.repeat,
  };
}

const EDITING_CODES = new Set([
  'KeyA',
  'KeyC',
  'KeyV',
  'KeyX',
  'KeyY',
  'KeyZ',
  'Backspace',
  'Delete',
  'ArrowLeft',
  'ArrowRight',
  'ArrowUp',
  'ArrowDown',
  'Home',
  'End',
  'Enter',
  'Insert',
]);

/** Ctrl/Cmd combinations that edit text in the page, which VS Code must not also act on. */
export function isEditingCombo(event: KeyboardEvent): boolean {
  const primary = isMac ? event.metaKey : event.ctrlKey;
  return primary && EDITING_CODES.has(event.code);
}
