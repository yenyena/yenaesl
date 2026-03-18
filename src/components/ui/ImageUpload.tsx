import { useRef, useState, type DragEvent } from 'react';
import { compressImage } from '../../utils/compressImage';

interface ImageUploadProps {
  value: string;
  onChange: (base64: string) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const base64 = await compressImage(file);
    onChange(base64);
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  if (value) {
    return (
      <div className="relative w-20 h-20">
        <img src={value} alt="" className="w-20 h-20 rounded-button object-cover" />
        <button
          onClick={() => onChange('')}
          className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-incorrect text-white text-xs font-bold border-2 border-surface cursor-pointer flex items-center justify-center"
        >
          ×
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`w-20 h-20 rounded-button border-2 border-dashed cursor-pointer flex items-center justify-center text-text-light text-xs text-center transition-colors ${
          dragging ? 'border-primary bg-primary/10' : 'border-text-light/30 hover:border-primary/50'
        }`}
      >
        + Image
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
    </>
  );
}
