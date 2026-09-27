import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  BROWSER_FOCUS_WHEN,
  BROWSER_SHORTCUTS,
  chordFromEvent,
  chordsEqual,
  parseChord,
} from '../../src/shared/shortcuts';

interface Keybinding {
  command: string;
  key: string;
  mac?: string;
  when?: string;
}

const manifest = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as {
  contributes: { keybindings: Keybinding[]; commands: { command: string }[] };
};

const event = (
  key: string,
  code: string,
  modifiers: Partial<Record<'ctrlKey' | 'shiftKey' | 'altKey' | 'metaKey', boolean>> = {},
) => ({
  key,
  code,
  ctrlKey: false,
  shiftKey: false,
  altKey: false,
  metaKey: false,
  ...modifiers,
});

describe('browser shortcuts', () => {
  it('match the keybindings contributed in package.json', () => {
    const contributed = manifest.contributes.keybindings.map(({ command, key, mac }) => ({
      command,
      key,
      mac,
    }));
    expect(contributed).toEqual(
      BROWSER_SHORTCUTS.map(({ command, key, mac }) => ({ command, key, mac })),
    );
  });

  it('only apply while a browser has focus', () => {
    for (const binding of manifest.contributes.keybindings) {
      expect(binding.when).toBe(BROWSER_FOCUS_WHEN);
    }
  });

  it('refer to contributed commands', () => {
    const commands = new Set(manifest.contributes.commands.map((c) => c.command));
    for (const shortcut of BROWSER_SHORTCUTS) expect(commands).toContain(shortcut.command);
  });
});

describe('chords', () => {
  it('parses keybinding strings', () => {
    expect(parseChord('ctrl+shift+t')).toEqual({
      ctrl: true,
      shift: true,
      alt: false,
      meta: false,
      key: 't',
    });
    expect(parseChord('cmd+[')).toEqual({
      ctrl: false,
      shift: false,
      alt: false,
      meta: true,
      key: '[',
    });
  });

  it('matches keyboard events by physical key for letters and digits', () => {
    // A Cyrillic layout reports a different `key` for the T key.
    expect(
      chordsEqual(chordFromEvent(event('е', 'KeyT', { ctrlKey: true })), parseChord('ctrl+t')),
    ).toBe(true);
    expect(
      chordsEqual(chordFromEvent(event('0', 'Digit0', { ctrlKey: true })), parseChord('ctrl+0')),
    ).toBe(true);
  });

  it('matches named and punctuation keys', () => {
    expect(
      chordsEqual(chordFromEvent(event('Tab', 'Tab', { ctrlKey: true })), parseChord('ctrl+tab')),
    ).toBe(true);
    expect(
      chordsEqual(
        chordFromEvent(event('ArrowLeft', 'ArrowLeft', { altKey: true })),
        parseChord('alt+left'),
      ),
    ).toBe(true);
    expect(
      chordsEqual(
        chordFromEvent(event('+', 'Equal', { ctrlKey: true, shiftKey: true })),
        parseChord('ctrl+shift+='),
      ),
    ).toBe(true);
    expect(
      chordsEqual(
        chordFromEvent(event('[', 'BracketLeft', { metaKey: true })),
        parseChord('cmd+['),
      ),
    ).toBe(true);
  });

  it('requires the exact modifiers', () => {
    expect(
      chordsEqual(
        chordFromEvent(event('t', 'KeyT', { ctrlKey: true, shiftKey: true })),
        parseChord('ctrl+t'),
      ),
    ).toBe(false);
    expect(chordsEqual(chordFromEvent(event('t', 'KeyT')), parseChord('ctrl+t'))).toBe(false);
  });
});
