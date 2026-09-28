import type { ReactNode } from 'react';
import { cx } from './popover';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label beside the control; without it, `label` names the control for screen readers. */
  children?: ReactNode;
  label?: string;
  disabled?: boolean;
  className?: string;
  title?: string;
}

/** An on/off switch for settings that apply immediately. */
export function Switch({
  checked,
  onChange,
  children,
  label,
  disabled,
  className,
  title,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={children ? undefined : label}
      title={title}
      disabled={disabled}
      className={cx('switch', checked && 'on', className)}
      onClick={() => onChange(!checked)}
    >
      <span className="switch-track" aria-hidden="true">
        <span className="switch-thumb" />
      </span>
      {children && <span className="toggle-label">{children}</span>}
    </button>
  );
}

/** A checkbox for choices within a form or list. */
export function Checkbox({
  checked,
  onChange,
  children,
  label,
  disabled,
  className,
  title,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={children ? undefined : label}
      title={title}
      disabled={disabled}
      className={cx('checkbox', checked && 'on', className)}
      onClick={() => onChange(!checked)}
    >
      <span className="checkbox-box" aria-hidden="true">
        {checked && <span className="codicon codicon-check" />}
      </span>
      {children && <span className="toggle-label">{children}</span>}
    </button>
  );
}
