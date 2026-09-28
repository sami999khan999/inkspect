import '@vscode/codicons/dist/codicon.css';
import '@inkspect/shared/ui/ui.css';
import './styles.css';
import './tools/tools.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Missing #root element');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
