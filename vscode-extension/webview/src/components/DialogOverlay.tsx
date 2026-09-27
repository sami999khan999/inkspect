import { useState } from 'react';
import type { JsDialog } from '@shared/protocol';
import { originLabel } from '../format';

interface DialogOverlayProps {
  dialog: JsDialog;
  onRespond: (accept: boolean, promptText?: string) => void;
}

/** A page's alert, confirm, prompt or "leave site?" dialog. */
export function DialogOverlay({ dialog, onRespond }: DialogOverlayProps) {
  const [text, setText] = useState(dialog.defaultPrompt ?? '');
  const leaving = dialog.type === 'beforeunload';

  return (
    <div className="overlay dialog-overlay">
      <form
        className="dialog"
        role="alertdialog"
        aria-label={leaving ? 'Leave site?' : `${originLabel(dialog.url)} says`}
        onSubmit={(event) => {
          event.preventDefault();
          onRespond(true, dialog.type === 'prompt' ? text : undefined);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            onRespond(false);
          }
        }}
      >
        <div className="dialog-title">
          {leaving ? 'Leave site?' : `${originLabel(dialog.url)} says`}
        </div>
        <div className="dialog-message">
          {leaving ? 'Changes you made may not be saved.' : dialog.message}
        </div>
        {dialog.type === 'prompt' && (
          <input
            className="dialog-input"
            aria-label={dialog.message || 'Answer'}
            type="text"
            value={text}
            autoFocus
            onChange={(event) => setText(event.target.value)}
          />
        )}
        <div className="dialog-buttons">
          <button type="submit" className="button primary" autoFocus={dialog.type !== 'prompt'}>
            {leaving ? 'Leave' : 'OK'}
          </button>
          {dialog.type !== 'alert' && (
            <button type="button" className="button secondary" onClick={() => onRespond(false)}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
