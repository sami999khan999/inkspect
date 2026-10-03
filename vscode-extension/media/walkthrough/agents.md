# Let agents use the browser

Agents in VS Code chat get browser tools such as `#browserScreenshot`, `#browserGetElement`, `#browserConsoleErrors` and `#browserNavigate`. With them an agent can:

- look at the page you are working on
- read the element you picked
- check console errors after a change

Everything you capture is saved in the project's **Saved** list, then the send dialog offers the project's agents: terminal agents, VS Code chat, and agentmux threads (Shift+number also opens the thread in agentmux). **Enter** sends to the default one; **Esc** keeps it saved for later.

**F12** opens Chrome DevTools. The console and network drawer (the terminal button in the toolbar) copies errors and failed requests for an agent.

For agents outside VS Code, such as CLI agents, turn on the local MCP server and copy its configuration.
