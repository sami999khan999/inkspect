import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  { ignores: ['dist/', 'out/', 'coverage/', '.vscode-test/', 'node_modules/'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    files: ['src/**/*.ts', 'test/**/*.ts', '**/*.mjs', '**/*.mts'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['webview/**/*.{ts,tsx}'],
    extends: [reactHooks.configs.flat.recommended],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['test/fixtures/extensions/**/*.js'],
    languageOptions: { globals: { ...globals.browser, ...globals.webextensions } },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // The hub runs outside VS Code (browsers start it): no VS Code API there.
    files: ['src/hub/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { paths: [{ name: 'vscode', message: 'src/hub/ runs outside VS Code.' }] },
      ],
    },
  },
);
