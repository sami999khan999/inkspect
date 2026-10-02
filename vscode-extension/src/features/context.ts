import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ensureStore } from '../hub/store';
import { localWorkspaceFolder } from './screenshots';

/**
 * Where files for agents go: `.inkspect/files/` in the workspace (next to the Agent Context
 * items, never committed), or in global storage when there is no local folder.
 */
export function contextFolder(globalStorage: string): string {
  const root = localWorkspaceFolder() ?? join(globalStorage, 'inbox');
  return join(ensureStore(root), 'files');
}

/**
 * Writes text (element details, console summaries, reports) where an agent can read it (see
 * `contextFolder`). Returns the file's path.
 */
export async function saveContext(
  text: string,
  label: string,
  globalStorage: string,
): Promise<string> {
  const folder = contextFolder(globalStorage);
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
