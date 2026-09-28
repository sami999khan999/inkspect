import { useState } from 'react';
import { Button } from '@inkspect/shared/ui/Button';
import { TextField } from '@inkspect/shared/ui/TextField';
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
  const title = leaving ? 'Leave site?' : `${originLabel(dialog.url)} says`;

  return (
    <div className="overlay dialog-overlay">
      <form
        className="dialog"
        role="alertdialog"
        aria-label={title}
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
          <span
            className={`codicon codicon-${leaving ? 'sign-out' : dialog.type === 'alert' ? 'info' : 'question'}`}
            aria-hidden="true"
          />
          {title}
        </div>
        <div className="dialog-message">
          {leaving ? 'Changes you made may not be saved.' : dialog.message}
        </div>
        {dialog.type === 'prompt' && (
          <TextField
            className="dialog-input"
            aria-label={dialog.message || 'Answer'}
            value={text}
            autoFocus
            onChange={(event) => setText(event.target.value)}
          />
        )}
        <div className="dialog-buttons">
          {dialog.type !== 'alert' && (
            <Button variant="secondary" onClick={() => onRespond(false)}>
              {leaving ? 'Stay' : 'Cancel'}
            </Button>
          )}
          <Button type="submit" variant="primary" autoFocus={dialog.type !== 'prompt'}>
            {leaving ? 'Leave' : 'OK'}
          </Button>
        </div>
      </form>
    </div>
  );
}
