# Inkspect browser extension

A toolbar for **Chrome, Edge, Brave, Vivaldi, Opera** and **Firefox** that opens on any page with **Alt+Shift+I** (or the toolbar button). It has the same AI-context tools as the VS Code browser, and it **links to VS Code**:

- bookmarks sync both ways
- screenshots and element details go straight to VS Code chat or to an agent running in a VS Code terminal

## Tools

- **Element selector:**
  - Hover shows a Chrome-style highlight (margin, border, padding, content) and tooltip: size, color, font, background, margin/padding, contrast, accessible name, role and keyboard-focusable.

  | Action      | Result                                                     |
  | ----------- | ---------------------------------------------------------- |
  | Click       | Copies the details (Markdown, JSON, selector only or HTML) |
  | Ctrl+click  | Sends them to VS Code chat                                 |
  | Shift+click | Multi-select; Enter copies them all                        |
  | Alt+click   | Also takes an element screenshot                           |
  | ↑ / ↓       | Parent or child                                            |
  | Esc         | Exit                                                       |
  - React, Vue, Svelte and Angular components (with source files) are detected when the page exposes them.

- **Screenshots:** visible area, full page (scrolled and stitched, sticky headers shown once), a region you drag, or an element. The image is copied, then you can send it to the terminal agent or chat, save it into the workspace, or download it.
- **Drawing:**
  - Pens, highlighter, neon, arrows, shapes, text, numbered callouts, blur, eraser; colors, widths and undo/redo.
  - Drawings stay on the page while you scroll.
  - **Screenshot → Drawing area** captures only the part of the page around your drawing, with the drawing on it (or each drawing separately, the viewport, or the full page).
- **Devices:**
  - **Full emulation** (Chrome, Edge, Brave): device presets or a custom size, pixel ratio, touch and mobile user agent, network and CPU throttling, color scheme, print media. Chrome shows its "started debugging this browser" bar while this is on.
  - **Resize window:** opens the tab in a window of that size; no extra permission.
- **Console and network:** console messages, uncaught errors and failed requests (fetch, XHR, images, scripts) recorded while the toolbar is open. **Copy errors**, **Copy failed requests**, **Copy page context** and **Send to chat**.
- **Copy page context:** URL, title, viewport, selected text, recent errors and failed requests, as Markdown.
- **Bookmark this page:** added to the bookmarks bar (and synced to VS Code).

## Install (unpacked)

```sh
npm install                        # at the repository root
npm run build -w browser-extension # → browser-extension/dist/chrome and dist/firefox
```

- **Chrome / Edge / Brave / Vivaldi / Opera:** open `chrome://extensions` (`edge://extensions`...), turn on **Developer mode**, click **Load unpacked** and choose `browser-extension/dist/chrome`.
- **Firefox:** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and choose `browser-extension/dist/firefox/manifest.json`. Temporary add-ons are removed when Firefox restarts.
- **Shortcut:** change it at `chrome://extensions/shortcuts`, or in Firefox at Add-ons → ⚙ → Manage Extension Shortcuts.

## Link with VS Code

1. In VS Code (with the VS Code Browser extension), run **Browser: Connect Browser Extension**. It shows a 6-digit code.
2. In the browser, open the toolbar, click the plug button and enter the code. The extension's settings page has the same field.
3. **First sync:** VS Code asks how to combine bookmarks:
   - **Merge** (duplicates are combined)
   - **Use the browser's**
   - **Use VS Code's**

   It saves a backup of VS Code's bookmarks first.

**Sync behavior:**

- Changes on either side sync within a second.
- After being apart (VS Code closed, browser closed), both sides are merged. Changes made on one side win, and an edit beats a delete.
- In a signed-in Chrome the link uses your **Google-account bookmark folders**, so bookmarks also reach your other devices through Chrome Sync.

**How the link works:**

- It is a WebSocket to `127.0.0.1:47110`, which the extension finds automatically. Change the port with `vscodeBrowser.bridge.port`.
- Only paired browser extensions can connect: web pages are refused, and the token is stored only as a hash in VS Code.
- Turn it off with `vscodeBrowser.bridge.enabled`, or stop just the bookmark sync with `vscodeBrowser.bridge.syncBookmarks`.

## Where it can't run

- `chrome://` and `edge://` pages, the Chrome Web Store, and the built-in PDF viewer. The toolbar button shows ✕ there.
- Content inside cross-origin iframes is picked as the iframe element.

## Development

```sh
npm run watch -w browser-extension      # rebuild dist/chrome on change (reload the extension after)
npm run typecheck -w browser-extension
npm test -w browser-extension           # unit tests
npm run test:e2e:browser                # Chrome for Testing + the unpacked extension (headless)
```

**Layout:**

| Path              | What it is                                                                                |
| ----------------- | ----------------------------------------------------------------------------------------- |
| `src/background/` | Shortcut, injection, captures, emulation, the VS Code link client, bookmark sync          |
| `src/content/`    | The toolbar (React in a closed shadow root), inspector, capture and stitching, panels     |
| `src/main-world/` | Page-context helper: element details with framework components, console and network hooks |
| `src/options/`    | The settings page                                                                         |
| `manifest/`       | `base.json` plus `chrome.json` / `firefox.json` overlays, merged by `scripts/build.mjs`   |

Shared logic lives in `shared/` (`@inkspect/shared`), used by both products:

- element details and selectors
- drawing
- devices
- Copy-for-AI formats
- bookmark merge
- the link protocol
