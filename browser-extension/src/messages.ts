// Messages between the extension's parts. Content ↔ background use `chrome.runtime` messaging;
// content ↔ page (MAIN world) use DOM events with JSON strings, so nothing depends on how each
// browser shares objects between worlds.
import type { DeviceSettings, NetworkPreset } from '@inkspect/shared/devices';

export type BridgeState = 'connected' | 'connecting' | 'unpaired' | 'offline';

export interface BridgeStatus {
  state: BridgeState;
  /** VS Code window / workspace name when connected. */
  peer?: string;
  error?: string;
}

/** Full emulation through the debugger (Chrome). `device` undefined ends emulation. */
export interface EmulationRequest {
  device?: DeviceSettings;
  network: NetworkPreset;
  cpu: number;
  colorScheme: 'default' | 'light' | 'dark';
  print: boolean;
}

export type SendTarget = 'chat' | 'terminal' | 'save';

export type ToBackground =
  | { type: 'capture' }
  | { type: 'download'; dataUrl: string; filename: string }
  | { type: 'bookmarkPage'; url: string; title: string }
  | { type: 'emulate'; request: EmulationRequest }
  | { type: 'windowMode'; width: number; height: number }
  | { type: 'restoreWindow' }
  | { type: 'bridgeStatus' }
  | {
      type: 'send';
      target: SendTarget;
      /** Text for chat, or the prompt that goes with an image. */
      text?: string;
      /** PNG data URL (screenshots). */
      image?: string;
      label?: string;
      pageUrl?: string;
    }
  | { type: 'openOptions' }
  | { type: 'pair'; code: string };

export type BackgroundReply =
  | { ok: true; dataUrl?: string; path?: string; bookmarked?: boolean; status?: BridgeStatus }
  | { ok: false; error: string };

export type ToContent = { type: 'toggle' } | { type: 'bridgeStatus'; status: BridgeStatus };

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
