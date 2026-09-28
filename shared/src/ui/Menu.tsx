import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export type MenuItem =
  | {
      label: string;
      icon?: string;
      /** An image (a favicon) shown instead of the codicon. */
      image?: string;
      shortcut?: string;
      disabled?: boolean;
      onSelect: () => void;
      /** Items of a submenu, opened on hover or with the Right arrow (built when opened). */
      submenu?: () => MenuItem[];
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

/**
 * A context menu at a point, with cascading submenus. Closes on outside click, Escape (Left
 * closes only a submenu), window blur or resize. Arrow keys move; Right/Enter open a submenu.
 */
export function Menu({ menu, onClose }: MenuProps) {
  const ref = useRef<HTMLDivElement>(null);

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

  return (
    <div ref={ref} className="menu-root" onContextMenu={(event) => event.preventDefault()}>
      <MenuList items={menu.items} x={menu.x} y={menu.y} onClose={onClose} focusFirst />
    </div>
  );
}

interface MenuListProps {
  items: MenuItem[];
  x: number;
  y: number;
  onClose: () => void;
  focusFirst?: boolean;
  /** Where a submenu opens from: it flips left of this when there is no room on the right. */
  parent?: DOMRect;
  /** Closes this submenu and returns focus to its item. */
  onBack?: () => void;
}

function MenuList({ items, x, y, onClose, focusFirst, parent, onBack }: MenuListProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<{ index: number; rect: DOMRect } | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep the menu inside the window (submenus flip to the left of their parent).
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    let left = x;
    if (parent && x + rect.width > innerWidth - 4) left = parent.left - rect.width + 2;
    element.style.left = `${Math.max(4, Math.min(left, innerWidth - rect.width - 4))}px`;
    element.style.top = `${Math.max(4, Math.min(y, innerHeight - rect.height - 4))}px`;
    if (focusFirst) {
      element
        .querySelector<HTMLButtonElement>(':scope > button:not(:disabled)')
        ?.focus({ preventScroll: true });
    }
  }, [x, y, parent, focusFirst]);

  useEffect(() => () => clearTimeout(hoverTimer.current), []);

  const buttons = () => [
    ...(ref.current?.querySelectorAll<HTMLButtonElement>(':scope > button:not(:disabled)') ?? []),
  ];
  const openSubmenu = (index: number, button: HTMLElement, focus: boolean) => {
    clearTimeout(hoverTimer.current);
    setOpen({ index, rect: button.getBoundingClientRect() });
    if (focus) {
      // Focus the submenu's first item once it has rendered.
      setTimeout(() =>
        ref.current
          ?.querySelector<HTMLButtonElement>(':scope > .menu button:not(:disabled)')
          ?.focus({ preventScroll: true }),
      );
    }
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.target instanceof HTMLElement && event.target.closest('.menu') !== ref.current) {
      return; // A submenu handles its own keys.
    }
    const list = buttons();
    const index = list.indexOf(document.activeElement as HTMLButtonElement);
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      list[(index + (event.key === 'ArrowDown' ? 1 : -1) + list.length) % list.length]?.focus();
    } else if (event.key === 'ArrowLeft' && onBack) {
      event.preventDefault();
      event.stopPropagation();
      onBack();
    } else if (event.key === 'ArrowRight') {
      const button = list[index];
      const item = button && items[Number(button.dataset.index)];
      if (item && 'submenu' in item && item.submenu) {
        event.preventDefault();
        openSubmenu(Number(button.dataset.index), button, true);
      }
    }
  };

  const openItem = open ? items[open.index] : undefined;
  const subItems = openItem && 'submenu' in openItem ? openItem.submenu?.() : undefined;

  return (
    <div ref={ref} className="menu" role="menu" style={{ left: x, top: y }} onKeyDown={onKeyDown}>
      {items.map((item, index) =>
        'separator' in item ? (
          <div key={index} className="menu-separator" role="separator" />
        ) : (
          <button
            key={index}
            type="button"
            role="menuitem"
            data-index={index}
            aria-haspopup={item.submenu ? 'menu' : undefined}
            aria-expanded={item.submenu ? open?.index === index : undefined}
            className={`menu-item${open?.index === index ? ' expanded' : ''}`}
            disabled={item.disabled}
            onPointerEnter={(event) => {
              clearTimeout(hoverTimer.current);
              const button = event.currentTarget;
              hoverTimer.current = setTimeout(
                () => (item.submenu ? openSubmenu(index, button, false) : setOpen(null)),
                item.submenu ? 120 : 250,
              );
            }}
            onClick={(event) => {
              if (item.submenu) {
                openSubmenu(index, event.currentTarget, event.detail === 0);
                return;
              }
              onClose();
              item.onSelect();
            }}
          >
            {item.image ? (
              <img className="menu-image" src={item.image} alt="" referrerPolicy="no-referrer" />
            ) : (
              <span className={`codicon codicon-${item.icon ?? 'blank'}`} aria-hidden="true" />
            )}
            <span className="menu-label">{item.label}</span>
            {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
            {item.submenu && (
              <span className="codicon codicon-chevron-right menu-arrow" aria-hidden="true" />
            )}
          </button>
        ),
      )}
      {open && subItems && (
        <MenuList
          key={open.index}
          items={
            subItems.length ? subItems : [{ label: '(empty)', disabled: true, onSelect: () => {} }]
          }
          x={open.rect.right - 2}
          y={open.rect.top - 5}
          parent={open.rect}
          onClose={onClose}
          onBack={() => {
            setOpen(null);
            ref.current
              ?.querySelector<HTMLButtonElement>(`:scope > button[data-index="${open.index}"]`)
              ?.focus();
          }}
        />
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
