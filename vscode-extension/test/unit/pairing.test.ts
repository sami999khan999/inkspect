import { describe, expect, it } from 'vitest';
import { choosePending, parseApproval } from '../../src/bridge/pairing';

const a = { id: 'a' };
const b = { id: 'b' };

describe('choosePending', () => {
  it('pairs nothing without a live approval', () => {
    expect(choosePending([a], undefined, 0)).toBeUndefined();
    expect(choosePending([a], { expires: 100 }, 100)).toBeUndefined();
  });

  it('pairs the named browser, and only that one', () => {
    expect(choosePending([a, b], { clientId: 'b', expires: 100 }, 50)).toBe(b);
    expect(choosePending([a], { clientId: 'b', expires: 100 }, 50)).toBeUndefined();
  });

  it('without a name, pairs the only waiting browser but never picks one of several', () => {
    expect(choosePending([a], { expires: 100 }, 50)).toBe(a);
    expect(choosePending([a, b], { expires: 100 }, 50)).toBeUndefined();
    expect(choosePending([], { expires: 100 }, 50)).toBeUndefined();
    // The same browser on two connections (a reconnect) is still one browser.
    expect(choosePending([a, { id: 'a' }], { expires: 100 }, 50)).toBe(a);
  });
});

describe('parseApproval', () => {
  it('reads approvals and rejects anything malformed', () => {
    expect(parseApproval({ clientId: 'a', expires: 5 })).toEqual({ clientId: 'a', expires: 5 });
    expect(parseApproval({ expires: 5 })).toEqual({ clientId: undefined, expires: 5 });
    expect(parseApproval(undefined)).toBeUndefined();
    expect(parseApproval({ clientId: 3, expires: 5 })).toBeUndefined();
    expect(parseApproval({ clientId: 'a' })).toBeUndefined();
  });
});
