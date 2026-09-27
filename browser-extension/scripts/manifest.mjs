// Builds each browser's manifest.json from manifest/base.json plus a small per-browser overlay.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Arrays (permissions...) are concatenated, objects merged, everything else replaced. */
export function merge(base, overlay) {
  const out = { ...base };
  for (const [key, value] of Object.entries(overlay)) {
    if (Array.isArray(value) && Array.isArray(base[key])) out[key] = [...base[key], ...value];
    else if (value && typeof value === 'object' && !Array.isArray(value) && base[key])
      out[key] = merge(base[key], value);
    else out[key] = value;
  }
  return out;
}

/** The manifest for `browser` ("chrome" or "firefox"). */
export function buildManifest(root, browser, { version, test = false }) {
  const read = (name) => JSON.parse(readFileSync(join(root, 'manifest', name), 'utf8'));
  const manifest = merge(read('base.json'), read(`${browser}.json`));
  manifest.version = version;
  if (test) manifest.host_permissions = ['<all_urls>'];
  return manifest;
}
