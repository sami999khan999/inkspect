import { useLayoutEffect, useRef, useState, type RefObject } from 'react';
import {
  DEVICE_PRESETS,
  displayScale,
  MAX_DEVICE_SIZE,
  MIN_DEVICE_SIZE,
  presetToDevice,
  rotate,
  type DeviceSettings,
} from '@inkspect/shared/devices';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Select, type SelectOption } from '@inkspect/shared/ui/Select';
import { TextField } from '@inkspect/shared/ui/TextField';

export type Zoom = 'fit' | number;

const ZOOMS: SelectOption[] = [
  { value: 'fit', label: 'Fit' },
  ...[0.5, 0.75, 1, 1.25].map((z) => ({ value: String(z), label: `${z * 100}%` })),
];

const DEVICE_OPTIONS: SelectOption[] = [
  { value: 'custom', label: 'Custom size', icon: 'screen-full' },
  ...DEVICE_PRESETS.map((p) => ({
    value: p.id,
    label: p.name,
    detail: `${p.width}×${p.height}`,
    group: p.group,
    icon: p.group === 'Desktops' ? 'vm' : 'device-mobile',
  })),
];

/** Room kept around the screen (its resize handles are in it), and for its caption. */
const MARGIN = 32;
const CAPTION = 36;

interface ResponsiveViewProps {
  /** Where the view starts: below the toolbar. */
  top: number;
  device: DeviceSettings;
  onDevice: (device: DeviceSettings) => void;
  zoom: Zoom;
  onZoom: (zoom: Zoom) => void;
  /** The page's address once the frame may load it (framing is allowed first). */
  src: string | null;
  frameRef: RefObject<HTMLIFrameElement | null>;
  emulationActive: boolean;
  onEmulation: () => void;
  onClose: () => void;
}

/**
 * The responsive view: the page in a device-sized frame, centered in the tab and scaled down to
 * fit when it is larger (like DevTools' device mode, which extensions can't drive: the debugger's
 * device metrics draw the page at the tab's top-left).
 */
export function ResponsiveView({
  top,
  device,
  onDevice,
  zoom,
  onZoom,
  src,
  frameRef,
  emulationActive,
  onEmulation,
  onClose,
}: ResponsiveViewProps) {
  const area = useRef<HTMLDivElement>(null);
  const widthField = useRef<HTMLInputElement>(null);
  const [available, setAvailable] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = area.current!;
    const measure = () => setAvailable({ width: el.clientWidth, height: el.clientHeight });
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, []);

  // While dragging, the zoom holds still, so the edge stays under the pointer.
  const [dragScale, setDragScale] = useState<number | null>(null);
  const scale =
    dragScale ??
    displayScale(zoom, device, {
      width: available.width - MARGIN * 2,
      height: available.height - MARGIN * 2 - CAPTION,
    });
  const drag = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  /** A resize handle: drags the right edge, the bottom edge, or both (the corner). */
  const handle = (axis: 'x' | 'y' | 'xy', label: string) => (
    <div
      className={`rv-handle rv-handle-${axis}`}
      role="separator"
      aria-label={label}
      title={label}
      onPointerDown={(event) => {
        event.preventDefault();
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = {
          x: event.clientX,
          y: event.clientY,
          width: device.width,
          height: device.height,
        };
        setDragScale(scale);
      }}
      onPointerMove={(event) => {
        const start = drag.current;
        if (!start) return;
        // The screen is centered, so it grows on both sides: twice the pointer's movement.
        const size = (from: number, moved: number) =>
          Math.round(
            Math.min(MAX_DEVICE_SIZE, Math.max(MIN_DEVICE_SIZE, from + (2 * moved) / scale)),
          );
        onDevice({
          ...device,
          presetId: undefined,
          width: axis === 'y' ? device.width : size(start.width, event.clientX - start.x),
          height: axis === 'x' ? device.height : size(start.height, event.clientY - start.y),
        });
      }}
      onPointerUp={() => {
        drag.current = null;
        setDragScale(null);
      }}
      onPointerCancel={() => {
        drag.current = null;
        setDragScale(null);
      }}
    />
  );
  const setSize = (key: 'width' | 'height', value: string) => {
    const number = Math.round(Number(value));
    if (!Number.isFinite(number) || number < MIN_DEVICE_SIZE) return;
    onDevice({ ...device, presetId: undefined, [key]: Math.min(MAX_DEVICE_SIZE, number) });
  };
  const preset = DEVICE_PRESETS.find((p) => p.id === device.presetId);

  return (
    <div className={`rv${dragScale !== null ? ' dragging' : ''}`} style={{ top }}>
      <div className="rv-controls" role="toolbar" aria-label="Responsive view">
        <Select
          size="sm"
          label="Device"
          className="rv-device"
          value={preset ? preset.id : 'custom'}
          options={DEVICE_OPTIONS}
          onChange={(id) => {
            const next = DEVICE_PRESETS.find((p) => p.id === id);
            if (next) onDevice(presetToDevice(next));
            else {
              // Custom: the current size, now free to edit; typing starts in the width box.
              onDevice({ ...device, presetId: undefined });
              requestAnimationFrame(() => widthField.current?.focus());
            }
          }}
        />
        <SizeField
          label="Width"
          value={device.width}
          onCommit={(v) => setSize('width', v)}
          inputRef={widthField}
        />
        <span className="rv-times" aria-hidden="true">
          ×
        </span>
        <SizeField label="Height" value={device.height} onCommit={(v) => setSize('height', v)} />
        <IconButton icon="sync" label="Rotate" onClick={() => onDevice(rotate(device))} />
        <span className="rv-divider" aria-hidden="true" />
        <Select
          size="sm"
          label="Zoom"
          className="rv-zoom"
          value={String(zoom)}
          options={ZOOMS}
          onChange={(value) => onZoom(value === 'fit' ? 'fit' : Number(value))}
        />
        <IconButton
          icon="settings"
          label="Network, CPU, color scheme and user agent"
          active={emulationActive}
          onClick={onEmulation}
        />
        <IconButton icon="close" label="Close the responsive view" onClick={onClose} />
      </div>
      <div className="rv-area" ref={area}>
        <div className="rv-stage">
          <div className="rv-frame">
            <div
              className="rv-screen"
              style={{ width: device.width * scale, height: device.height * scale }}
            >
              {src && (
                <iframe
                  ref={frameRef}
                  title={`${preset?.name ?? 'Custom size'} preview`}
                  src={src}
                  // No scripted top navigation: frame-busting scripts would end the view.
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals allow-downloads allow-top-navigation-by-user-activation"
                  style={{
                    width: device.width,
                    height: device.height,
                    transform: `scale(${scale})`,
                  }}
                />
              )}
            </div>
            {handle('x', 'Drag to change the width')}
            {handle('y', 'Drag to change the height')}
            {handle('xy', 'Drag to change the size')}
          </div>
          <div className="rv-caption">
            {preset?.name ?? 'Custom size'} · {device.width} × {device.height}
            {scale !== 1 && ` · ${Math.round(scale * 100)}%`}
          </div>
        </div>
      </div>
    </div>
  );
}

/** A width or height box: typing is free, the value is applied on Enter or when leaving it. */
function SizeField({
  label,
  value,
  onCommit,
  inputRef,
}: {
  label: string;
  value: number;
  onCommit: (value: string) => void;
  inputRef?: RefObject<HTMLInputElement | null>;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const justFocused = useRef(false);
  const commit = () => {
    if (draft !== null) onCommit(draft);
    setDraft(null);
  };
  return (
    <TextField
      size="sm"
      className="rv-size"
      ref={inputRef}
      aria-label={label}
      inputMode="numeric"
      value={draft ?? String(value)}
      onChange={(event) => setDraft(event.target.value.replace(/\D/g, ''))}
      // Typing replaces the size: focusing selects it, and the mouse-up of the click that
      // focused it would otherwise put the caret back.
      onFocus={(event) => {
        event.currentTarget.select();
        justFocused.current = true;
      }}
      onMouseUp={(event) => {
        if (justFocused.current) event.preventDefault();
        justFocused.current = false;
      }}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') commit();
        else if (event.key === 'Escape') setDraft(null);
      }}
    />
  );
}
