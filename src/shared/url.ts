/** Search URL used when the address bar input is not a URL. `%s` is replaced by the query. */
export const DEFAULT_SEARCH_URL = 'https://www.google.com/search?q=%s';

/** Schemes that are passed through unchanged when typed into the address bar. */
const PASSTHROUGH_SCHEMES = new Set([
  'http',
  'https',
  'file',
  'about',
  'data',
  'blob',
  'view-source',
  'chrome',
  'chrome-extension',
  'devtools',
  'vb',
]);

const SCHEME = /^([a-z][a-z\d+\-.]*):/i;
const WINDOWS_PATH = /^[a-z]:[\\/]/i;
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const HOST_WITH_PORT = /^[^\s/?#:]+:\d{1,5}(?:[/?#]|$)/;
const DOMAIN = /^[^\s/?#:]+\.[a-z][a-z\d-]*\.?(?::\d{1,5})?(?:[/?#]|$)/i;

/**
 * Turns address bar input into a URL to load.
 *
 * - URLs with a known scheme are kept as they are.
 * - `localhost`, IP addresses and `*.localhost` default to `http://`.
 * - Other domain-like input (`example.com/path`) defaults to `https://`.
 * - Absolute file paths become `file://` URLs.
 * - Anything else becomes a search using `searchUrl`.
 *
 * Returns `undefined` for empty input.
 */
export function normalizeInput(input: string, searchUrl = DEFAULT_SEARCH_URL): string | undefined {
  const text = input.trim();
  if (!text) return undefined;
  return toUrl(guessUrl(text)) ?? searchUrl.replace('%s', encodeURIComponent(text));
}

/** Returns the URL the input most likely means, or `undefined` if it should be searched. */
function guessUrl(text: string): string | undefined {
  if (WINDOWS_PATH.test(text)) return `file:///${text.replace(/\\/g, '/')}`;
  if (text.startsWith('/') && !text.startsWith('//')) return `file://${text}`;
  if (/\s/.test(text)) return undefined;

  const scheme = SCHEME.exec(text)?.[1]?.toLowerCase();
  if (scheme && PASSTHROUGH_SCHEMES.has(scheme) && !HOST_WITH_PORT.test(text)) return text;

  if (isLocalHost(hostOf(text))) return `http://${text}`;
  if (DOMAIN.test(text) || HOST_WITH_PORT.test(text)) return `https://${text}`;
  return undefined;
}

function hostOf(text: string): string {
  const authority = text.split(/[/?#]/, 1)[0] ?? '';
  if (authority.startsWith('[')) return authority.slice(0, authority.indexOf(']') + 1);
  return authority.replace(/:\d+$/, '').toLowerCase();
}

function isLocalHost(host: string): boolean {
  return host === 'localhost' || host.endsWith('.localhost') || IPV4.test(host) || host === '[::1]';
}

function toUrl(candidate: string | undefined): string | undefined {
  if (candidate === undefined) return undefined;
  try {
    return new URL(candidate).href;
  } catch {
    return undefined;
  }
}
