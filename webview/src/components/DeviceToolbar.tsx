import { useState } from 'react';
import {
  CPU_RATES,
  DEVICE_PRESETS,
  DPR_OPTIONS,
  NETWORK_CONDITIONS,
  presetToDevice,
  rotate,
  SCALE_OPTIONS,
  type DevicePreset,
  type DeviceSettings,
  type EmulationSettings,
  type NetworkPreset,
} from '@shared/devices';
import type { TabState } from '@shared/protocol';
import { postToHost } from '../vscode';

interface DeviceToolbarProps {
  tab: TabState;
  custom: DevicePreset[];
  /** Size of the page area, shown in responsive mode. */
  available: { width: number; height: number };
}

const GROUPS: DevicePreset['group'][] = ['Phones', 'Tablets', 'Desktops'];

/** Second toolbar row with device, size, pixel ratio, scale, throttling and media controls. */
export function DeviceToolbar({ tab, custom, available }: DeviceToolbarProps) {
  const emulation = tab.emulation;
  const device = emulation.device;
  const presets = [...DEVICE_PRESETS, ...custom];
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');

  const update = (changes: Partial<EmulationSettings>) =>
    postToHost({
      type: 'emulation',
      tabId: tab.id,
      settings: { ...emulation, enabled: true, ...changes },
    });
  const updateDevice = (changes: Partial<DeviceSettings>) => {
    const base: DeviceSettings = device ?? {
      width: Math.round(available.width) || 400,
      height: Math.round(available.height) || 800,
      dpr: 1,
      mobile: false,
      touch: false,
      userAgent: 'desktop',
    };
    update({ device: { ...base, presetId: undefined, ...changes } });
  };

  const selected = device ? (device.presetId ?? 'custom') : 'responsive';

  return (
    <div className="device-toolbar" role="toolbar" aria-label="Device emulation">
      <select
        value={selected}
        aria-label="Device"
        onChange={(event) => {
          const value = event.target.value;
          if (value === 'responsive') update({ device: undefined });
          else if (value !== 'custom') {
            const preset = presets.find((p) => p.id === value);
            if (preset) update({ device: presetToDevice(preset) });
          }
        }}
      >
        <option value="responsive">Responsive</option>
        {selected === 'custom' && <option value="custom">Custom size</option>}
        {[...GROUPS, 'Custom' as const].map((group) => {
          const items = presets.filter((p) => p.group === group);
          return items.length ? (
            <optgroup key={group} label={group}>
              {items.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </optgroup>
          ) : null;
        })}
      </select>
      <input
        type="number"
        min={50}
        max={7680}
        aria-label="Width"
        className="size-input"
        value={device?.width ?? Math.round(available.width)}
        onChange={(event) => updateDevice({ width: Number(event.target.value) || 50 })}
      />
      <span className="muted">×</span>
      <input
        type="number"
        min={50}
        max={7680}
        aria-label="Height"
        className="size-input"
        value={device?.height ?? Math.round(available.height)}
        onChange={(event) => updateDevice({ height: Number(event.target.value) || 50 })}
      />
      <select
        aria-label="Device pixel ratio"
        title="Device pixel ratio"
        value={device?.dpr ?? ''}
        disabled={!device}
        onChange={(event) => updateDevice({ dpr: Number(event.target.value) })}
      >
        {!device && <option value="">DPR</option>}
        {DPR_OPTIONS.map((dpr) => (
          <option key={dpr} value={dpr}>
            {dpr}x
          </option>
        ))}
      </select>
      <button
        type="button"
        className="icon-button"
        title="Rotate"
        aria-label="Rotate"
        disabled={!device}
        onClick={() => device && update({ device: rotate(device) })}
      >
        <span className="codicon codicon-sync" aria-hidden="true" />
      </button>
      <button
        type="button"
        className={`icon-button${device?.touch ? ' active' : ''}`}
        title="Touch and mobile viewport"
        aria-label="Touch and mobile viewport"
        aria-pressed={!!device?.touch}
        disabled={!device}
        onClick={() =>
          device && updateDevice({ ...device, touch: !device.touch, mobile: !device.touch })
        }
      >
        <span className="codicon codicon-hubot" aria-hidden="true" />
      </button>
      <select
        aria-label="Zoom"
        title="Zoom"
        value={String(emulation.scale)}
        disabled={!device}
        onChange={(event) =>
          update({ scale: event.target.value === 'fit' ? 'fit' : Number(event.target.value) })
        }
      >
        {SCALE_OPTIONS.map((scale) => (
          <option key={scale} value={String(scale)}>
            {scale === 'fit' ? 'Fit' : `${scale * 100}%`}
          </option>
        ))}
      </select>
      <span className="device-separator" />
      <select
        aria-label="Network throttling"
        title="Network throttling"
        value={emulation.network}
        onChange={(event) => update({ network: event.target.value as NetworkPreset })}
      >
        {Object.entries(NETWORK_CONDITIONS).map(([id, preset]) => (
          <option key={id} value={id}>
            {preset.label}
          </option>
        ))}
      </select>
      <select
        aria-label="CPU throttling"
        title="CPU throttling"
        value={emulation.cpu}
        onChange={(event) => update({ cpu: Number(event.target.value) })}
      >
        {CPU_RATES.map((rate) => (
          <option key={rate} value={rate}>
            {rate === 1 ? 'CPU: normal' : `CPU: ${rate}x slower`}
          </option>
        ))}
      </select>
      <select
        aria-label="Color scheme"
        title="prefers-color-scheme"
        value={emulation.colorScheme}
        onChange={(event) =>
          update({ colorScheme: event.target.value as EmulationSettings['colorScheme'] })
        }
      >
        <option value="default">Theme: page default</option>
        <option value="light">Theme: light</option>
        <option value="dark">Theme: dark</option>
      </select>
      <button
        type="button"
        className={`icon-button${emulation.print ? ' active' : ''}`}
        title="Emulate print media"
        aria-label="Emulate print media"
        aria-pressed={emulation.print}
        onClick={() => update({ print: !emulation.print })}
      >
        <span className="codicon codicon-file-pdf" aria-hidden="true" />
      </button>
      {device && !device.presetId && !saving && (
        <button type="button" className="button secondary small" onClick={() => setSaving(true)}>
          Save device
        </button>
      )}
      {saving && device && (
        <form
          className="save-device"
          onSubmit={(event) => {
            event.preventDefault();
            postToHost({
              type: 'saveCustomDevice',
              name: name || `${device.width}×${device.height}`,
              device,
            });
            setSaving(false);
          }}
        >
          <input
            autoFocus
            placeholder="Device name"
            aria-label="Device name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <button type="submit" className="button primary small">
            Save
          </button>
        </form>
      )}
      <button
        type="button"
        className="icon-button device-close"
        title="Close device toolbar"
        aria-label="Close device toolbar"
        onClick={() => update({ enabled: false })}
      >
        <span className="codicon codicon-close" aria-hidden="true" />
      </button>
    </div>
  );
}
