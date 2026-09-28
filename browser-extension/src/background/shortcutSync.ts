// Keeps the VS Code browser's shortcuts in this browser's sync storage, so they follow the
// user's browser account (Google, Microsoft, Firefox) to other devices. No bookmarks are used.
import { newerShortcuts, type ShortcutSettings } from '@inkspect/shared/bridge';
import type { BridgeClient } from './bridge';

export const SHORTCUTS_KEY = 'inkspectShortcuts';

async function stored(): Promise<ShortcutSettings | undefined> {
  const value = (await chrome.storage.sync.get(SHORTCUTS_KEY))[SHORTCUTS_KEY] as unknown;
  if (!value || typeof value !== 'object') return undefined;
  const { shortcuts, updated } = value as Partial<ShortcutSettings>;
  if (!shortcuts || typeof shortcuts !== 'object' || typeof updated !== 'number') return undefined;
  return { shortcuts, updated };
}

/**
 * VS Code sent its shortcuts (after linking, or when they change): keep the newer copy. When
 * this browser's copy is newer (changed on another device), VS Code gets it instead.
 */
export async function receiveShortcuts(
  bridge: BridgeClient,
  fromVsCode: ShortcutSettings,
): Promise<void> {
  const local = await stored();
  switch (newerShortcuts(local, fromVsCode)) {
    case 'remote':
      await chrome.storage.sync.set({
        [SHORTCUTS_KEY]: { shortcuts: fromVsCode.shortcuts, updated: fromVsCode.updated },
      });
      break;
    case 'local':
      if (local) bridge.send({ type: 'settings.shortcuts', ...local });
      break;
  }
}

/** Sync storage changed (usually another device): pass the shortcuts on to VS Code. */
export function watchShortcuts(bridge: BridgeClient): void {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync' || !changes[SHORTCUTS_KEY] || !bridge.connected) return;
    void stored().then((settings) => {
      if (settings) bridge.send({ type: 'settings.shortcuts', ...settings });
    });
  });
}
