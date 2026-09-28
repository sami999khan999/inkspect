import { defineConfig } from 'vite';
import { webviewBuild } from './vite.base.mts';

// The Shortcuts view in the Browser sidebar (src/shortcuts-view/main.tsx).
export default defineConfig(({ mode }) =>
  webviewBuild('src/shortcuts-view/main.tsx', 'shortcuts', mode, false),
);
