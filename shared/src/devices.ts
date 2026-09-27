// Device emulation model, shared by the host and the webview.

export type UserAgentKind = 'desktop' | 'android' | 'iphone' | 'ipad';

export interface DevicePreset {
  id: string;
  name: string;
  group: 'Phones' | 'Tablets' | 'Desktops' | 'Custom';
  width: number;
  height: number;
  dpr: number;
  mobile: boolean;
  touch: boolean;
  userAgent: UserAgentKind;
}

const phone = (
  id: string,
  name: string,
  width: number,
  height: number,
  dpr: number,
  ua: UserAgentKind,
): DevicePreset => ({
  id,
  name,
  group: 'Phones',
  width,
  height,
  dpr,
  mobile: true,
  touch: true,
  userAgent: ua,
});
const tablet = (
  id: string,
  name: string,
  width: number,
  height: number,
  dpr: number,
  ua: UserAgentKind,
): DevicePreset => ({
  id,
  name,
  group: 'Tablets',
  width,
  height,
  dpr,
  mobile: true,
  touch: true,
  userAgent: ua,
});
const desktop = (width: number, height: number, label: string): DevicePreset => ({
  id: `desktop-${width}x${height}`,
  name: `${label} ${width}×${height}`,
  group: 'Desktops',
  width,
  height,
  dpr: 1,
  mobile: false,
  touch: false,
  userAgent: 'desktop',
});

export const DEVICE_PRESETS: readonly DevicePreset[] = [
  phone('iphone-se', 'iPhone SE', 375, 667, 2, 'iphone'),
  phone('iphone-16-pro', 'iPhone 16 Pro', 402, 874, 3, 'iphone'),
  phone('iphone-16-pro-max', 'iPhone 16 Pro Max', 440, 956, 3, 'iphone'),
  phone('pixel-8', 'Pixel 8', 412, 915, 2.625, 'android'),
  phone('galaxy-s24', 'Galaxy S24', 360, 780, 3, 'android'),
  tablet('ipad-mini', 'iPad Mini', 768, 1024, 2, 'ipad'),
  tablet('ipad-pro', 'iPad Pro 12.9"', 1024, 1366, 2, 'ipad'),
  tablet('surface-pro', 'Surface Pro 7', 912, 1368, 2, 'desktop'),
  desktop(1280, 800, 'Laptop'),
  desktop(1366, 768, 'Laptop'),
  desktop(1440, 900, 'Laptop'),
  desktop(1920, 1080, 'Full HD'),
  desktop(2560, 1440, 'QHD'),
  desktop(3840, 2160, '4K'),
];

export type NetworkPreset = 'none' | 'offline' | 'slow3g' | 'fast3g' | 'fast4g';

/** Same numbers as Chrome DevTools (bytes per second, milliseconds). */
export const NETWORK_CONDITIONS: Record<
  NetworkPreset,
  { label: string; offline: boolean; latency: number; download: number; upload: number }
> = {
  none: { label: 'No throttling', offline: false, latency: 0, download: -1, upload: -1 },
  offline: { label: 'Offline', offline: true, latency: 0, download: 0, upload: 0 },
  slow3g: { label: 'Slow 3G', offline: false, latency: 2000, download: 50_000, upload: 50_000 },
  fast3g: { label: 'Fast 3G', offline: false, latency: 562.5, download: 180_000, upload: 84_375 },
  fast4g: { label: 'Fast 4G', offline: false, latency: 165, download: 1_012_500, upload: 168_750 },
};

export const CPU_RATES = [1, 4, 6] as const;
export const DPR_OPTIONS = [1, 1.5, 2, 2.625, 3] as const;
export const SCALE_OPTIONS = ['fit', 0.25, 0.5, 0.75, 1, 1.25, 1.5] as const;

/** The emulated screen. Absent in responsive mode, where the page fills the browser window. */
export interface DeviceSettings {
  presetId?: string;
  width: number;
  height: number;
  dpr: number;
  mobile: boolean;
  touch: boolean;
  userAgent: UserAgentKind;
}

export interface EmulationSettings {
  /** Whether the device toolbar is on. When off, nothing below applies. */
  enabled: boolean;
  device?: DeviceSettings;
  /** How the emulated screen is shown: scaled to fit the window, or a fixed zoom. */
  scale: 'fit' | number;
  network: NetworkPreset;
  cpu: number;
  colorScheme: 'default' | 'light' | 'dark';
  print: boolean;
}

export const DEFAULT_EMULATION: EmulationSettings = {
  enabled: false,
  scale: 'fit',
  network: 'none',
  cpu: 1,
  colorScheme: 'default',
  print: false,
};

/** `presetId` of the resizable screen (Chrome's "Responsive" mode). */
export const RESPONSIVE_ID = 'responsive';

/** Space kept around an emulated screen (room for the resize handles). */
export const DEVICE_MARGIN = 24;

/** Widths of the bands above a responsive screen (Chrome's media-query presets). */
export const RESPONSIVE_BREAKPOINTS = [
  { label: 'Mobile S', width: 320 },
  { label: 'Mobile M', width: 375 },
  { label: 'Mobile L', width: 425 },
  { label: 'Tablet', width: 768 },
  { label: 'Laptop', width: 1024 },
  { label: 'Laptop L', width: 1440 },
  { label: '4K', width: 2560 },
] as const;

/** Smallest and largest emulated screen size, in CSS pixels. */
export const MIN_DEVICE_SIZE = 50;
export const MAX_DEVICE_SIZE = 7680;

/**
 * A responsive screen: desktop defaults, sized to fill the page area (or `size`), keeping the
 * pixel ratio and touch settings of `base`.
 */
export function responsiveDevice(
  area: { width: number; height: number },
  base?: DeviceSettings,
  size?: { width: number; height: number },
): DeviceSettings {
  const fit = (value: number, fallback: number) =>
    Math.round(Math.min(MAX_DEVICE_SIZE, Math.max(MIN_DEVICE_SIZE, value > 0 ? value : fallback)));
  return {
    presetId: RESPONSIVE_ID,
    width: fit(size?.width ?? area.width - DEVICE_MARGIN * 2, 400),
    height: fit(size?.height ?? area.height - DEVICE_MARGIN * 2, 800),
    dpr: base?.dpr ?? 1,
    mobile: base?.mobile ?? false,
    touch: base?.touch ?? false,
    userAgent: base?.userAgent ?? 'desktop',
  };
}

export function presetToDevice(preset: DevicePreset): DeviceSettings {
  return {
    presetId: preset.id,
    width: preset.width,
    height: preset.height,
    dpr: preset.dpr,
    mobile: preset.mobile,
    touch: preset.touch,
    userAgent: preset.userAgent,
  };
}

export function rotate(device: DeviceSettings): DeviceSettings {
  return { ...device, width: device.height, height: device.width };
}

/** Display scale for `fit`: as large as fits the available area, but never above 100%. */
export function displayScale(
  scale: EmulationSettings['scale'],
  device: { width: number; height: number },
  available: { width: number; height: number },
): number {
  if (scale !== 'fit') return scale;
  if (!available.width || !available.height) return 1;
  return Math.min(1, available.width / device.width, available.height / device.height);
}

/** User agent string for a device, based on the engine's Chrome version. */
export function deviceUserAgent(kind: UserAgentKind, chromeVersion: string): string | undefined {
  const major = chromeVersion.split('.')[0] ?? '0';
  switch (kind) {
    case 'android':
      return `Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${major}.0.0.0 Mobile Safari/537.36`;
    case 'iphone':
      return 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    case 'ipad':
      return 'Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1';
    case 'desktop':
      return undefined;
  }
}

const clamp = (value: unknown, min: number, max: number, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value)
    ? Math.min(max, Math.max(min, value))
    : fallback;

const USER_AGENTS: readonly UserAgentKind[] = ['desktop', 'android', 'iphone', 'ipad'];

/** Makes untrusted emulation settings (from the webview or settings.json) safe to apply. */
export function sanitizeEmulation(value: unknown): EmulationSettings {
  const input = (typeof value === 'object' && value !== null ? value : {}) as Record<
    string,
    unknown
  >;
  const device = input.device as Record<string, unknown> | undefined;
  return {
    enabled: input.enabled === true,
    device:
      typeof device === 'object' && device !== null
        ? {
            presetId:
              typeof device.presetId === 'string' ? device.presetId.slice(0, 64) : undefined,
            width: Math.round(clamp(device.width, 50, 7680, 400)),
            height: Math.round(clamp(device.height, 50, 7680, 800)),
            dpr: clamp(device.dpr, 0.5, 4, 1),
            mobile: device.mobile === true,
            touch: device.touch === true,
            userAgent: USER_AGENTS.includes(device.userAgent as UserAgentKind)
              ? (device.userAgent as UserAgentKind)
              : 'desktop',
          }
        : undefined,
    scale: input.scale === 'fit' ? 'fit' : clamp(input.scale, 0.1, 4, 1),
    network: Object.hasOwn(NETWORK_CONDITIONS, String(input.network))
      ? (input.network as NetworkPreset)
      : 'none',
    cpu: clamp(input.cpu, 1, 20, 1),
    colorScheme:
      input.colorScheme === 'light' || input.colorScheme === 'dark' ? input.colorScheme : 'default',
    print: input.print === true,
  };
}

/** Custom devices from the `vscodeBrowser.devices.custom` setting. */
export function customPresets(value: unknown): DevicePreset[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((entry: unknown, index) => {
    if (typeof entry !== 'object' || entry === null) return [];
    const raw = entry as Record<string, unknown>;
    const device = sanitizeEmulation({ device: raw }).device!;
    const name =
      typeof raw.name === 'string' && raw.name.trim() ? raw.name.trim() : `Custom ${index + 1}`;
    return [{ ...device, id: `custom-${index}`, name, group: 'Custom' as const }];
  });
}
