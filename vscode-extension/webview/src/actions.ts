// What each shortcut does in the webview (see SHORTCUT_ACTIONS in @shared/shortcuts). App builds
// the handlers from its state on every render; the dispatcher calls them.
import { COLORS, type DrawTool, type ShapeStyle } from '@shared/annotations';
import {
  DEVICE_PRESETS,
  NETWORK_CONDITIONS,
  presetToDevice,
  responsiveDevice,
  rotate,
  SCALE_OPTIONS,
  type DevicePreset,
  type EmulationSettings,
  type NetworkPreset,
} from '@shared/devices';
import type { TabState } from '@shared/protocol';
import type { ShortcutScope } from '@shared/shortcuts';
import { CAPTURE_ACTIONS, DRAW_TOOLS, type CaptureMode } from './drawing/DrawToolbar';
import type { ShortcutHandlers } from './shortcuts';
import { postToHost } from './vscode';

/** Drawing tools with a shortcut (`draw.<tool>`): the shared toolbar's list. */
export { DRAW_TOOLS };

export type DevCommand = 'console' | 'network' | 'filter';

export interface ActionContext {
  tab: TabState | undefined;
  customDevices: DevicePreset[];
  pageArea: { width: number; height: number };
  /** Toggles a mode (the mode.* actions); `screenshot` opens the screenshot chooser. */
  toggleMode: (mode: ShortcutScope) => void;
  exitMode: () => void;
  showHelp: () => void;
  openQuickActions: () => void;
  // Drawing.
  setDrawTool: (tool: DrawTool) => void;
  drawStyle: ShapeStyle;
  setDrawStyle: (changes: Partial<ShapeStyle>) => void;
  undo: () => void;
  redo: () => void;
  clearDrawing: () => void;
  toggleDrawingVisible: () => void;
  captureDrawing: (toAgent: boolean) => void;
  /** One of the Screenshot menu's captures. */
  captureDrawingAs: (mode: CaptureMode) => void;
  /** Opens the drawing toolbar's Screenshot menu. */
  openCaptureMenu: () => void;
  // Screenshot chooser.
  screenshotRegion: () => void;
  screenshotElement: () => void;
  // Console and network drawer.
  devCommand: (command: DevCommand) => void;
  closeDev: () => void;
}

/** Handlers for the webview's own actions (the rest run their VS Code command). */
export function buildHandlers(ctx: ActionContext): ShortcutHandlers {
  const { tab } = ctx;
  const handlers: ShortcutHandlers = {
    'open.quickActions': ctx.openQuickActions,
    'open.cheatSheet': ctx.showHelp,
    'open.bookmarksBar': () => postToHost({ type: 'toggleBookmarksBar' }),
  };
  for (const mode of [
    'inspect',
    'draw',
    'screenshot',
    'devtools',
    'device',
    'measure',
    'eyedropper',
    'overlay',
    'tweak',
    'record',
    'a11y',
  ] as const) {
    handlers[`mode.${mode}`] = () => ctx.toggleMode(mode);
  }
  for (const scope of ['inspect', 'draw', 'measure', 'eyedropper', 'a11y'] as const) {
    handlers[`${scope}.help`] = ctx.showHelp;
    handlers[`${scope}.exit`] = ctx.exitMode;
  }
  // CSS tweak has no help key; leaving it reverts the page.
  handlers['tweak.exit'] = ctx.exitMode;

  // Element picker.
  const inspect = (action: 'parent' | 'child' | 'copySelection' | 'screenshot' | 'agent') => () =>
    tab && postToHost({ type: 'inspect', tabId: tab.id, action });
  handlers['inspect.parent'] = inspect('parent');
  handlers['inspect.child'] = inspect('child');
  handlers['inspect.copy'] = inspect('copySelection');
  handlers['inspect.screenshot'] = inspect('screenshot');
  handlers['inspect.agent'] = inspect('agent');

  // Drawing.
  for (const tool of DRAW_TOOLS) handlers[`draw.${tool}`] = () => ctx.setDrawTool(tool);
  COLORS.slice(0, 9).forEach((color, index) => {
    handlers[`draw.color${index + 1}`] = () => ctx.setDrawStyle({ color });
  });
  handlers['draw.thinner'] = () =>
    ctx.setDrawStyle({
      width: Math.max(1, ctx.drawStyle.width - (ctx.drawStyle.width > 6 ? 2 : 1)),
    });
  handlers['draw.thicker'] = () =>
    ctx.setDrawStyle({
      width: Math.min(24, ctx.drawStyle.width + (ctx.drawStyle.width >= 6 ? 2 : 1)),
    });
  handlers['draw.fill'] = () => ctx.setDrawStyle({ fill: !ctx.drawStyle.fill });
  handlers['draw.undo'] = ctx.undo;
  handlers['draw.redo'] = ctx.redo;
  handlers['draw.clear'] = ctx.clearDrawing;
  handlers['draw.visible'] = ctx.toggleDrawingVisible;
  handlers['draw.capture'] = () => ctx.captureDrawing(false);
  handlers['draw.captureAgent'] = () => ctx.captureDrawing(true);
  handlers['draw.captureMenu'] = ctx.openCaptureMenu;
  for (const [mode, id] of Object.entries(CAPTURE_ACTIONS) as [CaptureMode, string][]) {
    if (mode !== 'area') handlers[id] = () => ctx.captureDrawingAs(mode);
  }

  // Screenshot chooser.
  const shot = (mode: 'viewport' | 'fullPage') => () => {
    ctx.exitMode();
    if (tab) postToHost({ type: 'screenshot', tabId: tab.id, mode });
  };
  handlers['shot.viewport'] = shot('viewport');
  handlers['shot.fullPage'] = shot('fullPage');
  handlers['shot.region'] = ctx.screenshotRegion;
  handlers['shot.element'] = ctx.screenshotElement;
  handlers['shot.drawing'] = () => {
    ctx.exitMode();
    ctx.captureDrawing(false);
  };

  // Console and network.
  const dev =
    (action: 'clear' | 'copyErrors' | 'copyFailedRequests' | 'copyContext', chat = false) =>
    () =>
      tab && postToHost({ type: 'devAction', tabId: tab.id, action, chat });
  handlers['dev.console'] = () => ctx.devCommand('console');
  handlers['dev.network'] = () => ctx.devCommand('network');
  handlers['dev.filter'] = () => ctx.devCommand('filter');
  handlers['dev.copyErrors'] = dev('copyErrors');
  handlers['dev.copyFailed'] = dev('copyFailedRequests');
  handlers['dev.copyContext'] = dev('copyContext');
  handlers['dev.contextAgent'] = dev('copyContext', true);
  handlers['dev.clear'] = dev('clear');
  handlers['dev.close'] = ctx.closeDev;

  // Device.
  if (tab) Object.assign(handlers, deviceHandlers(tab, ctx));
  return handlers;
}

function deviceHandlers(tab: TabState, ctx: ActionContext): ShortcutHandlers {
  const emulation = tab.emulation;
  const update = (changes: Partial<EmulationSettings>) =>
    postToHost({
      type: 'emulation',
      tabId: tab.id,
      settings: { ...emulation, enabled: true, ...changes },
    });
  const presets = [...DEVICE_PRESETS, ...ctx.customDevices];
  const step = (delta: number) => () => {
    const index = presets.findIndex((p) => p.id === emulation.device?.presetId);
    const next = presets[(index + delta + presets.length) % presets.length];
    if (next) update({ device: presetToDevice(next) });
  };
  const cycle = <T>(values: readonly T[], current: T) =>
    values[(values.indexOf(current) + 1) % values.length]!;
  const scales = SCALE_OPTIONS.filter((s): s is Exclude<typeof s, 'fit'> => s !== 'fit');
  const zoom = (delta: number) => () => {
    const current = emulation.scale === 'fit' ? 1 : emulation.scale;
    const index = scales.findIndex((s) => s >= current);
    const next =
      scales[
        Math.max(0, Math.min(scales.length - 1, (index < 0 ? scales.length - 1 : index) + delta))
      ];
    if (next !== undefined) update({ scale: next });
  };
  return {
    'device.previous': step(-1),
    'device.next': step(1),
    'device.rotate': () =>
      update({ device: rotate(emulation.device ?? responsiveDevice(ctx.pageArea)) }),
    'device.touch': () => {
      const device = emulation.device ?? responsiveDevice(ctx.pageArea);
      update({ device: { ...device, touch: !device.touch, mobile: !device.touch } });
    },
    'device.fit': () => update({ scale: 'fit' }),
    'device.zoomIn': zoom(1),
    'device.zoomOut': zoom(-1),
    'device.network': () =>
      update({
        network: cycle(Object.keys(NETWORK_CONDITIONS) as NetworkPreset[], emulation.network),
      }),
    'device.theme': () =>
      update({ colorScheme: cycle(['default', 'light', 'dark'] as const, emulation.colorScheme) }),
    'device.close': () => update({ enabled: false }),
  };
}
