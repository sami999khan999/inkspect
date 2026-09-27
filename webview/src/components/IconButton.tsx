interface IconButtonProps {
  /** Codicon name, e.g. `arrow-left`. */
  icon: string;
  label: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  active?: boolean;
  spin?: boolean;
  className?: string;
}

export function IconButton({
  icon,
  label,
  onClick,
  onContextMenu,
  disabled,
  active,
  spin,
  className,
}: IconButtonProps) {
  return (
    <button
      type="button"
      className={['icon-button', active && 'active', className].filter(Boolean).join(' ')}
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <span
        className={`codicon codicon-${icon}${spin ? ' codicon-modifier-spin' : ''}`}
        aria-hidden="true"
      />
    </button>
  );
}
