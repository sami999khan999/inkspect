import { useState } from 'react';
import type { ExtensionInfo } from '@shared/protocol';
import { postToHost } from '../vscode';

const SOURCE_LABEL: Record<ExtensionInfo['source'], string> = {
  folder: 'Unpacked',
  file: 'From file',
  webstore: 'Chrome Web Store',
};

/** vb://extensions: install, enable, pin, configure and remove Chrome extensions. */
export function ExtensionsPage({ extensions }: { extensions: ExtensionInfo[] }) {
  const [storeUrl, setStoreUrl] = useState('');
  const [details, setDetails] = useState<string | null>(null);

  return (
    <div className="internal-page extensions-page">
      <div className="internal-page-inner">
        <header className="internal-page-header">
          <h1>Extensions</h1>
          <div className="header-actions">
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'extension', action: 'loadUnpacked' })}
            >
              Load unpacked...
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'extension', action: 'installFile' })}
            >
              Install .crx/.zip...
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'extension', action: 'checkUpdates' })}
            >
              Check for updates
            </button>
          </div>
        </header>
        <form
          className="store-install"
          onSubmit={(event) => {
            event.preventDefault();
            if (!storeUrl.trim()) return;
            postToHost({ type: 'extension', action: 'installWebStore', value: storeUrl.trim() });
            setStoreUrl('');
          }}
        >
          <input
            className="page-search"
            type="text"
            value={storeUrl}
            placeholder="Paste a Chrome Web Store link (chromewebstore.google.com/detail/…) or extension id"
            aria-label="Chrome Web Store link or extension id"
            onChange={(event) => setStoreUrl(event.target.value)}
          />
          <button type="submit" className="button primary" disabled={!storeUrl.trim()}>
            Install
          </button>
        </form>
        {extensions.length === 0 && (
          <p className="muted empty-state">
            No extensions yet. Manifest V3 extensions from the Chrome Web Store, a .crx/.zip file or
            an unpacked folder can be installed.
          </p>
        )}
        <div className="extension-list">
          {extensions.map((ext) => (
            <div key={ext.id} className={`extension-card${ext.enabled ? '' : ' disabled'}`}>
              {ext.icon ? (
                <img className="extension-icon" src={ext.icon} alt="" />
              ) : (
                <span className="codicon codicon-extensions extension-icon" aria-hidden="true" />
              )}
              <div className="extension-body">
                <div className="extension-title">
                  <strong>{ext.name}</strong> <span className="muted">{ext.version}</span>
                  <span className="extension-source">{SOURCE_LABEL[ext.source]}</span>
                </div>
                <div className="muted extension-description">{ext.description}</div>
                {ext.error && <div className="extension-error">Could not load: {ext.error}</div>}
                {details === ext.id && (
                  <div className="extension-details">
                    <div>
                      <span className="muted">Id:</span> {ext.id}
                    </div>
                    <div>
                      <span className="muted">Permissions:</span>{' '}
                      {ext.permissions.length ? ext.permissions.join(', ') : 'none'}
                    </div>
                  </div>
                )}
                <div className="extension-actions">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={ext.enabled}
                      onChange={(event) =>
                        postToHost({
                          type: 'extension',
                          action: event.target.checked ? 'enable' : 'disable',
                          id: ext.id,
                        })
                      }
                    />
                    Enabled
                  </label>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={ext.pinned}
                      onChange={(event) =>
                        postToHost({
                          type: 'extension',
                          action: event.target.checked ? 'pin' : 'unpin',
                          id: ext.id,
                        })
                      }
                    />
                    Pinned to toolbar
                  </label>
                  {ext.optionsPage && (
                    <button
                      type="button"
                      className="link-button"
                      onClick={() =>
                        postToHost({ type: 'extension', action: 'openOptions', id: ext.id })
                      }
                    >
                      Options
                    </button>
                  )}
                  <button
                    type="button"
                    className="link-button"
                    onClick={() => setDetails(details === ext.id ? null : ext.id)}
                  >
                    {details === ext.id ? 'Hide details' : 'Details'}
                  </button>
                  <button
                    type="button"
                    className="link-button danger"
                    onClick={() => postToHost({ type: 'extension', action: 'remove', id: ext.id })}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="muted extension-note">
          Extension popups, options pages, content scripts and background service workers work.
          Extensions whose toolbar button has no popup, extension context-menu items and native
          messaging are not supported.
        </p>
      </div>
    </div>
  );
}
