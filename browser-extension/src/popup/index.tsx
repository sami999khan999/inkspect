// The toolbar button's popup: the link at a glance (where sends go), the button that opens the
// toolbar on this page, the main keys, and the way to the full page (options.html).
import codiconCss from '@vscode/codicons/dist/codicon.css';
import themeCss from '@inkspect/shared/ui/theme.css';
import uiCss from '@inkspect/shared/ui/ui.css';
import { effectiveShortcuts, type ShortcutMap } from '@inkspect/shared/shortcuts';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { KeyCaps } from '@inkspect/shared/ui/KeyCaps';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { BridgeStatus } from '../messages';
import { isMac, labelOf, TOOLBAR_ACTIONS, watchShortcuts } from '../shortcuts';
import { LinkGraph } from '../ui/LinkGraph';
import linkGraphCss from '../ui/link-graph.css';
import pairCardCss from '../ui/pair-card.css';
import { PairCard } from '../ui/PairCard';
import popupCss from './popup.css';

/** The keys the popup shows; the full page has all of them. */
const MAIN_KEYS = ['mode.inspect', 'mode.draw', 'mode.screenshot', 'mode.device'];
const KEY_ICONS: Record<string, string> = {
  'mode.inspect': 'inspect',
  'mode.draw': 'edit',
  'mode.screenshot': 'device-camera',
  'mode.device': 'device-mobile',
};

const STATE: Record<BridgeStatus['state'], { label: string; tone: string }> = {
  connected: { label: 'Linked', tone: 'ok' },
  connecting: { label: 'Connecting', tone: 'busy' },
  unpaired: { label: 'Not paired', tone: 'warn' },
  offline: { label: 'VS Code not running', tone: 'off' },
};

/**
 * Opens the side panel with the Saved list (the page's project, or another). It must open in the
 * click itself (browsers allow it only as the answer to a user action), so the window id is read
 * beforehand.
 */
function openSaved(windowId: number | undefined) {
  if (__BROWSER__ === 'firefox') {
    const sidebar = (globalThis as { browser?: { sidebarAction?: { open(): Promise<void> } } })
      .browser?.sidebarAction;
    void sidebar?.open();
  } else if (windowId !== undefined) {
    void chrome.sidePanel.open({ windowId });
  }
  window.close();
}

/** Opens the full page, on one of its sections. */
function openPage(section?: string) {
  void chrome.tabs.create({
    url: chrome.runtime.getURL(`options.html${section ? `#${section}` : ''}`),
  });
  window.close();
}

function Popup() {
  const [status, setStatus] = useState<BridgeStatus>({ state: 'connecting' });
  const [map, setMap] = useState<ShortcutMap>(() => effectiveShortcuts({}, isMac));
  const [toolbarKey, setToolbarKey] = useState<string>();
  const [failed, setFailed] = useState('');
  const [windowId, setWindowId] = useState<number>();

  useEffect(() => {
    const refresh = () =>
      void chrome.runtime
        .sendMessage({ type: 'status' })
        .then((s: BridgeStatus | undefined) => s && setStatus(s));
    refresh();
    const timer = setInterval(refresh, 1500);
    const stop = watchShortcuts((next) => setMap(next));
    void chrome.windows.getCurrent().then((w) => setWindowId(w.id));
    void chrome.commands
      .getAll()
      // '' when the browser didn't assign the suggested key (it was taken) or the user cleared it.
      .then((all) => setToolbarKey(all.find((c) => c.name === 'toggle-toolbar')?.shortcut ?? ''));
    return () => {
      clearInterval(timer);
      stop();
    };
  }, []);

  const openToolbar = async () => {
    const reply = (await chrome.runtime
      .sendMessage({ type: 'toggleToolbar' })
      .catch(() => null)) as { ok: boolean; error?: string } | null;
    if (reply?.ok) window.close();
    else setFailed(reply?.error ?? 'The toolbar could not open on this page.');
  };

  const view = STATE[status.state];
  const linked = status.state === 'connected';
  return (
    <main className={`popup tone-${view.tone}`}>
      <header className="popup-head">
        <img src="icons/32.png" alt="" />
        <span className="popup-name">Inkspect</span>
        <span className="popup-state" role="status">
          <span className="status-dot" aria-hidden="true" />
          {view.label}
        </span>
      </header>

      <section className="popup-link" aria-label="VS Code">
        <LinkGraph status={status} size="sm" />
        {!linked && (
          <PairCard
            compact
            status={status}
            pair={async (code) => {
              const result = (await chrome.runtime
                .sendMessage({ type: 'pair', code })
                .catch(() => undefined)) as BridgeStatus | undefined;
              if (result) setStatus(result);
              return result;
            }}
          />
        )}
      </section>

      <div className="popup-action">
        <Button variant="primary" icon="inspect" className="open-toolbar" onClick={openToolbar}>
          <span className="open-label">Open toolbar on this page</span>
          {toolbarKey && <KeyCaps binding={toolbarKey.toLowerCase()} size="sm" />}
        </Button>
        {toolbarKey === '' && (
          <p className="popup-hint">
            <span className="codicon codicon-keyboard" aria-hidden="true" />
            <span>No shortcut is set for this.</span>
            {__BROWSER__ === 'chrome' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => void chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
              >
                Set one
              </Button>
            )}
          </p>
        )}
        {failed && (
          <p className="popup-error" role="alert">
            <span className="codicon codicon-error" aria-hidden="true" />
            {failed}
          </p>
        )}
      </div>

      <section className="popup-keys" aria-label="Main shortcuts">
        {MAIN_KEYS.map((id) => {
          const action = TOOLBAR_ACTIONS.find((a) => a.id === id);
          const key = map[id]?.[0];
          if (!action) return null;
          return (
            <div key={id} className="key-tile">
              <span className="key-tile-label">
                <span className={`codicon codicon-${KEY_ICONS[id]}`} aria-hidden="true" />
                {labelOf(action)}
              </span>
              {key ? <KeyCaps binding={key} size="sm" /> : <span className="muted">No key</span>}
            </div>
          );
        })}
      </section>

      <footer className="popup-foot">
        <Button size="sm" variant="ghost" icon="link-external" onClick={() => openPage()}>
          Open Inkspect
        </Button>
        {status.projects && (
          <Button
            size="sm"
            variant="ghost"
            icon="layout-sidebar-right"
            onClick={() => openSaved(windowId)}
          >
            Saved
          </Button>
        )}
        <IconButton
          icon="keyboard"
          label="Change shortcuts"
          onClick={() => openPage('shortcuts')}
        />
      </footer>
    </main>
  );
}

const style = document.createElement('style');
style.textContent = [codiconCss, themeCss, uiCss, linkGraphCss, pairCardCss, popupCss].join('\n');
document.head.append(style);
document.documentElement.classList.add('ink-theme');

createRoot(document.getElementById('root')!).render(<Popup />);
