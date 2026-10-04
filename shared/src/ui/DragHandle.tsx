/** Pointer and key handlers for dragging what the handle belongs to. */
export interface DragHandlers {
  onPointerDown: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerUp: (event: React.PointerEvent<HTMLElement>) => void;
  onPointerCancel: (event: React.PointerEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

interface DragHandleProps extends DragHandlers {
  label: string;
  /** While it is being dragged (the grabbing cursor, a pressed look). */
  dragging?: boolean;
  className?: string;
}

/**
 * The six-dot grip that moves a floating panel: drag it with the pointer, or focus it and use
 * the arrow keys (the handlers say how far).
 */
export function DragHandle({ label, dragging, className, ...handlers }: DragHandleProps) {
  return (
    <button
      type="button"
      className={['drag-handle', dragging && 'dragging', className].filter(Boolean).join(' ')}
      title={label}
      aria-label={label}
      {...handlers}
    >
      <span className="codicon codicon-gripper" aria-hidden="true" />
    </button>
  );
}
