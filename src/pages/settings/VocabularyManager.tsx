import { useState } from 'react';
import { VocabSidebar } from './VocabSidebar';
import { VocabUnitPanel } from './VocabUnitPanel';

export function VocabularyManager() {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      <VocabSidebar
        selectedUnitId={selectedUnitId}
        onSelectUnit={setSelectedUnitId}
      />
      {selectedUnitId ? (
        <VocabUnitPanel
          unitId={selectedUnitId}
          onDeleted={() => setSelectedUnitId(null)}
        />
      ) : (
        <div className="bg-surface rounded-card shadow-card p-6">
          <h3 className="text-lg mb-3 text-text-light">Word List</h3>
          <p className="text-text-light">Select a unit to manage its words</p>
        </div>
      )}
    </div>
  );
}
