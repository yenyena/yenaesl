import { useState } from 'react';
import { InlineEdit, ImageUpload, ConfirmDialog } from '../../components/ui';
import { useVocabStore } from '../../stores/useVocabStore';

interface WordRowProps {
  unitId: string;
  word: { id: string; text: string; image: string };
}

export function WordRow({ unitId, word }: WordRowProps) {
  const { updateWord, deleteWord } = useVocabStore();
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex items-center gap-3 py-2 border-b border-bg last:border-b-0">
      <ImageUpload
        value={word.image}
        onChange={(image) => updateWord(unitId, word.id, { image })}
      />
      <div className="flex-1 min-w-0">
        <InlineEdit
          value={word.text}
          onSave={(text) => updateWord(unitId, word.id, { text })}
          placeholder="Word text"
        />
      </div>
      <button
        onClick={() => setConfirmDelete(true)}
        className="text-incorrect bg-transparent border-none cursor-pointer text-lg px-2 hover:bg-incorrect/10 rounded-button transition-colors"
        title="Delete word"
      >
        ×
      </button>
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Word"
        message={`Delete "${word.text}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => { deleteWord(unitId, word.id); setConfirmDelete(false); }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
