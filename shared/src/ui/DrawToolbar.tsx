import { COLORS, type DrawTool, type ShapeStyle } from '../annotations';
import { Button } from './Button';
import { ColorPicker } from './ColorPicker';
import type { MenuItem } from './Menu';
import { Select, type SelectOption } from './Select';
import { Slider } from './Slider';
import { ToolIcon } from './icons';

const TOOL_GROUPS: { tool: DrawTool; label: string; key?: string }[][] = [
  [{ tool: 'select', label: 'Select and move', key: 'V' }],
  [
    { tool: 'pen', label: 'Pen', key: 'P' },
    { tool: 'pencil', label: 'Pencil' },
    { tool: 'marker', label: 'Marker', key: 'M' },
    { tool: 'brush', label: 'Brush' },
    { tool: 'highlighter', label: 'Highlighter', key: 'H' },
    { tool: 'neon', label: 'Neon' },
  ],
  [
    { tool: 'line', label: 'Line', key: 'L' },
    { tool: 'arrow', label: 'Arrow', key: 'A' },
    { tool: 'doubleArrow', label: 'Double arrow' },
    { tool: 'rect', label: 'Rectangle', key: 'R' },
    { tool: 'ellipse', label: 'Ellipse', key: 'O' },
  ],
  [
    { tool: 'text', label: 'Text', key: 'T' },
    { tool: 'callout', label: 'Numbered callout', key: 'N' },
    { tool: 'blur', label: 'Redact (pixelate)', key: 'B' },
    { tool: 'eraser', label: 'Eraser', key: 'E' },
  ],
];

const DASH_OPTIONS: SelectOption<ShapeStyle['dash']>[] = [
  { value: 'solid', label: 'Solid' },
  { value: 'dashed', label: 'Dashed' },
  { value: 'dotted', label: 'Dotted' },
];

/** Single-key shortcuts for the tools (while drawing and not typing). */
export const TOOL_KEYS: Record<string, DrawTool> = Object.fromEntries(
  TOOL_GROUPS.flat()
    .filter((t) => t.key)
    .map((t) => [t.key!.toLowerCase(), t.tool]),
);

interface DrawToolbarProps {
  tool: DrawTool;
  style: ShapeStyle;
  recentColors: string[];
  canUndo: boolean;
  canRedo: boolean;
  hasShapes: boolean;
  visible: boolean;
  onTool: (tool: DrawTool) => void;
  onStyle: (style: Partial<ShapeStyle>) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onToggleVisible: () => void;
  onCapture: (x: number, y: number) => void;
  onClose: () => void;
  /** The current key of a shortcut id (`draw.pen`, `draw.undo`...), when keys can be remapped. */
  keyOf?: (id: string) => string | undefined;
}

/** Tools, colours and stroke options for drawing on the page. */
export function DrawToolbar(props: DrawToolbarProps) {
  const { tool, style } = props;
  const titled = (label: string, id: string, fallback?: string) => {
    const key = props.keyOf ? props.keyOf(id) : fallback;
    return key ? `${label} (${key})` : label;
  };
  const colors = [
    ...COLORS,
    ...props.recentColors.filter((c) => !(COLORS as readonly string[]).includes(c)),
  ];
  return (
    <div className="draw-toolbar" role="toolbar" aria-label="Drawing tools">
      {TOOL_GROUPS.map((group, index) => (
        <div key={index} className="draw-group">
          {group.map(({ tool: t, label, key }) => (
            <button
              key={t}
              type="button"
              className={`icon-button${tool === t ? ' active' : ''}`}
              title={titled(label, `draw.${t}`, key)}
              aria-label={label}
              aria-pressed={tool === t}
              onClick={() => props.onTool(t)}
            >
              <ToolIcon tool={t} />
            </button>
          ))}
        </div>
      ))}
      <div className="draw-group colors" role="radiogroup" aria-label="Colour">
        {colors.slice(0, 13).map((color) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={style.color === color}
            aria-label={color}
            title={color}
            className={`swatch${style.color === color ? ' active' : ''}`}
            style={{ background: color }}
            onClick={() => props.onStyle({ color })}
          />
        ))}
        <ColorPicker
          value={style.color}
          label="Custom colour"
          presets={COLORS}
          onChange={(color) => props.onStyle({ color })}
        />
      </div>
      <div className="draw-group">
        <Slider
          icon="circle-small-filled"
          label="Width"
          min={1}
          max={24}
          value={style.width}
          format={(n) => `${n}px`}
          onChange={(width) => props.onStyle({ width })}
        />
        <Slider
          icon="color-mode"
          label="Opacity"
          min={10}
          max={100}
          step={5}
          value={Math.round(style.opacity * 100)}
          format={(n) => `${n}%`}
          onChange={(opacity) => props.onStyle({ opacity: opacity / 100 })}
        />
        <Select
          size="sm"
          appearance="quiet"
          label="Line style"
          value={style.dash}
          options={DASH_OPTIONS}
          onChange={(dash) => props.onStyle({ dash })}
        />
        <button
          type="button"
          className={`icon-button${style.fill ? ' active' : ''}`}
          title={titled('Fill shapes', 'draw.fill')}
          aria-label="Fill shapes"
          aria-pressed={style.fill}
          onClick={() => props.onStyle({ fill: !style.fill })}
        >
          <span className="codicon codicon-circle-filled" aria-hidden="true" />
        </button>
      </div>
      <div className="draw-group">
        <button
          type="button"
          className="icon-button"
          title={titled('Undo', 'draw.undo', 'Ctrl+Z')}
          aria-label="Undo"
          disabled={!props.canUndo}
          onClick={props.onUndo}
        >
          <span className="codicon codicon-discard" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title={titled('Redo', 'draw.redo', 'Ctrl+Y')}
          aria-label="Redo"
          disabled={!props.canRedo}
          onClick={props.onRedo}
        >
          <span className="codicon codicon-redo" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title={titled('Clear all drawings', 'draw.clear')}
          aria-label="Clear all drawings"
          disabled={!props.hasShapes}
          onClick={props.onClear}
        >
          <span className="codicon codicon-clear-all" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`icon-button${props.visible ? '' : ' active'}`}
          title={titled(props.visible ? 'Hide drawings' : 'Show drawings', 'draw.visible')}
          aria-label={props.visible ? 'Hide drawings' : 'Show drawings'}
          onClick={props.onToggleVisible}
        >
          <span
            className={`codicon codicon-${props.visible ? 'eye' : 'eye-closed'}`}
            aria-hidden="true"
          />
        </button>
      </div>
      <Button
        variant="primary"
        size="sm"
        icon="device-camera"
        iconEnd="chevron-down"
        className="draw-capture"
        disabled={!props.hasShapes}
        title={titled('Screenshot menu', 'draw.captureMenu')}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          props.onCapture(rect.left, rect.bottom + 2);
        }}
      >
        Screenshot
      </Button>
      <button
        type="button"
        className="icon-button draw-close"
        title={titled('Stop drawing', 'draw.exit', 'Esc')}
        aria-label="Stop drawing"
        onClick={props.onClose}
      >
        <span className="codicon codicon-close" aria-hidden="true" />
      </button>
    </div>
  );
}

/** The drawing toolbar's screenshot menu. */
/** The shortcut action of each Screenshot menu item (see `SHORTCUT_ACTIONS`). */
export const CAPTURE_ACTIONS: Record<CaptureMode, string> = {
  area: 'draw.capture',
  groups: 'draw.captureGroups',
  clean: 'draw.captureClean',
  viewport: 'draw.captureViewport',
  fullPage: 'draw.captureFullPage',
};

/**
 * The drawing toolbar's Screenshot menu. `keyOf` gives each item's shortcut label (remapped keys
 * included), shown next to it.
 */
export function captureMenu(
  capture: (mode: CaptureMode) => void,
  keyOf?: (actionId: string) => string | undefined,
): MenuItem[] {
  const item = (mode: CaptureMode, label: string, icon: string): MenuItem => ({
    label,
    icon,
    shortcut: keyOf?.(CAPTURE_ACTIONS[mode]),
    onSelect: () => capture(mode),
  });
  return [
    item('area', 'Drawing area', 'device-camera'),
    item('groups', 'Each drawing separately', 'layers'),
    item('clean', 'Drawing area without drawings', 'eye-closed'),
    { separator: true },
    item('viewport', 'Visible area with drawings', 'screen-normal'),
    item('fullPage', 'Full page with drawings', 'file-media'),
  ];
}

export type CaptureMode = 'area' | 'groups' | 'clean' | 'viewport' | 'fullPage';
