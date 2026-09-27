/** Logging interface used by the browser layer. VS Code's `LogOutputChannel` satisfies it. */
export interface Logger {
  trace(message: string): void;
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string | Error): void;
}

export const consoleLogger: Logger = {
  trace: () => {},
  debug: () => {},
  info: (message) => console.log(message),
  warn: (message) => console.warn(message),
  error: (message) => console.error(message),
};

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
