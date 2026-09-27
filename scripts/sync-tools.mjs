// Writes `contributes.languageModelTools` in package.json from src/agent/tools.ts.
// Run `npm run sync:tools` after changing a tool; a unit test fails while they differ.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const { outputFiles } = await esbuild.build({
  entryPoints: [join(root, 'src', 'agent', 'tools.ts')],
  bundle: true,
  format: 'esm',
  platform: 'node',
  write: false,
});
const { languageModelToolsContribution } = await import(
  `data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString('base64')}`
);
const file = join(root, 'package.json');
const pkg = JSON.parse(readFileSync(file, 'utf8'));
pkg.contributes.languageModelTools = languageModelToolsContribution();
writeFileSync(file, `${JSON.stringify(pkg, null, 2)}\n`);
console.log(`Wrote ${pkg.contributes.languageModelTools.length} tools to package.json`);
