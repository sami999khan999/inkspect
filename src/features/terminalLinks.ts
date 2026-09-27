import * as vscode from 'vscode';

/** Local development server URLs, e.g. `http://localhost:5173/` or `https://127.0.0.1:8443/app`. */
const LOCAL_URL =
  /\bhttps?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\]|[\w-]+\.localhost)(?::\d{1,5})?(?:\/[^\s'"`<>)\]]*)?/g;

export interface LocalUrlMatch {
  index: number;
  /** Length of the matched text in the line. */
  length: number;
  /** URL to open. */
  url: string;
}

interface LocalUrlLink extends vscode.TerminalLink {
  url: string;
}

/** Finds local server URLs in a line of terminal output. */
export function findLocalUrls(line: string): LocalUrlMatch[] {
  return [...line.matchAll(LOCAL_URL)].map((match) => {
    // Trailing punctuation is usually sentence punctuation, not part of the URL.
    const text = match[0].replace(/[.,;:!?]+$/, '');
    // 0.0.0.0 means "all interfaces" for a server; browse it through localhost.
    return {
      index: match.index,
      length: text.length,
      url: text.replace('//0.0.0.0', '//localhost'),
    };
  });
}

/** Makes local server URLs in the terminal open in the VS Code browser. */
export function registerTerminalLinks(
  isEnabled: () => boolean,
  open: (url: string) => void,
): vscode.Disposable {
  const provider: vscode.TerminalLinkProvider<LocalUrlLink> = {
    provideTerminalLinks(context) {
      if (!isEnabled()) return [];
      return findLocalUrls(context.line).map(({ index, length, url }) => ({
        startIndex: index,
        length,
        tooltip: 'Open in VS Code Browser',
        url,
      }));
    },
    handleTerminalLink(link) {
      open(link.url);
    },
  };
  return vscode.window.registerTerminalLinkProvider(provider);
}
