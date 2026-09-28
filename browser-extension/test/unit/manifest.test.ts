import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
// @ts-expect-error: plain JavaScript build helper
import { buildManifest, merge } from '../../scripts/manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('manifests', () => {
  it('merges overlays: arrays add up, objects merge', () => {
    expect(merge({ a: [1], b: { x: 1, y: 2 }, c: 1 }, { a: [2], b: { y: 3 }, c: 2 })).toEqual({
      a: [1, 2],
      b: { x: 1, y: 3 },
      c: 2,
    });
  });

  it('builds a Chrome manifest for bookmark sync only (the toolbar is switched off)', () => {
    const manifest = buildManifest(root, 'chrome', { version: '1.2.3' });
    expect(manifest.version).toBe('1.2.3');
    expect(manifest.background).toEqual({ service_worker: 'background.js' });
    expect(manifest.permissions).toEqual(['storage', 'bookmarks']);
    expect(manifest.commands).toBeUndefined();
    expect(manifest.host_permissions).toBeUndefined();
  });

  it('keeps the disabled toolbar entries for later', () => {
    const toolbar = JSON.parse(readFileSync(join(root, 'manifest', 'toolbar.json'), 'utf8'));
    expect(toolbar.commands['toggle-toolbar'].suggested_key.default).toBe('Alt+Shift+I');
    expect(toolbar.permissions).toEqual(expect.arrayContaining(['activeTab', 'scripting']));
  });

  it('builds a Firefox manifest with background scripts, a gecko id and no debugger', () => {
    const manifest = buildManifest(root, 'firefox', { version: '1.2.3' });
    expect(manifest.background).toEqual({ scripts: ['background.js'] });
    expect(manifest.browser_specific_settings.gecko.id).toMatch(/@/);
    expect(manifest.permissions).toEqual(['storage', 'bookmarks']);
  });

  it('gives the test build access to all pages', () => {
    expect(buildManifest(root, 'chrome', { version: '0', test: true }).host_permissions).toEqual([
      '<all_urls>',
    ]);
  });
});
