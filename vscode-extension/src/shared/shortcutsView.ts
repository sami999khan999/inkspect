// Messages between the Shortcuts view (sidebar webview) and the extension host.
import type { ShortcutOverrides } from './shortcuts';

export type ShortcutsViewToHost =
  | { type: 'ready' }
  /** New keys for an action (`[]` removes all its keys). */
  | { type: 'set'; id: string; keys: string[] }
  /** Back to the action's default keys. */
  | { type: 'reset'; id: string }
  | { type: 'resetAll' }
  | { type: 'export' }
  | { type: 'import' };

export type HostToShortcutsView = {
  type: 'state';
  overrides: ShortcutOverrides;
  /** When the shortcuts last changed (ms), 0 if never. */
  updated: number;
  /** Whether a browser extension is linked (so changes also reach Chrome's sync). */
  browserLinked: boolean;
};

const isStringArray = (v: unknown): v is string[] =>
  Array.isArray(v) && v.length <= 8 && v.every((k) => typeof k === 'string' && k.length <= 40);

/** Validates a message from the Shortcuts view (webview input is untrusted). */
export function isShortcutsViewMessage(value: unknown): value is ShortcutsViewToHost {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  switch (m.type) {
    case 'ready':
    case 'resetAll':
    case 'export':
    case 'import':
      return true;
    case 'set':
      return typeof m.id === 'string' && isStringArray(m.keys);
    case 'reset':
      return typeof m.id === 'string';
    default:
      return false;
  }
}
