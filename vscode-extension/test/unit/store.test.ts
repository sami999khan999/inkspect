import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  utimesSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { ITEM_ID } from '@inkspect/shared/hub';
import {
  emptyTrash,
  ensureStore,
  itemFile,
  newItemId,
  readItem,
  readItems,
  readItemText,
  removeItems,
  restoreItems,
  updateItem,
  writeItem,
} from '../../src/hub/store';

const temps: string[] = [];
function project(): string {
  const dir = mkdtempSync(join(tmpdir(), 'inkstore-'));
  temps.push(dir);
  return dir;
}
afterEach(() => {
  for (const dir of temps.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe('project store', () => {
  it('makes sortable ids', () => {
    const id = newItemId(Date.UTC(2026, 9, 2, 12, 16, 0));
    expect(id).toMatch(ITEM_ID);
    expect(id.startsWith('20261002-121600-')).toBe(true);
  });

  it('writes an item with its files and reads it back, newest first', () => {
    const root = project();
    const first = writeItem(root, {
      kind: 'screenshot',
      title: 'Screenshot',
      source: 'browser',
      browser: 'Brave',
      media: { bytes: new Uint8Array([1, 2, 3]), extension: 'png' },
      thumb: new Uint8Array([9]),
      time: 1_000,
    });
    const second = writeItem(root, {
      kind: 'element',
      title: '<button>',
      source: 'vscode',
      text: 'button.primary',
      time: 2_000,
    });
    expect(readItems(root).map((i) => i.id)).toEqual([second.id, first.id]);
    expect(readFileSync(itemFile(root, first, 'file')!)).toEqual(Buffer.from([1, 2, 3]));
    expect(itemFile(root, first, 'thumb')).toMatch(/thumb\.jpg$/);
    expect(readItemText(root, second)).toBe('button.primary\n');
    expect(second.preview).toBe('button.primary');
    // Never committed: the store ignores everything in it.
    expect(readFileSync(join(root, '.inkspect', '.gitignore'), 'utf8')).toContain('*');
  });

  it('replaces an item in place, keeping its id', () => {
    const root = project();
    const a = writeItem(root, { kind: 'errors', title: '1 error', source: 'vscode', text: 'a' });
    const b = writeItem(
      root,
      { kind: 'errors', title: '2 errors', source: 'vscode', text: 'a\nb' },
      a,
    );
    expect(b.id).toBe(a.id);
    expect(readItems(root)).toHaveLength(1);
    expect(readItemText(root, b)).toBe('a\nb\n');
  });

  it('updates metadata, and removes and restores items', () => {
    const root = project();
    const a = writeItem(root, { kind: 'text', title: 'A', source: 'vscode' });
    updateItem(root, a.id, (m) => ({ ...m, sentTo: ['Claude Code'] }));
    expect(readItem(root, a.id)?.sentTo).toEqual(['Claude Code']);
    expect(removeItems(root, [a.id, 'not-an-id'])).toEqual([a.id]);
    expect(readItems(root)).toEqual([]);
    expect(restoreItems(root, [a.id])).toEqual([a.id]);
    expect(readItems(root).map((i) => i.title)).toEqual(['A']);
    removeItems(root, [a.id]);
    emptyTrash(root, 0);
    expect(restoreItems(root, [a.id])).toEqual([]);
  });

  it("ignores what isn't a valid item, and never follows a file name out of its folder", () => {
    const root = project();
    const a = writeItem(root, { kind: 'text', title: 'A', source: 'vscode', text: 'x' });
    const dir = join(root, '.inkspect', 'items');
    mkdirSync(join(dir, 'junk'));
    mkdirSync(join(dir, '20260101-000000-abcdef'));
    writeFileSync(join(dir, '20260101-000000-abcdef', 'item.json'), '{"v":1}');
    expect(readItems(root).map((i) => i.id)).toEqual([a.id]);
    // An edited item.json: a path, or another item's id, is not followed.
    const edited = { ...a, files: { text: '../../../../etc/passwd' } };
    expect(itemFile(root, edited, 'text')).toBeUndefined();
    writeFileSync(join(dir, a.id, 'item.json'), JSON.stringify({ ...a, id: 'x' }));
    expect(readItem(root, a.id)).toBeUndefined();
  });

  it('refuses a store that is a symbolic link', () => {
    const root = project();
    const elsewhere = project();
    symlinkSync(elsewhere, join(root, '.inkspect'));
    expect(() => ensureStore(root)).toThrow(/symbolic link/);
    expect(readItems(root)).toEqual([]);
    expect(existsSync(join(elsewhere, 'items'))).toBe(false);
  });

  it('never empties a trash that links elsewhere (a cloned repository could plant one)', () => {
    const root = project();
    const victim = project();
    writeFileSync(join(victim, 'precious.txt'), 'keep');
    mkdirSync(join(victim, '20260101-000000-abcdef'));
    mkdirSync(join(root, '.inkspect'), { recursive: true });
    symlinkSync(victim, join(root, '.inkspect', '.trash'));
    emptyTrash(root, 0);
    expect(existsSync(join(victim, 'precious.txt'))).toBe(true);
    expect(existsSync(join(victim, '20260101-000000-abcdef'))).toBe(true);
    expect(removeItems(root, ['20260101-000000-abcdef'])).toEqual([]);
    expect(() => writeItem(root, { kind: 'text', title: 'x', source: 'vscode' })).toThrow(/link/);
  });

  it('keeps an old item in the trash for Undo (the trash counts from the removal)', () => {
    const root = project();
    const a = writeItem(root, { kind: 'text', title: 'A', source: 'vscode' });
    const old = new Date(Date.now() - 60_000);
    utimesSync(join(root, '.inkspect', 'items', a.id), old, old);
    removeItems(root, [a.id]);
    emptyTrash(root);
    expect(restoreItems(root, [a.id])).toEqual([a.id]);
  });
});
