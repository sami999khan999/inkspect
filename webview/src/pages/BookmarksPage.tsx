import { useState, type ReactElement } from 'react';
import {
  folderList,
  searchBookmarks,
  type BookmarkNode,
  type BookmarkRoots,
} from '@shared/bookmarks';
import { postToHost } from '../vscode';

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

  return (
    <div className="internal-page bookmarks-page">
      <div className="internal-page-inner">
        <header className="internal-page-header">
          <h1>Bookmarks</h1>
          <div className="header-actions">
            <button
              type="button"
              className="button secondary"
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
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'bookmark', action: 'import' })}
            >
              Import...
            </button>
            <button
              type="button"
              className="button secondary"
              onClick={() => postToHost({ type: 'bookmark', action: 'export' })}
            >
              Export...
            </button>
          </div>
        </header>
        <input
          className="page-search"
          type="search"
          value={query}
          placeholder="Search bookmarks"
          aria-label="Search bookmarks"
          onChange={(event) => setQuery(event.target.value)}
        />
        <div className="bookmark-tree" role="tree">
          {query.trim()
            ? searchBookmarks(roots, query).map((node) => row(node, 0))
            : [...tree(roots.bar, 0), ...tree(roots.other, 0)]}
        </div>
      </div>
    </div>
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
        <input
          value={title}
          autoFocus
          aria-label="Name"
          onChange={(e) => setTitle(e.target.value)}
        />
        {node.type === 'bookmark' && (
          <input value={url} aria-label="URL" onChange={(e) => setUrl(e.target.value)} />
        )}
        <button type="submit" className="button primary">
          Save
        </button>
        <button type="button" className="button secondary" onClick={() => onEdit(false)}>
          Cancel
        </button>
      </form>
    );
  }

  return (
    <div className="list-row" role="treeitem" style={{ paddingLeft: 8 + depth * 18 }}>
      {node.type === 'folder' ? (
        <button
          type="button"
          className="icon-button"
          aria-label={collapsed ? 'Expand' : 'Collapse'}
          onClick={onToggle}
        >
          <span
            className={`codicon codicon-chevron-${collapsed ? 'right' : 'down'}`}
            aria-hidden="true"
          />
        </button>
      ) : node.favicon ? (
        <img className="favicon row-icon" src={node.favicon} alt="" referrerPolicy="no-referrer" />
      ) : (
        <span className="codicon codicon-globe row-icon" aria-hidden="true" />
      )}
      {node.type === 'folder' ? (
        <span className="row-title folder-title">
          <span className="codicon codicon-folder" aria-hidden="true" /> {node.title}
          <span className="muted"> ({node.children?.length ?? 0})</span>
        </span>
      ) : (
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
          {node.title}
        </button>
      )}
      {node.type === 'bookmark' && <span className="row-detail">{node.url}</span>}
      <span className="row-actions">
        {node.type === 'folder' && (
          <button
            type="button"
            className="icon-button"
            title="Open all in new tabs"
            aria-label="Open all in new tabs"
            onClick={() => postToHost({ type: 'bookmark', action: 'openAll', id: node.id })}
          >
            <span className="codicon codicon-multiple-windows" aria-hidden="true" />
          </button>
        )}
        {!isRoot && (
          <>
            <select
              className="move-select"
              aria-label="Move to folder"
              title="Move to folder"
              value=""
              onChange={(event) => {
                if (event.target.value) {
                  postToHost({
                    type: 'bookmark',
                    action: 'move',
                    id: node.id,
                    parentId: event.target.value,
                  });
                }
              }}
            >
              <option value="">Move to...</option>
              {folders
                .filter((f) => f.id !== node.id)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {'  '.repeat(f.depth)}
                    {f.title}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="icon-button"
              title="Edit"
              aria-label="Edit"
              onClick={() => onEdit(true)}
            >
              <span className="codicon codicon-edit" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="icon-button"
              title="Delete"
              aria-label="Delete"
              onClick={() => postToHost({ type: 'bookmark', action: 'remove', id: node.id })}
            >
              <span className="codicon codicon-trash" aria-hidden="true" />
            </button>
          </>
        )}
      </span>
    </div>
  );
}
