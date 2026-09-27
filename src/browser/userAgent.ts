import type { Protocol } from 'devtools-protocol';

/** Headless Chromium says `HeadlessChrome` in its user agent; report the regular product name. */
export function cleanUserAgent(userAgent: string): string {
  return userAgent.replace('HeadlessChrome/', 'Chrome/');
}

/** User-agent client hints (`Sec-CH-UA*`) matching a regular Chromium build. */
export function userAgentMetadata(
  userAgent: string,
  platform: NodeJS.Platform,
  arch: string,
): Protocol.Emulation.UserAgentMetadata {
  const fullVersion = /Chrome\/([\d.]+)/.exec(userAgent)?.[1] ?? '0.0.0.0';
  const major = fullVersion.split('.')[0] ?? '0';
  return {
    brands: [
      { brand: 'Chromium', version: major },
      { brand: 'Not=A?Brand', version: '24' },
    ],
    fullVersionList: [
      { brand: 'Chromium', version: fullVersion },
      { brand: 'Not=A?Brand', version: '24.0.0.0' },
    ],
    platform: platform === 'win32' ? 'Windows' : platform === 'darwin' ? 'macOS' : 'Linux',
    platformVersion: '',
    architecture: arch === 'arm64' ? 'arm' : 'x86',
    bitness: arch === 'ia32' ? '32' : '64',
    model: '',
    mobile: false,
  };
}
