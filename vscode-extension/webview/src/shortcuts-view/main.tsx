import '@vscode/codicons/dist/codicon.css';
import '@inkspect/shared/ui/ui.css';
import { installGlassScroll } from '@inkspect/shared/glassScroll';
import './shortcuts-view.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ShortcutsApp } from './ShortcutsApp';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

installGlassScroll(document);
createRoot(container).render(
  <StrictMode>
    <ShortcutsApp />
  </StrictMode>,
);
