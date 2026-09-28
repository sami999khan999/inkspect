import type { ReactNode } from 'react';

interface PageLayoutProps {
  name: string;
  /** Codicon name. */
  icon: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  /** Shown under the header, full width (a search field...). */
  toolbar?: ReactNode;
  children: ReactNode;
}

/** The frame every vb:// page shares: header, optional toolbar, then content. */
export function PageLayout({
  name,
  icon,
  title,
  description,
  actions,
  toolbar,
  children,
}: PageLayoutProps) {
  return (
    <div className={`internal-page ${name}-page`}>
      <div className="internal-page-inner">
        <header className="page-header">
          <span className="page-icon" aria-hidden="true">
            <span className={`codicon codicon-${icon}`} />
          </span>
          <div className="page-heading">
            <h1>{title}</h1>
            {description && <p className="page-description">{description}</p>}
          </div>
          {actions && <div className="header-actions">{actions}</div>}
        </header>
        {toolbar && <div className="page-toolbar">{toolbar}</div>}
        {children}
      </div>
    </div>
  );
}

/** A friendly message where a list is empty. */
export function EmptyState({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className={`codicon codicon-${icon}`} aria-hidden="true" />
      <p className="empty-title">{title}</p>
      {children && <p className="empty-text">{children}</p>}
    </div>
  );
}

/** A round site badge: the favicon when there is one, else the site's first letter. */
export function SiteIcon({ url, favicon }: { url: string; favicon?: string }) {
  if (favicon) {
    return <img className="site-icon" src={favicon} alt="" referrerPolicy="no-referrer" />;
  }
  let letter = '';
  try {
    letter = new URL(url).hostname
      .replace(/^www\./, '')
      .charAt(0)
      .toUpperCase();
  } catch {
    // Not a URL; fall back to the globe.
  }
  return letter ? (
    <span className="site-icon letter" aria-hidden="true">
      {letter}
    </span>
  ) : (
    <span className="site-icon codicon codicon-globe" aria-hidden="true" />
  );
}
