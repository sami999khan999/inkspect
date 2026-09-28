import { Button } from '@inkspect/shared/ui/Button';
import type { EngineState } from '@shared/protocol';
import { postToHost } from '../vscode';
import { StatusPanel } from './StatusPanel';

/** Shown over the page area while the browser engine is not running. */
export function EngineOverlay({ engine }: { engine: EngineState }) {
  switch (engine.status) {
    case 'running':
      return null;
    case 'downloading': {
      const percent = Math.floor((engine.progress ?? 0) * 100);
      return (
        <StatusPanel icon="cloud-download" tone="accent" title="Setting up the browser engine">
          <p className="status-text">{engine.message ?? 'Downloading Chromium (once)…'}</p>
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Download progress"
            aria-valuenow={percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div style={{ width: `${percent}%` }} />
          </div>
          <p className="status-meta">{percent}%</p>
        </StatusPanel>
      );
    }
    case 'starting':
    case 'stopped':
      return (
        <StatusPanel icon="loading" spin title={engine.message ?? 'Starting the browser engine…'} />
      );
    case 'crashed':
    case 'error':
      return (
        <StatusPanel
          icon="error"
          tone="danger"
          title={
            engine.status === 'crashed'
              ? 'The browser engine stopped'
              : 'The browser engine could not start'
          }
          actions={
            <>
              <Button
                variant="secondary"
                icon="settings-gear"
                onClick={() => postToHost({ type: 'openSettings' })}
              >
                Settings
              </Button>
              <Button
                variant="primary"
                icon="refresh"
                onClick={() => postToHost({ type: 'restartEngine' })}
              >
                {engine.status === 'crashed' ? 'Restart' : 'Retry'}
              </Button>
            </>
          }
        >
          {engine.message && <pre className="status-detail">{engine.message}</pre>}
        </StatusPanel>
      );
  }
}

/** Shown when the tab's renderer process crashed. */
export function CrashedOverlay({ tabId }: { tabId: string }) {
  return (
    <StatusPanel
      icon="bug"
      tone="danger"
      title="This page crashed"
      actions={
        <Button
          variant="primary"
          icon="refresh"
          onClick={() => postToHost({ type: 'tab', action: 'reload', tabId })}
        >
          Reload
        </Button>
      }
    >
      <p className="status-text">Its renderer process stopped. Reloading usually brings it back.</p>
    </StatusPanel>
  );
}
