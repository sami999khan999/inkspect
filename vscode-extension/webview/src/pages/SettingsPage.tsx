import { useEffect, type ReactNode } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { postToHost } from '../vscode';
import { PageLayout } from './PageLayout';

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
    <PageLayout
      name="settings"
      icon="settings-gear"
      title="Settings"
      description="Browser preferences live in VS Code's settings; data tools are here."
      actions={
        <Button
          variant="primary"
          icon="go-to-file"
          onClick={() => postToHost({ type: 'openSettings' })}
        >
          Open browser settings
        </Button>
      }
    >
      <Section icon="bookmark" title="Bookmarks">
        <Row
          title="Import bookmarks"
          description={
            profiles.length
              ? `Found in ${profiles.join(', ')}, or use a bookmarks HTML file.`
              : 'From another browser or from a bookmarks HTML file.'
          }
        >
          <Button
            icon="cloud-download"
            onClick={() => postToHost({ type: 'bookmark', action: 'import' })}
          >
            Import…
          </Button>
        </Row>
        <Row
          title="Export bookmarks"
          description="Save them as an HTML file any browser can import."
        >
          <Button icon="export" onClick={() => postToHost({ type: 'bookmark', action: 'export' })}>
            Export…
          </Button>
        </Row>
        <Row
          title="Bookmarks bar"
          description="Show or hide the bar under the address bar (Ctrl+Shift+B)."
        >
          <Button icon="layout-panel" onClick={() => postToHost({ type: 'toggleBookmarksBar' })}>
            Toggle
          </Button>
        </Row>
      </Section>
      <Section icon="shield" title="Privacy">
        <Row
          title="Clear browsing data"
          description="History, cookies, site data and cache are kept in this extension's own browser profile."
        >
          <Button
            variant="danger"
            icon="trash"
            onClick={() => postToHost({ type: 'clearBrowsingData' })}
          >
            Clear…
          </Button>
        </Row>
      </Section>
      <Section icon="info" title="About">
        <Row
          title="Browser engine"
          description={chromiumVersion ? `Chrome for Testing ${chromiumVersion}` : 'Not running'}
        >
          <Button icon="debug-restart" onClick={() => postToHost({ type: 'restartEngine' })}>
            Restart
          </Button>
        </Row>
      </Section>
    </PageLayout>
  );
}

function Section({ icon, title, children }: { icon: string; title: string; children: ReactNode }) {
  return (
    <section className="card settings-card" aria-label={title}>
      <header className="card-header">
        <span className={`codicon codicon-${icon}`} aria-hidden="true" />
        <h2 className="card-title">{title}</h2>
      </header>
      {children}
    </section>
  );
}

function Row({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="card-row">
      <div className="card-row-text">
        <div className="card-row-title">{title}</div>
        <div className="card-row-description">{description}</div>
      </div>
      {children}
    </div>
  );
}
