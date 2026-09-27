# Changelog

## Unreleased

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
