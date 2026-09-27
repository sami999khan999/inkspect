import { describe, expect, it } from 'vitest';
import { PROFILE_NAMES, isProfileInUse } from '../../src/engineHost';

describe('browser profiles', () => {
  it('recognizes the error for a profile another browser is using', () => {
    expect(
      isProfileInUse(
        new Error(
          'The browser is already running for C:/Users/me/globalStorage/x/profile. Use a different `userDataDir` or stop the running browser first.',
        ),
      ),
    ).toBe(true);
    expect(isProfileInUse(new Error('Failed to launch the browser process!'))).toBe(false);
    expect(isProfileInUse('browser is already running for x')).toBe(false);
  });

  it('tries the main profile first, then numbered ones', () => {
    expect(PROFILE_NAMES[0]).toBe('profile');
    expect(PROFILE_NAMES.slice(1, 3)).toEqual(['profile-2', 'profile-3']);
    expect(new Set(PROFILE_NAMES).size).toBe(PROFILE_NAMES.length);
  });
});
