import { afterEach, describe, expect, it, vi } from 'vitest';
import { randomId } from '../src/id';

describe('randomId', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('makes v4 UUIDs without crypto.randomUUID (insecure pages)', () => {
    vi.stubGlobal('crypto', { getRandomValues: crypto.getRandomValues.bind(crypto) });
    const ids = new Set(Array.from({ length: 50 }, () => randomId()));
    expect(ids.size).toBe(50);
    for (const id of ids) {
      expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    }
  });
});
