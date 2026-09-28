import { useState } from 'react';
import {
  CPU_RATES,
  DEVICE_PRESETS,
  DPR_OPTIONS,
  NETWORK_CONDITIONS,
  presetToDevice,
  responsiveDevice,
  RESPONSIVE_ID,
  rotate,
  MAX_DEVICE_SIZE,
  MIN_DEVICE_SIZE,
  SCALE_OPTIONS,
  type DevicePreset,
  type DeviceSettings,
  type EmulationSettings,
  type NetworkPreset,
} from '@shared/devices';
import type { TabState } from '@shared/protocol';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Select, type SelectOption } from '@inkspect/shared/ui/Select';
import { TextField } from '@inkspect/shared/ui/TextField';
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
  const responsive = !device || device.presetId === RESPONSIVE_ID;
  /** Size and other edits keep a responsive screen responsive; a preset becomes a custom size. */
  const updateDevice = (changes: Partial<DeviceSettings>) => {
    const base = device ?? responsiveDevice(available);
    update({
      device: { ...base, ...changes, presetId: responsive ? RESPONSIVE_ID : undefined },
    });
  };

  const selected = responsive ? 'responsive' : (device.presetId ?? 'custom');

  const deviceOptions: SelectOption[] = [
    { value: 'responsive', label: 'Responsive', icon: 'screen-full' },
    ...(selected === 'custom' ? [{ value: 'custom', label: 'Custom size', icon: 'edit' }] : []),
    ...[...GROUPS, 'Custom' as const].flatMap((group) =>
      presets
        .filter((p) => p.group === group)
        .map((p) => ({
          value: p.id,
          label: p.name,
          detail: `${p.width}×${p.height}`,
          group,
        })),
    ),
  ];

  return (
    <div className="device-toolbar" role="toolbar" aria-label="Device emulation">
      <Select
        size="sm"
        label="Device"
        className="device-select"
        value={selected}
        options={deviceOptions}
        onChange={(value) => {
          if (value === 'responsive') update({ device: responsiveDevice(available) });
          else if (value !== 'custom') {
            const preset = presets.find((p) => p.id === value);
            if (preset) update({ device: presetToDevice(preset) });
          }
        }}
      />
      <div className="device-size">
        <SizeInput
          label="Width"
          value={device?.width ?? responsiveDevice(available).width}
          onCommit={(width) => updateDevice({ width })}
        />
        <span className="muted" aria-hidden="true">
          ×
        </span>
        <SizeInput
          label="Height"
          value={device?.height ?? responsiveDevice(available).height}
          onCommit={(height) => updateDevice({ height })}
        />
      </div>
      <Select
        size="sm"
        appearance="quiet"
        label="Device pixel ratio"
        placeholder="DPR"
        disabled={!device}
        value={device ? String(device.dpr) : undefined}
        options={DPR_OPTIONS.map((dpr) => ({
          value: String(dpr),
          label: `${dpr}x`,
          detail: 'DPR',
        }))}
        renderValue={(option) => option.label}
        onChange={(dpr) => updateDevice({ dpr: Number(dpr) })}
      />
      <IconButton
        icon="sync"
        label="Rotate"
        className="small"
        disabled={!device}
        onClick={() => device && update({ device: rotate(device) })}
      />
      <IconButton
        icon="hubot"
        label="Touch and mobile viewport"
        className="small"
        active={!!device?.touch}
        disabled={!device}
        onClick={() =>
          device && updateDevice({ ...device, touch: !device.touch, mobile: !device.touch })
        }
      />
      <Select
        size="sm"
        appearance="quiet"
        label="Zoom"
        icon="zoom-in"
        disabled={!device}
        value={String(emulation.scale)}
        options={SCALE_OPTIONS.map((scale) => ({
          value: String(scale),
          label: scale === 'fit' ? 'Fit to window' : `${scale * 100}%`,
        }))}
        renderValue={(option) => (option.value === 'fit' ? 'Fit' : option.label)}
        onChange={(value) => update({ scale: value === 'fit' ? 'fit' : Number(value) })}
      />
      <span className="toolbar-separator" />
      <Select
        size="sm"
        appearance="quiet"
        label="Network throttling"
        icon="radio-tower"
        value={emulation.network}
        options={Object.entries(NETWORK_CONDITIONS).map(([id, preset]) => ({
          value: id as NetworkPreset,
          label: preset.label,
        }))}
        onChange={(network) => update({ network })}
      />
      <Select
        size="sm"
        appearance="quiet"
        label="CPU throttling"
        icon="pulse"
        value={String(emulation.cpu)}
        options={CPU_RATES.map((rate) => ({
          value: String(rate),
          label: rate === 1 ? 'No CPU throttling' : `${rate}x slower`,
        }))}
        renderValue={(option) => (option.value === '1' ? 'CPU' : option.label)}
        onChange={(cpu) => update({ cpu: Number(cpu) })}
      />
      <Select
        size="sm"
        appearance="quiet"
        label="Color scheme (prefers-color-scheme)"
        icon="color-mode"
        value={emulation.colorScheme}
        options={[
          { value: 'default', label: 'Page default' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        onChange={(colorScheme) => update({ colorScheme })}
      />
      <IconButton
        icon="file-pdf"
        label="Emulate print media"
        className="small"
        active={emulation.print}
        onClick={() => update({ print: !emulation.print })}
      />
      {device && (!device.presetId || responsive) && !saving && (
        <Button size="sm" variant="ghost" icon="save" onClick={() => setSaving(true)}>
          Save device
        </Button>
      )}
      {saving && device && (
        <form
          className="save-device"
          onSubmit={(event) => {
            event.preventDefault();
            postToHost({
              type: 'saveCustomDevice',
              name: name || `${device.width}×${device.height}`,
              device: { ...device, presetId: undefined },
            });
            setSaving(false);
          }}
        >
          <TextField
            size="sm"
            autoFocus
            placeholder={`${device.width}×${device.height}`}
            aria-label="Device name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && setSaving(false)}
          />
          <Button type="submit" size="sm" variant="primary">
            Save
          </Button>
          <IconButton
            icon="close"
            label="Cancel"
            className="small"
            onClick={() => setSaving(false)}
          />
        </form>
      )}
      <IconButton
        icon="close"
        label="Close device toolbar"
        className="small device-close"
        onClick={() => update({ enabled: false })}
      />
    </div>
  );
}

/**
 * A width or height box. Typing only edits the text; the size is applied on Enter or when the
 * box loses focus (like Chrome), so partial numbers such as "3" of "375" are never emulated.
 */
function SizeInput({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: number;
  onCommit: (value: number) => void;
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const commit = () => {
    if (draft === null) return;
    const number = Math.round(Number(draft));
    setDraft(null);
    if (Number.isFinite(number) && number !== value) {
      onCommit(Math.min(MAX_DEVICE_SIZE, Math.max(MIN_DEVICE_SIZE, number)));
    }
  };
  return (
    <TextField
      size="sm"
      type="number"
      inputMode="numeric"
      min={MIN_DEVICE_SIZE}
      max={MAX_DEVICE_SIZE}
      aria-label={label}
      title={`${label} (Enter to apply)`}
      className="size-input"
      value={draft ?? String(value)}
      onFocus={(event) => event.currentTarget.select()}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={commit}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          commit();
          event.currentTarget.blur();
        } else if (event.key === 'Escape') {
          setDraft(null);
          event.currentTarget.blur();
        }
      }}
    />
  );
}
