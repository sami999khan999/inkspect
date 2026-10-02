// Which project a localhost page belongs to: the folder of the process listening on its port
// (the dev server). Linux only (/proc); only this user's processes are looked at. Node only.
import { existsSync, readdirSync, readFileSync, readlinkSync, realpathSync } from 'node:fs';
import { dirname, join } from 'node:path';

/** Whether a URL is served from this machine (only those can have a local dev server). */
export function localPort(url: string): number | undefined {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return undefined;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return undefined;
  const host = parsed.hostname;
  const local =
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host === '0.0.0.0' ||
    host.endsWith('.localhost');
  if (!local) return undefined;
  return Number(parsed.port) || (parsed.protocol === 'https:' ? 443 : 80);
}

/** Socket inodes listening on each port, from /proc/net/tcp or tcp6. */
export function parseListeners(text: string): Map<number, string[]> {
  const ports = new Map<number, string[]>();
  for (const line of text.split('\n').slice(1)) {
    const fields = line.trim().split(/\s+/);
    // sl local_address rem_address st tx_queue:rx_queue tr:tm->when retrnsmt uid timeout inode
    const [, local, , state, , , , , , inode] = fields;
    if (!local || state !== '0A' || !inode || inode === '0') continue; // 0A: LISTEN
    const port = parseInt(local.split(':')[1] ?? '', 16);
    if (!Number.isFinite(port)) continue;
    ports.set(port, [...(ports.get(port) ?? []), inode]);
  }
  return ports;
}

/** The pid of a process holding one of these socket inodes (this user's processes only). */
function pidOfSockets(inodes: ReadonlySet<string>, procRoot: string): number | undefined {
  for (const name of readdirSync(procRoot)) {
    if (!/^\d+$/.test(name)) continue;
    let fds: string[];
    try {
      fds = readdirSync(join(procRoot, name, 'fd'));
    } catch {
      continue; // Another user's process, or gone.
    }
    for (const fd of fds) {
      try {
        const match = /^socket:\[(\d+)\]$/.exec(readlinkSync(join(procRoot, name, 'fd', fd)));
        if (match && inodes.has(match[1]!)) return Number(name);
      } catch {
        // Closed meanwhile.
      }
    }
  }
  return undefined;
}

/** The working folder of the process listening on `port`, or undefined. */
export function listenerFolder(port: number, procRoot = '/proc'): string | undefined {
  const inodes = new Set<string>();
  for (const file of ['tcp', 'tcp6']) {
    try {
      const text = readFileSync(join(procRoot, 'net', file), 'utf8');
      for (const inode of parseListeners(text).get(port) ?? []) inodes.add(inode);
    } catch {
      // No IPv6, or not Linux.
    }
  }
  if (!inodes.size) return undefined;
  const pid = pidOfSockets(inodes, procRoot);
  if (pid === undefined) return undefined;
  try {
    return realpathSync(join(procRoot, String(pid), 'cwd'));
  } catch {
    return undefined;
  }
}

/** The git repository a folder is in (its top folder), or undefined. */
export function gitRoot(folder: string): string | undefined {
  for (let dir = folder; ; dir = dirname(dir)) {
    if (existsSync(join(dir, '.git'))) return dir;
    if (dirname(dir) === dir) return undefined;
  }
}

/**
 * The project a dev server's folder belongs to: the deepest known project containing it, else
 * its git repository.
 */
export function projectOfFolder(folder: string, known: readonly string[]): string | undefined {
  const containing = known
    .filter((p) => folder === p || folder.startsWith(`${p}/`))
    .sort((a, b) => b.length - a.length);
  return containing[0] ?? gitRoot(folder);
}
