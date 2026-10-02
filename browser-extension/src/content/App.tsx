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
  keyParts,
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
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuItem, type MenuState } from '@inkspect/shared/ui/Menu';
import { isInPopup, listenOutsidePress, pressedOpener } from '@inkspect/shared/ui/popover';
import { SelectionBar, type SelectionAction } from '@inkspect/shared/ui/SelectionBar';
import { ThumbPicker } from '@inkspect/shared/ui/ThumbPicker';
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
import type { CaptureToSave, Project } from '@inkspect/shared/hub';
import { ProjectPicker, thumbnailOf } from './ProjectPicker';
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
  /** `anchor`: the button, when clicked (a menu opens under it). */
  run: (anchor?: HTMLElement) => void;
  /** It needs an agent in the picked project: off for projects where none runs. */
  needsAgent?: boolean;
  /** It goes to VS Code: the popup offers a choice of window when several are open. */
  toVsCode?: boolean;
  /** It saves into a project (browser helper): the popup offers the choice of project. */
  toProject?: boolean;
  /** Its shortcut action (`capture.*`), which runs it while the popup shows. */
  shortcut?: string;
  /** Its label when only some of several screenshots are checked ("Send 2 to chat"). */
  partial?: (count: number) => string;
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

/**
 * The popup's actions with the browser helper: send to the picked project's agent, to another of
 * its agents (a menu under the button), or only save into it.
 */
function projectActions(
  save: (send?: string) => Promise<void>,
  openTargetMenu: (anchor: HTMLElement | undefined, pick: (target: string) => void) => void,
  many = false,
): ToastAction[] {
  return [
    {
      label: 'Send to agent',
      icon: 'send',
      shortcut: 'capture.terminal',
      partial: (n) => `Send ${n} to agent`,
      toProject: true,
      needsAgent: true,
      run: () => void save('default'),
    },
    {
      label: 'Send to…',
      icon: 'list-selection',
      shortcut: 'capture.chat',
      toProject: true,
      needsAgent: true,
      run: (anchor) => openTargetMenu(anchor, (target) => void save(target)),
    },
    {
      label: many ? 'Save all to project' : 'Save to project',
      icon: 'save',
      shortcut: 'capture.save',
      partial: (n) => `Save ${n} to project`,
      toProject: true,
      run: () => void save(),
    },
  ];
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
  // With the browser helper: the projects, and the one the popup saves into.
  const [projects, setProjects] = useState<Project[]>([]);
  const projectsRef = useRef<Project[]>([]);
  const [project, setProjectState] = useState<string | undefined>();
  const projectRef = useRef<string | undefined>(undefined);
  const setProject = (path: string | undefined) => {
    projectRef.current = path;
    setProjectState(path);
  };
  /** The toast showing now, for sends that finish later (see send). */
  const toastRef = useRef<ToastState | null>(null);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);
  const bar = useRef<HTMLDivElement>(null);
  const dock = useRef<HTMLDivElement>(null);
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

  const [toastChecked, setToastChecked] = useState<ReadonlySet<number>>(new Set());
  const toastCheckedRef = useRef<ReadonlySet<number>>(new Set());
  const setChecked = (next: ReadonlySet<number>) => {
    toastCheckedRef.current = next;
    setToastChecked(next);
  };
  const showToast = useCallback(
    (message: string, actions?: ToastAction[], options: ToastOptions = {}) => {
      const tone = options.tone ?? (FAILURE.test(message) ? 'error' : 'info');
      setToast({ id: Date.now(), message, actions, ...options, tone });
      // Several screenshots: all checked to start with.
      const all = new Set((options.images ?? []).map((_, index) => index));
      toastCheckedRef.current = all;
      setToastChecked(all);
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
      // Choices and errors are read, not glanced at.
      toast.actions ? 12_000 : toast.tone === 'error' ? 8000 : 3500,
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
  // The browser helper is there: captures are saved into projects (even without VS Code).
  const viaHub = link.via === 'hub';

  /** Asks the helper for the projects, and starts the popup on the one this page suggests. */
  const refreshProjects = useCallback(async () => {
    const reply = await toBackground({ type: 'projects', url: location.href });
    if (!reply.ok || !reply.projects) return;
    projectsRef.current = reply.projects;
    setProjects(reply.projects);
    projectRef.current = reply.suggested ?? reply.projects[0]?.path;
    setProjectState(projectRef.current);
  }, []);

  /**
   * Saves captures into the project picked in the popup (see ProjectPicker); with `send` (a
   * target, or 'default'), sends them to that agent too.
   */
  const saveToProject = useCallback(
    async (captures: CaptureToSave[], send?: string) => {
      const path = projectRef.current;
      const name = projects.find((p) => p.path === path)?.name ?? path?.split('/').pop();
      if (!path) {
        showToast(
          'No project to save into: open one in VS Code or start an agent in it.',
          undefined,
          {
            tone: 'error',
          },
        );
        return;
      }
      const reply = await toBackground({
        type: 'saveCapture',
        project: path,
        url: location.href,
        captures,
        send,
      });
      if (!reply.ok) showToast(reply.error, undefined, { tone: 'error' });
      else if (send)
        showToast(`Sent to ${reply.sentTo ?? 'the agent'}`, undefined, {
          tone: 'success',
          detail: `Saved in ${name} too. Add your prompt there and press Enter.`,
        });
      else
        showToast(`Saved to ${name}`, undefined, {
          tone: 'success',
          detail: 'It shows in the Agent Context of that project.',
        });
    },
    [projects, showToast],
  );

  /** Whether an agent runs in the project picked in the popup (read when a key is pressed). */
  const projectHasAgent = () =>
    !!projectsRef.current.find((p) => p.path === projectRef.current)?.targets?.length;

  /** A menu of the picked project's agents, under the popup's "Send to…" button. */
  const openTargetMenu = useCallback(
    (anchor: HTMLElement | undefined, pick: (target: string) => void) => {
      const project = projectsRef.current.find((p) => p.path === projectRef.current);
      const targets = project?.targets ?? [];
      const rect = anchor?.getBoundingClientRect();
      setMenu({
        x: rect?.left ?? window.innerWidth / 2,
        y: rect ? rect.bottom + 4 : window.innerHeight - 200,
        items: targets.length
          ? targets.map((t) => ({
              label: `${t.label} · ${t.detail}`,
              icon:
                t.kind === 'chat'
                  ? 'comment-discussion'
                  : t.kind === 'tmux'
                    ? 'terminal-tmux'
                    : 'terminal',
              onSelect: () => pick(t.id),
            }))
          : [{ label: 'No agent runs in this project', disabled: true, onSelect: () => {} }],
      });
    },
    [],
  );

  const send = useCallback(
    async (
      target: SendTarget,
      payload: {
        text?: string;
        image?: string;
        label: string;
        capture?: string;
        kind?: CaptureKind;
        /** Captures already in Agent Context, sent together in one send. */
        captures?: string[];
      },
      /**
       * The window picked where the send starts: the popup's choice (read when its button is
       * pressed), the console panel's; else the window used last.
       */
      picked: string = LAST_USED,
    ) => {
      const vscodeWindow = windowOf(picked);
      // The popup showing when the send started: a newer one (another capture, waiting for a
      // choice) must not be replaced by this send's result.
      const started = toastRef.current?.id;
      const reply = await toBackground({
        type: 'send',
        target,
        pageUrl: location.href,
        window: vscodeWindow,
        ...payload,
      });
      const newer = toastRef.current;
      if (reply.ok && newer && newer.id !== started && newer.actions) return;
      if (!reply.ok) showToast(reply.error, undefined, { tone: 'error' });
      else if (target === 'save')
        showToast('Saved to VS Code', undefined, { tone: 'success', detail: reply.path });
      else if (target === 'terminal')
        showToast('Sent to the terminal agent', undefined, { tone: 'success', detail: reply.path });
      else if (target === 'chat') showToast('Sent to VS Code chat', undefined, { tone: 'success' });
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
      payload: { text?: string; image?: string; label: string; kind: CaptureKind; group?: string },
      /** The VS Code window (the popup's choice when sending); the one used last if unset. */
      window?: string,
      /**
       * Taken just now, not on the way to a send. With the browser helper, captures go to the
       * project the user saves them into, not to whichever window answers the link.
       */
      automatic = false,
    ) => {
      if (!linked || (automatic && viaHub)) return Promise.resolve();
      return toBackground({
        type: 'send',
        target: 'context',
        pageUrl: location.href,
        window,
        capture,
        ...payload,
      }).then(() => undefined);
    },
    [linked, viaHub],
  );

  const copy = useCallback(
    async (text: string, what: string, kind: CaptureKind = 'text') => {
      void share(crypto.randomUUID(), { text, label: what, kind }, undefined, true);
      const ok = await copyText(text);
      if (viaHub) void refreshProjects();
      showToast(
        ok ? `${what} copied` : `Could not copy ${what.toLowerCase()}`,
        viaHub
          ? projectActions(
              (send) => saveToProject([{ kind, title: what, text }], send),
              openTargetMenu,
            )
          : undefined,
        { tone: ok ? 'success' : 'error' },
      );
    },
    [openTargetMenu, refreshProjects, saveToProject, share, showToast, viaHub],
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
      // Taken together: one group in VS Code's Agent Context, sent together.
      const group = many ? crypto.randomUUID() : undefined;
      list.forEach(
        (image, index) =>
          void share(
            captures[index]!,
            { image, label: labelOf(index), kind: 'screenshot', group },
            undefined,
            true,
          ),
      );
      if (viaHub) void refreshProjects();
      const copied = await copyImage(list[0]!);
      // The screenshots checked in the popup (all, unless some were unchecked).
      const picked = () =>
        list.map((_, index) => index).filter((i) => toastCheckedRef.current.has(i));
      const download = () => {
        for (const index of picked()) {
          void toBackground({
            type: 'download',
            dataUrl: list[index]!,
            filename: `Inkspect/${screenshotName()}`,
          });
        }
      };
      const sendAll = (target: SendTarget) => async () => {
        // The window picked in the popup, read as its button is pressed (it closes then).
        const chosen = sendWindowRef.current;
        const indexes = picked();
        if (many && (target === 'chat' || target === 'terminal') && indexes.length) {
          // In the chosen window's Agent Context first (the automatic share went to the window
          // used last), then one send with all of them.
          for (const index of indexes) {
            await share(
              captures[index]!,
              { image: list[index], label: labelOf(index), kind: 'screenshot', group },
              windowOf(chosen),
            );
          }
          await send(
            target,
            {
              label: `${indexes.length} screenshots`,
              kind: 'screenshot',
              captures: indexes.map((index) => captures[index]!),
            },
            chosen,
          );
          return;
        }
        for (const index of indexes) {
          await send(
            target,
            {
              image: list[index],
              label: labelOf(index),
              capture: captures[index],
              kind: 'screenshot',
            },
            chosen,
          );
        }
      };
      const saveAll = async (send?: string) => {
        const indexes = picked();
        const thumbs = await Promise.all(indexes.map((index) => thumbnailOf(list[index]!)));
        await saveToProject(
          indexes.map((index, i) => ({
            kind: 'screenshot',
            title: labelOf(index),
            image: list[index]!.replace(/^data:image\/\w+;base64,/, ''),
            thumb: thumbs[i],
            group,
            groupIndex: many ? index : undefined,
          })),
          send,
        );
      };
      const download_: ToastAction = {
        label: many ? 'Download all' : 'Download',
        icon: 'desktop-download',
        shortcut: 'capture.download',
        partial: (n) => `Download ${n}`,
        run: download,
      };
      // With the browser helper, everything goes through the picked project.
      const actions: ToastAction[] = viaHub
        ? [...projectActions(saveAll, openTargetMenu, many), download_]
        : linked
          ? [
              {
                label: 'Send to terminal',
                icon: 'terminal',
                shortcut: 'capture.terminal',
                partial: (n) => `Send ${n} to terminal`,
                run: () => void sendAll('terminal')(),
                toVsCode: true,
              },
              {
                label: 'Send to chat',
                icon: 'comment-discussion',
                shortcut: 'capture.chat',
                partial: (n) => `Send ${n} to chat`,
                run: () => void sendAll('chat')(),
                toVsCode: true,
              },
              ...(viaHub
                ? []
                : [
                    {
                      label: many ? 'Save all' : 'Save',
                      icon: 'save',
                      shortcut: 'capture.save',
                      partial: (n: number) => `Save ${n}`,
                      run: () => void sendAll('save')(),
                      toVsCode: true,
                    },
                  ]),
              {
                label: many ? 'Download all' : 'Download',
                icon: 'desktop-download',
                shortcut: 'capture.download',
                partial: (n) => `Download ${n}`,
                run: download,
              },
            ]
          : [download_];
      const title = many
        ? `${list.length} ${label.toLowerCase()} captured`
        : `${label} ${copied ? 'copied' : 'taken'}`;
      const detail = many
        ? `${copied ? 'The first is copied. ' : ''}Uncheck any you don't want, then ${linked ? 'send them to VS Code or download them' : 'download them'}.`
        : linked
          ? 'Paste it anywhere, or send it to VS Code.'
          : copied
            ? 'Paste it anywhere, or download it.'
            : 'Download it to keep it.';
      showToast(title, actions, { images: list, tone: 'success', detail });
      if (!copied && !linked && !viaHub && !many) download();
    },
    [linked, openTargetMenu, refreshProjects, saveToProject, send, share, showToast, viaHub],
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

  // The bar over a Shift+click selection: every choice acts on all the selected elements.
  const onSelectionAction = async (action: SelectionAction) => {
    const list = selection;
    setSelection([]);
    if (action === 'clear') return;
    if (action === 'copy') await copyElements(list);
    else if (action === 'screenshot') {
      try {
        const shots = [];
        for (const el of list) shots.push((await captureElement(el)).dataUrl);
        await deliver(shots, list.length === 1 ? 'Element screenshot' : 'Element screenshots');
      } catch (error) {
        showToast(`Screenshot failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    } else await copyElements(list, action);
  };

  // Copies the elements' details, or with `target` sends them to that agent (or saves them).
  const copyElements = useCallback(
    async (elements: Element[], target?: 'chat' | 'terminal' | 'save') => {
      const s = settings.current ?? (await loadSettings());
      const details = await Promise.all(elements.map(detailsOf));
      const one = details.length === 1;
      const what = one ? elementLabel(details[0]!) : `${details.length} elements`;
      const markdown = formatDetails(details, 'markdown', s.fields);
      // In VS Code's Agent Context, one item per element; several share a group (one card, a
      // checkbox each, sent together).
      const group = one ? undefined : crypto.randomUUID();
      const captures = details.map(() => crypto.randomUUID());
      const shareEach = (vscodeWindow?: string) =>
        Promise.all(
          details.map((d, index) =>
            share(
              captures[index]!,
              {
                text: one ? markdown : formatDetails([d], 'markdown', s.fields),
                label: `Element ${elementLabel(d)}`,
                kind: 'element',
                group,
              },
              vscodeWindow,
            ),
          ),
        );
      /** `chosen`: the window picked in the popup (else the one used last). */
      const sendTo = async (to: 'chat' | 'terminal', chosen: string = LAST_USED) => {
        if (one) {
          await send(
            to,
            { text: markdown, label: `Element ${what}`, capture: captures[0], kind: 'element' },
            chosen,
          );
          return;
        }
        // In the chosen window's list first (the automatic share went to the window used last),
        // then one send with all of them.
        await shareEach(windowOf(chosen));
        await send(to, { label: what, kind: 'element', captures }, chosen);
      };
      if (target === 'save') {
        await send('save', {
          text: markdown,
          label: one ? `Element ${what}` : what,
          kind: 'element',
        });
        return;
      }
      if (target) {
        await sendTo(target);
        return;
      }
      const text = formatDetails(details, s.copyFormat, s.fields);
      if (!viaHub) void shareEach();
      const ok = await copyText(text);
      if (viaHub) void refreshProjects();
      const saveElements = (send?: string) =>
        saveToProject(
          details.map((d, index) => ({
            kind: 'element',
            title: `Element ${elementLabel(d)}`,
            text: one ? markdown : formatDetails([d], 'markdown', s.fields),
            group,
            groupIndex: one ? undefined : index,
          })),
          send,
        );
      showToast(
        ok ? `Copied details of ${what}` : 'Could not copy',
        viaHub
          ? projectActions(saveElements, openTargetMenu)
          : linked
            ? [
                {
                  label: 'Send to chat',
                  icon: 'comment-discussion',
                  shortcut: 'capture.chat',
                  toVsCode: true,
                  run: () => void sendTo('chat', sendWindowRef.current),
                },
                {
                  label: 'Send to terminal',
                  icon: 'terminal',
                  shortcut: 'capture.terminal',
                  toVsCode: true,
                  run: () => void sendTo('terminal', sendWindowRef.current),
                },
              ]
            : undefined,
        { tone: ok ? 'success' : 'error', detail: ok ? 'Paste it into your AI chat.' : undefined },
      );
    },
    [
      detailsOf,
      linked,
      openTargetMenu,
      refreshProjects,
      saveToProject,
      send,
      share,
      showToast,
      viaHub,
    ],
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
      await copyElements([el], modifiers.send);
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
      DRAW_TOOLS.map((t) => [`draw.${t}`, () => setDrawTool(t)]),
    );
    const colors = Object.fromEntries(
      COLORS.slice(0, 9).map((color, i) => [`draw.color${i + 1}`, () => setDrawStyle({ color })]),
    );
    const width = styles[drawTool]?.width ?? DEFAULT_STYLE.width;
    // The popup's buttons, by their shortcut (only while it shows one for that action).
    // Only the popup's own buttons have keys (the others go to the page), and a button that
    // is off (no screenshot checked) is off for its key too.
    const images = toast?.images && toast.images.length > 1 ? toast.images.length : 0;
    const toastKeys = Object.fromEntries(
      (toast?.actions ?? [])
        .filter((action) => action.shortcut)
        .map((action) => [
          action.shortcut!,
          () => {
            if (action.partial && images && !toastCheckedRef.current.size) return;
            if (action.needsAgent && !projectHasAgent()) return;
            action.run();
            setToast(null);
          },
        ]),
    );
    keyHandlers.current = {
      ...toastKeys,
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
      // The popup after a capture takes its keys (capture.*) while it shows.
      const capture: ShortcutScope[] = toast?.actions ? ['capture'] : [];
      const scopes: ShortcutScope[] = menu
        ? menuScope
          ? [menuScope]
          : []
        : tool?.kind === 'draw'
          ? [...capture, 'draw', 'global']
          : [...capture, 'global'];
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
  }, [open, tool, panel, menu, menuScope, shortcuts.map, host, toast]);
  if (!open) return null;
  const toastKeys = actionKeys(toast?.actions ?? [], shortcuts.map);
  // The project the popup saves into, and where its Send goes.
  const pickedProject = projects.find((p) => p.path === project);
  const defaultAgent = pickedProject?.targets?.find((t) => t.id === pickedProject.defaultTarget);
  // Several screenshots: how many are checked ("Send 2 to chat").
  const imageCount = toast?.images && toast.images.length > 1 ? toast.images.length : 0;
  const pickedCount = imageCount ? toastChecked.size : 0;

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
      {tool?.kind === 'inspect' && selection.length > 0 && (
        <SelectionBar
          className="toolbar-selection-bar"
          count={selection.length}
          map={shortcuts.map}
          canSend={linked}
          onAction={(action) => void onSelectionAction(action)}
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
            label="Close toolbar"
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
              // Its items' keys (Alt+G...) work while it is open.
              setMenuScope('draw');
            }}
            onClose={() => setTool(null)}
          />
        )}
      </div>
      {panel && (
        <div className="panel-dock" ref={dock} style={{ top: barHeight + 8 }}>
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
          // Working it from the keyboard holds it too.
          onFocus={() => setToast((t) => (t?.id === toast.id ? { ...t, held: true } : t))}
          onBlur={(event) => {
            if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
            setToast((t) => (t?.id === toast.id ? { ...t, held: false } : t));
          }}
        >
          <div className="toast-top">
            {toast.images?.length === 1 ? (
              <div className="toast-thumbs" aria-hidden="true">
                <img className="toast-thumb" src={toast.images[0]} alt="" />
              </div>
            ) : toast.images?.length ? (
              <span className="toast-icon toast-count-icon" aria-hidden="true">
                {toast.images.length}
              </span>
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
                {toast.images?.length === 1 && (
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
          {toast.images && toast.images.length > 1 && (
            <ThumbPicker
              className="toast-picker"
              items={toast.images.map((src, index) => ({
                id: String(index),
                src,
                label: `Screenshot ${index + 1} of ${toast.images!.length}`,
              }))}
              checked={new Set([...toastChecked].map(String))}
              onToggle={(id) => {
                const next = new Set(toastChecked);
                const index = Number(id);
                if (next.has(index)) next.delete(index);
                else next.add(index);
                setChecked(next);
                // A choice was made: keep the popup until it is used.
                setToast((t) => (t?.id === toast.id ? { ...t, held: true } : t));
              }}
            />
          )}
          {toast.actions && (
            <div className="toast-bottom">
              {viaHub && toast.actions.some((action) => action.toProject) && (
                <div className="toast-target">
                  <span className="toast-target-label">Project</span>
                  <ProjectPicker
                    projects={projects}
                    className="toast-window"
                    value={project}
                    onChange={(value) => {
                      setProject(value);
                      // A choice was made: keep the popup until it is used.
                      setToast((t) => (t?.id === toast.id ? { ...t, held: true } : t));
                    }}
                  />
                  <span className="toast-target-label toast-agent">
                    {defaultAgent
                      ? `Send goes to ${defaultAgent.label} · ${defaultAgent.detail}`
                      : 'No agent runs here: save only'}
                  </span>
                </div>
              )}
              {!viaHub && windows.length > 1 && toast.actions.some((action) => action.toVsCode) && (
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
                {toastKeys.prefix.length > 0 && (
                  <span className="toast-keys" title="Hold these, then press a button's key">
                    <span className="keycaps size-sm">
                      {toastKeys.prefix.map((cap) => (
                        <kbd key={cap} className="keycap">
                          {cap}
                        </kbd>
                      ))}
                    </span>
                    +
                  </span>
                )}
                {toast.actions.map((action, index) => (
                  <Button
                    key={action.label}
                    size="sm"
                    variant={
                      !action.toVsCode && !action.toProject
                        ? 'ghost'
                        : index === 0 && toast.actions!.length > 1
                          ? 'primary'
                          : 'secondary'
                    }
                    className={action.toVsCode || action.toProject ? undefined : 'toast-local'}
                    icon={action.icon}
                    title={toastKeys.titles[index]}
                    aria-keyshortcuts={toastKeys.aria[index]}
                    disabled={
                      (!!action.partial && imageCount > 0 && pickedCount === 0) ||
                      (!!action.needsAgent && !pickedProject?.targets?.length)
                    }
                    onClick={(event) => {
                      action.run(event.currentTarget);
                      setToast(null);
                    }}
                  >
                    {action.partial && pickedCount < imageCount
                      ? action.partial(pickedCount)
                      : action.label}
                    {toastKeys.caps[index]!.length > 0 && (
                      <span className="keycaps size-sm">
                        {toastKeys.caps[index]!.map((cap) => (
                          <kbd key={cap} className="keycap">
                            {cap}
                          </kbd>
                        ))}
                      </span>
                    )}
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

/**
 * The popup buttons' keys as caps. When every key shares its modifiers (Alt+Shift by default),
 * those show once before the buttons ("Alt Shift +") and each button shows only its key.
 */
function actionKeys(actions: readonly ToastAction[], map: ShortcutMap) {
  const bindings = actions.map((a) => (a.shortcut ? map[a.shortcut]?.[0] : undefined));
  const full = bindings.map((b) => (b ? keyParts(b, isMac) : []));
  const bound = full.filter((parts) => parts.length > 0);
  const first = bound[0];
  const shared = first && first.length > 1 && bound.length > 1 ? first.slice(0, -1) : [];
  const prefix = bound.every(
    (parts) => parts.length === shared.length + 1 && parts.slice(0, -1).join() === shared.join(),
  )
    ? shared
    : [];
  return {
    prefix,
    caps: full.map((parts) => parts.slice(prefix.length)),
    titles: bindings.map((b, i) =>
      b ? `${actions[i]!.label} (${formatKey(b, isMac)})` : undefined,
    ),
    // aria-keyshortcuts wants "Alt+Shift+C".
    aria: bindings.map((b) =>
      b
        ?.split('+')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join('+'),
    ),
  };
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
