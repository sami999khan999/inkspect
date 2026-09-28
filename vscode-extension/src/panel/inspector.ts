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
import { captureAndSend, rememberPick } from '../agent/chat';
import { addContext, type ContextInput } from '../agent/contextTray';
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
  /** An element screenshot to copy after the details (Alt+click). */
  private pendingImage?: { bytes: Uint8Array; mimeType: string; path: string };
  private current?: { node: number; from?: { x: number; y: number } };
  private selection: { nodeId: number; details: Details }[] = [];

  constructor(private readonly deps: InspectorDeps) {}

  /** Turns on Chrome's inspect mode in a tab. */
  async start(tabId: string, session: TabSession): Promise<void> {
    this.switchTab(tabId);
    await session.startInspect();
  }

  /**
   * The element being inspected: the one reached with the arrow keys while the pointer stays
   * where they started, else the one under the pointer.
   */
  private async target(session: TabSession): Promise<number | undefined> {
    const pointer = session.lastMouse;
    if (this.current && samePoint(this.current.from, pointer)) return this.current.node;
    return pointer ? session.nodeAt(pointer.x, pointer.y) : undefined;
  }

  /** Arrow Up / Arrow Down: highlight the parent or first child of the element being inspected. */
  async traverse(tabId: string, session: TabSession, direction: 'parent' | 'child'): Promise<void> {
    this.switchTab(tabId);
    const pointer = session.lastMouse;
    const from = await this.target(session);
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
      // Screenshots are always copied; the image goes last so it stays on the clipboard.
      this.pendingImage = {
        bytes,
        mimeType: format === 'jpeg' ? 'image/jpeg' : `image/${format}`,
        path,
      };
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

  /**
   * Enter: copies the multi-selection, or the element reached with the pointer or arrow keys.
   * With `toAgent`, sends it to the agent instead.
   */
  async copySelection(session: TabSession, toAgent = false): Promise<void> {
    if (this.selection.length) {
      await this.copy(
        this.selection.map((s) => s.details),
        toAgent,
      );
      this.selection = [];
      this.postSelection();
      return;
    }
    const node = await this.target(session);
    if (node === undefined) return;
    const details = await session.elementDetails(node, getConfig().inspectorMaxHtml);
    if (!details) return;
    workspaceComponentPath(details);
    await this.copy([details], toAgent);
  }

  /** S in the picker: a screenshot of the element under the pointer (or reached with arrows). */
  async screenshotCurrent(session: TabSession, url: string): Promise<void> {
    const node = await this.target(session);
    if (node === undefined) {
      this.deps.toast('Point at an element first.');
      return;
    }
    const format = getConfig().screenshotFormat;
    const bytes = await session.screenshot('element', { format, backendNodeId: node });
    await deliverScreenshot({
      bytes,
      url,
      format,
      globalStorage: this.deps.globalStorage,
      copyImage: this.deps.copyImage,
      label: 'Element screenshot',
    });
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
    const image = this.pendingImage;
    this.pendingImage = undefined;
    const first = elements[0]!;
    const context: ContextInput = {
      kind: 'element',
      title: elements.length === 1 ? elementLabel(first) : `${elements.length} elements`,
      detail: first.component?.name ?? pageHost(first.pageUrl),
      text: markdown,
      image: image && { bytes: image.bytes, mimeType: image.mimeType },
      file: image?.path,
      url: first.pageUrl,
    };
    if (chat) {
      await captureAndSend(context);
    } else {
      addContext(context);
      const text = formatDetails(elements, config.inspectorCopyFormat, config.inspectorFields);
      await copyText(text);
      this.deps.toast(
        elements.length === 1
          ? `Copied details of ${elementLabel(elements[0]!)}`
          : `Copied details of ${elements.length} elements`,
      );
    }
    if (image) this.deps.copyImage(image.bytes, image.mimeType);
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

function pageHost(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).host || undefined;
  } catch {
    return undefined;
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
