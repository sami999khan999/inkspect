import type { ReactNode } from 'react';
import { cx } from './popover';

interface FieldProps {
  label: string;
  /** Help text under the control. */
  hint?: ReactNode;
  /** An error under the control (replaces the hint). */
  error?: string;
  /** Label beside the control instead of above it (switches, checkboxes). */
  inline?: boolean;
  className?: string;
  children: ReactNode;
}

/** A labelled form row: the label names the control inside it, with optional help or error. */
export function Field({ label, hint, error, inline, className, children }: FieldProps) {
  return (
    <label className={cx('field', inline && 'inline', className)}>
      <span className="field-label">{label}</span>
      <span className="field-control">{children}</span>
      {(error || hint) && (
        <span className={cx('field-hint', error && 'error')} role={error ? 'alert' : undefined}>
          {error ?? hint}
        </span>
      )}
    </label>
  );
}
