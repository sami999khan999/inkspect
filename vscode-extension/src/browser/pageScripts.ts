// JavaScript that runs inside web pages. These are strings because they execute in the page,
// not in the extension host; each one must be self-contained.

/** Name of the `Runtime.addBinding` function pages use to report events to the host. */
export const BINDING_NAME = '__vscodeBrowserHost';

/** Messages the page script sends through the binding. Untrusted: pages can call it too. */
export type PageMessage =
  | { kind: 'cursor'; cursor: string }
  | { kind: 'contextmenu'; [key: string]: unknown }
  | { kind: 'fullscreen'; active: boolean }
  | { kind: 'audible'; audible: boolean };

/**
 * Installed in every document (all frames in the tab's process). Reports the mouse cursor, context
 * menu requests the page did not handle itself, fullscreen changes and audio playback.
 */
export const PAGE_SCRIPT = `(() => {
  const send = globalThis[${JSON.stringify(BINDING_NAME)}];
  const installed = Symbol.for('vscode-browser.page');
  if (typeof send !== 'function' || globalThis[installed]) return;
  globalThis[installed] = true;
  const post = (message) => { try { send(JSON.stringify(message)); } catch {} };
  const TEXT_INPUT = 'textarea, [contenteditable=""], [contenteditable="true"], input:not([type=button], [type=submit], [type=reset], [type=checkbox], [type=radio], [type=range], [type=color], [type=file], [type=image], [type=hidden])';

  const elementOf = (event) => {
    const target = event.composedPath()[0];
    return target instanceof Element ? target : target && target.parentElement;
  };

  // Mouse cursor
  const overText = (x, y) => {
    const range = document.caretRangeFromPoint ? document.caretRangeFromPoint(x, y) : null;
    const node = range && range.startContainer;
    if (!node || node.nodeType !== 3 || !node.data.trim()) return false;
    const whole = document.createRange();
    whole.selectNodeContents(node);
    for (const rect of whole.getClientRects()) {
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return true;
    }
    return false;
  };
  const cursorFor = ({ el, x, y }) => {
    if (!el || !el.isConnected) return 'default';
    let cursor = getComputedStyle(el).cursor || 'auto';
    if (cursor.includes('url(')) cursor = cursor.split(',').pop().trim();
    if (cursor !== 'auto') return cursor;
    if (el.closest('a[href], area[href]')) return 'pointer';
    if (el.isContentEditable || el.matches(TEXT_INPUT)) return 'text';
    return overText(x, y) ? 'text' : 'default';
  };
  let lastCursor = '';
  let pendingMove = null;
  addEventListener('mousemove', (event) => {
    // composedPath() is only available while the event is being dispatched.
    const scheduled = pendingMove !== null;
    pendingMove = { el: elementOf(event), x: event.clientX, y: event.clientY };
    if (scheduled) return;
    requestAnimationFrame(() => {
      const cursor = cursorFor(pendingMove);
      pendingMove = null;
      if (cursor !== lastCursor) {
        lastCursor = cursor;
        post({ kind: 'cursor', cursor });
      }
    });
  }, { capture: true, passive: true });
  addEventListener('mouseout', (event) => { if (!event.relatedTarget) lastCursor = ''; }, true);

  // Context menu (only when the page did not show its own)
  const selectedText = () => {
    const active = document.activeElement;
    if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
      try {
        if (active.selectionStart !== active.selectionEnd) {
          return active.value.slice(active.selectionStart, active.selectionEnd);
        }
      } catch {}
    }
    return String(getSelection() || '');
  };
  addEventListener('contextmenu', (event) => {
    const el = elementOf(event);
    const link = el && el.closest('a[href], area[href]');
    const media = el && el.closest('img, video, audio');
    const message = {
      kind: 'contextmenu',
      linkUrl: link && typeof link.href === 'string' ? link.href : undefined,
      linkText: link ? (link.textContent || '').trim().slice(0, 200) : undefined,
      mediaType: media ? media.tagName.toLowerCase() : undefined,
      srcUrl: media ? (media.currentSrc || media.src || undefined) : undefined,
      selectionText: selectedText().slice(0, 20000) || undefined,
      editable: !!el && (el.isContentEditable || el.matches(TEXT_INPUT)),
      frameUrl: location.href,
    };
    setTimeout(() => { if (!event.defaultPrevented) post(message); }, 0);
  }, true);

  // Fullscreen
  if (window === window.top) {
    document.addEventListener('fullscreenchange', () => {
      post({ kind: 'fullscreen', active: !!document.fullscreenElement });
    }, true);
  }

  // Audio playback
  let audible = false;
  const updateAudible = () => {
    const now = [...document.querySelectorAll('video, audio')].some(
      (m) => !m.paused && !m.ended && !m.muted && m.volume > 0,
    );
    if (now !== audible) {
      audible = now;
      post({ kind: 'audible', audible });
    }
  };
  for (const type of ['play', 'playing', 'pause', 'ended', 'volumechange', 'emptied']) {
    document.addEventListener(type, updateAudible, true);
  }
})();`;

/**
 * Find in page. Highlights every match with the CSS Custom Highlight API and scrolls to the
 * current one. Returns `{ index, count }` where `index` is 1-based (0 when there are no matches).
 */
export const FIND_FUNCTION = `(query, caseSensitive, direction) => {
  const key = Symbol.for('vscode-browser.find');
  const state = globalThis[key] || (globalThis[key] = { query: null, caseSensitive: false, ranges: [], index: -1, sheet: null });
  if (!globalThis.CSS || !CSS.highlights || typeof Highlight !== 'function') return { index: 0, count: 0 };
  if (!state.sheet) {
    state.sheet = new CSSStyleSheet();
    state.sheet.replaceSync(
      '::highlight(vscode-browser-find){background-color:rgba(255,213,0,.55);color:inherit}' +
      '::highlight(vscode-browser-find-current){background-color:rgb(255,150,50);color:black}');
    document.adoptedStyleSheets = [...document.adoptedStyleSheets, state.sheet];
  }
  if (direction === 'restart' || query !== state.query || caseSensitive !== state.caseSensitive) {
    state.query = query;
    state.caseSensitive = caseSensitive;
    state.ranges = [];
    state.index = -1;
    if (query) {
      const needle = caseSensitive ? query : query.toLowerCase();
      const walker = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (parent.checkVisibility && !parent.checkVisibility({ visibilityProperty: true })) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      for (let node = walker.nextNode(); node && state.ranges.length < 2000; node = walker.nextNode()) {
        const text = caseSensitive ? node.data : node.data.toLowerCase();
        for (let at = text.indexOf(needle); at !== -1 && state.ranges.length < 2000; at = text.indexOf(needle, at + needle.length)) {
          const range = new Range();
          range.setStart(node, at);
          range.setEnd(node, at + needle.length);
          state.ranges.push(range);
        }
      }
      const firstVisible = state.ranges.findIndex((range) => range.getBoundingClientRect().top >= 0);
      state.index = state.ranges.length ? Math.max(0, firstVisible) : -1;
    }
  } else if (state.ranges.length) {
    const step = direction === 'previous' ? -1 : 1;
    state.index = (state.index + step + state.ranges.length) % state.ranges.length;
  }
  if (!state.ranges.length) {
    CSS.highlights.delete('vscode-browser-find');
    CSS.highlights.delete('vscode-browser-find-current');
    return { index: 0, count: 0 };
  }
  CSS.highlights.set('vscode-browser-find', new Highlight(...state.ranges));
  const current = state.ranges[state.index];
  const currentHighlight = new Highlight(current);
  currentHighlight.priority = 1;
  CSS.highlights.set('vscode-browser-find-current', currentHighlight);
  const element = current.startContainer.parentElement;
  if (element) element.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  const rect = current.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > innerHeight) window.scrollBy(0, rect.top - innerHeight / 2);
  return { index: state.index + 1, count: state.ranges.length };
}`;

export const STOP_FIND_FUNCTION = `() => {
  if (globalThis.CSS && CSS.highlights) {
    CSS.highlights.delete('vscode-browser-find');
    CSS.highlights.delete('vscode-browser-find-current');
  }
  const state = globalThis[Symbol.for('vscode-browser.find')];
  if (state) { state.query = null; state.ranges = []; state.index = -1; }
}`;

/** Finds the focused element, looking inside shadow roots and same-origin iframes. */
const DEEP_ACTIVE_ELEMENT = `() => {
  let active = document.activeElement;
  for (;;) {
    if (active && active.shadowRoot && active.shadowRoot.activeElement) {
      active = active.shadowRoot.activeElement;
    } else if (active && active.tagName === 'IFRAME') {
      try {
        const inner = active.contentDocument && active.contentDocument.activeElement;
        if (!inner) break;
        active = inner;
      } catch { break; }
    } else break;
  }
  return active;
}`;

/** Returns the selected text in the focused frame, including selections inside text fields. */
export const SELECTED_TEXT_FUNCTION = `() => {
  const active = (${DEEP_ACTIVE_ELEMENT})();
  if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) {
    try {
      if (active.selectionStart !== active.selectionEnd) {
        return active.value.slice(active.selectionStart, active.selectionEnd);
      }
    } catch {}
  }
  const view = (active && active.ownerDocument && active.ownerDocument.defaultView) || window;
  return String(view.getSelection() || '');
}`;

/**
 * Dispatches a synthetic paste event carrying `text` at the focused element. Returns `true` when
 * the page handled it (called `preventDefault`), in which case the text must not also be typed.
 */
export const PASTE_FUNCTION = `(text) => {
  const target = (${DEEP_ACTIVE_ELEMENT})() || document.body;
  if (!target) return false;
  const data = new DataTransfer();
  data.setData('text/plain', text);
  const event = new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true, composed: true });
  target.dispatchEvent(event);
  return event.defaultPrevented;
}`;

/** Runs an editing command (`selectAll`, `delete`) in the document that has focus. */
export const EXEC_COMMAND_FUNCTION = `(command) => {
  const active = (${DEEP_ACTIVE_ELEMENT})();
  const doc = (active && active.ownerDocument) || document;
  doc.execCommand(command);
}`;

/** Returns the page's favicon URL, or `undefined` if it does not have one. */
export const FAVICON_FUNCTION = `() => {
  const links = [...document.querySelectorAll('link[rel~="icon" i], link[rel="shortcut icon" i]')];
  const link = links.find((l) => l.getAttribute('sizes') === '32x32') || links[links.length - 1];
  if (link && link.href) return link.href;
  return /^https?:$/.test(location.protocol) ? location.origin + '/favicon.ico' : undefined;
}`;

export const EXIT_FULLSCREEN_FUNCTION = `() => {
  if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}`;

/** Returns the rendered document's HTML (used when the original source is not available). */
export const OUTER_HTML_FUNCTION = `() => document.documentElement ? document.documentElement.outerHTML : ''`;

/** The page's visible text, truncated to `max` characters. */
export const PAGE_TEXT_FUNCTION = `(max) => {
  const text = document.body ? document.body.innerText : '';
  return text.length > max ? text.slice(0, max) + '\\n… (truncated)' : text;
}`;
