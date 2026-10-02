// Small composable checks for messages that cross a trust boundary (the browser link, the
// local hub). Each protocol describes its messages as tables of these and drops anything else.

/** Whether a value passes a check. */
export type Check = (value: unknown) => boolean;

export const isString: Check = (v) => typeof v === 'string';
export const isNumber: Check = (v) => typeof v === 'number' && Number.isFinite(v);
export const isBoolean: Check = (v) => typeof v === 'boolean';

/** A string of at most `max` characters. */
export const shortString =
  (max: number): Check =>
  (v) =>
    typeof v === 'string' && v.length <= max;

/** A string matching `pattern` (anchor it yourself). */
export const matches =
  (pattern: RegExp): Check =>
  (v) =>
    typeof v === 'string' && pattern.test(v);

export const optional =
  (check: Check): Check =>
  (v) =>
    v === undefined || check(v);

export const oneOf =
  (...values: string[]): Check =>
  (v) =>
    typeof v === 'string' && values.includes(v);

export const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

/** An object whose listed fields pass their checks (other fields are allowed). */
export const shape =
  (fields: Record<string, Check>): Check =>
  (v) =>
    isRecord(v) && Object.entries(fields).every(([k, check]) => check(v[k]));

export const arrayOf =
  (check: Check, max = 100_000): Check =>
  (v) =>
    Array.isArray(v) && v.length <= max && v.every(check);

/** An object whose values are all strings. */
export const stringMap: Check = (v) =>
  isRecord(v) && Object.values(v).every((value) => typeof value === 'string');

/**
 * Parses one message of a versioned protocol: JSON with `v` equal to `version` and a `type` from
 * `table`, whose fields pass that type's checks. Undefined for anything else. `v` is removed.
 */
export function parseMessage<T extends { type: string }>(
  raw: string | unknown,
  table: Record<string, Record<string, Check>>,
  version: number,
): T | undefined {
  let value: unknown = raw;
  if (typeof raw === 'string') {
    try {
      value = JSON.parse(raw);
    } catch {
      return undefined;
    }
  }
  if (!isRecord(value) || value.v !== version || typeof value.type !== 'string') return undefined;
  if (!Object.hasOwn(table, value.type)) return undefined;
  const fields = table[value.type];
  if (!fields || !shape(fields)(value)) return undefined;
  const { v: _version, ...message } = value;
  return message as T;
}
