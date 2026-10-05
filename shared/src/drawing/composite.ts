import type { Anchors, Bounds, Shape } from '../annotations';
import { drawShapes } from './render';

/**
 * Draws shapes onto a screenshot. `area` is the part of the document (CSS pixels) the image
 * shows; the image may be at a higher resolution (device pixel ratio) or scaled down.
 * `anchors` places shapes drawn on scrolling sections (see `RenderOptions.anchors`).
 * Returns the PNG as base64.
 */
export async function compositeScreenshot(
  image: Uint8Array,
  mimeType: string,
  area: Bounds,
  shapes: Shape[],
  anchors?: Anchors,
): Promise<string> {
  const bitmap = await createImageBitmap(
    new Blob([image as Uint8Array<ArrayBuffer>], { type: mimeType }),
  );
  const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0);
  bitmap.close();
  if (shapes.length) {
    drawShapes(
      ctx,
      shapes,
      { scale: canvas.width / area.width, offsetX: area.x, offsetY: area.y },
      {
        // Redactions sample the screenshot itself.
        pixelSource: canvas,
        anchors,
      },
    );
  }
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  return toBase64(new Uint8Array(await blob.arrayBuffer()));
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}
