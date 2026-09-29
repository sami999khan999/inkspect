import type { VsCodeWindow } from '@inkspect/shared/bridge';
import type { BridgeStatus } from '../messages';

interface LinkGraphProps {
  status: BridgeStatus;
  /** Windows shown before "+N more" (the rest are counted). */
  limit?: number;
  size?: 'sm' | 'lg';
}

/**
 * The link, drawn: this browser on the left, a branch to each open VS Code window on the right.
 * The branch to the window used last is solid and lit: that is where sends go. Unlinked, a single
 * dashed branch leads to VS Code in the state's color.
 */
export function LinkGraph({ status, limit = Infinity, size = 'lg' }: LinkGraphProps) {
  const linked = status.state === 'connected';
  const windows: VsCodeWindow[] = linked
    ? status.windows?.length
      ? status.windows
      : [{ id: 'peer', name: status.peer ?? 'VS Code', lastUsed: true }]
    : [];
  const shown = windows.slice(0, limit);
  const hidden = windows.length - shown.length;
  return (
    <div className={`link-graph size-${size} state-${status.state}`} aria-hidden="true">
      <span className="graph-node source">
        <span className="codicon codicon-globe" />
      </span>
      <ul className="graph-targets">
        {linked ? (
          <>
            {shown.map((w) => (
              <li key={w.id} className={`graph-target${w.lastUsed ? ' lit' : ''}`}>
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
