import type { KeyInput } from '@shared/protocol';

// Shortcut labels come from the shortcut store (the user can remap every key).
export { isMac, shortcutLabel } from './shortcuts';
import { isMac } from './shortcuts';

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
