import { useEffect, useRef, useState } from 'react';
import type { ShortcutMap } from '@inkspect/shared/shortcuts';
import { PickerHint } from '@inkspect/shared/ui/PickerHint';
import { accessibleInfo, firstChildElementOf, parentElementOf } from '@inkspect/shared/collect';
import { contrastRatio, parseColor, passesAA, toHex, type Rgba } from '@inkspect/shared/color';

export interface PickModifiers {
  /** Shift+click: add to the multi-selection. */
  add: boolean;
  /** Alt+click: a screenshot of the element. */
  screenshot: boolean;
  /** Ctrl+click: the chat agent; Ctrl+Shift+click: a terminal agent (Cmd on macOS). */
  send?: 'chat' | 'terminal';
}

interface InspectorProps {
  host: HTMLElement;
  purpose: 'copy' | 'screenshot';
  /** Elements in the Shift+click multi-selection (numbered boxes). */
  selection: Element[];
  onPick: (element: Element, modifiers: PickModifiers) => void;
  /** Enter: copy the multi-selection (or the element under the pointer). */
  onCommit: (element: Element | null) => void;
  onExit: () => void;
  /**
   * The `inspect.*` action a key press is (from the shared, remappable shortcuts), if any.
   * Without it the default keys apply.
   */
  actionOf?: (event: KeyboardEvent) => string | undefined;
  /** The current keys, for the hint (remapped keys show). */
  map: ShortcutMap;
}

const DEFAULT_KEYS: Record<string, string> = {
  Escape: 'inspect.exit',
  ArrowUp: 'inspect.parent',
  ArrowDown: 'inspect.child',
  Enter: 'inspect.copy',
};

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

const px = (value: string) => parseFloat(value) || 0;

/** Margin, border, padding and content boxes of an element (viewport coordinates). */
function boxModel(el: Element): { margin: Box; border: Box; padding: Box; content: Box } {
  const rect = el.getBoundingClientRect();
  const s = getComputedStyle(el);
  const border: Box = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
  const margin: Box = {
    x: border.x - px(s.marginLeft),
    y: border.y - px(s.marginTop),
    width: border.width + px(s.marginLeft) + px(s.marginRight),
    height: border.height + px(s.marginTop) + px(s.marginBottom),
  };
  const padding: Box = {
    x: border.x + px(s.borderLeftWidth),
    y: border.y + px(s.borderTopWidth),
    width: border.width - px(s.borderLeftWidth) - px(s.borderRightWidth),
    height: border.height - px(s.borderTopWidth) - px(s.borderBottomWidth),
  };
  const content: Box = {
    x: padding.x + px(s.paddingLeft),
    y: padding.y + px(s.paddingTop),
    width: padding.width - px(s.paddingLeft) - px(s.paddingRight),
    height: padding.height - px(s.paddingTop) - px(s.paddingBottom),
  };
  return { margin, border, padding, content };
}

/** The color behind an element's text: the nearest opaque background, white by default. */
function backgroundBehind(el: Element): Rgba {
  let color: Rgba = { r: 255, g: 255, b: 255, a: 1 };
  const layers: Rgba[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    const bg = parseColor(getComputedStyle(node).backgroundColor);
    if (bg && bg.a > 0) {
      layers.push(bg);
      if (bg.a >= 1) break;
    }
  }
  for (const layer of layers.reverse()) {
    color = {
      r: layer.r * layer.a + color.r * (1 - layer.a),
      g: layer.g * layer.a + color.g * (1 - layer.a),
      b: layer.b * layer.a + color.b * (1 - layer.a),
      a: 1,
    };
  }
  return color;
}

function isFocusable(el: Element): boolean {
  const html = el as HTMLElement;
  if ((html as HTMLButtonElement).disabled) return false;
  if (html.tabIndex >= 0) return true;
  return false;
}

const joinSides = (s: CSSStyleDeclaration, prop: 'margin' | 'padding') => {
  const sides = ['Top', 'Right', 'Bottom', 'Left'].map((side) =>
    s.getPropertyValue(`${prop}-${side.toLowerCase()}`),
  );
  if (sides.every((v) => v === sides[0])) return sides[0]!;
  if (sides[0] === sides[2] && sides[1] === sides[3]) return `${sides[0]} ${sides[1]}`;
  return sides.join(' ');
};

/** What Chrome's inspect tooltip shows. */
function tooltipInfo(el: Element) {
  const s = getComputedStyle(el);
  const rect = el.getBoundingClientRect();
  const color = parseColor(s.color);
  const background = parseColor(s.backgroundColor);
  const behind = backgroundBehind(el);
  const hasText = !!(el as HTMLElement).innerText?.trim();
  const ratio = color && hasText ? contrastRatio(color, behind) : undefined;
  const { role, name } = accessibleInfo(el);
  const margin = joinSides(s, 'margin');
  const padding = joinSides(s, 'padding');
  return {
    tag: el.tagName.toLowerCase(),
    id: el.id,
    classes: Array.from(el.classList).slice(0, 4),
    size: `${Math.round(rect.width * 100) / 100} × ${Math.round(rect.height * 100) / 100}`,
    color: hasText && color ? toHex(color) : undefined,
    font: hasText ? `${s.fontSize} ${s.fontFamily.split(',')[0]!.replace(/["']/g, '')}` : undefined,
    background: background && background.a > 0 ? toHex(background) : undefined,
    margin: margin !== '0px' ? margin : undefined,
    padding: padding !== '0px' ? padding : undefined,
    ratio,
    ratioPasses:
      ratio !== undefined
        ? passesAA(ratio, px(s.fontSize), Number(s.fontWeight) || 400)
        : undefined,
    role,
    name,
    focusable: isFocusable(el),
    rect,
  };
}

/** Chrome-style element picker: highlight and tooltip under the pointer. */
export function Inspector({
  host,
  purpose,
  selection,
  onPick,
  onCommit,
  onExit,
  actionOf,
  map,
}: InspectorProps) {
  const [target, setTarget] = useState<Element | null>(null);
  const [, setTick] = useState(0);
  const targetRef = useRef<Element | null>(null);
  const handlers = useRef({ onPick, onCommit, onExit, actionOf });

  useEffect(() => {
    handlers.current = { onPick, onCommit, onExit, actionOf };
  });

  useEffect(() => {
    const ours = (event: Event) => event.composedPath().includes(host);
    const at = (x: number, y: number) =>
      document.elementsFromPoint(x, y).find((el) => el !== host && !host.contains(el)) ?? null;
    const setCurrent = (el: Element | null) => {
      targetRef.current = el;
      setTarget(el);
    };
    const onMove = (event: MouseEvent) => {
      if (ours(event)) return;
      const el = at(event.clientX, event.clientY);
      if (el !== targetRef.current) setCurrent(el);
    };
    const block = (event: Event) => {
      if (ours(event)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const onClick = (event: MouseEvent) => {
      if (ours(event)) return;
      block(event);
      const el = at(event.clientX, event.clientY) ?? targetRef.current;
      if (el) {
        const send = event.ctrlKey || event.metaKey;
        handlers.current.onPick(el, {
          add: event.shiftKey && !send,
          screenshot: event.altKey,
          send: send ? (event.shiftKey ? 'terminal' : 'chat') : undefined,
        });
      }
    };
    const onKey = (event: KeyboardEvent) => {
      const action = handlers.current.actionOf
        ? handlers.current.actionOf(event)
        : DEFAULT_KEYS[event.key];
      // Keys typed in the toolbar are its own, except the exit key: focus stays on the picker's
      // button after clicking it, and that key must still leave the picker.
      if (ours(event) && action !== 'inspect.exit') return;
      const current = targetRef.current;
      if (action === 'inspect.exit') handlers.current.onExit();
      else if (action === 'inspect.parent' && current)
        setCurrent(parentElementOf(current) ?? current);
      else if (action === 'inspect.child' && current)
        setCurrent(firstChildElementOf(current) ?? current);
      else if (action === 'inspect.copy') handlers.current.onCommit(current);
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    const redraw = () => setTick((t) => t + 1);
    const blocked = [
      'mousedown',
      'mouseup',
      'pointerdown',
      'pointerup',
      'dblclick',
      'auxclick',
      'contextmenu',
    ];
    window.addEventListener('mousemove', onMove, true);
    window.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('scroll', redraw, true);
    window.addEventListener('resize', redraw);
    for (const type of blocked) window.addEventListener(type, block, true);
    return () => {
      window.removeEventListener('mousemove', onMove, true);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKey, true);
      window.removeEventListener('scroll', redraw, true);
      window.removeEventListener('resize', redraw);
      for (const type of blocked) window.removeEventListener(type, block, true);
    };
  }, [host]);

  const info = target?.isConnected ? tooltipInfo(target) : undefined;
  const boxes = target?.isConnected ? boxModel(target) : undefined;
  const style = (b: Box) => ({
    left: b.x,
    top: b.y,
    width: Math.max(0, b.width),
    height: Math.max(0, b.height),
  });

  // Below the element if there is room, else above; kept inside the viewport.
  const TIP_WIDTH = 250;
  const tipTop = info
    ? info.rect.bottom + 8 + 220 < innerHeight
      ? info.rect.bottom + 8
      : Math.max(4, info.rect.top - 8 - 220)
    : 0;
  const tipLeft = info ? Math.max(4, Math.min(info.rect.left, innerWidth - TIP_WIDTH - 8)) : 0;

  return (
    <div className="inspector">
      <PickerHint className="inspect-hint" purpose={purpose} map={map} altLabel="screenshot" />
      {boxes && (
        <>
          <div className="hl hl-margin" style={style(boxes.margin)} />
          <div className="hl hl-border" style={style(boxes.border)} />
          <div className="hl hl-padding" style={style(boxes.padding)} />
          <div className="hl hl-content" style={style(boxes.content)} />
          {/* A crisp edge, so the element stands out on any page (fills alone wash out on dark ones). */}
          <div className="hl hl-outline" style={style(boxes.border)} />
        </>
      )}
      {selection.map((el, index) => {
        const rect = el.getBoundingClientRect();
        return (
          <div key={index} className="selection-box" style={style(rect)}>
            <span className="selection-badge">{index + 1}</span>
          </div>
        );
      })}
      {info && (
        <div className="tip" style={{ left: tipLeft, top: tipTop, width: TIP_WIDTH }}>
          <div className="tip-head">
            <span>
              <span className="tip-tag">{info.tag}</span>
              {info.id && <span className="tip-id">#{info.id}</span>}
              {info.classes.map((c) => (
                <span key={c} className="tip-class">
                  .{c}
                </span>
              ))}
            </span>
            <span className="tip-size">{info.size}</span>
          </div>
          {info.color && <Row label="Color" value={info.color} swatch={info.color} />}
          {info.font && <Row label="Font" value={info.font} />}
          {info.background && (
            <Row label="Background" value={info.background} swatch={info.background} />
          )}
          {info.margin && <Row label="Margin" value={info.margin} />}
          {info.padding && <Row label="Padding" value={info.padding} />}
          <div className="tip-section">Accessibility</div>
          {info.ratio !== undefined && (
            <div className="tip-row">
              <span>Contrast</span>
              <span>
                <span className="tip-aa" style={{ color: info.color, background: info.background }}>
                  Aa
                </span>{' '}
                {info.ratio.toFixed(2)}{' '}
                <span className={info.ratioPasses ? 'ok' : 'bad'}>
                  {info.ratioPasses ? '✓' : '!'}
                </span>
              </span>
            </div>
          )}
          <Row label="Name" value={info.name ?? ''} />
          <Row label="Role" value={info.role ?? 'generic'} />
          <div className="tip-row">
            <span>Keyboard-focusable</span>
            <span className={info.focusable ? 'ok' : 'muted'}>{info.focusable ? '✓' : '⊘'}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, swatch }: { label: string; value: string; swatch?: string }) {
  return (
    <div className="tip-row">
      <span>{label}</span>
      <span className="tip-value">
        {swatch && <span className="tip-swatch" style={{ background: swatch }} />}
        {value}
      </span>
    </div>
  );
}
