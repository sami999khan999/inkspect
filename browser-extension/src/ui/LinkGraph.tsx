import type { VsCodeWindow } from '@inkspect/shared/bridge';
import type { BridgeStatus } from '../messages';

interface LinkGraphProps {
  status: BridgeStatus;
  /** Windows shown before "+N more" (the rest are counted). */
  limit?: number;
  size?: 'sm' | 'lg';
}

/**
 * The link, drawn: this browser on the left (level with the first window), a bus down to a branch
 * for each open VS Code window. Windows keep a stable order (by name), and the lit path runs from
 * the browser down the bus to the window used last, where sends go: switching windows moves the
 * line, not the rows. Unlinked, a single dashed branch leads to VS Code in the state's color.
 */
export function LinkGraph({ status, limit = Infinity, size = 'lg' }: LinkGraphProps) {
  const linked = status.state === 'connected';
  const windows: VsCodeWindow[] = linked
    ? status.windows?.length
      ? [...status.windows].sort((a, b) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id))
      : [{ id: 'peer', name: status.peer ?? 'VS Code', lastUsed: true }]
    : [];
  const shown = windows.slice(0, limit);
  const hidden = windows.length - shown.length;
  // Rows above the lit one carry the lit path down the bus.
  const litIndex = shown.findIndex((w) => w.lastUsed);
  return (
    <div className={`link-graph size-${size} state-${status.state}`} aria-hidden="true">
      <span className="graph-node source">
        <span className="codicon codicon-globe" />
      </span>
      <ul className="graph-targets">
        {linked ? (
          <>
            {shown.map((w, index) => (
              <li
                key={w.id}
                className={`graph-target${w.lastUsed ? ' lit' : index < litIndex ? ' on-path' : ''}`}
              >
                <span className="graph-node">
                  <span className="codicon codicon-vscode" />
                </span>
                <span className="graph-name">{w.name}</span>
                {w.lastUsed && <span className="graph-tag">Sends go here</span>}
              </li>
            ))}
            {hidden > 0 && (
              <li className="graph-target more">
                <span className="graph-name">and {hidden} more</span>
              </li>
            )}
          </>
        ) : (
          <li className="graph-target pending">
            <span className="graph-node">
              <span className="codicon codicon-vscode" />
            </span>
            <span className="graph-name">VS Code</span>
          </li>
        )}
      </ul>
    </div>
  );
}
