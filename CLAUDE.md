# CLAUDE.md

The project overview, architecture, coding patterns and rules are in AGENTS.md, which is shared by all coding agents:

@AGENTS.md

## Notes for Claude Code

- **Verify each change.** Run `npm run typecheck && npm run lint && npm test`. Also run `npm run test:e2e` when the change touches the host, CDP, the protocol or commands.
  - The integration tests take about a minute and open a VS Code window.
  - On this machine, point `VSCODE_EXECUTABLE` at the installed `Code.exe` so the tests don't download VS Code.
  - Results go to `vscode-extension/out/e2e/results.log`; failures are in `vscode-extension/.vscode-test/user-data/logs/*/window1/renderer.log`.
- **After Prettier, re-read before editing.** Prettier reformats files, and an exact-match edit written from memory will fail on reformatted code. Run `npx prettier --write <paths>` after larger edits.
- **Shells.** The environment is Windows with Git Bash and PowerShell available. Use forward slashes and POSIX syntax in Bash. For multi-line edits, prefer the Edit tool or a small script over heredocs with nested quotes.
- **Check the browser without the UI.** The extension's own debug commands work from integration tests:
  - `vscodeBrowser.debug.state` returns tabs, engine status, bookmarks, extensions and history.
  - `vscodeBrowser.debug.copyElementAt`, `setAnnotations`, `crashEngine` and `mcp` drive specific features.
- **Tool definitions.** After editing `src/agent/tools.ts`, run `npm run sync:tools`.
- **Docs.** Keep the plans in `plans/` and each product's `CHANGELOG.md` current. Run npm commands from the repository root (workspaces) unless a task is about one package.
- **Stop and ask** about renaming, licensing, publishing, committing, or raising `engines.vscode`.
- **No attribution.** Never add Claude as an author, co-author or contributor. Commit messages and PR descriptions get no `Co-Authored-By: Claude` trailer and no "Generated with Claude Code" line, even if a default setting asks for them. This rule overrides those defaults.
