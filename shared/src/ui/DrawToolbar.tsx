import { COLORS, type DrawTool, type ShapeStyle } from '../annotations';
import type { MenuItem } from './Menu';
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
}

/** Tools, colours and stroke options for drawing on the page. */
export function DrawToolbar(props: DrawToolbarProps) {
  const { tool, style } = props;
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
              title={key ? `${label} (${key})` : label}
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
        <label className="swatch custom-color" title="Custom colour">
          <input
            type="color"
            value={style.color}
            aria-label="Custom colour"
            onChange={(event) => props.onStyle({ color: event.target.value })}
          />
        </label>
      </div>
      <div className="draw-group">
        <label className="draw-range" title="Width">
          <span className="codicon codicon-circle-small-filled" aria-hidden="true" />
          <input
            type="range"
            min={1}
            max={24}
            value={style.width}
            aria-label="Width"
            onChange={(event) => props.onStyle({ width: Number(event.target.value) })}
          />
        </label>
        <label className="draw-range" title="Opacity">
          <span className="codicon codicon-color-mode" aria-hidden="true" />
          <input
            type="range"
            min={10}
            max={100}
            value={Math.round(style.opacity * 100)}
            aria-label="Opacity"
            onChange={(event) => props.onStyle({ opacity: Number(event.target.value) / 100 })}
          />
        </label>
        <select
          value={style.dash}
          aria-label="Line style"
          title="Line style"
          onChange={(event) => props.onStyle({ dash: event.target.value as ShapeStyle['dash'] })}
        >
          <option value="solid">Solid</option>
          <option value="dashed">Dashed</option>
          <option value="dotted">Dotted</option>
        </select>
        <button
          type="button"
          className={`icon-button${style.fill ? ' active' : ''}`}
          title="Fill shapes"
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
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
          disabled={!props.canUndo}
          onClick={props.onUndo}
        >
          <span className="codicon codicon-discard" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title="Redo (Ctrl+Y)"
          aria-label="Redo"
          disabled={!props.canRedo}
          onClick={props.onRedo}
        >
          <span className="codicon codicon-redo" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="icon-button"
          title="Clear all drawings"
          aria-label="Clear all drawings"
          disabled={!props.hasShapes}
          onClick={props.onClear}
        >
          <span className="codicon codicon-clear-all" aria-hidden="true" />
        </button>
        <button
          type="button"
          className={`icon-button${props.visible ? '' : ' active'}`}
          title={props.visible ? 'Hide drawings' : 'Show drawings'}
          aria-label={props.visible ? 'Hide drawings' : 'Show drawings'}
          onClick={props.onToggleVisible}
        >
          <span
            className={`codicon codicon-${props.visible ? 'eye' : 'eye-closed'}`}
            aria-hidden="true"
          />
        </button>
      </div>
      <button
        type="button"
        className="button primary small draw-capture"
        disabled={!props.hasShapes}
        title="Screenshot of the area around the drawings"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          props.onCapture(rect.left, rect.bottom + 2);
        }}
      >
        <span className="codicon codicon-device-camera" aria-hidden="true" /> Screenshot
      </button>
      <button
        type="button"
        className="icon-button draw-close"
        title="Stop drawing (Esc)"
        aria-label="Stop drawing"
        onClick={props.onClose}
      >
        <span className="codicon codicon-close" aria-hidden="true" />
      </button>
    </div>
  );
}

/** The drawing toolbar's screenshot menu. */
export function captureMenu(capture: (mode: CaptureMode) => void): MenuItem[] {
  return [
    { label: 'Drawing area', icon: 'device-camera', onSelect: () => capture('area') },
    { label: 'Each drawing separately', icon: 'layers', onSelect: () => capture('groups') },
    {
      label: 'Drawing area without drawings',
      icon: 'eye-closed',
      onSelect: () => capture('clean'),
    },
    { separator: true },
    {
      label: 'Visible area with drawings',
      icon: 'screen-normal',
      onSelect: () => capture('viewport'),
    },
    { label: 'Full page with drawings', icon: 'file-media', onSelect: () => capture('fullPage') },
  ];
}

export type CaptureMode = 'area' | 'groups' | 'clean' | 'viewport' | 'fullPage';
