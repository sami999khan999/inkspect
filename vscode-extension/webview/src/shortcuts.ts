import { useEffect, useRef, useSyncExternalStore } from 'react';
import {
  actionForChord,
  chordFromEvent,
  chordKey,
  effectiveShortcuts,
  formatKey,
  MODIFIER_KEYS,
  SHORTCUT_ACTIONS,
  type ShortcutMap,
  type ShortcutOverrides,
  type ShortcutScope,
} from '@shared/shortcuts';
import { postToHost } from './vscode';

export const isMac = navigator.userAgent.includes('Macintosh');

// The effective shortcuts: the defaults plus the user's overrides sent by the host.
let map: ShortcutMap = effectiveShortcuts({}, isMac);
const listeners = new Set<() => void>();

export function setShortcutOverrides(overrides: ShortcutOverrides): void {
  map = effectiveShortcuts(overrides, isMac);
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** The shortcut map, re-rendering the component when the user changes a shortcut. */
export function useShortcutMap(): ShortcutMap {
  return useSyncExternalStore(subscribe, () => map);
}

/**
 * The label of an action's first key (`Ctrl+T`, `⌘T`), by action id or by VS Code command.
 * Read at render time; components that show labels call useShortcutMap() to stay current.
 */
export function shortcutLabel(idOrCommand: string): string | undefined {
  const action = SHORTCUT_ACTIONS.find((a) => a.id === idOrCommand || a.command === idOrCommand);
  const key = action && map[action.id]?.[0];
  return key ? formatKey(key, isMac) : undefined;
}

/** "Label (Key)" for tooltips. */
export function withShortcut(label: string, idOrCommand: string): string {
  const key = shortcutLabel(idOrCommand);
  return key ? `${label} (${key})` : label;
}

/** Whether the focus is in a text field, where plain keys type instead of running shortcuts. */
function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  if (target.classList.contains('viewport-input')) return false;
  return (
    target.isContentEditable ||
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT'
  );
}

/** Text-editing chords that stay with a focused text field. */
const EDITING =
  /^(ctrl|cmd)\+(shift\+)?(a|c|v|x|z|y|left|right|up|down|home|end|backspace|delete)$/;

// Keys whose key-down ran a shortcut: their key-up must not reach the page either.
const consumed = new Set<string>();

/** True (once) when this key-up ends a key press that ran a shortcut. */
export function endsShortcut(code: string): boolean {
  return consumed.delete(code);
}

export type ShortcutHandlers = Partial<Record<string, () => void>>;

/**
 * The one keyboard dispatcher: a capture-phase listener that runs the action bound to a key in
 * the active scopes (most specific first). A handled key is kept from the page and from VS Code.
 * Actions without a handler here run their VS Code command through the host.
 */
export function useShortcutDispatch(
  scopes: readonly ShortcutScope[],
  handlers: () => ShortcutHandlers,
): void {
  const state = useRef({ scopes, handlers });
  useEffect(() => {
    state.current = { scopes, handlers };
  });
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.isComposing || event.keyCode === 229 || MODIFIER_KEYS.has(event.key)) return;
      // The send dialog takes its own keys (see SendModal).
      if (event.target instanceof Element && event.target.closest('.ink-modal')) return;
      const chord = chordFromEvent(event);
      const plain = !chord.ctrl && !chord.alt && !chord.meta && !/^f\d+$/.test(chord.key);
      const typing = isTyping(event.target);
      // In a text field, plain keys type and editing chords (copy, undo, word moves) edit.
      if (typing && (plain || EDITING.test(chordKey(chord)))) return;
      const action = actionForChord(map, state.current.scopes, chord);
      if (!action) return;
      const handler = state.current.handlers()[action.id];
      if (handler) handler();
      else if (action.command) postToHost({ type: 'command', command: action.command });
      else return;
      consumed.add(event.code);
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener('keydown', onKeyDown, true);
    return () => window.removeEventListener('keydown', onKeyDown, true);
  }, []);
}

/** The actions of a scope with their keys, for the cheat sheet and the mode hint bars. */
export function scopeShortcuts(
  scope: ShortcutScope,
): { id: string; label: string; keys: string[] }[] {
  return SHORTCUT_ACTIONS.filter((a) => a.scope === scope).map((a) => ({
    id: a.id,
    label: a.label,
    keys: (map[a.id] ?? []).map((k) => formatKey(k, isMac)),
  }));
}
