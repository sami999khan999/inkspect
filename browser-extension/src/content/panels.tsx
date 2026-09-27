import { useEffect, useState } from 'react';
import {
  CPU_RATES,
  DEVICE_PRESETS,
  DPR_OPTIONS,
  NETWORK_CONDITIONS,
  presetToDevice,
  type DeviceSettings,
  type NetworkPreset,
} from '@inkspect/shared/devices';
import {
  formatConsoleErrors,
  formatFailedRequests,
  isFailedRequest,
  type ConsoleEntry,
  type NetworkEntry,
} from '@inkspect/shared/devtools';
import {
  toBackground,
  type BridgeStatus,
  type EmulationRequest,
  type SendTarget,
} from '../messages';
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

const GROUPS = ['Phones', 'Tablets', 'Desktops'] as const;

export function DevicePanel({ onClose, toast }: PanelProps) {
  const canEmulate = __BROWSER__ === 'chrome';
  const [mode, setMode] = useState<'emulate' | 'window'>(canEmulate ? 'emulate' : 'window');
  const [device, setDevice] = useState<DeviceSettings>(presetToDevice(DEVICE_PRESETS[0]!));
  const [network, setNetwork] = useState<NetworkPreset>('none');
  const [cpu, setCpu] = useState(1);
  const [colorScheme, setColorScheme] = useState<EmulationRequest['colorScheme']>('default');
  const [print, setPrint] = useState(false);

  const apply = async () => {
    const reply =
      mode === 'emulate'
        ? await toBackground({
            type: 'emulate',
            request: { device, network, cpu, colorScheme, print },
          })
        : await toBackground({ type: 'windowMode', width: device.width, height: device.height });
    if (!reply.ok) toast(reply.error);
  };
  const reset = async () => {
    const reply =
      mode === 'emulate'
        ? await toBackground({
            type: 'emulate',
            request: { network: 'none', cpu: 1, colorScheme: 'default', print: false },
          })
        : await toBackground({ type: 'restoreWindow' });
    if (!reply.ok) toast(reply.error);
  };

  return (
    <PanelFrame title="Devices and resolutions" onClose={onClose}>
      <div className="segmented" role="radiogroup" aria-label="Mode">
        <button
          type="button"
          className={mode === 'emulate' ? 'active' : ''}
          disabled={!canEmulate}
          title={
            canEmulate
              ? 'Size, pixel ratio, touch, throttling (Chrome shows a debugging bar)'
              : 'Needs Chrome, Edge or Brave'
          }
          onClick={() => setMode('emulate')}
        >
          Full emulation
        </button>
        <button
          type="button"
          className={mode === 'window' ? 'active' : ''}
          onClick={() => setMode('window')}
        >
          Resize window
        </button>
      </div>
      <label className="field">
        <span>Device</span>
        <select
          value={device.presetId ?? 'custom'}
          onChange={(event) => {
            const preset = DEVICE_PRESETS.find((p) => p.id === event.target.value);
            if (preset) setDevice(presetToDevice(preset));
          }}
        >
          <option value="custom">Custom size</option>
          {GROUPS.map((group) => (
            <optgroup key={group} label={group}>
              {DEVICE_PRESETS.filter((p) => p.group === group).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.width}×{p.height})
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>
      <div className="row">
        <label className="field small">
          <span>Width</span>
          <input
            type="number"
            min={50}
            max={7680}
            value={device.width}
            onChange={(e) =>
              setDevice({ ...device, presetId: undefined, width: Number(e.target.value) || 50 })
            }
          />
        </label>
        <label className="field small">
          <span>Height</span>
          <input
            type="number"
            min={50}
            max={7680}
            value={device.height}
            onChange={(e) =>
              setDevice({ ...device, presetId: undefined, height: Number(e.target.value) || 50 })
            }
          />
        </label>
        <button
          type="button"
          className="icon-button"
          title="Rotate"
          aria-label="Rotate"
          onClick={() => setDevice({ ...device, width: device.height, height: device.width })}
        >
          <span className="codicon codicon-sync" aria-hidden="true" />
        </button>
      </div>
      {mode === 'emulate' && (
        <>
          <div className="row">
            <label className="field small">
              <span>Pixel ratio</span>
              <select
                value={device.dpr}
                onChange={(e) => setDevice({ ...device, dpr: Number(e.target.value) })}
              >
                {DPR_OPTIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}x
                  </option>
                ))}
              </select>
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={device.touch}
                onChange={(e) =>
                  setDevice({ ...device, touch: e.target.checked, mobile: e.target.checked })
                }
              />
              Touch and mobile
            </label>
          </div>
          <div className="row">
            <label className="field small">
              <span>Network</span>
              <select value={network} onChange={(e) => setNetwork(e.target.value as NetworkPreset)}>
                {Object.entries(NETWORK_CONDITIONS).map(([id, preset]) => (
                  <option key={id} value={id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="field small">
              <span>CPU</span>
              <select value={cpu} onChange={(e) => setCpu(Number(e.target.value))}>
                {CPU_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate === 1 ? 'Normal' : `${rate}× slower`}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="row">
            <label className="field small">
              <span>Color scheme</span>
              <select
                value={colorScheme}
                onChange={(e) => setColorScheme(e.target.value as EmulationRequest['colorScheme'])}
              >
                <option value="default">Page default</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </label>
            <label className="check">
              <input type="checkbox" checked={print} onChange={(e) => setPrint(e.target.checked)} />
              Print media
            </label>
          </div>
          <p className="note">
            Chrome shows a “started debugging this browser” bar while emulating.
          </p>
        </>
      )}
      <div className="button-row">
        <button type="button" className="button secondary small" onClick={() => void reset()}>
          {mode === 'emulate' ? 'Stop emulating' : 'Restore window'}
        </button>
        <button type="button" className="button primary small" onClick={() => void apply()}>
          Apply
        </button>
      </div>
    </PanelFrame>
  );
}

interface ConsolePanelProps extends PanelProps {
  copy: (text: string, what: string) => void;
  send: (target: SendTarget, payload: { text: string; label: string }) => void;
  linked: boolean;
  pageContext: () => Promise<string>;
}

export function ConsolePanel({ onClose, copy, send, linked, pageContext }: ConsolePanelProps) {
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
  return (
    <PanelFrame title="Console and network" onClose={onClose}>
      <div className="segmented">
        <button
          type="button"
          className={view === 'console' ? 'active' : ''}
          onClick={() => setView('console')}
        >
          Console {errors.length > 0 && <span className="count">{errors.length}</span>}
        </button>
        <button
          type="button"
          className={view === 'network' ? 'active' : ''}
          onClick={() => setView('network')}
        >
          Failed requests {failed.length > 0 && <span className="count">{failed.length}</span>}
        </button>
      </div>
      <div className="log">
        {view === 'console'
          ? shown.map((entry) => (
              <div key={entry.id} className={`log-row level-${entry.level}`}>
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
                <span className="log-text">
                  {request.method} {request.url}
                </span>
                <span className="log-source">{request.error ?? request.status}</span>
              </div>
            ))}
        {((view === 'console' && !shown.length) || (view === 'network' && !failed.length)) && (
          <p className="note">
            {view === 'console' ? 'No console messages yet.' : 'No failed requests.'} Messages are
            recorded while the toolbar is open on this page.
          </p>
        )}
      </div>
      <div className="button-row wrap">
        <button
          type="button"
          className="button secondary small"
          onClick={() =>
            void fresh().then((l) =>
              copy(formatConsoleErrors(l.console, location.href), 'Console errors'),
            )
          }
        >
          Copy errors
        </button>
        <button
          type="button"
          className="button secondary small"
          onClick={() =>
            void fresh().then((l) =>
              copy(formatFailedRequests(l.network, location.href), 'Failed requests'),
            )
          }
        >
          Copy failed requests
        </button>
        <button
          type="button"
          className="button primary small"
          onClick={() => void pageContext().then((text) => copy(text, 'Page context'))}
        >
          Copy page context
        </button>
        {linked && (
          <button
            type="button"
            className="button secondary small"
            onClick={() =>
              void pageContext().then((text) => send('chat', { text, label: 'Page context' }))
            }
          >
            Send to chat
          </button>
        )}
        <button
          type="button"
          className="icon-button"
          title="Clear"
          aria-label="Clear"
          onClick={() =>
            void pageRequest({ kind: 'clearLogs' }).then(() =>
              setLogs({ console: [], network: [] }),
            )
          }
        >
          <span className="codicon codicon-clear-all" aria-hidden="true" />
        </button>
      </div>
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
      {status.state !== 'connected' && (
        <>
          <p className="note">
            In VS Code run <b>Browser: Connect Browser Extension</b>, then type the 6-digit code
            here.
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
