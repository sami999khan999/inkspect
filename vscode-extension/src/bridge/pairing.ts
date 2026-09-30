import type { ClientInfo } from '@inkspect/shared/bridge';

/**
 * A Pair click in some VS Code window, shared with the window that serves the link: pair the
 * browser with this id, or (without an id) the one browser that is or becomes waiting.
 */
export interface PairingApproval {
  clientId?: string;
  expires: number;
}

/** Reads an approval from a shared file's contents; anything malformed counts as none. */
export function parseApproval(value: unknown): PairingApproval | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const { clientId, expires } = value as Record<string, unknown>;
  if (typeof expires !== 'number') return undefined;
  if (clientId !== undefined && typeof clientId !== 'string') return undefined;
  return { clientId, expires };
}

/**
 * The waiting browser an approval pairs, if any. An approval without an id pairs a browser only
 * when it is the only one waiting: the user clicked Pair without seeing a choice, so it must not
 * pick one of several.
 */
export function choosePending<T extends Pick<ClientInfo, 'id'>>(
  pending: readonly T[],
  approval: PairingApproval | undefined,
  now: number,
): T | undefined {
  if (!approval || now >= approval.expires) return undefined;
  if (approval.clientId !== undefined) return pending.find((c) => c.id === approval.clientId);
  const ids = new Set(pending.map((c) => c.id));
  return ids.size === 1 ? pending[0] : undefined;
}
