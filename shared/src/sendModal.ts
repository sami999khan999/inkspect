// The send dialog's choices, as both products list them after a capture: the default agent
// first, then the others, the first nine with a number key. Pure.
import type { HubTarget } from './hub';

/** The targets in the dialog's order: the default first, the rest as given. */
export function orderTargets(
  targets: readonly HubTarget[],
  defaultTarget: string | undefined,
): HubTarget[] {
  const first = targets.find((t) => t.id === defaultTarget);
  return first ? [first, ...targets.filter((t) => t !== first)] : [...targets];
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
