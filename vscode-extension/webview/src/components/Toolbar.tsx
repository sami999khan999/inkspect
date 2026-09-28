import type { Suggestion } from '@shared/history';
import type { DownloadInfo, ExtensionInfo, TabState } from '@shared/protocol';
import { withShortcut } from '../shortcuts';
import { mainMenu } from '../menus';
import { postToHost } from '../vscode';
import { DownloadsPopover } from './DownloadsPopover';
import { IconButton } from './IconButton';
import type { MenuItem } from './Menu';
import { Omnibox } from './Omnibox';

interface ToolbarProps {
  tab: TabState | undefined;
  suggestions: { query: string; items: Suggestion[] };
  onStar: (anchor: DOMRect) => void;
  canReopenClosedTab: boolean;
  downloads: DownloadInfo[];
  downloadsOpen: boolean;
  setDownloadsOpen: (open: boolean) => void;
  omniboxFocus: number;
  focusViewport: () => void;
  toggleDeviceToolbar: () => void;
  /** Element picker purpose when it is on. */
  tool: 'copy' | 'screenshot' | null;
  onToggleInspect: () => void;
  drawing: boolean;
  onToggleDraw: () => void;
  devOpen: boolean;
  onToggleDev: () => void;
  extensions: ExtensionInfo[];
  /** Opens an extension's popup under its toolbar button. */
  onExtension: (id: string, anchor: DOMRect) => void;
  onScreenshotMenu: (x: number, y: number) => void;
  /** Opens the tools menu (measure, eyedropper, CSS tweak, accessibility, overlay, record). */
  onToolsMenu: (x: number, y: number) => void;
  /** One of those tools is on. */
  toolsActive: boolean;
  openMenu: (x: number, y: number, items: MenuItem[]) => void;
  /** Right-click on Back/Forward: ask the host for the history list. */
  requestHistory: (direction: 'back' | 'forward', x: number, y: number) => void;
}

export function Toolbar(props: ToolbarProps) {
  const { tab, downloads } = props;
  const action = (name: Parameters<typeof tabAction>[0]) => () => tabAction(name, tab?.id);
  const zoom = Math.round((tab?.zoom ?? 1) * 100);
  const downloading = downloads.some((d) => d.state === 'inProgress');

  const historyButton = (direction: 'back' | 'forward') => (event: React.MouseEvent) => {
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    props.requestHistory(direction, rect.left, rect.bottom + 2);
  };

  return (
    <div className="toolbar" role="toolbar" aria-label="Browser toolbar">
      <IconButton
        icon="arrow-left"
        label={`${withShortcut('Back', 'nav.back')}, right-click for history`}
        disabled={!tab?.canGoBack}
        onClick={action('back')}
        onContextMenu={historyButton('back')}
      />
      <IconButton
        icon="arrow-right"
        label={`${withShortcut('Forward', 'nav.forward')}, right-click for history`}
        disabled={!tab?.canGoForward}
        onClick={action('forward')}
        onContextMenu={historyButton('forward')}
      />
      {tab?.loading ? (
        <IconButton icon="close" label="Stop loading" onClick={action('stop')} />
      ) : (
        <IconButton
          icon="refresh"
          label={withShortcut('Reload', 'nav.reload')}
          disabled={!tab || !!tab.internalPage}
          onClick={action('reload')}
        />
      )}
      <IconButton icon="home" label="Home" className="optional" onClick={action('home')} />
      <Omnibox
        tab={tab}
        focusSignal={props.omniboxFocus}
        suggestions={props.suggestions}
        onStar={props.onStar}
        onDone={props.focusViewport}
      />
      {zoom !== 100 && (
        <button
          type="button"
          className="zoom-badge"
          title="Reset zoom"
          onClick={action('zoomReset')}
        >
          {zoom}%
        </button>
      )}
      {downloads.length > 0 && (
        <div className="popover-anchor">
          <IconButton
            icon={downloading ? 'loading' : 'cloud-download'}
            spin={downloading}
            label="Downloads"
            active={props.downloadsOpen}
            onClick={() => props.setDownloadsOpen(!props.downloadsOpen)}
          />
          {props.downloadsOpen && (
            <DownloadsPopover downloads={downloads} onClose={() => props.setDownloadsOpen(false)} />
          )}
        </div>
      )}
      {/* Tools for later phases; hidden when the browser is narrow. */}
      <div className="toolbar-tools">
        <div className="toolbar-separator" />
        <IconButton
          icon="inspect"
          label={withShortcut('Select an element to copy its details for AI', 'mode.inspect')}
          active={props.tool !== null}
          disabled={!tab || !!tab.internalPage}
          onClick={props.onToggleInspect}
        />
        <IconButton
          icon="edit"
          label={withShortcut('Draw on the page', 'mode.draw')}
          active={props.drawing}
          disabled={!tab || !!tab.internalPage}
          onClick={props.onToggleDraw}
        />
        <IconButton
          icon="device-camera"
          label={withShortcut('Screenshot', 'mode.screenshot')}
          disabled={!tab || !!tab.internalPage}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            props.onScreenshotMenu(rect.left, rect.bottom + 2);
          }}
        />
        <IconButton
          icon="debug-console"
          label={withShortcut('Console and network (copy errors for AI)', 'mode.devtools')}
          active={props.devOpen}
          disabled={!tab || !!tab.internalPage}
          onClick={props.onToggleDev}
        />
        <IconButton
          icon="tools"
          label="More tools: measure, eyedropper, CSS tweak, accessibility, overlay, record"
          active={props.toolsActive}
          disabled={!tab || !!tab.internalPage}
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            props.onToolsMenu(rect.left, rect.bottom + 2);
          }}
        />
        <IconButton
          icon="device-mobile"
          label={withShortcut('Devices, screen sizes and throttling', 'mode.device')}
          active={!!tab?.emulation.enabled}
          disabled={!tab || !!tab.internalPage}
          onClick={props.toggleDeviceToolbar}
        />
        {props.extensions
          .filter((ext) => ext.enabled && ext.pinned)
          .map((ext) => (
            <button
              key={ext.id}
              type="button"
              className="icon-button extension-button"
              title={ext.name}
              aria-label={ext.name}
              onClick={(event) =>
                props.onExtension(ext.id, event.currentTarget.getBoundingClientRect())
              }
            >
              {ext.icon ? (
                <img src={ext.icon} alt="" />
              ) : (
                <span className="codicon codicon-extensions" aria-hidden="true" />
              )}
            </button>
          ))}
        <IconButton
          icon="extensions"
          label="Extensions"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            props.openMenu(rect.right - 260, rect.bottom + 2, [
              ...props.extensions
                .filter((ext) => ext.enabled)
                .map((ext) => ({
                  label: ext.name,
                  icon: ext.pinned ? 'pinned' : 'extensions',
                  onSelect: () => props.onExtension(ext.id, rect),
                })),
              ...(props.extensions.some((ext) => ext.enabled)
                ? [{ separator: true as const }]
                : []),
              {
                label: 'Manage extensions',
                icon: 'settings-gear',
                onSelect: () =>
                  postToHost({ type: 'navigate', input: 'vb://extensions', newTab: true }),
              },
            ]);
          }}
        />
      </div>
      <IconButton
        icon="kebab-vertical"
        label="Menu"
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          props.openMenu(
            rect.right - 240,
            rect.bottom + 2,
            mainMenu(tab, props.canReopenClosedTab),
          );
        }}
      />
    </div>
  );
}

function tabAction(
  action: 'back' | 'forward' | 'stop' | 'reload' | 'home' | 'zoomReset',
  tabId?: string,
) {
  postToHost({ type: 'tab', action, tabId });
}
