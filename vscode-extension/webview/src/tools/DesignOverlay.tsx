import { useEffect, useState } from 'react';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Slider } from '@inkspect/shared/ui/Slider';
import type { ViewportMapper } from '../components/Viewport';
import type { ShortcutHandlers } from '../shortcuts';
import { withShortcut } from '../shortcuts';

/** A design image laid over a tab's page (document CSS pixels; one image pixel = one CSS pixel). */
export interface OverlayState {
  url: string;
  name: string;
  opacity: number;
  x: number;
  y: number;
  difference: boolean;
  hidden: boolean;
}

/**
 * The design overlay: the image, drawn over the page so it scrolls with it (the page stays
 * usable underneath), and a small bar with its controls.
 */
export function DesignOverlay({
  mapper,
  overlay,
  onChange,
  onOpen,
  onClose,
  onHandlers,
}: {
  mapper: ViewportMapper;
  overlay: OverlayState;
  onChange: (changes: Partial<OverlayState>) => void;
  onOpen: () => void;
  onClose: () => void;
  onHandlers: (handlers: ShortcutHandlers) => void;
}) {
  const [natural, setNatural] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const nudge = (dx: number, dy: number) => () =>
      onChange({ x: overlay.x + dx, y: overlay.y + dy });
    const opacity = (delta: number) => () =>
      onChange({
        opacity: Math.min(1, Math.max(0.05, Math.round((overlay.opacity + delta) * 20) / 20)),
      });
    onHandlers({
      'overlay.open': onOpen,
      'overlay.fainter': opacity(-0.1),
      'overlay.stronger': opacity(0.1),
      'overlay.left': nudge(-1, 0),
      'overlay.right': nudge(1, 0),
      'overlay.up': nudge(0, -1),
      'overlay.down': nudge(0, 1),
      'overlay.difference': () => onChange({ difference: !overlay.difference }),
      'overlay.hide': () => onChange({ hidden: !overlay.hidden }),
      'overlay.exit': onClose,
    });
  });

  const origin = mapper.toLocal(overlay.x - mapper.scroll.x, overlay.y - mapper.scroll.y);
  return (
    <>
      <div className="design-overlay" style={mapper.bounds} aria-hidden="true">
        {!overlay.hidden && (
          <img
            src={overlay.url}
            alt=""
            draggable={false}
            onLoad={(event) =>
              setNatural({
                width: event.currentTarget.naturalWidth,
                height: event.currentTarget.naturalHeight,
              })
            }
            style={{
              left: origin.x - mapper.bounds.left,
              top: origin.y - mapper.bounds.top,
              width: natural ? natural.width * mapper.scale : undefined,
              opacity: overlay.opacity,
              mixBlendMode: overlay.difference ? 'difference' : 'normal',
            }}
          />
        )}
      </div>
      <div className="design-bar" role="toolbar" aria-label="Design overlay">
        <span className="codicon codicon-layers" aria-hidden="true" />
        <span className="design-name" title={overlay.name}>
          {overlay.name}
        </span>
        <Slider
          label="Opacity"
          min={5}
          max={100}
          step={5}
          value={Math.round(overlay.opacity * 100)}
          format={(n) => `${n}%`}
          showValue
          onChange={(n) => onChange({ opacity: n / 100 })}
        />
        <span className="design-offset" title="Offset (Alt+arrows)">
          {overlay.x}, {overlay.y}
        </span>
        <IconButton
          icon="diff"
          label={withShortcut('Difference blend', 'overlay.difference')}
          className="small"
          active={overlay.difference}
          onClick={() => onChange({ difference: !overlay.difference })}
        />
        <IconButton
          icon={overlay.hidden ? 'eye-closed' : 'eye'}
          label={withShortcut(
            overlay.hidden ? 'Show the overlay' : 'Hide the overlay',
            'overlay.hide',
          )}
          className="small"
          onClick={() => onChange({ hidden: !overlay.hidden })}
        />
        <IconButton
          icon="folder-opened"
          label={withShortcut('Open another image', 'overlay.open')}
          className="small"
          onClick={onOpen}
        />
        <IconButton
          icon="close"
          label={withShortcut('Close the overlay', 'overlay.exit')}
          className="small"
          onClick={onClose}
        />
      </div>
    </>
  );
}
