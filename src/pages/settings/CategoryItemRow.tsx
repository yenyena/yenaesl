import { useState } from 'react';
import { InlineEdit, ImageUpload, ConfirmDialog } from '../../components/ui';
import { useVocabStore } from '../../stores/useVocabStore';

interface CategoryItemRowProps {
  listId: string;
  item: { id: string; text: string; image: string };
}

export function CategoryItemRow({ listId, item }: CategoryItemRowProps) {
  const { updateCategoryItem, deleteCategoryItem } = useVocabStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-3 py-2 border-b border-bg last:border-b-0">
      <ImageUpload
        value={item.image}
        onChange={(image) => updateCategoryItem(listId, item.id, { image })}
      />
      <div className="flex-1 min-w-0">
        <InlineEdit
          value={item.text}
          onSave={(text) => updateCategoryItem(listId, item.id, { text })}
          placeholder="Item text"
        />
      </div>
      <button
        onClick={() => setConfirmDelete(true)}
        className="text-incorrect bg-transparent border-none cursor-pointer text-lg px-2 hover:bg-incorrect/10 rounded-button transition-colors"
        title="Delete item"
      >
        ×
      </button>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Item"
        message={`Delete "${item.text}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => { deleteCategoryItem(listId, item.id); setConfirmDelete(false); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
