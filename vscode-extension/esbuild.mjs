// Bundles the extension host code (src/extension.ts) into dist/extension.js, and the hub that
// browsers start (src/hub/main.ts, see src/hub/install.ts) into dist/hub.js.
import * as esbuild from 'esbuild';

const watch = process.argv.includes('--watch');
const production = process.argv.includes('--production');

/** Prints start/end markers that the `npm: watch` task's problem matcher waits for. */
const watchMarkers = {
  name: 'watch-markers',
  setup(build) {
    build.onStart(() => console.log('[watch] build started'));
    build.onEnd((result) => {
      for (const { text, location } of result.errors) {
        console.error(`✘ [ERROR] ${text}`);
        if (location) console.error(`    ${location.file}:${location.line}:${location.column}:`);
      }
      console.log('[watch] build finished');
    });
  },
};

const ctx = await esbuild.context({
  entryPoints: { extension: 'src/extension.ts', hub: 'src/hub/main.ts' },
  outdir: 'dist',
  bundle: true,
  format: 'cjs',
  platform: 'node',
  target: 'node22',
  // ws tries these optional native speed-ups and works without them.
  external: ['vscode', 'bufferutil', 'utf-8-validate'],
  sourcemap: !production,
  sourcesContent: false,
  minify: production,
  logLevel: 'silent',
  plugins: [watchMarkers],
});

if (watch) {
  await ctx.watch();
} else {
  const result = await ctx.rebuild();
  await ctx.dispose();
  if (result.errors.length > 0) process.exit(1);
}
