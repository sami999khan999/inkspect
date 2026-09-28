import { useRef } from 'react';
import { cx } from './popover';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  /** Accessible name and tooltip. */
  label: string;
  /** Text for screen readers and the value bubble (defaults to the number). */
  format?: (value: number) => string;
  /** Codicon shown before the track. */
  icon?: string;
  /** Shows the formatted value after the track. */
  showValue?: boolean;
  className?: string;
  disabled?: boolean;
}

/**
 * A themed range control: drag the thumb or click the track; arrows, Page Up/Down and Home/End
 * change the value from the keyboard.
 */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  format = String,
  icon,
  showValue,
  className,
  disabled,
}: SliderProps) {
  const track = useRef<HTMLDivElement>(null);
  const clamp = (n: number) => Math.min(max, Math.max(min, Math.round(n / step) * step));
  const set = (n: number) => {
    const next = clamp(n);
    if (next !== value) onChange(next);
  };
  const fromPointer = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect?.width) return;
    set(min + ((clientX - rect.left) / rect.width) * (max - min));
  };
  const fraction = max > min ? (value - min) / (max - min) : 0;

  const onKeyDown = (event: React.KeyboardEvent) => {
    const big = Math.max(step, (max - min) / 10);
    const next: Record<string, number> = {
      ArrowRight: value + step,
      ArrowUp: value + step,
      ArrowLeft: value - step,
      ArrowDown: value - step,
      PageUp: value + big,
      PageDown: value - big,
      Home: min,
      End: max,
    };
    if (event.key in next) {
      event.preventDefault();
      set(next[event.key]!);
    }
  };

  return (
    <div
      className={cx('slider', disabled && 'disabled', className)}
      title={`${label}: ${format(value)}`}
    >
      {icon && <span className={`codicon codicon-${icon}`} aria-hidden="true" />}
      <div
        ref={track}
        className="slider-track"
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-valuetext={format(value)}
        aria-disabled={disabled || undefined}
        onKeyDown={disabled ? undefined : onKeyDown}
        onPointerDown={(event) => {
          if (disabled || event.button !== 0) return;
          event.currentTarget.setPointerCapture(event.pointerId);
          event.currentTarget.focus();
          fromPointer(event.clientX);
        }}
        onPointerMove={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event.clientX);
        }}
      >
        <span className="slider-fill" style={{ width: `${fraction * 100}%` }} />
        <span className="slider-thumb" style={{ left: `${fraction * 100}%` }} />
      </div>
      {showValue && <span className="slider-value">{format(value)}</span>}
    </div>
  );
}
