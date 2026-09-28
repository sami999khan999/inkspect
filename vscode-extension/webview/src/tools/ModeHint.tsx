import type { ReactNode } from 'react';
import type { ShortcutScope } from '@shared/shortcuts';
import { scopeShortcuts, useShortcutMap } from '../shortcuts';

/**
 * The hint bar a mode shows over the page: what the pointer does, then the mode's first keys
 * (from the shortcut map, so remapped keys show) and how to see them all.
 */
export function ModeHint({
  scope,
  children,
  ids,
}: {
  scope: ShortcutScope;
  /** What the pointer does ("Click to pin"). */
  children?: ReactNode;
  /** Which actions to list (default: the first few of the scope). */
  ids?: string[];
}) {
  useShortcutMap();
  const all = scopeShortcuts(scope).filter((a) => a.keys.length);
  const shown = ids ? all.filter((a) => ids.includes(a.id)) : all.slice(0, 5);
  const help = all.find((a) => a.id.endsWith('.help'));
  return (
    <div className="mode-hint" role="status">
      {children && <span className="mode-hint-text">{children}</span>}
      {shown.map((action) => (
        <span key={action.id} className="mode-hint-item">
          <kbd>{action.keys[0]}</kbd> {action.label}
        </span>
      ))}
      {help && !shown.includes(help) && (
        <span className="mode-hint-item">
          <kbd>{help.keys[0]}</kbd> All keys
        </span>
      )}
    </div>
  );
}
