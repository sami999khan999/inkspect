import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  captureArea as drawingArea,
  clusterShapes,
  COLORS,
  DEFAULT_STYLE,
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
  TOOL_KEYS,
  type CaptureMode,
} from '@inkspect/shared/ui/DrawToolbar';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuItem, type MenuState } from '@inkspect/shared/ui/Menu';
import {
  TARGET_ATTRIBUTE,
  toBackground,
  type BridgeStatus,
  type CaptureKind,
  type SendTarget,
} from '../messages';
import { isMac, TOOLBAR_ACTIONS, watchShortcuts } from '../shortcuts';
import {
  captureArea,
  captureElementRect,
  captureVisible,
  fullPageArea,
  viewportArea,
  type HideUi,
} from './capture';
import { Inspector, type PickModifiers } from './Inspector';
import { pushPage } from './pagePush';
import {
  ConsolePanel,
  DEFAULT_EMULATION_OPTIONS,
  EmulationPanel,
  LinkPanel,
  ShortcutsPanel,
  type EmulationOptions,
} from './panels';
import { ResponsiveView, type Zoom } from './ResponsiveView';
import { LAST_USED, WindowPicker, windowOf } from './WindowPicker';
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
type Panel = 'emulation' | 'console' | 'link' | 'shortcuts';

/** The actions the toolbar handles (see ../shortcuts.ts). */
const TOOLBAR_IDS = new Set(TOOLBAR_ACTIONS.map((a) => a.id));

/** What the page tools say while the responsive view covers the page. */
const NOT_IN_FRAME = ' (not available in the responsive view yet)';

interface ToastAction {
  label: string;
  /** Codicon name. */
  icon: string;
  run: () => void;
  /** It goes to VS Code: the popup offers a choice of window when several are open. */
  toVsCode?: boolean;
}

interface ToastOptions {
  /** A second, quieter line. */
  detail?: string;
  /** Previews of the captured images (data URLs). */
  images?: string[];
  /** Without one, messages about failures are errors and the rest are plain. */
  tone?: 'info' | 'success' | 'error';
}

interface ToastState extends ToastOptions {
  id: number;
  message: string;
  actions?: ToastAction[];
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
  // Where the popup's sends go: the window used last, or one the user picked.
  const [sendWindow, setSendWindow] = useState(LAST_USED);
  const sendWindowRef = useRef(LAST_USED);
  const bar = useRef<HTMLDivElement>(null);
  const [barHeight, setBarHeight] = useState(0);
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
        setResponsive(null);
        setFrameSrc(null);
      }
      return !was;
    });
  }, [toggleSignal]);

  // The bar's height (it grows a row while drawing) is the room the page makes above itself.
  useLayoutEffect(() => {
    const el = bar.current;
    if (!open || !el) return;
    const observer = new ResizeObserver(() => setBarHeight(el.offsetHeight));
    observer.observe(el);
    return () => observer.disconnect();
  }, [open]);
  useEffect(() => {
    pushPage(open ? barHeight : 0, host);
  }, [open, barHeight, host]);
  useEffect(() => () => pushPage(0, host), [host]);

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

  const showToast = useCallback(
    (message: string, actions?: ToastAction[], options: ToastOptions = {}) => {
      const tone = options.tone ?? (FAILURE.test(message) ? 'error' : 'info');
      setToast({ id: Date.now(), message, actions, ...options, tone });
      // Each popup starts on the window used last; a choice holds for that popup only.
      setSendWindow(LAST_USED);
      sendWindowRef.current = LAST_USED;
    },
    [],
  );

  // The debugger's part of the responsive view (Chrome): user agent, touch, network, CPU, media.
  // Only what the debugger uses: the size changes all the time while dragging.
  const agentUserAgent = responsive?.userAgent;
  const agentTouch = responsive?.touch ?? false;
  useEffect(() => {
    if (__BROWSER__ !== 'chrome') return;
    const agent =
      viewing && emulation.agent && agentUserAgent
        ? { userAgent: agentUserAgent, touch: agentTouch }
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
  const windows = linked ? (link.windows ?? []) : [];

  const send = useCallback(
    async (
      target: SendTarget,
      payload: {
        text?: string;
        image?: string;
        label: string;
        capture?: string;
        kind?: CaptureKind;
      },
      /** The window picked where the send starts (the console panel); else the popup's choice. */
      picked?: string,
    ) => {
      // Read when sending: the popup's actions were made before a window was picked.
      const vscodeWindow = windowOf(picked ?? sendWindowRef.current);
      const reply = await toBackground({
        type: 'send',
        target,
        pageUrl: location.href,
        window: vscodeWindow,
        ...payload,
      });
      if (!reply.ok) showToast(reply.error, undefined, { tone: 'error' });
      else if (target === 'save')
        showToast('Saved to VS Code', undefined, { tone: 'success', detail: reply.path });
      else if (target === 'terminal')
        showToast('Sent to the terminal agent', undefined, { tone: 'success', detail: reply.path });
      else showToast('Sent to VS Code chat', undefined, { tone: 'success' });
    },
    [showToast],
  );

  /**
   * Every capture goes to VS Code's Agent Context list as it is taken (while linked), without
   * reaching an agent; later sends of it reuse that item (same `capture`). Quiet: no popup.
   */
  const share = useCallback(
    (
      capture: string,
      payload: { text?: string; image?: string; label: string; kind: CaptureKind },
    ) => {
      if (!linked) return;
      void toBackground({
        type: 'send',
        target: 'context',
        pageUrl: location.href,
        capture,
        ...payload,
      });
    },
    [linked],
  );

  const copy = useCallback(
    async (text: string, what: string, kind: CaptureKind = 'text') => {
      share(crypto.randomUUID(), { text, label: what, kind });
      const ok = await copyText(text);
      showToast(ok ? `${what} copied` : `Could not copy ${what.toLowerCase()}`, undefined, {
        tone: ok ? 'success' : 'error',
      });
    },
    [share, showToast],
  );

  /**
   * Finished screenshots: copy them (the clipboard holds one image: the first), then offer where
   * else they can go. Several images (each drawing separately) share one popup, and its actions
   * apply to all of them.
   */
  const deliver = useCallback(
    async (images: string | string[], label: string) => {
      const list = typeof images === 'string' ? [images] : images;
      if (!list.length) return;
      const many = list.length > 1;
      const labelOf = (index: number) => (many ? `${label} ${index + 1} of ${list.length}` : label);
      const captures = list.map(() => crypto.randomUUID());
      list.forEach((image, index) =>
        share(captures[index]!, { image, label: labelOf(index), kind: 'screenshot' }),
      );
      const copied = await copyImage(list[0]!);
      const download = () => {
        for (const dataUrl of list) {
          void toBackground({
            type: 'download',
            dataUrl,
            filename: `Inkspect/${screenshotName()}`,
          });
        }
      };
      const sendAll = (target: SendTarget) => async () => {
        for (const [index, image] of list.entries()) {
          await send(target, {
            image,
            label: labelOf(index),
            capture: captures[index],
            kind: 'screenshot',
          });
        }
      };
      const actions: ToastAction[] = linked
        ? [
            {
              label: 'Send to terminal',
              icon: 'terminal',
              run: () => void sendAll('terminal')(),
              toVsCode: true,
            },
            {
              label: 'Send to chat',
              icon: 'comment-discussion',
              run: () => void sendAll('chat')(),
              toVsCode: true,
            },
            {
              label: many ? 'Save all' : 'Save',
              icon: 'save',
              run: () => void sendAll('save')(),
              toVsCode: true,
            },
            {
              label: many ? 'Download all' : 'Download',
              icon: 'desktop-download',
              run: download,
            },
          ]
        : [
            {
              label: many ? 'Download all' : 'Download',
              icon: 'desktop-download',
              run: download,
            },
          ];
      const title = many
        ? `${list.length} ${label.toLowerCase()} captured`
        : `${label} ${copied ? 'copied' : 'taken'}`;
      const detail = many
        ? `${copied ? 'The first is copied. ' : ''}${linked ? 'Send them all to VS Code, or download them.' : 'Download them all to keep them.'}`
        : linked
          ? 'Paste it anywhere, or send it to VS Code.'
          : copied
            ? 'Paste it anywhere, or download it.'
            : 'Download it to keep it.';
      showToast(title, actions, { images: list, tone: 'success', detail });
      if (!copied && !linked && !many) download();
    },
    [linked, send, share, showToast],
  );

  const screenshot = useCallback(
    async (mode: 'viewport' | 'fullPage' | 'region' | 'element') => {
      if (mode === 'region') return setTool({ kind: 'region' });
      if (mode === 'element') return setTool({ kind: 'inspect', purpose: 'screenshot' });
      try {
        const area = mode === 'viewport' ? viewportArea() : fullPageArea();
        const { dataUrl } = await captureArea(area, hideUi);
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
      const what = details.length === 1 ? elementLabel(details[0]!) : `${details.length} elements`;
      const capture = crypto.randomUUID();
      const markdown = formatDetails(details, 'markdown', s.fields);
      share(capture, { text: markdown, label: `Element ${what}`, kind: 'element' });
      const ok = await copyText(text);
      showToast(
        ok ? `Copied details of ${what}` : 'Could not copy',
        linked
          ? [
              {
                label: 'Send to chat',
                icon: 'comment-discussion',
                toVsCode: true,
                run: () =>
                  void send('chat', {
                    text: markdown,
                    label: `Element ${what}`,
                    capture,
                    kind: 'element',
                  }),
              },
              {
                label: 'Send to terminal',
                icon: 'terminal',
                toVsCode: true,
                run: () =>
                  void send('terminal', {
                    text: markdown,
                    label: `Element ${what}`,
                    capture,
                    kind: 'element',
                  }),
              },
            ]
          : undefined,
        { tone: ok ? 'success' : 'error', detail: ok ? 'Paste it into your AI chat.' : undefined },
      );
    },
    [detailsOf, linked, send, share, showToast],
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
      // Alt+click is a screenshot of the element, and only that; a click copies its details.
      if (modifiers.screenshot) {
        try {
          const { dataUrl } = await captureElement(el);
          await deliver(dataUrl, 'Element screenshot');
        } catch (error) {
          showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
        }
        return;
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
            mode === 'clean' ? [] : group,
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
  /** The star: bookmarks the page, or removes its bookmark (like the browser's own star). */
  const bookmarkPage = () =>
    void toBackground(
      bookmarked
        ? { type: 'unbookmarkPage', url: location.href }
        : { type: 'bookmarkPage', url: location.href, title: document.title },
    ).then((reply) => {
      if (!reply.ok) return showToast(reply.error, undefined, { tone: 'error' });
      setBookmarked(!!reply.bookmarked);
      showToast(
        reply.bookmarked ? 'Bookmarked' : 'Bookmark removed',
        undefined,
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
      Object.values(TOOL_KEYS).map((t) => [`draw.${t}`, () => setDrawTool(t)]),
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
      'draw.captureMenu': () => openMenuAt('.draw-capture', drawingItems(), null),
      'draw.exit': () => setTool(null),
      'shot.viewport': () => void screenshot('viewport'),
      'shot.fullPage': () => void screenshot('fullPage'),
      'shot.region': () => void screenshot('region'),
      'shot.element': () => void screenshot('element'),
      'shot.drawing': () => void captureDrawing('area'),
    };
  });
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      // The shortcuts panel records keys itself.
      if (panel === 'shortcuts') return;
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
  }, [open, tool, panel, menu, menuScope, shortcuts.map, host]);
  if (!open) return null;

  const mapper: DrawMapper = { scale: 1, scroll, bounds: { left: 0, top: 0, ...size } };
  const style = styles[drawTool] ?? DEFAULT_STYLE;

  return (
    <div className={`inkspect${hidden ? ' capturing' : ''}${sampling ? ' sampling' : ''}`}>
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
            liveRedactions
            pixelSource={freshImage}
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
          actionOf={(event) =>
            actionForChord(shortcuts.map, ['inspect'], chordFromEvent(event))?.id
          }
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
      {responsive && (
        <ResponsiveView
          top={barHeight}
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
            label={withKey(bookmarked ? 'Remove bookmark' : 'Bookmark this page', 'page.bookmark')}
            className={bookmarked ? 'bookmarked' : undefined}
            onClick={bookmarkPage}
          />
          <span className="bar-spacer" />
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
            label="Close toolbar (Alt+Shift+I)"
            onClick={() => {
              closeResponsive();
              setTool(null);
              setPanel(null);
              setOpen(false);
            }}
          />
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
              setMenuScope(null);
            }}
            onClose={() => setTool(null)}
          />
        )}
      </div>
      {panel && (
        <div className="panel-dock" style={{ top: barHeight + 8 }}>
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
              send={(target, payload, picked) => void send(target, payload, picked)}
              linked={linked}
              windows={windows}
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
            {toast.images?.length ? (
              <div
                className={`toast-thumbs${toast.images.length > 1 ? ' many' : ''}`}
                aria-hidden="true"
              >
                {toast.images.slice(0, 3).map((image, index) => (
                  <img key={index} className="toast-thumb" src={image} alt="" />
                ))}
                {toast.images.length > 1 && (
                  <span className="toast-count">{toast.images.length}</span>
                )}
              </div>
            ) : (
              toast.tone !== 'info' && (
                <span
                  className={`toast-icon codicon codicon-${toast.tone === 'error' ? 'error' : 'pass-filled'}`}
                  aria-hidden="true"
                />
              )
            )}
            <div className="toast-body">
              <div className="toast-title">
                {toast.images?.length && (
                  <span className="toast-check codicon codicon-pass-filled" aria-hidden="true" />
                )}
                {toast.message}
              </div>
              {toast.detail && <div className="toast-detail">{toast.detail}</div>}
            </div>
            <IconButton
              icon="close"
              label="Dismiss"
              className="toast-close"
              onClick={() => setToast(null)}
            />
          </div>
          {toast.actions && (
            <div className="toast-bottom">
              {windows.length > 1 && toast.actions.some((action) => action.toVsCode) && (
                <div className="toast-target">
                  <span className="toast-target-label">Send to</span>
                  <WindowPicker
                    windows={windows}
                    className="toast-window"
                    value={sendWindow}
                    onChange={(value) => {
                      setSendWindow(value);
                      sendWindowRef.current = value;
                      // A choice was made: keep the popup until it is used.
                      setToast((t) => (t?.id === toast.id ? { ...t, held: true } : t));
                    }}
                  />
                </div>
              )}
              <div className="toast-actions">
                {toast.actions.map((action, index) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant={
                      !action.toVsCode
                        ? 'ghost'
                        : index === 0 && toast.actions!.length > 1
                          ? 'primary'
                          : 'secondary'
                    }
                    className={action.toVsCode ? undefined : 'toast-local'}
                    icon={action.icon}
                    onClick={() => {
                      action.run();
                      setToast(null);
                    }}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          )}
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
