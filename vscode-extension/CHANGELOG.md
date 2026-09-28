# Changelog

## Unreleased

### Shortcuts for everything

- **Every action has a shortcut, and every shortcut can be changed** in the new **Shortcuts** view of the Browser sidebar: search, click a key to record a new one, add a second key, reset, and fix conflicts. Export and import them as JSON.
- **Each mode has a key**, and its own keys while it is on:
  - element picker Ctrl+Shift+C (↑/↓ parent and child, Enter copy, S screenshot, A send to agent)
  - draw Ctrl+Shift+D (a letter per tool, 1–9 colors, [ ] width, F fill, Enter screenshot)
  - screenshot Ctrl+Shift+S (V visible, F full page, R region, E element, D drawing area)
  - console Ctrl+Shift+J and device Ctrl+Shift+M (with Alt+ keys, so the page keeps its keys)
- **Quick actions** (Ctrl+K) lists every action with its key; **Ctrl+/** (or **?** in a mode) shows the keys of the current mode. Tooltips, menus and hints always show your keys.
- **Your shortcuts follow you:** they are a setting (VS Code Settings Sync), and the paired Inkspect browser extension keeps them in your browser's sync storage too, so a new machine gets them after pairing. Changes made in VS Code (in the Shortcuts view, in settings.json or by Settings Sync) always win over the browser's older copy, even when another device's clock runs ahead.
- The Shortcuts view and the new tab page show keys as key caps; the view shows the sync status, pins each mode's header while scrolling, and marks changed and clashing shortcuts.
- The browser's keys are no longer VS Code keybindings (remapped keys would have fired twice); change them in the Shortcuts view.

### Send to Agent

- **Every screenshot is copied to the clipboard**, including element screenshots (Alt+click) and screenshots from the browser extension. `vscodeBrowser.screenshots.saveFile` decides whether a file is also saved (it replaces `screenshots.defaultAction`).
- **Send to Agent** replaces Send to Chat and Send to Terminal: it types into the agent running in a terminal (Claude Code, Codex, Gemini CLI...) without pressing Enter. The only agent terminal, or the one you chose last, is used without asking; **Browser: Choose Agent Terminal** changes it. Long text is written to `.vscode-browser/context/` and its path is typed. Set `vscodeBrowser.agent.sendTarget` to `chat` to use VS Code chat instead.

### New modes (the Tools button, or their keys)

- **Measure** (Ctrl+Shift+U): the box model and size of any element; click to pin it and see the distances to others. G shows a grid, C copies the measurements.
- **Eyedropper** (Ctrl+Shift+I): a magnifier; click to copy the color as hex, rgb() or hsl().
- **Accessibility check** (Ctrl+Shift+A): marks missing alt text, unnamed buttons and links, unlabeled fields and low contrast, and shows the tab order. Copy the report or send it to the agent.
- **CSS tweak** (Ctrl+Shift+E): click an element and edit its styles live; copy or send the changes as a CSS rule. Leaving puts the page back.
- **Design overlay** (Ctrl+Shift+O): lay a design image over the page at any opacity, nudge it with Alt+arrows, compare with a difference blend.
- **Record** (Ctrl+Alt+R): record the page as a video (WebM), saved next to the screenshots and offered to the agent.

### Redesigned interface

- **One design system** for the whole browser: shared tokens for sizes, radii, spacing, surfaces, shadows and motion, and custom controls in place of the native ones.
  - Themed dropdowns with groups, check marks, sizes and type-ahead (device, throttling, zoom, color scheme, history range, bookmark folders, line style).
  - Switches, checkboxes, segmented controls, sliders, text fields with icons and clear buttons, and buttons with icons and variants.
  - A color picker with a saturation/brightness area, a hue bar, a hex field and presets, replacing the system color dialog in drawing mode.
  - Everything works with the keyboard and follows light, dark and high-contrast themes.
- **Pages** (`vb://settings`, history, bookmarks, downloads, extensions) share a header, cards, empty states and site badges. Settings is a list of cards; extensions have an on/off switch and a pin toggle.
- **Device, drawing and developer toolbars** are more compact and consistent; the console/network switch shows error counts.
- **Engine and crash screens, page dialogs, the find bar and the bookmark editor** have a cleaner layout. Dialogs put the main button last.
- **Bookmarks bar like Chrome's:** bookmarks that don't fit go into a **»** menu pinned to the right edge, and folders open as cascading submenus (hover or Right arrow) with favicons. Untitled bookmarks show their address.
- **Colors work in every theme:** accents follow the theme's button color instead of its focus border (dim in many themes), and secondary text stays readable in low-contrast themes.

### Browser link pairing prompt

- When an unpaired Inkspect browser extension connects, VS Code shows "<browser> wants to sync bookmarks with VS Code" with a **Pair** button. The connection stays open for pairing instead of being dropped.
- **Pairing works in every VS Code window.** Only one window serves the link, but the offer appears in whichever window you focus (once), and **Browser: Connect Browser Extension** works from any window. Before, both only worked in the serving window, which was often a different window in the background.
- When the window that serves the link closes, another open window takes it over within 15 seconds.
- The "VS Code Browser" log records browsers connecting, pairing offers and pairings.

### Browser extension link

- **Link to the Inkspect browser extension.** A WebSocket server on 127.0.0.1:47110 lets the browser extension (Chrome, Edge, Brave, Firefox) link to VS Code.
  - **Browser: Connect Browser Extension** shows a pairing code. After that, the browser connects with a token (only its hash is stored). Web pages and unpaired origins are refused.
  - A status bar item shows linked browsers.
- **Two-way bookmark sync** with linked browsers.
  - The first link asks whether to merge or use one side, and saves an HTML backup first.
  - After that, changes on either side sync within a second, and reconnecting merges what changed while apart.
  - Settings: `vscodeBrowser.bridge.enabled`, `vscodeBrowser.bridge.port`, `vscodeBrowser.bridge.syncBookmarks`.
- **From the browser to VS Code:** screenshots and element details sent from the browser extension go to chat or a terminal agent, or are saved into the workspace.
- **Shared code:** element details, selectors, drawing, devices and Copy-for-AI formats now come from the shared `@inkspect/shared` package, so both products produce identical output.

### Added

- **Send screenshots to a terminal agent.** Every screenshot notification has **Send to Terminal**. It types the image's path into a terminal's input without pressing Enter, so an agent CLI running there (Claude Code, Codex, Gemini CLI, and others) picks up the image and you can add a prompt. With several terminals open you choose one, and agent-looking terminals are listed first. The screenshot menu and the **Send Last Screenshot to Terminal Agent** command send the latest screenshot.

### Fixes

- **Bookmark import works for Chrome and every other browser.**
  - Signed-in Chrome keeps your bookmarks in `AccountBookmarks`, which wasn't read before, so Chrome imported nothing. Import now reads both bookmark files from **every profile**, listed by profile name with a bookmark count.
  - Browsers covered: Chrome (Beta, Dev, Canary), Edge (all channels), Brave, Vivaldi, Opera, Opera GX, Yandex, Arc and Chromium, including snap and flatpak installs on Linux. Firefox is read live from `places.sqlite`, or from its automatic bookmark backups.
  - Safari and any other browser can still import an exported HTML file.
- **No flash after screenshots.** Region, element and full-page captures briefly resize the page inside Chromium, and that frame used to be shown for a moment. Those frames are no longer displayed.
- **The element selector works like Chrome's.** It uses Chrome's own inspect mode, so hovering shows Chrome's highlight and tooltip: tag and classes, size, color, font, background, margin and padding, plus contrast, accessible name, role and whether the element is keyboard-focusable. A click picks exactly the highlighted element and is not passed to the page. Hover is instant, with no lookup for every mouse move. ↑/↓ still move to the parent or child, and Enter copies that element.
- **Clipboard writes happen in order.** An image copy that finishes late no longer overwrites text copied right after it.
- **Copying images now works.** Screenshots, **Copy image** in the page menu, and **Copy Image** on notifications write to the OS clipboard from the extension. That's PowerShell on Windows, `osascript` on macOS, and `wl-copy`/`xclip` on Linux. The webview could only copy while it had focus. WebP, SVG, AVIF and GIF images are converted to PNG first.
- **Drawing works in new windows and tabs.** The tab's drawings could arrive before the tab state, get dropped, and leave the drawing layer disabled. Fast pen strokes no longer lose points.
- **Responsive mode works like Chrome.**
  - The device toolbar opens with a resizable screen.
  - Drag the right edge, bottom edge or corner, with a live size readout.
  - Typing a width or height keeps the mode Responsive. Typed sizes apply on Enter or when you click away, and clicking a size box selects it.
  - Full-length resize strips along the right and bottom edges, plus a corner grip.
  - A breakpoint bar above the screen (Mobile S/M/L, Tablet, Laptop, Laptop L, 4K). Click a band to set that width.
- **Several VS Code windows can each use the browser.** Other windows now use their own browser profile instead of failing with "browser is already running".
- **Bookmarks made right after a reload get the page title** instead of the URL.

### Phase 11: polish and release

- **Resilience:** the browser engine restarts by itself after a crash and reloads your tabs. A second crash within a minute shows the Restart screen instead, so a crash loop cannot spin.
- **Accessibility:** high-contrast borders and focus outlines, reduced motion, and labels on every control.
- **Walkthrough and branding:** a Get Started walkthrough, an extension icon and marketplace metadata.
- **Remote windows:** the extension runs on the UI side, and in remote windows files are saved to the extension's storage.
- **CI:** GitHub Actions runs lint, type-check, unit and integration tests on Linux, Windows and macOS, and builds the VSIX.

### Phase 10: AI agent integration

- **Language model tools:** `browser_navigate`, `browser_screenshot`, `browser_get_element`, `browser_get_selection`, `browser_console_errors`, `browser_failed_requests`, `browser_page_context` and `browser_get_page_text`.
- **MCP server:** an optional server (HTTP on 127.0.0.1, bearer token) for agents outside VS Code. **Copy MCP Server Configuration** sets up a client.
- **Send to chat:** from the element selector (Ctrl+click), from screenshot notifications (with the image attached), from the developer drawer, and with **Send Page Context to Chat**.

### Phase 9: DevTools and debugging context

- **DevTools:** Chrome DevTools (F12) in an editor beside the browser.
- **Console and network drawer:**
  - Filters for the log and the request list.
  - Console sources open workspace files.
  - Copy console errors, failed requests or the page context for an agent.

### Phase 8: Chrome extensions

- **Install:** from a Chrome Web Store link or ID, a `.crx` or `.zip` file, or an unpacked folder. Installed extensions are reloaded on every start.
- **Manage:** `vb://extensions` enables, disables, updates and removes them, and opens their options pages.
- **Toolbar:** extension buttons, with popups shown over the page.

### Phase 7: drawing and annotation

- **Tools:**
  - pens, pencil, marker, brush, highlighter and neon
  - line, arrow, rectangle and ellipse
  - text, numbered callouts and blur
  - eraser and select/move
- **Styles and editing:** colors, widths, opacity, dash styles and fill, with undo and redo.
- **Screenshots:** capture only the area around the drawing, each drawing group separately, or the viewport or full page with the drawings.

### Phase 6: screenshots

- **Modes:** viewport, full page (tiled for very tall pages), region and element.
- **Output:** save, copy the image or copy the path. Notification actions open, reveal or copy the file.

### Phase 5: element selector

- **Details on hover:** highlight, a details card, and parent or child navigation.
- **Copy:** Markdown, JSON, selector only or HTML. Shift+click for multi-select, Alt+click to include a screenshot.
- **Framework detection:** React, Vue, Svelte and Angular components with their source files.

### Phase 4: resolutions and devices

- **Emulation:** a device toolbar with presets and custom sizes, pixel ratio, rotation, and touch and mobile emulation.
- **Conditions:** network and CPU throttling, color scheme and print media.
- **Display:** large sizes scaled to fit.

### Phase 3: bookmarks, history, sessions and settings

- **Bookmarks:** folders, a bookmarks bar, a manager, and import (Chrome, Edge, Brave, HTML) and export.
- **History:** a history page with search; address bar suggestions.
- **Tabs:** private tabs and session restore.
- **Pages and settings:** clear browsing data, a new tab page, and a settings page.

### Phase 2: browser chrome

- Browser icon in the Activity Bar: sidebar with quick actions, open tabs and simple bookmarks; pages open in editor tabs.
- Tabs: new, close (runs `beforeunload`), reopen closed, duplicate, pin, drag to reorder, move to a new window, popups and `target=_blank` as tabs, background tab unloading.
- Navigation: back/forward with history menus, reload, hard reload, stop, home, security indicator, loading progress bar.
- Find in page, per-site zoom, JavaScript dialogs, file uploads, downloads (popover and `vb://downloads`), save as PDF, view source, fullscreen.
- Context menu for links, images, media, selected text and text fields.
- New tab page (`vb://newtab`).
- Open HTML files in the browser (with reload on save), open localhost links from the terminal, status bar button.
- Browser shortcuts as VS Code keybindings; settings for home page, search engine, Chromium, rendering quality, tab limit, downloads and more.

### Phase 1: browser engine

- Downloads Chrome for Testing on first use and runs it headless, one shared engine for all browser windows.
- Streams each page into the webview (JPEG screencast with flow control) and forwards mouse, wheel, keyboard, IME and clipboard input.
- Mouse cursor follows the page; the engine restarts after crashes and shuts down when unused.

### Phase 0: scaffold

- Extension host bundle (esbuild), React webview (Vite), lint, format and unit test setup.
