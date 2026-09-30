// The link between the VS Code extension (server, 127.0.0.1) and the browser extension
// (client), over a WebSocket. Every message is JSON with the protocol version `v`; both sides
// validate what they receive with the parsers below and drop anything else.
import type { FlatNode, RemoteOp } from './bookmarkSync';

export const BRIDGE_VERSION = 1;
export const DEFAULT_BRIDGE_PORT = 47110;
/** The client tries this many ports from the configured one (several VS Code installs). */
export const BRIDGE_PORT_RANGE = 5;
export const BRIDGE_PATH = '/bridge';

export interface ClientInfo {
  /** Random id of this browser profile's extension install. */
  id: string;
  /** "Google Chrome", "Microsoft Edge", "Firefox"... */
  browser: string;
}

/** Where a send goes: an agent (chat or terminal), a file in the workspace, or only the Agent
 * Context list (every capture goes there as it is taken). */
export type SendTarget = 'chat' | 'terminal' | 'save' | 'context';

/** What a capture is, for the Agent Context list. */
export type CaptureKind = 'screenshot' | 'element' | 'errors' | 'network' | 'page' | 'text';

/**
 * The VS Code browser's shortcut changes, synced through the browser extension's
 * `chrome.storage.sync` so they follow the user's browser account to other devices.
 */
export interface ShortcutSettings {
  /** Action id to its keys (see the VS Code extension's shortcut registry). */
  shortcuts: Record<string, string | string[]>;
  /** When they last changed (ms since the epoch); 0 means never. */
  updated: number;
}

/**
 * Which copy of the shortcut settings should win: the one changed last. `same` when both were
 * changed at the same moment (nothing to do).
 */
export function newerShortcuts(
  local: ShortcutSettings | undefined,
  remote: ShortcutSettings | undefined,
): 'local' | 'remote' | 'same' {
  const a = local?.updated ?? 0;
  const b = remote?.updated ?? 0;
  return a === b ? 'same' : a > b ? 'local' : 'remote';
}

/** An open VS Code window a send can go to (VS Code lists them for the browser). */
export interface VsCodeWindow {
  id: string;
  /** Its workspace's name. */
  name: string;
  /** Sends that name no window go to this one: the window used last. */
  lastUsed: boolean;
}

export type ClientMessage =
  | { type: 'pair'; code: string; client: ClientInfo }
  | { type: 'hello'; client: ClientInfo; token: string }
  | { type: 'ping' }
  | { type: 'bookmarks.snapshot'; tree: FlatNode[] }
  | { type: 'bookmarks.applied'; created: Record<string, string>; failed: string[] }
  | {
      type: 'send';
      id: string;
      target: SendTarget;
      /** Text (element details, console summary...) or the prompt that goes with an image. */
      text?: string;
      /** PNG as base64 (no data: prefix). */
      image?: string;
      label?: string;
      pageUrl?: string;
      /** The VS Code window to run it in (`VsCodeWindow.id`); the one used last if unset. */
      window?: string;
      /**
       * The capture it comes from: sends of one capture share one Agent Context item (the
       * automatic "context" send first, a send to an agent later).
       */
      capture?: string;
      kind?: CaptureKind;
      /** Captures made together (several screenshots): one group in Agent Context. */
      group?: string;
      /**
       * Sends these captures, already in Agent Context (sent as "context" first), together in one
       * send (a group, or the checked part of one); no text or image then.
       */
      captures?: string[];
    }
  /** The shortcuts stored in the browser's sync storage (sent when they are newer). */
  | ({ type: 'settings.shortcuts' } & ShortcutSettings);

export type ServerMessage =
  | { type: 'paired'; token: string; peer: string }
  | { type: 'welcome'; peer: string; syncBookmarks: boolean }
  | { type: 'error'; message: string; code?: 'unpaired' | 'bad-code' | 'version' | 'unauthorized' }
  | { type: 'pong' }
  | { type: 'bookmarks.ops'; ops: RemoteOp[] }
  | { type: 'bookmarks.requestSnapshot' }
  | { type: 'send.result'; id: string; ok: boolean; path?: string; error?: string }
  /** The open VS Code windows, sent after `welcome` and whenever they change. */
  | { type: 'windows'; windows: VsCodeWindow[] }
  /** VS Code's shortcuts, sent after `welcome` and whenever they change. */
  | ({ type: 'settings.shortcuts' } & ShortcutSettings);

export function encode(message: ClientMessage | ServerMessage): string {
  return JSON.stringify({ v: BRIDGE_VERSION, ...message });
}

type Check = (value: unknown) => boolean;
const isString: Check = (v) => typeof v === 'string';
const isNumber: Check = (v) => typeof v === 'number' && Number.isFinite(v);
const isBoolean: Check = (v) => typeof v === 'boolean';
const optional =
  (check: Check): Check =>
  (v) =>
    v === undefined || check(v);
const oneOf =
  (...values: string[]): Check =>
  (v) =>
    typeof v === 'string' && values.includes(v);
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);
const shape =
  (fields: Record<string, Check>): Check =>
  (v) =>
    isRecord(v) && Object.entries(fields).every(([k, check]) => check(v[k]));
const arrayOf =
  (check: Check, max = 100_000): Check =>
  (v) =>
    Array.isArray(v) && v.length <= max && v.every(check);
const stringMap: Check = (v) => isRecord(v) && Object.values(v).every(isString);
/** A shortcut map: a bounded number of ids, each with a key or a few keys. */
const isKey: Check = (k) => typeof k === 'string' && k.length <= 40;
const shortcutMap: Check = (v) =>
  isRecord(v) &&
  Object.keys(v).length <= 500 &&
  Object.values(v).every((keys) => isKey(keys) || arrayOf(isKey, 8)(keys));

const flatNode = shape({
  id: isString,
  parentId: isString,
  index: isNumber,
  title: isString,
  url: optional(isString),
});
const client = shape({ id: isString, browser: isString });
const remoteOp: Check = (v) =>
  isRecord(v) &&
  ((v.op === 'create' &&
    shape({
      ref: isString,
      parentId: isString,
      index: isNumber,
      title: isString,
      url: optional(isString),
    })(v)) ||
    (v.op === 'update' && shape({ id: isString, title: isString, url: optional(isString) })(v)) ||
    (v.op === 'move' && shape({ id: isString, parentId: isString, index: isNumber })(v)) ||
    (v.op === 'remove' && shape({ id: isString })(v)));

const CLIENT_MESSAGES: Record<ClientMessage['type'], Record<string, Check>> = {
  pair: { code: isString, client },
  hello: { client, token: isString },
  ping: {},
  'bookmarks.snapshot': { tree: arrayOf(flatNode) },
  'bookmarks.applied': { created: stringMap, failed: arrayOf(isString) },
  send: {
    id: isString,
    target: oneOf('chat', 'terminal', 'save', 'context'),
    text: optional(isString),
    image: optional(isString),
    label: optional(isString),
    pageUrl: optional(isString),
    window: optional(isString),
    capture: optional(isString),
    kind: optional(oneOf('screenshot', 'element', 'errors', 'network', 'page', 'text')),
    group: optional(isString),
    captures: optional(arrayOf(isString, 60)),
  },
  'settings.shortcuts': { shortcuts: shortcutMap, updated: isNumber },
};

const vsCodeWindow = shape({ id: isString, name: isString, lastUsed: isBoolean });

const SERVER_MESSAGES: Record<ServerMessage['type'], Record<string, Check>> = {
  paired: { token: isString, peer: isString },
  welcome: { peer: isString, syncBookmarks: isBoolean },
  error: { message: isString, code: optional(isString) },
  pong: {},
  'bookmarks.ops': { ops: arrayOf(remoteOp) },
  'bookmarks.requestSnapshot': {},
  'send.result': {
    id: isString,
    ok: isBoolean,
    path: optional(isString),
    error: optional(isString),
  },
  windows: { windows: arrayOf(vsCodeWindow, 50) },
  'settings.shortcuts': { shortcuts: shortcutMap, updated: isNumber },
};

function parse<T extends { type: string }>(
  raw: string,
  table: Record<string, Record<string, Check>>,
): T | undefined {
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return undefined;
  }
  if (!isRecord(value) || value.v !== BRIDGE_VERSION || typeof value.type !== 'string')
    return undefined;
  const fields = table[value.type];
  if (!fields || !shape(fields)(value)) return undefined;
  const { v: _version, ...message } = value;
  return message as T;
}

/** A message from the browser extension, or undefined if it isn't one (or has another version). */
export function parseClientMessage(raw: string): ClientMessage | undefined {
  return parse<ClientMessage>(raw, CLIENT_MESSAGES);
}

/** A message from VS Code, or undefined. */
export function parseServerMessage(raw: string): ServerMessage | undefined {
  return parse<ServerMessage>(raw, SERVER_MESSAGES);
}

/** Origins allowed to connect: extension pages only (never web pages). */
export function isExtensionOrigin(origin: string | undefined): boolean {
  return !!origin && /^(chrome-extension|moz-extension|extension):\/\/[\w-]+$/.test(origin);
}
