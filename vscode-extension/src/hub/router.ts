// The one way saved items reach an agent, wherever the send starts (the browser through the hub,
// VS Code's Saved view, a shortcut): "these items of this project, to this target". Agents in
// tmux panes are pasted into here; VS Code's own terminals and chat are delivered by VS Code.
// Node only (no `vscode`).
import type { HubTarget, ItemMeta } from '@inkspect/shared/hub';
import { HARNESS_LABELS, parseTargetId, type Harness } from '@inkspect/shared/targets';
import type { PaneTarget } from './agents';
import { newAgentmuxThread, showInAgentmux } from './agentmux';
import { writeLastTarget } from './projectState';
import { partsOf, pasteIntoPane } from './send';
import { readItem, updateItem } from './store';

/** Where a send can go right now, and how to reach what this process can't. */
export interface SendContext {
  /** The project's live targets (tmux panes with their details; VS Code terminals and chat). */
  targets: readonly HubTarget[];
  /** Its default target (see chooseDefault). */
  defaultTarget?: string;
  /** tmux servers agents run on. */
  sockets: readonly string[];
  /** Agents a new agentmux thread can run (empty: agentmux isn't available for this project). */
  harnesses: readonly Harness[];
  /** Sends to a VS Code target (`vscode:<window>:…` or this window's own `terminal:<n>`/`chat`). */
  deliver?: (
    target: string,
    project: string,
    items: readonly ItemMeta[],
    prompt?: string,
  ) => Promise<SendResult>;
  /** The id to remember for a target (VS Code turns its own ids into `vscode:<window>:…`). */
  globalId?: (target: string) => string;
}

export type SendResult = { ok: true; sentTo: string } | { ok: false; error: string };

export interface SendOptions {
  /** Also show the agentmux thread and bring its window to the front. */
  open?: boolean;
  /** What the user wrote with the send: pasted before the items. */
  prompt?: string;
}

/**
 * Sends saved items to a target: 'default' (or nothing) for the project's default, `terminal`
 * for its default agent other than chat (older browser builds). Records where they went (on
 * the items, and as the project's last target).
 */
export async function sendItems(
  ctx: SendContext,
  project: string,
  ids: readonly string[],
  target = 'default',
  options: SendOptions = {},
): Promise<SendResult> {
  const items = ids.flatMap((id) => readItem(project, id) ?? []);
  const { prompt } = options;
  if (!items.length) return { ok: false, error: 'Those captures are gone.' };
  let id = target;
  if (id === 'default') id = ctx.defaultTarget ?? '';
  else if (id === 'terminal') {
    id =
      [ctx.defaultTarget, ...ctx.targets.map((t) => t.id)].find(
        (t) => t && ctx.targets.some((x) => x.id === t && x.kind !== 'chat'),
      ) ?? '';
  }
  const parsed = id ? parseTargetId(id) : undefined;
  if (!parsed) return { ok: false, error: 'No agent is running for this project.' };

  let sent: SendResult;
  let remembered = id;
  if (parsed.kind === 'agentmux-new') {
    if (!ctx.harnesses.includes(parsed.harness)) {
      return { ok: false, error: `agentmux can't start ${HARNESS_LABELS[parsed.harness]} here.` };
    }
    try {
      const thread = await newAgentmuxThread(project, parsed.harness, ctx.sockets);
      await pasteIntoPane(thread.socket, thread.paneId, partsOf(project, items, { prompt }));
      remembered = thread.id;
      sent = { ok: true, sentTo: thread.label };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  } else {
    const chosen = ctx.targets.find((t) => t.id === id);
    if (!chosen) return { ok: false, error: 'That agent is not running any more.' };
    if (parsed.kind === 'tmux') {
      try {
        await pasteIntoPane(parsed.socket, parsed.pane, partsOf(project, items, { prompt }));
      } catch (error) {
        return {
          ok: false,
          error: `Could not paste into ${chosen.detail}: ${(error as Error).message}`,
        };
      }
      sent = { ok: true, sentTo: chosen.label };
      // No window shows agentmux: open it, so the paste isn't left where nobody sees it.
      if (options.open || chosen.closed) {
        await showInAgentmux(chosen as PaneTarget, ctx.sockets).catch(() => {});
      }
    } else if (ctx.deliver) {
      sent = await ctx.deliver(id, project, items, prompt);
    } else {
      return { ok: false, error: 'That agent is in a VS Code window that is not reachable.' };
    }
  }
  if (!sent.ok) return sent;
  // Sent: failing to note it doesn't make the send fail.
  try {
    markSent(project, items, sent.sentTo);
    writeLastTarget(project, ctx.globalId?.(remembered) ?? remembered);
  } catch {
    // Read-only project: the send happened all the same.
  }
  return sent;
}

/** Records on each item that it went to `agent`. */
export function markSent(project: string, items: readonly ItemMeta[], agent: string): void {
  for (const item of items) {
    updateItem(project, item.id, (meta) => ({
      ...meta,
      sentTo: meta.sentTo.includes(agent) ? meta.sentTo : [...meta.sentTo, agent],
    }));
  }
}
