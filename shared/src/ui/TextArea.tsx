import type { Ref, TextareaHTMLAttributes } from 'react';
import { cx } from './popover';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Class of the wrapper (width and layout). */
  className?: string;
  ref?: Ref<HTMLTextAreaElement>;
}

/** A text input of several lines, styled like TextField; it grows with its text up to a limit. */
export function TextArea({ className, disabled, rows = 2, ...input }: TextAreaProps) {
  return (
    <div className={cx('text-field', 'multiline', disabled && 'disabled', className)}>
      <textarea spellCheck={false} rows={rows} {...input} disabled={disabled} />
    </div>
  );
}
