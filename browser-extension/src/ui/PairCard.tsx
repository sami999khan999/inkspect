import { Button } from '@inkspect/shared/ui/Button';
import { cx } from '@inkspect/shared/ui/popover';
import { useState } from 'react';
import type { BridgeStatus } from '../messages';
import { CodeInput } from './CodeInput';

interface PairCardProps {
  status: BridgeStatus;
  /** Pairs with a code VS Code shows: the new status (its `error` says why not), if any. */
  pair: (code: string) => Promise<BridgeStatus | undefined>;
  /** The popup's and the toolbar's smaller card. */
  compact?: boolean;
  /** Opens with the code boxes shown (the popup's "Use a code" lands here). */
  startWithCode?: boolean;
}

/**
 * Linking this browser with VS Code while it isn't linked, the same on the full page, in the
 * popup and in the toolbar: a Pair click in VS Code links it (the code is the fallback); with the
 * browser helper no pairing is needed, and it says what works without VS Code.
 */
export function PairCard({ status, pair, compact, startWithCode }: PairCardProps) {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [pairing, setPairing] = useState(false);
  const [useCode, setUseCode] = useState(!!startWithCode);
  if (status.state === 'connected') return null;

  const submit = async (value = code) => {
    if (value.length !== 6 || pairing) return;
    setPairing(true);
    setMessage('');
    const result = await pair(value).catch(() => undefined);
    setPairing(false);
    if (!result) {
      setMessage('The extension did not answer. Reload it and try again.');
      return;
    }
    setMessage(result.error ?? '');
    if (result.state === 'connected') setCode('');
  };

  const foot = (
    <p className="card-foot">
      <span className="codicon codicon-lock" aria-hidden="true" />
      The link only talks to VS Code on this computer, and only after pairing (or through the
      browser helper VS Code installs).
    </p>
  );

  if (status.via === 'hub') {
    return (
      <div className={cx('card', 'pair-card', compact && 'compact')}>
        <p className="pair-lead">
          <span className="codicon codicon-plug" aria-hidden="true" />
          <span>
            Linked through the browser helper: no pairing needed. VS Code isn't running, so sends to
            its terminals and chat wait for it; captures still save into your projects, and agentmux
            agents still get them.
          </span>
        </p>
      </div>
    );
  }

  if (status.state !== 'unpaired') {
    return (
      <div className={cx('card', 'pair-card', compact && 'compact')}>
        <p className="pair-lead">
          <span className="codicon codicon-loading codicon-modifier-spin" aria-hidden="true" />
          <span>
            Open VS Code with the VS Code Browser extension. Then click{' '}
            <b>Pair Browser Extension</b> in its <b>Browser</b> side panel.
          </span>
        </p>
        {!compact && foot}
      </div>
    );
  }

  return (
    <form
      className={cx('card', 'pair-card', compact && 'compact')}
      onSubmit={(event) => {
        event.preventDefault();
        void submit();
      }}
    >
      <p className="pair-lead">
        <span className="codicon codicon-plug" aria-hidden="true" />
        <span>
          In VS Code, click <b>Pair Browser Extension</b> in the <b>Browser</b> side panel (or{' '}
          <b>Pair</b> on its notification). No code needed: this updates by itself.
        </span>
      </p>
      {!useCode ? (
        <Button
          size="sm"
          variant="ghost"
          icon="key"
          className="use-code"
          onClick={() => setUseCode(true)}
        >
          Use a code instead
        </Button>
      ) : (
        <>
          <p className="muted">
            Run <kbd>Browser: Pair Browser Extension with a Code</kbd> in VS Code, then type the
            code it shows.
          </p>
          <div className="pair-row">
            <CodeInput
              value={code}
              onChange={setCode}
              disabled={pairing}
              onComplete={(value) => void submit(value)}
            />
            <Button
              type="submit"
              variant="primary"
              icon="link"
              className="pair-button"
              loading={pairing}
              disabled={code.length !== 6}
            >
              Pair
            </Button>
          </div>
        </>
      )}
      {message && (
        <p className="pair-message" role="alert">
          <span className="codicon codicon-error" aria-hidden="true" />
          {message}
        </p>
      )}
      {!compact && foot}
    </form>
  );
}
