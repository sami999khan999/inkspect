// The local Inkspect hub: one process per user that browsers reach through native messaging and
// VS Code windows through a private Unix socket. Every frame is a uint32 little-endian length and
// UTF-8 JSON with the protocol version `v`; every end validates what it receives with the parsers
// below and drops anything else.
//
// The browser link (./bridge) travels inside `link` frames: the browser extension speaks the same
// protocol to VS Code as over the WebSocket, and the hub forwards it to the leader window.
import { HARNESSES, type Harness } from './targets';
import type { Check } from './validate';
import {
  isBoolean,
  isNumber,
  matches,
  oneOf,
  optional,
  parseMessage,
  shape,
  shortString,
  arrayOf,
} from './validate';

export const HUB_VERSION = 1;

/**
 * What a hub answers beyond the first version, in its `status` (a newer browser build may meet
 * an older hub until VS Code replaces it): moving and restoring items, sends that show the
 * agentmux thread, new agentmux threads.
 */
export const HUB_FEATURES = ['items.move', 'item.restore', 'send.open', 'agentmux.new'] as const;
/** The native messaging host's name, as browsers know it. */
export const HUB_HOST_NAME = 'dev.inkspect.hub';
/**
 * The Chrome extension's id, fixed by the public `key` in browser-extension/manifest/chrome.json
 * (a test checks they match), so the native host can allow exactly this extension.
 */
export const CHROME_EXTENSION_ID = 'pphiddagfepelbjcmkanoboceacocpak';
/** Firefox's id for the extension (browser_specific_settings.gecko.id). */
export const FIREFOX_EXTENSION_ID = 'inkspect@inkspect.dev';
/** Browsers drop native messages to the extension above 1 MiB. */
export const MAX_TO_BROWSER = 1024 * 1024;
/** The largest frame any end accepts. */
export const MAX_FRAME = 64 * 1024 * 1024;

/** A connection's role, said in its first frame. */
export type HubRole = 'browser' | 'vscode';

/** A browser connected to the hub, as VS Code windows see it. */
export interface HubBrowser {
  /** The hub's id for the connection. */
  id: string;
  /** "Google Chrome", "Firefox"... (from the browser's hello). */
  name: string;
  /** The extension's origin the browser launched the host for. */
  origin: string;
}

/** What a VS Code window tells the hub about itself. */
export interface HubWindow {
  id: string;
  /** Its workspace's name. */
  name: string;
  /** Its local workspace folders (absolute, real paths). */
  folders: string[];
  /** When it last had focus (ms since the epoch). */
  focusedAt: number;
  /** Agents in its terminals, and its chat (ids local to the window). */
  targets?: HubTarget[];
}

/** What an item in a project's `.inkspect/` is (the Saved list's kinds). */
export type ItemKind =
  | 'element'
  | 'screenshot'
  | 'recording'
  | 'errors'
  | 'network'
  | 'page'
  | 'report'
  | 'css'
  | 'measure'
  | 'color'
  | 'text';

export const ITEM_KINDS: readonly ItemKind[] = [
  'element',
  'screenshot',
  'recording',
  'errors',
  'network',
  'page',
  'report',
  'css',
  'measure',
  'color',
  'text',
];

/** Item ids: when it was captured (UTC) and a random part. They sort by time. */
export const ITEM_ID = /^\d{8}-\d{6}-[0-9a-f]{6}$/;

/** A file name inside an item's folder (never a path). */
export const ITEM_FILE = /^[\w-]{1,40}\.[a-z0-9]{1,5}$/;

/**
 * One capture saved in a project, as `.inkspect/items/<id>/item.json`. Its files live in the
 * same folder; `files` names them (names only, so an item can't point outside its folder).
 */
export interface ItemMeta {
  v: 1;
  id: string;
  kind: ItemKind;
  title: string;
  detail?: string;
  /** The page it came from. */
  url?: string;
  /** When it was captured (ms since the epoch). */
  time: number;
  /** Captures made together share a group, in `groupIndex` order. */
  group?: string;
  groupIndex?: number;
  /** Captures with the same key replace each other (the console errors of one page). */
  key?: string;
  /** Where it was captured. */
  source: 'browser' | 'vscode';
  /** The browser's name, for browser captures. */
  browser?: string;
  /** The start of the text, for lists. */
  preview?: string;
  files: {
    /** The image or recording. */
    file?: string;
    /** The text sent to the agent (Markdown). */
    text?: string;
    /** A small JPEG for lists. */
    thumb?: string;
  };
  /** Agents it was sent to. */
  sentTo: string[];
}

/**
 * A place a send goes: an agent in an agentmux (tmux) pane, an agent in a VS Code terminal, or
 * VS Code chat. Ids: `tmux:<socket>:<pane>`, `vscode:<window>:<terminal id or chat>`.
 */
export interface HubTarget {
  id: string;
  kind: 'tmux' | 'terminal' | 'chat';
  /** The agent: "Claude Code", "Codex"... (or "VS Code chat"). */
  label: string;
  /** Where it runs: "agentmux · inkspect·1", "VS Code terminal · zsh"... */
  detail: string;
}

/** A folder Inkspect knows as a project, and why. */
export interface Project {
  /** Absolute real path. */
  path: string;
  name: string;
  /** Open in a VS Code window. */
  vscode: boolean;
  /** Has agentmux threads (tmux sessions with this @project). */
  agentmux: boolean;
  /** Has a `.inkspect/` folder. */
  saved: boolean;
  pinned: boolean;
  /** Where its sends can go (empty when nothing runs there). */
  targets?: HubTarget[];
  /** Where Send goes: the target used last, else the agent beside its VS Code window... */
  defaultTarget?: string;
  /** Agents a new agentmux thread can run here (only for projects open in agentmux). */
  harnesses?: Harness[];
  /** The Inbox: where captures go when no project fits (they can be moved later). */
  inbox?: boolean;
}

/** Something in the project can receive a send (a VS Code window or an agent is there). */
export function isLive(project: Project): boolean {
  return project.vscode || project.agentmux;
}

/** One capture the browser saves into a project. */
export interface CaptureToSave {
  kind: ItemKind;
  title: string;
  detail?: string;
  text?: string;
  group?: string;
  groupIndex?: number;
  /** PNG as base64 (no data: prefix). */
  image?: string;
  /** A small JPEG as base64, for lists. */
  thumb?: string;
}

/** The first frame on every connection: the hub's token (the shim reads it, never the browser). */
export interface HubAuth {
  type: 'auth';
  token: string;
  role: HubRole;
  /** Browsers: the extension origin the browser passed to the host. */
  origin?: string;
}

export type BrowserToHub =
  /** A bridge ClientMessage for VS Code, encoded with the bridge's `encode`. */
  | { type: 'link'; data: string }
  | { type: 'ping' }
  /** The projects, and the one a capture of `url` most likely belongs to. */
  | { type: 'projects.get'; req: string; url?: string }
  /** Saves captures into a project's `.inkspect/`; with `send`, sends them too. */
  | {
      type: 'capture.save';
      req: string;
      project: string;
      url?: string;
      browser?: string;
      captures: CaptureToSave[];
      /** A target id, or 'default' for the project's default target. */
      send?: string;
    }
  /**
   * Sends saved items of a project to a target ('default' or unset: its default target);
   * `open` also shows the agentmux thread and brings it to the front.
   */
  | {
      type: 'item.send';
      req: string;
      project: string;
      ids: string[];
      target?: string;
      open?: boolean;
    }
  /** Moves saved items to another project (the capture was saved in the wrong one). */
  | { type: 'items.move'; req: string; project: string; ids: string[]; to: string }
  /** A project's saved items, newest first (the side panel). */
  | { type: 'items.get'; req: string; project: string }
  /** An item's thumbnail (its small JPEG, else a small enough image). */
  | { type: 'item.thumb'; req: string; project: string; id: string }
  /** Moves items to the project's trash. */
  | { type: 'item.remove'; req: string; project: string; ids: string[] }
  /** Puts back items removed a moment ago (they wait in the store's trash). */
  | { type: 'item.restore'; req: string; project: string; ids: string[] }
  /** Keeps a project in the list even when nothing is open there. */
  | { type: 'project.pin'; req: string; project: string; pinned: boolean };

export type HubToBrowser =
  /** A bridge ServerMessage from VS Code. */
  | { type: 'link'; data: string }
  /** Whether a VS Code window answers for the link; `peer` names it. */
  /** `features`: what this hub answers beyond the first version (see HUB_FEATURES). */
  | { type: 'status'; vscode: boolean; peer?: string; features?: string[] }
  /** The window answering for the link changed: say hello again. */
  | { type: 'relink' }
  | { type: 'pong' }
  | { type: 'projects'; req: string; projects: Project[]; suggested?: string }
  | {
      type: 'capture.saved';
      req: string;
      ok: boolean;
      ids?: string[];
      error?: string;
      /** The agent it was sent to, when the save also sent it. */
      sentTo?: string;
    }
  | { type: 'item.sent'; req: string; ok: boolean; sentTo?: string; error?: string }
  | { type: 'items'; req: string; ok: boolean; items: ItemMeta[]; error?: string }
  /** `data`: base64, or missing when the item has no picture small enough. */
  | { type: 'thumb'; req: string; data?: string; mimeType?: string }
  /** The answer to `item.remove`, `item.restore`, `items.move` and `project.pin`. */
  | { type: 'done'; req: string; ok: boolean; error?: string };

export type VsCodeToHub =
  | ({ type: 'window' } & HubWindow)
  /** A bridge ServerMessage for one browser. */
  | { type: 'link'; browser: string; data: string }
  /** A newer hub is installed: the running one should exit so it can start. */
  | { type: 'shutdown' }
  | { type: 'ping' }
  /** The answer to a `run.send`. */
  | { type: 'run.sent'; req: string; ok: boolean; sentTo?: string; error?: string };

export type HubToVsCode =
  /** `build` identifies the running hub's code; `leader`: this window answers for the link. */
  | { type: 'welcome'; build: string; leader: boolean }
  | { type: 'leader'; leader: boolean }
  /** Browsers connected through the hub. */
  | { type: 'browsers'; browsers: HubBrowser[] }
  /** A bridge ClientMessage from a browser (sent to the leader only). */
  | { type: 'link'; browser: string; data: string }
  /** A browser went away. */
  | { type: 'gone'; browser: string }
  | { type: 'pong' }
  /** Send these items of a project to one of this window's targets (a terminal agent, chat). */
  | { type: 'run.send'; req: string; project: string; ids: string[]; target: string };

/** Every hub message, for `encodeHub`. */
export type HubMessage = HubAuth | BrowserToHub | HubToBrowser | VsCodeToHub | HubToVsCode;

/** A frame's JSON text (the length prefix is added by the transport). */
export function encodeHub(message: HubMessage): string {
  return JSON.stringify({ v: HUB_VERSION, ...message });
}

const id = matches(/^[\w.-]{1,64}$/);
const data = shortString(MAX_FRAME);
const folder = shortString(4096);

const AUTH: Record<'auth', Record<string, Check>> = {
  auth: {
    token: shortString(128),
    role: oneOf('browser', 'vscode'),
    origin: optional(shortString(256)),
  },
};

const req = matches(/^[\w-]{1,64}$/);
const projectPath = shortString(4096);
const kind = oneOf(...ITEM_KINDS);
const base64 = matches(/^[A-Za-z0-9+/]*={0,2}$/);

const captureToSave = shape({
  kind,
  title: shortString(300),
  detail: optional(shortString(1000)),
  text: optional(shortString(5_000_000)),
  group: optional(id),
  groupIndex: optional(isNumber),
  image: optional(base64),
  thumb: optional((v) => typeof v === 'string' && v.length <= 400_000 && base64(v)),
});

const hubTarget = shape({
  id: shortString(200),
  kind: oneOf('tmux', 'terminal', 'chat'),
  label: shortString(100),
  detail: shortString(300),
});
const itemIds = arrayOf(matches(ITEM_ID), 60);

const BROWSER_TO_HUB: Record<BrowserToHub['type'], Record<string, Check>> = {
  link: { data },
  ping: {},
  'projects.get': { req, url: optional(shortString(4096)) },
  'capture.save': {
    req,
    project: projectPath,
    url: optional(shortString(4096)),
    browser: optional(shortString(100)),
    captures: arrayOf(captureToSave, 60),
    send: optional(shortString(200)),
  },
  'item.send': {
    req,
    project: projectPath,
    ids: itemIds,
    target: optional(shortString(200)),
    open: optional(isBoolean),
  },
  'items.move': { req, project: projectPath, ids: itemIds, to: projectPath },
  'items.get': { req, project: projectPath },
  'item.thumb': { req, project: projectPath, id: matches(ITEM_ID) },
  'item.remove': { req, project: projectPath, ids: itemIds },
  'item.restore': { req, project: projectPath, ids: itemIds },
  'project.pin': { req, project: projectPath, pinned: isBoolean },
};

const project = shape({
  path: projectPath,
  name: shortString(300),
  vscode: isBoolean,
  agentmux: isBoolean,
  saved: isBoolean,
  pinned: isBoolean,
  targets: optional(arrayOf(hubTarget, 50)),
  defaultTarget: optional(shortString(200)),
  harnesses: optional(arrayOf(oneOf(...HARNESSES), 10)),
  inbox: optional(isBoolean),
});

/** Validates an `item.json` read from disk (anything else in `.inkspect/` is ignored). */
export const isItemMeta: Check = shape({
  v: (v) => v === 1,
  id: matches(ITEM_ID),
  kind,
  title: shortString(300),
  detail: optional(shortString(1000)),
  url: optional(shortString(4096)),
  time: isNumber,
  group: optional(id),
  groupIndex: optional(isNumber),
  key: optional(shortString(200)),
  source: oneOf('browser', 'vscode'),
  browser: optional(shortString(100)),
  preview: optional(shortString(1000)),
  files: shape({
    file: optional(matches(ITEM_FILE)),
    text: optional(matches(ITEM_FILE)),
    thumb: optional(matches(ITEM_FILE)),
  }),
  sentTo: arrayOf(shortString(200), 50),
});

const HUB_TO_BROWSER: Record<HubToBrowser['type'], Record<string, Check>> = {
  link: { data },
  status: {
    vscode: isBoolean,
    peer: optional(shortString(200)),
    features: optional(arrayOf(shortString(40), 50)),
  },
  relink: {},
  pong: {},
  projects: { req, projects: arrayOf(project, 500), suggested: optional(projectPath) },
  'capture.saved': {
    req,
    ok: isBoolean,
    ids: optional(itemIds),
    error: optional(shortString(1000)),
    sentTo: optional(shortString(200)),
  },
  'item.sent': {
    req,
    ok: isBoolean,
    sentTo: optional(shortString(200)),
    error: optional(shortString(1000)),
  },
  items: {
    req,
    ok: isBoolean,
    items: arrayOf(isItemMeta, 500),
    error: optional(shortString(1000)),
  },
  thumb: { req, data: optional(base64), mimeType: optional(oneOf('image/jpeg', 'image/png')) },
  done: { req, ok: isBoolean, error: optional(shortString(1000)) },
};

const VSCODE_TO_HUB: Record<VsCodeToHub['type'], Record<string, Check>> = {
  window: {
    id,
    name: shortString(200),
    folders: arrayOf(folder, 50),
    focusedAt: isNumber,
    targets: optional(arrayOf(hubTarget, 50)),
  },
  link: { browser: id, data },
  shutdown: {},
  ping: {},
  'run.sent': {
    req,
    ok: isBoolean,
    sentTo: optional(shortString(200)),
    error: optional(shortString(1000)),
  },
};

const hubBrowser = shape({ id, name: shortString(100), origin: shortString(256) });

const HUB_TO_VSCODE: Record<HubToVsCode['type'], Record<string, Check>> = {
  welcome: { build: shortString(100), leader: isBoolean },
  leader: { leader: isBoolean },
  browsers: { browsers: arrayOf(hubBrowser, 50) },
  link: { browser: id, data },
  gone: { browser: id },
  pong: {},
  'run.send': { req, project: projectPath, ids: itemIds, target: shortString(200) },
};

/** A connection's first frame, or undefined. */
export function parseHubAuth(raw: unknown): HubAuth | undefined {
  return parseMessage<HubAuth>(raw, AUTH, HUB_VERSION);
}

export function parseBrowserToHub(raw: unknown): BrowserToHub | undefined {
  return parseMessage<BrowserToHub>(raw, BROWSER_TO_HUB, HUB_VERSION);
}

export function parseHubToBrowser(raw: unknown): HubToBrowser | undefined {
  return parseMessage<HubToBrowser>(raw, HUB_TO_BROWSER, HUB_VERSION);
}

export function parseVsCodeToHub(raw: unknown): VsCodeToHub | undefined {
  return parseMessage<VsCodeToHub>(raw, VSCODE_TO_HUB, HUB_VERSION);
}

export function parseHubToVsCode(raw: unknown): HubToVsCode | undefined {
  return parseMessage<HubToVsCode>(raw, HUB_TO_VSCODE, HUB_VERSION);
}

/**
 * The Chrome extension id that a manifest `key` (base64 DER public key) gives: the first 32 hex
 * digits of its SHA-256, written with the letters a-p. Async because it uses Web Crypto, which
 * both Node and browsers have.
 */
export async function chromeExtensionId(key: string): Promise<string> {
  const der = Uint8Array.from(atob(key), (c) => c.charCodeAt(0));
  const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', der));
  let out = '';
  for (const byte of digest.slice(0, 16)) {
    out += String.fromCharCode(97 + (byte >> 4), 97 + (byte & 15));
  }
  return out;
}
