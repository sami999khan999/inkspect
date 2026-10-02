// How a send is put into an agent's input, whatever carries it (a VS Code terminal, a tmux pane):
// each file's path and the text, each pasted separately, never followed by Enter. Pure, so the
// VS Code extension and the hub share it and it can be unit-tested.

/** Longer text is pasted as the path of a file holding it. */
export const MAX_PASTE = 20_000;

/** A path as a shell argument: quoted when it has spaces or quotes. */
export function shellPath(path: string): string {
  return /[\s'"&()]/.test(path) ? `"${path.replace(/"/g, '\\"')}"` : path;
}

/** Text typed straight into a terminal must be short and on one line; longer text goes in a file. */
export function fitsTerminal(text: string): boolean {
  return !/[\r\n]/.test(text.trim()) && text.length <= 300;
}

/**
 * Whether `text` can go into the agent's input as it is: up to `MAX_PASTE` characters for an
 * agent that takes pastes, one short line for anything else. Otherwise it goes in a file.
 */
export function fitsInline(text: string, acceptsPaste: boolean): boolean {
  return acceptsPaste ? text.length <= MAX_PASTE : fitsTerminal(text);
}

const PASTE_START = '\x1b[200~';
const PASTE_END = '\x1b[201~';

/** Text wrapped as a terminal paste; the end marker is removed from the text so it can't end it early. */
export function bracketedPaste(text: string): string {
  return `${PASTE_START}${pasteText(text)}${PASTE_END}`;
}

/**
 * Text for a paste whose markers someone else adds (tmux `paste-buffer -p`): without paste
 * markers, with Unix line ends.
 */
export function pasteText(text: string): string {
  return text.split(PASTE_START).join('').split(PASTE_END).join('').replace(/\r\n?/g, '\n');
}

/**
 * Parts typed on one line into a terminal that may be a plain shell: newlines become spaces and
 * other control characters are dropped, so page text can't run a command or a readline binding.
 */
export function typedLine(parts: readonly string[]): string {
  return (
    parts
      .join(' ')
      .replace(/[\r\n]+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f]/g, '')
  );
}
