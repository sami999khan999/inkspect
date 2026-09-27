import { useCallback, useEffect, useRef, useState } from 'react';
import {
  captureArea as drawingArea,
  clusterShapes,
  DEFAULT_STYLE,
  type Bounds,
  type DrawTool,
  type Shape,
  type ShapeStyle,
} from '@inkspect/shared/annotations';
import { COLLECT_HELPERS, collectElementDetails, accessibleInfo } from '@inkspect/shared/collect';
import { formatPageContext, type ConsoleEntry, type NetworkEntry } from '@inkspect/shared/devtools';
import { compositeScreenshot } from '@inkspect/shared/drawing/composite';
import { elementLabel, formatDetails, type ElementDetails } from '@inkspect/shared/elementInfo';
import { DrawingLayer, type DrawMapper } from '@inkspect/shared/ui/DrawingLayer';
import {
  captureMenu,
  DrawToolbar,
  TOOL_KEYS,
  type CaptureMode,
} from '@inkspect/shared/ui/DrawToolbar';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuItem, type MenuState } from '@inkspect/shared/ui/Menu';
import { TARGET_ATTRIBUTE, toBackground, type BridgeStatus, type SendTarget } from '../messages';
import { captureArea, captureVisible, fullPageArea, viewportArea, type HideUi } from './capture';
import { Inspector, type PickModifiers } from './Inspector';
import { ConsolePanel, DevicePanel, LinkPanel } from './panels';
import {
  copyImage,
  copyText,
  loadSettings,
  pageRequest,
  screenshotName,
  type Settings,
} from './page';

type Tool =
  { kind: 'inspect'; purpose: 'copy' | 'screenshot' } | { kind: 'draw' } | { kind: 'region' };
type Panel = 'devices' | 'console' | 'link';

interface ToastState {
  id: number;
  message: string;
  actions?: { label: string; run: () => void }[];
}

const STARTING_STYLES: Partial<Record<DrawTool, ShapeStyle>> = {
  highlighter: { ...DEFAULT_STYLE, color: '#ffd60a', width: 16, opacity: 0.4 },
  marker: { ...DEFAULT_STYLE, width: 8 },
  pencil: { ...DEFAULT_STYLE, width: 2 },
};

const CAPTURE_LABELS: Record<CaptureMode, string> = {
  area: 'Drawing screenshot',
  groups: 'Drawing screenshot',
  clean: 'Drawing area',
  viewport: 'Annotated viewport',
  fullPage: 'Annotated full page',
};

interface AppProps {
  host: HTMLElement;
  /** Hides the toolbar's host element (for screenshots); returns a function that shows it. */
  hideHost: () => () => void;
  /** Bumped by the background's toggle message. */
  toggleSignal: number;
}

export function App({ host, hideHost, toggleSignal }: AppProps) {
  const [open, setOpen] = useState(false);
  const [tool, setTool] = useState<Tool | null>(null);
  const [panel, setPanel] = useState<Panel | null>(null);
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [selection, setSelection] = useState<Element[]>([]);
  const [link, setLink] = useState<BridgeStatus>({ state: 'offline' });
  const [position, setPosition] = useState({ x: Math.max(8, innerWidth / 2 - 230), y: 12 });
  const [hidden, setHidden] = useState(false);
  const settings = useRef<Settings | null>(null);
  // Drawing
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [undo, setUndo] = useState<Shape[][]>([]);
  const [redo, setRedo] = useState<Shape[][]>([]);
  const [drawTool, setDrawTool] = useState<DrawTool>('pen');
  const [styles, setStyles] = useState(STARTING_STYLES);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [drawingVisible, setDrawingVisible] = useState(true);
  const [scroll, setScroll] = useState({ x: scrollX, y: scrollY });
  const [size, setSize] = useState({ width: innerWidth, height: innerHeight });
  const shapesRef = useRef(shapes);

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  // The toggle message: open, or close everything.
  const lastSignal = useRef(0);
  useEffect(() => {
    if (toggleSignal === lastSignal.current) return;
    lastSignal.current = toggleSignal;
    setOpen((was) => {
      if (was) {
        setTool(null);
        setPanel(null);
        setMenu(null);
      }
      return !was;
    });
  }, [toggleSignal]);

  useEffect(() => {
    void loadSettings().then((s) => (settings.current = s));
    void toBackground({ type: 'bridgeStatus' }).then(
      (reply) => reply.ok && reply.status && setLink(reply.status),
    );
    const onMessage = (message: { type?: string; status?: BridgeStatus }) => {
      if (message.type === 'bridgeStatus' && message.status) setLink(message.status);
    };
    chrome.runtime.onMessage.addListener(onMessage);
    const onScroll = () => setScroll({ x: scrollX, y: scrollY });
    const onResize = () => setSize({ width: innerWidth, height: innerHeight });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      chrome.runtime.onMessage.removeListener(onMessage);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const showToast = useCallback((message: string, actions?: ToastState['actions']) => {
    setToast({ id: Date.now(), message, actions });
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(
      () => setToast((t) => (t?.id === toast.id ? null : t)),
      toast.actions ? 12_000 : 3500,
    );
    return () => clearTimeout(timer);
  }, [toast]);

  /** Hides everything of ours while a screenshot is taken. */
  const hideUi: HideUi = useCallback(() => {
    const show = hideHost();
    setHidden(true);
    return () => {
      show();
      setHidden(false);
    };
  }, [hideHost]);

  const linked = link.state === 'connected';

  const send = useCallback(
    async (target: SendTarget, payload: { text?: string; image?: string; label: string }) => {
      const reply = await toBackground({
        type: 'send',
        target,
        pageUrl: location.href,
        ...payload,
      });
      if (!reply.ok) showToast(reply.error);
      else if (target === 'save') showToast(`Saved to ${reply.path ?? 'the workspace'}`);
      else if (target === 'terminal')
        showToast(`Sent to the terminal${reply.path ? `: ${reply.path}` : ''}`);
      else showToast('Sent to VS Code chat');
    },
    [showToast],
  );

  const copy = useCallback(
    async (text: string, what: string) => {
      showToast((await copyText(text)) ? `${what} copied` : `Could not copy ${what.toLowerCase()}`);
    },
    [showToast],
  );

  /** A finished screenshot: copy it, then offer where else it can go. */
  const deliver = useCallback(
    async (dataUrl: string, label: string) => {
      const copied = await copyImage(dataUrl);
      const download = () =>
        void toBackground({ type: 'download', dataUrl, filename: `Inkspect/${screenshotName()}` });
      const actions = linked
        ? [
            {
              label: 'Send to terminal',
              run: () => void send('terminal', { image: dataUrl, label }),
            },
            { label: 'Send to chat', run: () => void send('chat', { image: dataUrl, label }) },
            { label: 'Save to VS Code', run: () => void send('save', { image: dataUrl, label }) },
            { label: 'Download', run: download },
          ]
        : [{ label: 'Download', run: download }];
      showToast(`${label} ${copied ? 'copied' : 'taken'}`, actions);
      if (!copied && !linked) download();
    },
    [linked, send, showToast],
  );

  const screenshot = useCallback(
    async (mode: 'viewport' | 'fullPage' | 'region' | 'element') => {
      if (mode === 'region') return setTool({ kind: 'region' });
      if (mode === 'element') return setTool({ kind: 'inspect', purpose: 'screenshot' });
      try {
        const area = mode === 'viewport' ? viewportArea() : fullPageArea();
        const { dataUrl } =
          mode === 'viewport'
            ? { dataUrl: (await captureVisible(hideUi)).src }
            : await captureArea(area, hideUi);
        await deliver(dataUrl, mode === 'viewport' ? 'Screenshot' : 'Full-page screenshot');
      } catch (error) {
        showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    [deliver, hideUi, showToast],
  );

  /** Element details, from the page world when possible (framework components are only there). */
  const detailsOf = useCallback(async (el: Element): Promise<ElementDetails> => {
    const maxHtml = settings.current?.maxHtml ?? 2000;
    el.setAttribute(TARGET_ATTRIBUTE, '');
    try {
      const fromPage = await pageRequest<ElementDetails & { error?: string }>(
        { kind: 'collect', maxHtml },
        1500,
      );
      if (fromPage && !fromPage.error && fromPage.tag) return fromPage;
    } finally {
      el.removeAttribute(TARGET_ATTRIBUTE);
    }
    return { ...collectElementDetails(el, maxHtml, COLLECT_HELPERS), ...accessibleInfo(el) };
  }, []);

  const captureElement = useCallback(
    async (el: Element) => {
      const rect = el.getBoundingClientRect();
      return captureArea(
        { x: rect.x + scrollX, y: rect.y + scrollY, width: rect.width, height: rect.height },
        hideUi,
      );
    },
    [hideUi],
  );

  const copyElements = useCallback(
    async (elements: Element[], chat = false) => {
      const s = settings.current ?? (await loadSettings());
      const details = await Promise.all(elements.map(detailsOf));
      if (chat) {
        await send('chat', {
          text: formatDetails(details, 'markdown', s.fields),
          label: 'Element details',
        });
        return;
      }
      const text = formatDetails(details, s.copyFormat, s.fields);
      const ok = await copyText(text);
      const what = details.length === 1 ? elementLabel(details[0]!) : `${details.length} elements`;
      showToast(
        ok ? `Copied details of ${what}` : 'Could not copy',
        linked
          ? [
              {
                label: 'Send to chat',
                run: () =>
                  void send('chat', {
                    text: formatDetails(details, 'markdown', s.fields),
                    label: 'Element details',
                  }),
              },
              {
                label: 'Send to terminal',
                run: () =>
                  void send('terminal', {
                    text: formatDetails(details, 'markdown', s.fields),
                    label: `element ${what}`,
                  }),
              },
            ]
          : undefined,
      );
    },
    [detailsOf, linked, send, showToast],
  );

  const onPick = useCallback(
    async (el: Element, modifiers: PickModifiers) => {
      if (tool?.kind === 'inspect' && tool.purpose === 'screenshot') {
        setTool(null);
        try {
          const { dataUrl } = await captureElement(el);
          await deliver(dataUrl, 'Element screenshot');
        } catch (error) {
          showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return;
      }
      if (modifiers.add) {
        setSelection((list) => (list.includes(el) ? list.filter((e) => e !== el) : [...list, el]));
        return;
      }
      if (modifiers.screenshot) {
        const { dataUrl } = await captureElement(el);
        await deliver(dataUrl, 'Element screenshot');
      }
      await copyElements([el], modifiers.chat);
    },
    [captureElement, copyElements, deliver, showToast, tool],
  );

  const pageContext = useCallback(async () => {
    const logs = await pageRequest<{ console: ConsoleEntry[]; network: NetworkEntry[] }>({
      kind: 'logs',
    });
    return formatPageContext({
      url: location.href,
      title: document.title,
      viewport: { width: innerWidth, height: innerHeight },
      selection: getSelection()?.toString() || undefined,
      console: logs?.console ?? [],
      network: logs?.network ?? [],
    });
  }, []);

  // Drawing ---------------------------------------------------------------------------------

  const updateShapes = useCallback((next: Shape[], commit: boolean) => {
    if (commit) {
      setUndo((u) => [...u.slice(-99), shapesRef.current]);
      setRedo([]);
    }
    setShapes(next);
  }, []);
  const doUndo = useCallback(() => {
    setUndo((u) => {
      const previous = u.at(-1);
      if (!previous) return u;
      setRedo((r) => [...r, shapesRef.current]);
      setShapes(previous);
      return u.slice(0, -1);
    });
  }, []);
  const doRedo = useCallback(() => {
    setRedo((r) => {
      const next = r.at(-1);
      if (!next) return r;
      setUndo((u) => [...u, shapesRef.current]);
      setShapes(next);
      return r.slice(0, -1);
    });
  }, []);

  const captureDrawing = useCallback(
    async (mode: CaptureMode) => {
      const all = shapesRef.current;
      if (!all.length && (mode === 'area' || mode === 'groups' || mode === 'clean')) {
        showToast('Draw something first.');
        return;
      }
      const padding = settings.current?.annotationPadding ?? 40;
      const groups = mode === 'groups' ? clusterShapes(all, 80) : [all];
      for (const [index, group] of groups.entries()) {
        const wanted =
          mode === 'viewport'
            ? viewportArea()
            : mode === 'fullPage'
              ? fullPageArea()
              : drawingArea(group, padding);
        if (!wanted) continue;
        try {
          const captured = await captureArea(wanted, hideUi);
          const bytes = new Uint8Array(await (await fetch(captured.dataUrl)).arrayBuffer());
          const base64 = await compositeScreenshot(
            bytes,
            'image/png',
            captured.area,
            mode === 'clean' ? [] : group,
          );
          await deliver(
            `data:image/png;base64,${base64}`,
            groups.length > 1 ? `Drawing ${index + 1} of ${groups.length}` : CAPTURE_LABELS[mode],
          );
        } catch (error) {
          showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
          return;
        }
      }
    },
    [deliver, hideUi, showToast],
  );

  // Keys: drawing tool letters, undo/redo, Esc leaves the current tool.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      const typing = event
        .composedPath()
        .some(
          (el) =>
            el instanceof HTMLElement &&
            (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)),
        );
      if (typing) return;
      if (event.key === 'Escape' && (tool || panel || menu)) {
        if (menu) setMenu(null);
        else if (tool?.kind !== 'inspect') {
          setTool(null);
          setPanel(null);
        }
        return;
      }
      if (tool?.kind !== 'draw') return;
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === 'z') doUndo();
      else if ((event.ctrlKey || event.metaKey) && key === 'y') doRedo();
      else if (!event.ctrlKey && !event.metaKey && !event.altKey && TOOL_KEYS[key])
        setDrawTool(TOOL_KEYS[key]!);
      else return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, tool, panel, menu, doUndo, doRedo]);

  // Toolbar ---------------------------------------------------------------------------------

  const toggleTool = (next: Tool) =>
    setTool((current) => (current?.kind === next.kind ? null : next));
  const openMenu = (event: React.MouseEvent, items: MenuItem[]) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ x: rect.left, y: rect.bottom + 4, items });
  };
  const startDrag = (event: React.PointerEvent) => {
    const start = { x: event.clientX - position.x, y: event.clientY - position.y };
    const move = (e: PointerEvent) =>
      setPosition({
        x: Math.max(0, Math.min(innerWidth - 80, e.clientX - start.x)),
        y: Math.max(0, Math.min(innerHeight - 40, e.clientY - start.y)),
      });
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  if (!open) return null;

  const mapper: DrawMapper = { scale: 1, scroll, bounds: { left: 0, top: 0, ...size } };
  const style = styles[drawTool] ?? DEFAULT_STYLE;

  return (
    <div className={`inkspect${hidden ? ' capturing' : ''}`}>
      {(shapes.length > 0 || tool?.kind === 'draw') && (
        <div className="draw-host">
          <DrawingLayer
            mapper={mapper}
            shapes={shapes}
            visible={drawingVisible}
            interactive={tool?.kind === 'draw'}
            tool={drawTool}
            style={style}
            onChange={updateShapes}
          />
        </div>
      )}
      {tool?.kind === 'inspect' && (
        <Inspector
          host={host}
          purpose={tool.purpose}
          selection={selection}
          onPick={(el, modifiers) => void onPick(el, modifiers)}
          onCommit={(el) => {
            const list = selection.length ? selection : el ? [el] : [];
            if (list.length) void copyElements(list);
            setSelection([]);
          }}
          onExit={() => {
            setTool(null);
            setSelection([]);
          }}
        />
      )}
      {tool?.kind === 'region' && (
        <RegionSelect
          onCancel={() => setTool(null)}
          onDone={(rect) => {
            setTool(null);
            void captureArea({ ...rect, x: rect.x + scrollX, y: rect.y + scrollY }, hideUi)
              .then(({ dataUrl }) => deliver(dataUrl, 'Region screenshot'))
              .catch((error: unknown) => showToast(`Screenshot failed: ${String(error)}`));
          }}
        />
      )}
      <div
        className="toolbar"
        style={{ left: position.x, top: position.y }}
        role="toolbar"
        aria-label="Inkspect"
      >
        <span
          className="grip codicon codicon-gripper"
          aria-hidden="true"
          onPointerDown={startDrag}
          title="Drag to move"
        />
        <IconButton
          icon="inspect"
          label="Select an element to copy its details for AI"
          active={tool?.kind === 'inspect'}
          onClick={() => toggleTool({ kind: 'inspect', purpose: 'copy' })}
        />
        <IconButton
          icon="edit"
          label="Draw on the page"
          active={tool?.kind === 'draw'}
          onClick={() => toggleTool({ kind: 'draw' })}
        />
        <IconButton
          icon="device-camera"
          label="Screenshot"
          onClick={(event) =>
            openMenu(event, [
              {
                label: 'Visible area',
                icon: 'device-camera',
                onSelect: () => void screenshot('viewport'),
              },
              {
                label: 'Full page',
                icon: 'file-media',
                onSelect: () => void screenshot('fullPage'),
              },
              {
                label: 'Select region...',
                icon: 'screen-full',
                onSelect: () => void screenshot('region'),
              },
              {
                label: 'Select element...',
                icon: 'inspect',
                onSelect: () => void screenshot('element'),
              },
            ])
          }
        />
        <IconButton
          icon="device-mobile"
          label="Devices and resolutions"
          active={panel === 'devices'}
          onClick={() => setPanel((p) => (p === 'devices' ? null : 'devices'))}
        />
        <IconButton
          icon="debug-console"
          label="Console and network (copy errors for AI)"
          active={panel === 'console'}
          onClick={() => setPanel((p) => (p === 'console' ? null : 'console'))}
        />
        <IconButton
          icon="copy"
          label="Copy page context for AI"
          onClick={() => void pageContext().then((text) => copy(text, 'Page context'))}
        />
        <IconButton
          icon="star-empty"
          label="Bookmark this page"
          onClick={() =>
            void toBackground({
              type: 'bookmarkPage',
              url: location.href,
              title: document.title,
            }).then((reply) =>
              showToast(
                reply.ok ? (linked ? 'Bookmarked (syncs to VS Code)' : 'Bookmarked') : reply.error,
              ),
            )
          }
        />
        <span className="separator" />
        <IconButton
          icon={linked ? 'plug' : 'debug-disconnect'}
          label={linked ? `Linked with ${link.peer ?? 'VS Code'}` : 'Link with VS Code'}
          active={panel === 'link'}
          className={`link-${link.state}`}
          onClick={() => setPanel((p) => (p === 'link' ? null : 'link'))}
        />
        <IconButton
          icon="close"
          label="Close toolbar (Alt+Shift+I)"
          onClick={() => setOpen(false)}
        />
      </div>
      {tool?.kind === 'draw' && (
        <div
          className="draw-dock"
          // The drawing toolbar is wider than the main one: keep it on screen in one row.
          style={{
            left: Math.max(8, Math.min(position.x, size.width - 760)),
            top: position.y + 44,
          }}
        >
          <DrawToolbar
            tool={drawTool}
            style={style}
            recentColors={recentColors}
            canUndo={undo.length > 0}
            canRedo={redo.length > 0}
            hasShapes={shapes.length > 0}
            visible={drawingVisible}
            onTool={setDrawTool}
            onStyle={(changes) => {
              setStyles((all) => ({ ...all, [drawTool]: { ...style, ...changes } }));
              if (changes.color)
                setRecentColors((colors) =>
                  [changes.color!, ...colors.filter((c) => c !== changes.color)].slice(0, 6),
                );
            }}
            onUndo={doUndo}
            onRedo={doRedo}
            onClear={() => updateShapes([], true)}
            onToggleVisible={() => setDrawingVisible((v) => !v)}
            onCapture={(x, y) =>
              setMenu({ x, y, items: captureMenu((mode) => void captureDrawing(mode)) })
            }
            onClose={() => setTool(null)}
          />
        </div>
      )}
      {panel && (
        <div
          className="panel-dock"
          style={{
            left: Math.min(position.x, innerWidth - 380),
            top: position.y + (tool?.kind === 'draw' ? 96 : 48),
          }}
        >
          {panel === 'devices' && <DevicePanel onClose={() => setPanel(null)} toast={showToast} />}
          {panel === 'console' && (
            <ConsolePanel
              onClose={() => setPanel(null)}
              toast={showToast}
              copy={(text, what) => void copy(text, what)}
              send={(target, payload) => void send(target, payload)}
              linked={linked}
              pageContext={pageContext}
            />
          )}
          {panel === 'link' && (
            <LinkPanel onClose={() => setPanel(null)} toast={showToast} status={link} />
          )}
        </div>
      )}
      {menu && <Menu menu={menu} onClose={() => setMenu(null)} />}
      {toast && (
        <div className="toast" role="status">
          <span>{toast.message}</span>
          {toast.actions?.map((action) => (
            <button
              key={action.label}
              type="button"
              className="button secondary small"
              onClick={() => {
                action.run();
                setToast(null);
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/** Drag a rectangle over the page; Enter or releasing the mouse captures it. */
function RegionSelect({
  onDone,
  onCancel,
}: {
  onDone: (rect: Bounds) => void;
  onCancel: () => void;
}) {
  const [rect, setRect] = useState<Bounds | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [onCancel]);
  return (
    <div
      className="region"
      onPointerDown={(event) => {
        event.currentTarget.setPointerCapture(event.pointerId);
        start.current = { x: event.clientX, y: event.clientY };
        setRect({ x: event.clientX, y: event.clientY, width: 0, height: 0 });
      }}
      onPointerMove={(event) => {
        const s = start.current;
        if (!s) return;
        setRect({
          x: Math.min(s.x, event.clientX),
          y: Math.min(s.y, event.clientY),
          width: Math.abs(event.clientX - s.x),
          height: Math.abs(event.clientY - s.y),
        });
      }}
      onPointerUp={() => {
        start.current = null;
        if (rect && rect.width > 4 && rect.height > 4) onDone(rect);
      }}
    >
      <div className="inspect-hint">Drag to select a region · Esc to cancel</div>
      {rect && (
        <div
          className="region-box"
          style={{ left: rect.x, top: rect.y, width: rect.width, height: rect.height }}
        >
          <span className="region-size">
            {Math.round(rect.width)} × {Math.round(rect.height)}
          </span>
        </div>
      )}
    </div>
  );
}
