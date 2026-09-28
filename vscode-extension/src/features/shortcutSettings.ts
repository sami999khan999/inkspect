import * as vscode from 'vscode';
import { getConfig } from '../config';
import { sanitizeOverrides, type ShortcutOverrides } from '../shared/shortcuts';

/**
 * The user's shortcut changes live in the `vscodeBrowser.shortcuts` setting (application scope,
 * so VS Code Settings Sync carries it), with `vscodeBrowser.shortcutsUpdated` saying when they
 * last changed (the newer copy wins when syncing with the browser extension).
 */
export function readShortcuts(): { overrides: ShortcutOverrides; updated: number } {
  const config = getConfig();
  return { overrides: config.shortcuts, updated: config.shortcutsUpdated };
}

/**
 * A time for a new change: now, but always after the last change, so it wins even when another
 * device's clock ran ahead.
 */
export function nextShortcutsTime(): number {
  return Math.max(Date.now(), getConfig().shortcutsUpdated + 1);
}

/** The last shortcuts saved by writeShortcuts (as JSON, with their time). */
let lastWrite: { json: string; updated: number } | undefined;

/**
 * Whether these settings are the ones writeShortcuts saved last. Anything else was edited
 * elsewhere (settings.json, Settings Sync) and needs a new time before it is synced on.
 */
export function isOwnWrite(overrides: ShortcutOverrides, updated: number): boolean {
  return lastWrite?.json === JSON.stringify(overrides) && lastWrite.updated === updated;
}

/** Saves the shortcut changes (removing the setting when there are none). */
export async function writeShortcuts(
  overrides: ShortcutOverrides,
  updated = nextShortcutsTime(),
): Promise<void> {
  const clean = sanitizeOverrides(overrides);
  lastWrite = { json: JSON.stringify(clean), updated };
  const config = vscode.workspace.getConfiguration('vscodeBrowser');
  const target = vscode.ConfigurationTarget.Global;
  // The time first: listeners react to the map, and must see the new time with it.
  await config.update('shortcutsUpdated', updated, target);
  await config.update('shortcuts', Object.keys(clean).length ? clean : undefined, target);
}

/** Marks the shortcuts as changed now (after an edit made outside the Shortcuts view). */
export async function touchShortcuts(): Promise<void> {
  await writeShortcuts(getConfig().shortcuts);
}

/**
 * Fires once the shortcut settings have settled after a change (from the Shortcuts view,
 * settings.json or Settings Sync). Both settings change together, so the event is debounced.
 */
export function onDidChangeShortcuts(listener: () => void): vscode.Disposable {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const subscription = vscode.workspace.onDidChangeConfiguration((event) => {
    if (
      event.affectsConfiguration('vscodeBrowser.shortcuts') ||
      event.affectsConfiguration('vscodeBrowser.shortcutsUpdated')
    ) {
      clearTimeout(timer);
      timer = setTimeout(listener, 100);
    }
  });
  return new vscode.Disposable(() => {
    clearTimeout(timer);
    subscription.dispose();
  });
}
