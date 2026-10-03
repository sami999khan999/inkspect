// The Saved list: everything captured for a project (picked elements, screenshots, console
// errors, reports...), ready to send to an AI agent. Types and messages shared by the extension
// host and the Saved view (a sidebar webview); the list itself is @inkspect/shared/ui/SavedList.
import { ITEM_KINDS, type ItemKind } from '@inkspect/shared/hub';
import { KIND_ICONS, KIND_LABELS, timeAgo, type SavedItemView } from '@inkspect/shared/saved';

export type ContextKind = ItemKind;

export const CONTEXT_KINDS: readonly ContextKind[] = ITEM_KINDS;

/** Codicon per kind. */
export const CONTEXT_ICONS: Record<ContextKind, string> = KIND_ICONS;

export const CONTEXT_KIND_LABELS: Record<ContextKind, string> = KIND_LABELS;

/** One item as the view shows it (see SavedList). */
export type ContextItemView = SavedItemView;

export { timeAgo };

/**
 * A place sends can go: an agent in a VS Code terminal, an agent in an agentmux (tmux) pane, or
 * VS Code chat.
 */
export interface AgentTarget {
  id: string;
  kind: 'terminal' | 'tmux' | 'chat';
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
      /** The project the list shows, and the others it can show. */
      project: { path: string; name: string; inbox?: boolean };
      projects: { path: string; name: string; detail?: string }[];
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
  /** Shows another project's list (and captures into it). */
  | { type: 'setProject'; path: string }
  /** Sends to an agentmux thread, then shows that thread. */
  | { type: 'openInAgentmux'; ids: string[]; target: string }
  | { type: 'chooseTerminal' }
  | { type: 'startAgent' };

/** Validates a message from the Saved view (webview input is untrusted). */
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
    case 'setProject':
      return typeof m.path === 'string' && m.path.length > 0 && m.path.length <= 4096;
    case 'openInAgentmux':
      return ids(m.ids) && shortString(m.target);
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
