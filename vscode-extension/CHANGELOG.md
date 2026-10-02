# Changelog

## Unreleased

### Projects, the browser helper and agentmux

- **The browser helper:** on Linux, VS Code Browser registers a small helper with your browsers (Chrome, Chromium, Brave, Vivaldi, Edge, Opera, and Firefox where found). The Inkspect extension then links to VS Code through it, without pairing, and it keeps working with VS Code closed. **Browser: Register Browser Helper** and **Browser: Remove Browser Helper**; setting `vscodeBrowser.hub.enabled`. The WebSocket link and pairing stay for browsers without it.
- **Captures are kept in the project:** Agent Context now lives in the workspace's `.inkspect/` folder (never committed: it ignores itself), so it lasts across sessions, shows what the browser saved into this project, and keeps images on disk instead of in memory. Captures stay until you remove them.
- **Agents in agentmux and tmux:** agents running in tmux panes of this workspace's folders (agentmux threads by default; setting `vscodeBrowser.agent.tmuxSockets`) show in Agent Context next to terminal agents, and sends are pasted into them, without Enter. Antigravity (`agy`) is recognized as an agent.
- Text typed into a terminal that isn't a known agent drops control characters, so page text can't trigger a shell binding.

### Fixes

- **New default keys that leave VS Code its own:** the modes are Alt+Shift+letter (element picker Alt+Shift+E, draw W, screenshot G, console J, device M, measure U, eyedropper Y, overlay O, CSS tweak V, accessibility H), so Explorer, Debug, Problems, Output and Save As keep their keys while the browser has focus. Quick actions is Ctrl+Shift+K and the cheat sheet Ctrl+Shift+/ (Ctrl+K chords and web apps' Ctrl+K and Ctrl+/ work again), Downloads is Alt+Shift+L (Ctrl+J toggles the panel), and Save as PDF has no key (Ctrl+P is Quick Open). Keys the operating system keeps are replaced: close the console Alt+W, close the overlay Alt+Z, pause a recording Alt+Y. Keys you changed stay as they are.
- **Shortcuts work on every keyboard layout:** keys are the letter or sign printed on them, so Ctrl+Z is Undo on French and German keyboards (it closed the tab on AZERTY), Ctrl+- zooms out on a German keyboard and "?" opens the shortcut list everywhere. Typing with AltGr (Czech, Polish, German...) never runs a shortcut.
- **Screenshots taken together no longer overwrite each other** on disk (their names went down to the second), so a group sends every image. A screenshot that fails no longer stops the rest of its group from being offered and sent.
- **Undo in Agent Context:** Clear all, Remove, the Delete key and removing a group can be undone for 15 seconds.
- **Asks first** before deleting a bookmark folder that holds bookmarks (they are removed from linked browsers too), removing a Chrome extension (its files are deleted) and unlinking browsers.
- **Errors stay on screen:** they are marked as errors, last 8 seconds and can be dismissed.
- Esc leaves CSS tweak mode, as its hint says. An Alt+Shift+click screenshot is no longer attached to the next element copied. A selected group card sends only its checked items.
- Pairing: a Pair click is always cleared afterwards (it could pair the next browser without asking), and a browser's "wants to link" notification isn't repeated on every reconnect (for a week; the side panel still offers it).
- Shortcut search finds Ctrl+- and Ctrl++; clicking elsewhere cancels recording a key.
- **Several picked elements are a group too:** one row per element, each with a checkbox, sent together ("Send 3 of 4"), like grouped screenshots. The clipboard still gets all their details at once.
- **Clearer element cards in Agent Context:** the preview names the elements (`h2#title · div.card · +2 more`) instead of showing the Markdown sent to the agent, and several elements show their page, not a framework's internal component (such as Next.js' SegmentViewNode). Previews of other text drop Markdown marks too.
- **Screenshots taken together stay together:** each drawing separately, the screenshots of a Shift+click selection and several captures from the browser extension show as one group in Agent Context, with a thumbnail each, and go to the agent in one send (the chat gets them all attached; a terminal agent gets all the paths at once). Uncheck any to send "2 of 3". Send latest sends the whole group.
- **Select items in Agent Context** (their checkbox, Ctrl/Shift+click, or Space) to send, remove, or **Group** them by hand; a group has **Ungroup**.
- **A tidier picker hint:** two rows, mouse actions then keys ("Click copy details · Ctrl + click chat agent · Ctrl Shift + click terminal agent · Shift + click select · Alt + click with screenshot").
- **Pick the agent with the click:** in the element picker, Ctrl+click sends the element to the chat agent and Ctrl+Shift+click to a terminal agent (Cmd on macOS). The hint says so.
- **A bar for Shift+click selections:** "2 selected" with Copy details (Enter), Chat agent, Terminal agent, Screenshot (each element), Save (the details, in the workspace) and ×, all acting on every selected element.
- **A clearer element-picker hint,** in plain words: "Click an element to copy its details · Ctrl + click chat agent · Ctrl Shift + click terminal agent · Shift + click select several · Alt + click copy with a screenshot │ ↑ ↓ parent / child · Enter copy selected · Esc stop · ? all keys". Keys show as key caps, in your own keys when you remap them, on a dark bar that reads well on any page. Shared with the browser extension.
- **Fixed: shortcuts whose default key was written Alt+Shift+… never worked** (send the page context to the agent, Alt+Shift+P; close the design overlay, Alt+Shift+Esc) unless you changed them. The Shortcuts view also lists the browser extension's new "After a capture" keys (tagged BR).
- **Menus and popups close when their button is pressed again** (menus, the bookmark star, extension popups): before, the press closed them and the click reopened them.

### New logo

- **A new, simpler logo:** an ink drop inside white "inspect element" corner brackets, on a dark tile, as the extension icon and (as an outline) in the Activity Bar. Its source is `brand/logo.svg`; `npm run logo` renders every size.

### Shortcuts for everything

- **Every action has a shortcut, and every shortcut can be changed** in the new **Shortcuts** view of the Browser sidebar: search, click a key to record a new one, add a second key, reset, and fix conflicts. Export and import them as JSON.
- **Search by shortcut:** type it in any form ("alt shift k", "Alt+Shift+K", "shift alt k", "option shift k"), or just press it while the search box has focus and it becomes the search. Plain typing and the box's editing keys (Ctrl+A, Ctrl+V, Ctrl+Z...) work as usual.
- **Tags for where each key works:** **VS** (VS Code Browser) and **BR** (the Inkspect toolbar in your browser), in the Shortcuts view and in the browser extension. While the search box has focus it traps every shortcut you press (Ctrl+C and Ctrl+V included) and searches for it.
- **The shortcut search really traps keys now:** it catches them before the page, the toolbar or VS Code can act on them, and the toolbar's own browser key (Alt+Shift+K) is searched for instead of closing the toolbar. Keys the browser keeps for itself (DevTools: Ctrl+Shift+I/J/C, F12; Ctrl+T, Ctrl+W, Ctrl+N) never reach a page: type those instead.
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
- **Send to Agent** replaces Send to Chat and Send to Terminal: it types into the agent running in a terminal (Claude Code, Codex, Gemini CLI...) without pressing Enter and without focusing the terminal. Long text is written to `.vscode-browser/context/` and its path is typed. Set `vscodeBrowser.agent.sendTarget` to `chat` to use VS Code chat instead.
- **Only real agents get sends.** A terminal counts as an agent when an agent CLI runs under its shell, was started in it, or shows in its title. Plain shells get nothing unless you pick them (**Browser: Choose Agent Terminal**). With no agent running, you can start one (`vscodeBrowser.agent.command`, `claude` by default).

### Agent Context

- A new **Agent Context** view in the Browser sidebar collects everything you capture: picked elements, screenshots and recordings (with thumbnails), console errors (gathered per page as they happen; `vscodeBrowser.agent.collectConsoleErrors`), failed requests, page context, accessibility reports, measurements, colors and CSS changes.
- Each item has **Send** (to the default agent, or another from its menu), copy, open and remove. When several agents run, choose where sends go at the top of the view.
- Agent CLIs get each part as a real paste (like Ctrl+V): text arrives as the text itself (not a file path) and image paths become attached images. Plain shells still get the parts typed on one line.
- **Ctrl+Shift+Alt+A** shows the view and **Ctrl+Shift+Alt+V** sends the latest capture to the agent, from the browser or anywhere in VS Code.
- The view takes its colors from the theme's own palette (its terminal colors), so it fits themes such as Tokyo Night whose button and error colors are dim: cards are soft raised panels without outlines, Send is a solid button in the theme's blue, the newest capture has a "Latest" chip, and each kind of capture has its own hue. Previews show the whole capture, so short element strips are no longer cropped to an empty box.

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

### One-click browser pairing

- **Pair the Inkspect browser extension with one click, no code.** The Browser side panel's first item is **Pair Browser Extension** (also a plug button in its title bar). The browser extension is already connected and waiting, so the click links it and the browser updates by itself. With several browsers waiting, you pick one. With none yet, VS Code waits up to 2 minutes for the browser to show up.
- The item shows the link: **Pair Google Chrome** (waiting to link) or **Linked: Google Chrome**. Clicking it when linked, or the status bar item, offers **Pair Another Browser** and **Unlink All Browsers**.
- The "wants to link" notification's **Pair** button pairs directly too, instead of showing a code.
- The code is now the fallback: **Browser: Pair Browser Extension with a Code**. **Browser: Connect Browser Extension** is renamed **Browser: Pair Browser Extension**.
- The Shortcuts view's "Browser" badge is right in every window, not only the one serving the link.
- **Unlink works from any window.** Before, it only cleared the list in the window you used, while the window serving the link kept the browser connected. Unlinked browsers can be paired again from the side panel, without a notification popping up right away.
- **No endless "Linking…".** If the link is held by a VS Code window that still runs an older version (not reloaded after an update), Pair and Unlink name that window and ask you to reload it (a code still works). Linking a waiting browser gives up after 10 seconds with a message, Cancel just stops, and browsers that went away no longer show as waiting.

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

### Drawing Screenshot menu keys

- **S** opens the drawing toolbar's Screenshot menu, and every item has its own key, shown next to it: Enter (drawing area), Alt+G (each drawing separately), Alt+C (without drawings), Alt+V (visible area with drawings), Alt+F (full page with drawings). Remap them in the Shortcuts view like any other key.
- The shortcuts are now shared with the Inkspect browser extension (the registry moved to `@inkspect/shared`): a key changed in either works in both.

### Browser captures in Agent Context

- Captures from the Inkspect browser extension appear in the **Agent Context** view by themselves (a new "context" send: listed, not sent, nothing copied or saved). Sending the same capture later reuses its item, so nothing is listed twice.

### Fixes

- **The browser link's shared files are written reliably on Windows:** replacing one failed while another window was reading it, silently dropping a send or a window's heartbeat (and leaving temporary files behind). Writes retry, then fall back, and leftovers are cleaned up.
- **A window serving the browser link with an older version** (not reloaded after an update) rejects newer messages, so browser captures didn't arrive. The other windows now notice it and ask you to reload your VS Code windows.

- **Every VS Code window shows the browser link** in its status bar (`$(plug) N`), not just the one serving it; the tooltip names the window it runs through.

- **Redact is coarser:** blocks are at least 10 px and a fifth of the box's short side, so text under a large box can't be read (small blocks left big headings legible).

- **Sends from the browser extension go to the VS Code window you choose, or else the one you used last** (Save too). Only one window serves the browser link (the first to start), and every screenshot or element sent from the browser used to land in that one. Now every window announces itself, the browser can list them, and each send is handed to the chosen window, or the one that had focus last; if that window closed, the serving window takes it. Windows also check for sends every second, since a folder watcher can miss them.

- **The bookmarks bar's » button no longer covers the last bookmark.** The bar measured what fits only when it resized, not when bookmarks grew as their icons loaded; it now re-measures then too, and the button hides anything under it.

- **Dropdowns and menus stand out from the page** in every theme: they get a raised background, a visible border and a real shadow, even in themes (such as Tokyo Night) whose menus share the sidebar's color and whose shadow is transparent.

- **Sharp pages on HiDPI displays.** Headless Chromium capped screencast frames at a scale factor of 1, whatever the page emulated, so on a display scaled to 125% or 150% every frame was stretched up and looked blurry. Frames now arrive at the display's full resolution.

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
