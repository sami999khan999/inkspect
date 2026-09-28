import { useState } from 'react';
import type { TabState } from '@shared/protocol';
import { tabContextMenu } from '../menus';
import { postToHost } from '../vscode';
import { withShortcut } from '../shortcuts';
import type { MenuItem } from './Menu';

const TAB_DRAG_TYPE = 'application/x-vscode-browser-tab';

interface TabStripProps {
  tabs: TabState[];
  activeTabId?: string;
  canReopenClosedTab: boolean;
  openMenu: (x: number, y: number, items: MenuItem[]) => void;
}

export function TabStrip({ tabs, activeTabId, canReopenClosedTab, openMenu }: TabStripProps) {
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const dropPosition = (event: React.DragEvent<HTMLElement>, index: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return event.clientX > rect.left + rect.width / 2 ? index + 1 : index;
  };

  return (
    <div
      className="tab-strip"
      role="tablist"
      aria-label="Tabs"
      onDragLeave={() => setDropIndex(null)}
    >
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tab"
          aria-selected={tab.id === activeTabId}
          tabIndex={tab.id === activeTabId ? 0 : -1}
          className={[
            'tab',
            tab.id === activeTabId && 'active',
            tab.pinned && 'pinned',
            dropIndex === index && 'drop-before',
            dropIndex === index + 1 && index === tabs.length - 1 && 'drop-after',
          ]
            .filter(Boolean)
            .join(' ')}
          title={tab.url && tab.url !== tab.title ? `${tab.title}\n${tab.url}` : tab.title}
          draggable
          onClick={() => postToHost({ type: 'tab', action: 'activate', tabId: tab.id })}
          onMouseDown={(event) => {
            if (event.button === 1) event.preventDefault();
          }}
          onAuxClick={(event) => {
            if (event.button !== 1) return;
            event.preventDefault();
            postToHost({ type: 'tab', action: 'close', tabId: tab.id });
          }}
          onContextMenu={(event) => {
            event.preventDefault();
            openMenu(
              event.clientX,
              event.clientY,
              tabContextMenu(tab, tabs.length, canReopenClosedTab),
            );
          }}
          onDragStart={(event) => {
            event.dataTransfer.setData(TAB_DRAG_TYPE, tab.id);
            event.dataTransfer.effectAllowed = 'move';
          }}
          onDragOver={(event) => {
            if (!event.dataTransfer.types.includes(TAB_DRAG_TYPE)) return;
            event.preventDefault();
            setDropIndex(dropPosition(event, index));
          }}
          onDrop={(event) => {
            const tabId = event.dataTransfer.getData(TAB_DRAG_TYPE);
            setDropIndex(null);
            if (tabId) postToHost({ type: 'moveTab', tabId, index: dropPosition(event, index) });
          }}
          onDragEnd={() => setDropIndex(null)}
        >
          <TabIcon tab={tab} />
          {!tab.pinned && <span className="tab-title">{tab.title || 'Untitled'}</span>}
          {tab.audible && (
            <span
              className="codicon codicon-unmute tab-audio"
              title="Playing audio"
              aria-label="Playing audio"
            />
          )}
          {!tab.pinned && (
            <button
              type="button"
              className="tab-close"
              aria-label={`Close ${tab.title}`}
              title={withShortcut('Close', 'tab.close')}
              onClick={(event) => {
                event.stopPropagation();
                postToHost({ type: 'tab', action: 'close', tabId: tab.id });
              }}
            >
              <span className="codicon codicon-close" aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        className="icon-button new-tab-button"
        title={withShortcut('New tab', 'tab.new')}
        aria-label="New tab"
        onClick={() => postToHost({ type: 'tab', action: 'new' })}
      >
        <span className="codicon codicon-add" aria-hidden="true" />
      </button>
    </div>
  );
}

function TabIcon({ tab }: { tab: TabState }) {
  const [failed, setFailed] = useState<string | undefined>();
  if (tab.private && !tab.loading) {
    return (
      <span
        className="codicon codicon-eye-closed tab-icon"
        title="Private tab"
        aria-hidden="true"
      />
    );
  }
  if (tab.loading)
    return (
      <span className="codicon codicon-loading codicon-modifier-spin tab-icon" aria-hidden="true" />
    );
  if (tab.crashed) return <span className="codicon codicon-error tab-icon" aria-hidden="true" />;
  if (tab.internalPage === 'newtab')
    return <span className="codicon codicon-window tab-icon" aria-hidden="true" />;
  if (tab.internalPage === 'history')
    return <span className="codicon codicon-history tab-icon" aria-hidden="true" />;
  if (tab.internalPage === 'bookmarks')
    return <span className="codicon codicon-bookmark tab-icon" aria-hidden="true" />;
  if (tab.internalPage === 'extensions')
    return <span className="codicon codicon-extensions tab-icon" aria-hidden="true" />;
  if (tab.internalPage === 'settings')
    return <span className="codicon codicon-settings-gear tab-icon" aria-hidden="true" />;
  if (tab.internalPage === 'downloads')
    return <span className="codicon codicon-cloud-download tab-icon" aria-hidden="true" />;
  if (tab.favicon && failed !== tab.favicon) {
    return (
      <img
        className="tab-icon favicon"
        src={tab.favicon}
        alt=""
        referrerPolicy="no-referrer"
        onError={() => setFailed(tab.favicon)}
      />
    );
  }
  return <span className="codicon codicon-globe tab-icon" aria-hidden="true" />;
}
