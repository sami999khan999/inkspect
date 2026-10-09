import { useCallback, useEffect, useRef, useState } from 'react';
import {
  captureArea as drawingArea,
  clusterShapes,
  COLORS,
  DEFAULT_STYLE,
  placeShapes,
  type Bounds,
  type DrawTool,
  type Shape,
  type ShapeStyle,
} from '@inkspect/shared/annotations';
import { COLLECT_HELPERS, collectElementDetails, accessibleInfo } from '@inkspect/shared/collect';
import { DEVICE_PRESETS, presetToDevice, type DeviceSettings } from '@inkspect/shared/devices';
import { formatPageContext, type ConsoleEntry, type NetworkEntry } from '@inkspect/shared/devtools';
import { compositeScreenshot } from '@inkspect/shared/drawing/composite';
import { elementLabel, formatDetails, type ElementDetails } from '@inkspect/shared/elementInfo';
import {
  actionForChord,
  chordFromEvent,
  effectiveShortcuts,
  formatKey,
  type ShortcutMap,
  type ShortcutOverrides,
  type ShortcutScope,
} from '@inkspect/shared/shortcuts';
import { DrawingLayer, type DrawMapper } from '@inkspect/shared/ui/DrawingLayer';
import {
  captureMenu,
  DrawToolbar,
  DRAW_TOOLS,
  type CaptureMode,
} from '@inkspect/shared/ui/DrawToolbar';
import { Button } from '@inkspect/shared/ui/Button';
import { DragHandle } from '@inkspect/shared/ui/DragHandle';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuItem, type MenuState } from '@inkspect/shared/ui/Menu';
import { isInPopup, listenOutsidePress, pressedOpener } from '@inkspect/shared/ui/popover';
import { SelectionBar, type SelectionAction } from '@inkspect/shared/ui/SelectionBar';
import { projectDetail } from '@inkspect/shared/saved';
import { SendModal } from '@inkspect/shared/ui/SendModal';
import { TARGET_ATTRIBUTE, toBackground, type BridgeStatus, type CaptureKind } from '../messages';
import { isMac, TOOLBAR_ACTIONS, watchShortcuts } from '../shortcuts';
import {
  captureArea,
  captureElementRect,
  captureVisible,
  fullPageArea,
  viewportArea,
  type HideUi,
} from './capture';
import { anchorAt, measureAnchors, scrollUnder } from './anchors';
import { Inspector, type PickModifiers } from './Inspector';
import {
  ConsolePanel,
  DEFAULT_EMULATION_OPTIONS,
  EmulationPanel,
  LinkPanel,
  ShortcutsPanel,
  type EmulationOptions,
} from './panels';
import { ResponsiveView, type Zoom } from './ResponsiveView';
import { copyImage, copyText, loadSettings, pageRequest, type Settings } from './page';
import { flushDrawings, loadDrawings, pageKeyOf, saveDrawings } from './pageDrawings';
import { useFloating } from './useFloating';
import { useSendFlow } from './useSendFlow';

type Tool =
  { kind: 'inspect'; purpose: 'copy' | 'screenshot' } | { kind: 'draw' } | { kind: 'region' };
type Panel = 'emulation' | 'console' | 'link' | 'shortcuts';

/** The actions the toolbar handles (see ../shortcuts.ts). */
const TOOLBAR_IDS = new Set(TOOLBAR_ACTIONS.map((a) => a.id));

/** What the page tools say while the responsive view covers the page. */
const NOT_IN_FRAME = ' (not available in the responsive view yet)';

/** A notice at the bottom right (sends and saves use the send dialog). */
export interface ToastOptions {
  /** A second, quieter line. */
  detail?: string;
  /** Without one, messages about failures are errors and the rest are plain. */
  tone?: 'info' | 'success' | 'error';
}

interface ToastState extends ToastOptions {
  id: number;
  message: string;
  /** The pointer is on it: it stays until the pointer leaves. */
  held?: boolean;
}

const FAILURE =
  /\b(failed|could not|can't|cannot|did not|didn't|nothing was|not linked|not running)\b/i;

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
  const [hidden, setHidden] = useState(false);
  // The shared shortcuts (VS Code's, remappable on either side), and the menu that takes keys.
  const [shortcuts, setShortcuts] = useState<{ map: ShortcutMap; overrides: ShortcutOverrides }>(
    () => ({ map: effectiveShortcuts({}, isMac), overrides: {} }),
  );
  const [menuScope, setMenuScope] = useState<ShortcutScope | null>(null);
  // Whether this page is bookmarked (the star is filled).
  const [bookmarked, setBookmarked] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
  // The responsive view: the device, its zoom, and the page's address once it may be framed.
  const [responsive, setResponsive] = useState<DeviceSettings | null>(null);
  const [zoom, setZoom] = useState<Zoom>('fit');
  const [frameSrc, setFrameSrc] = useState<string | null>(null);
  const [emulation, setEmulation] = useState<EmulationOptions>(DEFAULT_EMULATION_OPTIONS);
  const frame = useRef<HTMLIFrameElement>(null);
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
  // An image of the visible page, for redactions to pixelate (see the effect below).
  const [pageImage, setPageImage] = useState<{
    canvas: HTMLCanvasElement;
    x: number;
    y: number;
    width: number;
    height: number;
  } | null>(null);
  const [sampling, setSampling] = useState(false);
  // Drawings belong to a page: the one shown now (single-page apps change it without loading),
  // the one `shapes` are for, and whether that page's saved drawings are loaded yet.
  const [page, setPage] = useState(() => pageKeyOf(location.href));
  const [drawnOn, setDrawnOn] = useState(page);
  const [loadedPage, setLoadedPage] = useState<string | null>(null);
  if (drawnOn !== page) {
    setDrawnOn(page);
    setShapes([]);
    setUndo([]);
    setRedo([]);
  }
  // Scrolling inside the page moves drawings anchored to its sections: a re-render measures them.
  const [, setSectionScroll] = useState(0);
  const drawHost = useRef<HTMLDivElement>(null);

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  useEffect(() => {
    let cancelled = false;
    void loadDrawings(page).then((saved) => {
      if (cancelled) return;
      // Anything drawn while they loaded goes on top.
      setShapes((now) => [...saved, ...now]);
      setLoadedPage(page);
    });
    return () => {
      cancelled = true;
    };
  }, [page]);
  useEffect(() => {
    if (loadedPage === drawnOn) saveDrawings(drawnOn, shapes);
  }, [shapes, drawnOn, loadedPage]);
  useEffect(() => {
    const check = () => setPage(pageKeyOf(location.href));
    const timer = setInterval(check, 500);
    window.addEventListener('popstate', check);
    window.addEventListener('hashchange', check);
    window.addEventListener('pagehide', flushDrawings);
    let frame = 0;
    const onSectionScroll = (event: Event) => {
      if (event.target === document || !shapesRef.current.some((shape) => shape.anchor)) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setSectionScroll((n) => n + 1));
    };
    document.addEventListener('scroll', onSectionScroll, { capture: true, passive: true });
    return () => {
      clearInterval(timer);
      cancelAnimationFrame(frame);
      window.removeEventListener('popstate', check);
      window.removeEventListener('hashchange', check);
      window.removeEventListener('pagehide', flushDrawings);
      document.removeEventListener('scroll', onSectionScroll, { capture: true });
    };
  }, []);

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
        setResponsive(null);
        setFrameSrc(null);
      }
      return !was;
    });
  }, [toggleSignal]);

  // The background puts an open toolbar back after the page reloads.
  useEffect(() => {
    void toBackground({ type: 'toolbarOpen', open });
  }, [open]);

  // The bar floats over the page (the page isn't moved), where it was dragged to.
  // While the responsive view is open, the bar is docked across the top, above the view.
  const { ref: floatRef, rest, dragging, handle } = useFloating(open, bar, responsive !== null);

  // While the responsive view covers the page, the page itself doesn't scroll.
  const viewing = responsive !== null;
  useEffect(() => {
    if (!viewing) return;
    const html = document.documentElement;
    const saved = html.style.getPropertyValue('overflow');
    const priority = html.style.getPropertyPriority('overflow');
    html.style.setProperty('overflow', 'hidden', 'important');
    return () => {
      if (saved) html.style.setProperty('overflow', saved, priority);
      else html.style.removeProperty('overflow');
    };
  }, [viewing]);

  useEffect(
    () => watchShortcuts((map, stored) => setShortcuts({ map, overrides: stored.overrides })),
    [],
  );
  // The star follows the page: checked on opening, when the address changes (single-page apps
  // too) and when the tab gets focus back (it may have been bookmarked elsewhere, or in VS Code).
  useEffect(() => {
    if (!open) return;
    let url = '';
    const check = (force = false) => {
      if (!force && location.href === url) return;
      url = location.href;
      void toBackground({ type: 'isBookmarked', url }).then(
        (reply) => reply.ok && setBookmarked(!!reply.bookmarked),
      );
    };
    check(true);
    const timer = setInterval(() => check(), 1000);
    const onFocus = () => check(true);
    addEventListener('focus', onFocus);
    return () => {
      clearInterval(timer);
      removeEventListener('focus', onFocus);
    };
  }, [open]);
  /** The current key of an action, for labels ("Ctrl+Shift+C"). */
  const keyOf = useCallback(
    (id: string) => {
      const key = shortcuts.map[id]?.[0];
      return key ? formatKey(key, isMac) : undefined;
    },
    [shortcuts.map],
  );
  const withKey = (label: string, id: string) => {
    const key = keyOf(id);
    return key ? `${label} (${key})` : label;
  };

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

  const showToast = useCallback((message: string, options: ToastOptions = {}) => {
    const tone = options.tone ?? (FAILURE.test(message) ? 'error' : 'info');
    setToast({ id: Date.now(), message, ...options, tone });
  }, []);

  // The responsive view's emulation (Chrome): user agent, touch, network, CPU, media. Only what
  // it uses: the size changes all the time while dragging.
  const agentUserAgent = responsive?.userAgent;
  const agentTouch = responsive?.touch ?? false;
  useEffect(() => {
    if (__BROWSER__ !== 'chrome') return;
    const agent =
      viewing && (emulation.agent || emulation.touch)
        ? {
            userAgent: emulation.agent ? agentUserAgent : undefined,
            touch: emulation.touch && agentTouch,
          }
        : undefined;
    const request = viewing
      ? {
          agent,
          network: emulation.network,
          cpu: emulation.cpu,
          colorScheme: emulation.colorScheme,
          print: emulation.print,
        }
      : { network: 'none' as const, cpu: 1, colorScheme: 'default' as const, print: false };
    void toBackground({ type: 'emulate', request }).then((reply) => {
      if (!reply.ok) showToast(reply.error);
    });
  }, [viewing, agentUserAgent, agentTouch, emulation, showToast]);

  const openResponsive = useCallback(async () => {
    setTool(null);
    setPanel((p) => (p === 'console' ? null : p));
    setResponsive((current) => current ?? presetToDevice(DEVICE_PRESETS[0]!));
    const url = location.href;
    const reply = await toBackground({ type: 'allowFraming', url });
    if (!reply.ok) showToast(`The page may not load in the frame: ${reply.error}`);
    setFrameSrc(url);
  }, [showToast]);
  const closeResponsive = useCallback(() => {
    setResponsive(null);
    setFrameSrc(null);
    setPanel((p) => (p === 'emulation' ? null : p));
    void toBackground({ type: 'endFraming' });
  }, []);
  useEffect(() => {
    if (!toast || toast.held) return;
    const timer = setTimeout(
      () => setToast((t) => (t?.id === toast.id ? null : t)),
      // Errors are read, not glanced at.
      toast.tone === 'error' ? 8000 : 3500,
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

  /** Captures part of the document, with the drawings on it while they are shown. */
  const shoot = useCallback(
    async (area: Bounds): Promise<string> => {
      const captured = await captureArea(area, hideUi);
      const shapes = drawingVisible ? shapesRef.current : [];
      if (!shapes.length) return captured.dataUrl;
      const bytes = new Uint8Array(await (await fetch(captured.dataUrl)).arrayBuffer());
      const base64 = await compositeScreenshot(
        bytes,
        'image/png',
        captured.area,
        shapes,
        measureAnchors(shapes),
      );
      return `data:image/png;base64,${base64}`;
    },
    [drawingVisible, hideUi],
  );

  const linked = link.state === 'connected';
  // Every capture is copied, saved (into the page's project with the browser helper, VS Code's
  // Saved list over the link), then the send dialog offers where it goes.
  const {
    offer,
    capture: saveAndOffer,
    sendTo,
    moveTo,
    copyAgain,
    download,
    close: closeOffer,
  } = useSendFlow(link);

  const copy = useCallback(
    async (text: string, what: string, kind: CaptureKind = 'text') => {
      const ok = await copyText(text);
      await saveAndOffer(
        [{ kind, title: what, text }],
        what,
        ok ? 'Copied to the clipboard.' : undefined,
      );
    },
    [saveAndOffer],
  );

  /**
   * Finished screenshots: the clipboard holds one image (the first); all are saved together (a
   * group) and offered in one dialog.
   */
  const deliver = useCallback(
    async (images: string | string[], label: string) => {
      const list = typeof images === 'string' ? [images] : images;
      if (!list.length) return;
      const many = list.length > 1;
      const copied = await copyImage(list[0]!);
      const group = many ? crypto.randomUUID() : undefined;
      await saveAndOffer(
        list.map((image, index) => ({
          kind: 'screenshot',
          title: many ? `${label} ${index + 1} of ${list.length}` : label,
          image,
          group,
          groupIndex: many ? index : undefined,
        })),
        many ? `${list.length} ${label.toLowerCase()}` : label,
        copied
          ? many
            ? 'The first is copied to the clipboard.'
            : 'Copied to the clipboard.'
          : undefined,
      );
    },
    [saveAndOffer],
  );

  const screenshot = useCallback(
    async (mode: 'viewport' | 'fullPage' | 'region' | 'element') => {
      if (mode === 'region') return setTool({ kind: 'region' });
      if (mode === 'element') return setTool({ kind: 'inspect', purpose: 'screenshot' });
      try {
        const area = mode === 'viewport' ? viewportArea() : fullPageArea();
        await deliver(
          await shoot(area),
          mode === 'viewport' ? 'Screenshot' : 'Full-page screenshot',
        );
      } catch (error) {
        showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    },
    [deliver, shoot, showToast],
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
      return shoot({
        x: rect.x + scrollX,
        y: rect.y + scrollY,
        width: rect.width,
        height: rect.height,
      });
    },
    [shoot],
  );

  // The bar over a Shift+click selection: every choice acts on all the selected elements.
  const onSelectionAction = async (action: SelectionAction) => {
    const list = selection;
    setSelection([]);
    if (action === 'clear') return;
    if (action === 'copy') return copyElements(list);
    try {
      const shots = [];
      for (const el of list) shots.push(await captureElement(el));
      await deliver(shots, list.length === 1 ? 'Element screenshot' : 'Element screenshots');
    } catch (error) {
      showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  /** The elements' details: copied, saved (one item each, a group for several) and offered. */
  const copyElements = useCallback(
    async (elements: Element[]) => {
      const s = settings.current ?? (await loadSettings());
      const details = await Promise.all(elements.map(detailsOf));
      const one = details.length === 1;
      const ok = await copyText(formatDetails(details, s.copyFormat, s.fields));
      const group = one ? undefined : crypto.randomUUID();
      await saveAndOffer(
        details.map((d, index) => ({
          kind: 'element',
          title: `Element ${elementLabel(d)}`,
          text: formatDetails([d], 'markdown', s.fields),
          group,
          groupIndex: one ? undefined : index,
        })),
        one ? `Element ${elementLabel(details[0]!)}` : `${details.length} elements`,
        ok ? 'Its details are copied to the clipboard.' : undefined,
      );
    },
    [detailsOf, saveAndOffer],
  );

  const onPick = useCallback(
    async (el: Element, modifiers: PickModifiers) => {
      const shot = tool?.kind === 'inspect' && tool.purpose === 'screenshot';
      if (shot) setTool(null);
      if (modifiers.add && !shot) {
        setSelection((list) => (list.includes(el) ? list.filter((e) => e !== el) : [...list, el]));
        return;
      }
      // Alt+click is a screenshot of the element, and only that; a click captures its details.
      if (shot || modifiers.screenshot) {
        try {
          await deliver(await captureElement(el), 'Element screenshot');
        } catch (error) {
          showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return;
      }
      await copyElements([el]);
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
      // Where the drawings are on the page now (those on scrolled sections move with them).
      const anchors = measureAnchors(shapesRef.current);
      const all = placeShapes(shapesRef.current, anchors);
      if (!all.length && (mode === 'area' || mode === 'groups' || mode === 'clean')) {
        showToast('Draw something first.');
        return;
      }
      const padding = settings.current?.annotationPadding ?? 40;
      const byId = new Map(shapesRef.current.map((shape) => [shape.id, shape]));
      const groups = mode === 'groups' ? clusterShapes(all, 80) : [all];
      const images: string[] = [];
      for (const group of groups) {
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
            mode === 'clean' ? [] : group.map((shape) => byId.get(shape.id)!),
            anchors,
          );
          images.push(`data:image/png;base64,${base64}`);
        } catch (error) {
          showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
          return;
        }
      }
      await deliver(images, images.length > 1 ? 'Drawings' : CAPTURE_LABELS[mode]);
    },
    [deliver, hideUi, showToast],
  );

  // Redactions pixelate the page like in the VS Code browser, which has the page as an image.
  // Here the page is captured when there are redactions (our drawings hidden for a moment), and
  // again once scrolling or resizing settles; until then they blur the live page instead.
  const hasRedactions =
    shapes.some((shape) => shape.kind === 'blur') || (tool?.kind === 'draw' && drawTool === 'blur');
  const freshImage =
    pageImage &&
    pageImage.x === scroll.x &&
    pageImage.y === scroll.y &&
    pageImage.width === size.width &&
    pageImage.height === size.height
      ? pageImage.canvas
      : undefined;
  useEffect(() => {
    if (!open || !hasRedactions || freshImage) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      const at = { x: scrollX, y: scrollY, width: innerWidth, height: innerHeight };
      void captureVisible(() => {
        setSampling(true);
        return () => setSampling(false);
      })
        .then((image) => {
          if (cancelled) return;
          // The drawing canvas's pixel grid: the viewport in device pixels.
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(at.width * devicePixelRatio);
          canvas.height = Math.round(at.height * devicePixelRatio);
          canvas.getContext('2d')!.drawImage(image, 0, 0, canvas.width, canvas.height);
          setPageImage({ canvas, ...at });
        })
        .catch(() => {
          // No capture (a page Chrome won't capture): the blur stays.
        });
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [open, hasRedactions, freshImage, scroll.x, scroll.y, size.width, size.height]);

  // While drawing, the layer covers the page: the wheel scrolls the section under the pointer.
  const drawing = tool?.kind === 'draw';
  useEffect(() => {
    const layer = drawHost.current;
    if (!drawing || !layer) return;
    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return; // Zoom.
      event.preventDefault();
      scrollUnder(event, host);
    };
    layer.addEventListener('wheel', onWheel, { passive: false });
    return () => layer.removeEventListener('wheel', onWheel);
  }, [drawing, host]);

  // Toolbar ---------------------------------------------------------------------------------

  const toggleTool = (next: Tool) =>
    setTool((current) => (current?.kind === next.kind ? null : next));
  const openMenu = (event: React.MouseEvent, items: MenuItem[], scope?: ShortcutScope) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setMenu({ x: rect.left, y: rect.bottom + 4, items });
    setMenuScope(scope ?? null);
  };
  /** Opens a menu under one of our buttons (for the keys that open menus). */
  const openMenuAt = (selector: string, items: MenuItem[], scope: ShortcutScope | null) => {
    const anchor = bar.current?.querySelector(selector);
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    setMenu({ x: rect.left, y: rect.bottom + 4, items });
    setMenuScope(scope);
  };
  const closeMenu = () => {
    setMenu(null);
    setMenuScope(null);
  };
  const setDrawStyle = (changes: Partial<ShapeStyle>) => {
    const current = styles[drawTool] ?? DEFAULT_STYLE;
    setStyles((all) => ({ ...all, [drawTool]: { ...current, ...changes } }));
    if (changes.color)
      setRecentColors((colors) =>
        [changes.color!, ...colors.filter((c) => c !== changes.color)].slice(0, 6),
      );
  };
  /** The side panel with the Saved list (the page's project). Opened in the click itself. */
  const openSaved = () =>
    void toBackground({ type: 'openSaved' }).then((reply) => {
      if (!reply.ok) showToast(reply.error, { tone: 'error' });
    });
  /** The star: bookmarks the page, or removes its bookmark (like the browser's own star). */
  const bookmarkPage = () =>
    void toBackground(
      bookmarked
        ? { type: 'unbookmarkPage', url: location.href }
        : { type: 'bookmarkPage', url: location.href, title: document.title },
    ).then((reply) => {
      if (!reply.ok) return showToast(reply.error, { tone: 'error' });
      setBookmarked(!!reply.bookmarked);
      showToast(
        reply.bookmarked ? 'Bookmarked' : 'Bookmark removed',
        reply.bookmarked
          ? { tone: 'success', detail: linked ? 'It syncs to VS Code.' : undefined }
          : {},
      );
    });
  /** The Screenshot menu; each item shows its key, which also picks it while the menu is open. */
  const screenshotItems = (): MenuItem[] => [
    {
      label: 'Visible area',
      icon: 'device-camera',
      shortcut: keyOf('shot.viewport'),
      onSelect: () => void screenshot('viewport'),
    },
    {
      label: 'Full page',
      icon: 'file-media',
      shortcut: keyOf('shot.fullPage'),
      onSelect: () => void screenshot('fullPage'),
    },
    {
      label: 'Select region...',
      icon: 'screen-full',
      shortcut: keyOf('shot.region'),
      onSelect: () => void screenshot('region'),
    },
    {
      label: 'Select element...',
      icon: 'inspect',
      shortcut: keyOf('shot.element'),
      onSelect: () => void screenshot('element'),
    },
  ];
  const drawingItems = () => captureMenu((mode) => void captureDrawing(mode), keyOf);

  // Keys: the shared shortcuts, by what is open (the element picker handles its own).
  const keyHandlers = useRef<Record<string, () => void>>({});
  useEffect(() => {
    const drawTools = Object.fromEntries(
      DRAW_TOOLS.map((t) => [`draw.${t}`, () => setDrawTool(t)]),
    );
    const colors = Object.fromEntries(
      COLORS.slice(0, 9).map((color, i) => [`draw.color${i + 1}`, () => setDrawStyle({ color })]),
    );
    const width = styles[drawTool]?.width ?? DEFAULT_STYLE.width;
    keyHandlers.current = {
      'mode.inspect': () => !viewing && toggleTool({ kind: 'inspect', purpose: 'copy' }),
      'mode.draw': () => !viewing && toggleTool({ kind: 'draw' }),
      'mode.screenshot': () =>
        viewing ? undefined : openMenuAt('.shot-button', screenshotItems(), 'screenshot'),
      'mode.device': () => (viewing ? closeResponsive() : void openResponsive()),
      'mode.devtools': () => !viewing && setPanel((p) => (p === 'console' ? null : 'console')),
      'page.bookmark': bookmarkPage,
      'open.shortcuts': () => setPanel((p) => (p === 'shortcuts' ? null : 'shortcuts')),
      ...drawTools,
      ...colors,
      'draw.thinner': () => setDrawStyle({ width: Math.max(1, width - (width > 6 ? 2 : 1)) }),
      'draw.thicker': () => setDrawStyle({ width: Math.min(24, width + (width >= 6 ? 2 : 1)) }),
      'draw.fill': () => setDrawStyle({ fill: !(styles[drawTool]?.fill ?? false) }),
      'draw.undo': doUndo,
      'draw.redo': doRedo,
      'draw.clear': () => updateShapes([], true),
      'draw.visible': () => setDrawingVisible((v) => !v),
      'draw.capture': () => void captureDrawing('area'),
      'draw.captureGroups': () => void captureDrawing('groups'),
      'draw.captureClean': () => void captureDrawing('clean'),
      'draw.captureViewport': () => void captureDrawing('viewport'),
      'draw.captureFullPage': () => void captureDrawing('fullPage'),
      'draw.captureMenu': () => openMenuAt('.draw-capture', drawingItems(), 'draw'),
      'draw.exit': () => setTool(null),
      'shot.viewport': () => void screenshot('viewport'),
      'shot.fullPage': () => void screenshot('fullPage'),
      'shot.region': () => void screenshot('region'),
      'shot.element': () => void screenshot('element'),
      'shot.drawing': () => void captureDrawing('area'),
    };
  });
  // A panel closes when the toolbar is pressed outside it (its own button toggles it). The page
  // stays usable next to it (picking, drawing, the page the console shows), and choosing from a
  // panel's own lists (portaled) counts as inside.
  useEffect(() => {
    if (!panel) return;
    return listenOutsidePress(
      () => [dock.current],
      pressedOpener(),
      () => setPanel(null),
      (event) => !bar.current || !event.composedPath().includes(bar.current) || isInPopup(event),
    );
  }, [panel]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      // The shortcuts panel records keys itself; the send dialog takes its own.
      if (panel === 'shortcuts' || offer) return;
      // The focused element, looked up in our shadow root too: from the window, a closed root's
      // insides are hidden from the event path.
      const root = bar.current?.getRootNode();
      const focused =
        event.composedPath().includes(host) && root instanceof ShadowRoot
          ? root.activeElement
          : event.composedPath()[0];
      const typing =
        focused instanceof HTMLElement &&
        (focused.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(focused.tagName));
      if (typing || tool?.kind === 'inspect' || tool?.kind === 'region') return;
      if (event.key === 'Escape' && (menu || (panel && tool?.kind !== 'draw'))) {
        if (menu) closeMenu();
        else setPanel(null);
        event.preventDefault();
        event.stopImmediatePropagation();
        return;
      }
      // An open menu takes its own scope's keys (the Screenshot menu's letters) or none.
      const scopes: ShortcutScope[] = menu
        ? menuScope
          ? [menuScope]
          : []
        : tool?.kind === 'draw'
          ? ['draw', 'global']
          : ['global'];
      const action = actionForChord(shortcuts.map, scopes, chordFromEvent(event));
      const run = action && TOOLBAR_IDS.has(action.id) && keyHandlers.current[action.id];
      if (!run) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (menu) closeMenu();
      run();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, tool, panel, menu, menuScope, shortcuts.map, host, offer]);
  if (!open) return null;
  // Panels open on the side of the bar with more room; the responsive view starts below the bar
  // when it rests at the top of the window.
  const alignRight = !!rest && rest.x + rest.width / 2 > size.width / 2;
  const above = !!rest && rest.y + rest.height / 2 > size.height / 2;
  const viewTop = !rest ? 0 : viewing ? rest.height : rest.y < 64 ? rest.y + rest.height + 8 : 0;
  const mapper: DrawMapper = { scale: 1, scroll, bounds: { left: 0, top: 0, ...size } };
  const anchors = measureAnchors(shapes);
  const style = styles[drawTool] ?? DEFAULT_STYLE;

  return (
    <div className={`inkspect${hidden ? ' capturing' : ''}${sampling ? ' sampling' : ''}`}>
      {(shapes.length > 0 || tool?.kind === 'draw') && (
        <div className="draw-host" ref={drawHost}>
          <DrawingLayer
            mapper={mapper}
            shapes={shapes}
            visible={drawingVisible}
            interactive={tool?.kind === 'draw'}
            tool={drawTool}
            style={style}
            onChange={updateShapes}
            liveRedactions
            pixelSource={freshImage}
            anchors={anchors}
            anchorAt={(point) => anchorAt(point[0] - scrollX, point[1] - scrollY, host)}
          />
        </div>
      )}
      {tool?.kind === 'inspect' && !offer && (
        <Inspector
          host={host}
          map={shortcuts.map}
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
          actionOf={(event) =>
            actionForChord(shortcuts.map, ['inspect'], chordFromEvent(event))?.id
          }
        />
      )}
      {tool?.kind === 'inspect' && !offer && selection.length > 0 && (
        <SelectionBar
          className="toolbar-selection-bar"
          count={selection.length}
          map={shortcuts.map}
          onAction={(action) => void onSelectionAction(action)}
        />
      )}
      {tool?.kind === 'region' && (
        <RegionSelect
          onCancel={() => setTool(null)}
          onDone={(rect) => {
            setTool(null);
            void shoot({ ...rect, x: rect.x + scrollX, y: rect.y + scrollY })
              .then((dataUrl) => deliver(dataUrl, 'Region screenshot'))
              .catch((error: unknown) => showToast(`Screenshot failed: ${String(error)}`));
          }}
        />
      )}
      {responsive && (
        <ResponsiveView
          top={viewTop}
          device={responsive}
          onDevice={setResponsive}
          zoom={zoom}
          onZoom={setZoom}
          src={frameSrc}
          frameRef={frame}
          emulationActive={panel === 'emulation'}
          onEmulation={() => setPanel((p) => (p === 'emulation' ? null : 'emulation'))}
          onClose={closeResponsive}
        />
      )}
      <div
        ref={floatRef}
        className={[
          'float',
          viewing && 'docked',
          alignRight && 'align-right',
          above && 'above',
          dragging && 'dragging',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <div className="bar" ref={bar} role="toolbar" aria-label="Inkspect">
          <div className="bar-row">
            <span className="bar-brand">
              <img src={chrome.runtime.getURL('icons/32.png')} alt="" />
              Inkspect
            </span>
            <span className="separator" />
            <IconButton
              icon="inspect"
              label={`${withKey('Select an element to copy its details for AI', 'mode.inspect')}${viewing ? NOT_IN_FRAME : ''}`}
              disabled={viewing}
              active={tool?.kind === 'inspect'}
              onClick={() => toggleTool({ kind: 'inspect', purpose: 'copy' })}
            />
            <IconButton
              icon="edit"
              label={`${withKey('Draw on the page', 'mode.draw')}${viewing ? NOT_IN_FRAME : ''}`}
              disabled={viewing}
              active={tool?.kind === 'draw'}
              onClick={() => toggleTool({ kind: 'draw' })}
            />
            <IconButton
              icon="device-camera"
              label={withKey('Screenshot', 'mode.screenshot')}
              className="shot-button"
              onClick={(event) =>
                openMenu(
                  event,
                  viewing
                    ? [
                        {
                          label: 'Device screen',
                          icon: 'device-mobile',
                          onSelect: () => {
                            const screen = frame.current?.parentElement;
                            if (!screen) return;
                            void captureElementRect(screen)
                              .then((dataUrl) => deliver(dataUrl, 'Device screenshot'))
                              .catch((error: unknown) =>
                                showToast(`Screenshot failed: ${String(error)}`),
                              );
                          },
                        },
                      ]
                    : screenshotItems(),
                  viewing ? undefined : 'screenshot',
                )
              }
            />
            <IconButton
              icon="device-mobile"
              label={withKey('Responsive view', 'mode.device')}
              active={viewing}
              onClick={() => (viewing ? closeResponsive() : void openResponsive())}
            />
            <IconButton
              icon="debug-console"
              label={`${withKey('Console and network (copy errors for AI)', 'mode.devtools')}${viewing ? NOT_IN_FRAME : ''}`}
              disabled={viewing}
              active={panel === 'console'}
              onClick={() => setPanel((p) => (p === 'console' ? null : 'console'))}
            />
            <IconButton
              icon="copy"
              label={`Copy page context for AI${viewing ? NOT_IN_FRAME : ''}`}
              disabled={viewing}
              onClick={() => void pageContext().then((text) => copy(text, 'Page context', 'page'))}
            />
            <IconButton
              icon={bookmarked ? 'star-full' : 'star-empty'}
              label={withKey(
                bookmarked ? 'Remove bookmark' : 'Bookmark this page',
                'page.bookmark',
              )}
              className={bookmarked ? 'bookmarked' : undefined}
              onClick={bookmarkPage}
            />
            <span className="separator" />
            <Button
              size="sm"
              variant="ghost"
              icon="layout-sidebar-right"
              className="saved-button"
              title="Saved captures of this page's project, in the side panel"
              onClick={openSaved}
            >
              Saved
            </Button>
            <span className="separator" />
            <IconButton
              icon="keyboard"
              label={withKey('Keyboard shortcuts (shared with VS Code)', 'open.shortcuts')}
              active={panel === 'shortcuts'}
              onClick={() => setPanel((p) => (p === 'shortcuts' ? null : 'shortcuts'))}
            />
            <IconButton
              icon={linked ? 'plug' : 'debug-disconnect'}
              label={linked ? `Linked with ${link.peer ?? 'VS Code'}` : 'Link with VS Code'}
              active={panel === 'link'}
              className={`link-${link.state}`}
              onClick={() => setPanel((p) => (p === 'link' ? null : 'link'))}
            />
            <IconButton
              icon="close"
              label="Close toolbar"
              onClick={() => {
                closeResponsive();
                setTool(null);
                setPanel(null);
                setOpen(false);
              }}
            />
            {!viewing && (
              <DragHandle
                label="Move the toolbar (drag, or use the arrow keys)"
                dragging={dragging}
                {...handle}
              />
            )}
          </div>
          {tool?.kind === 'draw' && (
            <DrawToolbar
              tool={drawTool}
              style={style}
              recentColors={recentColors}
              canUndo={undo.length > 0}
              canRedo={redo.length > 0}
              hasShapes={shapes.length > 0}
              visible={drawingVisible}
              onTool={setDrawTool}
              onStyle={setDrawStyle}
              keyOf={keyOf}
              onUndo={doUndo}
              onRedo={doRedo}
              onClear={() => updateShapes([], true)}
              onToggleVisible={() => setDrawingVisible((v) => !v)}
              onCapture={(x, y) => {
                setMenu({ x, y, items: drawingItems() });
                // Its items' keys (Alt+G...) work while it is open.
                setMenuScope('draw');
              }}
              onClose={() => setTool(null)}
            />
          )}
        </div>
        {panel && (
          <div className="panel-dock" ref={dock}>
            {panel === 'emulation' && (
              <EmulationPanel
                onClose={() => setPanel(null)}
                value={emulation}
                onChange={setEmulation}
              />
            )}
            {panel === 'console' && (
              <ConsolePanel
                onClose={() => setPanel(null)}
                toast={showToast}
                copy={(text, what, kind) => void copy(text, what, kind)}
                pageContext={pageContext}
              />
            )}
            {panel === 'shortcuts' && (
              <ShortcutsPanel
                onClose={() => setPanel(null)}
                map={shortcuts.map}
                overrides={shortcuts.overrides}
                linked={linked}
              />
            )}
            {panel === 'link' && (
              <LinkPanel onClose={() => setPanel(null)} toast={showToast} status={link} />
            )}
          </div>
        )}
      </div>
      {menu && <Menu menu={menu} onClose={closeMenu} />}
      {toast && (
        <div
          key={toast.id}
          className={`toast tone-${toast.tone ?? 'info'}`}
          role={toast.tone === 'error' ? 'alert' : 'status'}
          onPointerEnter={() => setToast((t) => (t?.id === toast.id ? { ...t, held: true } : t))}
          onPointerLeave={() => setToast((t) => (t?.id === toast.id ? { ...t, held: false } : t))}
        >
          <div className="toast-top">
            {toast.tone !== 'info' && (
              <span
                className={`toast-icon codicon codicon-${toast.tone === 'error' ? 'error' : 'pass-filled'}`}
                aria-hidden="true"
              />
            )}
            <div className="toast-body">
              <div className="toast-title">{toast.message}</div>
              {toast.detail && <div className="toast-detail">{toast.detail}</div>}
            </div>
            <IconButton
              icon="close"
              label="Dismiss"
              className="toast-close"
              onClick={() => setToast(null)}
            />
          </div>
        </div>
      )}
      {offer && (
        <SendModal
          title={offer.title}
          detail={offer.detail}
          images={offer.images}
          project={offer.project}
          projects={offer.projects.map((p) => ({
            path: p.path,
            name: p.name,
            detail: projectDetail(p),
          }))}
          onProject={
            offer.ids && link.features?.includes('items.move')
              ? (path) => void moveTo(path)
              : undefined
          }
          targets={offer.targets}
          defaultTarget={offer.defaultTarget}
          harnesses={offer.harnesses}
          emptyText={offer.empty}
          onSend={(target, { open, prompt }) => void sendTo(target, open, prompt)}
          canPrompt={!!link.features?.includes('send.prompt')}
          onCopy={() => void copyAgain()}
          onDownload={download}
          onClose={closeOffer}
          status={offer.status}
          map={shortcuts.map}
        />
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
