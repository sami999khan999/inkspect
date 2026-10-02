// The side panel: every project the browser helper knows (open in VS Code, with agentmux agents,
// with saved captures, or pinned) and what was saved in each, ready to send to its agents.
// Projects where nothing runs show their captures without send buttons.
import codiconCss from '@vscode/codicons/dist/codicon.css';
import {
  isLive,
  type BrowserToHub,
  type HubTarget,
  type HubToBrowser,
  type ItemMeta,
  type Project,
} from '@inkspect/shared/hub';
import themeCss from '@inkspect/shared/ui/theme.css';
import uiCss from '@inkspect/shared/ui/ui.css';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Menu, type MenuState } from '@inkspect/shared/ui/Menu';
import { useCallback, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { BridgeStatus } from '../messages';
import { projectDetail } from '../content/ProjectPicker';
import panelCss from './sidepanel.css';

type Request = Extract<BrowserToHub, { req: string }>;
type WithoutReq<T> = T extends unknown ? Omit<T, 'req'> : never;

/** Asks the browser helper (through the background); undefined when it isn't there. */
async function hub<T extends HubToBrowser>(request: WithoutReq<Request>): Promise<T | undefined> {
  const reply: unknown = await chrome.runtime.sendMessage({
    type: 'hub',
    request: { ...request, req: crypto.randomUUID() },
  });
  return (reply ?? undefined) as T | undefined;
}

const KIND_ICONS: Record<string, string> = {
  element: 'inspect',
  screenshot: 'device-camera',
  recording: 'record',
  errors: 'error',
  network: 'globe',
  page: 'browser',
  report: 'checklist',
  css: 'symbol-color',
  measure: 'symbol-ruler',
  color: 'symbol-color',
  text: 'note',
};

const TARGET_ICONS: Record<HubTarget['kind'], string> = {
  tmux: 'terminal-tmux',
  terminal: 'terminal',
  chat: 'comment-discussion',
};

function timeAgo(time: number, now: number): string {
  const seconds = Math.max(0, Math.round((now - time) / 1000));
  if (seconds < 60) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return new Date(time).toLocaleDateString();
}

/** Items captured together show as one card (and are sent together). */
interface Card {
  key: string;
  items: ItemMeta[];
}

function cardsOf(items: readonly ItemMeta[]): Card[] {
  const cards: Card[] = [];
  const byGroup = new Map<string, Card>();
  for (const item of items) {
    if (item.group) {
      const card = byGroup.get(item.group);
      if (card) {
        card.items.push(item);
        continue;
      }
      const created = { key: item.group, items: [item] };
      byGroup.set(item.group, created);
      cards.push(created);
    } else {
      cards.push({ key: item.id, items: [item] });
    }
  }
  for (const card of cards) {
    card.items.sort((a, b) => (a.groupIndex ?? 0) - (b.groupIndex ?? 0) || a.time - b.time);
  }
  return cards;
}

function Thumb({ project, item }: { project: string; item: ItemMeta }) {
  const [src, setSrc] = useState<string>();
  const hasPicture = !!(item.files.thumb || item.files.file);
  useEffect(() => {
    if (!hasPicture) return;
    let live = true;
    void hub<Extract<HubToBrowser, { type: 'thumb' }>>({
      type: 'item.thumb',
      project,
      id: item.id,
    }).then((reply) => {
      if (live && reply?.data)
        setSrc(`data:${reply.mimeType ?? 'image/jpeg'};base64,${reply.data}`);
    });
    return () => {
      live = false;
    };
  }, [project, item.id, hasPicture]);
  if (src) return <img className="sp-thumb" src={src} alt="" />;
  return (
    <span
      className={`sp-thumb sp-thumb-icon codicon codicon-${KIND_ICONS[item.kind] ?? 'note'}`}
      aria-hidden="true"
    />
  );
}

function ProjectSection({
  project,
  open,
  onToggle,
  onPin,
  onMenu,
  now,
}: {
  project: Project;
  open: boolean;
  onToggle: () => void;
  onPin: () => void;
  onMenu: (menu: MenuState) => void;
  now: number;
}) {
  const [items, setItems] = useState<ItemMeta[] | undefined>();
  const [note, setNote] = useState<{ text: string; tone: 'ok' | 'error' }>();
  const live = isLive(project);
  const targets = project.targets ?? [];
  const target = targets.find((t) => t.id === project.defaultTarget);

  const fetchItems = useCallback(
    () =>
      hub<Extract<HubToBrowser, { type: 'items' }>>({
        type: 'items.get',
        project: project.path,
      }).then((reply) => (reply?.ok ? reply.items : [])),
    [project.path],
  );
  const load = () => void fetchItems().then(setItems);

  // While open, the list follows the project's store (captures from VS Code, sends, removals).
  useEffect(() => {
    if (!open) return;
    let live = true;
    const refresh = () =>
      void fetchItems().then((next) => {
        if (live) setItems(next);
      });
    refresh();
    const timer = setInterval(refresh, 4_000);
    return () => {
      live = false;
      clearInterval(timer);
    };
  }, [open, fetchItems]);

  const send = async (ids: string[], to?: string) => {
    setNote(undefined);
    const reply = await hub<Extract<HubToBrowser, { type: 'item.sent' }>>({
      type: 'item.send',
      project: project.path,
      ids,
      target: to,
    });
    setNote(
      reply?.ok
        ? { text: `Sent to ${reply.sentTo ?? 'the agent'}.`, tone: 'ok' }
        : { text: reply?.error ?? 'The browser helper did not answer.', tone: 'error' },
    );
    load();
  };

  const remove = async (ids: string[]) => {
    await hub({ type: 'item.remove', project: project.path, ids });
    load();
  };

  const chooseTarget = (ids: string[], anchor: HTMLElement) => {
    const rect = anchor.getBoundingClientRect();
    onMenu({
      x: rect.left,
      y: rect.bottom + 4,
      items: targets.map((t) => ({
        label: `${t.label} · ${t.detail}`,
        icon: TARGET_ICONS[t.kind],
        onSelect: () => void send(ids, t.id),
      })),
    });
  };

  const cards = items ? cardsOf(items) : [];
  return (
    <section className={`sp-project ${open ? 'open' : ''}`}>
      <div className="sp-project-head">
        <button type="button" className="sp-project-toggle" aria-expanded={open} onClick={onToggle}>
          <span
            className={`codicon codicon-chevron-${open ? 'down' : 'right'}`}
            aria-hidden="true"
          />
          <span className={`sp-dot ${live ? 'on' : ''}`} aria-hidden="true" />
          <span className="sp-project-name">{project.name}</span>
          <span className="sp-project-detail">{projectDetail(project)}</span>
        </button>
        <IconButton
          icon={project.pinned ? 'pinned' : 'pin'}
          label={project.pinned ? `Unpin ${project.name}` : `Pin ${project.name}`}
          active={project.pinned}
          onClick={onPin}
        />
      </div>
      {open && (
        <div className="sp-project-body">
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
          {items === undefined ? (
            <div className="sp-empty">Loading…</div>
          ) : !cards.length ? (
            <div className="sp-empty">
              Nothing saved yet. Capture something with the toolbar and save it to {project.name}.
            </div>
          ) : (
            <ul className="sp-items">
              {cards.map((card) => {
                const first = card.items[0]!;
                const ids = card.items.map((i) => i.id);
                const sent = [...new Set(card.items.flatMap((i) => i.sentTo))];
                return (
                  <li key={card.key} className="sp-item">
                    <div className="sp-thumbs">
                      {card.items.slice(0, 4).map((item) => (
                        <Thumb key={item.id} project={project.path} item={item} />
                      ))}
                    </div>
                    <div className="sp-item-body">
                      <div className="sp-item-title">
                        {card.items.length > 1
                          ? `${card.items.length} × ${first.title}`
                          : first.title}
                      </div>
                      {first.preview && <div className="sp-item-preview">{first.preview}</div>}
                      <div className="sp-item-meta">
                        {timeAgo(first.time, now)}
                        {first.source === 'browser'
                          ? ` · ${first.browser ?? 'browser'}`
                          : ' · VS Code'}
                        {sent.length > 0 && ` · sent to ${sent.join(', ')}`}
                      </div>
                      <div className="sp-item-actions">
                        {live && (
                          <>
                            <Button
                              size="sm"
                              variant="primary"
                              icon="send"
                              disabled={!targets.length}
                              onClick={() => void send(ids)}
                            >
                              Send
                            </Button>
                            <IconButton
                              icon="list-selection"
                              label="Send to…"
                              disabled={!targets.length}
                              onClick={(event) => chooseTarget(ids, event.currentTarget)}
                            />
                          </>
                        )}
                        <IconButton
                          icon="trash"
                          label={card.items.length > 1 ? 'Remove these' : 'Remove'}
                          onClick={() => void remove(ids)}
                        />
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}

function SidePanel() {
  const [status, setStatus] = useState<BridgeStatus>({ state: 'connecting' });
  const [projects, setProjects] = useState<Project[]>();
  const [open, setOpen] = useState<Set<string>>(new Set());
  const [menu, setMenu] = useState<MenuState | null>(null);
  const [now, setNow] = useState(() => Date.now());

  /** The projects, and the one the page in front belongs to. */
  const fetchProjects = useCallback(async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return hub<Extract<HubToBrowser, { type: 'projects' }>>({
      type: 'projects.get',
      url: tab?.url?.slice(0, 4096),
    });
  }, []);
  const showProjects = useCallback(
    (reply: Extract<HubToBrowser, { type: 'projects' }> | undefined) => {
      setNow(Date.now());
      setProjects(reply?.projects ?? []);
      // The project of the page in front starts open.
      const suggested = reply?.suggested;
      if (suggested) setOpen((was) => (was.size ? was : new Set([suggested])));
    },
    [],
  );
  const loadProjects = () => fetchProjects().then(showProjects);

  useEffect(() => {
    const refresh = () => {
      void chrome.runtime
        .sendMessage({ type: 'status' })
        .then((s: BridgeStatus | undefined) => s && setStatus(s));
      void fetchProjects().then(showProjects);
    };
    refresh();
    const timer = setInterval(refresh, 5_000);
    return () => clearInterval(timer);
  }, [fetchProjects, showProjects]);

  const viaHub = status.via === 'hub';
  return (
    <main className="sp">
      <header className="sp-head">
        <span className="sp-title">Projects</span>
        <IconButton icon="refresh" label="Refresh" onClick={() => void loadProjects()} />
      </header>
      {!viaHub ? (
        <div className="sp-empty">
          The browser helper isn't running. In VS Code (Linux), install VS Code Browser and run{' '}
          <strong>Browser: Register Browser Helper</strong>, then restart the browser.
        </div>
      ) : !projects ? (
        <div className="sp-empty">Loading…</div>
      ) : !projects.length ? (
        <div className="sp-empty">
          No projects yet: open a folder in VS Code, or start an agent in agentmux.
        </div>
      ) : (
        projects.map((project) => (
          <ProjectSection
            key={project.path}
            project={project}
            now={now}
            open={open.has(project.path)}
            onToggle={() =>
              setOpen((was) => {
                const next = new Set(was);
                if (next.has(project.path)) next.delete(project.path);
                else next.add(project.path);
                return next;
              })
            }
            onPin={() =>
              void hub({
                type: 'project.pin',
                project: project.path,
                pinned: !project.pinned,
              }).then(() => loadProjects())
            }
            onMenu={setMenu}
          />
        ))
      )}
      {menu && <Menu menu={menu} onClose={() => setMenu(null)} />}
    </main>
  );
}

const style = document.createElement('style');
style.textContent = [codiconCss, themeCss, uiCss, panelCss].join('\n');
document.head.append(style);
document.documentElement.classList.add('ink-theme');

createRoot(document.getElementById('root')!).render(<SidePanel />);
