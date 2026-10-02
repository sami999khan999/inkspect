// Frames of the hub's protocol: a uint32 little-endian length, then that many bytes of UTF-8
// JSON. This is native messaging's framing (in the byte order of the machines it runs on), so the
// shim can pass a browser's frames to the hub as they are.

/** One frame for `text`. */
export function frame(text: string): Buffer {
  const body = Buffer.from(text, 'utf8');
  const head = Buffer.alloc(4);
  head.writeUInt32LE(body.length, 0);
  return Buffer.concat([head, body]);
}

/**
 * Splits a byte stream into frames, whatever the chunk boundaries. A frame longer than `max` is
 * an error: the stream can't be trusted after it, so the caller should close the connection.
 */
export class FrameDecoder {
  private buffer: Buffer = Buffer.alloc(0);
  /** Chunks of a frame still arriving, joined once it is all there (no copy per chunk). */
  private pending: Buffer[] = [];
  private pendingLength = 0;
  private failed = false;

  constructor(
    private readonly max: number,
    private readonly onFrame: (text: string) => void,
    private readonly onError: (error: Error) => void,
  ) {}

  push(chunk: Buffer): void {
    if (this.failed) return;
    if (this.pending.length) {
      this.pending.push(chunk);
      this.pendingLength += chunk.length;
      const needed = this.buffer.length >= 4 ? 4 + this.buffer.readUInt32LE(0) : 4;
      if (this.pendingLength < needed) return;
      chunk = Buffer.concat(this.pending, this.pendingLength);
      this.pending = [];
      this.pendingLength = 0;
      this.buffer = Buffer.alloc(0);
    }
    this.buffer = this.buffer.length ? Buffer.concat([this.buffer, chunk]) : chunk;
    while (this.buffer.length >= 4) {
      const length = this.buffer.readUInt32LE(0);
      if (length > this.max) {
        this.failed = true;
        this.buffer = Buffer.alloc(0);
        this.onError(new Error(`Frame of ${length} bytes is over the limit of ${this.max}`));
        return;
      }
      if (this.buffer.length < 4 + length) {
        // Wait for the rest without copying what came so far again.
        this.pending = [this.buffer];
        this.pendingLength = this.buffer.length;
        return;
      }
      const text = this.buffer.subarray(4, 4 + length).toString('utf8');
      this.buffer = this.buffer.subarray(4 + length);
      this.onFrame(text);
    }
  }
}
