# Inkspect browser extension

Keeps your bookmarks in sync with VS Code (the VS Code Browser extension), **live and both ways**. It works in Chrome, Edge, Brave, Vivaldi and Opera, and in Firefox. That's all it does for now: the toolbar features are switched off (see [Disabled features](#disabled-features)).

## Install (unpacked)

```sh
npm install                        # at the repository root
npm run build -w browser-extension # → browser-extension/dist/chrome and dist/firefox
```

- **Chrome / Edge / Brave / Vivaldi / Opera:** open `chrome://extensions` (`edge://extensions`...), turn on **Developer mode**, click **Load unpacked** and choose `browser-extension/dist/chrome`.
- **Firefox:** open `about:debugging#/runtime/this-firefox`, click **Load Temporary Add-on…** and choose `browser-extension/dist/firefox/manifest.json`. Temporary add-ons are removed when Firefox restarts.

The extension asks only for **bookmarks** and **storage** access.

## Link with VS Code

1. In VS Code (with the VS Code Browser extension), run **Browser: Connect Browser Extension**. It shows a 6-digit code.
2. In the browser, click the Inkspect toolbar button. Its settings page opens; enter the code there.
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

## Disabled features

The toolbar (Alt+Shift+I) is switched off. It had:

- the element selector
- screenshots and drawing
- devices
- console and network tools
- sending to VS Code chat or a terminal agent

Its code is kept, not deleted:

| Where                             | What                                                                                     |
| --------------------------------- | ---------------------------------------------------------------------------------------- |
| `src/background/index.ts`         | The toolbar, capture, emulation and send handlers, commented out at the end of the file  |
| `src/content/`, `src/main-world/` | The toolbar UI and its page-world helper (not built)                                     |
| `scripts/build.mjs`               | Their build entries and the icon font, commented out                                     |
| `manifest/toolbar.json`           | The shortcut, permissions and resources the toolbar needs (not merged into the manifest) |
| `test/e2e/run.mjs`                | The toolbar's end-to-end tests, commented out                                            |

To bring it back, restore those pieces.

## Development

```sh
npm run watch -w browser-extension      # rebuild dist/chrome on change (reload the extension after)
npm run typecheck -w browser-extension
npm test -w browser-extension           # unit tests
npm run test:e2e:browser                # Chrome for Testing + the unpacked extension (headless)
```

| Path              | What it is                                                                                   |
| ----------------- | -------------------------------------------------------------------------------------------- |
| `src/background/` | The VS Code link client (`bridge.ts`) and the browser half of bookmark sync (`bookmarks.ts`) |
| `src/options/`    | The settings page: link status, pairing, unlinking                                           |
| `manifest/`       | `base.json` plus `chrome.json` / `firefox.json`, merged by `scripts/manifest.mjs`            |

The merge logic and the link protocol live in `shared/` (`@inkspect/shared`), which the VS Code extension uses too.
