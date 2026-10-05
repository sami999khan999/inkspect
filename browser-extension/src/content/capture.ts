// Screenshots from the content script: the background captures the visible tab; this file
// hides the toolbar, crops, and scrolls and stitches for areas taller than the viewport.
import type { Bounds } from '@inkspect/shared/annotations';
import { toBackground } from '../messages';

/** Hides the toolbar while capturing; returns a function that shows it again. */
export type HideUi = () => () => void;

const frames = (n = 2) =>
  new Promise<void>((resolve) => {
    const step = (left: number) =>
      left ? requestAnimationFrame(() => step(left - 1)) : setTimeout(resolve, 30);
    step(n);
  });

async function loadImage(dataUrl: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = dataUrl;
  await image.decode();
  return image;
}

/** The visible viewport as an image, without the toolbar. */
export async function captureVisible(hide: HideUi): Promise<HTMLImageElement> {
  const show = hide();
  await frames();
  try {
    const reply = await toBackground({ type: 'capture' });
    if (!reply.ok || !reply.dataUrl) throw new Error(reply.ok ? 'No image' : reply.error);
    return await loadImage(reply.dataUrl);
  } finally {
    show();
  }
}

/** Hides fixed and sticky elements (headers repeat in every tile otherwise). */
function hideFixed(): () => void {
  const hidden: [HTMLElement, string][] = [];
  for (const el of document.querySelectorAll<HTMLElement>('body *')) {
    const position = getComputedStyle(el).position;
    if (position === 'fixed' || position === 'sticky') {
      hidden.push([el, el.style.getPropertyValue('visibility')]);
      el.style.setProperty('visibility', 'hidden', 'important');
    }
  }
  return () => {
    for (const [el, value] of hidden) {
      if (value) el.style.setProperty('visibility', value);
      else el.style.removeProperty('visibility');
    }
  };
}

/** Browsers cap canvas size; scale the result down to fit. */
function fitScale(width: number, height: number): number {
  return Math.min(1, 32_000 / height, 32_000 / width, Math.sqrt(250_000_000 / (width * height)));
}

/**
 * Captures part of the document (CSS pixels, document coordinates). Areas inside the viewport
 * take one capture; taller ones scroll and stitch. Returns a PNG data URL and the area it shows.
 */
export async function captureArea(
  area: Bounds,
  hide: HideUi,
): Promise<{ dataUrl: string; area: Bounds }> {
  const doc = document.documentElement;
  const pageWidth = Math.max(doc.scrollWidth, innerWidth);
  const pageHeight = Math.max(doc.scrollHeight, innerHeight);
  const x = Math.max(0, Math.floor(area.x));
  const y = Math.max(0, Math.floor(area.y));
  const clipped: Bounds = {
    x,
    y,
    width: Math.max(1, Math.min(Math.ceil(area.width + area.x - x), pageWidth - x)),
    height: Math.max(1, Math.min(Math.ceil(area.height + area.y - y), pageHeight - y)),
  };
  const start = { x: scrollX, y: scrollY };
  const visible =
    clipped.x >= scrollX &&
    clipped.y >= scrollY &&
    clipped.x + clipped.width <= scrollX + doc.clientWidth &&
    clipped.y + clipped.height <= scrollY + doc.clientHeight;
  const dpr = devicePixelRatio;
  const scale = fitScale(clipped.width * dpr, clipped.height * dpr);
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(clipped.width * dpr * scale);
  canvas.height = Math.round(clipped.height * dpr * scale);
  const ctx = canvas.getContext('2d')!;
  const draw = (image: HTMLImageElement, viewX: number, viewY: number) => {
    // The capture's pixels per CSS pixel (captures include the scrollbar area).
    const ratio = image.width / innerWidth;
    const sx = (clipped.x - viewX) * ratio;
    const sy = Math.max(0, clipped.y - viewY) * ratio;
    const destY = Math.max(0, viewY - clipped.y);
    const rows = Math.min(
      clipped.height - destY,
      doc.clientHeight - Math.max(0, clipped.y - viewY),
    );
    if (rows <= 0) return;
    ctx.drawImage(
      image,
      sx,
      sy,
      clipped.width * ratio,
      rows * ratio,
      0,
      destY * dpr * scale,
      canvas.width,
      rows * dpr * scale,
    );
  };
  if (visible) {
    draw(await captureVisible(hide), scrollX, scrollY);
    return { dataUrl: canvas.toDataURL('image/png'), area: clipped };
  }
  let restoreFixed: (() => void) | undefined;
  try {
    // Horizontal: keep the area's left edge in view (areas wider than the viewport are cut).
    const left = Math.min(clipped.x, Math.max(0, pageWidth - doc.clientWidth));
    for (let top = clipped.y; top < clipped.y + clipped.height;) {
      scrollTo(left, top);
      await frames();
      draw(await captureVisible(hide), scrollX, scrollY);
      // The page may clamp the scroll position at the bottom.
      const covered = scrollY + doc.clientHeight;
      if (covered >= clipped.y + clipped.height || covered >= pageHeight) break;
      top = covered;
      restoreFixed ??= hideFixed();
    }
  } finally {
    restoreFixed?.();
    scrollTo(start.x, start.y);
  }
  return { dataUrl: canvas.toDataURL('image/png'), area: clipped };
}

/** What the user sees of the page (the toolbar floats over it, and is hidden while capturing). */
export function viewportArea(): Bounds {
  const doc = document.documentElement;
  return { x: scrollX, y: scrollY, width: doc.clientWidth, height: doc.clientHeight };
}

/** The whole page. */
export function fullPageArea(): Bounds {
  const doc = document.documentElement;
  return { x: 0, y: 0, width: doc.clientWidth, height: Math.max(doc.scrollHeight, innerHeight) };
}

/**
 * The responsive view's screen, as shown (scaled like on screen). Nothing of ours covers the
 * frame, so nothing is hidden.
 */
export async function captureElementRect(el: Element): Promise<string> {
  const rect = el.getBoundingClientRect();
  const image = await captureVisible(() => () => {});
  const ratio = image.width / innerWidth;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  canvas
    .getContext('2d')!
    .drawImage(
      image,
      rect.x * ratio,
      rect.y * ratio,
      rect.width * ratio,
      rect.height * ratio,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  return canvas.toDataURL('image/png');
}

/** A screenshot's small JPEG for lists, as base64 (made off the page, so its CSP can't stop it). */
export async function thumbnailOf(dataUrl: string, size = 480): Promise<string | undefined> {
  try {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
    const canvas = new OffscreenCanvas(
      Math.max(1, Math.round(bitmap.width * scale)),
      Math.max(1, Math.round(bitmap.height * scale)),
    );
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.75 });
    const buffer = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let i = 0; i < buffer.length; i += 0x8000) {
      binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  } catch {
    return undefined;
  }
}
