# Inkspect Browser Extension: Plan

## Goal

A browser extension for **Chrome, Edge, Brave, Vivaldi, Opera and Firefox**. A keyboard shortcut opens a **floating toolbar on the current page**. It offers the tools of the VS Code browser (`vscode-extension/`):

- element selector (copy details for AI agents)
- drawing with area screenshots
- full-page, viewport, region and element screenshots
- device and resolution emulation
- console and network capture with **Copy for AI**
- **Send to VS Code**: to chat, to a terminal agent, or saved into the workspace

It also links to the VS Code extension. **Bookmarks sync both ways**: a bookmark added in the browser shows up in VS Code, and a bookmark added in VS Code shows up in the browser.

**Status:** Phases 0–9 are built and tested, with the gaps listed in each phase. Phase 10 (browsers other than Chrome) and store publishing are open.

This plan lives next to `plans/vscode-browser-plan.md`. Tasks that change the VS Code extension are marked **[vscode]**.

---

## Architecture

```
┌──────────────── Browser (Chrome / Edge / Brave / Firefox) ────────────────┐
│ Background (MV3 service worker; Firefox: event page)                      │
│   commands (shortcut) · tabs · bookmarks · downloads · debugger (opt.)     │
│   Bridge client ── WebSocket ─────────────────────────────┐                │
│   Screenshot service (captureVisibleTab / debugger)        │                │
│ Content script (injected on demand into the active tab)    │                │
│   Shadow-DOM React toolbar · inspector overlay · drawing   │                │
│   canvas · region selector                                 │                │
│ MAIN-world helpers (framework detection, console hooks)    │                │
│ Offscreen document (Chrome): clipboard images, canvas work │                │
│ Options page: pairing, shortcuts, sync settings            │                │
└────────────────────────────────────────────────────────────┼────────────────┘
                                                             │ ws://127.0.0.1:<port>/bridge
┌──────────────── VS Code (vscode-extension/) ───────────────┼────────────────┐
│ Bridge server (127.0.0.1, pairing token, origin allow-list) ◄┘              │
│   bookmarks sync · receive screenshots/elements · send to chat/terminal     │
│   agent tools that target the real browser tab (via MCP / LM tools)         │
└─────────────────────────────────────────────────────────────────────────────┘
Shared code: shared/ workspace package (@inkspect/shared)
```

**Principles**
- **Runs only when invoked.** Nothing is injected into pages until you press the shortcut or click the toolbar button (`activeTab` + `scripting`). There is no always-on content script on every site.
- **Isolated UI.** The toolbar and overlays render in a closed Shadow DOM, so page CSS can't break them and they don't break the page.
- **Same logic as the VS Code extension.** Element details, selectors, Markdown formats, drawing shapes and rendering, device presets and Copy-for-AI formats come from one shared package, so both products produce identical output.
- **Minimal permissions.** Powerful permissions (`debugger`, `<all_urls>` host access, `webRequest`) are **optional** and requested the first time a feature needs them, with an explanation.
- **Private by default.** Page content only goes to your own VS Code over `127.0.0.1`, and only after pairing. No remote servers, no analytics.

**Repository layout (target)**

```
package.json                npm workspaces: vscode-extension, browser-extension, shared
shared/                     @inkspect/shared: pure TS used by both products
  src/elementInfo.ts, selectors.ts, inspectorCollect.ts, annotations.ts, drawing/render.ts,
      devices.ts, devtools.ts, bookmarks/model.ts, bookmarks/merge.ts, bridge/protocol.ts
vscode-extension/           the VS Code extension (imports @inkspect/shared)
browser-extension/
  manifest/                 base.json + chrome.json + firefox.json overlays
  scripts/build.mjs         Vite multi-entry build → dist/chrome, dist/firefox
  src/background/           service worker: commands, bridge client, screenshots, bookmarks sync
  src/content/              toolbar (React in Shadow DOM), inspector, drawing, region select
  src/main-world/           page-context helpers (frameworks, console hooks)
  src/offscreen/            clipboard and canvas helpers (Chrome)
  src/options/              options page (pairing, sync, shortcuts, permissions)
  test/unit, test/e2e       Vitest; Puppeteer + Chrome for Testing with the unpacked extension
```

---

## Feature parity map

| VS Code browser feature | In the browser extension | How |
|---|---|---|
| Element selector: hover highlight + tooltip | ✅ | Own overlay (box model from `getComputedStyle` and `getBoundingClientRect`) with a Chrome-style tooltip. Optional **"DevTools inspect mode"** uses `chrome.debugger` + `Overlay.setInspectMode`, which is exactly what the VS Code version does (shows Chrome's debugging bar) |
| Copy details (Markdown/JSON/selector/HTML), multi-select, ↑/↓, Alt+click screenshot | ✅ | Shared `inspectorCollect` + `elementInfo` |
| Framework component + source file | ✅ | MAIN-world script (React fiber, Vue, Svelte, Angular expandos aren't visible from the isolated world) |
| Drawing tools, undo/redo, document-anchored | ✅ | Canvas overlay in the page; shared `annotations` + `drawing/render` |
| Screenshot drawing area / per group / annotated viewport or page | ✅ | Capture + composite (shared `composite`) |
| Viewport screenshot | ✅ | `tabs.captureVisibleTab` |
| Region / element screenshot | ✅ | Capture + crop at device pixel ratio; scroll-stitch when taller than the viewport |
| Full-page screenshot | ✅ | Scroll-and-stitch (sticky/fixed elements hidden after the first tile). Optional `debugger` mode uses `Page.captureScreenshot` with `captureBeyondViewport` for pixel-exact results |
| Device emulation (size, DPR, touch, mobile UA) | ✅ (two modes) | **Window mode**: open the tab in a resizable popup window at the chosen size (no banner; no DPR/touch/UA). **Full emulation**: `chrome.debugger` + `Emulation.*` (shows the debugging bar) |
| Responsive mode with drag handles and breakpoints | ✅ | Full emulation plus an in-page frame, or window mode |
| Network / CPU throttling, color scheme, print media | ✅ (debugger) / partial | `Network.emulateNetworkConditions`, `Emulation.setCPUThrottlingRate`, `Emulation.setEmulatedMedia` |
| Console errors + Copy for AI | ✅ | MAIN-world hooks (`console.*`, `error`, `unhandledrejection`) injected while the toolbar is on; or `debugger` (`Runtime`/`Log`) for full history |
| Failed requests + Copy for AI | ✅ | `webRequest.onErrorOccurred` / `onCompleted` (status ≥ 400) with optional host permission; or `debugger` `Network.*` |
| Copy page context | ✅ | URL, title, viewport, selection, errors, failed requests |
| Send to chat / terminal agent | ✅ via bridge | VS Code opens chat with the text or image, or types the screenshot path into a terminal |
| Save screenshots into the workspace | ✅ via bridge | Bytes sent to VS Code and saved in `.vscode-browser/screenshots/` |
| Bookmarks | ✅ **two-way sync** | `chrome.bookmarks` ↔ VS Code bookmarks over the bridge |
| Agent tools (navigate, screenshot, get element, console errors…) | ✅ via bridge | VS Code's LM tools/MCP can target "the real browser tab" as well as the built-in browser |
| Chrome extensions, tabs, history, downloads, DevTools | n/a | The browser already has these |

**Pages the extension can't touch:** `chrome://`, `edge://`, `about:`, the Chrome Web Store, and the built-in PDF viewer. The toolbar shows a short note there instead.

---

## VS Code ↔ extension bridge

- **Transport:** WebSocket to `ws://127.0.0.1:<port>/bridge`.
  - Chrome's MV3 service workers stay alive while a WebSocket is active (Chrome 116+) with a 20-second keep-alive ping. Firefox's event page keeps it too.
  - **[vscode]** The server uses the `ws` package (the extension's first runtime dependency besides puppeteer), or reuses the MCP HTTP server as an upgrade handler.
- **Port:** a fixed default (setting `vscodeBrowser.bridge.port`, default **47110**) so the extension can find it. The extension tries the configured port and the next 4.
- **Several VS Code windows:** the first window that binds the port serves the bridge. The others keep working through the shared bookmark store on disk. **[vscode]** `BookmarksStore` watches its JSON file and reloads on external changes, which also fixes stale bookmarks across windows today.
- **Pairing (one time per browser profile):**
  1. **[vscode]** **Browser: Connect Browser Extension** shows a 6-digit code (valid for 2 minutes).
  2. The extension's toolbar or options page asks for the code, sends it, and receives a long-lived token. The token is kept in `chrome.storage.local` on the browser side and in `context.secrets` in VS Code.
  3. VS Code records the extension's origin (`chrome-extension://<id>` / `moz-extension://<uuid>`) and accepts only paired origins with a valid token. Host and Origin are checked, as the MCP server does.
- **Protocol** (`@inkspect/shared/bridge/protocol.ts`): versioned JSON `{ v, id?, type, ... }` with requests/responses (`id`) and events. The message groups are:
  - `hello`, `pair`, `ping`
  - `bookmarks.snapshot`, `bookmarks.ops`, `bookmarks.ack`
  - `send.chat`, `send.terminal`, `save.screenshot`
  - `agent.request` / `agent.result` (tools targeting the browser tab)
  - Every message is validated on receipt, the same way webview messages are validated today.
- **Status:** the toolbar shows a VS Code link indicator (connected / not paired / VS Code not running). **[vscode]** A status bar item shows connected browsers.

---

## Bookmark sync design

- **What syncs:**
  - Default: the whole tree. The VS Code **Bookmarks Bar** maps to the browser's bookmarks bar, and **Other Bookmarks** to its other bookmarks. Mobile bookmarks stay read-only in a folder.
  - Alternative: one chosen folder on each side.
- **Signed-in Chrome:** Chrome has both *account* and *local* bookmark roots (`chrome.bookmarks` exposes `folderType` and `syncing`). By default, sync maps to the **account** roots when present, so bookmarks also reach your other devices through Chrome Sync. A setting can switch to local roots.
- **Several browsers:** each linked browser profile has its own link record, and VS Code acts as the hub. A bookmark added in Chrome reaches VS Code, then Edge.
- **Link record** (**[vscode]**, stored with the bookmarks):
  - browser profile id and name
  - the id map (VS Code id ↔ browser id)
  - a **base snapshot** of the last synced state
- **Live changes:**
  - Browser: `bookmarks.onCreated/onChanged/onMoved/onRemoved/onChildrenReordered`, plus `onImportBegan/Ended` to batch imports.
  - VS Code: the store emits an operation log.
  - Operations are `create`, `update` (title/url), `move` (parent, index) and `remove`. Each carries its origin, so applying a remote operation never echoes back.
- **Reconnect and first link:**
  - The two sides reconcile with a **three-way merge** against the base snapshot. Changes on only one side apply. Both sides editing the same field means the later edit wins, recorded in a sync log. An edit beats a delete; the bookmark is kept.
  - First link offers: **Merge** (default; de-duplicates by URL within the same folder path), **Use the browser's bookmarks**, or **Use VS Code's bookmarks**. The last two show exact counts and need confirmation.
- **Safety:**
  - Before the first sync and before any bulk replace, VS Code writes an HTML export backup to globalStorage (keeps 5).
  - Bulk deletions over 20 items ask for confirmation.
  - The merge logic is pure and unit-tested (`@inkspect/shared/bookmarks/merge.ts`).
- **Firefox:** the same code through `browser.bookmarks`, with `toolbar_____` mapped to the bar and `unfiled_____` to Other.

---

## Permissions

| Permission | When | Why |
|---|---|---|
| `activeTab`, `scripting` | always | Inject the toolbar into the tab you invoked it on |
| `storage` | always | Settings, pairing token, per-tab tool state |
| `commands` | always (manifest) | The keyboard shortcut |
| `bookmarks` | always | Bookmark sync |
| `downloads` | always | Save screenshots when VS Code isn't linked |
| `clipboardWrite`, `offscreen` (Chrome) | always | Copy text and images |
| `debugger` | **optional**, on first use | DevTools inspect mode, full emulation, exact full-page capture, full console/network history |
| `<all_urls>` host access | **optional** | Full-page stitching across navigations, console capture from page start, `webRequest` failures |
| `webRequest` | **optional** | Failed-request capture without `debugger` |

---

## Phase 0: Monorepo, shared package and scaffold

- [x] Repository split into `vscode-extension/` and `browser-extension/` with npm workspaces at the root. Root scripts run in every workspace, and CI runs from the root.
- [x] `shared/` workspace (`@inkspect/shared`):
  - **Modules:** `elementInfo`, `collect`, `annotations`, `drawing/render` and `composite`, `devices`, `devtools`, `color`, `bookmarkSync`, `bridge`.
  - **UI components:** `DrawingLayer`, `DrawToolbar`, `Menu`, `IconButton`, and `ui.css`.
  - The collector is now one real function. VS Code sends it over CDP via `toString()` (checked on development and minified builds); the extension calls it directly.
  - **[vscode]** The old paths re-export from the shared package, so imports didn't change.
- [x] Build: esbuild multi-entry (background, content, main-world, options), classic scripts, CSS inlined as text.
  - `scripts/build.mjs` merges `manifest/base.json` with the `chrome.json` / `firefox.json` overlays into `dist/chrome` and `dist/firefox`.
  - `--watch`, `--production`, and `--test` (host access and an open shadow root for the end-to-end tests).
- [x] ESLint, strict TypeScript, Vitest and Prettier per workspace.
- [x] CI: typecheck, lint and unit tests for all workspaces; the extension's end-to-end tests; zipped Chrome and Firefox builds as artifacts.
- [x] Icons (16/32/48/128) rendered from the VS Code extension's icon SVG.
- [ ] Final product name: still open. It's "Inkspect" for now.

## Phase 1: Toolbar shell

- [x] **Opening it:** shortcut `toggle-toolbar` (Alt+Shift+I) and the toolbar button. The toolbar is injected on demand (`activeTab` + `scripting`) with its MAIN-world helper.
- [x] **The toolbar:**
  - React in a **closed** shadow root on a custom element, so page CSS can't reach it.
  - Draggable; follows the system light/dark theme through VS Code theme variables.
  - The codicon font is registered from bytes (`FontFace`), so page CSP can't block it.
  - Hidden during captures.
- [x] **Buttons:** Select element, Draw, Screenshot ▾, Devices, Console & network, Copy page context, Bookmark this page, VS Code link, Close.
- [x] **Keys:** Esc leaves the current tool; drawing tool letters and Ctrl+Z/Y as in VS Code.
- [x] **Unsupported pages** (`chrome://`, the Web Store, the PDF viewer): the toolbar button shows ✕ with an explanation.
- [x] **Options page:** VS Code pairing, copy format, HTML length, drawing padding, a shortcut link.
- [ ] Not done yet:
  - docking to the top or bottom edge, and collapsing to a pill
  - remembering "open" per tab across full navigations (press the shortcut again after navigating)

## Phase 2: Element selector

- [x] **Hover:** box-model overlay in DevTools colors, and a tooltip like Chrome's: tag#id.classes, size, color, font, background, margin, padding, contrast (WCAG ratio with an AA check), accessible name, role, keyboard-focusable. Page clicks are blocked while picking.
- [x] **Actions:**
  - click copies (shared formats and fields)
  - Shift+click builds a numbered multi-selection; Enter copies it
  - Alt+click adds an element screenshot
  - Ctrl+click sends to VS Code chat
  - ↑/↓ move to the parent or child (stepping out of and into shadow roots); Esc exits
- [x] **Framework components and source files** come from the MAIN-world helper through the shared collector. If the helper doesn't answer, the isolated-world collector runs without components.
- [ ] Not done yet:
  - picking inside cross-origin iframes (the iframe itself is picked)
  - the optional "DevTools inspect mode" through `chrome.debugger`

## Phase 3: Screenshots

- [x] **Viewport:** `captureVisibleTab`, queued to Chrome's limit of about 2 captures per second.
- [x] **Region:** drag a rectangle with a W×H readout.
- [x] **Element:** its box, stitched if it's taller than the viewport.
- [x] **Full page:** scroll-and-stitch; fixed and sticky elements are hidden after the first tile; the scroll position is restored; the result is scaled to fit the canvas limits.
- [x] **Output:** the image is copied (secure pages), and a toast offers Send to terminal / Send to chat / Save to VS Code / Download. When VS Code isn't linked and copying isn't possible, the image is downloaded to `Downloads/Inkspect/`.
- [ ] Not done yet:
  - the exact full-page mode through the debugger
  - triggering lazy-loaded content before stitching

**End-to-end tests:** viewport and full-page images are copied, and the full page is at least as tall as the document.

## Phase 4: Drawing and annotation

- [x] **Drawing layer:** the shared `DrawingLayer` and `DrawToolbar` over the page, anchored to the document (follows scrolling), with every tool, style, undo/redo and tool shortcut.
- [x] **Captures:** Screenshot drawing area, each drawing separately, drawing area without drawings, annotated viewport, and annotated full page (shared `captureArea` / `clusterShapes` / `compositeScreenshot`).
- [ ] Drawings are kept while the toolbar is open. They aren't kept across navigations.

**End-to-end tests:** the drawing-area image is the stroke plus 40 px of padding.

## Phase 5: Devices and resolutions

- [x] **Resize window:** moves the tab into a popup window whose page area matches the chosen size; "Restore window" puts it back.
- [x] **Full emulation** (Chrome, through `chrome.debugger`):
  - shared device presets or a custom size; pixel ratio; rotate
  - touch plus mobile user agent
  - network and CPU throttling; color scheme; print media
  - "Stop emulating" detaches, and closing Chrome's debugging bar is handled
- [ ] Not done yet:
  - the in-page responsive frame with drag handles and breakpoint bar (the emulated page renders at the top left)
  - `debugger` is a required permission in the Chrome build (optional permissions can't be requested from a content script)

## Phase 6: Console and network

- [x] **MAIN-world hooks** (installed when the toolbar first opens on a page): `console.*` with call sites, uncaught errors, unhandled rejections, `fetch`/XHR status and failures, and failed resource loads.
- [x] **Panel:** Console and Failed-requests views. Copy errors, Copy failed requests and Copy page context read the log fresh when clicked; Send to chat is also there.
- [ ] Not done yet:
  - capture from page start (a registered content script with host permission)
  - `webRequest` / debugger `Network.*` for requests the page's own JS doesn't make

**End-to-end tests:** `console.error` and a 404 fetch are captured and copied.

## Phase 7: VS Code bridge

- [x] **[vscode]** `BridgeServer`:
  - `ws` WebSocket on 127.0.0.1 (`vscodeBrowser.bridge.port`, default 47110); only one VS Code window serves it.
  - Host, Origin and path checks, so web pages are refused.
  - 6-digit pairing codes valid for 2 minutes; tokens stored only as hashes, with the paired origin.
  - A status bar item, and **Connect Browser Extension** / **Unlink All Browser Extensions**.
- [x] **Extension client:**
  - tries the port and the next 4, with backoff
  - 20 s keep-alive (keeps Chrome's service worker alive while linked)
  - pairing from the toolbar or the settings page; unpairing
- [x] **Shared protocol** (`@inkspect/shared/bridge`): versioned; every message is validated on receipt; unit tests.
- [ ] **[vscode]** `BookmarksStore` doesn't yet reload when another VS Code window changes its file.

**Tests:** in the extension's end-to-end tests, pairing, reconnecting, and a wrong token or code. In the VS Code integration tests, pairing, and refusing a web-page origin or a bad token.

## Phase 8: Bookmark sync

- [x] **Three-way merge** in `@inkspect/shared/bookmarkSync`. Tests cover:
  - first link (merge / use the browser's / use VS Code's)
  - adds, renames, moves and deletes on either side
  - conflicting renames (the browser wins)
  - edit beats delete; reviving a deleted folder with a new child; reordering
  - a randomized test: 200 seeds × 20 rounds, always converging with nothing lost
- [x] **Browser side:** `chrome.bookmarks` snapshot and apply, preferring the **account** roots in signed-in Chrome. Change events trigger a debounced resync, and changes made while VS Code's operations are being applied are not lost.
- [x] **[vscode]** One link per browser (VS Code is the hub). The first link asks which mode to use and saves an HTML backup. Removing more than 20 bookmarks also saves a backup (the last 5 are kept).
- [ ] Not done yet:
  - syncing a single chosen folder instead of the whole tree
  - a sync log UI, and a per-browser pause (only the global `vscodeBrowser.bridge.syncBookmarks` setting exists)
  - Firefox's "Bookmarks Menu" root (the toolbar and Other Bookmarks sync)

**End-to-end tests:** VS Code's bookmark appears in Chrome; Chrome's reaches VS Code; a VS Code rename reaches Chrome; nothing is duplicated.

## Phase 9: Send to VS Code and agent tools

- [x] **Screenshots** (every kind, and drawings) go to a terminal agent (the path is typed into the chosen terminal), to chat (attached), or into the workspace (`.vscode-browser/screenshots/`).
- [x] **Element details and console summaries** go to chat, or to a terminal agent as a Markdown file in `.vscode-browser/context/`.
- [x] Clipboard fallback everywhere when VS Code isn't linked.
- [ ] Not done yet: **[vscode]** agent tools that target the real browser tab through the link (navigate, screenshot, get element, console errors).

## Phase 10: Browser coverage

- [x] **Firefox build:** MV3 background scripts, a gecko id, no `debugger`, and the "Resize window" device mode only.
- [ ] Not tested in Firefox yet: Firefox isn't installed on the development machine.
- [ ] Not smoke-tested yet in Edge, Brave, Vivaldi or Opera. The Chrome build should load unpacked in all of them.
- [ ] Safari: out of scope.

## Phase 11: Quality and release

- [x] **Tests:**
  - unit tests: shared (47) and extension (4)
  - end-to-end: 6 tests in Chrome for Testing with the unpacked extension, a fixture site and a fake VS Code link running the real merge code
  - **[vscode]** the link integration test
- [x] Visual check of the toolbar, inspector tooltip, drawing toolbar and panels (headless screenshots).
- [ ] Not done yet:
  - accessibility pass (keyboard-only walkthrough), and high-contrast pages
  - performance measurements
  - privacy policy and store listings (Chrome Web Store, Edge Add-ons, Firefox AMO); publishing is waiting on the name and license decisions

---

## Milestones

| Milestone | Phases | Result |
|---|---|---|
| B1 Toolbar | 0–1 | Shortcut toolbar on any page, shared package in place |
| B2 AI context tools | 2–4 | Element selector, screenshots and drawing in the real browser |
| B3 Dev tools | 5–6 | Devices, console and network |
| B4 Linked | 7–9 | VS Code bridge, two-way bookmark sync, send to agents, agent tools on the real tab |
| B5 Ship | 10–11 | All browsers, tests, stores |

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| MV3 service worker suspended, dropping the bridge | WebSocket keep-alive (Chrome 116+), reconnect with backoff, reconcile from the base snapshot on reconnect |
| The `debugger` permission shows a "debugging this browser" bar and scares users | Optional permission; every feature has a no-debugger mode; the reason is explained before asking |
| Bookmark sync loses or duplicates data | Three-way merge with a base snapshot, tested exhaustively; backups before first sync and bulk changes; confirmation for bulk deletes; pause switch; sync log |
| Chrome's account and local bookmark roots | Map to account roots when signed in (setting to change); tested with both |
| Stitched full-page screenshots (sticky headers, lazy content, infinite scroll) | Hide fixed/sticky elements after the first tile, height cap, optional exact debugger mode |
| Page CSS or CSP interfering with the toolbar | Closed Shadow DOM, constructable stylesheets, no inline scripts, MAIN-world code injected by the extension |
| Store review and permissions scrutiny | Minimal required permissions, optional ones requested in context, clear privacy policy |
| Several VS Code windows | One window serves the bridge; the others share the bookmark file, which is now watched |

## Decisions to confirm

- **Product name:** the repository is *Inkspect*. Should both products use it, with the VS Code extension renamed from "VS Code Browser"?
- **Default shortcut:** Alt+Shift+I, or another.
- **Default sync mapping** for signed-in Chrome: account roots (recommended) or local roots.
- **Bridge port:** 47110 by default.
- **Publishing:** Chrome Web Store / Edge Add-ons / Firefox AMO, or unpacked installs only for now.
