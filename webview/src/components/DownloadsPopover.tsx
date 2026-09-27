import { useEffect, useRef } from 'react';
import type { DownloadInfo } from '@shared/protocol';
import { downloadStatus } from '../format';
import { postToHost } from '../vscode';

export function DownloadItem({ download }: { download: DownloadInfo }) {
  const run = (action: 'open' | 'reveal' | 'cancel' | 'remove') => () =>
    postToHost({ type: 'download', action, id: download.id });
  const progress =
    download.state === 'inProgress' && download.totalBytes
      ? download.receivedBytes / download.totalBytes
      : undefined;
  const available = download.state === 'completed' && !!download.path;

  return (
    <div className={`download-item ${download.state}`}>
      <span className="codicon codicon-file download-icon" aria-hidden="true" />
      <div className="download-body">
        <button
          type="button"
          className="download-name link-button"
          disabled={!available}
          title={download.path ?? download.url}
          onClick={run('open')}
        >
          {download.filename}
        </button>
        <div className="download-status">{downloadStatus(download)}</div>
        {progress !== undefined && (
          <div className="download-progress">
            <div style={{ width: `${progress * 100}%` }} />
          </div>
        )}
      </div>
      <div className="download-actions">
        {download.state === 'inProgress' && (
          <button
            type="button"
            className="icon-button"
            title="Cancel"
            aria-label="Cancel"
            onClick={run('cancel')}
          >
            <span className="codicon codicon-close" aria-hidden="true" />
          </button>
        )}
        {available && (
          <button
            type="button"
            className="icon-button"
            title="Show in folder"
            aria-label="Show in folder"
            onClick={run('reveal')}
          >
            <span className="codicon codicon-folder-opened" aria-hidden="true" />
          </button>
        )}
        {download.state !== 'inProgress' && (
          <button
            type="button"
            className="icon-button"
            title="Remove from list"
            aria-label="Remove from list"
            onClick={run('remove')}
          >
            <span className="codicon codicon-trash" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}

interface DownloadsPopoverProps {
  downloads: DownloadInfo[];
  onClose: () => void;
}

export function DownloadsPopover({ downloads, onClose }: DownloadsPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const anchor = ref.current?.parentElement;
      if (anchor && !anchor.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="popover downloads-popover"
      role="dialog"
      aria-label="Recent downloads"
    >
      <div className="popover-header">Recent downloads</div>
      {downloads.slice(0, 6).map((download) => (
        <DownloadItem key={download.id} download={download} />
      ))}
      <button
        type="button"
        className="link-button popover-footer"
        onClick={() => {
          onClose();
          postToHost({ type: 'navigate', input: 'vb://downloads', newTab: true });
        }}
      >
        Show all downloads
      </button>
    </div>
  );
}
