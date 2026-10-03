// The extension's full page (the popup's "Open Inkspect", and the extension's options): a top bar
// with the sections and the link's state; VS Code shows the link (a branch to every open window)
// and pairing, Shortcuts the editor, About the details.
import codiconCss from '@vscode/codicons/dist/codicon.css';
import themeCss from '@inkspect/shared/ui/theme.css';
import uiCss from '@inkspect/shared/ui/ui.css';
import {
  effectiveShortcuts,
  keyMatchesQuery,
  SHORTCUT_ACTIONS,
  type ShortcutMap,
  type ShortcutOverrides,
} from '@inkspect/shared/shortcuts';
import { Button } from '@inkspect/shared/ui/Button';
import { ConfirmButton } from '@inkspect/shared/ui/ConfirmButton';
import { KeyCaps } from '@inkspect/shared/ui/KeyCaps';
import { Segmented } from '@inkspect/shared/ui/Segmented';
import { ShortcutList } from '@inkspect/shared/ui/ShortcutList';
import { fillActiveSearch, ShortcutSearch } from '@inkspect/shared/ui/ShortcutSearch';
import { useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { BridgeStatus, ShortcutPressed } from '../messages';
import {
  ALL_SCOPES,
  isMac,
  labelOf,
  resetAllShortcuts,
  scopeLabelOf,
  setShortcutKeys,
  watchShortcuts,
} from '../shortcuts';
import { LinkGraph } from '../ui/LinkGraph';
import linkGraphCss from '../ui/link-graph.css';
import pairCardCss from '../ui/pair-card.css';
import { PairCard } from '../ui/PairCard';
import optionsCss from './options.css';

type Tab = 'vscode' | 'shortcuts' | 'about';
const TABS: Tab[] = ['vscode', 'shortcuts', 'about'];
const tabFromHash = (): Tab => {
  const hash = location.hash.slice(1) as Tab;
  return TABS.includes(hash) ? hash : 'vscode';
};

const STATE_VIEW: Record<BridgeStatus['state'], { label: string; tone: string }> = {
  connected: { label: 'Linked', tone: 'ok' },
  connecting: { label: 'Connecting', tone: 'busy' },
  unpaired: { label: 'Not paired', tone: 'warn' },
  offline: { label: 'VS Code not running', tone: 'off' },
};

function Options() {
  const [status, setStatus] = useState<BridgeStatus>({ state: 'connecting' });
  const [tab, setTab] = useState<Tab>(tabFromHash);
  const [shortcuts, setShortcuts] = useState<{ map: ShortcutMap; overrides: ShortcutOverrides }>(
    () => ({ map: effectiveShortcuts({}, isMac), overrides: {} }),
  );
  const [toolbarKey, setToolbarKey] = useState<string>();

  useEffect(() => {
    const refresh = () =>
      void chrome.runtime
        .sendMessage({ type: 'status' })
        .then((s: BridgeStatus | undefined) => s && setStatus(s));
    refresh();
    const timer = setInterval(refresh, 2000);
    const onHash = () => setTab(tabFromHash());
    addEventListener('hashchange', onHash);
    const stop = watchShortcuts((map, stored) =>
      setShortcuts({ map, overrides: stored.overrides }),
    );
    void chrome.commands
      .getAll()
      .then((all) => setToolbarKey(all.find((c) => c.name === 'toggle-toolbar')?.shortcut));
    return () => {
      clearInterval(timer);
      removeEventListener('hashchange', onHash);
      stop();
    };
  }, []);

  const showTab = (next: Tab) => {
    setTab(next);
    history.replaceState(null, '', `#${next}`);
  };
  const view = STATE_VIEW[status.state];

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <img src="icons/48.png" alt="" />
          <span>Inkspect</span>
        </div>
        <Segmented
          label="Sections"
          className="page-nav"
          value={tab}
          onChange={showTab}
          options={[
            { value: 'vscode', label: 'VS Code', icon: 'vscode' },
            { value: 'shortcuts', label: 'Shortcuts', icon: 'keyboard' },
            { value: 'about', label: 'About', icon: 'info' },
          ]}
        />
        <span className={`status-chip tone-${view.tone}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          {view.label}
        </span>
      </header>

      <main className="main">
        {tab === 'vscode' && <VsCodeSection status={status} setStatus={setStatus} />}
        {tab === 'shortcuts' && (
          <ShortcutsSection
            map={shortcuts.map}
            overrides={shortcuts.overrides}
            linked={status.state === 'connected'}
            toolbarKey={toolbarKey}
          />
        )}
        {tab === 'about' && (
          <AboutSection status={status} toolbarKey={toolbarKey} stateLabel={view.label} />
        )}
      </main>
    </div>
  );
}

/** The link: VS Code, pairing, unlinking. */
function VsCodeSection({
  status,
  setStatus,
}: {
  status: BridgeStatus;
  setStatus: (status: BridgeStatus) => void;
}) {
  const linked = status.state === 'connected';
  const pair = async (code: string) => {
    const result = (await chrome.runtime
      .sendMessage({ type: 'pair', code })
      .catch(() => undefined)) as BridgeStatus | undefined;
    if (result) setStatus(result);
    return result;
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>
            {linked
              ? `Linked with ${status.peer ?? 'VS Code'}`
              : status.state === 'unpaired'
                ? 'Pair with VS Code'
                : status.state === 'connecting'
                  ? 'Looking for VS Code'
                  : 'Waiting for VS Code'}
          </h1>
          <p>
            {linked
              ? 'Every capture from the toolbar is saved into its project and offered to send to that project’s agents. Bookmarks sync both ways.'
              : status.state === 'unpaired'
                ? 'VS Code is running. Pair once to save captures into your projects and keep bookmarks in sync.'
                : 'Start VS Code with the VS Code Browser extension. This page finds it by itself.'}
          </p>
        </div>
        <div className="canvas" aria-label="The link">
          <LinkGraph status={status} />
        </div>
      </section>

      {linked ? (
        <div className="cards">
          <Card
            icon="debug-disconnect"
            title="This browser"
            text="Unlinking stops sends and bookmark sync until you pair again."
          >
            <ConfirmButton
              variant="danger"
              icon="debug-disconnect"
              confirmLabel="Click again to unlink"
              onConfirm={() =>
                void chrome.runtime
                  .sendMessage({ type: 'unpair' })
                  .then((s: BridgeStatus | undefined) => s && setStatus(s))
              }
            >
              Unlink
            </ConfirmButton>
          </Card>
          <Card
            icon="lock"
            title="Private by design"
            text="The link only talks to VS Code on this computer (127.0.0.1), and only after pairing."
          />
        </div>
      ) : (
        <PairCard
          status={status}
          pair={pair}
          // The popup's "Use a code" opens this page at #vscode-code.
          startWithCode={location.hash === '#vscode-code'}
        />
      )}
    </>
  );
}

function ShortcutsSection({
  map,
  overrides,
  linked,
  toolbarKey,
}: {
  map: ShortcutMap;
  overrides: ShortcutOverrides;
  linked: boolean;
  toolbarKey?: string;
}) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const showBrowserKey =
    !needle ||
    needle.split(/\s+/).every((word) => 'open the toolbar browser'.includes(word)) ||
    (!!toolbarKey &&
      (toolbarKey.toLowerCase().includes(needle) || keyMatchesQuery(toolbarKey, needle)));
  return (
    <>
      <section className="hero compact">
        <div className="hero-text">
          <h1>Shortcuts</h1>
          <p>
            Every shortcut of the toolbar and VS Code Browser, one key map:{' '}
            {linked
              ? 'a change here applies in VS Code too, and the other way round.'
              : 'they sync with VS Code once it is linked, and follow your browser account.'}{' '}
            Click a key, then press the new one.
          </p>
        </div>
      </section>
      <div className="card shortcuts-card">
        <div className="shortcuts-bar">
          <ShortcutSearch value={query} onChange={setQuery} />
          {/* Shared with VS Code: a reset there too, so it takes a second click. */}
          <ConfirmButton
            icon="discard"
            confirmLabel="Click again to reset"
            title="Reset all shortcuts (here and in VS Code)"
            disabled={!Object.keys(overrides).length}
            onConfirm={() => void resetAllShortcuts()}
          >
            Reset all
          </ConfirmButton>
        </div>
        {/* The one key the browser keeps (chrome://extensions/shortcuts), not the synced map. */}
        {showBrowserKey && (
          <div className="browser-key">
            <span className="codicon codicon-inspect" aria-hidden="true" />
            <span className="browser-key-label">Open the toolbar</span>
            <span
              className="shortcut-tag br"
              title="Works in your browser. Set by the browser itself, so it does not sync with VS Code"
            >
              BR
            </span>
            {toolbarKey ? (
              <KeyCaps binding={toolbarKey.toLowerCase()} size="sm" />
            ) : (
              <span className="muted">No key</span>
            )}
            {__BROWSER__ === 'chrome' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
              >
                Change
              </Button>
            )}
          </div>
        )}
        <ShortcutList
          actions={SHORTCUT_ACTIONS}
          scopes={ALL_SCOPES}
          map={map}
          overrides={overrides}
          query={query}
          labelOf={labelOf}
          scopeLabel={scopeLabelOf}
          onSetKeys={(id, keys) => void setShortcutKeys(overrides, id, keys)}
          onReset={(id) => void setShortcutKeys(overrides, id, undefined)}
        />
        <p className="card-foot">
          <span className="codicon codicon-info" aria-hidden="true" />
          VS: works in VS Code Browser. BR: works in this browser&apos;s toolbar. It is one key map:
          changing a key here changes it in VS Code too.
        </p>
      </div>
    </>
  );
}

function AboutSection({
  status,
  toolbarKey,
  stateLabel,
}: {
  status: BridgeStatus;
  toolbarKey?: string;
  stateLabel: string;
}) {
  const linked = status.state === 'connected';
  return (
    <>
      <section className="hero compact">
        <div className="hero-text">
          <h1>About</h1>
          <p>
            Inkspect {chrome.runtime.getManifest().version}: a toolbar for working with AI agents on
            any page, linked with VS Code.
          </p>
        </div>
      </section>
      <div className="cards">
        <Card
          icon="keyboard"
          title="Open the toolbar"
          text="On any page. The toolbar button opens the popup, which can open it too."
        >
          <span className="card-value">
            {toolbarKey ? (
              <KeyCaps binding={toolbarKey.toLowerCase()} size="sm" />
            ) : (
              <span className="muted">No key</span>
            )}
            {__BROWSER__ === 'chrome' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
              >
                Change
              </Button>
            )}
          </span>
        </Card>
        <Card
          icon="vscode"
          title="VS Code"
          text={linked ? `Linked with ${status.peer ?? 'VS Code'}.` : 'Not linked yet.'}
        >
          <span className="card-value muted">{stateLabel}</span>
        </Card>
        <Card
          icon="bookmark"
          title="Bookmarks"
          text="Synced with VS Code both ways, live, while it is linked."
        >
          <span className="card-value muted">{linked ? 'Syncing' : 'Paused'}</span>
        </Card>
        <Card
          icon="shield"
          title="Access"
          text="Only the tab you open the toolbar on, while it is open. Nothing leaves this computer except to VS Code on 127.0.0.1."
        />
      </div>
    </>
  );
}

/** A card: an icon tile, a title and a line of text, and its control or value at the bottom. */
function Card({
  icon,
  title,
  text,
  children,
}: {
  icon: string;
  title: string;
  text: string;
  children?: ReactNode;
}) {
  return (
    <section className="card info-card">
      <span className="card-icon" aria-hidden="true">
        <span className={`codicon codicon-${icon}`} />
      </span>
      <h2>{title}</h2>
      <p>{text}</p>
      {children && <div className="card-bottom">{children}</div>}
    </section>
  );
}

// The toolbar's browser key, pressed on this page: the browser gives it to the extension, not
// the page, so the background passes it on for the shortcut search box.
chrome.runtime.onMessage.addListener((message: Partial<ShortcutPressed>) => {
  if (message?.type === 'shortcutPressed' && typeof message.key === 'string') {
    fillActiveSearch(message.key);
  }
});

const style = document.createElement('style');
style.textContent = [codiconCss, themeCss, uiCss, linkGraphCss, pairCardCss, optionsCss].join('\n');
document.head.append(style);
document.documentElement.classList.add('ink-theme');

createRoot(document.getElementById('root')!).render(<Options />);
