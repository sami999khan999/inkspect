import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { CopyFormat } from '@inkspect/shared/elementInfo';
import type { BridgeStatus } from '../messages';
import { DEFAULT_SETTINGS, loadSettings, type Settings } from '../content/page';

function Options() {
  const [status, setStatus] = useState<BridgeStatus>({ state: 'offline' });
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    void loadSettings().then(setSettings);
    const refresh = () =>
      void chrome.runtime
        .sendMessage({ type: 'status' })
        .then((s: BridgeStatus | undefined) => s && setStatus(s));
    refresh();
    const timer = setInterval(refresh, 2000);
    return () => clearInterval(timer);
  }, []);

  const save = (changes: Partial<Settings>) => {
    const next = { ...settings, ...changes };
    setSettings(next);
    void chrome.storage.sync.set({ settings: next });
  };

  const pair = async () => {
    setMessage('Pairing…');
    const result = (await chrome.runtime.sendMessage({ type: 'pair', code })) as BridgeStatus;
    setStatus(result);
    setMessage(result.error ?? (result.state === 'connected' ? 'Paired.' : ''));
  };

  return (
    <>
      <h1>Inkspect</h1>
      <h2>VS Code link</h2>
      <p className="status">
        {status.state === 'connected'
          ? `Linked with ${status.peer ?? 'VS Code'}. Bookmarks sync both ways.`
          : status.state === 'unpaired'
            ? 'VS Code is running; this browser is not paired yet.'
            : 'VS Code is not reachable. Start VS Code with the VS Code Browser extension.'}
      </p>
      {status.state !== 'connected' ? (
        <>
          <p className="muted">
            In VS Code, run <b>Browser: Connect Browser Extension</b> and enter the 6-digit code.
          </p>
          <label>
            Code
            <input
              inputMode="numeric"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            />
            <button type="button" disabled={code.length !== 6} onClick={() => void pair()}>
              Pair
            </button>
          </label>
        </>
      ) : (
        <button
          type="button"
          onClick={() =>
            void chrome.runtime
              .sendMessage({ type: 'unpair' })
              .then((s: BridgeStatus) => setStatus(s))
          }
        >
          Unlink this browser
        </button>
      )}
      {message && <p className="muted">{message}</p>}

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
    </>
  );
}

createRoot(document.getElementById('root')!).render(<Options />);
