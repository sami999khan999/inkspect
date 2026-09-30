import { useEffect, useState, type ReactNode } from 'react';
import { Button, type ButtonVariant } from './Button';

/**
 * A button for an action that can't be taken back (reset every shortcut, unlink): the first
 * click only arms it ("Click again to reset"), a second click within a few seconds does it.
 * For pages where a dialog would be wrong (the browser extension's toolbar sits in web pages).
 */
export function ConfirmButton({
  children,
  confirmLabel,
  onConfirm,
  icon,
  variant = 'ghost',
  size = 'sm',
  disabled,
  title,
  className,
}: {
  children: ReactNode;
  /** What the armed button says: "Click again to reset". */
  confirmLabel: string;
  onConfirm: () => void;
  icon?: string;
  variant?: ButtonVariant;
  size?: 'sm' | 'md';
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const timer = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(timer);
  }, [armed]);
  return (
    <Button
      size={size}
      variant={armed ? 'danger' : variant}
      icon={armed ? 'warning' : icon}
      disabled={disabled}
      title={title}
      className={className}
      aria-live="polite"
      onClick={() => {
        if (!armed) {
          setArmed(true);
          return;
        }
        setArmed(false);
        onConfirm();
      }}
      onBlur={() => setArmed(false)}
    >
      {armed ? confirmLabel : children}
    </Button>
  );
}
