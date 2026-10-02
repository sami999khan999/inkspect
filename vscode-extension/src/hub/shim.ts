// The native messaging host a browser starts: it connects the browser to the hub daemon
// (starting the daemon if it isn't running) and passes frames both ways. The browser never sees
// the hub's token; the shim reads it and authenticates for it.
import { spawn } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createConnection, type Socket } from 'node:net';
import { encodeHub, FIREFOX_EXTENSION_ID } from '@inkspect/shared/hub';
import { frame } from './framing';
import type { HubPaths } from './paths';

/**
 * The extension's origin from the host's arguments: Chrome passes `chrome-extension://<id>/`,
 * Firefox the manifest's path and the extension's id.
 */
export function originFromArgs(args: readonly string[]): string {
  const chrome = args.find((a) => /^chrome-extension:\/\/[a-p]{32}\/?$/.test(a));
  if (chrome) return chrome.replace(/\/$/, '');
  if (args.includes(FIREFOX_EXTENSION_ID)) return `firefox:${FIREFOX_EXTENSION_ID}`;
  return 'unknown';
}

/** Starts the hub daemon in the background, independent of whoever started it. */
export function spawnDaemon(hubScript: string): void {
  const child = spawn(process.execPath, [hubScript, '--serve'], {
    detached: true,
    stdio: 'ignore',
    env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' },
  });
  child.unref();
}

function connect(path: string): Promise<Socket | undefined> {
  return new Promise((resolve) => {
    const socket = createConnection(path);
    socket.once('connect', () => {
      socket.removeAllListeners('error');
      resolve(socket);
    });
    socket.once('error', () => resolve(undefined));
  });
}

/**
 * Connects to the running hub, or starts one and waits for it (up to about 3 seconds). The token
 * is read after connecting, so it belongs to the hub that answered.
 */
export async function connectToHub(
  paths: HubPaths,
  hubScript: string,
): Promise<{ socket: Socket; token: string } | undefined> {
  let started = false;
  for (let attempt = 0; attempt < 30; attempt++) {
    const socket = await connect(paths.socket);
    if (socket) {
      try {
        return { socket, token: readFileSync(paths.token, 'utf8').trim() };
      } catch {
        socket.destroy();
      }
    } else if (!started) {
      spawnDaemon(hubScript);
      started = true;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return undefined;
}

/** Runs as the browser's native messaging host until either side closes. */
export async function runShim(paths: HubPaths, hubScript: string, args: string[]): Promise<void> {
  const hub = await connectToHub(paths, hubScript);
  if (!hub) {
    process.stderr.write('Inkspect hub: could not start the hub.\n');
    process.exit(1);
  }
  const { socket, token } = hub;
  socket.write(
    frame(encodeHub({ type: 'auth', token, role: 'browser', origin: originFromArgs(args) })),
  );
  // Same framing both ways: the bytes pass through unchanged.
  process.stdin.pipe(socket);
  socket.pipe(process.stdout);
  const exit = () => process.exit(0);
  process.stdin.on('end', exit);
  process.stdin.on('close', exit);
  socket.on('close', exit);
  socket.on('error', exit);
}
