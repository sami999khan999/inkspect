import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import type { UserConfig } from 'vite';

/**
 * One webview bundle: `<name>.js` and `<name>.css` in dist/webview, with no shared chunks (the
 * webview CSP allows only the nonce'd entry script). The extension host writes the HTML, so it
 * can set the nonce.
 */
export function webviewBuild(entry: string, name: string, mode: string, empty: boolean): UserConfig {
  return {
    root: fileURLToPath(new URL('.', import.meta.url)),
    base: './',
    plugins: [react()],
    resolve: {
      alias: {
        '@shared': fileURLToPath(new URL('../src/shared', import.meta.url)),
      },
    },
    build: {
      outDir: '../dist/webview',
      emptyOutDir: empty,
      sourcemap: mode !== 'production',
      minify: mode === 'production',
      modulePreload: false,
      rolldownOptions: {
        input: fileURLToPath(new URL(entry, import.meta.url)),
        output: {
          entryFileNames: `${name}.js`,
          chunkFileNames: `${name}-[name].js`,
          assetFileNames: (asset) =>
            asset.names.some((n) => n.endsWith('.css')) ? `${name}.css` : '[name][extname]',
        },
      },
    },
  };
}
