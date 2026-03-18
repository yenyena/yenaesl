import { useState, useRef } from 'react';
import { Button, ConfirmDialog, Modal } from '../../components/ui';
import { useVocabStore } from '../../stores/useVocabStore';
import { validateImportData } from '../../db';
import type { ExportData } from '../../types';

export function DataManagement() {
  const { exportData, importData, resetData } = useVocabStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importPreview, setImportPreview] = useState<ExportData | null>(null);
  const [importError, setImportError] = useState('');

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `esl-games-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (!validateImportData(data)) {
        setImportError('Invalid backup file format.');
        return;
      }
      setImportPreview(data);
      setImportError('');
    } catch {
      setImportError('Could not read file. Make sure it is a valid JSON backup.');
    }
  };

  const handleImport = async (mode: 'merge' | 'replace') => {
    if (!importPreview) return;
    await importData(importPreview, mode);
    setImportPreview(null);
  };

  return (
    <div className="bg-surface rounded-card shadow-card p-6">
      <h3 className="text-lg mb-4 text-text">Data Management</h3>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={handleExport}>
          Export Data
        </Button>
        <Button variant="secondary" onClick={() => fileRef.current?.click()}>
          Import Data
        </Button>
        <Button variant="ghost" onClick={() => setConfirmReset(true)}>
          Reset Data
        </Button>
      </div>

      {importError && (
        <p className="text-incorrect text-sm mt-3">{importError}</p>
      )}

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
          e.target.value = '';
        }}
      />

      <Modal open={!!importPreview} onClose={() => setImportPreview(null)}>
        <h3 className="text-lg m-0 mb-2 text-text">Import Data</h3>
        {importPreview && (
          <>
            <p className="text-text-light text-sm mb-1">
              Exported: {new Date(importPreview.exportedAt).toLocaleDateString()}
            </p>
            <p className="text-text mb-4">
              {importPreview.units.length} units, {importPreview.categoryLists.length} category lists
            </p>
            <div className="flex gap-3">
              <Button onClick={() => handleImport('merge')}>
                Merge
              </Button>
              <Button variant="secondary" onClick={() => handleImport('replace')}>
                Replace All
              </Button>
              <Button variant="ghost" onClick={() => setImportPreview(null)}>
                Cancel
              </Button>
            </div>
          </>
        )}
      </Modal>

      <ConfirmDialog
        open={confirmReset}
        title="Reset All Data"
        message="This will permanently delete all units, words, and category lists. This cannot be undone."
        confirmLabel="Reset Everything"
        onConfirm={() => { resetData(); setConfirmReset(false); }}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}
