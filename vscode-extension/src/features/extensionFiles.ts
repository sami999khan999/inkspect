// Reading Chrome extension packages: CRX/ZIP unpacking, manifests, icons, Web Store ids.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join, normalize, sep } from 'node:path';
import { unzipSync } from 'fflate';

/** Strips the CRX header (versions 2 and 3) and returns the ZIP inside. Plain ZIPs pass through. */
export function crxToZip(data: Uint8Array): Uint8Array {
  const buffer = Buffer.from(data.buffer, data.byteOffset, data.byteLength);
  if (buffer.subarray(0, 4).toString('latin1') !== 'Cr24') return data;
  const version = buffer.readUInt32LE(4);
  if (version === 3) {
    const headerSize = buffer.readUInt32LE(8);
    return data.subarray(12 + headerSize);
  }
  if (version === 2) {
    const keyLength = buffer.readUInt32LE(8);
    const signatureLength = buffer.readUInt32LE(12);
    return data.subarray(16 + keyLength + signatureLength);
  }
  throw new Error(`Unsupported CRX version ${version}`);
}

/** Extracts a CRX or ZIP into `directory`. Refuses entries that would escape it. */
export function extractPackage(data: Uint8Array, directory: string): void {
  const files = unzipSync(crxToZip(data));
  const root = normalize(directory);
  for (const [name, content] of Object.entries(files)) {
    if (name.endsWith('/')) continue;
    const target = normalize(join(root, name));
    if (!target.startsWith(root + sep)) throw new Error(`Unsafe path in package: ${name}`);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, content);
  }
}

export interface ExtensionManifest {
  manifest_version?: number;
  name?: string;
  version?: string;
  description?: string;
  default_locale?: string;
  icons?: Record<string, string>;
  action?: {
    default_popup?: string;
    default_icon?: string | Record<string, string>;
    default_title?: string;
  };
  browser_action?: { default_popup?: string };
  options_page?: string;
  options_ui?: { page?: string };
  permissions?: string[];
  host_permissions?: string[];
}

/** JSON files in extensions may start with a byte order mark, which `JSON.parse` rejects. */
function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
}

export function readManifest(directory: string): ExtensionManifest {
  const file = join(directory, 'manifest.json');
  if (!existsSync(file)) throw new Error(`No manifest.json in ${directory}`);
  return JSON.parse(stripBom(readFileSync(file, 'utf8'))) as ExtensionManifest;
}

/** Resolves `__MSG_name__` strings from the extension's default locale. */
export function localize(
  directory: string,
  manifest: ExtensionManifest,
  text: string | undefined,
): string {
  const match = /^__MSG_(\w+)__$/.exec(text ?? '');
  if (!match) return text ?? '';
  const locales = [manifest.default_locale, 'en', 'en_US'].filter(Boolean) as string[];
  for (const locale of locales) {
    try {
      const messages = JSON.parse(
        stripBom(readFileSync(join(directory, '_locales', locale, 'messages.json'), 'utf8')),
      ) as Record<string, { message?: string }>;
      const key = Object.keys(messages).find((k) => k.toLowerCase() === match[1]!.toLowerCase());
      if (key && messages[key]?.message) return messages[key].message!;
    } catch {
      // Try the next locale.
    }
  }
  return match[1]!;
}

/** The largest icon up to 128 px, as a data URL (for the toolbar and the extensions page). */
export function iconDataUrl(directory: string, manifest: ExtensionManifest): string | undefined {
  const sets = [
    manifest.icons,
    typeof manifest.action?.default_icon === 'object' ? manifest.action.default_icon : undefined,
  ];
  const candidates: [number, string][] = [];
  for (const set of sets) {
    for (const [size, path] of Object.entries(set ?? {})) candidates.push([Number(size), path]);
  }
  if (typeof manifest.action?.default_icon === 'string')
    candidates.push([32, manifest.action.default_icon]);
  const best =
    candidates.filter(([size]) => size <= 128).sort((a, b) => b[0] - a[0])[0] ?? candidates[0];
  if (!best) return undefined;
  try {
    const bytes = readFileSync(join(directory, best[1].replace(/^\//, '')));
    const type = best[1].toLowerCase().endsWith('.svg') ? 'image/svg+xml' : 'image/png';
    return `data:${type};base64,${bytes.toString('base64')}`;
  } catch {
    return undefined;
  }
}

/** Extracts a Chrome Web Store extension id from a store URL or a bare id. */
export function webStoreId(input: string): string | undefined {
  const trimmed = input.trim();
  if (/^[a-p]{32}$/.test(trimmed)) return trimmed;
  try {
    const url = new URL(trimmed);
    if (!/(^|\.)chromewebstore\.google\.com$|^chrome\.google\.com$/.test(url.hostname))
      return undefined;
    return url.pathname.split('/').find((part) => /^[a-p]{32}$/.test(part));
  } catch {
    return undefined;
  }
}

/** Download URL for a Web Store extension's CRX. */
export function webStoreDownloadUrl(id: string, chromeVersion: string): string {
  return `https://clients2.google.com/service/update2/crx?response=redirect&prodversion=${encodeURIComponent(chromeVersion)}&acceptformat=crx2,crx3&x=id%3D${id}%26uc`;
}

/** Update check URL (returns XML with the latest version). */
export function webStoreUpdateUrl(id: string, version: string, chromeVersion: string): string {
  return `https://clients2.google.com/service/update2/crx?response=updatecheck&prodversion=${encodeURIComponent(chromeVersion)}&acceptformat=crx3&x=id%3D${id}%26v%3D${encodeURIComponent(version)}%26uc`;
}

/** Reads the latest version from an update check response, if an update is available. */
export function parseUpdateCheck(xml: string): string | undefined {
  const match = /<updatecheck[^>]*status="ok"[^>]*>/i.exec(xml);
  return match ? /version="([^"]+)"/.exec(match[0])?.[1] : undefined;
}

/** Compares dotted version strings (`1.10.0` > `1.9.3`). */
export function compareVersions(a: string, b: string): number {
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (diff) return diff;
  }
  return 0;
}
