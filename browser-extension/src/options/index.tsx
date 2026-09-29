// The extension's full page (the popup's "Open Inkspect", and the extension's options): a top bar
// with the sections and the link's state; VS Code shows the link (a branch to every open window)
// and pairing, Shortcuts the editor, About the details.
import codiconCss from '@vscode/codicons/dist/codicon.css';
import themeCss from '@inkspect/shared/ui/theme.css';
import uiCss from '@inkspect/shared/ui/ui.css';
import {
  effectiveShortcuts,
  type ShortcutMap,
  type ShortcutOverrides,
} from '@inkspect/shared/shortcuts';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { KeyCaps } from '@inkspect/shared/ui/KeyCaps';
import { Segmented } from '@inkspect/shared/ui/Segmented';
import { ShortcutList } from '@inkspect/shared/ui/ShortcutList';
import { TextField } from '@inkspect/shared/ui/TextField';
import { useEffect, useState, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import type { BridgeStatus } from '../messages';
import {
  isMac,
  labelOf,
  resetToolbarShortcuts,
  scopeLabelOf,
  setShortcutKeys,
  TOOLBAR_ACTIONS,
  TOOLBAR_SCOPES,
  watchShortcuts,
} from '../shortcuts';
import { LinkGraph } from '../ui/LinkGraph';
import linkGraphCss from '../ui/link-graph.css';
import { CodeInput } from './CodeInput';
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
  const windows = status.state === 'connected' ? (status.windows?.length ?? 1) : 0;

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
            { value: 'vscode', label: 'VS Code', icon: 'vscode', count: windows || undefined },
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
          />
        )}
        {tab === 'about' && (
          <AboutSection status={status} toolbarKey={toolbarKey} stateLabel={view.label} />
        )}
      </main>
    </div>
  );
}

/** The link: where sends go (a branch to each window), pairing, unlinking. */
function VsCodeSection({
  status,
  setStatus,
}: {
  status: BridgeStatus;
  setStatus: (status: BridgeStatus) => void;
}) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [pairing, setPairing] = useState(false);
  const linked = status.state === 'connected';
  const count = status.windows?.length ?? 1;

  const pair = async (value = code) => {
    if (value.length !== 6 || pairing) return;
    setPairing(true);
    setMessage('');
    const result = (await chrome.runtime
      .sendMessage({ type: 'pair', code: value })
      .catch(() => undefined)) as BridgeStatus | undefined;
    setPairing(false);
    if (!result) {
      setMessage('The extension did not answer. Reload it at chrome://extensions and try again.');
      return;
    }
    setStatus(result);
    setMessage(result.error ?? '');
    if (result.state === 'connected') setCode('');
  };

  return (
    <>
      <section className="hero">
        <div className="hero-text">
          <h1>
            {linked
              ? `Linked with ${count} VS Code window${count === 1 ? '' : 's'}`
              : status.state === 'unpaired'
                ? 'Pair with VS Code'
                : status.state === 'connecting'
                  ? 'Looking for VS Code'
                  : 'Waiting for VS Code'}
          </h1>
          <p>
            {linked
              ? 'Screenshots and elements you send from the toolbar go to the window you used last, unless you pick another after a capture. Bookmarks sync both ways.'
              : status.state === 'unpaired'
                ? 'VS Code is running. Pair once to send captures to it and keep bookmarks in sync.'
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
            <Button
              variant="danger"
              size="sm"
              icon="debug-disconnect"
              onClick={() =>
                void chrome.runtime
                  .sendMessage({ type: 'unpair' })
                  .then((s: BridgeStatus | undefined) => s && setStatus(s))
              }
            >
              Unlink
            </Button>
          </Card>
          <Card
            icon="lock"
            title="Private by design"
            text="The link only talks to VS Code on this computer (127.0.0.1), and only after pairing."
          />
        </div>
      ) : (
        <form
          className="card pair-card"
          onSubmit={(event) => {
            event.preventDefault();
            void pair();
          }}
        >
          <ol className="steps">
            <li>
              <span>
                In VS Code, run <kbd>Browser: Connect Browser Extension</kbd>, or click <b>Pair</b>{' '}
                on its "wants to sync bookmarks" notification.
              </span>
            </li>
            <li>
              <span>Type the 6-digit code it shows.</span>
            </li>
          </ol>
          <div className="pair-row">
            <CodeInput
              value={code}
              onChange={setCode}
              disabled={pairing}
              onComplete={(value) => void pair(value)}
            />
            <Button
              type="submit"
              variant="primary"
              icon="link"
              className="pair-button"
              loading={pairing}
              disabled={code.length !== 6}
            >
              Pair
            </Button>
          </div>
          {message && (
            <p className="pair-message" role="alert">
              <span className="codicon codicon-error" aria-hidden="true" />
              {message}
            </p>
          )}
          <p className="card-foot">
            <span className="codicon codicon-lock" aria-hidden="true" />
            The link only talks to VS Code on this computer (127.0.0.1), and only after pairing.
          </p>
        </form>
      )}
    </>
  );
}

function ShortcutsSection({
  map,
  overrides,
  linked,
}: {
  map: ShortcutMap;
  overrides: ShortcutOverrides;
  linked: boolean;
}) {
  const [query, setQuery] = useState('');
  return (
    <>
      <section className="hero compact">
        <div className="hero-text">
          <h1>Shortcuts</h1>
          <p>
            The toolbar's keys, shared with VS Code Browser:{' '}
            {linked
              ? 'a change here applies in VS Code too, and the other way round.'
              : 'they sync with VS Code once it is linked, and follow your browser account.'}{' '}
            Click a key, then press the new one.
          </p>
        </div>
      </section>
      <div className="card shortcuts-card">
        <div className="shortcuts-bar">
          <TextField
            icon="search"
            placeholder="Search actions or keys"
            aria-label="Search shortcuts"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClear={() => setQuery('')}
          />
          <IconButton
            icon="discard"
            label="Reset all shortcuts"
            disabled={!TOOLBAR_ACTIONS.some((a) => a.id in overrides)}
            onClick={() => void resetToolbarShortcuts(overrides)}
          />
        </div>
        <ShortcutList
          actions={TOOLBAR_ACTIONS}
          scopes={TOOLBAR_SCOPES}
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
          VS Code Browser has more (tabs, the address bar...): change those in its Shortcuts view.
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

const style = document.createElement('style');
style.textContent = [codiconCss, themeCss, uiCss, linkGraphCss, optionsCss].join('\n');
document.head.append(style);
document.documentElement.classList.add('ink-theme');

createRoot(document.getElementById('root')!).render(<Options />);
