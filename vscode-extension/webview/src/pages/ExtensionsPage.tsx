import { useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Switch } from '@inkspect/shared/ui/Switch';
import { TextField } from '@inkspect/shared/ui/TextField';
import type { ExtensionInfo } from '@shared/protocol';
import { postToHost } from '../vscode';
import { EmptyState, PageLayout } from './PageLayout';

const SOURCE_LABEL: Record<ExtensionInfo['source'], string> = {
  folder: 'Unpacked',
  file: 'From file',
  webstore: 'Chrome Web Store',
};

/** vb://extensions: install, enable, pin, configure and remove Chrome extensions. */
export function ExtensionsPage({ extensions }: { extensions: ExtensionInfo[] }) {
  const [storeUrl, setStoreUrl] = useState('');
  const [details, setDetails] = useState<string | null>(null);
  const act = (
    action: 'enable' | 'disable' | 'pin' | 'unpin' | 'openOptions' | 'remove',
    id: string,
  ) => postToHost({ type: 'extension', action, id });

  return (
    <PageLayout
      name="extensions"
      icon="extensions"
      title="Extensions"
      description="Chrome extensions (Manifest V3) for this browser."
      actions={
        <>
          <Button
            icon="folder-opened"
            onClick={() => postToHost({ type: 'extension', action: 'loadUnpacked' })}
          >
            Load unpacked…
          </Button>
          <Button
            icon="file-zip"
            onClick={() => postToHost({ type: 'extension', action: 'installFile' })}
          >
            Install file…
          </Button>
          <IconButton
            icon="sync"
            label="Check for updates"
            onClick={() => postToHost({ type: 'extension', action: 'checkUpdates' })}
          />
        </>
      }
      toolbar={
        <form
          className="store-install"
          onSubmit={(event) => {
            event.preventDefault();
            if (!storeUrl.trim()) return;
            postToHost({ type: 'extension', action: 'installWebStore', value: storeUrl.trim() });
            setStoreUrl('');
          }}
        >
          <TextField
            size="lg"
            icon="link"
            value={storeUrl}
            placeholder="Paste a Chrome Web Store link or an extension id"
            aria-label="Chrome Web Store link or extension id"
            onChange={(event) => setStoreUrl(event.target.value)}
            onClear={() => setStoreUrl('')}
          />
          <Button type="submit" variant="primary" icon="add" disabled={!storeUrl.trim()}>
            Install
          </Button>
        </form>
      }
    >
      {extensions.length === 0 && (
        <EmptyState icon="extensions" title="No extensions yet">
          Install one from the Chrome Web Store, a .crx/.zip file or an unpacked folder.
        </EmptyState>
      )}
      <div className="extension-list">
        {extensions.map((ext) => (
          <article key={ext.id} className={`card extension-card${ext.enabled ? '' : ' disabled'}`}>
            <div className="extension-main">
              {ext.icon ? (
                <img className="extension-icon" src={ext.icon} alt="" />
              ) : (
                <span className="extension-icon placeholder" aria-hidden="true">
                  <span className="codicon codicon-extensions" />
                </span>
              )}
              <div className="extension-body">
                <div className="extension-title">
                  <strong>{ext.name}</strong>
                  <span className="muted">{ext.version}</span>
                  <span className="badge outline">{SOURCE_LABEL[ext.source]}</span>
                </div>
                <div className="muted extension-description">{ext.description}</div>
                {ext.error && (
                  <div className="extension-error">
                    <span className="codicon codicon-error" aria-hidden="true" /> Could not load:{' '}
                    {ext.error}
                  </div>
                )}
              </div>
              <Switch
                checked={ext.enabled}
                label={ext.enabled ? `Disable ${ext.name}` : `Enable ${ext.name}`}
                title={ext.enabled ? 'Enabled' : 'Disabled'}
                onChange={(on) => act(on ? 'enable' : 'disable', ext.id)}
              />
            </div>
            {details === ext.id && (
              <dl className="extension-details">
                <dt>Id</dt>
                <dd>{ext.id}</dd>
                <dt>Permissions</dt>
                <dd>{ext.permissions.length ? ext.permissions.join(', ') : 'None'}</dd>
              </dl>
            )}
            <div className="extension-actions">
              <Button
                size="sm"
                variant="ghost"
                icon={ext.pinned ? 'pinned' : 'pin'}
                aria-pressed={ext.pinned}
                onClick={() => act(ext.pinned ? 'unpin' : 'pin', ext.id)}
              >
                {ext.pinned ? 'Pinned to toolbar' : 'Pin to toolbar'}
              </Button>
              {ext.optionsPage && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon="settings-gear"
                  onClick={() => act('openOptions', ext.id)}
                >
                  Options
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                icon={details === ext.id ? 'chevron-up' : 'info'}
                onClick={() => setDetails(details === ext.id ? null : ext.id)}
              >
                {details === ext.id ? 'Hide details' : 'Details'}
              </Button>
              <span className="dev-spacer" />
              <Button size="sm" variant="danger" icon="trash" onClick={() => act('remove', ext.id)}>
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
      <p className="page-note">
        <span className="codicon codicon-info" aria-hidden="true" />
        Popups, options pages, content scripts and background service workers work. Toolbar buttons
        without a popup, extension context-menu items and native messaging are not supported.
      </p>
    </PageLayout>
  );
}
