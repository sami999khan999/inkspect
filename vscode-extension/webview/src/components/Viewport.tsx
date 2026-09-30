import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  displayScale,
  DEVICE_MARGIN,
  MAX_DEVICE_SIZE,
  MIN_DEVICE_SIZE,
  RESPONSIVE_ID,
  RESPONSIVE_BREAKPOINTS,
} from '@shared/devices';
import type {
  FrameMetadata,
  InputEvent,
  InspectPurpose,
  MouseButton,
  MouseInput,
  TabState,
} from '@shared/protocol';
import { isEditingCombo, keyInput, modifiersOf } from '../keyboard';
import { endsShortcut } from '../shortcuts';
import { onHostMessage, postToHost } from '../vscode';

const BUTTONS: MouseButton[] = ['left', 'middle', 'right', 'back', 'forward'];
const DOUBLE_CLICK_MS = 500;
const DOUBLE_CLICK_DISTANCE = 5;

/** The button reported with mouse moves while buttons are held (for drags). */
function heldButton(buttons: number): MouseButton {
  if (buttons & 1) return 'left';
  if (buttons & 4) return 'middle';
  if (buttons & 2) return 'right';
  return 'none';
}

/** What pointer input on the page does. */
export type ViewportMode =
  | { kind: 'browse' }
  | { kind: 'inspect'; purpose: InspectPurpose }
  /** An overlay (region selection, drawing) handles the pointer itself. */
  | { kind: 'overlay' };

/** Converts between page coordinates and positions inside the viewport, for overlays. */
export interface ViewportMapper {
  /** Viewport CSS pixels of the page → position in the viewport element. */
  toLocal(x: number, y: number): { x: number; y: number };
  /** Position in the viewport element → viewport CSS pixels of the page. */
  toPage(x: number, y: number): { x: number; y: number };
  /** Screen pixels per page CSS pixel. */
  scale: number;
  /** The page's scroll position (document CSS pixels) in the frame on screen. */
  scroll: { x: number; y: number };
  /** Where the page image is inside the viewport element. */
  bounds: { left: number; top: number; width: number; height: number };
}

interface ViewportProps {
  tab: TabState;
  mode: ViewportMode;
  /** Overlays drawn over the page (inspector card, region selection, drawings). */
  renderOverlay?: (mapper: ViewportMapper) => ReactNode;
  /** Hidden while an internal page covers it; it keeps reporting its size. */
  hidden: boolean;
  /** Incremented to move keyboard focus into the page. */
  focusSignal: number;
  /** Where the last right-click happened: client position (for the menu) and page position. */
  onContextPoint: (x: number, y: number, pageX: number, pageY: number) => void;
  /** Reports the size of the page area (for the device toolbar). */
  onSize: (size: { width: number; height: number }) => void;
  /**
   * Whether this viewport's size is the browser window's page size (sent to the host). False for
   * extension popups, which have their own size.
   */
  reportSize?: boolean;
  /** Space kept free at the bottom (the developer drawer). */
  bottomInset?: number;
  /** Dragging a resize handle of a responsive screen (emulated CSS pixels). */
  onResizeDevice?: (size: { width: number; height: number }) => void;
}

interface Geometry {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Page width in CSS pixels shown across the canvas. */
  pageWidth: number;
  scrollX: number;
  scrollY: number;
}

function makeMapper(geometry: Geometry): ViewportMapper {
  const { left, top, width, height, pageWidth } = geometry;
  const factor = width / pageWidth;
  return {
    toLocal: (x, y) => ({ x: left + x * factor, y: top + y * factor }),
    toPage: (x, y) => ({ x: (x - left) / factor, y: (y - top) / factor }),
    scale: factor,
    scroll: { x: geometry.scrollX, y: geometry.scrollY },
    bounds: { left, top, width, height },
  };
}

/**
 * Shows the page: draws the JPEG frames Chromium streams onto a canvas and sends mouse,
 * wheel and keyboard input back. A hidden textarea receives keyboard focus and IME input.
 */
export function Viewport({
  tab,
  mode,
  renderOverlay,
  hidden,
  focusSignal,
  onContextPoint,
  onSize,
  reportSize = true,
  bottomInset = 0,
  onResizeDevice,
}: ViewportProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const tabRef = useRef(tab);
  const onSizeRef = useRef(onSize);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const metadataRef = useRef<FrameMetadata | null>(null);
  const clickRef = useRef({ time: 0, x: 0, y: 0, button: -1, count: 0 });
  const pendingMoveRef = useRef<MouseInput | null>(null);
  const pendingWheelRef = useRef<{
    x: number;
    y: number;
    dx: number;
    dy: number;
    modifiers: number;
  } | null>(null);
  const frameRequestRef = useRef(0);
  const composingRef = useRef(false);
  const [size, setSize] = useState({ width: 0, height: 0, dpr: window.devicePixelRatio || 1 });
  const modeRef = useRef(mode);
  const overlayRef = useRef(false);
  const reportSizeRef = useRef(reportSize);
  /** Where the page image is and how it maps to page pixels; drives the overlays. */
  const [geometry, setGeometry] = useState<Geometry | null>(null);

  // In device mode the page is an emulated screen shown at a scale; otherwise it fills the area.
  const device = tab.emulation.enabled ? tab.emulation.device : undefined;
  const scale = device
    ? displayScale(tab.emulation.scale, device, {
        width: size.width - DEVICE_MARGIN * 2,
        height: size.height - DEVICE_MARGIN * 2,
      })
    : 1;
  /** Screen size while a resize handle is dragged (the page catches up as the host applies it). */
  const [dragSize, setDragSize] = useState<{ width: number; height: number } | null>(null);
  const shownDevice = device && dragSize ? { ...device, ...dragSize } : device;
  const cssWidth = shownDevice ? Math.round(shownDevice.width * scale) : size.width;
  const cssHeight = shownDevice ? Math.round(shownDevice.height * scale) : size.height;
  const resizable =
    !!device && !!onResizeDevice && (!device.presetId || device.presetId === RESPONSIVE_ID);

  /** Drags the right edge, bottom edge or corner of the screen, like Chrome's responsive mode. */
  const startResize = (event: React.PointerEvent<HTMLElement>, edges: 'x' | 'y' | 'xy') => {
    if (!device || event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    const handle = event.currentTarget;
    handle.setPointerCapture(event.pointerId);
    const start = {
      x: event.clientX,
      y: event.clientY,
      width: device.width,
      height: device.height,
    };
    const startScale = scale;
    let latest = { width: device.width, height: device.height };
    let frame = 0;
    const clampSize = (value: number) =>
      Math.round(Math.min(MAX_DEVICE_SIZE, Math.max(MIN_DEVICE_SIZE, value)));
    const move = (e: PointerEvent) => {
      // The screen is centered, so an edge moves half as far as its size changes: double it.
      latest = {
        width: edges.includes('x')
          ? clampSize(start.width + ((e.clientX - start.x) * 2) / startScale)
          : start.width,
        height: edges.includes('y')
          ? clampSize(start.height + ((e.clientY - start.y) * 2) / startScale)
          : start.height,
      };
      setDragSize(latest);
      if (!frame) {
        frame = requestAnimationFrame(() => {
          frame = 0;
          onResizeDevice?.(latest);
        });
      }
    };
    const up = () => {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      cancelAnimationFrame(frame);
      onResizeDevice?.(latest);
      setDragSize(null);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  };

  useLayoutEffect(() => {
    tabRef.current = tab;
    onSizeRef.current = onSize;
    modeRef.current = mode;
    overlayRef.current = !!renderOverlay;
    reportSizeRef.current = reportSize;
  });

  /** Reads the canvas layout and the latest frame's metadata into `geometry` (if changed). */
  const measure = () => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.clientWidth) return;
    const metadata = metadataRef.current;
    // Overlays are positioned in the (scrollable) viewport, so measure against it rather than
    // the canvas's offset parent (the device screen wrapper).
    const container = containerRef.current!;
    const rect = canvas.getBoundingClientRect();
    const box = container.getBoundingClientRect();
    const next: Geometry = {
      left: Math.round(rect.left - box.left - container.clientLeft + container.scrollLeft),
      top: Math.round(rect.top - box.top - container.clientTop + container.scrollTop),
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      pageWidth: metadata?.deviceWidth ?? canvas.clientWidth / tabRef.current.zoom,
      scrollX: metadata?.scrollOffsetX ?? 0,
      scrollY: metadata?.scrollOffsetY ?? 0,
    };
    setGeometry((previous) =>
      previous && (Object.keys(next) as (keyof Geometry)[]).every((k) => previous[k] === next[k])
        ? previous
        : next,
    );
  };

  // Overlays need fresh geometry after every layout change.
  useLayoutEffect(() => {
    if (renderOverlay) measure();
  });

  const send = (event: InputEvent) =>
    postToHost({ type: 'input', tabId: tabRef.current.id, event });

  const draw = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;
    const bitmap = bitmapRef.current;
    if (bitmap) {
      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    } else {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  /** Converts a point in the webview to page CSS pixels. */
  const toPage = (clientX: number, clientY: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    const metadata = metadataRef.current;
    const zoom = tabRef.current.zoom;
    const scaleX = metadata && rect.width ? metadata.deviceWidth / rect.width : 1 / zoom;
    const scaleY = metadata && rect.height ? metadata.deviceHeight / rect.height : 1 / zoom;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const flushPending = () => {
    cancelAnimationFrame(frameRequestRef.current);
    frameRequestRef.current = 0;
    if (pendingMoveRef.current) {
      send(pendingMoveRef.current);
      pendingMoveRef.current = null;
    }
    const wheel = pendingWheelRef.current;
    if (wheel) {
      send({
        kind: 'wheel',
        x: wheel.x,
        y: wheel.y,
        deltaX: wheel.dx,
        deltaY: wheel.dy,
        modifiers: wheel.modifiers,
      });
      pendingWheelRef.current = null;
    }
  };

  const scheduleFlush = () => {
    if (!frameRequestRef.current) frameRequestRef.current = requestAnimationFrame(flushPending);
  };

  // Report the viewport size (and keep the canvas at device-pixel resolution).
  useEffect(() => {
    const container = containerRef.current!;
    let last = '';
    const report = () => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      const dpr = window.devicePixelRatio || 1;
      if (!width || !height) return;
      const key = `${width}x${height}@${dpr}`;
      if (key === last) return;
      last = key;
      setSize({ width, height, dpr });
      onSizeRef.current({ width, height });
      if (reportSizeRef.current) postToHost({ type: 'viewport', width, height, dpr });
    };
    const observer = new ResizeObserver(report);
    observer.observe(container);
    window.addEventListener('resize', report);
    report();
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', report);
    };
  }, []);

  // Keep the canvas at device-pixel resolution for its displayed size.
  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !cssWidth || !cssHeight) return;
    const pixelWidth = Math.round(cssWidth * size.dpr);
    const pixelHeight = Math.round(cssHeight * size.dpr);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
      draw();
    }
  }, [cssWidth, cssHeight, size.dpr]);

  // Frames and cursor changes from the host.
  useEffect(() => {
    return onHostMessage((message) => {
      if (message.type === 'frame') {
        const ack = () => postToHost({ type: 'frameAck', tabId: message.tabId });
        if (message.tabId !== tabRef.current.id) {
          ack();
          return;
        }
        createImageBitmap(
          new Blob([message.data as Uint8Array<ArrayBuffer>], { type: 'image/jpeg' }),
        )
          .then((bitmap) => {
            if (message.tabId !== tabRef.current.id) {
              bitmap.close();
              return;
            }
            bitmapRef.current?.close();
            bitmapRef.current = bitmap;
            metadataRef.current = message.metadata;
            draw();
            if (overlayRef.current) measure();
          })
          .catch(() => {
            // A corrupt frame; the next one replaces it.
          })
          .finally(ack);
      } else if (message.type === 'cursor' && message.tabId === tabRef.current.id) {
        if (canvasRef.current) canvasRef.current.style.cursor = message.cursor;
      }
    });
  }, []);

  // A different tab: drop the old tab's frame.
  useEffect(() => {
    bitmapRef.current?.close();
    bitmapRef.current = null;
    metadataRef.current = null;
    if (canvasRef.current) canvasRef.current.style.cursor = 'default';
    draw();
  }, [tab.id]);

  useEffect(() => {
    if (focusSignal) inputRef.current?.focus({ preventScroll: true });
  }, [focusSignal]);

  // Wheel events need a non-passive listener to stop VS Code from scrolling the webview. It is
  // on the container so the page also scrolls under overlays (drawing, region selection).
  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const scale = event.deltaMode === 1 ? 40 : event.deltaMode === 2 ? canvas.clientHeight : 1;
      const { x, y } = toPage(event.clientX, event.clientY);
      const pending = pendingWheelRef.current;
      pendingWheelRef.current = {
        x,
        y,
        dx: (pending?.dx ?? 0) + event.deltaX * scale,
        dy: (pending?.dy ?? 0) + event.deltaY * scale,
        modifiers: modifiersOf(event),
      };
      scheduleFlush();
    };
    container.addEventListener('wheel', onWheel, { passive: false });
    return () => container.removeEventListener('wheel', onWheel);
    // The helpers only read refs, so registering once is enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeInput = (clientX: number, clientY: number) => {
    const input = inputRef.current;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!input || !rect) return;
    // Keep the (invisible) textarea near the caret so IME candidate windows appear there.
    input.style.left = `${clientX - rect.left}px`;
    input.style.top = `${clientY - rect.top}px`;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    event.preventDefault();
    inputRef.current?.focus({ preventScroll: true });
    placeInput(event.clientX, event.clientY);
    // Mouse back/forward buttons navigate, as in a regular browser.
    if (event.button === 3 || event.button === 4) {
      postToHost({
        type: 'tab',
        action: event.button === 3 ? 'back' : 'forward',
        tabId: tabRef.current.id,
      });
      return;
    }
    if (modeRef.current.kind === 'inspect') {
      if (event.button !== 0) return;
      const { x, y } = toPage(event.clientX, event.clientY);
      postToHost({
        type: 'inspect',
        tabId: tabRef.current.id,
        action: 'pick',
        x,
        y,
        purpose: modeRef.current.purpose,
        // Ctrl+click: the chat agent; Ctrl+Shift+click: a terminal agent; Shift+click: select.
        add: event.shiftKey && !(event.ctrlKey || event.metaKey),
        screenshot: event.altKey,
        send: event.ctrlKey || event.metaKey ? (event.shiftKey ? 'terminal' : 'chat') : undefined,
      });
      return;
    }
    event.currentTarget.setPointerCapture(event.pointerId);
    flushPending();
    const click = clickRef.current;
    const now = performance.now();
    const repeat =
      event.button === click.button &&
      now - click.time < DOUBLE_CLICK_MS &&
      Math.abs(event.clientX - click.x) < DOUBLE_CLICK_DISTANCE &&
      Math.abs(event.clientY - click.y) < DOUBLE_CLICK_DISTANCE;
    click.count = repeat ? click.count + 1 : 1;
    click.time = now;
    click.x = event.clientX;
    click.y = event.clientY;
    click.button = event.button;
    const { x, y } = toPage(event.clientX, event.clientY);
    if (event.button === 2) onContextPoint(event.clientX, event.clientY, x, y);
    send({
      kind: 'mouse',
      type: 'mousePressed',
      x,
      y,
      button: BUTTONS[event.button] ?? 'none',
      buttons: event.buttons,
      clickCount: click.count,
      modifiers: modifiersOf(event.nativeEvent),
    });
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = toPage(event.clientX, event.clientY);
    // In inspect mode too: Chrome's inspect mode highlights whatever the mouse is over.
    pendingMoveRef.current = {
      kind: 'mouse',
      type: 'mouseMoved',
      x,
      y,
      button: heldButton(event.buttons),
      buttons: event.buttons,
      clickCount: 0,
      modifiers: modifiersOf(event.nativeEvent),
    };
    scheduleFlush();
  };

  const onPointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (event.button === 3 || event.button === 4) return;
    if (modeRef.current.kind === 'inspect') return;
    flushPending();
    const { x, y } = toPage(event.clientX, event.clientY);
    send({
      kind: 'mouse',
      type: 'mouseReleased',
      x,
      y,
      button: BUTTONS[event.button] ?? 'none',
      buttons: event.buttons,
      clickCount: clickRef.current.count,
      modifiers: modifiersOf(event.nativeEvent),
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const native = event.nativeEvent;
    // Picking elements, selecting a region or drawing: keys are for the tool, not the page.
    if (modeRef.current.kind !== 'browse') return;
    if (native.isComposing || native.keyCode === 229) return;
    if (native.key === 'Dead' || native.key === 'Unidentified') return;
    send(keyInput(native, 'keyDown'));
    event.preventDefault();
    // Plain typing and editing shortcuts belong to the page; other combinations (e.g. the
    // command palette) still reach VS Code.
    if (!(native.ctrlKey || native.metaKey) || isEditingCombo(native)) event.stopPropagation();
  };

  const onKeyUp = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const native = event.nativeEvent;
    if (native.isComposing || native.keyCode === 229 || endsShortcut(native.code)) return;
    if (native.key === 'Dead' || native.key === 'Unidentified') return;
    send(keyInput(native, 'keyUp'));
    event.preventDefault();
    if (!(native.ctrlKey || native.metaKey)) event.stopPropagation();
  };

  const overlayMapper = renderOverlay && geometry ? makeMapper(geometry) : undefined;

  return (
    <div
      ref={containerRef}
      className={`viewport${hidden ? ' hidden' : ''}${device ? ' device-mode' : ''}${
        mode.kind === 'inspect' ? ' inspecting' : ''
      }`}
      style={bottomInset ? { bottom: bottomInset } : undefined}
    >
      <div
        className={device ? 'device-screen' : 'page-screen'}
        style={device ? { width: cssWidth, height: cssHeight } : undefined}
      >
        <canvas
          ref={canvasRef}
          className="viewport-canvas"
          style={device ? { width: cssWidth, height: cssHeight } : undefined}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onContextMenu={(event) => event.preventDefault()}
        />
        {resizable && (
          <>
            <div className="breakpoints" aria-label="Screen width presets">
              {[...RESPONSIVE_BREAKPOINTS]
                .reverse()
                .filter((bp) => bp.width * scale <= size.width - 8)
                .map((bp) => (
                  <button
                    key={bp.width}
                    type="button"
                    className="breakpoint"
                    title={`${bp.label}: ${bp.width}px`}
                    aria-label={`${bp.label}, ${bp.width} pixels wide`}
                    style={
                      {
                        width: bp.width * scale,
                        marginLeft: (-bp.width * scale) / 2,
                        // Inner (narrower) bands are lighter, so the nesting is visible.
                        '--depth':
                          RESPONSIVE_BREAKPOINTS.length - RESPONSIVE_BREAKPOINTS.indexOf(bp),
                      } as React.CSSProperties
                    }
                    onClick={() =>
                      onResizeDevice?.({ width: bp.width, height: shownDevice!.height })
                    }
                  >
                    <span>{bp.label}</span>
                  </button>
                ))}
            </div>
            <div
              className="resize-handle resize-x"
              role="separator"
              aria-orientation="vertical"
              aria-label="Drag to resize width"
              title="Drag to resize width"
              onPointerDown={(event) => startResize(event, 'x')}
            />
            <div
              className="resize-handle resize-y"
              role="separator"
              aria-orientation="horizontal"
              aria-label="Drag to resize height"
              title="Drag to resize height"
              onPointerDown={(event) => startResize(event, 'y')}
            />
            <div
              className="resize-handle resize-xy"
              aria-label="Drag to resize"
              title="Drag to resize"
              onPointerDown={(event) => startResize(event, 'xy')}
            />
            {dragSize && (
              <div className="resize-readout">
                {dragSize.width} × {dragSize.height}
              </div>
            )}
          </>
        )}
      </div>
      <textarea
        ref={inputRef}
        className="viewport-input"
        aria-label="Page content"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        tabIndex={-1}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          if (event.data) send({ kind: 'text', text: event.data });
          event.currentTarget.value = '';
        }}
        onInput={(event) => {
          // Text that arrives without key events: emoji picker, dictation, and so on.
          if (composingRef.current || (event.nativeEvent as globalThis.InputEvent).isComposing)
            return;
          const value = event.currentTarget.value;
          if (value) send({ kind: 'text', text: value });
          event.currentTarget.value = '';
        }}
      />
      {renderOverlay && overlayMapper && renderOverlay(overlayMapper)}
    </div>
  );
}
