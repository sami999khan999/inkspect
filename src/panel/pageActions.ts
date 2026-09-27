import { basename, join } from 'node:path';
import * as vscode from 'vscode';
import type { TabSession } from '../browser/TabSession';
import { sanitizeFilename } from '../features/downloads';

/** VS Code language id for a document MIME type (used by "View page source"). */
export function languageForMime(mimeType: string): string {
  const mime = mimeType.toLowerCase();
  if (mime.includes('html')) return 'html';
  if (mime.includes('json')) return 'json';
  if (mime.includes('javascript') || mime.includes('ecmascript')) return 'javascript';
  if (mime.includes('css')) return 'css';
  if (mime.includes('svg') || mime.includes('xml')) return 'xml';
  if (mime.includes('markdown')) return 'markdown';
  return 'plaintext';
}

/** Guesses an image MIME type from the first bytes of the file. */
export function sniffImageType(bytes: Uint8Array): string {
  const head = Buffer.from(bytes.subarray(0, 64));
  if (head.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return 'image/png';
  }
  if (head[0] === 0xff && head[1] === 0xd8) return 'image/jpeg';
  if (head.subarray(0, 4).toString('latin1') === 'GIF8') return 'image/gif';
  if (
    head.subarray(0, 4).toString('latin1') === 'RIFF' &&
    head.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp';
  }
  if (/^\s*(<\?xml|<svg)/i.test(head.toString('utf8'))) return 'image/svg+xml';
  return 'application/octet-stream';
}

/** A file name for a URL's last path segment, e.g. `https://x.dev/a/logo.png?v=2` → `logo.png`. */
export function filenameFromUrl(url: string, fallback = 'download'): string {
  try {
    const parsed = new URL(url);
    if (parsed.protocol === 'data:') return fallback;
    const last = decodeURIComponent(parsed.pathname.split('/').filter(Boolean).pop() ?? '');
    return sanitizeFilename(last || parsed.hostname || fallback);
  } catch {
    return fallback;
  }
}

/** Opens http(s) URLs in the system browser. Other schemes are refused. */
export async function openInSystemBrowser(url: string): Promise<void> {
  if (!/^https?:/i.test(url)) {
    void vscode.window.showWarningMessage(`Only http and https pages can be opened externally.`);
    return;
  }
  await vscode.env.openExternal(vscode.Uri.parse(url, true));
}

export async function savePageAsPdf(
  session: TabSession,
  title: string,
  directory: string,
): Promise<void> {
  const pdf = await session.printToPdf();
  const uri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(join(directory, `${sanitizeFilename(title || 'page')}.pdf`)),
    filters: { PDF: ['pdf'] },
    saveLabel: 'Save PDF',
  });
  if (!uri) return;
  await vscode.workspace.fs.writeFile(uri, pdf);
  await offerToOpen(uri);
}

export async function viewPageSource(session: TabSession): Promise<void> {
  const { content, mimeType } = await session.pageSource();
  const document = await vscode.workspace.openTextDocument({
    content,
    language: languageForMime(mimeType),
  });
  await vscode.window.showTextDocument(document, {
    viewColumn: vscode.ViewColumn.Beside,
    preview: false,
  });
}

export async function saveResource(
  session: TabSession,
  url: string,
  directory: string,
): Promise<void> {
  const bytes = await session.fetchResource(url);
  let name = filenameFromUrl(url, 'image');
  if (!/\.[a-z0-9]{2,5}$/i.test(name)) {
    const type = sniffImageType(bytes);
    const extension = {
      'image/png': 'png',
      'image/jpeg': 'jpg',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
    }[type];
    if (extension) name += `.${extension}`;
  }
  const uri = await vscode.window.showSaveDialog({
    defaultUri: vscode.Uri.file(join(directory, name)),
    saveLabel: 'Save',
  });
  if (!uri) return;
  await vscode.workspace.fs.writeFile(uri, bytes);
  await offerToOpen(uri);
}

async function offerToOpen(uri: vscode.Uri): Promise<void> {
  const choice = await vscode.window.showInformationMessage(
    `Saved ${basename(uri.fsPath)}`,
    'Open',
    'Show in Folder',
  );
  if (choice === 'Open') await vscode.env.openExternal(uri);
  if (choice === 'Show in Folder') await vscode.commands.executeCommand('revealFileInOS', uri);
}
