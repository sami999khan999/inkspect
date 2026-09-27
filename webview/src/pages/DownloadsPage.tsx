import type { DownloadInfo } from '@shared/protocol';
import { DownloadItem } from '../components/DownloadsPopover';
import { postToHost } from '../vscode';

export function DownloadsPage({ downloads }: { downloads: DownloadInfo[] }) {
  return (
    <div className="internal-page downloads-page">
      <div className="internal-page-inner">
        <header className="internal-page-header">
          <h1>Downloads</h1>
          <button
            type="button"
            className="button secondary"
            disabled={!downloads.some((d) => d.state !== 'inProgress')}
            onClick={() => postToHost({ type: 'download', action: 'clear' })}
          >
            Clear all
          </button>
        </header>
        {downloads.length === 0 ? (
          <p className="muted empty-state">Files you download appear here.</p>
        ) : (
          <div className="downloads-list">
            {downloads.map((download) => (
              <DownloadItem key={download.id} download={download} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
