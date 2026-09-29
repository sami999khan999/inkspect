import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cx } from './popover';

export type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  /** Codicon name shown before the label. */
  icon?: string;
  /** Codicon name shown after the label (e.g. `chevron-down` for menu buttons). */
  iconEnd?: string;
  /** Shows a spinner instead of the icon and disables the button. */
  loading?: boolean;
  ref?: Ref<HTMLButtonElement>;
  children?: ReactNode;
}

/**
 * The one text button used everywhere: primary, accent (solid, in the theme's palette), secondary,
 * ghost (toolbar-like) or danger.
 */
export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  iconEnd,
  loading,
  className,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  const lead = loading ? 'loading' : icon;
  return (
    <button
      type={type}
      className={cx('button', variant, size === 'sm' && 'small', className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {lead && (
        <span
          className={cx('codicon', `codicon-${lead}`, loading && 'codicon-modifier-spin')}
          aria-hidden="true"
        />
      )}
      {children !== undefined && <span className="button-label">{children}</span>}
      {iconEnd && <span className={`codicon codicon-${iconEnd}`} aria-hidden="true" />}
    </button>
  );
}
