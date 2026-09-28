import { defineConfig } from 'vite';
import { webviewBuild } from './vite.base.mts';

// The browser window (src/main.tsx). Runs first and empties dist/webview.
export default defineConfig(({ mode }) =>
  webviewBuild('src/main.tsx', 'index', mode, !process.argv.includes('--watch')),
);
