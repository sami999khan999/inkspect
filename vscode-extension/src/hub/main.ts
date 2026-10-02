// Entry point of dist/hub.js. Browsers start it as their native messaging host (the shim);
// `--serve` runs the daemon; `--version` prints the hub's build.
import { HubDaemon } from './daemon';
import { fileHash } from './install';
import { hubPaths } from './paths';
import { runShim } from './shim';

/** Ten minutes without anyone connected, then the daemon exits. */
const IDLE_MS = 10 * 60_000;

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const script = __filename;
  const paths = hubPaths();
  if (args[0] === '--serve') {
    const daemon = new HubDaemon(paths, {
      idleMs: Number(process.env.INKSPECT_HUB_IDLE_MS) || IDLE_MS,
      // VS Code replaces a running hub whose build differs from the installed one.
      build: fileHash(script),
      handleSignals: true,
      // Comma-separated tmux servers to look for agentmux threads on (tests: none).
      tmuxSockets: process.env.INKSPECT_TMUX_SOCKETS?.split(',').filter(Boolean),
    });
    if (!(await daemon.start())) process.exit(0);
    return;
  }
  if (args[0] === '--version') {
    process.stdout.write(`${fileHash(script)}\n`);
    return;
  }
  await runShim(paths, script, args);
}

// A failure in one request must not stop the hub for every browser and window.
process.on('unhandledRejection', (error) => {
  process.stderr.write(`Inkspect hub: ${error instanceof Error ? error.message : String(error)}\n`);
});

main().catch((error: unknown) => {
  process.stderr.write(`Inkspect hub: ${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});
