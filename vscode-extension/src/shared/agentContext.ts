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
    }
  | { type: 'thumbnail'; id: string; data: Uint8Array; mimeType: string };

export type ContextViewToHost =
  | { type: 'ready' }
  | { type: 'send'; id: string; target?: string }
  | { type: 'copy'; id: string }
  | { type: 'open'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'clear' }
  | { type: 'setTarget'; target: string }
  | { type: 'chooseTerminal' }
  | { type: 'startAgent' };

/** Validates a message from the Agent Context view (webview input is untrusted). */
export function isContextViewMessage(value: unknown): value is ContextViewToHost {
  if (typeof value !== 'object' || value === null) return false;
  const m = value as Record<string, unknown>;
  const shortString = (v: unknown) => typeof v === 'string' && v.length <= 100;
  switch (m.type) {
    case 'ready':
    case 'clear':
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
    default:
      return false;
  }
}

/** The first lines of a text, for previews. */
export function previewText(text: string, max = 160): string {
  const flat = text
    .replace(/```[a-z]*\n?/g, '')
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
