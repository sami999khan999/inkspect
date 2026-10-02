// Registers the hub as a native messaging host for every browser found on this machine (Linux):
// a copy of the hub script outside the extension's folder (which updates delete), a launcher that
// runs it with VS Code's own Node, and a host manifest per browser. Node only (no `vscode`).
import { createHash } from 'node:crypto';
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { CHROME_EXTENSION_ID, FIREFOX_EXTENSION_ID, HUB_HOST_NAME } from '@inkspect/shared/hub';

type Env = Record<string, string | undefined>;

/** A browser whose native messaging hosts folder can take the hub's manifest. */
export interface HostFolder {
  browser: string;
  /** The browser's own config folder: only browsers that have one get a manifest. */
  config: string;
  /** Where its native messaging host manifests go. */
  hosts: string;
  kind: 'chromium' | 'firefox';
}

/** Where each known browser looks for native messaging hosts on Linux (per user). */
export function hostFolders(env: Env = process.env, home = homedir()): HostFolder[] {
  const config = env.XDG_CONFIG_HOME || join(home, '.config');
  const chromium: [string, string][] = [
    ['Google Chrome', 'google-chrome'],
    ['Google Chrome Beta', 'google-chrome-beta'],
    ['Google Chrome Dev', 'google-chrome-unstable'],
    ['Chromium', 'chromium'],
    ['Brave', 'BraveSoftware/Brave-Browser'],
    ['Vivaldi', 'vivaldi'],
    ['Microsoft Edge', 'microsoft-edge'],
    ['Opera', 'opera'],
  ];
  return [
    ...chromium.map(([browser, folder]): HostFolder => {
      const dir = join(config, folder);
      return { browser, config: dir, hosts: join(dir, 'NativeMessagingHosts'), kind: 'chromium' };
    }),
    // Firefox reads ~/.mozilla; newer versions with an XDG profile read ~/.config/mozilla too.
    {
      browser: 'Firefox',
      config: join(home, '.mozilla'),
      hosts: join(home, '.mozilla', 'native-messaging-hosts'),
      kind: 'firefox',
    },
    {
      browser: 'Firefox',
      config: join(config, 'mozilla'),
      hosts: join(config, 'mozilla', 'native-messaging-hosts'),
      kind: 'firefox',
    },
  ];
}

/** The host manifest a browser reads: which program to start, and which extension may. */
export function hostManifest(launcher: string, kind: HostFolder['kind']): object {
  return {
    name: HUB_HOST_NAME,
    description: 'Inkspect hub: links the Inkspect browser extension with VS Code and agents.',
    path: launcher,
    type: 'stdio',
    ...(kind === 'chromium'
      ? { allowed_origins: [`chrome-extension://${CHROME_EXTENSION_ID}/`] }
      : { allowed_extensions: [FIREFOX_EXTENSION_ID] }),
  };
}

/** A string as one single-quoted shell word. */
const shellQuote = (s: string) => `'${s.replace(/'/g, `'\\''`)}'`;

/**
 * The launcher browsers start: the hub with VS Code's own Node (Electron in Node mode), or a
 * `node` on the PATH if that binary is gone.
 */
export function launcherScript(execPath: string, hubScript: string): string {
  return [
    '#!/bin/sh',
    '# Inkspect hub launcher, written by VS Code Browser. Browsers start it (native messaging).',
    `if [ -x ${shellQuote(execPath)} ]; then`,
    `  ELECTRON_RUN_AS_NODE=1 exec ${shellQuote(execPath)} ${shellQuote(hubScript)} "$@"`,
    'fi',
    `exec node ${shellQuote(hubScript)} "$@"`,
    '',
  ].join('\n');
}

/** A file's content hash, or '' if it doesn't exist. */
export function fileHash(path: string): string {
  try {
    return createHash('sha256').update(readFileSync(path)).digest('hex').slice(0, 16);
  } catch {
    return '';
  }
}

export interface InstallResult {
  hubScript: string;
  launcher: string;
  /** Whether the hub script changed (a running hub should be replaced). */
  updated: boolean;
  /** Browsers that got a manifest, and where. */
  registered: { browser: string; file: string }[];
}

/**
 * Installs or refreshes the hub: copies `source` (dist/hub.js) into the data folder when it
 * changed, writes the launcher, and a host manifest for each browser that is installed.
 */
export function installHub(options: {
  source: string;
  execPath: string;
  dataDir: string;
  env?: Env;
  home?: string;
}): InstallResult {
  const dir = join(options.dataDir, 'hub');
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const hubScript = join(dir, 'hub.js');
  const updated = fileHash(hubScript) !== fileHash(options.source);
  if (updated) {
    // Replaced in one step: a browser may start the old one at this moment.
    const temp = `${hubScript}.${process.pid}.tmp`;
    copyFileSync(options.source, temp);
    renameSync(temp, hubScript);
  }
  const launcher = join(dir, 'inkspect-hub');
  const script = launcherScript(options.execPath, hubScript);
  if (!existsSync(launcher) || readFileSync(launcher, 'utf8') !== script) {
    writeFileSync(launcher, script, { mode: 0o755 });
  }
  chmodSync(launcher, 0o755);
  const registered: InstallResult['registered'] = [];
  for (const folder of hostFolders(options.env, options.home)) {
    if (!existsSync(folder.config)) continue;
    mkdirSync(folder.hosts, { recursive: true });
    const file = join(folder.hosts, `${HUB_HOST_NAME}.json`);
    const manifest = `${JSON.stringify(hostManifest(launcher, folder.kind), null, 2)}\n`;
    if (!existsSync(file) || readFileSync(file, 'utf8') !== manifest) {
      writeFileSync(file, manifest);
    }
    registered.push({ browser: folder.browser, file });
  }
  return { hubScript, launcher, updated, registered };
}

/** Removes every host manifest and the installed hub. */
export function uninstallHub(options: { dataDir: string; env?: Env; home?: string }): string[] {
  const removed: string[] = [];
  for (const folder of hostFolders(options.env, options.home)) {
    const file = join(folder.hosts, `${HUB_HOST_NAME}.json`);
    if (existsSync(file)) {
      rmSync(file, { force: true });
      removed.push(folder.browser);
    }
  }
  rmSync(join(options.dataDir, 'hub'), { recursive: true, force: true });
  return removed;
}
