import { useEffect, useRef, useState } from 'react';
import { toHex, toHslText, type Rgba } from '@inkspect/shared/color';
import type { ViewportMapper } from '../components/Viewport';
import type { ShortcutHandlers } from '../shortcuts';
import { postToHost } from '../vscode';
import { ModeHint } from './ModeHint';

export type ColorFormat = 'hex' | 'rgb' | 'hsl';

const LOUPE_PIXELS = 11;
const LOUPE_ZOOM = 9;

function formatColor(color: Rgba, format: ColorFormat): string {
  if (format === 'rgb') return `rgb(${color.r} ${color.g} ${color.b})`;
  if (format === 'hsl') return toHslText(color);
  return toHex(color).toLowerCase();
}

/**
 * Eyedropper mode: a loupe follows the pointer over the page; a click copies the color under
 * it (hex, rgb() or hsl(), switched with the mode's keys). Colors come from the frame on screen.
 */
export function Eyedropper({
  mapper,
  onHandlers,
}: {
  mapper: ViewportMapper;
  onHandlers: (handlers: ShortcutHandlers) => void;
}) {
  const layer = useRef<HTMLDivElement>(null);
  const loupe = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<ColorFormat>('hex');
  const [hover, setHover] = useState<{ x: number; y: number; color: Rgba } | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    onHandlers({
      'eyedropper.hex': () => setFormat('hex'),
      'eyedropper.rgb': () => setFormat('rgb'),
      'eyedropper.hsl': () => setFormat('hsl'),
    });
  });

  /** The page frame canvas this overlay sits on. */
  const pageCanvas = () =>
    layer.current?.parentElement?.querySelector<HTMLCanvasElement>('.viewport-canvas') ?? null;

  const sample = (clientX: number, clientY: number) => {
    const canvas = pageCanvas();
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return undefined;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor(((clientX - rect.left) * canvas.width) / rect.width);
    const y = Math.floor(((clientY - rect.top) * canvas.height) / rect.height);
    if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) return undefined;
    const [r = 0, g = 0, b = 0] = context.getImageData(x, y, 1, 1).data;
    // The magnified loupe around the pixel.
    const view = loupe.current?.getContext('2d');
    if (view) {
      const half = Math.floor(LOUPE_PIXELS / 2);
      view.imageSmoothingEnabled = false;
      view.clearRect(0, 0, view.canvas.width, view.canvas.height);
      view.drawImage(
        canvas,
        x - half,
        y - half,
        LOUPE_PIXELS,
        LOUPE_PIXELS,
        0,
        0,
        view.canvas.width,
        view.canvas.height,
      );
    }
    return { r, g, b, a: 1 };
  };

  const local = (event: React.PointerEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const size = LOUPE_PIXELS * LOUPE_ZOOM;
  const text = hover && formatColor(hover.color, format);
  return (
    <div
      ref={layer}
      className="eyedropper-layer"
      style={mapper.bounds}
      onPointerMove={(event) => {
        const color = sample(event.clientX, event.clientY);
        setHover(color ? { ...local(event), color } : null);
      }}
      onPointerLeave={() => setHover(null)}
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        event.preventDefault();
        const color = sample(event.clientX, event.clientY);
        if (!color) return;
        const value = formatColor(color, format);
        setRecent((current) => [value, ...current.filter((c) => c !== value)].slice(0, 6));
        postToHost({
          type: 'copyText',
          text: value,
          toast: `Copied ${value}`,
          kind: 'color',
          label: `Color ${value}`,
        });
      }}
    >
      <div
        className="eyedropper-loupe"
        style={{
          left: (hover?.x ?? -999) + 18,
          top: (hover?.y ?? -999) + 18,
          visibility: hover ? 'visible' : 'hidden',
        }}
      >
        <canvas ref={loupe} width={size} height={size} />
        <span className="eyedropper-center" aria-hidden="true" />
        <div className="eyedropper-value">
          <span
            className="swatch small"
            style={{ background: hover ? toHex(hover.color) : 'transparent' }}
          />
          {text}
        </div>
      </div>
      <ModeHint
        scope="eyedropper"
        ids={['eyedropper.hex', 'eyedropper.rgb', 'eyedropper.hsl', 'eyedropper.exit']}
      >
        Click to copy a color ({format})
        {recent.length > 0 && (
          <span className="eyedropper-recent">
            {recent.map((color) => (
              <span
                key={color}
                className="swatch small"
                style={{ background: color }}
                title={color}
              />
            ))}
          </span>
        )}
      </ModeHint>
    </div>
  );
}
