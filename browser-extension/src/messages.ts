// Messages between the extension's parts. Content ↔ background use `chrome.runtime` messaging;
// content ↔ page (MAIN world) use DOM events with JSON strings, so nothing depends on how each
// browser shares objects between worlds.
import type { CaptureToSave, Project } from '@inkspect/shared/hub';
import type { DeviceSettings, NetworkPreset } from '@inkspect/shared/devices';

export type BridgeState = 'connected' | 'connecting' | 'unpaired' | 'offline';

export interface BridgeStatus {
  state: BridgeState;
  /** VS Code window / workspace name when connected. */
  peer?: string;
  error?: string;
  /**
   * Projects and their saved captures can be reached: through the browser helper, or a VS Code
   * window that answers for them over the WebSocket link.
   */
  projects?: boolean;
  /**
   * What the answering side can do beyond the first version (the hub's `features`; VS Code over
   * the WebSocket link runs the same code, so all of them).
   */
  features?: string[];
  /** How VS Code is reached: the browser helper (native messaging, no pairing) or the WebSocket. */
  via?: 'hub' | 'ws';
}

/**
 * What the debugger emulates for the responsive view (Chrome): the device's user agent and touch,
 * network, CPU and media. The size comes from the centered frame, not from the debugger (its
 * device metrics always draw the page at the tab's top-left). Nothing set ends emulation.
 */
export interface EmulationRequest {
  /** The device's user agent and touch; undefined keeps the browser's own. */
  agent?: Pick<DeviceSettings, 'userAgent' | 'touch'>;
  network: NetworkPreset;
  cpu: number;
  colorScheme: 'default' | 'light' | 'dark';
  print: boolean;
}

export type { CaptureKind } from '@inkspect/shared/bridge';

export type ToBackground =
  | { type: 'capture' }
  | { type: 'download'; dataUrl: string; filename: string }
  | { type: 'bookmarkPage'; url: string; title: string }
  | { type: 'unbookmarkPage'; url: string }
  | { type: 'isBookmarked'; url: string }
  | { type: 'emulate'; request: EmulationRequest }
  /** Lets the page load in the responsive view's frame even if it forbids framing (this tab only). */
  | { type: 'allowFraming'; url: string }
  | { type: 'endFraming' }
  | { type: 'bridgeStatus' }
  /** The toolbar opened or closed: an open one comes back when the page reloads. */
  | { type: 'toolbarOpen'; open: boolean }
  | { type: 'openOptions' }
  /** Opens the side panel with the Saved list (answering the click that asked for it). */
  | { type: 'openSaved' }
  | { type: 'pair'; code: string }
  /**
   * The projects (from the browser helper, or VS Code over the link), and the one `url`'s
   * captures most likely go to.
   */
  | { type: 'projects'; url?: string }
  /** Saves captures into a project's `.inkspect/` (through the browser helper). */
  | {
      type: 'saveCapture';
      project: string;
      url?: string;
      captures: CaptureToSave[];
      /** Also send them: a target id, or 'default' for the project's default target. */
      send?: string;
    }
  /** Sends saved captures of a project (`open`: also show the agentmux thread). */
  | { type: 'sendSaved'; project: string; ids: string[]; target: string; open?: boolean }
  /** Moves saved captures to another project. */
  | { type: 'moveSaved'; project: string; to: string; ids: string[] };

export type BackgroundReply =
  | {
      ok: true;
      dataUrl?: string;
      path?: string;
      bookmarked?: boolean;
      status?: BridgeStatus;
      projects?: Project[];
      suggested?: string;
      ids?: string[];
      /** The agent a send went to. */
      sentTo?: string;
    }
  | { ok: false; error: string };

export type ToContent =
  /** Opens or closes the toolbar. `key`: pressed with the browser's shortcut (see content/index.tsx). */
  { type: 'toggle'; key?: string } | { type: 'bridgeStatus'; status: BridgeStatus };

/** To the extension's own pages: the toolbar's browser shortcut was pressed there. */
export interface ShortcutPressed {
  type: 'shortcutPressed';
  key: string;
}

/** Requests from the content script to its page's MAIN-world helper. */
export type PageRequest =
  { kind: 'collect'; maxHtml: number } | { kind: 'logs' } | { kind: 'clearLogs' };

export const PAGE_REQUEST_EVENT = 'inkspect:request';
export const PAGE_RESPONSE_EVENT = 'inkspect:response';
/** Attribute that marks the element a `collect` request is about. */
export const TARGET_ATTRIBUTE = 'data-inkspect-target';

/** Sends a message to the background and unwraps its reply. */
export async function toBackground(message: ToBackground): Promise<BackgroundReply> {
  try {
    const reply = (await chrome.runtime.sendMessage(message)) as BackgroundReply | undefined;
    return reply ?? { ok: false, error: 'No reply from the extension' };
  } catch (error) {
    return { ok: false, error: error instanceof Error ? error.message : String(error) };
  }
}
