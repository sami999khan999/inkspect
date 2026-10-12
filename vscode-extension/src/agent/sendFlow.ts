import { randomUUID } from 'node:crypto';
import * as vscode from 'vscode';
import type { HubTarget } from '@inkspect/shared/hub';
import { HARNESS_LABELS } from '@inkspect/shared/targets';
import { errorMessage } from '../browser/logger';
import { startThread } from '../hub/router';
import { moveItems } from '../hub/store';
import type { HostToWebview, SavedOffer, WebviewToHost } from '../shared/protocol';
import { orderTargets, sentText, targetDetail } from '@inkspect/shared/sendModal';
import { sendContextFor, sendSaved } from './chat';
import type { ContextItem, ContextTray } from './contextTray';
import { knownProjects, nameOf } from './projects';

type SavedAction = Extract<WebviewToHost, { type: 'savedAction' }>;
type Post = (message: HostToWebview) => void;

/** Captures made together arrive one by one: they are offered together. */
const GATHER_MS = 200;
const KIND_PLURALS: Record<string, string> = {
  screenshot: 'screenshots',
  element: 'elements',
  recording: 'recordings',
};

/**
 * After a capture in VS Code: it is saved already (the Saved list); this offers where to send
 * it, in the browser panel's send dialog (SendModal), and carries out the choice. Without a
 * browser panel, a notification offers the same.
 */
export class SendFlow implements vscode.Disposable {
  private pending: ContextItem[] = [];
  private timer?: ReturnType<typeof setTimeout>;
  private readonly offers = new Map<
    string,
    { items: ContextItem[]; project: string; targets: readonly HubTarget[] }
  >();
  /** The last dialog offered (the integration tests read it). */
  lastOffer?: SavedOffer;
  private readonly disposables: vscode.Disposable[] = [];

  constructor(
    private readonly tray: ContextTray,
    /** Shows the dialog in the active browser panel; false when there is none. */
    private readonly show: (offer: SavedOffer) => boolean,
    private readonly logger?: vscode.LogOutputChannel,
  ) {
    this.disposables.push(
      tray.onDidCapture((item) => {
        this.pending.push(item);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => void this.flush(), GATHER_MS);
      }),
    );
  }

  private async flush(): Promise<void> {
    // A capture taken with others (each drawing, a selection) brings its whole group.
    const items: ContextItem[] = [];
    for (const item of this.pending.splice(0)) {
      for (const member of item.group ? this.tray.inGroup(item.group) : [item]) {
        if (!items.some((i) => i.id === member.id)) items.push(member);
      }
    }
    if (!items.length) return;
    try {
      const offer = await this.offer(items, items[0]!.project);
      this.lastOffer = offer;
      if (this.show(offer)) return;
      // No browser panel: a notification with the same choice.
      const choice = await vscode.window.showInformationMessage(`${offer.title} saved.`, 'Send…');
      if (choice) await this.quickSend(items);
    } catch (error) {
      this.logger?.warn(`Could not offer the capture: ${errorMessage(error)}`);
    }
  }

  /** The dialog's content for these items, in `project`. */
  private async offer(
    items: ContextItem[],
    project: string,
    id: string = randomUUID(),
    chosen?: string,
  ): Promise<SavedOffer> {
    const context = await sendContextFor(project);
    const images: SavedOffer['images'] = [];
    for (const item of items.slice(0, 4)) {
      const thumbnail = await this.tray.thumbnailOf(item);
      if (thumbnail) images.push(thumbnail);
    }
    const kinds = new Set(items.map((i) => i.kind));
    const kind = [...kinds][0]!;
    const targets = context.targets.map(
      ({ id: target, kind: k, label, detail, closed }): HubTarget => ({
        id: target,
        kind: k,
        label,
        detail,
        ...(closed ? { closed } : {}),
      }),
    );
    this.offers.set(id, { items, project, targets });
    return {
      id,
      title:
        items.length === 1
          ? items[0]!.title
          : `${items.length} ${kinds.size === 1 ? (KIND_PLURALS[kind] ?? 'captures') : 'captures'}`,
      project: { path: project, name: nameOf(project) },
      projects: await knownProjects(project),
      images,
      targets,
      defaultTarget:
        chosen && targets.some((t) => t.id === chosen) ? chosen : context.defaultTarget,
      harnesses: [...context.harnesses],
    };
  }

  /** The send dialog's choice. */
  async handle(message: SavedAction, post: Post): Promise<void> {
    const offer = this.offers.get(message.offerId);
    if (!offer) return;
    const status = (tone: 'busy' | 'ok' | 'error', text: string, close?: boolean) =>
      post({ type: 'savedStatus', offerId: message.offerId, tone, text, close });
    switch (message.action) {
      case 'send': {
        status('busy', 'Sending…');
        const sent = await sendSaved(offer.items, message.target, {
          open: message.open,
          prompt: message.prompt,
        });
        if (sent) {
          status(
            'ok',
            sentText(
              offer.targets.find((t) => t.id === message.target),
              sent,
            ),
            true,
          );
          this.offers.delete(message.offerId);
        } else status('error', 'Not sent. See the message in VS Code.');
        return;
      }
      case 'copy':
        await this.tray.copy(offer.items[0]!);
        status('ok', 'Copied');
        return;
      case 'reveal': {
        const file = offer.items.find((i) => i.file)?.file;
        if (file) await vscode.commands.executeCommand('revealFileInOS', vscode.Uri.file(file));
        return;
      }
      case 'project': {
        const to = message.project;
        if (!to || to === offer.project) return;
        const moved = moveItems(
          offer.project,
          to,
          offer.items.map((i) => i.id),
        );
        const items = this.tray.itemsIn(to, moved);
        this.tray.load();
        if (!items.length) {
          status('error', 'Could not move it.');
          return;
        }
        post({ type: 'saved', offer: await this.offer(items, to, message.offerId) });
        return;
      }
      case 'newThread': {
        const harness = message.harness;
        if (!harness) return;
        const label = HARNESS_LABELS[harness];
        status('busy', `Starting a new ${label} thread in agentmux…`);
        try {
          const thread = await startThread(
            await sendContextFor(offer.project),
            offer.project,
            harness,
          );
          // The dialog stays open and lists the new thread, chosen; nothing is sent to it.
          post({
            type: 'saved',
            offer: await this.offer(offer.items, offer.project, message.offerId, thread.id),
          });
          status('ok', `${label} started in agentmux. Enter sends to it.`);
        } catch (error) {
          status('error', errorMessage(error));
        }
        return;
      }
      case 'close':
        this.offers.delete(message.offerId);
        return;
    }
  }

  /** Where to send, as a quick pick (no browser panel to show the dialog in). */
  async quickSend(items: ContextItem[]): Promise<string | undefined> {
    const project = items[0]?.project;
    if (!project) return undefined;
    const context = await sendContextFor(project);
    const ordered = orderTargets(context.targets, context.defaultTarget);
    const pick = await vscode.window.showQuickPick(
      ordered.map((t) => ({ label: t.label, description: targetDetail(t), id: t.id })),
      { title: 'Send to', placeHolder: 'Which agent gets it?' },
    );
    return pick && sendSaved(items, pick.id);
  }

  dispose(): void {
    clearTimeout(this.timer);
    for (const d of this.disposables) d.dispose();
  }
}

let flow: SendFlow | undefined;

/** Starts offering captures (on activation). */
export function initSendFlow(...args: ConstructorParameters<typeof SendFlow>): SendFlow {
  flow = new SendFlow(...args);
  return flow;
}

/** The send dialog's coordinator, once VS Code Browser is active. */
export function sendFlow(): SendFlow | undefined {
  return flow;
}
