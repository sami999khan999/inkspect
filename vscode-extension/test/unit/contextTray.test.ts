import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ContextTray } from '../../src/agent/contextTray';
import { readItems, writeItem } from '../../src/hub/store';

const temps: string[] = [];
/** A tray on its own temporary project. */
function tray(): { tray: ContextTray; root: string } {
  const root = mkdtempSync(join(tmpdir(), 'inktray-'));
  temps.push(root);
  return { tray: new ContextTray(root, () => root), root };
}
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

const png = new Uint8Array([0x89, 0x50, 0x4e, 0x47]);
const shot = (title: string, group?: string) => ({
  kind: 'screenshot' as const,
  title,
  image: { bytes: png, mimeType: 'image/png' },
  group,
});

describe('Agent Context, kept in the project', () => {
  it("saves each capture in the project's .inkspect, with its image on disk", () => {
    const { tray: t, root } = tray();
    const item = t.add(shot('A'));
    expect(item.file).toMatch(/\.inkspect\/items\/.+\/capture\.png$/);
    expect(item.mimeType).toBe('image/png');
    expect(readItems(root).map((i) => i.title)).toEqual(['A']);
    // Another window (or VS Code next time) sees the same list.
    expect(new ContextTray(root, () => root).all().map((i) => i.title)).toEqual(['A']);
    t.dispose();
  });

  it('shows what the browser saved into the project', () => {
    const { tray: t, root } = tray();
    writeItem(root, {
      kind: 'element',
      title: 'Element button.primary',
      source: 'browser',
      browser: 'Brave',
      text: '## button.primary',
    });
    t.load();
    expect(t.all()[0]).toMatchObject({ source: 'browser', text: '## button.primary' });
  });

  it('copies a file captured elsewhere into the item', () => {
    const { tray: t, root } = tray();
    const outside = join(root, 'shot.png');
    writeFileSync(outside, png);
    const item = t.add({ kind: 'screenshot', title: 'Saved', file: outside });
    expect(item.file).not.toBe(outside);
    expect(existsSync(item.file!)).toBe(true);
  });
});

describe('Agent Context groups', () => {
  it('keeps a group together, in capture order, and in its place when sent again', () => {
    const { tray: t } = tray();
    t.add(shot('Drawing 1 of 2', 'g'));
    t.add({ kind: 'text', title: 'Other' });
    t.add({ ...shot('Drawing 2 of 2', 'g'), key: 'k' });
    expect(t.inGroup('g').map((i) => i.title)).toEqual(['Drawing 1 of 2', 'Drawing 2 of 2']);
    // The same capture again (same key, no group given) stays in its group.
    t.add({ ...shot('Drawing 2 of 2'), key: 'k' });
    expect(t.inGroup('g')).toHaveLength(2);
    expect(t.all()).toHaveLength(3);
  });

  it('groups items by hand and ungroups them', () => {
    const { tray: t } = tray();
    const a = t.add(shot('A'));
    t.add({ kind: 'text', title: 'Between' });
    const b = t.add(shot('B'));
    expect(t.group([a.id])).toBeUndefined();
    const group = t.group([a.id, b.id])!;
    expect(t.inGroup(group).map((i) => i.title)).toEqual(['A', 'B']);
    // Together in the list (newest first), where the newest of them was.
    expect(
      t
        .all()
        .map((i) => i.title)
        .slice(0, 2)
        .sort(),
    ).toEqual(['A', 'B']);
    t.ungroup(group);
    expect(t.inGroup(group)).toEqual([]);
  });

  it('keeps captures until they are removed (no limit)', () => {
    const { tray: t } = tray();
    for (let i = 0; i < 70; i++) t.add({ kind: 'text', title: `T${i}` });
    expect(t.all()).toHaveLength(70);
  });
});

describe('Agent Context removal', () => {
  it('undoes a removal, putting items back where they were', () => {
    const { tray: t } = tray();
    const a = t.add(shot('A'));
    const b = t.add(shot('B'));
    t.add(shot('C'));
    expect(t.undoLabel()).toBeUndefined();
    t.remove(b.id);
    expect(t.undoLabel()).toBe('Removed "B"');
    expect(t.all().map((i) => i.id)).not.toContain(b.id);
    t.undo();
    expect(t.all().map((i) => i.id)).toContain(b.id);
    expect(t.all().map((i) => i.id)).toContain(a.id);
    expect(t.undoLabel()).toBeUndefined();
    t.dispose();
  });

  it('undoes Clear all, keeping what was captured since', () => {
    const { tray: t } = tray();
    t.add(shot('A'));
    t.add(shot('B'));
    t.clear();
    expect(t.undoLabel()).toBe('Removed 2 items');
    t.add(shot('New'));
    expect(
      t
        .undo()
        .map((i) => i.title)
        .sort(),
    ).toEqual(['A', 'B']);
    expect(
      t
        .all()
        .map((i) => i.title)
        .sort(),
    ).toEqual(['A', 'B', 'New']);
    t.dispose();
  });
});
