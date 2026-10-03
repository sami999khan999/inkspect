# VS Code Browser Extension: Plan

> **Repository layout:** the VS Code extension now lives in `vscode-extension/`. Paths in this plan are relative to it. The companion browser extension (toolbar on any page, two-way bookmark sync with VS Code) is planned in [`browser-extension-plan.md`](browser-extension-plan.md).

## Context

The goal is a full web browser that runs inside a VS Code editor tab. It covers the normal browser features (tabs, navigation, bookmarks, history, downloads, and so on) plus tools that help when working with AI coding agents:

- **Element selector cursor**: hover an element to see its details, click to copy them as context for an AI agent.
- **Drawing/annotation**: pens in several styles and colors, then a screenshot of only the area around the drawing.
- **Screenshots**: full page, viewport and cropped region.
- **Any resolution**: device and resolution emulation.
- **Chrome extensions**: load regular browser extensions.

Started 2026-09-27 from an empty folder. Toolchain at start: Node 24.12, npm 11.7, VS Code 1.134, git 2.52.

**Decisions made with the user**
- UI stack: **TypeScript + React 19 + Vite** for the webview, **esbuild** for the extension host.
- Engine: **auto-download Chrome for Testing** (managed Chromium) into extension storage, with a setting to point at a custom binary.

**Why a real Chromium process and not an iframe.** A VS Code webview `<iframe>` has three problems:
- Most sites refuse to load in it because of `X-Frame-Options` and CSP `frame-ancestors`.
- Cross-origin DOM access is blocked, so the element inspector and screenshots can't work.
- It can't run extensions.

So the extension launches a headless Chromium and controls it over the **Chrome DevTools Protocol (CDP)** through `puppeteer-core`:
- The page is streamed into the webview with `Page.startScreencast`.
- Input is sent back with `Input.dispatch*`.
- Branded Chrome 137+ removed `--load-extension`. Chrome for Testing still supports extensions through Puppeteer's `enableExtensions` / `browser.installExtension()`, which uses the CDP call `Extensions.loadUnpacked`. This is why the managed Chromium is the default.

---

# Roadmap

## Architecture

```
┌──────────────────────────── VS Code ─────────────────────────────┐
│  Extension host (Node, esbuild bundle)                           │
│   BrowserManager ── puppeteer-core (pipe/CDP) ──► Chromium       │
│    ├ TabSession: screencast, input, navigation, events            │  (Chrome for Testing,
│    ├ Inspector · Screenshots · Devices · Downloads · Dialogs     │   headless=new, persistent
│    ├ Bookmarks · History · Sessions (JSON in globalStorage)      │   profile in globalStorage)
│    └ ExtensionsManager (unpacked / CRX / Web Store)              │
│   BrowserPanel (WebviewPanel) ◄── typed postMessage ──►          │
│  Webview (React + Vite)                                          │
│   TabStrip · Toolbar/Omnibox · BookmarkBar · Viewport <canvas>   │
│   Overlays: Inspector card · Drawing layer · Crop tool · Menus   │
└──────────────────────────────────────────────────────────────────┘
Frames: Chromium ─screencastFrame(JPEG)→ host ─Uint8Array→ webview canvas ─ack→ host
Input:  webview mouse/wheel/keys/IME ─→ host ─Input.dispatch*/insertText→ Chromium
```

**Principles**
- The host is the source of truth for tabs, annotations and bookmarks. The webview is a view that can be rebuilt from host state.
- One VS Code panel acts as one browser window with its own tabs. Several panels can be open at once.
- Internal pages (`vb://newtab`, `vb://history`, `vb://bookmarks`, `vb://downloads`, `vb://extensions`, `vb://settings`) are rendered by React, not by Chromium.
- Host and webview share one message protocol in `src/shared/protocol.ts` (a discriminated union), which both sides import.

**Repository layout (target)**
```
package.json          extension manifest + scripts
esbuild.mjs           host bundle → dist/extension.js
src/
  extension.ts        activate(): commands, panel serializer, managers
  panel/              BrowserPanel.ts (webview, CSP, message routing)
  browser/            BrowserManager.ts, chromium.ts (download/resolve), TabSession.ts, input.ts
  features/           bookmarks, history, sessions, downloads, dialogs, inspector, screenshots,
                      devices, extensions, devtools, console
  shared/             protocol.ts, url.ts, devices.ts, types shared with webview
webview/
  vite.config.ts      → dist/webview/index.js|css (fixed names, no hashing)
  src/                main.tsx, App.tsx, components/, overlays/, drawing/, pages/ (vb:// pages), state/
test/                 unit (vitest), e2e (@vscode/test-electron), fixtures (html pages, sample extension)
plans/                this plan
```

**Namespace**
- Commands and settings use the `vscodeBrowser.*` prefix. The panel viewType is `vscodeBrowser.browser`.
- The working display name is "VS Code Browser". Rename it before publishing, because marketplace rules discourage names that look official.

---

## Phase 0: Project initialization

**Scaffold**
- [x] `git init`, `.gitignore` (node_modules, dist, *.vsix, .vscode-test, coverage), `.gitattributes`, `.editorconfig`
- [x] `package.json` manifest:
  - `name: vscode-browser`, `displayName`, publisher placeholder
  - `engines.vscode: ^1.101.0` (Electron with Node 22, which puppeteer-core needs), `main: ./dist/extension.js`
  - `contributes.commands`: `vscodeBrowser.open`, `vscodeBrowser.openUrl`
  - An empty `contributes.configuration` skeleton
- [x] TypeScript configs: `tsconfig.json` (host, Node, strict) and `webview/tsconfig.json` (DOM, `jsx: react-jsx`). Both include `src/shared`.
- [x] `esbuild.mjs`: CommonJS, node platform, `vscode` external, sourcemaps, `--watch` flag
- [x] `webview/vite.config.mts`: React plugin, `outDir ../dist/webview`, fixed asset names, sourcemaps
- [x] ESLint flat config (typescript-eslint and react-hooks) and Prettier config
- [x] Vitest config
- [x] `.vscode/launch.json` (Run Extension), `tasks.json` (watch), `extensions.json`, `settings.json`
- [x] `.vscodeignore`, `README.md`, `CHANGELOG.md`

**Dependencies**
- [x] Runtime: `puppeteer-core`, `@puppeteer/browsers`
- [x] Webview: `react`, `react-dom`, `@vscode/codicons`, `perfect-freehand`
- [x] Dev: `typescript` (pinned to ~6.0 because typescript-eslint does not support TS 7 yet), `esbuild`, `vite`, `@vitejs/plugin-react`, `@types/vscode@~1.101`, `@types/node`, `@types/react`, `@types/react-dom`, `vitest`, `eslint`, `typescript-eslint`, `eslint-plugin-react-hooks`, `prettier`, `npm-run-all2@8`, `@vscode/vsce`
- [x] Scripts: `build`, `build:ext`, `build:webview`, `watch`, `typecheck`, `lint`, `test`, `package`

**Minimal working skeleton**
- [x] `src/extension.ts`: registers `vscodeBrowser.open`, which calls `BrowserPanel.createOrShow()`
- [x] `src/panel/BrowserPanel.ts`:
  - `WebviewPanel` with a strict CSP using a nonce
  - `localResourceRoots = dist/webview`
  - Handles the `ready` handshake message
- [x] `src/shared/protocol.ts`: the first message types
- [x] `src/shared/url.ts`: `normalizeInput()` decides URL vs search. `example.com` becomes `https://example.com`, `localhost:3000` becomes `http://localhost:3000`, and plain text becomes a search URL. Add unit tests.
- [x] Webview `App.tsx`: placeholder browser chrome (toolbar, address bar, empty viewport showing "Engine not started"), themed with VS Code CSS variables and codicons

**Done when**
- `npm run build`, `npm run typecheck`, `npm run lint` and `npm test` all pass.
- Pressing F5 opens an Extension Development Host, and the command **Browser: Open** shows the panel.

---

## Phase 1: Browser engine core (MVP rendering and input)

**Chromium management**
- [x] `chromium.ts` resolves the browser in this order: `vscodeBrowser.chromium.executablePath` setting, then a cached Chrome for Testing in `globalStorageUri/chromium`, then a download through `@puppeteer/browsers`. The build is the one puppeteer-core pins (`154.0.8037.57`, 206 MB); older builds are removed after an upgrade.
- [x] First-run download UI: `withProgress` notification with percentage, and a Retry button in the panel if it fails. Respects the VS Code `http.proxy` setting.
  - Note: no cancel button, because `@puppeteer/browsers` cannot abort a download.
- [x] Launch through `puppeteer-core`:
  - `headless: true` (new headless mode), `pipe: true`, `enableExtensions: true`
  - `userDataDir = globalStorageUri/profile`, `defaultViewport: null`
  - Scrollbars, audio and the normal popup blocker stay on.
- [x] Override the user agent (and client hints) to remove `HeadlessChrome` so sites serve their normal pages.
- [x] Lifecycle:
  - Launch lazily when the first panel opens.
  - Shut down 60 s after the last panel closes.
  - `deactivate()` closes the browser; `dispose()` kills it synchronously as a fallback.
  - On a crash, the panel shows "The browser engine stopped" with a Restart button. Tabs survive a restart and reload.
- [x] Output channel `VS Code Browser` for logs, plus a `vscodeBrowser.debug.logCdp` setting.
- [x] **Spike (done 2026-09-27):** pipe transport, `enableExtensions` and `--remote-debugging-port=0` all work together when both `--remote-debugging-pipe` and `--remote-debugging-port=0` are passed as args. `installExtension()` succeeded, and the HTTP endpoint (port read from `<userDataDir>/DevToolsActivePort`) answered `/json/version`. Other findings:
  - Each page can live in its own window (`Target.createTarget({ newWindow: true })`), so every tab renders independently.
  - Screencast frame metadata reports the emulated viewport in CSS pixels, so input mapping is `canvas px × deviceWidth / canvas width`.
  - Minimizing a headless window does **not** make the page hidden, so it cannot be used to throttle background tabs (discarding is used instead).
  - `Target.targetInfoChanged` misses the title set while the page parses; titles are re-read after DOMContentLoaded and load.

**Screencast pipeline**
- [x] `TabSession`: one CDP session per page target (`Page`, `Runtime`, `Security`, `Inspector` domains; `Network` is not enabled because nothing needs its events yet).
- [x] `Page.startScreencast` (JPEG, quality from settings, maxWidth/maxHeight equal to panel size × devicePixelRatio).
- [x] Send frames to the webview as binary (`Uint8Array`, not base64 strings). The webview decodes them with `createImageBitmap` and draws them on the `<canvas>`.
- [x] Flow control: the webview acks each drawn frame, and only then does the host call `Page.screencastFrameAck` (with a 1 s fallback).
- [x] Keep the screencast frame metadata (`scrollOffsetX/Y`, `pageScaleFactor`, `deviceWidth/Height`) in state. The drawing layer uses it later.
- [x] Stop the screencast for background tabs and hidden panels (`onDidChangeViewState`). Resume when they become visible.

**Viewport sizing**
- [x] A ResizeObserver in the webview reports the viewport size. The host then calls `Emulation.setDeviceMetricsOverride` (CSS size, DPR). `Browser.setWindowBounds` turned out to be unnecessary.

**Input forwarding (`input.ts`)**
- [x] Mouse: move (coalesced per animation frame), down, up, click count, all buttons and modifiers. Mouse back/forward buttons navigate.
- [x] Wheel: `Input.dispatchMouseEvent` with type `mouseWheel` and deltaX/deltaY (coalesced per frame).
- [x] Keyboard: `keyDown`/`rawKeyDown` and `keyUp` with `key`, `code`, `windowsVirtualKeyCode`, `text` and modifiers. AltGr typing works.
- [x] IME and composition: `compositionend` calls `Input.insertText`; text from the emoji picker or dictation is forwarded too.
- [x] Clipboard:
  - Windows/Linux: Blink handles Ctrl+A/C/X natively. macOS: `dispatchKeyEvent` `commands` (`selectAll`, `copy`, `cut`, `undo`...).
  - Copied page text reaches the OS clipboard through `vscode.env.clipboard` (selection read from the page, including text fields).
  - Paste reads `vscode.env.clipboard`, fires a synthetic `paste` event, and types the text with `Input.insertText` if the page does not handle it.
- [x] Cursor sync: a `Runtime.addBinding` plus an injected script reports the computed `cursor` under the pointer. The webview applies it to the canvas.
- [x] Focus: when the viewport has focus, keys go to the page. Browser shortcuts are left to VS Code (they are keybindings); other Ctrl/Cmd combinations reach both the page and VS Code, so the command palette still works.

**Done when**
- [x] The panel loads a localhost server (integration test) and public sites (manual).
- [x] Scrolling, clicking links and typing into forms all work (harness test).
- [ ] Manual check still needed: IME input, and copy/paste between the page and other apps.
- [x] The cursor changes over links and text (harness test).
- [x] No frames are streamed while the panel is hidden (screencast stops).

---

## Phase 2: Browser chrome (tabs, navigation and page behaviors)

**Tabs**
- [x] Tab strip with favicon, title, loading spinner, audio indicator, close button and middle-click to close.
- [x] New tab (Ctrl+T), close (Ctrl+W), reopen closed tab (Ctrl+Shift+T), next/previous (Ctrl+Tab / Ctrl+Shift+Tab / Ctrl+PageDown / Ctrl+PageUp), drag to reorder, duplicate, pin.
- [x] Popups and `target=_blank`: `Target.setDiscoverTargets` and `targetCreated` with an `openerId` open a new tab next to the opener. Middle-click and Ctrl+click open in the background.
- [x] Move a tab to a new window (a new VS Code panel). Panels can also be dragged into a floating VS Code window.
- [x] Discard background tabs above a configurable limit (`vscodeBrowser.tabs.maxLive`, default 10) to save memory. They reload when activated.
- [x] **Activity Bar sidebar:** a Browser icon opens a sidebar with three views, while pages open in editor tabs next to the code:
  - **Browser:** actions (open browser, open URL, new window, bookmark current page, downloads, settings, restart engine). Opening the sidebar with no browser open opens one.
  - **Open Tabs:** every tab in every window; click to switch, inline close.
  - **Bookmarks:** a simple flat list (add from the sidebar or the browser menu, click to open, inline remove). Phase 3 replaces it with folders, the bookmark bar and a manager.

**Navigation and omnibox**
- [x] Back, forward, reload, stop, hard reload (Ctrl+Shift+R), home. Right-click Back or Forward for a history list (`Page.getNavigationHistory`).
- [x] Omnibox: URL or search detection (`normalizeInput`), and a search engine setting (Google, Bing, DuckDuckGo, custom `%s`).
- [ ] Omnibox suggestions from bookmarks and history (needs Phase 3 data); optional remote search suggestions, off by default.
- [x] Security indicator (lock, not secure, info, local file, browser page) from `Security.visibleSecurityStateChanged`.
- [x] `vscodeBrowser.ignoreLocalhostCertificateErrors` (`--allow-insecure-localhost`, off by default).
- [x] Loading progress bar driven by `Page.frameStartedLoading`, `Page.lifecycleEvent` and `Page.frameStoppedLoading`.

**In-page features**
- [x] Find in page (Ctrl+F): injected script using TreeWalker and the CSS Custom Highlight API. Shows "n of m", next/previous and match case.
- [x] Zoom (Ctrl+= / Ctrl+- / Ctrl+0), stored per site. Implemented by scaling device metrics (width ÷ zoom, DPR × zoom).
- [x] JavaScript dialogs (alert, confirm, prompt, beforeunload): `Page.javascriptDialogOpening` shows a React modal, then `Page.handleJavaScriptDialog`. Closing a tab runs `beforeunload` (`Page.close`).
- [x] File upload: `Page.setInterceptFileChooserDialog`, then `showOpenDialog` (with filters from the `accept` attribute), then `DOM.setFileInputFiles`.
- [x] Downloads:
  - `Browser.setDownloadBehavior` (`allowAndName`, events enabled). Folder: `vscodeBrowser.downloads.directory`, default `~/Downloads`.
  - Download button with a popover, and a `vb://downloads` page with open, show in folder, cancel and remove.
  - Downloaded files are renamed to their suggested filename (`name (1).ext` if it exists).
- [x] Context menu (custom, React), shown only when the page does not show its own:
  - Back, forward and reload.
  - Links: open in new tab, open in system browser, copy link address.
  - Images: open, save as, copy image, copy address. Video and audio: open, save, copy address.
  - Text: copy and search the web; in text fields cut, copy, paste and select all.
  - Also: save as PDF, view page source, copy URL, open in system browser.
  - Still to add in later phases: inspect element (Phase 5), take screenshot (Phase 6), bookmark page (Phase 3).
- [x] Print or save as PDF: `Page.printToPDF`, then a save dialog.
- [x] View source: `Page.getResourceContent` opens as an untitled editor in VS Code, with the language picked from the MIME type.
- [x] Fullscreen API support: the tab strip and toolbar hide so the page fills the panel, and Esc exits.
- [ ] Permission prompts (geolocation, notifications, clipboard, camera, mic) show a React prompt and call `Browser.grantPermissions`. Decisions are stored per origin. **Deferred:** CDP has no event for permission requests, so this needs wrappers injected into the page APIs. Until then, headless Chromium denies these requests.
- [x] "Open in system browser" (menu, context menu and command) for sites that block automated browsers, such as some sign-in flows.

**Developer workflow**
- [x] **Open in Browser** for `.html`, `.svg` and `.pdf` files in the Explorer context menu, editor title (HTML) and editor tab menu. Tabs showing a local file reload when it is saved (`vscodeBrowser.liveReloadFiles`).
- [x] Terminal link provider: Ctrl+click a localhost URL in the terminal to open it in this browser (`vscodeBrowser.openLinksFromTerminal`).
- [x] `vscodeBrowser.openUrl` command with URL input (also callable with a URL argument), and a status bar entry.

**Keyboard shortcuts**
- [x] Contributed as VS Code keybindings with `when: activeWebviewPanelId == 'vscodeBrowser.browser'`, so they appear in the Keyboard Shortcuts editor and can be changed. The webview keeps these keys away from the page. A unit test checks the two lists match.
  - Ctrl+L / Alt+D address bar, Ctrl+R reload, Alt+Left / Alt+Right back/forward, Alt+Home home, Ctrl+F find, Ctrl+U view source.
  - Not bound because they clash with common VS Code shortcuts: F5 (Start Debugging), Ctrl+P (Quick Open), Ctrl+H (Replace), Ctrl+J (Toggle Panel). Their browser actions are in the menus and command palette.
- [x] Esc exits fullscreen, closes the find bar, menus and dialogs.

**Done when**
- [x] Tabs, internal pages, zoom, close/reopen, home/back, engine restart bookmarks and the Activity Bar pass the integration tests (`npm run test:e2e`, 12 tests).
- [x] Popups, downloads, dialogs, find, printing, history and page source pass the engine harness against Chromium.
- [ ] Manual check still needed: file uploads, drag-to-reorder, moving a tab to a new window, and the downloads popover.

**Verification added in Phases 1 and 2**
- Unit tests (`npm test`, 48 tests): URL handling, key mapping, clipboard shortcuts, message validation, shortcut/keybinding consistency, zoom, file names, file-chooser filters, terminal URLs, page-message sanitizing, user agent.
- Integration tests (`npm run test:e2e`): run the extension in a real VS Code, open pages and check that frames reach the webview and are acknowledged. Results are written to `out/e2e/results.log` because VS Code does not forward the extension host's console.
- Hidden command `vscodeBrowser.debug.state` returns the engine state and every panel's tabs (used by the integration tests).

---

## Phase 3: Bookmarks, history, sessions and settings

**Storage layer**
- [x] `JsonStore<T>` (`src/features/jsonStore.ts`) in `globalStorageUri` with debounced atomic writes (temp file, then rename), a schema version and a migration hook. Unit tests cover writing, reading back, migration and corrupt files.

**Bookmarks**
- [x] Data model (`src/shared/bookmarks.ts`, shared with the webview): a tree with Bookmarks bar and Other bookmarks roots; folders and bookmarks with id, title, url, favicon and createdAt. Moves refuse to put a folder inside itself. The first version's flat list is migrated automatically.
- [x] Star button in the address bar (and Ctrl+D): adds the page to the bookmarks bar and opens an editor popover to rename it, move it to another folder or remove it. The star is filled on bookmarked pages.
- [x] Bookmark bar under the toolbar with folders as menus (sub-folders open their own menu), an overflow » menu, drag to reorder, right-click to open, edit or delete, and a show/hide toggle (menu, Settings page, `vscodeBrowser.showBookmarksBar`).
  - Ctrl+Shift+B is not bound because VS Code uses it for Run Build Task.
- [x] `vb://bookmarks` manager: tree with expand/collapse, search, inline rename and URL edit, move to folder, delete, new folder, open all in tabs, import and export.
- [x] Import from local Chrome, Edge, Brave and Chromium profiles (auto-detected per OS) and from Netscape HTML files. Export to HTML. Unit tests cover both formats.
- [x] Sidebar "Bookmarks" tree view with folders, rename, new folder, remove, import and export.

**History**
- [x] Record visits on main-frame navigations (url, title, visit count, last visit), capped at 20,000 entries. Titles are updated as they arrive. Private tabs are never recorded.
- [x] `vb://history`: grouped by day, search, remove an entry, clear the last hour / day / week / all time.
- [x] Address bar suggestions from open tabs ("switch to tab"), bookmarks and history, ranked by match quality and frecency. Arrow keys and Enter pick a suggestion.

**Sessions**
- [x] Open tabs are saved per window (in workspace state) and `registerWebviewPanelSerializer` restores browser windows after VS Code reloads or restarts. Only the active tab loads immediately; the others load when opened.
- [x] Setting `vscodeBrowser.session.restore`: `always` or `never`. (`ask` was dropped: VS Code restores the editor tab either way, so asking adds a prompt without a real choice.)
- [x] Private tabs: one shared `Target.createBrowserContext` for all private tabs, deleted with its cookies and storage when the last private tab closes. No history, not restored after a reload. Eye icon on the tab, in the address bar and on the new tab page.
- [x] Clear browsing data (history, cookies and site data, cache, download list) from the History page, the menu, the Settings page, the sidebar and the command palette. Uses `Storage.clearCookies`, `Storage.clearDataForOrigin` for every known origin and `Network.clearBrowserCache`.

**New tab page and settings**
- [x] `vb://newtab`: search box, top sites (by frecency) and bookmarks-bar tiles.
- [x] `contributes.configuration` now includes `showBookmarksBar` and `session.restore`. The screenshot, inspector and device settings are added with their phases.
- [x] `vb://settings`: opens the VS Code settings for the extension, import/export bookmarks, toggle the bookmarks bar, clear browsing data, engine version and restart.

**Done when**
- [x] Bookmarks and history are stored in files in global storage, so they survive restarts. Integration tests cover adding and removing a bookmark, history recording and private tabs.
- [x] Chrome bookmarks import is covered by a unit test with the real file format.
- [ ] Manual check still needed: restoring tabs after **Developer: Reload Window**, importing from an installed browser, and the bookmark bar's drag and drop.

---

## Phase 4: Resolutions and device emulation

- [x] Device toolbar, toggled from the toolbar's device button or **Browser: Toggle Device Toolbar** (Ctrl+Shift+M is not bound because VS Code uses it for the Problems panel). Modes:
  - **Responsive**: the page fills the browser; the W×H fields show the current size, and typing a size switches to a custom size.
  - **Preset device** (dropdown grouped by phones, tablets, desktops and your own presets), or **Browser: Emulate Device...** from the command palette.
  - **Custom W×H**, which can be saved as a named device.
- [x] Presets in `src/shared/devices.ts` (unit-tested):

  | Group | Devices |
  |---|---|
  | Phones | iPhone SE 375×667@2, iPhone 16 Pro 402×874@3, iPhone 16 Pro Max 440×956@3, Pixel 8 412×915@2.625, Galaxy S24 360×780@3 |
  | Tablets | iPad Mini 768×1024@2, iPad Pro 1024×1366@2, Surface Pro 912×1368@2 |
  | Desktops | 1280×800, 1366×768, 1440×900, 1920×1080, 2560×1440, 3840×2160 |

- [x] User-defined presets in the `vscodeBrowser.devices.custom` setting (with a JSON schema), saved from the toolbar with **Save device**.
- [x] Controls: DPR (1, 1.5, 2, 2.625, 3), rotate, touch + mobile viewport (`setTouchEmulationEnabled`, `setEmitTouchEventsForMouse`, mobile metrics), and a matching mobile user agent and client hints (Android, iPhone or iPad) for phone and tablet presets.
- [x] Scale: the emulated screen is rendered at its full size and shown scaled down to fit (never enlarged), or at 25–150%; larger-than-window screens scroll. Mouse and touch coordinates map through the screencast metadata, so clicks land correctly at any scale.
- [x] Throttling: network (Offline, Slow 3G, Fast 3G, Fast 4G, same numbers as Chrome DevTools) and CPU (4× and 6× slower).
- [x] Media emulation: `prefers-color-scheme` light/dark and print media (`Emulation.setEmulatedMedia`).
- [x] Each tab keeps its own emulation settings, applied again when a discarded tab reloads.
- [ ] Draggable resize handles in responsive mode (the W×H fields cover resizing for now).
- [ ] Stretch: multi-device grid that loads the same URL at several sizes side by side.

**Done when**
- [x] Integration test: emulating iPhone SE gives the page a 375×667 viewport with 5 touch points; turning the toolbar off restores the normal size (a round trip through the webview).
- [ ] Manual check still needed: 4K scaled to fit, throttling, and the look of the device frame.
- Screenshots at the emulated resolution are checked in Phase 6.

---

## Phase 5: Element selector cursor (context for AI agents)

**Picker mode**
- [x] Turn on with the toolbar button, Alt+Shift+E (**Browser: Select an Element**) or the context menu's **Copy element details (for AI)**. The cursor becomes a crosshair and clicks no longer reach the page (the wheel still scrolls).
- [x] Hover (one request in flight, latest point wins): `DOM.getNodeForLocation` (text nodes resolve to their element), then `Overlay.highlightNode` draws margin, border, padding and content boxes in the page.
- [x] Details card next to the element (flips above near the bottom, stays inside the page area): tag#id.classes, size, role and accessible name, component, key computed styles and a breadcrumb.
- [x] Traversal: Arrow Up moves to the parent, Arrow Down to the first child (through shadow roots). A hint bar lists the keys.
- [ ] Mouse wheel over the card to cycle ancestors (Arrow keys cover this).

**Details extraction** (`Runtime.callFunctionOn` with a collector built from `src/shared/elementInfo.ts`)
- [x] **Unique CSS selector** (unit-tested and checked against Chromium): unique id, then `data-testid`/`data-test`/`data-cy`/`data-qa`, `aria-label`, `name`, then tag plus stable classes (generated names such as `css-1abc234` are skipped), then `:nth-of-type` steps up to a unique ancestor.
- [x] XPath, bounding box, attributes, trimmed text and `outerHTML`, truncated to `vscodeBrowser.inspector.maxHtmlLength` with children collapsed.
- [x] Computed style subset (default values dropped).
- [x] Accessibility: `Accessibility.getPartialAXTree` gives role and name.
- [x] Framework hints (best effort), with file paths made workspace-relative (`normalizeSourcePath`, unit-tested for Vite, webpack, `/@fs/` and absolute paths):
  - React: nearest component from the fiber, source from `_debugSource` (React ≤18) or the owner stack (React 19)
  - Vue 3 (`__vueParentComponent.type.__file`) and Vue 2
  - Svelte: `__svelte_meta.loc`
  - Angular: `ng.getComponent` / `ng.getOwningComponent`
- [x] Shadow DOM: selectors inside a shadow root are written as `host >>> inner`. Same-process iframes work; the page URL and the iframe URL are both reported.
- [ ] Out-of-process (cross-site) iframes: needs `Target.setAutoAttach` with `flatten` and per-frame sessions.
- [x] Page URL, title and viewport size.

**Copy actions**
- [x] Click copies the formatted details to the clipboard and shows a toast.
- [x] Shift+click adds to a multi-selection (numbered badges that follow scrolling); Enter copies them all as a numbered list; Esc cancels.
- [x] Alt+click also saves an element screenshot (Phase 6) and adds its path to the copied text.
- [x] Formats (`vscodeBrowser.inspector.copyFormat`): **Markdown** (default), JSON, selector only, HTML only. `vscodeBrowser.inspector.fields` picks the fields.
- [x] Optional `.vscode-browser/context/selection.md` in the workspace (`vscodeBrowser.inspector.writeSelectionFile`).

**Default Markdown output**
````md
### Element: `button.btn-primary`
- Page: http://localhost:3000/login (1440×900)
- Selector: `form#login > button.btn-primary`
- XPath: `/html/body/main/form/button`
- Role/name: button "Sign in"
- Component: `<LoginButton>` (src/components/LoginButton.tsx:12) [react]
- Box: 120×40 at (320, 480)
- Text: "Sign in"
- Styles: display:flex; padding:8px 16px; color:rgb(255, 255, 255); background-color:rgb(37, 99, 235)
- Attributes: type="submit"
```html
<button class="btn-primary" type="submit">Sign in</button>
```
````

**Done when**
- [x] Harness against Chromium: correct element under the pointer, unique selectors (including repeated siblings and generated classes), role/name, React component with file and line, parent/child traversal.
- [x] Integration test: picking an element copies Markdown with its selector and HTML to the clipboard.
- [ ] Manual check still needed: the card and highlight on real React, Vue and Svelte dev servers.

---

## Phase 6: Screenshots

**Capture modes**
- [x] **Viewport**: `Page.captureScreenshot` (`fromSurface`), at the emulated device pixel ratio.
- [x] **Full page**: `Page.getLayoutMetrics` gives the content size, captured with `captureBeyondViewport`.
  - Pages taller than Chromium's 16,384-pixel limit are captured scaled down instead of tiled and stitched.
- [ ] Tile-and-stitch for very tall pages at full resolution, and pre-scrolling to load lazy content.
- [x] **Region**: drag a rectangle over the page (W×H readout, drag again to redo, Enter or **Capture**, Esc or right-click to cancel). Captured with `clip` in document coordinates at device scale, so it is sharp.
- [x] **Element**: pick an element (the picker in screenshot mode); scrolled into view and captured from `DOM.getBoxModel`.
- [x] Camera menu in the toolbar, **Take screenshot** in the page context menu, and commands `vscodeBrowser.screenshot.viewport`, `.fullPage`, `.region` and `.element` (viewport and full page return the saved file path, for other extensions and tests).

**Output**
- [x] `vscodeBrowser.screenshots.defaultAction`: save and copy the image (default), save and copy the path (handy for AI agents), copy only, or ask. Format: PNG, JPEG or WebP.
- [x] Default folder `.vscode-browser/screenshots` in the workspace (global storage without a workspace), or `vscodeBrowser.screenshots.directory`. Names contain the date, time and site.
- [x] The image is copied by the webview (`ClipboardItem`, converted to PNG).
- [ ] Per-OS clipboard fallbacks (PowerShell, `osascript`, `wl-copy`/`xclip`) in case the webview clipboard is unavailable.
- [x] A notification offers **Copy Path**, **Copy Image**, **Open** and **Reveal**.

**Done when**
- [x] Harness against Chromium at DPR 2: viewport 1600×1200, element 240×80, region 200×100, full page covering the 3,000+ px page, JPEG output.
- [x] Integration test: the viewport and full-page commands save PNG files.
- [ ] Manual check still needed: region selection and clipboard images on Windows, and captures under device emulation.

---

## Phase 7: Drawing and annotation system

**Drawing layer**
- [x] A DPR-aware canvas over the page. Shapes (`src/shared/annotations.ts`) are stored in **document coordinates** with their style (color, width, opacity, line style, fill).
- [x] Drawings stay attached to the page while it scrolls (they are redrawn from the screencast's scroll offsets).
- [x] While drawing, clicks and keys do not reach the page, but the wheel still scrolls it.
- [x] Drawings are kept by the host per tab, so they survive switching tabs and the webview being hidden. They stay visible (without editing) after leaving drawing mode.

**Tools**
- [x] Freehand pens smoothed with `perfect-freehand`: pen, pencil, marker, brush (tapered), highlighter (translucent, multiply blend) and neon (glow with a bright core). Pen pressure is used when the device reports it.
- [x] Line styles: solid, dashed, dotted (dashed pens use a smoothed line).
- [x] Shapes: line, arrow, double arrow, rectangle and ellipse (outline or filled). Shift constrains lines to 45° and rectangles and ellipses to squares and circles.
- [x] Text labels (Enter to place, Shift+Enter for a new line), numbered callouts (1, 2, 3... for referencing in AI prompts) and redaction boxes that pixelate the page underneath.
- [x] Eraser (removes whole shapes under the pointer), select and move, Delete to remove the selected shape, clear all.

**Style palette**
- [x] Nine color swatches, a custom color picker and recent custom colors.
- [x] Width and opacity sliders, line style, fill toggle.
- [x] Each tool remembers its own style (the highlighter starts yellow and wide).

**UX**
- [x] Toggle with the toolbar's pencil button or **Browser: Draw on Page**. Tool keys: V select, P pen, M marker, H highlighter, L line, A arrow, R rectangle, O ellipse, T text, N callout, B redact, E eraser. Esc stops drawing.
- [x] Undo and redo (Ctrl+Z, Ctrl+Y / Ctrl+Shift+Z), 100 steps.
- [x] `vscodeBrowser.drawing.clearOnNavigation` (default on) clears a tab's drawings when it navigates; an eye button hides and shows them.

**Annotation screenshot**
- [x] **Screenshot → Drawing area** (also **Browser: Screenshot: Drawing Area**): the union of all shapes plus `vscodeBrowser.screenshots.annotationPadding` (default 40 px), kept inside the page. The host captures that clean region (`clip` + `captureBeyondViewport`, so it can extend beyond the visible area), and the webview draws the shapes onto it in an OffscreenCanvas at the image's resolution. The result is saved and copied like other screenshots.
- [x] Options:
  - **Each drawing separately**: shapes are grouped by distance, one image per group.
  - **Drawing area without drawings**.
  - **Visible area with drawings** and **Full page with drawings**.

**Done when**
- [x] Unit tests: bounds (stroke width and arrow heads), capture area with padding, grouping, hit testing, moving, constraining and sanitising shapes.
- [x] Integration test: a 100×50 rectangle produces a PNG covering exactly the shape plus 40 px padding (184×134 CSS pixels), through the webview compositor.
- [ ] Manual check still needed: how the pens feel (~60 fps), drawing while scrolled, and redaction under device emulation.

---

## Phase 8: Browser extension support

**Loading and management**
- [x] `ExtensionsManager` (`src/features/extensions.ts`) uses Puppeteer `browser.installExtension(path)` / `uninstallExtension(id)` (CDP `Extensions.loadUnpacked`, pipe mode, Chrome for Testing).
- [x] Install sources (commands accept the path or URL as an argument, so they can be scripted):
  - Unpacked folder (**Load unpacked...**)
  - `.crx` (versions 2 and 3) or `.zip` file, unpacked with `fflate`; entries that would escape the folder are refused
  - **Chrome Web Store URL or id**, downloaded from the Web Store update service and unpacked
- [x] A registry in `globalStorageUri/extensions/registry.json`; packaged extensions are unpacked next to it. Chromium does not remember CDP-loaded extensions, so enabled ones are loaded again on every browser start, before any page is created.
- [x] Enable/disable (unload/reload), remove (deletes files we unpacked, never the user's own folder), check for updates (Web Store version check, then reinstall), open the options page in a tab. Manifest V2 packages are rejected with a clear message.

**UI**
- [x] `vb://extensions` page: cards with icon, name (localized `__MSG_` names), version, source, description, enable and pin toggles, options, details (id, permissions), remove, load errors; install buttons and a Web Store link field.
- [x] Toolbar: pinned extension icons (first four are pinned automatically) and a puzzle menu listing all enabled extensions plus **Manage extensions**.
- [x] Clicking an extension with a `default_popup` opens `chrome-extension://<id>/<popup>` as its own page, sized to its content (within Chrome's 800×600 limit), streamed into an overlay under the button. It closes on outside click, Esc or `window.close()`. Extensions without a popup open their options page.
- [x] Pages extensions open with `chrome.tabs.create` arrive through target discovery and show up as tabs.

**Known limitations (also shown on the extensions page)**
- `chrome.action.onClicked` for extensions without a popup is not triggered.
- Extension-added context menu items and native messaging are not supported.
- Some identity or sign-in APIs may not work.
- Manifest V2 extensions are unsupported by current Chromium.
- The Web Store's "Add to Chrome" button does not work; paste the store link instead.

**Test extensions**
- [x] `test/fixtures/extensions/hello` (content script, popup, service worker).
- [ ] Manual checks with real extensions: uBlock Origin Lite, a password manager, React Developer Tools.

**Done when**
- [x] Unit tests: CRX3 header stripping, extraction (with the path-escape check), BOM-tolerant manifests, localized names, Web Store ids and update checks, version comparison.
- [x] Integration test: loading the fixture folder registers it (with its popup), its content script runs on a page, and removing it stops the content script after a reload.
- [ ] Manual check still needed: the popup overlay, and a Web Store install surviving a VS Code restart.

---

## Phase 9: DevTools and debugging context

- [x] **Open DevTools (F12)** using option (a):
  - Chromium launches with `--remote-debugging-pipe --remote-debugging-port=0`. Control stays on the pipe, and the random port is read from `DevToolsActivePort`. The port binds to 127.0.0.1 only.
  - `http://127.0.0.1:PORT/devtools/inspector.html?ws=…/devtools/page/<targetId>` loads in an iframe in a webview editor beside the browser (`src/panel/devtoolsPanel.ts`). The spike confirmed the frontend loads there (no X-Frame-Options) and connects.
  - The panel closes when its tab closes.
  - Setting `vscodeBrowser.devtools.enabled` (default on) turns the port off for anyone who does not want it.
- [x] **Console drawer** (`webview/src/components/DevDrawer.tsx`):
  - Captures `Runtime.consoleAPICalled`, `Runtime.exceptionThrown` and `Log.entryAdded` (capped at 500, reset on navigation).
  - Filter by level and text; clear.
  - Clicking a source opens the file in the editor when it maps to a workspace file (dev-server URLs, `webpack://` and `file://` are handled by `normalizeSourcePath`). Otherwise the URL opens in a tab.
  - Toggle it with the toolbar button or the **Toggle Console and Network Drawer** command. It is resizable, and the page viewport shrinks above it.
- [x] **Network lite**: status, method, name, type, size and time, with failed or ≥400 requests highlighted and a "Failed only" filter. `Network.*` events are recorded only once the drawer is opened (capped at 300).
- [x] **Copy for AI** (Markdown, see `src/shared/devtools.ts`), available as drawer buttons, commands and a menu entry:
  - `vscodeBrowser.copyConsoleErrors`
  - `vscodeBrowser.copyFailedRequests`
  - `vscodeBrowser.copyPageContext`: URL, title, viewport or device, selected text, recent errors and failed requests
- [ ] Storage viewer (cookies, localStorage) is a stretch goal and not done. Chrome DevTools' Application panel covers it.

**Done when**
- [x] DevTools opens for the active tab (integration test: an editor titled "DevTools: …" appears).
- [x] Console errors from a fixture page appear in the drawer and copy out as Markdown (integration test on `/errors`: `console.error` plus an uncaught exception, and `copyPageContext` includes both).
- Still to check by hand: the drawer UI and the DevTools frontend in a real window.

---

## Phase 10: AI agent integration

- [x] Language Model Tools (`vscode.lm.registerTool` plus `contributes.languageModelTools`, generated from `src/agent/tools.ts` by `npm run sync:tools`; a unit test fails if they drift). All tools work on the active tab of the active browser window.

  | Tool | What it does |
  |---|---|
  | `browser_navigate` | Opens a URL and waits for the load. http, https and file only. |
  | `browser_screenshot` | Viewport, full page, or one element by selector. Returns the saved path, plus the image when the VS Code version supports image tool results. |
  | `browser_get_element` | Inspector details for a CSS selector. |
  | `browser_get_selection` | The user's last element-selector pick. |
  | `browser_console_errors` | Console errors and exceptions. |
  | `browser_failed_requests` | Failed or ≥400 requests. |
  | `browser_page_context` | URL, viewport, selection, errors and failed requests. |
  | `browser_get_page_text` | The page's visible text. |

  Each tool can be referenced in a prompt as `#browserScreenshot` and so on.
- [x] MCP server for agents outside VS Code (`src/agent/mcpServer.ts` and `mcpProtocol.ts`):
  - Built as Streamable HTTP with JSON responses, not a stdio bridge. No extra process is needed, and it serves the same tool definitions.
  - Listens on 127.0.0.1 with a remembered port and a bearer token kept in SecretStorage.
  - Checks Host and Origin (against DNS rebinding) and caps the body at 1 MB.
  - Off by default (`vscodeBrowser.mcp.enabled`, `vscodeBrowser.mcp.port`).
  - **Browser: Copy MCP Server Configuration** copies an `mcpServers` JSON, a `claude mcp add` command, or the URL and token.
  - It is not registered with `registerMcpServerDefinitionProvider`, because VS Code chat already has the same tools natively and would list them twice.
- [x] "Send to chat" opens `workbench.action.chat.open` with the text prefilled but not sent, and with files attached where relevant. It falls back to the clipboard when no chat is available. Entry points:
  - Inspector: Ctrl/Cmd+click
  - Screenshot notification: **Send to Chat** attaches the image
  - Developer drawer button
  - **Browser: Send Page Context to Chat**
- [x] Safety:
  - `browser_navigate` asks first in VS Code chat (`vscodeBrowser.agent.confirmNavigation`, default on). MCP clients use their own approval.
  - No tool reads cookies or storage, runs scripts or clicks.
- [ ] Click and type tools for agents: not done yet (they would need confirmation prompts).

**Done when**
- [x] An agent can take a screenshot and read element details for a selector. Covered by integration tests through `vscode.lm.invokeTool` and over HTTP against the MCP server.
- Still to check by hand: a real chat session with a model calling the tools, and Send to Chat.

---

## Phase 11: Polish, quality and release

**Look and accessibility**
- [x] Theming: VS Code CSS variables and codicons throughout. The only fixed colors sit over page content (white page background, overlays).
- [x] High-contrast themes: `contrastBorder` and `contrastActiveBorder` on popovers, bars and active or hovered controls. `prefers-reduced-motion` is honored.
- [ ] Not yet checked by eye in the light, dark and high-contrast themes.
- [x] Accessibility:
  - An audit found no unnamed icon buttons, and the prompt dialog input got a label.
  - Menus support arrow keys.
  - Focus rings use `focusBorder`.
  - Toggle buttons expose `aria-pressed`.

**Performance and reliability**
- [ ] Adaptive JPEG quality under load: not done. Ack-based flow control already drops frames when the webview falls behind, and quality is a setting.
- [x] Hover and inspector throttling (latest-only hover queue) and background tab unloading (`tabs.maxLive`), from earlier phases.
- [ ] Measure input-to-frame latency: not done.
- [x] Resilience:
  - The engine restarts by itself after an unexpected crash and the active tab reloads (integration test through `vscodeBrowser.debug.crashEngine`).
  - A second crash within 60 s shows the Restart screen instead, so a crash loop cannot spin.
  - A crashed renderer shows the crashed-tab overlay.
  - Every CDP call has a 60 s `protocolTimeout`.
- [x] Security (reviewed):
  - Strict CSP with a nonce, and every webview message validated.
  - Only bundled scripts are injected into pages.
  - The debugging and MCP ports listen on 127.0.0.1 only; the MCP server also needs a token and checks Host and Origin.
  - The profile is kept in globalStorage.
- [x] Remote development:
  - `extensionKind: ["ui", "workspace"]`, so Chromium runs locally.
  - Files are only written into the workspace when it is a local `file:` folder; otherwise they go to globalStorage.
  - `asExternalUri` does nothing on the UI side, so remote dev servers rely on VS Code's port forwarding (documented in the README).

**Tests**
- [x] Unit tests (Vitest), 107 of them, covering:
  - URLs, input and the protocol
  - selectors and element info
  - stores and bookmark formats
  - annotation boxes and clusters
  - CRX unpacking and device math
  - DevTools formatting, agent tools and MCP
- [x] Integration tests: 25 tests in a real VS Code against a local fixture server. They pass with both the development and production builds.
- [ ] Manual QA on macOS, Linux and HiDPI: not done (developed on Windows).

**Docs and release**
- [x] Get Started walkthrough (`contributes.walkthroughs`, six steps with Markdown pages in `media/walkthrough`).
- [x] README rewritten for all features, and CHANGELOG entries for Phases 3–11.
- [x] Icon (`media/icon.png`, rendered from SVG), gallery banner, categories and keywords.
- [ ] Before publishing, still to decide:
  - the final name (the marketplace discourages "VS Code" in names)
  - the publisher id
  - a LICENSE
  - a `repository` URL
  - README GIFs
- [x] CI with GitHub Actions (`.github/workflows/ci.yml`):
  - lint, type-check and unit tests on Ubuntu, Windows and macOS
  - integration tests on all three (Linux under xvfb)
  - a VSIX build uploaded as an artifact
- [x] `.vscodeignore` whitelists only the built JS, CSS and font files. The VSIX is about 520 KB and contains no source maps.
- [ ] Publish with `vsce publish` and `ovsx publish`: waiting on the decisions above.

---

## Phase 12: Shortcuts for everything, sending to the agent, more modes

**Shortcuts**
- [x] One registry (`SHORTCUT_ACTIONS`) for every action: browser-wide keys and each mode's keys. The webview dispatches them; the static VS Code keybindings are gone (they would fire twice).
- [x] Every mode has a toggle key; while a mode is on, its features have their own keys. Takeover modes use plain keys; the console, device, overlay and record modes use Alt+ keys.
- [x] The **Shortcuts** view in the Browser sidebar: search, record new keys, add a second key, remove, reset, conflicts with a fix, export and import (JSON).
- [x] Synced across devices: the `vscodeBrowser.shortcuts` setting (VS Code Settings Sync) and, through the paired browser extension, `chrome.storage.sync` (the newer copy wins).
- [x] Quick actions (Ctrl+Shift+K) and a cheat sheet of the current mode (Ctrl+Shift+/ or ?). Tooltips, menus and hint bars show the user's keys.

**Screenshots and the agent**
- [x] Every screenshot is copied to the clipboard (Alt+click and screenshots from the browser extension too). `screenshots.saveFile` replaces `screenshots.defaultAction`, whose "copy" value still means "don't save".
- [x] **Send to Agent** everywhere: the agent CLI in a terminal by default (the only agent terminal, or the last one chosen), VS Code chat with `agent.sendTarget`. Long text goes in a file under `.vscode-browser/context/`.
- [x] **Groups in Agent Context:** screenshots taken together (each drawing separately, a Shift+click selection's screenshots, several from the browser extension) share a `group` and show as one card, with a thumbnail and checkbox each; the checked ones go in one send (`sendContextItems`: all files attached to the chat, or all paths in one terminal paste). Any items can be selected (checkbox, Ctrl/Shift+click, Space) to send, remove or group them by hand; groups can be ungrouped. A group is trimmed from the list whole.

**New modes**
- [x] Measure: box model and size on hover, click to pin, distances to other elements, grid, copy.
- [x] Eyedropper: loupe, click to copy the color as hex, rgb() or hsl().
- [x] Accessibility check: missing alt text, names and labels, low contrast, tab order; step through, copy or send the report.
- [x] CSS tweak: pick an element, edit its styles live, copy or send the changes as a CSS rule; leaving reverts the page.
- [x] Design overlay: an image over the page at any opacity, with nudging and a difference blend.
- [x] Record: the page as a WebM video, saved next to the screenshots and offered to the agent.
- [ ] Screen recording as GIF: not done (WebM needs no encoder; agents read video paths).

## Phase 13: Projects, the browser helper and agentmux

The browser, VS Code and agents in tmux (agentmux threads) meet in **projects** (folders), through a local **hub** that browsers start as their native messaging host.

**The hub** (`src/hub/`, bundled as `dist/hub.js`, no `vscode` imports)
- [x] One daemon per user on a Unix socket in `$XDG_RUNTIME_DIR/inkspect/` (folder 0700, socket and token 0600, a lock file). Browsers start the shim (`hub.js` as a native host), which starts the daemon if needed and authenticates with its token; VS Code windows connect directly. It exits after 10 minutes unused; a newer extension replaces an older hub.
- [x] **Registered on activation (Linux):** the hub is copied to `$XDG_DATA_HOME/inkspect/hub/` with a launcher that runs it with VS Code's own Node (`ELECTRON_RUN_AS_NODE`), and a host manifest goes to every browser found (Chrome, Chromium, Brave, Vivaldi, Edge, Opera; Firefox best effort). Only the Inkspect extension may start it (`allowed_origins` with the id the manifest `key` fixes). Commands: **Register Browser Helper**, **Remove Browser Helper**; setting `hub.enabled`.
- [x] **The browser link through the hub:** the bridge protocol travels inside hub frames to one VS Code window (the leader: the oldest one). Browsers on the hub need no pairing. Bookmark sync, shortcuts and sends work as over the WebSocket, which stays as the fallback when the helper isn't installed.
- [x] The bridge server's browser logic (bookmarks, shortcuts, sends) moved to `LinkService` (`src/link/`), shared by both transports.

**Projects and their store**
- [x] A project's captures live in `<project>/.inkspect/items/<id>/` (`item.json`, the image or recording, `context.md`, `thumb.jpg`), written whole and renamed into place; `.inkspect/.gitignore` ignores everything. Kept until removed (removals can be undone for 15 seconds). The hub writes the browser's captures; VS Code writes its own.
- [x] **Agent Context reads the workspace's store** (or one in global storage without a folder): captures saved from the browser appear there, and VS Code's captures are on disk too (no more full images in memory). Long text for agents goes to `.inkspect/files/`.
- [x] The hub lists projects from VS Code windows' folders, agentmux threads (`@project` on tmux sessions), projects with captures, and pinned ones; and suggests one per page: the project that site's captures went to, the project whose dev server serves a localhost page (`/proc`: port, process, its folder), the last one used.

**Sending to agents**
- [x] Agents in agentmux threads (`tmux -L agents` by default, setting `agent.tmuxSockets`) are send targets: found under the pane's process (or by `@harness`), never a pane back at its shell. Sends are pasted with `paste-buffer -p` (a bracketed paste), a space after each part, never Enter, never a focus change.
- [x] Default target per project: the one used last, else the agent in the kitty beside the VS Code window (`kitty-pair`), else a VS Code terminal agent, else the agentmux agent used most recently.
- [x] The Agent Context view lists agentmux agents next to terminal agents and chat.
- [ ] Not done yet: macOS and Windows for the hub (the WebSocket link is used there); Firefox's native host and sidebar untested (Firefox isn't installed on the development machine).

## Phase 14: Saved, then sent (one flow for every capture)

Whatever is captured is saved at once, then one centered dialog says where it goes; the Saved list shows one project at a time; agentmux is reachable from every entry point.

**One send core**
- [x] `@inkspect/shared/targets`: one target id grammar for everything (`tmux:<socket>:<pane>`, `vscode:<window>:<terminal:n|chat>`, local `terminal:n`/`chat`, `agentmux:new:<harness>`, `default`).
- [x] `src/hub/router.ts`: every send (VS Code's and the browser's) resolves the default, pastes into agentmux panes, hands VS Code targets to their window, starts new agentmux threads, marks items sent and remembers the project's last target in `<project>/.inkspect/state.json` (shared by VS Code and the hub).
- [x] `src/hub/agentmux.ts`: **Open in agentmux** (paste, then `agentmux show <session>` and focus the paired kitty or the agentmux window through `hyprctl`), **New agentmux thread** (`agentmux project <dir>`, `agentmux new-thread <harness>`, wait for its pane, paste). Offered only where agentmux has the project open. Commands `vscodeBrowser.openInAgentmux`, `vscodeBrowser.newAgentmuxThread`.
- [x] `src/hub/core.ts` (HubCore): the browser's questions about projects and captures, answered the same by the hub daemon and by the VS Code window serving the WebSocket link (bridge `hub.request` / `hub.reply`; `welcome.features` says so). Bridge `send`, `send.result` and `windows` are gone, and with them `LinkService.runSend` and the window picker. The window relay carries each window's folders and agents, and runs sends for its own agents.

**The send dialog** (`@inkspect/shared/ui/SendModal`, keys in the `send` scope)
- [x] VS Code: the browser panel shows it after every capture (`saved` / `savedAction` messages, `src/agent/sendFlow.ts`); without a panel, a notification leads to a quick pick. Agents one click or number each (Shift: send and open in agentmux), Enter the default, New agentmux thread, Change project (moves the items), Copy, Reveal, Esc keeps it.
- [x] The capture notifications' "Send to Agent / More…" buttons are gone (`offerActions`, `moreActions`).

**The Saved list** (`@inkspect/shared/ui/SavedList`, `@inkspect/shared/saved`)
- [x] The Agent Context view is "Saved" (ids unchanged): one project, with a project switcher (`ContextTray.setProject`, remembered per workspace), cards with Send, Send to…, Open in agentmux, Copy, Open, Remove, Undo.
- [x] The Inbox: `$XDG_DATA_HOME/inkspect/inbox` on Linux (shared with the hub; the old global-storage inbox moves there), global storage elsewhere. A window's Saved project counts as its project (its agents get that project's captures).
- [x] The hub suggests a page's project: site memory, dev server, the VS Code window focused last, the agentmux thread in the kitty beside VS Code, the last project, the busiest agentmux thread, the Inbox.

**The picker** (both products)
- [x] Click captures details, Alt+click captures an element screenshot (only that), Shift+click adds, Enter captures all; Ctrl/Ctrl+Shift+click sends removed. `PickerHint` on one line; `SelectionBar`: Capture, Screenshot, ×.

- [ ] Not done yet: the send dialog shows at most 4 thumbnails, and can't leave out some of several captures (remove them from the Saved list instead); the hub's `hub.json` can be written by the daemon and a WebSocket-serving window at once (last writer wins).

---

## Milestones

| Milestone | Phases | Result |
|---|---|---|
| M1 Usable browser | 0–2 | Browse with tabs inside VS Code |
| M2 Daily driver | 3–4 | Bookmarks, history, sessions, all resolutions |
| M3 AI context tools | 5–7 | Element picker, screenshots, drawing and annotation screenshots |
| M4 Power features | 8–9 | Chrome extensions, DevTools, console and network |
| M5 Ship | 10–11 | Agent tools, polish, tests, marketplace release |

## Risks and mitigations

| Risk | Mitigation |
|---|---|
| Screencast latency or FPS | Binary frame transfer, ack-based flow control, adaptive quality, screencast size capped to the panel |
| Sites that block automated or headless browsers (e.g. Google sign-in) | Clean user agent, persistent profile, "Open in system browser" fallback, documented limitation. No detection evasion. |
| Extension UI gaps in headless mode | Popups rendered as separate screencast targets, documented limitations |
| ~150 MB Chromium download, corporate proxies | Progress and retry UI, `http.proxy` support, custom executable path setting |
| Clipboard images in a webview | ClipboardItem with per-OS fallbacks. "Copy path" as the main flow for agents |
| Keyboard conflicts with VS Code | Webview handles keys when focused, keybindings scoped with `activeWebviewPanelId` |
| Memory use with many tabs | Discard background tabs, stop screencast when hidden |

## Verification (per phase and overall)

- `npm run typecheck && npm run lint && npm test` pass on every phase.
- Press F5 to open the Extension Development Host, then run **Browser: Open** and go through that phase's **Done when** list against the fixture pages in `test/fixtures` (static server started by an npm script).
- From Phase 11: `npm run test:e2e` runs the automated end-to-end suite in VS Code, and CI builds a VSIX that installs cleanly with `code --install-extension`.
