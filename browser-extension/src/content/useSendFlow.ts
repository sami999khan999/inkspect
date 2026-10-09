// What happens after every capture in the toolbar: it is saved at once (into the project the
// browser helper, or VS Code over the WebSocket link, suggests for the page), then the send
// dialog (SendModal) offers where it goes. One flow for screenshots, elements and text.
import { useCallback, useRef, useState } from 'react';
import type { CaptureKind } from '@inkspect/shared/bridge';
import type { HubTarget, Project } from '@inkspect/shared/hub';
import { sentText } from '@inkspect/shared/sendModal';
import type { Harness } from '@inkspect/shared/targets';
import { toBackground, type BridgeStatus } from '../messages';
import { thumbnailOf } from './capture';
import { copyImage, copyText, screenshotName } from './page';

/** One capture as taken. */
export interface Taken {
  kind: CaptureKind;
  title: string;
  text?: string;
  /** A PNG data URL. */
  image?: string;
  group?: string;
  groupIndex?: number;
}

/** What the send dialog shows. */
export interface Offer {
  title: string;
  /** A second line ("Copied to the clipboard."). */
  detail?: string;
  taken: Taken[];
  images: string[];
  /** Where it was saved, and the items' ids there. */
  project?: { path: string; name: string };
  ids?: string[];
  projects: Project[];
  targets: HubTarget[];
  defaultTarget?: string;
  harnesses: Harness[];
  /** Why there is nowhere to send (nothing linked). */
  empty?: string;
  status?: { tone: 'busy' | 'ok' | 'error'; text: string };
}

const base64Of = (dataUrl: string) => dataUrl.replace(/^data:image\/\w+;base64,/, '');

function projectView(project: Project | undefined, path: string) {
  return { path, name: project?.name ?? path.split('/').pop() ?? path };
}

/** The toolbar's capture flow: `capture` saves and opens the dialog; the rest are its choices. */
export function useSendFlow(link: BridgeStatus) {
  const [offer, setOfferState] = useState<Offer | null>(null);
  const current = useRef<Offer | null>(null);
  /** The capture being saved: a newer one, or closing the dialog, outdates it. */
  const run = useRef(0);
  const setOffer = useCallback((next: Offer | null) => {
    current.current = next;
    setOfferState(next);
  }, []);
  const update = useCallback(
    (change: Partial<Offer>) => {
      if (current.current) setOffer({ ...current.current, ...change });
    },
    [setOffer],
  );

  const capture = useCallback(
    async (taken: Taken[], title: string, detail?: string) => {
      if (!taken.length) return;
      const images = taken.flatMap((t) => (t.image ? [t.image] : []));
      const base: Offer = {
        title,
        detail,
        taken,
        images,
        projects: [],
        targets: [],
        harnesses: [],
      };
      const mine = ++run.current;
      // Closed meanwhile (Esc), or another capture took its place: it is still saved, only the
      // dialog isn't updated.
      const outdated = () => run.current !== mine || !current.current;
      if (link.projects) {
        setOffer({ ...base, status: { tone: 'busy', text: 'Saving…' } });
        // Saved into the project suggested for this page (Change project moves it).
        const found = await toBackground({ type: 'projects', url: location.href });
        const projects = found.ok ? (found.projects ?? []) : [];
        const path = found.ok ? (found.suggested ?? projects[0]?.path) : undefined;
        if (!path) {
          if (outdated()) return;
          setOffer({
            ...base,
            projects,
            status: {
              tone: 'error',
              text: found.ok
                ? 'Not saved: no project. Open one in VS Code, or start an agent in agentmux.'
                : found.error,
            },
          });
          return;
        }
        const thumbs = await Promise.all(
          taken.map((t) => (t.image ? thumbnailOf(t.image) : undefined)),
        );
        const saved = await toBackground({
          type: 'saveCapture',
          project: path,
          url: location.href,
          captures: taken.map((t, index) => ({
            kind: t.kind,
            title: t.title,
            text: t.text,
            group: t.group,
            groupIndex: t.groupIndex,
            image: t.image ? base64Of(t.image) : undefined,
            thumb: thumbs[index],
          })),
        });
        if (outdated()) return;
        const project = projects.find((p) => p.path === path);
        setOffer({
          ...base,
          project: projectView(project, path),
          ids: saved.ok ? saved.ids : undefined,
          projects,
          targets: project?.targets ?? [],
          defaultTarget: project?.defaultTarget,
          harnesses: project?.harnesses ?? [],
          status: saved.ok ? undefined : { tone: 'error', text: saved.error },
        });
        return;
      }
      // Nothing linked: copy or download only.
      setOffer({
        ...base,
        empty: 'Not linked: install the browser helper or link VS Code to send it to an agent.',
      });
    },
    [link.projects, setOffer],
  );

  const sendTo = useCallback(
    async (target: string, open: boolean, prompt?: string) => {
      const sending = current.current;
      if (!sending) return;
      const mine = run.current;
      update({ status: { tone: 'busy', text: 'Sending…' } });
      const reply =
        sending.ids && sending.project
          ? await toBackground({
              type: 'sendSaved',
              project: sending.project.path,
              ids: sending.ids,
              target,
              open,
              prompt,
            })
          : ({ ok: false, error: 'Not saved, so nothing can be sent.' } as const);
      // Closed meanwhile, or another capture took its place.
      if (run.current !== mine || !current.current) return;
      if (!reply.ok) {
        update({ status: { tone: 'error', text: reply.error } });
        return;
      }
      const chosen = sending.targets.find((t) => t.id === target);
      update({ status: { tone: 'ok', text: sentText(chosen, reply.sentTo ?? 'the agent') } });
      // It shows a moment, then closes.
      setTimeout(() => {
        if (run.current === mine && current.current?.status?.tone === 'ok') setOffer(null);
      }, 900);
    },
    [setOffer, update],
  );

  const moveTo = useCallback(
    async (path: string) => {
      const moving = current.current;
      if (!moving?.ids || !moving.project || path === moving.project.path) return;
      const mine = run.current;
      const moved = await toBackground({
        type: 'moveSaved',
        project: moving.project.path,
        to: path,
        ids: moving.ids,
      });
      if (run.current !== mine) return;
      if (!moved.ok) {
        update({ status: { tone: 'error', text: moved.error } });
        return;
      }
      const found = await toBackground({ type: 'projects', url: location.href });
      if (run.current !== mine) return;
      const projects = found.ok ? (found.projects ?? moving.projects) : moving.projects;
      const project = projects.find((p) => p.path === path);
      update({
        project: projectView(project, path),
        projects,
        targets: project?.targets ?? [],
        defaultTarget: project?.defaultTarget,
        harnesses: project?.harnesses ?? [],
        status: undefined,
      });
    },
    [update],
  );

  const copyAgain = useCallback(async () => {
    const shown = current.current;
    if (!shown) return;
    const ok = shown.images[0]
      ? await copyImage(shown.images[0])
      : await copyText(shown.taken.map((t) => t.text ?? '').join('\n\n'));
    update({
      status: ok ? { tone: 'ok', text: 'Copied' } : { tone: 'error', text: 'Could not copy' },
    });
  }, [update]);

  const download = useCallback(() => {
    const shown = current.current;
    if (!shown) return;
    if (shown.images.length) {
      for (const dataUrl of shown.images) {
        void toBackground({ type: 'download', dataUrl, filename: `Inkspect/${screenshotName()}` });
      }
    } else {
      const text = shown.taken.map((t) => t.text ?? '').join('\n\n');
      const dataUrl = `data:text/markdown;base64,${btoa(unescape(encodeURIComponent(text)))}`;
      void toBackground({
        type: 'download',
        dataUrl,
        filename: `Inkspect/${screenshotName().replace(/\.png$/, '.md')}`,
      });
    }
    update({ status: { tone: 'ok', text: 'Downloading' } });
  }, [update]);

  const close = useCallback(() => {
    run.current++;
    setOffer(null);
  }, [setOffer]);

  return { offer, capture, sendTo, moveTo, copyAgain, download, close };
}
