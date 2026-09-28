import type { ReactNode } from 'react';

interface StatusPanelProps {
  /** Codicon name. */
  icon: string;
  tone?: 'neutral' | 'danger' | 'accent';
  spin?: boolean;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}

/** The centred panel shown over the page area for engine states and crashed pages. */
export function StatusPanel({
  icon,
  tone = 'neutral',
  spin,
  title,
  children,
  actions,
}: StatusPanelProps) {
  return (
    <div className="overlay status-overlay">
      <div className="status-panel" role="status">
        <span className={`status-icon tone-${tone}`} aria-hidden="true">
          <span className={`codicon codicon-${icon}${spin ? ' codicon-modifier-spin' : ''}`} />
        </span>
        <h2 className="status-title">{title}</h2>
        {children}
        {actions && <div className="status-actions">{actions}</div>}
      </div>
    </div>
  );
}
