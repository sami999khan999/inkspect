import { defineConfig } from 'vite';
import { webviewBuild } from './vite.base.mts';

// The Agent Context view in the Browser sidebar (src/context-view/main.tsx).
export default defineConfig(({ mode }) =>
  webviewBuild('src/context-view/main.tsx', 'context', mode, false),
);
