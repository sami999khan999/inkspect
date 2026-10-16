"use strict";
(() => {
  // ../shared/src/elementInfo.ts
  function buildSelector(element, count, escape) {
    const ATTRIBUTES = ["data-testid", "data-test", "data-cy", "data-qa", "aria-label", "name"];
    const unstable = (cls) => /^(css|sc|jsx|emotion|svelte)-|__[a-z0-9]{5,}$|[_-][a-f0-9]{6,}$|\d{3,}|[:[\]/()]/i.test(cls);
    const unique = (selector) => {
      try {
        return count(selector) === 1;
      } catch {
        return false;
      }
    };
    const describe = (el) => {
      const tag = el.tagName.toLowerCase();
      const candidates = [];
      if (el.id && !unstable(el.id)) candidates.push(`#${escape(el.id)}`);
      for (const name of ATTRIBUTES) {
        const value = el.getAttribute(name);
        if (value && value.length < 80)
          candidates.push(`${tag}[${name}="${value.replace(/"/g, '\\"')}"]`);
      }
      const classes = Array.from(el.classList).filter((cls) => !unstable(cls)).slice(0, 3).map((cls) => `.${escape(cls)}`);
      if (classes.length) candidates.push(tag + classes.join(""));
      candidates.push(tag);
      return candidates;
    };
    const nthOfType = (el) => {
      const tag = el.tagName.toLowerCase();
      const parent = el.parentElement;
      if (!parent) return tag;
      const siblings = Array.from(parent.children).filter((child) => child.tagName === el.tagName);
      return siblings.length > 1 ? `${tag}:nth-of-type(${siblings.indexOf(el) + 1})` : tag;
    };
    for (const candidate of describe(element)) {
      if (unique(candidate)) return candidate;
    }
    let path = describe(element).find((c) => c !== element.tagName.toLowerCase()) ?? nthOfType(element);
    if (!unique(path)) path = nthOfType(element);
    let current = element.parentElement;
    while (current && !unique(path)) {
      const ancestor = describe(current).find((candidate) => unique(candidate));
      if (ancestor) {
        path = `${ancestor} > ${path}`;
        if (unique(path)) return path;
        return `${ancestor} > ${pathFromTo(element, current, nthOfType)}`;
      }
      path = `${nthOfType(current)} > ${path}`;
      current = current.parentElement;
    }
    return path;
    function pathFromTo(el, ancestor, step) {
      const steps = [];
      for (let node = el; node && node !== ancestor; node = node.parentElement) {
        steps.unshift(step(node));
      }
      return steps.join(" > ");
    }
  }
  function buildXPath(element) {
    const steps = [];
    for (let el = element; el; el = el.parentElement) {
      const tag = el.tagName.toLowerCase();
      const parent = el.parentElement;
      const same = parent ? Array.from(parent.children).filter((c) => c.tagName === el.tagName) : [];
      steps.unshift(same.length > 1 ? `${tag}[${same.indexOf(el) + 1}]` : tag);
    }
    return `/${steps.join("/")}`;
  }

  // ../shared/src/collect.ts
  var STYLE_PROPERTIES = [
    "display",
    "position",
    "width",
    "height",
    "margin",
    "padding",
    "color",
    "background-color",
    "font-family",
    "font-size",
    "font-weight",
    "line-height",
    "border",
    "border-radius",
    "z-index",
    "flex-direction",
    "justify-content",
    "align-items",
    "gap",
    "grid-template-columns",
    "opacity",
    "overflow"
  ];
  function collectElementDetails(el, maxHtml, helpers) {
    const doc = el.ownerDocument;
    const win = doc.defaultView || window;
    const rootNode = el.getRootNode();
    const root = "querySelectorAll" in rootNode ? rootNode : doc;
    const escape = (value) => win.CSS && win.CSS.escape ? win.CSS.escape(value) : value;
    let selector = helpers.buildSelector(el, (s) => root.querySelectorAll(s).length, escape);
    if (root !== doc && "host" in root && root.host) {
      const hostRoot = root.host.getRootNode();
      const host = helpers.buildSelector(
        root.host,
        (s) => ("querySelectorAll" in hostRoot ? hostRoot : doc).querySelectorAll(s).length,
        escape
      );
      selector = host + " >>> " + selector;
    }
    const rect = el.getBoundingClientRect();
    const attributes = {};
    for (const attribute of Array.from(el.attributes || [])) {
      attributes[attribute.name] = attribute.value.slice(0, 300);
    }
    const html5 = el;
    const text = (html5.innerText || el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 200) || void 0;
    let html = el.outerHTML || "";
    if (html.length > maxHtml) {
      const shallow = el.cloneNode(false);
      if (el.children.length) shallow.innerHTML = "\u2026";
      else shallow.textContent = (el.textContent || "").slice(0, 80) + "\u2026";
      html = shallow.outerHTML.slice(0, maxHtml);
    }
    const computed = win.getComputedStyle(el);
    const styles = {};
    for (const name of helpers.styleProperties) {
      const value = computed.getPropertyValue(name);
      if (!value || /^(none|normal|auto|0px|static|visible|1|rgba\(0, 0, 0, 0\)|0px none .*)$/.test(value)) {
        continue;
      }
      styles[name] = value.length > 80 ? value.slice(0, 80) + "\u2026" : value;
    }
    const component = (() => {
      try {
        const node = el;
        const fiberKey = Object.keys(node).find(
          (k) => k.startsWith("__reactFiber$") || k.startsWith("__reactInternalInstance$")
        );
        if (fiberKey) {
          for (let fiber = node[fiberKey]; fiber; fiber = fiber.return) {
            const type = fiber.type;
            if (!type || typeof type === "string") continue;
            const name = type.displayName || type.name || type.render && (type.render.displayName || type.render.name);
            if (!name) continue;
            let file = fiber._debugSource && fiber._debugSource.fileName;
            let line = fiber._debugSource && fiber._debugSource.lineNumber;
            const stack = fiber._debugStack && fiber._debugStack.stack;
            if (!file && typeof stack === "string") {
              const frame = stack.split("\n").slice(1).find(
                (l) => !/node_modules|react-dom|react-stack|jsx-dev-runtime|chunk-/.test(l)
              ) || "";
              const match = /\(?((?:https?|file|webpack[\w-]*):\/\/[^\s)]+?):(\d+):\d+\)?\s*$/.exec(
                frame
              );
              if (match) {
                file = match[1];
                line = Number(match[2]);
              }
            }
            return { framework: "react", name, file, line };
          }
        }
        const vue = node.__vueParentComponent;
        if (vue) {
          const type = vue.type || {};
          const file = type.__file;
          const name = type.name || type.__name || (file ? String(file).split("/").pop().replace(/\.vue$/, "") : "Anonymous");
          return { framework: "vue", name, file };
        }
        if (node.__vue__) {
          const options = node.__vue__.$options || {};
          return {
            framework: "vue",
            name: options.name || options._componentTag || "Anonymous",
            file: options.__file
          };
        }
        for (let current = node; current; current = current.parentElement) {
          if (current.__svelte_meta) {
            const loc = current.__svelte_meta.loc || {};
            const name = loc.file ? String(loc.file).split("/").pop().replace(/\.svelte$/, "") : "Component";
            return {
              framework: "svelte",
              name,
              file: loc.file,
              line: typeof loc.line === "number" ? loc.line + 1 : void 0
            };
          }
        }
        const ng = win.ng;
        if (ng && ng.getOwningComponent) {
          const instance = ng.getComponent(el) || ng.getOwningComponent(el);
          if (instance) return { framework: "angular", name: instance.constructor.name };
        }
      } catch {
      }
      return void 0;
    })();
    let pageUrl = win.location.href;
    let pageTitle = doc.title;
    try {
      pageUrl = win.top.location.href;
      pageTitle = win.top.document.title;
    } catch {
    }
    return {
      tag: el.tagName.toLowerCase(),
      id: el.id || void 0,
      classes: Array.from(el.classList || []),
      selector,
      xpath: helpers.buildXPath(el),
      text,
      html,
      attributes,
      rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      styles,
      component,
      pageUrl,
      pageTitle,
      viewport: { width: win.innerWidth, height: win.innerHeight },
      frameUrl: win !== win.top ? win.location.href : void 0,
      scroll: { x: win.scrollX, y: win.scrollY }
    };
  }
  var COLLECT_HELPERS = {
    buildSelector,
    buildXPath,
    styleProperties: STYLE_PROPERTIES
  };
  var IMPLICIT_ROLES = {
    a: "link",
    article: "article",
    aside: "complementary",
    button: "button",
    dialog: "dialog",
    footer: "contentinfo",
    form: "form",
    h1: "heading",
    h2: "heading",
    h3: "heading",
    h4: "heading",
    h5: "heading",
    h6: "heading",
    header: "banner",
    hr: "separator",
    img: "img",
    li: "listitem",
    main: "main",
    nav: "navigation",
    ol: "list",
    option: "option",
    progress: "progressbar",
    section: "region",
    select: "combobox",
    table: "table",
    textarea: "textbox",
    ul: "list"
  };
  var INPUT_ROLES = {
    button: "button",
    checkbox: "checkbox",
    email: "textbox",
    image: "button",
    number: "spinbutton",
    radio: "radio",
    range: "slider",
    reset: "button",
    search: "searchbox",
    submit: "button",
    tel: "textbox",
    text: "textbox",
    url: "textbox"
  };
  var NAME_FROM_CONTENT = /* @__PURE__ */ new Set([
    "button",
    "link",
    "heading",
    "listitem",
    "option",
    "tab",
    "menuitem",
    "cell"
  ]);
  function accessibleInfo(el) {
    const tag = el.tagName.toLowerCase();
    let role = el.getAttribute("role")?.split(/\s+/)[0] || void 0;
    if (!role) {
      if (tag === "input") role = INPUT_ROLES[(el.getAttribute("type") || "text").toLowerCase()];
      else if (tag === "a") role = el.hasAttribute("href") ? "link" : void 0;
      else if (tag === "section") role = el.hasAttribute("aria-label") ? "region" : void 0;
      else role = IMPLICIT_ROLES[tag];
    }
    const clean = (text) => (text || "").replace(/\s+/g, " ").trim().slice(0, 200) || void 0;
    const labelledBy = el.getAttribute("aria-labelledby");
    let name;
    if (labelledBy) {
      name = clean(
        labelledBy.split(/\s+/).map((id) => el.ownerDocument.getElementById(id)?.textContent || "").join(" ")
      );
    }
    name ??= clean(el.getAttribute("aria-label"));
    if (!name && (tag === "img" || tag === "area")) name = clean(el.getAttribute("alt"));
    if (!name && "labels" in el) {
      const labels = el.labels;
      if (labels?.length)
        name = clean(
          Array.from(labels).map((l) => l.textContent).join(" ")
        );
    }
    if (!name && tag === "input") {
      const input = el;
      if (["button", "submit", "reset"].includes(input.type)) name = clean(input.value);
      name ??= clean(input.placeholder);
    }
    if (!name && role && NAME_FROM_CONTENT.has(role)) {
      name = clean(el.innerText || el.textContent);
    }
    name ??= clean(el.getAttribute("title"));
    return { role: role || "generic", name };
  }

  // ../shared/src/devtools.ts
  function formatConsoleArguments(texts) {
    const [first, ...rest] = texts;
    if (first === void 0) return "";
    let index = 0;
    const formatted = first.replace(/%[sdifoOc]/g, (token) => {
      if (index >= rest.length) return token;
      const value = rest[index++];
      if (token === "%c") return "";
      if (token === "%d" || token === "%i") return String(parseInt(value, 10));
      if (token === "%f") return String(parseFloat(value));
      return value;
    });
    return [formatted, ...rest.slice(index)].join(" ");
  }

  // src/messages.ts
  var PAGE_REQUEST_EVENT = "inkspect:request";
  var PAGE_RESPONSE_EVENT = "inkspect:response";
  var TARGET_ATTRIBUTE = "data-inkspect-target";

  // src/main-world/index.ts
  function stringify(value) {
    const saved = [];
    for (const proto of [Array.prototype, String.prototype, Number.prototype, Boolean.prototype]) {
      const own = Object.getOwnPropertyDescriptor(proto, "toJSON");
      if (own?.configurable && delete proto.toJSON)
        saved.push([proto, own]);
    }
    try {
      return JSON.stringify(value);
    } finally {
      for (const [proto, own] of saved) Object.defineProperty(proto, "toJSON", own);
    }
  }
  var MAX_ENTRIES = 500;
  function install() {
    const w = window;
    if (w.__inkspectMain) return;
    w.__inkspectMain = true;
    const consoleEntries = [];
    const network = [];
    let nextId = 1;
    const push = (list, entry) => {
      list.push(entry);
      if (list.length > MAX_ENTRIES) list.splice(0, list.length - MAX_ENTRIES);
    };
    const callSite = () => {
      const stack = new Error().stack?.split("\n").slice(3) ?? [];
      for (const frame of stack) {
        const match = /\(?((?:https?|file|chrome-extension|moz-extension):\/\/[^\s)]+?):(\d+):(\d+)\)?\s*$/.exec(
          frame
        );
        if (match && !/main-world\.js/.test(match[1])) {
          return { url: match[1], line: Number(match[2]) - 1, column: Number(match[3]) - 1 };
        }
      }
      return {};
    };
    const describe = (value) => {
      if (value instanceof Error) return value.stack || `${value.name}: ${value.message}`;
      if (typeof value === "string") return value;
      try {
        return stringify(value) ?? String(value);
      } catch {
        return String(value);
      }
    };
    const levels = [
      ["error", "error"],
      ["warn", "warning"],
      ["info", "info"],
      ["log", "info"],
      ["debug", "debug"]
    ];
    for (const [method, level] of levels) {
      const original = console[method];
      console[method] = function(...args) {
        try {
          push(consoleEntries, {
            id: nextId++,
            time: Date.now(),
            level,
            // `%s`, `%d`, `%c`... applied like DevTools does (styles dropped), not printed.
            text: formatConsoleArguments(args.map(describe)).slice(0, 4e3),
            source: "console",
            ...callSite()
          });
        } catch {
        }
        return original.apply(this, args);
      };
    }
    window.addEventListener(
      "error",
      (event) => {
        const target = event.target;
        if (target && target !== window && target instanceof Element) {
          const url = target.src || target.href;
          if (url) {
            push(network, {
              id: `r${nextId++}`,
              method: "GET",
              url,
              type: target.tagName.toLowerCase(),
              time: Date.now(),
              error: "Failed to load"
            });
          }
          return;
        }
        push(consoleEntries, {
          id: nextId++,
          time: Date.now(),
          level: "error",
          text: event.error instanceof Error ? describe(event.error) : event.message,
          source: "exception",
          url: event.filename || void 0,
          line: event.lineno ? event.lineno - 1 : void 0,
          column: event.colno ? event.colno - 1 : void 0
        });
      },
      true
    );
    window.addEventListener("unhandledrejection", (event) => {
      push(consoleEntries, {
        id: nextId++,
        time: Date.now(),
        level: "error",
        text: `Uncaught (in promise) ${describe(event.reason)}`,
        source: "exception"
      });
    });
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
      const [input, init] = args;
      const entry = {
        id: `f${nextId++}`,
        method: "GET",
        url: "",
        type: "fetch",
        time: Date.now()
      };
      try {
        entry.url = input instanceof Request ? input.url : String(input);
        entry.method = String(
          init?.method || (input instanceof Request ? input.method : "GET")
        ).toUpperCase();
      } catch {
      }
      push(network, entry);
      try {
        const response = await originalFetch.apply(this, args);
        entry.status = response.status;
        entry.mimeType = response.headers.get("content-type") ?? void 0;
        entry.duration = Date.now() - entry.time;
        return response;
      } catch (error) {
        entry.error = error instanceof Error ? error.message : String(error);
        entry.canceled = error instanceof DOMException && error.name === "AbortError";
        entry.duration = Date.now() - entry.time;
        throw error;
      }
    };
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;
    const entries = /* @__PURE__ */ new WeakMap();
    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
      let href = String(url);
      try {
        href = new URL(url, location.href).href;
      } catch {
      }
      entries.set(this, {
        id: `x${nextId++}`,
        method: String(method).toUpperCase(),
        url: href,
        type: "xhr",
        time: Date.now()
      });
      return open.call(this, method, url, ...rest);
    };
    XMLHttpRequest.prototype.send = function(...args) {
      const entry = entries.get(this);
      if (entry) {
        entry.time = Date.now();
        push(network, entry);
        this.addEventListener("loadend", () => {
          entry.duration = Date.now() - entry.time;
          if (this.status) entry.status = this.status;
          else entry.error = "Failed";
        });
      }
      return send.apply(this, args);
    };
    window.addEventListener(PAGE_REQUEST_EVENT, (event) => {
      const { id, request } = JSON.parse(event.detail);
      let result;
      try {
        if (request.kind === "collect") {
          const el = document.querySelector(`[${TARGET_ATTRIBUTE}]`);
          if (el) {
            el.removeAttribute(TARGET_ATTRIBUTE);
            result = {
              ...collectElementDetails(el, request.maxHtml, COLLECT_HELPERS),
              ...accessibleInfo(el)
            };
            el.setAttribute(TARGET_ATTRIBUTE, "");
          }
        } else if (request.kind === "logs") {
          result = { console: consoleEntries, network };
        } else if (request.kind === "clearLogs") {
          consoleEntries.length = 0;
          network.length = 0;
        }
      } catch (error) {
        result = { error: error instanceof Error ? error.message : String(error) };
      }
      window.dispatchEvent(
        new CustomEvent(PAGE_RESPONSE_EVENT, { detail: stringify({ id, result }) })
      );
    });
  }
  install();
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc2hhcmVkL3NyYy9lbGVtZW50SW5mby50cyIsICIuLi8uLi9zaGFyZWQvc3JjL2NvbGxlY3QudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9kZXZ0b29scy50cyIsICIuLi9zcmMvbWVzc2FnZXMudHMiLCAiLi4vc3JjL21haW4td29ybGQvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIEVsZW1lbnQgZGV0YWlscyBmb3IgdGhlIGVsZW1lbnQgcGlja2VyOiBzZWxlY3RvciBnZW5lcmF0aW9uIChydW5zIGluc2lkZSB0aGUgcGFnZSkgYW5kXG4vLyBmb3JtYXR0aW5nIGZvciBBSSBhZ2VudHMgKHJ1bnMgaW4gdGhlIGhvc3QpLiBTZWxlY3RvciBmdW5jdGlvbnMgbXVzdCBzdGF5IHNlbGYtY29udGFpbmVkOlxuLy8gdGhleSBhcmUgY29udmVydGVkIHRvIHN0cmluZ3Mgd2l0aCBgdG9TdHJpbmcoKWAgYW5kIGV2YWx1YXRlZCBpbiB0aGUgcGFnZS5cblxuLyoqIFRoZSBwYXJ0cyBvZiBhIERPTSBlbGVtZW50IHRoZSBzZWxlY3RvciBmdW5jdGlvbnMgdXNlIChzbyB0aGV5IGNhbiBiZSB1bml0IHRlc3RlZCkuICovXG5leHBvcnQgaW50ZXJmYWNlIFNlbGVjdG9yRWxlbWVudCB7XG4gIHRhZ05hbWU6IHN0cmluZztcbiAgaWQ6IHN0cmluZztcbiAgY2xhc3NMaXN0OiBBcnJheUxpa2U8c3RyaW5nPjtcbiAgcGFyZW50RWxlbWVudDogU2VsZWN0b3JFbGVtZW50IHwgbnVsbDtcbiAgY2hpbGRyZW46IEFycmF5TGlrZTxTZWxlY3RvckVsZW1lbnQ+O1xuICBnZXRBdHRyaWJ1dGUobmFtZTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbDtcbn1cblxuLyoqXG4gKiBBIHNob3J0IENTUyBzZWxlY3RvciB0aGF0IG1hdGNoZXMgb25seSBgZWxlbWVudGAuIFByZWZlcnMgaWRzLCB0ZXN0IGlkcywgQVJJQSBsYWJlbHMgYW5kIG5hbWVzLFxuICogdGhlbiB0YWcgcGx1cyBzdGFibGUgY2xhc3MgbmFtZXMsIHRoZW4gYDpudGgtb2YtdHlwZWAgc3RlcHMgdXAgdG8gYSB1bmlxdWUgYW5jZXN0b3IuXG4gKiBgY291bnRgIHJldHVybnMgaG93IG1hbnkgZWxlbWVudHMgYSBzZWxlY3RvciBtYXRjaGVzIGluIHRoZSBkb2N1bWVudDsgYGVzY2FwZWAgaXMgYENTUy5lc2NhcGVgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRTZWxlY3RvcihcbiAgZWxlbWVudDogU2VsZWN0b3JFbGVtZW50LFxuICBjb3VudDogKHNlbGVjdG9yOiBzdHJpbmcpID0+IG51bWJlcixcbiAgZXNjYXBlOiAodmFsdWU6IHN0cmluZykgPT4gc3RyaW5nLFxuKTogc3RyaW5nIHtcbiAgY29uc3QgQVRUUklCVVRFUyA9IFsnZGF0YS10ZXN0aWQnLCAnZGF0YS10ZXN0JywgJ2RhdGEtY3knLCAnZGF0YS1xYScsICdhcmlhLWxhYmVsJywgJ25hbWUnXTtcbiAgLy8gR2VuZXJhdGVkIGNsYXNzIG5hbWVzIChDU1MgbW9kdWxlcywgc3R5bGVkLWNvbXBvbmVudHMsIFRhaWx3aW5kIGFyYml0cmFyeSB2YWx1ZXMsIGhhc2hlcykuXG4gIGNvbnN0IHVuc3RhYmxlID0gKGNsczogc3RyaW5nKSA9PlxuICAgIC9eKGNzc3xzY3xqc3h8ZW1vdGlvbnxzdmVsdGUpLXxfX1thLXowLTldezUsfSR8W18tXVthLWYwLTldezYsfSR8XFxkezMsfXxbOltcXF0vKCldL2kudGVzdChjbHMpO1xuICBjb25zdCB1bmlxdWUgPSAoc2VsZWN0b3I6IHN0cmluZykgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY291bnQoc2VsZWN0b3IpID09PSAxO1xuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfTtcbiAgY29uc3QgZGVzY3JpYmUgPSAoZWw6IFNlbGVjdG9yRWxlbWVudCk6IHN0cmluZ1tdID0+IHtcbiAgICBjb25zdCB0YWcgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgY29uc3QgY2FuZGlkYXRlczogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAoZWwuaWQgJiYgIXVuc3RhYmxlKGVsLmlkKSkgY2FuZGlkYXRlcy5wdXNoKGAjJHtlc2NhcGUoZWwuaWQpfWApO1xuICAgIGZvciAoY29uc3QgbmFtZSBvZiBBVFRSSUJVVEVTKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGVsLmdldEF0dHJpYnV0ZShuYW1lKTtcbiAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPCA4MClcbiAgICAgICAgY2FuZGlkYXRlcy5wdXNoKGAke3RhZ31bJHtuYW1lfT1cIiR7dmFsdWUucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpfVwiXWApO1xuICAgIH1cbiAgICBjb25zdCBjbGFzc2VzID0gQXJyYXkuZnJvbShlbC5jbGFzc0xpc3QpXG4gICAgICAuZmlsdGVyKChjbHMpID0+ICF1bnN0YWJsZShjbHMpKVxuICAgICAgLnNsaWNlKDAsIDMpXG4gICAgICAubWFwKChjbHMpID0+IGAuJHtlc2NhcGUoY2xzKX1gKTtcbiAgICBpZiAoY2xhc3Nlcy5sZW5ndGgpIGNhbmRpZGF0ZXMucHVzaCh0YWcgKyBjbGFzc2VzLmpvaW4oJycpKTtcbiAgICBjYW5kaWRhdGVzLnB1c2godGFnKTtcbiAgICByZXR1cm4gY2FuZGlkYXRlcztcbiAgfTtcbiAgY29uc3QgbnRoT2ZUeXBlID0gKGVsOiBTZWxlY3RvckVsZW1lbnQpOiBzdHJpbmcgPT4ge1xuICAgIGNvbnN0IHRhZyA9IGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICBjb25zdCBwYXJlbnQgPSBlbC5wYXJlbnRFbGVtZW50O1xuICAgIGlmICghcGFyZW50KSByZXR1cm4gdGFnO1xuICAgIGNvbnN0IHNpYmxpbmdzID0gQXJyYXkuZnJvbShwYXJlbnQuY2hpbGRyZW4pLmZpbHRlcigoY2hpbGQpID0+IGNoaWxkLnRhZ05hbWUgPT09IGVsLnRhZ05hbWUpO1xuICAgIHJldHVybiBzaWJsaW5ncy5sZW5ndGggPiAxID8gYCR7dGFnfTpudGgtb2YtdHlwZSgke3NpYmxpbmdzLmluZGV4T2YoZWwpICsgMX0pYCA6IHRhZztcbiAgfTtcblxuICAvLyAxLiBTb21ldGhpbmcgb24gdGhlIGVsZW1lbnQgaXRzZWxmIGlzIHVuaXF1ZS5cbiAgZm9yIChjb25zdCBjYW5kaWRhdGUgb2YgZGVzY3JpYmUoZWxlbWVudCkpIHtcbiAgICBpZiAodW5pcXVlKGNhbmRpZGF0ZSkpIHJldHVybiBjYW5kaWRhdGU7XG4gIH1cbiAgLy8gMi4gV2FsayB1cCwgcHJlZml4aW5nIHdpdGggYW5jZXN0b3JzLCB1bnRpbCB0aGUgcGF0aCBpcyB1bmlxdWUuXG4gIGxldCBwYXRoID1cbiAgICBkZXNjcmliZShlbGVtZW50KS5maW5kKChjKSA9PiBjICE9PSBlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSkgPz8gbnRoT2ZUeXBlKGVsZW1lbnQpO1xuICBpZiAoIXVuaXF1ZShwYXRoKSkgcGF0aCA9IG50aE9mVHlwZShlbGVtZW50KTtcbiAgbGV0IGN1cnJlbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gIHdoaWxlIChjdXJyZW50ICYmICF1bmlxdWUocGF0aCkpIHtcbiAgICBjb25zdCBhbmNlc3RvciA9IGRlc2NyaWJlKGN1cnJlbnQpLmZpbmQoKGNhbmRpZGF0ZSkgPT4gdW5pcXVlKGNhbmRpZGF0ZSkpO1xuICAgIGlmIChhbmNlc3Rvcikge1xuICAgICAgcGF0aCA9IGAke2FuY2VzdG9yfSA+ICR7cGF0aH1gO1xuICAgICAgaWYgKHVuaXF1ZShwYXRoKSkgcmV0dXJuIHBhdGg7XG4gICAgICAvLyBUaGUgYW5jZXN0b3IgaXMgdW5pcXVlIGJ1dCB0aGUgY2hpbGQgc3RlcCBpcyBub3Q6IG1ha2UgdGhlIGNoaWxkIHN0ZXAgZXhhY3QuXG4gICAgICByZXR1cm4gYCR7YW5jZXN0b3J9ID4gJHtwYXRoRnJvbVRvKGVsZW1lbnQsIGN1cnJlbnQsIG50aE9mVHlwZSl9YDtcbiAgICB9XG4gICAgcGF0aCA9IGAke250aE9mVHlwZShjdXJyZW50KX0gPiAke3BhdGh9YDtcbiAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnRFbGVtZW50O1xuICB9XG4gIHJldHVybiBwYXRoO1xuXG4gIGZ1bmN0aW9uIHBhdGhGcm9tVG8oXG4gICAgZWw6IFNlbGVjdG9yRWxlbWVudCxcbiAgICBhbmNlc3RvcjogU2VsZWN0b3JFbGVtZW50LFxuICAgIHN0ZXA6IChlOiBTZWxlY3RvckVsZW1lbnQpID0+IHN0cmluZyxcbiAgKTogc3RyaW5nIHtcbiAgICBjb25zdCBzdGVwczogc3RyaW5nW10gPSBbXTtcbiAgICBmb3IgKFxuICAgICAgbGV0IG5vZGU6IFNlbGVjdG9yRWxlbWVudCB8IG51bGwgPSBlbDtcbiAgICAgIG5vZGUgJiYgbm9kZSAhPT0gYW5jZXN0b3I7XG4gICAgICBub2RlID0gbm9kZS5wYXJlbnRFbGVtZW50XG4gICAgKSB7XG4gICAgICBzdGVwcy51bnNoaWZ0KHN0ZXAobm9kZSkpO1xuICAgIH1cbiAgICByZXR1cm4gc3RlcHMuam9pbignID4gJyk7XG4gIH1cbn1cblxuLyoqIEFuIFhQYXRoIGZyb20gdGhlIGRvY3VtZW50IHJvb3QsIGUuZy4gYC9odG1sL2JvZHkvbWFpbi9mb3JtL2J1dHRvblsyXWAuICovXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRYUGF0aChlbGVtZW50OiBTZWxlY3RvckVsZW1lbnQpOiBzdHJpbmcge1xuICBjb25zdCBzdGVwczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgZWw6IFNlbGVjdG9yRWxlbWVudCB8IG51bGwgPSBlbGVtZW50OyBlbDsgZWwgPSBlbC5wYXJlbnRFbGVtZW50KSB7XG4gICAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGNvbnN0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQ7XG4gICAgY29uc3Qgc2FtZSA9IHBhcmVudCA/IEFycmF5LmZyb20ocGFyZW50LmNoaWxkcmVuKS5maWx0ZXIoKGMpID0+IGMudGFnTmFtZSA9PT0gZWwhLnRhZ05hbWUpIDogW107XG4gICAgc3RlcHMudW5zaGlmdChzYW1lLmxlbmd0aCA+IDEgPyBgJHt0YWd9WyR7c2FtZS5pbmRleE9mKGVsKSArIDF9XWAgOiB0YWcpO1xuICB9XG4gIHJldHVybiBgLyR7c3RlcHMuam9pbignLycpfWA7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRWxlbWVudENvbXBvbmVudCB7XG4gIGZyYW1ld29yazogJ3JlYWN0JyB8ICd2dWUnIHwgJ3N2ZWx0ZScgfCAnYW5ndWxhcic7XG4gIG5hbWU6IHN0cmluZztcbiAgLyoqIFNvdXJjZSBmaWxlLCB3aGVuIHRoZSBmcmFtZXdvcmsncyBkZXYgYnVpbGQgZXhwb3NlcyBpdC4gKi9cbiAgZmlsZT86IHN0cmluZztcbiAgbGluZT86IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBFbGVtZW50RGV0YWlscyB7XG4gIHRhZzogc3RyaW5nO1xuICBpZD86IHN0cmluZztcbiAgY2xhc3Nlczogc3RyaW5nW107XG4gIHNlbGVjdG9yOiBzdHJpbmc7XG4gIHhwYXRoOiBzdHJpbmc7XG4gIHRleHQ/OiBzdHJpbmc7XG4gIGh0bWw6IHN0cmluZztcbiAgYXR0cmlidXRlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgLyoqIFBvc2l0aW9uIGluIHRoZSB2aWV3cG9ydCwgQ1NTIHBpeGVscy4gKi9cbiAgcmVjdDogeyB4OiBudW1iZXI7IHk6IG51bWJlcjsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfTtcbiAgc3R5bGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICByb2xlPzogc3RyaW5nO1xuICBuYW1lPzogc3RyaW5nO1xuICBjb21wb25lbnQ/OiBFbGVtZW50Q29tcG9uZW50O1xuICBwYWdlVXJsOiBzdHJpbmc7XG4gIHBhZ2VUaXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICAvKiogVVJMIG9mIHRoZSBpZnJhbWUgdGhlIGVsZW1lbnQgaXMgaW4sIHdoZW4gaXQgaXMgbm90IHRoZSB0b3AgZG9jdW1lbnQuICovXG4gIGZyYW1lVXJsPzogc3RyaW5nO1xuICAvKiogUGF0aCBvZiBhIHNjcmVlbnNob3Qgb2YgdGhlIGVsZW1lbnQgKEFsdCtjbGljaykuICovXG4gIHNjcmVlbnNob3Q/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIENvcHlGb3JtYXQgPSAnbWFya2Rvd24nIHwgJ2pzb24nIHwgJ3NlbGVjdG9yJyB8ICdodG1sJztcblxuZXhwb3J0IHR5cGUgRGV0YWlsRmllbGQgPVxuICB8ICdwYWdlJ1xuICB8ICdzZWxlY3RvcidcbiAgfCAneHBhdGgnXG4gIHwgJ3JvbGUnXG4gIHwgJ2NvbXBvbmVudCdcbiAgfCAnYm94J1xuICB8ICd0ZXh0J1xuICB8ICdzdHlsZXMnXG4gIHwgJ2F0dHJpYnV0ZXMnXG4gIHwgJ2h0bWwnO1xuXG5leHBvcnQgY29uc3QgQUxMX0ZJRUxEUzogcmVhZG9ubHkgRGV0YWlsRmllbGRbXSA9IFtcbiAgJ3BhZ2UnLFxuICAnc2VsZWN0b3InLFxuICAneHBhdGgnLFxuICAncm9sZScsXG4gICdjb21wb25lbnQnLFxuICAnYm94JyxcbiAgJ3RleHQnLFxuICAnc3R5bGVzJyxcbiAgJ2F0dHJpYnV0ZXMnLFxuICAnaHRtbCcsXG5dO1xuXG4vKiogVGhlIGxhYmVsIGZvciBhbiBlbGVtZW50IGluIGhlYWRpbmdzOiBgYnV0dG9uI3NhdmUucHJpbWFyeWAuICovXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudExhYmVsKGRldGFpbHM6IFBpY2s8RWxlbWVudERldGFpbHMsICd0YWcnIHwgJ2lkJyB8ICdjbGFzc2VzJz4pOiBzdHJpbmcge1xuICByZXR1cm4gYCR7ZGV0YWlscy50YWd9JHtkZXRhaWxzLmlkID8gYCMke2RldGFpbHMuaWR9YCA6ICcnfSR7ZGV0YWlscy5jbGFzc2VzXG4gICAgLnNsaWNlKDAsIDMpXG4gICAgLm1hcCgoY2xzKSA9PiBgLiR7Y2xzfWApXG4gICAgLmpvaW4oJycpfWA7XG59XG5cbmZ1bmN0aW9uIGNvbXBvbmVudExhYmVsKGNvbXBvbmVudDogRWxlbWVudENvbXBvbmVudCk6IHN0cmluZyB7XG4gIGNvbnN0IGxvY2F0aW9uID0gY29tcG9uZW50LmZpbGVcbiAgICA/IGAgKCR7Y29tcG9uZW50LmZpbGV9JHtjb21wb25lbnQubGluZSA/IGA6JHtjb21wb25lbnQubGluZX1gIDogJyd9KWBcbiAgICA6ICcnO1xuICByZXR1cm4gYFxcYDwke2NvbXBvbmVudC5uYW1lfT5cXGAke2xvY2F0aW9ufSBbJHtjb21wb25lbnQuZnJhbWV3b3JrfV1gO1xufVxuXG4vKiogRm9ybWF0cyBvbmUgb3IgbW9yZSBwaWNrZWQgZWxlbWVudHMgZm9yIHBhc3RpbmcgaW50byBhbiBBSSBjaGF0LiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdERldGFpbHMoXG4gIGVsZW1lbnRzOiBFbGVtZW50RGV0YWlsc1tdLFxuICBmb3JtYXQ6IENvcHlGb3JtYXQsXG4gIGZpZWxkczogcmVhZG9ubHkgRGV0YWlsRmllbGRbXSA9IEFMTF9GSUVMRFMsXG4pOiBzdHJpbmcge1xuICBzd2l0Y2ggKGZvcm1hdCkge1xuICAgIGNhc2UgJ3NlbGVjdG9yJzpcbiAgICAgIHJldHVybiBlbGVtZW50cy5tYXAoKGUpID0+IGUuc2VsZWN0b3IpLmpvaW4oJ1xcbicpO1xuICAgIGNhc2UgJ2h0bWwnOlxuICAgICAgcmV0dXJuIGVsZW1lbnRzLm1hcCgoZSkgPT4gZS5odG1sKS5qb2luKCdcXG5cXG4nKTtcbiAgICBjYXNlICdqc29uJzoge1xuICAgICAgY29uc3QgcGljayA9IChlOiBFbGVtZW50RGV0YWlscykgPT4ge1xuICAgICAgICBjb25zdCBvdXQ6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0geyBlbGVtZW50OiBlbGVtZW50TGFiZWwoZSkgfTtcbiAgICAgICAgaWYgKGZpZWxkcy5pbmNsdWRlcygncGFnZScpKVxuICAgICAgICAgIG91dC5wYWdlID0ge1xuICAgICAgICAgICAgdXJsOiBlLnBhZ2VVcmwsXG4gICAgICAgICAgICB0aXRsZTogZS5wYWdlVGl0bGUsXG4gICAgICAgICAgICB2aWV3cG9ydDogZS52aWV3cG9ydCxcbiAgICAgICAgICAgIGZyYW1lVXJsOiBlLmZyYW1lVXJsLFxuICAgICAgICAgIH07XG4gICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ3NlbGVjdG9yJykpIG91dC5zZWxlY3RvciA9IGUuc2VsZWN0b3I7XG4gICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ3hwYXRoJykpIG91dC54cGF0aCA9IGUueHBhdGg7XG4gICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ3JvbGUnKSkgb3V0LnJvbGUgPSBlLnJvbGUgPyB7IHJvbGU6IGUucm9sZSwgbmFtZTogZS5uYW1lIH0gOiB1bmRlZmluZWQ7XG4gICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ2NvbXBvbmVudCcpKSBvdXQuY29tcG9uZW50ID0gZS5jb21wb25lbnQ7XG4gICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ2JveCcpKSBvdXQuYm94ID0gZS5yZWN0O1xuICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCd0ZXh0JykpIG91dC50ZXh0ID0gZS50ZXh0O1xuICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCdzdHlsZXMnKSkgb3V0LnN0eWxlcyA9IGUuc3R5bGVzO1xuICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCdhdHRyaWJ1dGVzJykpIG91dC5hdHRyaWJ1dGVzID0gZS5hdHRyaWJ1dGVzO1xuICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCdodG1sJykpIG91dC5odG1sID0gZS5odG1sO1xuICAgICAgICBpZiAoZS5zY3JlZW5zaG90KSBvdXQuc2NyZWVuc2hvdCA9IGUuc2NyZWVuc2hvdDtcbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgIH07XG4gICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoXG4gICAgICAgIGVsZW1lbnRzLmxlbmd0aCA9PT0gMSA/IHBpY2soZWxlbWVudHNbMF0hKSA6IGVsZW1lbnRzLm1hcChwaWNrKSxcbiAgICAgICAgbnVsbCxcbiAgICAgICAgMixcbiAgICAgICk7XG4gICAgfVxuICAgIGNhc2UgJ21hcmtkb3duJzpcbiAgICAgIHJldHVybiBlbGVtZW50c1xuICAgICAgICAubWFwKChlLCBpbmRleCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGxpbmVzID0gW1xuICAgICAgICAgICAgYCMjIyAke2VsZW1lbnRzLmxlbmd0aCA+IDEgPyBgJHtpbmRleCArIDF9LiBgIDogJyd9RWxlbWVudDogXFxgJHtlbGVtZW50TGFiZWwoZSl9XFxgYCxcbiAgICAgICAgICBdO1xuICAgICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ3BhZ2UnKSkge1xuICAgICAgICAgICAgbGluZXMucHVzaChgLSBQYWdlOiAke2UucGFnZVVybH0gKCR7ZS52aWV3cG9ydC53aWR0aH1cdTAwRDcke2Uudmlld3BvcnQuaGVpZ2h0fSlgKTtcbiAgICAgICAgICAgIGlmIChlLmZyYW1lVXJsKSBsaW5lcy5wdXNoKGAtIEZyYW1lOiAke2UuZnJhbWVVcmx9YCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChmaWVsZHMuaW5jbHVkZXMoJ3NlbGVjdG9yJykpIGxpbmVzLnB1c2goYC0gU2VsZWN0b3I6IFxcYCR7ZS5zZWxlY3Rvcn1cXGBgKTtcbiAgICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCd4cGF0aCcpKSBsaW5lcy5wdXNoKGAtIFhQYXRoOiBcXGAke2UueHBhdGh9XFxgYCk7XG4gICAgICAgICAgaWYgKGZpZWxkcy5pbmNsdWRlcygncm9sZScpICYmIGUucm9sZSkge1xuICAgICAgICAgICAgbGluZXMucHVzaChgLSBSb2xlL25hbWU6ICR7ZS5yb2xlfSR7ZS5uYW1lID8gYCBcIiR7ZS5uYW1lfVwiYCA6ICcnfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCdjb21wb25lbnQnKSAmJiBlLmNvbXBvbmVudCkge1xuICAgICAgICAgICAgbGluZXMucHVzaChgLSBDb21wb25lbnQ6ICR7Y29tcG9uZW50TGFiZWwoZS5jb21wb25lbnQpfWApO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCdib3gnKSkge1xuICAgICAgICAgICAgY29uc3QgciA9IGUucmVjdDtcbiAgICAgICAgICAgIGxpbmVzLnB1c2goXG4gICAgICAgICAgICAgIGAtIEJveDogJHtNYXRoLnJvdW5kKHIud2lkdGgpfVx1MDBENyR7TWF0aC5yb3VuZChyLmhlaWdodCl9IGF0ICgke01hdGgucm91bmQoci54KX0sICR7TWF0aC5yb3VuZChyLnkpfSlgLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkcy5pbmNsdWRlcygndGV4dCcpICYmIGUudGV4dCkgbGluZXMucHVzaChgLSBUZXh0OiBcIiR7ZS50ZXh0fVwiYCk7XG4gICAgICAgICAgaWYgKGZpZWxkcy5pbmNsdWRlcygnc3R5bGVzJykpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0eWxlcyA9IE9iamVjdC5lbnRyaWVzKGUuc3R5bGVzKVxuICAgICAgICAgICAgICAubWFwKChbaywgdl0pID0+IGAke2t9OiR7dn1gKVxuICAgICAgICAgICAgICAuam9pbignOyAnKTtcbiAgICAgICAgICAgIGlmIChzdHlsZXMpIGxpbmVzLnB1c2goYC0gU3R5bGVzOiAke3N0eWxlc31gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGZpZWxkcy5pbmNsdWRlcygnYXR0cmlidXRlcycpKSB7XG4gICAgICAgICAgICBjb25zdCBhdHRyaWJ1dGVzID0gT2JqZWN0LmVudHJpZXMoZS5hdHRyaWJ1dGVzKVxuICAgICAgICAgICAgICAuZmlsdGVyKChbbmFtZV0pID0+IG5hbWUgIT09ICdjbGFzcycgJiYgbmFtZSAhPT0gJ2lkJyAmJiBuYW1lICE9PSAnc3R5bGUnKVxuICAgICAgICAgICAgICAubWFwKChbaywgdl0pID0+IGAke2t9PVwiJHt2fVwiYClcbiAgICAgICAgICAgICAgLmpvaW4oJyAnKTtcbiAgICAgICAgICAgIGlmIChhdHRyaWJ1dGVzKSBsaW5lcy5wdXNoKGAtIEF0dHJpYnV0ZXM6ICR7YXR0cmlidXRlc31gKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGUuc2NyZWVuc2hvdCkgbGluZXMucHVzaChgLSBTY3JlZW5zaG90OiAke2Uuc2NyZWVuc2hvdH1gKTtcbiAgICAgICAgICBpZiAoZmllbGRzLmluY2x1ZGVzKCdodG1sJykpIGxpbmVzLnB1c2goJ2BgYGh0bWwnLCBlLmh0bWwsICdgYGAnKTtcbiAgICAgICAgICByZXR1cm4gbGluZXMuam9pbignXFxuJyk7XG4gICAgICAgIH0pXG4gICAgICAgIC5qb2luKCdcXG5cXG4nKTtcbiAgfVxufVxuIiwgIi8vIENvbGxlY3RzIGVsZW1lbnQgZGV0YWlscyBpbnNpZGUgYSBwYWdlLiBVc2VkIGJ5IHRoZSBWUyBDb2RlIGV4dGVuc2lvbiAoYXMgc291cmNlIHRleHQgc2VudFxuLy8gb3ZlciBDRFAsIHZpYSBgdG9TdHJpbmcoKWApIGFuZCBieSB0aGUgYnJvd3NlciBleHRlbnNpb24gKGNhbGxlZCBkaXJlY3RseSksIHNvIHRoZSBmdW5jdGlvblxuLy8gbXVzdCBzdGF5IHNlbGYtY29udGFpbmVkOiBldmVyeXRoaW5nIGl0IG5lZWRzIGNvbWVzIGluIHRocm91Z2ggaXRzIHBhcmFtZXRlcnMuXG5pbXBvcnQgeyBidWlsZFNlbGVjdG9yLCBidWlsZFhQYXRoLCB0eXBlIEVsZW1lbnREZXRhaWxzIH0gZnJvbSAnLi9lbGVtZW50SW5mbyc7XG5cbi8qKiBDb21wdXRlZCBzdHlsZXMgd29ydGggc2hvd2luZzsgdmFsdWVzIHRoYXQgYXJlIGRlZmF1bHRzIGFyZSBkcm9wcGVkLiAqL1xuZXhwb3J0IGNvbnN0IFNUWUxFX1BST1BFUlRJRVMgPSBbXG4gICdkaXNwbGF5JyxcbiAgJ3Bvc2l0aW9uJyxcbiAgJ3dpZHRoJyxcbiAgJ2hlaWdodCcsXG4gICdtYXJnaW4nLFxuICAncGFkZGluZycsXG4gICdjb2xvcicsXG4gICdiYWNrZ3JvdW5kLWNvbG9yJyxcbiAgJ2ZvbnQtZmFtaWx5JyxcbiAgJ2ZvbnQtc2l6ZScsXG4gICdmb250LXdlaWdodCcsXG4gICdsaW5lLWhlaWdodCcsXG4gICdib3JkZXInLFxuICAnYm9yZGVyLXJhZGl1cycsXG4gICd6LWluZGV4JyxcbiAgJ2ZsZXgtZGlyZWN0aW9uJyxcbiAgJ2p1c3RpZnktY29udGVudCcsXG4gICdhbGlnbi1pdGVtcycsXG4gICdnYXAnLFxuICAnZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zJyxcbiAgJ29wYWNpdHknLFxuICAnb3ZlcmZsb3cnLFxuXTtcblxuZXhwb3J0IGludGVyZmFjZSBDb2xsZWN0SGVscGVycyB7XG4gIGJ1aWxkU2VsZWN0b3I6IHR5cGVvZiBidWlsZFNlbGVjdG9yO1xuICBidWlsZFhQYXRoOiB0eXBlb2YgYnVpbGRYUGF0aDtcbiAgc3R5bGVQcm9wZXJ0aWVzOiByZWFkb25seSBzdHJpbmdbXTtcbn1cblxuZXhwb3J0IHR5cGUgQ29sbGVjdGVkRGV0YWlscyA9IE9taXQ8RWxlbWVudERldGFpbHMsICdyb2xlJyB8ICduYW1lJz4gJiB7XG4gIHNjcm9sbDogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9O1xufTtcblxuLyoqXG4gKiBFdmVyeXRoaW5nIHRoZSBlbGVtZW50IHBpY2tlciBjb3BpZXMgYWJvdXQgYW4gZWxlbWVudCwgZXhjZXB0IHJvbGUgYW5kIGFjY2Vzc2libGUgbmFtZVxuICogKHRoZSBWUyBDb2RlIGV4dGVuc2lvbiByZWFkcyB0aG9zZSBmcm9tIENocm9tZSdzIGFjY2Vzc2liaWxpdHkgdHJlZTsgc2VlIGBhY2Nlc3NpYmxlSW5mb2ApLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY29sbGVjdEVsZW1lbnREZXRhaWxzKFxuICBlbDogRWxlbWVudCxcbiAgbWF4SHRtbDogbnVtYmVyLFxuICBoZWxwZXJzOiBDb2xsZWN0SGVscGVycyxcbik6IENvbGxlY3RlZERldGFpbHMge1xuICBjb25zdCBkb2MgPSBlbC5vd25lckRvY3VtZW50O1xuICBjb25zdCB3aW4gPSAoZG9jLmRlZmF1bHRWaWV3IHx8IHdpbmRvdykgYXMgV2luZG93ICYgdHlwZW9mIGdsb2JhbFRoaXM7XG4gIGNvbnN0IHJvb3ROb2RlID0gZWwuZ2V0Um9vdE5vZGUoKSBhcyBEb2N1bWVudCB8IFNoYWRvd1Jvb3Q7XG4gIGNvbnN0IHJvb3Q6IERvY3VtZW50IHwgU2hhZG93Um9vdCA9ICdxdWVyeVNlbGVjdG9yQWxsJyBpbiByb290Tm9kZSA/IHJvb3ROb2RlIDogZG9jO1xuICBjb25zdCBlc2NhcGUgPSAodmFsdWU6IHN0cmluZykgPT4gKHdpbi5DU1MgJiYgd2luLkNTUy5lc2NhcGUgPyB3aW4uQ1NTLmVzY2FwZSh2YWx1ZSkgOiB2YWx1ZSk7XG4gIGxldCBzZWxlY3RvciA9IGhlbHBlcnMuYnVpbGRTZWxlY3RvcihlbCwgKHMpID0+IHJvb3QucXVlcnlTZWxlY3RvckFsbChzKS5sZW5ndGgsIGVzY2FwZSk7XG4gIGlmIChyb290ICE9PSBkb2MgJiYgJ2hvc3QnIGluIHJvb3QgJiYgcm9vdC5ob3N0KSB7XG4gICAgY29uc3QgaG9zdFJvb3QgPSByb290Lmhvc3QuZ2V0Um9vdE5vZGUoKSBhcyBEb2N1bWVudCB8IFNoYWRvd1Jvb3Q7XG4gICAgY29uc3QgaG9zdCA9IGhlbHBlcnMuYnVpbGRTZWxlY3RvcihcbiAgICAgIHJvb3QuaG9zdCxcbiAgICAgIChzKSA9PiAoJ3F1ZXJ5U2VsZWN0b3JBbGwnIGluIGhvc3RSb290ID8gaG9zdFJvb3QgOiBkb2MpLnF1ZXJ5U2VsZWN0b3JBbGwocykubGVuZ3RoLFxuICAgICAgZXNjYXBlLFxuICAgICk7XG4gICAgc2VsZWN0b3IgPSBob3N0ICsgJyA+Pj4gJyArIHNlbGVjdG9yO1xuICB9XG4gIGNvbnN0IHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgY29uc3QgYXR0cmlidXRlczogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBmb3IgKGNvbnN0IGF0dHJpYnV0ZSBvZiBBcnJheS5mcm9tKGVsLmF0dHJpYnV0ZXMgfHwgW10pKSB7XG4gICAgYXR0cmlidXRlc1thdHRyaWJ1dGUubmFtZV0gPSBhdHRyaWJ1dGUudmFsdWUuc2xpY2UoMCwgMzAwKTtcbiAgfVxuICBjb25zdCBodG1sNSA9IGVsIGFzIEhUTUxFbGVtZW50O1xuICBjb25zdCB0ZXh0ID1cbiAgICAoaHRtbDUuaW5uZXJUZXh0IHx8IGVsLnRleHRDb250ZW50IHx8ICcnKS5yZXBsYWNlKC9cXHMrL2csICcgJykudHJpbSgpLnNsaWNlKDAsIDIwMCkgfHxcbiAgICB1bmRlZmluZWQ7XG4gIGxldCBodG1sID0gZWwub3V0ZXJIVE1MIHx8ICcnO1xuICBpZiAoaHRtbC5sZW5ndGggPiBtYXhIdG1sKSB7XG4gICAgLy8gS2VlcCB0aGUgZWxlbWVudCdzIG93biB0YWcgd2l0aCBpdHMgY2hpbGRyZW4gY29sbGFwc2VkLlxuICAgIGNvbnN0IHNoYWxsb3cgPSBlbC5jbG9uZU5vZGUoZmFsc2UpIGFzIEVsZW1lbnQ7XG4gICAgaWYgKGVsLmNoaWxkcmVuLmxlbmd0aCkgc2hhbGxvdy5pbm5lckhUTUwgPSAnXHUyMDI2JztcbiAgICBlbHNlIHNoYWxsb3cudGV4dENvbnRlbnQgPSAoZWwudGV4dENvbnRlbnQgfHwgJycpLnNsaWNlKDAsIDgwKSArICdcdTIwMjYnO1xuICAgIGh0bWwgPSBzaGFsbG93Lm91dGVySFRNTC5zbGljZSgwLCBtYXhIdG1sKTtcbiAgfVxuICBjb25zdCBjb21wdXRlZCA9IHdpbi5nZXRDb21wdXRlZFN0eWxlKGVsKTtcbiAgY29uc3Qgc3R5bGVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge307XG4gIGZvciAoY29uc3QgbmFtZSBvZiBoZWxwZXJzLnN0eWxlUHJvcGVydGllcykge1xuICAgIGNvbnN0IHZhbHVlID0gY29tcHV0ZWQuZ2V0UHJvcGVydHlWYWx1ZShuYW1lKTtcbiAgICBpZiAoXG4gICAgICAhdmFsdWUgfHxcbiAgICAgIC9eKG5vbmV8bm9ybWFsfGF1dG98MHB4fHN0YXRpY3x2aXNpYmxlfDF8cmdiYVxcKDAsIDAsIDAsIDBcXCl8MHB4IG5vbmUgLiopJC8udGVzdCh2YWx1ZSlcbiAgICApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBzdHlsZXNbbmFtZV0gPSB2YWx1ZS5sZW5ndGggPiA4MCA/IHZhbHVlLnNsaWNlKDAsIDgwKSArICdcdTIwMjYnIDogdmFsdWU7XG4gIH1cbiAgY29uc3QgY29tcG9uZW50ID0gKCgpOiBFbGVtZW50RGV0YWlsc1snY29tcG9uZW50J10gPT4ge1xuICAgIC8vIEZyYW1ld29yayBpbnRlcm5hbHMgYXJlIHBsYWluIEpTIHByb3BlcnRpZXMsIG9ubHkgdmlzaWJsZSBmcm9tIHRoZSBwYWdlJ3Mgb3duIEpTIHdvcmxkLlxuICAgIHR5cGUgTG9vc2UgPSBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiAmIHsgW2tleTogc3RyaW5nXTogYW55IH07IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLWV4cGxpY2l0LWFueVxuICAgIHRyeSB7XG4gICAgICBjb25zdCBub2RlID0gZWwgYXMgdW5rbm93biBhcyBMb29zZTtcbiAgICAgIGNvbnN0IGZpYmVyS2V5ID0gT2JqZWN0LmtleXMobm9kZSkuZmluZChcbiAgICAgICAgKGspID0+IGsuc3RhcnRzV2l0aCgnX19yZWFjdEZpYmVyJCcpIHx8IGsuc3RhcnRzV2l0aCgnX19yZWFjdEludGVybmFsSW5zdGFuY2UkJyksXG4gICAgICApO1xuICAgICAgaWYgKGZpYmVyS2V5KSB7XG4gICAgICAgIGZvciAobGV0IGZpYmVyID0gbm9kZVtmaWJlcktleV07IGZpYmVyOyBmaWJlciA9IGZpYmVyLnJldHVybikge1xuICAgICAgICAgIGNvbnN0IHR5cGUgPSBmaWJlci50eXBlO1xuICAgICAgICAgIGlmICghdHlwZSB8fCB0eXBlb2YgdHlwZSA9PT0gJ3N0cmluZycpIGNvbnRpbnVlO1xuICAgICAgICAgIGNvbnN0IG5hbWUgPVxuICAgICAgICAgICAgdHlwZS5kaXNwbGF5TmFtZSB8fFxuICAgICAgICAgICAgdHlwZS5uYW1lIHx8XG4gICAgICAgICAgICAodHlwZS5yZW5kZXIgJiYgKHR5cGUucmVuZGVyLmRpc3BsYXlOYW1lIHx8IHR5cGUucmVuZGVyLm5hbWUpKTtcbiAgICAgICAgICBpZiAoIW5hbWUpIGNvbnRpbnVlO1xuICAgICAgICAgIGxldCBmaWxlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBmaWJlci5fZGVidWdTb3VyY2UgJiYgZmliZXIuX2RlYnVnU291cmNlLmZpbGVOYW1lO1xuICAgICAgICAgIGxldCBsaW5lOiBudW1iZXIgfCB1bmRlZmluZWQgPSBmaWJlci5fZGVidWdTb3VyY2UgJiYgZmliZXIuX2RlYnVnU291cmNlLmxpbmVOdW1iZXI7XG4gICAgICAgICAgY29uc3Qgc3RhY2sgPSBmaWJlci5fZGVidWdTdGFjayAmJiBmaWJlci5fZGVidWdTdGFjay5zdGFjaztcbiAgICAgICAgICBpZiAoIWZpbGUgJiYgdHlwZW9mIHN0YWNrID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgY29uc3QgZnJhbWUgPVxuICAgICAgICAgICAgICBzdGFja1xuICAgICAgICAgICAgICAgIC5zcGxpdCgnXFxuJylcbiAgICAgICAgICAgICAgICAuc2xpY2UoMSlcbiAgICAgICAgICAgICAgICAuZmluZChcbiAgICAgICAgICAgICAgICAgIChsOiBzdHJpbmcpID0+XG4gICAgICAgICAgICAgICAgICAgICEvbm9kZV9tb2R1bGVzfHJlYWN0LWRvbXxyZWFjdC1zdGFja3xqc3gtZGV2LXJ1bnRpbWV8Y2h1bmstLy50ZXN0KGwpLFxuICAgICAgICAgICAgICAgICkgfHwgJyc7XG4gICAgICAgICAgICBjb25zdCBtYXRjaCA9IC9cXCg/KCg/Omh0dHBzP3xmaWxlfHdlYnBhY2tbXFx3LV0qKTpcXC9cXC9bXlxccyldKz8pOihcXGQrKTpcXGQrXFwpP1xccyokLy5leGVjKFxuICAgICAgICAgICAgICBmcmFtZSxcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgICAgICAgZmlsZSA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgICBsaW5lID0gTnVtYmVyKG1hdGNoWzJdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgZnJhbWV3b3JrOiAncmVhY3QnLCBuYW1lLCBmaWxlLCBsaW5lIH07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGNvbnN0IHZ1ZSA9IG5vZGUuX192dWVQYXJlbnRDb21wb25lbnQ7XG4gICAgICBpZiAodnVlKSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB2dWUudHlwZSB8fCB7fTtcbiAgICAgICAgY29uc3QgZmlsZSA9IHR5cGUuX19maWxlO1xuICAgICAgICBjb25zdCBuYW1lID1cbiAgICAgICAgICB0eXBlLm5hbWUgfHxcbiAgICAgICAgICB0eXBlLl9fbmFtZSB8fFxuICAgICAgICAgIChmaWxlXG4gICAgICAgICAgICA/IFN0cmluZyhmaWxlKVxuICAgICAgICAgICAgICAgIC5zcGxpdCgnLycpXG4gICAgICAgICAgICAgICAgLnBvcCgpIVxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXC52dWUkLywgJycpXG4gICAgICAgICAgICA6ICdBbm9ueW1vdXMnKTtcbiAgICAgICAgcmV0dXJuIHsgZnJhbWV3b3JrOiAndnVlJywgbmFtZSwgZmlsZSB9O1xuICAgICAgfVxuICAgICAgaWYgKG5vZGUuX192dWVfXykge1xuICAgICAgICBjb25zdCBvcHRpb25zID0gbm9kZS5fX3Z1ZV9fLiRvcHRpb25zIHx8IHt9O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZyYW1ld29yazogJ3Z1ZScsXG4gICAgICAgICAgbmFtZTogb3B0aW9ucy5uYW1lIHx8IG9wdGlvbnMuX2NvbXBvbmVudFRhZyB8fCAnQW5vbnltb3VzJyxcbiAgICAgICAgICBmaWxlOiBvcHRpb25zLl9fZmlsZSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGN1cnJlbnQ6IExvb3NlIHwgbnVsbCA9IG5vZGU7IGN1cnJlbnQ7IGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgaWYgKGN1cnJlbnQuX19zdmVsdGVfbWV0YSkge1xuICAgICAgICAgIGNvbnN0IGxvYyA9IGN1cnJlbnQuX19zdmVsdGVfbWV0YS5sb2MgfHwge307XG4gICAgICAgICAgY29uc3QgbmFtZSA9IGxvYy5maWxlXG4gICAgICAgICAgICA/IFN0cmluZyhsb2MuZmlsZSlcbiAgICAgICAgICAgICAgICAuc3BsaXQoJy8nKVxuICAgICAgICAgICAgICAgIC5wb3AoKSFcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFwuc3ZlbHRlJC8sICcnKVxuICAgICAgICAgICAgOiAnQ29tcG9uZW50JztcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJhbWV3b3JrOiAnc3ZlbHRlJyxcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICBmaWxlOiBsb2MuZmlsZSxcbiAgICAgICAgICAgIGxpbmU6IHR5cGVvZiBsb2MubGluZSA9PT0gJ251bWJlcicgPyBsb2MubGluZSArIDEgOiB1bmRlZmluZWQsXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgY29uc3QgbmcgPSAod2luIGFzIHVua25vd24gYXMgTG9vc2UpLm5nO1xuICAgICAgaWYgKG5nICYmIG5nLmdldE93bmluZ0NvbXBvbmVudCkge1xuICAgICAgICBjb25zdCBpbnN0YW5jZSA9IG5nLmdldENvbXBvbmVudChlbCkgfHwgbmcuZ2V0T3duaW5nQ29tcG9uZW50KGVsKTtcbiAgICAgICAgaWYgKGluc3RhbmNlKSByZXR1cm4geyBmcmFtZXdvcms6ICdhbmd1bGFyJywgbmFtZTogaW5zdGFuY2UuY29uc3RydWN0b3IubmFtZSB9O1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgLy8gRnJhbWV3b3JrIGludGVybmFscyB2YXJ5IGJldHdlZW4gdmVyc2lvbnM7IGRldGFpbHMgd29yayB3aXRob3V0IHRoZW0uXG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pKCk7XG4gIGxldCBwYWdlVXJsID0gd2luLmxvY2F0aW9uLmhyZWY7XG4gIGxldCBwYWdlVGl0bGUgPSBkb2MudGl0bGU7XG4gIHRyeSB7XG4gICAgcGFnZVVybCA9IHdpbi50b3AhLmxvY2F0aW9uLmhyZWY7XG4gICAgcGFnZVRpdGxlID0gd2luLnRvcCEuZG9jdW1lbnQudGl0bGU7XG4gIH0gY2F0Y2gge1xuICAgIC8vIENyb3NzLW9yaWdpbiBmcmFtZToga2VlcCB0aGUgZnJhbWUncyBvd24gVVJMIGFuZCB0aXRsZS5cbiAgfVxuICByZXR1cm4ge1xuICAgIHRhZzogZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgIGlkOiBlbC5pZCB8fCB1bmRlZmluZWQsXG4gICAgY2xhc3NlczogQXJyYXkuZnJvbShlbC5jbGFzc0xpc3QgfHwgW10pLFxuICAgIHNlbGVjdG9yLFxuICAgIHhwYXRoOiBoZWxwZXJzLmJ1aWxkWFBhdGgoZWwpLFxuICAgIHRleHQsXG4gICAgaHRtbCxcbiAgICBhdHRyaWJ1dGVzLFxuICAgIHJlY3Q6IHsgeDogcmVjdC54LCB5OiByZWN0LnksIHdpZHRoOiByZWN0LndpZHRoLCBoZWlnaHQ6IHJlY3QuaGVpZ2h0IH0sXG4gICAgc3R5bGVzLFxuICAgIGNvbXBvbmVudCxcbiAgICBwYWdlVXJsLFxuICAgIHBhZ2VUaXRsZSxcbiAgICB2aWV3cG9ydDogeyB3aWR0aDogd2luLmlubmVyV2lkdGgsIGhlaWdodDogd2luLmlubmVySGVpZ2h0IH0sXG4gICAgZnJhbWVVcmw6IHdpbiAhPT0gd2luLnRvcCA/IHdpbi5sb2NhdGlvbi5ocmVmIDogdW5kZWZpbmVkLFxuICAgIHNjcm9sbDogeyB4OiB3aW4uc2Nyb2xsWCwgeTogd2luLnNjcm9sbFkgfSxcbiAgfTtcbn1cblxuLyoqIFRoZSBoZWxwZXJzIGBjb2xsZWN0RWxlbWVudERldGFpbHNgIG5lZWRzLCBmb3IgY2FsbGluZyBpdCBkaXJlY3RseS4gKi9cbmV4cG9ydCBjb25zdCBDT0xMRUNUX0hFTFBFUlM6IENvbGxlY3RIZWxwZXJzID0ge1xuICBidWlsZFNlbGVjdG9yLFxuICBidWlsZFhQYXRoLFxuICBzdHlsZVByb3BlcnRpZXM6IFNUWUxFX1BST1BFUlRJRVMsXG59O1xuXG4vKiogTGFiZWxzIG9mIHRoZSBlbGVtZW50IGFuZCBpdHMgYW5jZXN0b3JzLCBvdXRlcm1vc3QgZmlyc3QgKHRoZSBicmVhZGNydW1iKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50QW5jZXN0cnkoZWw6IEVsZW1lbnQpOiBzdHJpbmdbXSB7XG4gIGNvbnN0IGxhYmVsczogc3RyaW5nW10gPSBbXTtcbiAgZm9yIChsZXQgbm9kZTogRWxlbWVudCB8IG51bGwgPSBlbDsgbm9kZSAmJiBsYWJlbHMubGVuZ3RoIDwgODsgbm9kZSA9IG5vZGUucGFyZW50RWxlbWVudCkge1xuICAgIGNvbnN0IGNsYXNzZXMgPSBBcnJheS5mcm9tKG5vZGUuY2xhc3NMaXN0IHx8IFtdKVxuICAgICAgLnNsaWNlKDAsIDIpXG4gICAgICAubWFwKChjKSA9PiAnLicgKyBjKVxuICAgICAgLmpvaW4oJycpO1xuICAgIGxhYmVscy51bnNoaWZ0KG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpICsgKG5vZGUuaWQgPyAnIycgKyBub2RlLmlkIDogJycpICsgY2xhc3Nlcyk7XG4gIH1cbiAgcmV0dXJuIGxhYmVscztcbn1cblxuY29uc3QgSU1QTElDSVRfUk9MRVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGE6ICdsaW5rJyxcbiAgYXJ0aWNsZTogJ2FydGljbGUnLFxuICBhc2lkZTogJ2NvbXBsZW1lbnRhcnknLFxuICBidXR0b246ICdidXR0b24nLFxuICBkaWFsb2c6ICdkaWFsb2cnLFxuICBmb290ZXI6ICdjb250ZW50aW5mbycsXG4gIGZvcm06ICdmb3JtJyxcbiAgaDE6ICdoZWFkaW5nJyxcbiAgaDI6ICdoZWFkaW5nJyxcbiAgaDM6ICdoZWFkaW5nJyxcbiAgaDQ6ICdoZWFkaW5nJyxcbiAgaDU6ICdoZWFkaW5nJyxcbiAgaDY6ICdoZWFkaW5nJyxcbiAgaGVhZGVyOiAnYmFubmVyJyxcbiAgaHI6ICdzZXBhcmF0b3InLFxuICBpbWc6ICdpbWcnLFxuICBsaTogJ2xpc3RpdGVtJyxcbiAgbWFpbjogJ21haW4nLFxuICBuYXY6ICduYXZpZ2F0aW9uJyxcbiAgb2w6ICdsaXN0JyxcbiAgb3B0aW9uOiAnb3B0aW9uJyxcbiAgcHJvZ3Jlc3M6ICdwcm9ncmVzc2JhcicsXG4gIHNlY3Rpb246ICdyZWdpb24nLFxuICBzZWxlY3Q6ICdjb21ib2JveCcsXG4gIHRhYmxlOiAndGFibGUnLFxuICB0ZXh0YXJlYTogJ3RleHRib3gnLFxuICB1bDogJ2xpc3QnLFxufTtcblxuY29uc3QgSU5QVVRfUk9MRVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGJ1dHRvbjogJ2J1dHRvbicsXG4gIGNoZWNrYm94OiAnY2hlY2tib3gnLFxuICBlbWFpbDogJ3RleHRib3gnLFxuICBpbWFnZTogJ2J1dHRvbicsXG4gIG51bWJlcjogJ3NwaW5idXR0b24nLFxuICByYWRpbzogJ3JhZGlvJyxcbiAgcmFuZ2U6ICdzbGlkZXInLFxuICByZXNldDogJ2J1dHRvbicsXG4gIHNlYXJjaDogJ3NlYXJjaGJveCcsXG4gIHN1Ym1pdDogJ2J1dHRvbicsXG4gIHRlbDogJ3RleHRib3gnLFxuICB0ZXh0OiAndGV4dGJveCcsXG4gIHVybDogJ3RleHRib3gnLFxufTtcblxuLyoqIFJvbGVzIHdob3NlIGFjY2Vzc2libGUgbmFtZSBjb21lcyBmcm9tIHRoZWlyIHRleHQgY29udGVudC4gKi9cbmNvbnN0IE5BTUVfRlJPTV9DT05URU5UID0gbmV3IFNldChbXG4gICdidXR0b24nLFxuICAnbGluaycsXG4gICdoZWFkaW5nJyxcbiAgJ2xpc3RpdGVtJyxcbiAgJ29wdGlvbicsXG4gICd0YWInLFxuICAnbWVudWl0ZW0nLFxuICAnY2VsbCcsXG5dKTtcblxuLyoqXG4gKiBSb2xlIGFuZCBhY2Nlc3NpYmxlIG5hbWUsIGFwcHJveGltYXRpbmcgdGhlIGFjY2Vzc2liaWxpdHkgdHJlZSB3aXRob3V0IERldlRvb2xzIGFjY2VzczpcbiAqIGV4cGxpY2l0IEFSSUEgZmlyc3QsIHRoZW4gdGhlIHVzdWFsIGltcGxpY2l0IHJvbGVzIGFuZCBuYW1pbmcgcnVsZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhY2Nlc3NpYmxlSW5mbyhlbDogRWxlbWVudCk6IHsgcm9sZT86IHN0cmluZzsgbmFtZT86IHN0cmluZyB9IHtcbiAgY29uc3QgdGFnID0gZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpO1xuICBsZXQgcm9sZSA9IGVsLmdldEF0dHJpYnV0ZSgncm9sZScpPy5zcGxpdCgvXFxzKy8pWzBdIHx8IHVuZGVmaW5lZDtcbiAgaWYgKCFyb2xlKSB7XG4gICAgaWYgKHRhZyA9PT0gJ2lucHV0Jykgcm9sZSA9IElOUFVUX1JPTEVTWyhlbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSB8fCAndGV4dCcpLnRvTG93ZXJDYXNlKCldO1xuICAgIGVsc2UgaWYgKHRhZyA9PT0gJ2EnKSByb2xlID0gZWwuaGFzQXR0cmlidXRlKCdocmVmJykgPyAnbGluaycgOiB1bmRlZmluZWQ7XG4gICAgZWxzZSBpZiAodGFnID09PSAnc2VjdGlvbicpIHJvbGUgPSBlbC5oYXNBdHRyaWJ1dGUoJ2FyaWEtbGFiZWwnKSA/ICdyZWdpb24nIDogdW5kZWZpbmVkO1xuICAgIGVsc2Ugcm9sZSA9IElNUExJQ0lUX1JPTEVTW3RhZ107XG4gIH1cbiAgY29uc3QgY2xlYW4gPSAodGV4dDogc3RyaW5nIHwgbnVsbCB8IHVuZGVmaW5lZCkgPT5cbiAgICAodGV4dCB8fCAnJykucmVwbGFjZSgvXFxzKy9nLCAnICcpLnRyaW0oKS5zbGljZSgwLCAyMDApIHx8IHVuZGVmaW5lZDtcbiAgY29uc3QgbGFiZWxsZWRCeSA9IGVsLmdldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbGxlZGJ5Jyk7XG4gIGxldCBuYW1lOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gIGlmIChsYWJlbGxlZEJ5KSB7XG4gICAgbmFtZSA9IGNsZWFuKFxuICAgICAgbGFiZWxsZWRCeVxuICAgICAgICAuc3BsaXQoL1xccysvKVxuICAgICAgICAubWFwKChpZCkgPT4gZWwub3duZXJEb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCk/LnRleHRDb250ZW50IHx8ICcnKVxuICAgICAgICAuam9pbignICcpLFxuICAgICk7XG4gIH1cbiAgbmFtZSA/Pz0gY2xlYW4oZWwuZ2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJykpO1xuICBpZiAoIW5hbWUgJiYgKHRhZyA9PT0gJ2ltZycgfHwgdGFnID09PSAnYXJlYScpKSBuYW1lID0gY2xlYW4oZWwuZ2V0QXR0cmlidXRlKCdhbHQnKSk7XG4gIGlmICghbmFtZSAmJiAnbGFiZWxzJyBpbiBlbCkge1xuICAgIGNvbnN0IGxhYmVscyA9IChlbCBhcyBIVE1MSW5wdXRFbGVtZW50KS5sYWJlbHM7XG4gICAgaWYgKGxhYmVscz8ubGVuZ3RoKVxuICAgICAgbmFtZSA9IGNsZWFuKFxuICAgICAgICBBcnJheS5mcm9tKGxhYmVscylcbiAgICAgICAgICAubWFwKChsKSA9PiBsLnRleHRDb250ZW50KVxuICAgICAgICAgIC5qb2luKCcgJyksXG4gICAgICApO1xuICB9XG4gIGlmICghbmFtZSAmJiB0YWcgPT09ICdpbnB1dCcpIHtcbiAgICBjb25zdCBpbnB1dCA9IGVsIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgaWYgKFsnYnV0dG9uJywgJ3N1Ym1pdCcsICdyZXNldCddLmluY2x1ZGVzKGlucHV0LnR5cGUpKSBuYW1lID0gY2xlYW4oaW5wdXQudmFsdWUpO1xuICAgIG5hbWUgPz89IGNsZWFuKGlucHV0LnBsYWNlaG9sZGVyKTtcbiAgfVxuICBpZiAoIW5hbWUgJiYgcm9sZSAmJiBOQU1FX0ZST01fQ09OVEVOVC5oYXMocm9sZSkpIHtcbiAgICBuYW1lID0gY2xlYW4oKGVsIGFzIEhUTUxFbGVtZW50KS5pbm5lclRleHQgfHwgZWwudGV4dENvbnRlbnQpO1xuICB9XG4gIG5hbWUgPz89IGNsZWFuKGVsLmdldEF0dHJpYnV0ZSgndGl0bGUnKSk7XG4gIHJldHVybiB7IHJvbGU6IHJvbGUgfHwgJ2dlbmVyaWMnLCBuYW1lIH07XG59XG5cbi8qKiBQYXJlbnQgZWxlbWVudCAoc3RlcHBpbmcgb3V0IG9mIHNoYWRvdyByb290cyksIG9yIG51bGwgYXQgdGhlIHRvcC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJlbnRFbGVtZW50T2YoZWw6IEVsZW1lbnQpOiBFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudCA9IGVsLnBhcmVudEVsZW1lbnQgfHwgKChlbC5nZXRSb290Tm9kZSgpIGFzIFNoYWRvd1Jvb3QpLmhvc3QgPz8gbnVsbCk7XG4gIHJldHVybiBwYXJlbnQgJiYgcGFyZW50LnRhZ05hbWUgIT09ICdIVE1MJyA/IHBhcmVudCA6IG51bGw7XG59XG5cbi8qKiBGaXJzdCBjaGlsZCBlbGVtZW50IChzdGVwcGluZyBpbnRvIGFuIG9wZW4gc2hhZG93IHJvb3QpLCBvciBudWxsLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0Q2hpbGRFbGVtZW50T2YoZWw6IEVsZW1lbnQpOiBFbGVtZW50IHwgbnVsbCB7XG4gIHJldHVybiBlbC5maXJzdEVsZW1lbnRDaGlsZCB8fCBlbC5zaGFkb3dSb290Py5maXJzdEVsZW1lbnRDaGlsZCB8fCBudWxsO1xufVxuIiwgIi8vIENvbnNvbGUgYW5kIG5ldHdvcmsgZW50cmllcyBmb3IgdGhlIGRldmVsb3BlciBkcmF3ZXIsIGFuZCBNYXJrZG93biBzdW1tYXJpZXMgZm9yIEFJIGFnZW50cy5cblxuZXhwb3J0IHR5cGUgQ29uc29sZUxldmVsID0gJ2Vycm9yJyB8ICd3YXJuaW5nJyB8ICdpbmZvJyB8ICdkZWJ1Zyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uc29sZUVudHJ5IHtcbiAgaWQ6IG51bWJlcjtcbiAgbGV2ZWw6IENvbnNvbGVMZXZlbDtcbiAgdGV4dDogc3RyaW5nO1xuICAvKiogU2NyaXB0IFVSTCAob3Igd29ya3NwYWNlLXJlbGF0aXZlIHBhdGgpIGFuZCBwb3NpdGlvbiB0aGF0IHByb2R1Y2VkIHRoZSBtZXNzYWdlLiAqL1xuICB1cmw/OiBzdHJpbmc7XG4gIGxpbmU/OiBudW1iZXI7XG4gIGNvbHVtbj86IG51bWJlcjtcbiAgLyoqIGBjb25zb2xlYCwgYGV4Y2VwdGlvbmAsIG9yIGEgYnJvd3NlciBsb2cgc291cmNlIHN1Y2ggYXMgYG5ldHdvcmtgIG9yIGBzZWN1cml0eWAuICovXG4gIHNvdXJjZTogc3RyaW5nO1xuICB0aW1lOiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTmV0d29ya0VudHJ5IHtcbiAgaWQ6IHN0cmluZztcbiAgbWV0aG9kOiBzdHJpbmc7XG4gIHVybDogc3RyaW5nO1xuICAvKiogUmVzb3VyY2UgdHlwZTogRG9jdW1lbnQsIFNjcmlwdCwgRmV0Y2gsIFhIUiwgSW1hZ2UuLi4gKi9cbiAgdHlwZTogc3RyaW5nO1xuICBzdGF0dXM/OiBudW1iZXI7XG4gIG1pbWVUeXBlPzogc3RyaW5nO1xuICAvKiogVHJhbnNmZXJyZWQgYnl0ZXMuICovXG4gIHNpemU/OiBudW1iZXI7XG4gIC8qKiBNaWxsaXNlY29uZHMuICovXG4gIGR1cmF0aW9uPzogbnVtYmVyO1xuICBlcnJvcj86IHN0cmluZztcbiAgY2FuY2VsZWQ/OiBib29sZWFuO1xuICB0aW1lOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0ZhaWxlZFJlcXVlc3QoZW50cnk6IE5ldHdvcmtFbnRyeSk6IGJvb2xlYW4ge1xuICByZXR1cm4gISFlbnRyeS5lcnJvciB8fCAoZW50cnkuc3RhdHVzICE9PSB1bmRlZmluZWQgJiYgZW50cnkuc3RhdHVzID49IDQwMCk7XG59XG5cbmZ1bmN0aW9uIGxvY2F0aW9uKGVudHJ5OiBDb25zb2xlRW50cnkpOiBzdHJpbmcge1xuICBpZiAoIWVudHJ5LnVybCkgcmV0dXJuICcnO1xuICBjb25zdCBsaW5lID0gZW50cnkubGluZSAhPT0gdW5kZWZpbmVkID8gYDoke2VudHJ5LmxpbmUgKyAxfWAgOiAnJztcbiAgY29uc3QgY29sdW1uID1cbiAgICBlbnRyeS5saW5lICE9PSB1bmRlZmluZWQgJiYgZW50cnkuY29sdW1uICE9PSB1bmRlZmluZWQgPyBgOiR7ZW50cnkuY29sdW1uICsgMX1gIDogJyc7XG4gIHJldHVybiBgJHtlbnRyeS51cmx9JHtsaW5lfSR7Y29sdW1ufWA7XG59XG5cbi8qKiBDb25zb2xlIGVycm9ycyAoYW5kIG9wdGlvbmFsbHkgd2FybmluZ3MpIGFzIGEgbnVtYmVyZWQgTWFya2Rvd24gbGlzdC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDb25zb2xlRXJyb3JzKFxuICBlbnRyaWVzOiBDb25zb2xlRW50cnlbXSxcbiAgcGFnZVVybDogc3RyaW5nLFxuICBpbmNsdWRlV2FybmluZ3MgPSBmYWxzZSxcbik6IHN0cmluZyB7XG4gIGNvbnN0IHBpY2tlZCA9IGVudHJpZXMuZmlsdGVyKFxuICAgIChlKSA9PiBlLmxldmVsID09PSAnZXJyb3InIHx8IChpbmNsdWRlV2FybmluZ3MgJiYgZS5sZXZlbCA9PT0gJ3dhcm5pbmcnKSxcbiAgKTtcbiAgaWYgKCFwaWNrZWQubGVuZ3RoKSByZXR1cm4gYCMjIyBDb25zb2xlIGVycm9yczogJHtwYWdlVXJsfVxcbk5vIGVycm9ycy5gO1xuICBjb25zdCBsaW5lcyA9IFtgIyMjIENvbnNvbGUgZXJyb3JzOiAke3BhZ2VVcmx9ICgke3BpY2tlZC5sZW5ndGh9KWBdO1xuICBwaWNrZWQuZm9yRWFjaCgoZW50cnksIGluZGV4KSA9PiB7XG4gICAgY29uc3QgW2ZpcnN0LCAuLi5yZXN0XSA9IGVudHJ5LnRleHQuc3BsaXQoJ1xcbicpO1xuICAgIGxpbmVzLnB1c2goYCR7aW5kZXggKyAxfS4gJHtlbnRyeS5sZXZlbCA9PT0gJ3dhcm5pbmcnID8gJ1t3YXJuaW5nXSAnIDogJyd9JHtmaXJzdH1gKTtcbiAgICBmb3IgKGNvbnN0IGxpbmUgb2YgcmVzdC5zbGljZSgwLCA4KSkgbGluZXMucHVzaChgICAgJHtsaW5lLnRyaW0oKX1gKTtcbiAgICBjb25zdCB3aGVyZSA9IGxvY2F0aW9uKGVudHJ5KTtcbiAgICBpZiAod2hlcmUgJiYgIWVudHJ5LnRleHQuaW5jbHVkZXMod2hlcmUpKSBsaW5lcy5wdXNoKGAgICBhdCAke3doZXJlfWApO1xuICB9KTtcbiAgcmV0dXJuIGxpbmVzLmpvaW4oJ1xcbicpO1xufVxuXG5mdW5jdGlvbiByZXF1ZXN0TGluZShlbnRyeTogTmV0d29ya0VudHJ5KTogc3RyaW5nIHtcbiAgY29uc3Qgb3V0Y29tZSA9IGVudHJ5LmVycm9yXG4gICAgPyBlbnRyeS5jYW5jZWxlZFxuICAgICAgPyAnY2FuY2VsZWQnXG4gICAgICA6IGVudHJ5LmVycm9yXG4gICAgOiBgJHtlbnRyeS5zdGF0dXN9JHtlbnRyeS5taW1lVHlwZSA/IGAgJHtlbnRyeS5taW1lVHlwZX1gIDogJyd9YDtcbiAgY29uc3QgdGltaW5nID0gZW50cnkuZHVyYXRpb24gIT09IHVuZGVmaW5lZCA/IGAsICR7TWF0aC5yb3VuZChlbnRyeS5kdXJhdGlvbil9IG1zYCA6ICcnO1xuICByZXR1cm4gYC0gJHtlbnRyeS5tZXRob2R9ICR7ZW50cnkudXJsfSBcdTIxOTIgJHtvdXRjb21lfSAoJHtlbnRyeS50eXBlfSR7dGltaW5nfSlgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0RmFpbGVkUmVxdWVzdHMoZW50cmllczogTmV0d29ya0VudHJ5W10sIHBhZ2VVcmw6IHN0cmluZyk6IHN0cmluZyB7XG4gIGNvbnN0IGZhaWxlZCA9IGVudHJpZXMuZmlsdGVyKGlzRmFpbGVkUmVxdWVzdCk7XG4gIGlmICghZmFpbGVkLmxlbmd0aCkgcmV0dXJuIGAjIyMgRmFpbGVkIG5ldHdvcmsgcmVxdWVzdHM6ICR7cGFnZVVybH1cXG5ObyBmYWlsZWQgcmVxdWVzdHMuYDtcbiAgcmV0dXJuIFtcbiAgICBgIyMjIEZhaWxlZCBuZXR3b3JrIHJlcXVlc3RzOiAke3BhZ2VVcmx9ICgke2ZhaWxlZC5sZW5ndGh9KWAsXG4gICAgLi4uZmFpbGVkLm1hcChyZXF1ZXN0TGluZSksXG4gIF0uam9pbignXFxuJyk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGFnZUNvbnRleHRJbnB1dCB7XG4gIHVybDogc3RyaW5nO1xuICB0aXRsZTogc3RyaW5nO1xuICB2aWV3cG9ydDogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9O1xuICBkZXZpY2U/OiBzdHJpbmc7XG4gIHNlbGVjdGlvbj86IHN0cmluZztcbiAgY29uc29sZTogQ29uc29sZUVudHJ5W107XG4gIG5ldHdvcms6IE5ldHdvcmtFbnRyeVtdO1xufVxuXG4vKiogQSBzaG9ydCBzdW1tYXJ5IG9mIHRoZSBwYWdlIGZvciBhbiBBSSBhZ2VudDogd2hlcmUsIHdoYXQgc2l6ZSwgYW5kIHdoYXQgd2VudCB3cm9uZy4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRQYWdlQ29udGV4dChpbnB1dDogUGFnZUNvbnRleHRJbnB1dCk6IHN0cmluZyB7XG4gIGNvbnN0IGxpbmVzID0gW1xuICAgICcjIyMgUGFnZSBjb250ZXh0JyxcbiAgICBgLSBVUkw6ICR7aW5wdXQudXJsfWAsXG4gICAgYC0gVGl0bGU6ICR7aW5wdXQudGl0bGV9YCxcbiAgICBgLSBWaWV3cG9ydDogJHtpbnB1dC52aWV3cG9ydC53aWR0aH1cdTAwRDcke2lucHV0LnZpZXdwb3J0LmhlaWdodH0ke2lucHV0LmRldmljZSA/IGAgKGVtdWxhdGluZyAke2lucHV0LmRldmljZX0pYCA6ICcnfWAsXG4gIF07XG4gIGlmIChpbnB1dC5zZWxlY3Rpb24pIGxpbmVzLnB1c2goYC0gU2VsZWN0ZWQgdGV4dDogXCIke2lucHV0LnNlbGVjdGlvbi5zbGljZSgwLCA1MDApfVwiYCk7XG4gIGNvbnN0IGVycm9ycyA9IGlucHV0LmNvbnNvbGUuZmlsdGVyKChlKSA9PiBlLmxldmVsID09PSAnZXJyb3InKS5zbGljZSgtNSk7XG4gIGlmIChlcnJvcnMubGVuZ3RoKSB7XG4gICAgbGluZXMucHVzaCgnJywgYFJlY2VudCBjb25zb2xlIGVycm9ycyAoJHtlcnJvcnMubGVuZ3RofSk6YCk7XG4gICAgZm9yIChjb25zdCBlIG9mIGVycm9ycykge1xuICAgICAgY29uc3Qgd2hlcmUgPSBsb2NhdGlvbihlKTtcbiAgICAgIGxpbmVzLnB1c2goYC0gJHtlLnRleHQuc3BsaXQoJ1xcbicpWzBdfSR7d2hlcmUgPyBgICgke3doZXJlfSlgIDogJyd9YCk7XG4gICAgfVxuICB9XG4gIGNvbnN0IGZhaWxlZCA9IGlucHV0Lm5ldHdvcmsuZmlsdGVyKGlzRmFpbGVkUmVxdWVzdCkuc2xpY2UoLTUpO1xuICBpZiAoZmFpbGVkLmxlbmd0aClcbiAgICBsaW5lcy5wdXNoKCcnLCBgRmFpbGVkIHJlcXVlc3RzICgke2ZhaWxlZC5sZW5ndGh9KTpgLCAuLi5mYWlsZWQubWFwKHJlcXVlc3RMaW5lKSk7XG4gIHJldHVybiBsaW5lcy5qb2luKCdcXG4nKTtcbn1cblxuLyoqIEEgcmVtb3RlIG9iamVjdCBmcm9tIGBSdW50aW1lLmNvbnNvbGVBUElDYWxsZWRgIGFzIHRleHQsIGxpa2UgdGhlIERldlRvb2xzIGNvbnNvbGUgc2hvd3MgaXQuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzY3JpYmVSZW1vdGVPYmplY3Qob2JqZWN0OiB7XG4gIHR5cGU6IHN0cmluZztcbiAgc3VidHlwZT86IHN0cmluZztcbiAgdmFsdWU/OiB1bmtub3duO1xuICB1bnNlcmlhbGl6YWJsZVZhbHVlPzogc3RyaW5nO1xuICBkZXNjcmlwdGlvbj86IHN0cmluZztcbiAgcHJldmlldz86IHtcbiAgICBwcm9wZXJ0aWVzOiB7IG5hbWU6IHN0cmluZzsgdmFsdWU/OiBzdHJpbmc7IHR5cGU6IHN0cmluZyB9W107XG4gICAgb3ZlcmZsb3c6IGJvb2xlYW47XG4gICAgc3VidHlwZT86IHN0cmluZztcbiAgfTtcbn0pOiBzdHJpbmcge1xuICBpZiAob2JqZWN0LnVuc2VyaWFsaXphYmxlVmFsdWUpIHJldHVybiBvYmplY3QudW5zZXJpYWxpemFibGVWYWx1ZTtcbiAgaWYgKG9iamVjdC50eXBlID09PSAnc3RyaW5nJykgcmV0dXJuIFN0cmluZyhvYmplY3QudmFsdWUpO1xuICBpZiAob2JqZWN0LnR5cGUgPT09ICd1bmRlZmluZWQnKSByZXR1cm4gJ3VuZGVmaW5lZCc7XG4gIGlmIChvYmplY3Quc3VidHlwZSA9PT0gJ251bGwnKSByZXR1cm4gJ251bGwnO1xuICBpZiAoJ3ZhbHVlJyBpbiBvYmplY3QgJiYgb2JqZWN0LnZhbHVlICE9PSB1bmRlZmluZWQgJiYgb2JqZWN0LnR5cGUgIT09ICdvYmplY3QnKVxuICAgIHJldHVybiBTdHJpbmcob2JqZWN0LnZhbHVlKTtcbiAgaWYgKG9iamVjdC5wcmV2aWV3ICYmIG9iamVjdC5zdWJ0eXBlICE9PSAnZXJyb3InKSB7XG4gICAgY29uc3QgaXNBcnJheSA9IG9iamVjdC5zdWJ0eXBlID09PSAnYXJyYXknO1xuICAgIGNvbnN0IHBhcnRzID0gb2JqZWN0LnByZXZpZXcucHJvcGVydGllcy5tYXAoKHApID0+IHtcbiAgICAgIGNvbnN0IHZhbHVlID0gcC50eXBlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KHAudmFsdWUgPz8gJycpIDogKHAudmFsdWUgPz8gJycpO1xuICAgICAgcmV0dXJuIGlzQXJyYXkgPyB2YWx1ZSA6IGAke3AubmFtZX06ICR7dmFsdWV9YDtcbiAgICB9KTtcbiAgICBpZiAob2JqZWN0LnByZXZpZXcub3ZlcmZsb3cpIHBhcnRzLnB1c2goJ1x1MjAyNicpO1xuICAgIHJldHVybiBpc0FycmF5ID8gYFske3BhcnRzLmpvaW4oJywgJyl9XWAgOiBgeyR7cGFydHMuam9pbignLCAnKX19YDtcbiAgfVxuICByZXR1cm4gb2JqZWN0LmRlc2NyaXB0aW9uID8/IG9iamVjdC50eXBlO1xufVxuXG4vKiogUmVwbGFjZXMgYCVzYCwgYCVkYCwgYCVpYCwgYCVmYCwgYCVvYCwgYCVPYCwgYCVjYCBpbiB0aGUgZmlyc3QgY29uc29sZSBhcmd1bWVudC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDb25zb2xlQXJndW1lbnRzKHRleHRzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIGNvbnN0IFtmaXJzdCwgLi4ucmVzdF0gPSB0ZXh0cztcbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQpIHJldHVybiAnJztcbiAgbGV0IGluZGV4ID0gMDtcbiAgY29uc3QgZm9ybWF0dGVkID0gZmlyc3QucmVwbGFjZSgvJVtzZGlmb09jXS9nLCAodG9rZW4pID0+IHtcbiAgICBpZiAoaW5kZXggPj0gcmVzdC5sZW5ndGgpIHJldHVybiB0b2tlbjtcbiAgICBjb25zdCB2YWx1ZSA9IHJlc3RbaW5kZXgrK10hO1xuICAgIGlmICh0b2tlbiA9PT0gJyVjJykgcmV0dXJuICcnO1xuICAgIGlmICh0b2tlbiA9PT0gJyVkJyB8fCB0b2tlbiA9PT0gJyVpJykgcmV0dXJuIFN0cmluZyhwYXJzZUludCh2YWx1ZSwgMTApKTtcbiAgICBpZiAodG9rZW4gPT09ICclZicpIHJldHVybiBTdHJpbmcocGFyc2VGbG9hdCh2YWx1ZSkpO1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSk7XG4gIHJldHVybiBbZm9ybWF0dGVkLCAuLi5yZXN0LnNsaWNlKGluZGV4KV0uam9pbignICcpO1xufVxuIiwgIi8vIE1lc3NhZ2VzIGJldHdlZW4gdGhlIGV4dGVuc2lvbidzIHBhcnRzLiBDb250ZW50IFx1MjE5NCBiYWNrZ3JvdW5kIHVzZSBgY2hyb21lLnJ1bnRpbWVgIG1lc3NhZ2luZztcbi8vIGNvbnRlbnQgXHUyMTk0IHBhZ2UgKE1BSU4gd29ybGQpIHVzZSBET00gZXZlbnRzIHdpdGggSlNPTiBzdHJpbmdzLCBzbyBub3RoaW5nIGRlcGVuZHMgb24gaG93IGVhY2hcbi8vIGJyb3dzZXIgc2hhcmVzIG9iamVjdHMgYmV0d2VlbiB3b3JsZHMuXG5pbXBvcnQgdHlwZSB7IENhcHR1cmVUb1NhdmUsIFByb2plY3QgfSBmcm9tICdAaW5rc3BlY3Qvc2hhcmVkL2h1Yic7XG5pbXBvcnQgdHlwZSB7IERldmljZVNldHRpbmdzLCBOZXR3b3JrUHJlc2V0IH0gZnJvbSAnQGlua3NwZWN0L3NoYXJlZC9kZXZpY2VzJztcbmltcG9ydCB0eXBlIHsgSGFybmVzcyB9IGZyb20gJ0BpbmtzcGVjdC9zaGFyZWQvdGFyZ2V0cyc7XG5cbmV4cG9ydCB0eXBlIEJyaWRnZVN0YXRlID0gJ2Nvbm5lY3RlZCcgfCAnY29ubmVjdGluZycgfCAndW5wYWlyZWQnIHwgJ29mZmxpbmUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJyaWRnZVN0YXR1cyB7XG4gIHN0YXRlOiBCcmlkZ2VTdGF0ZTtcbiAgLyoqIFZTIENvZGUgd2luZG93IC8gd29ya3NwYWNlIG5hbWUgd2hlbiBjb25uZWN0ZWQuICovXG4gIHBlZXI/OiBzdHJpbmc7XG4gIGVycm9yPzogc3RyaW5nO1xuICAvKipcbiAgICogUHJvamVjdHMgYW5kIHRoZWlyIHNhdmVkIGNhcHR1cmVzIGNhbiBiZSByZWFjaGVkOiB0aHJvdWdoIHRoZSBicm93c2VyIGhlbHBlciwgb3IgYSBWUyBDb2RlXG4gICAqIHdpbmRvdyB0aGF0IGFuc3dlcnMgZm9yIHRoZW0gb3ZlciB0aGUgV2ViU29ja2V0IGxpbmsuXG4gICAqL1xuICBwcm9qZWN0cz86IGJvb2xlYW47XG4gIC8qKlxuICAgKiBXaGF0IHRoZSBhbnN3ZXJpbmcgc2lkZSBjYW4gZG8gYmV5b25kIHRoZSBmaXJzdCB2ZXJzaW9uICh0aGUgaHViJ3MgYGZlYXR1cmVzYDsgVlMgQ29kZSBvdmVyXG4gICAqIHRoZSBXZWJTb2NrZXQgbGluayBydW5zIHRoZSBzYW1lIGNvZGUsIHNvIGFsbCBvZiB0aGVtKS5cbiAgICovXG4gIGZlYXR1cmVzPzogc3RyaW5nW107XG4gIC8qKiBIb3cgVlMgQ29kZSBpcyByZWFjaGVkOiB0aGUgYnJvd3NlciBoZWxwZXIgKG5hdGl2ZSBtZXNzYWdpbmcsIG5vIHBhaXJpbmcpIG9yIHRoZSBXZWJTb2NrZXQuICovXG4gIHZpYT86ICdodWInIHwgJ3dzJztcbn1cblxuLyoqXG4gKiBXaGF0IHRoZSBkZWJ1Z2dlciBlbXVsYXRlcyBmb3IgdGhlIHJlc3BvbnNpdmUgdmlldyAoQ2hyb21lKTogdGhlIGRldmljZSdzIHVzZXIgYWdlbnQgYW5kIHRvdWNoLFxuICogbmV0d29yaywgQ1BVIGFuZCBtZWRpYS4gVGhlIHNpemUgY29tZXMgZnJvbSB0aGUgY2VudGVyZWQgZnJhbWUsIG5vdCBmcm9tIHRoZSBkZWJ1Z2dlciAoaXRzXG4gKiBkZXZpY2UgbWV0cmljcyBhbHdheXMgZHJhdyB0aGUgcGFnZSBhdCB0aGUgdGFiJ3MgdG9wLWxlZnQpLiBOb3RoaW5nIHNldCBlbmRzIGVtdWxhdGlvbi5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBFbXVsYXRpb25SZXF1ZXN0IHtcbiAgLyoqIFRoZSBkZXZpY2UncyB1c2VyIGFnZW50IGFuZCB0b3VjaDsgdW5kZWZpbmVkIGtlZXBzIHRoZSBicm93c2VyJ3Mgb3duLiAqL1xuICBhZ2VudD86IFBhcnRpYWw8UGljazxEZXZpY2VTZXR0aW5ncywgJ3VzZXJBZ2VudCcgfCAndG91Y2gnPj47XG4gIG5ldHdvcms6IE5ldHdvcmtQcmVzZXQ7XG4gIGNwdTogbnVtYmVyO1xuICBjb2xvclNjaGVtZTogJ2RlZmF1bHQnIHwgJ2xpZ2h0JyB8ICdkYXJrJztcbiAgcHJpbnQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCB0eXBlIHsgQ2FwdHVyZUtpbmQgfSBmcm9tICdAaW5rc3BlY3Qvc2hhcmVkL2JyaWRnZSc7XG5cbmV4cG9ydCB0eXBlIFRvQmFja2dyb3VuZCA9XG4gIHwgeyB0eXBlOiAnY2FwdHVyZScgfVxuICB8IHsgdHlwZTogJ2Rvd25sb2FkJzsgZGF0YVVybDogc3RyaW5nOyBmaWxlbmFtZTogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdib29rbWFya1BhZ2UnOyB1cmw6IHN0cmluZzsgdGl0bGU6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAndW5ib29rbWFya1BhZ2UnOyB1cmw6IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnaXNCb29rbWFya2VkJzsgdXJsOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ2VtdWxhdGUnOyByZXF1ZXN0OiBFbXVsYXRpb25SZXF1ZXN0IH1cbiAgLyoqIExldHMgdGhlIHBhZ2UgbG9hZCBpbiB0aGUgcmVzcG9uc2l2ZSB2aWV3J3MgZnJhbWUgZXZlbiBpZiBpdCBmb3JiaWRzIGZyYW1pbmcgKHRoaXMgdGFiIG9ubHkpLiAqL1xuICB8IHsgdHlwZTogJ2FsbG93RnJhbWluZyc7IHVybDogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdlbmRGcmFtaW5nJyB9XG4gIHwgeyB0eXBlOiAnYnJpZGdlU3RhdHVzJyB9XG4gIC8qKiBUaGUgdG9vbGJhciBvcGVuZWQgb3IgY2xvc2VkOiBhbiBvcGVuIG9uZSBjb21lcyBiYWNrIHdoZW4gdGhlIHBhZ2UgcmVsb2Fkcy4gKi9cbiAgfCB7IHR5cGU6ICd0b29sYmFyT3Blbic7IG9wZW46IGJvb2xlYW4gfVxuICB8IHsgdHlwZTogJ29wZW5PcHRpb25zJyB9XG4gIC8qKiBPcGVucyB0aGUgc2lkZSBwYW5lbCB3aXRoIHRoZSBTYXZlZCBsaXN0IChhbnN3ZXJpbmcgdGhlIGNsaWNrIHRoYXQgYXNrZWQgZm9yIGl0KS4gKi9cbiAgfCB7IHR5cGU6ICdvcGVuU2F2ZWQnIH1cbiAgfCB7IHR5cGU6ICdwYWlyJzsgY29kZTogc3RyaW5nIH1cbiAgLyoqXG4gICAqIFRoZSBwcm9qZWN0cyAoZnJvbSB0aGUgYnJvd3NlciBoZWxwZXIsIG9yIFZTIENvZGUgb3ZlciB0aGUgbGluayksIGFuZCB0aGUgb25lIGB1cmxgJ3NcbiAgICogY2FwdHVyZXMgbW9zdCBsaWtlbHkgZ28gdG8uXG4gICAqL1xuICB8IHsgdHlwZTogJ3Byb2plY3RzJzsgdXJsPzogc3RyaW5nIH1cbiAgLyoqIFNhdmVzIGNhcHR1cmVzIGludG8gYSBwcm9qZWN0J3MgYC5pbmtzcGVjdC9gICh0aHJvdWdoIHRoZSBicm93c2VyIGhlbHBlcikuICovXG4gIHwge1xuICAgICAgdHlwZTogJ3NhdmVDYXB0dXJlJztcbiAgICAgIHByb2plY3Q6IHN0cmluZztcbiAgICAgIHVybD86IHN0cmluZztcbiAgICAgIGNhcHR1cmVzOiBDYXB0dXJlVG9TYXZlW107XG4gICAgICAvKiogQWxzbyBzZW5kIHRoZW06IGEgdGFyZ2V0IGlkLCBvciAnZGVmYXVsdCcgZm9yIHRoZSBwcm9qZWN0J3MgZGVmYXVsdCB0YXJnZXQuICovXG4gICAgICBzZW5kPzogc3RyaW5nO1xuICAgIH1cbiAgLyoqIFNlbmRzIHNhdmVkIGNhcHR1cmVzIG9mIGEgcHJvamVjdCAoYG9wZW5gOiBhbHNvIHNob3cgdGhlIGFnZW50bXV4IHRocmVhZCkuICovXG4gIHwge1xuICAgICAgdHlwZTogJ3NlbmRTYXZlZCc7XG4gICAgICBwcm9qZWN0OiBzdHJpbmc7XG4gICAgICBpZHM6IHN0cmluZ1tdO1xuICAgICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgICBvcGVuPzogYm9vbGVhbjtcbiAgICAgIHByb21wdD86IHN0cmluZztcbiAgICB9XG4gIC8qKiBNb3ZlcyBzYXZlZCBjYXB0dXJlcyB0byBhbm90aGVyIHByb2plY3QuICovXG4gIHwgeyB0eXBlOiAnbW92ZVNhdmVkJzsgcHJvamVjdDogc3RyaW5nOyB0bzogc3RyaW5nOyBpZHM6IHN0cmluZ1tdIH1cbiAgLyoqIFN0YXJ0cyBhIG5ldyBhZ2VudG11eCB0aHJlYWQgaW4gYSBwcm9qZWN0IChub3RoaW5nIGlzIHNlbnQgdG8gaXQpLiAqL1xuICB8IHsgdHlwZTogJ3N0YXJ0VGhyZWFkJzsgcHJvamVjdDogc3RyaW5nOyBoYXJuZXNzOiBIYXJuZXNzIH07XG5cbmV4cG9ydCB0eXBlIEJhY2tncm91bmRSZXBseSA9XG4gIHwge1xuICAgICAgb2s6IHRydWU7XG4gICAgICBkYXRhVXJsPzogc3RyaW5nO1xuICAgICAgcGF0aD86IHN0cmluZztcbiAgICAgIGJvb2ttYXJrZWQ/OiBib29sZWFuO1xuICAgICAgc3RhdHVzPzogQnJpZGdlU3RhdHVzO1xuICAgICAgcHJvamVjdHM/OiBQcm9qZWN0W107XG4gICAgICBzdWdnZXN0ZWQ/OiBzdHJpbmc7XG4gICAgICBpZHM/OiBzdHJpbmdbXTtcbiAgICAgIC8qKiBUaGUgYWdlbnQgYSBzZW5kIHdlbnQgdG8uICovXG4gICAgICBzZW50VG8/OiBzdHJpbmc7XG4gICAgICAvKiogVGhlIHRhcmdldCBpZCBvZiBhIHRocmVhZCBgc3RhcnRUaHJlYWRgIHN0YXJ0ZWQuICovXG4gICAgICB0YXJnZXQ/OiBzdHJpbmc7XG4gICAgfVxuICB8IHsgb2s6IGZhbHNlOyBlcnJvcjogc3RyaW5nIH07XG5cbmV4cG9ydCB0eXBlIFRvQ29udGVudCA9XG4gIC8qKiBPcGVucyBvciBjbG9zZXMgdGhlIHRvb2xiYXIuIGBrZXlgOiBwcmVzc2VkIHdpdGggdGhlIGJyb3dzZXIncyBzaG9ydGN1dCAoc2VlIGNvbnRlbnQvaW5kZXgudHN4KS4gKi9cbiAgeyB0eXBlOiAndG9nZ2xlJzsga2V5Pzogc3RyaW5nIH0gfCB7IHR5cGU6ICdicmlkZ2VTdGF0dXMnOyBzdGF0dXM6IEJyaWRnZVN0YXR1cyB9O1xuXG4vKiogVG8gdGhlIGV4dGVuc2lvbidzIG93biBwYWdlczogdGhlIHRvb2xiYXIncyBicm93c2VyIHNob3J0Y3V0IHdhcyBwcmVzc2VkIHRoZXJlLiAqL1xuZXhwb3J0IGludGVyZmFjZSBTaG9ydGN1dFByZXNzZWQge1xuICB0eXBlOiAnc2hvcnRjdXRQcmVzc2VkJztcbiAga2V5OiBzdHJpbmc7XG59XG5cbi8qKiBSZXF1ZXN0cyBmcm9tIHRoZSBjb250ZW50IHNjcmlwdCB0byBpdHMgcGFnZSdzIE1BSU4td29ybGQgaGVscGVyLiAqL1xuZXhwb3J0IHR5cGUgUGFnZVJlcXVlc3QgPVxuICB7IGtpbmQ6ICdjb2xsZWN0JzsgbWF4SHRtbDogbnVtYmVyIH0gfCB7IGtpbmQ6ICdsb2dzJyB9IHwgeyBraW5kOiAnY2xlYXJMb2dzJyB9O1xuXG5leHBvcnQgY29uc3QgUEFHRV9SRVFVRVNUX0VWRU5UID0gJ2lua3NwZWN0OnJlcXVlc3QnO1xuZXhwb3J0IGNvbnN0IFBBR0VfUkVTUE9OU0VfRVZFTlQgPSAnaW5rc3BlY3Q6cmVzcG9uc2UnO1xuLyoqIEF0dHJpYnV0ZSB0aGF0IG1hcmtzIHRoZSBlbGVtZW50IGEgYGNvbGxlY3RgIHJlcXVlc3QgaXMgYWJvdXQuICovXG5leHBvcnQgY29uc3QgVEFSR0VUX0FUVFJJQlVURSA9ICdkYXRhLWlua3NwZWN0LXRhcmdldCc7XG5cbi8qKiBTZW5kcyBhIG1lc3NhZ2UgdG8gdGhlIGJhY2tncm91bmQgYW5kIHVud3JhcHMgaXRzIHJlcGx5LiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvQmFja2dyb3VuZChtZXNzYWdlOiBUb0JhY2tncm91bmQpOiBQcm9taXNlPEJhY2tncm91bmRSZXBseT4ge1xuICB0cnkge1xuICAgIGNvbnN0IHJlcGx5ID0gKGF3YWl0IGNocm9tZS5ydW50aW1lLnNlbmRNZXNzYWdlKG1lc3NhZ2UpKSBhcyBCYWNrZ3JvdW5kUmVwbHkgfCB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlcGx5ID8/IHsgb2s6IGZhbHNlLCBlcnJvcjogJ05vIHJlcGx5IGZyb20gdGhlIGV4dGVuc2lvbicgfTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiBlcnJvciBpbnN0YW5jZW9mIEVycm9yID8gZXJyb3IubWVzc2FnZSA6IFN0cmluZyhlcnJvcikgfTtcbiAgfVxufVxuIiwgIi8vIFJ1bnMgaW4gdGhlIHBhZ2UncyBvd24gSmF2YVNjcmlwdCB3b3JsZCAoaW5qZWN0ZWQgYnkgdGhlIGV4dGVuc2lvbiB3aGVuIHRoZSB0b29sYmFyIG9wZW5zKS5cbi8vIEZyYW1ld29yayBpbnRlcm5hbHMgKFJlYWN0IGZpYmVycywgVnVlIGluc3RhbmNlcy4uLikgYXJlIG9ubHkgdmlzaWJsZSBoZXJlLCBhbmQgaG9va2luZ1xuLy8gYGNvbnNvbGVgIGFuZCBgZmV0Y2hgIG5lZWRzIHRoZSBwYWdlJ3Mgb3duIG9iamVjdHMuIEl0IGFuc3dlcnMgdGhlIGNvbnRlbnQgc2NyaXB0IHRocm91Z2ggRE9NXG4vLyBldmVudHMgYW5kIG5ldmVyIGV4cG9zZXMgYW55dGhpbmcgdG8gdGhlIHBhZ2UgaXRzZWxmLlxuaW1wb3J0IHsgYWNjZXNzaWJsZUluZm8sIENPTExFQ1RfSEVMUEVSUywgY29sbGVjdEVsZW1lbnREZXRhaWxzIH0gZnJvbSAnQGlua3NwZWN0L3NoYXJlZC9jb2xsZWN0JztcbmltcG9ydCB7XG4gIGZvcm1hdENvbnNvbGVBcmd1bWVudHMsXG4gIHR5cGUgQ29uc29sZUVudHJ5LFxuICB0eXBlIENvbnNvbGVMZXZlbCxcbiAgdHlwZSBOZXR3b3JrRW50cnksXG59IGZyb20gJ0BpbmtzcGVjdC9zaGFyZWQvZGV2dG9vbHMnO1xuaW1wb3J0IHtcbiAgUEFHRV9SRVFVRVNUX0VWRU5ULFxuICBQQUdFX1JFU1BPTlNFX0VWRU5ULFxuICBUQVJHRVRfQVRUUklCVVRFLFxuICB0eXBlIFBhZ2VSZXF1ZXN0LFxufSBmcm9tICcuLi9tZXNzYWdlcyc7XG5cbnR5cGUgSW5rc3BlY3RXaW5kb3cgPSBXaW5kb3cgJiB7IF9faW5rc3BlY3RNYWluPzogYm9vbGVhbiB9O1xuXG4vKipcbiAqIGBKU09OLnN0cmluZ2lmeWAgdGhhdCBpZ25vcmVzIGB0b0pTT05gIG1ldGhvZHMgcGFnZXMgYWRkIHRvIGJ1aWx0LWluIHByb3RvdHlwZXMuIE9sZCBsaWJyYXJpZXNcbiAqIChQcm90b3R5cGUuanMpIGRlZmluZSBgQXJyYXkucHJvdG90eXBlLnRvSlNPTmAsIHdoaWNoIHR1cm5zIGV2ZXJ5IGFycmF5IGludG8gYSBzdHJpbmcsIHNvIHRoZVxuICogY29uc29sZSBlbnRyaWVzIGFuZCBlbGVtZW50IGRldGFpbHMgd291bGQgYXJyaXZlIGFzIHN0cmluZ3MgaW5zdGVhZCBvZiBsaXN0cy5cbiAqL1xuZnVuY3Rpb24gc3RyaW5naWZ5KHZhbHVlOiB1bmtub3duKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgY29uc3Qgc2F2ZWQ6IFtvYmplY3QsIFByb3BlcnR5RGVzY3JpcHRvcl1bXSA9IFtdO1xuICBmb3IgKGNvbnN0IHByb3RvIG9mIFtBcnJheS5wcm90b3R5cGUsIFN0cmluZy5wcm90b3R5cGUsIE51bWJlci5wcm90b3R5cGUsIEJvb2xlYW4ucHJvdG90eXBlXSkge1xuICAgIGNvbnN0IG93biA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sICd0b0pTT04nKTtcbiAgICBpZiAob3duPy5jb25maWd1cmFibGUgJiYgZGVsZXRlIChwcm90byBhcyB7IHRvSlNPTj86IHVua25vd24gfSkudG9KU09OKVxuICAgICAgc2F2ZWQucHVzaChbcHJvdG8sIG93bl0pO1xuICB9XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgfSBmaW5hbGx5IHtcbiAgICBmb3IgKGNvbnN0IFtwcm90bywgb3duXSBvZiBzYXZlZCkgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCAndG9KU09OJywgb3duKTtcbiAgfVxufVxuXG5jb25zdCBNQVhfRU5UUklFUyA9IDUwMDtcblxuZnVuY3Rpb24gaW5zdGFsbCgpOiB2b2lkIHtcbiAgY29uc3QgdyA9IHdpbmRvdyBhcyBJbmtzcGVjdFdpbmRvdztcbiAgaWYgKHcuX19pbmtzcGVjdE1haW4pIHJldHVybjtcbiAgdy5fX2lua3NwZWN0TWFpbiA9IHRydWU7XG5cbiAgY29uc3QgY29uc29sZUVudHJpZXM6IENvbnNvbGVFbnRyeVtdID0gW107XG4gIGNvbnN0IG5ldHdvcms6IE5ldHdvcmtFbnRyeVtdID0gW107XG4gIGxldCBuZXh0SWQgPSAxO1xuXG4gIGNvbnN0IHB1c2ggPSA8VD4obGlzdDogVFtdLCBlbnRyeTogVCkgPT4ge1xuICAgIGxpc3QucHVzaChlbnRyeSk7XG4gICAgaWYgKGxpc3QubGVuZ3RoID4gTUFYX0VOVFJJRVMpIGxpc3Quc3BsaWNlKDAsIGxpc3QubGVuZ3RoIC0gTUFYX0VOVFJJRVMpO1xuICB9O1xuXG4gIC8qKiBXaGVyZSBhIGNvbnNvbGUgY2FsbCBjYW1lIGZyb206IHRoZSBmaXJzdCBzdGFjayBmcmFtZSBvdXRzaWRlIHRoaXMgZmlsZS4gKi9cbiAgY29uc3QgY2FsbFNpdGUgPSAoKTogeyB1cmw/OiBzdHJpbmc7IGxpbmU/OiBudW1iZXI7IGNvbHVtbj86IG51bWJlciB9ID0+IHtcbiAgICBjb25zdCBzdGFjayA9IG5ldyBFcnJvcigpLnN0YWNrPy5zcGxpdCgnXFxuJykuc2xpY2UoMykgPz8gW107XG4gICAgZm9yIChjb25zdCBmcmFtZSBvZiBzdGFjaykge1xuICAgICAgY29uc3QgbWF0Y2ggPVxuICAgICAgICAvXFwoPygoPzpodHRwcz98ZmlsZXxjaHJvbWUtZXh0ZW5zaW9ufG1vei1leHRlbnNpb24pOlxcL1xcL1teXFxzKV0rPyk6KFxcZCspOihcXGQrKVxcKT9cXHMqJC8uZXhlYyhcbiAgICAgICAgICBmcmFtZSxcbiAgICAgICAgKTtcbiAgICAgIGlmIChtYXRjaCAmJiAhL21haW4td29ybGRcXC5qcy8udGVzdChtYXRjaFsxXSEpKSB7XG4gICAgICAgIHJldHVybiB7IHVybDogbWF0Y2hbMV0sIGxpbmU6IE51bWJlcihtYXRjaFsyXSkgLSAxLCBjb2x1bW46IE51bWJlcihtYXRjaFszXSkgLSAxIH07XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB7fTtcbiAgfTtcblxuICBjb25zdCBkZXNjcmliZSA9ICh2YWx1ZTogdW5rbm93bik6IHN0cmluZyA9PiB7XG4gICAgaWYgKHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHJldHVybiB2YWx1ZS5zdGFjayB8fCBgJHt2YWx1ZS5uYW1lfTogJHt2YWx1ZS5tZXNzYWdlfWA7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHJldHVybiB2YWx1ZTtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHN0cmluZ2lmeSh2YWx1ZSkgPz8gU3RyaW5nKHZhbHVlKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybiBTdHJpbmcodmFsdWUpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBsZXZlbHM6IFtrZXlvZiBDb25zb2xlLCBDb25zb2xlTGV2ZWxdW10gPSBbXG4gICAgWydlcnJvcicsICdlcnJvciddLFxuICAgIFsnd2FybicsICd3YXJuaW5nJ10sXG4gICAgWydpbmZvJywgJ2luZm8nXSxcbiAgICBbJ2xvZycsICdpbmZvJ10sXG4gICAgWydkZWJ1ZycsICdkZWJ1ZyddLFxuICBdO1xuICBmb3IgKGNvbnN0IFttZXRob2QsIGxldmVsXSBvZiBsZXZlbHMpIHtcbiAgICBjb25zdCBvcmlnaW5hbCA9IGNvbnNvbGVbbWV0aG9kXSBhcyAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkO1xuICAgIChjb25zb2xlIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pW21ldGhvZF0gPSBmdW5jdGlvbiAoLi4uYXJnczogdW5rbm93bltdKSB7XG4gICAgICB0cnkge1xuICAgICAgICBwdXNoKGNvbnNvbGVFbnRyaWVzLCB7XG4gICAgICAgICAgaWQ6IG5leHRJZCsrLFxuICAgICAgICAgIHRpbWU6IERhdGUubm93KCksXG4gICAgICAgICAgbGV2ZWwsXG4gICAgICAgICAgLy8gYCVzYCwgYCVkYCwgYCVjYC4uLiBhcHBsaWVkIGxpa2UgRGV2VG9vbHMgZG9lcyAoc3R5bGVzIGRyb3BwZWQpLCBub3QgcHJpbnRlZC5cbiAgICAgICAgICB0ZXh0OiBmb3JtYXRDb25zb2xlQXJndW1lbnRzKGFyZ3MubWFwKGRlc2NyaWJlKSkuc2xpY2UoMCwgNDAwMCksXG4gICAgICAgICAgc291cmNlOiAnY29uc29sZScsXG4gICAgICAgICAgLi4uY2FsbFNpdGUoKSxcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gTmV2ZXIgYnJlYWsgdGhlIHBhZ2UncyBvd24gbG9nZ2luZy5cbiAgICAgIH1cbiAgICAgIHJldHVybiBvcmlnaW5hbC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9O1xuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXG4gICAgJ2Vycm9yJyxcbiAgICAoZXZlbnQpID0+IHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldCBhcyAoRWxlbWVudCAmIHsgc3JjPzogc3RyaW5nOyBocmVmPzogc3RyaW5nIH0pIHwgbnVsbDtcbiAgICAgIGlmICh0YXJnZXQgJiYgdGFyZ2V0ICE9PSAod2luZG93IGFzIHVua25vd24pICYmIHRhcmdldCBpbnN0YW5jZW9mIEVsZW1lbnQpIHtcbiAgICAgICAgLy8gQSByZXNvdXJjZSAoaW1hZ2UsIHNjcmlwdCwgc3R5bGVzaGVldCkgZmFpbGVkIHRvIGxvYWQuXG4gICAgICAgIGNvbnN0IHVybCA9IHRhcmdldC5zcmMgfHwgdGFyZ2V0LmhyZWY7XG4gICAgICAgIGlmICh1cmwpIHtcbiAgICAgICAgICBwdXNoKG5ldHdvcmssIHtcbiAgICAgICAgICAgIGlkOiBgciR7bmV4dElkKyt9YCxcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICAgICAgICB1cmwsXG4gICAgICAgICAgICB0eXBlOiB0YXJnZXQudGFnTmFtZS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgdGltZTogRGF0ZS5ub3coKSxcbiAgICAgICAgICAgIGVycm9yOiAnRmFpbGVkIHRvIGxvYWQnLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHB1c2goY29uc29sZUVudHJpZXMsIHtcbiAgICAgICAgaWQ6IG5leHRJZCsrLFxuICAgICAgICB0aW1lOiBEYXRlLm5vdygpLFxuICAgICAgICBsZXZlbDogJ2Vycm9yJyxcbiAgICAgICAgdGV4dDogZXZlbnQuZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGRlc2NyaWJlKGV2ZW50LmVycm9yKSA6IGV2ZW50Lm1lc3NhZ2UsXG4gICAgICAgIHNvdXJjZTogJ2V4Y2VwdGlvbicsXG4gICAgICAgIHVybDogZXZlbnQuZmlsZW5hbWUgfHwgdW5kZWZpbmVkLFxuICAgICAgICBsaW5lOiBldmVudC5saW5lbm8gPyBldmVudC5saW5lbm8gLSAxIDogdW5kZWZpbmVkLFxuICAgICAgICBjb2x1bW46IGV2ZW50LmNvbG5vID8gZXZlbnQuY29sbm8gLSAxIDogdW5kZWZpbmVkLFxuICAgICAgfSk7XG4gICAgfSxcbiAgICB0cnVlLFxuICApO1xuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndW5oYW5kbGVkcmVqZWN0aW9uJywgKGV2ZW50KSA9PiB7XG4gICAgcHVzaChjb25zb2xlRW50cmllcywge1xuICAgICAgaWQ6IG5leHRJZCsrLFxuICAgICAgdGltZTogRGF0ZS5ub3coKSxcbiAgICAgIGxldmVsOiAnZXJyb3InLFxuICAgICAgdGV4dDogYFVuY2F1Z2h0IChpbiBwcm9taXNlKSAke2Rlc2NyaWJlKGV2ZW50LnJlYXNvbil9YCxcbiAgICAgIHNvdXJjZTogJ2V4Y2VwdGlvbicsXG4gICAgfSk7XG4gIH0pO1xuXG4gIGNvbnN0IG9yaWdpbmFsRmV0Y2ggPSB3aW5kb3cuZmV0Y2g7XG4gIHdpbmRvdy5mZXRjaCA9IGFzeW5jIGZ1bmN0aW9uICguLi5hcmdzOiBQYXJhbWV0ZXJzPHR5cGVvZiBmZXRjaD4pIHtcbiAgICBjb25zdCBbaW5wdXQsIGluaXRdID0gYXJncztcbiAgICAvLyBOZXZlciBicmVhayB0aGUgcGFnZSdzIG93biByZXF1ZXN0OiBhbnl0aGluZyB3ZSBjYW4ndCByZWFkIGlzIGxpc3RlZCBhcyBiZXN0IHdlIGNhbi5cbiAgICBjb25zdCBlbnRyeTogTmV0d29ya0VudHJ5ID0ge1xuICAgICAgaWQ6IGBmJHtuZXh0SWQrK31gLFxuICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgIHVybDogJycsXG4gICAgICB0eXBlOiAnZmV0Y2gnLFxuICAgICAgdGltZTogRGF0ZS5ub3coKSxcbiAgICB9O1xuICAgIHRyeSB7XG4gICAgICBlbnRyeS51cmwgPSBpbnB1dCBpbnN0YW5jZW9mIFJlcXVlc3QgPyBpbnB1dC51cmwgOiBTdHJpbmcoaW5wdXQpO1xuICAgICAgZW50cnkubWV0aG9kID0gU3RyaW5nKFxuICAgICAgICBpbml0Py5tZXRob2QgfHwgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCA/IGlucHV0Lm1ldGhvZCA6ICdHRVQnKSxcbiAgICAgICkudG9VcHBlckNhc2UoKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIExpc3RlZCB3aXRob3V0IHRoZW0uXG4gICAgfVxuICAgIHB1c2gobmV0d29yaywgZW50cnkpO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG9yaWdpbmFsRmV0Y2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICBlbnRyeS5zdGF0dXMgPSByZXNwb25zZS5zdGF0dXM7XG4gICAgICBlbnRyeS5taW1lVHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKSA/PyB1bmRlZmluZWQ7XG4gICAgICBlbnRyeS5kdXJhdGlvbiA9IERhdGUubm93KCkgLSBlbnRyeS50aW1lO1xuICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBlbnRyeS5lcnJvciA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKTtcbiAgICAgIGVudHJ5LmNhbmNlbGVkID0gZXJyb3IgaW5zdGFuY2VvZiBET01FeGNlcHRpb24gJiYgZXJyb3IubmFtZSA9PT0gJ0Fib3J0RXJyb3InO1xuICAgICAgZW50cnkuZHVyYXRpb24gPSBEYXRlLm5vdygpIC0gZW50cnkudGltZTtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBvcGVuID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLm9wZW47XG4gIGNvbnN0IHNlbmQgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUuc2VuZDtcbiAgY29uc3QgZW50cmllcyA9IG5ldyBXZWFrTWFwPFhNTEh0dHBSZXF1ZXN0LCBOZXR3b3JrRW50cnk+KCk7XG4gIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5vcGVuID0gZnVuY3Rpb24gKFxuICAgIHRoaXM6IFhNTEh0dHBSZXF1ZXN0LFxuICAgIG1ldGhvZDogc3RyaW5nLFxuICAgIHVybDogc3RyaW5nIHwgVVJMLFxuICAgIC4uLnJlc3Q6IHVua25vd25bXVxuICApIHtcbiAgICAvLyBOZXZlciBicmVhayB0aGUgcGFnZSdzIG93biByZXF1ZXN0OiBhIFVSTCB3ZSBjYW4ndCByZWFkIGlzIGxpc3RlZCBhcyBnaXZlbi5cbiAgICBsZXQgaHJlZiA9IFN0cmluZyh1cmwpO1xuICAgIHRyeSB7XG4gICAgICBocmVmID0gbmV3IFVSTCh1cmwsIGxvY2F0aW9uLmhyZWYpLmhyZWY7XG4gICAgfSBjYXRjaCB7XG4gICAgICAvLyBLZXB0IGFzIGdpdmVuLlxuICAgIH1cbiAgICBlbnRyaWVzLnNldCh0aGlzLCB7XG4gICAgICBpZDogYHgke25leHRJZCsrfWAsXG4gICAgICBtZXRob2Q6IFN0cmluZyhtZXRob2QpLnRvVXBwZXJDYXNlKCksXG4gICAgICB1cmw6IGhyZWYsXG4gICAgICB0eXBlOiAneGhyJyxcbiAgICAgIHRpbWU6IERhdGUubm93KCksXG4gICAgfSk7XG4gICAgcmV0dXJuIChvcGVuIGFzICguLi5hOiB1bmtub3duW10pID0+IHZvaWQpLmNhbGwodGhpcywgbWV0aG9kLCB1cmwsIC4uLnJlc3QpO1xuICB9IGFzIHR5cGVvZiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUub3BlbjtcbiAgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLnNlbmQgPSBmdW5jdGlvbiAodGhpczogWE1MSHR0cFJlcXVlc3QsIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBlbnRyeSA9IGVudHJpZXMuZ2V0KHRoaXMpO1xuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkudGltZSA9IERhdGUubm93KCk7XG4gICAgICBwdXNoKG5ldHdvcmssIGVudHJ5KTtcbiAgICAgIHRoaXMuYWRkRXZlbnRMaXN0ZW5lcignbG9hZGVuZCcsICgpID0+IHtcbiAgICAgICAgZW50cnkuZHVyYXRpb24gPSBEYXRlLm5vdygpIC0gZW50cnkudGltZTtcbiAgICAgICAgaWYgKHRoaXMuc3RhdHVzKSBlbnRyeS5zdGF0dXMgPSB0aGlzLnN0YXR1cztcbiAgICAgICAgZWxzZSBlbnRyeS5lcnJvciA9ICdGYWlsZWQnO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzZW5kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9O1xuXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFBBR0VfUkVRVUVTVF9FVkVOVCwgKGV2ZW50KSA9PiB7XG4gICAgY29uc3QgeyBpZCwgcmVxdWVzdCB9ID0gSlNPTi5wYXJzZSgoZXZlbnQgYXMgQ3VzdG9tRXZlbnQ8c3RyaW5nPikuZGV0YWlsKSBhcyB7XG4gICAgICBpZDogc3RyaW5nO1xuICAgICAgcmVxdWVzdDogUGFnZVJlcXVlc3Q7XG4gICAgfTtcbiAgICBsZXQgcmVzdWx0OiB1bmtub3duO1xuICAgIHRyeSB7XG4gICAgICBpZiAocmVxdWVzdC5raW5kID09PSAnY29sbGVjdCcpIHtcbiAgICAgICAgY29uc3QgZWwgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGBbJHtUQVJHRVRfQVRUUklCVVRFfV1gKTtcbiAgICAgICAgaWYgKGVsKSB7XG4gICAgICAgICAgLy8gVGhlIG1hcmtlciBhdHRyaWJ1dGUgbXVzdCBub3QgZW5kIHVwIGluIHRoZSBjb3BpZWQgZGV0YWlscy5cbiAgICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoVEFSR0VUX0FUVFJJQlVURSk7XG4gICAgICAgICAgcmVzdWx0ID0ge1xuICAgICAgICAgICAgLi4uY29sbGVjdEVsZW1lbnREZXRhaWxzKGVsLCByZXF1ZXN0Lm1heEh0bWwsIENPTExFQ1RfSEVMUEVSUyksXG4gICAgICAgICAgICAuLi5hY2Nlc3NpYmxlSW5mbyhlbCksXG4gICAgICAgICAgfTtcbiAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoVEFSR0VUX0FUVFJJQlVURSwgJycpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHJlcXVlc3Qua2luZCA9PT0gJ2xvZ3MnKSB7XG4gICAgICAgIHJlc3VsdCA9IHsgY29uc29sZTogY29uc29sZUVudHJpZXMsIG5ldHdvcmsgfTtcbiAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5raW5kID09PSAnY2xlYXJMb2dzJykge1xuICAgICAgICBjb25zb2xlRW50cmllcy5sZW5ndGggPSAwO1xuICAgICAgICBuZXR3b3JrLmxlbmd0aCA9IDA7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlc3VsdCA9IHsgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSB9O1xuICAgIH1cbiAgICB3aW5kb3cuZGlzcGF0Y2hFdmVudChcbiAgICAgIG5ldyBDdXN0b21FdmVudChQQUdFX1JFU1BPTlNFX0VWRU5ULCB7IGRldGFpbDogc3RyaW5naWZ5KHsgaWQsIHJlc3VsdCB9KSB9KSxcbiAgICApO1xuICB9KTtcbn1cblxuaW5zdGFsbCgpO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7O0FBbUJPLFdBQVMsY0FDZCxTQUNBLE9BQ0EsUUFDUTtBQUNSLFVBQU0sYUFBYSxDQUFDLGVBQWUsYUFBYSxXQUFXLFdBQVcsY0FBYyxNQUFNO0FBRTFGLFVBQU0sV0FBVyxDQUFDLFFBQ2hCLG9GQUFvRixLQUFLLEdBQUc7QUFDOUYsVUFBTSxTQUFTLENBQUMsYUFBcUI7QUFDbkMsVUFBSTtBQUNGLGVBQU8sTUFBTSxRQUFRLE1BQU07QUFBQSxNQUM3QixRQUFRO0FBQ04sZUFBTztBQUFBLE1BQ1Q7QUFBQSxJQUNGO0FBQ0EsVUFBTSxXQUFXLENBQUMsT0FBa0M7QUFDbEQsWUFBTSxNQUFNLEdBQUcsUUFBUSxZQUFZO0FBQ25DLFlBQU0sYUFBdUIsQ0FBQztBQUM5QixVQUFJLEdBQUcsTUFBTSxDQUFDLFNBQVMsR0FBRyxFQUFFLEVBQUcsWUFBVyxLQUFLLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQyxFQUFFO0FBQ2xFLGlCQUFXLFFBQVEsWUFBWTtBQUM3QixjQUFNLFFBQVEsR0FBRyxhQUFhLElBQUk7QUFDbEMsWUFBSSxTQUFTLE1BQU0sU0FBUztBQUMxQixxQkFBVyxLQUFLLEdBQUcsR0FBRyxJQUFJLElBQUksS0FBSyxNQUFNLFFBQVEsTUFBTSxLQUFLLENBQUMsSUFB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
