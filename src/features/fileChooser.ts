/** File extensions offered for common `accept` MIME wildcards. */
const MIME_WILDCARDS: Record<string, string[]> = {
  'image/*': ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'ico', 'avif'],
  'video/*': ['mp4', 'webm', 'mov', 'mkv', 'avi', 'm4v'],
  'audio/*': ['mp3', 'wav', 'ogg', 'm4a', 'flac', 'aac', 'opus'],
  'text/*': ['txt', 'csv', 'md', 'html', 'css', 'js', 'json', 'xml'],
};

const MIME_TYPES: Record<string, string[]> = {
  'application/pdf': ['pdf'],
  'application/json': ['json'],
  'application/zip': ['zip'],
  'text/plain': ['txt'],
  'text/csv': ['csv'],
  'text/html': ['html', 'htm'],
  'image/png': ['png'],
  'image/jpeg': ['jpg', 'jpeg'],
  'image/gif': ['gif'],
  'image/webp': ['webp'],
  'image/svg+xml': ['svg'],
};

/**
 * Converts an `<input type=file accept="...">` list into `showOpenDialog` filters. Returns
 * `undefined` (no filter) when nothing is recognised, so the user can still pick any file.
 */
export function acceptToFilters(accept: readonly string[]): Record<string, string[]> | undefined {
  const extensions = new Set<string>();
  for (const raw of accept) {
    const value = raw.trim().toLowerCase();
    if (value.startsWith('.') && value.length > 1) extensions.add(value.slice(1));
    else for (const ext of MIME_WILDCARDS[value] ?? MIME_TYPES[value] ?? []) extensions.add(ext);
  }
  if (!extensions.size) return undefined;
  return { 'Accepted files': [...extensions], 'All files': ['*'] };
}
