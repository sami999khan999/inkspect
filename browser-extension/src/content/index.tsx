// Injected into a tab when the toolbar is first opened there. Renders the toolbar into a closed
// shadow root, so the page's CSS can't reach it and it can't reach the page.
import codiconCss from '@vscode/codicons/dist/codicon.css';
import sharedCss from '@inkspect/shared/ui/ui.css';
import { createRoot } from 'react-dom/client';
import type { ToContent } from '../messages';
import { App } from './App';
import toolbarCss from './toolbar.css';

type InkspectWindow = Window & { __inkspect?: boolean };

/**
 * Icon font: `@font-face` rules don't apply inside shadow roots, so the font is registered with
 * the document from the extension's own bytes (not a URL, so the page's CSP can't block it).
 */
async function loadIconFont(): Promise<void> {
  try {
    const data = await (await fetch(chrome.runtime.getURL('codicon.ttf'))).arrayBuffer();
    const face = new FontFace('codicon', data);
    await face.load();
    document.fonts.add(face);
  } catch {
    // Icons fall back to their labels (tooltips); everything still works.
  }
}

function mount(): (signal: number) => void {
  const host = document.createElement('inkspect-toolbar');
  host.style.cssText =
    'all: initial; position: fixed; inset: 0; z-index: 2147483647; pointer-events: none; display: block;';
  // Closed, so pages can't reach in; open only in the test build.
  const shadow = host.attachShadow({ mode: __TEST__ ? 'open' : 'closed' });
  const style = document.createElement('style');
  // `@font-face` inside the shadow root would be ignored; the font is added to the document.
  style.textContent = [codiconCss.replace(/@font-face\s*{[^}]*}/g, ''), sharedCss, toolbarCss].join(
    '\n',
  );
  const container = document.createElement('div');
  shadow.append(style, container);
  document.documentElement.appendChild(host);
  void loadIconFont();
  const root = createRoot(container);
  const hideHost = () => {
    host.style.visibility = 'hidden';
    return () => void (host.style.visibility = '');
  };
  return (signal) => {
    // Pages that rebuild <html> can drop us; put the host back.
    if (!host.isConnected) document.documentElement.appendChild(host);
    root.render(<App host={host} hideHost={hideHost} toggleSignal={signal} />);
  };
}

const w = window as InkspectWindow;
if (!w.__inkspect) {
  w.__inkspect = true;
  let render: ((signal: number) => void) | undefined;
  let signal = 0;
  chrome.runtime.onMessage.addListener((message: ToContent) => {
    if (message.type !== 'toggle') return;
    render ??= mount();
    render(++signal);
  });
}
