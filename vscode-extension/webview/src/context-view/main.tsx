import '@vscode/codicons/dist/codicon.css';
import '@inkspect/shared/ui/ui.css';
import './context-view.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ContextApp } from './ContextApp';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <ContextApp />
  </StrictMode>,
);
