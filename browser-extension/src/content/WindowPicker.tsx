import type { VsCodeWindow } from '@inkspect/shared/bridge';
import { Select } from '@inkspect/shared/ui/Select';

/** The picker's value for "the VS Code window used last" (sends then name no window). */
export const LAST_USED = 'last-used';

/** The window a picker's value sends to: undefined means the one used last. */
export const windowOf = (value: string) => (value === LAST_USED ? undefined : value);

/**
 * Which VS Code window sends go to: the one used last (the default), or any open one. Shown only
 * when there is a choice (several windows).
 */
export function WindowPicker({
  windows,
  value,
  onChange,
  className,
}: {
  windows: readonly VsCodeWindow[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  if (windows.length < 2) return null;
  const last = windows.find((w) => w.lastUsed) ?? windows[0];
  return (
    <Select
      size="sm"
      label="VS Code window to send to"
      icon="vscode"
      className={className}
      value={value}
      onChange={onChange}
      options={[
        { value: LAST_USED, label: `Last used (${last?.name ?? 'VS Code'})`, icon: 'history' },
        ...windows.map((w) => ({
          value: w.id,
          label: w.name,
          icon: 'window',
          detail: w.lastUsed ? 'last used' : undefined,
          group: 'Open windows',
        })),
      ]}
    />
  );
}
