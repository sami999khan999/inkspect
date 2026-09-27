// Helpers for the content script: talking to the MAIN-world helper, clipboard, settings.
import type { CopyFormat, DetailField } from '@inkspect/shared/elementInfo';
import { ALL_FIELDS } from '@inkspect/shared/elementInfo';
import { PAGE_REQUEST_EVENT, PAGE_RESPONSE_EVENT, type PageRequest } from '../messages';

/** Sends a request to the page-world helper; undefined if it doesn't answer in time. */
export function pageRequest<T>(request: PageRequest, timeoutMs = 2000): Promise<T | undefined> {
  const id = crypto.randomUUID();
  return new Promise((resolve) => {
    const onResponse = (event: Event) => {
      let data: { id?: string; result?: T };
      try {
        data = JSON.parse((event as CustomEvent<string>).detail) as { id?: string; result?: T };
      } catch {
        return;
      }
      if (data.id !== id) return;
      window.removeEventListener(PAGE_RESPONSE_EVENT, onResponse);
      clearTimeout(timer);
      resolve(data.result);
    };
    const timer = setTimeout(() => {
      window.removeEventListener(PAGE_RESPONSE_EVENT, onResponse);
      resolve(undefined);
    }, timeoutMs);
    window.addEventListener(PAGE_RESPONSE_EVENT, onResponse);
    window.dispatchEvent(
      new CustomEvent(PAGE_REQUEST_EVENT, { detail: JSON.stringify({ id, request }) }),
    );
  });
}

/** Copies text; falls back to a hidden textarea where the async clipboard is unavailable. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.documentElement.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

/** Copies a PNG (only works on secure pages: https, localhost, file). */
export async function copyImage(dataUrl: string): Promise<boolean> {
  try {
    const blob = await (await fetch(dataUrl)).blob();
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
    return true;
  } catch {
    return false;
  }
}

export interface Settings {
  copyFormat: CopyFormat;
  fields: DetailField[];
  maxHtml: number;
  /** Padding around drawings for "screenshot drawing area", in CSS pixels. */
  annotationPadding: number;
}

export const DEFAULT_SETTINGS: Settings = {
  copyFormat: 'markdown',
  fields: [...ALL_FIELDS],
  maxHtml: 2000,
  annotationPadding: 40,
};

export async function loadSettings(): Promise<Settings> {
  const stored = (await chrome.storage.sync.get('settings').catch(() => ({}))) as {
    settings?: Partial<Settings>;
  };
  return { ...DEFAULT_SETTINGS, ...stored.settings };
}

/** `screenshot-2026-09-27_14-03-12-example.com.png` (same names as the VS Code extension). */
export function screenshotName(now = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const site = (location.hostname || 'page').replace(/[^a-z0-9.-]+/gi, '-').slice(0, 40);
  return `screenshot-${stamp}-${site}.png`;
}
