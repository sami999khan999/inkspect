// The keyboard shortcuts the toolbar uses: the same registry and the same key map as VS Code
// Browser (`@inkspect/shared/shortcuts`). The map lives in this browser's sync storage; the
// background passes changes to VS Code and takes VS Code's (see background/shortcutSync.ts), so
// a key changed on either side works on both.
import {
  defaultKeys,
  normalizeKey,
  effectiveShortcuts,
  sanitizeOverrides,
  SCOPE_LABELS,
  SHORTCUT_ACTIONS,
  TOOLBAR_ACTION_IDS,
  type ShortcutAction,
  type ShortcutMap,
  type ShortcutOverrides,
  type ShortcutScope,
} from '@inkspect/shared/shortcuts';

export const SHORTCUTS_KEY = 'inkspectShortcuts';

export const isMac = typeof navigator !== 'undefined' && navigator.userAgent.includes('Macintosh');

/** What sync storage holds: the changed keys (as in VS Code's setting) and when they changed. */
export interface StoredShortcuts {
  overrides: ShortcutOverrides;
  updated: number;
}

/** The actions the toolbar handles (the shared list). The others are VS Code Browser's own. */
export const TOOLBAR_ACTIONS: readonly ShortcutAction[] = SHORTCUT_ACTIONS.filter((a) =>
  TOOLBAR_ACTION_IDS.has(a.id),
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
  scope === 'global' ? 'General' : SCOPE_LABELS[scope];

/** The scopes the toolbar has, in the order they are listed. */
export const TOOLBAR_SCOPES: readonly ShortcutScope[] = ['global', 'inspect', 'draw', 'screenshot'];

/**
 * Every group, the toolbar's first. The lists show every shortcut, not only the toolbar's: they
 * are one key map, synced with VS Code, so any of them can be changed from either side.
 */
export const ALL_SCOPES: readonly ShortcutScope[] = [
  ...TOOLBAR_SCOPES,
  ...(Object.keys(SCOPE_LABELS) as ShortcutScope[]).filter((s) => !TOOLBAR_SCOPES.includes(s)),
];

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
    void readShortcuts()
      .then((stored) => listener(effectiveShortcuts(stored.overrides, isMac), stored))
      .catch(() => {
        // Storage gone (the extension was reloaded): the keys stay as they are.
      });
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
  const defaults = action ? defaultKeys(action, isMac).map(normalizeKey) : [];
  const same =
    keys !== undefined &&
    keys.length === defaults.length &&
    keys.every((key) => defaults.includes(key));
  if (keys === undefined || same) delete next[id];
  else next[id] = keys;
  await writeShortcuts(next);
}

/** Resets every shortcut to its default, here and (through the link) in VS Code. */
export async function resetAllShortcuts(): Promise<void> {
  await writeShortcuts({});
}
