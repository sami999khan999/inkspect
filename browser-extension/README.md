# Inkspect browser extension

A toolbar for working with AI agents on any page, and your bookmarks in sync with VS Code (the VS Code Browser extension), **live and both ways**. It works in Chrome, Edge, Brave, Vivaldi and Opera, and in Firefox.

## Install (unpacked)

```sh
npm install                        # at the repository root
npm run build -w browser-extension # → browser-extension/chrome-extension-build and firefox-extension-build
```

- **Chrome / Edge / Brave / Vivaldi / Opera:** open `chrome://extensions` (`edge://extensions`...), turn on **Developer mode**, click **Load unpacked** and choose `browser-extension/chrome-extension-build`.
- **Firefox:** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and choose `browser-extension/firefox-extension-build/manifest.json`. Temporary add-ons are removed when Firefox restarts.

The extension reaches a page only when you open the toolbar on it (`activeTab`); it has no access to sites otherwise. Chrome also asks for `debugger`, used only by the responsive view's emulation.

## Link with VS Code

1. Keep the browser open with the extension installed. It finds VS Code by itself.
2. In VS Code (with the VS Code Browser extension), click **Pair Browser Extension** at the top of the **Browser** side panel. No code is needed, and the extension's popup shows **Linked**.
   - Fallback: run **Browser: Pair Browser Extension with a Code** in VS Code, then type the code on the extension's settings page, under **Use a code instead**.
3. **First sync:** VS Code asks how to combine bookmarks:
   - **Merge** (duplicates are combined)
   - **Use the browser's**
   - **Use VS Code's**

   It saves a backup of VS Code's bookmarks first.

**How syncing works:**

- Adding, renaming, moving or deleting a bookmark on either side shows up on the other within about a second. The browser inside VS Code uses the same bookmarks.
- If VS Code or the browser was closed, changes are merged when they reconnect. Changes made on one side win, an edit beats a delete, and nothing is duplicated.
- In a signed-in Chrome the link uses your **Google-account bookmark folders**, so bookmarks also reach your other devices through Chrome Sync.
- Several browsers can be linked at once; VS Code passes changes between them.

**The link itself:**

- It is a WebSocket to `127.0.0.1:47110`, which the extension finds automatically. Change the port with `vscodeBrowser.bridge.port`.
- Only paired browser extensions can connect: web pages are refused, and the token is stored only as a hash in VS Code.
- Turn it off with `vscodeBrowser.bridge.enabled`, or stop just the sync with `vscodeBrowser.bridge.syncBookmarks`.

## The toolbar

Press **Alt+Shift+K** or click the extension's button. A toolbar floats over the top of the page (the page isn't moved). Drag it anywhere by the six dots on its right (or focus them and use the arrow keys); it stays where you leave it. It has:

- **Select an element** to capture its details for an AI agent (Alt+click: a screenshot of it; Shift+click for several, Enter captures them all)
- **Draw** on the page, then screenshot just the drawing
- **Screenshots:** visible area, full page, a region or an element
- **Responsive view:** the page at a device's size, centered in the tab and scaled to fit, with presets, a custom size, rotate and zoom. In Chrome it also emulates the device's user agent and touch, network and CPU speed, the color scheme and print media (Chrome then shows its "debugging this browser" bar).
- **Console and network:** copy errors and failed requests for AI
- **Copy page context**, **Bookmark this page**, and the **VS Code link**

**After every capture:** it is copied, saved into the page's project (`.inkspect/` in that folder; the Inbox when no project fits), and a dialog in the middle of the page asks where it goes: each agent of the project (agentmux threads, VS Code terminal agents, chat) is one click or a number key away, Enter picks the default, Shift+number also opens the thread in agentmux, and Esc keeps it saved without sending. **Change project** moves it. Without VS Code or the browser helper, the dialog offers Copy and Download.

**The Saved side panel** (**Saved** in the toolbar or the popup): the captures of the tab's project, or of another, ready to send, open in agentmux or remove.

**About the responsive view:**

- The page loads in a frame of its own tab. Many sites forbid being framed; while the view is open, the extension removes those headers for that site in that tab only.
- The picker, drawing, console and page-context tools don't work inside the frame yet; close the view to use them. Screenshots take the device screen.
- The pixel ratio isn't emulated.

## Development

```sh
npm run watch -w browser-extension      # rebuild chrome-extension-build on change (reload the extension after)
npm run typecheck -w browser-extension
npm test -w browser-extension           # unit tests
npm run test:e2e:browser                # Chrome for Testing + the unpacked extension (headless)
```

| Path              | What it is                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/background/` | The toolbar's helper (captures, emulation, framing), the VS Code link client (`bridge.ts`) and the browser half of bookmark sync (`bookmarks.ts`) |
| `src/content/`    | The toolbar (React in a closed shadow root), inspector, drawing, responsive view, captures                                                        |
| `src/main-world/` | Runs in the page's own world: element details with framework components, console and network hooks                                                |
| `src/options/`    | The settings page: link status, pairing, unlinking                                                                                                |
| `manifest/`       | `base.json` plus `chrome.json` / `firefox.json`, merged by `scripts/manifest.mjs`                                                                 |

The merge logic and the link protocol live in `shared/` (`@inkspect/shared`), which the VS Code extension uses too.
