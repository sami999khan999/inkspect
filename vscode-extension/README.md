# VS Code Browser

A full web browser inside a VS Code editor tab, built for working with AI agents. Use it to:

- pick elements and hand their details to an agent
- draw on pages and capture only the area around the drawing
- take full-page, viewport, region and element screenshots
- test at any resolution
- run Chrome extensions
- let agents drive the browser through built-in chat tools or MCP

Pages are rendered by a real Chromium (Chrome for Testing, downloaded once on first use, about 150 MB) and controlled over the Chrome DevTools Protocol. The page is streamed into the editor tab, and your mouse and keyboard input goes back to it. It is not an iframe, so every site loads, and the element picker, screenshots and extensions have full access to the page.

## Features

### Browsing

- **Tabs:**
  - Open, close, reopen closed tabs, duplicate, pin and drag to reorder.
  - Move a tab to a new window.
  - Private tabs.
  - Popups and `target=_blank` links open as tabs.
  - Unused background tabs are unloaded to save memory.
- **Address bar:**
  - Takes URLs, `localhost:3000`, file paths or search terms.
  - Suggests from bookmarks, history and open tabs.
  - Shows a security indicator.
- **Bookmarks:**
  - Star button (Ctrl+D) and a bookmarks bar with folders.
  - A manager page.
  - Import from Chrome, Edge and Brave or from an HTML file, and export to HTML.
- **History and sessions:**
  - A history page with search.
  - Clear browsing data.
  - Windows and tabs are restored after VS Code reloads.
- **Pages:**
  - Find in page, zoom per site and fullscreen.
  - JavaScript dialogs and file uploads.
  - Downloads, with a `vb://downloads` page.
  - Save as PDF and view source.
  - A full context menu.

### For AI agents

- **Element selector** (Alt+Shift+E): hover to see an element's details. The details include:
  - a unique selector and XPath
  - role and accessible name
  - size, position and key styles
  - the React, Vue, Svelte or Angular component and its source file
  - trimmed HTML

  | Action      | Result                                                                |
  | ----------- | --------------------------------------------------------------------- |
  | Click       | Copies the details as Markdown (or JSON, selector only or HTML only). |
  | Ctrl+click  | Sends the details to the chat.                                        |
  | Shift+click | Builds a multi-selection.                                             |
  | Alt+click   | Also saves an element screenshot.                                     |
  | ↑ / ↓       | Moves to the parent or child element.                                 |

- **Drawing** (D):
  - Pens, pencil, marker, brush, highlighter and neon.
  - Arrows, lines, rectangles and ellipses.
  - Text, numbered callouts and a blur box for private data.
  - Colors, widths and dash styles.
  - Drawings stay anchored while you scroll.
  - **Screenshot drawing area** captures only the part of the page around your drawing, with the drawing on it. You can also capture each drawing group separately, or the whole viewport or page with the drawings.
- **Screenshots:** viewport, full page (including very tall pages), a region you drag, or an element. Each is saved to `.vscode-browser/screenshots` and its path is copied, ready to paste into an agent. The notification can send the image to the chat.
- **Console and network drawer:**
  - Console messages with levels and filters, and clickable sources that open workspace files.
  - A request list with failed requests highlighted.
  - **Copy errors**, **Copy failed requests** and **Copy page context**, formatted for an agent.
- **Chrome DevTools** (F12) opens beside the browser.
- **Agent tools in VS Code chat:**

  | Tool                     | What it does                      |
  | ------------------------ | --------------------------------- |
  | `#browserNavigate`       | Opens a page.                     |
  | `#browserScreenshot`     | Takes a screenshot.               |
  | `#browserGetElement`     | Reads an element by CSS selector. |
  | `#browserGetSelection`   | Reads your last picked element.   |
  | `#browserConsoleErrors`  | Reads console errors.             |
  | `#browserFailedRequests` | Lists failed requests.            |
  | `#browserPageContext`    | Summarizes the page.              |
  | `#browserGetPageText`    | Reads the page's visible text.    |

  Navigation asks first. There are no tools that click, type, run scripts or read cookies.

- **MCP server for other agents:** the same tools, served over HTTP on 127.0.0.1 with a token. It is off by default. Turn it on with **Browser: Copy MCP Server Configuration**, which copies a ready `mcpServers` entry or a `claude mcp add` command.

### Resolutions and devices (Alt+Shift+M)

- Presets for phones, tablets and desktops up to 4K, custom sizes and your own presets.
- Pixel ratio, rotation, and touch and mobile emulation.
- Network throttling (offline, slow 3G, fast 4G) and CPU throttling.
- Light, dark and print media.
- Large sizes are rendered at full resolution and scaled to fit.

### Chrome extensions

- Install from a Chrome Web Store link or ID, a `.crx` or `.zip` file, or an unpacked folder.
- Enable, disable, update and remove them on `vb://extensions`.
- Extension buttons appear in the toolbar, and their popups open over the page.

## Using it

- Click the **Browser** icon in the Activity Bar. The sidebar has actions, open tabs and bookmarks, and pages open in editor tabs next to your code.
- Or run **Browser: Open** or **Browser: Open URL...**, click **Browser** in the status bar, use **Open in Browser** on an HTML file, or Ctrl+click a `localhost` link in the terminal.
- **Help → Welcome → Get started with VS Code Browser** walks through the main features.
- Shortcuts while the browser is focused (⌘ on macOS):

  | Keys                                   | Action                                  |
  | -------------------------------------- | --------------------------------------- |
  | Ctrl+T, Ctrl+W, Ctrl+Shift+T, Ctrl+Tab | New, close and reopen tabs; switch tabs |
  | Ctrl+L                                 | Focus the address bar                   |
  | Ctrl+R, Ctrl+Shift+R                   | Reload, hard reload                     |
  | Alt+Left / Alt+Right                   | Back / forward                          |
  | Ctrl+F                                 | Find in page                            |
  | Ctrl+= / Ctrl+- / Ctrl+0               | Zoom in, out and reset                  |
  | Ctrl+D                                 | Bookmark the page                       |
  | Ctrl+Shift+B                           | Show or hide the bookmarks bar          |
  | Alt+Shift+E                            | Element selector                        |
  | Alt+Shift+W                            | Draw on the page                        |
  | Alt+Shift+M                            | Device toolbar                          |
  | F12                                    | DevTools                                |

  Every key can be changed in the **Shortcuts** view of the Browser sidebar. The modes use Alt+Shift, so VS Code's own keys (Quick Open, the panel, Explorer, Problems...) keep working while the browser has focus.

## Known limitations

- **Sites that block automated browsers.** Google may show a CAPTCHA, and some sign-in pages may block you. Use **Open in system browser** for those.
- **Permission requests** (location, notifications, camera, microphone) are denied.
- **Streaming.** The page is streamed as images, so very fast animations look less smooth than in a normal browser.
- **Extensions:**
  - Manifest V2 extensions don't work.
  - Extension context menu items and native messaging are not supported.
  - Extensions whose toolbar button has no popup only partly work.
- **Remote windows (SSH, WSL, containers).** The browser runs on your local machine. Remote dev servers are reached through VS Code's port forwarding, and screenshots are saved to the extension's storage instead of the remote workspace.
- **DevTools debugging port.** Opening DevTools needs a debugging port on 127.0.0.1, which other programs on this computer could also use. Turn it off with `vscodeBrowser.devtools.enabled`.

## Settings

All settings are under `vscodeBrowser.*`. They cover:

- **Browsing:** home page, search engine, session restore.
- **Chromium:** a custom executable and extra switches.
- **Rendering and tabs:** rendering quality, tab limit.
- **Files:** downloads folder, and the screenshot folder, format and default action.
- **Element selector:** copy format and fields.
- **Drawing and devices:** drawing behavior, custom device presets.
- **Integrations:** DevTools, agent confirmations, MCP server, terminal links, live reload.

## Development

Requirements: Node 22.12+ and VS Code 1.101+.

```sh
npm install
npm run build      # extension host (esbuild) + webview (Vite)
```

Press **F5** in VS Code to start an Extension Development Host, then run **Browser: Open**.

| Script               | What it does                                                                                |
| -------------------- | ------------------------------------------------------------------------------------------- |
| `npm run build`      | Build `dist/extension.js` and `dist/webview/`                                               |
| `npm run watch`      | Rebuild both on change                                                                      |
| `npm run typecheck`  | Type-check the host and the webview                                                         |
| `npm run lint`       | ESLint                                                                                      |
| `npm test`           | Unit tests (Vitest)                                                                         |
| `npm run test:e2e`   | Integration tests in a real VS Code (set `VSCODE_EXECUTABLE` to reuse an installed VS Code) |
| `npm run sync:tools` | Update `contributes.languageModelTools` after changing `src/agent/tools.ts`                 |
| `npm run package`    | Build a `.vsix`                                                                             |

The roadmap, with what is done and what is left in each phase, is in `plans/vscode-browser-plan.md` in the repository.

## Layout

```
src/extension.ts      activation, status bar, terminal links, live reload, agent tools
src/commands.ts       command palette and keybinding commands
src/engineHost.ts     starts/stops the shared browser engine, downloads Chromium, crash restart
src/browser/          Chromium and CDP: BrowserEngine, TabSession, input mapping, page scripts
src/panel/            BrowserPanel (a browser window with tabs), inspector, DevTools panel
src/features/         bookmarks, history, sessions, downloads, screenshots, extensions, zoom
src/agent/            language model tools, MCP server, send to chat
src/sidebar/          Activity Bar views
src/shared/           code shared with the webview: protocol, URLs, devices, element info
webview/src/          React UI: tabs, toolbar, viewport, overlays, drawing, internal pages
test/unit/            Vitest unit tests
test/e2e/             integration tests run inside VS Code
test/fixtures/        fixture extension
media/walkthrough/    Get Started walkthrough pages
plans/                roadmap
```
