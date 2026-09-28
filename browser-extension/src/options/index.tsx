// Settings page: the link to VS Code (status, pairing). The toolbar settings are disabled.
import codiconCss from '@vscode/codicons/dist/codicon.css';
import themeCss from '@inkspect/shared/ui/theme.css';
import uiCss from '@inkspect/shared/ui/ui.css';
import { Button } from '@inkspect/shared/ui/Button';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CodeInput } from './CodeInput';
import optionsCss from './options.css';
// import type { CopyFormat } from '@inkspect/shared/elementInfo';
import type { BridgeStatus } from '../messages';
// import { DEFAULT_SETTINGS, loadSettings, type Settings } from '../content/page';

function Options() {
  const [status, setStatus] = useState<BridgeStatus>({ state: 'offline' });
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  // const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    // void loadSettings().then(setSettings);
    const refresh = () =>
      void chrome.runtime
        .sendMessage({ type: 'status' })
        .then((s: BridgeStatus | undefined) => s && setStatus(s));
    refresh();
    const timer = setInterval(refresh, 2000);
    return () => clearInterval(timer);
  }, []);

  // Disabled with the toolbar features (their settings):
  // const save = (changes: Partial<Settings>) => {
  // const next = { ...settings, ...changes };
  // setSettings(next);
  // void chrome.storage.sync.set({ settings: next });
  // };

  const [pairing, setPairing] = useState(false);
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
  const view = STATE_VIEW[status.state];

  return (
    <main className="page">
      <header className="brand">
        <img className="brand-logo" src="icons/48.png" alt="" />
        <div>
          <h1>Inkspect</h1>
          <p className="muted">
            Keeps this browser's bookmarks in sync with VS Code, live and both ways.
          </p>
        </div>
      </header>

      <section className="card link-card" aria-label="VS Code link">
        <div className="link-status">
          <span className={`status-dot ${view.tone}`} aria-hidden="true" />
          <div className="link-text">
            <div className="link-title">{view.title}</div>
            <p className="status">
              {status.state === 'connected'
                ? `Linked with ${status.peer ?? 'VS Code'}. Bookmarks sync both ways.`
                : status.state === 'unpaired'
                  ? 'VS Code is running; this browser is not paired yet.'
                  : 'VS Code is not reachable. Start VS Code with the VS Code Browser extension.'}
            </p>
          </div>
          {status.state === 'connected' && (
            <Button
              variant="danger"
              icon="debug-disconnect"
              onClick={() =>
                void chrome.runtime
                  .sendMessage({ type: 'unpair' })
                  .then((s: BridgeStatus | undefined) => s && setStatus(s))
              }
            >
              Unlink
            </Button>
          )}
        </div>
        {status.state !== 'connected' && (
          <form
            className="pair"
            onSubmit={(event) => {
              event.preventDefault();
              void pair();
            }}
          >
            <ol className="steps">
              <li>
                In VS Code, click <b>Pair</b> on the "wants to sync bookmarks" notification, or run{' '}
                <b>Browser: Connect Browser Extension</b>.
              </li>
              <li>Enter the 6-digit code it shows.</li>
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
          </form>
        )}
      </section>

      <p className="footnote muted">
        <span className="codicon codicon-lock" aria-hidden="true" />
        The link only talks to VS Code on this computer (127.0.0.1), and only after pairing.
      </p>
      {/* Disabled with the toolbar features (element details, drawing and shortcut settings):
      <h2>Element details</h2>
      <label>
        Copy as
        <select
          value={settings.copyFormat}
          onChange={(e) => save({ copyFormat: e.target.value as CopyFormat })}
        >
          <option value="markdown">Markdown (for AI chats)</option>
          <option value="json">JSON</option>
          <option value="selector">Selector only</option>
          <option value="html">HTML only</option>
        </select>
      </label>
      <label>
        Longest HTML snippet
        <input
          type="number"
          min={100}
          max={20000}
          value={settings.maxHtml}
          onChange={(e) => save({ maxHtml: Number(e.target.value) || DEFAULT_SETTINGS.maxHtml })}
        />
        characters
      </label>

      <h2>Drawing</h2>
      <label>
        Padding around drawing screenshots
        <input
          type="number"
          min={0}
          max={400}
          value={settings.annotationPadding}
          onChange={(e) => save({ annotationPadding: Number(e.target.value) || 0 })}
        />
        px
      </label>

      <h2>Keyboard shortcut</h2>
      <p className="muted">
        The toolbar opens with <code>Alt+Shift+I</code> or the toolbar button.{' '}
        {__BROWSER__ === 'chrome' ? (
          <button
            type="button"
            onClick={() => void chrome.tabs.create({ url: 'chrome://extensions/shortcuts' })}
          >
            Change shortcut
          </button>
        ) : (
          'Change it in Add-ons, then the gear menu, then Manage Extension Shortcuts.'
        )}
      </p>
      */}
    </main>
  );
}

const STATE_VIEW: Record<BridgeStatus['state'], { title: string; tone: string }> = {
  connected: { title: 'Linked', tone: 'ok' },
  connecting: { title: 'Connecting…', tone: 'busy' },
  unpaired: { title: 'Not paired', tone: 'warn' },
  offline: { title: 'VS Code not found', tone: 'off' },
};

const style = document.createElement('style');
style.textContent = [codiconCss, themeCss, uiCss, optionsCss].join('\n');
document.head.append(style);
document.documentElement.classList.add('ink-theme');

createRoot(document.getElementById('root')!).render(<Options />);
