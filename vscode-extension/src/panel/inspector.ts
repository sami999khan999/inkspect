import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import * as vscode from 'vscode';
import { copyText } from '../features/clipboard';
import type { TabSession } from '../browser/TabSession';
import { getConfig } from '../config';
import { deliverScreenshot, localWorkspaceFolder } from '../features/screenshots';
import { captureAndSend, rememberPick, sendContextItems } from '../agent/chat';
import { addContext, type ContextInput } from '../agent/contextTray';
import { normalizeSourcePath } from '../features/sourcePaths';
import { elementLabel, formatDetails, type ElementDetails } from '../shared/elementInfo';
import type { HostToWebview, InspectPurpose, Rect } from '../shared/protocol';

type Details = ElementDetails & { ancestry: string[]; scroll: { x: number; y: number } };

/** Picked elements go straight to the default agent (the A key) instead of the send dialog. */
type SendTo = 'agent';

interface InspectorDeps {
  post: (message: HostToWebview) => void;
  copyImage: (bytes: Uint8Array, mimeType: string) => void;
  toast: (message: string) => void;
  globalStorage: string;
  logger: vscode.LogOutputChannel;
}

/**
 * The element picker for one browser window. Hovering is Chrome's own inspect mode (native
 * highlight and tooltip); this class handles clicks (capture details for AI agents, Alt+click
 * element screenshots, Shift+click multi-selection) and moving to the parent or child with the
 * arrow keys. Every capture is copied and saved, then the send dialog offers where it goes.
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
   * Click: capture the element's details. Alt+click: a screenshot of it instead (also what a
   * click does when picking for a screenshot). Shift adds it to the multi-selection.
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
      url: string;
    },
  ): Promise<void> {
    this.switchTab(tabId);
    const node = await session.inspectAt(options.x, options.y);
    if (node === undefined) return;
    this.current = undefined;
    const shot = options.purpose === 'screenshot';
    if (shot || (options.screenshot && !options.add)) {
      if (shot) {
        await this.stop(session);
        this.deps.post({ type: 'setInspect', purpose: null });
      }
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
    const details = await session.elementDetails(node, getConfig().inspectorMaxHtml);
    if (!details) return;
    workspaceComponentPath(details);
    if (options.add) {
      if (!this.selection.some((s) => s.nodeId === node))
        this.selection.push({ nodeId: node, details });
      this.postSelection();
      return;
    }
    await this.copy([details]);
  }

  /**
   * Enter: copies the multi-selection, or the element reached with the pointer or arrow keys.
   * With `send`, sends it instead (`agent`: the default agent, as the A key does).
   */
  async copySelection(session: TabSession, send?: SendTo): Promise<void> {
    if (this.selection.length) {
      await this.copy(
        this.selection.map((s) => s.details),
        send,
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
    await this.copy([details], send);
  }

  /**
   * The bar over the multi-selection: capture the details, or screenshot every selected element.
   * The selection ends with either.
   */
  async selectionAction(
    session: TabSession,
    action: 'copy' | 'screenshot' | 'clear',
    url: string,
  ): Promise<void> {
    const selected = this.selection;
    this.selection = [];
    this.postSelection();
    if (!selected.length || action === 'clear') return;
    if (action === 'screenshot') {
      const format = getConfig().screenshotFormat;
      // Every screenshot first: an element that can't be captured (gone from the page) is left
      // out, and the group is what was captured.
      const shots: { bytes: Uint8Array; details: Details }[] = [];
      for (const { nodeId, details } of selected) {
        try {
          shots.push({
            bytes: await session.screenshot('element', { format, backendNodeId: nodeId }),
            details,
          });
        } catch (error) {
          this.deps.logger.warn(`Element screenshot failed: ${String(error)}`);
        }
      }
      if (shots.length < selected.length) {
        this.deps.toast(`${selected.length - shots.length} of the elements could not be captured.`);
      }
      // One group in the Saved list, sent or offered together.
      const group = shots.length > 1 ? randomUUID() : undefined;
      for (const [index, { bytes, details }] of shots.entries()) {
        await deliverScreenshot({
          bytes,
          url,
          format,
          globalStorage: this.deps.globalStorage,
          copyImage: this.deps.copyImage,
          label: `Element ${elementLabel(details)}`,
          group: group && { id: group, index, count: shots.length },
        });
      }
      return;
    }
    await this.copy(selected.map((s) => s.details));
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

  /**
   * Copies the details and saves them (one item per element; several share a group), which
   * offers them in the send dialog. `agent` sends them to the default agent instead.
   */
  private async copy(elements: Details[], send?: SendTo): Promise<void> {
    const config = getConfig();
    const markdown = formatDetails(elements, 'markdown', config.inspectorFields);
    rememberPick(markdown);
    const first = elements[0]!;
    const title = elements.length === 1 ? elementLabel(first) : `${elements.length} elements`;
    const group = elements.length > 1 ? randomUUID() : undefined;
    const inputs: ContextInput[] = elements.map((element) => ({
      kind: 'element',
      title: elementLabel(element),
      // The component only when it is the user's code (it has a source file), not a
      // framework's internals (Next.js' SegmentViewNode); else the page.
      detail: element.component?.file ? element.component.name : pageHost(element.pageUrl),
      text: group ? formatDetails([element], 'markdown', config.inspectorFields) : markdown,
      url: element.pageUrl,
      group,
    }));
    if (send) {
      const items = inputs.flatMap((input) => addContext(input, { silent: true }) ?? []);
      if (items.length) await sendContextItems(items);
      else await captureAndSend({ ...inputs[0]!, title, text: markdown });
    } else {
      await copyText(formatDetails(elements, config.inspectorCopyFormat, config.inspectorFields));
      for (const input of inputs) addContext(input);
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
