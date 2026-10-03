import { describe, expect, it } from 'vitest';
import type { ItemMeta, Project } from '../src/hub';
import {
  groupTitle,
  idsOf,
  projectDetail,
  rowsOf,
  savedViewOf,
  type SavedItemView,
} from '../src/saved';

const item = (over: Partial<SavedItemView>): SavedItemView => ({
  id: 'x',
  kind: 'screenshot',
  title: 'Screenshot',
  image: true,
  time: 0,
  sentTo: [],
  ...over,
});

describe('the Saved list', () => {
  it('shows a group once, where its newest item is, its members in capture order', () => {
    const rows = rowsOf([
      item({ id: 'c', time: 30 }),
      item({ id: 'b2', time: 20, group: 'g', groupIndex: 1, title: 'Drawing 2 of 2' }),
      item({ id: 'b1', time: 20, group: 'g', groupIndex: 0, title: 'Drawing 1 of 2' }),
      item({ id: 'a', time: 10, group: 'lonely' }),
    ]);
    expect(rows.map((r) => r.key)).toEqual(['c', 'group:g', 'a']);
    expect(idsOf(rows[1]!)).toEqual(['b1', 'b2']);
    expect(groupTitle(rows[1]!.kind === 'group' ? rows[1]!.items : [])).toBe('Drawing');
    expect(groupTitle([item({ kind: 'element' }), item({ kind: 'element' })])).toBe('Elements');
  });

  it('shows a store item, and where it came from', () => {
    const meta: ItemMeta = {
      v: 1,
      id: 'i',
      kind: 'element',
      title: 'Element h2',
      time: 5,
      source: 'browser',
      browser: 'Chrome',
      files: { text: 'context.md' },
      sentTo: ['Claude Code'],
    };
    expect(savedViewOf(meta)).toMatchObject({
      image: false,
      source: 'Chrome',
      sentTo: ['Claude Code'],
    });
    expect(savedViewOf({ ...meta, kind: 'screenshot', files: { file: 'capture.png' } }).image).toBe(
      true,
    );
    expect(savedViewOf({ ...meta, source: 'vscode' }).source).toBe('VS Code');
  });

  it('says what a project is', () => {
    const project: Project = {
      path: '/p',
      name: 'p',
      vscode: true,
      agentmux: true,
      saved: true,
      pinned: false,
    };
    expect(projectDetail(project)).toBe('VS Code · agentmux');
    expect(projectDetail({ ...project, vscode: false, agentmux: false, pinned: true })).toBe(
      'saved · pinned',
    );
    expect(projectDetail({ ...project, inbox: true })).toBe('captures without a project');
  });
});
