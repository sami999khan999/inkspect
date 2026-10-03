// The link between the VS Code extension (server, 127.0.0.1) and the browser extension
// (client), over a WebSocket. Every message is JSON with the protocol version `v`; both sides
// validate what they receive with the parsers below and drop anything else.
import type { FlatNode, RemoteOp } from './bookmarkSync';
import { parseBrowserToHub, parseHubToBrowser, type BrowserToHub, type HubToBrowser } from './hub';
import type { Check } from './validate';
import {
  arrayOf,
  isBoolean,
  isNumber,
  isRecord,
  isString,
  optional,
  parseMessage,
  shape,
  stringMap,
} from './validate';

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

/** What a capture is, for the Saved list. */
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

/** What VS Code can do for a linked browser beyond the basics (see `welcome`). */
export type LinkFeature = 'hub';

/**
 * A question about projects and their saved captures (the browser helper's protocol, see
 * ./hub.ts), asked over this link when the browser helper isn't there.
 */
export type HubRequest = Extract<BrowserToHub, { req: string }>;
export type HubReply = Extract<HubToBrowser, { req: string }>;

export type ClientMessage =
  | { type: 'pair'; code: string; client: ClientInfo }
  | { type: 'hello'; client: ClientInfo; token: string }
  | { type: 'ping' }
  | { type: 'bookmarks.snapshot'; tree: FlatNode[] }
  | { type: 'bookmarks.applied'; created: Record<string, string>; failed: string[] }
  /** Projects and saved captures: listed, saved, sent, moved (VS Code answers `hub.reply`). */
  | { type: 'hub.request'; request: HubRequest }
  /** The shortcuts stored in the browser's sync storage (sent when they are newer). */
  | ({ type: 'settings.shortcuts' } & ShortcutSettings);

export type ServerMessage =
  | { type: 'paired'; token: string; peer: string }
  /** `features`: what this VS Code can do beyond the basics (`hub`: answers `hub.request`). */
  | { type: 'welcome'; peer: string; syncBookmarks: boolean; features?: LinkFeature[] }
  | { type: 'error'; message: string; code?: 'unpaired' | 'bad-code' | 'version' | 'unauthorized' }
  | { type: 'pong' }
  | { type: 'bookmarks.ops'; ops: RemoteOp[] }
  | { type: 'bookmarks.requestSnapshot' }
  | { type: 'hub.reply'; reply: HubReply }
  /** VS Code's shortcuts, sent after `welcome` and whenever they change. */
  | ({ type: 'settings.shortcuts' } & ShortcutSettings);

export function encode(message: ClientMessage | ServerMessage): string {
  return JSON.stringify({ v: BRIDGE_VERSION, ...message });
}

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
  'hub.request': { request: (v) => isRecord(v) && 'req' in v && !!parseBrowserToHub(v) },
  'settings.shortcuts': { shortcuts: shortcutMap, updated: isNumber },
};

const SERVER_MESSAGES: Record<ServerMessage['type'], Record<string, Check>> = {
  paired: { token: isString, peer: isString },
  welcome: { peer: isString, syncBookmarks: isBoolean, features: optional(arrayOf(isString, 20)) },
  error: { message: isString, code: optional(isString) },
  pong: {},
  'bookmarks.ops': { ops: arrayOf(remoteOp) },
  'bookmarks.requestSnapshot': {},
  'hub.reply': { reply: (v) => isRecord(v) && 'req' in v && !!parseHubToBrowser(v) },
  'settings.shortcuts': { shortcuts: shortcutMap, updated: isNumber },
};

/** A message from the browser extension, or undefined if it isn't one (or has another version). */
export function parseClientMessage(raw: string): ClientMessage | undefined {
  return parseMessage<ClientMessage>(raw, CLIENT_MESSAGES, BRIDGE_VERSION);
}

/** A message from VS Code, or undefined. */
export function parseServerMessage(raw: string): ServerMessage | undefined {
  return parseMessage<ServerMessage>(raw, SERVER_MESSAGES, BRIDGE_VERSION);
}

/** Origins allowed to connect: extension pages only (never web pages). */
export function isExtensionOrigin(origin: string | undefined): boolean {
  return !!origin && /^(chrome-extension|moz-extension|extension):\/\/[\w-]+$/.test(origin);
}
