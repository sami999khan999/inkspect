// Builds the extension for each browser into dist/<browser>/ (load it unpacked from there).
//   node scripts/build.mjs [--watch] [--browser chrome|firefox] [--production] [--test]
// --test builds dist/<browser>-test for the end-to-end tests: host access to all pages (tests
// can't press the shortcut that grants activeTab) and an open shadow root.
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';
import { buildManifest } from './manifest.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const watch = args.includes('--watch');
const production = args.includes('--production');
const only = args.includes('--browser') ? [args[args.indexOf('--browser') + 1]] : null;
const browsers = only ?? ['chrome', 'firefox'];
const test = args.includes('--test');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

function writeStatic(browser, outdir) {
  const manifest = buildManifest(root, browser, { version: pkg.version, test });
  writeFileSync(join(outdir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  mkdirSync(join(outdir, 'icons'), { recursive: true });
  for (const size of [16, 32, 48, 128]) {
    copyFileSync(join(root, 'icons', `${size}.png`), join(outdir, 'icons', `${size}.png`));
  }
  copyFileSync(join(root, 'src', 'options', 'options.html'), join(outdir, 'options.html'));
  copyFileSync(join(root, 'src', 'popup', 'popup.html'), join(outdir, 'popup.html'));
  // The icon font of the settings page and the toolbar.
  const codicons = dirname(require.resolve('@vscode/codicons/dist/codicon.css'));
  copyFileSync(join(codicons, 'codicon.ttf'), join(outdir, 'codicon.ttf'));
}

const contexts = [];
for (const browser of browsers) {
  const outdir = join(root, 'dist', test ? `${browser}-test` : browser);
  rmSync(outdir, { recursive: true, force: true });
  mkdirSync(outdir, { recursive: true });
  writeStatic(browser, outdir);
  const context = await esbuild.context({
    entryPoints: {
      background: join(root, 'src/background/index.ts'),
      content: join(root, 'src/content/index.tsx'),
      'main-world': join(root, 'src/main-world/index.ts'),
      options: join(root, 'src/options/index.tsx'),
      popup: join(root, 'src/popup/index.tsx'),
    },
    outdir,
    bundle: true,
    // Content and page scripts must be classic scripts; the rest follow for simplicity.
    format: 'iife',
    target: ['chrome120', 'firefox128'],
    jsx: 'automatic',
    loader: { '.css': 'text' },
    define: {
      'process.env.NODE_ENV': JSON.stringify(production ? 'production' : 'development'),
      __BROWSER__: JSON.stringify(browser),
      __TEST__: JSON.stringify(test),
    },
    minify: production,
    sourcemap: production ? false : 'inline',
    legalComments: 'none',
    logLevel: 'info',
  });
  contexts.push(context);
}

if (watch) {
  await Promise.all(contexts.map((c) => c.watch()));
  console.log(`Watching (${browsers.join(', ')}). Load dist/<browser> unpacked.`);
} else {
  await Promise.all(contexts.map((c) => c.rebuild()));
  await Promise.all(contexts.map((c) => c.dispose()));
}
