import { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { hsvToRgb, normalizeHex, parseColor, rgbToHsv, toHex, type Hsv } from '../color';
import { cx, portalTarget, useAnchoredPosition, useDismiss } from './popover';

interface ColorPickerProps {
  /** `#rrggbb`. */
  value: string;
  onChange: (value: string) => void;
  label: string;
  /** Quick picks at the bottom of the popup. */
  presets?: readonly string[];
  className?: string;
}

const hexOf = (hsv: Hsv) => toHex(hsvToRgb(hsv)).toLowerCase();
const hsvOf = (hex: string) => rgbToHsv(parseColor(hex) ?? { r: 0, g: 0, b: 0, a: 1 });

/**
 * A swatch that opens a color picker: a saturation/brightness area, a hue bar, a hex field and
 * presets. Everything works with the keyboard (arrows move the area's and the bar's handles).
 */
export function ColorPicker({ value, onChange, label, presets = [], className }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const [host, setHost] = useState<Element | DocumentFragment | null>(null);
  // Kept while open so the hue survives grays (where the hex has no hue).
  const [hsv, setHsv] = useState<Hsv>(() => hsvOf(value));
  const [draft, setDraft] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const popup = useRef<HTMLDivElement>(null);

  const close = useCallback((reason?: string) => {
    setOpen(false);
    if (reason === 'escape') trigger.current?.focus();
  }, []);
  useDismiss([trigger, popup], open, close);
  useAnchoredPosition(trigger, popup, open);

  const update = (next: Hsv) => {
    setHsv(next);
    setDraft(null);
    onChange(hexOf(next));
  };

  const drag = (element: HTMLElement, clientX: number, clientY: number, kind: 'area' | 'hue') => {
    const rect = element.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    update(kind === 'area' ? { ...hsv, s: x, v: 1 - y } : { ...hsv, h: x * 359.9 });
  };
  const pointer = (kind: 'area' | 'hue') => ({
    onPointerDown: (event: React.PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.focus();
      drag(event.currentTarget, event.clientX, event.clientY, kind);
    },
    onPointerMove: (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        drag(event.currentTarget, event.clientX, event.clientY, kind);
      }
    },
  });
  const keys = (kind: 'area' | 'hue') => (event: React.KeyboardEvent) => {
    const step = event.shiftKey ? 0.1 : 0.01;
    const d = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[
      event.key
    ];
    if (!d) return;
    event.preventDefault();
    const clamp = (n: number) => Math.min(1, Math.max(0, n));
    if (kind === 'area')
      update({ ...hsv, s: clamp(hsv.s + d[0]! * step), v: clamp(hsv.v + d[1]! * step) });
    else update({ ...hsv, h: Math.min(359.9, Math.max(0, hsv.h + (d[0]! || d[1]!) * step * 360)) });
  };

  const hue = `hsl(${hsv.h} 100% 50%)`;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        className={cx('swatch', 'color-picker-trigger', open && 'active', className)}
        aria-label={label}
        title={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          if (open) return close();
          setHsv(hsvOf(value));
          setDraft(null);
          setHost(portalTarget(trigger.current));
          setOpen(true);
        }}
      />
      {open &&
        host &&
        createPortal(
          <div
            ref={popup}
            className="color-picker"
            data-ink-popup=""
            role="dialog"
            aria-label={label}
          >
            <div
              className="color-area"
              style={{ background: hue }}
              role="slider"
              tabIndex={0}
              aria-label="Saturation and brightness"
              aria-valuetext={`Saturation ${Math.round(hsv.s * 100)}%, brightness ${Math.round(hsv.v * 100)}%`}
              onKeyDown={keys('area')}
              {...pointer('area')}
            >
              <span
                className="color-handle"
                style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%`, background: value }}
              />
            </div>
            <div
              className="color-hue"
              role="slider"
              tabIndex={0}
              aria-label="Hue"
              aria-valuemin={0}
              aria-valuemax={360}
              aria-valuenow={Math.round(hsv.h)}
              onKeyDown={keys('hue')}
              {...pointer('hue')}
            >
              <span
                className="color-handle"
                style={{ left: `${(hsv.h / 360) * 100}%`, background: hue }}
              />
            </div>
            <div className="color-row">
              <span className="color-preview" style={{ background: value }} aria-hidden="true" />
              <input
                className="color-hex"
                aria-label="Hex color"
                spellCheck={false}
                maxLength={7}
                value={draft ?? value}
                onChange={(event) => {
                  setDraft(event.target.value);
                  const hex = normalizeHex(event.target.value);
                  if (hex && event.target.value.replace('#', '').length === 6) {
                    setHsv(hsvOf(hex));
                    onChange(hex);
                  }
                }}
                onBlur={() => setDraft(null)}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter') return;
                  const hex = normalizeHex(event.currentTarget.value);
                  if (hex) {
                    setHsv(hsvOf(hex));
                    onChange(hex);
                    close('escape');
                  }
                }}
              />
            </div>
            {presets.length > 0 && (
              <div className="color-presets" role="group" aria-label="Presets">
                {presets.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={cx('swatch', 'small', color === value && 'active')}
                    style={{ background: color }}
                    aria-label={color}
                    title={color}
                    onClick={() => {
                      setHsv(hsvOf(color));
                      onChange(color);
                    }}
                  />
                ))}
              </div>
            )}
          </div>,
          host,
        )}
    </>
  );
}
