# Changelog

## Unreleased

- **New agentmux thread only starts it:** picking an agent under New agentmux thread starts the thread and lists it in the send dialog, chosen; nothing is sent until you send. Needs a browser helper or VS Code Browser that knows it.
- **Send to… is grouped by agent:** each agentmux thread is a heading (its name and thread) with Send and Send and open in agentmux beneath it, and the menu stays inside a narrow panel that scrolls.
- **Group only joins cards:** selecting a single group card no longer offers Group.
- **Send dialog polish:** the title stays on one line (hover shows it whole), key caps keep a gap from their button's label (Copy, Download, New agentmux thread), every agent row is as wide as the others, and the footer note is shorter.
- **Builds go to `release/`** at the repository root: load `release/chrome-extension-build` (or `release/firefox-extension-build`) unpacked.
- **Copy in the side panel:** each saved item has Copy, as in VS Code: a screenshot goes on the clipboard as an image, anything else as its text. Large images come from the browser helper in pieces. Needs a browser helper or VS Code Browser that knows it.
- **Group in the side panel:** select two or more saved items and Group them into one card, sent together, as in VS Code (Ungroup splits them again). Needs a browser helper or VS Code Browser that knows it.
- **Send to… has two rows per agentmux thread:** one only sends, the other sends and opens the thread in agentmux.
- **A prompt with the send:** the send dialog has a box for a few words to the agent (I focuses it), pasted before the captures. It needs a browser helper or VS Code Browser that knows it (the box is hidden otherwise).
- **No "started debugging this browser" bar in the responsive view by default:** the device's user agent is now sent with the frame's page request without the debugger. Touch has its own switch (off by default); touch, network, CPU, color scheme and print media still need the debugger and show the bar while they are on.
- **Closed agentmux is said so:** threads no window shows are listed last as "agentmux is closed", Send goes to an open agent instead, and sending to one opens agentmux first.
- **The side panel stays in step:** it looks again every 2 seconds while it is visible and as soon as it comes back into view, keeps its list when the helper doesn't answer once, and Undo goes away when the removed items do (15 seconds).
- **Saved cards:** the checkbox no longer moves the card's content on hover, and **Send to…** is the one place to pick an agent or to send and show an agentmux thread.
- **The toolbar fits narrow windows:** its buttons and the drawing tools wrap into centered rows instead of being cut off at the right, and Stop drawing stays next to Screenshot.
- **Menus and lists fit the narrow side panel**, and the send dialog no longer grows while its New agentmux thread menu is open.

- **Readable console:** styled logs (`%c`) show their text instead of their CSS, and `%s`/`%d` placeholders are filled in, as in DevTools. A long file name no longer squeezes the message into a narrow column (it is cut instead, and shown decoded: `[root].js`, not `%5Broot%5D.js`).
- **Docked in the responsive view:** while it is open, the toolbar is a full-width bar across the top, with the view right under it, and can't be dragged; closing the view puts it back where it was.
- **The toolbar stays open when the page reloads** (or the tab goes to another page of the same site): it comes back by itself.
- **Copy for AI buttons** are named by what they copy: Console errors, Failed requests, Page context.
- **The toolbar floats:** instead of a full-width bar that pushed the page down, it is a panel over the page, as wide as its buttons. Drag it by the six dots on its right (it follows on a spring and settles inside the window), or focus them and use the arrow keys; it stays where you leave it, on every page. Panels open on the side with more room. The page is no longer moved, so apps that scroll inside no longer get a blank band at the top (or in their screenshots).
- **Saved in the toolbar:** opens the side panel with the page's project's captures.
- **Drawings belong to their page:** each page keeps its own drawings. Going to another page (also a single-page app's route change) shows that page's, and coming back, or reloading, brings them back.
- **Drawings stay on scrolling sections:** a drawing on a part of the page that scrolls by itself (a sidebar, a list, a chat) moves with it when it scrolls and is hidden outside it, on screen and in screenshots. While drawing, the wheel scrolls the section under the pointer.
- **Screenshots include your drawings:** the Screenshot menu (visible area, full page, region, element) keeps what you drew on the page, as long as the drawings are shown. Hide them (the eye button) for a clean screenshot.

- **Send dialog keys:** the page behind it no longer scrolls, Tab keeps the focus inside it (also while it is saving), and the Up and Down arrows pick the agent that Enter sends to.

- **The link graph shows every open VS Code window**, not only the one that answers; the window serving the link is lit. The send dialog has a clearer layout: stacked previews, an icon tile and two lines per agent, keys on the right.

### Saved, then sent: one flow for every capture

- **Every capture is saved at once** into the page's project, without a question, then a **send dialog** opens in the middle of the page (the popup's buttons in the corner are gone): the project's agents, one click or number key each (agentmux threads, VS Code terminal agents, chat), **Enter** for the default, **Shift+number** (or the ↗ button) to send and open the thread in agentmux, **New agentmux thread** (where agentmux has the project open), **Change project** (moves the capture there, and the site's next captures too), **Copy** and **Download**. **Esc** keeps it saved without sending.
- **The same with or without the browser helper:** over the WebSocket link, VS Code answers like the helper, so captures are saved into projects, and the side panel works, without it.
- **The side panel is "Saved":** the project of the tab in front (it follows the tab), or another picked from the list (with the Inbox for captures without a project), with the same cards as VS Code's Saved view: groups with a thumbnail each, **Send**, **Send to…**, **Open in agentmux**, **Remove** and **Undo**. Projects where nothing runs keep their captures but can't send. The popup's button is **Saved**.
- **The element picker, simpler:** a click captures the element's details; **Alt+click** a screenshot of it; Shift+click adds to a selection and Enter captures them all. Ctrl+click and Ctrl+Shift+click no longer send. One-line hint; the selection bar has Capture, Screenshot and ×.
- **One pairing card** on the settings page, in the popup and in the toolbar's VS Code panel: the one-click way first, a code as the fallback, and what works without VS Code when the helper links the browser.
- The console panel's "Send page context to VS Code" is gone: **Copy page context** saves it and opens the send dialog like any capture.

### Projects

- **Links through the browser helper** that VS Code Browser installs: no pairing, and captures can be saved and sent even with VS Code closed. Without it, the WebSocket link works as before.
- **Save and send to a project:** after a screenshot or a copy, the popup picks the project (it suggests the one the site went to before, or the one whose dev server serves the page) and offers **Send to agent**, **Send to…** and **Save to project**. Captures are kept in the project's `.inkspect/` folder and appear in its VS Code Agent Context; sends go to its agents in agentmux, VS Code terminals or chat.
- **The Projects side panel** (from the popup): every project with its saved captures, ready to send or remove; pin the ones to keep listed.

### Fixes

- **New default keys that leave Chrome its own:** the toolbar's modes are Alt+Shift+letter (element picker Alt+Shift+E, draw W, screenshot G, console J, responsive view M), so DevTools keeps Ctrl+Shift+C, J, I and M. Keys you changed stay as they are.
- **Shortcuts work on every keyboard layout** (the letter on the key, not its place), and AltGr typing never runs one.
- **Reset all shortcuts and Unlink take a second click** ("Click again to …"): both reach VS Code.
- **Errors stay 8 seconds**, and a popup worked from the keyboard stays until you leave it.
- A window picked in a popup applies to that popup only; a late "Sent" message no longer replaces a newer capture's popup; the popup's keys only work for its own buttons, and not with nothing checked; the drawing Screenshot menu's keys work while it is open.
- **Several picked elements are a group in VS Code:** each element is its own row in Agent Context, with a checkbox; sending them goes in one send.
- Several elements sent to VS Code are titled "4 elements", not "Element 4 elements".
- **Several screenshots at once:** the popup shows each with a checkbox; the buttons act on the checked ones ("Send 2 to chat", "Download 2"). Sent to VS Code, they are one group in Agent Context and go to the agent in one send.
- **A tidier picker hint:** two rows, mouse actions then keys, with the selection bar just above it.
- **Pick the agent with the click:** in the element picker, Ctrl+click sends the element to the chat agent and Ctrl+Shift+click to a terminal agent (Cmd on macOS). The hint says so.
- **A bar for Shift+click selections:** "2 selected" with Copy details (Enter), Chat agent, Terminal agent, Screenshot (each element), Save (the details, in the workspace) and ×, all acting on every selected element. Sending needs the link to VS Code; without it the bar offers Copy details and Screenshot.
- **"Send to chat" goes to the chat.** It used to go to VS Code's default agent, which could be a terminal agent; "Send to terminal" is there for that.
- **A clearer element-picker hint,** in plain words: "Click an element to copy its details · Ctrl + click chat agent · Ctrl Shift + click terminal agent · Shift + click select several · Alt + click screenshot it │ ↑ ↓ parent / child · Enter copy selected · Esc stop", with key caps, in your own keys when you remap them. Shared with VS Code Browser.
- **The popup after a capture has keys:** Alt+Shift+X send to the terminal, Alt+Shift+C send to chat, Alt+Shift+S save in VS Code, Alt+Shift+D download. The popup shows them (Alt Shift + once, then each button's letter); change them in Shortcuts ("After a capture").
- **Popups behave like popups:** in the toolbar, a press anywhere else on the bar closes an open panel (console, shortcuts, VS Code link, emulation), and a panel's or menu's own button now closes it instead of closing and reopening it.
- **Pencil (I), brush (U), neon (G) and double arrow (D) keys work in the toolbar:** only the tools that once had a letter on the drawing toolbar were wired up.

### New logo

- **A new, simpler logo:** an ink drop inside white "inspect element" corner brackets, on a dark tile, readable down to the 16 px toolbar icon. Its source is `brand/logo.svg` (shared with VS Code Browser); `npm run logo` renders every size.
- Fixed "Uncaught (in promise) Error: No SW" on the extensions page: the toolbar button's title was updated while the background was still starting.

### The toolbar is back, across the top of the page

- **Alt+Shift+K** (or the extension's button) opens the toolbar again, now as a **full-width bar that slides down from the top**. The page moves down to make room, and fixed and sticky headers move with it, so nothing hides under the bar. While drawing, the drawing tools are its second row. Screenshots of the visible area and the full page leave out the room made for the bar.
- **Responsive view:** the page at a device's size, **centered in the tab** and scaled to fit, with device presets, a custom width and height, rotate and zoom. It replaces full emulation, which drew the page at the tab's top-left, and the "Resize window" mode. In Chrome, the emulation panel adds the device's user agent and touch, network and CPU throttling, the color scheme and print media, applied as you change them.
- Sites that forbid being framed still load in the responsive view: while it is open, the extension removes those headers for that site, in that tab only. New permission: `declarativeNetRequestWithHostAccess`.
- The picker, drawing, console and page-context tools don't reach inside the responsive view yet, and are disabled while it is open.

### Shortcuts, shared with VS Code

- **The toolbar uses VS Code Browser's shortcuts**, remapped keys included: the modes (element picker, drawing, the Screenshot menu, the responsive view, console), every drawing tool, color and stroke key, the drawing Screenshot menu (S, and a key per item), the Screenshot menu's letters and the element picker's keys. Buttons and menus show the current keys.
- **Change them from the toolbar** (the keyboard button in the top bar) or on the full page: click a key and press the new one. Changes sync both ways: to VS Code through the link, and VS Code's changes arrive here; they also follow your browser account.
- **Every shortcut is listed**, not only the toolbar's: VS Code Browser's own (tabs, the address bar, measure, record...) are there too, tagged **VS** (only BR-tagged keys work in the toolbar), and can be changed here; it is one key map, synced both ways. The Shortcuts tab also shows the browser's own key that opens the toolbar, with a link to change it, and **Reset all** resets every shortcut.
- **Search by shortcut:** type it in any form ("alt shift k", "Alt+Shift+K", "shift alt k", "option shift k"), or just press it while the search box has focus and it becomes the search. Plain typing and the box's editing keys (Ctrl+A, Ctrl+V, Ctrl+Z...) work as usual.
- **Tags for where each key works:** **VS** (VS Code Browser) and **BR** (the Inkspect toolbar in your browser), in the Shortcuts view and in the browser extension. While the search box has focus it traps every shortcut you press (Ctrl+C and Ctrl+V included) and searches for it.
- **The shortcut search really traps keys now:** it catches them before the page, the toolbar or VS Code can act on them, and the toolbar's own browser key (Alt+Shift+K) is searched for instead of closing the toolbar. Keys the browser keeps for itself (DevTools: Ctrl+Shift+I/J/C, F12; Ctrl+T, Ctrl+W, Ctrl+N) never reach a page: type those instead.

### One-click pairing

- **No more codes to type:** click **Pair Browser Extension** in VS Code's Browser side panel, and the popup and settings page show **Linked** within seconds. The code is still there under **Use a code instead**.
- The settings page and popup say what to do in VS Code, and no longer show a code form while VS Code isn't running.
- An unpaired browser looks for VS Code every 5 seconds at most (it was up to 30), so pairing right after starting VS Code is quick.

### Popup and full page

- **The toolbar button opens a popup**: the link's state, the open VS Code windows (the one used last marked), the main keys, a button that opens the toolbar on the page (with its key), and **Open Inkspect**.
- **The full page** (Open Inkspect, or the extension's options) has tabs: **VS Code** (pairing, and every open window), **Shortcuts** (the full editor) and **About** (version, the toolbar key and where to change it, what the extension can reach).

### A new look for the popup and the full page

- **The link, drawn:** the popup and the full page show this browser with a branch to every open VS Code window; the branch to the window used last (where sends go) is lit and marked "Sends go here". The popup lists every window, in a stable order (by name). The lit line runs from the browser down to the window used last, and moves when you switch VS Code windows; the rows stay put.
- **The popup's open button shows its key.** The default is now **Alt+Shift+K**: Chrome and Edge keep Alt+Shift+I for their own "Report an issue", so the old default was never assigned. If the browser still assigns none (another extension has the key), the popup says so and links to the browser's shortcut settings.
- **The full page:** a top bar with the sections as pills (VS Code, with the number of windows; Shortcuts; About) and the link's state; a headline next to the link, drawn on a dot-grid canvas, with the flow to the window used last as its one animation; and cards with icon tiles. Pairing is a numbered two-step card.
- **The popup:** the link at a glance on the same canvas, the Open toolbar button with its key, the main keys as tiles with icons, and Open Inkspect.

### Roomier capture popup and console panel

- **The "copied" popup has room:** a larger thumbnail with the title and hint on top; below a divider, "Send to" with the VS Code window, then the buttons (the VS Code ones together, Download set apart).
- **The console panel sends to the window you pick** (the same picker, "Last used" first), and is laid out in groups: the log (with level icons, and a clear empty state), "Copy for AI", and "Send page context to VS Code" (Send to terminal, Send to chat). It now uses the shared tabs and buttons.

### Captures reach VS Code by themselves

- **Everything you capture with the toolbar appears in VS Code's Agent Context list**, while linked, as you take it: screenshots and drawings (each drawing of "Each drawing separately" too), element details, console errors, failed requests and page context. It goes to the window you used last, without reaching an agent; sending it later (terminal, chat) uses that same item instead of adding another.
- **"Each drawing separately" shows all its images in one popup** (stacked, with their number), and Send, Save all and Download all act on every one of them. The first is copied.
- **The star shows whether the page is bookmarked** (filled, in the theme's blue), and toggles: click it again to remove the bookmark. It follows the address and checks again when you come back to the tab.
- Menus have a little room between their items, and the pointer and the keyboard share one highlight.
- The shortcut list's group headers stay pinned at the top while you scroll (in the toolbar's panel, and below the full page's top bar).
- No glow effects on the popup and the full page.

### Fixes

- **The element picker has one way to do each thing:** a click copies the element's details, Alt+click takes a screenshot of it (only that; it used to copy the details too, over the image). The S key no longer screenshots the element.

- **Drag to resize the responsive view:** handles on the screen's right edge, bottom edge and corner, like DevTools. Dragging makes it a custom size; the zoom holds still while you drag.
- **Redact pixelates, like in the VS Code browser:** the page is captured when there are redactions (and again after scrolling), so they pixelate what is under them. They blur for a moment until the new capture arrives.

- **A new look for the "copied" popup:** a thumbnail of the capture, a title with a status icon and a hint, buttons with icons (the first send stands out), and a close button. It stays while the pointer is on it.
- **"Custom size" works** in the responsive view: it keeps the current size, now editable, and typing goes straight to the width.
- **Choose the VS Code window** in the popup when several are open: sends and saves go to that window, or to the one you used last when you don't choose (each popup starts on "Last used").

- **Menus and lists take clicks** (the screenshot menu, the drawing tools' capture menu, the responsive view's device and zoom lists, the emulation panel): a click on an item was taken for a click outside, which closed the popup before the item ran. The toolbar's shadow root is closed, and from outside a closed root, clicks inside it don't show what they hit; popups now judge them from inside the root.
- **Esc leaves the element picker** even right after clicking its button (the focus stayed in the toolbar, whose keys the picker ignored), and typing a text annotation no longer switches drawing tools.
- **Redact works while drawing:** it blurs the page behind it live (it showed a flat grey box, because there is no image of the page to pixelate). Screenshots still pixelate the area.
- **The element picker's highlight stands out** on any page: a crisp blue outline around the element, and lighter box-model colors so its text stays readable.
- Typing in the responsive view's width or height box replaces the number.
- The end-to-end tests also run the real build (closed shadow root, opened through the extension's button, real mouse clicks); the test build's open shadow root had hidden these bugs.

### Shortcuts sync

- The VS Code browser's shortcuts are kept in this browser's sync storage (`chrome.storage.sync`), so they follow your browser account to other devices; the newer copy wins. No bookmarks are used, and no new permissions.

### Redesigned settings page

- The settings page uses the same design system as VS Code Browser, in light and dark: one centered card with a browser-to-VS Code link graphic that shows the state (dashed until linked, a moving dot while connecting or linked), a status pill, a heading for each state, numbered pairing steps, and a larger six-box code field that pairs as soon as the last digit is typed (pasting a code works too).

### Fixes

- **No more "WebSocket connection … failed" errors** on the extension's Errors page while VS Code is closed. Chrome logs every refused WebSocket there, and JavaScript can't catch it; the link now checks the port with a plain request first (a refused request logs nothing) and opens the WebSocket only when VS Code is listening.

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
