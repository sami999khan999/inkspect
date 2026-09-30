import { describe, expect, it } from 'vitest';
import { ContextTray } from '../../src/agent/contextTray';

const shot = (title: string, group?: string) => ({
  kind: 'screenshot' as const,
  title,
  file: `/shots/${title}.png`,
  group,
});

describe('Agent Context groups', () => {
  it('keeps a group together, in capture order, and in its place when sent again', () => {
    const tray = new ContextTray('/storage');
    tray.add(shot('Drawing 1 of 2', 'g'));
    tray.add({ kind: 'text', title: 'Other' });
    tray.add({ ...shot('Drawing 2 of 2', 'g'), key: 'k' });
    expect(tray.inGroup('g').map((i) => i.title)).toEqual(['Drawing 1 of 2', 'Drawing 2 of 2']);
    // The same capture again (same key, no group given) stays in its group.
    tray.add({ ...shot('Drawing 2 of 2'), key: 'k' });
    expect(tray.inGroup('g')).toHaveLength(2);
  });

  it('groups items by hand and ungroups them', () => {
    const tray = new ContextTray('/storage');
    const a = tray.add(shot('A'));
    tray.add({ kind: 'text', title: 'Between' });
    const b = tray.add(shot('B'));
    expect(tray.group([a.id])).toBeUndefined();
    const group = tray.group([a.id, b.id])!;
    expect(
      tray
        .inGroup(group)
        .map((i) => i.title)
        .sort(),
    ).toEqual(['A', 'B']);
    // Together in the list (newest first), where the newest of them was.
    expect(tray.all().map((i) => i.title)).toEqual(['B', 'A', 'Between']);
    tray.ungroup(group);
    expect(tray.inGroup(group)).toEqual([]);
  });

  it('drops a group whole when the list is full, never half of it', () => {
    const tray = new ContextTray('/storage');
    tray.add(shot('Old 1', 'old'));
    tray.add(shot('Old 2', 'old'));
    for (let i = 0; i < 59; i++) tray.add({ kind: 'text', title: `T${i}` });
    // 61 items: one of the group is past the limit, so both go.
    expect(tray.inGroup('old')).toEqual([]);
    expect(tray.all()).toHaveLength(59);
  });

  it('undoes a removal, putting items back where they were', () => {
    const tray = new ContextTray('/storage');
    tray.add(shot('A'));
    const b = tray.add(shot('B'));
    tray.add(shot('C'));
    expect(tray.undoLabel()).toBeUndefined();
    tray.remove(b.id);
    expect(tray.undoLabel()).toBe('Removed "B"');
    tray.undo();
    expect(tray.all().map((i) => i.title)).toEqual(['C', 'B', 'A']);
    expect(tray.undoLabel()).toBeUndefined();
  });

  it('undoes Clear all, with what was captured since on top', () => {
    const tray = new ContextTray('/storage');
    tray.add(shot('A'));
    tray.add(shot('B'));
    tray.clear();
    expect(tray.undoLabel()).toBe('Removed 2 items');
    tray.add(shot('New'));
    expect(
      tray
        .undo()
        .map((i) => i.title)
        .sort(),
    ).toEqual(['A', 'B']);
    expect(tray.all().map((i) => i.title)).toEqual(['New', 'B', 'A']);
    tray.dispose();
  });
});
