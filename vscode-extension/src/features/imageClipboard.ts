import { execFile, spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

/** Image types the OS clipboard helpers below can read directly. */
export const NATIVE_CLIPBOARD_TYPES = ['image/png', 'image/jpeg'];

/**
 * Puts an image on the OS clipboard from the extension host. The webview's
 * `navigator.clipboard.write` only works while the webview has focus, which is not the case when
 * the copy comes from a notification button or a command, so the host does it instead.
 * `bytes` must be PNG or JPEG. Throws if no clipboard helper worked.
 */
export async function writeImageToClipboard(
  bytes: Uint8Array,
  mimeType: string,
  platform: NodeJS.Platform = process.platform,
): Promise<void> {
  if (!NATIVE_CLIPBOARD_TYPES.includes(mimeType)) throw new Error(`Unsupported type ${mimeType}`);
  if (platform === 'linux') {
    await copyOnLinux(bytes, mimeType);
    return;
  }
  const file = join(
    tmpdir(),
    `vscode-browser-${randomUUID()}.${mimeType === 'image/png' ? 'png' : 'jpg'}`,
  );
  await writeFile(file, bytes);
  try {
    if (platform === 'win32') {
      await run(
        'powershell.exe',
        ['-NoProfile', '-NonInteractive', '-STA', '-Command', WINDOWS_SCRIPT],
        {
          VB_IMAGE_PATH: file,
          VB_IMAGE_PNG: mimeType === 'image/png' ? '1' : '0',
        },
      );
    } else if (platform === 'darwin') {
      const type = mimeType === 'image/png' ? '«class PNGf»' : 'JPEG picture';
      await run(
        'osascript',
        [
          '-e',
          `set the clipboard to (read (POSIX file (system attribute "VB_IMAGE_PATH")) as ${type})`,
        ],
        { VB_IMAGE_PATH: file },
      );
    } else {
      throw new Error(`No image clipboard support on ${platform}`);
    }
  } finally {
    await rm(file, { force: true });
  }
}

/**
 * Sets both a bitmap (for most apps) and the original PNG bytes (keeps transparency, used by
 * browsers and chat inputs). The path comes in through the environment, never the script text.
 */
const WINDOWS_SCRIPT = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms, System.Drawing
$bytes = [IO.File]::ReadAllBytes($env:VB_IMAGE_PATH)
$image = [System.Drawing.Image]::FromStream((New-Object IO.MemoryStream(,$bytes)))
$data = New-Object System.Windows.Forms.DataObject
$data.SetImage($image)
if ($env:VB_IMAGE_PNG -eq '1') { $data.SetData('PNG', (New-Object IO.MemoryStream(,$bytes))) }
[System.Windows.Forms.Clipboard]::SetDataObject($data, $true)
`;

function run(command: string, args: string[], env: Record<string, string>): Promise<void> {
  return new Promise((resolve, reject) => {
    execFile(
      command,
      args,
      { env: { ...process.env, ...env }, timeout: 15_000, windowsHide: true },
      (error, _stdout, stderr) => {
        if (error) reject(new Error(stderr.trim() || error.message));
        else resolve();
      },
    );
  });
}

async function copyOnLinux(bytes: Uint8Array, mimeType: string): Promise<void> {
  const candidates: [string, string[]][] = process.env.WAYLAND_DISPLAY
    ? [['wl-copy', ['--type', mimeType]]]
    : [];
  candidates.push(['xclip', ['-selection', 'clipboard', '-t', mimeType, '-i']]);
  let lastError: unknown;
  for (const [command, args] of candidates) {
    try {
      await pipe(command, args, bytes);
      return;
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Install wl-clipboard or xclip');
}

function pipe(command: string, args: string[], input: Uint8Array): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: ['pipe', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.on('data', (chunk: Buffer) => (stderr += chunk.toString()));
    child.on('error', reject);
    // wl-copy keeps running to serve the clipboard; it forks, so the parent exits.
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject(new Error(stderr.trim() || `${command} exited with ${code}`)),
    );
    child.stdin.end(Buffer.from(input));
  });
}
