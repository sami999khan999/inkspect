import { useLayoutEffect, useRef, useState } from 'react';
import type { BookmarkNode } from '@shared/bookmarks';
import { postToHost } from '../vscode';
import type { MenuItem } from './Menu';

const DRAG_TYPE = 'application/x-vscode-browser-bookmark';

interface BookmarkBarProps {
  items: BookmarkNode[];
  barId: string;
  openMenu: (x: number, y: number, items: MenuItem[]) => void;
  /** Edit a bookmark or folder in the bookmark editor popover. */
  onEdit: (id: string, x: number, y: number) => void;
}

const open = (url: string, newTab: boolean) =>
  postToHost({ type: 'bookmark', action: 'open', url, newTab });

/** Menu listing a folder's contents; sub-folders open their own menu at the same place. */
function folderMenu(
  folder: BookmarkNode,
  x: number,
  y: number,
  openMenu: BookmarkBarProps['openMenu'],
): MenuItem[] {
  const children = folder.children ?? [];
  const items: MenuItem[] = children.map((child) =>
    child.type === 'folder'
      ? {
          label: child.title,
          icon: 'folder',
          onSelect: () => setTimeout(() => openMenu(x, y, folderMenu(child, x, y, openMenu))),
        }
      : { label: child.title, icon: 'globe', onSelect: () => open(child.url!, false) },
  );
  if (!items.length) return [{ label: '(empty)', disabled: true, onSelect: () => {} }];
  if (children.some((c) => c.type === 'bookmark')) {
    items.push(
      { separator: true },
      {
        label: 'Open all in new tabs',
        icon: 'multiple-windows',
        onSelect: () => postToHost({ type: 'bookmark', action: 'openAll', id: folder.id }),
      },
    );
  }
  return items;
}

/** Bookmarks bar under the toolbar. Items that do not fit move into the » menu. */
export function BookmarkBar({ items, barId, openMenu, onEdit }: BookmarkBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(0);

  useLayoutEffect(() => {
    const bar = ref.current;
    if (!bar) return;
    const measure = () => {
      const limit = bar.clientWidth - 32;
      const buttons = [...bar.querySelectorAll<HTMLElement>('.bookmark-item')];
      const overflowing = buttons.filter((b) => b.offsetLeft + b.offsetWidth > limit).length;
      setHidden(overflowing);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(bar);
    measure();
    return () => observer.disconnect();
  }, [items]);

  const contextMenu = (event: React.MouseEvent, node: BookmarkNode) => {
    event.preventDefault();
    const { clientX: x, clientY: y } = event;
    openMenu(x, y, [
      ...(node.type === 'bookmark'
        ? [
            { label: 'Open', icon: 'globe', onSelect: () => open(node.url!, false) },
            {
              label: 'Open in new tab',
              icon: 'link-external',
              onSelect: () => open(node.url!, true),
            },
          ]
        : [
            {
              label: 'Open all in new tabs',
              icon: 'multiple-windows',
              onSelect: () => postToHost({ type: 'bookmark', action: 'openAll', id: node.id }),
            },
          ]),
      { separator: true },
      { label: 'Edit...', icon: 'edit', onSelect: () => onEdit(node.id, x, y) },
      {
        label: 'Delete',
        icon: 'trash',
        onSelect: () => postToHost({ type: 'bookmark', action: 'remove', id: node.id }),
      },
    ]);
  };

  const overflow = hidden ? items.slice(items.length - hidden) : [];

  return (
    <div ref={ref} className="bookmark-bar" role="toolbar" aria-label="Bookmarks bar">
      {items.map((node, index) => (
        <button
          key={node.id}
          type="button"
          className="bookmark-item"
          title={node.type === 'bookmark' ? `${node.title}\n${node.url}` : node.title}
          style={index >= items.length - hidden ? { visibility: 'hidden' } : undefined}
          draggable
          onDragStart={(event) => event.dataTransfer.setData(DRAG_TYPE, node.id)}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes(DRAG_TYPE)) event.preventDefault();
          }}
          onDrop={(event) => {
            const id = event.dataTransfer.getData(DRAG_TYPE);
            const rect = event.currentTarget.getBoundingClientRect();
            const after = event.clientX > rect.left + rect.width / 2;
            if (id && id !== node.id) {
              postToHost({
                type: 'bookmark',
                action: 'move',
                id,
                parentId: barId,
                index: index + (after ? 1 : 0),
              });
            }
          }}
          onClick={(event) => {
            if (node.type === 'bookmark') {
              open(node.url!, event.ctrlKey || event.metaKey);
            } else {
              const rect = event.currentTarget.getBoundingClientRect();
              openMenu(
                rect.left,
                rect.bottom + 2,
                folderMenu(node, rect.left, rect.bottom + 2, openMenu),
              );
            }
          }}
          onAuxClick={(event) => {
            if (event.button === 1 && node.type === 'bookmark') open(node.url!, true);
          }}
          onContextMenu={(event) => contextMenu(event, node)}
        >
          {node.type === 'folder' ? (
            <span className="codicon codicon-folder" aria-hidden="true" />
          ) : node.favicon ? (
            <img className="favicon" src={node.favicon} alt="" referrerPolicy="no-referrer" />
          ) : (
            <span className="codicon codicon-globe" aria-hidden="true" />
          )}
          <span className="bookmark-title">{node.title}</span>
        </button>
      ))}
      {overflow.length > 0 && (
        <button
          type="button"
          className="icon-button bookmark-overflow"
          title="More bookmarks"
          aria-label="More bookmarks"
          onClick={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const folder: BookmarkNode = {
              id: barId,
              type: 'folder',
              title: '',
              createdAt: 0,
              children: overflow,
            };
            openMenu(
              rect.right - 200,
              rect.bottom + 2,
              folderMenu(folder, rect.right - 200, rect.bottom + 2, openMenu),
            );
          }}
        >
          <span className="codicon codicon-chevron-right" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
