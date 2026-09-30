import type { InspectPurpose, Rect } from '@shared/protocol';
import { PickerHint } from '@inkspect/shared/ui/PickerHint';
import { SelectionBar, type SelectionAction } from '@inkspect/shared/ui/SelectionBar';
import { useShortcutMap } from '../shortcuts';
import type { ViewportMapper } from './Viewport';

interface InspectOverlayProps {
  mapper: ViewportMapper;
  purpose: InspectPurpose;
  /** Multi-selection (Shift+click), in document CSS pixels. */
  selection: Rect[];
  /** A choice on the bar over the multi-selection. */
  onSelectionAction: (action: SelectionAction) => void;
}

/**
 * Element picker overlay: a hint and the numbered multi-selection boxes. The highlight and the
 * tooltip under the pointer are drawn by Chrome itself (its inspect mode), like in DevTools.
 */
export function InspectOverlay({
  mapper,
  purpose,
  selection,
  onSelectionAction,
}: InspectOverlayProps) {
  const map = useShortcutMap();
  return (
    <>
      <PickerHint
        className="inspect-hint"
        style={{
          left: mapper.bounds.left + mapper.bounds.width / 2,
          top: mapper.bounds.top + mapper.bounds.height - 12,
        }}
        purpose={purpose}
        map={map}
        altLabel="with screenshot"
        helpKey
      />
      {selection.length > 0 && (
        <SelectionBar
          className="inspect-selection-bar"
          style={{
            left: mapper.bounds.left + mapper.bounds.width / 2,
            top: mapper.bounds.top + mapper.bounds.height - 90,
          }}
          count={selection.length}
          map={map}
          onAction={onSelectionAction}
        />
      )}
      {selection.map((rect, index) => {
        const point = mapper.toLocal(rect.x - mapper.scroll.x, rect.y - mapper.scroll.y);
        return (
          <div
            key={index}
            className="selection-box"
            style={{
              left: point.x,
              top: point.y,
              width: rect.width * mapper.scale,
              height: rect.height * mapper.scale,
            }}
          >
            <span className="selection-badge">{index + 1}</span>
          </div>
        );
      })}
    </>
  );
}
