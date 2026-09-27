import * as vscode from 'vscode';
import { writeImageToClipboard } from './imageClipboard';

/**
 * Every clipboard write goes through one queue. Image copies run in a helper process and take a
 * moment, so without ordering an image could land after (and overwrite) text copied later.
 */
let queue: Promise<unknown> = Promise.resolve();

function enqueue<T>(write: () => Thenable<T> | Promise<T>): Promise<T> {
  const result = queue.then(write, write);
  queue = result.catch(() => {});
  return result;
}

export function copyText(text: string): Promise<void> {
  return enqueue(() => vscode.env.clipboard.writeText(text));
}

export function copyImageBytes(bytes: Uint8Array, mimeType: string): Promise<void> {
  return enqueue(() => writeImageToClipboard(bytes, mimeType));
}
