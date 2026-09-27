import { BrowserPanel, type Services } from '../panel/BrowserPanel';
import { lastPickedElement } from './chat';
import type { BrowserAgentApi, ScreenshotResult } from './tools';

/** The browser as seen by AI agents: the active tab of the active browser window. */
export class BrowserAgent implements BrowserAgentApi {
  constructor(private readonly services: Services) {}

  private panel(): BrowserPanel {
    const panel = BrowserPanel.active();
    if (!panel) throw new Error('No browser is open. Open a page with browser_navigate first.');
    return panel;
  }

  async navigate(url: string): Promise<{ url: string; title: string }> {
    const panel = BrowserPanel.active() ?? BrowserPanel.create(this.services);
    return panel.agentNavigate(url);
  }

  screenshot(mode: 'viewport' | 'fullPage', selector?: string): Promise<ScreenshotResult> {
    return this.panel().agentScreenshot(mode, selector);
  }

  element(selector: string): Promise<string> {
    return this.panel().agentElement(selector);
  }

  devText(kind: 'errors' | 'failedRequests' | 'context'): Promise<string> {
    return this.panel().agentDevText(kind);
  }

  pageText(maxLength: number): Promise<string> {
    return this.panel().agentPageText(maxLength);
  }

  selection(): string | undefined {
    return lastPickedElement();
  }
}
