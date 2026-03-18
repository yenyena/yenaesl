import { useState } from 'react';
import { MONTHS } from '../../constants/months';
import { useVocabStore } from '../../stores/useVocabStore';
import { Badge, Button } from '../../components/ui';

interface VocabSidebarProps {
  selectedUnitId: string | null;
  onSelectUnit: (id: string) => void;
}

export function VocabSidebar({ selectedUnitId, onSelectUnit }: VocabSidebarProps) {
  const { units, saveUnit, getUnitsByMonth } = useVocabStore();
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [addingMonth, setAddingMonth] = useState<string | null>(null);
  const [newWeek, setNewWeek] = useState<number>(1);
  const [newLabel, setNewLabel] = useState('');

  const toggleMonth = (month: string) => {
    setExpandedMonth((prev) => (prev === month ? null : month));
    setAddingMonth(null);
  };

  const getAvailableWeeks = (month: string) => {
    const taken = getUnitsByMonth(month).map((u) => u.week);
    return [1, 2, 3, 4, 5].filter((w) => !taken.includes(w));
  };

  const handleAddUnit = async (month: string) => {
    const available = getAvailableWeeks(month);
    if (available.length === 0) return;
    const week = available.includes(newWeek) ? newWeek : available[0];
    const unit = {
      id: crypto.randomUUID(),
      month,
      week,
      label: newLabel.trim() || `Week ${week}`,
      words: [],
      oddOneOutLists: [],
    };
    await saveUnit(unit);
    onSelectUnit(unit.id);
    setAddingMonth(null);
    setNewLabel('');
    setNewWeek(1);
  };

  return (
    <div className="bg-surface rounded-card shadow-card p-4">
      <h3 className="text-lg mb-3 text-secondary">Months &amp; Units</h3>
      <div className="space-y-1">
        {MONTHS.map(({ name }) => {
          const monthUnits = units
            .filter((u) => u.month === name)
            .sort((a, b) => a.week - b.week);
          const isExpanded = expandedMonth === name;
          const wordCount = monthUnits.reduce((sum, u) => sum + u.words.length, 0);

          return (
            <div key={name}>
              <button
                onClick={() => toggleMonth(name)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-button cursor-pointer bg-transparent border-none text-left hover:bg-bg transition-colors"
              >
                <span className="font-body font-bold text-sm text-text">{name}</span>
                <div className="flex items-center gap-2">
                  {wordCount > 0 && <Badge>{wordCount}</Badge>}
                  <span className="text-text-light text-xs">{isExpanded ? '▼' : '▶'}</span>
                </div>
              </button>

              {isExpanded && (
                <div className="ml-5 mt-1 space-y-1">
                  {monthUnits.map((unit) => (
                    <button
                      key={unit.id}
                      onClick={() => onSelectUnit(unit.id)}
                      className={`w-full text-left px-3 py-1.5 rounded-button text-sm cursor-pointer border-none transition-colors ${
                        selectedUnitId === unit.id
                          ? 'bg-primary/15 text-primary font-bold'
                          : 'bg-transparent text-text hover:bg-bg'
                      }`}
                    >
                      Wk {unit.week}: {unit.label}
                      <span className="text-text-light ml-1">({unit.words.length})</span>
                    </button>
                  ))}

                  {addingMonth === name ? (
                    <div className="p-2 bg-bg rounded-button space-y-2">
                      <div className="flex gap-2">
                        <select
                          value={newWeek}
                          onChange={(e) => setNewWeek(Number(e.target.value))}
                          className="px-2 py-1 rounded-button border border-text-light/20 bg-surface font-body text-sm text-text"
                        >
                          {getAvailableWeeks(name).map((w) => (
                            <option key={w} value={w}>Week {w}</option>
                          ))}
                        </select>
                        <input
                          value={newLabel}
                          onChange={(e) => setNewLabel(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddUnit(name); }}
                          placeholder="Label (optional)"
                          className="flex-1 px-2 py-1 rounded-button border border-text-light/20 bg-surface font-body text-sm text-text outline-none focus:border-primary min-w-0"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleAddUnit(name)}>Add</Button>
                        <Button size="sm" variant="ghost" onClick={() => setAddingMonth(null)}>Cancel</Button>
                      </div>
                    </div>
                  ) : (
                    getAvailableWeeks(name).length > 0 && (
                      <button
                        onClick={() => {
                          const available = getAvailableWeeks(name);
                          setNewWeek(available[0]);
                          setAddingMonth(name);
                        }}
                        className="w-full text-left px-3 py-1.5 text-sm cursor-pointer bg-transparent border-none text-primary hover:bg-primary/5 rounded-button transition-colors"
                      >
                        + Add Unit
                      </button>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
