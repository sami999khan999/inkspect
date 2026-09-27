import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { strToU8, zipSync } from 'fflate';
import { describe, expect, it } from 'vitest';
import {
  compareVersions,
  crxToZip,
  extractPackage,
  localize,
  parseUpdateCheck,
  readManifest,
  webStoreId,
} from '../../src/features/extensionFiles';

const zip = zipSync({
  'manifest.json': strToU8(
    JSON.stringify({
      manifest_version: 3,
      name: '__MSG_name__',
      version: '1.2.3',
      default_locale: 'en',
    }),
  ),
  '_locales/en/messages.json': strToU8(JSON.stringify({ name: { message: 'My Extension' } })),
  'popup/popup.html': strToU8('<p>hi</p>'),
});

function crx3(payload: Uint8Array): Uint8Array {
  const header = Buffer.from('fake-signed-header');
  const prefix = Buffer.alloc(12);
  prefix.write('Cr24', 0, 'latin1');
  prefix.writeUInt32LE(3, 4);
  prefix.writeUInt32LE(header.length, 8);
  return Buffer.concat([prefix, header, payload]);
}

describe('extension packages', () => {
  it('strips CRX3 headers and passes ZIPs through', () => {
    expect(Buffer.from(crxToZip(crx3(zip))).equals(Buffer.from(zip))).toBe(true);
    expect(crxToZip(zip)).toBe(zip);
  });

  it('extracts packages and reads localized manifests', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vb-ext-'));
    extractPackage(crx3(zip), dir);
    expect(readFileSync(join(dir, 'popup', 'popup.html'), 'utf8')).toBe('<p>hi</p>');
    const manifest = readManifest(dir);
    expect(manifest.version).toBe('1.2.3');
    expect(localize(dir, manifest, manifest.name)).toBe('My Extension');
    expect(localize(dir, manifest, 'Plain name')).toBe('Plain name');
  });

  it('refuses entries that escape the target folder', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vb-ext-'));
    const evil = zipSync({ '../evil.txt': strToU8('x') });
    expect(() => extractPackage(evil, join(dir, 'inner'))).toThrow(/Unsafe/);
    expect(existsSync(join(dir, 'evil.txt'))).toBe(false);
  });

  it('reads manifests with a byte order mark', () => {
    const dir = mkdtempSync(join(tmpdir(), 'vb-ext-'));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'manifest.json'), '﻿{"name":"x","manifest_version":3}');
    expect(readManifest(dir).name).toBe('x');
  });
});

describe('Chrome Web Store', () => {
  const id = 'cjpalhdlnbpafiamejdnhcphjbkeiagm';
  it('finds the extension id in store URLs', () => {
    expect(webStoreId(id)).toBe(id);
    expect(webStoreId(`https://chromewebstore.google.com/detail/ublock-origin/${id}`)).toBe(id);
    expect(webStoreId(`https://chrome.google.com/webstore/detail/ublock-origin/${id}?hl=en`)).toBe(
      id,
    );
    expect(webStoreId('https://example.com/detail/x/' + id)).toBeUndefined();
    expect(webStoreId('not an id')).toBeUndefined();
  });

  it('reads update checks and compares versions', () => {
    expect(
      parseUpdateCheck(
        `<app appid="${id}"><updatecheck codebase="x" version="1.60.0" status="ok"/></app>`,
      ),
    ).toBe('1.60.0');
    expect(parseUpdateCheck('<updatecheck status="noupdate"/>')).toBeUndefined();
    expect(compareVersions('1.10.0', '1.9.3')).toBeGreaterThan(0);
    expect(compareVersions('2.0', '2.0.0')).toBe(0);
  });
});
