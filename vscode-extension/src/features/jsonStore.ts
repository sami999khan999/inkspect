import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { mkdir, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

interface StoredFile<T> {
  version: number;
  data: T;
}

export interface JsonStoreOptions<T> {
  file: string;
  version: number;
  defaults: () => T;
  /** Converts data written by an older version. Return `undefined` to start from defaults. */
  migrate?: (data: unknown, fromVersion: number) => T | undefined;
  /** How long to wait after a change before writing, so bursts of changes cause one write. */
  delayMs?: number;
}

/**
 * Data kept in a JSON file (in the extension's global storage). Reads happen once at startup;
 * writes are debounced and atomic (a temporary file renamed over the real one).
 */
export class JsonStore<T> {
  private value: T;
  private timer?: NodeJS.Timeout;
  private writing: Promise<void> = Promise.resolve();

  constructor(private readonly options: JsonStoreOptions<T>) {
    this.value = this.load();
  }

  get data(): T {
    return this.value;
  }

  /** Replaces or mutates the data and schedules a write. */
  update(change: (data: T) => T | void): void {
    const result = change(this.value);
    if (result !== undefined) this.value = result;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => void this.flush(), this.options.delayMs ?? 500);
  }

  /** Writes pending changes now. */
  flush(): Promise<void> {
    clearTimeout(this.timer);
    this.timer = undefined;
    const content = this.serialize();
    this.writing = this.writing.then(async () => {
      await mkdir(dirname(this.options.file), { recursive: true });
      const temporary = `${this.options.file}.tmp`;
      await writeFile(temporary, content, 'utf8');
      await rename(temporary, this.options.file);
    });
    return this.writing;
  }

  /** Writes synchronously; used when the extension shuts down. */
  flushSync(): void {
    if (!this.timer) return;
    clearTimeout(this.timer);
    this.timer = undefined;
    mkdirSync(dirname(this.options.file), { recursive: true });
    const temporary = `${this.options.file}.tmp`;
    writeFileSync(temporary, this.serialize(), 'utf8');
    renameSync(temporary, this.options.file);
  }

  private serialize(): string {
    const stored: StoredFile<T> = { version: this.options.version, data: this.value };
    return JSON.stringify(stored);
  }

  private load(): T {
    let parsed: StoredFile<unknown>;
    try {
      parsed = JSON.parse(readFileSync(this.options.file, 'utf8')) as StoredFile<unknown>;
    } catch {
      return this.options.defaults();
    }
    if (parsed.version === this.options.version) return parsed.data as T;
    return this.options.migrate?.(parsed.data, parsed.version) ?? this.options.defaults();
  }
}
