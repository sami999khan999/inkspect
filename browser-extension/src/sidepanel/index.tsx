// The side panel: the Saved list of the project the page in front belongs to (the browser
// helper's suggestion), or of one picked from every project it knows (open in VS Code, with
// agentmux agents, with saved captures, pinned, and the Inbox). Projects where nothing runs show
// their captures without send buttons.
import codiconCss from '@vscode/codicons/dist/codicon.css';
import {
  isLive,
  type BrowserToHub,
  type HubToBrowser,
  type ItemMeta,
  type Project,
} from '@inkspect/shared/hub';
import { projectDetail, savedViewOf } from '@inkspect/shared/saved';
import themeCss from '@inkspect/shared/ui/theme.css';
import uiCss from '@inkspect/shared/ui/ui.css';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { SavedList } from '@inkspect/shared/ui/SavedList';
import { Select } from '@inkspect/shared/ui/Select';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { BridgeStatus } from '../messages';
import panelCss from './sidepanel.css';

type Request = Extract<BrowserToHub, { req: string }>;
type WithoutReq<T> = T extends unknown ? Omit<T, 'req'> : never;
type Projects = Extract<HubToBrowser, { type: 'projects' }>;

/** Asks the browser helper (through the background); undefined when it isn't there. */
async function hub<T extends HubToBrowser>(request: WithoutReq<Request>): Promise<T | undefined> {
  const reply: unknown = await chrome.runtime.sendMessage({
    type: 'hub',
    request: { ...request, req: crypto.randomUUID() },
  });
  return (reply ?? undefined) as T | undefined;
}

/** The projects, and the one the page in front belongs to. */
async function fetchProjects(): Promise<Projects | undefined> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return hub<Projects>({ type: 'projects.get', url: tab?.url?.slice(0, 4096) });
}

const fetchItems = (project: string) =>
  hub<Extract<HubToBrowser, { type: 'items' }>>({ type: 'items.get', project }).then((reply) =>
    reply?.ok ? reply.items : [],
  );

/** One project's Saved list: its captures, kept in step with its store. */
function ProjectSaved({ project, canUndo }: { project: Project; canUndo: boolean }) {
  const [items, setItems] = useState<ItemMeta[] | undefined>();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [note, setNote] = useState<{ text: string; tone: 'ok' | 'error' }>();
  const [undo, setUndo] = useState<string[]>();
  const live = isLive(project);
  const targets = project.targets ?? [];
  const target = targets.find((t) => t.id === project.defaultTarget);

  // The list follows the project's store (captures from VS Code, sends, removals).
  useEffect(() => {
    let current = true;
    const refresh = () =>
      void fetchItems(project.path).then((next) => {
        if (current) setItems(next);
      });
    refresh();
    const timer = setInterval(refresh, 4_000);
    return () => {
      current = false;
      clearInterval(timer);
    };
  }, [project.path]);

  // Thumbnails, each fetched once.
  useEffect(() => {
    let current = true;
    for (const item of items ?? []) {
      if (thumbnails[item.id] || !(item.files.thumb || item.files.file)) continue;
      if (item.kind === 'recording') continue;
      void hub<Extract<HubToBrowser, { type: 'thumb' }>>({
        type: 'item.thumb',
        project: project.path,
        id: item.id,
      }).then((reply) => {
        if (!current || !reply?.data) return;
        const src = `data:${reply.mimeType ?? 'image/jpeg'};base64,${reply.data}`;
        setThumbnails((was) => ({ ...was, [item.id]: src }));
      });
    }
    return () => {
      current = false;
    };
  }, [items, thumbnails, project.path]);

  const reload = () => void fetchItems(project.path).then(setItems);
  const send = async (ids: string[], to?: string, open = false) => {
    setNote(undefined);
    const reply = await hub<Extract<HubToBrowser, { type: 'item.sent' }>>({
      type: 'item.send',
      project: project.path,
      ids,
      target: to,
      open,
    });
    setNote(
      reply?.ok
        ? { text: `Sent to ${reply.sentTo ?? 'the agent'}.`, tone: 'ok' }
        : { text: reply?.error ?? 'The browser helper did not answer.', tone: 'error' },
    );
    reload();
  };
  const remove = async (ids: string[]) => {
    await hub({ type: 'item.remove', project: project.path, ids });
    if (canUndo) setUndo(ids);
    reload();
  };

  const views = useMemo(() => (items ?? []).map(savedViewOf), [items]);
  if (!items) return <div className="sp-empty">Loading…</div>;
  return (
    <>
      <div className="sp-target" title={project.path}>
        {live
          ? target
            ? `Send goes to ${target.label} · ${target.detail}`
            : 'No agent is running here.'
          : 'Nothing is open here: captures are kept, sending is off.'}
      </div>
      {note && (
        <div className={`sp-note ${note.tone}`} role="status">
          {note.text}
        </div>
      )}
      <SavedList
        items={views}
        thumbnails={thumbnails}
        targets={targets}
        defaultTarget={project.defaultTarget}
        canSend={live}
        onSend={(ids, to) => void send(ids, to)}
        onOpenInAgentmux={(ids, to) => void send(ids, to, true)}
        onRemove={(ids) => void remove(ids)}
        undo={
          undo && {
            label: undo.length === 1 ? 'Removed 1 item' : `Removed ${undo.length} items`,
            onUndo: () => {
              setUndo(undefined);
              void hub({ type: 'item.restore', project: project.path, ids: undo }).then(reload);
            },
          }
        }
        empty={
          <div className="sp-empty">
            Nothing saved in {project.name} yet. Capture something with the toolbar: it is saved
            here at once.
          </div>
        }
      />
    </>
  );
}

function SidePanel() {
  const [status, setStatus] = useState<BridgeStatus>({ state: 'connecting' });
  const [found, setFound] = useState<Projects>();
  /** A project picked here; until then (and after the tab changes) the page's own. */
  const [picked, setPicked] = useState<string>();

  const load = useCallback(() => void fetchProjects().then(setFound), []);
  useEffect(() => {
    const refresh = () => {
      void chrome.runtime
        .sendMessage({ type: 'status' })
        .then((s: BridgeStatus | undefined) => s && setStatus(s));
      load();
    };
    refresh();
    const timer = setInterval(refresh, 5_000);
    // Another tab in front: its project.
    const onTab = () => {
      setPicked(undefined);
      load();
    };
    const onUpdated = (_id: number, change: { url?: string; status?: string }) => {
      if (change.url || change.status === 'complete') load();
    };
    chrome.tabs.onActivated.addListener(onTab);
    chrome.tabs.onUpdated.addListener(onUpdated);
    return () => {
      clearInterval(timer);
      chrome.tabs.onActivated.removeListener(onTab);
      chrome.tabs.onUpdated.removeListener(onUpdated);
    };
  }, [load]);

  const projects = found?.projects ?? [];
  const shown =
    projects.find((p) => p.path === picked) ??
    projects.find((p) => p.path === found?.suggested) ??
    projects[0];
  const reachable = !!status.projects;
  return (
    <main className="sp">
      <header className="sp-head">
        <span className="sp-title">Saved</span>
        <IconButton icon="refresh" label="Refresh" onClick={load} />
      </header>
      {!reachable ? (
        <div className="sp-empty">
          Not linked with VS Code. Open VS Code with VS Code Browser: on Linux its browser helper
          links this browser by itself (restart the browser once); elsewhere, pair it from the
          Inkspect button.
        </div>
      ) : !found ? (
        <div className="sp-empty">Loading…</div>
      ) : !shown ? (
        <div className="sp-empty">
          No projects yet: open a folder in VS Code, or start an agent in agentmux.
        </div>
      ) : (
        <>
          <div className="sp-project">
            <span className={`sp-dot ${isLive(shown) ? 'on' : ''}`} aria-hidden="true" />
            <Select
              size="sm"
              label="Project"
              icon={shown.inbox ? 'inbox' : 'folder'}
              className="sp-project-select"
              value={shown.path}
              onChange={setPicked}
              options={projects.map((p) => ({
                value: p.path,
                label: p.name,
                detail: projectDetail(p),
                icon: p.inbox ? 'inbox' : p.pinned ? 'pinned' : p.vscode ? 'vscode' : 'folder',
                group: p.inbox ? 'Inbox' : isLive(p) ? 'Open' : 'Saved',
              }))}
            />
            {!shown.inbox && (
              <IconButton
                icon={shown.pinned ? 'pinned' : 'pin'}
                label={shown.pinned ? `Unpin ${shown.name}` : `Pin ${shown.name}`}
                active={shown.pinned}
                onClick={() =>
                  void hub({
                    type: 'project.pin',
                    project: shown.path,
                    pinned: !shown.pinned,
                  }).then(load)
                }
              />
            )}
          </div>
          <ProjectSaved
            key={shown.path}
            project={shown}
            canUndo={!!status.features?.includes('item.restore')}
          />
        </>
      )}
    </main>
  );
}

const style = document.createElement('style');
style.textContent = [codiconCss, themeCss, uiCss, panelCss].join('\n');
document.head.append(style);
document.documentElement.classList.add('ink-theme');

createRoot(document.getElementById('root')!).render(<SidePanel />);
