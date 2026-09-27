import { describe, expect, it } from 'vitest';
import {
  customPresets,
  DEVICE_PRESETS,
  deviceUserAgent,
  displayScale,
  presetToDevice,
  rotate,
  sanitizeEmulation,
} from '../../src/shared/devices';

describe('device presets', () => {
  it('have unique ids and sensible sizes', () => {
    const ids = DEVICE_PRESETS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const preset of DEVICE_PRESETS) {
      expect(preset.width).toBeGreaterThan(300);
      expect(preset.dpr).toBeGreaterThanOrEqual(1);
    }
  });

  it('rotates by swapping width and height', () => {
    const device = presetToDevice(DEVICE_PRESETS[0]!);
    expect(rotate(device)).toMatchObject({ width: device.height, height: device.width });
  });
});

describe('displayScale', () => {
  const device = { width: 400, height: 800 };
  it('fits the available area without enlarging', () => {
    expect(displayScale('fit', device, { width: 1000, height: 400 })).toBe(0.5);
    expect(displayScale('fit', device, { width: 2000, height: 2000 })).toBe(1);
  });

  it('uses a fixed scale as is', () => {
    expect(displayScale(1.5, device, { width: 100, height: 100 })).toBe(1.5);
  });
});

describe('sanitizeEmulation', () => {
  it('clamps sizes and drops unknown values', () => {
    const settings = sanitizeEmulation({
      enabled: true,
      device: { width: 10, height: 99999, dpr: 'x', userAgent: 'toaster', touch: 'yes' },
      scale: 100,
      network: 'dialup',
      cpu: -3,
      colorScheme: 'sepia',
    });
    expect(settings).toEqual({
      enabled: true,
      device: {
        presetId: undefined,
        width: 50,
        height: 7680,
        dpr: 1,
        mobile: false,
        touch: false,
        userAgent: 'desktop',
      },
      scale: 4,
      network: 'none',
      cpu: 1,
      colorScheme: 'default',
      print: false,
    });
  });

  it('treats non-objects as defaults', () => {
    expect(sanitizeEmulation('nope').enabled).toBe(false);
    expect(sanitizeEmulation(null).device).toBeUndefined();
  });
});

describe('custom presets', () => {
  it('reads presets from settings and skips invalid entries', () => {
    const presets = customPresets([
      { name: 'Kiosk', width: 1080, height: 1920, touch: true },
      'bad',
    ]);
    expect(presets).toHaveLength(1);
    expect(presets[0]).toMatchObject({
      id: 'custom-0',
      name: 'Kiosk',
      width: 1080,
      touch: true,
      group: 'Custom',
    });
    expect(customPresets('not an array')).toEqual([]);
  });
});

describe('device user agents', () => {
  it('uses the engine version for Android and nothing for desktop', () => {
    expect(deviceUserAgent('android', '154.0.8037.57')).toContain('Chrome/154.0.0.0 Mobile');
    expect(deviceUserAgent('iphone', '154')).toContain('iPhone');
    expect(deviceUserAgent('desktop', '154')).toBeUndefined();
  });
});
