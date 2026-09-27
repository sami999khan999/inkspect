import { useEffect } from 'react';
import { postToHost } from '../vscode';

interface SettingsPageProps {
  chromiumVersion?: string;
  profiles: string[];
}

/** vb://settings: shortcuts to the browser's settings and data tools. */
export function SettingsPage({ chromiumVersion, profiles }: SettingsPageProps) {
  useEffect(() => {
    postToHost({ type: 'requestPageData', page: 'settings' });
  }, []);

  return (
    <div className="internal-page settings-page">
      <div className="internal-page-inner">
        <header className="internal-page-header">
          <h1>Settings</h1>
        </header>
        <section className="settings-section">
          <h2>General</h2>
          <p className="muted">
            Home page, search engine, downloads folder, tab limits and more are VS Code settings.
          </p>
          <button
            type="button"
            className="button primary"
            onClick={() => postToHost({ type: 'openSettings' })}
          >
            Open browser settings
          </button>
        </section>
        <section className="settings-section">
          <h2>Bookmarks</h2>
          <p className="muted">
            {profiles.length
              ? `Found bookmarks from: ${profiles.join(', ')}.`
              : 'Import from another browser or from a bookmarks HTML file.'}
          </p>
          <div className="button-row">
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'bookmark', action: 'import' })}
            >
              Import bookmarks...
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'bookmark', action: 'export' })}
            >
              Export bookmarks...
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'toggleBookmarksBar' })}
            >
              Show or hide the bookmarks bar
            </button>
          </div>
        </section>
        <section className="settings-section">
          <h2>Privacy</h2>
          <p className="muted">
            History, cookies, site data and cache are kept in the extension's own browser profile.
          </p>
          <button
            type="button"
            className="button secondary"
            onClick={() => postToHost({ type: 'clearBrowsingData' })}
          >
            Clear browsing data...
          </button>
        </section>
        <section className="settings-section">
          <h2>About</h2>
          <p className="muted">Browser engine: {chromiumVersion ?? 'not running'}</p>
          <button
            type="button"
            className="button secondary"
            onClick={() => postToHost({ type: 'restartEngine' })}
          >
            Restart browser engine
          </button>
        </section>
      </div>
    </div>
  );
}
