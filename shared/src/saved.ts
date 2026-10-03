// The Saved list's shared vocabulary: what VS Code's Saved view and the browser's side panel
// show for a project's captures (`.inkspect/`), and the send dialog's project choice. Pure.
import { isLive, type ItemKind, type ItemMeta, type Project } from './hub';

/** One saved capture as the lists show it. */
export interface SavedItemView {
  id: string;
  kind: ItemKind;
  title: string;
  /** A second line: the page, the size, the number of errors... */
  detail?: string;
  /** The start of the text that is sent. */
  preview?: string;
  /** It has an image (a thumbnail can be shown). */
  image: boolean;
  /** The file sent for it, as shown to the user. */
  file?: string;
  url?: string;
  time: number;
  /** Agents it was sent to. */
  sentTo: string[];
  /** Captures made (or grouped) together share a group: shown as one card, sent together. */
  group?: string;
  groupIndex?: number;
  /** Where it was captured ("Chrome", "VS Code"). */
  source?: string;
}

/** Codicon per kind. */
export const KIND_ICONS: Record<ItemKind, string> = {
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

export const KIND_LABELS: Record<ItemKind, string> = {
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

/** A row of the list: one item, or the items of a group (in the order they were captured). */
export type SavedRow =
  | { kind: 'item'; key: string; item: SavedItemView }
  | { kind: 'group'; key: string; group: string; items: SavedItemView[] };

/** Items in list order (newest first), a group once, at its newest item's place. */
export function rowsOf(items: readonly SavedItemView[]): SavedRow[] {
  const rows: SavedRow[] = [];
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.group) {
      rows.push({ kind: 'item', key: item.id, item });
      continue;
    }
    if (seen.has(item.group)) continue;
    seen.add(item.group);
    const members = items
      .filter((i) => i.group === item.group)
      .sort((a, b) => (a.groupIndex ?? 0) - (b.groupIndex ?? 0) || a.time - b.time);
    rows.push(
      members.length > 1
        ? { kind: 'group', key: `group:${item.group}`, group: item.group, items: members }
        : { kind: 'item', key: item.id, item },
    );
  }
  return rows;
}

/** The ids a row stands for. */
export const idsOf = (row: SavedRow): string[] =>
  row.kind === 'item' ? [row.item.id] : row.items.map((i) => i.id);

/** "Drawing 1 of 3", "Drawing 2 of 3" → "Drawing"; different titles → "Screenshots". */
export function groupTitle(items: readonly SavedItemView[]): string {
  if (items.every((i) => i.kind === 'element')) return 'Elements';
  const bases = new Set(items.map((i) => i.title.replace(/\s+\d+\s+of\s+\d+$/, '')));
  const [base] = bases;
  return bases.size === 1 && base ? base : 'Screenshots';
}

/** An item of a project's store as the lists show it (the side panel's, from the helper). */
export function savedViewOf(meta: ItemMeta): SavedItemView {
  return {
    id: meta.id,
    kind: meta.kind,
    title: meta.title,
    detail: meta.detail,
    preview: meta.preview,
    image: !!(meta.files.thumb || (meta.files.file && meta.kind !== 'recording')),
    url: meta.url,
    time: meta.time,
    sentTo: meta.sentTo,
    group: meta.group,
    groupIndex: meta.groupIndex,
    source: meta.source === 'browser' ? (meta.browser ?? 'Browser') : 'VS Code',
  };
}

/** What a project is to the user: open in VS Code, has agents, or only saved captures. */
export function projectDetail(project: Project): string {
  if (project.inbox) return 'captures without a project';
  const parts = [
    project.vscode && 'VS Code',
    project.agentmux && 'agentmux',
    !isLive(project) && project.saved && 'saved',
    project.pinned && 'pinned',
  ].filter(Boolean);
  return parts.join(' · ');
}
