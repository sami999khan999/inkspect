import { describe, expect, it } from 'vitest';
import {
  actionForChord,
  chordFromEvent,
  chordKey,
  effectiveShortcuts,
  keyMatchesQuery,
  searchKeyFromChord,
  type KeyChord,
} from '../src/shortcuts';

const chord = (key: string, mods: Partial<KeyChord> = {}): KeyChord => ({
  ctrl: false,
  shift: false,
  alt: false,
  meta: false,
  key,
  ...mods,
});

describe('keyMatchesQuery', () => {
  it('finds a key however the shortcut is written', () => {
    for (const query of ['alt shift k', 'Alt+Shift+K', 'shift alt k', 'shift-alt-k', '⌥⇧K']) {
      expect(keyMatchesQuery('alt+shift+k', query), query).toBe(true);
    }
    expect(keyMatchesQuery('ctrl+shift+c', 'control shift c')).toBe(true);
    expect(keyMatchesQuery('cmd+k', 'command k')).toBe(true);
    expect(keyMatchesQuery('escape', 'esc')).toBe(true);
  });

  it('needs every modifier typed, and the key typed', () => {
    expect(keyMatchesQuery('alt+k', 'alt shift k')).toBe(false);
    expect(keyMatchesQuery('alt+shift+j', 'alt shift k')).toBe(false);
    // Only modifiers: every key with them.
    expect(keyMatchesQuery('alt+shift+j', 'alt shift')).toBe(true);
    // A key name typed partly.
    expect(keyMatchesQuery('pagedown', 'page')).toBe(true);
  });

  it('matches nothing for plain words', () => {
    expect(keyMatchesQuery('alt+shift+k', 'open toolbar')).toBe(false);
    expect(keyMatchesQuery('alt+shift+k', '')).toBe(false);
  });
});

describe('searchKeyFromChord', () => {
  it('turns shortcuts pressed in a search box into the search', () => {
    expect(searchKeyFromChord(chord('k', { alt: true, shift: true }))).toBe('shift+alt+k');
    expect(searchKeyFromChord(chord('k', { ctrl: true }))).toBe('ctrl+k');
    expect(searchKeyFromChord(chord('f5'))).toBe('f5');
    expect(searchKeyFromChord(chord('c', { ctrl: true, shift: true }))).toBe('ctrl+shift+c');
  });

  it('traps every shortcut, the editing ones included', () => {
    expect(searchKeyFromChord(chord('v', { ctrl: true }))).toBe('ctrl+v');
    expect(searchKeyFromChord(chord('a', { meta: true }))).toBe('cmd+a');
    expect(searchKeyFromChord(chord('z', { ctrl: true, shift: true }))).toBe('ctrl+shift+z');
    expect(searchKeyFromChord(chord('f12'))).toBe('f12');
  });

  it('leaves typing to the box', () => {
    expect(searchKeyFromChord(chord('k'))).toBeUndefined();
    expect(searchKeyFromChord(chord('k', { shift: true }))).toBeUndefined();
    expect(searchKeyFromChord(chord('backspace'))).toBeUndefined();
    expect(searchKeyFromChord(chord('left', { shift: true }))).toBeUndefined();
    expect(searchKeyFromChord(chord('f'))).toBeUndefined();
  });
});

describe('default keys', () => {
  it('match the key press, whatever order their modifiers are written in', () => {
    const map = effectiveShortcuts({}, false);
    const press = (key: string, mods: Partial<KeyChord>) =>
      actionForChord(map, ['send', 'devtools', 'global'], chord(key, mods))?.id;
    expect(press('e', { alt: true, shift: true })).toBe('mode.inspect');
    expect(press('p', { alt: true, shift: true })).toBe('dev.contextAgent');
    expect(press('enter', {})).toBe('send.default');
  });
});

describe('reading key presses on any layout', () => {
  const press = (
    key: string,
    code: string,
    mods: {
      ctrl?: boolean;
      shift?: boolean;
      alt?: boolean;
      meta?: boolean;
      altGraph?: boolean;
    } = {},
  ) =>
    chordKey(
      chordFromEvent({
        key,
        code,
        ctrlKey: !!mods.ctrl,
        shiftKey: !!mods.shift,
        altKey: !!mods.alt,
        metaKey: !!mods.meta,
        getModifierState: (name) => name === 'AltGraph' && !!mods.altGraph,
      }),
    );

  it('uses the letter on the key (AZERTY, QWERTZ)', () => {
    // AZERTY: the Z key sits where US has W. Ctrl+Z is undo, not "close tab".
    expect(press('z', 'KeyW', { ctrl: true })).toBe('ctrl+z');
    // QWERTZ: Z and Y are swapped.
    expect(press('z', 'KeyY', { ctrl: true })).toBe('ctrl+z');
    expect(press('Z', 'KeyY', { ctrl: true, shift: true })).toBe('ctrl+shift+z');
  });

  it('uses the punctuation typed, and "?" is Shift+/ everywhere', () => {
    // German: "-" is on the US Slash key, "+" on BracketRight, "?" is Shift+ß (US Minus).
    expect(press('-', 'Slash', { ctrl: true })).toBe('ctrl+-');
    expect(press('+', 'BracketRight', { ctrl: true })).toBe('ctrl+=');
    expect(press('?', 'Minus', { shift: true })).toBe('shift+/');
    // US, unchanged.
    expect(press('?', 'Slash', { shift: true })).toBe('shift+/');
    expect(press('[', 'BracketLeft')).toBe('[');
  });

  it('falls back to the key position when the character is no help', () => {
    // Russian: Ctrl+ф is the US A key.
    expect(press('ф', 'KeyA', { ctrl: true })).toBe('ctrl+a');
    // macOS Option types characters: Option+L is "¬" (German Mac: "@").
    expect(press('¬', 'KeyL', { alt: true })).toBe('alt+l');
    // AZERTY digits need Shift; unshifted they type "&", "é"...
    expect(press('&', 'Digit1', { ctrl: true })).toBe('ctrl+1');
  });

  it('never takes AltGr typing for a shortcut', () => {
    // Czech "{" is AltGr+B, which Windows reports as Ctrl+Alt+B.
    expect(press('{', 'KeyB', { ctrl: true, alt: true, altGraph: true })).toBe('ctrl+alt');
    expect(
      searchKeyFromChord(
        chordFromEvent({
          key: '{',
          code: 'KeyB',
          ctrlKey: true,
          shiftKey: false,
          altKey: true,
          metaKey: false,
          getModifierState: (name) => name === 'AltGraph',
        }),
      ),
    ).toBeUndefined();
  });
});

describe('searching by a key that is a separator', () => {
  it('finds Ctrl+- and Ctrl++ (zoom out and in)', () => {
    expect(keyMatchesQuery('ctrl+-', 'Ctrl+-')).toBe(true);
    expect(keyMatchesQuery('ctrl+=', 'Ctrl++')).toBe(true);
    // Not every Ctrl shortcut any more.
    expect(keyMatchesQuery('ctrl+t', 'Ctrl+-')).toBe(false);
    expect(keyMatchesQuery('alt+shift+k', 'shift-alt-k')).toBe(true);
  });
});
