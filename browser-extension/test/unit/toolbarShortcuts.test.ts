import { describe, expect, it } from 'vitest';
import { SHORTCUT_ACTIONS, TOOLBAR_ACTION_IDS } from '@inkspect/shared/shortcuts';
import { DRAW_TOOLS } from '@inkspect/shared/ui/DrawToolbar';

describe('the toolbar actions (tagged BR)', () => {
  it('are all real actions', () => {
    const ids = new Set(SHORTCUT_ACTIONS.map((a) => a.id));
    expect([...TOOLBAR_ACTION_IDS].filter((id) => !ids.has(id))).toEqual([]);
  });

  it('include every drawing tool (each has a key: pencil is I)', () => {
    const tools = DRAW_TOOLS.map((tool) => `draw.${tool}`);
    expect(tools.filter((id) => !TOOLBAR_ACTION_IDS.has(id))).toEqual([]);
  });
});

describe('drawing tool keys', () => {
  it('every tool has an action with a default key', () => {
    const missing = DRAW_TOOLS.filter(
      (tool) => !SHORTCUT_ACTIONS.find((a) => a.id === `draw.${tool}`)?.keys.length,
    );
    expect(missing).toEqual([]);
  });
});
