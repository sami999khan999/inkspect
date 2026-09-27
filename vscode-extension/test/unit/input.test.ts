import { describe, expect, it } from 'vitest';
import {
  clipboardShortcut,
  macEditingCommands,
  Modifier,
  textForKey,
  toCdpKeyEvent,
} from '../../src/browser/input';
import type { KeyInput } from '../../src/shared/protocol';

const key = (overrides: Partial<KeyInput>): KeyInput => ({
  kind: 'key',
  type: 'keyDown',
  key: 'a',
  code: 'KeyA',
  keyCode: 65,
  location: 0,
  modifiers: 0,
  repeat: false,
  ...overrides,
});

describe('textForKey', () => {
  it('types printable characters, including with Shift and Alt', () => {
    expect(textForKey('a', 0)).toBe('a');
    expect(textForKey('A', Modifier.Shift)).toBe('A');
    expect(textForKey('é', Modifier.Alt)).toBe('é');
    expect(textForKey(' ', 0)).toBe(' ');
    expect(textForKey('😀', 0)).toBe('😀');
  });

  it('types a carriage return for Enter', () => {
    expect(textForKey('Enter', 0)).toBe('\r');
    expect(textForKey('Enter', Modifier.Shift)).toBe('\r');
  });

  it('does not type for named keys or Ctrl/Meta shortcuts', () => {
    expect(textForKey('Backspace', 0)).toBeUndefined();
    expect(textForKey('ArrowLeft', 0)).toBeUndefined();
    expect(textForKey('a', Modifier.Ctrl)).toBeUndefined();
    expect(textForKey('a', Modifier.Meta)).toBeUndefined();
    expect(textForKey('Enter', Modifier.Ctrl)).toBeUndefined();
  });
});

describe('toCdpKeyEvent', () => {
  it('uses keyDown with text for printable keys', () => {
    expect(toCdpKeyEvent(key({}), 'win32')).toMatchObject({
      type: 'keyDown',
      text: 'a',
      windowsVirtualKeyCode: 65,
    });
  });

  it('uses rawKeyDown for keys that do not type', () => {
    const event = toCdpKeyEvent(key({ key: 'Backspace', code: 'Backspace', keyCode: 8 }), 'win32');
    expect(event.type).toBe('rawKeyDown');
    expect(event.text).toBeUndefined();
  });

  it('never types on keyUp', () => {
    expect(toCdpKeyEvent(key({ type: 'keyUp' }), 'win32')).toMatchObject({ type: 'keyUp' });
    expect(toCdpKeyEvent(key({ type: 'keyUp' }), 'win32').text).toBeUndefined();
  });

  it('marks keypad keys', () => {
    expect(
      toCdpKeyEvent(key({ key: '1', code: 'Numpad1', keyCode: 97, location: 3 }), 'linux').isKeypad,
    ).toBe(true);
  });

  it('adds editing commands only on macOS', () => {
    const selectAll = key({ modifiers: Modifier.Meta });
    expect(toCdpKeyEvent(selectAll, 'darwin').commands).toEqual(['selectAll']);
    expect(toCdpKeyEvent(key({ modifiers: Modifier.Ctrl }), 'win32').commands).toBeUndefined();
  });
});

describe('macEditingCommands', () => {
  it('maps Cmd shortcuts to editing commands', () => {
    expect(macEditingCommands(key({ code: 'KeyZ', modifiers: Modifier.Meta }))).toEqual(['undo']);
    expect(
      macEditingCommands(key({ code: 'KeyZ', modifiers: Modifier.Meta | Modifier.Shift })),
    ).toEqual(['redo']);
    expect(macEditingCommands(key({ code: 'ArrowLeft', modifiers: Modifier.Meta }))).toEqual([
      'moveToBeginningOfLine',
    ]);
  });

  it('ignores keys without Cmd, or with Ctrl', () => {
    expect(macEditingCommands(key({ code: 'KeyA' }))).toBeUndefined();
    expect(
      macEditingCommands(key({ code: 'KeyA', modifiers: Modifier.Meta | Modifier.Ctrl })),
    ).toBeUndefined();
  });
});

describe('clipboardShortcut', () => {
  it('detects Ctrl+C/X/V on Windows and Linux', () => {
    expect(clipboardShortcut(key({ keyCode: 67, modifiers: Modifier.Ctrl }), 'win32')).toBe('copy');
    expect(clipboardShortcut(key({ keyCode: 88, modifiers: Modifier.Ctrl }), 'linux')).toBe('cut');
    expect(clipboardShortcut(key({ keyCode: 86, modifiers: Modifier.Ctrl }), 'win32')).toBe(
      'paste',
    );
  });

  it('detects Cmd+C/X/V on macOS, not Ctrl', () => {
    expect(clipboardShortcut(key({ keyCode: 67, modifiers: Modifier.Meta }), 'darwin')).toBe(
      'copy',
    );
    expect(
      clipboardShortcut(key({ keyCode: 67, modifiers: Modifier.Ctrl }), 'darwin'),
    ).toBeUndefined();
  });

  it('detects the Insert/Delete variants on Windows and Linux', () => {
    expect(clipboardShortcut(key({ key: 'Insert', modifiers: Modifier.Ctrl }), 'win32')).toBe(
      'copy',
    );
    expect(clipboardShortcut(key({ key: 'Insert', modifiers: Modifier.Shift }), 'win32')).toBe(
      'paste',
    );
    expect(clipboardShortcut(key({ key: 'Delete', modifiers: Modifier.Shift }), 'linux')).toBe(
      'cut',
    );
  });

  it('ignores other modifiers, plain keys and keyUp', () => {
    expect(
      clipboardShortcut(key({ keyCode: 67, modifiers: Modifier.Ctrl | Modifier.Shift }), 'win32'),
    ).toBeUndefined();
    expect(clipboardShortcut(key({ keyCode: 67 }), 'win32')).toBeUndefined();
    expect(
      clipboardShortcut(key({ type: 'keyUp', keyCode: 67, modifiers: Modifier.Ctrl }), 'win32'),
    ).toBeUndefined();
  });
});
