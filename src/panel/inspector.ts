import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
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
  toast: (message: string) => void;
  globalStorage: string;
  logger: vscode.LogOutputChannel;
}

/**
 * The element picker for one browser window: highlights the element under the pointer, copies
 * its details for AI agents, keeps a Shift+click multi-selection, and picks elements to capture.
 */
export class Inspector {
  private tabId?: string;
  private current?: number;
  private hovering = false;
  private pendingHover?: { session: TabSession; x: number; y: number };
  private selection: { nodeId: number; details: Details }[] = [];

  constructor(private readonly deps: InspectorDeps) {}

  /** Pointer moved: highlight the element under it (only the latest request is processed). */
  hover(tabId: string, session: TabSession, x: number, y: number): void {
    this.switchTab(tabId);
    this.pendingHover = { session, x, y };
    if (!this.hovering) void this.processHover();
  }

  private async processHover(): Promise<void> {
    this.hovering = true;
    try {
      while (this.pendingHover) {
        const { session, x, y } = this.pendingHover;
        this.pendingHover = undefined;
        const node = await session.nodeAt(x, y);
        if (node === undefined || node === this.current) continue;
        await this.show(session, node);
      }
    } finally {
      this.hovering = false;
    }
  }

  /** Highlights a node and sends the details card to the webview. */
  private async show(session: TabSession, node: number): Promise<void> {
    this.current = node;
    await session.highlight(node).catch(() => {});
    const details = await session.elementDetails(node, 200);
    if (!details || this.current !== node) return;
    this.deps.post({
      type: 'inspectHover',
      tabId: this.tabId!,
      hover: {
        label: elementLabel(details),
        rect: details.rect,
        role: details.role,
        name: details.name,
        component: details.component?.name,
        ancestry: details.ancestry,
        styles: pick(details.styles, [
          'display',
          'position',
          'color',
          'background-color',
          'font-size',
          'padding',
          'margin',
        ]),
      },
    });
  }

  /** Arrow Up / Arrow Down: move the highlight to the parent or first child. */
  async traverse(tabId: string, session: TabSession, direction: 'parent' | 'child'): Promise<void> {
    this.switchTab(tabId);
    if (this.current === undefined) return;
    const next =
      direction === 'parent'
        ? await session.parentOf(this.current)
        : await session.firstChildOf(this.current);
    if (next !== undefined) await this.show(session, next);
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
    const node = (await session.nodeAt(options.x, options.y)) ?? this.current;
    if (node === undefined) return;
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
        copyImage: (data, mimeType) => this.deps.post({ type: 'copyImage', data, mimeType }),
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
  async copySelection(): Promise<void> {
    if (!this.selection.length) return;
    await this.copy(this.selection.map((s) => s.details));
    this.selection = [];
    this.postSelection();
  }

  async stop(session?: TabSession): Promise<void> {
    await session?.hideHighlight();
    this.current = undefined;
    this.pendingHover = undefined;
    this.selection = [];
    if (this.tabId) {
      this.deps.post({ type: 'inspectHover', tabId: this.tabId, hover: undefined });
      this.postSelection();
    }
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
      await vscode.env.clipboard.writeText(text);
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

function pick(styles: Record<string, string>, keys: string[]): Record<string, string> {
  return Object.fromEntries(keys.filter((k) => styles[k]).map((k) => [k, styles[k]!]));
}

/** Turns a component's source file (often a dev-server URL) into a workspace path. */
export function workspaceComponentPath(details: ElementDetails): void {
  if (!details.component?.file) return;
  const roots = (vscode.workspace.workspaceFolders ?? []).map((f) => f.uri.fsPath);
  details.component.file = normalizeSourcePath(details.component.file, roots);
}
