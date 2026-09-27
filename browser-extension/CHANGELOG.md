# Changelog

## Unreleased

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
