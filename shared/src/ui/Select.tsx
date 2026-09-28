import { useCallback, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx, portalTarget, useAnchoredPosition, useDismiss } from './popover';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
  /** Codicon name. */
  icon?: string;
  /** Secondary text on the right of the option (a size, a shortcut...). */
  detail?: string;
  /** Options with the same group are listed under a heading. */
  group?: string;
  disabled?: boolean;
  /** Nesting level (folders in a tree). */
  indent?: number;
}

interface SelectProps<T extends string> {
  value: T | undefined;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  /** Accessible name (also the tooltip unless `title` is given). */
  label: string;
  title?: string;
  /** Shown when no option matches `value`. */
  placeholder?: string;
  /** Codicon shown before the value, e.g. to hint what the select is about in a toolbar. */
  icon?: string;
  /** Text shown in the closed select instead of the option's label. */
  renderValue?: (option: SelectOption<T>) => ReactNode;
  size?: 'sm' | 'md';
  /** `quiet` has no border until hovered, for toolbars. */
  appearance?: 'field' | 'quiet';
  disabled?: boolean;
  className?: string;
  align?: 'start' | 'end';
}

/**
 * A themed replacement for `<select>`: a button that opens a listbox. Keyboard: arrows, Home/End,
 * Enter/Space to choose, Escape/Tab to close, and typing jumps to a matching option.
 */
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  title,
  placeholder = 'Select…',
  icon,
  renderValue,
  size = 'md',
  appearance = 'field',
  disabled,
  className,
  align = 'start',
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [host, setHost] = useState<Element | DocumentFragment | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const typed = useRef({ text: '', at: 0 });
  const id = useId();
  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = options[selectedIndex];

  const close = useCallback((reason?: 'outside' | 'escape' | 'window' | 'chosen') => {
    setOpen(false);
    if (reason === 'escape' || reason === 'chosen') trigger.current?.focus();
  }, []);
  useDismiss([trigger, list], open, close);
  useAnchoredPosition(trigger, list, open, { align, matchWidth: true });

  const enabled = (index: number) => index >= 0 && !options[index]?.disabled;
  const step = (from: number, delta: number) => {
    for (let i = 1; i <= options.length; i++) {
      const index = (from + delta * i + options.length * 2) % options.length;
      if (enabled(index)) return index;
    }
    return from;
  };
  const show = (index = selectedIndex) => {
    setActive(enabled(index) ? index : step(-1, 1));
    setHost(portalTarget(trigger.current));
    setOpen(true);
  };
  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    close('chosen');
    if (option.value !== value) onChange(option.value);
  };

  // Keep the active option in view.
  useLayoutEffect(() => {
    if (!open) return;
    list.current
      ?.querySelector<HTMLElement>(`[data-index="${active}"]`)
      ?.scrollIntoView({ block: 'nearest' });
    list.current?.focus({ preventScroll: true });
  }, [open, active]);

  const typeAhead = (key: string) => {
    const now = Date.now();
    const text = (now - typed.current.at < 700 ? typed.current.text : '') + key.toLowerCase();
    typed.current = { text, at: now };
    const start = open ? active : selectedIndex;
    const order = [...options.keys()].map(
      (i) => (start + (text.length > 1 ? 0 : 1) + i) % options.length,
    );
    const match = order.find((i) => enabled(i) && options[i]!.label.toLowerCase().startsWith(text));
    if (match === undefined) return;
    if (open) setActive(match);
    else if (options[match]!.value !== value) onChange(options[match]!.value);
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      show();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      typeAhead(event.key);
    }
  };

  const onListKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, () => void> = {
      ArrowDown: () => setActive((i) => step(i, 1)),
      ArrowUp: () => setActive((i) => step(i, -1)),
      Home: () => setActive(step(-1, 1)),
      End: () => setActive(step(options.length, -1)),
      PageDown: () => setActive((i) => Math.min(step(i, 1) + 7, step(options.length, -1))),
      PageUp: () => setActive((i) => Math.max(step(i, -1) - 7, step(-1, 1))),
      Enter: () => choose(active),
      ' ': () =>
        typed.current.text && Date.now() - typed.current.at < 700 ? typeAhead(' ') : choose(active),
      Tab: () => close(),
    };
    const action = keys[event.key];
    if (action) {
      if (event.key !== 'Tab') event.preventDefault();
      action();
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      typeAhead(event.key);
    }
  };

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={cx(
          'select',
          `size-${size}`,
          appearance === 'quiet' && 'quiet',
          open && 'open',
          className,
        )}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-label={label}
        title={title ?? label}
        disabled={disabled}
        onClick={() => (open ? close() : show())}
        onKeyDown={onTriggerKeyDown}
      >
        {icon && <span className={`codicon codicon-${icon}`} aria-hidden="true" />}
        {!icon && selected?.icon && (
          <span className={`codicon codicon-${selected.icon}`} aria-hidden="true" />
        )}
        <span className={cx('select-value', !selected && 'placeholder')}>
          {selected ? (renderValue ? renderValue(selected) : selected.label) : placeholder}
        </span>
        <span className="codicon codicon-chevron-down select-chevron" aria-hidden="true" />
      </button>
      {open &&
        host &&
        createPortal(
          <div
            ref={list}
            id={`${id}-list`}
            className="select-list"
            data-ink-popup=""
            role="listbox"
            aria-label={label}
            tabIndex={-1}
            aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
            onKeyDown={onListKeyDown}
          >
            {options.map((option, index) => {
              const heading =
                option.group && option.group !== options[index - 1]?.group ? (
                  <div key={`g-${option.group}`} className="select-group" role="presentation">
                    {option.group}
                  </div>
                ) : null;
              return [
                heading,
                <div
                  key={option.value}
                  id={`${id}-${index}`}
                  data-index={index}
                  role="option"
                  aria-selected={index === selectedIndex}
                  aria-disabled={option.disabled || undefined}
                  className={cx(
                    'select-option',
                    index === active && 'active',
                    index === selectedIndex && 'selected',
                    option.disabled && 'disabled',
                  )}
                  style={option.indent ? { paddingLeft: 4 + option.indent * 14 } : undefined}
                  onPointerMove={() => !option.disabled && setActive(index)}
                  onClick={() => choose(index)}
                >
                  <span
                    className={`codicon codicon-${index === selectedIndex ? 'check' : 'blank'} select-check`}
                    aria-hidden="true"
                  />
                  {option.icon && (
                    <span className={`codicon codicon-${option.icon}`} aria-hidden="true" />
                  )}
                  <span className="select-option-label">{option.label}</span>
                  {option.detail && <span className="select-option-detail">{option.detail}</span>}
                </div>,
              ];
            })}
          </div>,
          host,
        )}
    </>
  );
}
