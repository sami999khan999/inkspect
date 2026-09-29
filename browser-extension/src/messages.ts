// Messages between the extension's parts. Content ↔ background use `chrome.runtime` messaging;
// content ↔ page (MAIN world) use DOM events with JSON strings, so nothing depends on how each
// browser shares objects between worlds.
import type { CaptureKind, SendTarget, VsCodeWindow } from '@inkspect/shared/bridge';
import type { DeviceSettings, NetworkPreset } from '@inkspect/shared/devices';

export type BridgeState = 'connected' | 'connecting' | 'unpaired' | 'offline';

export interface BridgeStatus {
  state: BridgeState;
  /** VS Code window / workspace name when connected. */
  peer?: string;
  error?: string;
  /** The open VS Code windows a send can go to, when connected. */
  windows?: VsCodeWindow[];
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

export type { CaptureKind, SendTarget } from '@inkspect/shared/bridge';

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
  | {
      type: 'send';
      target: SendTarget;
      /** Text for chat, or the prompt that goes with an image. */
      text?: string;
      /** PNG data URL (screenshots). */
      image?: string;
      label?: string;
      pageUrl?: string;
      /** The VS Code window to send to; the one used last if unset. */
      window?: string;
      /** The capture it comes from (sends of one capture share one Agent Context item). */
      capture?: string;
      kind?: CaptureKind;
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
