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
import { sentText, targetDetail } from '@inkspect/shared/sendModal';
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

/** A project's items; undefined when the helper didn't answer (the list shown stays). */
const fetchItems = (project: string) =>
  hub<Extract<HubToBrowser, { type: 'items' }>>({ type: 'items.get', project }).then((reply) =>
    reply?.ok ? reply.items : undefined,
  );

type Content = Extract<HubToBrowser, { type: 'content' }>;

/** An item's content, fetched slice by slice (a native message can't carry a large image). */
async function fetchContent(
  project: string,
  id: string,
): Promise<{ bytes: Uint8Array<ArrayBuffer>; mimeType: string }> {
  let bytes: Uint8Array<ArrayBuffer> = new Uint8Array(0);
  let mimeType = 'text/plain';
  for (let offset = 0; ;) {
    const reply = await hub<Content>({ type: 'item.content', project, id, offset });
    if (!reply?.ok || reply.size === undefined || !reply.data) {
      throw new Error(reply?.error ?? 'The browser helper did not answer.');
    }
    if (offset === 0) bytes = new Uint8Array(reply.size);
    mimeType = reply.mimeType ?? mimeType;
    const slice = Uint8Array.from(atob(reply.data), (c) => c.charCodeAt(0));
    if (!slice.length && offset < reply.size) throw new Error('The copy came back short.');
    bytes.set(slice, offset);
    offset += slice.length;
    if (offset >= reply.size) return { bytes, mimeType };
  }
}

/** Puts an item's picture, else its text, on the clipboard (as VS Code's Copy does). */
async function copyContent(project: string, id: string): Promise<void> {
  const { bytes, mimeType } = await fetchContent(project, id);
  if (mimeType === 'text/plain') {
    await navigator.clipboard.writeText(new TextDecoder().decode(bytes));
    return;
  }
  let png = new Blob([bytes], { type: mimeType });
  // The clipboard takes images as PNG only.
  if (mimeType !== 'image/png') {
    const bitmap = await createImageBitmap(png);
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0);
    png = await canvas.convertToBlob({ type: 'image/png' });
  }
  await navigator.clipboard.write([new ClipboardItem({ 'image/png': png })]);
}

/** How often the list looks at the store while the panel is visible. */
const REFRESH_MS = 2_000;
/** Removed items wait this long in the store's trash (the hub's TRASH_MS), so Undo does too. */
const UNDO_MS = 15_000;

/** One project's Saved list: its captures, kept in step with its store. */
function ProjectSaved({
  project,
  canUndo,
  canGroup,
  canCopy,
}: {
  project: Project;
  canUndo: boolean;
  canGroup: boolean;
  canCopy: boolean;
}) {
  const [items, setItems] = useState<ItemMeta[] | undefined>();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [note, setNote] = useState<{ text: string; tone: 'ok' | 'error' }>();
  const [undo, setUndo] = useState<string[]>();
  const live = isLive(project);
  const targets = project.targets ?? [];
  const target = targets.find((t) => t.id === project.defaultTarget);

  // The list follows the project's store (captures from VS Code, sends, removals): while the
  // panel is visible, and at once when it comes back into view.
  useEffect(() => {
    let current = true;
    const refresh = () => {
      if (document.visibilityState !== 'visible') return;
      void fetchItems(project.path).then((next) => {
        if (current && next) setItems(next);
      });
    };
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    document.addEventListener('visibilitychange', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      current = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [project.path]);

  // Undo lasts as long as the store keeps what was removed.
  useEffect(() => {
    if (!undo) return;
    const timer = setTimeout(() => setUndo(undefined), UNDO_MS);
    return () => clearTimeout(timer);
  }, [undo]);

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

  const reload = () =>
    void fetchItems(project.path).then((next) => {
      if (next) setItems(next);
    });
  const send = async (ids: string[], to?: string, open = false) => {
    setNote(undefined);
    const chosen = targets.find((t) => t.id === (to ?? project.defaultTarget));
    const reply = await hub<Extract<HubToBrowser, { type: 'item.sent' }>>({
      type: 'item.send',
      project: project.path,
      ids,
      target: to,
      open,
    });
    setNote(
      reply?.ok
        ? { text: `${sentText(chosen, reply.sentTo ?? 'the agent')}.`, tone: 'ok' }
        : { text: reply?.error ?? 'The browser helper did not answer.', tone: 'error' },
    );
    reload();
  };
  const remove = async (ids: string[]) => {
    await hub({ type: 'item.remove', project: project.path, ids });
    if (canUndo) setUndo(ids);
    reload();
  };

  const copy = (id: string) => {
    setNote(undefined);
    void copyContent(project.path, id).then(
      () => setNote({ text: 'Copied.', tone: 'ok' }),
      (error: unknown) =>
        setNote({ text: `Could not copy: ${(error as Error).message}`, tone: 'error' }),
    );
  };
  const regroup = (
    request: { type: 'items.group'; ids: string[] } | { type: 'items.ungroup'; group: string },
  ) => void hub({ ...request, project: project.path }).then(reload);

  const views = useMemo(() => (items ?? []).map(savedViewOf), [items]);
  if (!items) return <div className="sp-empty">Loading…</div>;
  return (
    <>
      <div className="sp-target" title={project.path}>
        {live
          ? target
            ? `Send goes to ${target.label} · ${targetDetail(target)}`
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
        onCopy={canCopy ? copy : undefined}
        onGroup={canGroup ? (ids) => regroup({ type: 'items.group', ids }) : undefined}
        onUngroup={canGroup ? (group) => regroup({ type: 'items.ungroup', group }) : undefined}
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
            canGroup={!!status.features?.includes('items.group')}
            canCopy={!!status.features?.includes('item.content')}
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
