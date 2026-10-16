"use strict";
(() => {
  // ../shared/src/devices.ts
  var phone = (id2, name, width, height, dpr, ua) => ({
    id: id2,
    name,
    group: "Phones",
    width,
    height,
    dpr,
    mobile: true,
    touch: true,
    userAgent: ua
  });
  var tablet = (id2, name, width, height, dpr, ua) => ({
    id: id2,
    name,
    group: "Tablets",
    width,
    height,
    dpr,
    mobile: true,
    touch: true,
    userAgent: ua
  });
  var desktop = (width, height, label) => ({
    id: `desktop-${width}x${height}`,
    name: `${label} ${width}\xD7${height}`,
    group: "Desktops",
    width,
    height,
    dpr: 1,
    mobile: false,
    touch: false,
    userAgent: "desktop"
  });
  var DEVICE_PRESETS = [
    phone("iphone-se", "iPhone SE", 375, 667, 2, "iphone"),
    phone("iphone-16-pro", "iPhone 16 Pro", 402, 874, 3, "iphone"),
    phone("iphone-16-pro-max", "iPhone 16 Pro Max", 440, 956, 3, "iphone"),
    phone("pixel-8", "Pixel 8", 412, 915, 2.625, "android"),
    phone("galaxy-s24", "Galaxy S24", 360, 780, 3, "android"),
    tablet("ipad-mini", "iPad Mini", 768, 1024, 2, "ipad"),
    tablet("ipad-pro", 'iPad Pro 12.9"', 1024, 1366, 2, "ipad"),
    tablet("surface-pro", "Surface Pro 7", 912, 1368, 2, "desktop"),
    desktop(1280, 800, "Laptop"),
    desktop(1366, 768, "Laptop"),
    desktop(1440, 900, "Laptop"),
    desktop(1920, 1080, "Full HD"),
    desktop(2560, 1440, "QHD"),
    desktop(3840, 2160, "4K")
  ];
  var NETWORK_CONDITIONS = {
    none: { label: "No throttling", offline: false, latency: 0, download: -1, upload: -1 },
    offline: { label: "Offline", offline: true, latency: 0, download: 0, upload: 0 },
    slow3g: { label: "Slow 3G", offline: false, latency: 2e3, download: 5e4, upload: 5e4 },
    fast3g: { label: "Fast 3G", offline: false, latency: 562.5, download: 18e4, upload: 84375 },
    fast4g: { label: "Fast 4G", offline: false, latency: 165, download: 1012500, upload: 168750 }
  };
  function deviceUserAgent(kind2, chromeVersion) {
    const major = chromeVersion.split(".")[0] ?? "0";
    switch (kind2) {
      case "android":
        return `Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Mobile Safari/537.36`;
      case "iphone":
        return "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
      case "ipad":
        return "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
      case "desktop":
        return void 0;
    }
  }

  // src/background/bookmarks.ts
  async function syncRoots() {
    const [root] = await chrome.bookmarks.getTree();
    const kids = root?.children ?? [];
    const find = (folderType, fallbacks) => {
      const typed = kids.filter((k) => k.folderType === folderType);
      return typed.find((k) => k.syncing) ?? typed[0] ?? kids.find((k) => fallbacks.includes(k.id)) ?? void 0;
    };
    const bar = find("bookmarks-bar", ["1", "toolbar_____"]) ?? kids[0];
    const other = find("other", ["2", "unfiled_____"]) ?? kids[1] ?? kids[0];
    if (!bar || !other) throw new Error("No bookmark folders found");
    return { bar: bar.id, other: other.id };
  }
  async function snapshot() {
    const roots = await syncRoots();
    const out = [];
    const visit = (parentId, children) => {
      let index = 0;
      for (const child of children) {
        if (child.type === "separator") continue;
        out.push({
          id: child.id,
          parentId,
          index: index++,
          title: child.title,
          ...child.url !== void 0 ? { url: child.url } : {}
        });
        if (child.url === void 0) visit(child.id, child.children ?? []);
      }
    };
    for (const [rootId, realId] of [
      ["bar", roots.bar],
      ["other", roots.other]
    ]) {
      const [node] = await chrome.bookmarks.getSubTree(realId);
      visit(rootId, node?.children ?? []);
    }
    return out;
  }
  async function applyOps(ops) {
    const roots = await syncRoots();
    const created = {};
    const failed = [];
    const resolve = (id2) => id2 === "bar" ? roots.bar : id2 === "other" ? roots.other : id2.startsWith("ref:") ? created[id2.slice(4)] : id2;
    for (const op of ops) {
      try {
        if (op.op === "create") {
          const parentId = resolve(op.parentId);
          if (!parentId) throw new Error("parent missing");
          const node = await chrome.bookmarks.create({
            parentId,
            index: op.index,
            title: op.title,
            url: op.url
          });
          created[op.ref] = node.id;
        } else if (op.op === "update") {
          await chrome.bookmarks.update(
            op.id,
            op.url !== void 0 ? { title: op.title, url: op.url } : { title: op.title }
          );
        } else if (op.op === "move") {
          const parentId = resolve(op.parentId);
          if (!parentId) throw new Error("parent missing");
          const [node] = await chrome.bookmarks.get(op.id);
          let index = op.index;
          if (node?.parentId === parentId && (node.index ?? 0) < index)
            index++;
          await chrome.bookmarks.move(op.id, { parentId, index });
        } else {
          await chrome.bookmarks.removeTree(op.id).catch(() => chrome.bookmarks.remove(op.id));
        }
      } catch (error) {
        failed.push(`${op.op}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    return { created, failed };
  }

  // ../shared/src/targets.ts
  var HARNESSES = ["claude", "codex", "opencode", "agy"];

  // ../shared/src/validate.ts
  var isString = (v) => typeof v === "string";
  var isNumber = (v) => typeof v === "number" && Number.isFinite(v);
  var isBoolean = (v) => typeof v === "boolean";
  var shortString = (max) => (v) => typeof v === "string" && v.length <= max;
  var matches = (pattern) => (v) => typeof v === "string" && pattern.test(v);
  var optional = (check) => (v) => v === void 0 || check(v);
  var oneOf = (...values) => (v) => typeof v === "string" && values.includes(v);
  var isRecord = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
  var shape = (fields) => (v) => isRecord(v) && Object.entries(fields).every(([k, check]) => check(v[k]));
  var arrayOf = (check, max = 1e5) => (v) => Array.isArray(v) && v.length <= max && v.every(check);
  var stringMap = (v) => isRecord(v) && Object.values(v).every((value) => typeof value === "string");
  function parseMessage(raw, table, version) {
    let value = raw;
    if (typeof raw === "string") {
      try {
        value = JSON.parse(raw);
      } catch {
        return void 0;
      }
    }
    if (!isRecord(value) || value.v !== version || typeof value.type !== "string") return void 0;
    if (!Object.hasOwn(table, value.type)) return void 0;
    const fields = table[value.type];
    if (!fields || !shape(fields)(value)) return void 0;
    const { v: _version, ...message } = value;
    return message;
  }

  // ../shared/src/hub.ts
  var HUB_VERSION = 1;
  var HUB_FEATURES = [
    "items.move",
    "item.restore",
    "send.open",
    "agentmux.new",
    "send.prompt",
    "items.group",
    "item.content",
    "agentmux.start"
  ];
  var CONTENT_SLICE = 512 * 1024;
  var CONTENT_TYPES = ["text/plain", "image/png", "image/jpeg"];
  var MAX_PROMPT = 8e3;
  var HUB_HOST_NAME = "dev.inkspect.hub";
  var MAX_TO_BROWSER = 1024 * 1024;
  var MAX_FRAME = 64 * 1024 * 1024;
  var ITEM_KINDS = [
    "element",
    "screenshot",
    "recording",
    "errors",
    "network",
    "page",
    "report",
    "css",
    "measure",
    "color",
    "text"
  ];
  var ITEM_ID = /^\d{8}-\d{6}-[0-9a-f]{6}$/;
  var ITEM_FILE = /^[\w-]{1,40}\.[a-z0-9]{1,5}$/;
  function encodeHub(message) {
    return JSON.stringify({ v: HUB_VERSION, ...message });
  }
  var id = matches(/^[\w.-]{1,64}$/);
  var data = shortString(MAX_FRAME);
  var folder = shortString(4096);
  var AUTH = {
    auth: {
      token: shortString(128),
      role: oneOf("browser", "vscode"),
      origin: optional(shortString(256))
    }
  };
  var req = matches(/^[\w-]{1,64}$/);
  var projectPath = shortString(4096);
  var kind = oneOf(...ITEM_KINDS);
  var base64 = matches(/^[A-Za-z0-9+/]*={0,2}$/);
  var captureToSave = shape({
    kind,
    title: shortString(300),
    detail: optional(shortString(1e3)),
    text: optional(shortString(5e6)),
    group: optional(id),
    groupIndex: optional(isNumber),
    image: optional(base64),
    thumb: optional((v) => typeof v === "string" && v.length <= 4e5 && base64(v))
  });
  var hubTarget = shape({
    id: shortString(200),
    kind: oneOf("tmux", "terminal", "chat"),
    label: shortString(100),
    detail: shortString(300),
    closed: optional(isBoolean)
  });
  var prompt = optional(shortString(MAX_PROMPT));
  var itemIds = arrayOf(matches(ITEM_ID), 60);
  var BROWSER_TO_HUB = {
    link: { data },
    ping: {},
    "projects.get": { req, url: optional(shortString(4096)) },
    "capture.save": {
      req,
      project: projectPath,
      url: optional(shortString(4096)),
      browser: optional(shortString(100)),
      captures: arrayOf(captureToSave, 60),
      send: optional(shortString(200))
    },
    "item.send": {
      req,
      project: projectPath,
      ids: itemIds,
      target: optional(shortString(200)),
      open: optional(isBoolean),
      prompt
    },
    "items.move": { req, project: projectPath, ids: itemIds, to: projectPath },
    "items.get": { req, project: projectPath },
    "item.thumb": { req, project: projectPath, id: matches(ITEM_ID) },
    "item.remove": { req, project: projectPath, ids: itemIds },
    "item.restore": { req, project: projectPath, ids: itemIds },
    "item.content": {
      req,
      project: projectPath,
      id: matches(ITEM_ID),
      offset: (v) => Number.isSafeInteger(v) && v >= 0
    },
    "agentmux.start": { req, project: projectPath, harness: oneOf(...HARNESSES) },
    "items.group": { req, project: projectPath, ids: itemIds },
    "items.ungroup": { req, project: projectPath, group: id },
    "project.pin": { req, project: projectPath, pinned: isBoolean }
  };
  var project = shape({
    path: projectPath,
    name: shortString(300),
    vscode: isBoolean,
    agentmux: isBoolean,
    saved: isBoolean,
    pinned: isBoolean,
    targets: optional(arrayOf(hubTarget, 50)),
    defaultTarget: optional(shortString(200)),
    harnesses: optional(arrayOf(oneOf(...HARNESSES), 10)),
    inbox: optional(isBoolean)
  });
  var isItemMeta = shape({
    v: (v) => v === 1,
    id: matches(ITEM_ID),
    kind,
    title: shortString(300),
    detail: optional(shortString(1e3)),
    url: optional(shortString(4096)),
    time: isNumber,
    group: optional(id),
    groupIndex: optional(isNumber),
    key: optional(shortString(200)),
    source: oneOf("browser", "vscode"),
    browser: optional(shortString(100)),
    preview: optional(shortString(1e3)),
    files: shape({
      file: optional(matches(ITEM_FILE)),
      text: optional(matches(ITEM_FILE)),
      thumb: optional(matches(ITEM_FILE))
    }),
    sentTo: arrayOf(shortString(200), 50)
  });
  var HUB_TO_BROWSER = {
    link: { data },
    status: {
      vscode: isBoolean,
      peer: optional(shortString(200)),
      features: optional(arrayOf(shortString(40), 50))
    },
    relink: {},
    pong: {},
    projects: { req, projects: arrayOf(project, 500), suggested: optional(projectPath) },
    "capture.saved": {
      req,
      ok: isBoolean,
      ids: optional(itemIds),
      error: optional(shortString(1e3)),
      sentTo: optional(shortString(200))
    },
    "item.sent": {
      req,
      ok: isBoolean,
      sentTo: optional(shortString(200)),
      error: optional(shortString(1e3))
    },
    items: {
      req,
      ok: isBoolean,
      items: arrayOf(isItemMeta, 500),
      error: optional(shortString(1e3))
    },
    started: {
      req,
      ok: isBoolean,
      target: optional(shortString(200)),
      error: optional(shortString(1e3))
    },
    content: {
      req,
      ok: isBoolean,
      mimeType: optional(oneOf(...CONTENT_TYPES)),
      size: optional(isNumber),
      data: optional(base64),
      error: optional(shortString(1e3))
    },
    thumb: { req, data: optional(base64), mimeType: optional(oneOf("image/jpeg", "image/png")) },
    done: { req, ok: isBoolean, error: optional(shortString(1e3)) }
  };
  var VSCODE_TO_HUB = {
    window: {
      id,
      name: shortString(200),
      folders: arrayOf(folder, 50),
      focusedAt: isNumber,
      targets: optional(arrayOf(hubTarget, 50))
    },
    link: { browser: id, data },
    shutdown: {},
    ping: {},
    "run.sent": {
      req,
      ok: isBoolean,
      sentTo: optional(shortString(200)),
      error: optional(shortString(1e3))
    }
  };
  var hubBrowser = shape({ id, name: shortString(100), origin: shortString(256) });
  var HUB_TO_VSCODE = {
    welcome: { build: shortString(100), leader: isBoolean },
    leader: { leader: isBoolean },
    browsers: { browsers: arrayOf(hubBrowser, 50) },
    link: { browser: id, data },
    gone: { browser: id },
    pong: {},
    "run.send": { req, project: projectPath, ids: itemIds, target: shortString(200), prompt }
  };
  function parseBrowserToHub(raw) {
    return parseMessage(raw, BROWSER_TO_HUB, HUB_VERSION);
  }
  function parseHubToBrowser(raw) {
    return parseMessage(raw, HUB_TO_BROWSER, HUB_VERSION);
  }

  // ../shared/src/bridge.ts
  var BRIDGE_VERSION = 1;
  var DEFAULT_BRIDGE_PORT = 47110;
  var BRIDGE_PORT_RANGE = 5;
  var BRIDGE_PATH = "/bridge";
  function newerShortcuts(local, remote) {
    const a = local?.updated ?? 0;
    const b = remote?.updated ?? 0;
    return a === b ? "same" : a > b ? "local" : "remote";
  }
  function encode(message) {
    return JSON.stringify({ v: BRIDGE_VERSION, ...message });
  }
  var isKey = (k) => typeof k === "string" && k.length <= 40;
  var shortcutMap = (v) => isRecord(v) && Object.keys(v).length <= 500 && Object.values(v).every((keys) => isKey(keys) || arrayOf(isKey, 8)(keys));
  var flatNode = shape({
    id: isString,
    parentId: isString,
    index: isNumber,
    title: isString,
    url: optional(isString)
  });
  var client = shape({ id: isString, browser: isString });
  var remoteOp = (v) => isRecord(v) && (v.op === "create" && shape({
    ref: isString,
    parentId: isString,
    index: isNumber,
    title: isString,
    url: optional(isString)
  })(v) || v.op === "update" && shape({ id: isString, title: isString, url: optional(isString) })(v) || v.op === "move" && shape({ id: isString, parentId: isString, index: isNumber })(v) || v.op === "remove" && shape({ id: isString })(v));
  var CLIENT_MESSAGES = {
    pair: { code: isString, client },
    hello: { client, token: isString },
    ping: {},
    "bookmarks.snapshot": { tree: arrayOf(flatNode) },
    "bookmarks.applied": { created: stringMap, failed: arrayOf(isString) },
    "hub.request": { request: (v) => isRecord(v) && "req" in v && !!parseBrowserToHub(v) },
    "settings.shortcuts": { shortcuts: shortcutMap, updated: isNumber }
  };
  var SERVER_MESSAGES = {
    paired: { token: isString, peer: isString },
    welcome: { peer: isString, syncBookmarks: isBoolean, features: optional(arrayOf(isString, 20)) },
    error: { message: isString, code: optional(isString) },
    pong: {},
    "bookmarks.ops": { ops: arrayOf(remoteOp) },
    "bookmarks.requestSnapshot": {},
    "hub.reply": { reply: (v) => isRecord(v) && "req" in v && !!parseHubToBrowser(v) },
    "settings.shortcuts": { shortcuts: shortcutMap, updated: isNumber }
  };
  function parseServerMessage(raw) {
    return parseMessage(raw, SERVER_MESSAGES, BRIDGE_VERSION);
  }

  // src/background/bridge.ts
  var HUB_MISSING_MS = 5 * 6e4;
  function browserName() {
    if (false) return "Firefox";
    const nav = navigator;
    if (nav.brave) return "Brave";
    const brands = nav.userAgentData?.brands.map((b) => b.brand) ?? [];
    for (const name of ["Microsoft Edge", "Opera", "Vivaldi", "Google Chrome"]) {
      if (brands.includes(name)) return name;
    }
    return "Chromium";
  }
  async function listening(port) {
    try {
      await fetch(`http://127.0.0.1:${port}${BRIDGE_PATH}`, {
        mode: "no-cors",
        cache: "no-store",
        signal: AbortSignal.timeout(2e3)
      });
      return true;
    } catch (error) {
      return error instanceof DOMException && error.name === "TimeoutError";
    }
  }
  var BridgeClient = class {
    status = { state: "offline" };
    socket;
    /** The browser helper (native messaging), when it is installed: used instead of the socket. */
    hub;
    /** Until when the helper counts as not installed (the WebSocket is used meanwhile). */
    hubMissingUntil = 0;
    /** The hello went to the VS Code window that answers through the helper. */
    hubHello = false;
    /** VS Code answers questions about projects over the WebSocket link (see `welcome`). */
    wsProjects = false;
    /** What the browser helper answers beyond the first version (its `status`). */
    hubFeatures = [];
    /** Requests to the helper (or VS Code) waiting for their answer, by request id. */
    hubRequests = /* @__PURE__ */ new Map();
    client;
    token;
    retry;
    keepAlive;
    delay = 1e3;
    /** Counts connection attempts, so a probe that a newer attempt replaced is dropped. */
    attempt = 0;
    probing = false;
    /** First port to try (a stored override exists for tests). */
    basePort = DEFAULT_BRIDGE_PORT;
    listeners = /* @__PURE__ */ new Set();
    statusListeners = /* @__PURE__ */ new Set();
    pairWaiter;
    onMessage(listener) {
      this.listeners.add(listener);
    }
    onStatus(listener) {
      this.statusListeners.add(listener);
    }
    get connected() {
      return this.status.state === "connected";
    }
    async start() {
      const stored2 = await chrome.storage.local.get(["clientId", "token", "port"]);
      let clientId = stored2.clientId;
      if (!clientId) {
        clientId = crypto.randomUUID();
        await chrome.storage.local.set({ clientId });
      }
      this.client = { id: clientId, browser: browserName() };
      this.token = stored2.token;
      this.basePort = stored2.port ?? DEFAULT_BRIDGE_PORT;
      this.connect();
    }
    /** Connects now if not connected (called on any wake-up of the background). */
    ensureConnected() {
      if (!this.hub && !this.socket && !this.retry && !this.probing) this.connect();
    }
    send(message) {
      if (this.hub) {
        this.hub.postMessage(JSON.parse(encodeHub({ type: "link", data: encode(message) })));
        return true;
      }
      if (this.socket?.readyState !== WebSocket.OPEN) return false;
      this.socket.send(encode(message));
      return true;
    }
    /** Whether the browser helper is connected (projects and their captures go through it). */
    get viaHub() {
      return !!this.hub;
    }
    /**
     * Asks about projects and their saved captures, and waits for the answer with the same request
     * id: the browser helper answers, or else the VS Code window serving the WebSocket link (the
     * same questions, the same answers). Undefined if neither is there or answers in time.
     */
    hubRequest(message, timeoutMs = 3e4) {
      const hub = this.hub;
      const request = JSON.parse(encodeHub(message));
      const post = hub ? () => hub.postMessage(request) : this.wsProjects && this.connected ? () => this.send({ type: "hub.request", request }) : void 0;
      if (!post) return Promise.resolve(void 0);
      return new Promise((resolve) => {
        const timer = setTimeout(() => {
          this.hubRequests.delete(message.req);
          resolve(void 0);
        }, timeoutMs);
        this.hubRequests.set(message.req, (reply) => {
          clearTimeout(timer);
          resolve(reply);
        });
        post();
      });
    }
    /** An answer to a request, from either link. */
    answered(message) {
      if (!("req" in message)) return;
      const waiting = this.hubRequests.get(message.req);
      this.hubRequests.delete(message.req);
      waiting?.(message);
    }
    /** Pairs with the code VS Code shows. */
    async pair(code) {
      if (this.hub) return this.status;
      if (!this.socket && !this.probing) this.connect();
      for (let i = 0; i < 30 && (this.probing || this.socket?.readyState === WebSocket.CONNECTING); i++) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (!this.client || !this.send({ type: "pair", code: code.trim(), client: this.client })) {
        return {
          state: "offline",
          error: "VS Code is not running, or its browser link is turned off."
        };
      }
      const reply = await new Promise((resolve) => {
        this.pairWaiter = resolve;
        setTimeout(() => resolve(void 0), 1e4);
      });
      this.pairWaiter = void 0;
      if (reply?.type === "paired") return this.status;
      return {
        ...this.status,
        error: reply?.type === "error" ? reply.message : "No answer from VS Code."
      };
    }
    /** Reads the stored port again and reconnects (tests). */
    async reconnect() {
      const stored2 = await chrome.storage.local.get(["port", "token"]);
      this.basePort = stored2.port ?? DEFAULT_BRIDGE_PORT;
      this.token = stored2.token;
      this.socket?.close();
      this.socket = void 0;
      const hub = this.hub;
      this.hub = void 0;
      hub?.disconnect();
      this.delay = 1e3;
      this.connect();
    }
    async unpair() {
      this.token = void 0;
      await chrome.storage.local.remove("token");
      this.socket?.close();
      this.setStatus({ state: "unpaired" });
    }
    setStatus(status) {
      this.status = status;
      for (const listener of this.statusListeners) listener(status);
    }
    connect(port, attempt = 0) {
      clearTimeout(this.retry);
      this.retry = void 0;
      if (port === void 0 && Date.now() >= this.hubMissingUntil && this.openHub()) return;
      const target = port ?? this.basePort;
      this.setStatus({ ...this.status, state: this.token ? "connecting" : this.status.state });
      const current = ++this.attempt;
      this.probing = true;
      void listening(target).then((up) => {
        if (current !== this.attempt) return;
        this.probing = false;
        if (up) this.open(target, attempt);
        else this.closed(target, attempt, false);
      });
    }
    open(target, attempt) {
      let socket;
      try {
        socket = new WebSocket(`ws://127.0.0.1:${target}${BRIDGE_PATH}`);
      } catch {
        this.scheduleRetry();
        return;
      }
      this.socket = socket;
      let opened = false;
      socket.onopen = () => {
        opened = true;
        if (this.client) {
          socket.send(encode({ type: "hello", client: this.client, token: this.token ?? "" }));
        }
        if (!this.token) this.setStatus({ state: "unpaired" });
        clearInterval(this.keepAlive);
        this.keepAlive = setInterval(() => this.send({ type: "ping" }), 2e4);
      };
      socket.onmessage = (event) => {
        const message = parseServerMessage(String(event.data));
        if (message) void this.handle(message);
      };
      socket.onclose = () => {
        if (this.socket !== socket) return;
        clearInterval(this.keepAlive);
        this.socket = void 0;
        this.wsProjects = false;
        for (const waiting of this.hubRequests.values()) waiting(void 0);
        this.hubRequests.clear();
        this.closed(target, attempt, opened);
      };
    }
    /** Nothing (more) on this port: try the next one, or wait and start over. */
    closed(target, attempt, opened) {
      if (!opened && attempt < BRIDGE_PORT_RANGE - 1) {
        this.connect(target + 1, attempt + 1);
        return;
      }
      if (this.status.state !== "unpaired") this.setStatus({ state: "offline" });
      this.scheduleRetry();
    }
    scheduleRetry() {
      clearTimeout(this.retry);
      this.retry = setTimeout(() => {
        this.retry = void 0;
        this.connect();
      }, this.delay);
      this.delay = Math.min(this.delay * 2, this.token ? 3e4 : 5e3);
    }
    /**
     * Connects through the browser helper, if it is installed. A helper that isn't installed
     * disconnects at once; the WebSocket is used then, and the helper looked for again later.
     */
    openHub() {
      let port;
      try {
        port = chrome.runtime.connectNative(HUB_HOST_NAME);
      } catch {
        this.hubMissingUntil = Date.now() + HUB_MISSING_MS;
        return false;
      }
      this.hub = port;
      this.hubHello = false;
      let answered = false;
      port.onMessage.addListener((raw) => {
        answered = true;
        const message = parseHubToBrowser(raw);
        if (!message) return;
        if ("req" in message) {
          this.answered(message);
          return;
        }
        if (message.type === "link") {
          const inner = parseServerMessage(message.data);
          if (inner) void this.handle(inner);
        } else if (message.type === "relink") {
          this.hubHello = false;
        } else if (message.type === "status") {
          this.hubFeatures = message.features ?? [];
          if (!message.vscode) {
            this.hubHello = false;
            this.setStatus({
              state: "offline",
              via: "hub",
              projects: true,
              features: this.hubFeatures,
              error: "VS Code is not running."
            });
          } else if (!this.hubHello && this.client) {
            this.hubHello = true;
            this.delay = 1e3;
            this.setStatus({
              ...this.status,
              state: "connecting",
              via: "hub",
              projects: true,
              features: this.hubFeatures,
              error: void 0
            });
            this.send({ type: "hello", client: this.client, token: "" });
          }
        }
      });
      port.onDisconnect.addListener(() => {
        const error = chrome.runtime.lastError?.message;
        if (this.hub !== port) return;
        this.hub = void 0;
        clearInterval(this.keepAlive);
        for (const waiting of this.hubRequests.values()) waiting(void 0);
        this.hubRequests.clear();
        if (!answered) {
          this.hubMissingUntil = Date.now() + HUB_MISSING_MS;
          if (error) console.info(`Inkspect: browser helper not available (${error}).`);
          this.connect();
          return;
        }
        this.setStatus({ state: "offline", via: "hub" });
        this.scheduleRetry();
      });
      clearInterval(this.keepAlive);
      this.keepAlive = setInterval(
        () => port.postMessage(JSON.parse(encodeHub({ type: "ping" }))),
        2e4
      );
      return true;
    }
    async handle(message) {
      if (message.type === "paired") {
        this.token = message.token;
        await chrome.storage.local.set({ token: message.token });
        this.pairWaiter?.(message);
      } else if (message.type === "welcome") {
        this.delay = 1e3;
        this.wsProjects = !this.hub && !!message.features?.includes("hub");
        this.setStatus({
          state: "connected",
          peer: message.peer,
          via: this.hub ? "hub" : "ws",
          projects: !!this.hub || this.wsProjects,
          features: this.hub ? this.hubFeatures : this.wsProjects ? [...HUB_FEATURES] : []
        });
      } else if (message.type === "hub.reply") {
        const reply = parseHubToBrowser(message.reply);
        if (reply) this.answered(reply);
      } else if (message.type === "error") {
        if (message.code === "unpaired") {
          this.token = void 0;
          await chrome.storage.local.remove("token");
          this.setStatus({ state: "unpaired", error: message.message });
        }
        this.pairWaiter?.(message);
      }
      for (const listener of this.listeners) listener(message);
    }
  };

  // ../shared/src/shortcuts.ts
  var SCOPE_LABELS = {
    global: "Browser",
    inspect: "Element picker",
    draw: "Drawing",
    screenshot: "Screenshot",
    devtools: "Console and network",
    device: "Device",
    measure: "Measure",
    eyedropper: "Eyedropper",
    overlay: "Design overlay",
    tweak: "CSS tweak",
    record: "Record",
    a11y: "Accessibility check",
    send: "Send dialog"
  };
  var cmd = (name) => `vscodeBrowser.${name}`;
  var SHORTCUT_ACTIONS = [
    // Tabs and windows.
    { id: "tab.new", label: "New tab", scope: "global", keys: ["ctrl+t"], command: cmd("newTab") },
    {
      id: "tab.close",
      label: "Close tab",
      scope: "global",
      keys: ["ctrl+w", "ctrl+f4"],
      command: cmd("closeTab")
    },
    {
      id: "tab.reopen",
      label: "Reopen closed tab",
      scope: "global",
      keys: ["ctrl+shift+t"],
      command: cmd("reopenClosedTab")
    },
    {
      id: "tab.next",
      label: "Next tab",
      scope: "global",
      keys: ["ctrl+tab", "ctrl+pagedown"],
      mac: ["ctrl+tab", "cmd+alt+right"],
      command: cmd("nextTab")
    },
    {
      id: "tab.previous",
      label: "Previous tab",
      scope: "global",
      keys: ["ctrl+shift+tab", "ctrl+pageup"],
      mac: ["ctrl+shift+tab", "cmd+alt+left"],
      command: cmd("previousTab")
    },
    {
      id: "tab.duplicate",
      label: "Duplicate tab",
      scope: "global",
      keys: [],
      command: cmd("duplicateTab")
    },
    {
      id: "tab.private",
      label: "New private tab",
      scope: "global",
      keys: ["ctrl+shift+n"],
      command: cmd("newPrivateTab")
    },
    {
      id: "window.new",
      label: "New window",
      scope: "global",
      keys: ["ctrl+n"],
      command: cmd("newWindow")
    },
    // Navigation.
    {
      id: "nav.address",
      label: "Focus the address bar",
      scope: "global",
      keys: ["ctrl+l", "alt+d"],
      mac: ["cmd+l", "alt+d"],
      command: cmd("focusAddressBar")
    },
    {
      id: "nav.back",
      label: "Back",
      scope: "global",
      keys: ["alt+left"],
      mac: ["cmd+["],
      command: cmd("goBack")
    },
    {
      id: "nav.forward",
      label: "Forward",
      scope: "global",
      keys: ["alt+right"],
      mac: ["cmd+]"],
      command: cmd("goForward")
    },
    {
      id: "nav.reload",
      label: "Reload",
      scope: "global",
      keys: ["ctrl+r", "f5"],
      mac: ["cmd+r"],
      command: cmd("reload")
    },
    {
      id: "nav.hardReload",
      label: "Hard reload",
      scope: "global",
      keys: ["ctrl+shift+r", "ctrl+f5"],
      mac: ["cmd+shift+r"],
      command: cmd("hardReload")
    },
    { id: "nav.stop", label: "Stop loading", scope: "global", keys: [], command: cmd("stop") },
    {
      id: "nav.home",
      label: "Home page",
      scope: "global",
      keys: ["alt+home"],
      mac: ["cmd+shift+h"],
      command: cmd("goHome")
    },
    // Page.
    {
      id: "page.find",
      label: "Find in page",
      scope: "global",
      keys: ["ctrl+f"],
      command: cmd("find")
    },
    {
      id: "page.zoomIn",
      label: "Zoom in",
      scope: "global",
      keys: ["ctrl+=", "ctrl+shift+="],
      command: cmd("zoomIn")
    },
    {
      id: "page.zoomOut",
      label: "Zoom out",
      scope: "global",
      keys: ["ctrl+-"],
      command: cmd("zoomOut")
    },
    {
      id: "page.zoomReset",
      label: "Reset zoom",
      scope: "global",
      keys: ["ctrl+0"],
      command: cmd("zoomReset")
    },
    {
      id: "page.bookmark",
      label: "Bookmark this page",
      scope: "global",
      keys: ["ctrl+d"],
      command: cmd("bookmarkPage")
    },
    {
      id: "page.source",
      label: "View page source",
      scope: "global",
      keys: ["ctrl+u"],
      mac: ["cmd+alt+u"],
      command: cmd("viewSource")
    },
    {
      id: "page.pdf",
      label: "Save page as PDF",
      scope: "global",
      // Ctrl+P is VS Code's Quick Open: from the menu (or a key of your own).
      keys: [],
      command: cmd("savePdf")
    },
    {
      id: "page.copyUrl",
      label: "Copy page address",
      scope: "global",
      keys: ["ctrl+shift+l"],
      command: cmd("copyUrl")
    },
    {
      id: "page.external",
      label: "Open in system browser",
      scope: "global",
      keys: [],
      command: cmd("openInSystemBrowser")
    },
    {
      id: "page.devtools",
      label: "Open DevTools",
      scope: "global",
      keys: ["f12"],
      command: cmd("openDevTools")
    },
    {
      id: "page.contextToAgent",
      label: "Send page context to agent",
      scope: "global",
      keys: ["ctrl+alt+enter"],
      command: cmd("sendPageContextToChat")
    },
    // Agent.
    {
      id: "agent.showContext",
      label: "Show agent context",
      scope: "global",
      keys: ["ctrl+shift+alt+a"],
      command: cmd("showAgentContext"),
      everywhere: true
    },
    {
      id: "agent.sendLatest",
      label: "Send the latest capture to the agent",
      scope: "global",
      keys: ["ctrl+shift+alt+v"],
      command: cmd("sendLatestContext"),
      everywhere: true
    },
    // Internal pages and panels.
    {
      id: "open.history",
      label: "History",
      scope: "global",
      keys: ["ctrl+h"],
      mac: ["cmd+y"],
      command: cmd("showHistory")
    },
    {
      id: "open.downloads",
      label: "Downloads",
      scope: "global",
      // Ctrl+J is VS Code's panel.
      keys: ["shift+alt+l"],
      command: cmd("showDownloads")
    },
    {
      id: "open.bookmarks",
      label: "Bookmark manager",
      scope: "global",
      keys: ["ctrl+alt+b"],
      command: cmd("showBookmarks")
    },
    {
      id: "open.bookmarksBar",
      label: "Show or hide the bookmarks bar",
      scope: "global",
      keys: ["ctrl+shift+b"]
    },
    // Ctrl+K starts VS Code's key chords, and web apps use it (GitHub, Slack...).
    { id: "open.quickActions", label: "Quick actions", scope: "global", keys: ["ctrl+shift+k"] },
    {
      id: "open.shortcuts",
      label: "Change keyboard shortcuts",
      scope: "global",
      keys: ["ctrl+alt+k"],
      command: cmd("editShortcuts")
    },
    {
      id: "open.cheatSheet",
      label: "Keyboard shortcuts of this mode",
      scope: "global",
      // Ctrl+/ comments code in web editors. On macOS, Cmd+Shift+/ is the system Help search.
      keys: ["ctrl+shift+/"],
      mac: ["cmd+alt+/"]
    },
    // Modes.
    // Modes are Alt+Shift+letter: VS Code keeps its view keys (Ctrl+Shift+E/D/M/U/O/S...) while
    // the browser has focus, and Chrome keeps its DevTools keys (Ctrl+Shift+C/J/I/M). Chrome
    // itself uses Alt+Shift+T/B/A/I; the capture popup uses C/X/S/D, the toolbar K.
    { id: "mode.inspect", label: "Element picker", scope: "global", keys: ["shift+alt+e"] },
    { id: "mode.draw", label: "Draw on the page", scope: "global", keys: ["shift+alt+w"] },
    { id: "mode.screenshot", label: "Screenshot", scope: "global", keys: ["shift+alt+g"] },
    {
      id: "mode.devtools",
      label: "Console and network",
      scope: "global",
      keys: ["shift+alt+j"]
    },
    { id: "mode.device", label: "Device toolbar", scope: "global", keys: ["shift+alt+m"] },
    { id: "mode.measure", label: "Measure", scope: "global", keys: ["shift+alt+u"] },
    { id: "mode.eyedropper", label: "Eyedropper", scope: "global", keys: ["shift+alt+y"] },
    { id: "mode.overlay", label: "Design overlay", scope: "global", keys: ["shift+alt+o"] },
    { id: "mode.tweak", label: "CSS tweak", scope: "global", keys: ["shift+alt+v"] },
    { id: "mode.record", label: "Record the page", scope: "global", keys: ["ctrl+alt+r"] },
    { id: "mode.a11y", label: "Accessibility check", scope: "global", keys: ["shift+alt+h"] },
    // Hides the toolbars for room; the mode stays on and its keys keep working.
    { id: "view.toolbar", label: "Hide or show the toolbar", scope: "global", keys: ["shift+alt+z"] },
    // Element picker.
    { id: "inspect.parent", label: "Select the parent element", scope: "inspect", keys: ["up"] },
    {
      id: "inspect.child",
      label: "Select the first child element",
      scope: "inspect",
      keys: ["down"]
    },
    {
      id: "inspect.copy",
      label: "Copy the selected elements",
      scope: "inspect",
      keys: ["enter", "c"]
    },
    { id: "inspect.screenshot", label: "Screenshot the element", scope: "inspect", keys: ["s"] },
    { id: "inspect.agent", label: "Send the element to the agent", scope: "inspect", keys: ["a"] },
    { id: "inspect.help", label: "Show these shortcuts", scope: "inspect", keys: ["shift+/"] },
    { id: "inspect.exit", label: "Exit", scope: "inspect", keys: ["escape"] },
    // Drawing.
    { id: "draw.select", label: "Select and move", scope: "draw", keys: ["v"] },
    { id: "draw.pen", label: "Pen", scope: "draw", keys: ["p"] },
    { id: "draw.pencil", label: "Pencil", scope: "draw", keys: ["i"] },
    { id: "draw.marker", label: "Marker", scope: "draw", keys: ["m"] },
    { id: "draw.brush", label: "Brush", scope: "draw", keys: ["u"] },
    { id: "draw.highlighter", label: "Highlighter", scope: "draw", keys: ["h"] },
    { id: "draw.neon", label: "Neon", scope: "draw", keys: ["g"] },
    { id: "draw.line", label: "Line", scope: "draw", keys: ["l"] },
    { id: "draw.arrow", label: "Arrow", scope: "draw", keys: ["a"] },
    { id: "draw.doubleArrow", label: "Double arrow", scope: "draw", keys: ["d"] },
    { id: "draw.rect", label: "Rectangle", scope: "draw", keys: ["r"] },
    { id: "draw.ellipse", label: "Ellipse", scope: "draw", keys: ["o"] },
    { id: "draw.text", label: "Text", scope: "draw", keys: ["t"] },
    { id: "draw.callout", label: "Numbered callout", scope: "draw", keys: ["n"] },
    { id: "draw.blur", label: "Redact (pixelate)", scope: "draw", keys: ["b"] },
    { id: "draw.eraser", label: "Eraser", scope: "draw", keys: ["e"] },
    ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
      id: `draw.color${n}`,
      label: `Color ${n}`,
      scope: "draw",
      keys: [String(n)]
    })),
    { id: "draw.thinner", label: "Thinner stroke", scope: "draw", keys: ["["] },
    { id: "draw.thicker", label: "Thicker stroke", scope: "draw", keys: ["]"] },
    { id: "draw.fill", label: "Fill shapes on or off", scope: "draw", keys: ["f"] },
    { id: "draw.undo", label: "Undo", scope: "draw", keys: ["ctrl+z"] },
    { id: "draw.redo", label: "Redo", scope: "draw", keys: ["ctrl+y", "ctrl+shift+z"] },
    { id: "draw.clear", label: "Clear all drawings", scope: "draw", keys: ["shift+backspace"] },
    { id: "draw.visible", label: "Hide or show drawings", scope: "draw", keys: ["w"] },
    { id: "draw.capture", label: "Screenshot the drawing area", scope: "draw", keys: ["enter"] },
    {
      id: "draw.captureAgent",
      label: "Screenshot the drawing area and send it to the agent",
      scope: "draw",
      keys: ["shift+enter"]
    },
    // The drawing toolbar's Screenshot menu: the key that opens it, and one per item.
    { id: "draw.captureMenu", label: "Screenshot menu", scope: "draw", keys: ["s"] },
    {
      id: "draw.captureGroups",
      label: "Screenshot each drawing separately",
      scope: "draw",
      keys: ["alt+g"]
    },
    {
      id: "draw.captureClean",
      label: "Screenshot the drawing area without drawings",
      scope: "draw",
      keys: ["alt+c"]
    },
    {
      id: "draw.captureViewport",
      label: "Screenshot the visible area with drawings",
      scope: "draw",
      keys: ["alt+v"]
    },
    {
      id: "draw.captureFullPage",
      label: "Screenshot the full page with drawings",
      scope: "draw",
      keys: ["alt+f"]
    },
    {
      id: "draw.captureRegion",
      label: "Screenshot an area you drag, with drawings",
      scope: "draw",
      keys: ["alt+r"]
    },
    { id: "draw.help", label: "Show these shortcuts", scope: "draw", keys: ["shift+/"] },
    { id: "draw.exit", label: "Stop drawing", scope: "draw", keys: ["escape"] },
    // Screenshot (the menu the mode key opens).
    { id: "shot.viewport", label: "Visible area", scope: "screenshot", keys: ["v"] },
    { id: "shot.fullPage", label: "Full page", scope: "screenshot", keys: ["f"] },
    { id: "shot.region", label: "Region", scope: "screenshot", keys: ["r"] },
    { id: "shot.element", label: "Element", scope: "screenshot", keys: ["e"] },
    { id: "shot.drawing", label: "Drawing area", scope: "screenshot", keys: ["d"] },
    {
      id: "shot.lastToAgent",
      label: "Send the last screenshot to the agent",
      scope: "screenshot",
      keys: ["a"],
      command: cmd("screenshot.sendToTerminal")
    },
    // The send dialog after a capture (it holds the focus, so plain keys). 1-9 send to the agent
    // with that number (fixed keys, like the drawing colors).
    { id: "send.default", label: "Send to the default agent", scope: "send", keys: ["enter"] },
    { id: "send.newThread", label: "New agentmux thread", scope: "send", keys: ["n"] },
    { id: "send.prompt", label: "Write a prompt", scope: "send", keys: ["i"] },
    { id: "send.project", label: "Change project", scope: "send", keys: ["p"] },
    { id: "send.copy", label: "Copy", scope: "send", keys: ["c"] },
    { id: "send.download", label: "Download", scope: "send", keys: ["d"] },
    { id: "send.close", label: "Close (keep it saved)", scope: "send", keys: ["escape"] },
    // Console and network (while the drawer is open).
    { id: "dev.console", label: "Console", scope: "devtools", keys: ["alt+1"] },
    { id: "dev.network", label: "Network", scope: "devtools", keys: ["alt+2"] },
    { id: "dev.filter", label: "Filter", scope: "devtools", keys: ["alt+f"] },
    { id: "dev.copyErrors", label: "Copy console errors", scope: "devtools", keys: ["alt+e"] },
    { id: "dev.copyFailed", label: "Copy failed requests", scope: "devtools", keys: ["alt+q"] },
    { id: "dev.copyContext", label: "Copy page context", scope: "devtools", keys: ["alt+p"] },
    {
      id: "dev.contextAgent",
      label: "Send page context to the agent",
      scope: "devtools",
      keys: ["alt+shift+p"]
    },
    { id: "dev.clear", label: "Clear", scope: "devtools", keys: ["alt+k"] },
    { id: "dev.close", label: "Close", scope: "devtools", keys: ["alt+w"] },
    // Device (while the device toolbar is on).
    { id: "device.previous", label: "Previous device", scope: "device", keys: ["alt+["] },
    { id: "device.next", label: "Next device", scope: "device", keys: ["alt+]"] },
    { id: "device.rotate", label: "Rotate", scope: "device", keys: ["alt+r"] },
    { id: "device.touch", label: "Touch and mobile on or off", scope: "device", keys: ["alt+t"] },
    { id: "device.fit", label: "Fit to window", scope: "device", keys: ["alt+0"] },
    { id: "device.zoomIn", label: "Zoom in", scope: "device", keys: ["alt+="] },
    { id: "device.zoomOut", label: "Zoom out", scope: "device", keys: ["alt+-"] },
    { id: "device.network", label: "Next network speed", scope: "device", keys: ["alt+n"] },
    { id: "device.theme", label: "Next color scheme", scope: "device", keys: ["alt+l"] },
    { id: "device.close", label: "Close the device toolbar", scope: "device", keys: [] },
    // Measure.
    { id: "measure.grid", label: "Rulers and grid on or off", scope: "measure", keys: ["g"] },
    { id: "measure.copy", label: "Copy the measurements", scope: "measure", keys: ["c"] },
    { id: "measure.clear", label: "Clear the pinned element", scope: "measure", keys: ["backspace"] },
    { id: "measure.help", label: "Show these shortcuts", scope: "measure", keys: ["shift+/"] },
    { id: "measure.exit", label: "Exit", scope: "measure", keys: ["escape"] },
    // Eyedropper.
    { id: "eyedropper.hex", label: "Copy colors as hex", scope: "eyedropper", keys: ["h"] },
    { id: "eyedropper.rgb", label: "Copy colors as rgb()", scope: "eyedropper", keys: ["r"] },
    { id: "eyedropper.hsl", label: "Copy colors as hsl()", scope: "eyedropper", keys: ["l"] },
    { id: "eyedropper.help", label: "Show these shortcuts", scope: "eyedropper", keys: ["shift+/"] },
    { id: "eyedropper.exit", label: "Exit", scope: "eyedropper", keys: ["escape"] },
    // Design overlay (the page stays usable, so these use Alt).
    { id: "overlay.open", label: "Open an image", scope: "overlay", keys: ["alt+o"] },
    { id: "overlay.fainter", label: "Less opaque", scope: "overlay", keys: ["alt+,"] },
    { id: "overlay.stronger", label: "More opaque", scope: "overlay", keys: ["alt+."] },
    { id: "overlay.left", label: "Nudge left", scope: "overlay", keys: ["alt+left"] },
    { id: "overlay.right", label: "Nudge right", scope: "overlay", keys: ["alt+right"] },
    { id: "overlay.up", label: "Nudge up", scope: "overlay", keys: ["alt+up"] },
    { id: "overlay.down", label: "Nudge down", scope: "overlay", keys: ["alt+down"] },
    {
      id: "overlay.difference",
      label: "Difference blend on or off",
      scope: "overlay",
      keys: ["alt+x"]
    },
    { id: "overlay.hide", label: "Hide or show the overlay", scope: "overlay", keys: ["alt+h"] },
    { id: "overlay.exit", label: "Close the overlay", scope: "overlay", keys: ["alt+z"] },
    // CSS tweak.
    {
      id: "tweak.agent",
      label: "Send the CSS changes to the agent",
      scope: "tweak",
      keys: ["ctrl+enter"]
    },
    { id: "tweak.copy", label: "Copy the CSS changes", scope: "tweak", keys: ["ctrl+shift+c"] },
    { id: "tweak.undo", label: "Undo the last change", scope: "tweak", keys: ["ctrl+z"] },
    { id: "tweak.exit", label: "Exit and revert", scope: "tweak", keys: ["escape"] },
    // Record (the page stays usable).
    { id: "record.stop", label: "Stop and save", scope: "record", keys: ["alt+s"] },
    { id: "record.pause", label: "Pause or resume", scope: "record", keys: ["alt+y"] },
    { id: "record.cancel", label: "Cancel", scope: "record", keys: ["alt+backspace"] },
    // Accessibility check.
    { id: "a11y.next", label: "Next issue", scope: "a11y", keys: ["n", "down"] },
    { id: "a11y.previous", label: "Previous issue", scope: "a11y", keys: ["p", "up"] },
    { id: "a11y.tabOrder", label: "Tab order on or off", scope: "a11y", keys: ["t"] },
    { id: "a11y.copy", label: "Copy the report", scope: "a11y", keys: ["c"] },
    { id: "a11y.agent", label: "Send the report to the agent", scope: "a11y", keys: ["a"] },
    { id: "a11y.help", label: "Show these shortcuts", scope: "a11y", keys: ["shift+/"] },
    { id: "a11y.exit", label: "Exit", scope: "a11y", keys: ["escape"] }
  ];
  var TOOLBAR_ACTION_IDS = /* @__PURE__ */ new Set([
    "mode.inspect",
    "mode.draw",
    "mode.screenshot",
    "mode.device",
    "mode.devtools",
    "page.bookmark",
    "open.shortcuts",
    "view.toolbar",
    "inspect.parent",
    "inspect.child",
    "inspect.copy",
    "inspect.exit",
    ...[
      "select",
      "pen",
      "pencil",
      "marker",
      "brush",
      "highlighter",
      "neon",
      "line",
      "arrow",
      "doubleArrow",
      "rect",
      "ellipse",
      "text",
      "callout",
      "blur",
      "eraser"
    ].map((tool) => `draw.${tool}`),
    ...Array.from({ length: 9 }, (_, i) => `draw.color${i + 1}`),
    "draw.thinner",
    "draw.thicker",
    "draw.fill",
    "draw.undo",
    "draw.redo",
    "draw.clear",
    "draw.visible",
    "draw.capture",
    "draw.captureMenu",
    "draw.captureGroups",
    "draw.captureClean",
    "draw.captureViewport",
    "draw.captureFullPage",
    "draw.captureRegion",
    "draw.exit",
    "shot.viewport",
    "shot.fullPage",
    "shot.region",
    "shot.element",
    "shot.drawing",
    "send.default",
    "send.newThread",
    "send.prompt",
    "send.project",
    "send.copy",
    "send.download",
    "send.close"
  ]);

  // src/shortcuts.ts
  var SHORTCUTS_KEY = "inkspectShortcuts";
  var isMac = typeof navigator !== "undefined" && navigator.userAgent.includes("Macintosh");
  var TOOLBAR_ACTIONS = SHORTCUT_ACTIONS.filter(
    (a) => TOOLBAR_ACTION_IDS.has(a.id)
  );
  var TOOLBAR_SCOPES = ["global", "inspect", "draw", "screenshot"];
  var ALL_SCOPES = [
    ...TOOLBAR_SCOPES,
    ...Object.keys(SCOPE_LABELS).filter((s) => !TOOLBAR_SCOPES.includes(s))
  ];

  // src/background/shortcutSync.ts
  async function stored() {
    const value = (await chrome.storage.sync.get(SHORTCUTS_KEY))[SHORTCUTS_KEY];
    if (!value || typeof value !== "object") return void 0;
    const { shortcuts, updated } = value;
    if (!shortcuts || typeof shortcuts !== "object" || typeof updated !== "number") return void 0;
    return { shortcuts, updated };
  }
  async function receiveShortcuts(bridge2, fromVsCode) {
    const local = await stored();
    switch (newerShortcuts(local, fromVsCode)) {
      case "remote":
        await chrome.storage.sync.set({
          [SHORTCUTS_KEY]: { shortcuts: fromVsCode.shortcuts, updated: fromVsCode.updated }
        });
        break;
      case "local":
        if (local) bridge2.send({ type: "settings.shortcuts", ...local });
        break;
    }
  }
  function watchShortcuts(bridge2) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "sync" || !changes[SHORTCUTS_KEY] || !bridge2.connected) return;
      void stored().then((settings) => {
        if (settings) bridge2.send({ type: "settings.shortcuts", ...settings });
      });
    });
  }

  // src/background/index.ts
  var bridge = new BridgeClient();
  void bridge.start();
  watchShortcuts(bridge);
  async function toolbarKey() {
    const commands = await chrome.commands.getAll().catch(() => []);
    return commands.find((c) => c.name === "toggle-toolbar")?.shortcut || void 0;
  }
  async function showLinkState(status) {
    const unpaired = status.state === "unpaired";
    const key = await toolbarKey();
    const toolbar = key ? `Inkspect toolbar (${key})` : "Inkspect toolbar";
    await Promise.all([
      chrome.action.setBadgeText({ text: unpaired ? "!" : "" }),
      chrome.action.setBadgeBackgroundColor({ color: "#d97706" }),
      chrome.action.setTitle({
        title: status.state === "connected" ? `Inkspect: bookmarks sync with ${status.peer ?? "VS Code"}` : unpaired ? `${toolbar}. Not paired with VS Code yet` : toolbar
      })
    ]);
  }
  bridge.onStatus(
    (status) => (
      // Same "No SW" case at startup: try again once the service worker is up.
      showLinkState(status).catch(
        () => setTimeout(() => void showLinkState(bridge.status).catch(() => void 0), 1e3)
      )
    )
  );
  var PANEL_REQUESTS = /* @__PURE__ */ new Set([
    "projects.get",
    "items.get",
    "item.thumb",
    "item.content",
    "item.remove",
    "item.restore",
    "item.send",
    "items.move",
    "items.group",
    "items.ungroup",
    "project.pin"
  ]);
  function isPanelRequest(value) {
    const type = value?.type;
    return typeof type === "string" && PANEL_REQUESTS.has(type);
  }
  chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {
      if (sender.id !== chrome.runtime.id || !sender.url?.startsWith(chrome.runtime.getURL(""))) {
        return false;
      }
      if (message.type === "pair" && message.code) {
        void bridge.pair(message.code).then((status) => sendResponse(status));
        return true;
      }
      if (message.type === "unpair") {
        void bridge.unpair().then(() => sendResponse(bridge.status));
        return true;
      }
      if (message.type === "status") {
        sendResponse(bridge.status);
        return false;
      }
      if (message.type === "hub" && isPanelRequest(message.request)) {
        const request = message.request;
        void bridge.hubRequest(request, request.type === "item.send" ? 13e4 : 3e4).then((reply) => sendResponse(reply ?? null));
        return true;
      }
      if (message.type === "toggleToolbar") {
        void chrome.tabs.query({ active: true, lastFocusedWindow: true }).then(async ([tab]) => {
          if (!tab) return sendResponse({ ok: false, error: "No tab" });
          sendResponse(await toggleToolbar(tab));
        });
        return true;
      }
      return false;
    }
  );
  var syncEnabled = false;
  var applying = false;
  var importing = false;
  var snapshotTimer;
  var changedWhileApplying = false;
  function sendSnapshotSoon(delay = 500) {
    if (applying) {
      changedWhileApplying = true;
      return;
    }
    if (!syncEnabled || importing) return;
    clearTimeout(snapshotTimer);
    snapshotTimer = setTimeout(async () => {
      try {
        bridge.send({ type: "bookmarks.snapshot", tree: await snapshot() });
      } catch (error) {
        console.warn("Inkspect: could not read bookmarks", error);
      }
    }, delay);
  }
  async function applyFromVsCode(ops) {
    applying = true;
    try {
      const { created, failed } = await applyOps(ops);
      bridge.send({ type: "bookmarks.applied", created, failed });
    } finally {
      setTimeout(() => {
        applying = false;
        if (changedWhileApplying) {
          changedWhileApplying = false;
          sendSnapshotSoon();
        }
      }, 300);
    }
  }
  bridge.onMessage((message) => {
    switch (message.type) {
      case "welcome":
        syncEnabled = message.syncBookmarks;
        sendSnapshotSoon(0);
        break;
      case "bookmarks.requestSnapshot":
        sendSnapshotSoon(0);
        break;
      case "bookmarks.ops":
        void applyFromVsCode(message.ops);
        break;
      case "settings.shortcuts":
        void receiveShortcuts(bridge, message);
        break;
    }
  });
  var onBookmarkChange = () => sendSnapshotSoon();
  chrome.bookmarks.onCreated.addListener(onBookmarkChange);
  chrome.bookmarks.onRemoved.addListener(onBookmarkChange);
  chrome.bookmarks.onChanged.addListener(onBookmarkChange);
  chrome.bookmarks.onMoved.addListener(onBookmarkChange);
  chrome.bookmarks.onChildrenReordered?.addListener(onBookmarkChange);
  chrome.bookmarks.onImportBegan?.addListener(() => importing = true);
  chrome.bookmarks.onImportEnded?.addListener(() => {
    importing = false;
    sendSnapshotSoon();
  });
  chrome.runtime.onStartup.addListener(() => bridge.ensureConnected());
  chrome.runtime.onInstalled.addListener((details) => {
    bridge.ensureConnected();
    if (details.reason === "install") void chrome.runtime.openOptionsPage();
  });
  globalThis.__inkspectTest = {
    toggleToolbar: async (tabId) => toggleToolbar(await chrome.tabs.get(tabId)),
    bridgeStatus: () => bridge.status,
    reconnect: () => bridge.reconnect(),
    syncState: () => ({ syncEnabled, applying, importing, connected: bridge.connected }),
    pair: (code) => bridge.pair(code),
    syncedShortcuts: async () => (await chrome.storage.sync.get(SHORTCUTS_KEY))[SHORTCUTS_KEY]
  };
  chrome.commands.onCommand.addListener((command2, tab) => {
    if (command2 !== "toggle-toolbar" || !tab) return;
    void toolbarKey().then((shown) => {
      const key = shown && commandBinding(shown);
      if (tab.url?.startsWith(chrome.runtime.getURL(""))) {
        if (key) {
          void chrome.runtime.sendMessage({ type: "shortcutPressed", key }).catch(() => void 0);
        }
        return;
      }
      void toggleToolbar(tab, key);
    });
  });
  function commandBinding(shown) {
    const mac = { "\u2303": "ctrl+", "\u2325": "alt+", "\u21E7": "shift+", "\u2318": "cmd+" };
    return shown.replace(/[⌃⌥⇧⌘]/g, (symbol) => mac[symbol]).replace(/^MacCtrl\+/i, "ctrl+").replace(/Command\+/i, "cmd+").toLowerCase();
  }
  async function injectToolbar(tabId) {
    const [probe] = await chrome.scripting.executeScript({
      target: { tabId },
      func: () => !!window.__inkspect
    });
    if (probe?.result) return false;
    await chrome.scripting.executeScript({ target: { tabId }, files: ["content.js"] });
    await chrome.scripting.executeScript({
      target: { tabId },
      files: ["main-world.js"],
      world: "MAIN"
    });
    return true;
  }
  async function toggleToolbar(tab, key) {
    bridge.ensureConnected();
    if (!tab.id) return { ok: false, error: "No tab" };
    try {
      await injectToolbar(tab.id);
      await chrome.tabs.sendMessage(tab.id, { type: "toggle", key });
      return { ok: true };
    } catch {
      await chrome.action.setBadgeText({ tabId: tab.id, text: "\u2715" });
      await chrome.action.setBadgeBackgroundColor({ tabId: tab.id, color: "#b3261e" });
      await chrome.action.setTitle({ tabId: tab.id, title: "Inkspect can\u2019t run on this page" });
      return {
        ok: false,
        error: "Inkspect can\u2019t run on this page (browser pages, the Web Store...)."
      };
    }
  }
  var OPEN_TABS_KEY = "inkspectOpenTabs";
  async function openTabs() {
    const stored2 = await chrome.storage.session.get(OPEN_TABS_KEY).catch(() => ({}));
    const list = stored2[OPEN_TABS_KEY];
    return Array.isArray(list) ? list.filter((id2) => typeof id2 === "number") : [];
  }
  async function setToolbarOpen(tabId, open) {
    const list = (await openTabs()).filter((id2) => id2 !== tabId);
    if (open) list.push(tabId);
    await chrome.storage.session.set({ [OPEN_TABS_KEY]: list }).catch(() => {
    });
  }
  chrome.tabs.onUpdated.addListener((tabId, change) => {
    if (change.status !== "complete") return;
    void openTabs().then(async (list) => {
      if (!list.includes(tabId)) return;
      try {
        if (await injectToolbar(tabId)) {
          await chrome.tabs.sendMessage(tabId, { type: "toggle" });
        }
      } catch {
        await setToolbarOpen(tabId, false);
      }
    });
  });
  chrome.tabs.onRemoved.addListener((tabId) => void setToolbarOpen(tabId, false));
  bridge.onStatus((status) => {
    void broadcast({ type: "bridgeStatus", status });
  });
  async function broadcast(message) {
    for (const tab of await chrome.tabs.query({})) {
      if (tab.id) chrome.tabs.sendMessage(tab.id, message).catch(() => {
      });
    }
  }
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (!sender.tab || sender.url?.startsWith(chrome.runtime.getURL(""))) return false;
    bridge.ensureConnected();
    handle(message, sender).then(sendResponse).catch(
      (error) => sendResponse({ ok: false, error: error instanceof Error ? error.message : String(error) })
    );
    return true;
  });
  async function handle(message, sender) {
    const tab = sender.tab;
    switch (message.type) {
      case "openSaved": {
        if (!tab?.windowId) return { ok: false, error: "No tab" };
        try {
          if (false) {
            const sidebar = globalThis.browser?.sidebarAction;
            await sidebar?.open();
          } else {
            await chrome.sidePanel.open({ windowId: tab.windowId });
          }
          return { ok: true };
        } catch {
          return {
            ok: false,
            error: "The browser didn\u2019t open the side panel: open Saved from the Inkspect button."
          };
        }
      }
      case "capture": {
        if (!tab?.windowId) return { ok: false, error: "No tab" };
        return { ok: true, dataUrl: await capture(tab.windowId) };
      }
      case "download":
        await chrome.downloads.download({
          url: message.dataUrl,
          filename: message.filename,
          saveAs: false
        });
        return { ok: true };
      case "bookmarkPage": {
        const existing = await chrome.bookmarks.search({ url: message.url });
        if (existing.length) return { ok: true, bookmarked: true };
        const { bar } = await syncRoots();
        await chrome.bookmarks.create({ parentId: bar, title: message.title, url: message.url });
        return { ok: true, bookmarked: true };
      }
      case "unbookmarkPage": {
        for (const node of await chrome.bookmarks.search({ url: message.url })) {
          await chrome.bookmarks.remove(node.id);
        }
        return { ok: true, bookmarked: false };
      }
      case "isBookmarked":
        return {
          ok: true,
          bookmarked: (await chrome.bookmarks.search({ url: message.url })).length > 0
        };
      case "emulate":
        if (!tab?.id) return { ok: false, error: "No tab" };
        await emulate(tab.id, message.request);
        return { ok: true };
      case "allowFraming":
        if (!tab?.id) return { ok: false, error: "No tab" };
        await allowFraming(tab.id, message.url);
        return { ok: true };
      case "endFraming":
        if (tab?.id) await endFraming(tab.id);
        return { ok: true };
      case "bridgeStatus":
        return { ok: true, status: bridge.status };
      case "toolbarOpen":
        if (tab?.id) await setToolbarOpen(tab.id, message.open);
        return { ok: true };
      case "openOptions":
        await chrome.runtime.openOptionsPage();
        return { ok: true };
      case "pair": {
        const status = await bridge.pair(message.code);
        return { ok: true, status };
      }
      case "projects": {
        const reply = await bridge.hubRequest(
          { type: "projects.get", req: crypto.randomUUID(), url: message.url?.slice(0, 4096) },
          1e4
        );
        if (!reply) return { ok: false, error: "Not linked with VS Code or the browser helper." };
        return { ok: true, projects: reply.projects, suggested: reply.suggested };
      }
      case "saveCapture":
        return saveCaptures(message);
      case "sendSaved": {
        const reply = await bridge.hubRequest(
          {
            type: "item.send",
            req: crypto.randomUUID(),
            project: message.project,
            ids: message.ids,
            target: message.target,
            open: message.open,
            ...message.prompt ? { prompt: message.prompt } : {}
          },
          // A send can wait for VS Code (choosing a terminal); the helper gives up after 2 minutes.
          13e4
        );
        if (!reply) return { ok: false, error: "The browser helper did not answer." };
        return reply.ok ? { ok: true, sentTo: reply.sentTo } : { ok: false, error: reply.error ?? "Nothing was sent." };
      }
      case "startThread": {
        const reply = await bridge.hubRequest(
          {
            type: "agentmux.start",
            req: crypto.randomUUID(),
            project: message.project,
            harness: message.harness
          },
          // agentmux takes up to a minute to start a thread, then its agent has 20 seconds.
          9e4
        );
        if (!reply) return { ok: false, error: "The browser helper did not answer." };
        return reply.ok ? { ok: true, target: reply.target } : { ok: false, error: reply.error ?? "The thread did not start." };
      }
      case "moveSaved": {
        const reply = await bridge.hubRequest({
          type: "items.move",
          req: crypto.randomUUID(),
          project: message.project,
          ids: message.ids,
          to: message.to
        });
        if (!reply) return { ok: false, error: "The browser helper did not answer." };
        return reply.ok ? { ok: true } : { ok: false, error: reply.error ?? "Not moved." };
      }
    }
  }
  var MAX_SAVE = 40 * 1024 * 1024;
  async function saveCaptures(message) {
    const size = (c) => (c.image?.length ?? 0) + (c.text?.length ?? 0) + 1e3;
    const batches = [];
    for (const capture2 of message.captures) {
      if (size(capture2) > MAX_SAVE) {
        return { ok: false, error: "That screenshot is too large to save. Download it instead." };
      }
      const last = batches.at(-1);
      if (last && last.reduce((total, c) => total + size(c), 0) + size(capture2) <= MAX_SAVE) {
        last.push(capture2);
      } else batches.push([capture2]);
    }
    const ids = [];
    let sentTo;
    for (const [index, captures] of batches.entries()) {
      const last = index === batches.length - 1;
      const reply = await bridge.hubRequest(
        {
          type: "capture.save",
          req: crypto.randomUUID(),
          project: message.project,
          url: message.url?.slice(0, 4096),
          browser: browserName(),
          captures,
          // Sent once, all together, with the last part.
          send: batches.length === 1 ? message.send : void 0
        },
        // A send can wait for VS Code (choosing a terminal); the helper gives up after 2 minutes.
        13e4
      );
      if (!reply) return { ok: false, error: "The browser helper did not answer." };
      if (!reply.ok) return { ok: false, error: reply.error ?? "Saving failed." };
      ids.push(...reply.ids ?? []);
      sentTo = reply.sentTo;
      if (last && batches.length > 1 && message.send) {
        const sent = await bridge.hubRequest(
          {
            type: "item.send",
            req: crypto.randomUUID(),
            project: message.project,
            ids,
            target: message.send
          },
          13e4
        );
        if (!sent?.ok) {
          return { ok: false, error: `Saved, but not sent: ${sent?.error ?? "no answer."}` };
        }
        sentTo = sent.sentTo;
      }
    }
    return { ok: true, ids, sentTo };
  }
  var lastCapture = 0;
  var captureQueue = Promise.resolve();
  function capture(windowId) {
    const next = captureQueue.then(async () => {
      const wait = lastCapture + 550 - Date.now();
      if (wait > 0) await new Promise((resolve) => setTimeout(resolve, wait));
      lastCapture = Date.now();
      return chrome.tabs.captureVisibleTab(windowId, { format: "png" });
    });
    captureQueue = next.catch(() => {
    });
    return next;
  }
  var debugging = /* @__PURE__ */ new Set();
  async function command(tabId, method, params) {
    await chrome.debugger.sendCommand({ tabId }, method, params);
  }
  async function emulate(tabId, request) {
    if (false) throw new Error("Emulation needs Chrome, Edge or Brave.");
    const device = request.agent;
    const userAgent = device?.userAgent ? deviceUserAgent(
      device.userAgent,
      /Chrome\/([\d.]+)/.exec(navigator.userAgent)?.[1] ?? "130.0.0.0"
    ) : void 0;
    await frameUserAgent(tabId, userAgent, device?.userAgent);
    const idle = !device?.touch && request.network === "none" && request.cpu === 1 && request.colorScheme === "default" && !request.print;
    if (idle) {
      if (debugging.has(tabId)) {
        debugging.delete(tabId);
        await chrome.debugger.detach({ tabId }).catch(() => {
        });
      }
      return;
    }
    if (!debugging.has(tabId)) {
      await chrome.debugger.attach({ tabId }, "1.3");
      debugging.add(tabId);
    }
    await command(tabId, "Emulation.setTouchEmulationEnabled", {
      enabled: !!device?.touch,
      ...device?.touch ? { maxTouchPoints: 5 } : {}
    });
    await command(tabId, "Emulation.setUserAgentOverride", { userAgent: userAgent ?? "" });
    const network = NETWORK_CONDITIONS[request.network];
    await command(tabId, "Network.emulateNetworkConditions", {
      offline: request.network === "offline",
      latency: network?.latency ?? 0,
      downloadThroughput: network?.download ?? -1,
      uploadThroughput: network?.upload ?? -1
    });
    await command(tabId, "Emulation.setCPUThrottlingRate", { rate: request.cpu });
    await command(tabId, "Emulation.setEmulatedMedia", {
      media: request.print ? "print" : "",
      features: request.colorScheme === "default" ? [] : [{ name: "prefers-color-scheme", value: request.colorScheme }]
    });
  }
  if (true) {
    chrome.debugger.onDetach.addListener(({ tabId }) => {
      if (tabId !== void 0) debugging.delete(tabId);
    });
  }
  var framingRuleId = (tabId) => 1e6 + tabId % 1e6;
  var userAgentRuleId = (tabId) => 2e6 + tabId % 1e6;
  var framedOrigins = /* @__PURE__ */ new Map();
  var frameAgents = /* @__PURE__ */ new Map();
  async function frameUserAgent(tabId, userAgent, kind2) {
    const id2 = userAgentRuleId(tabId);
    if (userAgent) frameAgents.set(tabId, { userAgent, kind: kind2 });
    else frameAgents.delete(tabId);
    const origin = framedOrigins.get(tabId);
    if (!userAgent || !origin) {
      await chrome.declarativeNetRequest.updateSessionRules({ removeRuleIds: [id2] });
      return;
    }
    const mobile = kind2 === "iphone" || kind2 === "android";
    const platform = kind2 === "android" ? "Android" : "iOS";
    const set = "set";
    const requestHeaders = [
      { header: "user-agent", operation: set, value: userAgent },
      { header: "sec-ch-ua-mobile", operation: set, value: mobile ? "?1" : "?0" },
      { header: "sec-ch-ua-platform", operation: set, value: `"${platform}"` }
    ];
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [id2],
      addRules: [
        {
          id: id2,
          priority: 1,
          action: {
            type: "modifyHeaders",
            requestHeaders
          },
          condition: {
            tabIds: [tabId],
            urlFilter: `|${origin}/`,
            resourceTypes: ["sub_frame"]
          }
        }
      ]
    });
  }
  async function allowFraming(tabId, url) {
    const origin = new URL(url).origin;
    if (!/^https?:$/.test(new URL(url).protocol)) return;
    framedOrigins.set(tabId, origin);
    const agent = frameAgents.get(tabId);
    if (agent) await frameUserAgent(tabId, agent.userAgent, agent.kind);
    const id2 = framingRuleId(tabId);
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [id2],
      addRules: [
        {
          id: id2,
          priority: 1,
          action: {
            type: "modifyHeaders",
            responseHeaders: [
              {
                header: "x-frame-options",
                operation: "remove"
              },
              {
                header: "content-security-policy",
                operation: "remove"
              }
            ]
          },
          condition: {
            tabIds: [tabId],
            urlFilter: `|${origin}/`,
            resourceTypes: ["sub_frame"]
          }
        }
      ]
    });
  }
  async function endFraming(tabId) {
    framedOrigins.delete(tabId);
    frameAgents.delete(tabId);
    await chrome.declarativeNetRequest.updateSessionRules({
      removeRuleIds: [framingRuleId(tabId), userAgentRuleId(tabId)]
    });
  }
  chrome.tabs.onRemoved.addListener((tabId) => void endFraming(tabId).catch(() => {
  }));
})();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc2hhcmVkL3NyYy9kZXZpY2VzLnRzIiwgIi4uL3NyYy9iYWNrZ3JvdW5kL2Jvb2ttYXJrcy50cyIsICIuLi8uLi9zaGFyZWQvc3JjL3RhcmdldHMudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy92YWxpZGF0ZS50cyIsICIuLi8uLi9zaGFyZWQvc3JjL2h1Yi50cyIsICIuLi8uLi9zaGFyZWQvc3JjL2JyaWRnZS50cyIsICIuLi9zcmMvYmFja2dyb3VuZC9icmlkZ2UudHMiLCAiLi4vLi4vc2hhcmVkL3NyYy9zaG9ydGN1dHMudHMiLCAiLi4vc3JjL3Nob3J0Y3V0cy50cyIsICIuLi9zcmMvYmFja2dyb3VuZC9zaG9ydGN1dFN5bmMudHMiLCAiLi4vc3JjL2JhY2tncm91bmQvaW5kZXgudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIERldmljZSBlbXVsYXRpb24gbW9kZWwsIHNoYXJlZCBieSB0aGUgaG9zdCBhbmQgdGhlIHdlYnZpZXcuXG5cbmV4cG9ydCB0eXBlIFVzZXJBZ2VudEtpbmQgPSAnZGVza3RvcCcgfCAnYW5kcm9pZCcgfCAnaXBob25lJyB8ICdpcGFkJztcblxuZXhwb3J0IGludGVyZmFjZSBEZXZpY2VQcmVzZXQge1xuICBpZDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGdyb3VwOiAnUGhvbmVzJyB8ICdUYWJsZXRzJyB8ICdEZXNrdG9wcycgfCAnQ3VzdG9tJztcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGRwcjogbnVtYmVyO1xuICBtb2JpbGU6IGJvb2xlYW47XG4gIHRvdWNoOiBib29sZWFuO1xuICB1c2VyQWdlbnQ6IFVzZXJBZ2VudEtpbmQ7XG59XG5cbmNvbnN0IHBob25lID0gKFxuICBpZDogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG4gIHdpZHRoOiBudW1iZXIsXG4gIGhlaWdodDogbnVtYmVyLFxuICBkcHI6IG51bWJlcixcbiAgdWE6IFVzZXJBZ2VudEtpbmQsXG4pOiBEZXZpY2VQcmVzZXQgPT4gKHtcbiAgaWQsXG4gIG5hbWUsXG4gIGdyb3VwOiAnUGhvbmVzJyxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgZHByLFxuICBtb2JpbGU6IHRydWUsXG4gIHRvdWNoOiB0cnVlLFxuICB1c2VyQWdlbnQ6IHVhLFxufSk7XG5jb25zdCB0YWJsZXQgPSAoXG4gIGlkOiBzdHJpbmcsXG4gIG5hbWU6IHN0cmluZyxcbiAgd2lkdGg6IG51bWJlcixcbiAgaGVpZ2h0OiBudW1iZXIsXG4gIGRwcjogbnVtYmVyLFxuICB1YTogVXNlckFnZW50S2luZCxcbik6IERldmljZVByZXNldCA9PiAoe1xuICBpZCxcbiAgbmFtZSxcbiAgZ3JvdXA6ICdUYWJsZXRzJyxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgZHByLFxuICBtb2JpbGU6IHRydWUsXG4gIHRvdWNoOiB0cnVlLFxuICB1c2VyQWdlbnQ6IHVhLFxufSk7XG5jb25zdCBkZXNrdG9wID0gKHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyLCBsYWJlbDogc3RyaW5nKTogRGV2aWNlUHJlc2V0ID0+ICh7XG4gIGlkOiBgZGVza3RvcC0ke3dpZHRofXgke2hlaWdodH1gLFxuICBuYW1lOiBgJHtsYWJlbH0gJHt3aWR0aH1cdTAwRDcke2hlaWdodH1gLFxuICBncm91cDogJ0Rlc2t0b3BzJyxcbiAgd2lkdGgsXG4gIGhlaWdodCxcbiAgZHByOiAxLFxuICBtb2JpbGU6IGZhbHNlLFxuICB0b3VjaDogZmFsc2UsXG4gIHVzZXJBZ2VudDogJ2Rlc2t0b3AnLFxufSk7XG5cbmV4cG9ydCBjb25zdCBERVZJQ0VfUFJFU0VUUzogcmVhZG9ubHkgRGV2aWNlUHJlc2V0W10gPSBbXG4gIHBob25lKCdpcGhvbmUtc2UnLCAnaVBob25lIFNFJywgMzc1LCA2NjcsIDIsICdpcGhvbmUnKSxcbiAgcGhvbmUoJ2lwaG9uZS0xNi1wcm8nLCAnaVBob25lIDE2IFBybycsIDQwMiwgODc0LCAzLCAnaXBob25lJyksXG4gIHBob25lKCdpcGhvbmUtMTYtcHJvLW1heCcsICdpUGhvbmUgMTYgUHJvIE1heCcsIDQ0MCwgOTU2LCAzLCAnaXBob25lJyksXG4gIHBob25lKCdwaXhlbC04JywgJ1BpeGVsIDgnLCA0MTIsIDkxNSwgMi42MjUsICdhbmRyb2lkJyksXG4gIHBob25lKCdnYWxheHktczI0JywgJ0dhbGF4eSBTMjQnLCAzNjAsIDc4MCwgMywgJ2FuZHJvaWQnKSxcbiAgdGFibGV0KCdpcGFkLW1pbmknLCAnaVBhZCBNaW5pJywgNzY4LCAxMDI0LCAyLCAnaXBhZCcpLFxuICB0YWJsZXQoJ2lwYWQtcHJvJywgJ2lQYWQgUHJvIDEyLjlcIicsIDEwMjQsIDEzNjYsIDIsICdpcGFkJyksXG4gIHRhYmxldCgnc3VyZmFjZS1wcm8nLCAnU3VyZmFjZSBQcm8gNycsIDkxMiwgMTM2OCwgMiwgJ2Rlc2t0b3AnKSxcbiAgZGVza3RvcCgxMjgwLCA4MDAsICdMYXB0b3AnKSxcbiAgZGVza3RvcCgxMzY2LCA3NjgsICdMYXB0b3AnKSxcbiAgZGVza3RvcCgxNDQwLCA5MDAsICdMYXB0b3AnKSxcbiAgZGVza3RvcCgxOTIwLCAxMDgwLCAnRnVsbCBIRCcpLFxuICBkZXNrdG9wKDI1NjAsIDE0NDAsICdRSEQnKSxcbiAgZGVza3RvcCgzODQwLCAyMTYwLCAnNEsnKSxcbl07XG5cbmV4cG9ydCB0eXBlIE5ldHdvcmtQcmVzZXQgPSAnbm9uZScgfCAnb2ZmbGluZScgfCAnc2xvdzNnJyB8ICdmYXN0M2cnIHwgJ2Zhc3Q0Zyc7XG5cbi8qKiBTYW1lIG51bWJlcnMgYXMgQ2hyb21lIERldlRvb2xzIChieXRlcyBwZXIgc2Vjb25kLCBtaWxsaXNlY29uZHMpLiAqL1xuZXhwb3J0IGNvbnN0IE5FVFdPUktfQ09ORElUSU9OUzogUmVjb3JkPFxuICBOZXR3b3JrUHJlc2V0LFxuICB7IGxhYmVsOiBzdHJpbmc7IG9mZmxpbmU6IGJvb2xlYW47IGxhdGVuY3k6IG51bWJlcjsgZG93bmxvYWQ6IG51bWJlcjsgdXBsb2FkOiBudW1iZXIgfVxuPiA9IHtcbiAgbm9uZTogeyBsYWJlbDogJ05vIHRocm90dGxpbmcnLCBvZmZsaW5lOiBmYWxzZSwgbGF0ZW5jeTogMCwgZG93bmxvYWQ6IC0xLCB1cGxvYWQ6IC0xIH0sXG4gIG9mZmxpbmU6IHsgbGFiZWw6ICdPZmZsaW5lJywgb2ZmbGluZTogdHJ1ZSwgbGF0ZW5jeTogMCwgZG93bmxvYWQ6IDAsIHVwbG9hZDogMCB9LFxuICBzbG93M2c6IHsgbGFiZWw6ICdTbG93IDNHJywgb2ZmbGluZTogZmFsc2UsIGxhdGVuY3k6IDIwMDAsIGRvd25sb2FkOiA1MF8wMDAsIHVwbG9hZDogNTBfMDAwIH0sXG4gIGZhc3QzZzogeyBsYWJlbDogJ0Zhc3QgM0cnLCBvZmZsaW5lOiBmYWxzZSwgbGF0ZW5jeTogNTYyLjUsIGRvd25sb2FkOiAxODBfMDAwLCB1cGxvYWQ6IDg0XzM3NSB9LFxuICBmYXN0NGc6IHsgbGFiZWw6ICdGYXN0IDRHJywgb2ZmbGluZTogZmFsc2UsIGxhdGVuY3k6IDE2NSwgZG93bmxvYWQ6IDFfMDEyXzUwMCwgdXBsb2FkOiAxNjhfNzUwIH0sXG59O1xuXG5leHBvcnQgY29uc3QgQ1BVX1JBVEVTID0gWzEsIDQsIDZdIGFzIGNvbnN0O1xuZXhwb3J0IGNvbnN0IERQUl9PUFRJT05TID0gWzEsIDEuNSwgMiwgMi42MjUsIDNdIGFzIGNvbnN0O1xuZXhwb3J0IGNvbnN0IFNDQUxFX09QVElPTlMgPSBbJ2ZpdCcsIDAuMjUsIDAuNSwgMC43NSwgMSwgMS4yNSwgMS41XSBhcyBjb25zdDtcblxuLyoqIFRoZSBlbXVsYXRlZCBzY3JlZW4uIEFic2VudCBpbiByZXNwb25zaXZlIG1vZGUsIHdoZXJlIHRoZSBwYWdlIGZpbGxzIHRoZSBicm93c2VyIHdpbmRvdy4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGV2aWNlU2V0dGluZ3Mge1xuICBwcmVzZXRJZD86IHN0cmluZztcbiAgd2lkdGg6IG51bWJlcjtcbiAgaGVpZ2h0OiBudW1iZXI7XG4gIGRwcjogbnVtYmVyO1xuICBtb2JpbGU6IGJvb2xlYW47XG4gIHRvdWNoOiBib29sZWFuO1xuICB1c2VyQWdlbnQ6IFVzZXJBZ2VudEtpbmQ7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgRW11bGF0aW9uU2V0dGluZ3Mge1xuICAvKiogV2hldGhlciB0aGUgZGV2aWNlIHRvb2xiYXIgaXMgb24uIFdoZW4gb2ZmLCBub3RoaW5nIGJlbG93IGFwcGxpZXMuICovXG4gIGVuYWJsZWQ6IGJvb2xlYW47XG4gIGRldmljZT86IERldmljZVNldHRpbmdzO1xuICAvKiogSG93IHRoZSBlbXVsYXRlZCBzY3JlZW4gaXMgc2hvd246IHNjYWxlZCB0byBmaXQgdGhlIHdpbmRvdywgb3IgYSBmaXhlZCB6b29tLiAqL1xuICBzY2FsZTogJ2ZpdCcgfCBudW1iZXI7XG4gIG5ldHdvcms6IE5ldHdvcmtQcmVzZXQ7XG4gIGNwdTogbnVtYmVyO1xuICBjb2xvclNjaGVtZTogJ2RlZmF1bHQnIHwgJ2xpZ2h0JyB8ICdkYXJrJztcbiAgcHJpbnQ6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBERUZBVUxUX0VNVUxBVElPTjogRW11bGF0aW9uU2V0dGluZ3MgPSB7XG4gIGVuYWJsZWQ6IGZhbHNlLFxuICBzY2FsZTogJ2ZpdCcsXG4gIG5ldHdvcms6ICdub25lJyxcbiAgY3B1OiAxLFxuICBjb2xvclNjaGVtZTogJ2RlZmF1bHQnLFxuICBwcmludDogZmFsc2UsXG59O1xuXG4vKiogYHByZXNldElkYCBvZiB0aGUgcmVzaXphYmxlIHNjcmVlbiAoQ2hyb21lJ3MgXCJSZXNwb25zaXZlXCIgbW9kZSkuICovXG5leHBvcnQgY29uc3QgUkVTUE9OU0lWRV9JRCA9ICdyZXNwb25zaXZlJztcblxuLyoqIFNwYWNlIGtlcHQgYXJvdW5kIGFuIGVtdWxhdGVkIHNjcmVlbiAocm9vbSBmb3IgdGhlIHJlc2l6ZSBoYW5kbGVzKS4gKi9cbmV4cG9ydCBjb25zdCBERVZJQ0VfTUFSR0lOID0gMjQ7XG5cbi8qKiBXaWR0aHMgb2YgdGhlIGJhbmRzIGFib3ZlIGEgcmVzcG9uc2l2ZSBzY3JlZW4gKENocm9tZSdzIG1lZGlhLXF1ZXJ5IHByZXNldHMpLiAqL1xuZXhwb3J0IGNvbnN0IFJFU1BPTlNJVkVfQlJFQUtQT0lOVFMgPSBbXG4gIHsgbGFiZWw6ICdNb2JpbGUgUycsIHdpZHRoOiAzMjAgfSxcbiAgeyBsYWJlbDogJ01vYmlsZSBNJywgd2lkdGg6IDM3NSB9LFxuICB7IGxhYmVsOiAnTW9iaWxlIEwnLCB3aWR0aDogNDI1IH0sXG4gIHsgbGFiZWw6ICdUYWJsZXQnLCB3aWR0aDogNzY4IH0sXG4gIHsgbGFiZWw6ICdMYXB0b3AnLCB3aWR0aDogMTAyNCB9LFxuICB7IGxhYmVsOiAnTGFwdG9wIEwnLCB3aWR0aDogMTQ0MCB9LFxuICB7IGxhYmVsOiAnNEsnLCB3aWR0aDogMjU2MCB9LFxuXSBhcyBjb25zdDtcblxuLyoqIFNtYWxsZXN0IGFuZCBsYXJnZXN0IGVtdWxhdGVkIHNjcmVlbiBzaXplLCBpbiBDU1MgcGl4ZWxzLiAqL1xuZXhwb3J0IGNvbnN0IE1JTl9ERVZJQ0VfU0laRSA9IDUwO1xuZXhwb3J0IGNvbnN0IE1BWF9ERVZJQ0VfU0laRSA9IDc2ODA7XG5cbi8qKlxuICogQSByZXNwb25zaXZlIHNjcmVlbjogZGVza3RvcCBkZWZhdWx0cywgc2l6ZWQgdG8gZmlsbCB0aGUgcGFnZSBhcmVhIChvciBgc2l6ZWApLCBrZWVwaW5nIHRoZVxuICogcGl4ZWwgcmF0aW8gYW5kIHRvdWNoIHNldHRpbmdzIG9mIGBiYXNlYC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlc3BvbnNpdmVEZXZpY2UoXG4gIGFyZWE6IHsgd2lkdGg6IG51bWJlcjsgaGVpZ2h0OiBudW1iZXIgfSxcbiAgYmFzZT86IERldmljZVNldHRpbmdzLFxuICBzaXplPzogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9LFxuKTogRGV2aWNlU2V0dGluZ3Mge1xuICBjb25zdCBmaXQgPSAodmFsdWU6IG51bWJlciwgZmFsbGJhY2s6IG51bWJlcikgPT5cbiAgICBNYXRoLnJvdW5kKE1hdGgubWluKE1BWF9ERVZJQ0VfU0laRSwgTWF0aC5tYXgoTUlOX0RFVklDRV9TSVpFLCB2YWx1ZSA+IDAgPyB2YWx1ZSA6IGZhbGxiYWNrKSkpO1xuICByZXR1cm4ge1xuICAgIHByZXNldElkOiBSRVNQT05TSVZFX0lELFxuICAgIHdpZHRoOiBmaXQoc2l6ZT8ud2lkdGggPz8gYXJlYS53aWR0aCAtIERFVklDRV9NQVJHSU4gKiAyLCA0MDApLFxuICAgIGhlaWdodDogZml0KHNpemU/LmhlaWdodCA/PyBhcmVhLmhlaWdodCAtIERFVklDRV9NQVJHSU4gKiAyLCA4MDApLFxuICAgIGRwcjogYmFzZT8uZHByID8/IDEsXG4gICAgbW9iaWxlOiBiYXNlPy5tb2JpbGUgPz8gZmFsc2UsXG4gICAgdG91Y2g6IGJhc2U/LnRvdWNoID8/IGZhbHNlLFxuICAgIHVzZXJBZ2VudDogYmFzZT8udXNlckFnZW50ID8/ICdkZXNrdG9wJyxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZXNldFRvRGV2aWNlKHByZXNldDogRGV2aWNlUHJlc2V0KTogRGV2aWNlU2V0dGluZ3Mge1xuICByZXR1cm4ge1xuICAgIHByZXNldElkOiBwcmVzZXQuaWQsXG4gICAgd2lkdGg6IHByZXNldC53aWR0aCxcbiAgICBoZWlnaHQ6IHByZXNldC5oZWlnaHQsXG4gICAgZHByOiBwcmVzZXQuZHByLFxuICAgIG1vYmlsZTogcHJlc2V0Lm1vYmlsZSxcbiAgICB0b3VjaDogcHJlc2V0LnRvdWNoLFxuICAgIHVzZXJBZ2VudDogcHJlc2V0LnVzZXJBZ2VudCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJvdGF0ZShkZXZpY2U6IERldmljZVNldHRpbmdzKTogRGV2aWNlU2V0dGluZ3Mge1xuICByZXR1cm4geyAuLi5kZXZpY2UsIHdpZHRoOiBkZXZpY2UuaGVpZ2h0LCBoZWlnaHQ6IGRldmljZS53aWR0aCB9O1xufVxuXG4vKiogRGlzcGxheSBzY2FsZSBmb3IgYGZpdGA6IGFzIGxhcmdlIGFzIGZpdHMgdGhlIGF2YWlsYWJsZSBhcmVhLCBidXQgbmV2ZXIgYWJvdmUgMTAwJS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXNwbGF5U2NhbGUoXG4gIHNjYWxlOiBFbXVsYXRpb25TZXR0aW5nc1snc2NhbGUnXSxcbiAgZGV2aWNlOiB7IHdpZHRoOiBudW1iZXI7IGhlaWdodDogbnVtYmVyIH0sXG4gIGF2YWlsYWJsZTogeyB3aWR0aDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlciB9LFxuKTogbnVtYmVyIHtcbiAgaWYgKHNjYWxlICE9PSAnZml0JykgcmV0dXJuIHNjYWxlO1xuICBpZiAoIWF2YWlsYWJsZS53aWR0aCB8fCAhYXZhaWxhYmxlLmhlaWdodCkgcmV0dXJuIDE7XG4gIHJldHVybiBNYXRoLm1pbigxLCBhdmFpbGFibGUud2lkdGggLyBkZXZpY2Uud2lkdGgsIGF2YWlsYWJsZS5oZWlnaHQgLyBkZXZpY2UuaGVpZ2h0KTtcbn1cblxuLyoqIFVzZXIgYWdlbnQgc3RyaW5nIGZvciBhIGRldmljZSwgYmFzZWQgb24gdGhlIGVuZ2luZSdzIENocm9tZSB2ZXJzaW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRldmljZVVzZXJBZ2VudChraW5kOiBVc2VyQWdlbnRLaW5kLCBjaHJvbWVWZXJzaW9uOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBtYWpvciA9IGNocm9tZVZlcnNpb24uc3BsaXQoJy4nKVswXSA/PyAnMCc7XG4gIHN3aXRjaCAoa2luZCkge1xuICAgIGNhc2UgJ2FuZHJvaWQnOlxuICAgICAgcmV0dXJuIGBNb3ppbGxhLzUuMCAoTGludXg7IEFuZHJvaWQgMTQ7IFBpeGVsIDgpIEFwcGxlV2ViS2l0LzUzNy4zNiAoS0hUTUwsIGxpa2UgR2Vja28pIENocm9tZS8ke21ham9yfS4wLjAuMCBNb2JpbGUgU2FmYXJpLzUzNy4zNmA7XG4gICAgY2FzZSAnaXBob25lJzpcbiAgICAgIHJldHVybiAnTW96aWxsYS81LjAgKGlQaG9uZTsgQ1BVIGlQaG9uZSBPUyAxOF8wIGxpa2UgTWFjIE9TIFgpIEFwcGxlV2ViS2l0LzYwNS4xLjE1IChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi8xOC4wIE1vYmlsZS8xNUUxNDggU2FmYXJpLzYwNC4xJztcbiAgICBjYXNlICdpcGFkJzpcbiAgICAgIHJldHVybiAnTW96aWxsYS81LjAgKGlQYWQ7IENQVSBPUyAxOF8wIGxpa2UgTWFjIE9TIFgpIEFwcGxlV2ViS2l0LzYwNS4xLjE1IChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi8xOC4wIE1vYmlsZS8xNUUxNDggU2FmYXJpLzYwNC4xJztcbiAgICBjYXNlICdkZXNrdG9wJzpcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn1cblxuY29uc3QgY2xhbXAgPSAodmFsdWU6IHVua25vd24sIG1pbjogbnVtYmVyLCBtYXg6IG51bWJlciwgZmFsbGJhY2s6IG51bWJlcik6IG51bWJlciA9PlxuICB0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmIE51bWJlci5pc0Zpbml0ZSh2YWx1ZSlcbiAgICA/IE1hdGgubWluKG1heCwgTWF0aC5tYXgobWluLCB2YWx1ZSkpXG4gICAgOiBmYWxsYmFjaztcblxuY29uc3QgVVNFUl9BR0VOVFM6IHJlYWRvbmx5IFVzZXJBZ2VudEtpbmRbXSA9IFsnZGVza3RvcCcsICdhbmRyb2lkJywgJ2lwaG9uZScsICdpcGFkJ107XG5cbi8qKiBNYWtlcyB1bnRydXN0ZWQgZW11bGF0aW9uIHNldHRpbmdzIChmcm9tIHRoZSB3ZWJ2aWV3IG9yIHNldHRpbmdzLmpzb24pIHNhZmUgdG8gYXBwbHkuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVFbXVsYXRpb24odmFsdWU6IHVua25vd24pOiBFbXVsYXRpb25TZXR0aW5ncyB7XG4gIGNvbnN0IGlucHV0ID0gKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgIT09IG51bGwgPyB2YWx1ZSA6IHt9KSBhcyBSZWNvcmQ8XG4gICAgc3RyaW5nLFxuICAgIHVua25vd25cbiAgPjtcbiAgY29uc3QgZGV2aWNlID0gaW5wdXQuZGV2aWNlIGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgdW5kZWZpbmVkO1xuICByZXR1cm4ge1xuICAgIGVuYWJsZWQ6IGlucHV0LmVuYWJsZWQgPT09IHRydWUsXG4gICAgZGV2aWNlOlxuICAgICAgdHlwZW9mIGRldmljZSA9PT0gJ29iamVjdCcgJiYgZGV2aWNlICE9PSBudWxsXG4gICAgICAgID8ge1xuICAgICAgICAgICAgcHJlc2V0SWQ6XG4gICAgICAgICAgICAgIHR5cGVvZiBkZXZpY2UucHJlc2V0SWQgPT09ICdzdHJpbmcnID8gZGV2aWNlLnByZXNldElkLnNsaWNlKDAsIDY0KSA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgIHdpZHRoOiBNYXRoLnJvdW5kKGNsYW1wKGRldmljZS53aWR0aCwgNTAsIDc2ODAsIDQwMCkpLFxuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLnJvdW5kKGNsYW1wKGRldmljZS5oZWlnaHQsIDUwLCA3NjgwLCA4MDApKSxcbiAgICAgICAgICAgIGRwcjogY2xhbXAoZGV2aWNlLmRwciwgMC41LCA0LCAxKSxcbiAgICAgICAgICAgIG1vYmlsZTogZGV2aWNlLm1vYmlsZSA9PT0gdHJ1ZSxcbiAgICAgICAgICAgIHRvdWNoOiBkZXZpY2UudG91Y2ggPT09IHRydWUsXG4gICAgICAgICAgICB1c2VyQWdlbnQ6IFVTRVJfQUdFTlRTLmluY2x1ZGVzKGRldmljZS51c2VyQWdlbnQgYXMgVXNlckFnZW50S2luZClcbiAgICAgICAgICAgICAgPyAoZGV2aWNlLnVzZXJBZ2VudCBhcyBVc2VyQWdlbnRLaW5kKVxuICAgICAgICAgICAgICA6ICdkZXNrdG9wJyxcbiAgICAgICAgICB9XG4gICAgICAgIDogdW5kZWZpbmVkLFxuICAgIHNjYWxlOiBpbnB1dC5zY2FsZSA9PT0gJ2ZpdCcgPyAnZml0JyA6IGNsYW1wKGlucHV0LnNjYWxlLCAwLjEsIDQsIDEpLFxuICAgIG5ldHdvcms6IE9iamVjdC5oYXNPd24oTkVUV09SS19DT05ESVRJT05TLCBTdHJpbmcoaW5wdXQubmV0d29yaykpXG4gICAgICA/IChpbnB1dC5uZXR3b3JrIGFzIE5ldHdvcmtQcmVzZXQpXG4gICAgICA6ICdub25lJyxcbiAgICBjcHU6IGNsYW1wKGlucHV0LmNwdSwgMSwgMjAsIDEpLFxuICAgIGNvbG9yU2NoZW1lOlxuICAgICAgaW5wdXQuY29sb3JTY2hlbWUgPT09ICdsaWdodCcgfHwgaW5wdXQuY29sb3JTY2hlbWUgPT09ICdkYXJrJyA/IGlucHV0LmNvbG9yU2NoZW1lIDogJ2RlZmF1bHQnLFxuICAgIHByaW50OiBpbnB1dC5wcmludCA9PT0gdHJ1ZSxcbiAgfTtcbn1cblxuLyoqIEN1c3RvbSBkZXZpY2VzIGZyb20gdGhlIGB2c2NvZGVCcm93c2VyLmRldmljZXMuY3VzdG9tYCBzZXR0aW5nLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGN1c3RvbVByZXNldHModmFsdWU6IHVua25vd24pOiBEZXZpY2VQcmVzZXRbXSB7XG4gIGlmICghQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHJldHVybiBbXTtcbiAgcmV0dXJuIHZhbHVlLmZsYXRNYXAoKGVudHJ5OiB1bmtub3duLCBpbmRleCkgPT4ge1xuICAgIGlmICh0eXBlb2YgZW50cnkgIT09ICdvYmplY3QnIHx8IGVudHJ5ID09PSBudWxsKSByZXR1cm4gW107XG4gICAgY29uc3QgcmF3ID0gZW50cnkgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gICAgY29uc3QgZGV2aWNlID0gc2FuaXRpemVFbXVsYXRpb24oeyBkZXZpY2U6IHJhdyB9KS5kZXZpY2UhO1xuICAgIGNvbnN0IG5hbWUgPVxuICAgICAgdHlwZW9mIHJhdy5uYW1lID09PSAnc3RyaW5nJyAmJiByYXcubmFtZS50cmltKCkgPyByYXcubmFtZS50cmltKCkgOiBgQ3VzdG9tICR7aW5kZXggKyAxfWA7XG4gICAgcmV0dXJuIFt7IC4uLmRldmljZSwgaWQ6IGBjdXN0b20tJHtpbmRleH1gLCBuYW1lLCBncm91cDogJ0N1c3RvbScgYXMgY29uc3QgfV07XG4gIH0pO1xufVxuIiwgIi8vIFRoZSBicm93c2VyIGhhbGYgb2YgYm9va21hcmsgc3luYzogcmVhZHMgdGhlIGJvb2ttYXJrIHRyZWUgYXMgYSBmbGF0IGxpc3Qgd2l0aCBgYmFyYC9gb3RoZXJgXG4vLyByb290cywgYW5kIGFwcGxpZXMgdGhlIG9wZXJhdGlvbnMgVlMgQ29kZSBjb21wdXRlcyAoc2VlIEBpbmtzcGVjdC9zaGFyZWQvYm9va21hcmtTeW5jKS5cbmltcG9ydCB0eXBlIHsgRmxhdE5vZGUsIFJlbW90ZU9wIH0gZnJvbSAnQGlua3NwZWN0L3NoYXJlZC9ib29rbWFya1N5bmMnO1xuXG50eXBlIFRyZWVOb2RlID0gY2hyb21lLmJvb2ttYXJrcy5Cb29rbWFya1RyZWVOb2RlICYge1xuICAvKiogQ2hyb21lIDEzNCs6IHdoaWNoIGtpbmQgb2Ygcm9vdCB0aGlzIGlzLCBhbmQgd2hldGhlciBpdCBzeW5jcyB3aXRoIHRoZSBHb29nbGUgYWNjb3VudC4gKi9cbiAgZm9sZGVyVHlwZT86IHN0cmluZztcbiAgc3luY2luZz86IGJvb2xlYW47XG4gIC8qKiBGaXJlZm94OiAnYm9va21hcmsnIHwgJ2ZvbGRlcicgfCAnc2VwYXJhdG9yJy4gKi9cbiAgdHlwZT86IHN0cmluZztcbn07XG5cbi8qKlxuICogVGhlIHR3byBzeW5jZWQgcm9vdHMuIFNpZ25lZC1pbiBDaHJvbWUgaGFzIGFjY291bnQgcm9vdHMgKHdoaWNoIHN5bmMgdG8gdGhlIEdvb2dsZSBhY2NvdW50KVxuICogbmV4dCB0byBsb2NhbCBvbmVzOyB0aGUgYWNjb3VudCdzIGFyZSBwcmVmZXJyZWQgc28gYm9va21hcmtzIGFsc28gcmVhY2ggb3RoZXIgZGV2aWNlcy5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHN5bmNSb290cygpOiBQcm9taXNlPHsgYmFyOiBzdHJpbmc7IG90aGVyOiBzdHJpbmcgfT4ge1xuICBjb25zdCBbcm9vdF0gPSAoYXdhaXQgY2hyb21lLmJvb2ttYXJrcy5nZXRUcmVlKCkpIGFzIFRyZWVOb2RlW107XG4gIGNvbnN0IGtpZHMgPSAocm9vdD8uY2hpbGRyZW4gPz8gW10pIGFzIFRyZWVOb2RlW107XG4gIGNvbnN0IGZpbmQgPSAoZm9sZGVyVHlwZTogc3RyaW5nLCBmYWxsYmFja3M6IHN0cmluZ1tdKSA9PiB7XG4gICAgY29uc3QgdHlwZWQgPSBraWRzLmZpbHRlcigoaykgPT4gay5mb2xkZXJUeXBlID09PSBmb2xkZXJUeXBlKTtcbiAgICByZXR1cm4gKFxuICAgICAgdHlwZWQuZmluZCgoaykgPT4gay5zeW5jaW5nKSA/P1xuICAgICAgdHlwZWRbMF0gPz9cbiAgICAgIGtpZHMuZmluZCgoaykgPT4gZmFsbGJhY2tzLmluY2x1ZGVzKGsuaWQpKSA/P1xuICAgICAgdW5kZWZpbmVkXG4gICAgKTtcbiAgfTtcbiAgY29uc3QgYmFyID0gZmluZCgnYm9va21hcmtzLWJhcicsIFsnMScsICd0b29sYmFyX19fX18nXSkgPz8ga2lkc1swXTtcbiAgY29uc3Qgb3RoZXIgPSBmaW5kKCdvdGhlcicsIFsnMicsICd1bmZpbGVkX19fX18nXSkgPz8ga2lkc1sxXSA/PyBraWRzWzBdO1xuICBpZiAoIWJhciB8fCAhb3RoZXIpIHRocm93IG5ldyBFcnJvcignTm8gYm9va21hcmsgZm9sZGVycyBmb3VuZCcpO1xuICByZXR1cm4geyBiYXI6IGJhci5pZCwgb3RoZXI6IG90aGVyLmlkIH07XG59XG5cbi8qKiBUaGUgc3luY2VkIHBhcnQgb2YgdGhlIGJvb2ttYXJrIHRyZWUgYXMgYSBmbGF0IGxpc3QuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc25hcHNob3QoKTogUHJvbWlzZTxGbGF0Tm9kZVtdPiB7XG4gIGNvbnN0IHJvb3RzID0gYXdhaXQgc3luY1Jvb3RzKCk7XG4gIGNvbnN0IG91dDogRmxhdE5vZGVbXSA9IFtdO1xuICBjb25zdCB2aXNpdCA9IChwYXJlbnRJZDogc3RyaW5nLCBjaGlsZHJlbjogVHJlZU5vZGVbXSkgPT4ge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBjaGlsZHJlbikge1xuICAgICAgaWYgKGNoaWxkLnR5cGUgPT09ICdzZXBhcmF0b3InKSBjb250aW51ZTtcbiAgICAgIG91dC5wdXNoKHtcbiAgICAgICAgaWQ6IGNoaWxkLmlkLFxuICAgICAgICBwYXJlbnRJZCxcbiAgICAgICAgaW5kZXg6IGluZGV4KyssXG4gICAgICAgIHRpdGxlOiBjaGlsZC50aXRsZSxcbiAgICAgICAgLi4uKGNoaWxkLnVybCAhPT0gdW5kZWZpbmVkID8geyB1cmw6IGNoaWxkLnVybCB9IDoge30pLFxuICAgICAgfSk7XG4gICAgICBpZiAoY2hpbGQudXJsID09PSB1bmRlZmluZWQpIHZpc2l0KGNoaWxkLmlkLCAoY2hpbGQuY2hpbGRyZW4gPz8gW10pIGFzIFRyZWVOb2RlW10pO1xuICAgIH1cbiAgfTtcbiAgZm9yIChjb25zdCBbcm9vdElkLCByZWFsSWRdIG9mIFtcbiAgICBbJ2JhcicsIHJvb3RzLmJhcl0sXG4gICAgWydvdGhlcicsIHJvb3RzLm90aGVyXSxcbiAgXSBhcyBjb25zdCkge1xuICAgIGNvbnN0IFtub2RlXSA9IChhd2FpdCBjaHJvbWUuYm9va21hcmtzLmdldFN1YlRyZWUocmVhbElkKSkgYXMgVHJlZU5vZGVbXTtcbiAgICB2aXNpdChyb290SWQsIChub2RlPy5jaGlsZHJlbiA/PyBbXSkgYXMgVHJlZU5vZGVbXSk7XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cblxuLyoqXG4gKiBBcHBsaWVzIFZTIENvZGUncyBvcGVyYXRpb25zLiBSZXR1cm5zIHRoZSBpZHMgb2YgY3JlYXRlZCBub2RlcyBieSBgcmVmYCBhbmQgdGhlIG9wZXJhdGlvbnNcbiAqIHRoYXQgZmFpbGVkIChhIGxhdGVyIHN5bmMgY29ycmVjdHMgYW55IGRpZmZlcmVuY2UpLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYXBwbHlPcHMoXG4gIG9wczogUmVtb3RlT3BbXSxcbik6IFByb21pc2U8eyBjcmVhdGVkOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+OyBmYWlsZWQ6IHN0cmluZ1tdIH0+IHtcbiAgY29uc3Qgcm9vdHMgPSBhd2FpdCBzeW5jUm9vdHMoKTtcbiAgY29uc3QgY3JlYXRlZDogUmVjb3JkPHN0cmluZywgc3RyaW5nPiA9IHt9O1xuICBjb25zdCBmYWlsZWQ6IHN0cmluZ1tdID0gW107XG4gIGNvbnN0IHJlc29sdmUgPSAoaWQ6IHN0cmluZykgPT5cbiAgICBpZCA9PT0gJ2JhcidcbiAgICAgID8gcm9vdHMuYmFyXG4gICAgICA6IGlkID09PSAnb3RoZXInXG4gICAgICAgID8gcm9vdHMub3RoZXJcbiAgICAgICAgOiBpZC5zdGFydHNXaXRoKCdyZWY6JylcbiAgICAgICAgICA/IGNyZWF0ZWRbaWQuc2xpY2UoNCldXG4gICAgICAgICAgOiBpZDtcbiAgZm9yIChjb25zdCBvcCBvZiBvcHMpIHtcbiAgICB0cnkge1xuICAgICAgaWYgKG9wLm9wID09PSAnY3JlYXRlJykge1xuICAgICAgICBjb25zdCBwYXJlbnRJZCA9IHJlc29sdmUob3AucGFyZW50SWQpO1xuICAgICAgICBpZiAoIXBhcmVudElkKSB0aHJvdyBuZXcgRXJyb3IoJ3BhcmVudCBtaXNzaW5nJyk7XG4gICAgICAgIGNvbnN0IG5vZGUgPSBhd2FpdCBjaHJvbWUuYm9va21hcmtzLmNyZWF0ZSh7XG4gICAgICAgICAgcGFyZW50SWQsXG4gICAgICAgICAgaW5kZXg6IG9wLmluZGV4LFxuICAgICAgICAgIHRpdGxlOiBvcC50aXRsZSxcbiAgICAgICAgICB1cmw6IG9wLnVybCxcbiAgICAgICAgfSk7XG4gICAgICAgIGNyZWF0ZWRbb3AucmVmXSA9IG5vZGUuaWQ7XG4gICAgICB9IGVsc2UgaWYgKG9wLm9wID09PSAndXBkYXRlJykge1xuICAgICAgICBhd2FpdCBjaHJvbWUuYm9va21hcmtzLnVwZGF0ZShcbiAgICAgICAgICBvcC5pZCxcbiAgICAgICAgICBvcC51cmwgIT09IHVuZGVmaW5lZCA/IHsgdGl0bGU6IG9wLnRpdGxlLCB1cmw6IG9wLnVybCB9IDogeyB0aXRsZTogb3AudGl0bGUgfSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSBpZiAob3Aub3AgPT09ICdtb3ZlJykge1xuICAgICAgICBjb25zdCBwYXJlbnRJZCA9IHJlc29sdmUob3AucGFyZW50SWQpO1xuICAgICAgICBpZiAoIXBhcmVudElkKSB0aHJvdyBuZXcgRXJyb3IoJ3BhcmVudCBtaXNzaW5nJyk7XG4gICAgICAgIGNvbnN0IFtub2RlXSA9IGF3YWl0IGNocm9tZS5ib29rbWFya3MuZ2V0KG9wLmlkKTtcbiAgICAgICAgbGV0IGluZGV4ID0gb3AuaW5kZXg7XG4gICAgICAgIC8vIENocm9taXVtIGNvdW50cyB0aGUgdGFyZ2V0IGluZGV4IGJlZm9yZSB0YWtpbmcgdGhlIG5vZGUgb3V0IG9mIHRoZSBzYW1lIGZvbGRlci5cbiAgICAgICAgaWYgKF9fQlJPV1NFUl9fID09PSAnY2hyb21lJyAmJiBub2RlPy5wYXJlbnRJZCA9PT0gcGFyZW50SWQgJiYgKG5vZGUuaW5kZXggPz8gMCkgPCBpbmRleClcbiAgICAgICAgICBpbmRleCsrO1xuICAgICAgICBhd2FpdCBjaHJvbWUuYm9va21hcmtzLm1vdmUob3AuaWQsIHsgcGFyZW50SWQsIGluZGV4IH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYXdhaXQgY2hyb21lLmJvb2ttYXJrcy5yZW1vdmVUcmVlKG9wLmlkKS5jYXRjaCgoKSA9PiBjaHJvbWUuYm9va21hcmtzLnJlbW92ZShvcC5pZCkpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBmYWlsZWQucHVzaChgJHtvcC5vcH06ICR7ZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiBTdHJpbmcoZXJyb3IpfWApO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBjcmVhdGVkLCBmYWlsZWQgfTtcbn1cbiIsICIvLyBXaGVyZSBhIHNlbmQgZ29lcywgYXMgb25lIGlkIGdyYW1tYXIgZXZlcnkgcGFydCBvZiBJbmtzcGVjdCB1bmRlcnN0YW5kczpcbi8vICAgdG11eDo8c29ja2V0Pjo8cGFuZT4gICAgICAgIGFuIGFnZW50IGluIGEgdG11eCBwYW5lIChhZ2VudG11eCB0aHJlYWRzKVxuLy8gICB2c2NvZGU6PHdpbmRvdz46PHRhcmdldD4gICAgYW4gYWdlbnQgaW4gYSBWUyBDb2RlIHdpbmRvdydzIHRlcm1pbmFsLCBvciBpdHMgY2hhdFxuLy8gICB0ZXJtaW5hbDo8bj4gfCBjaGF0ICAgICAgICAgdGhlIHNhbWUsIGluc2lkZSB0aGF0IHdpbmRvdyAoVlMgQ29kZSdzIG93biBpZHMpXG4vLyAgIGFnZW50bXV4Om5ldzo8aGFybmVzcz4gICAgICBhIG5ldyBhZ2VudG11eCB0aHJlYWQgcnVubmluZyB0aGF0IGFnZW50XG4vLyAgIGRlZmF1bHQgICAgICAgICAgICAgICAgICAgICB0aGUgcHJvamVjdCdzIGRlZmF1bHQgdGFyZ2V0XG4vLyBQdXJlLCBzbyBib3RoIHByb2R1Y3RzIGFuZCB0aGUgaHViIGNhbiBzaGFyZSBpdC5cblxuLyoqIHRtdXggc29ja2V0IG5hbWVzOiBwbGFpbiBuYW1lcyBvbmx5ICh0aGV5IGJlY29tZSBhbiBhcmd1bWVudCkuICovXG5leHBvcnQgY29uc3QgVE1VWF9TT0NLRVQgPSAvXltcXHcuLV17MSw2NH0kLztcbi8qKiB0bXV4IHBhbmUgaWRzLiAqL1xuZXhwb3J0IGNvbnN0IFRNVVhfUEFORSA9IC9eJVxcZHsxLDl9JC87XG5cbi8qKiBBZ2VudCBDTElzIGFnZW50bXV4IGNhbiBzdGFydCBhIHRocmVhZCB3aXRoLiAqL1xuZXhwb3J0IGNvbnN0IEhBUk5FU1NFUyA9IFsnY2xhdWRlJywgJ2NvZGV4JywgJ29wZW5jb2RlJywgJ2FneSddIGFzIGNvbnN0O1xuZXhwb3J0IHR5cGUgSGFybmVzcyA9ICh0eXBlb2YgSEFSTkVTU0VTKVtudW1iZXJdO1xuXG4vKiogQSBWUyBDb2RlIHdpbmRvdydzIG93biB0YXJnZXQ6IGEgdGVybWluYWwgYWdlbnQsIG9yIGNoYXQuICovXG5jb25zdCBMT0NBTCA9IC9eKHRlcm1pbmFsOlxcZHsxLDl9fGNoYXQpJC87XG5jb25zdCBXSU5ET1cgPSAvXltcXHcuLV17MSw2NH0kLztcblxuZXhwb3J0IHR5cGUgUGFyc2VkVGFyZ2V0ID1cbiAgfCB7IGtpbmQ6ICd0bXV4Jzsgc29ja2V0OiBzdHJpbmc7IHBhbmU6IHN0cmluZyB9XG4gIHwgeyBraW5kOiAndnNjb2RlJzsgd2luZG93OiBzdHJpbmc7IHRhcmdldDogc3RyaW5nIH1cbiAgfCB7IGtpbmQ6ICdsb2NhbCc7IHRhcmdldDogc3RyaW5nIH1cbiAgfCB7IGtpbmQ6ICdhZ2VudG11eC1uZXcnOyBoYXJuZXNzOiBIYXJuZXNzIH1cbiAgfCB7IGtpbmQ6ICdkZWZhdWx0JyB9O1xuXG4vKiogQSB0YXJnZXQgaWQncyBwYXJ0cywgb3IgdW5kZWZpbmVkIGZvciBhbnl0aGluZyB0aGF0IGlzbid0IG9uZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRhcmdldElkKGlkOiBzdHJpbmcpOiBQYXJzZWRUYXJnZXQgfCB1bmRlZmluZWQge1xuICBpZiAoaWQgPT09ICdkZWZhdWx0JykgcmV0dXJuIHsga2luZDogJ2RlZmF1bHQnIH07XG4gIGlmIChMT0NBTC50ZXN0KGlkKSkgcmV0dXJuIHsga2luZDogJ2xvY2FsJywgdGFyZ2V0OiBpZCB9O1xuICBjb25zdCB0bXV4ID0gL150bXV4OihbXjpdKyk6KCVcXGQrKSQvLmV4ZWMoaWQpO1xuICBpZiAodG11eCAmJiBUTVVYX1NPQ0tFVC50ZXN0KHRtdXhbMV0hKSAmJiBUTVVYX1BBTkUudGVzdCh0bXV4WzJdISkpIHtcbiAgICByZXR1cm4geyBraW5kOiAndG11eCcsIHNvY2tldDogdG11eFsxXSEsIHBhbmU6IHRtdXhbMl0hIH07XG4gIH1cbiAgY29uc3QgdnNjb2RlID0gL152c2NvZGU6KFteOl0rKTooLispJC8uZXhlYyhpZCk7XG4gIGlmICh2c2NvZGUgJiYgV0lORE9XLnRlc3QodnNjb2RlWzFdISkgJiYgTE9DQUwudGVzdCh2c2NvZGVbMl0hKSkge1xuICAgIHJldHVybiB7IGtpbmQ6ICd2c2NvZGUnLCB3aW5kb3c6IHZzY29kZVsxXSEsIHRhcmdldDogdnNjb2RlWzJdISB9O1xuICB9XG4gIGNvbnN0IGFnZW50bXV4ID0gL15hZ2VudG11eDpuZXc6KFxcdyspJC8uZXhlYyhpZCk7XG4gIGlmIChhZ2VudG11eCAmJiAoSEFSTkVTU0VTIGFzIHJlYWRvbmx5IHN0cmluZ1tdKS5pbmNsdWRlcyhhZ2VudG11eFsxXSEpKSB7XG4gICAgcmV0dXJuIHsga2luZDogJ2FnZW50bXV4LW5ldycsIGhhcm5lc3M6IGFnZW50bXV4WzFdIGFzIEhhcm5lc3MgfTtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY29uc3QgdG11eFRhcmdldCA9IChzb2NrZXQ6IHN0cmluZywgcGFuZTogc3RyaW5nKSA9PiBgdG11eDoke3NvY2tldH06JHtwYW5lfWA7XG5leHBvcnQgY29uc3QgdnNjb2RlVGFyZ2V0ID0gKHdpbmRvdzogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZykgPT4gYHZzY29kZToke3dpbmRvd306JHt0YXJnZXR9YDtcbmV4cG9ydCBjb25zdCBhZ2VudG11eE5ld1RhcmdldCA9IChoYXJuZXNzOiBIYXJuZXNzKSA9PiBgYWdlbnRtdXg6bmV3OiR7aGFybmVzc31gO1xuXG4vKiogQWdlbnQgbmFtZXMgZm9yIGEgaGFybmVzcywgYXMgdGhlIHNlbmQgbW9kYWwgc2hvd3MgdGhlbS4gKi9cbmV4cG9ydCBjb25zdCBIQVJORVNTX0xBQkVMUzogUmVjb3JkPEhhcm5lc3MsIHN0cmluZz4gPSB7XG4gIGNsYXVkZTogJ0NsYXVkZSBDb2RlJyxcbiAgY29kZXg6ICdDb2RleCcsXG4gIG9wZW5jb2RlOiAnb3BlbmNvZGUnLFxuICBhZ3k6ICdBbnRpZ3Jhdml0eScsXG59O1xuIiwgIi8vIFNtYWxsIGNvbXBvc2FibGUgY2hlY2tzIGZvciBtZXNzYWdlcyB0aGF0IGNyb3NzIGEgdHJ1c3QgYm91bmRhcnkgKHRoZSBicm93c2VyIGxpbmssIHRoZVxuLy8gbG9jYWwgaHViKS4gRWFjaCBwcm90b2NvbCBkZXNjcmliZXMgaXRzIG1lc3NhZ2VzIGFzIHRhYmxlcyBvZiB0aGVzZSBhbmQgZHJvcHMgYW55dGhpbmcgZWxzZS5cblxuLyoqIFdoZXRoZXIgYSB2YWx1ZSBwYXNzZXMgYSBjaGVjay4gKi9cbmV4cG9ydCB0eXBlIENoZWNrID0gKHZhbHVlOiB1bmtub3duKSA9PiBib29sZWFuO1xuXG5leHBvcnQgY29uc3QgaXNTdHJpbmc6IENoZWNrID0gKHYpID0+IHR5cGVvZiB2ID09PSAnc3RyaW5nJztcbmV4cG9ydCBjb25zdCBpc051bWJlcjogQ2hlY2sgPSAodikgPT4gdHlwZW9mIHYgPT09ICdudW1iZXInICYmIE51bWJlci5pc0Zpbml0ZSh2KTtcbmV4cG9ydCBjb25zdCBpc0Jvb2xlYW46IENoZWNrID0gKHYpID0+IHR5cGVvZiB2ID09PSAnYm9vbGVhbic7XG5cbi8qKiBBIHN0cmluZyBvZiBhdCBtb3N0IGBtYXhgIGNoYXJhY3RlcnMuICovXG5leHBvcnQgY29uc3Qgc2hvcnRTdHJpbmcgPVxuICAobWF4OiBudW1iZXIpOiBDaGVjayA9PlxuICAodikgPT5cbiAgICB0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdi5sZW5ndGggPD0gbWF4O1xuXG4vKiogQSBzdHJpbmcgbWF0Y2hpbmcgYHBhdHRlcm5gIChhbmNob3IgaXQgeW91cnNlbGYpLiAqL1xuZXhwb3J0IGNvbnN0IG1hdGNoZXMgPVxuICAocGF0dGVybjogUmVnRXhwKTogQ2hlY2sgPT5cbiAgKHYpID0+XG4gICAgdHlwZW9mIHYgPT09ICdzdHJpbmcnICYmIHBhdHRlcm4udGVzdCh2KTtcblxuZXhwb3J0IGNvbnN0IG9wdGlvbmFsID1cbiAgKGNoZWNrOiBDaGVjayk6IENoZWNrID0+XG4gICh2KSA9PlxuICAgIHYgPT09IHVuZGVmaW5lZCB8fCBjaGVjayh2KTtcblxuZXhwb3J0IGNvbnN0IG9uZU9mID1cbiAgKC4uLnZhbHVlczogc3RyaW5nW10pOiBDaGVjayA9PlxuICAodikgPT5cbiAgICB0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdmFsdWVzLmluY2x1ZGVzKHYpO1xuXG5leHBvcnQgY29uc3QgaXNSZWNvcmQgPSAodjogdW5rbm93bik6IHYgaXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPT5cbiAgdHlwZW9mIHYgPT09ICdvYmplY3QnICYmIHYgIT09IG51bGwgJiYgIUFycmF5LmlzQXJyYXkodik7XG5cbi8qKiBBbiBvYmplY3Qgd2hvc2UgbGlzdGVkIGZpZWxkcyBwYXNzIHRoZWlyIGNoZWNrcyAob3RoZXIgZmllbGRzIGFyZSBhbGxvd2VkKS4gKi9cbmV4cG9ydCBjb25zdCBzaGFwZSA9XG4gIChmaWVsZHM6IFJlY29yZDxzdHJpbmcsIENoZWNrPik6IENoZWNrID0+XG4gICh2KSA9PlxuICAgIGlzUmVjb3JkKHYpICYmIE9iamVjdC5lbnRyaWVzKGZpZWxkcykuZXZlcnkoKFtrLCBjaGVja10pID0+IGNoZWNrKHZba10pKTtcblxuZXhwb3J0IGNvbnN0IGFycmF5T2YgPVxuICAoY2hlY2s6IENoZWNrLCBtYXggPSAxMDBfMDAwKTogQ2hlY2sgPT5cbiAgKHYpID0+XG4gICAgQXJyYXkuaXNBcnJheSh2KSAmJiB2Lmxlbmd0aCA8PSBtYXggJiYgdi5ldmVyeShjaGVjayk7XG5cbi8qKiBBbiBvYmplY3Qgd2hvc2UgdmFsdWVzIGFyZSBhbGwgc3RyaW5ncy4gKi9cbmV4cG9ydCBjb25zdCBzdHJpbmdNYXA6IENoZWNrID0gKHYpID0+XG4gIGlzUmVjb3JkKHYpICYmIE9iamVjdC52YWx1ZXModikuZXZlcnkoKHZhbHVlKSA9PiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKTtcblxuLyoqXG4gKiBQYXJzZXMgb25lIG1lc3NhZ2Ugb2YgYSB2ZXJzaW9uZWQgcHJvdG9jb2w6IEpTT04gd2l0aCBgdmAgZXF1YWwgdG8gYHZlcnNpb25gIGFuZCBhIGB0eXBlYCBmcm9tXG4gKiBgdGFibGVgLCB3aG9zZSBmaWVsZHMgcGFzcyB0aGF0IHR5cGUncyBjaGVja3MuIFVuZGVmaW5lZCBmb3IgYW55dGhpbmcgZWxzZS4gYHZgIGlzIHJlbW92ZWQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1lc3NhZ2U8VCBleHRlbmRzIHsgdHlwZTogc3RyaW5nIH0+KFxuICByYXc6IHN0cmluZyB8IHVua25vd24sXG4gIHRhYmxlOiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBDaGVjaz4+LFxuICB2ZXJzaW9uOiBudW1iZXIsXG4pOiBUIHwgdW5kZWZpbmVkIHtcbiAgbGV0IHZhbHVlOiB1bmtub3duID0gcmF3O1xuICBpZiAodHlwZW9mIHJhdyA9PT0gJ3N0cmluZycpIHtcbiAgICB0cnkge1xuICAgICAgdmFsdWUgPSBKU09OLnBhcnNlKHJhdyk7XG4gICAgfSBjYXRjaCB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBpZiAoIWlzUmVjb3JkKHZhbHVlKSB8fCB2YWx1ZS52ICE9PSB2ZXJzaW9uIHx8IHR5cGVvZiB2YWx1ZS50eXBlICE9PSAnc3RyaW5nJykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgaWYgKCFPYmplY3QuaGFzT3duKHRhYmxlLCB2YWx1ZS50eXBlKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY29uc3QgZmllbGRzID0gdGFibGVbdmFsdWUudHlwZV07XG4gIGlmICghZmllbGRzIHx8ICFzaGFwZShmaWVsZHMpKHZhbHVlKSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY29uc3QgeyB2OiBfdmVyc2lvbiwgLi4ubWVzc2FnZSB9ID0gdmFsdWU7XG4gIHJldHVybiBtZXNzYWdlIGFzIFQ7XG59XG4iLCAiLy8gVGhlIGxvY2FsIElua3NwZWN0IGh1Yjogb25lIHByb2Nlc3MgcGVyIHVzZXIgdGhhdCBicm93c2VycyByZWFjaCB0aHJvdWdoIG5hdGl2ZSBtZXNzYWdpbmcgYW5kXG4vLyBWUyBDb2RlIHdpbmRvd3MgdGhyb3VnaCBhIHByaXZhdGUgVW5peCBzb2NrZXQuIEV2ZXJ5IGZyYW1lIGlzIGEgdWludDMyIGxpdHRsZS1lbmRpYW4gbGVuZ3RoIGFuZFxuLy8gVVRGLTggSlNPTiB3aXRoIHRoZSBwcm90b2NvbCB2ZXJzaW9uIGB2YDsgZXZlcnkgZW5kIHZhbGlkYXRlcyB3aGF0IGl0IHJlY2VpdmVzIHdpdGggdGhlIHBhcnNlcnNcbi8vIGJlbG93IGFuZCBkcm9wcyBhbnl0aGluZyBlbHNlLlxuLy9cbi8vIFRoZSBicm93c2VyIGxpbmsgKC4vYnJpZGdlKSB0cmF2ZWxzIGluc2lkZSBgbGlua2AgZnJhbWVzOiB0aGUgYnJvd3NlciBleHRlbnNpb24gc3BlYWtzIHRoZSBzYW1lXG4vLyBwcm90b2NvbCB0byBWUyBDb2RlIGFzIG92ZXIgdGhlIFdlYlNvY2tldCwgYW5kIHRoZSBodWIgZm9yd2FyZHMgaXQgdG8gdGhlIGxlYWRlciB3aW5kb3cuXG5pbXBvcnQgeyBIQVJORVNTRVMsIHR5cGUgSGFybmVzcyB9IGZyb20gJy4vdGFyZ2V0cyc7XG5pbXBvcnQgdHlwZSB7IENoZWNrIH0gZnJvbSAnLi92YWxpZGF0ZSc7XG5pbXBvcnQge1xuICBpc0Jvb2xlYW4sXG4gIGlzTnVtYmVyLFxuICBtYXRjaGVzLFxuICBvbmVPZixcbiAgb3B0aW9uYWwsXG4gIHBhcnNlTWVzc2FnZSxcbiAgc2hhcGUsXG4gIHNob3J0U3RyaW5nLFxuICBhcnJheU9mLFxufSBmcm9tICcuL3ZhbGlkYXRlJztcblxuZXhwb3J0IGNvbnN0IEhVQl9WRVJTSU9OID0gMTtcblxuLyoqXG4gKiBXaGF0IGEgaHViIGFuc3dlcnMgYmV5b25kIHRoZSBmaXJzdCB2ZXJzaW9uLCBpbiBpdHMgYHN0YXR1c2AgKGEgbmV3ZXIgYnJvd3NlciBidWlsZCBtYXkgbWVldFxuICogYW4gb2xkZXIgaHViIHVudGlsIFZTIENvZGUgcmVwbGFjZXMgaXQpOiBtb3ZpbmcgYW5kIHJlc3RvcmluZyBpdGVtcywgc2VuZHMgdGhhdCBzaG93IHRoZVxuICogYWdlbnRtdXggdGhyZWFkLCBuZXcgYWdlbnRtdXggdGhyZWFkcywgYSBwcm9tcHQgd3JpdHRlbiB3aXRoIHRoZSBzZW5kLlxuICovXG5leHBvcnQgY29uc3QgSFVCX0ZFQVRVUkVTID0gW1xuICAnaXRlbXMubW92ZScsXG4gICdpdGVtLnJlc3RvcmUnLFxuICAnc2VuZC5vcGVuJyxcbiAgJ2FnZW50bXV4Lm5ldycsXG4gICdzZW5kLnByb21wdCcsXG4gICdpdGVtcy5ncm91cCcsXG4gICdpdGVtLmNvbnRlbnQnLFxuICAnYWdlbnRtdXguc3RhcnQnLFxuXSBhcyBjb25zdDtcbi8qKlxuICogSG93IG11Y2ggb2YgYW4gaXRlbSBgaXRlbS5jb250ZW50YCByZXR1cm5zIGF0IGEgdGltZTogYnJvd3NlcnMgdGFrZSBhdCBtb3N0IDEgTUIgcGVyIG1lc3NhZ2VcbiAqIGZyb20gdGhlaXIgbmF0aXZlIG1lc3NhZ2luZyBob3N0LCBhbmQgYmFzZTY0IGFkZHMgYSB0aGlyZC5cbiAqL1xuZXhwb3J0IGNvbnN0IENPTlRFTlRfU0xJQ0UgPSA1MTIgKiAxMDI0O1xuLyoqIFdoYXQgYGl0ZW0uY29udGVudGAgYW5zd2VyczogYW4gaXRlbSdzIHRleHQgKFVURi04KSBvciBpdHMgcGljdHVyZS4gKi9cbmV4cG9ydCBjb25zdCBDT05URU5UX1RZUEVTID0gWyd0ZXh0L3BsYWluJywgJ2ltYWdlL3BuZycsICdpbWFnZS9qcGVnJ10gYXMgY29uc3Q7XG5leHBvcnQgdHlwZSBDb250ZW50VHlwZSA9ICh0eXBlb2YgQ09OVEVOVF9UWVBFUylbbnVtYmVyXTtcbi8qKiBUaGUgbG9uZ2VzdCBwcm9tcHQgdGhlIHNlbmQgZGlhbG9nIHNlbmRzIHdpdGggdGhlIGNhcHR1cmVzLiAqL1xuZXhwb3J0IGNvbnN0IE1BWF9QUk9NUFQgPSA4MDAwO1xuLyoqIFRoZSBuYXRpdmUgbWVzc2FnaW5nIGhvc3QncyBuYW1lLCBhcyBicm93c2VycyBrbm93IGl0LiAqL1xuZXhwb3J0IGNvbnN0IEhVQl9IT1NUX05BTUUgPSAnZGV2Lmlua3NwZWN0Lmh1Yic7XG4vKipcbiAqIFRoZSBDaHJvbWUgZXh0ZW5zaW9uJ3MgaWQsIGZpeGVkIGJ5IHRoZSBwdWJsaWMgYGtleWAgaW4gYnJvd3Nlci1leHRlbnNpb24vbWFuaWZlc3QvY2hyb21lLmpzb25cbiAqIChhIHRlc3QgY2hlY2tzIHRoZXkgbWF0Y2gpLCBzbyB0aGUgbmF0aXZlIGhvc3QgY2FuIGFsbG93IGV4YWN0bHkgdGhpcyBleHRlbnNpb24uXG4gKi9cbmV4cG9ydCBjb25zdCBDSFJPTUVfRVhURU5TSU9OX0lEID0gJ3BwaGlkZGFnZmVwZWxiamNta2Fub2JvY2VhY29jcGFrJztcbi8qKiBGaXJlZm94J3MgaWQgZm9yIHRoZSBleHRlbnNpb24gKGJyb3dzZXJfc3BlY2lmaWNfc2V0dGluZ3MuZ2Vja28uaWQpLiAqL1xuZXhwb3J0IGNvbnN0IEZJUkVGT1hfRVhURU5TSU9OX0lEID0gJ2lua3NwZWN0QGlua3NwZWN0LmRldic7XG4vKiogQnJvd3NlcnMgZHJvcCBuYXRpdmUgbWVzc2FnZXMgdG8gdGhlIGV4dGVuc2lvbiBhYm92ZSAxIE1pQi4gKi9cbmV4cG9ydCBjb25zdCBNQVhfVE9fQlJPV1NFUiA9IDEwMjQgKiAxMDI0O1xuLyoqIFRoZSBsYXJnZXN0IGZyYW1lIGFueSBlbmQgYWNjZXB0cy4gKi9cbmV4cG9ydCBjb25zdCBNQVhfRlJBTUUgPSA2NCAqIDEwMjQgKiAxMDI0O1xuXG4vKiogQSBjb25uZWN0aW9uJ3Mgcm9sZSwgc2FpZCBpbiBpdHMgZmlyc3QgZnJhbWUuICovXG5leHBvcnQgdHlwZSBIdWJSb2xlID0gJ2Jyb3dzZXInIHwgJ3ZzY29kZSc7XG5cbi8qKiBBIGJyb3dzZXIgY29ubmVjdGVkIHRvIHRoZSBodWIsIGFzIFZTIENvZGUgd2luZG93cyBzZWUgaXQuICovXG5leHBvcnQgaW50ZXJmYWNlIEh1YkJyb3dzZXIge1xuICAvKiogVGhlIGh1YidzIGlkIGZvciB0aGUgY29ubmVjdGlvbi4gKi9cbiAgaWQ6IHN0cmluZztcbiAgLyoqIFwiR29vZ2xlIENocm9tZVwiLCBcIkZpcmVmb3hcIi4uLiAoZnJvbSB0aGUgYnJvd3NlcidzIGhlbGxvKS4gKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogVGhlIGV4dGVuc2lvbidzIG9yaWdpbiB0aGUgYnJvd3NlciBsYXVuY2hlZCB0aGUgaG9zdCBmb3IuICovXG4gIG9yaWdpbjogc3RyaW5nO1xufVxuXG4vKiogV2hhdCBhIFZTIENvZGUgd2luZG93IHRlbGxzIHRoZSBodWIgYWJvdXQgaXRzZWxmLiAqL1xuZXhwb3J0IGludGVyZmFjZSBIdWJXaW5kb3cge1xuICBpZDogc3RyaW5nO1xuICAvKiogSXRzIHdvcmtzcGFjZSdzIG5hbWUuICovXG4gIG5hbWU6IHN0cmluZztcbiAgLyoqIEl0cyBsb2NhbCB3b3Jrc3BhY2UgZm9sZGVycyAoYWJzb2x1dGUsIHJlYWwgcGF0aHMpLiAqL1xuICBmb2xkZXJzOiBzdHJpbmdbXTtcbiAgLyoqIFdoZW4gaXQgbGFzdCBoYWQgZm9jdXMgKG1zIHNpbmNlIHRoZSBlcG9jaCkuICovXG4gIGZvY3VzZWRBdDogbnVtYmVyO1xuICAvKiogQWdlbnRzIGluIGl0cyB0ZXJtaW5hbHMsIGFuZCBpdHMgY2hhdCAoaWRzIGxvY2FsIHRvIHRoZSB3aW5kb3cpLiAqL1xuICB0YXJnZXRzPzogSHViVGFyZ2V0W107XG59XG5cbi8qKiBXaGF0IGFuIGl0ZW0gaW4gYSBwcm9qZWN0J3MgYC5pbmtzcGVjdC9gIGlzICh0aGUgU2F2ZWQgbGlzdCdzIGtpbmRzKS4gKi9cbmV4cG9ydCB0eXBlIEl0ZW1LaW5kID1cbiAgfCAnZWxlbWVudCdcbiAgfCAnc2NyZWVuc2hvdCdcbiAgfCAncmVjb3JkaW5nJ1xuICB8ICdlcnJvcnMnXG4gIHwgJ25ldHdvcmsnXG4gIHwgJ3BhZ2UnXG4gIHwgJ3JlcG9ydCdcbiAgfCAnY3NzJ1xuICB8ICdtZWFzdXJlJ1xuICB8ICdjb2xvcidcbiAgfCAndGV4dCc7XG5cbmV4cG9ydCBjb25zdCBJVEVNX0tJTkRTOiByZWFkb25seSBJdGVtS2luZFtdID0gW1xuICAnZWxlbWVudCcsXG4gICdzY3JlZW5zaG90JyxcbiAgJ3JlY29yZGluZycsXG4gICdlcnJvcnMnLFxuICAnbmV0d29yaycsXG4gICdwYWdlJyxcbiAgJ3JlcG9ydCcsXG4gICdjc3MnLFxuICAnbWVhc3VyZScsXG4gICdjb2xvcicsXG4gICd0ZXh0Jyxcbl07XG5cbi8qKiBJdGVtIGlkczogd2hlbiBpdCB3YXMgY2FwdHVyZWQgKFVUQykgYW5kIGEgcmFuZG9tIHBhcnQuIFRoZXkgc29ydCBieSB0aW1lLiAqL1xuZXhwb3J0IGNvbnN0IElURU1fSUQgPSAvXlxcZHs4fS1cXGR7Nn0tWzAtOWEtZl17Nn0kLztcblxuLyoqIEEgZmlsZSBuYW1lIGluc2lkZSBhbiBpdGVtJ3MgZm9sZGVyIChuZXZlciBhIHBhdGgpLiAqL1xuZXhwb3J0IGNvbnN0IElURU1fRklMRSA9IC9eW1xcdy1dezEsNDB9XFwuW2EtejAtOV17MSw1fSQvO1xuXG4vKipcbiAqIE9uZSBjYXB0dXJlIHNhdmVkIGluIGEgcHJvamVjdCwgYXMgYC5pbmtzcGVjdC9pdGVtcy88aWQ+L2l0ZW0uanNvbmAuIEl0cyBmaWxlcyBsaXZlIGluIHRoZVxuICogc2FtZSBmb2xkZXI7IGBmaWxlc2AgbmFtZXMgdGhlbSAobmFtZXMgb25seSwgc28gYW4gaXRlbSBjYW4ndCBwb2ludCBvdXRzaWRlIGl0cyBmb2xkZXIpLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIEl0ZW1NZXRhIHtcbiAgdjogMTtcbiAgaWQ6IHN0cmluZztcbiAga2luZDogSXRlbUtpbmQ7XG4gIHRpdGxlOiBzdHJpbmc7XG4gIGRldGFpbD86IHN0cmluZztcbiAgLyoqIFRoZSBwYWdlIGl0IGNhbWUgZnJvbS4gKi9cbiAgdXJsPzogc3RyaW5nO1xuICAvKiogV2hlbiBpdCB3YXMgY2FwdHVyZWQgKG1zIHNpbmNlIHRoZSBlcG9jaCkuICovXG4gIHRpbWU6IG51bWJlcjtcbiAgLyoqIENhcHR1cmVzIG1hZGUgdG9nZXRoZXIgc2hhcmUgYSBncm91cCwgaW4gYGdyb3VwSW5kZXhgIG9yZGVyLiAqL1xuICBncm91cD86IHN0cmluZztcbiAgZ3JvdXBJbmRleD86IG51bWJlcjtcbiAgLyoqIENhcHR1cmVzIHdpdGggdGhlIHNhbWUga2V5IHJlcGxhY2UgZWFjaCBvdGhlciAodGhlIGNvbnNvbGUgZXJyb3JzIG9mIG9uZSBwYWdlKS4gKi9cbiAga2V5Pzogc3RyaW5nO1xuICAvKiogV2hlcmUgaXQgd2FzIGNhcHR1cmVkLiAqL1xuICBzb3VyY2U6ICdicm93c2VyJyB8ICd2c2NvZGUnO1xuICAvKiogVGhlIGJyb3dzZXIncyBuYW1lLCBmb3IgYnJvd3NlciBjYXB0dXJlcy4gKi9cbiAgYnJvd3Nlcj86IHN0cmluZztcbiAgLyoqIFRoZSBzdGFydCBvZiB0aGUgdGV4dCwgZm9yIGxpc3RzLiAqL1xuICBwcmV2aWV3Pzogc3RyaW5nO1xuICBmaWxlczoge1xuICAgIC8qKiBUaGUgaW1hZ2Ugb3IgcmVjb3JkaW5nLiAqL1xuICAgIGZpbGU/OiBzdHJpbmc7XG4gICAgLyoqIFRoZSB0ZXh0IHNlbnQgdG8gdGhlIGFnZW50IChNYXJrZG93bikuICovXG4gICAgdGV4dD86IHN0cmluZztcbiAgICAvKiogQSBzbWFsbCBKUEVHIGZvciBsaXN0cy4gKi9cbiAgICB0aHVtYj86IHN0cmluZztcbiAgfTtcbiAgLyoqIEFnZW50cyBpdCB3YXMgc2VudCB0by4gKi9cbiAgc2VudFRvOiBzdHJpbmdbXTtcbn1cblxuLyoqXG4gKiBBIHBsYWNlIGEgc2VuZCBnb2VzOiBhbiBhZ2VudCBpbiBhbiBhZ2VudG11eCAodG11eCkgcGFuZSwgYW4gYWdlbnQgaW4gYSBWUyBDb2RlIHRlcm1pbmFsLCBvclxuICogVlMgQ29kZSBjaGF0LiBJZHM6IGB0bXV4Ojxzb2NrZXQ+OjxwYW5lPmAsIGB2c2NvZGU6PHdpbmRvdz46PHRlcm1pbmFsIGlkIG9yIGNoYXQ+YC5cbiAqL1xuZXhwb3J0IGludGVyZmFjZSBIdWJUYXJnZXQge1xuICBpZDogc3RyaW5nO1xuICBraW5kOiAndG11eCcgfCAndGVybWluYWwnIHwgJ2NoYXQnO1xuICAvKiogVGhlIGFnZW50OiBcIkNsYXVkZSBDb2RlXCIsIFwiQ29kZXhcIi4uLiAob3IgXCJWUyBDb2RlIGNoYXRcIikuICovXG4gIGxhYmVsOiBzdHJpbmc7XG4gIC8qKiBXaGVyZSBpdCBydW5zOiBcImFnZW50bXV4IFx1MDBCNyBpbmtzcGVjdFx1MDBCNzFcIiwgXCJWUyBDb2RlIHRlcm1pbmFsIFx1MDBCNyB6c2hcIi4uLiAqL1xuICBkZXRhaWw6IHN0cmluZztcbiAgLyoqXG4gICAqIGFnZW50bXV4IGlzbid0IG9wZW4gKG5vIHdpbmRvdyBzaG93cyBpdHMgdGhyZWFkcyk6IGEgcGFzdGUgd291bGQgbGFuZCB1bnNlZW4sIHNvIGEgc2VuZCB0b1xuICAgKiBpdCBvcGVucyBhZ2VudG11eCBmaXJzdCwgYW5kIHRoZSBkZWZhdWx0IGdvZXMgdG8gYW4gb3BlbiB0YXJnZXQuXG4gICAqL1xuICBjbG9zZWQ/OiBib29sZWFuO1xufVxuXG4vKiogQSBmb2xkZXIgSW5rc3BlY3Qga25vd3MgYXMgYSBwcm9qZWN0LCBhbmQgd2h5LiAqL1xuZXhwb3J0IGludGVyZmFjZSBQcm9qZWN0IHtcbiAgLyoqIEFic29sdXRlIHJlYWwgcGF0aC4gKi9cbiAgcGF0aDogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIC8qKiBPcGVuIGluIGEgVlMgQ29kZSB3aW5kb3cuICovXG4gIHZzY29kZTogYm9vbGVhbjtcbiAgLyoqIEhhcyBhZ2VudG11eCB0aHJlYWRzICh0bXV4IHNlc3Npb25zIHdpdGggdGhpcyBAcHJvamVjdCkuICovXG4gIGFnZW50bXV4OiBib29sZWFuO1xuICAvKiogSGFzIGEgYC5pbmtzcGVjdC9gIGZvbGRlci4gKi9cbiAgc2F2ZWQ6IGJvb2xlYW47XG4gIHBpbm5lZDogYm9vbGVhbjtcbiAgLyoqIFdoZXJlIGl0cyBzZW5kcyBjYW4gZ28gKGVtcHR5IHdoZW4gbm90aGluZyBydW5zIHRoZXJlKS4gKi9cbiAgdGFyZ2V0cz86IEh1YlRhcmdldFtdO1xuICAvKiogV2hlcmUgU2VuZCBnb2VzOiB0aGUgdGFyZ2V0IHVzZWQgbGFzdCwgZWxzZSB0aGUgYWdlbnQgYmVzaWRlIGl0cyBWUyBDb2RlIHdpbmRvdy4uLiAqL1xuICBkZWZhdWx0VGFyZ2V0Pzogc3RyaW5nO1xuICAvKiogQWdlbnRzIGEgbmV3IGFnZW50bXV4IHRocmVhZCBjYW4gcnVuIGhlcmUgKG9ubHkgZm9yIHByb2plY3RzIG9wZW4gaW4gYWdlbnRtdXgpLiAqL1xuICBoYXJuZXNzZXM/OiBIYXJuZXNzW107XG4gIC8qKiBUaGUgSW5ib3g6IHdoZXJlIGNhcHR1cmVzIGdvIHdoZW4gbm8gcHJvamVjdCBmaXRzICh0aGV5IGNhbiBiZSBtb3ZlZCBsYXRlcikuICovXG4gIGluYm94PzogYm9vbGVhbjtcbn1cblxuLyoqIFNvbWV0aGluZyBpbiB0aGUgcHJvamVjdCBjYW4gcmVjZWl2ZSBhIHNlbmQgKGEgVlMgQ29kZSB3aW5kb3cgb3IgYW4gYWdlbnQgaXMgdGhlcmUpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzTGl2ZShwcm9qZWN0OiBQcm9qZWN0KTogYm9vbGVhbiB7XG4gIHJldHVybiBwcm9qZWN0LnZzY29kZSB8fCBwcm9qZWN0LmFnZW50bXV4O1xufVxuXG4vKiogT25lIGNhcHR1cmUgdGhlIGJyb3dzZXIgc2F2ZXMgaW50byBhIHByb2plY3QuICovXG5leHBvcnQgaW50ZXJmYWNlIENhcHR1cmVUb1NhdmUge1xuICBraW5kOiBJdGVtS2luZDtcbiAgdGl0bGU6IHN0cmluZztcbiAgZGV0YWlsPzogc3RyaW5nO1xuICB0ZXh0Pzogc3RyaW5nO1xuICBncm91cD86IHN0cmluZztcbiAgZ3JvdXBJbmRleD86IG51bWJlcjtcbiAgLyoqIFBORyBhcyBiYXNlNjQgKG5vIGRhdGE6IHByZWZpeCkuICovXG4gIGltYWdlPzogc3RyaW5nO1xuICAvKiogQSBzbWFsbCBKUEVHIGFzIGJhc2U2NCwgZm9yIGxpc3RzLiAqL1xuICB0aHVtYj86IHN0cmluZztcbn1cblxuLyoqIFRoZSBmaXJzdCBmcmFtZSBvbiBldmVyeSBjb25uZWN0aW9uOiB0aGUgaHViJ3MgdG9rZW4gKHRoZSBzaGltIHJlYWRzIGl0LCBuZXZlciB0aGUgYnJvd3NlcikuICovXG5leHBvcnQgaW50ZXJmYWNlIEh1YkF1dGgge1xuICB0eXBlOiAnYXV0aCc7XG4gIHRva2VuOiBzdHJpbmc7XG4gIHJvbGU6IEh1YlJvbGU7XG4gIC8qKiBCcm93c2VyczogdGhlIGV4dGVuc2lvbiBvcmlnaW4gdGhlIGJyb3dzZXIgcGFzc2VkIHRvIHRoZSBob3N0LiAqL1xuICBvcmlnaW4/OiBzdHJpbmc7XG59XG5cbmV4cG9ydCB0eXBlIEJyb3dzZXJUb0h1YiA9XG4gIC8qKiBBIGJyaWRnZSBDbGllbnRNZXNzYWdlIGZvciBWUyBDb2RlLCBlbmNvZGVkIHdpdGggdGhlIGJyaWRnZSdzIGBlbmNvZGVgLiAqL1xuICB8IHsgdHlwZTogJ2xpbmsnOyBkYXRhOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ3BpbmcnIH1cbiAgLyoqIFRoZSBwcm9qZWN0cywgYW5kIHRoZSBvbmUgYSBjYXB0dXJlIG9mIGB1cmxgIG1vc3QgbGlrZWx5IGJlbG9uZ3MgdG8uICovXG4gIHwgeyB0eXBlOiAncHJvamVjdHMuZ2V0JzsgcmVxOiBzdHJpbmc7IHVybD86IHN0cmluZyB9XG4gIC8qKiBTYXZlcyBjYXB0dXJlcyBpbnRvIGEgcHJvamVjdCdzIGAuaW5rc3BlY3QvYDsgd2l0aCBgc2VuZGAsIHNlbmRzIHRoZW0gdG9vLiAqL1xuICB8IHtcbiAgICAgIHR5cGU6ICdjYXB0dXJlLnNhdmUnO1xuICAgICAgcmVxOiBzdHJpbmc7XG4gICAgICBwcm9qZWN0OiBzdHJpbmc7XG4gICAgICB1cmw/OiBzdHJpbmc7XG4gICAgICBicm93c2VyPzogc3RyaW5nO1xuICAgICAgY2FwdHVyZXM6IENhcHR1cmVUb1NhdmVbXTtcbiAgICAgIC8qKiBBIHRhcmdldCBpZCwgb3IgJ2RlZmF1bHQnIGZvciB0aGUgcHJvamVjdCdzIGRlZmF1bHQgdGFyZ2V0LiAqL1xuICAgICAgc2VuZD86IHN0cmluZztcbiAgICB9XG4gIC8qKlxuICAgKiBTZW5kcyBzYXZlZCBpdGVtcyBvZiBhIHByb2plY3QgdG8gYSB0YXJnZXQgKCdkZWZhdWx0JyBvciB1bnNldDogaXRzIGRlZmF1bHQgdGFyZ2V0KTtcbiAgICogYG9wZW5gIGFsc28gc2hvd3MgdGhlIGFnZW50bXV4IHRocmVhZCBhbmQgYnJpbmdzIGl0IHRvIHRoZSBmcm9udDsgYHByb21wdGAgZ29lcyBmaXJzdC5cbiAgICovXG4gIHwge1xuICAgICAgdHlwZTogJ2l0ZW0uc2VuZCc7XG4gICAgICByZXE6IHN0cmluZztcbiAgICAgIHByb2plY3Q6IHN0cmluZztcbiAgICAgIGlkczogc3RyaW5nW107XG4gICAgICB0YXJnZXQ/OiBzdHJpbmc7XG4gICAgICBvcGVuPzogYm9vbGVhbjtcbiAgICAgIHByb21wdD86IHN0cmluZztcbiAgICB9XG4gIC8qKiBNb3ZlcyBzYXZlZCBpdGVtcyB0byBhbm90aGVyIHByb2plY3QgKHRoZSBjYXB0dXJlIHdhcyBzYXZlZCBpbiB0aGUgd3Jvbmcgb25lKS4gKi9cbiAgfCB7IHR5cGU6ICdpdGVtcy5tb3ZlJzsgcmVxOiBzdHJpbmc7IHByb2plY3Q6IHN0cmluZzsgaWRzOiBzdHJpbmdbXTsgdG86IHN0cmluZyB9XG4gIC8qKiBBIHByb2plY3QncyBzYXZlZCBpdGVtcywgbmV3ZXN0IGZpcnN0ICh0aGUgc2lkZSBwYW5lbCkuICovXG4gIHwgeyB0eXBlOiAnaXRlbXMuZ2V0JzsgcmVxOiBzdHJpbmc7IHByb2plY3Q6IHN0cmluZyB9XG4gIC8qKiBBbiBpdGVtJ3MgdGh1bWJuYWlsIChpdHMgc21hbGwgSlBFRywgZWxzZSBhIHNtYWxsIGVub3VnaCBpbWFnZSkuICovXG4gIHwgeyB0eXBlOiAnaXRlbS50aHVtYic7IHJlcTogc3RyaW5nOyBwcm9qZWN0OiBzdHJpbmc7IGlkOiBzdHJpbmcgfVxuICAvKiogTW92ZXMgaXRlbXMgdG8gdGhlIHByb2plY3QncyB0cmFzaC4gKi9cbiAgfCB7IHR5cGU6ICdpdGVtLnJlbW92ZSc7IHJlcTogc3RyaW5nOyBwcm9qZWN0OiBzdHJpbmc7IGlkczogc3RyaW5nW10gfVxuICAvKiogUHV0cyBiYWNrIGl0ZW1zIHJlbW92ZWQgYSBtb21lbnQgYWdvICh0aGV5IHdhaXQgaW4gdGhlIHN0b3JlJ3MgdHJhc2gpLiAqL1xuICB8IHsgdHlwZTogJ2l0ZW0ucmVzdG9yZSc7IHJlcTogc3RyaW5nOyBwcm9qZWN0OiBzdHJpbmc7IGlkczogc3RyaW5nW10gfVxuICAvKipcbiAgICogV2hhdCBDb3B5IHB1dHMgb24gdGhlIGNsaXBib2FyZCAoYXMgVlMgQ29kZSdzIENvcHkgZG9lcyk6IHRoZSBpdGVtJ3MgcGljdHVyZSwgZWxzZSBpdHMgdGV4dDtcbiAgICogYENPTlRFTlRfU0xJQ0VgIGJ5dGVzIGZyb20gYG9mZnNldGAuXG4gICAqL1xuICB8IHsgdHlwZTogJ2l0ZW0uY29udGVudCc7IHJlcTogc3RyaW5nOyBwcm9qZWN0OiBzdHJpbmc7IGlkOiBzdHJpbmc7IG9mZnNldDogbnVtYmVyIH1cbiAgLyoqIFN0YXJ0cyBhIG5ldyBhZ2VudG11eCB0aHJlYWQgaW4gYSBwcm9qZWN0LCBzZW5kaW5nIG5vdGhpbmcgKGl0IHRoZW4gbGlzdHMgYXMgYSB0YXJnZXQpLiAqL1xuICB8IHsgdHlwZTogJ2FnZW50bXV4LnN0YXJ0JzsgcmVxOiBzdHJpbmc7IHByb2plY3Q6IHN0cmluZzsgaGFybmVzczogSGFybmVzcyB9XG4gIC8qKiBTaG93cyBpdGVtcyBhcyBvbmUgZ3JvdXAsIHNlbnQgdG9nZXRoZXIgKGFzIFZTIENvZGUncyBHcm91cCBkb2VzKS4gKi9cbiAgfCB7IHR5cGU6ICdpdGVtcy5ncm91cCc7IHJlcTogc3RyaW5nOyBwcm9qZWN0OiBzdHJpbmc7IGlkczogc3RyaW5nW10gfVxuICAvKiogU3BsaXRzIGEgZ3JvdXAgYmFjayBpbnRvIHNpbmdsZSBpdGVtcy4gKi9cbiAgfCB7IHR5cGU6ICdpdGVtcy51bmdyb3VwJzsgcmVxOiBzdHJpbmc7IHByb2plY3Q6IHN0cmluZzsgZ3JvdXA6IHN0cmluZyB9XG4gIC8qKiBLZWVwcyBhIHByb2plY3QgaW4gdGhlIGxpc3QgZXZlbiB3aGVuIG5vdGhpbmcgaXMgb3BlbiB0aGVyZS4gKi9cbiAgfCB7IHR5cGU6ICdwcm9qZWN0LnBpbic7IHJlcTogc3RyaW5nOyBwcm9qZWN0OiBzdHJpbmc7IHBpbm5lZDogYm9vbGVhbiB9O1xuXG5leHBvcnQgdHlwZSBIdWJUb0Jyb3dzZXIgPVxuICAvKiogQSBicmlkZ2UgU2VydmVyTWVzc2FnZSBmcm9tIFZTIENvZGUuICovXG4gIHwgeyB0eXBlOiAnbGluayc7IGRhdGE6IHN0cmluZyB9XG4gIC8qKiBXaGV0aGVyIGEgVlMgQ29kZSB3aW5kb3cgYW5zd2VycyBmb3IgdGhlIGxpbms7IGBwZWVyYCBuYW1lcyBpdC4gKi9cbiAgLyoqIGBmZWF0dXJlc2A6IHdoYXQgdGhpcyBodWIgYW5zd2VycyBiZXlvbmQgdGhlIGZpcnN0IHZlcnNpb24gKHNlZSBIVUJfRkVBVFVSRVMpLiAqL1xuICB8IHsgdHlwZTogJ3N0YXR1cyc7IHZzY29kZTogYm9vbGVhbjsgcGVlcj86IHN0cmluZzsgZmVhdHVyZXM/OiBzdHJpbmdbXSB9XG4gIC8qKiBUaGUgd2luZG93IGFuc3dlcmluZyBmb3IgdGhlIGxpbmsgY2hhbmdlZDogc2F5IGhlbGxvIGFnYWluLiAqL1xuICB8IHsgdHlwZTogJ3JlbGluaycgfVxuICB8IHsgdHlwZTogJ3BvbmcnIH1cbiAgfCB7IHR5cGU6ICdwcm9qZWN0cyc7IHJlcTogc3RyaW5nOyBwcm9qZWN0czogUHJvamVjdFtdOyBzdWdnZXN0ZWQ/OiBzdHJpbmcgfVxuICB8IHtcbiAgICAgIHR5cGU6ICdjYXB0dXJlLnNhdmVkJztcbiAgICAgIHJlcTogc3RyaW5nO1xuICAgICAgb2s6IGJvb2xlYW47XG4gICAgICBpZHM/OiBzdHJpbmdbXTtcbiAgICAgIGVycm9yPzogc3RyaW5nO1xuICAgICAgLyoqIFRoZSBhZ2VudCBpdCB3YXMgc2VudCB0bywgd2hlbiB0aGUgc2F2ZSBhbHNvIHNlbnQgaXQuICovXG4gICAgICBzZW50VG8/OiBzdHJpbmc7XG4gICAgfVxuICB8IHsgdHlwZTogJ2l0ZW0uc2VudCc7IHJlcTogc3RyaW5nOyBvazogYm9vbGVhbjsgc2VudFRvPzogc3RyaW5nOyBlcnJvcj86IHN0cmluZyB9XG4gIHwgeyB0eXBlOiAnaXRlbXMnOyByZXE6IHN0cmluZzsgb2s6IGJvb2xlYW47IGl0ZW1zOiBJdGVtTWV0YVtdOyBlcnJvcj86IHN0cmluZyB9XG4gIC8qKiBUaGUgdGhyZWFkIGBhZ2VudG11eC5zdGFydGAgc3RhcnRlZDogaXRzIHRhcmdldCBpZC4gKi9cbiAgfCB7IHR5cGU6ICdzdGFydGVkJzsgcmVxOiBzdHJpbmc7IG9rOiBib29sZWFuOyB0YXJnZXQ/OiBzdHJpbmc7IGVycm9yPzogc3RyaW5nIH1cbiAgLyoqIEEgc2xpY2Ugb2YgYW4gaXRlbSdzIGNvbnRlbnQgKGJhc2U2NCk7IGBzaXplYCBpcyB0aGUgd2hvbGUgY29udGVudCdzLCBpbiBieXRlcy4gKi9cbiAgfCB7XG4gICAgICB0eXBlOiAnY29udGVudCc7XG4gICAgICByZXE6IHN0cmluZztcbiAgICAgIG9rOiBib29sZWFuO1xuICAgICAgbWltZVR5cGU/OiBDb250ZW50VHlwZTtcbiAgICAgIHNpemU/OiBudW1iZXI7XG4gICAgICBkYXRhPzogc3RyaW5nO1xuICAgICAgZXJyb3I/OiBzdHJpbmc7XG4gICAgfVxuICAvKiogYGRhdGFgOiBiYXNlNjQsIG9yIG1pc3Npbmcgd2hlbiB0aGUgaXRlbSBoYXMgbm8gcGljdHVyZSBzbWFsbCBlbm91Z2guICovXG4gIHwgeyB0eXBlOiAndGh1bWInOyByZXE6IHN0cmluZzsgZGF0YT86IHN0cmluZzsgbWltZVR5cGU/OiBzdHJpbmcgfVxuICAvKiogVGhlIGFuc3dlciB0byBgaXRlbS5yZW1vdmVgLCBgaXRlbS5yZXN0b3JlYCwgYGl0ZW1zLm1vdmVgLCBgaXRlbXMuZ3JvdXBgLCBgaXRlbXMudW5ncm91cGBcbiAgICAgIGFuZCBgcHJvamVjdC5waW5gLiAqL1xuICB8IHsgdHlwZTogJ2RvbmUnOyByZXE6IHN0cmluZzsgb2s6IGJvb2xlYW47IGVycm9yPzogc3RyaW5nIH07XG5cbmV4cG9ydCB0eXBlIFZzQ29kZVRvSHViID1cbiAgfCAoeyB0eXBlOiAnd2luZG93JyB9ICYgSHViV2luZG93KVxuICAvKiogQSBicmlkZ2UgU2VydmVyTWVzc2FnZSBmb3Igb25lIGJyb3dzZXIuICovXG4gIHwgeyB0eXBlOiAnbGluayc7IGJyb3dzZXI6IHN0cmluZzsgZGF0YTogc3RyaW5nIH1cbiAgLyoqIEEgbmV3ZXIgaHViIGlzIGluc3RhbGxlZDogdGhlIHJ1bm5pbmcgb25lIHNob3VsZCBleGl0IHNvIGl0IGNhbiBzdGFydC4gKi9cbiAgfCB7IHR5cGU6ICdzaHV0ZG93bicgfVxuICB8IHsgdHlwZTogJ3BpbmcnIH1cbiAgLyoqIFRoZSBhbnN3ZXIgdG8gYSBgcnVuLnNlbmRgLiAqL1xuICB8IHsgdHlwZTogJ3J1bi5zZW50JzsgcmVxOiBzdHJpbmc7IG9rOiBib29sZWFuOyBzZW50VG8/OiBzdHJpbmc7IGVycm9yPzogc3RyaW5nIH07XG5cbmV4cG9ydCB0eXBlIEh1YlRvVnNDb2RlID1cbiAgLyoqIGBidWlsZGAgaWRlbnRpZmllcyB0aGUgcnVubmluZyBodWIncyBjb2RlOyBgbGVhZGVyYDogdGhpcyB3aW5kb3cgYW5zd2VycyBmb3IgdGhlIGxpbmsuICovXG4gIHwgeyB0eXBlOiAnd2VsY29tZSc7IGJ1aWxkOiBzdHJpbmc7IGxlYWRlcjogYm9vbGVhbiB9XG4gIHwgeyB0eXBlOiAnbGVhZGVyJzsgbGVhZGVyOiBib29sZWFuIH1cbiAgLyoqIEJyb3dzZXJzIGNvbm5lY3RlZCB0aHJvdWdoIHRoZSBodWIuICovXG4gIHwgeyB0eXBlOiAnYnJvd3NlcnMnOyBicm93c2VyczogSHViQnJvd3NlcltdIH1cbiAgLyoqIEEgYnJpZGdlIENsaWVudE1lc3NhZ2UgZnJvbSBhIGJyb3dzZXIgKHNlbnQgdG8gdGhlIGxlYWRlciBvbmx5KS4gKi9cbiAgfCB7IHR5cGU6ICdsaW5rJzsgYnJvd3Nlcjogc3RyaW5nOyBkYXRhOiBzdHJpbmcgfVxuICAvKiogQSBicm93c2VyIHdlbnQgYXdheS4gKi9cbiAgfCB7IHR5cGU6ICdnb25lJzsgYnJvd3Nlcjogc3RyaW5nIH1cbiAgfCB7IHR5cGU6ICdwb25nJyB9XG4gIC8qKiBTZW5kIHRoZXNlIGl0ZW1zIG9mIGEgcHJvamVjdCB0byBvbmUgb2YgdGhpcyB3aW5kb3cncyB0YXJnZXRzIChhIHRlcm1pbmFsIGFnZW50LCBjaGF0KS4gKi9cbiAgfCB7XG4gICAgICB0eXBlOiAncnVuLnNlbmQnO1xuICAgICAgcmVxOiBzdHJpbmc7XG4gICAgICBwcm9qZWN0OiBzdHJpbmc7XG4gICAgICBpZHM6IHN0cmluZ1tdO1xuICAgICAgdGFyZ2V0OiBzdHJpbmc7XG4gICAgICBwcm9tcHQ/OiBzdHJpbmc7XG4gICAgfTtcblxuLyoqIEV2ZXJ5IGh1YiBtZXNzYWdlLCBmb3IgYGVuY29kZUh1YmAuICovXG5leHBvcnQgdHlwZSBIdWJNZXNzYWdlID0gSHViQXV0aCB8IEJyb3dzZXJUb0h1YiB8IEh1YlRvQnJvd3NlciB8IFZzQ29kZVRvSHViIHwgSHViVG9Wc0NvZGU7XG5cbi8qKiBBIGZyYW1lJ3MgSlNPTiB0ZXh0ICh0aGUgbGVuZ3RoIHByZWZpeCBpcyBhZGRlZCBieSB0aGUgdHJhbnNwb3J0KS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmNvZGVIdWIobWVzc2FnZTogSHViTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IHY6IEhVQl9WRVJTSU9OLCAuLi5tZXNzYWdlIH0pO1xufVxuXG5jb25zdCBpZCA9IG1hdGNoZXMoL15bXFx3Li1dezEsNjR9JC8pO1xuY29uc3QgZGF0YSA9IHNob3J0U3RyaW5nKE1BWF9GUkFNRSk7XG5jb25zdCBmb2xkZXIgPSBzaG9ydFN0cmluZyg0MDk2KTtcblxuY29uc3QgQVVUSDogUmVjb3JkPCdhdXRoJywgUmVjb3JkPHN0cmluZywgQ2hlY2s+PiA9IHtcbiAgYXV0aDoge1xuICAgIHRva2VuOiBzaG9ydFN0cmluZygxMjgpLFxuICAgIHJvbGU6IG9uZU9mKCdicm93c2VyJywgJ3ZzY29kZScpLFxuICAgIG9yaWdpbjogb3B0aW9uYWwoc2hvcnRTdHJpbmcoMjU2KSksXG4gIH0sXG59O1xuXG5jb25zdCByZXEgPSBtYXRjaGVzKC9eW1xcdy1dezEsNjR9JC8pO1xuY29uc3QgcHJvamVjdFBhdGggPSBzaG9ydFN0cmluZyg0MDk2KTtcbmNvbnN0IGtpbmQgPSBvbmVPZiguLi5JVEVNX0tJTkRTKTtcbmNvbnN0IGJhc2U2NCA9IG1hdGNoZXMoL15bQS1aYS16MC05Ky9dKj17MCwyfSQvKTtcblxuY29uc3QgY2FwdHVyZVRvU2F2ZSA9IHNoYXBlKHtcbiAga2luZCxcbiAgdGl0bGU6IHNob3J0U3RyaW5nKDMwMCksXG4gIGRldGFpbDogb3B0aW9uYWwoc2hvcnRTdHJpbmcoMTAwMCkpLFxuICB0ZXh0OiBvcHRpb25hbChzaG9ydFN0cmluZyg1XzAwMF8wMDApKSxcbiAgZ3JvdXA6IG9wdGlvbmFsKGlkKSxcbiAgZ3JvdXBJbmRleDogb3B0aW9uYWwoaXNOdW1iZXIpLFxuICBpbWFnZTogb3B0aW9uYWwoYmFzZTY0KSxcbiAgdGh1bWI6IG9wdGlvbmFsKCh2KSA9PiB0eXBlb2YgdiA9PT0gJ3N0cmluZycgJiYgdi5sZW5ndGggPD0gNDAwXzAwMCAmJiBiYXNlNjQodikpLFxufSk7XG5cbmNvbnN0IGh1YlRhcmdldCA9IHNoYXBlKHtcbiAgaWQ6IHNob3J0U3RyaW5nKDIwMCksXG4gIGtpbmQ6IG9uZU9mKCd0bXV4JywgJ3Rlcm1pbmFsJywgJ2NoYXQnKSxcbiAgbGFiZWw6IHNob3J0U3RyaW5nKDEwMCksXG4gIGRldGFpbDogc2hvcnRTdHJpbmcoMzAwKSxcbiAgY2xvc2VkOiBvcHRpb25hbChpc0Jvb2xlYW4pLFxufSk7XG5jb25zdCBwcm9tcHQgPSBvcHRpb25hbChzaG9ydFN0cmluZyhNQVhfUFJPTVBUKSk7XG5jb25zdCBpdGVtSWRzID0gYXJyYXlPZihtYXRjaGVzKElURU1fSUQpLCA2MCk7XG5cbmNvbnN0IEJST1dTRVJfVE9fSFVCOiBSZWNvcmQ8QnJvd3NlclRvSHViWyd0eXBlJ10sIFJlY29yZDxzdHJpbmcsIENoZWNrPj4gPSB7XG4gIGxpbms6IHsgZGF0YSB9LFxuICBwaW5nOiB7fSxcbiAgJ3Byb2plY3RzLmdldCc6IHsgcmVxLCB1cmw6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDQwOTYpKSB9LFxuICAnY2FwdHVyZS5zYXZlJzoge1xuICAgIHJlcSxcbiAgICBwcm9qZWN0OiBwcm9qZWN0UGF0aCxcbiAgICB1cmw6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDQwOTYpKSxcbiAgICBicm93c2VyOiBvcHRpb25hbChzaG9ydFN0cmluZygxMDApKSxcbiAgICBjYXB0dXJlczogYXJyYXlPZihjYXB0dXJlVG9TYXZlLCA2MCksXG4gICAgc2VuZDogb3B0aW9uYWwoc2hvcnRTdHJpbmcoMjAwKSksXG4gIH0sXG4gICdpdGVtLnNlbmQnOiB7XG4gICAgcmVxLFxuICAgIHByb2plY3Q6IHByb2plY3RQYXRoLFxuICAgIGlkczogaXRlbUlkcyxcbiAgICB0YXJnZXQ6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDIwMCkpLFxuICAgIG9wZW46IG9wdGlvbmFsKGlzQm9vbGVhbiksXG4gICAgcHJvbXB0LFxuICB9LFxuICAnaXRlbXMubW92ZSc6IHsgcmVxLCBwcm9qZWN0OiBwcm9qZWN0UGF0aCwgaWRzOiBpdGVtSWRzLCB0bzogcHJvamVjdFBhdGggfSxcbiAgJ2l0ZW1zLmdldCc6IHsgcmVxLCBwcm9qZWN0OiBwcm9qZWN0UGF0aCB9LFxuICAnaXRlbS50aHVtYic6IHsgcmVxLCBwcm9qZWN0OiBwcm9qZWN0UGF0aCwgaWQ6IG1hdGNoZXMoSVRFTV9JRCkgfSxcbiAgJ2l0ZW0ucmVtb3ZlJzogeyByZXEsIHByb2plY3Q6IHByb2plY3RQYXRoLCBpZHM6IGl0ZW1JZHMgfSxcbiAgJ2l0ZW0ucmVzdG9yZSc6IHsgcmVxLCBwcm9qZWN0OiBwcm9qZWN0UGF0aCwgaWRzOiBpdGVtSWRzIH0sXG4gICdpdGVtLmNvbnRlbnQnOiB7XG4gICAgcmVxLFxuICAgIHByb2plY3Q6IHByb2plY3RQYXRoLFxuICAgIGlkOiBtYXRjaGVzKElURU1fSUQpLFxuICAgIG9mZnNldDogKHYpID0+IE51bWJlci5pc1NhZmVJbnRlZ2VyKHYpICYmICh2IGFzIG51bWJlcikgPj0gMCxcbiAgfSxcbiAgJ2FnZW50bXV4LnN0YXJ0JzogeyByZXEsIHByb2plY3Q6IHByb2plY3RQYXRoLCBoYXJuZXNzOiBvbmVPZiguLi5IQVJORVNTRVMpIH0sXG4gICdpdGVtcy5ncm91cCc6IHsgcmVxLCBwcm9qZWN0OiBwcm9qZWN0UGF0aCwgaWRzOiBpdGVtSWRzIH0sXG4gICdpdGVtcy51bmdyb3VwJzogeyByZXEsIHByb2plY3Q6IHByb2plY3RQYXRoLCBncm91cDogaWQgfSxcbiAgJ3Byb2plY3QucGluJzogeyByZXEsIHByb2plY3Q6IHByb2plY3RQYXRoLCBwaW5uZWQ6IGlzQm9vbGVhbiB9LFxufTtcblxuY29uc3QgcHJvamVjdCA9IHNoYXBlKHtcbiAgcGF0aDogcHJvamVjdFBhdGgsXG4gIG5hbWU6IHNob3J0U3RyaW5nKDMwMCksXG4gIHZzY29kZTogaXNCb29sZWFuLFxuICBhZ2VudG11eDogaXNCb29sZWFuLFxuICBzYXZlZDogaXNCb29sZWFuLFxuICBwaW5uZWQ6IGlzQm9vbGVhbixcbiAgdGFyZ2V0czogb3B0aW9uYWwoYXJyYXlPZihodWJUYXJnZXQsIDUwKSksXG4gIGRlZmF1bHRUYXJnZXQ6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDIwMCkpLFxuICBoYXJuZXNzZXM6IG9wdGlvbmFsKGFycmF5T2Yob25lT2YoLi4uSEFSTkVTU0VTKSwgMTApKSxcbiAgaW5ib3g6IG9wdGlvbmFsKGlzQm9vbGVhbiksXG59KTtcblxuLyoqIFZhbGlkYXRlcyBhbiBgaXRlbS5qc29uYCByZWFkIGZyb20gZGlzayAoYW55dGhpbmcgZWxzZSBpbiBgLmlua3NwZWN0L2AgaXMgaWdub3JlZCkuICovXG5leHBvcnQgY29uc3QgaXNJdGVtTWV0YTogQ2hlY2sgPSBzaGFwZSh7XG4gIHY6ICh2KSA9PiB2ID09PSAxLFxuICBpZDogbWF0Y2hlcyhJVEVNX0lEKSxcbiAga2luZCxcbiAgdGl0bGU6IHNob3J0U3RyaW5nKDMwMCksXG4gIGRldGFpbDogb3B0aW9uYWwoc2hvcnRTdHJpbmcoMTAwMCkpLFxuICB1cmw6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDQwOTYpKSxcbiAgdGltZTogaXNOdW1iZXIsXG4gIGdyb3VwOiBvcHRpb25hbChpZCksXG4gIGdyb3VwSW5kZXg6IG9wdGlvbmFsKGlzTnVtYmVyKSxcbiAga2V5OiBvcHRpb25hbChzaG9ydFN0cmluZygyMDApKSxcbiAgc291cmNlOiBvbmVPZignYnJvd3NlcicsICd2c2NvZGUnKSxcbiAgYnJvd3Nlcjogb3B0aW9uYWwoc2hvcnRTdHJpbmcoMTAwKSksXG4gIHByZXZpZXc6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDEwMDApKSxcbiAgZmlsZXM6IHNoYXBlKHtcbiAgICBmaWxlOiBvcHRpb25hbChtYXRjaGVzKElURU1fRklMRSkpLFxuICAgIHRleHQ6IG9wdGlvbmFsKG1hdGNoZXMoSVRFTV9GSUxFKSksXG4gICAgdGh1bWI6IG9wdGlvbmFsKG1hdGNoZXMoSVRFTV9GSUxFKSksXG4gIH0pLFxuICBzZW50VG86IGFycmF5T2Yoc2hvcnRTdHJpbmcoMjAwKSwgNTApLFxufSk7XG5cbmNvbnN0IEhVQl9UT19CUk9XU0VSOiBSZWNvcmQ8SHViVG9Ccm93c2VyWyd0eXBlJ10sIFJlY29yZDxzdHJpbmcsIENoZWNrPj4gPSB7XG4gIGxpbms6IHsgZGF0YSB9LFxuICBzdGF0dXM6IHtcbiAgICB2c2NvZGU6IGlzQm9vbGVhbixcbiAgICBwZWVyOiBvcHRpb25hbChzaG9ydFN0cmluZygyMDApKSxcbiAgICBmZWF0dXJlczogb3B0aW9uYWwoYXJyYXlPZihzaG9ydFN0cmluZyg0MCksIDUwKSksXG4gIH0sXG4gIHJlbGluazoge30sXG4gIHBvbmc6IHt9LFxuICBwcm9qZWN0czogeyByZXEsIHByb2plY3RzOiBhcnJheU9mKHByb2plY3QsIDUwMCksIHN1Z2dlc3RlZDogb3B0aW9uYWwocHJvamVjdFBhdGgpIH0sXG4gICdjYXB0dXJlLnNhdmVkJzoge1xuICAgIHJlcSxcbiAgICBvazogaXNCb29sZWFuLFxuICAgIGlkczogb3B0aW9uYWwoaXRlbUlkcyksXG4gICAgZXJyb3I6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDEwMDApKSxcbiAgICBzZW50VG86IG9wdGlvbmFsKHNob3J0U3RyaW5nKDIwMCkpLFxuICB9LFxuICAnaXRlbS5zZW50Jzoge1xuICAgIHJlcSxcbiAgICBvazogaXNCb29sZWFuLFxuICAgIHNlbnRUbzogb3B0aW9uYWwoc2hvcnRTdHJpbmcoMjAwKSksXG4gICAgZXJyb3I6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDEwMDApKSxcbiAgfSxcbiAgaXRlbXM6IHtcbiAgICByZXEsXG4gICAgb2s6IGlzQm9vbGVhbixcbiAgICBpdGVtczogYXJyYXlPZihpc0l0ZW1NZXRhLCA1MDApLFxuICAgIGVycm9yOiBvcHRpb25hbChzaG9ydFN0cmluZygxMDAwKSksXG4gIH0sXG4gIHN0YXJ0ZWQ6IHtcbiAgICByZXEsXG4gICAgb2s6IGlzQm9vbGVhbixcbiAgICB0YXJnZXQ6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDIwMCkpLFxuICAgIGVycm9yOiBvcHRpb25hbChzaG9ydFN0cmluZygxMDAwKSksXG4gIH0sXG4gIGNvbnRlbnQ6IHtcbiAgICByZXEsXG4gICAgb2s6IGlzQm9vbGVhbixcbiAgICBtaW1lVHlwZTogb3B0aW9uYWwob25lT2YoLi4uQ09OVEVOVF9UWVBFUykpLFxuICAgIHNpemU6IG9wdGlvbmFsKGlzTnVtYmVyKSxcbiAgICBkYXRhOiBvcHRpb25hbChiYXNlNjQpLFxuICAgIGVycm9yOiBvcHRpb25hbChzaG9ydFN0cmluZygxMDAwKSksXG4gIH0sXG4gIHRodW1iOiB7IHJlcSwgZGF0YTogb3B0aW9uYWwoYmFzZTY0KSwgbWltZVR5cGU6IG9wdGlvbmFsKG9uZU9mKCdpbWFnZS9qcGVnJywgJ2ltYWdlL3BuZycpKSB9LFxuICBkb25lOiB7IHJlcSwgb2s6IGlzQm9vbGVhbiwgZXJyb3I6IG9wdGlvbmFsKHNob3J0U3RyaW5nKDEwMDApKSB9LFxufTtcblxuY29uc3QgVlNDT0RFX1RPX0hVQjogUmVjb3JkPFZzQ29kZVRvSHViWyd0eXBlJ10sIFJlY29yZDxzdHJpbmcsIENoZWNrPj4gPSB7XG4gIHdpbmRvdzoge1xuICAgIGlkLFxuICAgIG5hbWU6IHNob3J0U3RyaW5nKDIwMCksXG4gICAgZm9sZGVyczogYXJyYXlPZihmb2xkZXIsIDUwKSxcbiAgICBmb2N1c2VkQXQ6IGlzTnVtYmVyLFxuICAgIHRhcmdldHM6IG9wdGlvbmFsKGFycmF5T2YoaHViVGFyZ2V0LCA1MCkpLFxuICB9LFxuICBsaW5rOiB7IGJyb3dzZXI6IGlkLCBkYXRhIH0sXG4gIHNodXRkb3duOiB7fSxcbiAgcGluZzoge30sXG4gICdydW4uc2VudCc6IHtcbiAgICByZXEsXG4gICAgb2s6IGlzQm9vbGVhbixcbiAgICBzZW50VG86IG9wdGlvbmFsKHNob3J0U3RyaW5nKDIwMCkpLFxuICAgIGVycm9yOiBvcHRpb25hbChzaG9ydFN0cmluZygxMDAwKSksXG4gIH0sXG59O1xuXG5jb25zdCBodWJCcm93c2VyID0gc2hhcGUoeyBpZCwgbmFtZTogc2hvcnRTdHJpbmcoMTAwKSwgb3JpZ2luOiBzaG9ydFN0cmluZygyNTYpIH0pO1xuXG5jb25zdCBIVUJfVE9fVlNDT0RFOiBSZWNvcmQ8SHViVG9Wc0NvZGVbJ3R5cGUnXSwgUmVjb3JkPHN0cmluZywgQ2hlY2s+PiA9IHtcbiAgd2VsY29tZTogeyBidWlsZDogc2hvcnRTdHJpbmcoMTAwKSwgbGVhZGVyOiBpc0Jvb2xlYW4gfSxcbiAgbGVhZGVyOiB7IGxlYWRlcjogaXNCb29sZWFuIH0sXG4gIGJyb3dzZXJzOiB7IGJyb3dzZXJzOiBhcnJheU9mKGh1YkJyb3dzZXIsIDUwKSB9LFxuICBsaW5rOiB7IGJyb3dzZXI6IGlkLCBkYXRhIH0sXG4gIGdvbmU6IHsgYnJvd3NlcjogaWQgfSxcbiAgcG9uZzoge30sXG4gICdydW4uc2VuZCc6IHsgcmVxLCBwcm9qZWN0OiBwcm9qZWN0UGF0aCwgaWRzOiBpdGVtSWRzLCB0YXJnZXQ6IHNob3J0U3RyaW5nKDIwMCksIHByb21wdCB9LFxufTtcblxuLyoqIEEgY29ubmVjdGlvbidzIGZpcnN0IGZyYW1lLCBvciB1bmRlZmluZWQuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VIdWJBdXRoKHJhdzogdW5rbm93bik6IEh1YkF1dGggfCB1bmRlZmluZWQge1xuICByZXR1cm4gcGFyc2VNZXNzYWdlPEh1YkF1dGg+KHJhdywgQVVUSCwgSFVCX1ZFUlNJT04pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VCcm93c2VyVG9IdWIocmF3OiB1bmtub3duKTogQnJvd3NlclRvSHViIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHBhcnNlTWVzc2FnZTxCcm93c2VyVG9IdWI+KHJhdywgQlJPV1NFUl9UT19IVUIsIEhVQl9WRVJTSU9OKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSHViVG9Ccm93c2VyKHJhdzogdW5rbm93bik6IEh1YlRvQnJvd3NlciB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBwYXJzZU1lc3NhZ2U8SHViVG9Ccm93c2VyPihyYXcsIEhVQl9UT19CUk9XU0VSLCBIVUJfVkVSU0lPTik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVZzQ29kZVRvSHViKHJhdzogdW5rbm93bik6IFZzQ29kZVRvSHViIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHBhcnNlTWVzc2FnZTxWc0NvZGVUb0h1Yj4ocmF3LCBWU0NPREVfVE9fSFVCLCBIVUJfVkVSU0lPTik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUh1YlRvVnNDb2RlKHJhdzogdW5rbm93bik6IEh1YlRvVnNDb2RlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHBhcnNlTWVzc2FnZTxIdWJUb1ZzQ29kZT4ocmF3LCBIVUJfVE9fVlNDT0RFLCBIVUJfVkVSU0lPTik7XG59XG5cbi8qKlxuICogVGhlIENocm9tZSBleHRlbnNpb24gaWQgdGhhdCBhIG1hbmlmZXN0IGBrZXlgIChiYXNlNjQgREVSIHB1YmxpYyBrZXkpIGdpdmVzOiB0aGUgZmlyc3QgMzIgaGV4XG4gKiBkaWdpdHMgb2YgaXRzIFNIQS0yNTYsIHdyaXR0ZW4gd2l0aCB0aGUgbGV0dGVycyBhLXAuIEFzeW5jIGJlY2F1c2UgaXQgdXNlcyBXZWIgQ3J5cHRvLCB3aGljaFxuICogYm90aCBOb2RlIGFuZCBicm93c2VycyBoYXZlLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2hyb21lRXh0ZW5zaW9uSWQoa2V5OiBzdHJpbmcpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBkZXIgPSBVaW50OEFycmF5LmZyb20oYXRvYihrZXkpLCAoYykgPT4gYy5jaGFyQ29kZUF0KDApKTtcbiAgY29uc3QgZGlnZXN0ID0gbmV3IFVpbnQ4QXJyYXkoYXdhaXQgY3J5cHRvLnN1YnRsZS5kaWdlc3QoJ1NIQS0yNTYnLCBkZXIpKTtcbiAgbGV0IG91dCA9ICcnO1xuICBmb3IgKGNvbnN0IGJ5dGUgb2YgZGlnZXN0LnNsaWNlKDAsIDE2KSkge1xuICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKDk3ICsgKGJ5dGUgPj4gNCksIDk3ICsgKGJ5dGUgJiAxNSkpO1xuICB9XG4gIHJldHVybiBvdXQ7XG59XG4iLCAiLy8gVGhlIGxpbmsgYmV0d2VlbiB0aGUgVlMgQ29kZSBleHRlbnNpb24gKHNlcnZlciwgMTI3LjAuMC4xKSBhbmQgdGhlIGJyb3dzZXIgZXh0ZW5zaW9uXG4vLyAoY2xpZW50KSwgb3ZlciBhIFdlYlNvY2tldC4gRXZlcnkgbWVzc2FnZSBpcyBKU09OIHdpdGggdGhlIHByb3RvY29sIHZlcnNpb24gYHZgOyBib3RoIHNpZGVzXG4vLyB2YWxpZGF0ZSB3aGF0IHRoZXkgcmVjZWl2ZSB3aXRoIHRoZSBwYXJzZXJzIGJlbG93IGFuZCBkcm9wIGFueXRoaW5nIGVsc2UuXG5pbXBvcnQgdHlwZSB7IEZsYXROb2RlLCBSZW1vdGVPcCB9IGZyb20gJy4vYm9va21hcmtTeW5jJztcbmltcG9ydCB7IHBhcnNlQnJvd3NlclRvSHViLCBwYXJzZUh1YlRvQnJvd3NlciwgdHlwZSBCcm93c2VyVG9IdWIsIHR5cGUgSHViVG9Ccm93c2VyIH0gZnJvbSAnLi9odWInO1xuaW1wb3J0IHR5cGUgeyBDaGVjayB9IGZyb20gJy4vdmFsaWRhdGUnO1xuaW1wb3J0IHtcbiAgYXJyYXlPZixcbiAgaXNCb29sZWFuLFxuICBpc051bWJlcixcbiAgaXNSZWNvcmQsXG4gIGlzU3RyaW5nLFxuICBvcHRpb25hbCxcbiAgcGFyc2VNZXNzYWdlLFxuICBzaGFwZSxcbiAgc3RyaW5nTWFwLFxufSBmcm9tICcuL3ZhbGlkYXRlJztcblxuZXhwb3J0IGNvbnN0IEJSSURHRV9WRVJTSU9OID0gMTtcbmV4cG9ydCBjb25zdCBERUZBVUxUX0JSSURHRV9QT1JUID0gNDcxMTA7XG4vKiogVGhlIGNsaWVudCB0cmllcyB0aGlzIG1hbnkgcG9ydHMgZnJvbSB0aGUgY29uZmlndXJlZCBvbmUgKHNldmVyYWwgVlMgQ29kZSBpbnN0YWxscykuICovXG5leHBvcnQgY29uc3QgQlJJREdFX1BPUlRfUkFOR0UgPSA1O1xuZXhwb3J0IGNvbnN0IEJSSURHRV9QQVRIID0gJy9icmlkZ2UnO1xuXG5leHBvcnQgaW50ZXJmYWNlIENsaWVudEluZm8ge1xuICAvKiogUmFuZG9tIGlkIG9mIHRoaXMgYnJvd3NlciBwcm9maWxlJ3MgZXh0ZW5zaW9uIGluc3RhbGwuICovXG4gIGlkOiBzdHJpbmc7XG4gIC8qKiBcIkdvb2dsZSBDaHJvbWVcIiwgXCJNaWNyb3NvZnQgRWRnZVwiLCBcIkZpcmVmb3hcIi4uLiAqL1xuICBicm93c2VyOiBzdHJpbmc7XG59XG5cbi8qKiBXaGF0IGEgY2FwdHVyZSBpcywgZm9yIHRoZSBTYXZlZCBsaXN0LiAqL1xuZXhwb3J0IHR5cGUgQ2FwdHVyZUtpbmQgPSAnc2NyZWVuc2hvdCcgfCAnZWxlbWVudCcgfCAnZXJyb3JzJyB8ICduZXR3b3JrJyB8ICdwYWdlJyB8ICd0ZXh0JztcblxuLyoqXG4gKiBUaGUgVlMgQ29kZSBicm93c2VyJ3Mgc2hvcnRjdXQgY2hhbmdlcywgc3luY2VkIHRocm91Z2ggdGhlIGJyb3dzZXIgZXh0ZW5zaW9uJ3NcbiAqIGBjaHJvbWUuc3RvcmFnZS5zeW5jYCBzbyB0aGV5IGZvbGxvdyB0aGUgdXNlcidzIGJyb3dzZXIgYWNjb3VudCB0byBvdGhlciBkZXZpY2VzLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIFNob3J0Y3V0U2V0dGluZ3Mge1xuICAvKiogQWN0aW9uIGlkIHRvIGl0cyBrZXlzIChzZWUgdGhlIFZTIENvZGUgZXh0ZW5zaW9uJ3Mgc2hvcnRjdXQgcmVnaXN0cnkpLiAqL1xuICBzaG9ydGN1dHM6IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHN0cmluZ1tdPjtcbiAgLyoqIFdoZW4gdGhleSBsYXN0IGNoYW5nZWQgKG1zIHNpbmNlIHRoZSBlcG9jaCk7IDAgbWVhbnMgbmV2ZXIuICovXG4gIHVwZGF0ZWQ6IG51bWJlcjtcbn1cblxuLyoqXG4gKiBXaGljaCBjb3B5IG9mIHRoZSBzaG9ydGN1dCBzZXR0aW5ncyBzaG91bGQgd2luOiB0aGUgb25lIGNoYW5nZWQgbGFzdC4gYHNhbWVgIHdoZW4gYm90aCB3ZXJlXG4gKiBjaGFuZ2VkIGF0IHRoZSBzYW1lIG1vbWVudCAobm90aGluZyB0byBkbykuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXdlclNob3J0Y3V0cyhcbiAgbG9jYWw6IFNob3J0Y3V0U2V0dGluZ3MgfCB1bmRlZmluZWQsXG4gIHJlbW90ZTogU2hvcnRjdXRTZXR0aW5ncyB8IHVuZGVmaW5lZCxcbik6ICdsb2NhbCcgfCAncmVtb3RlJyB8ICdzYW1lJyB7XG4gIGNvbnN0IGEgPSBsb2NhbD8udXBkYXRlZCA/PyAwO1xuICBjb25zdCBiID0gcmVtb3RlPy51cGRhdGVkID8/IDA7XG4gIHJldHVybiBhID09PSBiID8gJ3NhbWUnIDogYSA+IGIgPyAnbG9jYWwnIDogJ3JlbW90ZSc7XG59XG5cbi8qKiBXaGF0IFZTIENvZGUgY2FuIGRvIGZvciBhIGxpbmtlZCBicm93c2VyIGJleW9uZCB0aGUgYmFzaWNzIChzZWUgYHdlbGNvbWVgKS4gKi9cbmV4cG9ydCB0eXBlIExpbmtGZWF0dXJlID0gJ2h1Yic7XG5cbi8qKlxuICogQSBxdWVzdGlvbiBhYm91dCBwcm9qZWN0cyBhbmQgdGhlaXIgc2F2ZWQgY2FwdHVyZXMgKHRoZSBicm93c2VyIGhlbHBlcidzIHByb3RvY29sLCBzZWVcbiAqIC4vaHViLnRzKSwgYXNrZWQgb3ZlciB0aGlzIGxpbmsgd2hlbiB0aGUgYnJvd3NlciBoZWxwZXIgaXNuJ3QgdGhlcmUuXG4gKi9cbmV4cG9ydCB0eXBlIEh1YlJlcXVlc3QgPSBFeHRyYWN0PEJyb3dzZXJUb0h1YiwgeyByZXE6IHN0cmluZyB9PjtcbmV4cG9ydCB0eXBlIEh1YlJlcGx5ID0gRXh0cmFjdDxIdWJUb0Jyb3dzZXIsIHsgcmVxOiBzdHJpbmcgfT47XG5cbmV4cG9ydCB0eXBlIENsaWVudE1lc3NhZ2UgPVxuICB8IHsgdHlwZTogJ3BhaXInOyBjb2RlOiBzdHJpbmc7IGNsaWVudDogQ2xpZW50SW5mbyB9XG4gIHwgeyB0eXBlOiAnaGVsbG8nOyBjbGllbnQ6IENsaWVudEluZm87IHRva2VuOiBzdHJpbmcgfVxuICB8IHsgdHlwZTogJ3BpbmcnIH1cbiAgfCB7IHR5cGU6ICdib29rbWFya3Muc25hcHNob3QnOyB0cmVlOiBGbGF0Tm9kZVtdIH1cbiAgfCB7IHR5cGU6ICdib29rbWFya3MuYXBwbGllZCc7IGNyZWF0ZWQ6IFJlY29yZDxzdHJpbmcsIHN0cmluZz47IGZhaWxlZDogc3RyaW5nW10gfVxuICAvKiogUHJvamVjdHMgYW5kIHNhdmVkIGNhcHR1cmVzOiBsaXN0ZWQsIHNhdmVkLCBzZW50LCBtb3ZlZCAoVlMgQ29kZSBhbnN3ZXJzIGBodWIucmVwbHlgKS4gKi9cbiAgfCB7IHR5cGU6ICdodWIucmVxdWVzdCc7IHJlcXVlc3Q6IEh1YlJlcXVlc3QgfVxuICAvKiogVGhlIHNob3J0Y3V0cyBzdG9yZWQgaW4gdGhlIGJyb3dzZXIncyBzeW5jIHN0b3JhZ2UgKHNlbnQgd2hlbiB0aGV5IGFyZSBuZXdlcikuICovXG4gIHwgKHsgdHlwZTogJ3NldHRpbmdzLnNob3J0Y3V0cycgfSAmIFNob3J0Y3V0U2V0dGluZ3MpO1xuXG5leHBvcnQgdHlwZSBTZXJ2ZXJNZXNzYWdlID1cbiAgfCB7IHR5cGU6ICdwYWlyZWQnOyB0b2tlbjogc3RyaW5nOyBwZWVyOiBzdHJpbmcgfVxuICAvKiogYGZlYXR1cmVzYDogd2hhdCB0aGlzIFZTIENvZGUgY2FuIGRvIGJleW9uZCB0aGUgYmFzaWNzIChgaHViYDogYW5zd2VycyBgaHViLnJlcXVlc3RgKS4gKi9cbiAgfCB7IHR5cGU6ICd3ZWxjb21lJzsgcGVlcjogc3RyaW5nOyBzeW5jQm9va21hcmtzOiBib29sZWFuOyBmZWF0dXJlcz86IExpbmtGZWF0dXJlW10gfVxuICB8IHsgdHlwZTogJ2Vycm9yJzsgbWVzc2FnZTogc3RyaW5nOyBjb2RlPzogJ3VucGFpcmVkJyB8ICdiYWQtY29kZScgfCAndmVyc2lvbicgfCAndW5hdXRob3JpemVkJyB9XG4gIHwgeyB0eXBlOiAncG9uZycgfVxuICB8IHsgdHlwZTogJ2Jvb2ttYXJrcy5vcHMnOyBvcHM6IFJlbW90ZU9wW10gfVxuICB8IHsgdHlwZTogJ2Jvb2ttYXJrcy5yZXF1ZXN0U25hcHNob3QnIH1cbiAgfCB7IHR5cGU6ICdodWIucmVwbHknOyByZXBseTogSHViUmVwbHkgfVxuICAvKiogVlMgQ29kZSdzIHNob3J0Y3V0cywgc2VudCBhZnRlciBgd2VsY29tZWAgYW5kIHdoZW5ldmVyIHRoZXkgY2hhbmdlLiAqL1xuICB8ICh7IHR5cGU6ICdzZXR0aW5ncy5zaG9ydGN1dHMnIH0gJiBTaG9ydGN1dFNldHRpbmdzKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGVuY29kZShtZXNzYWdlOiBDbGllbnRNZXNzYWdlIHwgU2VydmVyTWVzc2FnZSk6IHN0cmluZyB7XG4gIHJldHVybiBKU09OLnN0cmluZ2lmeSh7IHY6IEJSSURHRV9WRVJTSU9OLCAuLi5tZXNzYWdlIH0pO1xufVxuXG4vKiogQSBzaG9ydGN1dCBtYXA6IGEgYm91bmRlZCBudW1iZXIgb2YgaWRzLCBlYWNoIHdpdGggYSBrZXkgb3IgYSBmZXcga2V5cy4gKi9cbmNvbnN0IGlzS2V5OiBDaGVjayA9IChrKSA9PiB0eXBlb2YgayA9PT0gJ3N0cmluZycgJiYgay5sZW5ndGggPD0gNDA7XG5jb25zdCBzaG9ydGN1dE1hcDogQ2hlY2sgPSAodikgPT5cbiAgaXNSZWNvcmQodikgJiZcbiAgT2JqZWN0LmtleXModikubGVuZ3RoIDw9IDUwMCAmJlxuICBPYmplY3QudmFsdWVzKHYpLmV2ZXJ5KChrZXlzKSA9PiBpc0tleShrZXlzKSB8fCBhcnJheU9mKGlzS2V5LCA4KShrZXlzKSk7XG5cbmNvbnN0IGZsYXROb2RlID0gc2hhcGUoe1xuICBpZDogaXNTdHJpbmcsXG4gIHBhcmVudElkOiBpc1N0cmluZyxcbiAgaW5kZXg6IGlzTnVtYmVyLFxuICB0aXRsZTogaXNTdHJpbmcsXG4gIHVybDogb3B0aW9uYWwoaXNTdHJpbmcpLFxufSk7XG5jb25zdCBjbGllbnQgPSBzaGFwZSh7IGlkOiBpc1N0cmluZywgYnJvd3NlcjogaXNTdHJpbmcgfSk7XG5jb25zdCByZW1vdGVPcDogQ2hlY2sgPSAodikgPT5cbiAgaXNSZWNvcmQodikgJiZcbiAgKCh2Lm9wID09PSAnY3JlYXRlJyAmJlxuICAgIHNoYXBlKHtcbiAgICAgIHJlZjogaXNTdHJpbmcsXG4gICAgICBwYXJlbnRJZDogaXNTdHJpbmcsXG4gICAgICBpbmRleDogaXNOdW1iZXIsXG4gICAgICB0aXRsZTogaXNTdHJpbmcsXG4gICAgICB1cmw6IG9wdGlvbmFsKGlzU3RyaW5nKSxcbiAgICB9KSh2KSkgfHxcbiAgICAodi5vcCA9PT0gJ3VwZGF0ZScgJiYgc2hhcGUoeyBpZDogaXNTdHJpbmcsIHRpdGxlOiBpc1N0cmluZywgdXJsOiBvcHRpb25hbChpc1N0cmluZykgfSkodikpIHx8XG4gICAgKHYub3AgPT09ICdtb3ZlJyAmJiBzaGFwZSh7IGlkOiBpc1N0cmluZywgcGFyZW50SWQ6IGlzU3RyaW5nLCBpbmRleDogaXNOdW1iZXIgfSkodikpIHx8XG4gICAgKHYub3AgPT09ICdyZW1vdmUnICYmIHNoYXBlKHsgaWQ6IGlzU3RyaW5nIH0pKHYpKSk7XG5cbmNvbnN0IENMSUVOVF9NRVNTQUdFUzogUmVjb3JkPENsaWVudE1lc3NhZ2VbJ3R5cGUnXSwgUmVjb3JkPHN0cmluZywgQ2hlY2s+PiA9IHtcbiAgcGFpcjogeyBjb2RlOiBpc1N0cmluZywgY2xpZW50IH0sXG4gIGhlbGxvOiB7IGNsaWVudCwgdG9rZW46IGlzU3RyaW5nIH0sXG4gIHBpbmc6IHt9LFxuICAnYm9va21hcmtzLnNuYXBzaG90JzogeyB0cmVlOiBhcnJheU9mKGZsYXROb2RlKSB9LFxuICAnYm9va21hcmtzLmFwcGxpZWQnOiB7IGNyZWF0ZWQ6IHN0cmluZ01hcCwgZmFpbGVkOiBhcnJheU9mKGlzU3RyaW5nKSB9LFxuICAnaHViLnJlcXVlc3QnOiB7IHJlcXVlc3Q6ICh2KSA9PiBpc1JlY29yZCh2KSAmJiAncmVxJyBpbiB2ICYmICEhcGFyc2VCcm93c2VyVG9IdWIodikgfSxcbiAgJ3NldHRpbmdzLnNob3J0Y3V0cyc6IHsgc2hvcnRjdXRzOiBzaG9ydGN1dE1hcCwgdXBkYXRlZDogaXNOdW1iZXIgfSxcbn07XG5cbmNvbnN0IFNFUlZFUl9NRVNTQUdFUzogUmVjb3JkPFNlcnZlck1lc3NhZ2VbJ3R5cGUnXSwgUmVjb3JkPHN0cmluZywgQ2hlY2s+PiA9IHtcbiAgcGFpcmVkOiB7IHRva2VuOiBpc1N0cmluZywgcGVlcjogaXNTdHJpbmcgfSxcbiAgd2VsY29tZTogeyBwZWVyOiBpc1N0cmluZywgc3luY0Jvb2ttYXJrczogaXNCb29sZWFuLCBmZWF0dXJlczogb3B0aW9uYWwoYXJyYXlPZihpc1N0cmluZywgMjApKSB9LFxuICBlcnJvcjogeyBtZXNzYWdlOiBpc1N0cmluZywgY29kZTogb3B0aW9uYWwoaXNTdHJpbmcpIH0sXG4gIHBvbmc6IHt9LFxuICAnYm9va21hcmtzLm9wcyc6IHsgb3BzOiBhcnJheU9mKHJlbW90ZU9wKSB9LFxuICAnYm9va21hcmtzLnJlcXVlc3RTbmFwc2hvdCc6IHt9LFxuICAnaHViLnJlcGx5JzogeyByZXBseTogKHYpID0+IGlzUmVjb3JkKHYpICYmICdyZXEnIGluIHYgJiYgISFwYXJzZUh1YlRvQnJvd3Nlcih2KSB9LFxuICAnc2V0dGluZ3Muc2hvcnRjdXRzJzogeyBzaG9ydGN1dHM6IHNob3J0Y3V0TWFwLCB1cGRhdGVkOiBpc051bWJlciB9LFxufTtcblxuLyoqIEEgbWVzc2FnZSBmcm9tIHRoZSBicm93c2VyIGV4dGVuc2lvbiwgb3IgdW5kZWZpbmVkIGlmIGl0IGlzbid0IG9uZSAob3IgaGFzIGFub3RoZXIgdmVyc2lvbikuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDbGllbnRNZXNzYWdlKHJhdzogc3RyaW5nKTogQ2xpZW50TWVzc2FnZSB8IHVuZGVmaW5lZCB7XG4gIHJldHVybiBwYXJzZU1lc3NhZ2U8Q2xpZW50TWVzc2FnZT4ocmF3LCBDTElFTlRfTUVTU0FHRVMsIEJSSURHRV9WRVJTSU9OKTtcbn1cblxuLyoqIEEgbWVzc2FnZSBmcm9tIFZTIENvZGUsIG9yIHVuZGVmaW5lZC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNlcnZlck1lc3NhZ2UocmF3OiBzdHJpbmcpOiBTZXJ2ZXJNZXNzYWdlIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIHBhcnNlTWVzc2FnZTxTZXJ2ZXJNZXNzYWdlPihyYXcsIFNFUlZFUl9NRVNTQUdFUywgQlJJREdFX1ZFUlNJT04pO1xufVxuXG4vKiogT3JpZ2lucyBhbGxvd2VkIHRvIGNvbm5lY3Q6IGV4dGVuc2lvbiBwYWdlcyBvbmx5IChuZXZlciB3ZWIgcGFnZXMpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRXh0ZW5zaW9uT3JpZ2luKG9yaWdpbjogc3RyaW5nIHwgdW5kZWZpbmVkKTogYm9vbGVhbiB7XG4gIHJldHVybiAhIW9yaWdpbiAmJiAvXihjaHJvbWUtZXh0ZW5zaW9ufG1vei1leHRlbnNpb258ZXh0ZW5zaW9uKTpcXC9cXC9bXFx3LV0rJC8udGVzdChvcmlnaW4pO1xufVxuIiwgIi8vIFRoZSBicm93c2VyIHNpZGUgb2YgdGhlIGxpbmsgdG8gVlMgQ29kZSAoc2VlIEBpbmtzcGVjdC9zaGFyZWQvYnJpZGdlKS5cbmltcG9ydCB7XG4gIEJSSURHRV9QQVRILFxuICBCUklER0VfUE9SVF9SQU5HRSxcbiAgREVGQVVMVF9CUklER0VfUE9SVCxcbiAgZW5jb2RlLFxuICBwYXJzZVNlcnZlck1lc3NhZ2UsXG4gIHR5cGUgQ2xpZW50SW5mbyxcbiAgdHlwZSBDbGllbnRNZXNzYWdlLFxuICB0eXBlIFNlcnZlck1lc3NhZ2UsXG59IGZyb20gJ0BpbmtzcGVjdC9zaGFyZWQvYnJpZGdlJztcbmltcG9ydCB7XG4gIGVuY29kZUh1YixcbiAgSFVCX0ZFQVRVUkVTLFxuICBIVUJfSE9TVF9OQU1FLFxuICBwYXJzZUh1YlRvQnJvd3NlcixcbiAgdHlwZSBCcm93c2VyVG9IdWIsXG4gIHR5cGUgSHViVG9Ccm93c2VyLFxufSBmcm9tICdAaW5rc3BlY3Qvc2hhcmVkL2h1Yic7XG5pbXBvcnQgdHlwZSB7IEJyaWRnZVN0YXR1cyB9IGZyb20gJy4uL21lc3NhZ2VzJztcblxuLyoqIEhvdyBsb25nIHRvIHdhaXQgYmVmb3JlIGxvb2tpbmcgZm9yIHRoZSBicm93c2VyIGhlbHBlciBhZ2FpbiBhZnRlciBpdCB3YXNuJ3QgZm91bmQuICovXG5jb25zdCBIVUJfTUlTU0lOR19NUyA9IDUgKiA2MF8wMDA7XG5cbmludGVyZmFjZSBTdG9yZWQge1xuICBjbGllbnRJZD86IHN0cmluZztcbiAgdG9rZW4/OiBzdHJpbmc7XG4gIHBvcnQ/OiBudW1iZXI7XG59XG5cbi8qKiBBIGZyaWVuZGx5IGJyb3dzZXIgbmFtZSBmb3IgVlMgQ29kZSdzIG1lc3NhZ2VzIChcIkdvb2dsZSBDaHJvbWVcIiwgXCJNaWNyb3NvZnQgRWRnZVwiLi4uKS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBicm93c2VyTmFtZSgpOiBzdHJpbmcge1xuICBpZiAoX19CUk9XU0VSX18gPT09ICdmaXJlZm94JykgcmV0dXJuICdGaXJlZm94JztcbiAgY29uc3QgbmF2ID0gbmF2aWdhdG9yIGFzIE5hdmlnYXRvciAmIHtcbiAgICB1c2VyQWdlbnREYXRhPzogeyBicmFuZHM6IHsgYnJhbmQ6IHN0cmluZyB9W10gfTtcbiAgICBicmF2ZT86IHVua25vd247XG4gIH07XG4gIGlmIChuYXYuYnJhdmUpIHJldHVybiAnQnJhdmUnO1xuICBjb25zdCBicmFuZHMgPSBuYXYudXNlckFnZW50RGF0YT8uYnJhbmRzLm1hcCgoYikgPT4gYi5icmFuZCkgPz8gW107XG4gIGZvciAoY29uc3QgbmFtZSBvZiBbJ01pY3Jvc29mdCBFZGdlJywgJ09wZXJhJywgJ1ZpdmFsZGknLCAnR29vZ2xlIENocm9tZSddKSB7XG4gICAgaWYgKGJyYW5kcy5pbmNsdWRlcyhuYW1lKSkgcmV0dXJuIG5hbWU7XG4gIH1cbiAgcmV0dXJuICdDaHJvbWl1bSc7XG59XG5cbnR5cGUgTGlzdGVuZXIgPSAobWVzc2FnZTogU2VydmVyTWVzc2FnZSkgPT4gdm9pZDtcblxuLyoqXG4gKiBXaGV0aGVyIHNvbWV0aGluZyBsaXN0ZW5zIG9uIHRoZSBwb3J0LiBDaHJvbWUgbG9ncyBldmVyeSByZWZ1c2VkIFdlYlNvY2tldCBvbiB0aGUgZXh0ZW5zaW9uJ3NcbiAqIEVycm9ycyBwYWdlIChKUyBjYW4ndCBjYXRjaCBpdCksIGFuZCB0aGUgbGluayByZXRyaWVzIHdoaWxlIFZTIENvZGUgaXMgY2xvc2VkLCBzbyBhIHBsYWluXG4gKiByZXF1ZXN0IGdvZXMgZmlyc3Q6IGEgcmVmdXNlZCBgZmV0Y2hgIG9ubHkgcmVqZWN0cy4gVlMgQ29kZSBhbnN3ZXJzIGl0IHdpdGggYSA0MDQ7IGEgdGltZW91dFxuICogYWxzbyBtZWFucyBzb21ldGhpbmcgaXMgdGhlcmUuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGxpc3RlbmluZyhwb3J0OiBudW1iZXIpOiBQcm9taXNlPGJvb2xlYW4+IHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBmZXRjaChgaHR0cDovLzEyNy4wLjAuMToke3BvcnR9JHtCUklER0VfUEFUSH1gLCB7XG4gICAgICBtb2RlOiAnbm8tY29ycycsXG4gICAgICBjYWNoZTogJ25vLXN0b3JlJyxcbiAgICAgIHNpZ25hbDogQWJvcnRTaWduYWwudGltZW91dCgyXzAwMCksXG4gICAgfSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIGVycm9yIGluc3RhbmNlb2YgRE9NRXhjZXB0aW9uICYmIGVycm9yLm5hbWUgPT09ICdUaW1lb3V0RXJyb3InO1xuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBCcmlkZ2VDbGllbnQge1xuICBzdGF0dXM6IEJyaWRnZVN0YXR1cyA9IHsgc3RhdGU6ICdvZmZsaW5lJyB9O1xuICBwcml2YXRlIHNvY2tldD86IFdlYlNvY2tldDtcbiAgLyoqIFRoZSBicm93c2VyIGhlbHBlciAobmF0aXZlIG1lc3NhZ2luZyksIHdoZW4gaXQgaXMgaW5zdGFsbGVkOiB1c2VkIGluc3RlYWQgb2YgdGhlIHNvY2tldC4gKi9cbiAgcHJpdmF0ZSBodWI/OiBjaHJvbWUucnVudGltZS5Qb3J0O1xuICAvKiogVW50aWwgd2hlbiB0aGUgaGVscGVyIGNvdW50cyBhcyBub3QgaW5zdGFsbGVkICh0aGUgV2ViU29ja2V0IGlzIHVzZWQgbWVhbndoaWxlKS4gKi9cbiAgcHJpdmF0ZSBodWJNaXNzaW5nVW50aWwgPSAwO1xuICAvKiogVGhlIGhlbGxvIHdlbnQgdG8gdGhlIFZTIENvZGUgd2luZG93IHRoYXQgYW5zd2VycyB0aHJvdWdoIHRoZSBoZWxwZXIuICovXG4gIHByaXZhdGUgaHViSGVsbG8gPSBmYWxzZTtcbiAgLyoqIFZTIENvZGUgYW5zd2VycyBxdWVzdGlvbnMgYWJvdXQgcHJvamVjdHMgb3ZlciB0aGUgV2ViU29ja2V0IGxpbmsgKHNlZSBgd2VsY29tZWApLiAqL1xuICBwcml2YXRlIHdzUHJvamVjdHMgPSBmYWxzZTtcbiAgLyoqIFdoYXQgdGhlIGJyb3dzZXIgaGVscGVyIGFuc3dlcnMgYmV5b25kIHRoZSBmaXJzdCB2ZXJzaW9uIChpdHMgYHN0YXR1c2ApLiAqL1xuICBwcml2YXRlIGh1YkZlYXR1cmVzOiBzdHJpbmdbXSA9IFtdO1xuICAvKiogUmVxdWVzdHMgdG8gdGhlIGhlbHBlciAob3IgVlMgQ29kZSkgd2FpdGluZyBmb3IgdGhlaXIgYW5zd2VyLCBieSByZXF1ZXN0IGlkLiAqL1xuICBwcml2YXRlIHJlYWRvbmx5IGh1YlJlcXVlc3RzID0gbmV3IE1hcDxzdHJpbmcsIChyZXBseTogSHViVG9Ccm93c2VyIHwgdW5kZWZpbmVkKSA9PiB2b2lkPigpO1xuICBwcml2YXRlIGNsaWVudD86IENsaWVudEluZm87XG4gIHByaXZhdGUgdG9rZW4/OiBzdHJpbmc7XG4gIHByaXZhdGUgcmV0cnk/OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRUaW1lb3V0PjtcbiAgcHJpdmF0ZSBrZWVwQWxpdmU/OiBSZXR1cm5UeXBlPHR5cGVvZiBzZXRJbnRlcnZhbD47XG4gIHByaXZhdGUgZGVsYXkgPSAxMDAwO1xuICAvKiogQ291bnRzIGNvbm5lY3Rpb24gYXR0ZW1wdHMsIHNvIGEgcHJvYmUgdGhhdCBhIG5ld2VyIGF0dGVtcHQgcmVwbGFjZWQgaXMgZHJvcHBlZC4gKi9cbiAgcHJpdmF0ZSBhdHRlbXB0ID0gMDtcbiAgcHJpdmF0ZSBwcm9iaW5nID0gZmFsc2U7XG4gIC8qKiBGaXJzdCBwb3J0IHRvIHRyeSAoYSBzdG9yZWQgb3ZlcnJpZGUgZXhpc3RzIGZvciB0ZXN0cykuICovXG4gIHByaXZhdGUgYmFzZVBvcnQgPSBERUZBVUxUX0JSSURHRV9QT1JUO1xuICBwcml2YXRlIHJlYWRvbmx5IGxpc3RlbmVycyA9IG5ldyBTZXQ8TGlzdGVuZXI+KCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgc3RhdHVzTGlzdGVuZXJzID0gbmV3IFNldDwoc3RhdHVzOiBCcmlkZ2VTdGF0dXMpID0+IHZvaWQ+KCk7XG4gIHByaXZhdGUgcGFpcldhaXRlcj86IChyZXBseTogU2VydmVyTWVzc2FnZSkgPT4gdm9pZDtcblxuICBvbk1lc3NhZ2UobGlzdGVuZXI6IExpc3RlbmVyKTogdm9pZCB7XG4gICAgdGhpcy5saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgfVxuXG4gIG9uU3RhdHVzKGxpc3RlbmVyOiAoc3RhdHVzOiBCcmlkZ2VTdGF0dXMpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLnN0YXR1c0xpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICB9XG5cbiAgZ2V0IGNvbm5lY3RlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zdGF0dXMuc3RhdGUgPT09ICdjb25uZWN0ZWQnO1xuICB9XG5cbiAgYXN5bmMgc3RhcnQoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3Qgc3RvcmVkID0gKGF3YWl0IGNocm9tZS5zdG9yYWdlLmxvY2FsLmdldChbJ2NsaWVudElkJywgJ3Rva2VuJywgJ3BvcnQnXSkpIGFzIFN0b3JlZDtcbiAgICBsZXQgY2xpZW50SWQgPSBzdG9yZWQuY2xpZW50SWQ7XG4gICAgaWYgKCFjbGllbnRJZCkge1xuICAgICAgY2xpZW50SWQgPSBjcnlwdG8ucmFuZG9tVVVJRCgpO1xuICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuc2V0KHsgY2xpZW50SWQgfSk7XG4gICAgfVxuICAgIHRoaXMuY2xpZW50ID0geyBpZDogY2xpZW50SWQsIGJyb3dzZXI6IGJyb3dzZXJOYW1lKCkgfTtcbiAgICB0aGlzLnRva2VuID0gc3RvcmVkLnRva2VuO1xuICAgIHRoaXMuYmFzZVBvcnQgPSBzdG9yZWQucG9ydCA/PyBERUZBVUxUX0JSSURHRV9QT1JUO1xuICAgIHRoaXMuY29ubmVjdCgpO1xuICB9XG5cbiAgLyoqIENvbm5lY3RzIG5vdyBpZiBub3QgY29ubmVjdGVkIChjYWxsZWQgb24gYW55IHdha2UtdXAgb2YgdGhlIGJhY2tncm91bmQpLiAqL1xuICBlbnN1cmVDb25uZWN0ZWQoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmh1YiAmJiAhdGhpcy5zb2NrZXQgJiYgIXRoaXMucmV0cnkgJiYgIXRoaXMucHJvYmluZykgdGhpcy5jb25uZWN0KCk7XG4gIH1cblxuICBzZW5kKG1lc3NhZ2U6IENsaWVudE1lc3NhZ2UpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5odWIpIHtcbiAgICAgIHRoaXMuaHViLnBvc3RNZXNzYWdlKEpTT04ucGFyc2UoZW5jb2RlSHViKHsgdHlwZTogJ2xpbmsnLCBkYXRhOiBlbmNvZGUobWVzc2FnZSkgfSkpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAodGhpcy5zb2NrZXQ/LnJlYWR5U3RhdGUgIT09IFdlYlNvY2tldC5PUEVOKSByZXR1cm4gZmFsc2U7XG4gICAgdGhpcy5zb2NrZXQuc2VuZChlbmNvZGUobWVzc2FnZSkpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLyoqIFdoZXRoZXIgdGhlIGJyb3dzZXIgaGVscGVyIGlzIGNvbm5lY3RlZCAocHJvamVjdHMgYW5kIHRoZWlyIGNhcHR1cmVzIGdvIHRocm91Z2ggaXQpLiAqL1xuICBnZXQgdmlhSHViKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhIXRoaXMuaHViO1xuICB9XG5cbiAgLyoqXG4gICAqIEFza3MgYWJvdXQgcHJvamVjdHMgYW5kIHRoZWlyIHNhdmVkIGNhcHR1cmVzLCBhbmQgd2FpdHMgZm9yIHRoZSBhbnN3ZXIgd2l0aCB0aGUgc2FtZSByZXF1ZXN0XG4gICAqIGlkOiB0aGUgYnJvd3NlciBoZWxwZXIgYW5zd2Vycywgb3IgZWxzZSB0aGUgVlMgQ29kZSB3aW5kb3cgc2VydmluZyB0aGUgV2ViU29ja2V0IGxpbmsgKHRoZVxuICAgKiBzYW1lIHF1ZXN0aW9ucywgdGhlIHNhbWUgYW5zd2VycykuIFVuZGVmaW5lZCBpZiBuZWl0aGVyIGlzIHRoZXJlIG9yIGFuc3dlcnMgaW4gdGltZS5cbiAgICovXG4gIGh1YlJlcXVlc3Q8VCBleHRlbmRzIEh1YlRvQnJvd3Nlcj4oXG4gICAgbWVzc2FnZTogRXh0cmFjdDxCcm93c2VyVG9IdWIsIHsgcmVxOiBzdHJpbmcgfT4sXG4gICAgdGltZW91dE1zID0gMzBfMDAwLFxuICApOiBQcm9taXNlPFQgfCB1bmRlZmluZWQ+IHtcbiAgICBjb25zdCBodWIgPSB0aGlzLmh1YjtcbiAgICBjb25zdCByZXF1ZXN0ID0gSlNPTi5wYXJzZShlbmNvZGVIdWIobWVzc2FnZSkpIGFzIHR5cGVvZiBtZXNzYWdlO1xuICAgIGNvbnN0IHBvc3QgPSBodWJcbiAgICAgID8gKCkgPT4gaHViLnBvc3RNZXNzYWdlKHJlcXVlc3QpXG4gICAgICA6IHRoaXMud3NQcm9qZWN0cyAmJiB0aGlzLmNvbm5lY3RlZFxuICAgICAgICA/ICgpID0+IHRoaXMuc2VuZCh7IHR5cGU6ICdodWIucmVxdWVzdCcsIHJlcXVlc3QgfSlcbiAgICAgICAgOiB1bmRlZmluZWQ7XG4gICAgaWYgKCFwb3N0KSByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICBjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLmh1YlJlcXVlc3RzLmRlbGV0ZShtZXNzYWdlLnJlcSk7XG4gICAgICAgIHJlc29sdmUodW5kZWZpbmVkKTtcbiAgICAgIH0sIHRpbWVvdXRNcyk7XG4gICAgICB0aGlzLmh1YlJlcXVlc3RzLnNldChtZXNzYWdlLnJlcSwgKHJlcGx5KSA9PiB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICAgIHJlc29sdmUocmVwbHkgYXMgVCB8IHVuZGVmaW5lZCk7XG4gICAgICB9KTtcbiAgICAgIHBvc3QoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBBbiBhbnN3ZXIgdG8gYSByZXF1ZXN0LCBmcm9tIGVpdGhlciBsaW5rLiAqL1xuICBwcml2YXRlIGFuc3dlcmVkKG1lc3NhZ2U6IEh1YlRvQnJvd3Nlcik6IHZvaWQge1xuICAgIGlmICghKCdyZXEnIGluIG1lc3NhZ2UpKSByZXR1cm47XG4gICAgY29uc3Qgd2FpdGluZyA9IHRoaXMuaHViUmVxdWVzdHMuZ2V0KG1lc3NhZ2UucmVxKTtcbiAgICB0aGlzLmh1YlJlcXVlc3RzLmRlbGV0ZShtZXNzYWdlLnJlcSk7XG4gICAgd2FpdGluZz8uKG1lc3NhZ2UpO1xuICB9XG5cbiAgLyoqIFBhaXJzIHdpdGggdGhlIGNvZGUgVlMgQ29kZSBzaG93cy4gKi9cbiAgYXN5bmMgcGFpcihjb2RlOiBzdHJpbmcpOiBQcm9taXNlPEJyaWRnZVN0YXR1cz4ge1xuICAgIC8vIFRocm91Z2ggdGhlIGhlbHBlciwgdGhlIGJyb3dzZXIgaXMgdHJ1c3RlZCB3aXRob3V0IHBhaXJpbmcuXG4gICAgaWYgKHRoaXMuaHViKSByZXR1cm4gdGhpcy5zdGF0dXM7XG4gICAgLy8gV2FpdCBmb3IgYSBjb25uZWN0aW9uIHRoYXQgaXMgc3RpbGwgb3BlbmluZyAob3Igc3RhcnQgb25lKS5cbiAgICBpZiAoIXRoaXMuc29ja2V0ICYmICF0aGlzLnByb2JpbmcpIHRoaXMuY29ubmVjdCgpO1xuICAgIGZvciAoXG4gICAgICBsZXQgaSA9IDA7XG4gICAgICBpIDwgMzAgJiYgKHRoaXMucHJvYmluZyB8fCB0aGlzLnNvY2tldD8ucmVhZHlTdGF0ZSA9PT0gV2ViU29ja2V0LkNPTk5FQ1RJTkcpO1xuICAgICAgaSsrXG4gICAgKSB7XG4gICAgICBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCAxMDApKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmNsaWVudCB8fCAhdGhpcy5zZW5kKHsgdHlwZTogJ3BhaXInLCBjb2RlOiBjb2RlLnRyaW0oKSwgY2xpZW50OiB0aGlzLmNsaWVudCB9KSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc3RhdGU6ICdvZmZsaW5lJyxcbiAgICAgICAgZXJyb3I6ICdWUyBDb2RlIGlzIG5vdCBydW5uaW5nLCBvciBpdHMgYnJvd3NlciBsaW5rIGlzIHR1cm5lZCBvZmYuJyxcbiAgICAgIH07XG4gICAgfVxuICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgbmV3IFByb21pc2U8U2VydmVyTWVzc2FnZSB8IHVuZGVmaW5lZD4oKHJlc29sdmUpID0+IHtcbiAgICAgIHRoaXMucGFpcldhaXRlciA9IHJlc29sdmU7XG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHJlc29sdmUodW5kZWZpbmVkKSwgMTBfMDAwKTtcbiAgICB9KTtcbiAgICB0aGlzLnBhaXJXYWl0ZXIgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHJlcGx5Py50eXBlID09PSAncGFpcmVkJykgcmV0dXJuIHRoaXMuc3RhdHVzO1xuICAgIHJldHVybiB7XG4gICAgICAuLi50aGlzLnN0YXR1cyxcbiAgICAgIGVycm9yOiByZXBseT8udHlwZSA9PT0gJ2Vycm9yJyA/IHJlcGx5Lm1lc3NhZ2UgOiAnTm8gYW5zd2VyIGZyb20gVlMgQ29kZS4nLFxuICAgIH07XG4gIH1cblxuICAvKiogUmVhZHMgdGhlIHN0b3JlZCBwb3J0IGFnYWluIGFuZCByZWNvbm5lY3RzICh0ZXN0cykuICovXG4gIGFzeW5jIHJlY29ubmVjdCgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCBzdG9yZWQgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwuZ2V0KFsncG9ydCcsICd0b2tlbiddKSkgYXMgU3RvcmVkO1xuICAgIHRoaXMuYmFzZVBvcnQgPSBzdG9yZWQucG9ydCA/PyBERUZBVUxUX0JSSURHRV9QT1JUO1xuICAgIHRoaXMudG9rZW4gPSBzdG9yZWQudG9rZW47XG4gICAgdGhpcy5zb2NrZXQ/LmNsb3NlKCk7XG4gICAgdGhpcy5zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgY29uc3QgaHViID0gdGhpcy5odWI7XG4gICAgdGhpcy5odWIgPSB1bmRlZmluZWQ7XG4gICAgaHViPy5kaXNjb25uZWN0KCk7XG4gICAgdGhpcy5kZWxheSA9IDEwMDA7XG4gICAgdGhpcy5jb25uZWN0KCk7XG4gIH1cblxuICBhc3luYyB1bnBhaXIoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdGhpcy50b2tlbiA9IHVuZGVmaW5lZDtcbiAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5yZW1vdmUoJ3Rva2VuJyk7XG4gICAgdGhpcy5zb2NrZXQ/LmNsb3NlKCk7XG4gICAgdGhpcy5zZXRTdGF0dXMoeyBzdGF0ZTogJ3VucGFpcmVkJyB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U3RhdHVzKHN0YXR1czogQnJpZGdlU3RhdHVzKTogdm9pZCB7XG4gICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gICAgZm9yIChjb25zdCBsaXN0ZW5lciBvZiB0aGlzLnN0YXR1c0xpc3RlbmVycykgbGlzdGVuZXIoc3RhdHVzKTtcbiAgfVxuXG4gIHByaXZhdGUgY29ubmVjdChwb3J0PzogbnVtYmVyLCBhdHRlbXB0ID0gMCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJldHJ5KTtcbiAgICB0aGlzLnJldHJ5ID0gdW5kZWZpbmVkO1xuICAgIGlmIChwb3J0ID09PSB1bmRlZmluZWQgJiYgRGF0ZS5ub3coKSA+PSB0aGlzLmh1Yk1pc3NpbmdVbnRpbCAmJiB0aGlzLm9wZW5IdWIoKSkgcmV0dXJuO1xuICAgIGNvbnN0IHRhcmdldCA9IHBvcnQgPz8gdGhpcy5iYXNlUG9ydDtcbiAgICB0aGlzLnNldFN0YXR1cyh7IC4uLnRoaXMuc3RhdHVzLCBzdGF0ZTogdGhpcy50b2tlbiA/ICdjb25uZWN0aW5nJyA6IHRoaXMuc3RhdHVzLnN0YXRlIH0pO1xuICAgIGNvbnN0IGN1cnJlbnQgPSArK3RoaXMuYXR0ZW1wdDtcbiAgICB0aGlzLnByb2JpbmcgPSB0cnVlO1xuICAgIHZvaWQgbGlzdGVuaW5nKHRhcmdldCkudGhlbigodXApID0+IHtcbiAgICAgIGlmIChjdXJyZW50ICE9PSB0aGlzLmF0dGVtcHQpIHJldHVybjtcbiAgICAgIHRoaXMucHJvYmluZyA9IGZhbHNlO1xuICAgICAgaWYgKHVwKSB0aGlzLm9wZW4odGFyZ2V0LCBhdHRlbXB0KTtcbiAgICAgIGVsc2UgdGhpcy5jbG9zZWQodGFyZ2V0LCBhdHRlbXB0LCBmYWxzZSk7XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9wZW4odGFyZ2V0OiBudW1iZXIsIGF0dGVtcHQ6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBzb2NrZXQ6IFdlYlNvY2tldDtcbiAgICB0cnkge1xuICAgICAgc29ja2V0ID0gbmV3IFdlYlNvY2tldChgd3M6Ly8xMjcuMC4wLjE6JHt0YXJnZXR9JHtCUklER0VfUEFUSH1gKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVSZXRyeSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLnNvY2tldCA9IHNvY2tldDtcbiAgICBsZXQgb3BlbmVkID0gZmFsc2U7XG4gICAgc29ja2V0Lm9ub3BlbiA9ICgpID0+IHtcbiAgICAgIG9wZW5lZCA9IHRydWU7XG4gICAgICAvLyBUaGUgcmV0cnkgZGVsYXkgcmVzZXRzIG9ubHkgb25jZSBWUyBDb2RlIGFjY2VwdHMgdXMgKHNlZSBoYW5kbGUpLCBzbyBhIHNlcnZlciB0aGF0IGtlZXBzXG4gICAgICAvLyBjbG9zaW5nIHRoZSBjb25uZWN0aW9uIGdldHMgc2xvd2VyIGFuZCBzbG93ZXIgcmV0cmllcyBpbnN0ZWFkIG9mIG9uZSBwZXIgc2Vjb25kLlxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG4gICAgICAgIC8vIFdpdGhvdXQgYSB0b2tlbiB0aGlzIGFubm91bmNlcyBhbiB1bnBhaXJlZCBicm93c2VyLCBzbyBWUyBDb2RlIGNhbiBvZmZlciB0byBwYWlyIGl0LlxuICAgICAgICBzb2NrZXQuc2VuZChlbmNvZGUoeyB0eXBlOiAnaGVsbG8nLCBjbGllbnQ6IHRoaXMuY2xpZW50LCB0b2tlbjogdGhpcy50b2tlbiA/PyAnJyB9KSk7XG4gICAgICB9XG4gICAgICBpZiAoIXRoaXMudG9rZW4pIHRoaXMuc2V0U3RhdHVzKHsgc3RhdGU6ICd1bnBhaXJlZCcgfSk7XG4gICAgICAvLyBLZWVwcyB0aGUgY29ubmVjdGlvbiAoYW5kIENocm9tZSdzIHNlcnZpY2Ugd29ya2VyKSBhbGl2ZSB3aGlsZSBWUyBDb2RlIHJ1bnMuXG4gICAgICBjbGVhckludGVydmFsKHRoaXMua2VlcEFsaXZlKTtcbiAgICAgIHRoaXMua2VlcEFsaXZlID0gc2V0SW50ZXJ2YWwoKCkgPT4gdGhpcy5zZW5kKHsgdHlwZTogJ3BpbmcnIH0pLCAyMF8wMDApO1xuICAgIH07XG4gICAgc29ja2V0Lm9ubWVzc2FnZSA9IChldmVudCkgPT4ge1xuICAgICAgY29uc3QgbWVzc2FnZSA9IHBhcnNlU2VydmVyTWVzc2FnZShTdHJpbmcoZXZlbnQuZGF0YSkpO1xuICAgICAgaWYgKG1lc3NhZ2UpIHZvaWQgdGhpcy5oYW5kbGUobWVzc2FnZSk7XG4gICAgfTtcbiAgICBzb2NrZXQub25jbG9zZSA9ICgpID0+IHtcbiAgICAgIC8vIEEgc29ja2V0IHdlIGFscmVhZHkgcmVwbGFjZWQgKHJlY29ubmVjdCkgbXVzdCBub3QgdG91Y2ggdGhlIGN1cnJlbnQgb25lLlxuICAgICAgaWYgKHRoaXMuc29ja2V0ICE9PSBzb2NrZXQpIHJldHVybjtcbiAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5rZWVwQWxpdmUpO1xuICAgICAgdGhpcy5zb2NrZXQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLndzUHJvamVjdHMgPSBmYWxzZTtcbiAgICAgIGZvciAoY29uc3Qgd2FpdGluZyBvZiB0aGlzLmh1YlJlcXVlc3RzLnZhbHVlcygpKSB3YWl0aW5nKHVuZGVmaW5lZCk7XG4gICAgICB0aGlzLmh1YlJlcXVlc3RzLmNsZWFyKCk7XG4gICAgICB0aGlzLmNsb3NlZCh0YXJnZXQsIGF0dGVtcHQsIG9wZW5lZCk7XG4gICAgfTtcbiAgfVxuXG4gIC8qKiBOb3RoaW5nIChtb3JlKSBvbiB0aGlzIHBvcnQ6IHRyeSB0aGUgbmV4dCBvbmUsIG9yIHdhaXQgYW5kIHN0YXJ0IG92ZXIuICovXG4gIHByaXZhdGUgY2xvc2VkKHRhcmdldDogbnVtYmVyLCBhdHRlbXB0OiBudW1iZXIsIG9wZW5lZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICghb3BlbmVkICYmIGF0dGVtcHQgPCBCUklER0VfUE9SVF9SQU5HRSAtIDEpIHtcbiAgICAgIC8vIE5vdGhpbmcgb24gdGhpcyBwb3J0OiB0cnkgdGhlIG5leHQgb25lIChhbm90aGVyIFZTIENvZGUgaW5zdGFsbCBtYXkgdXNlIGl0KS5cbiAgICAgIHRoaXMuY29ubmVjdCh0YXJnZXQgKyAxLCBhdHRlbXB0ICsgMSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnN0YXR1cy5zdGF0ZSAhPT0gJ3VucGFpcmVkJykgdGhpcy5zZXRTdGF0dXMoeyBzdGF0ZTogJ29mZmxpbmUnIH0pO1xuICAgIHRoaXMuc2NoZWR1bGVSZXRyeSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZVJldHJ5KCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnJldHJ5KTtcbiAgICB0aGlzLnJldHJ5ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnJldHJ5ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5jb25uZWN0KCk7XG4gICAgfSwgdGhpcy5kZWxheSk7XG4gICAgLy8gVW5wYWlyZWQsIHJldHJ5IG9mdGVuOiBWUyBDb2RlJ3MgUGFpciBjbGljayBzaG91bGQgZmluZCB0aGlzIGJyb3dzZXIgd2l0aGluIHNlY29uZHMuXG4gICAgdGhpcy5kZWxheSA9IE1hdGgubWluKHRoaXMuZGVsYXkgKiAyLCB0aGlzLnRva2VuID8gMzBfMDAwIDogNV8wMDApO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbm5lY3RzIHRocm91Z2ggdGhlIGJyb3dzZXIgaGVscGVyLCBpZiBpdCBpcyBpbnN0YWxsZWQuIEEgaGVscGVyIHRoYXQgaXNuJ3QgaW5zdGFsbGVkXG4gICAqIGRpc2Nvbm5lY3RzIGF0IG9uY2U7IHRoZSBXZWJTb2NrZXQgaXMgdXNlZCB0aGVuLCBhbmQgdGhlIGhlbHBlciBsb29rZWQgZm9yIGFnYWluIGxhdGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBvcGVuSHViKCk6IGJvb2xlYW4ge1xuICAgIGxldCBwb3J0OiBjaHJvbWUucnVudGltZS5Qb3J0O1xuICAgIHRyeSB7XG4gICAgICBwb3J0ID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdE5hdGl2ZShIVUJfSE9TVF9OQU1FKTtcbiAgICB9IGNhdGNoIHtcbiAgICAgIHRoaXMuaHViTWlzc2luZ1VudGlsID0gRGF0ZS5ub3coKSArIEhVQl9NSVNTSU5HX01TO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICB0aGlzLmh1YiA9IHBvcnQ7XG4gICAgdGhpcy5odWJIZWxsbyA9IGZhbHNlO1xuICAgIGxldCBhbnN3ZXJlZCA9IGZhbHNlO1xuICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKChyYXc6IHVua25vd24pID0+IHtcbiAgICAgIGFuc3dlcmVkID0gdHJ1ZTtcbiAgICAgIGNvbnN0IG1lc3NhZ2UgPSBwYXJzZUh1YlRvQnJvd3NlcihyYXcpO1xuICAgICAgaWYgKCFtZXNzYWdlKSByZXR1cm47XG4gICAgICBpZiAoJ3JlcScgaW4gbWVzc2FnZSkge1xuICAgICAgICB0aGlzLmFuc3dlcmVkKG1lc3NhZ2UpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAobWVzc2FnZS50eXBlID09PSAnbGluaycpIHtcbiAgICAgICAgY29uc3QgaW5uZXIgPSBwYXJzZVNlcnZlck1lc3NhZ2UobWVzc2FnZS5kYXRhKTtcbiAgICAgICAgaWYgKGlubmVyKSB2b2lkIHRoaXMuaGFuZGxlKGlubmVyKTtcbiAgICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAncmVsaW5rJykge1xuICAgICAgICB0aGlzLmh1YkhlbGxvID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3N0YXR1cycpIHtcbiAgICAgICAgdGhpcy5odWJGZWF0dXJlcyA9IG1lc3NhZ2UuZmVhdHVyZXMgPz8gW107XG4gICAgICAgIGlmICghbWVzc2FnZS52c2NvZGUpIHtcbiAgICAgICAgICB0aGlzLmh1YkhlbGxvID0gZmFsc2U7XG4gICAgICAgICAgLy8gUHJvamVjdHMgc3RpbGwgd29yazogdGhlIGhlbHBlciBmaW5kcyBhZ2VudG11eCdzIHdpdGhvdXQgVlMgQ29kZS5cbiAgICAgICAgICB0aGlzLnNldFN0YXR1cyh7XG4gICAgICAgICAgICBzdGF0ZTogJ29mZmxpbmUnLFxuICAgICAgICAgICAgdmlhOiAnaHViJyxcbiAgICAgICAgICAgIHByb2plY3RzOiB0cnVlLFxuICAgICAgICAgICAgZmVhdHVyZXM6IHRoaXMuaHViRmVhdHVyZXMsXG4gICAgICAgICAgICBlcnJvcjogJ1ZTIENvZGUgaXMgbm90IHJ1bm5pbmcuJyxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICghdGhpcy5odWJIZWxsbyAmJiB0aGlzLmNsaWVudCkge1xuICAgICAgICAgIHRoaXMuaHViSGVsbG8gPSB0cnVlO1xuICAgICAgICAgIHRoaXMuZGVsYXkgPSAxMDAwO1xuICAgICAgICAgIHRoaXMuc2V0U3RhdHVzKHtcbiAgICAgICAgICAgIC4uLnRoaXMuc3RhdHVzLFxuICAgICAgICAgICAgc3RhdGU6ICdjb25uZWN0aW5nJyxcbiAgICAgICAgICAgIHZpYTogJ2h1YicsXG4gICAgICAgICAgICBwcm9qZWN0czogdHJ1ZSxcbiAgICAgICAgICAgIGZlYXR1cmVzOiB0aGlzLmh1YkZlYXR1cmVzLFxuICAgICAgICAgICAgZXJyb3I6IHVuZGVmaW5lZCxcbiAgICAgICAgICB9KTtcbiAgICAgICAgICB0aGlzLnNlbmQoeyB0eXBlOiAnaGVsbG8nLCBjbGllbnQ6IHRoaXMuY2xpZW50LCB0b2tlbjogJycgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBwb3J0Lm9uRGlzY29ubmVjdC5hZGRMaXN0ZW5lcigoKSA9PiB7XG4gICAgICAvLyBSZWFkIGl0LCBvciBDaHJvbWUgbG9ncyBpdCBhcyB1bmNoZWNrZWQuXG4gICAgICBjb25zdCBlcnJvciA9IGNocm9tZS5ydW50aW1lLmxhc3RFcnJvcj8ubWVzc2FnZTtcbiAgICAgIGlmICh0aGlzLmh1YiAhPT0gcG9ydCkgcmV0dXJuO1xuICAgICAgdGhpcy5odWIgPSB1bmRlZmluZWQ7XG4gICAgICBjbGVhckludGVydmFsKHRoaXMua2VlcEFsaXZlKTtcbiAgICAgIGZvciAoY29uc3Qgd2FpdGluZyBvZiB0aGlzLmh1YlJlcXVlc3RzLnZhbHVlcygpKSB3YWl0aW5nKHVuZGVmaW5lZCk7XG4gICAgICB0aGlzLmh1YlJlcXVlc3RzLmNsZWFyKCk7XG4gICAgICBpZiAoIWFuc3dlcmVkKSB7XG4gICAgICAgIC8vIE5vdCBpbnN0YWxsZWQgKG9yIGl0IGZhaWxlZCB0byBzdGFydCk6IHVzZSB0aGUgV2ViU29ja2V0IGZvciBhIHdoaWxlLlxuICAgICAgICB0aGlzLmh1Yk1pc3NpbmdVbnRpbCA9IERhdGUubm93KCkgKyBIVUJfTUlTU0lOR19NUztcbiAgICAgICAgaWYgKGVycm9yKSBjb25zb2xlLmluZm8oYElua3NwZWN0OiBicm93c2VyIGhlbHBlciBub3QgYXZhaWxhYmxlICgke2Vycm9yfSkuYCk7XG4gICAgICAgIHRoaXMuY29ubmVjdCgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXR1cyh7IHN0YXRlOiAnb2ZmbGluZScsIHZpYTogJ2h1YicgfSk7XG4gICAgICB0aGlzLnNjaGVkdWxlUmV0cnkoKTtcbiAgICB9KTtcbiAgICAvLyBLZWVwcyB0aGUgaGVscGVyIChhbmQgQ2hyb21lJ3Mgc2VydmljZSB3b3JrZXIpIGFsaXZlLlxuICAgIGNsZWFySW50ZXJ2YWwodGhpcy5rZWVwQWxpdmUpO1xuICAgIHRoaXMua2VlcEFsaXZlID0gc2V0SW50ZXJ2YWwoXG4gICAgICAoKSA9PiBwb3J0LnBvc3RNZXNzYWdlKEpTT04ucGFyc2UoZW5jb2RlSHViKHsgdHlwZTogJ3BpbmcnIH0pKSksXG4gICAgICAyMF8wMDAsXG4gICAgKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgYXN5bmMgaGFuZGxlKG1lc3NhZ2U6IFNlcnZlck1lc3NhZ2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAncGFpcmVkJykge1xuICAgICAgdGhpcy50b2tlbiA9IG1lc3NhZ2UudG9rZW47XG4gICAgICBhd2FpdCBjaHJvbWUuc3RvcmFnZS5sb2NhbC5zZXQoeyB0b2tlbjogbWVzc2FnZS50b2tlbiB9KTtcbiAgICAgIHRoaXMucGFpcldhaXRlcj8uKG1lc3NhZ2UpO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnd2VsY29tZScpIHtcbiAgICAgIHRoaXMuZGVsYXkgPSAxMDAwO1xuICAgICAgdGhpcy53c1Byb2plY3RzID0gIXRoaXMuaHViICYmICEhbWVzc2FnZS5mZWF0dXJlcz8uaW5jbHVkZXMoJ2h1YicpO1xuICAgICAgdGhpcy5zZXRTdGF0dXMoe1xuICAgICAgICBzdGF0ZTogJ2Nvbm5lY3RlZCcsXG4gICAgICAgIHBlZXI6IG1lc3NhZ2UucGVlcixcbiAgICAgICAgdmlhOiB0aGlzLmh1YiA/ICdodWInIDogJ3dzJyxcbiAgICAgICAgcHJvamVjdHM6ICEhdGhpcy5odWIgfHwgdGhpcy53c1Byb2plY3RzLFxuICAgICAgICBmZWF0dXJlczogdGhpcy5odWIgPyB0aGlzLmh1YkZlYXR1cmVzIDogdGhpcy53c1Byb2plY3RzID8gWy4uLkhVQl9GRUFUVVJFU10gOiBbXSxcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAobWVzc2FnZS50eXBlID09PSAnaHViLnJlcGx5Jykge1xuICAgICAgY29uc3QgcmVwbHkgPSBwYXJzZUh1YlRvQnJvd3NlcihtZXNzYWdlLnJlcGx5KTtcbiAgICAgIGlmIChyZXBseSkgdGhpcy5hbnN3ZXJlZChyZXBseSk7XG4gICAgfSBlbHNlIGlmIChtZXNzYWdlLnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAgIGlmIChtZXNzYWdlLmNvZGUgPT09ICd1bnBhaXJlZCcpIHtcbiAgICAgICAgdGhpcy50b2tlbiA9IHVuZGVmaW5lZDtcbiAgICAgICAgYXdhaXQgY2hyb21lLnN0b3JhZ2UubG9jYWwucmVtb3ZlKCd0b2tlbicpO1xuICAgICAgICB0aGlzLnNldFN0YXR1cyh7IHN0YXRlOiAndW5wYWlyZWQnLCBlcnJvcjogbWVzc2FnZS5tZXNzYWdlIH0pO1xuICAgICAgfVxuICAgICAgdGhpcy5wYWlyV2FpdGVyPy4obWVzc2FnZSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgbGlzdGVuZXIgb2YgdGhpcy5saXN0ZW5lcnMpIGxpc3RlbmVyKG1lc3NhZ2UpO1xuICB9XG59XG4iLCAiLy8gRXZlcnkga2V5Ym9hcmQgc2hvcnRjdXQgb2YgVlMgQ29kZSBCcm93c2VyIGFuZCB0aGUgSW5rc3BlY3QgYnJvd3NlciBleHRlbnNpb24sIGluIG9uZSByZWdpc3RyeS5cbi8vIFZTIENvZGUncyBicm93c2VyIHdlYnZpZXcgYW5kIHRoZSBleHRlbnNpb24ncyBwYWdlIHRvb2xiYXIgYm90aCBkaXNwYXRjaCB0aGVtLCBzbyBhIGtleSByZW1hcHBlZFxuLy8gaW4gZWl0aGVyICh0aGUgYHZzY29kZUJyb3dzZXIuc2hvcnRjdXRzYCBzZXR0aW5nLCBvciB0aGUgdG9vbGJhcidzIHNob3J0Y3V0cyBwYW5lbCkgd29ya3MgaW5cbi8vIGJvdGg7IHRoZSBsaW5rIGtlZXBzIHRoZSB0d28gaW4gc3luYy4gS2V5cyBhcmUgaW4gVlMgQ29kZSBrZXliaW5kaW5nIHN5bnRheCAoYGN0cmwrc2hpZnQrdGApLlxuXG4vKipcbiAqIFdoZXJlIGEgc2hvcnRjdXQgYXBwbGllcy4gYGdsb2JhbGAgd29ya3MgZXZlcnl3aGVyZSBpbiB0aGUgYnJvd3NlcjsgZWFjaCBtb2RlJ3Mgc2NvcGUgd29ya3NcbiAqIHdoaWxlIHRoYXQgbW9kZSBpcyBvbiwgYW5kIHdpbnMgb3ZlciBgZ2xvYmFsYC5cbiAqL1xuZXhwb3J0IHR5cGUgU2hvcnRjdXRTY29wZSA9XG4gIHwgJ2dsb2JhbCdcbiAgfCAnaW5zcGVjdCdcbiAgfCAnZHJhdydcbiAgfCAnc2NyZWVuc2hvdCdcbiAgfCAnZGV2dG9vbHMnXG4gIHwgJ2RldmljZSdcbiAgfCAnbWVhc3VyZSdcbiAgfCAnZXllZHJvcHBlcidcbiAgfCAnb3ZlcmxheSdcbiAgfCAndHdlYWsnXG4gIHwgJ3JlY29yZCdcbiAgfCAnYTExeSdcbiAgLyoqIFdoaWxlIHRoZSBzZW5kIGRpYWxvZyBpcyBvcGVuIGFmdGVyIGEgY2FwdHVyZSAoYm90aCBwcm9kdWN0cykuICovXG4gIHwgJ3NlbmQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFNob3J0Y3V0QWN0aW9uIHtcbiAgaWQ6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbiAgc2NvcGU6IFNob3J0Y3V0U2NvcGU7XG4gIC8qKiBEZWZhdWx0IGtleXMgb24gV2luZG93cyBhbmQgTGludXguICovXG4gIGtleXM6IHJlYWRvbmx5IHN0cmluZ1tdO1xuICAvKiogRGVmYXVsdCBrZXlzIG9uIG1hY09TIChkZWZhdWx0cyB0byBga2V5c2Agd2l0aCBDdHJsIGFzIENtZCkuICovXG4gIG1hYz86IHJlYWRvbmx5IHN0cmluZ1tdO1xuICAvKiogQSBWUyBDb2RlIGNvbW1hbmQgdGhlIGhvc3QgcnVuczsgd2l0aG91dCBpdCwgdGhlIHdlYnZpZXcgaGFuZGxlcyB0aGUgYWN0aW9uIGl0c2VsZi4gKi9cbiAgY29tbWFuZD86IHN0cmluZztcbiAgLyoqXG4gICAqIEFsc28gYSBWUyBDb2RlIGtleWJpbmRpbmcgKGBjb250cmlidXRlcy5rZXliaW5kaW5nc2AsIGRlZmF1bHQga2V5cyBvbmx5KSwgc28gaXQgd29ya3Mgb3V0c2lkZVxuICAgKiB0aGUgYnJvd3NlciB0b28uIEluc2lkZSB0aGUgYnJvd3NlciB0aGUgd2VidmlldyBoYW5kbGVzIHRoZSBrZXkgZmlyc3QsIHNvIGl0IHJ1bnMgb25jZS5cbiAgICovXG4gIGV2ZXJ5d2hlcmU/OiBib29sZWFuO1xufVxuXG5leHBvcnQgY29uc3QgU0NPUEVfTEFCRUxTOiBSZWNvcmQ8U2hvcnRjdXRTY29wZSwgc3RyaW5nPiA9IHtcbiAgZ2xvYmFsOiAnQnJvd3NlcicsXG4gIGluc3BlY3Q6ICdFbGVtZW50IHBpY2tlcicsXG4gIGRyYXc6ICdEcmF3aW5nJyxcbiAgc2NyZWVuc2hvdDogJ1NjcmVlbnNob3QnLFxuICBkZXZ0b29sczogJ0NvbnNvbGUgYW5kIG5ldHdvcmsnLFxuICBkZXZpY2U6ICdEZXZpY2UnLFxuICBtZWFzdXJlOiAnTWVhc3VyZScsXG4gIGV5ZWRyb3BwZXI6ICdFeWVkcm9wcGVyJyxcbiAgb3ZlcmxheTogJ0Rlc2lnbiBvdmVybGF5JyxcbiAgdHdlYWs6ICdDU1MgdHdlYWsnLFxuICByZWNvcmQ6ICdSZWNvcmQnLFxuICBhMTF5OiAnQWNjZXNzaWJpbGl0eSBjaGVjaycsXG4gIHNlbmQ6ICdTZW5kIGRpYWxvZycsXG59O1xuXG5jb25zdCBjbWQgPSAobmFtZTogc3RyaW5nKSA9PiBgdnNjb2RlQnJvd3Nlci4ke25hbWV9YDtcblxuLyoqIEV2ZXJ5IGFjdGlvbiB3aXRoIGl0cyBkZWZhdWx0IGtleXMuIFVuYm91bmQgYWN0aW9ucyBzdGlsbCBhcHBlYXIgYW5kIGNhbiBiZSBnaXZlbiBrZXlzLiAqL1xuZXhwb3J0IGNvbnN0IFNIT1JUQ1VUX0FDVElPTlM6IHJlYWRvbmx5IFNob3J0Y3V0QWN0aW9uW10gPSBbXG4gIC8vIFRhYnMgYW5kIHdpbmRvd3MuXG4gIHsgaWQ6ICd0YWIubmV3JywgbGFiZWw6ICdOZXcgdGFiJywgc2NvcGU6ICdnbG9iYWwnLCBrZXlzOiBbJ2N0cmwrdCddLCBjb21tYW5kOiBjbWQoJ25ld1RhYicpIH0sXG4gIHtcbiAgICBpZDogJ3RhYi5jbG9zZScsXG4gICAgbGFiZWw6ICdDbG9zZSB0YWInLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrdycsICdjdHJsK2Y0J10sXG4gICAgY29tbWFuZDogY21kKCdjbG9zZVRhYicpLFxuICB9LFxuICB7XG4gICAgaWQ6ICd0YWIucmVvcGVuJyxcbiAgICBsYWJlbDogJ1Jlb3BlbiBjbG9zZWQgdGFiJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3NoaWZ0K3QnXSxcbiAgICBjb21tYW5kOiBjbWQoJ3Jlb3BlbkNsb3NlZFRhYicpLFxuICB9LFxuICB7XG4gICAgaWQ6ICd0YWIubmV4dCcsXG4gICAgbGFiZWw6ICdOZXh0IHRhYicsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnY3RybCt0YWInLCAnY3RybCtwYWdlZG93biddLFxuICAgIG1hYzogWydjdHJsK3RhYicsICdjbWQrYWx0K3JpZ2h0J10sXG4gICAgY29tbWFuZDogY21kKCduZXh0VGFiJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ3RhYi5wcmV2aW91cycsXG4gICAgbGFiZWw6ICdQcmV2aW91cyB0YWInLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrc2hpZnQrdGFiJywgJ2N0cmwrcGFnZXVwJ10sXG4gICAgbWFjOiBbJ2N0cmwrc2hpZnQrdGFiJywgJ2NtZCthbHQrbGVmdCddLFxuICAgIGNvbW1hbmQ6IGNtZCgncHJldmlvdXNUYWInKSxcbiAgfSxcbiAge1xuICAgIGlkOiAndGFiLmR1cGxpY2F0ZScsXG4gICAgbGFiZWw6ICdEdXBsaWNhdGUgdGFiJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogW10sXG4gICAgY29tbWFuZDogY21kKCdkdXBsaWNhdGVUYWInKSxcbiAgfSxcbiAge1xuICAgIGlkOiAndGFiLnByaXZhdGUnLFxuICAgIGxhYmVsOiAnTmV3IHByaXZhdGUgdGFiJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3NoaWZ0K24nXSxcbiAgICBjb21tYW5kOiBjbWQoJ25ld1ByaXZhdGVUYWInKSxcbiAgfSxcbiAge1xuICAgIGlkOiAnd2luZG93Lm5ldycsXG4gICAgbGFiZWw6ICdOZXcgd2luZG93JyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK24nXSxcbiAgICBjb21tYW5kOiBjbWQoJ25ld1dpbmRvdycpLFxuICB9LFxuICAvLyBOYXZpZ2F0aW9uLlxuICB7XG4gICAgaWQ6ICduYXYuYWRkcmVzcycsXG4gICAgbGFiZWw6ICdGb2N1cyB0aGUgYWRkcmVzcyBiYXInLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrbCcsICdhbHQrZCddLFxuICAgIG1hYzogWydjbWQrbCcsICdhbHQrZCddLFxuICAgIGNvbW1hbmQ6IGNtZCgnZm9jdXNBZGRyZXNzQmFyJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ25hdi5iYWNrJyxcbiAgICBsYWJlbDogJ0JhY2snLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2FsdCtsZWZ0J10sXG4gICAgbWFjOiBbJ2NtZCtbJ10sXG4gICAgY29tbWFuZDogY21kKCdnb0JhY2snKSxcbiAgfSxcbiAge1xuICAgIGlkOiAnbmF2LmZvcndhcmQnLFxuICAgIGxhYmVsOiAnRm9yd2FyZCcsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnYWx0K3JpZ2h0J10sXG4gICAgbWFjOiBbJ2NtZCtdJ10sXG4gICAgY29tbWFuZDogY21kKCdnb0ZvcndhcmQnKSxcbiAgfSxcbiAge1xuICAgIGlkOiAnbmF2LnJlbG9hZCcsXG4gICAgbGFiZWw6ICdSZWxvYWQnLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrcicsICdmNSddLFxuICAgIG1hYzogWydjbWQrciddLFxuICAgIGNvbW1hbmQ6IGNtZCgncmVsb2FkJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ25hdi5oYXJkUmVsb2FkJyxcbiAgICBsYWJlbDogJ0hhcmQgcmVsb2FkJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3NoaWZ0K3InLCAnY3RybCtmNSddLFxuICAgIG1hYzogWydjbWQrc2hpZnQrciddLFxuICAgIGNvbW1hbmQ6IGNtZCgnaGFyZFJlbG9hZCcpLFxuICB9LFxuICB7IGlkOiAnbmF2LnN0b3AnLCBsYWJlbDogJ1N0b3AgbG9hZGluZycsIHNjb3BlOiAnZ2xvYmFsJywga2V5czogW10sIGNvbW1hbmQ6IGNtZCgnc3RvcCcpIH0sXG4gIHtcbiAgICBpZDogJ25hdi5ob21lJyxcbiAgICBsYWJlbDogJ0hvbWUgcGFnZScsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnYWx0K2hvbWUnXSxcbiAgICBtYWM6IFsnY21kK3NoaWZ0K2gnXSxcbiAgICBjb21tYW5kOiBjbWQoJ2dvSG9tZScpLFxuICB9LFxuICAvLyBQYWdlLlxuICB7XG4gICAgaWQ6ICdwYWdlLmZpbmQnLFxuICAgIGxhYmVsOiAnRmluZCBpbiBwYWdlJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK2YnXSxcbiAgICBjb21tYW5kOiBjbWQoJ2ZpbmQnKSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGFnZS56b29tSW4nLFxuICAgIGxhYmVsOiAnWm9vbSBpbicsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnY3RybCs9JywgJ2N0cmwrc2hpZnQrPSddLFxuICAgIGNvbW1hbmQ6IGNtZCgnem9vbUluJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BhZ2Uuem9vbU91dCcsXG4gICAgbGFiZWw6ICdab29tIG91dCcsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnY3RybCstJ10sXG4gICAgY29tbWFuZDogY21kKCd6b29tT3V0JyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BhZ2Uuem9vbVJlc2V0JyxcbiAgICBsYWJlbDogJ1Jlc2V0IHpvb20nLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrMCddLFxuICAgIGNvbW1hbmQ6IGNtZCgnem9vbVJlc2V0JyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BhZ2UuYm9va21hcmsnLFxuICAgIGxhYmVsOiAnQm9va21hcmsgdGhpcyBwYWdlJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK2QnXSxcbiAgICBjb21tYW5kOiBjbWQoJ2Jvb2ttYXJrUGFnZScpLFxuICB9LFxuICB7XG4gICAgaWQ6ICdwYWdlLnNvdXJjZScsXG4gICAgbGFiZWw6ICdWaWV3IHBhZ2Ugc291cmNlJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3UnXSxcbiAgICBtYWM6IFsnY21kK2FsdCt1J10sXG4gICAgY29tbWFuZDogY21kKCd2aWV3U291cmNlJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BhZ2UucGRmJyxcbiAgICBsYWJlbDogJ1NhdmUgcGFnZSBhcyBQREYnLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICAvLyBDdHJsK1AgaXMgVlMgQ29kZSdzIFF1aWNrIE9wZW46IGZyb20gdGhlIG1lbnUgKG9yIGEga2V5IG9mIHlvdXIgb3duKS5cbiAgICBrZXlzOiBbXSxcbiAgICBjb21tYW5kOiBjbWQoJ3NhdmVQZGYnKSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGFnZS5jb3B5VXJsJyxcbiAgICBsYWJlbDogJ0NvcHkgcGFnZSBhZGRyZXNzJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3NoaWZ0K2wnXSxcbiAgICBjb21tYW5kOiBjbWQoJ2NvcHlVcmwnKSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGFnZS5leHRlcm5hbCcsXG4gICAgbGFiZWw6ICdPcGVuIGluIHN5c3RlbSBicm93c2VyJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogW10sXG4gICAgY29tbWFuZDogY21kKCdvcGVuSW5TeXN0ZW1Ccm93c2VyJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ3BhZ2UuZGV2dG9vbHMnLFxuICAgIGxhYmVsOiAnT3BlbiBEZXZUb29scycsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnZjEyJ10sXG4gICAgY29tbWFuZDogY21kKCdvcGVuRGV2VG9vbHMnKSxcbiAgfSxcbiAge1xuICAgIGlkOiAncGFnZS5jb250ZXh0VG9BZ2VudCcsXG4gICAgbGFiZWw6ICdTZW5kIHBhZ2UgY29udGV4dCB0byBhZ2VudCcsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnY3RybCthbHQrZW50ZXInXSxcbiAgICBjb21tYW5kOiBjbWQoJ3NlbmRQYWdlQ29udGV4dFRvQ2hhdCcpLFxuICB9LFxuICAvLyBBZ2VudC5cbiAge1xuICAgIGlkOiAnYWdlbnQuc2hvd0NvbnRleHQnLFxuICAgIGxhYmVsOiAnU2hvdyBhZ2VudCBjb250ZXh0JyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3NoaWZ0K2FsdCthJ10sXG4gICAgY29tbWFuZDogY21kKCdzaG93QWdlbnRDb250ZXh0JyksXG4gICAgZXZlcnl3aGVyZTogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIGlkOiAnYWdlbnQuc2VuZExhdGVzdCcsXG4gICAgbGFiZWw6ICdTZW5kIHRoZSBsYXRlc3QgY2FwdHVyZSB0byB0aGUgYWdlbnQnLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrc2hpZnQrYWx0K3YnXSxcbiAgICBjb21tYW5kOiBjbWQoJ3NlbmRMYXRlc3RDb250ZXh0JyksXG4gICAgZXZlcnl3aGVyZTogdHJ1ZSxcbiAgfSxcbiAgLy8gSW50ZXJuYWwgcGFnZXMgYW5kIHBhbmVscy5cbiAge1xuICAgIGlkOiAnb3Blbi5oaXN0b3J5JyxcbiAgICBsYWJlbDogJ0hpc3RvcnknLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwraCddLFxuICAgIG1hYzogWydjbWQreSddLFxuICAgIGNvbW1hbmQ6IGNtZCgnc2hvd0hpc3RvcnknKSxcbiAgfSxcbiAge1xuICAgIGlkOiAnb3Blbi5kb3dubG9hZHMnLFxuICAgIGxhYmVsOiAnRG93bmxvYWRzJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAgLy8gQ3RybCtKIGlzIFZTIENvZGUncyBwYW5lbC5cbiAgICBrZXlzOiBbJ3NoaWZ0K2FsdCtsJ10sXG4gICAgY29tbWFuZDogY21kKCdzaG93RG93bmxvYWRzJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ29wZW4uYm9va21hcmtzJyxcbiAgICBsYWJlbDogJ0Jvb2ttYXJrIG1hbmFnZXInLFxuICAgIHNjb3BlOiAnZ2xvYmFsJyxcbiAgICBrZXlzOiBbJ2N0cmwrYWx0K2InXSxcbiAgICBjb21tYW5kOiBjbWQoJ3Nob3dCb29rbWFya3MnKSxcbiAgfSxcbiAge1xuICAgIGlkOiAnb3Blbi5ib29rbWFya3NCYXInLFxuICAgIGxhYmVsOiAnU2hvdyBvciBoaWRlIHRoZSBib29rbWFya3MgYmFyJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK3NoaWZ0K2InXSxcbiAgfSxcbiAgLy8gQ3RybCtLIHN0YXJ0cyBWUyBDb2RlJ3Mga2V5IGNob3JkcywgYW5kIHdlYiBhcHBzIHVzZSBpdCAoR2l0SHViLCBTbGFjay4uLikuXG4gIHsgaWQ6ICdvcGVuLnF1aWNrQWN0aW9ucycsIGxhYmVsOiAnUXVpY2sgYWN0aW9ucycsIHNjb3BlOiAnZ2xvYmFsJywga2V5czogWydjdHJsK3NoaWZ0K2snXSB9LFxuICB7XG4gICAgaWQ6ICdvcGVuLnNob3J0Y3V0cycsXG4gICAgbGFiZWw6ICdDaGFuZ2Uga2V5Ym9hcmQgc2hvcnRjdXRzJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAga2V5czogWydjdHJsK2FsdCtrJ10sXG4gICAgY29tbWFuZDogY21kKCdlZGl0U2hvcnRjdXRzJyksXG4gIH0sXG4gIHtcbiAgICBpZDogJ29wZW4uY2hlYXRTaGVldCcsXG4gICAgbGFiZWw6ICdLZXlib2FyZCBzaG9ydGN1dHMgb2YgdGhpcyBtb2RlJyxcbiAgICBzY29wZTogJ2dsb2JhbCcsXG4gICAgLy8gQ3RybCsvIGNvbW1lbnRzIGNvZGUgaW4gd2ViIGVkaXRvcnMuIE9uIG1hY09TLCBDbWQrU2hpZnQrLyBpcyB0aGUgc3lzdGVtIEhlbHAgc2VhcmNoLlxuICAgIGtleXM6IFsnY3RybCtzaGlmdCsvJ10sXG4gICAgbWFjOiBbJ2NtZCthbHQrLyddLFxuICB9LFxuICAvLyBNb2Rlcy5cbiAgLy8gTW9kZXMgYXJlIEFsdCtTaGlmdCtsZXR0ZXI6IFZTIENvZGUga2VlcHMgaXRzIHZpZXcga2V5cyAoQ3RybCtTaGlmdCtFL0QvTS9VL08vUy4uLikgd2hpbGVcbiAgLy8gdGhlIGJyb3dzZXIgaGFzIGZvY3VzLCBhbmQgQ2hyb21lIGtlZXBzIGl0cyBEZXZUb29scyBrZXlzIChDdHJsK1NoaWZ0K0MvSi9JL00pLiBDaHJvbWVcbiAgLy8gaXRzZWxmIHVzZXMgQWx0K1NoaWZ0K1QvQi9BL0k7IHRoZSBjYXB0dXJlIHBvcHVwIHVzZXMgQy9YL1MvRCwgdGhlIHRvb2xiYXIgSy5cbiAgeyBpZDogJ21vZGUuaW5zcGVjdCcsIGxhYmVsOiAnRWxlbWVudCBwaWNrZXInLCBzY29wZTogJ2dsb2JhbCcsIGtleXM6IFsnc2hpZnQrYWx0K2UnXSB9LFxuICB7IGlkOiAnbW9kZS5kcmF3JywgbGFiZWw6ICdEcmF3IG9uIHRoZSBwYWdlJywgc2NvcGU6ICdnbG9iYWwnLCBrZXlzOiBbJ3NoaWZ0K2FsdCt3J10gfSxcbiAgeyBpZDogJ21vZGUuc2NyZWVuc2hvdCcsIGxhYmVsOiAnU2NyZWVuc2hvdCcsIHNjb3BlOiAnZ2xvYmFsJywga2V5czogWydzaGlmdCthbHQrZyddIH0sXG4gIHtcbiAgICBpZDogJ21vZGUuZGV2dG9vbHMnLFxuICAgIGxhYmVsOiAnQ29uc29sZSBhbmQgbmV0d29yaycsXG4gICAgc2NvcGU6ICdnbG9iYWwnLFxuICAgIGtleXM6IFsnc2hpZnQrYWx0K2onXSxcbiAgfSxcbiAgeyBpZDogJ21vZGUuZGV2aWNlJywgbGFiZWw6ICdEZXZpY2UgdG9vbGJhcicsIHNjb3BlOiAnZ2xvYmFsJywga2V5czogWydzaGlmdCthbHQrbSddIH0sXG4gIHsgaWQ6ICdtb2RlLm1lYXN1cmUnLCBsYWJlbDogJ01lYXN1cmUnLCBzY29wZTogJ2dsb2JhbCcsIGtleXM6IFsnc2hpZnQrYWx0K3UnXSB9LFxuICB7IGlkOiAnbW9kZS5leWVkcm9wcGVyJywgbGFiZWw6ICdFeWVkcm9wcGVyJywgc2NvcGU6ICdnbG9iYWwnLCBrZXlzOiBbJ3NoaWZ0K2FsdCt5J10gfSxcbiAgeyBpZDogJ21vZGUub3ZlcmxheScsIGxhYmVsOiAnRGVzaWduIG92ZXJsYXknLCBzY29wZTogJ2dsb2JhbCcsIGtleXM6IFsnc2hpZnQrYWx0K28nXSB9LFxuICB7IGlkOiAnbW9kZS50d2VhaycsIGxhYmVsOiAnQ1NTIHR3ZWFrJywgc2NvcGU6ICdnbG9iYWwnLCBrZXlzOiBbJ3NoaWZ0K2FsdCt2J10gfSxcbiAgeyBpZDogJ21vZGUucmVjb3JkJywgbGFiZWw6ICdSZWNvcmQgdGhlIHBhZ2UnLCBzY29wZTogJ2dsb2JhbCcsIGtleXM6IFsnY3RybCthbHQrciddIH0sXG4gIHsgaWQ6ICdtb2RlLmExMXknLCBsYWJlbDogJ0FjY2Vzc2liaWxpdHkgY2hlY2snLCBzY29wZTogJ2dsb2JhbCcsIGtleXM6IFsnc2hpZnQrYWx0K2gnXSB9LFxuICAvLyBIaWRlcyB0aGUgdG9vbGJhcnMgZm9yIHJvb207IHRoZSBtb2RlIHN0YXlzIG9uIGFuZCBpdHMga2V5cyBrZWVwIHdvcmtpbmcuXG4gIHsgaWQ6ICd2aWV3LnRvb2xiYXInLCBsYWJlbDogJ0hpZGUgb3Igc2hvdyB0aGUgdG9vbGJhcicsIHNjb3BlOiAnZ2xvYmFsJywga2V5czogWydzaGlmdCthbHQreiddIH0sXG5cbiAgLy8gRWxlbWVudCBwaWNrZXIuXG4gIHsgaWQ6ICdpbnNwZWN0LnBhcmVudCcsIGxhYmVsOiAnU2VsZWN0IHRoZSBwYXJlbnQgZWxlbWVudCcsIHNjb3BlOiAnaW5zcGVjdCcsIGtleXM6IFsndXAnXSB9LFxuICB7XG4gICAgaWQ6ICdpbnNwZWN0LmNoaWxkJyxcbiAgICBsYWJlbDogJ1NlbGVjdCB0aGUgZmlyc3QgY2hpbGQgZWxlbWVudCcsXG4gICAgc2NvcGU6ICdpbnNwZWN0JyxcbiAgICBrZXlzOiBbJ2Rvd24nXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnaW5zcGVjdC5jb3B5JyxcbiAgICBsYWJlbDogJ0NvcHkgdGhlIHNlbGVjdGVkIGVsZW1lbnRzJyxcbiAgICBzY29wZTogJ2luc3BlY3QnLFxuICAgIGtleXM6IFsnZW50ZXInLCAnYyddLFxuICB9LFxuICB7IGlkOiAnaW5zcGVjdC5zY3JlZW5zaG90JywgbGFiZWw6ICdTY3JlZW5zaG90IHRoZSBlbGVtZW50Jywgc2NvcGU6ICdpbnNwZWN0Jywga2V5czogWydzJ10gfSxcbiAgeyBpZDogJ2luc3BlY3QuYWdlbnQnLCBsYWJlbDogJ1NlbmQgdGhlIGVsZW1lbnQgdG8gdGhlIGFnZW50Jywgc2NvcGU6ICdpbnNwZWN0Jywga2V5czogWydhJ10gfSxcbiAgeyBpZDogJ2luc3BlY3QuaGVscCcsIGxhYmVsOiAnU2hvdyB0aGVzZSBzaG9ydGN1dHMnLCBzY29wZTogJ2luc3BlY3QnLCBrZXlzOiBbJ3NoaWZ0Ky8nXSB9LFxuICB7IGlkOiAnaW5zcGVjdC5leGl0JywgbGFiZWw6ICdFeGl0Jywgc2NvcGU6ICdpbnNwZWN0Jywga2V5czogWydlc2NhcGUnXSB9LFxuXG4gIC8vIERyYXdpbmcuXG4gIHsgaWQ6ICdkcmF3LnNlbGVjdCcsIGxhYmVsOiAnU2VsZWN0IGFuZCBtb3ZlJywgc2NvcGU6ICdkcmF3Jywga2V5czogWyd2J10gfSxcbiAgeyBpZDogJ2RyYXcucGVuJywgbGFiZWw6ICdQZW4nLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ3AnXSB9LFxuICB7IGlkOiAnZHJhdy5wZW5jaWwnLCBsYWJlbDogJ1BlbmNpbCcsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnaSddIH0sXG4gIHsgaWQ6ICdkcmF3Lm1hcmtlcicsIGxhYmVsOiAnTWFya2VyJywgc2NvcGU6ICdkcmF3Jywga2V5czogWydtJ10gfSxcbiAgeyBpZDogJ2RyYXcuYnJ1c2gnLCBsYWJlbDogJ0JydXNoJywgc2NvcGU6ICdkcmF3Jywga2V5czogWyd1J10gfSxcbiAgeyBpZDogJ2RyYXcuaGlnaGxpZ2h0ZXInLCBsYWJlbDogJ0hpZ2hsaWdodGVyJywgc2NvcGU6ICdkcmF3Jywga2V5czogWydoJ10gfSxcbiAgeyBpZDogJ2RyYXcubmVvbicsIGxhYmVsOiAnTmVvbicsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnZyddIH0sXG4gIHsgaWQ6ICdkcmF3LmxpbmUnLCBsYWJlbDogJ0xpbmUnLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ2wnXSB9LFxuICB7IGlkOiAnZHJhdy5hcnJvdycsIGxhYmVsOiAnQXJyb3cnLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ2EnXSB9LFxuICB7IGlkOiAnZHJhdy5kb3VibGVBcnJvdycsIGxhYmVsOiAnRG91YmxlIGFycm93Jywgc2NvcGU6ICdkcmF3Jywga2V5czogWydkJ10gfSxcbiAgeyBpZDogJ2RyYXcucmVjdCcsIGxhYmVsOiAnUmVjdGFuZ2xlJywgc2NvcGU6ICdkcmF3Jywga2V5czogWydyJ10gfSxcbiAgeyBpZDogJ2RyYXcuZWxsaXBzZScsIGxhYmVsOiAnRWxsaXBzZScsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnbyddIH0sXG4gIHsgaWQ6ICdkcmF3LnRleHQnLCBsYWJlbDogJ1RleHQnLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ3QnXSB9LFxuICB7IGlkOiAnZHJhdy5jYWxsb3V0JywgbGFiZWw6ICdOdW1iZXJlZCBjYWxsb3V0Jywgc2NvcGU6ICdkcmF3Jywga2V5czogWyduJ10gfSxcbiAgeyBpZDogJ2RyYXcuYmx1cicsIGxhYmVsOiAnUmVkYWN0IChwaXhlbGF0ZSknLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ2InXSB9LFxuICB7IGlkOiAnZHJhdy5lcmFzZXInLCBsYWJlbDogJ0VyYXNlcicsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnZSddIH0sXG4gIC4uLlsxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5XS5tYXAoKG4pOiBTaG9ydGN1dEFjdGlvbiA9PiAoe1xuICAgIGlkOiBgZHJhdy5jb2xvciR7bn1gLFxuICAgIGxhYmVsOiBgQ29sb3IgJHtufWAsXG4gICAgc2NvcGU6ICdkcmF3JyxcbiAgICBrZXlzOiBbU3RyaW5nKG4pXSxcbiAgfSkpLFxuICB7IGlkOiAnZHJhdy50aGlubmVyJywgbGFiZWw6ICdUaGlubmVyIHN0cm9rZScsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnWyddIH0sXG4gIHsgaWQ6ICdkcmF3LnRoaWNrZXInLCBsYWJlbDogJ1RoaWNrZXIgc3Ryb2tlJywgc2NvcGU6ICdkcmF3Jywga2V5czogWyddJ10gfSxcbiAgeyBpZDogJ2RyYXcuZmlsbCcsIGxhYmVsOiAnRmlsbCBzaGFwZXMgb24gb3Igb2ZmJywgc2NvcGU6ICdkcmF3Jywga2V5czogWydmJ10gfSxcbiAgeyBpZDogJ2RyYXcudW5kbycsIGxhYmVsOiAnVW5kbycsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnY3RybCt6J10gfSxcbiAgeyBpZDogJ2RyYXcucmVkbycsIGxhYmVsOiAnUmVkbycsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnY3RybCt5JywgJ2N0cmwrc2hpZnQreiddIH0sXG4gIHsgaWQ6ICdkcmF3LmNsZWFyJywgbGFiZWw6ICdDbGVhciBhbGwgZHJhd2luZ3MnLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ3NoaWZ0K2JhY2tzcGFjZSddIH0sXG4gIHsgaWQ6ICdkcmF3LnZpc2libGUnLCBsYWJlbDogJ0hpZGUgb3Igc2hvdyBkcmF3aW5ncycsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsndyddIH0sXG4gIHsgaWQ6ICdkcmF3LmNhcHR1cmUnLCBsYWJlbDogJ1NjcmVlbnNob3QgdGhlIGRyYXdpbmcgYXJlYScsIHNjb3BlOiAnZHJhdycsIGtleXM6IFsnZW50ZXInXSB9LFxuICB7XG4gICAgaWQ6ICdkcmF3LmNhcHR1cmVBZ2VudCcsXG4gICAgbGFiZWw6ICdTY3JlZW5zaG90IHRoZSBkcmF3aW5nIGFyZWEgYW5kIHNlbmQgaXQgdG8gdGhlIGFnZW50JyxcbiAgICBzY29wZTogJ2RyYXcnLFxuICAgIGtleXM6IFsnc2hpZnQrZW50ZXInXSxcbiAgfSxcbiAgLy8gVGhlIGRyYXdpbmcgdG9vbGJhcidzIFNjcmVlbnNob3QgbWVudTogdGhlIGtleSB0aGF0IG9wZW5zIGl0LCBhbmQgb25lIHBlciBpdGVtLlxuICB7IGlkOiAnZHJhdy5jYXB0dXJlTWVudScsIGxhYmVsOiAnU2NyZWVuc2hvdCBtZW51Jywgc2NvcGU6ICdkcmF3Jywga2V5czogWydzJ10gfSxcbiAge1xuICAgIGlkOiAnZHJhdy5jYXB0dXJlR3JvdXBzJyxcbiAgICBsYWJlbDogJ1NjcmVlbnNob3QgZWFjaCBkcmF3aW5nIHNlcGFyYXRlbHknLFxuICAgIHNjb3BlOiAnZHJhdycsXG4gICAga2V5czogWydhbHQrZyddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdkcmF3LmNhcHR1cmVDbGVhbicsXG4gICAgbGFiZWw6ICdTY3JlZW5zaG90IHRoZSBkcmF3aW5nIGFyZWEgd2l0aG91dCBkcmF3aW5ncycsXG4gICAgc2NvcGU6ICdkcmF3JyxcbiAgICBrZXlzOiBbJ2FsdCtjJ10sXG4gIH0sXG4gIHtcbiAgICBpZDogJ2RyYXcuY2FwdHVyZVZpZXdwb3J0JyxcbiAgICBsYWJlbDogJ1NjcmVlbnNob3QgdGhlIHZpc2libGUgYXJlYSB3aXRoIGRyYXdpbmdzJyxcbiAgICBzY29wZTogJ2RyYXcnLFxuICAgIGtleXM6IFsnYWx0K3YnXSxcbiAgfSxcbiAge1xuICAgIGlkOiAnZHJhdy5jYXB0dXJlRnVsbFBhZ2UnLFxuICAgIGxhYmVsOiAnU2NyZWVuc2hvdCB0aGUgZnVsbCBwYWdlIHdpdGggZHJhd2luZ3MnLFxuICAgIHNjb3BlOiAnZHJhdycsXG4gICAga2V5czogWydhbHQrZiddLFxuICB9LFxuICB7XG4gICAgaWQ6ICdkcmF3LmNhcHR1cmVSZWdpb24nLFxuICAgIGxhYmVsOiAnU2NyZWVuc2hvdCBhbiBhcmVhIHlvdSBkcmFnLCB3aXRoIGRyYXdpbmdzJyxcbiAgICBzY29wZTogJ2RyYXcnLFxuICAgIGtleXM6IFsnYWx0K3InXSxcbiAgfSxcbiAgeyBpZDogJ2RyYXcuaGVscCcsIGxhYmVsOiAnU2hvdyB0aGVzZSBzaG9ydGN1dHMnLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ3NoaWZ0Ky8nXSB9LFxuICB7IGlkOiAnZHJhdy5leGl0JywgbGFiZWw6ICdTdG9wIGRyYXdpbmcnLCBzY29wZTogJ2RyYXcnLCBrZXlzOiBbJ2VzY2FwZSddIH0sXG5cbiAgLy8gU2NyZWVuc2hvdCAodGhlIG1lbnUgdGhlIG1vZGUga2V5IG9wZW5zKS5cbiAgeyBpZDogJ3Nob3Qudmlld3BvcnQnLCBsYWJlbDogJ1Zpc2libGUgYXJlYScsIHNjb3BlOiAnc2NyZWVuc2hvdCcsIGtleXM6IFsndiddIH0sXG4gIHsgaWQ6ICdzaG90LmZ1bGxQYWdlJywgbGFiZWw6ICdGdWxsIHBhZ2UnLCBzY29wZTogJ3NjcmVlbnNob3QnLCBrZXlzOiBbJ2YnXSB9LFxuICB7IGlkOiAnc2hvdC5yZWdpb24nLCBsYWJlbDogJ1JlZ2lvbicsIHNjb3BlOiAnc2NyZWVuc2hvdCcsIGtleXM6IFsnciddIH0sXG4gIHsgaWQ6ICdzaG90LmVsZW1lbnQnLCBsYWJlbDogJ0VsZW1lbnQnLCBzY29wZTogJ3NjcmVlbnNob3QnLCBrZXlzOiBbJ2UnXSB9LFxuICB7IGlkOiAnc2hvdC5kcmF3aW5nJywgbGFiZWw6ICdEcmF3aW5nIGFyZWEnLCBzY29wZTogJ3NjcmVlbnNob3QnLCBrZXlzOiBbJ2QnXSB9LFxuICB7XG4gICAgaWQ6ICdzaG90Lmxhc3RUb0FnZW50JyxcbiAgICBsYWJlbDogJ1NlbmQgdGhlIGxhc3Qgc2NyZWVuc2hvdCB0byB0aGUgYWdlbnQnLFxuICAgIHNjb3BlOiAnc2NyZWVuc2hvdCcsXG4gICAga2V5czogWydhJ10sXG4gICAgY29tbWFuZDogY21kKCdzY3JlZW5zaG90LnNlbmRUb1Rlcm1pbmFsJyksXG4gIH0sXG5cbiAgLy8gVGhlIHNlbmQgZGlhbG9nIGFmdGVyIGEgY2FwdHVyZSAoaXQgaG9sZHMgdGhlIGZvY3VzLCBzbyBwbGFpbiBrZXlzKS4gMS05IHNlbmQgdG8gdGhlIGFnZW50XG4gIC8vIHdpdGggdGhhdCBudW1iZXIgKGZpeGVkIGtleXMsIGxpa2UgdGhlIGRyYXdpbmcgY29sb3JzKS5cbiAgeyBpZDogJ3NlbmQuZGVmYXVsdCcsIGxhYmVsOiAnU2VuZCB0byB0aGUgZGVmYXVsdCBhZ2VudCcsIHNjb3BlOiAnc2VuZCcsIGtleXM6IFsnZW50ZXInXSB9LFxuICB7IGlkOiAnc2VuZC5uZXdUaHJlYWQnLCBsYWJlbDogJ05ldyBhZ2VudG11eCB0aHJlYWQnLCBzY29wZTogJ3NlbmQnLCBrZXlzOiBbJ24nXSB9LFxuICB7IGlkOiAnc2VuZC5wcm9tcHQnLCBsYWJlbDogJ1dyaXRlIGEgcHJvbXB0Jywgc2NvcGU6ICdzZW5kJywga2V5czogWydpJ10gfSxcbiAgeyBpZDogJ3NlbmQucHJvamVjdCcsIGxhYmVsOiAnQ2hhbmdlIHByb2plY3QnLCBzY29wZTogJ3NlbmQnLCBrZXlzOiBbJ3AnXSB9LFxuICB7IGlkOiAnc2VuZC5jb3B5JywgbGFiZWw6ICdDb3B5Jywgc2NvcGU6ICdzZW5kJywga2V5czogWydjJ10gfSxcbiAgeyBpZDogJ3NlbmQuZG93bmxvYWQnLCBsYWJlbDogJ0Rvd25sb2FkJywgc2NvcGU6ICdzZW5kJywga2V5czogWydkJ10gfSxcbiAgeyBpZDogJ3NlbmQuY2xvc2UnLCBsYWJlbDogJ0Nsb3NlIChrZWVwIGl0IHNhdmVkKScsIHNjb3BlOiAnc2VuZCcsIGtleXM6IFsnZXNjYXBlJ10gfSxcblxuICAvLyBDb25zb2xlIGFuZCBuZXR3b3JrICh3aGlsZSB0aGUgZHJhd2VyIGlzIG9wZW4pLlxuICB7IGlkOiAnZGV2LmNvbnNvbGUnLCBsYWJlbDogJ0NvbnNvbGUnLCBzY29wZTogJ2RldnRvb2xzJywga2V5czogWydhbHQrMSddIH0sXG4gIHsgaWQ6ICdkZXYubmV0d29yaycsIGxhYmVsOiAnTmV0d29yaycsIHNjb3BlOiAnZGV2dG9vbHMnLCBrZXlzOiBbJ2FsdCsyJ10gfSxcbiAgeyBpZDogJ2Rldi5maWx0ZXInLCBsYWJlbDogJ0ZpbHRlcicsIHNjb3BlOiAnZGV2dG9vbHMnLCBrZXlzOiBbJ2FsdCtmJ10gfSxcbiAgeyBpZDogJ2Rldi5jb3B5RXJyb3JzJywgbGFiZWw6ICdDb3B5IGNvbnNvbGUgZXJyb3JzJywgc2NvcGU6ICdkZXZ0b29scycsIGtleXM6IFsnYWx0K2UnXSB9LFxuICB7IGlkOiAnZGV2LmNvcHlGYWlsZWQnLCBsYWJlbDogJ0NvcHkgZmFpbGVkIHJlcXVlc3RzJywgc2NvcGU6ICdkZXZ0b29scycsIGtleXM6IFsnYWx0K3EnXSB9LFxuICB7IGlkOiAnZGV2LmNvcHlDb250ZXh0JywgbGFiZWw6ICdDb3B5IHBhZ2UgY29udGV4dCcsIHNjb3BlOiAnZGV2dG9vbHMnLCBrZXlzOiBbJ2FsdCtwJ10gfSxcbiAge1xuICAgIGlkOiAnZGV2LmNvbnRleHRBZ2VudCcsXG4gICAgbGFiZWw6ICdTZW5kIHBhZ2UgY29udGV4dCB0byB0aGUgYWdlbnQnLFxuICAgIHNjb3BlOiAnZGV2dG9vbHMnLFxuICAgIGtleXM6IFsnYWx0K3NoaWZ0K3AnXSxcbiAgfSxcbiAgeyBpZDogJ2Rldi5jbGVhcicsIGxhYmVsOiAnQ2xlYXInLCBzY29wZTogJ2RldnRvb2xzJywga2V5czogWydhbHQrayddIH0sXG4gIHsgaWQ6ICdkZXYuY2xvc2UnLCBsYWJlbDogJ0Nsb3NlJywgc2NvcGU6ICdkZXZ0b29scycsIGtleXM6IFsnYWx0K3cnXSB9LFxuXG4gIC8vIERldmljZSAod2hpbGUgdGhlIGRldmljZSB0b29sYmFyIGlzIG9uKS5cbiAgeyBpZDogJ2RldmljZS5wcmV2aW91cycsIGxhYmVsOiAnUHJldmlvdXMgZGV2aWNlJywgc2NvcGU6ICdkZXZpY2UnLCBrZXlzOiBbJ2FsdCtbJ10gfSxcbiAgeyBpZDogJ2RldmljZS5uZXh0JywgbGFiZWw6ICdOZXh0IGRldmljZScsIHNjb3BlOiAnZGV2aWNlJywga2V5czogWydhbHQrXSddIH0sXG4gIHsgaWQ6ICdkZXZpY2Uucm90YXRlJywgbGFiZWw6ICdSb3RhdGUnLCBzY29wZTogJ2RldmljZScsIGtleXM6IFsnYWx0K3InXSB9LFxuICB7IGlkOiAnZGV2aWNlLnRvdWNoJywgbGFiZWw6ICdUb3VjaCBhbmQgbW9iaWxlIG9uIG9yIG9mZicsIHNjb3BlOiAnZGV2aWNlJywga2V5czogWydhbHQrdCddIH0sXG4gIHsgaWQ6ICdkZXZpY2UuZml0JywgbGFiZWw6ICdGaXQgdG8gd2luZG93Jywgc2NvcGU6ICdkZXZpY2UnLCBrZXlzOiBbJ2FsdCswJ10gfSxcbiAgeyBpZDogJ2RldmljZS56b29tSW4nLCBsYWJlbDogJ1pvb20gaW4nLCBzY29wZTogJ2RldmljZScsIGtleXM6IFsnYWx0Kz0nXSB9LFxuICB7IGlkOiAnZGV2aWNlLnpvb21PdXQnLCBsYWJlbDogJ1pvb20gb3V0Jywgc2NvcGU6ICdkZXZpY2UnLCBrZXlzOiBbJ2FsdCstJ10gfSxcbiAgeyBpZDogJ2RldmljZS5uZXR3b3JrJywgbGFiZWw6ICdOZXh0IG5ldHdvcmsgc3BlZWQnLCBzY29wZTogJ2RldmljZScsIGtleXM6IFsnYWx0K24nXSB9LFxuICB7IGlkOiAnZGV2aWNlLnRoZW1lJywgbGFiZWw6ICdOZXh0IGNvbG9yIHNjaGVtZScsIHNjb3BlOiAnZGV2aWNlJywga2V5czogWydhbHQrbCddIH0sXG4gIHsgaWQ6ICdkZXZpY2UuY2xvc2UnLCBsYWJlbDogJ0Nsb3NlIHRoZSBkZXZpY2UgdG9vbGJhcicsIHNjb3BlOiAnZGV2aWNlJywga2V5czogW10gfSxcblxuICAvLyBNZWFzdXJlLlxuICB7IGlkOiAnbWVhc3VyZS5ncmlkJywgbGFiZWw6ICdSdWxlcnMgYW5kIGdyaWQgb24gb3Igb2ZmJywgc2NvcGU6ICdtZWFzdXJlJywga2V5czogWydnJ10gfSxcbiAgeyBpZDogJ21lYXN1cmUuY29weScsIGxhYmVsOiAnQ29weSB0aGUgbWVhc3VyZW1lbnRzJywgc2NvcGU6ICdtZWFzdXJlJywga2V5czogWydjJ10gfSxcbiAgeyBpZDogJ21lYXN1cmUuY2xlYXInLCBsYWJlbDogJ0NsZWFyIHRoZSBwaW5uZWQgZWxlbWVudCcsIHNjb3BlOiAnbWVhc3VyZScsIGtleXM6IFsnYmFja3NwYWNlJ10gfSxcbiAgeyBpZDogJ21lYXN1cmUuaGVscCcsIGxhYmVsOiAnU2hvdyB0aGVzZSBzaG9ydGN1dHMnLCBzY29wZTogJ21lYXN1cmUnLCBrZXlzOiBbJ3NoaWZ0Ky8nXSB9LFxuICB7IGlkOiAnbWVhc3VyZS5leGl0JywgbGFiZWw6ICdFeGl0Jywgc2NvcGU6ICdtZWFzdXJlJywga2V5czogWydlc2NhcGUnXSB9LFxuXG4gIC8vIEV5ZWRyb3BwZXIuXG4gIHsgaWQ6ICdleWVkcm9wcGVyLmhleCcsIGxhYmVsOiAnQ29weSBjb2xvcnMgYXMgaGV4Jywgc2NvcGU6ICdleWVkcm9wcGVyJywga2V5czogWydoJ10gfSxcbiAgeyBpZDogJ2V5ZWRyb3BwZXIucmdiJywgbGFiZWw6ICdDb3B5IGNvbG9ycyBhcyByZ2IoKScsIHNjb3BlOiAnZXllZHJvcHBlcicsIGtleXM6IFsnciddIH0sXG4gIHsgaWQ6ICdleWVkcm9wcGVyLmhzbCcsIGxhYmVsOiAnQ29weSBjb2xvcnMgYXMgaHNsKCknLCBzY29wZTogJ2V5ZWRyb3BwZXInLCBrZXlzOiBbJ2wnXSB9LFxuICB7IGlkOiAnZXllZHJvcHBlci5oZWxwJywgbGFiZWw6ICdTaG93IHRoZXNlIHNob3J0Y3V0cycsIHNjb3BlOiAnZXllZHJvcHBlcicsIGtleXM6IFsnc2hpZnQrLyddIH0sXG4gIHsgaWQ6ICdleWVkcm9wcGVyLmV4aXQnLCBsYWJlbDogJ0V4aXQnLCBzY29wZTogJ2V5ZWRyb3BwZXInLCBrZXlzOiBbJ2VzY2FwZSddIH0sXG5cbiAgLy8gRGVzaWduIG92ZXJsYXkgKHRoZSBwYWdlIHN0YXlzIHVzYWJsZSwgc28gdGhlc2UgdXNlIEFsdCkuXG4gIHsgaWQ6ICdvdmVybGF5Lm9wZW4nLCBsYWJlbDogJ09wZW4gYW4gaW1hZ2UnLCBzY29wZTogJ292ZXJsYXknLCBrZXlzOiBbJ2FsdCtvJ10gfSxcbiAgeyBpZDogJ292ZXJsYXkuZmFpbnRlcicsIGxhYmVsOiAnTGVzcyBvcGFxdWUnLCBzY29wZTogJ292ZXJsYXknLCBrZXlzOiBbJ2FsdCssJ10gfSxcbiAgeyBpZDogJ292ZXJsYXkuc3Ryb25nZXInLCBsYWJlbDogJ01vcmUgb3BhcXVlJywgc2NvcGU6ICdvdmVybGF5Jywga2V5czogWydhbHQrLiddIH0sXG4gIHsgaWQ6ICdvdmVybGF5LmxlZnQnLCBsYWJlbDogJ051ZGdlIGxlZnQnLCBzY29wZTogJ292ZXJsYXknLCBrZXlzOiBbJ2FsdCtsZWZ0J10gfSxcbiAgeyBpZDogJ292ZXJsYXkucmlnaHQnLCBsYWJlbDogJ051ZGdlIHJpZ2h0Jywgc2NvcGU6ICdvdmVybGF5Jywga2V5czogWydhbHQrcmlnaHQnXSB9LFxuICB7IGlkOiAnb3ZlcmxheS51cCcsIGxhYmVsOiAnTnVkZ2UgdXAnLCBzY29wZTogJ292ZXJsYXknLCBrZXlzOiBbJ2FsdCt1cCddIH0sXG4gIHsgaWQ6ICdvdmVybGF5LmRvd24nLCBsYWJlbDogJ051ZGdlIGRvd24nLCBzY29wZTogJ292ZXJsYXknLCBrZXlzOiBbJ2FsdCtkb3duJ10gfSxcbiAge1xuICAgIGlkOiAnb3ZlcmxheS5kaWZmZXJlbmNlJyxcbiAgICBsYWJlbDogJ0RpZmZlcmVuY2UgYmxlbmQgb24gb3Igb2ZmJyxcbiAgICBzY29wZTogJ292ZXJsYXknLFxuICAgIGtleXM6IFsnYWx0K3gnXSxcbiAgfSxcbiAgeyBpZDogJ292ZXJsYXkuaGlkZScsIGxhYmVsOiAnSGlkZSBvciBzaG93IHRoZSBvdmVybGF5Jywgc2NvcGU6ICdvdmVybGF5Jywga2V5czogWydhbHQraCddIH0sXG4gIHsgaWQ6ICdvdmVybGF5LmV4aXQnLCBsYWJlbDogJ0Nsb3NlIHRoZSBvdmVybGF5Jywgc2NvcGU6ICdvdmVybGF5Jywga2V5czogWydhbHQreiddIH0sXG5cbiAgLy8gQ1NTIHR3ZWFrLlxuICB7XG4gICAgaWQ6ICd0d2Vhay5hZ2VudCcsXG4gICAgbGFiZWw6ICdTZW5kIHRoZSBDU1MgY2hhbmdlcyB0byB0aGUgYWdlbnQnLFxuICAgIHNjb3BlOiAndHdlYWsnLFxuICAgIGtleXM6IFsnY3RybCtlbnRlciddLFxuICB9LFxuICB7IGlkOiAndHdlYWsuY29weScsIGxhYmVsOiAnQ29weSB0aGUgQ1NTIGNoYW5nZXMnLCBzY29wZTogJ3R3ZWFrJywga2V5czogWydjdHJsK3NoaWZ0K2MnXSB9LFxuICB7IGlkOiAndHdlYWsudW5kbycsIGxhYmVsOiAnVW5kbyB0aGUgbGFzdCBjaGFuZ2UnLCBzY29wZTogJ3R3ZWFrJywga2V5czogWydjdHJsK3onXSB9LFxuICB7IGlkOiAndHdlYWsuZXhpdCcsIGxhYmVsOiAnRXhpdCBhbmQgcmV2ZXJ0Jywgc2NvcGU6ICd0d2VhaycsIGtleXM6IFsnZXNjYXBlJ10gfSxcblxuICAvLyBSZWNvcmQgKHRoZSBwYWdlIHN0YXlzIHVzYWJsZSkuXG4gIHsgaWQ6ICdyZWNvcmQuc3RvcCcsIGxhYmVsOiAnU3RvcCBhbmQgc2F2ZScsIHNjb3BlOiAncmVjb3JkJywga2V5czogWydhbHQrcyddIH0sXG4gIHsgaWQ6ICdyZWNvcmQucGF1c2UnLCBsYWJlbDogJ1BhdXNlIG9yIHJlc3VtZScsIHNjb3BlOiAncmVjb3JkJywga2V5czogWydhbHQreSddIH0sXG4gIHsgaWQ6ICdyZWNvcmQuY2FuY2VsJywgbGFiZWw6ICdDYW5jZWwnLCBzY29wZTogJ3JlY29yZCcsIGtleXM6IFsnYWx0K2JhY2tzcGFjZSddIH0sXG5cbiAgLy8gQWNjZXNzaWJpbGl0eSBjaGVjay5cbiAgeyBpZDogJ2ExMXkubmV4dCcsIGxhYmVsOiAnTmV4dCBpc3N1ZScsIHNjb3BlOiAnYTExeScsIGtleXM6IFsnbicsICdkb3duJ10gfSxcbiAgeyBpZDogJ2ExMXkucHJldmlvdXMnLCBsYWJlbDogJ1ByZXZpb3VzIGlzc3VlJywgc2NvcGU6ICdhMTF5Jywga2V5czogWydwJywgJ3VwJ10gfSxcbiAgeyBpZDogJ2ExMXkudGFiT3JkZXInLCBsYWJlbDogJ1RhYiBvcmRlciBvbiBvciBvZmYnLCBzY29wZTogJ2ExMXknLCBrZXlzOiBbJ3QnXSB9LFxuICB7IGlkOiAnYTExeS5jb3B5JywgbGFiZWw6ICdDb3B5IHRoZSByZXBvcnQnLCBzY29wZTogJ2ExMXknLCBrZXlzOiBbJ2MnXSB9LFxuICB7IGlkOiAnYTExeS5hZ2VudCcsIGxhYmVsOiAnU2VuZCB0aGUgcmVwb3J0IHRvIHRoZSBhZ2VudCcsIHNjb3BlOiAnYTExeScsIGtleXM6IFsnYSddIH0sXG4gIHsgaWQ6ICdhMTF5LmhlbHAnLCBsYWJlbDogJ1Nob3cgdGhlc2Ugc2hvcnRjdXRzJywgc2NvcGU6ICdhMTF5Jywga2V5czogWydzaGlmdCsvJ10gfSxcbiAgeyBpZDogJ2ExMXkuZXhpdCcsIGxhYmVsOiAnRXhpdCcsIHNjb3BlOiAnYTExeScsIGtleXM6IFsnZXNjYXBlJ10gfSxcbl07XG5cbi8qKiBVc2VyIGNoYW5nZXM6IGFuIGFjdGlvbiBpZCB0byBpdHMga2V5cyAoYFtdYCBvciBgXCJcImAgdW5iaW5kcyBpdCkuICovXG5leHBvcnQgdHlwZSBTaG9ydGN1dE92ZXJyaWRlcyA9IFJlY29yZDxzdHJpbmcsIHN0cmluZyB8IHJlYWRvbmx5IHN0cmluZ1tdPjtcblxuLyoqIFRoZSBrZXlzIGluIGVmZmVjdDogYWN0aW9uIGlkIHRvIGtleXMuICovXG5leHBvcnQgdHlwZSBTaG9ydGN1dE1hcCA9IFJlY29yZDxzdHJpbmcsIHN0cmluZ1tdPjtcblxuLyoqIERlZmF1bHQga2V5cyBmb3IgYSBwbGF0Zm9ybS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0S2V5cyhhY3Rpb246IFNob3J0Y3V0QWN0aW9uLCBtYWM6IGJvb2xlYW4pOiBzdHJpbmdbXSB7XG4gIGlmICghbWFjKSByZXR1cm4gWy4uLmFjdGlvbi5rZXlzXTtcbiAgcmV0dXJuIFsuLi4oYWN0aW9uLm1hYyA/PyBhY3Rpb24ua2V5cy5tYXAoKGtleSkgPT4ga2V5LnJlcGxhY2UoL1xcYmN0cmxcXCsvLCAnY21kKycpKSldO1xufVxuXG4vKiogS2V5cyBub3JtYWxpemVkIGZvciBjb21wYXJpbmc6IGxvd2VyIGNhc2UsIG1vZGlmaWVycyBpbiBhIGZpeGVkIG9yZGVyLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUtleShiaW5kaW5nOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBjaG9yZCA9IHBhcnNlQ2hvcmQoYmluZGluZy50cmltKCkpO1xuICBpZiAoIWNob3JkLmtleSkgcmV0dXJuICcnO1xuICByZXR1cm4gW1xuICAgIGNob3JkLmN0cmwgJiYgJ2N0cmwnLFxuICAgIGNob3JkLnNoaWZ0ICYmICdzaGlmdCcsXG4gICAgY2hvcmQuYWx0ICYmICdhbHQnLFxuICAgIGNob3JkLm1ldGEgJiYgJ2NtZCcsXG4gICAgY2hvcmQua2V5LFxuICBdXG4gICAgLmZpbHRlcihCb29sZWFuKVxuICAgIC5qb2luKCcrJyk7XG59XG5cbi8qKiBEZWZhdWx0cyBwbHVzIHRoZSB1c2VyJ3Mgb3ZlcnJpZGVzLiBVbmtub3duIGlkcyBhbmQgaW52YWxpZCBrZXlzIGFyZSBpZ25vcmVkLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVmZmVjdGl2ZVNob3J0Y3V0cyhvdmVycmlkZXM6IFNob3J0Y3V0T3ZlcnJpZGVzLCBtYWM6IGJvb2xlYW4pOiBTaG9ydGN1dE1hcCB7XG4gIGNvbnN0IG1hcDogU2hvcnRjdXRNYXAgPSB7fTtcbiAgZm9yIChjb25zdCBhY3Rpb24gb2YgU0hPUlRDVVRfQUNUSU9OUykge1xuICAgIGNvbnN0IG92ZXJyaWRlID0gb3ZlcnJpZGVzW2FjdGlvbi5pZF07XG4gICAgLy8gRGVmYXVsdHMgdG9vOiBhIGtleSBwcmVzcyByZWFkcyBcInNoaWZ0K2FsdCtwXCIsIHNvIGEgZGVmYXVsdCB3cml0dGVuIFwiYWx0K3NoaWZ0K3BcIiBtdXN0IGJlXG4gICAgLy8gcHV0IGluIHRoZSBzYW1lIG9yZGVyIG9yIGl0IG5ldmVyIG1hdGNoZXMuXG4gICAgY29uc3Qga2V5cyA9IChcbiAgICAgIG92ZXJyaWRlID09PSB1bmRlZmluZWRcbiAgICAgICAgPyBkZWZhdWx0S2V5cyhhY3Rpb24sIG1hYylcbiAgICAgICAgOiB0eXBlb2Ygb3ZlcnJpZGUgPT09ICdzdHJpbmcnXG4gICAgICAgICAgPyBbb3ZlcnJpZGVdXG4gICAgICAgICAgOiBbLi4ub3ZlcnJpZGVdXG4gICAgKS5tYXAobm9ybWFsaXplS2V5KTtcbiAgICBtYXBbYWN0aW9uLmlkXSA9IFsuLi5uZXcgU2V0KGtleXMuZmlsdGVyKEJvb2xlYW4pKV07XG4gIH1cbiAgcmV0dXJuIG1hcDtcbn1cblxuLyoqIFZhbGlkYXRlcyB0aGUgc2V0dGluZydzIHZhbHVlIChmcm9tIHNldHRpbmdzLmpzb24sIHN5bmMgb3IgYW4gaW1wb3J0ZWQgZmlsZSkuICovXG5leHBvcnQgZnVuY3Rpb24gc2FuaXRpemVPdmVycmlkZXModmFsdWU6IHVua25vd24pOiBTaG9ydGN1dE92ZXJyaWRlcyB7XG4gIGlmICghdmFsdWUgfHwgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSkgcmV0dXJuIHt9O1xuICBjb25zdCBrbm93biA9IG5ldyBTZXQoU0hPUlRDVVRfQUNUSU9OUy5tYXAoKGEpID0+IGEuaWQpKTtcbiAgY29uc3QgcmVzdWx0OiBTaG9ydGN1dE92ZXJyaWRlcyA9IHt9O1xuICBmb3IgKGNvbnN0IFtpZCwga2V5c10gb2YgT2JqZWN0LmVudHJpZXModmFsdWUgYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4pKSB7XG4gICAgaWYgKCFrbm93bi5oYXMoaWQpKSBjb250aW51ZTtcbiAgICBpZiAodHlwZW9mIGtleXMgPT09ICdzdHJpbmcnKSByZXN1bHRbaWRdID0ga2V5cztcbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGtleXMpICYmIGtleXMuZXZlcnkoKGspID0+IHR5cGVvZiBrID09PSAnc3RyaW5nJykpIHJlc3VsdFtpZF0gPSBrZXlzO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogTW9kZXMgdGhhdCBsZWF2ZSB0aGUgcGFnZSB1c2FibGUsIHNvIHNldmVyYWwgY2FuIGJlIG9uIGF0IG9uY2UgKHRoZWlyIGtleXMgdXNlIEFsdCBhbmQgbXVzdCBub3RcbiAqIGNsYXNoIHdpdGggZWFjaCBvdGhlcikuIE90aGVyIG1vZGVzIHRha2Ugb3ZlciB0aGUgcGFnZTsgdGhlaXIga2V5cyB3aW4gb3ZlciBicm93c2VyLXdpZGUga2V5c1xuICogd2hpbGUgdGhleSBhcmUgb24sIHdoaWNoIGlzIGludGVuZGVkLlxuICovXG5jb25zdCBDT05DVVJSRU5UOiBSZWFkb25seVNldDxTaG9ydGN1dFNjb3BlPiA9IG5ldyBTZXQoWydkZXZ0b29scycsICdkZXZpY2UnLCAnb3ZlcmxheScsICdyZWNvcmQnXSk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2hvcnRjdXRDb25mbGljdCB7XG4gIGtleTogc3RyaW5nO1xuICBpZHM6IFtzdHJpbmcsIHN0cmluZ107XG59XG5cbi8qKiBLZXlzIGJvdW5kIHRvIHR3byBhY3Rpb25zIHRoYXQgY2FuIGJlIGFjdGl2ZSBhdCB0aGUgc2FtZSB0aW1lLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmRDb25mbGljdHMobWFwOiBTaG9ydGN1dE1hcCk6IFNob3J0Y3V0Q29uZmxpY3RbXSB7XG4gIGNvbnN0IHNjb3BlcyA9IG5ldyBNYXAoU0hPUlRDVVRfQUNUSU9OUy5tYXAoKGEpID0+IFthLmlkLCBhLnNjb3BlXSkpO1xuICBjb25zdCBieUtleSA9IG5ldyBNYXA8c3RyaW5nLCBzdHJpbmdbXT4oKTtcbiAgZm9yIChjb25zdCBbaWQsIGtleXNdIG9mIE9iamVjdC5lbnRyaWVzKG1hcCkpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBvZiBrZXlzKSBieUtleS5zZXQoa2V5LCBbLi4uKGJ5S2V5LmdldChrZXkpID8/IFtdKSwgaWRdKTtcbiAgfVxuICBjb25zdCBjb25mbGljdHM6IFNob3J0Y3V0Q29uZmxpY3RbXSA9IFtdO1xuICBmb3IgKGNvbnN0IFtrZXksIGlkc10gb2YgYnlLZXkpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGlkcy5sZW5ndGg7IGkrKykge1xuICAgICAgZm9yIChsZXQgaiA9IGkgKyAxOyBqIDwgaWRzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgIGNvbnN0IFtzYSwgc2JdID0gW3Njb3Blcy5nZXQoaWRzW2ldISkhLCBzY29wZXMuZ2V0KGlkc1tqXSEpIV07XG4gICAgICAgIGlmIChzYSA9PT0gc2IgfHwgKENPTkNVUlJFTlQuaGFzKHNhKSAmJiBDT05DVVJSRU5ULmhhcyhzYikpKSB7XG4gICAgICAgICAgY29uZmxpY3RzLnB1c2goeyBrZXksIGlkczogW2lkc1tpXSEsIGlkc1tqXSFdIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25mbGljdHM7XG59XG5cbi8qKlxuICogVGhlIGFjdGlvbiBmb3IgYSBrZXkgcHJlc3MuIGBzY29wZXNgIGxpc3RzIHRoZSBhY3RpdmUgc2NvcGVzLCBtb3N0IHNwZWNpZmljIGZpcnN0OyB0aGUgZmlyc3RcbiAqIHNjb3BlIHdpdGggYSBtYXRjaCB3aW5zLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYWN0aW9uRm9yQ2hvcmQoXG4gIG1hcDogU2hvcnRjdXRNYXAsXG4gIHNjb3BlczogcmVhZG9ubHkgU2hvcnRjdXRTY29wZVtdLFxuICBjaG9yZDogS2V5Q2hvcmQsXG4pOiBTaG9ydGN1dEFjdGlvbiB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHByZXNzZWQgPSBjaG9yZEtleShjaG9yZCk7XG4gIGZvciAoY29uc3Qgc2NvcGUgb2Ygc2NvcGVzKSB7XG4gICAgY29uc3QgYWN0aW9uID0gU0hPUlRDVVRfQUNUSU9OUy5maW5kKFxuICAgICAgKGEpID0+IGEuc2NvcGUgPT09IHNjb3BlICYmIChtYXBbYS5pZF0gPz8gW10pLmluY2x1ZGVzKHByZXNzZWQpLFxuICAgICk7XG4gICAgaWYgKGFjdGlvbikgcmV0dXJuIGFjdGlvbjtcbiAgfVxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG4vKiogQSBjaG9yZCBpbiBub3JtYWxpemVkIGJpbmRpbmcgc3ludGF4IChzZWUgbm9ybWFsaXplS2V5KS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjaG9yZEtleShjaG9yZDogS2V5Q2hvcmQpOiBzdHJpbmcge1xuICByZXR1cm4gW1xuICAgIGNob3JkLmN0cmwgJiYgJ2N0cmwnLFxuICAgIGNob3JkLnNoaWZ0ICYmICdzaGlmdCcsXG4gICAgY2hvcmQuYWx0ICYmICdhbHQnLFxuICAgIGNob3JkLm1ldGEgJiYgJ2NtZCcsXG4gICAgY2hvcmQua2V5LFxuICBdXG4gICAgLmZpbHRlcihCb29sZWFuKVxuICAgIC5qb2luKCcrJyk7XG59XG5cbi8qKlxuICogVGhlIGFjdGlvbnMgdGhlIElua3NwZWN0IGJyb3dzZXIgZXh0ZW5zaW9uJ3MgdG9vbGJhciBydW5zLiBFdmVyeSBhY3Rpb24gd29ya3MgaW4gVlMgQ29kZVxuICogQnJvd3NlcjsgdGhlc2Ugd29yayBpbiB0aGUgYnJvd3NlciB0b28uIChicm93c2VyLWV4dGVuc2lvbi9zcmMvc2hvcnRjdXRzLnRzIGRpc3BhdGNoZXMgdGhlbS4pXG4gKi9cbmV4cG9ydCBjb25zdCBUT09MQkFSX0FDVElPTl9JRFM6IFJlYWRvbmx5U2V0PHN0cmluZz4gPSBuZXcgU2V0KFtcbiAgJ21vZGUuaW5zcGVjdCcsXG4gICdtb2RlLmRyYXcnLFxuICAnbW9kZS5zY3JlZW5zaG90JyxcbiAgJ21vZGUuZGV2aWNlJyxcbiAgJ21vZGUuZGV2dG9vbHMnLFxuICAncGFnZS5ib29rbWFyaycsXG4gICdvcGVuLnNob3J0Y3V0cycsXG4gICd2aWV3LnRvb2xiYXInLFxuICAnaW5zcGVjdC5wYXJlbnQnLFxuICAnaW5zcGVjdC5jaGlsZCcsXG4gICdpbnNwZWN0LmNvcHknLFxuICAnaW5zcGVjdC5leGl0JyxcbiAgLi4uW1xuICAgICdzZWxlY3QnLFxuICAgICdwZW4nLFxuICAgICdwZW5jaWwnLFxuICAgICdtYXJrZXInLFxuICAgICdicnVzaCcsXG4gICAgJ2hpZ2hsaWdodGVyJyxcbiAgICAnbmVvbicsXG4gICAgJ2xpbmUnLFxuICAgICdhcnJvdycsXG4gICAgJ2RvdWJsZUFycm93JyxcbiAgICAncmVjdCcsXG4gICAgJ2VsbGlwc2UnLFxuICAgICd0ZXh0JyxcbiAgICAnY2FsbG91dCcsXG4gICAgJ2JsdXInLFxuICAgICdlcmFzZXInLFxuICBdLm1hcCgodG9vbCkgPT4gYGRyYXcuJHt0b29sfWApLFxuICAuLi5BcnJheS5mcm9tKHsgbGVuZ3RoOiA5IH0sIChfLCBpKSA9PiBgZHJhdy5jb2xvciR7aSArIDF9YCksXG4gICdkcmF3LnRoaW5uZXInLFxuICAnZHJhdy50aGlja2VyJyxcbiAgJ2RyYXcuZmlsbCcsXG4gICdkcmF3LnVuZG8nLFxuICAnZHJhdy5yZWRvJyxcbiAgJ2RyYXcuY2xlYXInLFxuICAnZHJhdy52aXNpYmxlJyxcbiAgJ2RyYXcuY2FwdHVyZScsXG4gICdkcmF3LmNhcHR1cmVNZW51JyxcbiAgJ2RyYXcuY2FwdHVyZUdyb3VwcycsXG4gICdkcmF3LmNhcHR1cmVDbGVhbicsXG4gICdkcmF3LmNhcHR1cmVWaWV3cG9ydCcsXG4gICdkcmF3LmNhcHR1cmVGdWxsUGFnZScsXG4gICdkcmF3LmNhcHR1cmVSZWdpb24nLFxuICAnZHJhdy5leGl0JyxcbiAgJ3Nob3Qudmlld3BvcnQnLFxuICAnc2hvdC5mdWxsUGFnZScsXG4gICdzaG90LnJlZ2lvbicsXG4gICdzaG90LmVsZW1lbnQnLFxuICAnc2hvdC5kcmF3aW5nJyxcbiAgJ3NlbmQuZGVmYXVsdCcsXG4gICdzZW5kLm5ld1RocmVhZCcsXG4gICdzZW5kLnByb21wdCcsXG4gICdzZW5kLnByb2plY3QnLFxuICAnc2VuZC5jb3B5JyxcbiAgJ3NlbmQuZG93bmxvYWQnLFxuICAnc2VuZC5jbG9zZScsXG5dKTtcblxuLyoqIEFjdGlvbnMgb25seSB0aGUgYnJvd3NlciB0b29sYmFyIGhhcy4gKi9cbmNvbnN0IEJST1dTRVJfT05MWV9TQ09QRVM6IFJlYWRvbmx5U2V0PFNob3J0Y3V0U2NvcGU+ID0gbmV3IFNldChbXSk7XG5cbi8qKiBBIHNob3J0IHRhZyBmb3Igd2hlcmUgYSBzaG9ydGN1dCB3b3JrczogVlMgZm9yIFZTIENvZGUgQnJvd3NlciwgQlIgZm9yIHRoZSBicm93c2VyIHRvb2xiYXIuICovXG5leHBvcnQgaW50ZXJmYWNlIFNob3J0Y3V0UGxhY2Uge1xuICBpZDogJ3ZzJyB8ICdicic7XG4gIGxhYmVsOiBzdHJpbmc7XG4gIHRpdGxlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjb25zdCBQTEFDRV9WUzogU2hvcnRjdXRQbGFjZSA9IHtcbiAgaWQ6ICd2cycsXG4gIGxhYmVsOiAnVlMnLFxuICB0aXRsZTogJ1dvcmtzIGluIFZTIENvZGUgQnJvd3NlcicsXG59O1xuZXhwb3J0IGNvbnN0IFBMQUNFX0JSOiBTaG9ydGN1dFBsYWNlID0ge1xuICBpZDogJ2JyJyxcbiAgbGFiZWw6ICdCUicsXG4gIHRpdGxlOiAnV29ya3MgaW4gdGhlIElua3NwZWN0IHRvb2xiYXIgaW4geW91ciBicm93c2VyIChDaHJvbWUsIEVkZ2UsIEZpcmVmb3guLi4pJyxcbn07XG5cbi8qKiBXaGVyZSBhbiBhY3Rpb24ncyBzaG9ydGN1dCB3b3JrczogVlMgQ29kZSBCcm93c2VyIChuZWFybHkgYWxsKSwgdGhlIGJyb3dzZXIgdG9vbGJhciAoc29tZSkuICovXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRjdXRQbGFjZXMoYWN0aW9uOiBQaWNrPFNob3J0Y3V0QWN0aW9uLCAnaWQnIHwgJ3Njb3BlJz4pOiBTaG9ydGN1dFBsYWNlW10ge1xuICBpZiAoQlJPV1NFUl9PTkxZX1NDT1BFUy5oYXMoYWN0aW9uLnNjb3BlKSkgcmV0dXJuIFtQTEFDRV9CUl07XG4gIHJldHVybiBUT09MQkFSX0FDVElPTl9JRFMuaGFzKGFjdGlvbi5pZCkgPyBbUExBQ0VfVlMsIFBMQUNFX0JSXSA6IFtQTEFDRV9WU107XG59XG5cbi8qKiBIb3cgcGVvcGxlIHdyaXRlIG1vZGlmaWVycyBhbmQga2V5cyB3aGVuIHNlYXJjaGluZywgbWFwcGVkIHRvIHRoZSBuYW1lcyBrZXlzIGFyZSBzdG9yZWQgd2l0aC4gKi9cbmNvbnN0IFFVRVJZX0FMSUFTRVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGNvbnRyb2w6ICdjdHJsJyxcbiAgY3RsOiAnY3RybCcsXG4gICdcdTIzMDMnOiAnY3RybCcsXG4gIG9wdGlvbjogJ2FsdCcsXG4gIG9wdDogJ2FsdCcsXG4gICdcdTIzMjUnOiAnYWx0JyxcbiAgY29tbWFuZDogJ2NtZCcsXG4gIG1ldGE6ICdjbWQnLFxuICB3aW46ICdjbWQnLFxuICBzdXBlcjogJ2NtZCcsXG4gICdcdTIzMTgnOiAnY21kJyxcbiAgJ1x1MjFFNyc6ICdzaGlmdCcsXG4gIGVzYzogJ2VzY2FwZScsXG4gIHJldHVybjogJ2VudGVyJyxcbiAgJ1x1MjFBOSc6ICdlbnRlcicsXG4gIGRlbDogJ2RlbGV0ZScsXG4gICdcdTIxOTEnOiAndXAnLFxuICAnXHUyMTkzJzogJ2Rvd24nLFxuICAnXHUyMTkwJzogJ2xlZnQnLFxuICAnXHUyMTkyJzogJ3JpZ2h0JyxcbiAgcGd1cDogJ3BhZ2V1cCcsXG4gIHBnZG46ICdwYWdlZG93bicsXG4gIC8vIFpvb20gaW4gaXMgc3RvcmVkIGFzICc9JyAodGhlIGtleSAnKycgc2hhcmVzKS5cbiAgJysnOiAnPScsXG59O1xuY29uc3QgUVVFUllfTU9ESUZJRVJTID0gbmV3IFNldChbJ2N0cmwnLCAnc2hpZnQnLCAnYWx0JywgJ2NtZCddKTtcblxuLyoqXG4gKiBXaGV0aGVyIGEga2V5IG1hdGNoZXMgYSBzZWFyY2ggdHlwZWQgYXMgYSBzaG9ydGN1dDogXCJhbHQgc2hpZnQga1wiLCBcIkFsdCtTaGlmdCtLXCIsIFwic2hpZnQtYWx0LWtcIlxuICogb3IgXCJcdTIzMjVcdTIxRTdLXCIgYWxsIGZpbmQgYGFsdCtzaGlmdCtrYC4gTW9kaWZpZXJzIG1heSBjb21lIGluIGFueSBvcmRlcjsgZXZlcnkgb25lIHR5cGVkIG11c3QgYmUgaW4gdGhlXG4gKiBrZXk7IHRoZSBrZXkgaXRzZWxmLCBpZiB0eXBlZCwgbXVzdCBzdGFydCB0aGUga2V5J3MgbmFtZSAoXCJwYWdlXCIgZmluZHMgUGdVcCBhbmQgUGdEbikuIEEgc2VhcmNoXG4gKiB3aXRoIG5vIG1vZGlmaWVyIGFuZCBubyBrZXkgKHBsYWluIHdvcmRzKSBtYXRjaGVzIG5vdGhpbmcgaGVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtleU1hdGNoZXNRdWVyeShiaW5kaW5nOiBzdHJpbmcsIHF1ZXJ5OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgdG9rZW5zID0gcXVlcnlcbiAgICAudG9Mb3dlckNhc2UoKVxuICAgIC8vIE1hYyBzeW1ib2xzIGNhbiBiZSB0eXBlZCB3aXRob3V0IHNlcGFyYXRvcnMgKFwiXHUyMzI1XHUyMUU3S1wiKS5cbiAgICAucmVwbGFjZSgvKFtcdTIzMDNcdTIzMjVcdTIxRTdcdTIzMThcdTIxQTlcdTIxOTFcdTIxOTNcdTIxOTBcdTIxOTJdKS9nLCAnICQxICcpXG4gICAgLy8gXCIrXCIgYW5kIFwiLVwiIHNlcGFyYXRlIHBhcnRzLCB1bmxlc3MgdGhleSBhcmUgdGhlIGtleSBpdHNlbGY6IFwiQ3RybCstXCIsIFwiY3RybCArXCIsIFwiQWx0Kz1cIi5cbiAgICAuc3BsaXQoL1xccyt8WystXSg/PS4pLylcbiAgICAuZmlsdGVyKEJvb2xlYW4pXG4gICAgLm1hcCgodG9rZW4pID0+IFFVRVJZX0FMSUFTRVNbdG9rZW5dID8/IHRva2VuKTtcbiAgaWYgKCF0b2tlbnMubGVuZ3RoKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IG1vZGlmaWVycyA9IHRva2Vucy5maWx0ZXIoKHQpID0+IFFVRVJZX01PRElGSUVSUy5oYXModCkpO1xuICBjb25zdCBrZXlzID0gdG9rZW5zLmZpbHRlcigodCkgPT4gIVFVRVJZX01PRElGSUVSUy5oYXModCkpO1xuICBpZiAoa2V5cy5sZW5ndGggPiAxKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IGNob3JkID0gcGFyc2VDaG9yZChub3JtYWxpemVLZXkoYmluZGluZykpO1xuICBjb25zdCBoYXM6IFJlY29yZDxzdHJpbmcsIGJvb2xlYW4+ID0ge1xuICAgIGN0cmw6IGNob3JkLmN0cmwsXG4gICAgc2hpZnQ6IGNob3JkLnNoaWZ0LFxuICAgIGFsdDogY2hvcmQuYWx0LFxuICAgIGNtZDogY2hvcmQubWV0YSxcbiAgfTtcbiAgaWYgKCFtb2RpZmllcnMuZXZlcnkoKG0pID0+IGhhc1ttXSkpIHJldHVybiBmYWxzZTtcbiAgY29uc3QgW2tleV0gPSBrZXlzO1xuICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgfHwgY2hvcmQua2V5LnN0YXJ0c1dpdGgoa2V5KTtcbn1cblxuLyoqXG4gKiBUaGUgc2hvcnRjdXQgYSBrZXkgcHJlc3MgaW4gYSBzZWFyY2ggYm94IHN0YW5kcyBmb3IsIGlmIGl0IGlzbid0IHR5cGluZy4gV2hpbGUgdGhlIGJveCBoYXNcbiAqIGZvY3VzIGl0IHRyYXBzIGV2ZXJ5IHNob3J0Y3V0OiBhbnl0aGluZyB3aXRoIEN0cmwsIEFsdCBvciBDbWQgKEN0cmwrQyBhbmQgQ3RybCtWIGluY2x1ZGVkKSwgYW5kXG4gKiBGMVx1MjAxM0YyNC4gUGxhaW4ga2V5cywgU2hpZnQra2V5IGFuZCB0aGUgYm94J3MgcGxhaW4gZWRpdGluZyBrZXlzIChCYWNrc3BhY2UsIGFycm93cykgdHlwZSBhcyB1c3VhbC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNlYXJjaEtleUZyb21DaG9yZChjaG9yZDogS2V5Q2hvcmQpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBpZiAoIWNob3JkLmtleSkgcmV0dXJuIHVuZGVmaW5lZDtcbiAgY29uc3QgZnVuY3Rpb25LZXkgPSAvXmYoWzEtOV18MVxcZHwyWzAtNF0pJC8udGVzdChjaG9yZC5rZXkpO1xuICByZXR1cm4gY2hvcmQuY3RybCB8fCBjaG9yZC5hbHQgfHwgY2hvcmQubWV0YSB8fCBmdW5jdGlvbktleSA/IGNob3JkS2V5KGNob3JkKSA6IHVuZGVmaW5lZDtcbn1cblxuLyoqIEEga2V5IGFzIHNlcGFyYXRlIGNhcHMgZm9yIGRpc3BsYXk6IGBbJ0N0cmwnLCAnU2hpZnQnLCAnVCddYCwgYFsnXHUyMUU3JywgJ1x1MjMxOCcsICdUJ11gLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGtleVBhcnRzKGJpbmRpbmc6IHN0cmluZywgbWFjOiBib29sZWFuKTogc3RyaW5nW10ge1xuICBjb25zdCB0ZXh0ID0gZm9ybWF0S2V5KGJpbmRpbmcsIG1hYyk7XG4gIGlmIChtYWMpIHtcbiAgICBjb25zdCBtb2RpZmllcnMgPSBbLi4udGV4dC5tYXRjaEFsbCgvW1x1MjMwM1x1MjMyNVx1MjFFN1x1MjMxOF0vZyldLm1hcCgobSkgPT4gbVswXSk7XG4gICAgcmV0dXJuIFsuLi5tb2RpZmllcnMsIHRleHQucmVwbGFjZSgvW1x1MjMwM1x1MjMyNVx1MjFFN1x1MjMxOF0vZywgJycpXTtcbiAgfVxuICAvLyBTcGxpdCBvbiBcIitcIiBiZXR3ZWVuIHBhcnRzLCBrZWVwaW5nIGEgXCIrXCIga2V5IGl0c2VsZi5cbiAgcmV0dXJuIHRleHQuc3BsaXQoL1xcKyg/PS4pLyk7XG59XG5cbi8qKiBDb2RpY29ucyBmb3IgdGhlIHNjb3BlcyAodGhlIFNob3J0Y3V0cyB2aWV3LCB0aGUgY2hlYXQgc2hlZXQpLiAqL1xuZXhwb3J0IGNvbnN0IFNDT1BFX0lDT05TOiBSZWNvcmQ8U2hvcnRjdXRTY29wZSwgc3RyaW5nPiA9IHtcbiAgZ2xvYmFsOiAnYnJvd3NlcicsXG4gIGluc3BlY3Q6ICdpbnNwZWN0JyxcbiAgZHJhdzogJ2VkaXQnLFxuICBzY3JlZW5zaG90OiAnZGV2aWNlLWNhbWVyYScsXG4gIGRldnRvb2xzOiAnZGVidWctY29uc29sZScsXG4gIGRldmljZTogJ2RldmljZS1tb2JpbGUnLFxuICBtZWFzdXJlOiAnc3ltYm9sLXJ1bGVyJyxcbiAgZXllZHJvcHBlcjogJ3N5bWJvbC1jb2xvcicsXG4gIG92ZXJsYXk6ICdsYXllcnMnLFxuICB0d2VhazogJ3N5bWJvbC1wcm9wZXJ0eScsXG4gIHJlY29yZDogJ3JlY29yZCcsXG4gIGExMXk6ICdhY2Nlc3NpYmlsaXR5JyxcbiAgc2VuZDogJ3NlbmQnLFxufTtcblxuLyoqIEEga2V5IGZvciBwZW9wbGU6IGBDdHJsK1NoaWZ0K1RgLCBgXHUyMUU3XHUyMzE4VGAsIGBFc2NgLCBgXHUyMTkxYC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRLZXkoYmluZGluZzogc3RyaW5nLCBtYWM6IGJvb2xlYW4pOiBzdHJpbmcge1xuICBjb25zdCBjaG9yZCA9IHBhcnNlQ2hvcmQoYmluZGluZyk7XG4gIGNvbnN0IG5hbWVzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAgIGVzY2FwZTogJ0VzYycsXG4gICAgZW50ZXI6IG1hYyA/ICdcdTIxQTknIDogJ0VudGVyJyxcbiAgICBiYWNrc3BhY2U6IG1hYyA/ICdcdTIzMkInIDogJ0JhY2tzcGFjZScsXG4gICAgZGVsZXRlOiBtYWMgPyAnXHUyMzI2JyA6ICdEZWxldGUnLFxuICAgIHVwOiAnXHUyMTkxJyxcbiAgICBkb3duOiAnXHUyMTkzJyxcbiAgICBsZWZ0OiAnXHUyMTkwJyxcbiAgICByaWdodDogJ1x1MjE5MicsXG4gICAgcGFnZXVwOiAnUGdVcCcsXG4gICAgcGFnZWRvd246ICdQZ0RuJyxcbiAgICB0YWI6IG1hYyA/ICdcdTIxRTUnIDogJ1RhYicsXG4gICAgc3BhY2U6ICdTcGFjZScsXG4gICAgJy8nOiBjaG9yZC5zaGlmdCA/ICc/JyA6ICcvJyxcbiAgfTtcbiAgY29uc3Qgc2hpZnRTaG93biA9ICEoY2hvcmQua2V5ID09PSAnLycgJiYgY2hvcmQuc2hpZnQpO1xuICBjb25zdCBrZXkgPVxuICAgIG5hbWVzW2Nob3JkLmtleV0gPz9cbiAgICAoY2hvcmQua2V5Lmxlbmd0aCA9PT0gMVxuICAgICAgPyBjaG9yZC5rZXkudG9VcHBlckNhc2UoKVxuICAgICAgOiBjaG9yZC5rZXlbMF0hLnRvVXBwZXJDYXNlKCkgKyBjaG9yZC5rZXkuc2xpY2UoMSkpO1xuICBpZiAobWFjKSB7XG4gICAgcmV0dXJuIGAke2Nob3JkLmN0cmwgPyAnXHUyMzAzJyA6ICcnfSR7Y2hvcmQuYWx0ID8gJ1x1MjMyNScgOiAnJ30ke2Nob3JkLnNoaWZ0ICYmIHNoaWZ0U2hvd24gPyAnXHUyMUU3JyA6ICcnfSR7Y2hvcmQubWV0YSA/ICdcdTIzMTgnIDogJyd9JHtrZXl9YDtcbiAgfVxuICByZXR1cm4gW2Nob3JkLmN0cmwgJiYgJ0N0cmwnLCBjaG9yZC5hbHQgJiYgJ0FsdCcsIGNob3JkLnNoaWZ0ICYmIHNoaWZ0U2hvd24gJiYgJ1NoaWZ0Jywga2V5XVxuICAgIC5maWx0ZXIoQm9vbGVhbilcbiAgICAuam9pbignKycpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtleUNob3JkIHtcbiAgY3RybDogYm9vbGVhbjtcbiAgc2hpZnQ6IGJvb2xlYW47XG4gIGFsdDogYm9vbGVhbjtcbiAgbWV0YTogYm9vbGVhbjtcbiAgLyoqIExvd2VyLWNhc2Uga2V5IG5hbWUgYXMgdXNlZCBpbiBWUyBDb2RlIGtleWJpbmRpbmdzLCBlLmcuIGB0YCwgYHRhYmAsIGBsZWZ0YCwgYD1gLiAqL1xuICBrZXk6IHN0cmluZztcbn1cblxuLyoqIFBhcnNlcyBhIFZTIENvZGUga2V5YmluZGluZyBzdWNoIGFzIGBjdHJsK3NoaWZ0K3RgIG9yIGBjbWQrW2AuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VDaG9yZChiaW5kaW5nOiBzdHJpbmcpOiBLZXlDaG9yZCB7XG4gIGNvbnN0IHBhcnRzID0gYmluZGluZy50b0xvd2VyQ2FzZSgpLnNwbGl0KCcrJyk7XG4gIC8vIEEgdHJhaWxpbmcgZW1wdHkgcGFydCBtZWFucyB0aGUga2V5IGl0c2VsZiB3YXMgYCtgIChlLmcuIGBjdHJsKytgKTsgbm90IHVzZWQgaGVyZS5cbiAgY29uc3Qga2V5ID0gcGFydHMucG9wKCkgPz8gJyc7XG4gIHJldHVybiB7XG4gICAgY3RybDogcGFydHMuaW5jbHVkZXMoJ2N0cmwnKSxcbiAgICBzaGlmdDogcGFydHMuaW5jbHVkZXMoJ3NoaWZ0JyksXG4gICAgYWx0OiBwYXJ0cy5pbmNsdWRlcygnYWx0JyksXG4gICAgbWV0YTogcGFydHMuaW5jbHVkZXMoJ2NtZCcpIHx8IHBhcnRzLmluY2x1ZGVzKCdtZXRhJykgfHwgcGFydHMuaW5jbHVkZXMoJ3dpbicpLFxuICAgIGtleSxcbiAgfTtcbn1cblxuLyoqIFZTIENvZGUga2V5IG5hbWVzIGZvciBgS2V5Ym9hcmRFdmVudC5rZXlgIHZhbHVlcyB0aGF0IGRpZmZlciBmcm9tIHRoZSBsb3dlci1jYXNlZCBrZXkuICovXG5jb25zdCBLRVlfTkFNRVM6IFJlY29yZDxzdHJpbmcsIHN0cmluZz4gPSB7XG4gIGFycm93bGVmdDogJ2xlZnQnLFxuICBhcnJvd3JpZ2h0OiAncmlnaHQnLFxuICBhcnJvd3VwOiAndXAnLFxuICBhcnJvd2Rvd246ICdkb3duJyxcbiAgZXNjOiAnZXNjYXBlJyxcbiAgJyAnOiAnc3BhY2UnLFxuICAnKyc6ICc9Jyxcbn07XG5cbi8qKiBQdW5jdHVhdGlvbiBieSBpdHMgcGxhY2Ugb24gYSBVUyBrZXlib2FyZCwgd2hlbiB0aGUgdHlwZWQgY2hhcmFjdGVyIGlzIG5vIGhlbHAuICovXG5jb25zdCBDT0RFX05BTUVTOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICBFcXVhbDogJz0nLFxuICBNaW51czogJy0nLFxuICBCcmFja2V0TGVmdDogJ1snLFxuICBCcmFja2V0UmlnaHQ6ICddJyxcbiAgU2xhc2g6ICcvJyxcbiAgQmFja3NsYXNoOiAnXFxcXCcsXG4gIENvbW1hOiAnLCcsXG4gIFBlcmlvZDogJy4nLFxuICBTZW1pY29sb246ICc7JyxcbiAgUXVvdGU6IFwiJ1wiLFxuICBCYWNrcXVvdGU6ICdgJyxcbiAgTnVtcGFkQWRkOiAnPScsXG4gIE51bXBhZFN1YnRyYWN0OiAnLScsXG59O1xuXG4vKiogS2V5cyB0aGF0IGFyZSBvbmx5IG1vZGlmaWVyczogbmV2ZXIgYSBzaG9ydGN1dCBvbiB0aGVpciBvd24uICovXG5leHBvcnQgY29uc3QgTU9ESUZJRVJfS0VZUyA9IG5ldyBTZXQoWydDb250cm9sJywgJ1NoaWZ0JywgJ0FsdCcsICdNZXRhJywgJ0FsdEdyYXBoJywgJ09TJ10pO1xuXG4vKiogV2hhdCBTaGlmdCB0eXBlcyBvbiBhIFVTIGxheW91dCwgYmFjayB0byBpdHMga2V5OiBcIj9cIiBpcyBTaGlmdCsvIHdoYXRldmVyIHRoZSBsYXlvdXQuICovXG5jb25zdCBTSElGVEVEOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0ge1xuICAnPyc6ICcvJyxcbiAgJzwnOiAnLCcsXG4gICc+JzogJy4nLFxuICAnOic6ICc7JyxcbiAgJ1wiJzogXCInXCIsXG4gICd7JzogJ1snLFxuICAnfSc6ICddJyxcbiAgJ3wnOiAnXFxcXCcsXG4gICd+JzogJ2AnLFxuICBfOiAnLScsXG4gICcrJzogJz0nLFxuICAnISc6ICcxJyxcbiAgJ0AnOiAnMicsXG4gICcjJzogJzMnLFxuICAkOiAnNCcsXG4gICclJzogJzUnLFxuICAnXic6ICc2JyxcbiAgJyYnOiAnNycsXG4gICcqJzogJzgnLFxuICAnKCc6ICc5JyxcbiAgJyknOiAnMCcsXG59O1xuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBwYXJ0cyBvZiBhIGtleWJvYXJkIGV2ZW50IGludG8gYSBjaG9yZCBjb21wYXJhYmxlIHdpdGggYHBhcnNlQ2hvcmRgIG91dHB1dC5cbiAqXG4gKiBLZXlzIGFyZSB3aGF0IHRoZSB1c2VyIHNlZXMgb24gdGhlbTogdGhlIGxldHRlciwgZGlnaXQgb3IgcHVuY3R1YXRpb24gbWFyayB0eXBlZCAoc28gQ3RybCtaIGlzXG4gKiBDdHJsK1ogb24gQVpFUlRZIGFuZCBRV0VSVFogdG9vLCBhbmQgXCItXCIgaXMgXCItXCIgb24gYSBHZXJtYW4ga2V5Ym9hcmQpLCBhbmQgXCI/XCIgaXMgU2hpZnQrLyBvblxuICogZXZlcnkgbGF5b3V0LiBXaGVyZSB0aGUgdHlwZWQgY2hhcmFjdGVyIGlzIG5vIGhlbHAgKEN5cmlsbGljIGFuZCBHcmVlayBsYXlvdXRzLCBtYWNPUyBPcHRpb25cbiAqIGNoYXJhY3RlcnMsIGRlYWQga2V5cyksIHRoZSBrZXkncyBwbGFjZSBvbiBhIFVTIGtleWJvYXJkIGlzIHVzZWQgaW5zdGVhZC4gQWx0R3IgKEN0cmwrQWx0IG9uXG4gKiBXaW5kb3dzKSB0eXBlcyBjaGFyYWN0ZXJzLCBzbyBpdCBuZXZlciBtYWtlcyBhIHNob3J0Y3V0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2hvcmRGcm9tRXZlbnQoZXZlbnQ6IHtcbiAga2V5OiBzdHJpbmc7XG4gIGNvZGU6IHN0cmluZztcbiAgY3RybEtleTogYm9vbGVhbjtcbiAgc2hpZnRLZXk6IGJvb2xlYW47XG4gIGFsdEtleTogYm9vbGVhbjtcbiAgbWV0YUtleTogYm9vbGVhbjtcbiAgZ2V0TW9kaWZpZXJTdGF0ZT86IChrZXk6IHN0cmluZykgPT4gYm9vbGVhbjtcbn0pOiBLZXlDaG9yZCB7XG4gIGNvbnN0IGNob3JkID0ge1xuICAgIGN0cmw6IGV2ZW50LmN0cmxLZXksXG4gICAgc2hpZnQ6IGV2ZW50LnNoaWZ0S2V5LFxuICAgIGFsdDogZXZlbnQuYWx0S2V5LFxuICAgIG1ldGE6IGV2ZW50Lm1ldGFLZXksXG4gIH07XG4gIGlmIChldmVudC5nZXRNb2RpZmllclN0YXRlPy4oJ0FsdEdyYXBoJykpIHJldHVybiB7IC4uLmNob3JkLCBrZXk6ICcnIH07XG4gIGNvbnN0IHR5cGVkID0gZXZlbnQua2V5O1xuICBsZXQga2V5OiBzdHJpbmc7XG4gIGlmICgvXlthLXowLTldJC9pLnRlc3QodHlwZWQpKSBrZXkgPSB0eXBlZC50b0xvd2VyQ2FzZSgpO1xuICBlbHNlIGlmIChldmVudC5zaGlmdEtleSAmJiBTSElGVEVEW3R5cGVkXSAhPT0gdW5kZWZpbmVkKSBrZXkgPSBTSElGVEVEW3R5cGVkXSE7XG4gIGVsc2UgaWYgKC9eWy09W1xcXVxcXFwvLC47J2ArXSQvLnRlc3QodHlwZWQpKSBrZXkgPSB0eXBlZDtcbiAgZWxzZSBpZiAoL15LZXlbQS1aXSQvLnRlc3QoZXZlbnQuY29kZSkpIGtleSA9IGV2ZW50LmNvZGUuc2xpY2UoMykudG9Mb3dlckNhc2UoKTtcbiAgZWxzZSBpZiAoL15EaWdpdFxcZCQvLnRlc3QoZXZlbnQuY29kZSkpIGtleSA9IGV2ZW50LmNvZGUuc2xpY2UoNSk7XG4gIGVsc2UgaWYgKENPREVfTkFNRVNbZXZlbnQuY29kZV0pIGtleSA9IENPREVfTkFNRVNbZXZlbnQuY29kZV0hO1xuICBlbHNlIGtleSA9IHR5cGVkLnRvTG93ZXJDYXNlKCk7XG4gIHJldHVybiB7IC4uLmNob3JkLCBrZXk6IEtFWV9OQU1FU1trZXldID8/IGtleSB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2hvcmRzRXF1YWwoYTogS2V5Q2hvcmQsIGI6IEtleUNob3JkKTogYm9vbGVhbiB7XG4gIHJldHVybiAoXG4gICAgYS5rZXkgPT09IGIua2V5ICYmXG4gICAgYS5jdHJsID09PSBiLmN0cmwgJiZcbiAgICBhLnNoaWZ0ID09PSBiLnNoaWZ0ICYmXG4gICAgYS5hbHQgPT09IGIuYWx0ICYmXG4gICAgYS5tZXRhID09PSBiLm1ldGFcbiAgKTtcbn1cbiIsICIvLyBUaGUga2V5Ym9hcmQgc2hvcnRjdXRzIHRoZSB0b29sYmFyIHVzZXM6IHRoZSBzYW1lIHJlZ2lzdHJ5IGFuZCB0aGUgc2FtZSBrZXkgbWFwIGFzIFZTIENvZGVcbi8vIEJyb3dzZXIgKGBAaW5rc3BlY3Qvc2hhcmVkL3Nob3J0Y3V0c2ApLiBUaGUgbWFwIGxpdmVzIGluIHRoaXMgYnJvd3NlcidzIHN5bmMgc3RvcmFnZTsgdGhlXG4vLyBiYWNrZ3JvdW5kIHBhc3NlcyBjaGFuZ2VzIHRvIFZTIENvZGUgYW5kIHRha2VzIFZTIENvZGUncyAoc2VlIGJhY2tncm91bmQvc2hvcnRjdXRTeW5jLnRzKSwgc29cbi8vIGEga2V5IGNoYW5nZWQgb24gZWl0aGVyIHNpZGUgd29ya3Mgb24gYm90aC5cbmltcG9ydCB7XG4gIGRlZmF1bHRLZXlzLFxuICBub3JtYWxpemVLZXksXG4gIGVmZmVjdGl2ZVNob3J0Y3V0cyxcbiAgc2FuaXRpemVPdmVycmlkZXMsXG4gIFNDT1BFX0xBQkVMUyxcbiAgU0hPUlRDVVRfQUNUSU9OUyxcbiAgVE9PTEJBUl9BQ1RJT05fSURTLFxuICB0eXBlIFNob3J0Y3V0QWN0aW9uLFxuICB0eXBlIFNob3J0Y3V0TWFwLFxuICB0eXBlIFNob3J0Y3V0T3ZlcnJpZGVzLFxuICB0eXBlIFNob3J0Y3V0U2NvcGUsXG59IGZyb20gJ0BpbmtzcGVjdC9zaGFyZWQvc2hvcnRjdXRzJztcblxuZXhwb3J0IGNvbnN0IFNIT1JUQ1VUU19LRVkgPSAnaW5rc3BlY3RTaG9ydGN1dHMnO1xuXG5leHBvcnQgY29uc3QgaXNNYWMgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKCdNYWNpbnRvc2gnKTtcblxuLyoqIFdoYXQgc3luYyBzdG9yYWdlIGhvbGRzOiB0aGUgY2hhbmdlZCBrZXlzIChhcyBpbiBWUyBDb2RlJ3Mgc2V0dGluZykgYW5kIHdoZW4gdGhleSBjaGFuZ2VkLiAqL1xuZXhwb3J0IGludGVyZmFjZSBTdG9yZWRTaG9ydGN1dHMge1xuICBvdmVycmlkZXM6IFNob3J0Y3V0T3ZlcnJpZGVzO1xuICB1cGRhdGVkOiBudW1iZXI7XG59XG5cbi8qKiBUaGUgYWN0aW9ucyB0aGUgdG9vbGJhciBoYW5kbGVzICh0aGUgc2hhcmVkIGxpc3QpLiBUaGUgb3RoZXJzIGFyZSBWUyBDb2RlIEJyb3dzZXIncyBvd24uICovXG5leHBvcnQgY29uc3QgVE9PTEJBUl9BQ1RJT05TOiByZWFkb25seSBTaG9ydGN1dEFjdGlvbltdID0gU0hPUlRDVVRfQUNUSU9OUy5maWx0ZXIoKGEpID0+XG4gIFRPT0xCQVJfQUNUSU9OX0lEUy5oYXMoYS5pZCksXG4pO1xuXG4vKiogV2hhdCB0aGUgdG9vbGJhciBjYWxscyBzb21lIG1vZGVzICh0aGUgcmVnaXN0cnkncyBsYWJlbHMgYXJlIFZTIENvZGUgQnJvd3NlcidzKS4gKi9cbmV4cG9ydCBjb25zdCBUT09MQkFSX0xBQkVMUzogUGFydGlhbDxSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PiA9IHtcbiAgJ21vZGUuZGV2aWNlJzogJ1Jlc3BvbnNpdmUgdmlldycsXG4gICdtb2RlLnNjcmVlbnNob3QnOiAnU2NyZWVuc2hvdCBtZW51JyxcbiAgJ29wZW4uc2hvcnRjdXRzJzogJ0tleWJvYXJkIHNob3J0Y3V0cycsXG59O1xuXG5leHBvcnQgY29uc3QgbGFiZWxPZiA9IChhY3Rpb246IFNob3J0Y3V0QWN0aW9uKSA9PiBUT09MQkFSX0xBQkVMU1thY3Rpb24uaWRdID8/IGFjdGlvbi5sYWJlbDtcblxuLyoqIEdyb3VwIG5hbWVzIGluIHRoZSBleHRlbnNpb24gKFZTIENvZGUgQnJvd3NlciBjYWxscyBpdHMgZ2VuZXJhbCBrZXlzIFwiQnJvd3NlclwiKS4gKi9cbmV4cG9ydCBjb25zdCBzY29wZUxhYmVsT2YgPSAoc2NvcGU6IFNob3J0Y3V0U2NvcGUpID0+XG4gIHNjb3BlID09PSAnZ2xvYmFsJyA/ICdHZW5lcmFsJyA6IFNDT1BFX0xBQkVMU1tzY29wZV07XG5cbi8qKiBUaGUgc2NvcGVzIHRoZSB0b29sYmFyIGhhcywgaW4gdGhlIG9yZGVyIHRoZXkgYXJlIGxpc3RlZC4gKi9cbmV4cG9ydCBjb25zdCBUT09MQkFSX1NDT1BFUzogcmVhZG9ubHkgU2hvcnRjdXRTY29wZVtdID0gWydnbG9iYWwnLCAnaW5zcGVjdCcsICdkcmF3JywgJ3NjcmVlbnNob3QnXTtcblxuLyoqXG4gKiBFdmVyeSBncm91cCwgdGhlIHRvb2xiYXIncyBmaXJzdC4gVGhlIGxpc3RzIHNob3cgZXZlcnkgc2hvcnRjdXQsIG5vdCBvbmx5IHRoZSB0b29sYmFyJ3M6IHRoZXlcbiAqIGFyZSBvbmUga2V5IG1hcCwgc3luY2VkIHdpdGggVlMgQ29kZSwgc28gYW55IG9mIHRoZW0gY2FuIGJlIGNoYW5nZWQgZnJvbSBlaXRoZXIgc2lkZS5cbiAqL1xuZXhwb3J0IGNvbnN0IEFMTF9TQ09QRVM6IHJlYWRvbmx5IFNob3J0Y3V0U2NvcGVbXSA9IFtcbiAgLi4uVE9PTEJBUl9TQ09QRVMsXG4gIC4uLihPYmplY3Qua2V5cyhTQ09QRV9MQUJFTFMpIGFzIFNob3J0Y3V0U2NvcGVbXSkuZmlsdGVyKChzKSA9PiAhVE9PTEJBUl9TQ09QRVMuaW5jbHVkZXMocykpLFxuXTtcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlYWRTaG9ydGN1dHMoKTogUHJvbWlzZTxTdG9yZWRTaG9ydGN1dHM+IHtcbiAgY29uc3QgdmFsdWUgPSAoYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU0hPUlRDVVRTX0tFWSkpW1NIT1JUQ1VUU19LRVldIGFzXG4gICAgeyBzaG9ydGN1dHM/OiB1bmtub3duOyB1cGRhdGVkPzogdW5rbm93biB9IHwgdW5kZWZpbmVkO1xuICByZXR1cm4ge1xuICAgIG92ZXJyaWRlczogc2FuaXRpemVPdmVycmlkZXModmFsdWU/LnNob3J0Y3V0cyA/PyB7fSksXG4gICAgdXBkYXRlZDogdHlwZW9mIHZhbHVlPy51cGRhdGVkID09PSAnbnVtYmVyJyA/IHZhbHVlLnVwZGF0ZWQgOiAwLFxuICB9O1xufVxuXG4vKipcbiAqIFNhdmVzIGNoYW5nZWQga2V5cy4gVGhlIHRpbWUgaXMgYWx3YXlzIGxhdGVyIHRoYW4gdGhlIHN0b3JlZCBvbmUsIHNvIHRoZSBjaGFuZ2Ugd2lucyBvdmVyXG4gKiBWUyBDb2RlJ3MgY29weSAodGhlIG5ld2VyIGNvcHkgd2lucyksIGV2ZW4gd2hlbiB0aGlzIGRldmljZSdzIGNsb2NrIGlzIGJlaGluZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHdyaXRlU2hvcnRjdXRzKG92ZXJyaWRlczogU2hvcnRjdXRPdmVycmlkZXMpOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgeyB1cGRhdGVkIH0gPSBhd2FpdCByZWFkU2hvcnRjdXRzKCk7XG4gIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHtcbiAgICBbU0hPUlRDVVRTX0tFWV06IHsgc2hvcnRjdXRzOiBvdmVycmlkZXMsIHVwZGF0ZWQ6IE1hdGgubWF4KERhdGUubm93KCksIHVwZGF0ZWQgKyAxKSB9LFxuICB9KTtcbn1cblxuLyoqIENhbGxzIGBsaXN0ZW5lcmAgd2l0aCB0aGUga2V5IG1hcCBub3cgYW5kIHdoZW5ldmVyIGl0IGNoYW5nZXMgKGhlcmUsIG9uIGFub3RoZXIgZGV2aWNlIG9yIGluIFZTIENvZGUpLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdhdGNoU2hvcnRjdXRzKFxuICBsaXN0ZW5lcjogKG1hcDogU2hvcnRjdXRNYXAsIHN0b3JlZDogU3RvcmVkU2hvcnRjdXRzKSA9PiB2b2lkLFxuKTogKCkgPT4gdm9pZCB7XG4gIGNvbnN0IGxvYWQgPSAoKSA9PlxuICAgIHZvaWQgcmVhZFNob3J0Y3V0cygpXG4gICAgICAudGhlbigoc3RvcmVkKSA9PiBsaXN0ZW5lcihlZmZlY3RpdmVTaG9ydGN1dHMoc3RvcmVkLm92ZXJyaWRlcywgaXNNYWMpLCBzdG9yZWQpKVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgLy8gU3RvcmFnZSBnb25lICh0aGUgZXh0ZW5zaW9uIHdhcyByZWxvYWRlZCk6IHRoZSBrZXlzIHN0YXkgYXMgdGhleSBhcmUuXG4gICAgICB9KTtcbiAgY29uc3Qgb25DaGFuZ2VkID0gKGNoYW5nZXM6IFJlY29yZDxzdHJpbmcsIGNocm9tZS5zdG9yYWdlLlN0b3JhZ2VDaGFuZ2U+LCBhcmVhOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoYXJlYSA9PT0gJ3N5bmMnICYmIGNoYW5nZXNbU0hPUlRDVVRTX0tFWV0pIGxvYWQoKTtcbiAgfTtcbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKG9uQ2hhbmdlZCk7XG4gIGxvYWQoKTtcbiAgcmV0dXJuICgpID0+IGNocm9tZS5zdG9yYWdlLm9uQ2hhbmdlZC5yZW1vdmVMaXN0ZW5lcihvbkNoYW5nZWQpO1xufVxuXG4vKipcbiAqIFNldHMgYW4gYWN0aW9uJ3Mga2V5cyBhbmQgc2F2ZXMuIEtleXMgZXF1YWwgdG8gdGhlIGRlZmF1bHRzIGFyZSBzdG9yZWQgYXMgXCJub3QgY2hhbmdlZFwiLCBzb1xuICogdGhlIG1hcCBzdGF5cyBzbWFsbCBhbmQgbGF0ZXIgZGVmYXVsdCBjaGFuZ2VzIHN0aWxsIGFwcGx5LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2V0U2hvcnRjdXRLZXlzKFxuICBvdmVycmlkZXM6IFNob3J0Y3V0T3ZlcnJpZGVzLFxuICBpZDogc3RyaW5nLFxuICBrZXlzOiBzdHJpbmdbXSB8IHVuZGVmaW5lZCxcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBuZXh0ID0geyAuLi5vdmVycmlkZXMgfTtcbiAgY29uc3QgYWN0aW9uID0gU0hPUlRDVVRfQUNUSU9OUy5maW5kKChhKSA9PiBhLmlkID09PSBpZCk7XG4gIGNvbnN0IGRlZmF1bHRzID0gYWN0aW9uID8gZGVmYXVsdEtleXMoYWN0aW9uLCBpc01hYykubWFwKG5vcm1hbGl6ZUtleSkgOiBbXTtcbiAgY29uc3Qgc2FtZSA9XG4gICAga2V5cyAhPT0gdW5kZWZpbmVkICYmXG4gICAga2V5cy5sZW5ndGggPT09IGRlZmF1bHRzLmxlbmd0aCAmJlxuICAgIGtleXMuZXZlcnkoKGtleSkgPT4gZGVmYXVsdHMuaW5jbHVkZXMoa2V5KSk7XG4gIGlmIChrZXlzID09PSB1bmRlZmluZWQgfHwgc2FtZSkgZGVsZXRlIG5leHRbaWRdO1xuICBlbHNlIG5leHRbaWRdID0ga2V5cztcbiAgYXdhaXQgd3JpdGVTaG9ydGN1dHMobmV4dCk7XG59XG5cbi8qKiBSZXNldHMgZXZlcnkgc2hvcnRjdXQgdG8gaXRzIGRlZmF1bHQsIGhlcmUgYW5kICh0aHJvdWdoIHRoZSBsaW5rKSBpbiBWUyBDb2RlLiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlc2V0QWxsU2hvcnRjdXRzKCk6IFByb21pc2U8dm9pZD4ge1xuICBhd2FpdCB3cml0ZVNob3J0Y3V0cyh7fSk7XG59XG4iLCAiLy8gS2VlcHMgdGhlIFZTIENvZGUgYnJvd3NlcidzIHNob3J0Y3V0cyBpbiB0aGlzIGJyb3dzZXIncyBzeW5jIHN0b3JhZ2UsIHNvIHRoZXkgZm9sbG93IHRoZVxuLy8gdXNlcidzIGJyb3dzZXIgYWNjb3VudCAoR29vZ2xlLCBNaWNyb3NvZnQsIEZpcmVmb3gpIHRvIG90aGVyIGRldmljZXMuIE5vIGJvb2ttYXJrcyBhcmUgdXNlZC5cbmltcG9ydCB7IG5ld2VyU2hvcnRjdXRzLCB0eXBlIFNob3J0Y3V0U2V0dGluZ3MgfSBmcm9tICdAaW5rc3BlY3Qvc2hhcmVkL2JyaWRnZSc7XG5pbXBvcnQgdHlwZSB7IEJyaWRnZUNsaWVudCB9IGZyb20gJy4vYnJpZGdlJztcblxuaW1wb3J0IHsgU0hPUlRDVVRTX0tFWSB9IGZyb20gJy4uL3Nob3J0Y3V0cyc7XG5cbmV4cG9ydCB7IFNIT1JUQ1VUU19LRVkgfTtcblxuYXN5bmMgZnVuY3Rpb24gc3RvcmVkKCk6IFByb21pc2U8U2hvcnRjdXRTZXR0aW5ncyB8IHVuZGVmaW5lZD4ge1xuICBjb25zdCB2YWx1ZSA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5zeW5jLmdldChTSE9SVENVVFNfS0VZKSlbU0hPUlRDVVRTX0tFWV0gYXMgdW5rbm93bjtcbiAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSByZXR1cm4gdW5kZWZpbmVkO1xuICBjb25zdCB7IHNob3J0Y3V0cywgdXBkYXRlZCB9ID0gdmFsdWUgYXMgUGFydGlhbDxTaG9ydGN1dFNldHRpbmdzPjtcbiAgaWYgKCFzaG9ydGN1dHMgfHwgdHlwZW9mIHNob3J0Y3V0cyAhPT0gJ29iamVjdCcgfHwgdHlwZW9mIHVwZGF0ZWQgIT09ICdudW1iZXInKSByZXR1cm4gdW5kZWZpbmVkO1xuICByZXR1cm4geyBzaG9ydGN1dHMsIHVwZGF0ZWQgfTtcbn1cblxuLyoqXG4gKiBWUyBDb2RlIHNlbnQgaXRzIHNob3J0Y3V0cyAoYWZ0ZXIgbGlua2luZywgb3Igd2hlbiB0aGV5IGNoYW5nZSk6IGtlZXAgdGhlIG5ld2VyIGNvcHkuIFdoZW5cbiAqIHRoaXMgYnJvd3NlcidzIGNvcHkgaXMgbmV3ZXIgKGNoYW5nZWQgb24gYW5vdGhlciBkZXZpY2UpLCBWUyBDb2RlIGdldHMgaXQgaW5zdGVhZC5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlY2VpdmVTaG9ydGN1dHMoXG4gIGJyaWRnZTogQnJpZGdlQ2xpZW50LFxuICBmcm9tVnNDb2RlOiBTaG9ydGN1dFNldHRpbmdzLFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IGxvY2FsID0gYXdhaXQgc3RvcmVkKCk7XG4gIHN3aXRjaCAobmV3ZXJTaG9ydGN1dHMobG9jYWwsIGZyb21Wc0NvZGUpKSB7XG4gICAgY2FzZSAncmVtb3RlJzpcbiAgICAgIGF3YWl0IGNocm9tZS5zdG9yYWdlLnN5bmMuc2V0KHtcbiAgICAgICAgW1NIT1JUQ1VUU19LRVldOiB7IHNob3J0Y3V0czogZnJvbVZzQ29kZS5zaG9ydGN1dHMsIHVwZGF0ZWQ6IGZyb21Wc0NvZGUudXBkYXRlZCB9LFxuICAgICAgfSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdsb2NhbCc6XG4gICAgICBpZiAobG9jYWwpIGJyaWRnZS5zZW5kKHsgdHlwZTogJ3NldHRpbmdzLnNob3J0Y3V0cycsIC4uLmxvY2FsIH0pO1xuICAgICAgYnJlYWs7XG4gIH1cbn1cblxuLyoqIFN5bmMgc3RvcmFnZSBjaGFuZ2VkICh1c3VhbGx5IGFub3RoZXIgZGV2aWNlKTogcGFzcyB0aGUgc2hvcnRjdXRzIG9uIHRvIFZTIENvZGUuICovXG5leHBvcnQgZnVuY3Rpb24gd2F0Y2hTaG9ydGN1dHMoYnJpZGdlOiBCcmlkZ2VDbGllbnQpOiB2b2lkIHtcbiAgY2hyb21lLnN0b3JhZ2Uub25DaGFuZ2VkLmFkZExpc3RlbmVyKChjaGFuZ2VzLCBhcmVhKSA9PiB7XG4gICAgaWYgKGFyZWEgIT09ICdzeW5jJyB8fCAhY2hhbmdlc1tTSE9SVENVVFNfS0VZXSB8fCAhYnJpZGdlLmNvbm5lY3RlZCkgcmV0dXJuO1xuICAgIHZvaWQgc3RvcmVkKCkudGhlbigoc2V0dGluZ3MpID0+IHtcbiAgICAgIGlmIChzZXR0aW5ncykgYnJpZGdlLnNlbmQoeyB0eXBlOiAnc2V0dGluZ3Muc2hvcnRjdXRzJywgLi4uc2V0dGluZ3MgfSk7XG4gICAgfSk7XG4gIH0pO1xufVxuIiwgIi8vIEJhY2tncm91bmQgKHNlcnZpY2Ugd29ya2VyIGluIENocm9tZSwgYmFja2dyb3VuZCBzY3JpcHRzIGluIEZpcmVmb3gpOiB0aGUgdG9vbGJhcidzIGhlbHBlclxuLy8gKGNhcHR1cmVzLCBkb3dubG9hZHMsIHRoZSByZXNwb25zaXZlIHZpZXcncyBlbXVsYXRpb24pLCB0aGUgbGluayB0byBWUyBDb2RlIGFuZCBsaXZlIHR3by13YXlcbi8vIGJvb2ttYXJrIHN5bmMuXG5pbXBvcnQgdHlwZSB7IFJlbW90ZU9wIH0gZnJvbSAnQGlua3NwZWN0L3NoYXJlZC9ib29rbWFya1N5bmMnO1xuaW1wb3J0IHsgZGV2aWNlVXNlckFnZW50LCBORVRXT1JLX0NPTkRJVElPTlMgfSBmcm9tICdAaW5rc3BlY3Qvc2hhcmVkL2RldmljZXMnO1xuaW1wb3J0IHR5cGUge1xuICBCYWNrZ3JvdW5kUmVwbHksXG4gIEJyaWRnZVN0YXR1cyxcbiAgRW11bGF0aW9uUmVxdWVzdCxcbiAgU2hvcnRjdXRQcmVzc2VkLFxuICBUb0JhY2tncm91bmQsXG4gIFRvQ29udGVudCxcbn0gZnJvbSAnLi4vbWVzc2FnZXMnO1xuaW1wb3J0IHsgYXBwbHlPcHMsIHNuYXBzaG90LCBzeW5jUm9vdHMgfSBmcm9tICcuL2Jvb2ttYXJrcyc7XG5pbXBvcnQgdHlwZSB7IEJyb3dzZXJUb0h1YiwgQ2FwdHVyZVRvU2F2ZSwgSHViVG9Ccm93c2VyIH0gZnJvbSAnQGlua3NwZWN0L3NoYXJlZC9odWInO1xuaW1wb3J0IHsgQnJpZGdlQ2xpZW50LCBicm93c2VyTmFtZSB9IGZyb20gJy4vYnJpZGdlJztcbmltcG9ydCB7IHJlY2VpdmVTaG9ydGN1dHMsIFNIT1JUQ1VUU19LRVksIHdhdGNoU2hvcnRjdXRzIH0gZnJvbSAnLi9zaG9ydGN1dFN5bmMnO1xuXG5jb25zdCBicmlkZ2UgPSBuZXcgQnJpZGdlQ2xpZW50KCk7XG52b2lkIGJyaWRnZS5zdGFydCgpO1xud2F0Y2hTaG9ydGN1dHMoYnJpZGdlKTtcblxuLyoqIFRoZSBrZXkgdGhlIGJyb3dzZXIgYXNzaWduZWQgdG8gb3BlbiB0aGUgdG9vbGJhciAodGhlIHVzZXIgbWF5IGhhdmUgY2hhbmdlZCBvciBjbGVhcmVkIGl0KS4gKi9cbmFzeW5jIGZ1bmN0aW9uIHRvb2xiYXJLZXkoKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgLy8gQ2hyb21lIHJlamVjdHMgZXh0ZW5zaW9uIGNhbGxzIG1hZGUgd2hpbGUgdGhlIHNlcnZpY2Ugd29ya2VyIGlzIHN0aWxsIHN0YXJ0aW5nIChcIk5vIFNXXCIpO1xuICAvLyB0aGUgdGl0bGUgdGhlbiBnb2VzIHdpdGhvdXQgdGhlIGtleSB1bnRpbCB0aGUgbmV4dCBzdGF0dXMgY2hhbmdlLlxuICBjb25zdCBjb21tYW5kcyA9IGF3YWl0IGNocm9tZS5jb21tYW5kcy5nZXRBbGwoKS5jYXRjaCgoKSA9PiBbXSk7XG4gIHJldHVybiBjb21tYW5kcy5maW5kKChjKSA9PiBjLm5hbWUgPT09ICd0b2dnbGUtdG9vbGJhcicpPy5zaG9ydGN1dCB8fCB1bmRlZmluZWQ7XG59XG5cbi8qKiBUaGUgdG9vbGJhciBidXR0b24gc2hvd3Mgd2hldGhlciB0aGUgbGluayB3b3JrczogXCIhXCIgbWVhbnMgXCJub3QgcGFpcmVkIHlldFwiLiAqL1xuYXN5bmMgZnVuY3Rpb24gc2hvd0xpbmtTdGF0ZShzdGF0dXM6IEJyaWRnZVN0YXR1cyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB1bnBhaXJlZCA9IHN0YXR1cy5zdGF0ZSA9PT0gJ3VucGFpcmVkJztcbiAgY29uc3Qga2V5ID0gYXdhaXQgdG9vbGJhcktleSgpO1xuICBjb25zdCB0b29sYmFyID0ga2V5ID8gYElua3NwZWN0IHRvb2xiYXIgKCR7a2V5fSlgIDogJ0lua3NwZWN0IHRvb2xiYXInO1xuICBhd2FpdCBQcm9taXNlLmFsbChbXG4gICAgY2hyb21lLmFjdGlvbi5zZXRCYWRnZVRleHQoeyB0ZXh0OiB1bnBhaXJlZCA/ICchJyA6ICcnIH0pLFxuICAgIGNocm9tZS5hY3Rpb24uc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IoeyBjb2xvcjogJyNkOTc3MDYnIH0pLFxuICAgIGNocm9tZS5hY3Rpb24uc2V0VGl0bGUoe1xuICAgICAgdGl0bGU6XG4gICAgICAgIHN0YXR1cy5zdGF0ZSA9PT0gJ2Nvbm5lY3RlZCdcbiAgICAgICAgICA/IGBJbmtzcGVjdDogYm9va21hcmtzIHN5bmMgd2l0aCAke3N0YXR1cy5wZWVyID8/ICdWUyBDb2RlJ31gXG4gICAgICAgICAgOiB1bnBhaXJlZFxuICAgICAgICAgICAgPyBgJHt0b29sYmFyfS4gTm90IHBhaXJlZCB3aXRoIFZTIENvZGUgeWV0YFxuICAgICAgICAgICAgOiB0b29sYmFyLFxuICAgIH0pLFxuICBdKTtcbn1cbmJyaWRnZS5vblN0YXR1cygoc3RhdHVzKSA9PlxuICAvLyBTYW1lIFwiTm8gU1dcIiBjYXNlIGF0IHN0YXJ0dXA6IHRyeSBhZ2FpbiBvbmNlIHRoZSBzZXJ2aWNlIHdvcmtlciBpcyB1cC5cbiAgc2hvd0xpbmtTdGF0ZShzdGF0dXMpLmNhdGNoKCgpID0+XG4gICAgc2V0VGltZW91dCgoKSA9PiB2b2lkIHNob3dMaW5rU3RhdGUoYnJpZGdlLnN0YXR1cykuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKSwgMTAwMCksXG4gICksXG4pO1xuXG4vKiogV2hhdCB0aGUgc2lkZSBwYW5lbCBtYXkgYXNrIHRoZSBicm93c2VyIGhlbHBlci4gKi9cbnR5cGUgUGFuZWxSZXF1ZXN0ID0gRXh0cmFjdDxcbiAgQnJvd3NlclRvSHViLFxuICB7XG4gICAgdHlwZTpcbiAgICAgIHwgJ3Byb2plY3RzLmdldCdcbiAgICAgIHwgJ2l0ZW1zLmdldCdcbiAgICAgIHwgJ2l0ZW0udGh1bWInXG4gICAgICB8ICdpdGVtLnJlbW92ZSdcbiAgICAgIHwgJ2l0ZW0ucmVzdG9yZSdcbiAgICAgIHwgJ2l0ZW0uc2VuZCdcbiAgICAgIHwgJ2l0ZW1zLm1vdmUnXG4gICAgICB8ICdwcm9qZWN0LnBpbic7XG4gIH1cbj47XG5jb25zdCBQQU5FTF9SRVFVRVNUUyA9IG5ldyBTZXQoW1xuICAncHJvamVjdHMuZ2V0JyxcbiAgJ2l0ZW1zLmdldCcsXG4gICdpdGVtLnRodW1iJyxcbiAgJ2l0ZW0uY29udGVudCcsXG4gICdpdGVtLnJlbW92ZScsXG4gICdpdGVtLnJlc3RvcmUnLFxuICAnaXRlbS5zZW5kJyxcbiAgJ2l0ZW1zLm1vdmUnLFxuICAnaXRlbXMuZ3JvdXAnLFxuICAnaXRlbXMudW5ncm91cCcsXG4gICdwcm9qZWN0LnBpbicsXG5dKTtcbmZ1bmN0aW9uIGlzUGFuZWxSZXF1ZXN0KHZhbHVlOiB1bmtub3duKTogdmFsdWUgaXMgUGFuZWxSZXF1ZXN0IHtcbiAgY29uc3QgdHlwZSA9ICh2YWx1ZSBhcyB7IHR5cGU/OiB1bmtub3duIH0gfCB1bmRlZmluZWQpPy50eXBlO1xuICAvLyBUaGUgaGVscGVyIHZhbGlkYXRlcyBldmVyeSBmaWVsZDsgaGVyZSBvbmx5IHRoZSBraW5kcyBvZiByZXF1ZXN0IGEgcGFnZSBtYXkgbWFrZS5cbiAgcmV0dXJuIHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyAmJiBQQU5FTF9SRVFVRVNUUy5oYXModHlwZSk7XG59XG5cbi8vIE1lc3NhZ2VzIGZyb20gdGhlIG9wdGlvbnMgcGFnZSAocGFpcmluZykuXG5jaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoXG4gIChtZXNzYWdlOiB7IHR5cGU/OiBzdHJpbmc7IGNvZGU/OiBzdHJpbmcgfSwgc2VuZGVyLCBzZW5kUmVzcG9uc2UpID0+IHtcbiAgICAvLyBPbmx5IG91ciBvd24gcGFnZXMuIFRoZSBzZXR0aW5ncyBwYWdlIG9wZW5zIGluIGEgdGFiLCBzbyBgc2VuZGVyLnRhYmAgY2FuJ3QgdGVsbCB0aGVtIGFwYXJ0LlxuICAgIGlmIChzZW5kZXIuaWQgIT09IGNocm9tZS5ydW50aW1lLmlkIHx8ICFzZW5kZXIudXJsPy5zdGFydHNXaXRoKGNocm9tZS5ydW50aW1lLmdldFVSTCgnJykpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdwYWlyJyAmJiBtZXNzYWdlLmNvZGUpIHtcbiAgICAgIHZvaWQgYnJpZGdlLnBhaXIobWVzc2FnZS5jb2RlKS50aGVuKChzdGF0dXMpID0+IHNlbmRSZXNwb25zZShzdGF0dXMpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAndW5wYWlyJykge1xuICAgICAgdm9pZCBicmlkZ2UudW5wYWlyKCkudGhlbigoKSA9PiBzZW5kUmVzcG9uc2UoYnJpZGdlLnN0YXR1cykpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzdGF0dXMnKSB7XG4gICAgICBzZW5kUmVzcG9uc2UoYnJpZGdlLnN0YXR1cyBzYXRpc2ZpZXMgQnJpZGdlU3RhdHVzKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy8gVGhlIHNpZGUgcGFuZWwncyBxdWVzdGlvbnMgZm9yIHRoZSBicm93c2VyIGhlbHBlciAocHJvamVjdHMsIHRoZWlyIGl0ZW1zLCBzZW5kcykuXG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2h1YicgJiYgaXNQYW5lbFJlcXVlc3QoKG1lc3NhZ2UgYXMgeyByZXF1ZXN0PzogdW5rbm93biB9KS5yZXF1ZXN0KSkge1xuICAgICAgY29uc3QgcmVxdWVzdCA9IChtZXNzYWdlIGFzIHsgcmVxdWVzdDogUGFuZWxSZXF1ZXN0IH0pLnJlcXVlc3Q7XG4gICAgICAvLyBBIHNlbmQgY2FuIHdhaXQgZm9yIFZTIENvZGU7IHRoZSBoZWxwZXIgZ2l2ZXMgdXAgYWZ0ZXIgMiBtaW51dGVzLlxuICAgICAgdm9pZCBicmlkZ2VcbiAgICAgICAgLmh1YlJlcXVlc3QocmVxdWVzdCwgcmVxdWVzdC50eXBlID09PSAnaXRlbS5zZW5kJyA/IDEzMF8wMDAgOiAzMF8wMDApXG4gICAgICAgIC50aGVuKChyZXBseSkgPT4gc2VuZFJlc3BvbnNlKHJlcGx5ID8/IG51bGwpKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAndG9nZ2xlVG9vbGJhcicpIHtcbiAgICAgIC8vIEZyb20gdGhlIHBvcHVwOiBpdHMgb3BlbmluZyBncmFudGVkIGFjdGl2ZVRhYiBmb3IgdGhlIHRhYiBpdCB3YXMgb3BlbmVkIG9uLlxuICAgICAgdm9pZCBjaHJvbWUudGFicy5xdWVyeSh7IGFjdGl2ZTogdHJ1ZSwgbGFzdEZvY3VzZWRXaW5kb3c6IHRydWUgfSkudGhlbihhc3luYyAoW3RhYl0pID0+IHtcbiAgICAgICAgaWYgKCF0YWIpIHJldHVybiBzZW5kUmVzcG9uc2UoeyBvazogZmFsc2UsIGVycm9yOiAnTm8gdGFiJyB9KTtcbiAgICAgICAgc2VuZFJlc3BvbnNlKGF3YWl0IHRvZ2dsZVRvb2xiYXIodGFiKSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4pO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEJvb2ttYXJrIHN5bmNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5sZXQgc3luY0VuYWJsZWQgPSBmYWxzZTtcbmxldCBhcHBseWluZyA9IGZhbHNlO1xubGV0IGltcG9ydGluZyA9IGZhbHNlO1xubGV0IHNuYXBzaG90VGltZXI6IFJldHVyblR5cGU8dHlwZW9mIHNldFRpbWVvdXQ+IHwgdW5kZWZpbmVkO1xuXG4vKiogQSBjaGFuZ2UgYXJyaXZlZCB3aGlsZSBWUyBDb2RlJ3Mgb3BlcmF0aW9ucyB3ZXJlIGJlaW5nIGFwcGxpZWQuICovXG5sZXQgY2hhbmdlZFdoaWxlQXBwbHlpbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gc2VuZFNuYXBzaG90U29vbihkZWxheSA9IDUwMCk6IHZvaWQge1xuICBpZiAoYXBwbHlpbmcpIHtcbiAgICBjaGFuZ2VkV2hpbGVBcHBseWluZyA9IHRydWU7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmICghc3luY0VuYWJsZWQgfHwgaW1wb3J0aW5nKSByZXR1cm47XG4gIGNsZWFyVGltZW91dChzbmFwc2hvdFRpbWVyKTtcbiAgc25hcHNob3RUaW1lciA9IHNldFRpbWVvdXQoYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBicmlkZ2Uuc2VuZCh7IHR5cGU6ICdib29rbWFya3Muc25hcHNob3QnLCB0cmVlOiBhd2FpdCBzbmFwc2hvdCgpIH0pO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLndhcm4oJ0lua3NwZWN0OiBjb3VsZCBub3QgcmVhZCBib29rbWFya3MnLCBlcnJvcik7XG4gICAgfVxuICB9LCBkZWxheSk7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGFwcGx5RnJvbVZzQ29kZShvcHM6IFJlbW90ZU9wW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgYXBwbHlpbmcgPSB0cnVlO1xuICB0cnkge1xuICAgIGNvbnN0IHsgY3JlYXRlZCwgZmFpbGVkIH0gPSBhd2FpdCBhcHBseU9wcyhvcHMpO1xuICAgIGJyaWRnZS5zZW5kKHsgdHlwZTogJ2Jvb2ttYXJrcy5hcHBsaWVkJywgY3JlYXRlZCwgZmFpbGVkIH0pO1xuICB9IGZpbmFsbHkge1xuICAgIC8vIExldCB0aGUgY2hhbmdlIGV2ZW50cyBvZiBvdXIgb3duIGVkaXRzIGFycml2ZSwgdGhlbiBjaGVjayBvbmNlIG1vcmU6IHRoZSB1c2VyIG1heSBoYXZlXG4gICAgLy8gY2hhbmdlZCBzb21ldGhpbmcgYXQgdGhlIHNhbWUgdGltZSAoYSBuby1vcCBzbmFwc2hvdCBjb3N0cyBvbmUgbWVzc2FnZSkuXG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBhcHBseWluZyA9IGZhbHNlO1xuICAgICAgaWYgKGNoYW5nZWRXaGlsZUFwcGx5aW5nKSB7XG4gICAgICAgIGNoYW5nZWRXaGlsZUFwcGx5aW5nID0gZmFsc2U7XG4gICAgICAgIHNlbmRTbmFwc2hvdFNvb24oKTtcbiAgICAgIH1cbiAgICB9LCAzMDApO1xuICB9XG59XG5cbmJyaWRnZS5vbk1lc3NhZ2UoKG1lc3NhZ2UpID0+IHtcbiAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICBjYXNlICd3ZWxjb21lJzpcbiAgICAgIHN5bmNFbmFibGVkID0gbWVzc2FnZS5zeW5jQm9va21hcmtzO1xuICAgICAgc2VuZFNuYXBzaG90U29vbigwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jvb2ttYXJrcy5yZXF1ZXN0U25hcHNob3QnOlxuICAgICAgc2VuZFNuYXBzaG90U29vbigwKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Jvb2ttYXJrcy5vcHMnOlxuICAgICAgdm9pZCBhcHBseUZyb21Wc0NvZGUobWVzc2FnZS5vcHMpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnc2V0dGluZ3Muc2hvcnRjdXRzJzpcbiAgICAgIHZvaWQgcmVjZWl2ZVNob3J0Y3V0cyhicmlkZ2UsIG1lc3NhZ2UpO1xuICAgICAgYnJlYWs7XG4gIH1cbn0pO1xuXG5jb25zdCBvbkJvb2ttYXJrQ2hhbmdlID0gKCkgPT4gc2VuZFNuYXBzaG90U29vbigpO1xuY2hyb21lLmJvb2ttYXJrcy5vbkNyZWF0ZWQuYWRkTGlzdGVuZXIob25Cb29rbWFya0NoYW5nZSk7XG5jaHJvbWUuYm9va21hcmtzLm9uUmVtb3ZlZC5hZGRMaXN0ZW5lcihvbkJvb2ttYXJrQ2hhbmdlKTtcbmNocm9tZS5ib29rbWFya3Mub25DaGFuZ2VkLmFkZExpc3RlbmVyKG9uQm9va21hcmtDaGFuZ2UpO1xuY2hyb21lLmJvb2ttYXJrcy5vbk1vdmVkLmFkZExpc3RlbmVyKG9uQm9va21hcmtDaGFuZ2UpO1xuY2hyb21lLmJvb2ttYXJrcy5vbkNoaWxkcmVuUmVvcmRlcmVkPy5hZGRMaXN0ZW5lcihvbkJvb2ttYXJrQ2hhbmdlKTtcbmNocm9tZS5ib29rbWFya3Mub25JbXBvcnRCZWdhbj8uYWRkTGlzdGVuZXIoKCkgPT4gKGltcG9ydGluZyA9IHRydWUpKTtcbmNocm9tZS5ib29rbWFya3Mub25JbXBvcnRFbmRlZD8uYWRkTGlzdGVuZXIoKCkgPT4ge1xuICBpbXBvcnRpbmcgPSBmYWxzZTtcbiAgc2VuZFNuYXBzaG90U29vbigpO1xufSk7XG5cbi8vIFJlY29ubmVjdCB3aGVuZXZlciB0aGUgYmFja2dyb3VuZCBzdGFydHMgYWdhaW4uXG5jaHJvbWUucnVudGltZS5vblN0YXJ0dXAuYWRkTGlzdGVuZXIoKCkgPT4gYnJpZGdlLmVuc3VyZUNvbm5lY3RlZCgpKTtcbmNocm9tZS5ydW50aW1lLm9uSW5zdGFsbGVkLmFkZExpc3RlbmVyKChkZXRhaWxzKSA9PiB7XG4gIGJyaWRnZS5lbnN1cmVDb25uZWN0ZWQoKTtcbiAgLy8gRmlyc3QgaW5zdGFsbDogb3BlbiB0aGUgc2V0dGluZ3MgcGFnZSwgd2hlcmUgdGhlIHBhaXJpbmcgY29kZSBnb2VzLlxuICBpZiAoZGV0YWlscy5yZWFzb24gPT09ICdpbnN0YWxsJykgdm9pZCBjaHJvbWUucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcbn0pO1xuXG4vLyBGb3IgdGhlIGVuZC10by1lbmQgdGVzdHM6IHRvZ2dsZSB0aGUgdG9vbGJhciB3aXRob3V0IGEgcmVhbCBrZXkgcHJlc3MuXG4oZ2xvYmFsVGhpcyBhcyB0eXBlb2YgZ2xvYmFsVGhpcyAmIHsgX19pbmtzcGVjdFRlc3Q/OiB1bmtub3duIH0pLl9faW5rc3BlY3RUZXN0ID0ge1xuICB0b2dnbGVUb29sYmFyOiBhc3luYyAodGFiSWQ6IG51bWJlcikgPT4gdG9nZ2xlVG9vbGJhcihhd2FpdCBjaHJvbWUudGFicy5nZXQodGFiSWQpKSxcbiAgYnJpZGdlU3RhdHVzOiAoKSA9PiBicmlkZ2Uuc3RhdHVzLFxuICByZWNvbm5lY3Q6ICgpID0+IGJyaWRnZS5yZWNvbm5lY3QoKSxcbiAgc3luY1N0YXRlOiAoKSA9PiAoeyBzeW5jRW5hYmxlZCwgYXBwbHlpbmcsIGltcG9ydGluZywgY29ubmVjdGVkOiBicmlkZ2UuY29ubmVjdGVkIH0pLFxuICBwYWlyOiAoY29kZTogc3RyaW5nKSA9PiBicmlkZ2UucGFpcihjb2RlKSxcbiAgc3luY2VkU2hvcnRjdXRzOiBhc3luYyAoKSA9PiAoYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc3luYy5nZXQoU0hPUlRDVVRTX0tFWSkpW1NIT1JUQ1VUU19LRVldLFxufTtcblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUb29sYmFyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuY2hyb21lLmNvbW1hbmRzLm9uQ29tbWFuZC5hZGRMaXN0ZW5lcigoY29tbWFuZCwgdGFiKSA9PiB7XG4gIGlmIChjb21tYW5kICE9PSAndG9nZ2xlLXRvb2xiYXInIHx8ICF0YWIpIHJldHVybjtcbiAgdm9pZCB0b29sYmFyS2V5KCkudGhlbigoc2hvd24pID0+IHtcbiAgICBjb25zdCBrZXkgPSBzaG93biAmJiBjb21tYW5kQmluZGluZyhzaG93bik7XG4gICAgLy8gT24gdGhlIGV4dGVuc2lvbidzIG93biBwYWdlcyAodGhlIHNldHRpbmdzIHBhZ2UpIHRoZSB0b29sYmFyIGNhbid0IG9wZW46IHRoZSBrZXkgZ29lcyB0b1xuICAgIC8vIHRoZSBwYWdlLCB3aG9zZSBzaG9ydGN1dCBzZWFyY2ggYm94IG1heSB3YW50IGl0LlxuICAgIGlmICh0YWIudXJsPy5zdGFydHNXaXRoKGNocm9tZS5ydW50aW1lLmdldFVSTCgnJykpKSB7XG4gICAgICBpZiAoa2V5KSB7XG4gICAgICAgIHZvaWQgY2hyb21lLnJ1bnRpbWVcbiAgICAgICAgICAuc2VuZE1lc3NhZ2UoeyB0eXBlOiAnc2hvcnRjdXRQcmVzc2VkJywga2V5IH0gc2F0aXNmaWVzIFNob3J0Y3V0UHJlc3NlZClcbiAgICAgICAgICAuY2F0Y2goKCkgPT4gdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdm9pZCB0b2dnbGVUb29sYmFyKHRhYiwga2V5KTtcbiAgfSk7XG59KTtcblxuLyoqIEEga2V5IGFzIENocm9tZSBzaG93cyBpdCAoXCJBbHQrU2hpZnQrS1wiLCBcIlx1MjMyNVx1MjFFN0tcIiBvbiBtYWNPUykgaW4gdGhlIHNob3J0Y3V0IG1hcCdzIGZvcm0uICovXG5mdW5jdGlvbiBjb21tYW5kQmluZGluZyhzaG93bjogc3RyaW5nKTogc3RyaW5nIHtcbiAgY29uc3QgbWFjOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+ID0geyAnXHUyMzAzJzogJ2N0cmwrJywgJ1x1MjMyNSc6ICdhbHQrJywgJ1x1MjFFNyc6ICdzaGlmdCsnLCAnXHUyMzE4JzogJ2NtZCsnIH07XG4gIHJldHVybiBzaG93blxuICAgIC5yZXBsYWNlKC9bXHUyMzAzXHUyMzI1XHUyMUU3XHUyMzE4XS9nLCAoc3ltYm9sKSA9PiBtYWNbc3ltYm9sXSEpXG4gICAgLnJlcGxhY2UoL15NYWNDdHJsXFwrL2ksICdjdHJsKycpXG4gICAgLnJlcGxhY2UoL0NvbW1hbmRcXCsvaSwgJ2NtZCsnKVxuICAgIC50b0xvd2VyQ2FzZSgpO1xufVxuXG4vLyBUaGUgdG9vbGJhciBidXR0b24gb3BlbnMgdGhlIHBvcHVwIChzcmMvcG9wdXAvKSwgd2hpY2ggb3BlbnMgdGhlIHRvb2xiYXIgd2l0aCAndG9nZ2xlVG9vbGJhcicuXG5cbi8qKiBQdXRzIHRoZSB0b29sYmFyJ3Mgc2NyaXB0cyBpbnRvIGEgdGFiIHVubGVzcyB0aGV5IGFyZSB0aGVyZTsgdHJ1ZSB3aGVuIHRoZXkgd2VyZSBhZGRlZC4gKi9cbmFzeW5jIGZ1bmN0aW9uIGluamVjdFRvb2xiYXIodGFiSWQ6IG51bWJlcik6IFByb21pc2U8Ym9vbGVhbj4ge1xuICBjb25zdCBbcHJvYmVdID0gYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmdW5jOiAoKSA9PiAhISh3aW5kb3cgYXMgV2luZG93ICYgeyBfX2lua3NwZWN0PzogYm9vbGVhbiB9KS5fX2lua3NwZWN0LFxuICB9KTtcbiAgaWYgKHByb2JlPy5yZXN1bHQpIHJldHVybiBmYWxzZTtcbiAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHsgdGFyZ2V0OiB7IHRhYklkIH0sIGZpbGVzOiBbJ2NvbnRlbnQuanMnXSB9KTtcbiAgYXdhaXQgY2hyb21lLnNjcmlwdGluZy5leGVjdXRlU2NyaXB0KHtcbiAgICB0YXJnZXQ6IHsgdGFiSWQgfSxcbiAgICBmaWxlczogWydtYWluLXdvcmxkLmpzJ10sXG4gICAgd29ybGQ6ICdNQUlOJyxcbiAgfSk7XG4gIHJldHVybiB0cnVlO1xufVxuXG5hc3luYyBmdW5jdGlvbiB0b2dnbGVUb29sYmFyKFxuICB0YWI6IGNocm9tZS50YWJzLlRhYixcbiAga2V5Pzogc3RyaW5nLFxuKTogUHJvbWlzZTx7IG9rOiBib29sZWFuOyBlcnJvcj86IHN0cmluZyB9PiB7XG4gIGJyaWRnZS5lbnN1cmVDb25uZWN0ZWQoKTtcbiAgaWYgKCF0YWIuaWQpIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdObyB0YWInIH07XG4gIHRyeSB7XG4gICAgYXdhaXQgaW5qZWN0VG9vbGJhcih0YWIuaWQpO1xuICAgIGF3YWl0IGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgeyB0eXBlOiAndG9nZ2xlJywga2V5IH0gc2F0aXNmaWVzIFRvQ29udGVudCk7XG4gICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgfSBjYXRjaCB7XG4gICAgLy8gY2hyb21lOi8vLCB0aGUgV2ViIFN0b3JlLCB0aGUgUERGIHZpZXdlci4uLiBleHRlbnNpb25zIGNhbid0IHJ1biB0aGVyZS5cbiAgICBhd2FpdCBjaHJvbWUuYWN0aW9uLnNldEJhZGdlVGV4dCh7IHRhYklkOiB0YWIuaWQsIHRleHQ6ICdcdTI3MTUnIH0pO1xuICAgIGF3YWl0IGNocm9tZS5hY3Rpb24uc2V0QmFkZ2VCYWNrZ3JvdW5kQ29sb3IoeyB0YWJJZDogdGFiLmlkLCBjb2xvcjogJyNiMzI2MWUnIH0pO1xuICAgIGF3YWl0IGNocm9tZS5hY3Rpb24uc2V0VGl0bGUoeyB0YWJJZDogdGFiLmlkLCB0aXRsZTogJ0lua3NwZWN0IGNhblx1MjAxOXQgcnVuIG9uIHRoaXMgcGFnZScgfSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9rOiBmYWxzZSxcbiAgICAgIGVycm9yOiAnSW5rc3BlY3QgY2FuXHUyMDE5dCBydW4gb24gdGhpcyBwYWdlIChicm93c2VyIHBhZ2VzLCB0aGUgV2ViIFN0b3JlLi4uKS4nLFxuICAgIH07XG4gIH1cbn1cblxuLy8gQW4gb3BlbiB0b29sYmFyIGNvbWVzIGJhY2sgd2hlbiBpdHMgcGFnZSByZWxvYWRzIChvciB0aGUgdGFiIGdvZXMgdG8gYW5vdGhlciBwYWdlIHRoZVxuLy8gYnJvd3NlciBzdGlsbCBsZXRzIHVzIHJlYWNoKS4gVGhlIHRhYnMgYXJlIGtlcHQgaW4gc2Vzc2lvbiBzdG9yYWdlOiB0aGUgc2VydmljZSB3b3JrZXIgY2FuIHN0b3AuXG5jb25zdCBPUEVOX1RBQlNfS0VZID0gJ2lua3NwZWN0T3BlblRhYnMnO1xuXG5hc3luYyBmdW5jdGlvbiBvcGVuVGFicygpOiBQcm9taXNlPG51bWJlcltdPiB7XG4gIGNvbnN0IHN0b3JlZCA9IChhd2FpdCBjaHJvbWUuc3RvcmFnZS5zZXNzaW9uLmdldChPUEVOX1RBQlNfS0VZKS5jYXRjaCgoKSA9PiAoe30pKSkgYXMge1xuICAgIFtPUEVOX1RBQlNfS0VZXT86IHVua25vd247XG4gIH07XG4gIGNvbnN0IGxpc3QgPSBzdG9yZWRbT1BFTl9UQUJTX0tFWV07XG4gIHJldHVybiBBcnJheS5pc0FycmF5KGxpc3QpID8gbGlzdC5maWx0ZXIoKGlkKTogaWQgaXMgbnVtYmVyID0+IHR5cGVvZiBpZCA9PT0gJ251bWJlcicpIDogW107XG59XG5cbmFzeW5jIGZ1bmN0aW9uIHNldFRvb2xiYXJPcGVuKHRhYklkOiBudW1iZXIsIG9wZW46IGJvb2xlYW4pOiBQcm9taXNlPHZvaWQ+IHtcbiAgY29uc3QgbGlzdCA9IChhd2FpdCBvcGVuVGFicygpKS5maWx0ZXIoKGlkKSA9PiBpZCAhPT0gdGFiSWQpO1xuICBpZiAob3BlbikgbGlzdC5wdXNoKHRhYklkKTtcbiAgYXdhaXQgY2hyb21lLnN0b3JhZ2Uuc2Vzc2lvbi5zZXQoeyBbT1BFTl9UQUJTX0tFWV06IGxpc3QgfSkuY2F0Y2goKCkgPT4ge30pO1xufVxuXG5jaHJvbWUudGFicy5vblVwZGF0ZWQuYWRkTGlzdGVuZXIoKHRhYklkLCBjaGFuZ2UpID0+IHtcbiAgaWYgKGNoYW5nZS5zdGF0dXMgIT09ICdjb21wbGV0ZScpIHJldHVybjtcbiAgdm9pZCBvcGVuVGFicygpLnRoZW4oYXN5bmMgKGxpc3QpID0+IHtcbiAgICBpZiAoIWxpc3QuaW5jbHVkZXModGFiSWQpKSByZXR1cm47XG4gICAgdHJ5IHtcbiAgICAgIC8vIE9ubHkgaW50byBhIG5ldyBkb2N1bWVudCAoYSBwYWdlIHdob3NlIHRvb2xiYXIgaXMgc3RpbGwgdGhlcmUgaXMgbGVmdCBhbG9uZSkuXG4gICAgICBpZiAoYXdhaXQgaW5qZWN0VG9vbGJhcih0YWJJZCkpIHtcbiAgICAgICAgYXdhaXQgY2hyb21lLnRhYnMuc2VuZE1lc3NhZ2UodGFiSWQsIHsgdHlwZTogJ3RvZ2dsZScgfSBzYXRpc2ZpZXMgVG9Db250ZW50KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgIC8vIFRoZSBicm93c2VyIG5vIGxvbmdlciBsZXRzIHVzIGludG8gdGhlIHRhYiAoYW5vdGhlciBzaXRlKTogaXQgc3RheXMgY2xvc2VkLlxuICAgICAgYXdhaXQgc2V0VG9vbGJhck9wZW4odGFiSWQsIGZhbHNlKTtcbiAgICB9XG4gIH0pO1xufSk7XG5jaHJvbWUudGFicy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoKHRhYklkKSA9PiB2b2lkIHNldFRvb2xiYXJPcGVuKHRhYklkLCBmYWxzZSkpO1xuXG5icmlkZ2Uub25TdGF0dXMoKHN0YXR1cykgPT4ge1xuICB2b2lkIGJyb2FkY2FzdCh7IHR5cGU6ICdicmlkZ2VTdGF0dXMnLCBzdGF0dXMgfSk7XG59KTtcblxuLyoqIFRlbGxzIGV2ZXJ5IHRhYiB3aXRoIHRoZSB0b29sYmFyIGFib3V0IGEgY2hhbmdlICh0YWJzIHdpdGhvdXQgaXQgaWdub3JlIHRoZSBlcnJvcikuICovXG5hc3luYyBmdW5jdGlvbiBicm9hZGNhc3QobWVzc2FnZTogVG9Db250ZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gIGZvciAoY29uc3QgdGFiIG9mIGF3YWl0IGNocm9tZS50YWJzLnF1ZXJ5KHt9KSkge1xuICAgIGlmICh0YWIuaWQpIGNocm9tZS50YWJzLnNlbmRNZXNzYWdlKHRhYi5pZCwgbWVzc2FnZSkuY2F0Y2goKCkgPT4ge30pO1xuICB9XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gUmVxdWVzdHMgZnJvbSB0aGUgdG9vbGJhclxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbmNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobWVzc2FnZTogVG9CYWNrZ3JvdW5kLCBzZW5kZXIsIHNlbmRSZXNwb25zZSkgPT4ge1xuICAvLyBPbmx5IHRoZSB0b29sYmFyIGluIGEgcGFnZTsgdGhlIHNldHRpbmdzIHBhZ2UgaGFzIGl0cyBvd24gbGlzdGVuZXIgYWJvdmUuXG4gIGlmICghc2VuZGVyLnRhYiB8fCBzZW5kZXIudXJsPy5zdGFydHNXaXRoKGNocm9tZS5ydW50aW1lLmdldFVSTCgnJykpKSByZXR1cm4gZmFsc2U7XG4gIGJyaWRnZS5lbnN1cmVDb25uZWN0ZWQoKTtcbiAgaGFuZGxlKG1lc3NhZ2UsIHNlbmRlcilcbiAgICAudGhlbihzZW5kUmVzcG9uc2UpXG4gICAgLmNhdGNoKChlcnJvcjogdW5rbm93bikgPT5cbiAgICAgIHNlbmRSZXNwb25zZSh7IG9rOiBmYWxzZSwgZXJyb3I6IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogU3RyaW5nKGVycm9yKSB9KSxcbiAgICApO1xuICByZXR1cm4gdHJ1ZTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBoYW5kbGUoXG4gIG1lc3NhZ2U6IFRvQmFja2dyb3VuZCxcbiAgc2VuZGVyOiBjaHJvbWUucnVudGltZS5NZXNzYWdlU2VuZGVyLFxuKTogUHJvbWlzZTxCYWNrZ3JvdW5kUmVwbHk+IHtcbiAgY29uc3QgdGFiID0gc2VuZGVyLnRhYjtcbiAgc3dpdGNoIChtZXNzYWdlLnR5cGUpIHtcbiAgICBjYXNlICdvcGVuU2F2ZWQnOiB7XG4gICAgICAvLyBCcm93c2VycyBvcGVuIGl0IG9ubHkgaW4gYW5zd2VyIHRvIGEgY2xpY2s6IGNhbGxlZCBiZWZvcmUgYW55dGhpbmcgaXMgYXdhaXRlZC5cbiAgICAgIGlmICghdGFiPy53aW5kb3dJZCkgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ05vIHRhYicgfTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChfX0JST1dTRVJfXyA9PT0gJ2ZpcmVmb3gnKSB7XG4gICAgICAgICAgY29uc3Qgc2lkZWJhciA9IChcbiAgICAgICAgICAgIGdsb2JhbFRoaXMgYXMgeyBicm93c2VyPzogeyBzaWRlYmFyQWN0aW9uPzogeyBvcGVuKCk6IFByb21pc2U8dm9pZD4gfSB9IH1cbiAgICAgICAgICApLmJyb3dzZXI/LnNpZGViYXJBY3Rpb247XG4gICAgICAgICAgYXdhaXQgc2lkZWJhcj8ub3BlbigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGF3YWl0IGNocm9tZS5zaWRlUGFuZWwub3Blbih7IHdpbmRvd0lkOiB0YWIud2luZG93SWQgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICAgIH0gY2F0Y2gge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG9rOiBmYWxzZSxcbiAgICAgICAgICBlcnJvcjogJ1RoZSBicm93c2VyIGRpZG5cdTIwMTl0IG9wZW4gdGhlIHNpZGUgcGFuZWw6IG9wZW4gU2F2ZWQgZnJvbSB0aGUgSW5rc3BlY3QgYnV0dG9uLicsXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfVxuICAgIGNhc2UgJ2NhcHR1cmUnOiB7XG4gICAgICBpZiAoIXRhYj8ud2luZG93SWQpIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdObyB0YWInIH07XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgZGF0YVVybDogYXdhaXQgY2FwdHVyZSh0YWIud2luZG93SWQpIH07XG4gICAgfVxuICAgIGNhc2UgJ2Rvd25sb2FkJzpcbiAgICAgIGF3YWl0IGNocm9tZS5kb3dubG9hZHMuZG93bmxvYWQoe1xuICAgICAgICB1cmw6IG1lc3NhZ2UuZGF0YVVybCxcbiAgICAgICAgZmlsZW5hbWU6IG1lc3NhZ2UuZmlsZW5hbWUsXG4gICAgICAgIHNhdmVBczogZmFsc2UsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlIH07XG4gICAgY2FzZSAnYm9va21hcmtQYWdlJzoge1xuICAgICAgY29uc3QgZXhpc3RpbmcgPSBhd2FpdCBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7IHVybDogbWVzc2FnZS51cmwgfSk7XG4gICAgICBpZiAoZXhpc3RpbmcubGVuZ3RoKSByZXR1cm4geyBvazogdHJ1ZSwgYm9va21hcmtlZDogdHJ1ZSB9O1xuICAgICAgY29uc3QgeyBiYXIgfSA9IGF3YWl0IHN5bmNSb290cygpO1xuICAgICAgYXdhaXQgY2hyb21lLmJvb2ttYXJrcy5jcmVhdGUoeyBwYXJlbnRJZDogYmFyLCB0aXRsZTogbWVzc2FnZS50aXRsZSwgdXJsOiBtZXNzYWdlLnVybCB9KTtcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlLCBib29rbWFya2VkOiB0cnVlIH07XG4gICAgfVxuICAgIGNhc2UgJ3VuYm9va21hcmtQYWdlJzoge1xuICAgICAgZm9yIChjb25zdCBub2RlIG9mIGF3YWl0IGNocm9tZS5ib29rbWFya3Muc2VhcmNoKHsgdXJsOiBtZXNzYWdlLnVybCB9KSkge1xuICAgICAgICBhd2FpdCBjaHJvbWUuYm9va21hcmtzLnJlbW92ZShub2RlLmlkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7IG9rOiB0cnVlLCBib29rbWFya2VkOiBmYWxzZSB9O1xuICAgIH1cbiAgICBjYXNlICdpc0Jvb2ttYXJrZWQnOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgb2s6IHRydWUsXG4gICAgICAgIGJvb2ttYXJrZWQ6IChhd2FpdCBjaHJvbWUuYm9va21hcmtzLnNlYXJjaCh7IHVybDogbWVzc2FnZS51cmwgfSkpLmxlbmd0aCA+IDAsXG4gICAgICB9O1xuICAgIGNhc2UgJ2VtdWxhdGUnOlxuICAgICAgaWYgKCF0YWI/LmlkKSByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnTm8gdGFiJyB9O1xuICAgICAgYXdhaXQgZW11bGF0ZSh0YWIuaWQsIG1lc3NhZ2UucmVxdWVzdCk7XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSB9O1xuICAgIGNhc2UgJ2FsbG93RnJhbWluZyc6XG4gICAgICBpZiAoIXRhYj8uaWQpIHJldHVybiB7IG9rOiBmYWxzZSwgZXJyb3I6ICdObyB0YWInIH07XG4gICAgICBhd2FpdCBhbGxvd0ZyYW1pbmcodGFiLmlkLCBtZXNzYWdlLnVybCk7XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSB9O1xuICAgIGNhc2UgJ2VuZEZyYW1pbmcnOlxuICAgICAgaWYgKHRhYj8uaWQpIGF3YWl0IGVuZEZyYW1pbmcodGFiLmlkKTtcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlIH07XG4gICAgY2FzZSAnYnJpZGdlU3RhdHVzJzpcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlLCBzdGF0dXM6IGJyaWRnZS5zdGF0dXMgfTtcbiAgICBjYXNlICd0b29sYmFyT3Blbic6XG4gICAgICBpZiAodGFiPy5pZCkgYXdhaXQgc2V0VG9vbGJhck9wZW4odGFiLmlkLCBtZXNzYWdlLm9wZW4pO1xuICAgICAgcmV0dXJuIHsgb2s6IHRydWUgfTtcbiAgICBjYXNlICdvcGVuT3B0aW9ucyc6XG4gICAgICBhd2FpdCBjaHJvbWUucnVudGltZS5vcGVuT3B0aW9uc1BhZ2UoKTtcbiAgICAgIHJldHVybiB7IG9rOiB0cnVlIH07XG4gICAgY2FzZSAncGFpcic6IHtcbiAgICAgIGNvbnN0IHN0YXR1cyA9IGF3YWl0IGJyaWRnZS5wYWlyKG1lc3NhZ2UuY29kZSk7XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgc3RhdHVzIH07XG4gICAgfVxuICAgIGNhc2UgJ3Byb2plY3RzJzoge1xuICAgICAgY29uc3QgcmVwbHkgPSBhd2FpdCBicmlkZ2UuaHViUmVxdWVzdDxFeHRyYWN0PEh1YlRvQnJvd3NlciwgeyB0eXBlOiAncHJvamVjdHMnIH0+PihcbiAgICAgICAgeyB0eXBlOiAncHJvamVjdHMuZ2V0JywgcmVxOiBjcnlwdG8ucmFuZG9tVVVJRCgpLCB1cmw6IG1lc3NhZ2UudXJsPy5zbGljZSgwLCA0MDk2KSB9LFxuICAgICAgICAxMF8wMDAsXG4gICAgICApO1xuICAgICAgaWYgKCFyZXBseSkgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ05vdCBsaW5rZWQgd2l0aCBWUyBDb2RlIG9yIHRoZSBicm93c2VyIGhlbHBlci4nIH07XG4gICAgICByZXR1cm4geyBvazogdHJ1ZSwgcHJvamVjdHM6IHJlcGx5LnByb2plY3RzLCBzdWdnZXN0ZWQ6IHJlcGx5LnN1Z2dlc3RlZCB9O1xuICAgIH1cbiAgICBjYXNlICdzYXZlQ2FwdHVyZSc6XG4gICAgICByZXR1cm4gc2F2ZUNhcHR1cmVzKG1lc3NhZ2UpO1xuICAgIGNhc2UgJ3NlbmRTYXZlZCc6IHtcbiAgICAgIGNvbnN0IHJlcGx5ID0gYXdhaXQgYnJpZGdlLmh1YlJlcXVlc3Q8RXh0cmFjdDxIdWJUb0Jyb3dzZXIsIHsgdHlwZTogJ2l0ZW0uc2VudCcgfT4+KFxuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ2l0ZW0uc2VuZCcsXG4gICAgICAgICAgcmVxOiBjcnlwdG8ucmFuZG9tVVVJRCgpLFxuICAgICAgICAgIHByb2plY3Q6IG1lc3NhZ2UucHJvamVjdCxcbiAgICAgICAgICBpZHM6IG1lc3NhZ2UuaWRzLFxuICAgICAgICAgIHRhcmdldDogbWVzc2FnZS50YXJnZXQsXG4gICAgICAgICAgb3BlbjogbWVzc2FnZS5vcGVuLFxuICAgICAgICAgIC4uLihtZXNzYWdlLnByb21wdCA/IHsgcHJvbXB0OiBtZXNzYWdlLnByb21wdCB9IDoge30pLFxuICAgICAgICB9LFxuICAgICAgICAvLyBBIHNlbmQgY2FuIHdhaXQgZm9yIFZTIENvZGUgKGNob29zaW5nIGEgdGVybWluYWwpOyB0aGUgaGVscGVyIGdpdmVzIHVwIGFmdGVyIDIgbWludXRlcy5cbiAgICAgICAgMTMwXzAwMCxcbiAgICAgICk7XG4gICAgICBpZiAoIXJlcGx5KSByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnVGhlIGJyb3dzZXIgaGVscGVyIGRpZCBub3QgYW5zd2VyLicgfTtcbiAgICAgIHJldHVybiByZXBseS5va1xuICAgICAgICA/IHsgb2s6IHRydWUsIHNlbnRUbzogcmVwbHkuc2VudFRvIH1cbiAgICAgICAgOiB7IG9rOiBmYWxzZSwgZXJyb3I6IHJlcGx5LmVycm9yID8/ICdOb3RoaW5nIHdhcyBzZW50LicgfTtcbiAgICB9XG4gICAgY2FzZSAnc3RhcnRUaHJlYWQnOiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGJyaWRnZS5odWJSZXF1ZXN0PEV4dHJhY3Q8SHViVG9Ccm93c2VyLCB7IHR5cGU6ICdzdGFydGVkJyB9Pj4oXG4gICAgICAgIHtcbiAgICAgICAgICB0eXBlOiAnYWdlbnRtdXguc3RhcnQnLFxuICAgICAgICAgIHJlcTogY3J5cHRvLnJhbmRvbVVVSUQoKSxcbiAgICAgICAgICBwcm9qZWN0OiBtZXNzYWdlLnByb2plY3QsXG4gICAgICAgICAgaGFybmVzczogbWVzc2FnZS5oYXJuZXNzLFxuICAgICAgICB9LFxuICAgICAgICAvLyBhZ2VudG11eCB0YWtlcyB1cCB0byBhIG1pbnV0ZSB0byBzdGFydCBhIHRocmVhZCwgdGhlbiBpdHMgYWdlbnQgaGFzIDIwIHNlY29uZHMuXG4gICAgICAgIDkwXzAwMCxcbiAgICAgICk7XG4gICAgICBpZiAoIXJlcGx5KSByZXR1cm4geyBvazogZmFsc2UsIGVycm9yOiAnVGhlIGJyb3dzZXIgaGVscGVyIGRpZCBub3QgYW5zd2VyLicgfTtcbiAgICAgIHJldHVybiByZXBseS5va1xuICAgICAgICA/IHsgb2s6IHRydWUsIHRhcmdldDogcmVwbHkudGFyZ2V0IH1cbiAgICAgICAgOiB7IG9rOiBmYWxzZSwgZXJyb3I6IHJlcGx5LmVycm9yID8/ICdUaGUgdGhyZWFkIGRpZCBub3Qgc3RhcnQuJyB9O1xuICAgIH1cbiAgICBjYXNlICdtb3ZlU2F2ZWQnOiB7XG4gICAgICBjb25zdCByZXBseSA9IGF3YWl0IGJyaWRnZS5odWJSZXF1ZXN0PEV4dHJhY3Q8SHViVG9Ccm93c2VyLCB7IHR5cGU6ICdkb25lJyB9Pj4oe1xuICAgICAgICB0eXBlOiAnaXRlbXMubW92ZScsXG4gICAgICAgIHJlcTogY3J5cHRvLnJhbmRvbVVVSUQoKSxcbiAgICAgICAgcHJvamVjdDogbWVzc2FnZS5wcm9qZWN0LFxuICAgICAgICBpZHM6IG1lc3NhZ2UuaWRzLFxuICAgICAgICB0bzogbWVzc2FnZS50byxcbiAgICAgIH0pO1xuICAgICAgaWYgKCFyZXBseSkgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ1RoZSBicm93c2VyIGhlbHBlciBkaWQgbm90IGFuc3dlci4nIH07XG4gICAgICByZXR1cm4gcmVwbHkub2sgPyB7IG9rOiB0cnVlIH0gOiB7IG9rOiBmYWxzZSwgZXJyb3I6IHJlcGx5LmVycm9yID8/ICdOb3QgbW92ZWQuJyB9O1xuICAgIH1cbiAgfVxufVxuXG4vKiogTmF0aXZlIG1lc3NhZ2VzIHRvIHRoZSBoZWxwZXIgYXJlIGxpbWl0ZWQgdG8gNjQgTWlCOiBiaWcgc2F2ZXMgZ28gaW4gc2V2ZXJhbC4gKi9cbmNvbnN0IE1BWF9TQVZFID0gNDAgKiAxMDI0ICogMTAyNDtcblxuLyoqXG4gKiBTYXZlcyBjYXB0dXJlcyBpbnRvIGEgcHJvamVjdCB0aHJvdWdoIHRoZSBoZWxwZXIsIGFuZCBzZW5kcyB0aGVtIHdpdGggYHNlbmRgLiBTZXZlcmFsIGxhcmdlXG4gKiBzY3JlZW5zaG90cyBhcmUgc2F2ZWQgb25lIHJlcXVlc3QgYXQgYSB0aW1lLCB0aGVuIHNlbnQgdG9nZXRoZXIuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNhdmVDYXB0dXJlcyhcbiAgbWVzc2FnZTogRXh0cmFjdDxUb0JhY2tncm91bmQsIHsgdHlwZTogJ3NhdmVDYXB0dXJlJyB9Pixcbik6IFByb21pc2U8QmFja2dyb3VuZFJlcGx5PiB7XG4gIGNvbnN0IHNpemUgPSAoYzogQ2FwdHVyZVRvU2F2ZSkgPT4gKGMuaW1hZ2U/Lmxlbmd0aCA/PyAwKSArIChjLnRleHQ/Lmxlbmd0aCA/PyAwKSArIDEwMDA7XG4gIGNvbnN0IGJhdGNoZXM6IENhcHR1cmVUb1NhdmVbXVtdID0gW107XG4gIGZvciAoY29uc3QgY2FwdHVyZSBvZiBtZXNzYWdlLmNhcHR1cmVzKSB7XG4gICAgaWYgKHNpemUoY2FwdHVyZSkgPiBNQVhfU0FWRSkge1xuICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ1RoYXQgc2NyZWVuc2hvdCBpcyB0b28gbGFyZ2UgdG8gc2F2ZS4gRG93bmxvYWQgaXQgaW5zdGVhZC4nIH07XG4gICAgfVxuICAgIGNvbnN0IGxhc3QgPSBiYXRjaGVzLmF0KC0xKTtcbiAgICBpZiAobGFzdCAmJiBsYXN0LnJlZHVjZSgodG90YWwsIGMpID0+IHRvdGFsICsgc2l6ZShjKSwgMCkgKyBzaXplKGNhcHR1cmUpIDw9IE1BWF9TQVZFKSB7XG4gICAgICBsYXN0LnB1c2goY2FwdHVyZSk7XG4gICAgfSBlbHNlIGJhdGNoZXMucHVzaChbY2FwdHVyZV0pO1xuICB9XG4gIGNvbnN0IGlkczogc3RyaW5nW10gPSBbXTtcbiAgbGV0IHNlbnRUbzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBmb3IgKGNvbnN0IFtpbmRleCwgY2FwdHVyZXNdIG9mIGJhdGNoZXMuZW50cmllcygpKSB7XG4gICAgY29uc3QgbGFzdCA9IGluZGV4ID09PSBiYXRjaGVzLmxlbmd0aCAtIDE7XG4gICAgY29uc3QgcmVwbHkgPSBhd2FpdCBicmlkZ2UuaHViUmVxdWVzdDxFeHRyYWN0PEh1YlRvQnJvd3NlciwgeyB0eXBlOiAnY2FwdHVyZS5zYXZlZCcgfT4+KFxuICAgICAge1xuICAgICAgICB0eXBlOiAnY2FwdHVyZS5zYXZlJyxcbiAgICAgICAgcmVxOiBjcnlwdG8ucmFuZG9tVVVJRCgpLFxuICAgICAgICBwcm9qZWN0OiBtZXNzYWdlLnByb2plY3QsXG4gICAgICAgIHVybDogbWVzc2FnZS51cmw/LnNsaWNlKDAsIDQwOTYpLFxuICAgICAgICBicm93c2VyOiBicm93c2VyTmFtZSgpLFxuICAgICAgICBjYXB0dXJlcyxcbiAgICAgICAgLy8gU2VudCBvbmNlLCBhbGwgdG9nZXRoZXIsIHdpdGggdGhlIGxhc3QgcGFydC5cbiAgICAgICAgc2VuZDogYmF0Y2hlcy5sZW5ndGggPT09IDEgPyBtZXNzYWdlLnNlbmQgOiB1bmRlZmluZWQsXG4gICAgICB9LFxuICAgICAgLy8gQSBzZW5kIGNhbiB3YWl0IGZvciBWUyBDb2RlIChjaG9vc2luZyBhIHRlcm1pbmFsKTsgdGhlIGhlbHBlciBnaXZlcyB1cCBhZnRlciAyIG1pbnV0ZXMuXG4gICAgICAxMzBfMDAwLFxuICAgICk7XG4gICAgaWYgKCFyZXBseSkgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogJ1RoZSBicm93c2VyIGhlbHBlciBkaWQgbm90IGFuc3dlci4nIH07XG4gICAgaWYgKCFyZXBseS5vaykgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogcmVwbHkuZXJyb3IgPz8gJ1NhdmluZyBmYWlsZWQuJyB9O1xuICAgIGlkcy5wdXNoKC4uLihyZXBseS5pZHMgPz8gW10pKTtcbiAgICBzZW50VG8gPSByZXBseS5zZW50VG87XG4gICAgaWYgKGxhc3QgJiYgYmF0Y2hlcy5sZW5ndGggPiAxICYmIG1lc3NhZ2Uuc2VuZCkge1xuICAgICAgY29uc3Qgc2VudCA9IGF3YWl0IGJyaWRnZS5odWJSZXF1ZXN0PEV4dHJhY3Q8SHViVG9Ccm93c2VyLCB7IHR5cGU6ICdpdGVtLnNlbnQnIH0+PihcbiAgICAgICAge1xuICAgICAgICAgIHR5cGU6ICdpdGVtLnNlbmQnLFxuICAgICAgICAgIHJlcTogY3J5cHRvLnJhbmRvbVVVSUQoKSxcbiAgICAgICAgICBwcm9qZWN0OiBtZXNzYWdlLnByb2plY3QsXG4gICAgICAgICAgaWRzLFxuICAgICAgICAgIHRhcmdldDogbWVzc2FnZS5zZW5kLFxuICAgICAgICB9LFxuICAgICAgICAxMzBfMDAwLFxuICAgICAgKTtcbiAgICAgIGlmICghc2VudD8ub2spIHtcbiAgICAgICAgcmV0dXJuIHsgb2s6IGZhbHNlLCBlcnJvcjogYFNhdmVkLCBidXQgbm90IHNlbnQ6ICR7c2VudD8uZXJyb3IgPz8gJ25vIGFuc3dlci4nfWAgfTtcbiAgICAgIH1cbiAgICAgIHNlbnRUbyA9IHNlbnQuc2VudFRvO1xuICAgIH1cbiAgfVxuICByZXR1cm4geyBvazogdHJ1ZSwgaWRzLCBzZW50VG8gfTtcbn1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTY3JlZW5zaG90czogQ2hyb21lIGFsbG93cyBhYm91dCB0d28gY2FwdHVyZXMgcGVyIHNlY29uZC5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5sZXQgbGFzdENhcHR1cmUgPSAwO1xubGV0IGNhcHR1cmVRdWV1ZTogUHJvbWlzZTx1bmtub3duPiA9IFByb21pc2UucmVzb2x2ZSgpO1xuXG5mdW5jdGlvbiBjYXB0dXJlKHdpbmRvd0lkOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICBjb25zdCBuZXh0ID0gY2FwdHVyZVF1ZXVlLnRoZW4oYXN5bmMgKCkgPT4ge1xuICAgIGNvbnN0IHdhaXQgPSBsYXN0Q2FwdHVyZSArIDU1MCAtIERhdGUubm93KCk7XG4gICAgaWYgKHdhaXQgPiAwKSBhd2FpdCBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4gc2V0VGltZW91dChyZXNvbHZlLCB3YWl0KSk7XG4gICAgbGFzdENhcHR1cmUgPSBEYXRlLm5vdygpO1xuICAgIHJldHVybiBjaHJvbWUudGFicy5jYXB0dXJlVmlzaWJsZVRhYih3aW5kb3dJZCwgeyBmb3JtYXQ6ICdwbmcnIH0pO1xuICB9KTtcbiAgY2FwdHVyZVF1ZXVlID0gbmV4dC5jYXRjaCgoKSA9PiB7fSk7XG4gIHJldHVybiBuZXh0O1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIERldmljZXNcbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5jb25zdCBkZWJ1Z2dpbmcgPSBuZXcgU2V0PG51bWJlcj4oKTtcblxuYXN5bmMgZnVuY3Rpb24gY29tbWFuZChcbiAgdGFiSWQ6IG51bWJlcixcbiAgbWV0aG9kOiBzdHJpbmcsXG4gIHBhcmFtcz86IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUHJvbWlzZTx2b2lkPiB7XG4gIGF3YWl0IGNocm9tZS5kZWJ1Z2dlci5zZW5kQ29tbWFuZCh7IHRhYklkIH0sIG1ldGhvZCwgcGFyYW1zKTtcbn1cblxuLyoqXG4gKiBUaGUgcmVzcG9uc2l2ZSB2aWV3J3MgZW11bGF0aW9uLiBUaGUgZGV2aWNlJ3MgdXNlciBhZ2VudCBnb2VzIHdpdGggdGhlIGZyYW1lJ3MgcmVxdWVzdHMgKGFcbiAqIHNlc3Npb24gcnVsZSwgc2VlIGZyYW1lVXNlckFnZW50KTogbm8gZGVidWdnZXIsIHNvIG5vIGJhci4gVG91Y2gsIG5ldHdvcmssIENQVSBhbmQgbWVkaWEgbmVlZFxuICogdGhlIGRlYnVnZ2VyIChDaHJvbWUgc2hvd3MgaXRzIFwiZGVidWdnaW5nIHRoaXMgYnJvd3NlclwiIGJhciksIGF0dGFjaGVkIG9ubHkgd2hpbGUgb25lIGlzIG9uLlxuICogTm90IHRoZSBzaXplOiB0aGUgZGVidWdnZXIncyBkZXZpY2UgbWV0cmljcyBhbHdheXMgZHJhdyB0aGUgcGFnZSBhdCB0aGUgdGFiJ3MgdG9wLWxlZnQsIHNvIHRoZVxuICogc2l6ZSBjb21lcyBmcm9tIHRoZSByZXNwb25zaXZlIHZpZXcncyBjZW50ZXJlZCBmcmFtZSBpbnN0ZWFkLlxuICovXG5hc3luYyBmdW5jdGlvbiBlbXVsYXRlKHRhYklkOiBudW1iZXIsIHJlcXVlc3Q6IEVtdWxhdGlvblJlcXVlc3QpOiBQcm9taXNlPHZvaWQ+IHtcbiAgaWYgKF9fQlJPV1NFUl9fICE9PSAnY2hyb21lJykgdGhyb3cgbmV3IEVycm9yKCdFbXVsYXRpb24gbmVlZHMgQ2hyb21lLCBFZGdlIG9yIEJyYXZlLicpO1xuICBjb25zdCBkZXZpY2UgPSByZXF1ZXN0LmFnZW50O1xuICBjb25zdCB1c2VyQWdlbnQgPSBkZXZpY2U/LnVzZXJBZ2VudFxuICAgID8gZGV2aWNlVXNlckFnZW50KFxuICAgICAgICBkZXZpY2UudXNlckFnZW50LFxuICAgICAgICAvQ2hyb21lXFwvKFtcXGQuXSspLy5leGVjKG5hdmlnYXRvci51c2VyQWdlbnQpPy5bMV0gPz8gJzEzMC4wLjAuMCcsXG4gICAgICApXG4gICAgOiB1bmRlZmluZWQ7XG4gIGF3YWl0IGZyYW1lVXNlckFnZW50KHRhYklkLCB1c2VyQWdlbnQsIGRldmljZT8udXNlckFnZW50KTtcbiAgY29uc3QgaWRsZSA9XG4gICAgIWRldmljZT8udG91Y2ggJiZcbiAgICByZXF1ZXN0Lm5ldHdvcmsgPT09ICdub25lJyAmJlxuICAgIHJlcXVlc3QuY3B1ID09PSAxICYmXG4gICAgcmVxdWVzdC5jb2xvclNjaGVtZSA9PT0gJ2RlZmF1bHQnICYmXG4gICAgIXJlcXVlc3QucHJpbnQ7XG4gIGlmIChpZGxlKSB7XG4gICAgaWYgKGRlYnVnZ2luZy5oYXModGFiSWQpKSB7XG4gICAgICBkZWJ1Z2dpbmcuZGVsZXRlKHRhYklkKTtcbiAgICAgIGF3YWl0IGNocm9tZS5kZWJ1Z2dlci5kZXRhY2goeyB0YWJJZCB9KS5jYXRjaCgoKSA9PiB7fSk7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWRlYnVnZ2luZy5oYXModGFiSWQpKSB7XG4gICAgYXdhaXQgY2hyb21lLmRlYnVnZ2VyLmF0dGFjaCh7IHRhYklkIH0sICcxLjMnKTtcbiAgICBkZWJ1Z2dpbmcuYWRkKHRhYklkKTtcbiAgfVxuICBhd2FpdCBjb21tYW5kKHRhYklkLCAnRW11bGF0aW9uLnNldFRvdWNoRW11bGF0aW9uRW5hYmxlZCcsIHtcbiAgICBlbmFibGVkOiAhIWRldmljZT8udG91Y2gsXG4gICAgLi4uKGRldmljZT8udG91Y2ggPyB7IG1heFRvdWNoUG9pbnRzOiA1IH0gOiB7fSksXG4gIH0pO1xuICAvLyBBdHRhY2hlZCBhbnl3YXk6IHRoZSB1c2VyIGFnZW50IGZvciBzY3JpcHRzIGFuZCBldmVyeSByZXF1ZXN0IHRvby4gQW4gZW1wdHkgc3RyaW5nIHJlc3RvcmVzXG4gIC8vIHRoZSBicm93c2VyJ3Mgb3duLlxuICBhd2FpdCBjb21tYW5kKHRhYklkLCAnRW11bGF0aW9uLnNldFVzZXJBZ2VudE92ZXJyaWRlJywgeyB1c2VyQWdlbnQ6IHVzZXJBZ2VudCA/PyAnJyB9KTtcbiAgY29uc3QgbmV0d29yayA9IE5FVFdPUktfQ09ORElUSU9OU1tyZXF1ZXN0Lm5ldHdvcmtdO1xuICBhd2FpdCBjb21tYW5kKHRhYklkLCAnTmV0d29yay5lbXVsYXRlTmV0d29ya0NvbmRpdGlvbnMnLCB7XG4gICAgb2ZmbGluZTogcmVxdWVzdC5uZXR3b3JrID09PSAnb2ZmbGluZScsXG4gICAgbGF0ZW5jeTogbmV0d29yaz8ubGF0ZW5jeSA/PyAwLFxuICAgIGRvd25sb2FkVGhyb3VnaHB1dDogbmV0d29yaz8uZG93bmxvYWQgPz8gLTEsXG4gICAgdXBsb2FkVGhyb3VnaHB1dDogbmV0d29yaz8udXBsb2FkID8/IC0xLFxuICB9KTtcbiAgYXdhaXQgY29tbWFuZCh0YWJJZCwgJ0VtdWxhdGlvbi5zZXRDUFVUaHJvdHRsaW5nUmF0ZScsIHsgcmF0ZTogcmVxdWVzdC5jcHUgfSk7XG4gIGF3YWl0IGNvbW1hbmQodGFiSWQsICdFbXVsYXRpb24uc2V0RW11bGF0ZWRNZWRpYScsIHtcbiAgICBtZWRpYTogcmVxdWVzdC5wcmludCA/ICdwcmludCcgOiAnJyxcbiAgICBmZWF0dXJlczpcbiAgICAgIHJlcXVlc3QuY29sb3JTY2hlbWUgPT09ICdkZWZhdWx0J1xuICAgICAgICA/IFtdXG4gICAgICAgIDogW3sgbmFtZTogJ3ByZWZlcnMtY29sb3Itc2NoZW1lJywgdmFsdWU6IHJlcXVlc3QuY29sb3JTY2hlbWUgfV0sXG4gIH0pO1xufVxuXG5pZiAoX19CUk9XU0VSX18gPT09ICdjaHJvbWUnKSB7XG4gIGNocm9tZS5kZWJ1Z2dlci5vbkRldGFjaC5hZGRMaXN0ZW5lcigoeyB0YWJJZCB9KSA9PiB7XG4gICAgLy8gVGhlIHVzZXIgY2xvc2VkIENocm9tZSdzIGRlYnVnZ2luZyBiYXI6IGVtdWxhdGlvbiBpcyBvdmVyLlxuICAgIGlmICh0YWJJZCAhPT0gdW5kZWZpbmVkKSBkZWJ1Z2dpbmcuZGVsZXRlKHRhYklkKTtcbiAgfSk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gVGhlIHJlc3BvbnNpdmUgdmlldydzIGZyYW1lXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqIE9uZSBzZXNzaW9uIHJ1bGUgcGVyIHRhYjsgaWRzIHN0YXkgY2xlYXIgb2YgYW55IG90aGVyIHJ1bGVzLiAqL1xuY29uc3QgZnJhbWluZ1J1bGVJZCA9ICh0YWJJZDogbnVtYmVyKSA9PiAxXzAwMF8wMDAgKyAodGFiSWQgJSAxXzAwMF8wMDApO1xuY29uc3QgdXNlckFnZW50UnVsZUlkID0gKHRhYklkOiBudW1iZXIpID0+IDJfMDAwXzAwMCArICh0YWJJZCAlIDFfMDAwXzAwMCk7XG4vKiogVGhlIG9yaWdpbiBlYWNoIHRhYidzIHJlc3BvbnNpdmUgdmlldyBmcmFtZXMuICovXG5jb25zdCBmcmFtZWRPcmlnaW5zID0gbmV3IE1hcDxudW1iZXIsIHN0cmluZz4oKTtcbi8qKiBUaGUgdXNlciBhZ2VudCBlYWNoIHRhYidzIHZpZXcgYXNrZWQgZm9yIChpdCBjYW4gYXNrIGJlZm9yZSBpdHMgZnJhbWUncyBvcmlnaW4gaXMga25vd24pLiAqL1xuY29uc3QgZnJhbWVBZ2VudHMgPSBuZXcgTWFwPG51bWJlciwgeyB1c2VyQWdlbnQ6IHN0cmluZzsga2luZD86IHN0cmluZyB9PigpO1xuXG4vKipcbiAqIFRoZSBkZXZpY2UncyB1c2VyIGFnZW50IG9uIHRoZSByZXNwb25zaXZlIHZpZXcncyBwYWdlIHJlcXVlc3QgKGFuZCBpdHMgY2xpZW50IGhpbnRzKSwgaW4gdGhpc1xuICogdGFiIG9ubHksIHdpdGhvdXQgdGhlIGRlYnVnZ2VyLiBTY3JpcHRzIGluIHRoZSBmcmFtZSBzdGlsbCByZWFkIHRoZSBicm93c2VyJ3Mgb3duXG4gKiBgbmF2aWdhdG9yLnVzZXJBZ2VudGAgdW5sZXNzIHRoZSBkZWJ1Z2dlciBpcyBhdHRhY2hlZCBmb3IgYW5vdGhlciBzZXR0aW5nLlxuICovXG5hc3luYyBmdW5jdGlvbiBmcmFtZVVzZXJBZ2VudChcbiAgdGFiSWQ6IG51bWJlcixcbiAgdXNlckFnZW50OiBzdHJpbmcgfCB1bmRlZmluZWQsXG4gIGtpbmQ6IHN0cmluZyB8IHVuZGVmaW5lZCxcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCBpZCA9IHVzZXJBZ2VudFJ1bGVJZCh0YWJJZCk7XG4gIGlmICh1c2VyQWdlbnQpIGZyYW1lQWdlbnRzLnNldCh0YWJJZCwgeyB1c2VyQWdlbnQsIGtpbmQgfSk7XG4gIGVsc2UgZnJhbWVBZ2VudHMuZGVsZXRlKHRhYklkKTtcbiAgY29uc3Qgb3JpZ2luID0gZnJhbWVkT3JpZ2lucy5nZXQodGFiSWQpO1xuICBpZiAoIXVzZXJBZ2VudCB8fCAhb3JpZ2luKSB7XG4gICAgYXdhaXQgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVTZXNzaW9uUnVsZXMoeyByZW1vdmVSdWxlSWRzOiBbaWRdIH0pO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBtb2JpbGUgPSBraW5kID09PSAnaXBob25lJyB8fCBraW5kID09PSAnYW5kcm9pZCc7XG4gIGNvbnN0IHBsYXRmb3JtID0ga2luZCA9PT0gJ2FuZHJvaWQnID8gJ0FuZHJvaWQnIDogJ2lPUyc7XG4gIGNvbnN0IHNldCA9ICdzZXQnIGFzIGNocm9tZS5kZWNsYXJhdGl2ZU5ldFJlcXVlc3QuSGVhZGVyT3BlcmF0aW9uO1xuICBjb25zdCByZXF1ZXN0SGVhZGVycyA9IFtcbiAgICB7IGhlYWRlcjogJ3VzZXItYWdlbnQnLCBvcGVyYXRpb246IHNldCwgdmFsdWU6IHVzZXJBZ2VudCB9LFxuICAgIHsgaGVhZGVyOiAnc2VjLWNoLXVhLW1vYmlsZScsIG9wZXJhdGlvbjogc2V0LCB2YWx1ZTogbW9iaWxlID8gJz8xJyA6ICc/MCcgfSxcbiAgICB7IGhlYWRlcjogJ3NlYy1jaC11YS1wbGF0Zm9ybScsIG9wZXJhdGlvbjogc2V0LCB2YWx1ZTogYFwiJHtwbGF0Zm9ybX1cImAgfSxcbiAgXTtcbiAgYXdhaXQgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVTZXNzaW9uUnVsZXMoe1xuICAgIHJlbW92ZVJ1bGVJZHM6IFtpZF0sXG4gICAgYWRkUnVsZXM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQsXG4gICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICB0eXBlOiAnbW9kaWZ5SGVhZGVycycgYXMgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5SdWxlQWN0aW9uVHlwZSxcbiAgICAgICAgICByZXF1ZXN0SGVhZGVycyxcbiAgICAgICAgfSxcbiAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgdGFiSWRzOiBbdGFiSWRdLFxuICAgICAgICAgIHVybEZpbHRlcjogYHwke29yaWdpbn0vYCxcbiAgICAgICAgICByZXNvdXJjZVR5cGVzOiBbJ3N1Yl9mcmFtZScgYXMgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5SZXNvdXJjZVR5cGVdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn1cblxuLyoqXG4gKiBUaGUgcmVzcG9uc2l2ZSB2aWV3IHNob3dzIHRoZSBwYWdlIGluIGEgZnJhbWUgb2YgaXRzIG93biB0YWIuIE1hbnkgc2l0ZXMgZm9yYmlkIGJlaW5nIGZyYW1lZFxuICogKFgtRnJhbWUtT3B0aW9ucywgQ1NQIGZyYW1lLWFuY2VzdG9ycyksIHNvIHdoaWxlIHRoZSB2aWV3IGlzIG9wZW4gdGhlaXIgaGVhZGVycyBhcmUgZHJvcHBlZCBmb3JcbiAqIGZyYW1lcyBvZiB0aGUgcGFnZSdzIG93biBvcmlnaW4sIGluIHRoaXMgdGFiIG9ubHkuIGFjdGl2ZVRhYiBnaXZlcyB0aGUgaG9zdCBhY2Nlc3MgdGhpcyBuZWVkcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gYWxsb3dGcmFtaW5nKHRhYklkOiBudW1iZXIsIHVybDogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IG9yaWdpbiA9IG5ldyBVUkwodXJsKS5vcmlnaW47XG4gIGlmICghL15odHRwcz86JC8udGVzdChuZXcgVVJMKHVybCkucHJvdG9jb2wpKSByZXR1cm47XG4gIGZyYW1lZE9yaWdpbnMuc2V0KHRhYklkLCBvcmlnaW4pO1xuICAvLyBCZWZvcmUgdGhlIGZyYW1lIGxvYWRzOiBpdHMgcGFnZSByZXF1ZXN0IGNhcnJpZXMgdGhlIGRldmljZSdzIHVzZXIgYWdlbnQuXG4gIGNvbnN0IGFnZW50ID0gZnJhbWVBZ2VudHMuZ2V0KHRhYklkKTtcbiAgaWYgKGFnZW50KSBhd2FpdCBmcmFtZVVzZXJBZ2VudCh0YWJJZCwgYWdlbnQudXNlckFnZW50LCBhZ2VudC5raW5kKTtcbiAgY29uc3QgaWQgPSBmcmFtaW5nUnVsZUlkKHRhYklkKTtcbiAgYXdhaXQgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVTZXNzaW9uUnVsZXMoe1xuICAgIHJlbW92ZVJ1bGVJZHM6IFtpZF0sXG4gICAgYWRkUnVsZXM6IFtcbiAgICAgIHtcbiAgICAgICAgaWQsXG4gICAgICAgIHByaW9yaXR5OiAxLFxuICAgICAgICBhY3Rpb246IHtcbiAgICAgICAgICB0eXBlOiAnbW9kaWZ5SGVhZGVycycgYXMgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5SdWxlQWN0aW9uVHlwZSxcbiAgICAgICAgICByZXNwb25zZUhlYWRlcnM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaGVhZGVyOiAneC1mcmFtZS1vcHRpb25zJyxcbiAgICAgICAgICAgICAgb3BlcmF0aW9uOiAncmVtb3ZlJyBhcyBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LkhlYWRlck9wZXJhdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGhlYWRlcjogJ2NvbnRlbnQtc2VjdXJpdHktcG9saWN5JyxcbiAgICAgICAgICAgICAgb3BlcmF0aW9uOiAncmVtb3ZlJyBhcyBjaHJvbWUuZGVjbGFyYXRpdmVOZXRSZXF1ZXN0LkhlYWRlck9wZXJhdGlvbixcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgfSxcbiAgICAgICAgY29uZGl0aW9uOiB7XG4gICAgICAgICAgdGFiSWRzOiBbdGFiSWRdLFxuICAgICAgICAgIHVybEZpbHRlcjogYHwke29yaWdpbn0vYCxcbiAgICAgICAgICByZXNvdXJjZVR5cGVzOiBbJ3N1Yl9mcmFtZScgYXMgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC5SZXNvdXJjZVR5cGVdLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICBdLFxuICB9KTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gZW5kRnJhbWluZyh0YWJJZDogbnVtYmVyKTogUHJvbWlzZTx2b2lkPiB7XG4gIGZyYW1lZE9yaWdpbnMuZGVsZXRlKHRhYklkKTtcbiAgZnJhbWVBZ2VudHMuZGVsZXRlKHRhYklkKTtcbiAgYXdhaXQgY2hyb21lLmRlY2xhcmF0aXZlTmV0UmVxdWVzdC51cGRhdGVTZXNzaW9uUnVsZXMoe1xuICAgIHJlbW92ZVJ1bGVJZHM6IFtmcmFtaW5nUnVsZUlkKHRhYklkKSwgdXNlckFnZW50UnVsZUlkKHRhYklkKV0sXG4gIH0pO1xufVxuXG5jaHJvbWUudGFicy5vblJlbW92ZWQuYWRkTGlzdGVuZXIoKHRhYklkKSA9PiB2b2lkIGVuZEZyYW1pbmcodGFiSWQpLmNhdGNoKCgpID0+IHt9KSk7XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gU2VuZGluZyB0byBWUyBDb2RlXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiJdLAogICJtYXBwaW5ncyI6ICI7OztBQWdCQSxNQUFNLFFBQVEsQ0FDWkEsS0FDQSxNQUNBLE9BQ0EsUUFDQSxLQUNBLFFBQ2tCO0FBQUEsSUFDbEIsSUFBQUE7QUFBQSxJQUNBO0FBQUEsSUFDQSxPQUFPO0FBQUEsSUFDUDtBQUFBLElBQ0E7QUFBQSxJQUNBO0FBQUEsSUFDQSxRQUFRO0FBQUEsSUFDUixPQUFPO0FBQUEsSUFDUCxXQUFXO0FBQUEsRUFDYjtBQUNBLE1BQU0sU0FBUyxDQUNiQSxLQUNBLE1BQ0EsT0FDQSxRQUNBLEtBQ0EsUUFDa0I7QUFBQSxJQUNsQixJQUFBQTtBQUFBLElB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c0JBQXNCLG1CQUFtQjtBQUFBLE1BQ3BELGVBQWUsQ0FBQ0EsR0FBRTtBQUFBLE1BQ2xCLFVBQVU7QUFBQSxRQUNSO0FBQUEsVUFDRSxJQUFBQTtBQUFBLFVBQ0EsVUFBVTtBQUFBLFVBQ1YsUUFBUTtBQUFBLFlBQ04sTUFBTTtBQUFBLFlBQ04saUJBQWlCO0FBQUEsY0FDZjtBQUFBLGdCQUNFLFFBQVE7QUFBQSxnQkFDUixXQUFXO0FBQUEsY0FDYjtBQUFBLGNBQ0E7QUFBQSxnQkFDRSxRQUFRO0FBQUEsZ0JBQ1IsV0FBVztBQUFBLGNBQ2I7QUFBQSxZQUNGO0FBQUEsVUFDRjtBQUFBLFVBQ0EsV0FBVztBQUFBLFlBQ1QsUUFBUSxDQUFDLEtBQUs7QUFBQSxZQUNkLFdBQVcsSUFBSSxNQUFNO0FBQUEsWUFDckIsZUFBZSxDQUFDLFdBQXdEO0FBQUEsVUFDMUU7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0YsQ0FBQztBQUFBLEVBQ0g7QUFFQSxpQkFBZSxXQUFXLE9BQThCO0FBQ3RELGtCQUFjLE9BQU8sS0FBSztBQUMxQixnQkFBWSxPQUFPLEtBQUs7QUFDeEIsVUFBTSxPQUFPLHNCQUFzQixtQkFBbUI7QUFBQSxNQUNwRCxlQUFlLENBQUMsY0FBYyxLQUFLLEdBQUcsZ0JBQWdCLEtBQUssQ0FBQztBQUFBLElBQzlELENBQUM7QUFBQSxFQUNIO0FBRUEsU0FBTyxLQUFLLFVBQVUsWUFBWSxDQUFDLFVBQVUsS0FBSyxXQUFXLEtBQUssRUFBRSxNQUFNLE1BQU07QUFBQSxFQUFDLENBQUMsQ0FBQzsiLAogICJuYW1lcyI6IFsiaWQiLCAia2luZCIsICJpZCIsICJzdG9yZWQiLCAiYnJpZGdlIiwgImNvbW1hbmQiLCAic3RvcmVkIiwgImlkIiwgImNhcHR1cmUiLCAia2luZCJdCn0K
