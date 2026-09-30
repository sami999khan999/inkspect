// The Agent Context list: everything captured in the browser (picked elements, screenshots,
// console errors, reports...), ready to send to an AI agent. Types and messages shared by the
// extension host and the Agent Context view (a sidebar webview).

export type ContextKind =
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

export const CONTEXT_KINDS: readonly ContextKind[] = [
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

/** Codicon per kind. */
export const CONTEXT_ICONS: Record<ContextKind, string> = {
  element: 'inspect',
  screenshot: 'device-camera',
  recording: 'record',
  errors: 'error',
  network: 'globe',
  page: 'browser',
  report: 'checklist',
  css: 'symbol-color',
  measure: 'symbol-ruler',
  color: 'symbol-color',
  text: 'note',
};

export const CONTEXT_KIND_LABELS: Record<ContextKind, string> = {
  element: 'Element',
  screenshot: 'Screenshot',
  recording: 'Recording',
  errors: 'Console errors',
  network: 'Failed requests',
  page: 'Page context',
  report: 'Report',
  css: 'CSS changes',
  measure: 'Measurements',
  color: 'Color',
  text: 'Text',
};

/** One item as the view shows it. */
export interface ContextItemView {
  id: string;
  kind: ContextKind;
  title: string;
  /** A second line: the page, the size, the number of errors... */
  detail?: string;
  /** The start of the text that is sent. */
  preview?: string;
  /** The item has an image (its bytes come in a `thumbnail` message). */
  image: boolean;
  /** The file sent for it, as shown to the user. */
  file?: string;
  url?: string;
  time: number;
  /** Agents it was sent to. */
  sentTo: string[];
  /** Captures made (or grouped) together share a group: shown as one card, sent together. */
  group?: string;
}

/** A place sends can go: an agent in a terminal, or VS Code chat. */
export interface AgentTarget {
  id: string;
  kind: 'terminal' | 'chat';
  label: string;
  detail: string;
}

export type HostToContextView =
  | {
      type: 'state';
      items: ContextItemView[];
      targets: AgentTarget[];
      /** Where "Send" goes by default; undefined when no agent is running. */
      target?: string;
      /** The keys of "Show agent context" and "Send latest to agent", for the hints. */
      keys: { show: string; sendLatest: string };
      /** What the last removal took ("Removed 4 items"), while it can be undone. */
      undo?: string;
    }
  | { type: 'thumbnail'; id: string; data: Uint8Array; mimeType: string };

export type ContextViewToHost =
  | { type: 'ready' }
  | { type: 'send'; id: string; target?: string }
  | { type: 'copy'; id: string }
  | { type: 'open'; id: string }
  | { type: 'remove'; id: string }
  /** Several items at once: a group (its checked thumbnails) or a selection. */
  | { type: 'sendMany'; ids: string[]; target?: string }
  | { type: 'removeMany'; ids: string[] }
  | { type: 'group'; ids: string[] }
  | { type: 'ungroup'; group: string }
  | { type: 'clear' }
  /** Puts back what the last removal (Clear all, Remove) took. */
  | { type: 'undo' }
  | { type: 'setTarget'; target: string }
  | { type: 'chooseTerminal' }
  | { type: 'startAgent' };

/** Validates a message from the Agent Context view (webview input is untrusted). */
export function isContextViewMessage(value: unknown): value is ContextViewToHost {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  const shortString = (v: unknown) => typeof v === 'string' && v.length <= 100;
  // Item ids, at most the list's size (60).
  const ids = (v: unknown) =>
    Array.isArray(v) && v.length > 0 && v.length <= 60 && v.every(shortString);
  switch (m.type) {
    case 'ready':
    case 'clear':
    case 'undo':
    case 'chooseTerminal':
    case 'startAgent':
      return true;
    case 'send':
      return shortString(m.id) && (m.target === undefined || shortString(m.target));
    case 'copy':
    case 'open':
    case 'remove':
      return shortString(m.id);
    case 'setTarget':
      return shortString(m.target);
    case 'sendMany':
      return ids(m.ids) && (m.target === undefined || shortString(m.target));
    case 'removeMany':
    case 'group':
      return ids(m.ids);
    case 'ungroup':
      return shortString(m.group);
    default:
      return false;
  }
}

/**
 * The elements named in element details (Markdown, as `formatDetails` writes them, from VS Code
 * or the browser extension): `h2#title · div.card · +2 more`. Undefined for other text.
 */
export function elementSummary(markdown: string, shown = 3): string | undefined {
  const names = [...markdown.matchAll(/^#{2,4}\s+(?:\d+\.\s+)?Element:\s*`([^`]+)`/gm)].map(
    (match) => match[1]!,
  );
  if (!names.length) return undefined;
  const more = names.length - shown;
  return [...names.slice(0, shown), ...(more > 0 ? [`+${more} more`] : [])].join(' · ');
}

/** The first lines of a text, for previews. */
export function previewText(text: string, max = 160): string {
  // Plain words: Markdown's headings, code marks and bold would only clutter a preview.
  const flat = text
    .replace(/```[a-z]*\n?/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/`|\*\*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return flat.length > max ? `${flat.slice(0, max - 1)}…` : flat;
}

/** `just now`, `5 min ago`, `2 h ago`, then the date. */
export function timeAgo(time: number, now = Date.now()): string {
  const seconds = Math.max(0, Math.round((now - time) / 1000));
  if (seconds < 45) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(time).toLocaleDateString();
}
