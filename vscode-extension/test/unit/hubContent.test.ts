import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  CONTENT_SLICE,
  encodeHub,
  parseHubToBrowser,
  type HubToBrowser,
} from '@inkspect/shared/hub';
import { HubCore } from '../../src/hub/core';
import { writeItem } from '../../src/hub/store';

const temps: string[] = [];
const temp = () => {
  const dir = mkdtempSync(join(tmpdir(), 'inkcontent-'));
  temps.push(dir);
  return dir;
};
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

/** A hub that knows one project: a VS Code window's folder. */
function core(project: string) {
  const window = { id: 'w-1', name: 'shop', folders: [project], focusedAt: 1 };
  return new HubCore(
    { paths: { state: temp(), data: temp() }, inbox: temp(), tmuxSockets: [] },
    {
      windows: () => [window],
      runInWindow: () => Promise.resolve({ ok: false }),
      log: () => {},
    },
  );
}

/** Asks for every slice, as the side panel does (each answer checked as a browser would). */
async function content(hub: HubCore, project: string, id: string) {
  const parts: Buffer[] = [];
  let mimeType: string | undefined;
  for (let offset = 0; ;) {
    const raw = await hub.handle({ type: 'item.content', req: 'r', project, id, offset });
    const reply = parseHubToBrowser(encodeHub(raw)) as Extract<HubToBrowser, { type: 'content' }>;
    if (!reply.ok) return { error: reply.error };
    const slice = Buffer.from(reply.data!, 'base64');
    expect(slice.length).toBeLessThanOrEqual(CONTENT_SLICE);
    mimeType = reply.mimeType;
    parts.push(slice);
    offset += slice.length;
    if (offset >= reply.size!) return { mimeType, bytes: Buffer.concat(parts) };
  }
}

describe('item content (Copy in the side panel)', () => {
  it('returns a large picture in slices that join into the file', async () => {
    const project = temp();
    const png = Buffer.alloc(CONTENT_SLICE * 2 + 1234, 7);
    const item = writeItem(project, {
      kind: 'screenshot',
      title: 'Screenshot',
      source: 'browser',
      media: { bytes: new Uint8Array(png), extension: 'png' },
    });
    const got = await content(core(project), project, item.id);
    expect(got.mimeType).toBe('image/png');
    expect(got.bytes?.equals(png)).toBe(true);
  });

  it('returns an item without a picture as its text', async () => {
    const project = temp();
    const item = writeItem(project, {
      kind: 'element',
      title: '<button>',
      source: 'browser',
      text: '### Element: `button` — ünïcode',
    });
    const got = await content(core(project), project, item.id);
    expect(got.mimeType).toBe('text/plain');
    expect(got.bytes?.toString('utf8')).toBe('### Element: `button` — ünïcode\n');
  });

  it('refuses items of projects it does not know', async () => {
    const hub = core(temp());
    const other = temp();
    const item = writeItem(other, { kind: 'element', title: 'x', source: 'browser', text: 'x' });
    expect((await content(hub, other, item.id)).error).toMatch(/not open/);
  });
});
