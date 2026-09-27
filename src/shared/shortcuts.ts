// Browser keyboard shortcuts. They are contributed as VS Code keybindings in package.json (so
// users can see and change them), and the webview uses this list to keep those keys away from
// the page. A unit test checks that both lists match.

/** When clause for browser keybindings: a browser editor tab is active. */
export const BROWSER_FOCUS_WHEN = "activeWebviewPanelId == 'vscodeBrowser.browser'";

export interface Shortcut {
  command: string;
  /** Windows and Linux key, in VS Code keybinding syntax. */
  key: string;
  mac: string;
}

export const BROWSER_SHORTCUTS: readonly Shortcut[] = [
  { command: 'vscodeBrowser.newTab', key: 'ctrl+t', mac: 'cmd+t' },
  { command: 'vscodeBrowser.closeTab', key: 'ctrl+w', mac: 'cmd+w' },
  { command: 'vscodeBrowser.reopenClosedTab', key: 'ctrl+shift+t', mac: 'cmd+shift+t' },
  { command: 'vscodeBrowser.nextTab', key: 'ctrl+tab', mac: 'ctrl+tab' },
  { command: 'vscodeBrowser.nextTab', key: 'ctrl+pagedown', mac: 'cmd+alt+right' },
  { command: 'vscodeBrowser.previousTab', key: 'ctrl+shift+tab', mac: 'ctrl+shift+tab' },
  { command: 'vscodeBrowser.previousTab', key: 'ctrl+pageup', mac: 'cmd+alt+left' },
  { command: 'vscodeBrowser.focusAddressBar', key: 'ctrl+l', mac: 'cmd+l' },
  { command: 'vscodeBrowser.focusAddressBar', key: 'alt+d', mac: 'alt+d' },
  { command: 'vscodeBrowser.reload', key: 'ctrl+r', mac: 'cmd+r' },
  { command: 'vscodeBrowser.hardReload', key: 'ctrl+shift+r', mac: 'cmd+shift+r' },
  { command: 'vscodeBrowser.goBack', key: 'alt+left', mac: 'cmd+[' },
  { command: 'vscodeBrowser.goForward', key: 'alt+right', mac: 'cmd+]' },
  { command: 'vscodeBrowser.goHome', key: 'alt+home', mac: 'cmd+shift+h' },
  { command: 'vscodeBrowser.find', key: 'ctrl+f', mac: 'cmd+f' },
  { command: 'vscodeBrowser.zoomIn', key: 'ctrl+=', mac: 'cmd+=' },
  { command: 'vscodeBrowser.zoomIn', key: 'ctrl+shift+=', mac: 'cmd+shift+=' },
  { command: 'vscodeBrowser.zoomOut', key: 'ctrl+-', mac: 'cmd+-' },
  { command: 'vscodeBrowser.zoomReset', key: 'ctrl+0', mac: 'cmd+0' },
  { command: 'vscodeBrowser.viewSource', key: 'ctrl+u', mac: 'cmd+alt+u' },
  { command: 'vscodeBrowser.bookmarkPage', key: 'ctrl+d', mac: 'cmd+d' },
  { command: 'vscodeBrowser.toggleInspector', key: 'ctrl+shift+c', mac: 'cmd+shift+c' },
  { command: 'vscodeBrowser.openDevTools', key: 'f12', mac: 'f12' },
];

export interface KeyChord {
  ctrl: boolean;
  shift: boolean;
  alt: boolean;
  meta: boolean;
  /** Lower-case key name as used in VS Code keybindings, e.g. `t`, `tab`, `left`, `=`. */
  key: string;
}

/** Parses a VS Code keybinding such as `ctrl+shift+t` or `cmd+[`. */
export function parseChord(binding: string): KeyChord {
  const parts = binding.toLowerCase().split('+');
  // A trailing empty part means the key itself was `+` (e.g. `ctrl++`); not used here.
  const key = parts.pop() ?? '';
  return {
    ctrl: parts.includes('ctrl'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('cmd') || parts.includes('meta') || parts.includes('win'),
    key,
  };
}

/** VS Code key names for `KeyboardEvent.key` values that differ from the lower-cased key. */
const KEY_NAMES: Record<string, string> = {
  arrowleft: 'left',
  arrowright: 'right',
  arrowup: 'up',
  arrowdown: 'down',
  '+': '=',
};

/** Converts the parts of a keyboard event into a chord comparable with `parseChord` output. */
export function chordFromEvent(event: {
  key: string;
  code: string;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  metaKey: boolean;
}): KeyChord {
  let key = event.key.toLowerCase();
  // Letters and digits are matched by physical key so shortcuts work on any layout.
  if (/^Key[A-Z]$/.test(event.code)) key = event.code.slice(3).toLowerCase();
  else if (/^Digit\d$/.test(event.code)) key = event.code.slice(5);
  else if (event.code === 'Equal') key = '=';
  else if (event.code === 'Minus') key = '-';
  key = KEY_NAMES[key] ?? key;
  return {
    ctrl: event.ctrlKey,
    shift: event.shiftKey,
    alt: event.altKey,
    meta: event.metaKey,
    key,
  };
}

export function chordsEqual(a: KeyChord, b: KeyChord): boolean {
  return (
    a.key === b.key &&
    a.ctrl === b.ctrl &&
    a.shift === b.shift &&
    a.alt === b.alt &&
    a.meta === b.meta
  );
}
