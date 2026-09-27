import type { EngineState } from '@shared/protocol';
import { postToHost } from '../vscode';

/** Shown over the page area while the browser engine is not running. */
export function EngineOverlay({ engine }: { engine: EngineState }) {
  switch (engine.status) {
    case 'running':
      return null;
    case 'downloading':
      return (
        <div className="overlay engine-overlay">
          <span className="codicon codicon-cloud-download big-icon" aria-hidden="true" />
          <p>{engine.message ?? 'Downloading Chromium...'}</p>
          <div
            className="progress-track"
            role="progressbar"
            aria-valuenow={Math.round((engine.progress ?? 0) * 100)}
          >
            <div style={{ width: `${(engine.progress ?? 0) * 100}%` }} />
          </div>
          <p className="muted">{Math.floor((engine.progress ?? 0) * 100)}%</p>
        </div>
      );
    case 'starting':
    case 'stopped':
      return (
        <div className="overlay engine-overlay">
          <span
            className="codicon codicon-loading codicon-modifier-spin big-icon"
            aria-hidden="true"
          />
          <p>{engine.message ?? 'Starting browser engine...'}</p>
        </div>
      );
    case 'crashed':
    case 'error':
      return (
        <div className="overlay engine-overlay">
          <span className="codicon codicon-error big-icon" aria-hidden="true" />
          <p>
            {engine.status === 'crashed'
              ? 'The browser engine stopped.'
              : 'The browser engine could not start.'}
          </p>
          {engine.message && <p className="muted engine-message">{engine.message}</p>}
          <div className="dialog-buttons">
            <button
              type="button"
              className="button primary"
              onClick={() => postToHost({ type: 'restartEngine' })}
            >
              {engine.status === 'crashed' ? 'Restart' : 'Retry'}
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'openSettings' })}
            >
              Settings
            </button>
          </div>
        </div>
      );
  }
}

/** Shown when the tab's renderer process crashed. */
export function CrashedOverlay({ tabId }: { tabId: string }) {
  return (
    <div className="overlay engine-overlay">
      <span className="codicon codicon-bug big-icon" aria-hidden="true" />
      <p>This page crashed.</p>
      <button
        type="button"
        className="button primary"
        onClick={() => postToHost({ type: 'tab', action: 'reload', tabId })}
      >
        Reload
      </button>
    </div>
  );
}
