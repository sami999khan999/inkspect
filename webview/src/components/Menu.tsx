import { useEffect, useLayoutEffect, useRef } from 'react';

export type MenuItem =
  | {
      label: string;
      icon?: string;
      shortcut?: string;
      disabled?: boolean;
      onSelect: () => void;
    }
  | { separator: true };

export interface MenuState {
  x: number;
  y: number;
  items: MenuItem[];
}

interface MenuProps {
  menu: MenuState;
  onClose: () => void;
}

/** A context menu at a point. Closes on outside click, Escape, blur or resize. */
export function Menu({ menu, onClose }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Keep the menu inside the window.
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    element.style.left = `${Math.max(4, Math.min(menu.x, innerWidth - rect.width - 4))}px`;
    element.style.top = `${Math.max(4, Math.min(menu.y, innerHeight - rect.height - 4))}px`;
    element
      .querySelector<HTMLButtonElement>('button:not(:disabled)')
      ?.focus({ preventScroll: true });
  }, [menu]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) onClose();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('blur', onClose);
    window.addEventListener('resize', onClose);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('blur', onClose);
      window.removeEventListener('resize', onClose);
    };
  }, [onClose]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    event.preventDefault();
    const buttons = [
      ...(ref.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []),
    ];
    const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
    const next =
      buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length];
    next?.focus();
  };

  return (
    <div
      ref={ref}
      className="menu"
      role="menu"
      style={{ left: menu.x, top: menu.y }}
      onKeyDown={onKeyDown}
      onContextMenu={(event) => event.preventDefault()}
    >
      {menu.items.map((item, index) =>
        'separator' in item ? (
          <div key={index} className="menu-separator" role="separator" />
        ) : (
          <button
            key={index}
            type="button"
            role="menuitem"
            className="menu-item"
            disabled={item.disabled}
            onClick={() => {
              onClose();
              item.onSelect();
            }}
          >
            <span className={`codicon codicon-${item.icon ?? 'blank'}`} aria-hidden="true" />
            <span className="menu-label">{item.label}</span>
            {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
          </button>
        ),
      )}
    </div>
  );
}

/** Removes leading, trailing and doubled separators. */
export function tidyMenu(items: MenuItem[]): MenuItem[] {
  const result: MenuItem[] = [];
  for (const item of items) {
    const isSeparator = 'separator' in item;
    const last = result.at(-1);
    if (isSeparator && (!last || 'separator' in last)) continue;
    result.push(item);
  }
  const last = result.at(-1);
  if (last && 'separator' in last) result.pop();
  return result;
}
