import { Fragment, useRef } from 'react';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  /** Called when the last digit is typed. */
  onComplete?: (value: string) => void;
  length?: number;
  disabled?: boolean;
}

/**
 * The pairing code as one box per digit. Typing moves to the next box, Backspace goes back,
 * arrows move, and pasting a whole code fills every box.
 */
export function CodeInput({ value, onChange, onComplete, length = 6, disabled }: CodeInputProps) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length }, (_, i) => value[i] ?? '');
  const focus = (index: number) => boxes.current[Math.max(0, Math.min(length - 1, index))]?.focus();

  const write = (index: number, text: string) => {
    const incoming = text.replace(/\D/g, '');
    if (!incoming) return;
    const next = (value.slice(0, index) + incoming).slice(0, length);
    onChange(next);
    focus(next.length);
    if (next.length === length) onComplete?.(next);
  };

  return (
    <div className="code-input" role="group" aria-label="Pairing code">
      {digits.map((digit, index) => (
        <Fragment key={index}>
          {index === length / 2 && <span className="code-sep" aria-hidden="true" />}
          <input
            ref={(element) => {
              boxes.current[index] = element;
            }}
            className="code-box"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Digit ${index + 1}`}
            maxLength={length}
            disabled={disabled}
            value={digit}
            onFocus={(event) => event.currentTarget.select()}
            onChange={(event) => write(Math.min(index, value.length), event.target.value)}
            onPaste={(event) => {
              event.preventDefault();
              write(0, event.clipboardData.getData('text'));
            }}
            onKeyDown={(event) => {
              if (event.key === 'Backspace') {
                event.preventDefault();
                const at = digit ? index : index - 1;
                if (at >= 0) onChange(value.slice(0, at));
                focus(at);
              } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                focus(index - 1);
              } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                focus(index + 1);
              }
            }}
          />
        </Fragment>
      ))}
    </div>
  );
}
