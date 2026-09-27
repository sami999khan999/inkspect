// Console and network entries for the developer drawer, and Markdown summaries for AI agents.

export type ConsoleLevel = 'error' | 'warning' | 'info' | 'debug';

export interface ConsoleEntry {
  id: number;
  level: ConsoleLevel;
  text: string;
  /** Script URL (or workspace-relative path) and position that produced the message. */
  url?: string;
  line?: number;
  column?: number;
  /** `console`, `exception`, or a browser log source such as `network` or `security`. */
  source: string;
  time: number;
}

export interface NetworkEntry {
  id: string;
  method: string;
  url: string;
  /** Resource type: Document, Script, Fetch, XHR, Image... */
  type: string;
  status?: number;
  mimeType?: string;
  /** Transferred bytes. */
  size?: number;
  /** Milliseconds. */
  duration?: number;
  error?: string;
  canceled?: boolean;
  time: number;
}

export function isFailedRequest(entry: NetworkEntry): boolean {
  return !!entry.error || (entry.status !== undefined && entry.status >= 400);
}

function location(entry: ConsoleEntry): string {
  if (!entry.url) return '';
  const line = entry.line !== undefined ? `:${entry.line + 1}` : '';
  const column =
    entry.line !== undefined && entry.column !== undefined ? `:${entry.column + 1}` : '';
  return `${entry.url}${line}${column}`;
}

/** Console errors (and optionally warnings) as a numbered Markdown list. */
export function formatConsoleErrors(
  entries: ConsoleEntry[],
  pageUrl: string,
  includeWarnings = false,
): string {
  const picked = entries.filter(
    (e) => e.level === 'error' || (includeWarnings && e.level === 'warning'),
  );
  if (!picked.length) return `### Console errors: ${pageUrl}\nNo errors.`;
  const lines = [`### Console errors: ${pageUrl} (${picked.length})`];
  picked.forEach((entry, index) => {
    const [first, ...rest] = entry.text.split('\n');
    lines.push(`${index + 1}. ${entry.level === 'warning' ? '[warning] ' : ''}${first}`);
    for (const line of rest.slice(0, 8)) lines.push(`   ${line.trim()}`);
    const where = location(entry);
    if (where && !entry.text.includes(where)) lines.push(`   at ${where}`);
  });
  return lines.join('\n');
}

function requestLine(entry: NetworkEntry): string {
  const outcome = entry.error
    ? entry.canceled
      ? 'canceled'
      : entry.error
    : `${entry.status}${entry.mimeType ? ` ${entry.mimeType}` : ''}`;
  const timing = entry.duration !== undefined ? `, ${Math.round(entry.duration)} ms` : '';
  return `- ${entry.method} ${entry.url} → ${outcome} (${entry.type}${timing})`;
}

export function formatFailedRequests(entries: NetworkEntry[], pageUrl: string): string {
  const failed = entries.filter(isFailedRequest);
  if (!failed.length) return `### Failed network requests: ${pageUrl}\nNo failed requests.`;
  return [
    `### Failed network requests: ${pageUrl} (${failed.length})`,
    ...failed.map(requestLine),
  ].join('\n');
}

export interface PageContextInput {
  url: string;
  title: string;
  viewport: { width: number; height: number };
  device?: string;
  selection?: string;
  console: ConsoleEntry[];
  network: NetworkEntry[];
}

/** A short summary of the page for an AI agent: where, what size, and what went wrong. */
export function formatPageContext(input: PageContextInput): string {
  const lines = [
    '### Page context',
    `- URL: ${input.url}`,
    `- Title: ${input.title}`,
    `- Viewport: ${input.viewport.width}×${input.viewport.height}${input.device ? ` (emulating ${input.device})` : ''}`,
  ];
  if (input.selection) lines.push(`- Selected text: "${input.selection.slice(0, 500)}"`);
  const errors = input.console.filter((e) => e.level === 'error').slice(-5);
  if (errors.length) {
    lines.push('', `Recent console errors (${errors.length}):`);
    for (const e of errors) {
      const where = location(e);
      lines.push(`- ${e.text.split('\n')[0]}${where ? ` (${where})` : ''}`);
    }
  }
  const failed = input.network.filter(isFailedRequest).slice(-5);
  if (failed.length)
    lines.push('', `Failed requests (${failed.length}):`, ...failed.map(requestLine));
  return lines.join('\n');
}

/** A remote object from `Runtime.consoleAPICalled` as text, like the DevTools console shows it. */
export function describeRemoteObject(object: {
  type: string;
  subtype?: string;
  value?: unknown;
  unserializableValue?: string;
  description?: string;
  preview?: {
    properties: { name: string; value?: string; type: string }[];
    overflow: boolean;
    subtype?: string;
  };
}): string {
  if (object.unserializableValue) return object.unserializableValue;
  if (object.type === 'string') return String(object.value);
  if (object.type === 'undefined') return 'undefined';
  if (object.subtype === 'null') return 'null';
  if ('value' in object && object.value !== undefined && object.type !== 'object')
    return String(object.value);
  if (object.preview && object.subtype !== 'error') {
    const isArray = object.subtype === 'array';
    const parts = object.preview.properties.map((p) => {
      const value = p.type === 'string' ? JSON.stringify(p.value ?? '') : (p.value ?? '');
      return isArray ? value : `${p.name}: ${value}`;
    });
    if (object.preview.overflow) parts.push('…');
    return isArray ? `[${parts.join(', ')}]` : `{${parts.join(', ')}}`;
  }
  return object.description ?? object.type;
}

/** Replaces `%s`, `%d`, `%i`, `%f`, `%o`, `%O`, `%c` in the first console argument. */
export function formatConsoleArguments(texts: string[]): string {
  const [first, ...rest] = texts;
  if (first === undefined) return '';
  let index = 0;
  const formatted = first.replace(/%[sdifoOc]/g, (token) => {
    if (index >= rest.length) return token;
    const value = rest[index++]!;
    if (token === '%c') return '';
    if (token === '%d' || token === '%i') return String(parseInt(value, 10));
    if (token === '%f') return String(parseFloat(value));
    return value;
  });
  return [formatted, ...rest.slice(index)].join(' ');
}
