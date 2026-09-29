// The keyboard shortcuts the toolbar uses: the same registry and the same key map as VS Code
// Browser (`@inkspect/shared/shortcuts`). The map lives in this browser's sync storage; the
// background passes changes to VS Code and takes VS Code's (see background/shortcutSync.ts), so
// a key changed on either side works on both.
import {
  defaultKeys,
  effectiveShortcuts,
  sanitizeOverrides,
  SCOPE_LABELS,
  SHORTCUT_ACTIONS,
  type ShortcutAction,
  type ShortcutMap,
  type ShortcutOverrides,
  type ShortcutScope,
} from '@inkspect/shared/shortcuts';
import { TOOL_KEYS } from '@inkspect/shared/ui/DrawToolbar';

export const SHORTCUTS_KEY = 'inkspectShortcuts';

export const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

/** What sync storage holds: the changed keys (as in VS Code's setting) and when they changed. */
export interface StoredShortcuts {
  overrides: ShortcutOverrides;
  updated: number;
}

const DRAW_TOOLS = new Set(Object.values(TOOL_KEYS));

/** The actions the toolbar handles. The others (tabs, the address bar...) are VS Code's own. */
const TOOLBAR_IDS = new Set([
  'mode.inspect',
  'mode.draw',
  'mode.screenshot',
  'mode.device',
  'mode.devtools',
  'page.bookmark',
  'open.shortcuts',
  'inspect.parent',
  'inspect.child',
  'inspect.copy',
  'inspect.exit',
  ...[...DRAW_TOOLS].map((tool) => `draw.${tool}`),
  ...Array.from({ length: 9 }, (_, i) => `draw.color${i + 1}`),
  'draw.thinner',
  'draw.thicker',
  'draw.fill',
  'draw.undo',
  'draw.redo',
  'draw.clear',
  'draw.visible',
  'draw.capture',
  'draw.captureMenu',
  'draw.captureGroups',
  'draw.captureClean',
  'draw.captureViewport',
  'draw.captureFullPage',
  'draw.exit',
  'shot.viewport',
  'shot.fullPage',
  'shot.region',
  'shot.element',
  'shot.drawing',
]);

export const TOOLBAR_ACTIONS: readonly ShortcutAction[] = SHORTCUT_ACTIONS.filter((a) =>
  TOOLBAR_IDS.has(a.id),
);

/** What the toolbar calls some modes (the registry's labels are VS Code Browser's). */
export const TOOLBAR_LABELS: Partial<Record<string, string>> = {
  'mode.device': 'Responsive view',
  'mode.screenshot': 'Screenshot menu',
  'open.shortcuts': 'Keyboard shortcuts',
};

export const labelOf = (action: ShortcutAction) => TOOLBAR_LABELS[action.id] ?? action.label;

/** Group names in the extension (VS Code Browser calls its general keys "Browser"). */
export const scopeLabelOf = (scope: ShortcutScope) =>
  scope === 'global' ? 'Toolbar' : SCOPE_LABELS[scope];

/** The scopes the toolbar has, in the order they are listed. */
export const TOOLBAR_SCOPES: readonly ShortcutScope[] = ['global', 'inspect', 'draw', 'screenshot'];

export async function readShortcuts(): Promise<StoredShortcuts> {
  const value = (await chrome.storage.sync.get(SHORTCUTS_KEY))[SHORTCUTS_KEY] as
    { shortcuts?: unknown; updated?: unknown } | undefined;
  return {
    overrides: sanitizeOverrides(value?.shortcuts ?? {}),
    updated: typeof value?.updated === 'number' ? value.updated : 0,
  };
}

/**
 * Saves changed keys. The time is always later than the stored one, so the change wins over
 * VS Code's copy (the newer copy wins), even when this device's clock is behind.
 */
export async function writeShortcuts(overrides: ShortcutOverrides): Promise<void> {
  const { updated } = await readShortcuts();
  await chrome.storage.sync.set({
    [SHORTCUTS_KEY]: { shortcuts: overrides, updated: Math.max(Date.now(), updated + 1) },
  });
}

/** Calls `listener` with the key map now and whenever it changes (here, on another device or in VS Code). */
export function watchShortcuts(
  listener: (map: ShortcutMap, stored: StoredShortcuts) => void,
): () => void {
  const load = () =>
    void readShortcuts().then((stored) =>
      listener(effectiveShortcuts(stored.overrides, isMac), stored),
    );
  const onChanged = (changes: Record<string, chrome.storage.StorageChange>, area: string) => {
    if (area === 'sync' && changes[SHORTCUTS_KEY]) load();
  };
  chrome.storage.onChanged.addListener(onChanged);
  load();
  return () => chrome.storage.onChanged.removeListener(onChanged);
}

/**
 * Sets an action's keys and saves. Keys equal to the defaults are stored as "not changed", so
 * the map stays small and later default changes still apply.
 */
export async function setShortcutKeys(
  overrides: ShortcutOverrides,
  id: string,
  keys: string[] | undefined,
): Promise<void> {
  const next = { ...overrides };
  const action = SHORTCUT_ACTIONS.find((a) => a.id === id);
  const defaults = action ? defaultKeys(action, isMac) : [];
  const same =
    keys !== undefined &&
    keys.length === defaults.length &&
    keys.every((key) => defaults.includes(key));
  if (keys === undefined || same) delete next[id];
  else next[id] = keys;
  await writeShortcuts(next);
}

/** Resets the toolbar's actions (VS Code's own changes are kept). */
export async function resetToolbarShortcuts(overrides: ShortcutOverrides): Promise<void> {
  const next = { ...overrides };
  for (const action of TOOLBAR_ACTIONS) delete next[action.id];
  await writeShortcuts(next);
}
