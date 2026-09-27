import type { DownloadInfo, TabState } from '@shared/protocol';

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

export function downloadStatus(download: DownloadInfo): string {
  switch (download.state) {
    case 'completed':
      return download.path ? formatBytes(download.receivedBytes) : 'File missing';
    case 'canceled':
      return 'Canceled';
    case 'inProgress':
      return download.totalBytes
        ? `${formatBytes(download.receivedBytes)} of ${formatBytes(download.totalBytes)}`
        : `${formatBytes(download.receivedBytes)}`;
  }
}

/** The text shown in the address bar when it is not being edited. */
export function displayUrl(tab: TabState | undefined): string {
  if (!tab || tab.internalPage === 'newtab' || tab.url === 'about:blank') return '';
  return tab.url;
}

/** `https://example.com says` style origin label for dialogs. */
export function originLabel(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.origin === 'null' ? 'This page' : parsed.host || parsed.origin;
  } catch {
    return 'This page';
  }
}

export function truncate(text: string, max: number): string {
  const single = text.replace(/\s+/g, ' ').trim();
  return single.length > max ? `${single.slice(0, max - 1)}…` : single;
}
