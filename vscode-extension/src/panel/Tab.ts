import type { TabSession } from '../browser/TabSession';
import { internalTitle, internalUrl } from '../shared/internalPages';
import type { Shape } from '../shared/annotations';
import { DEFAULT_EMULATION, type EmulationSettings } from '../shared/devices';
import type { InternalPage, JsDialog, SecurityState, TabState } from '../shared/protocol';

let nextId = 1;

/**
 * One browser tab. A tab normally has a `TabSession` (a live Chromium page). Discarded tabs and
 * tabs showing an internal page may have none; they keep their URL and title so they can reload.
 */
export class Tab {
  readonly id = `tab-${nextId++}`;
  url = '';
  title = '';
  favicon?: string;
  loading = false;
  progress = 0;
  canGoBack = false;
  canGoForward = false;
  security: SecurityState = 'unknown';
  zoom = 1;
  audible = false;
  pinned = false;
  crashed = false;
  fullscreen = false;
  internalPage?: InternalPage;
  dialog?: JsDialog;
  /** When the tab was last activated (for choosing which background tabs to discard). */
  lastActive = 0;
  /** The tab has been closed and must not get a new session. */
  closed = false;
  /** Private tab: separate cookies and storage, no history, not restored. */
  private = false;
  emulation: EmulationSettings = DEFAULT_EMULATION;
  /** Drawings on the page (document coordinates). */
  annotations: Shape[] = [];
  /** The page (`drawingPageKey`) the drawings belong to. */
  drawingPage?: string;
  /** A private tab's drawings of the pages it left (kept in memory only). */
  privateDrawings = new Map<string, Shape[]>();
  /** Where the sections drawings are anchored to were last seen (JSON), and a measure running. */
  sectionsSent = '';
  measuringSections = false;
  /** A frame came while measuring: measure again after. */
  measureAgain = false;

  session?: TabSession;
  /** Set while a session is being created for this tab. */
  sessionPromise?: Promise<void>;
  /** Removes the listeners the owning panel added to `session`. */
  unbind?: () => void;

  showInternalPage(page: InternalPage): void {
    this.internalPage = page;
    this.url = internalUrl(page);
    this.title = internalTitle(page);
    this.security = 'internal';
    this.favicon = undefined;
    this.loading = false;
    this.progress = 0;
    this.crashed = false;
  }

  /** An internal page shown on top of a real page can go back to that page. */
  get hasPageBehind(): boolean {
    return !!this.session && this.session.url !== '' && this.session.url !== 'about:blank';
  }

  toState(bookmarkId?: string): TabState {
    return {
      bookmarkId,
      private: this.private,
      emulation: this.emulation,
      id: this.id,
      url: this.url,
      title: this.title || this.url,
      favicon: this.favicon,
      loading: this.loading,
      progress: this.progress,
      canGoBack: this.internalPage ? this.hasPageBehind : this.canGoBack,
      canGoForward: this.internalPage ? false : this.canGoForward,
      security: this.security,
      zoom: this.zoom,
      audible: this.audible,
      pinned: this.pinned,
      crashed: this.crashed,
      fullscreen: this.fullscreen,
      internalPage: this.internalPage,
      dialog: this.dialog,
    };
  }
}
