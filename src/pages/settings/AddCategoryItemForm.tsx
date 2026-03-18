import { useState } from 'react';
import { Button, ImageUpload } from '../../components/ui';
import { useVocabStore } from '../../stores/useVocabStore';

interface AddCategoryItemFormProps {
  listId: string;
}

export function AddCategoryItemForm({ listId }: AddCategoryItemFormProps) {
  const { addCategoryItem } = useVocabStore();
  const [text, setText] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    addCategoryItem(listId, {
      id: crypto.randomUUID(),
      text: text.trim(),
      image,
    });
    setText('');
    setImage('');
  };

  return (
    <div className="flex items-end gap-3 pt-3">
      <ImageUpload value={image} onChange={setImage} />
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') handleAdd(); }}
        placeholder="New item…"
        className="flex-1 px-3 py-2 rounded-button border border-text-light/20 bg-bg font-body text-text outline-none focus:border-primary"
      />
      <Button size="sm" onClick={handleAdd} disabled={!text.trim()}>
        Add
      </Button>
    </div>
  );
}
