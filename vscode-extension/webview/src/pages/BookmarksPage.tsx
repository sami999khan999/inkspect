import { useState, type ReactElement } from 'react';
import {
  bookmarkLabel,
  folderList,
  searchBookmarks,
  type BookmarkNode,
  type BookmarkRoots,
} from '@shared/bookmarks';
import { Button } from '@inkspect/shared/ui/Button';
import { IconButton } from '@inkspect/shared/ui/IconButton';
import { Select } from '@inkspect/shared/ui/Select';
import { TextField } from '@inkspect/shared/ui/TextField';
import { postToHost } from '../vscode';
import { EmptyState, PageLayout, SiteIcon } from './PageLayout';

interface BookmarksPageProps {
  roots: BookmarkRoots | undefined;
}

/** vb://bookmarks: browse, search, edit, move and delete bookmarks; import and export. */
export function BookmarksPage({ roots }: BookmarksPageProps) {
  const [query, setQuery] = useState('');
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<string | null>(null);

  if (!roots) return <div className="internal-page" />;
  const folders = folderList(roots);

  const toggle = (id: string) =>
    setCollapsed((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const row = (node: BookmarkNode, depth: number, parentId?: string) => (
    <BookmarkRow
      key={node.id}
      node={node}
      depth={depth}
      parentId={parentId}
      folders={folders}
      collapsed={collapsed.has(node.id)}
      editing={editing === node.id}
      onToggle={() => toggle(node.id)}
      onEdit={(on) => setEditing(on ? node.id : null)}
    />
  );

  const tree = (folder: BookmarkNode, depth: number): ReactElement[] => [
    row(folder, depth),
    ...(collapsed.has(folder.id)
      ? []
      : (folder.children ?? []).flatMap((child) =>
          child.type === 'folder' ? tree(child, depth + 1) : [row(child, depth + 1, folder.id)],
        )),
  ];

  const results = query.trim() ? searchBookmarks(roots, query) : undefined;

  return (
    <PageLayout
      name="bookmarks"
      icon="bookmark"
      title="Bookmarks"
      description="Synced with linked browsers when the Inkspect browser extension is paired."
      actions={
        <>
          <Button
            icon="new-folder"
            onClick={() =>
              postToHost({
                type: 'bookmark',
                action: 'addFolder',
                parentId: roots.other.id,
                title: 'New folder',
              })
            }
          >
            New folder
          </Button>
          <Button
            icon="cloud-download"
            onClick={() => postToHost({ type: 'bookmark', action: 'import' })}
          >
            Import…
          </Button>
          <Button icon="export" onClick={() => postToHost({ type: 'bookmark', action: 'export' })}>
            Export…
          </Button>
        </>
      }
      toolbar={
        <TextField
          size="lg"
          icon="search"
          type="search"
          value={query}
          placeholder="Search bookmarks"
          aria-label="Search bookmarks"
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
        />
      }
    >
      {results?.length === 0 ? (
        <EmptyState icon="search" title="No matching bookmarks">
          Try a different search.
        </EmptyState>
      ) : (
        <div className="card list-card bookmark-tree" role="tree" aria-label="Bookmarks">
          {results
            ? results.map((node) => row(node, 0))
            : [...tree(roots.bar, 0), ...tree(roots.other, 0)]}
        </div>
      )}
    </PageLayout>
  );
}

interface BookmarkRowProps {
  node: BookmarkNode;
  depth: number;
  parentId?: string;
  folders: { id: string; title: string; depth: number }[];
  collapsed: boolean;
  editing: boolean;
  onToggle: () => void;
  onEdit: (editing: boolean) => void;
}

function BookmarkRow({
  node,
  depth,
  folders,
  collapsed,
  editing,
  onToggle,
  onEdit,
}: BookmarkRowProps) {
  const isRoot = node.id === 'bar' || node.id === 'other';
  const [title, setTitle] = useState(node.title);
  const [url, setUrl] = useState(node.url ?? '');

  if (editing) {
    return (
      <form
        className="list-row editing"
        style={{ paddingLeft: 8 + depth * 18 }}
        onSubmit={(event) => {
          event.preventDefault();
          postToHost({
            type: 'bookmark',
            action: 'update',
            id: node.id,
            title,
            url: node.type === 'bookmark' ? url : undefined,
          });
          onEdit(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape') onEdit(false);
        }}
      >
        <TextField
          size="sm"
          className="edit-title"
          value={title}
          autoFocus
          aria-label="Name"
          onChange={(e) => setTitle(e.target.value)}
        />
        {node.type === 'bookmark' && (
          <TextField
            size="sm"
            className="edit-url"
            value={url}
            aria-label="URL"
            onChange={(e) => setUrl(e.target.value)}
          />
        )}
        <Button type="submit" size="sm" variant="primary">
          Save
        </Button>
        <Button size="sm" onClick={() => onEdit(false)}>
          Cancel
        </Button>
      </form>
    );
  }

  const moveOptions = folders
    .filter((f) => f.id !== node.id)
    .map((f) => ({ value: f.id, label: f.title, icon: 'folder', indent: f.depth }));

  return (
    <div
      className={`list-row${node.type === 'folder' ? ' folder-row' : ''}`}
      role="treeitem"
      aria-expanded={node.type === 'folder' ? !collapsed : undefined}
      style={{ paddingLeft: 8 + depth * 20 }}
    >
      {node.type === 'folder' ? (
        <>
          <IconButton
            icon={`chevron-${collapsed ? 'right' : 'down'}`}
            label={collapsed ? 'Expand' : 'Collapse'}
            className="small tree-toggle"
            onClick={onToggle}
          />
          <span
            className={`codicon codicon-${collapsed ? 'folder' : 'folder-opened'} row-icon`}
            aria-hidden="true"
          />
          <span className="row-title folder-title">{node.title}</span>
          <span className="badge">{node.children?.length ?? 0}</span>
        </>
      ) : (
        <>
          <SiteIcon url={node.url ?? ''} favicon={node.favicon} />
          <button
            type="button"
            className="link-button row-title"
            title={node.url}
            onClick={(event) =>
              postToHost({
                type: 'bookmark',
                action: 'open',
                url: node.url!,
                newTab: event.ctrlKey || event.metaKey,
              })
            }
          >
            {bookmarkLabel(node)}
          </button>
          <span className="row-detail">{node.url}</span>
        </>
      )}
      <span className="row-actions">
        {node.type === 'folder' && (
          <IconButton
            icon="multiple-windows"
            label="Open all in new tabs"
            className="small"
            onClick={() => postToHost({ type: 'bookmark', action: 'openAll', id: node.id })}
          />
        )}
        {!isRoot && (
          <>
            <Select
              size="sm"
              appearance="quiet"
              label="Move to folder"
              icon="folder-active"
              placeholder="Move"
              align="end"
              value={undefined}
              options={moveOptions}
              renderValue={() => 'Move'}
              onChange={(parentId) =>
                postToHost({ type: 'bookmark', action: 'move', id: node.id, parentId })
              }
            />
            <IconButton icon="edit" label="Edit" className="small" onClick={() => onEdit(true)} />
            <IconButton
              icon="trash"
              label="Delete"
              className="small"
              onClick={() => postToHost({ type: 'bookmark', action: 'remove', id: node.id })}
            />
          </>
        )}
      </span>
    </div>
  );
}
