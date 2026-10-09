import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  // .cache/ holds the Chrome for Testing that the end-to-end tests download.
  { ignores: ['dist/', 'node_modules/', 'out/', '.cache/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { globals: { ...globals.browser, ...globals.webextensions } },
  },
  { files: ['**/*.tsx'], extends: [reactHooks.configs.flat.recommended] },
  { files: ['**/*.mjs'], languageOptions: { globals: globals.node } },
  {
    // Test code runs partly inside the page and the extension (evaluate callbacks).
    files: ['test/e2e/**/*.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser, ...globals.webextensions } },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
    },
  },
);
