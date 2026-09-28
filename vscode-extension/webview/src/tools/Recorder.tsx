import { useEffect, useRef, useState } from 'react';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import type { ShortcutHandlers } from '../shortcuts';
import { withShortcut } from '../shortcuts';
import { postToHost } from '../vscode';

/**
 * Records the page as a WebM video (the frames on the viewport canvas, as the user browses) and
 * hands it to the host, which saves it next to the screenshots. Shows a small recording bar.
 */
export function Recorder({
  tabId,
  maxSeconds,
  onDone,
  onHandlers,
}: {
  tabId: string;
  maxSeconds: number;
  onDone: () => void;
  onHandlers: (handlers: ShortcutHandlers) => void;
}) {
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const cancelled = useRef(false);
  const started = useRef(0);
  const pausedFor = useRef(0);
  const pausedAt = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [error] = useState(() =>
    typeof MediaRecorder === 'undefined' ? 'Recording is not available here.' : null,
  );

  useEffect(() => {
    const canvas = document.querySelector<HTMLCanvasElement>(
      '.viewport:not(.hidden) .viewport-canvas',
    );
    if (error) return;
    if (!canvas) {
      onDone();
      return;
    }
    const type = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find((t) =>
      MediaRecorder.isTypeSupported(t),
    );
    const media = new MediaRecorder(
      canvas.captureStream(30),
      type ? { mimeType: type } : undefined,
    );
    media.ondataavailable = (event) => {
      if (event.data.size) chunks.current.push(event.data);
    };
    media.onstop = async () => {
      if (!cancelled.current && chunks.current.length) {
        const blob = new Blob(chunks.current, { type: 'video/webm' });
        const seconds = (performance.now() - started.current - pausedFor.current) / 1000;
        postToHost({
          type: 'saveRecording',
          tabId,
          data: new Uint8Array(await blob.arrayBuffer()),
          seconds,
        });
      }
      onDone();
    };
    media.start(1000);
    recorder.current = media;
    started.current = performance.now();
    const timer = setInterval(() => {
      if (media.state !== 'recording') return;
      const seconds = (performance.now() - started.current - pausedFor.current) / 1000;
      setElapsed(seconds);
      if (seconds >= maxSeconds) media.stop();
    }, 250);
    return () => {
      clearInterval(timer);
      if (media.state !== 'inactive') {
        cancelled.current = true;
        media.stop();
      }
    };
    // Recording starts once per mount (per tab); later prop changes don't restart it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stop = () => recorder.current?.state !== 'inactive' && recorder.current?.stop();
  const cancel = () => {
    cancelled.current = true;
    stop();
  };
  const togglePause = () => {
    const media = recorder.current;
    if (!media) return;
    if (media.state === 'recording') {
      media.pause();
      pausedAt.current = performance.now();
      setPaused(true);
    } else if (media.state === 'paused') {
      pausedFor.current += performance.now() - pausedAt.current;
      media.resume();
      setPaused(false);
    }
  };

  useEffect(() => {
    onHandlers({ 'record.stop': stop, 'record.pause': togglePause, 'record.cancel': cancel });
  });

  const time = `${Math.floor(elapsed / 60)}:${String(Math.floor(elapsed % 60)).padStart(2, '0')}`;
  return (
    <div className="record-bar" role="status" aria-live="polite">
      {error ? (
        <span>{error}</span>
      ) : (
        <>
          <span className={`record-dot${paused ? ' paused' : ''}`} aria-hidden="true" />
          <span className="record-time">
            {paused ? 'Paused' : 'Recording'} {time}
          </span>
          <IconButton
            icon={paused ? 'debug-continue' : 'debug-pause'}
            label={withShortcut(paused ? 'Resume' : 'Pause', 'record.pause')}
            className="small"
            onClick={togglePause}
          />
          <IconButton
            icon="debug-stop"
            label={withShortcut('Stop and save', 'record.stop')}
            className="small"
            onClick={stop}
          />
        </>
      )}
      <IconButton
        icon="close"
        label={withShortcut('Cancel', 'record.cancel')}
        className="small"
        onClick={error ? onDone : cancel}
      />
    </div>
  );
}
