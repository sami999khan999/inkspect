import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from './popover';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Codicon name shown inside the field, before the text. */
  icon?: string;
  /** Content after the text (a count, a button...). */
  trailing?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Shows a clear button while there is text. */
  onClear?: () => void;
  /** Marks the field as invalid (red border). */
  invalid?: boolean;
  /** Class of the wrapper (width and layout). */
  className?: string;
  ref?: Ref<HTMLInputElement>;
}

/** A single-line text input with an optional icon, clear button and trailing content. */
export function TextField({
  icon,
  trailing,
  size = 'md',
  onClear,
  invalid,
  className,
  disabled,
  ...input
}: TextFieldProps) {
  const hasText = input.value !== undefined && String(input.value) !== '';
  return (
    <div
      className={cx(
        'text-field',
        `size-${size}`,
        invalid && 'invalid',
        disabled && 'disabled',
        className,
      )}
    >
      {icon && <span className={`codicon codicon-${icon} text-field-icon`} aria-hidden="true" />}
      <input
        spellCheck={false}
        {...input}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
      {onClear && hasText && (
        <button
          type="button"
          className="text-field-clear"
          aria-label="Clear"
          title="Clear"
          tabIndex={-1}
          onClick={onClear}
        >
          <span className="codicon codicon-close" aria-hidden="true" />
        </button>
      )}
      {trailing}
    </div>
  );
}
