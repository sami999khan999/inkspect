import { useEffect, useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { SavedList } from '@inkspect/shared/ui/SavedList';
import { Select } from '@inkspect/shared/ui/Select';
import { targetIcon } from '@inkspect/shared/sendModal';
import {
  type AgentTarget,
  type ContextViewToHost,
  type HostToContextView,
} from '@shared/agentContext';
import { KeyCaps } from '../components/KeyCaps';

interface VsCodeApi {
  postMessage(message: ContextViewToHost): void;
}
declare function acquireVsCodeApi(): VsCodeApi;
const vscode = acquireVsCodeApi();
const post = (message: ContextViewToHost) => vscode.postMessage(message);

type State = Extract<HostToContextView, { type: 'state' }>;

/**
 * The Saved view: a project's captures, newest first (the shared SavedList). Each has a Send
 * button that pastes it into the project's agent (an agentmux thread, a terminal agent, or VS
 * Code chat); captures made together show as one group, sent together. The header picks the
 * project and where Send goes.
 */
export function ContextApp() {
  const [state, setState] = useState<State | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [, setNow] = useState(0);

  useEffect(() => {
    const onMessage = (event: MessageEvent<HostToContextView>) => {
      const message = event.data;
      if (message?.type === 'state') {
        setState(message);
        // Frees the images of removed items.
        const ids = new Set(message.items.map((i) => i.id));
        setThumbnails((previous) => {
          const gone = Object.keys(previous).filter((id) => !ids.has(id));
          if (!gone.length) return previous;
          const next = { ...previous };
          for (const id of gone) {
            URL.revokeObjectURL(next[id]!);
            delete next[id];
          }
          return next;
        });
      } else if (message?.type === 'thumbnail') {
        const url = URL.createObjectURL(
          new Blob([message.data as Uint8Array<ArrayBuffer>], { type: message.mimeType }),
        );
        setThumbnails((previous) => ({ ...previous, [message.id]: url }));
      }
    };
    window.addEventListener('message', onMessage);
    post({ type: 'ready' });
    // Keeps "5 min ago" current.
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => {
      window.removeEventListener('message', onMessage);
      clearInterval(timer);
    };
  }, []);

  if (!state) return null;
  const targets = state.targets;
  const terminalAgents = targets.filter((t) => t.kind !== 'chat');
  const removeMany = (ids: string[]) =>
    post(ids.length === 1 ? { type: 'remove', id: ids[0]! } : { type: 'removeMany', ids });

  return (
    <SavedList
      className="context-view"
      items={state.items}
      thumbnails={thumbnails}
      targets={targets}
      defaultTarget={state.target}
      filters
      header={
        <>
          <ProjectPicker project={state.project} projects={state.projects} />
          <AgentPicker targets={targets} value={state.target} />
          {!terminalAgents.length && <NoAgent />}
        </>
      }
      onSend={(ids, target) =>
        post(
          ids.length === 1
            ? { type: 'send', id: ids[0]!, target }
            : { type: 'sendMany', ids, target },
        )
      }
      onOpenInAgentmux={(ids, target) => post({ type: 'openInAgentmux', ids, target })}
      onCopy={(id) => post({ type: 'copy', id })}
      onOpen={(id) => post({ type: 'open', id })}
      onRemove={removeMany}
      onGroup={(ids) => post({ type: 'group', ids })}
      onUngroup={(group) => post({ type: 'ungroup', group })}
      onClear={() => post({ type: 'clear' })}
      undo={state.undo ? { label: state.undo, onUndo: () => post({ type: 'undo' }) } : undefined}
      hint={
        state.keys.sendLatest && (
          <>
            <KeyCaps binding={state.keys.sendLatest} size="sm" /> sends the latest
          </>
        )
      }
      empty={<EmptyState keys={state.keys} project={state.project} />}
    />
  );
}

/** The project the list shows (and captures go to): the workspace's, another, or the Inbox. */
function ProjectPicker({ project, projects }: Pick<State, 'project' | 'projects'>) {
  return (
    <div className="saved-project">
      <Select
        size="sm"
        appearance="quiet"
        label="Project"
        icon={project.inbox ? 'inbox' : 'folder'}
        value={project.path}
        onChange={(path) => post({ type: 'setProject', path })}
        options={projects.map((p) => ({
          value: p.path,
          label: p.name,
          detail: p.detail,
          icon: p.detail === 'captures without a project' ? 'inbox' : 'folder',
        }))}
      />
    </div>
  );
}

/** Where Send goes: the agents running in terminals and agentmux, and VS Code chat. */
function AgentPicker({ targets, value }: { targets: AgentTarget[]; value?: string }) {
  const terminals = targets.filter((t) => t.kind !== 'chat');
  return (
    <div className="agent-picker">
      <span className={`agent-dot ${terminals.length ? 'on' : ''}`} aria-hidden="true" />
      <Select
        size="sm"
        appearance="quiet"
        label="Send to"
        className="agent-select"
        placeholder="No agent running"
        value={value}
        onChange={(target) => post({ type: 'setTarget', target })}
        renderValue={(option) => (
          <span className="agent-value">
            <span className="agent-value-prefix">Send to</span> {option.label}
          </span>
        )}
        options={targets.map((t) => ({
          value: t.id,
          label: t.label,
          detail: t.detail,
          icon: targetIcon(t),
          group: t.kind === 'chat' ? 'Other' : 'Running agents',
        }))}
      />
      <IconButton
        icon="terminal"
        label="Pick the terminal your agent runs in"
        onClick={() => post({ type: 'chooseTerminal' })}
      />
    </div>
  );
}

function NoAgent() {
  return (
    <div className="no-agent" role="status">
      <span className="codicon codicon-info" aria-hidden="true" />
      <div>
        <strong>No agent is running in a terminal</strong>
        <span>Start one, or pick the terminal it runs in. Plain shells never get sends.</span>
        <div className="no-agent-actions">
          <Button
            size="sm"
            variant="accent"
            icon="play"
            onClick={() => post({ type: 'startAgent' })}
          >
            Start agent
          </Button>
          <Button
            size="sm"
            variant="ghost"
            icon="terminal"
            onClick={() => post({ type: 'chooseTerminal' })}
          >
            Pick terminal
          </Button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ keys, project }: Pick<State, 'keys' | 'project'>) {
  const tips: { icon: string; text: string }[] = [
    { icon: 'inspect', text: 'Pick an element with the element picker' },
    { icon: 'device-camera', text: 'Take a screenshot (any kind)' },
    { icon: 'error', text: 'Console errors show up here as they happen' },
    { icon: 'checklist', text: 'Copy a report, measurements or CSS changes' },
  ];
  return (
    <div className="context-empty">
      <span className="codicon codicon-sparkle empty-icon" aria-hidden="true" />
      <h2>Nothing saved in {project.name} yet</h2>
      <p>Everything you capture in the browser is saved here, ready to send to your agent.</p>
      <ul className="empty-tips">
        {tips.map((tip) => (
          <li key={tip.icon}>
            <span className={`codicon codicon-${tip.icon}`} aria-hidden="true" />
            {tip.text}
          </li>
        ))}
      </ul>
      {(keys.sendLatest || keys.show) && (
        <dl className="empty-keys">
          {keys.sendLatest && (
            <>
              <dt>
                <KeyCaps binding={keys.sendLatest} size="sm" />
              </dt>
              <dd>Send the latest capture to the agent</dd>
            </>
          )}
          {keys.show && (
            <>
              <dt>
                <KeyCaps binding={keys.show} size="sm" />
              </dt>
              <dd>Show this list</dd>
            </>
          )}
        </dl>
      )}
      <p className="empty-group-tip">
        Screenshots taken together (each drawing separately, several elements) stay together as one
        group. Select any items (Ctrl+click or their checkbox) to send, remove or group them.
      </p>
    </div>
  );
}
