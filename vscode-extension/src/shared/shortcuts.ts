// Every keyboard shortcut of the browser, in one registry. The browser webview dispatches them
// (so users can remap any of them from the Shortcuts view in the sidebar; the map is the
// `vscodeBrowser.shortcuts` setting). Keys are in VS Code keybinding syntax (`ctrl+shift+t`).

/**
 * Where a shortcut applies. `global` works everywhere in the browser; each mode's scope works
 * while that mode is on, and wins over `global`.
 */
export type ShortcutScope =
  | 'global'
  | 'inspect'
  | 'draw'
  | 'screenshot'
  | 'devtools'
  | 'device'
  | 'measure'
  | 'eyedropper'
  | 'overlay'
  | 'tweak'
  | 'record'
  | 'a11y';

export interface ShortcutAction {
  id: string;
  label: string;
  scope: ShortcutScope;
  /** Default keys on Windows and Linux. */
  keys: readonly string[];
  /** Default keys on macOS (defaults to `keys` with Ctrl as Cmd). */
  mac?: readonly string[];
  /** A VS Code command the host runs; without it, the webview handles the action itself. */
  command?: string;
}

export const SCOPE_LABELS: Record<ShortcutScope, string> = {
  global: 'Browser',
  inspect: 'Element picker',
  draw: 'Drawing',
  screenshot: 'Screenshot',
  devtools: 'Console and network',
  device: 'Device',
  measure: 'Measure',
  eyedropper: 'Eyedropper',
  overlay: 'Design overlay',
  tweak: 'CSS tweak',
  record: 'Record',
  a11y: 'Accessibility check',
};

const cmd = (name: string) => `vscodeBrowser.${name}`;

/** Every action with its default keys. Unbound actions still appear and can be given keys. */
export const SHORTCUT_ACTIONS: readonly ShortcutAction[] = [
  // Tabs and windows.
  { id: 'tab.new', label: 'New tab', scope: 'global', keys: ['ctrl+t'], command: cmd('newTab') },
  {
    id: 'tab.close',
    label: 'Close tab',
    scope: 'global',
    keys: ['ctrl+w', 'ctrl+f4'],
    command: cmd('closeTab'),
  },
  {
    id: 'tab.reopen',
    label: 'Reopen closed tab',
    scope: 'global',
    keys: ['ctrl+shift+t'],
    command: cmd('reopenClosedTab'),
  },
  {
    id: 'tab.next',
    label: 'Next tab',
    scope: 'global',
    keys: ['ctrl+tab', 'ctrl+pagedown'],
    mac: ['ctrl+tab', 'cmd+alt+right'],
    command: cmd('nextTab'),
  },
  {
    id: 'tab.previous',
    label: 'Previous tab',
    scope: 'global',
    keys: ['ctrl+shift+tab', 'ctrl+pageup'],
    mac: ['ctrl+shift+tab', 'cmd+alt+left'],
    command: cmd('previousTab'),
  },
  {
    id: 'tab.duplicate',
    label: 'Duplicate tab',
    scope: 'global',
    keys: [],
    command: cmd('duplicateTab'),
  },
  {
    id: 'tab.private',
    label: 'New private tab',
    scope: 'global',
    keys: ['ctrl+shift+n'],
    command: cmd('newPrivateTab'),
  },
  {
    id: 'window.new',
    label: 'New window',
    scope: 'global',
    keys: ['ctrl+n'],
    command: cmd('newWindow'),
  },
  // Navigation.
  {
    id: 'nav.address',
    label: 'Focus the address bar',
    scope: 'global',
    keys: ['ctrl+l', 'alt+d'],
    mac: ['cmd+l', 'alt+d'],
    command: cmd('focusAddressBar'),
  },
  {
    id: 'nav.back',
    label: 'Back',
    scope: 'global',
    keys: ['alt+left'],
    mac: ['cmd+['],
    command: cmd('goBack'),
  },
  {
    id: 'nav.forward',
    label: 'Forward',
    scope: 'global',
    keys: ['alt+right'],
    mac: ['cmd+]'],
    command: cmd('goForward'),
  },
  {
    id: 'nav.reload',
    label: 'Reload',
    scope: 'global',
    keys: ['ctrl+r', 'f5'],
    mac: ['cmd+r'],
    command: cmd('reload'),
  },
  {
    id: 'nav.hardReload',
    label: 'Hard reload',
    scope: 'global',
    keys: ['ctrl+shift+r', 'ctrl+f5'],
    mac: ['cmd+shift+r'],
    command: cmd('hardReload'),
  },
  { id: 'nav.stop', label: 'Stop loading', scope: 'global', keys: [], command: cmd('stop') },
  {
    id: 'nav.home',
    label: 'Home page',
    scope: 'global',
    keys: ['alt+home'],
    mac: ['cmd+shift+h'],
    command: cmd('goHome'),
  },
  // Page.
  {
    id: 'page.find',
    label: 'Find in page',
    scope: 'global',
    keys: ['ctrl+f'],
    command: cmd('find'),
  },
  {
    id: 'page.zoomIn',
    label: 'Zoom in',
    scope: 'global',
    keys: ['ctrl+=', 'ctrl+shift+='],
    command: cmd('zoomIn'),
  },
  {
    id: 'page.zoomOut',
    label: 'Zoom out',
    scope: 'global',
    keys: ['ctrl+-'],
    command: cmd('zoomOut'),
  },
  {
    id: 'page.zoomReset',
    label: 'Reset zoom',
    scope: 'global',
    keys: ['ctrl+0'],
    command: cmd('zoomReset'),
  },
  {
    id: 'page.bookmark',
    label: 'Bookmark this page',
    scope: 'global',
    keys: ['ctrl+d'],
    command: cmd('bookmarkPage'),
  },
  {
    id: 'page.source',
    label: 'View page source',
    scope: 'global',
    keys: ['ctrl+u'],
    mac: ['cmd+alt+u'],
    command: cmd('viewSource'),
  },
  {
    id: 'page.pdf',
    label: 'Save page as PDF',
    scope: 'global',
    keys: ['ctrl+p'],
    command: cmd('savePdf'),
  },
  {
    id: 'page.copyUrl',
    label: 'Copy page address',
    scope: 'global',
    keys: ['ctrl+shift+l'],
    command: cmd('copyUrl'),
  },
  {
    id: 'page.external',
    label: 'Open in system browser',
    scope: 'global',
    keys: [],
    command: cmd('openInSystemBrowser'),
  },
  {
    id: 'page.devtools',
    label: 'Open DevTools',
    scope: 'global',
    keys: ['f12'],
    command: cmd('openDevTools'),
  },
  {
    id: 'page.contextToAgent',
    label: 'Send page context to agent',
    scope: 'global',
    keys: ['ctrl+alt+enter'],
    command: cmd('sendPageContextToChat'),
  },
  // Internal pages and panels.
  {
    id: 'open.history',
    label: 'History',
    scope: 'global',
    keys: ['ctrl+h'],
    mac: ['cmd+y'],
    command: cmd('showHistory'),
  },
  {
    id: 'open.downloads',
    label: 'Downloads',
    scope: 'global',
    keys: ['ctrl+j'],
    mac: ['cmd+shift+j'],
    command: cmd('showDownloads'),
  },
  {
    id: 'open.bookmarks',
    label: 'Bookmark manager',
    scope: 'global',
    keys: ['ctrl+alt+b'],
    command: cmd('showBookmarks'),
  },
  {
    id: 'open.bookmarksBar',
    label: 'Show or hide the bookmarks bar',
    scope: 'global',
    keys: ['ctrl+shift+b'],
  },
  { id: 'open.quickActions', label: 'Quick actions', scope: 'global', keys: ['ctrl+k'] },
  {
    id: 'open.shortcuts',
    label: 'Change keyboard shortcuts',
    scope: 'global',
    keys: ['ctrl+alt+k'],
    command: cmd('editShortcuts'),
  },
  {
    id: 'open.cheatSheet',
    label: 'Keyboard shortcuts of this mode',
    scope: 'global',
    keys: ['ctrl+/'],
  },
  // Modes.
  { id: 'mode.inspect', label: 'Element picker', scope: 'global', keys: ['ctrl+shift+c'] },
  { id: 'mode.draw', label: 'Draw on the page', scope: 'global', keys: ['ctrl+shift+d'] },
  { id: 'mode.screenshot', label: 'Screenshot', scope: 'global', keys: ['ctrl+shift+s'] },
  {
    id: 'mode.devtools',
    label: 'Console and network',
    scope: 'global',
    keys: ['ctrl+shift+j'],
    mac: ['cmd+alt+j'],
  },
  { id: 'mode.device', label: 'Device toolbar', scope: 'global', keys: ['ctrl+shift+m'] },
  { id: 'mode.measure', label: 'Measure', scope: 'global', keys: ['ctrl+shift+u'] },
  { id: 'mode.eyedropper', label: 'Eyedropper', scope: 'global', keys: ['ctrl+shift+i'] },
  { id: 'mode.overlay', label: 'Design overlay', scope: 'global', keys: ['ctrl+shift+o'] },
  { id: 'mode.tweak', label: 'CSS tweak', scope: 'global', keys: ['ctrl+shift+e'] },
  { id: 'mode.record', label: 'Record the page', scope: 'global', keys: ['ctrl+alt+r'] },
  { id: 'mode.a11y', label: 'Accessibility check', scope: 'global', keys: ['ctrl+shift+a'] },

  // Element picker.
  { id: 'inspect.parent', label: 'Select the parent element', scope: 'inspect', keys: ['up'] },
  {
    id: 'inspect.child',
    label: 'Select the first child element',
    scope: 'inspect',
    keys: ['down'],
  },
  {
    id: 'inspect.copy',
    label: 'Copy the selected elements',
    scope: 'inspect',
    keys: ['enter', 'c'],
  },
  { id: 'inspect.screenshot', label: 'Screenshot the element', scope: 'inspect', keys: ['s'] },
  { id: 'inspect.agent', label: 'Send the element to the agent', scope: 'inspect', keys: ['a'] },
  { id: 'inspect.help', label: 'Show these shortcuts', scope: 'inspect', keys: ['shift+/'] },
  { id: 'inspect.exit', label: 'Exit', scope: 'inspect', keys: ['escape'] },

  // Drawing.
  { id: 'draw.select', label: 'Select and move', scope: 'draw', keys: ['v'] },
  { id: 'draw.pen', label: 'Pen', scope: 'draw', keys: ['p'] },
  { id: 'draw.pencil', label: 'Pencil', scope: 'draw', keys: ['i'] },
  { id: 'draw.marker', label: 'Marker', scope: 'draw', keys: ['m'] },
  { id: 'draw.brush', label: 'Brush', scope: 'draw', keys: ['u'] },
  { id: 'draw.highlighter', label: 'Highlighter', scope: 'draw', keys: ['h'] },
  { id: 'draw.neon', label: 'Neon', scope: 'draw', keys: ['g'] },
  { id: 'draw.line', label: 'Line', scope: 'draw', keys: ['l'] },
  { id: 'draw.arrow', label: 'Arrow', scope: 'draw', keys: ['a'] },
  { id: 'draw.doubleArrow', label: 'Double arrow', scope: 'draw', keys: ['d'] },
  { id: 'draw.rect', label: 'Rectangle', scope: 'draw', keys: ['r'] },
  { id: 'draw.ellipse', label: 'Ellipse', scope: 'draw', keys: ['o'] },
  { id: 'draw.text', label: 'Text', scope: 'draw', keys: ['t'] },
  { id: 'draw.callout', label: 'Numbered callout', scope: 'draw', keys: ['n'] },
  { id: 'draw.blur', label: 'Redact (pixelate)', scope: 'draw', keys: ['b'] },
  { id: 'draw.eraser', label: 'Eraser', scope: 'draw', keys: ['e'] },
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n): ShortcutAction => ({
    id: `draw.color${n}`,
    label: `Color ${n}`,
    scope: 'draw',
    keys: [String(n)],
  })),
  { id: 'draw.thinner', label: 'Thinner stroke', scope: 'draw', keys: ['['] },
  { id: 'draw.thicker', label: 'Thicker stroke', scope: 'draw', keys: [']'] },
  { id: 'draw.fill', label: 'Fill shapes on or off', scope: 'draw', keys: ['f'] },
  { id: 'draw.undo', label: 'Undo', scope: 'draw', keys: ['ctrl+z'] },
  { id: 'draw.redo', label: 'Redo', scope: 'draw', keys: ['ctrl+y', 'ctrl+shift+z'] },
  { id: 'draw.clear', label: 'Clear all drawings', scope: 'draw', keys: ['shift+backspace'] },
  { id: 'draw.visible', label: 'Hide or show drawings', scope: 'draw', keys: ['w'] },
  { id: 'draw.capture', label: 'Screenshot the drawing area', scope: 'draw', keys: ['enter'] },
  {
    id: 'draw.captureAgent',
    label: 'Screenshot the drawing area and send it to the agent',
    scope: 'draw',
    keys: ['shift+enter'],
  },
  { id: 'draw.help', label: 'Show these shortcuts', scope: 'draw', keys: ['shift+/'] },
  { id: 'draw.exit', label: 'Stop drawing', scope: 'draw', keys: ['escape'] },

  // Screenshot (the menu the mode key opens).
  { id: 'shot.viewport', label: 'Visible area', scope: 'screenshot', keys: ['v'] },
  { id: 'shot.fullPage', label: 'Full page', scope: 'screenshot', keys: ['f'] },
  { id: 'shot.region', label: 'Region', scope: 'screenshot', keys: ['r'] },
  { id: 'shot.element', label: 'Element', scope: 'screenshot', keys: ['e'] },
  { id: 'shot.drawing', label: 'Drawing area', scope: 'screenshot', keys: ['d'] },
  {
    id: 'shot.lastToAgent',
    label: 'Send the last screenshot to the agent',
    scope: 'screenshot',
    keys: ['a'],
    command: cmd('screenshot.sendToTerminal'),
  },

  // Console and network (while the drawer is open).
  { id: 'dev.console', label: 'Console', scope: 'devtools', keys: ['alt+1'] },
  { id: 'dev.network', label: 'Network', scope: 'devtools', keys: ['alt+2'] },
  { id: 'dev.filter', label: 'Filter', scope: 'devtools', keys: ['alt+f'] },
  { id: 'dev.copyErrors', label: 'Copy console errors', scope: 'devtools', keys: ['alt+e'] },
  { id: 'dev.copyFailed', label: 'Copy failed requests', scope: 'devtools', keys: ['alt+q'] },
  { id: 'dev.copyContext', label: 'Copy page context', scope: 'devtools', keys: ['alt+p'] },
  {
    id: 'dev.contextAgent',
    label: 'Send page context to the agent',
    scope: 'devtools',
    keys: ['alt+shift+p'],
  },
  { id: 'dev.clear', label: 'Clear', scope: 'devtools', keys: ['alt+k'] },
  { id: 'dev.close', label: 'Close', scope: 'devtools', keys: ['alt+escape'] },

  // Device (while the device toolbar is on).
  { id: 'device.previous', label: 'Previous device', scope: 'device', keys: ['alt+['] },
  { id: 'device.next', label: 'Next device', scope: 'device', keys: ['alt+]'] },
  { id: 'device.rotate', label: 'Rotate', scope: 'device', keys: ['alt+r'] },
  { id: 'device.touch', label: 'Touch and mobile on or off', scope: 'device', keys: ['alt+t'] },
  { id: 'device.fit', label: 'Fit to window', scope: 'device', keys: ['alt+0'] },
  { id: 'device.zoomIn', label: 'Zoom in', scope: 'device', keys: ['alt+='] },
  { id: 'device.zoomOut', label: 'Zoom out', scope: 'device', keys: ['alt+-'] },
  { id: 'device.network', label: 'Next network speed', scope: 'device', keys: ['alt+n'] },
  { id: 'device.theme', label: 'Next color scheme', scope: 'device', keys: ['alt+l'] },
  { id: 'device.close', label: 'Close the device toolbar', scope: 'device', keys: [] },

  // Measure.
  { id: 'measure.grid', label: 'Rulers and grid on or off', scope: 'measure', keys: ['g'] },
  { id: 'measure.copy', label: 'Copy the measurements', scope: 'measure', keys: ['c'] },
  { id: 'measure.clear', label: 'Clear the pinned element', scope: 'measure', keys: ['backspace'] },
  { id: 'measure.help', label: 'Show these shortcuts', scope: 'measure', keys: ['shift+/'] },
  { id: 'measure.exit', label: 'Exit', scope: 'measure', keys: ['escape'] },

  // Eyedropper.
  { id: 'eyedropper.hex', label: 'Copy colors as hex', scope: 'eyedropper', keys: ['h'] },
  { id: 'eyedropper.rgb', label: 'Copy colors as rgb()', scope: 'eyedropper', keys: ['r'] },
  { id: 'eyedropper.hsl', label: 'Copy colors as hsl()', scope: 'eyedropper', keys: ['l'] },
  { id: 'eyedropper.help', label: 'Show these shortcuts', scope: 'eyedropper', keys: ['shift+/'] },
  { id: 'eyedropper.exit', label: 'Exit', scope: 'eyedropper', keys: ['escape'] },

  // Design overlay (the page stays usable, so these use Alt).
  { id: 'overlay.open', label: 'Open an image', scope: 'overlay', keys: ['alt+o'] },
  { id: 'overlay.fainter', label: 'Less opaque', scope: 'overlay', keys: ['alt+,'] },
  { id: 'overlay.stronger', label: 'More opaque', scope: 'overlay', keys: ['alt+.'] },
  { id: 'overlay.left', label: 'Nudge left', scope: 'overlay', keys: ['alt+left'] },
  { id: 'overlay.right', label: 'Nudge right', scope: 'overlay', keys: ['alt+right'] },
  { id: 'overlay.up', label: 'Nudge up', scope: 'overlay', keys: ['alt+up'] },
  { id: 'overlay.down', label: 'Nudge down', scope: 'overlay', keys: ['alt+down'] },
  {
    id: 'overlay.difference',
    label: 'Difference blend on or off',
    scope: 'overlay',
    keys: ['alt+x'],
  },
  { id: 'overlay.hide', label: 'Hide or show the overlay', scope: 'overlay', keys: ['alt+h'] },
  { id: 'overlay.exit', label: 'Close the overlay', scope: 'overlay', keys: ['alt+shift+escape'] },

  // CSS tweak.
  {
    id: 'tweak.agent',
    label: 'Send the CSS changes to the agent',
    scope: 'tweak',
    keys: ['ctrl+enter'],
  },
  { id: 'tweak.copy', label: 'Copy the CSS changes', scope: 'tweak', keys: ['ctrl+shift+c'] },
  { id: 'tweak.undo', label: 'Undo the last change', scope: 'tweak', keys: ['ctrl+z'] },
  { id: 'tweak.exit', label: 'Exit and revert', scope: 'tweak', keys: ['escape'] },

  // Record (the page stays usable).
  { id: 'record.stop', label: 'Stop and save', scope: 'record', keys: ['alt+s'] },
  { id: 'record.pause', label: 'Pause or resume', scope: 'record', keys: ['alt+space'] },
  { id: 'record.cancel', label: 'Cancel', scope: 'record', keys: ['alt+backspace'] },

  // Accessibility check.
  { id: 'a11y.next', label: 'Next issue', scope: 'a11y', keys: ['n', 'down'] },
  { id: 'a11y.previous', label: 'Previous issue', scope: 'a11y', keys: ['p', 'up'] },
  { id: 'a11y.tabOrder', label: 'Tab order on or off', scope: 'a11y', keys: ['t'] },
  { id: 'a11y.copy', label: 'Copy the report', scope: 'a11y', keys: ['c'] },
  { id: 'a11y.agent', label: 'Send the report to the agent', scope: 'a11y', keys: ['a'] },
  { id: 'a11y.help', label: 'Show these shortcuts', scope: 'a11y', keys: ['shift+/'] },
  { id: 'a11y.exit', label: 'Exit', scope: 'a11y', keys: ['escape'] },
];

/** User changes: an action id to its keys (`[]` or `""` unbinds it). */
export type ShortcutOverrides = Record<string, string | readonly string[]>;

/** The keys in effect: action id to keys. */
export type ShortcutMap = Record<string, string[]>;

/** Default keys for a platform. */
export function defaultKeys(action: ShortcutAction, mac: boolean): string[] {
  if (!mac) return [...action.keys];
  return [...(action.mac ?? action.keys.map((key) => key.replace(/\bctrl\+/, 'cmd+')))];
}

/** Keys normalized for comparing: lower case, modifiers in a fixed order. */
export function normalizeKey(binding: string): string {
  const chord = parseChord(binding.trim());
  if (!chord.key) return '';
  return [
    chord.ctrl && 'ctrl',
    chord.shift && 'shift',
    chord.alt && 'alt',
    chord.meta && 'cmd',
    chord.key,
  ]
    .filter(Boolean)
    .join('+');
}

/** Defaults plus the user's overrides. Unknown ids and invalid keys are ignored. */
export function effectiveShortcuts(overrides: ShortcutOverrides, mac: boolean): ShortcutMap {
  const map: ShortcutMap = {};
  for (const action of SHORTCUT_ACTIONS) {
    const override = overrides[action.id];
    const keys =
      override === undefined
        ? defaultKeys(action, mac)
        : (typeof override === 'string' ? [override] : [...override]).map(normalizeKey);
    map[action.id] = [...new Set(keys.filter(Boolean))];
  }
  return map;
}

/** Validates the setting's value (from settings.json, sync or an imported file). */
export function sanitizeOverrides(value: unknown): ShortcutOverrides {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const known = new Set(SHORTCUT_ACTIONS.map((a) => a.id));
  const result: ShortcutOverrides = {};
  for (const [id, keys] of Object.entries(value as Record<string, unknown>)) {
    if (!known.has(id)) continue;
    if (typeof keys === 'string') result[id] = keys;
    else if (Array.isArray(keys) && keys.every((k) => typeof k === 'string')) result[id] = keys;
  }
  return result;
}

/**
 * Modes that leave the page usable, so several can be on at once (their keys use Alt and must not
 * clash with each other). Other modes take over the page; their keys win over browser-wide keys
 * while they are on, which is intended.
 */
const CONCURRENT: ReadonlySet<ShortcutScope> = new Set(['devtools', 'device', 'overlay', 'record']);

export interface ShortcutConflict {
  key: string;
  ids: [string, string];
}

/** Keys bound to two actions that can be active at the same time. */
export function findConflicts(map: ShortcutMap): ShortcutConflict[] {
  const scopes = new Map(SHORTCUT_ACTIONS.map((a) => [a.id, a.scope]));
  const byKey = new Map<string, string[]>();
  for (const [id, keys] of Object.entries(map)) {
    for (const key of keys) byKey.set(key, [...(byKey.get(key) ?? []), id]);
  }
  const conflicts: ShortcutConflict[] = [];
  for (const [key, ids] of byKey) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const [sa, sb] = [scopes.get(ids[i]!)!, scopes.get(ids[j]!)!];
        if (sa === sb || (CONCURRENT.has(sa) && CONCURRENT.has(sb))) {
          conflicts.push({ key, ids: [ids[i]!, ids[j]!] });
        }
      }
    }
  }
  return conflicts;
}

/**
 * The action for a key press. `scopes` lists the active scopes, most specific first; the first
 * scope with a match wins.
 */
export function actionForChord(
  map: ShortcutMap,
  scopes: readonly ShortcutScope[],
  chord: KeyChord,
): ShortcutAction | undefined {
  const pressed = chordKey(chord);
  for (const scope of scopes) {
    const action = SHORTCUT_ACTIONS.find(
      (a) => a.scope === scope && (map[a.id] ?? []).includes(pressed),
    );
    if (action) return action;
  }
  return undefined;
}

/** A chord in normalized binding syntax (see normalizeKey). */
export function chordKey(chord: KeyChord): string {
  return [
    chord.ctrl && 'ctrl',
    chord.shift && 'shift',
    chord.alt && 'alt',
    chord.meta && 'cmd',
    chord.key,
  ]
    .filter(Boolean)
    .join('+');
}

/** A key as separate caps for display: `['Ctrl', 'Shift', 'T']`, `['⇧', '⌘', 'T']`. */
export function keyParts(binding: string, mac: boolean): string[] {
  const text = formatKey(binding, mac);
  if (mac) {
    const modifiers = [...text.matchAll(/[⌃⌥⇧⌘]/g)].map((m) => m[0]);
    return [...modifiers, text.replace(/[⌃⌥⇧⌘]/g, '')];
  }
  // Split on "+" between parts, keeping a "+" key itself.
  return text.split(/\+(?=.)/);
}

/** Codicons for the scopes (the Shortcuts view, the cheat sheet). */
export const SCOPE_ICONS: Record<ShortcutScope, string> = {
  global: 'browser',
  inspect: 'inspect',
  draw: 'edit',
  screenshot: 'device-camera',
  devtools: 'debug-console',
  device: 'device-mobile',
  measure: 'symbol-ruler',
  eyedropper: 'symbol-color',
  overlay: 'layers',
  tweak: 'symbol-property',
  record: 'record',
  a11y: 'accessibility',
};

/** A key for people: `Ctrl+Shift+T`, `⇧⌘T`, `Esc`, `↑`. */
export function formatKey(binding: string, mac: boolean): string {
  const chord = parseChord(binding);
  const names: Record<string, string> = {
    escape: 'Esc',
    enter: mac ? '↩' : 'Enter',
    backspace: mac ? '⌫' : 'Backspace',
    delete: mac ? '⌦' : 'Delete',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    pageup: 'PgUp',
    pagedown: 'PgDn',
    tab: mac ? '⇥' : 'Tab',
    space: 'Space',
    '/': chord.shift ? '?' : '/',
  };
  const shiftShown = !(chord.key === '/' && chord.shift);
  const key =
    names[chord.key] ??
    (chord.key.length === 1
      ? chord.key.toUpperCase()
      : chord.key[0]!.toUpperCase() + chord.key.slice(1));
  if (mac) {
    return `${chord.ctrl ? '⌃' : ''}${chord.alt ? '⌥' : ''}${chord.shift && shiftShown ? '⇧' : ''}${chord.meta ? '⌘' : ''}${key}`;
  }
  return [chord.ctrl && 'Ctrl', chord.alt && 'Alt', chord.shift && shiftShown && 'Shift', key]
    .filter(Boolean)
    .join('+');
}

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
  esc: 'escape',
  ' ': 'space',
  '+': '=',
};

/** Punctuation matched by physical key, so Shift and the layout don't change the key name. */
const CODE_NAMES: Record<string, string> = {
  Equal: '=',
  Minus: '-',
  BracketLeft: '[',
  BracketRight: ']',
  Slash: '/',
  Backslash: '\\',
  Comma: ',',
  Period: '.',
  Semicolon: ';',
  Quote: "'",
  Backquote: '`',
  NumpadAdd: '=',
  NumpadSubtract: '-',
};

/** Keys that are only modifiers: never a shortcut on their own. */
export const MODIFIER_KEYS = new Set(['Control', 'Shift', 'Alt', 'Meta', 'AltGraph', 'OS']);

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
  else if (CODE_NAMES[event.code]) key = CODE_NAMES[event.code]!;
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
