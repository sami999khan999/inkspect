import type { Protocol } from 'devtools-protocol';
import type { KeyInput } from '../shared/protocol';

export const Modifier = { Alt: 1, Ctrl: 2, Meta: 4, Shift: 8 } as const;

/** Keys that produce text even though `KeyboardEvent.key` is a name, not the character. */
const KEY_TEXT: Record<string, string> = {
  Enter: '\r',
};

/** Returns the text a key press types, or `undefined` for non-printing keys and shortcuts. */
export function textForKey(key: string, modifiers: number): string | undefined {
  const ctrlOrMeta = (modifiers & (Modifier.Ctrl | Modifier.Meta)) !== 0;
  if (KEY_TEXT[key] !== undefined) return ctrlOrMeta ? undefined : KEY_TEXT[key];
  // `key` is a single character (possibly a surrogate pair) for printable keys.
  if ([...key].length !== 1) return undefined;
  return ctrlOrMeta ? undefined : key;
}

/**
 * Editing commands for shortcuts that macOS handles in the browser UI instead of the renderer.
 * On Windows and Linux Blink handles these keys itself, so no commands are needed.
 */
export function macEditingCommands(input: KeyInput): string[] | undefined {
  if ((input.modifiers & Modifier.Meta) === 0 || (input.modifiers & Modifier.Ctrl) !== 0) {
    return undefined;
  }
  const shift = (input.modifiers & Modifier.Shift) !== 0;
  switch (input.code) {
    case 'KeyA':
      return ['selectAll'];
    case 'KeyC':
      return ['copy'];
    case 'KeyX':
      return ['cut'];
    case 'KeyZ':
      return [shift ? 'redo' : 'undo'];
    case 'ArrowLeft':
      return [shift ? 'moveToBeginningOfLineAndModifySelection' : 'moveToBeginningOfLine'];
    case 'ArrowRight':
      return [shift ? 'moveToEndOfLineAndModifySelection' : 'moveToEndOfLine'];
    case 'ArrowUp':
      return [shift ? 'moveToBeginningOfDocumentAndModifySelection' : 'moveToBeginningOfDocument'];
    case 'ArrowDown':
      return [shift ? 'moveToEndOfDocumentAndModifySelection' : 'moveToEndOfDocument'];
    case 'Backspace':
      return ['deleteToBeginningOfLine'];
    default:
      return undefined;
  }
}

/** Converts a key event from the webview into `Input.dispatchKeyEvent` parameters. */
export function toCdpKeyEvent(
  input: KeyInput,
  platform: NodeJS.Platform,
): Protocol.Input.DispatchKeyEventRequest {
  const text = input.type === 'keyDown' ? textForKey(input.key, input.modifiers) : undefined;
  const commands =
    platform === 'darwin' && input.type === 'keyDown' ? macEditingCommands(input) : undefined;
  return {
    type: input.type === 'keyUp' ? 'keyUp' : text ? 'keyDown' : 'rawKeyDown',
    key: input.key,
    code: input.code,
    windowsVirtualKeyCode: input.keyCode,
    nativeVirtualKeyCode: input.keyCode,
    modifiers: input.modifiers,
    location: input.location,
    isKeypad: input.location === 3,
    autoRepeat: input.repeat,
    ...(text ? { text, unmodifiedText: text } : {}),
    ...(commands ? { commands } : {}),
  };
}

export type ClipboardShortcut = 'copy' | 'cut' | 'paste';

/** Detects copy, cut and paste shortcuts (Ctrl on Windows/Linux, Cmd on macOS). */
export function clipboardShortcut(
  input: KeyInput,
  platform: NodeJS.Platform,
): ClipboardShortcut | undefined {
  if (input.type !== 'keyDown') return undefined;
  const primary = platform === 'darwin' ? Modifier.Meta : Modifier.Ctrl;
  const others = (Modifier.Alt | Modifier.Ctrl | Modifier.Meta | Modifier.Shift) & ~primary;
  if ((input.modifiers & primary) !== 0 && (input.modifiers & others) === 0) {
    if (input.keyCode === 67) return 'copy';
    if (input.keyCode === 88) return 'cut';
    if (input.keyCode === 86) return 'paste';
  }
  if (platform !== 'darwin') {
    if (input.modifiers === Modifier.Ctrl && input.key === 'Insert') return 'copy';
    if (input.modifiers === Modifier.Shift && input.key === 'Insert') return 'paste';
    if (input.modifiers === Modifier.Shift && input.key === 'Delete') return 'cut';
  }
  return undefined;
}
