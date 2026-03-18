import { useState } from 'react';
import { InlineEdit, ConfirmDialog, Badge } from '../../components/ui';
import { useVocabStore } from '../../stores/useVocabStore';
import { WordRow } from './WordRow';
import { AddWordForm } from './AddWordForm';
import { OddOneOutSection } from './OddOneOutSection';

interface VocabUnitPanelProps {
  unitId: string;
  onDeleted: () => void;
}

export function VocabUnitPanel({ unitId, onDeleted }: VocabUnitPanelProps) {
  const { getUnit, saveUnit, deleteUnit } = useVocabStore();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const unit = getUnit(unitId);

  if (!unit) {
    return (
      <div className="bg-surface rounded-card shadow-card p-6">
        <p className="text-text-light">Select a unit to manage its words</p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-card shadow-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-text-light text-sm">{unit.month} — Week {unit.week}</span>
            <Badge>{unit.words.length} words</Badge>
          </div>
          <InlineEdit
            value={unit.label}
            onSave={(label) => saveUnit({ ...unit, label })}
            placeholder="Unit label"
            as="h3"
          />
        </div>
        <button
          onClick={() => setConfirmDelete(true)}
          className="text-incorrect bg-transparent border-none cursor-pointer text-sm px-3 py-1 hover:bg-incorrect/10 rounded-button transition-colors font-bold"
        >
          Delete Unit
        </button>
      </div>

      <h4 className="text-sm font-body font-bold text-text-light mb-2">Words</h4>
      {unit.words.length === 0 ? (
        <p className="text-text-light text-sm">No words added yet.</p>
      ) : (
        <div>
          {unit.words.map((word) => (
            <WordRow key={word.id} unitId={unitId} word={word} />
          ))}
        </div>
      )}

      <AddWordForm unitId={unitId} />

      <OddOneOutSection unitId={unitId} />

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Unit"
        message={`Delete "${unit.label || `${unit.month} Week ${unit.week}`}" and all its words? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          deleteUnit(unitId);
          setConfirmDelete(false);
          onDeleted();
        }}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
