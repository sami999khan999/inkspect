import { isLive, type Project } from '@inkspect/shared/hub';
import { Select } from '@inkspect/shared/ui/Select';

/** What a project is to the user: open in VS Code, has agents, or only saved captures. */
export function projectDetail(project: Project): string {
  const parts = [
    project.vscode && 'VS Code',
    project.agentmux && 'agentmux',
    !isLive(project) && project.saved && 'saved',
    project.pinned && 'pinned',
  ].filter(Boolean);
  return parts.join(' · ');
}

/**
 * Which project captures are saved into (the browser helper lists them). The suggestion comes
 * first: the project this site went to before, or the one serving it.
 */
export function ProjectPicker({
  projects,
  value,
  onChange,
  className,
}: {
  projects: readonly Project[];
  value: string | undefined;
  onChange: (value: string) => void;
  className?: string;
}) {
  if (!projects.length) return null;
  return (
    <Select
      size="sm"
      label="Project to save into"
      icon="folder"
      className={className}
      value={value ?? projects[0]!.path}
      onChange={onChange}
      options={projects.map((p) => ({
        value: p.path,
        label: p.name,
        icon: p.pinned ? 'pinned' : p.vscode ? 'vscode' : p.agentmux ? 'terminal' : 'folder',
        detail: projectDetail(p),
        group: isLive(p) ? 'Open' : 'Saved',
      }))}
    />
  );
}

/** A screenshot's small JPEG for lists, as base64 (made off the page, so its CSP can't stop it). */
export async function thumbnailOf(dataUrl: string, size = 480): Promise<string | undefined> {
  try {
    const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const bitmap = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
    const scale = Math.min(1, size / Math.max(bitmap.width, bitmap.height));
    const canvas = new OffscreenCanvas(
      Math.max(1, Math.round(bitmap.width * scale)),
      Math.max(1, Math.round(bitmap.height * scale)),
    );
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.75 });
    const buffer = new Uint8Array(await blob.arrayBuffer());
    let binary = '';
    for (let i = 0; i < buffer.length; i += 0x8000) {
      binary += String.fromCharCode(...buffer.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  } catch {
    return undefined;
  }
}
