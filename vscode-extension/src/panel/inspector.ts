import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { copyText } from '../features/clipboard';
import type { TabSession } from '../browser/TabSession';
import { getConfig } from '../config';
import {
  deliverScreenshot,
  displayPath,
  localWorkspaceFolder,
  saveScreenshot,
} from '../features/screenshots';
import { rememberPick, sendToChat } from '../agent/chat';
import { normalizeSourcePath } from '../features/sourcePaths';
import { elementLabel, formatDetails, type ElementDetails } from '../shared/elementInfo';
import type { HostToWebview, InspectPurpose, Rect } from '../shared/protocol';

type Details = ElementDetails & { ancestry: string[]; scroll: { x: number; y: number } };

interface InspectorDeps {
  post: (message: HostToWebview) => void;
  copyImage: (bytes: Uint8Array, mimeType: string) => void;
  toast: (message: string) => void;
  globalStorage: string;
  logger: vscode.LogOutputChannel;
}

/**
 * The element picker for one browser window. Hovering is Chrome's own inspect mode (native
 * highlight and tooltip); this class handles clicks (copy details for AI agents, Shift+click
 * multi-selection, element screenshots) and moving to the parent or child with the arrow keys.
 */
export class Inspector {
  private tabId?: string;
  /** Element reached with the arrow keys, and the pointer position it was reached from. */
  private current?: { node: number; from?: { x: number; y: number } };
  private selection: { nodeId: number; details: Details }[] = [];

  constructor(private readonly deps: InspectorDeps) {}

  /** Turns on Chrome's inspect mode in a tab. */
  async start(tabId: string, session: TabSession): Promise<void> {
    this.switchTab(tabId);
    await session.startInspect();
  }

  /** Arrow Up / Arrow Down: highlight the parent or first child of the element being inspected. */
  async traverse(tabId: string, session: TabSession, direction: 'parent' | 'child'): Promise<void> {
    this.switchTab(tabId);
    const pointer = session.lastMouse;
    // Start from the element under the pointer unless the pointer stayed where the keys started.
    const from =
      this.current && samePoint(this.current.from, pointer)
        ? this.current.node
        : pointer && (await session.nodeAt(pointer.x, pointer.y));
    if (from === undefined) return;
    const next =
      direction === 'parent' ? await session.parentOf(from) : await session.firstChildOf(from);
    if (next === undefined) return;
    this.current = { node: next, from: pointer && { ...pointer } };
    await session.highlight(next).catch(() => {});
  }

  /**
   * Click: copy the element's details (or capture it, when picking for a screenshot).
   * Shift adds it to the multi-selection; Alt also saves an element screenshot.
   */
  async pick(
    tabId: string,
    session: TabSession,
    options: {
      x: number;
      y: number;
      purpose: InspectPurpose;
      add: boolean;
      screenshot: boolean;
      chat?: boolean;
      url: string;
    },
  ): Promise<void> {
    this.switchTab(tabId);
    const node = await session.inspectAt(options.x, options.y);
    if (node === undefined) return;
    this.current = undefined;
    if (options.purpose === 'screenshot') {
      await this.stop(session);
      this.deps.post({ type: 'setInspect', purpose: null });
      const format = getConfig().screenshotFormat;
      const bytes = await session.screenshot('element', { format, backendNodeId: node });
      await deliverScreenshot({
        bytes,
        url: options.url,
        format,
        globalStorage: this.deps.globalStorage,
        copyImage: this.deps.copyImage,
        label: 'Element screenshot',
      });
      return;
    }
    const config = getConfig();
    const details = await session.elementDetails(node, config.inspectorMaxHtml);
    if (!details) return;
    workspaceComponentPath(details);
    if (options.screenshot) {
      const format = config.screenshotFormat;
      const bytes = await session.screenshot('element', { format, backendNodeId: node });
      const path = await saveScreenshot(bytes, options.url, format, this.deps.globalStorage);
      details.screenshot = displayPath(path);
      await session.highlight(node).catch(() => {});
    }
    if (options.add) {
      if (!this.selection.some((s) => s.nodeId === node))
        this.selection.push({ nodeId: node, details });
      this.postSelection();
      this.deps.toast(`${this.selection.length} selected. Press Enter to copy all, Esc to cancel.`);
      return;
    }
    await this.copy([details], options.chat);
  }

  /** Enter: copies every element in the multi-selection. */
  /** Enter: copies the multi-selection, or the element reached with the arrow keys. */
  async copySelection(session: TabSession): Promise<void> {
    if (this.selection.length) {
      await this.copy(this.selection.map((s) => s.details));
      this.selection = [];
      this.postSelection();
      return;
    }
    if (this.current === undefined) return;
    const details = await session.elementDetails(this.current.node, getConfig().inspectorMaxHtml);
    if (!details) return;
    workspaceComponentPath(details);
    await this.copy([details]);
  }

  async stop(session?: TabSession): Promise<void> {
    await session?.stopInspect();
    this.current = undefined;
    this.selection = [];
    if (this.tabId) this.postSelection();
  }

  private switchTab(tabId: string): void {
    if (this.tabId === tabId) return;
    this.tabId = tabId;
    this.current = undefined;
    this.selection = [];
  }

  private async copy(elements: Details[], chat = false): Promise<void> {
    const config = getConfig();
    const markdown = formatDetails(elements, 'markdown', config.inspectorFields);
    rememberPick(markdown);
    if (chat) {
      await sendToChat(markdown);
    } else {
      const text = formatDetails(elements, config.inspectorCopyFormat, config.inspectorFields);
      await copyText(text);
      this.deps.toast(
        elements.length === 1
          ? `Copied details of ${elementLabel(elements[0]!)}`
          : `Copied details of ${elements.length} elements`,
      );
    }
    if (config.inspectorWriteSelectionFile) await this.writeSelectionFile(elements);
  }

  /** `.vscode-browser/context/selection.md`, so agents can read the last pick from disk. */
  private async writeSelectionFile(elements: Details[]): Promise<void> {
    const workspace = localWorkspaceFolder();
    if (!workspace) return;
    const directory = join(workspace, '.vscode-browser', 'context');
    await mkdir(directory, { recursive: true });
    const config = getConfig();
    await writeFile(
      join(directory, 'selection.md'),
      `${formatDetails(elements, 'markdown', config.inspectorFields)}\n`,
      'utf8',
    ).catch((error: unknown) =>
      this.deps.logger.warn(`Could not write selection file: ${String(error)}`),
    );
  }

  private postSelection(): void {
    if (!this.tabId) return;
    const rects: Rect[] = this.selection.map(({ details }) => ({
      x: details.rect.x + details.scroll.x,
      y: details.rect.y + details.scroll.y,
      width: details.rect.width,
      height: details.rect.height,
    }));
    this.deps.post({ type: 'inspectSelection', tabId: this.tabId, rects });
  }
}

function samePoint(a?: { x: number; y: number }, b?: { x: number; y: number }): boolean {
  return !!a && !!b && a.x === b.x && a.y === b.y;
}

/** Turns a component's source file (often a dev-server URL) into a workspace path. */
export function workspaceComponentPath(details: ElementDetails): void {
  if (!details.component?.file) return;
  const roots = (vscode.workspace.workspaceFolders ?? []).map((f) => f.uri.fsPath);
  details.component.file = normalizeSourcePath(details.component.file, roots);
}
