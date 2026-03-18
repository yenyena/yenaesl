import { useState } from 'react';
import { Button, Badge, ConfirmDialog, InlineEdit } from '../../components/ui';
import { useVocabStore } from '../../stores/useVocabStore';
import { CategoryListDetail } from './CategoryListDetail';

export function CategoryManager() {
  const { categoryLists, saveCategoryList, deleteCategoryList } = useVocabStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const deleteTarget = categoryLists.find((l) => l.id === deleteId);

  const handleNewList = async () => {
    const list = {
      id: crypto.randomUUID(),
      name: 'New List',
      items: [],
    };
    await saveCategoryList(list);
    setExpandedId(list.id);
  };

  return (
    <div className="bg-surface rounded-card shadow-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg m-0 text-primary">Category Lists</h3>
        <Button size="sm" onClick={handleNewList}>
          + New List
        </Button>
      </div>

      {categoryLists.length === 0 ? (
        <p className="text-text-light">No category lists yet. Create one to get started.</p>
      ) : (
        <div className="space-y-3">
          {categoryLists.map((list) => (
            <div key={list.id} className="border border-bg rounded-button p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <InlineEdit
                    value={list.name}
                    onSave={(name) => saveCategoryList({ ...list, name })}
                    as="span"
                  />
                  <Badge>{list.items.length} items</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedId(expandedId === list.id ? null : list.id)}
                    className="text-sm cursor-pointer bg-transparent border-none text-primary hover:underline px-2"
                  >
                    {expandedId === list.id ? 'Collapse' : 'Edit'}
                  </button>
                  <button
                    onClick={() => setDeleteId(list.id)}
                    className="text-sm cursor-pointer bg-transparent border-none text-incorrect hover:underline px-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {expandedId === list.id && <CategoryListDetail list={list} />}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Category List"
        message={`Delete "${deleteTarget?.name}"? It will be removed from all units. This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) deleteCategoryList(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
