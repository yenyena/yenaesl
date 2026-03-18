import { useState, useRef, useEffect, type KeyboardEvent } from 'react';

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => void;
  placeholder?: string;
  as?: 'span' | 'h3';
}

export function InlineEdit({ value, onSave, placeholder = 'Click to edit', as: Tag = 'span' }: InlineEditProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) {
      onSave(trimmed);
    } else {
      setDraft(value);
    }
    setEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') { setDraft(value); setEditing(false); }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={save}
        onKeyDown={onKeyDown}
        className="font-body text-inherit bg-bg border border-primary/30 rounded-button px-2 py-1 outline-none focus:border-primary w-full"
      />
    );
  }

  return (
    <Tag
      onClick={() => setEditing(true)}
      className="cursor-pointer hover:bg-bg/50 rounded px-1 -mx-1 transition-colors"
      title="Click to edit"
    >
      {value || <span className="text-text-light italic">{placeholder}</span>}
    </Tag>
  );
}
