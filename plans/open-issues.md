# Open issues

What is known and not done yet, across both products: found by the review of September 2026 (bugs, UI/UX and keyboard shortcuts) and left over from earlier work. Fixed items were removed; each open one says where to start. Keep this list current: tick an item when it is done, or move it into the product's plan.

## Bugs

- [x] *(Through the browser helper: captures are saved in the project and every window reads them from disk.)* **Browser sends split between two VS Code windows.** A group's re-shared screenshots ("context") and the later send naming their `captures` are relayed separately (`windowRelay.ts` claim, `bridgeServer.ts` runSend). If the target window doesn't claim the re-share in time, the serving window keeps it and the send then fails with "Some of those screenshots are not in this VS Code window". Fix the target window once for the whole send, or carry the images in the `captures` send as a fallback.
- [x] *(Through the browser helper: group members carry `groupIndex`.)* **Relayed group members arrive in random order**, and re-sharing only the checked ones moves them to the top of Agent Context (the group looks split). Carry each member's index and sort `inGroup` by it; re-share without moving (`add(..., { quiet: true })`).
- [ ] **Browser: pairing with a code can show an error that isn't one.** The server's `unpaired` answer to the connection's first `hello` resolves `pairWaiter` (`browser-extension/src/background/bridge.ts`), so the page shows "This browser is not paired" a moment before pairing succeeds. Resolve it only on `paired` or on real pairing errors (`bad-code`).
- [ ] **Shared globalStorage files are written without retry or locking** (`bridgeServer.ts` `writeShared`). On Windows a rename fails while another window reads the file; `bridge-offers.json` is read, changed and written by several windows. Reuse the relay's retrying write; let only the serving window write the offers file.
- [ ] **No limit on pairing-code attempts.** Any extension origin can try codes while one is valid. Close the socket (or drop the code) after about 5 wrong ones.
- [x] *(Agent Context is the `.inkspect/` store: images are files, with a small JPEG for the browser's lists.)* **Agent Context keeps full-size images in memory** when they have no file (every browser share), up to 60 of them, and posts the full bytes to the view as thumbnails. Write the file with `fileOf` before dropping bytes; send a downscaled thumbnail.
- [ ] **Browser toolbar: a panel opened by its key reopens when its button is clicked** (the opener is the last pointer press, not the panel's button). Find the opener by panel (`data-panel`).
- [ ] **Browser toolbar in the picker or region mode:** mode keys go to the page (Alt+Shift+E doesn't turn the picker off), and in the responsive view mode keys are consumed without doing anything.
- [ ] **Browser extension Ctrl+D removes a bookmark** without asking when the page is bookmarked already (Chrome opens an edit bubble).
- [ ] **Search by shortcut** misses macOS ⌫ ⌦ ⇥ and "?" (typed as Shift+/).
- [ ] **Screen recording as GIF**: not done (WebM needs no encoder; agents read video paths). *(From the VS Code plan.)*

## Keyboard shortcuts

- [ ] **Web apps lose keys inside VS Code Browser.** Its dispatcher takes browser keys before the page (Ctrl+D, Ctrl+L, Ctrl+U, Ctrl+H, Ctrl+Shift+L, Ctrl+R, F5...), where Chrome lets pages override most of them. Keep a short reserved list (tabs, address bar, reload, back/forward, F12) and let pages handle the rest first, or add a setting.
- [ ] **Escape and menu keys in VS Code Browser's modes:** with a menu or popover open during a mode, Esc also exits the mode; Up/Down/Enter in the menu run the mode's keys (parent/child, capture). Dispatch only the menu's scope while a menu is open, as the browser extension does.
- [ ] **macOS Option typing** in the modes that leave the page usable (console, device, overlay, record use Alt+letter): Option characters and Option+Arrow word jumps are taken, and Option+Backspace cancels a recording. Skip Alt-only keys in text fields and the page on macOS; give `record.cancel` a key that isn't an editing key.
- [ ] **`findConflicts` misses overlaps that happen:** drawing with the console open (Alt+F is "full-page capture" and "filter"), concurrent modes shadowing global keys (overlay Alt+Left/Right vs Back/Forward), the capture popup with drawing.
- [ ] **Keys are not per platform.** A key recorded on a Mac (`cmd+…`) syncs to Windows as Win+…; a Windows `ctrl+…` arrives on the Mac as Control. Store overrides per platform or translate; show "Win" in `formatKey`.
- [ ] **Recording a key:** plain letters can be recorded into global or concurrent scopes (they would swallow typing on every page); Esc and Backspace can't be recorded (they cancel or delete) although defaults use them; the search box's trap and recording can interfere. Warn about plain keys there; offer Esc/Backspace as choices; clear the search trap while recording.
- [ ] **The shortcut search box traps Ctrl+V** (on request: every shortcut pressed becomes the search), so text can't be pasted into it.
- [ ] **Discoverability:** the cheat sheet and Quick actions only list the current mode (not the console, device, overlay or record keys); the DevTools drawer hard-codes "F12"; color swatches don't show 1–9; `nav.stop`, `tab.duplicate`, `page.external`, `device.close` have no key; the browser's screenshot menu has no "Drawing area" item although `D` works there.
- [ ] **Browser toolbar's shortcuts panel:** Esc doesn't close it, and its own key can't toggle it closed.
- [ ] **The toolbar's Alt+Shift+K** is Chrome's (not in the registry): it can't be shown next to the others' conflicts or recorded in the list.
- [ ] **Settings accept keys that never match:** `parseChord` drops unknown modifier names (`option+d` becomes `d`), and names such as `numpad_add` or `esc` are never produced. Validate keys in the setting schema and when read.
- [ ] **Small ones:** macOS default `cmd+f4` for closing a tab is meaningless; `aria-keyshortcuts` uses "Cmd"/"Up" instead of "Meta"/"ArrowUp"; the `everywhere` VS Code keybindings keep their default keys when remapped; the comment in `shared/src/shortcuts.ts` (TOOLBAR_ACTION_IDS) says `browser-extension/src/shortcuts.ts` dispatches the toolbar keys (it is `content/App.tsx` and `Inspector.tsx`).

## UI and UX

- [ ] **One name per action.** "Chat agent" / "Terminal agent" (selection bar), "Send to chat" / "Send to terminal" (popup), "Send to Agent" (notifications), "Send" (Agent Context), "Sent to VS Code chat" (toasts); "Pair" / "Link" / "Unlink"; "Responsive view" vs "Device toolbar". Pick one pair ("Send to chat" / "Send to terminal agent") and one word for linking; use them everywhere, commands included.
- [ ] **Sentence case** for notification buttons and sidebar tree labels ("Try Again", "Use a Code Instead", "Copy Code", "Send to Agent", "More...", "Reset All", "Start Agent", "Open URL...", "New Private Tab"...), matching the webview's wording exactly.
- [x] *(The picker no longer sends with Ctrl+click; every capture is saved and the send dialog says what can be done.)* **Picker hint when not linked (browser):** it still offers Ctrl+click "chat agent" / "terminal agent", Ctrl+click still tries to send, and the error names a button that doesn't exist ("the VS Code button"). Hide those items when unlinked (`canSend`), copy instead, and name the real button ("Link with VS Code").
- [x] *(Both take a screenshot of the element, and only that.)* **Alt+click differs:** VS Code Browser copies the details with a screenshot, the browser extension takes only the screenshot. Align them (or the wording).
- [x] *(One send dialog after each capture in both products; its status line says where it went.)* **Two confirmations for one action:** a browser Save shows a toast and a VS Code notification; a send shows the webview toast and a status bar message. Keep one.
- [ ] **The browser's region-select hint has no styling** (`App.tsx` region hint uses `inspect-hint` without `picker-hint`): unreadable on many pages. Also align its words with VS Code's ("Drag to select an area · Esc to cancel").
- [ ] **Overlays can collide at the bottom of the page:** the capture popup over the picker hint on narrower windows, the hint under the selection bar when it wraps to 3 rows. Stack the hint and the selection bar in one column; keep the popup above; replace the 90/92 px offsets with tokens.
- [ ] **Menus don't return focus** to the button that opened them, and menu buttons lack `aria-haspopup` / `aria-expanded` (IconButton and Button have no props for them).
- [ ] **High contrast:** the Agent Context and Shortcuts views don't load the high-contrast rules (they live in the browser panel's `styles.css`; move them to `shared/src/ui/ui.css`). The newer pieces have none either (group rows, selection footer and badge, card count, the selection bar, picker hint, thumbnails, the popup's count), and there is no `forced-colors` block in the browser extension; unchecked items are shown by opacity alone.
- [ ] **Firefox: the emulation panel's color-scheme control** looks usable but does nothing. Add `disabled` to Segmented.
- [x] *(The pairing part: one PairCard from the kit, with a busy Pair button and an announced error; the close button is still the panel's own.)* **The toolbar's panels use hand-styled controls** (close button, pairing code input, Pair/Settings buttons) instead of the kit; the Pair button shows no busy state and its error isn't announced.
- [ ] **The Agent Context selection footer** doesn't wrap in a narrow sidebar (about 250 px). Wrap it; make Group icon-only when narrow.
- [ ] **Command titles:** parentheticals such as "(Copy Details for AI)", "(for External Agents)", "(Ignore Cache)" belong in descriptions.
- [ ] **Agent Context empty states:** an empty filter says "Nothing here yet." (offer "Show all"); the tip hard-codes "Ctrl+click" on macOS.
- [ ] **ARIA:** `aria-selected` on list items without a listbox role (drop it; the checkbox says it); the popup's thumbnails have two tab stops doing the same thing.

## Security and linking

- [ ] **Unlinking in the browser doesn't tell VS Code**: the token hash stays until VS Code unlinks it.
- [x] *(Through the browser helper: only the extension id fixed by the manifest key may start it. The WebSocket fallback is unchanged.)* **No pinned extension id or origin**: another installed extension could appear as a waiting browser (it is shown by name before pairing).
- [ ] **The test hooks ship in every build**: `globalThis.__inkspectTest` (toggle the toolbar, pair with a code, link status) is defined in the production background too (`background/index.ts`), not only in the `--test` build. Only the extension's own pages and workers can reach it, not web pages; still, define it only under `__TEST__` (check first that the real-build end-to-end test doesn't use it).

## Projects and the browser helper

- [ ] **Firefox** native host and sidebar are untested (Firefox isn't installed on the development machine); the host manifest is written to both `~/.mozilla` and `$XDG_CONFIG_HOME/mozilla`.
- [ ] **macOS and Windows** don't get the hub yet (the WebSocket link is used there): host manifest locations, the registry on Windows, and named pipes instead of a Unix socket.
- [ ] **`.inkspect/` shows in the Explorer and in search.** It is git-ignored; adding it to `files.exclude`/`search.exclude` is a user choice.
- [ ] **The hub's tmux sockets** come from `INKSPECT_TMUX_SOCKETS` or default to `agents` and `default`; VS Code's `agent.tmuxSockets` setting isn't passed to it. (VS Code reads `INKSPECT_TMUX_SOCKETS` too, so tests keep off the machine's tmux.)
- [ ] **Bookmark sync from two transports at once:** a browser uses one (the helper when installed), but `bookmark-links.json` is written by whichever window serves each; check for lost updates when both a WebSocket browser and a helper browser sync.
- [ ] **A browser on the WebSocket link doesn't switch to the helper** while that link stays up (the helper is looked for when connecting, and again 5 minutes after it wasn't found). Restarting the browser or VS Code switches it.
- [ ] **Two hubs starting at the same moment after a crash** could still both clear a stale lock (very unlikely; an empty lock being written now is no longer taken for stale).
- [ ] **The device-emulation integration test** ("emulates a device and turns emulation off again") failed twice on a heavily loaded machine with touch emulation still on after it was turned off (`touch=5`), and passed in the other runs. Possibly a race between clearing touch emulation and the reload.

- [ ] **`hub.json` has two writers** when a browser uses the WebSocket link while the hub runs: the daemon and the serving VS Code window (both run HubCore). The last write wins (site memory, pins, last project); re-read before writing, or let one of them own it.
- [ ] **The hub's state and the Inbox use XDG folders on every platform** (`~/.local/state`, `~/.local/share`) for the WebSocket link's HubCore, though the Inbox itself stays in global storage outside Linux. Use the platform's folders there.
- [ ] **New agentmux thread** switches agentmux to the project (`agentmux project <dir>`), which may resume its sessions (`resume-on-open`), and waits up to 15 s for the thread's pane; the agent then gets the paste before its prompt may be ready.
- [ ] **The send dialog** shows at most 4 thumbnails and can't leave out some of several captures (they are saved together; remove the unwanted ones from the Saved list).
- [ ] **Open in agentmux** focuses windows on Hyprland only (`hyprctl`); elsewhere it pastes and switches the thread without bringing a window forward.

## Not verified

- [ ] **Sending several images to VS Code chat at once** (`workbench.action.chat.open` with several `attachFiles`) is covered only through a terminal agent in the tests; check it in a real chat.
- [ ] **The Saved views** (group cards, selection, undo, the project switcher) were checked by the end-to-end tests through their data, not by looking at them inside VS Code; the send dialog the same.
- [ ] **Open in agentmux** and **New agentmux thread** were checked against a fake `agentmux` and a private tmux server, not against the real agentmux and Hyprland.
