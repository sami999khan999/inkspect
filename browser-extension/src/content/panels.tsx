import { useEffect, useState } from 'react';
import { CPU_RATES, NETWORK_CONDITIONS, type NetworkPreset } from '@inkspect/shared/devices';
import {
  formatConsoleErrors,
  formatFailedRequests,
  isFailedRequest,
  type ConsoleEntry,
  type NetworkEntry,
} from '@inkspect/shared/devtools';
import type { VsCodeWindow } from '@inkspect/shared/bridge';
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
  type SendTarget,
} from '../messages';
import { SHORTCUT_ACTIONS } from '@inkspect/shared/shortcuts';
import {
  ALL_SCOPES,
  labelOf,
  resetAllShortcuts,
  scopeLabelOf,
  setShortcutKeys,
} from '../shortcuts';
import { pageRequest } from './page';
import { LAST_USED, WindowPicker } from './WindowPicker';

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
  /** The device's user agent and touch. */
  agent: boolean;
}

export const DEFAULT_EMULATION_OPTIONS: EmulationOptions = {
  network: 'none',
  cpu: 1,
  colorScheme: 'default',
  print: false,
  agent: true,
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
        Device user agent and touch
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
          Chrome shows a “started debugging this browser” bar while any of these are on.
        </p>
      )}
    </PanelFrame>
  );
}

interface ConsolePanelProps extends PanelProps {
  copy: (text: string, what: string, kind?: CaptureKind) => void;
  /** `picked`: the window chosen in the panel (the picker's value). */
  send: (target: SendTarget, payload: { text: string; label: string }, picked?: string) => void;
  linked: boolean;
  windows: readonly VsCodeWindow[];
  pageContext: () => Promise<string>;
}

const LEVEL_ICONS: Record<string, string> = {
  error: 'error',
  warning: 'warning',
  info: 'info',
  debug: 'debug',
  log: 'circle-small',
};

/** The page's console and failed requests, to copy for an AI chat or send to VS Code. */
export function ConsolePanel({
  onClose,
  copy,
  send,
  linked,
  windows,
  pageContext,
}: ConsolePanelProps) {
  const [logs, setLogs] = useState<{ console: ConsoleEntry[]; network: NetworkEntry[] }>({
    console: [],
    network: [],
  });
  const [view, setView] = useState<'console' | 'network'>('console');
  const [target, setTarget] = useState(LAST_USED);
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
  const sendContext = (to: SendTarget) =>
    void pageContext().then((text) => send(to, { text, label: 'Page context' }, target));
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
                    {entry.url.split('/').pop()}
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
            onClick={() =>
              void fresh().then((l) =>
                copy(formatConsoleErrors(l.console, location.href), 'Console errors', 'errors'),
              )
            }
          >
            Copy errors
          </Button>
          <Button
            size="sm"
            icon="copy"
            onClick={() =>
              void fresh().then((l) =>
                copy(formatFailedRequests(l.network, location.href), 'Failed requests', 'network'),
              )
            }
          >
            Copy failed requests
          </Button>
          <Button
            size="sm"
            icon="copy"
            onClick={() => void pageContext().then((text) => copy(text, 'Page context', 'page'))}
          >
            Copy page context
          </Button>
        </div>
      </div>

      {linked && (
        <div className="panel-group">
          <span className="panel-group-title">Send page context to VS Code</span>
          <WindowPicker windows={windows} value={target} onChange={setTarget} />
          <div className="button-row wrap">
            <Button
              size="sm"
              variant="primary"
              icon="terminal"
              onClick={() => sendContext('terminal')}
            >
              Send to terminal
            </Button>
            <Button size="sm" icon="comment-discussion" onClick={() => sendContext('chat')}>
              Send to chat
            </Button>
          </div>
        </div>
      )}
    </PanelFrame>
  );
}

export function LinkPanel({ onClose, status }: PanelProps & { status: BridgeStatus }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const pair = async () => {
    setBusy(true);
    const reply = await toBackground({ type: 'pair', code });
    setBusy(false);
    setError(reply.ok ? reply.status?.error : reply.error);
  };
  return (
    <PanelFrame title="VS Code link" onClose={onClose}>
      <p className={`status status-${status.state}`}>
        {status.state === 'connected'
          ? `Linked with ${status.peer ?? 'VS Code'}. Bookmarks sync both ways, and screenshots can go to VS Code.`
          : status.state === 'unpaired'
            ? 'VS Code is running but this browser is not paired yet.'
            : status.state === 'connecting'
              ? 'Connecting to VS Code…'
              : 'VS Code is not reachable. Start VS Code with the VS Code Browser extension (its link is on by default).'}
      </p>
      {status.state === 'unpaired' && (
        <>
          <p className="note">
            In VS Code, click <b>Pair Browser Extension</b> in the Browser side panel: that links
            this browser, no code needed. Or type a code from{' '}
            <b>Browser: Pair Browser Extension with a Code</b> here.
          </p>
          <div className="row">
            <input
              className="code-input"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              aria-label="Pairing code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter' && code.length === 6) void pair();
              }}
            />
            <button
              type="button"
              className="button primary small"
              disabled={code.length !== 6 || busy}
              onClick={() => void pair()}
            >
              Pair
            </button>
          </div>
        </>
      )}
      {error && <p className="note error">{error}</p>}
      <div className="button-row">
        <button
          type="button"
          className="button secondary small"
          onClick={() => void toBackground({ type: 'openOptions' })}
        >
          Settings
        </button>
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
