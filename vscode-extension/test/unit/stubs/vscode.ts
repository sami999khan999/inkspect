// Minimal stand-in for the `vscode` module so unit tests can import modules that use it.
// Only pure functions are tested; anything that calls into VS Code needs an integration test.
export class EventEmitter<T> {
  event = () => ({ dispose() {} });
  fire(_value: T): void {}
  dispose(): void {}
}
export const window = {};
export const workspace = {};
export const commands = {};
export const env = {};
