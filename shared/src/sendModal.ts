// The send dialog's choices, as both products list them after a capture: the default agent
// first, then the others, the first nine with a number key. Pure.
import type { HubTarget } from './hub';

/**
 * The targets in the dialog's order: the default first, then the open ones as given, then those
 * agentmux can't show right now (closed).
 */
export function orderTargets(
  targets: readonly HubTarget[],
  defaultTarget: string | undefined,
): HubTarget[] {
  const first = targets.find((t) => t.id === defaultTarget);
  const rest = targets.filter((t) => t !== first);
  return [
    ...(first ? [first] : []),
    ...rest.filter((t) => !t.closed),
    ...rest.filter((t) => t.closed),
  ];
}

/** Where a target runs, as the dialog shows it (a closed agentmux says so). */
export function targetDetail(target: HubTarget): string {
  return target.closed ? `${target.detail} · agentmux is closed` : target.detail;
}

/** The send dialog's status after a send went to `target`. */
export function sentText(target: HubTarget | undefined, sentTo: string): string {
  return target?.closed
    ? `agentmux was closed: opened it and sent to ${sentTo}`
    : `Sent to ${sentTo}`;
}

/** The target a number key (1-9) picks, if any. */
export function targetForKey(key: string, ordered: readonly HubTarget[]): HubTarget | undefined {
  if (!/^[1-9]$/.test(key)) return undefined;
  return ordered[Number(key) - 1];
}

/** A target's icon: an agentmux (tmux) pane, a VS Code terminal, or chat. */
export function targetIcon(target: Pick<HubTarget, 'kind'>): string {
  return target.kind === 'chat'
    ? 'comment-discussion'
    : target.kind === 'tmux'
      ? 'terminal-tmux'
      : 'terminal';
}
