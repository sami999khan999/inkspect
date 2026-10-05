import type { HubToBrowser } from '@inkspect/shared/hub';
import { useEffect, useState } from 'react';
import type { BridgeStatus } from '../messages';

interface LinkGraphProps {
  status: BridgeStatus;
  /** Windows shown before "+N more" (the rest are counted). */
  limit?: number;
  size?: 'sm' | 'lg';
}

interface GraphWindow {
  id: string;
  name: string;
  lastUsed: boolean;
  tag?: string;
}

/** The workspace name inside a peer label: "VS Code (mdf)" is "mdf". */
const peerWorkspace = (peer: string | undefined) => /^VS Code \((.*)\)$/.exec(peer ?? '')?.[1];

/**
 * The names of the VS Code windows that are open, from the projects the link knows (a window shows
 * as the project it has open). Empty until the first answer, or when nothing answers.
 */
function useOpenWindows(linked: boolean): string[] {
  const [names, setNames] = useState<string[]>([]);
  useEffect(() => {
    if (!linked) return;
    let current = true;
    const refresh = () =>
      void chrome.runtime
        .sendMessage({ type: 'hub', request: { type: 'projects.get', req: crypto.randomUUID() } })
        .then((reply: HubToBrowser | null | undefined) => {
          if (!current || reply?.type !== 'projects') return;
          setNames([...new Set(reply.projects.filter((p) => p.vscode).map((p) => p.name))]);
        })
        .catch(() => undefined);
    refresh();
    const timer = setInterval(refresh, 4_000);
    return () => {
      current = false;
      clearInterval(timer);
    };
  }, [linked]);
  return linked ? names : [];
}

/**
 * The link, drawn: this browser on the left, a lit branch to the VS Code window that answers for
 * it (through the browser helper, or the WebSocket link), and one to every other open window.
 * Unlinked, a dashed branch leads to VS
 * Code in the state's color.
 */
export function LinkGraph({ status, limit = Infinity, size = 'lg' }: LinkGraphProps) {
  const linked = status.state === 'connected';
  const open = useOpenWindows(linked);
  const tag = status.via === 'hub' ? 'Browser helper' : 'Linked';
  const served = peerWorkspace(status.peer);
  const windows: GraphWindow[] = [];
  if (linked) {
    for (const name of open) {
      windows.push({ id: name, name: `VS Code (${name})`, lastUsed: name === served, tag });
    }
    // The window that answers is listed even when the helper doesn't know its folder.
    if (!windows.some((w) => w.lastUsed)) {
      windows.unshift({ id: 'peer', name: status.peer ?? 'VS Code', lastUsed: true, tag });
    }
  }
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
                {w.lastUsed && <span className="graph-tag">{w.tag}</span>}
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
