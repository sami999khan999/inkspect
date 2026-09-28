import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  actionForChord,
  chordFromEvent,
  chordsEqual,
  effectiveShortcuts,
  findConflicts,
  formatKey,
  keyParts,
  normalizeKey,
  parseChord,
  sanitizeOverrides,
  SHORTCUT_ACTIONS,
} from '../../src/shared/shortcuts';

const manifest = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
) as {
  contributes: { keybindings?: unknown[]; commands: { command: string }[] };
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

describe('shortcut registry', () => {
  it('has unique action ids', () => {
    const ids = SHORTCUT_ACTIONS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('runs only contributed commands', () => {
    const commands = new Set(manifest.contributes.commands.map((c) => c.command));
    for (const action of SHORTCUT_ACTIONS) {
      if (action.command) expect(commands, action.id).toContain(action.command);
    }
  });

  it('is the only source of browser keys (no static keybindings to fire twice)', () => {
    expect(manifest.contributes.keybindings ?? []).toEqual([]);
  });

  it('has no conflicting defaults on Windows, Linux or macOS', () => {
    expect(findConflicts(effectiveShortcuts({}, false))).toEqual([]);
    expect(findConflicts(effectiveShortcuts({}, true))).toEqual([]);
  });

  it('uses Cmd for Ctrl on macOS unless a Mac key is given', () => {
    const mac = effectiveShortcuts({}, true);
    expect(mac['tab.new']).toEqual(['cmd+t']);
    expect(mac['nav.back']).toEqual(['cmd+[']);
    expect(effectiveShortcuts({}, false)['nav.back']).toEqual(['alt+left']);
  });
});

describe('overrides', () => {
  it('replace, add and unbind keys, normalized', () => {
    const map = effectiveShortcuts(
      { 'tab.new': 'Shift+Ctrl+Y', 'tab.close': [], 'mode.draw': ['alt+d', 'ctrl+shift+d'] },
      false,
    );
    expect(map['tab.new']).toEqual(['ctrl+shift+y']);
    expect(map['tab.close']).toEqual([]);
    expect(map['mode.draw']).toEqual(['alt+d', 'ctrl+shift+d']);
    expect(map['tab.reopen']).toEqual(['ctrl+shift+t']);
  });

  it('ignores unknown ids and invalid values from settings or imports', () => {
    expect(
      sanitizeOverrides({
        'tab.new': 'ctrl+y',
        nope: 'ctrl+x',
        'tab.close': 5,
        'nav.back': ['x', 1],
      }),
    ).toEqual({ 'tab.new': 'ctrl+y' });
    expect(sanitizeOverrides(['ctrl+y'])).toEqual({});
    expect(sanitizeOverrides(null)).toEqual({});
  });

  it('report keys that clash within a scope or between modes that are on together', () => {
    const map = effectiveShortcuts({ 'tab.close': 'ctrl+t', 'record.stop': 'alt+r' }, false);
    const keys = findConflicts(map).map((c) => [c.key, [...c.ids].sort()]);
    expect(keys).toContainEqual(['ctrl+t', ['tab.close', 'tab.new']]);
    expect(keys).toContainEqual(['alt+r', ['device.rotate', 'record.stop']]);
    // A mode that takes over the page may reuse a browser key on purpose.
    expect(keys.some(([key]) => key === 'escape')).toBe(false);
  });
});

describe('dispatch', () => {
  const map = effectiveShortcuts({}, false);

  it('prefers the active mode, then the browser-wide keys', () => {
    const d = chordFromEvent(event('d', 'KeyD'));
    expect(actionForChord(map, ['draw', 'global'], d)?.id).toBe('draw.doubleArrow');
    expect(actionForChord(map, ['global'], d)).toBeUndefined();
    const tab = chordFromEvent(event('t', 'KeyT', { ctrlKey: true }));
    expect(actionForChord(map, ['draw', 'global'], tab)?.id).toBe('tab.new');
  });

  it('matches Shift+/ as the help key', () => {
    const help = chordFromEvent(event('?', 'Slash', { shiftKey: true }));
    expect(actionForChord(map, ['inspect', 'global'], help)?.id).toBe('inspect.help');
  });
});

describe('chords', () => {
  it('parses and normalizes keybinding strings', () => {
    expect(parseChord('ctrl+shift+t')).toEqual({
      ctrl: true,
      shift: true,
      alt: false,
      meta: false,
      key: 't',
    });
    expect(normalizeKey('Shift+Cmd+[')).toBe('shift+cmd+[');
    expect(normalizeKey('')).toBe('');
  });

  it('matches keyboard events by physical key for letters, digits and punctuation', () => {
    // A Cyrillic layout reports a different `key` for the T key.
    expect(
      chordsEqual(chordFromEvent(event('е', 'KeyT', { ctrlKey: true })), parseChord('ctrl+t')),
    ).toBe(true);
    expect(
      chordsEqual(chordFromEvent(event('0', 'Digit0', { ctrlKey: true })), parseChord('ctrl+0')),
    ).toBe(true);
    expect(
      chordsEqual(
        chordFromEvent(event('{', 'BracketLeft', { shiftKey: true })),
        parseChord('shift+['),
      ),
    ).toBe(true);
  });

  it('matches named keys', () => {
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

  it('splits keys into caps', () => {
    expect(keyParts('ctrl+shift+c', false)).toEqual(['Ctrl', 'Shift', 'C']);
    expect(keyParts('cmd+shift+c', true)).toEqual(['⇧', '⌘', 'C']);
    expect(keyParts('ctrl+=', false)).toEqual(['Ctrl', '=']);
    expect(keyParts('shift+/', false)).toEqual(['?']);
    expect(keyParts('escape', false)).toEqual(['Esc']);
  });

  it('formats keys for people', () => {
    expect(formatKey('ctrl+shift+t', false)).toBe('Ctrl+Shift+T');
    expect(formatKey('cmd+shift+t', true)).toBe('⇧⌘T');
    expect(formatKey('escape', false)).toBe('Esc');
    expect(formatKey('shift+/', false)).toBe('?');
    expect(formatKey('alt+left', false)).toBe('Alt+←');
  });
});
