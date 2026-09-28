import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { findNode, folderList, type BookmarkRoots } from '@shared/bookmarks';
import { Button } from '@inkspect/shared/ui/Button';
import { Field } from '@inkspect/shared/ui/Field';
import { isInPopup } from '@inkspect/shared/ui/popover';
import { Select } from '@inkspect/shared/ui/Select';
import { TextField } from '@inkspect/shared/ui/TextField';
import { postToHost } from '../vscode';

interface BookmarkEditorProps {
  roots: BookmarkRoots;
  /** The bookmark to edit; undefined while a new bookmark is still being saved. */
  nodeId: string | undefined;
  anchor: { x: number; y: number };
  onClose: () => void;
}

/** Popover to rename a bookmark, move it to another folder or remove it. */
export function BookmarkEditor({ roots, nodeId, anchor, onClose }: BookmarkEditorProps) {
  const ref = useRef<HTMLFormElement>(null);
  const found = nodeId ? findNode(roots, nodeId) : undefined;
  const node = found?.node;
  const [title, setTitle] = useState<string | undefined>(undefined);
  const [folder, setFolder] = useState<string | undefined>(undefined);
  const currentTitle = title ?? node?.title ?? '';
  const currentFolder = folder ?? found?.parent?.id ?? roots.bar.id;

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const width = element.offsetWidth;
    element.style.left = `${Math.max(4, Math.min(anchor.x - width + 24, innerWidth - width - 4))}px`;
    element.style.top = `${anchor.y}px`;
  }, [anchor]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node) && !isInPopup(event)) onClose();
    };
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => window.removeEventListener('pointerdown', onPointerDown, true);
  }, [onClose]);

  const save = () => {
    if (node) {
      if (title !== undefined && title !== node.title) {
        postToHost({ type: 'bookmark', action: 'update', id: node.id, title });
      }
      if (folder !== undefined && folder !== found?.parent?.id) {
        postToHost({ type: 'bookmark', action: 'move', id: node.id, parentId: folder });
      }
    }
    onClose();
  };

  return (
    <form
      ref={ref}
      className="popover bookmark-editor"
      role="dialog"
      aria-label={node?.type === 'folder' ? 'Edit folder' : 'Edit bookmark'}
      onSubmit={(event) => {
        event.preventDefault();
        save();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onClose();
        }
      }}
    >
      <div className="popover-header">
        <span className="codicon codicon-star-full" aria-hidden="true" />
        {node?.type === 'folder' ? 'Edit folder' : node ? 'Bookmark added' : 'Saving bookmark…'}
      </div>
      <Field label="Name">
        <TextField
          value={currentTitle}
          disabled={!node}
          autoFocus
          onFocus={(event) => event.target.select()}
          onChange={(event) => setTitle(event.target.value)}
        />
      </Field>
      <Field label="Folder">
        <Select
          label="Folder"
          value={currentFolder}
          disabled={!node}
          onChange={setFolder}
          options={folderList(roots)
            .filter((f) => f.id !== node?.id)
            .map((f) => ({ value: f.id, label: f.title, icon: 'folder', indent: f.depth }))}
        />
      </Field>
      <div className="dialog-buttons">
        <Button
          variant="danger"
          icon="trash"
          disabled={!node}
          onClick={() => {
            if (node) postToHost({ type: 'bookmark', action: 'remove', id: node.id });
            onClose();
          }}
        >
          Remove
        </Button>
        <Button type="submit" variant="primary">
          Done
        </Button>
      </div>
    </form>
  );
}
