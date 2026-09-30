# AGENTS.md

Guidance for AI coding agents working in this repository. Read it before changing code.

## What this project is

**Inkspect** is a monorepo (npm workspaces) with two products:

| Folder               | What it is                                                                                                                                                                                   | Status                                       |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `vscode-extension/`  | **VS Code Browser** (working name): a full web browser inside a VS Code editor tab                                                                                                           | Built; see `plans/vscode-browser-plan.md`    |
| `browser-extension/` | **Inkspect** for Chrome/Edge/Brave/Firefox: a page toolbar for AI agents (element details, screenshots, drawing, responsive view) and live two-way bookmark sync with the VS Code extension. | Built; see `plans/browser-extension-plan.md` |
| `shared/`            | `@inkspect/shared`: code both products use                                                                                                                                                   | See **Shared package** below                 |

Unless a section says otherwise, the rest of this file is about the VS Code extension, and **paths are relative to `vscode-extension/`**.

The VS Code extension is built for working with AI agents. Its main features:

- An **element selector** that copies element details as context for an agent.
- **Drawing** on the page, then a screenshot of only the drawn area.
- **Screenshots:** viewport, full page, region and element.
- **Device and resolution emulation.**
- **Chrome extensions.**
- **DevTools** and a console/network drawer.
- **Agent tools:** language model tools for VS Code chat, plus an optional MCP server.

The roadmap and the status of each phase are in `plans/vscode-browser-plan.md`. Keep that file up to date when you finish or defer work.

## Architecture

The page is **not** an iframe. A real Chromium does the rendering:

```
Extension host (Node, esbuild → dist/extension.js)
  EngineHost ── puppeteer-core (pipe, CDP) ──► headless Chrome for Testing
  BrowserPanel (one per browser window) ── TabSession (one per page target)
        ▲ typed postMessage (src/shared/protocol.ts)
        ▼
Webview (React 19 + Vite → dist/webview/)
  TabStrip · Toolbar · Viewport <canvas> · overlays (inspector, drawing, region, drawer)
```

**Frames and input**

- Frames: `Page.startScreencast` produces JPEG frames. The host sends them to the webview as a binary `Uint8Array`, and the webview draws them on a canvas.
- Flow control: the webview acks each frame, and only then does the host call `Page.screencastFrameAck`.
- Input: mouse, wheel, keys and IME go from the webview to the host, which forwards them with `Input.dispatch*` and `Input.insertText`.

**Engine and tabs**

- One shared Chromium serves all browser windows.
- Every tab gets its own browser window target (`Target.createTarget newWindow`) and its own `TabSession`.
- Chromium is Chrome for Testing, downloaded into globalStorage on first use. Branded Chrome can't load extensions.

**Where state lives**

- The host is the source of truth for tabs, bookmarks, history, annotations and extensions. The webview is a view that can be rebuilt from host state.
- Internal pages (`vb://newtab`, `history`, `bookmarks`, `downloads`, `settings`, `extensions`) are rendered by React, not by Chromium.

## Repository layout

The repository root:

```
package.json            npm workspaces root: scripts that run in every workspace
vscode-extension/       the VS Code extension (below)
browser-extension/      the browser extension (see "Browser extension" below)
shared/                 @inkspect/shared, used by both
plans/                  roadmaps with phase checklists, one per product; open-issues.md for known open work
brand/                  the logo's SVG source; `npm run logo` renders every product's PNGs
.github/workflows/      CI (runs from the root)
.vscode/                launch config ("Run VS Code Extension") and tasks for the workspace
AGENTS.md, CLAUDE.md    this guidance
```

Inside `vscode-extension/`:

```
src/extension.ts        activate(): wires services, commands, sidebar, agent tools, MCP
src/commands.ts         every command registration (incl. hidden vscodeBrowser.debug.* ones)
src/config.ts           typed getConfig() for all vscodeBrowser.* settings
src/engineHost.ts       starts/stops the shared engine, Chromium download, crash auto-restart
src/browser/            Chromium + CDP: BrowserEngine, TabSession, input mapping, page scripts
src/panel/              BrowserPanel (window with tabs), Tab, inspector, DevTools panel, webview HTML
src/features/           bookmarks, history, sessions, downloads, screenshots, extensions, zoom...
src/agent/              agent tools (tools.ts), MCP (mcpProtocol.ts, mcpServer.ts), send-to-chat
src/sidebar/            Activity Bar views: trees (actions, tabs, bookmarks), Agent Context and Shortcuts webviews
src/shared/             code shared by host AND webview: protocol, url, devices, elementInfo...
webview/src/            React UI: App.tsx, components/, drawing/, pages/ (vb:// pages)
test/unit/              Vitest unit tests (vscode module aliased to test/unit/stubs/vscode.ts)
test/e2e/               integration tests run inside a real VS Code (suite.ts, runTests.mjs)
test/fixtures/          fixture Chrome extension
scripts/sync-tools.mjs  regenerates contributes.languageModelTools from src/agent/tools.ts
media/                  icons, walkthrough Markdown
CHANGELOG.md, README.md the extension's changelog and marketplace README
```

## Commands

Run `npm install` once at the **repository root**; workspaces install everything into the root `node_modules`. The root scripts `build`, `typecheck`, `lint`, `test`, `test:e2e`, `package` and `format` run the matching script in each workspace. Inside `vscode-extension/` (or with `-w vscode-extension` from the root):

```sh
npm run build        # host (esbuild) + webview (Vite), development
npm run typecheck    # tsc for host and webview
npm run lint         # ESLint (flat config, typescript-eslint, react-hooks v7)
npm test             # Vitest unit tests
npm run test:e2e     # integration tests in VS Code; set VSCODE_EXECUTABLE to reuse an install
npm run format       # Prettier
npm run sync:tools   # after editing src/agent/tools.ts
npm run package      # production build + .vsix
```

**Before you call a change done**, run `npm run typecheck && npm run lint && npm test` (from the root or from the workspace). Changes to the browser extension or `shared/` also need `npm run test:e2e:browser`. If the change touches the host/Chromium path, the webview protocol or commands, also run `npm run test:e2e`.

**Integration tests**

- Results go to `vscode-extension/out/e2e/results.log`.
- Failure details are in `vscode-extension/.vscode-test/user-data/logs/*/window1/renderer.log`.
- The test profile keeps its data between runs, so tests must not assume empty stores. For example, check for your own bookmark id, not `bookmarks.length === 0`.

## Module boundaries (hard rules)

- **`src/shared/` has no `vscode` and no `node:` imports.**
  - The webview imports it through the `@shared/*` alias.
  - Put anything used by both sides here, especially message types and pure logic.
- **`webview/` never imports `vscode` or Node modules.** It talks to the host only through `postToHost()` (`webview/src/vscode.ts`).
- **Keep `src/agent/tools.ts` and `src/agent/mcpProtocol.ts` free of `vscode`.** This keeps them unit-testable. Reach the browser through the `BrowserAgentApi` interface.
- **Only `src/browser/` talks CDP.**
  - Use `TabSession` methods and add new ones there; don't send CDP from panel or feature code.
  - `BrowserEngine` owns the process and the browser-level session.
- **Put pure logic in pure modules and unit-test it.** Examples: formatting, geometry, parsing, selectors, validation. Keep VS Code and CDP glue thin.

## Coding patterns

### Host ↔ webview messages

- Every message is a member of `HostToWebview` or `WebviewToHost` in `src/shared/protocol.ts`.
- Every `WebviewToHost` message also needs a **validator entry** (`isString`, `optional(...)`, `oneOf(...)`, `shape(...)`). `BrowserPanel.onMessage` drops anything that fails `isWebviewToHost`.
- To add a message:
  1. Add the type.
  2. Add the validator.
  3. Handle it in `BrowserPanel.handle()`, or in `App.tsx`'s message switch.
- Frames are binary. Never base64 large payloads on the hot path.

### Commands and shortcuts

- Register commands in `src/commands.ts`.
- Declare them in `package.json` (`contributes.commands`, `menus.commandPalette` with a `when`).
- **Every browser shortcut is an action in `SHORTCUT_ACTIONS` (`@inkspect/shared/shortcuts`, re-exported as `src/shared/shortcuts.ts`)**, with an id, a label, a scope (`global` or a mode) and default keys. The browser extension's toolbar uses the same actions and the same key map (the ones it handles are `TOOLBAR_ACTION_IDS` in `@inkspect/shared/shortcuts`; the shortcut lists tag each action VS and/or BR from it):
  - The webview dispatches them (`webview/src/shortcuts.ts`, one capture-phase listener), so users can remap any of them in the **Shortcuts** sidebar view (`src/sidebar/ShortcutsView.ts`). The map is the `vscodeBrowser.shortcuts` setting, synced by VS Code Settings Sync and, through the bridge, the browser extension's `chrome.storage.sync`.
  - Don't add browser keys to `contributes.keybindings`. The only exceptions are actions marked `everywhere` (they must also work outside the browser); inside it, the webview consumes the key first, so they run once. A unit test checks that the keybindings match the `everywhere` actions, that ids are unique, that host commands exist, and that the defaults don't conflict.
  - Actions with a `command` run it through the host (the `command` message, allowed only for registry commands). Other actions are handled in the webview (`webview/src/actions.ts`, or a mode component registering its handlers).
  - Modes that take over the page use plain keys; modes that leave the page usable (console, device, overlay, record) use Alt+ keys.
  - Show keys with `shortcutLabel()` / `withShortcut()`, never hard-coded, so remapped keys show everywhere.
- Commands that tests call return useful values: `screenshot()` returns the saved path, and `runDevAction()` returns the copied text.
- Hidden test hooks live under `vscodeBrowser.debug.*`: `state`, `copyElementAt`, `setAnnotations`, `crashEngine`, `mcp`, `bridge` (its `approve` option stands in for a Pair click). They are not declared in `package.json`.

### Settings

- Add every setting in two places: `contributes.configuration` (with a `markdownDescription`) and the typed `getConfig()` in `src/config.ts`.
- Read settings through `getConfig()`, not `workspace.getConfiguration` scattered in code.

### Sending to the agent

- Every capture (picked element, screenshot, recording, Copy-for-AI text, report) goes into the Agent Context list with `addContext()`, and every "send to agent" goes through `captureAndSend()` / `sendContextItem()` (`src/agent/chat.ts`), so everything sent also shows in the **Agent Context** view.
- Terminal sends go only to terminals where `AgentTerminals` (`src/features/terminalSend.ts`) found an agent, or that the user picked. Never type into a plain shell by default, and don't focus the terminal. Agent recognition is pure and unit-tested (`src/agent/agentDetect.ts`).

### Agent tools

- Tools are defined once in `BROWSER_TOOLS` (`src/agent/tools.ts`) and serve both the LM tools and MCP.
- After changing a tool, run `npm run sync:tools`. A unit test fails if `package.json` drifts.
- Tool errors are thrown as `Error`s with messages written for the model.
- Tools never read cookies or storage, run arbitrary scripts, or click or type unless there is a confirmation. Navigation goes through `agentUrl()`, which allows http, https and file only.

### Page scripts

- Code injected into pages is a fixed, bundled string or a `Function.toString()` from `src/browser/pageScripts.ts` or `inspectorScripts.ts`. Arguments go in as JSON.
- Never build page code from user or page input.
- Injected functions must be self-contained: no closures over module-level helpers. They must still work after production minification, and the integration tests pass on both builds.

### Persistence

- Global data (bookmarks, history) uses `JsonStore` (debounced atomic writes) in globalStorage.
- Per-workspace session data goes in `workspaceState`, and small preferences in `globalState`. Secrets (the MCP token) go in `context.secrets`.
- Write into the workspace only through `localWorkspaceFolder()` (`src/features/screenshots.ts`). The extension runs on the UI side, so remote workspaces must fall back to globalStorage.

### React webview

- Use function components and hooks, and follow the react-hooks v7 lint rules:
  - Never call `setState` synchronously inside an effect. Derive the value during render, or adjust state while rendering.
  - Never read refs during render.
- **Design system (both products):**
  - Build UI from the shared components in `@inkspect/shared/ui`: `Button`, `IconButton`, `TextField`, `Field`, `Select`, `Switch`, `Checkbox`, `Segmented`, `Slider`, `ColorPicker`, `Menu`.
  - Don't use native `<select>`, checkboxes, range or color inputs, or hand-styled `<button>`s. If a control is missing, add it to the kit (keyboard support, ARIA roles, a shared stylesheet rule) rather than styling one in place.
  - Sizes, radii, spacing, surfaces, shadows and motion come from the `--ink-*` tokens in `shared/src/ui/ui.css`. Don't hard-code new values.
  - Popups are portaled (`portalTarget`) and marked `data-ink-popup`; popovers that close on outside clicks must ignore them (`isInPopup`).
  - `vb://` pages use `PageLayout`, `EmptyState` and `SiteIcon` (`webview/src/pages/PageLayout.tsx`) and group content in `.card`s.
- **Styling:**
  - Style with VS Code theme variables (`var(--vscode-*)`) through the tokens. Component styles live in `shared/src/ui/ui.css`, layout in `webview/src/styles.css`. Use codicons for icons.
  - Hosts outside VS Code (the browser extension's pages) get the variables from `shared/src/ui/theme.css` (`.ink-theme`).
  - Hard-coded colors are only for things drawn over page content.
  - Add high-contrast rules under `body.vscode-high-contrast`.
- **Accessibility:**
  - Every icon-only control needs an accessible name. `IconButton` takes `label`; otherwise use `aria-label`.
  - Toggles use `aria-pressed`, and menus use `role="menu"`/`menuitem` with arrow-key navigation.
- **Coordinates:**
  - Keep overlay geometry in page CSS pixels. Map it through the viewport mapper (`toLocal`, scale, scroll).
  - Store annotation shapes in **document** coordinates so they stay anchored when the page scrolls.

### Errors and logging

- Log through the `LogOutputChannel` ("VS Code Browser"). Use `errorMessage(error)` from `src/browser/logger.ts` to stringify errors.
- User-facing failures from the webview become a toast. Host command failures use VS Code notifications.
- A tab whose session dies because the engine went away is kept (`engineLost`) and reloads when the engine starts again. Don't remove tabs on engine restarts.

## Style rules

- **TypeScript:** strict, ES modules, and `import type` for type-only imports. No `any`; use `unknown` and narrow it.
- **Prettier** settings: single quotes, 100-column print width, trailing commas. Also 2-space indent, LF line endings and a final newline.
- **Naming:** `PascalCase` for classes, components and their files (`BrowserPanel.ts`, `DevDrawer.tsx`). `camelCase` for other modules (`pageScripts.ts`). `SCREAMING_SNAKE_CASE` for constant tables (`BROWSER_TOOLS`).
- **Comments:** a doc comment on each exported function or class that says _why_ or what the contract is, not what the next line does. Keep the existing sparse density.
- **Language:** plain English in UI text, settings descriptions and docs. UI text uses sentence case. Command titles use Title Case in the `Browser:` category.
- **Changes:** keep them focused. Match the surrounding code rather than introducing new patterns or libraries. The stack is fixed:
  - React 19, Vite 8, esbuild
  - TypeScript ~6.0 (typescript-eslint doesn't support 7 yet)
  - Vitest, ESLint 10, puppeteer-core
  - `@types/vscode` ~1.101 (`engines.vscode ^1.101.0`)
- **Newer VS Code APIs** than 1.101: feature-detect them at runtime (see `LanguageModelDataPart` in `src/agent/languageModelTools.ts`). Don't raise the engine version casually.

## Security rules

- Keep the webview CSP strict: a nonce for scripts, and `localResourceRoots` limited to `dist/webview`.
- Validate every webview message. Treat page content, extension manifests and MCP requests as untrusted input.
- The DevTools debugging port and the MCP server bind to **127.0.0.1 only**.
  - The MCP server requires a bearer token (compared in constant time) and checks Host and Origin.
  - Keep all of these checks.
- No detection-evasion features. Sites that block automated browsers get the "Open in system browser" fallback, not workarounds.

## Shared package (`shared/`, `@inkspect/shared`)

- **What it holds:**
  - element details and selectors (`elementInfo`, `collect`)
  - drawing (`annotations`, `drawing/render`, `drawing/composite`, `ui/DrawingLayer`, `ui/DrawToolbar`)
  - `devices`, Copy-for-AI formats (`devtools`), `color`
  - the bookmark merge (`bookmarkSync`) and the link protocol (`bridge`)
  - the UI kit: components (`ui/Button`, `ui/Select`, `ui/TextField`...), tokens and styles (`ui/ui.css`), and theme variables for non-VS Code hosts (`ui/theme.css`)
- **Imports:** `@inkspect/shared/<module>` or `@inkspect/shared/ui/<Component>`. The package exports TypeScript source; each product's bundler compiles it.
- **No `vscode` or `chrome` imports, no Node-only APIs.** DOM APIs are fine, since both products run the code in pages or webviews.
- **`collectElementDetails` must stay self-contained:** everything comes in through its parameters. The VS Code extension sends it to Chromium as source text (`toString()`), which only works for self-contained functions, including after minification.
- **Tests and rules:**
  - Unit tests live in `shared/test/`.
  - Changes to `bookmarkSync` must keep the randomized convergence test passing.
  - Changes to `bridge` must keep both ends validating every message.
  - The VS Code extension's old paths (`src/shared/elementInfo.ts`, `webview/src/drawing/*`...) are one-line re-exports. Add new shared code to `shared/`, not there.

## Browser extension (`browser-extension/`)

**What it does:** a toolbar on any page (opened with Alt+Shift+K, or from the popup of the toolbar button), the link to VS Code, bookmark sync, and the full page (`options.html`: VS Code and its windows, shortcuts, about).

**Shortcuts:** the toolbar dispatches VS Code Browser's shortcut actions (the ones it handles are `TOOLBAR_ACTION_IDS` in `@inkspect/shared/shortcuts`), with the same key map: sync storage (`inkspectShortcuts`), synced both ways through the link. Edit them with the shared `ShortcutList` (`@inkspect/shared/ui/ShortcutList`), in the toolbar's panel or on the full page. Save with `setShortcutKeys()`, which stamps a newer time so the change wins over VS Code's copy.

**Architecture:**

- **Background** (`src/background/`): the MV3 service worker (Firefox: background scripts). It handles:
  - the shortcut and the toolbar button
  - injecting the toolbar on demand (`activeTab` + `scripting`), including the MAIN-world helper
  - `captureVisibleTab` (queued to Chrome's limit of about 2 per second)
  - the responsive view's emulation (`chrome.debugger`: user agent, touch, network, CPU, media) and its framing rule (`declarativeNetRequest` session rule, see below)
  - the VS Code link client (`bridge.ts`) and the browser half of bookmark sync (`bookmarks.ts`)
- **Content** (`src/content/`): the toolbar is React in a **closed** shadow root on `<inkspect-toolbar>`. It holds the inspector, drawing, region select, panels, the responsive view (`ResponsiveView.tsx`), and capture and stitching (`capture.ts`).
  - The toolbar is a **full-width bar at the top**, and the page moves down to make room (`pagePush.ts`: the `html` margin, plus fixed and sticky elements anchored at the top). Anything measuring the page (captures) uses `pushOffset()`.
  - The **responsive view** shows the page in a device-sized `<iframe>` of the same tab, centered and scaled to fit. The debugger's device metrics can't do this: they always draw the page at the tab's top-left. While it is open, a session rule drops `X-Frame-Options` and `Content-Security-Policy` for frames of the page's own origin, **in that tab only**, and it is removed when the view closes. The frame is sandboxed without scripted top navigation, so frame-busting scripts can't end the view. Tools that act on the page (picker, drawing, console, page context) don't reach into the frame yet and are disabled while it is open.
- **MAIN world** (`src/main-world/`): runs in the page's own JS world. It collects element details (framework components are only visible there) and hooks console, errors, `fetch` and XHR.

**Rules:**

- **Messaging:**
  - Content ↔ background: typed `chrome.runtime` messages (`src/messages.ts`, `toBackground()`).
  - Content ↔ page: DOM events carrying JSON **strings** (`pageRequest()`), so nothing depends on how browsers share objects between worlds.
  - Nothing is ever exposed to the page's JS.
- **Styling:** stylesheets are bundled as text into the shadow root. The shared components use VS Code theme variables, defined in `toolbar.css` for light and dark. Icons are codicons, whose font is registered from bytes (`FontFace`), because `@font-face` doesn't work inside shadow roots and URLs can be blocked by page CSP.
- **Hide the toolbar during captures** (`hideUi`), and never capture our own UI.
- **Manifests:** `manifest/base.json` plus `chrome.json` / `firefox.json`, merged by `scripts/manifest.mjs` (unit-tested). Keep required permissions minimal: pages are reached through `activeTab` only (no host permissions), and only Chrome gets `debugger`.
- **Test hooks:**
  - The **test build** (`--test`, `dist/chrome-test`) adds host access (tests can't press the shortcut that grants `activeTab`) and opens the shadow root.
  - The open root hides bugs of the real build: from outside a **closed** shadow root, events don't show what they hit inside it (`composedPath()` stops at the host). Judge "inside our UI" from the root (`listenOutside` in `shared/src/ui/popover.tsx`), and keep the real-build tests in `test/e2e/run.mjs` passing: they open the real build through its button (`Extensions.triggerAction`) and click through DevTools-protocol boxes.
  - `globalThis.__inkspectTest` in the background exposes `toggleToolbar`, `reconnect`, `pair`, `bridgeStatus` and `syncState`.
  - Never ship the test build.
- **Checks:** `npm run test:e2e:browser` must pass. It runs Chrome for Testing with the unpacked extension against a fixture site and a fake VS Code link that uses the real merge code.

## Housekeeping

- Update the product's `CHANGELOG.md` (Unreleased) and the relevant phase in its plan under `plans/` when you add or finish a feature. Mark deferred items `[ ]` with a short reason. Known problems not fixed yet go in `plans/open-issues.md` (tick them when done).
- **Shared code goes in `shared/`**, not copied between products (see **Shared package**).
- **Never add yourself (the AI agent) as an author, co-author or contributor.** This applies to commits, pull requests, docs and `package.json`:
  - no `Co-Authored-By:` trailers
  - no "Generated with …" lines
  - no agent names in `contributors`
  - Commits use the maintainer's git identity only.
- Don't commit, push or publish unless you are asked to. Don't change the extension name or publisher, add a license, or bump the engine version without the maintainer's decision.
