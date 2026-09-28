import { useRef } from 'react';
import { cx } from './popover';

export interface SegmentOption<T extends string> {
  value: T;
  label: string;
  /** Codicon name; with `iconOnly` the label becomes the tooltip. */
  icon?: string;
  /** A small count after the label. */
  count?: number;
  /** Colors the count (e.g. errors). */
  tone?: 'error';
}

interface SegmentedProps<T extends string> {
  value: T;
  options: SegmentOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name of the group. */
  label: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

/** A row of mutually exclusive options (a radio group): arrow keys move and choose. */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  label,
  iconOnly,
  size = 'md',
  className,
}: SegmentedProps<T>) {
  const ref = useRef<HTMLDivElement>(null);
  const onKeyDown = (event: React.KeyboardEvent) => {
    const delta = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key];
    if (!delta) return;
    event.preventDefault();
    const index = options.findIndex((o) => o.value === value);
    const next = options[(index + delta + options.length) % options.length]!;
    onChange(next.value);
    ref.current?.querySelector<HTMLElement>(`[data-value="${CSS.escape(next.value)}"]`)?.focus();
  };
  return (
    <div
      ref={ref}
      className={cx('segmented', `size-${size}`, className)}
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {options.map((option) => {
        const checked = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={iconOnly ? option.label : undefined}
            // Hosts may hide the labels of icon options when narrow, so they keep a tooltip.
            title={iconOnly || option.icon ? option.label : undefined}
            data-value={option.value}
            tabIndex={checked ? 0 : -1}
            className={cx('segment', checked && 'checked')}
            onClick={() => onChange(option.value)}
          >
            {option.icon && (
              <span className={`codicon codicon-${option.icon}`} aria-hidden="true" />
            )}
            {!iconOnly && <span className="segment-label">{option.label}</span>}
            {option.count !== undefined && (
              <span className={cx('segment-count', option.tone)}>{option.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
