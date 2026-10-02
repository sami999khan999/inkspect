import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { CHROME_EXTENSION_ID, chromeExtensionId } from '@inkspect/shared/hub';
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

  it('builds a Chrome manifest with the toolbar, its shortcut and the debugger', () => {
    const manifest = buildManifest(root, 'chrome', { version: '1.2.3' });
    expect(manifest.version).toBe('1.2.3');
    expect(manifest.background).toEqual({ service_worker: 'background.js' });
    expect(manifest.commands['toggle-toolbar'].suggested_key.default).toBe('Alt+Shift+K');
    expect(manifest.permissions).toEqual(
      expect.arrayContaining(['storage', 'bookmarks', 'activeTab', 'scripting', 'debugger']),
    );
    // Pages are reached through activeTab only (the toolbar is opened on purpose).
    expect(manifest.host_permissions).toBeUndefined();
  });

  it('fixes the Chrome extension id with its key, for the browser helper to allow', async () => {
    const manifest = buildManifest(root, 'chrome', { version: '1.2.3' });
    expect(await chromeExtensionId(manifest.key)).toBe(CHROME_EXTENSION_ID);
    expect(manifest.permissions).toContain('nativeMessaging');
  });

  it('adds the projects side panel (Chrome) and sidebar (Firefox)', () => {
    const chrome = buildManifest(root, 'chrome', { version: '1' });
    expect(chrome.side_panel).toEqual({ default_path: 'sidepanel.html' });
    expect(chrome.permissions).toContain('sidePanel');
    const firefox = buildManifest(root, 'firefox', { version: '1' });
    expect(firefox.sidebar_action.default_panel).toBe('sidepanel.html');
    expect(firefox.permissions).not.toContain('sidePanel');
  });

  it('builds a Firefox manifest with background scripts, a gecko id and no debugger', () => {
    const manifest = buildManifest(root, 'firefox', { version: '1.2.3' });
    expect(manifest.background).toEqual({ scripts: ['background.js'] });
    expect(manifest.browser_specific_settings.gecko.id).toMatch(/@/);
    expect(manifest.permissions).toContain('activeTab');
    expect(manifest.permissions).not.toContain('debugger');
  });

  it('gives the test build access to all pages', () => {
    expect(buildManifest(root, 'chrome', { version: '0', test: true }).host_permissions).toEqual([
      '<all_urls>',
    ]);
  });
});
