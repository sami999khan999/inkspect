# Changelog

## Unreleased

### Shortcuts sync

- The VS Code browser's shortcuts are kept in this browser's sync storage (`chrome.storage.sync`), so they follow your browser account to other devices; the newer copy wins. No bookmarks are used, and no new permissions.

### Redesigned settings page

- The settings page uses the same design system as VS Code Browser, in light and dark: a status card with a colored indicator, step-by-step pairing, and a six-box code field that pairs as soon as the last digit is typed (pasting a code works too).

### Pairing is easier to notice

- The toolbar button shows **!** while the browser isn't paired with VS Code, and the settings page opens once after install. Unpaired browsers announce themselves to VS Code, which offers to pair them.
- Fixed: the settings page got no answer from the extension, so it always said VS Code was not reachable and **Pair** failed with "Cannot read properties of undefined". The page opens in its own tab, and the background ignored messages from tabs.
- An unpaired browser no longer reconnects to VS Code every second; retries slow down until VS Code accepts it.

### Bookmark sync only

- **The extension now only syncs bookmarks with VS Code.**
  - The toolbar and its tools (element selector, screenshots, drawing, devices, console, sending to VS Code) are switched off, and their code is commented out.
  - The toolbar button opens the settings page for pairing and link status.
  - The extension asks only for bookmarks and storage access.

### First version

- **Toolbar:** Alt+Shift+I or the toolbar button opens a draggable toolbar in a closed shadow root. It follows the system light/dark theme, and page CSS can't touch it.
- **Element selector:**
  - Chrome-style box-model highlight and tooltip (color, font, background, margin, padding, contrast with an AA check, accessible name, role, keyboard-focusable).
  - Click to copy; Shift+click to multi-select; Alt+click adds a screenshot; Ctrl+click sends to VS Code chat; ↑/↓ for parent or child.
  - Framework components are detected through a page-context helper.
- **Screenshots:** visible area, full page (stitched, fixed/sticky elements shown once), region and element. They are copied as images, with actions to send to a terminal agent, send to chat, save to the VS Code workspace, or download.
- **Drawing:** the same tools, styles and area screenshots as the VS Code browser (shared code).
- **Devices:** full emulation through the debugger (Chrome), or a device-sized window.
- **Console and network:** console messages, uncaught errors and failed fetch/XHR/resource requests, with Copy errors / Copy failed requests / Copy page context / Send to chat.
- **VS Code link:**
  - Pairing with a 6-digit code, a token, and reconnects that survive browser and VS Code restarts.
  - Two-way bookmark sync with a three-way merge and account bookmark roots in signed-in Chrome.
- **Builds:** Chrome (MV3 service worker) and Firefox (MV3 background scripts) from one source.
