# Inkspect

Browser tools for working with AI agents, as two products in one repository:

| Folder                                     | Product                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`vscode-extension/`](vscode-extension/)   | **VS Code Browser**: a full Chromium browser in a VS Code editor tab. It has an element selector that copies context for AI agents, drawing with area screenshots, full-page, region and element screenshots, device emulation, Chrome extensions, DevTools, and agent tools (language model tools and MCP). See its [README](vscode-extension/README.md). |
| [`browser-extension/`](browser-extension/) | **Inkspect** for Chrome, Edge, Brave and Firefox: keeps your bookmarks in sync with VS Code, live and both ways. See its [README](browser-extension/README.md).                                                                                                                                                                                            |
| [`shared/`](shared/)                       | `@inkspect/shared`: element details, drawing, devices, Copy-for-AI formats, bookmark merge and the link protocol, used by both.                                                                                                                                                                                                                            |

## Development

Requirements: Node 22.12+ and VS Code 1.101+.

```sh
npm install          # once, at the root: npm workspaces install both packages
npm run build        # build every package
npm run typecheck && npm run lint && npm test
npm run test:e2e     # VS Code extension integration tests
npm run test:e2e:browser  # browser extension end-to-end tests (Chrome for Testing)
npm run package      # vscode-extension/release/*.vsix (committed)
```

Press **F5** and choose **Run VS Code Extension** to try the VS Code extension.

Plans with phase checklists are in [`plans/`](plans/). Guidance for coding agents is in [`AGENTS.md`](AGENTS.md).
