import { Button } from '@inkspect/shared/ui/Button';
import type { DownloadInfo } from '@shared/protocol';
import { DownloadItem } from '../components/DownloadsPopover';
import { postToHost } from '../vscode';
import { EmptyState, PageLayout } from './PageLayout';

export function DownloadsPage({ downloads }: { downloads: DownloadInfo[] }) {
  return (
    <PageLayout
      name="downloads"
      icon="cloud-download"
      title="Downloads"
      description="Files saved from pages. Open them, show them in their folder, or clear the list."
      actions={
        <Button
          icon="clear-all"
          disabled={!downloads.some((d) => d.state !== 'inProgress')}
          onClick={() => postToHost({ type: 'download', action: 'clear' })}
        >
          Clear all
        </Button>
      }
    >
      {downloads.length === 0 ? (
        <EmptyState icon="cloud-download" title="No downloads">
          Files you download appear here.
        </EmptyState>
      ) : (
        <div className="card list-card downloads-list">
          {downloads.map((download) => (
            <DownloadItem key={download.id} download={download} />
          ))}
        </div>
      )}
    </PageLayout>
  );
}
