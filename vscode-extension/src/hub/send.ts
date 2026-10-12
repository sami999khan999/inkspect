// Putting saved items into an agent's input in a tmux pane: each file's path and the text, each
// as a bracketed paste, never followed by Enter, without touching focus. Node only.
import { randomBytes } from 'node:crypto';
import type { ItemMeta } from '@inkspect/shared/hub';
import { fitsInline, pasteText, shellPath } from '../agent/sendParts';
import { itemFile, readItemText } from './store';
import { tmux, TMUX_PANE } from './tmux';

/**
 * What a send of these items pastes: the prompt written with it, every image or recording path,
 * then their text in one paste (or, when it is too long for the agent, the paths of the files
 * holding it). A terminal that isn't a known agent (`acceptsPaste: false`) only gets short
 * one-line text.
 */
export function partsOf(
  project: string,
  items: readonly ItemMeta[],
  { acceptsPaste = true, prompt }: { acceptsPaste?: boolean; prompt?: string } = {},
): string[] {
  const parts: string[] = [];
  const asked = prompt?.trim();
  if (asked && fitsInline(asked, acceptsPaste)) parts.push(asked);
  const texts: { text: string; file: string }[] = [];
  for (const item of items) {
    const file = itemFile(project, item, 'file');
    if (file) parts.push(shellPath(file));
    const text = readItemText(project, item)?.trim();
    const textFile = itemFile(project, item, 'text');
    if (text && textFile) texts.push({ text, file: textFile });
  }
  const joined = texts.map((t) => t.text).join('\n\n');
  if (joined && fitsInline(joined, acceptsPaste)) parts.push(joined);
  else for (const t of texts) parts.push(shellPath(t.file));
  return parts;
}

/**
 * Pastes each part into a tmux pane, as the user's own paste would arrive (tmux wraps it in
 * bracketed-paste markers when the program asked for them, so newlines don't submit), with a
 * space after each. Enter is never sent.
 */
export async function pasteIntoPane(
  socket: string,
  pane: string,
  parts: readonly string[],
): Promise<void> {
  if (!TMUX_PANE.test(pane)) throw new Error(`Bad tmux pane: ${pane}`);
  for (const part of parts) {
    const buffer = `inkspect-${randomBytes(4).toString('hex')}`;
    await tmux(socket, ['load-buffer', '-b', buffer, '-'], pasteText(part));
    await tmux(socket, ['paste-buffer', '-p', '-d', '-b', buffer, '-t', pane]);
    await tmux(socket, ['send-keys', '-t', pane, '-l', ' ']);
  }
}
