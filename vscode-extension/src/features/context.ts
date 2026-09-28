import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { localWorkspaceFolder } from './screenshots';

/**
 * Writes text (element details, console summaries, reports) where an agent can read it:
 * `.vscode-browser/context/` in the workspace, or globalStorage when there is no local folder.
 * Returns the file's path.
 */
export async function saveContext(
  text: string,
  label: string,
  globalStorage: string,
): Promise<string> {
  const workspace = localWorkspaceFolder();
  const folder = workspace
    ? join(workspace, '.vscode-browser', 'context')
    : join(globalStorage, 'context');
  await mkdir(folder, { recursive: true });
  const slug =
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 40) || 'context';
  const path = join(folder, `${slug}-${Date.now()}.md`);
  await writeFile(path, text.endsWith('\n') ? text : `${text}\n`, 'utf8');
  return path;
}
