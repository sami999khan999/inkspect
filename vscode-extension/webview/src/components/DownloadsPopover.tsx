import { useEffect, useRef } from 'react';
import type { DownloadInfo } from '@shared/protocol';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { downloadStatus } from '../format';
import { postToHost } from '../vscode';

const FILE_ICONS: [RegExp, string][] = [
  [/.(zip|rar|7z|tar|gz|tgz|bz2|xz|vsix|crx)$/i, 'file-zip'],
  [/.pdf$/i, 'file-pdf'],
  [/.(png|jpe?g|gif|webp|svg|avif|bmp|ico|mp4|webm|mov|mp3|wav|ogg)$/i, 'file-media'],
  [/.(js|ts|tsx|jsx|json|html|css|py|go|rs|java|c|cpp|sh|ps1|md)$/i, 'file-code'],
  [/.(exe|msi|dmg|pkg|deb|rpm|appimage)$/i, 'package'],
];

/** A codicon for a file name's type. */
function fileIcon(name: string): string {
  return FILE_ICONS.find(([pattern]) => pattern.test(name))?.[1] ?? 'file';
}

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
      <span className="download-icon" aria-hidden="true">
        <span className={`codicon codicon-${fileIcon(download.filename)}`} />
      </span>
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
          <IconButton icon="close" label="Cancel" className="small" onClick={run('cancel')} />
        )}
        {available && (
          <IconButton
            icon="folder-opened"
            label="Show in folder"
            className="small"
            onClick={run('reveal')}
          />
        )}
        {download.state !== 'inProgress' && (
          <IconButton
            icon="trash"
            label="Remove from list"
            className="small"
            onClick={run('remove')}
          />
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
      {downloads.length === 0 && <p className="popover-empty">No downloads yet.</p>}
      <div className="popover-footer">
        <Button
          variant="ghost"
          size="sm"
          iconEnd="arrow-right"
          onClick={() => {
            onClose();
            postToHost({ type: 'navigate', input: 'vb://downloads', newTab: true });
          }}
        >
          Show all downloads
        </Button>
      </div>
    </div>
  );
}
