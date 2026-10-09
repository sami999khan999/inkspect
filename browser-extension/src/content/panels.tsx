import { useEffect, useState } from 'react';
import { CPU_RATES, NETWORK_CONDITIONS, type NetworkPreset } from '@inkspect/shared/devices';
import {
  formatConsoleErrors,
  formatFailedRequests,
  isFailedRequest,
  type ConsoleEntry,
  type NetworkEntry,
} from '@inkspect/shared/devtools';
import type { ShortcutMap, ShortcutOverrides } from '@inkspect/shared/shortcuts';
import { Button } from '@inkspect/shared/ui/Button';
import { ConfirmButton } from '@inkspect/shared/ui/ConfirmButton';
import { Field } from '@inkspect/shared/ui/Field';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { ShortcutList } from '@inkspect/shared/ui/ShortcutList';
import { ShortcutSearch } from '@inkspect/shared/ui/ShortcutSearch';
import { Segmented } from '@inkspect/shared/ui/Segmented';
import { Select } from '@inkspect/shared/ui/Select';
import { Switch } from '@inkspect/shared/ui/Switch';
import {
  toBackground,
  type BridgeStatus,
  type CaptureKind,
  type EmulationRequest,
} from '../messages';
import { SHORTCUT_ACTIONS } from '@inkspect/shared/shortcuts';
import {
  ALL_SCOPES,
  labelOf,
  resetAllShortcuts,
  scopeLabelOf,
  setShortcutKeys,
} from '../shortcuts';
import { PairCard } from '../ui/PairCard';
import { pageRequest } from './page';

interface PanelProps {
  onClose: () => void;
  toast: (message: string) => void;
}

function PanelFrame({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="panel" role="dialog" aria-label={title}>
      <div className="panel-head">
        <span>{title}</span>
        <button
          type="button"
          className="icon-button"
          aria-label="Close"
          title="Close"
          onClick={onClose}
        >
          <span className="codicon codicon-close" aria-hidden="true" />
        </button>
      </div>
      <div className="panel-body">{children}</div>
    </div>
  );
}

/** Emulation settings of the responsive view, besides the size (debugger, Chrome only). */
export interface EmulationOptions {
  network: NetworkPreset;
  cpu: number;
  colorScheme: EmulationRequest['colorScheme'];
  print: boolean;
  /** The device's user agent (sent with the frame's page request; no debugger). */
  agent: boolean;
  /** The device's touch input (needs the debugger). */
  touch: boolean;
}

export const DEFAULT_EMULATION_OPTIONS: EmulationOptions = {
  network: 'none',
  cpu: 1,
  colorScheme: 'default',
  print: false,
  agent: true,
  touch: false,
};

/** Emulation for the responsive view; changes apply at once. */
export function EmulationPanel({
  onClose,
  value,
  onChange,
}: {
  onClose: () => void;
  value: EmulationOptions;
  onChange: (value: EmulationOptions) => void;
}) {
  const canEmulate = __BROWSER__ === 'chrome';
  const set = (changes: Partial<EmulationOptions>) => onChange({ ...value, ...changes });
  return (
    <PanelFrame title="Emulation" onClose={onClose}>
      {!canEmulate && (
        <p className="note">These need Chrome, Edge or Brave. The size works everywhere.</p>
      )}
      <Switch checked={value.agent} disabled={!canEmulate} onChange={(agent) => set({ agent })}>
        Device user agent
      </Switch>
      <Switch checked={value.touch} disabled={!canEmulate} onChange={(touch) => set({ touch })}>
        Touch input
      </Switch>
      <div className="row">
        <Field label="Network">
          <Select
            size="sm"
            label="Network"
            disabled={!canEmulate}
            value={value.network}
            onChange={(network) => set({ network })}
            options={Object.entries(NETWORK_CONDITIONS).map(([id, preset]) => ({
              value: id as NetworkPreset,
              label: preset.label,
            }))}
          />
        </Field>
        <Field label="CPU">
          <Select
            size="sm"
            label="CPU"
            disabled={!canEmulate}
            value={String(value.cpu)}
            onChange={(cpu) => set({ cpu: Number(cpu) })}
            options={CPU_RATES.map((rate) => ({
              value: String(rate),
              label: rate === 1 ? 'Normal' : `${rate}× slower`,
            }))}
          />
        </Field>
      </div>
      <Field label="Color scheme">
        <Segmented
          size="sm"
          label="Color scheme"
          value={value.colorScheme}
          onChange={(colorScheme) => canEmulate && set({ colorScheme })}
          options={[
            { value: 'default', label: 'Page default' },
            { value: 'light', label: 'Light', icon: 'color-mode' },
            { value: 'dark', label: 'Dark', icon: 'color-mode' },
          ]}
        />
      </Field>
      <Switch checked={value.print} disabled={!canEmulate} onChange={(print) => set({ print })}>
        Print media
      </Switch>
      {canEmulate && (
        <p className="note">
          Chrome shows a “started debugging this browser” bar while touch, network, CPU, color
          scheme or print media is on. The user agent doesn&apos;t need it.
        </p>
      )}
    </PanelFrame>
  );
}

interface ConsolePanelProps extends PanelProps {
  /** Copies, saves and offers it in the send dialog, like every capture. */
  copy: (text: string, what: string, kind?: CaptureKind) => void;
  pageContext: () => Promise<string>;
}

const LEVEL_ICONS: Record<string, string> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  debug: 'debug',
  log: 'circle-small',
};

/**
 * The page's console and failed requests. Each copy is saved and offered in the send dialog, like
 * any capture.
 */
export function ConsolePanel({ onClose, copy, pageContext }: ConsolePanelProps) {
  const [logs, setLogs] = useState<{ console: ConsoleEntry[]; network: NetworkEntry[] }>({
    console: [],
    network: [],
  });
  const [view, setView] = useState<'console' | 'network'>('console');
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const result = await pageRequest<{ console: ConsoleEntry[]; network: NetworkEntry[] }>({
        kind: 'logs',
      });
      if (alive && result) setLogs(result);
    };
    void refresh();
    const timer = setInterval(() => void refresh(), 1000);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, []);
  /** Copies use the page's log as it is now, not the last refresh. */
  const fresh = async () =>
    (await pageRequest<{ console: ConsoleEntry[]; network: NetworkEntry[] }>({ kind: 'logs' })) ??
    logs;
  const errors = logs.console.filter((e) => e.level === 'error');
  const failed = logs.network.filter(isFailedRequest);
  const shown = view === 'console' ? logs.console.slice(-200).reverse() : [];
  const empty = view === 'console' ? !shown.length : !failed.length;
  return (
    <PanelFrame title="Console and network" onClose={onClose}>
      <div className="console-tabs">
        <Segmented
          size="sm"
          label="Show"
          className="console-view"
          value={view}
          onChange={setView}
          options={[
            {
              value: 'console',
              label: 'Console',
              icon: 'terminal',
              count: errors.length || undefined,
              tone: errors.length ? 'error' : undefined,
            },
            {
              value: 'network',
              label: 'Failed requests',
              icon: 'globe',
              count: failed.length || undefined,
              tone: failed.length ? 'error' : undefined,
            },
          ]}
        />
        <IconButton
          icon="clear-all"
          label="Clear"
          onClick={() =>
            void pageRequest({ kind: 'clearLogs' }).then(() =>
              setLogs({ console: [], network: [] }),
            )
          }
        />
      </div>
      <div className="log">
        {view === 'console'
          ? shown.map((entry) => (
              <div key={entry.id} className={`log-row level-${entry.level}`}>
                <span
                  className={`log-icon codicon codicon-${LEVEL_ICONS[entry.level] ?? 'circle-small'}`}
                  aria-hidden="true"
                />
                <span className="log-text">{entry.text}</span>
                {entry.url && (
                  <span className="log-source" title={entry.url}>
                    {sourceName(entry.url)}
                    {entry.line !== undefined ? `:${entry.line + 1}` : ''}
                  </span>
                )}
              </div>
            ))
          : failed.map((request) => (
              <div key={request.id} className="log-row level-error" title={request.url}>
                <span className="log-icon codicon codicon-error" aria-hidden="true" />
                <span className="log-text">
                  {request.method} {request.url}
                </span>
                <span className="log-source">{request.error ?? request.status}</span>
              </div>
            ))}
        {empty && (
          <div className="log-empty">
            <span className="codicon codicon-check-all" aria-hidden="true" />
            <strong>{view === 'console' ? 'No console messages yet' : 'No failed requests'}</strong>
            <span>They are recorded while the toolbar is open on this page.</span>
          </div>
        )}
      </div>

      <div className="panel-group">
        <span className="panel-group-title">Copy for AI</span>
        <div className="button-row wrap">
          <Button
            size="sm"
            icon="copy"
            title="Copy console errors for AI"
            aria-label="Copy console errors for AI"
            onClick={() =>
              void fresh().then((l) =>
                copy(formatConsoleErrors(l.console, location.href), 'Console errors', 'errors'),
              )
            }
          >
            Console errors
          </Button>
          <Button
            size="sm"
            icon="copy"
            title="Copy failed requests for AI"
            aria-label="Copy failed requests for AI"
            onClick={() =>
              void fresh().then((l) =>
                copy(formatFailedRequests(l.network, location.href), 'Failed requests', 'network'),
              )
            }
          >
            Failed requests
          </Button>
          <Button
            size="sm"
            icon="copy"
            title="Copy page context for AI"
            aria-label="Copy page context for AI"
            onClick={() => void pageContext().then((text) => copy(text, 'Page context', 'page'))}
          >
            Page context
          </Button>
        </div>
      </div>
    </PanelFrame>
  );
}

export function LinkPanel({ onClose, status }: PanelProps & { status: BridgeStatus }) {
  return (
    <PanelFrame title="VS Code link" onClose={onClose}>
      {status.state === 'connected' ? (
        <p className="status status-connected">
          Linked with {status.peer ?? 'VS Code'}
          {status.via === 'hub' ? ' through the browser helper' : ''}. Captures are saved into your
          projects and offered to send; bookmarks sync both ways.
        </p>
      ) : (
        <PairCard
          compact
          status={status}
          pair={(code) =>
            toBackground({ type: 'pair', code }).then((reply) =>
              reply.ok ? reply.status : { ...status, error: reply.error },
            )
          }
        />
      )}
      <div className="button-row">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => void toBackground({ type: 'openOptions' })}
        >
          Settings
        </Button>
      </div>
    </PanelFrame>
  );
}

/**
 * Every keyboard shortcut, the toolbar's and VS Code Browser's (one key map): a change here
 * reaches VS Code through the link (and VS Code's changes arrive here), and follows the browser
 * account.
 */
export function ShortcutsPanel({
  onClose,
  map,
  overrides,
  linked,
}: {
  onClose: () => void;
  map: ShortcutMap;
  overrides: ShortcutOverrides;
  linked: boolean;
}) {
  const [query, setQuery] = useState('');
  const changed = Object.keys(overrides).length;
  return (
    <PanelFrame title="Keyboard shortcuts" onClose={onClose}>
      <div className="shortcuts-bar">
        <ShortcutSearch size="sm" value={query} onChange={setQuery} />
        {/* Shared with VS Code: a reset there too, so it takes a second click. */}
        <ConfirmButton
          icon="discard"
          confirmLabel="Click again to reset"
          title="Reset all shortcuts (here and in VS Code)"
          disabled={!changed}
          onConfirm={() => void resetAllShortcuts()}
        >
          Reset all
        </ConfirmButton>
      </div>
      <p className="note shortcuts-sync">
        <span className={`codicon codicon-${linked ? 'sync' : 'cloud'}`} aria-hidden="true" />
        {linked
          ? 'Shared with VS Code: changes here apply there too, and the other way round.'
          : 'Saved to your browser account. They sync with VS Code once it is linked.'}
      </p>
      <ShortcutList
        actions={SHORTCUT_ACTIONS}
        scopes={ALL_SCOPES}
        map={map}
        overrides={overrides}
        query={query}
        labelOf={labelOf}
        scopeLabel={scopeLabelOf}
        onSetKeys={(id, keys) => void setShortcutKeys(overrides, id, keys)}
        onReset={(id) => void setShortcutKeys(overrides, id, undefined)}
      />
    </PanelFrame>
  );
}

/** A script's file name for the console (`%5Broot%5D.js` reads as `[root].js`). */
function sourceName(url: string): string {
  const name = url.split(/[?#]/)[0]!.split('/').pop() || url;
  try {
    return decodeURIComponent(name);
  } catch {
    return name;
  }
}
