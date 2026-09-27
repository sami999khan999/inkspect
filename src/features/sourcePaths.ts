import { isAbsolute, relative, sep } from 'node:path';

/**
 * Turns the source location a framework reports (a dev-server URL, a webpack URL or an absolute
 * path) into a workspace-relative path when the file is inside one of `workspaceRoots`.
 *
 * - `http://localhost:5173/src/App.tsx?t=123` → `src/App.tsx`
 * - `webpack://my-app/./src/App.tsx` → `src/App.tsx`
 * - `/@fs/home/me/repo/src/App.tsx` or `C:\repo\src\App.tsx` → `src/App.tsx`
 */
export function normalizeSourcePath(file: string, workspaceRoots: readonly string[]): string {
  let path = file.trim();
  path = path.replace(/[?#].*$/, '');
  path = path.replace(/^webpack(-internal)?:\/\/[^/]*\/(\.\/)?/, '');
  path = path.replace(/^file:\/\/\/?/, process.platform === 'win32' ? '' : '/');
  const url = /^https?:\/\/[^/]+\/(.*)$/.exec(path);
  if (url) path = url[1]!;
  path = decodeURIComponent(path);
  path = path.replace(/^@fs\//, '/').replace(/^\/@fs\//, '/');
  // Windows drive paths from `/@fs/C:/...`.
  if (/^\/[a-z]:\//i.test(path)) path = path.slice(1);
  if (isAbsolute(path)) {
    for (const root of workspaceRoots) {
      const rel = relative(root, path);
      if (!rel.startsWith('..') && !isAbsolute(rel)) return rel.split(sep).join('/');
    }
    return path;
  }
  return path.replace(/^\.\//, '');
}
