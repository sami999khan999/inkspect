// Runs in the page's own JavaScript world (injected by the extension when the toolbar opens).
// Framework internals (React fibers, Vue instances...) are only visible here, and hooking
// `console` and `fetch` needs the page's own objects. It answers the content script through DOM
// events and never exposes anything to the page itself.
import { accessibleInfo, COLLECT_HELPERS, collectElementDetails } from '@inkspect/shared/collect';
import {
  formatConsoleArguments,
  type ConsoleEntry,
  type ConsoleLevel,
  type NetworkEntry,
} from '@inkspect/shared/devtools';
import {
  PAGE_REQUEST_EVENT,
  PAGE_RESPONSE_EVENT,
  TARGET_ATTRIBUTE,
  type PageRequest,
} from '../messages';

type InkspectWindow = Window & { __inkspectMain?: boolean };

const MAX_ENTRIES = 500;

function install(): void {
  const w = window as InkspectWindow;
  if (w.__inkspectMain) return;
  w.__inkspectMain = true;

  const consoleEntries: ConsoleEntry[] = [];
  const network: NetworkEntry[] = [];
  let nextId = 1;

  const push = <T>(list: T[], entry: T) => {
    list.push(entry);
    if (list.length > MAX_ENTRIES) list.splice(0, list.length - MAX_ENTRIES);
  };

  /** Where a console call came from: the first stack frame outside this file. */
  const callSite = (): { url?: string; line?: number; column?: number } => {
    const stack = new Error().stack?.split('\n').slice(3) ?? [];
    for (const frame of stack) {
      const match =
        /\(?((?:https?|file|chrome-extension|moz-extension):\/\/[^\s)]+?):(\d+):(\d+)\)?\s*$/.exec(
          frame,
        );
      if (match && !/main-world\.js/.test(match[1]!)) {
        return { url: match[1], line: Number(match[2]) - 1, column: Number(match[3]) - 1 };
      }
    }
    return {};
  };

  const describe = (value: unknown): string => {
    if (value instanceof Error) return value.stack || `${value.name}: ${value.message}`;
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value) ?? String(value);
    } catch {
      return String(value);
    }
  };

  const levels: [keyof Console, ConsoleLevel][] = [
    ['error', 'error'],
    ['warn', 'warning'],
    ['info', 'info'],
    ['log', 'info'],
    ['debug', 'debug'],
  ];
  for (const [method, level] of levels) {
    const original = console[method] as (...args: unknown[]) => void;
    (console as unknown as Record<string, unknown>)[method] = function (...args: unknown[]) {
      try {
        push(consoleEntries, {
          id: nextId++,
          time: Date.now(),
          level,
          // `%s`, `%d`, `%c`... applied like DevTools does (styles dropped), not printed.
          text: formatConsoleArguments(args.map(describe)).slice(0, 4000),
          source: 'console',
          ...callSite(),
        });
      } catch {
        // Never break the page's own logging.
      }
      return original.apply(this, args);
    };
  }

  window.addEventListener(
    'error',
    (event) => {
      const target = event.target as (Element & { src?: string; href?: string }) | null;
      if (target && target !== (window as unknown) && target instanceof Element) {
        // A resource (image, script, stylesheet) failed to load.
        const url = target.src || target.href;
        if (url) {
          push(network, {
            id: `r${nextId++}`,
            method: 'GET',
            url,
            type: target.tagName.toLowerCase(),
            time: Date.now(),
            error: 'Failed to load',
          });
        }
        return;
      }
      push(consoleEntries, {
        id: nextId++,
        time: Date.now(),
        level: 'error',
        text: event.error instanceof Error ? describe(event.error) : event.message,
        source: 'exception',
        url: event.filename || undefined,
        line: event.lineno ? event.lineno - 1 : undefined,
        column: event.colno ? event.colno - 1 : undefined,
      });
    },
    true,
  );
  window.addEventListener('unhandledrejection', (event) => {
    push(consoleEntries, {
      id: nextId++,
      time: Date.now(),
      level: 'error',
      text: `Uncaught (in promise) ${describe(event.reason)}`,
      source: 'exception',
    });
  });

  const originalFetch = window.fetch;
  window.fetch = async function (...args: Parameters<typeof fetch>) {
    const [input, init] = args;
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    const method = (
      init?.method || (input instanceof Request ? input.method : 'GET')
    ).toUpperCase();
    const entry: NetworkEntry = {
      id: `f${nextId++}`,
      method,
      url,
      type: 'fetch',
      time: Date.now(),
    };
    push(network, entry);
    try {
      const response = await originalFetch.apply(this, args);
      entry.status = response.status;
      entry.mimeType = response.headers.get('content-type') ?? undefined;
      entry.duration = Date.now() - entry.time;
      return response;
    } catch (error) {
      entry.error = error instanceof Error ? error.message : String(error);
      entry.canceled = error instanceof DOMException && error.name === 'AbortError';
      entry.duration = Date.now() - entry.time;
      throw error;
    }
  };

  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;
  const entries = new WeakMap<XMLHttpRequest, NetworkEntry>();
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    method: string,
    url: string | URL,
    ...rest: unknown[]
  ) {
    entries.set(this, {
      id: `x${nextId++}`,
      method: method.toUpperCase(),
      url: new URL(url, location.href).href,
      type: 'xhr',
      time: Date.now(),
    });
    return (open as (...a: unknown[]) => void).call(this, method, url, ...rest);
  } as typeof XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.send = function (this: XMLHttpRequest, ...args) {
    const entry = entries.get(this);
    if (entry) {
      entry.time = Date.now();
      push(network, entry);
      this.addEventListener('loadend', () => {
        entry.duration = Date.now() - entry.time;
        if (this.status) entry.status = this.status;
        else entry.error = 'Failed';
      });
    }
    return send.apply(this, args);
  };

  window.addEventListener(PAGE_REQUEST_EVENT, (event) => {
    const { id, request } = JSON.parse((event as CustomEvent<string>).detail) as {
      id: string;
      request: PageRequest;
    };
    let result: unknown;
    try {
      if (request.kind === 'collect') {
        const el = document.querySelector(`[${TARGET_ATTRIBUTE}]`);
        if (el) {
          // The marker attribute must not end up in the copied details.
          el.removeAttribute(TARGET_ATTRIBUTE);
          result = {
            ...collectElementDetails(el, request.maxHtml, COLLECT_HELPERS),
            ...accessibleInfo(el),
          };
          el.setAttribute(TARGET_ATTRIBUTE, '');
        }
      } else if (request.kind === 'logs') {
        result = { console: consoleEntries, network };
      } else if (request.kind === 'clearLogs') {
        consoleEntries.length = 0;
        network.length = 0;
      }
    } catch (error) {
      result = { error: error instanceof Error ? error.message : String(error) };
    }
    window.dispatchEvent(
      new CustomEvent(PAGE_RESPONSE_EVENT, { detail: JSON.stringify({ id, result }) }),
    );
  });
}

install();
