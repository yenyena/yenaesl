import { useVocabStore } from '../../stores/useVocabStore';

interface OddOneOutSectionProps {
  unitId: string;
}

export function OddOneOutSection({ unitId }: OddOneOutSectionProps) {
  const { categoryLists, toggleOddOneOutList, getUnit } = useVocabStore();
  const unit = getUnit(unitId);

  if (!unit) return null;

  return (
    <div className="mt-8 pt-6 border-t border-bg">
      <h4 className="text-base mb-3 font-body font-bold text-primary">
        Odd One Out categories for this unit
      </h4>
      {categoryLists.length === 0 ? (
        <p className="text-text-light text-sm">
          No category lists yet. Create some in the Category Lists tab.
        </p>
      ) : (
        <div className="space-y-2">
          {categoryLists.map((list) => (
            <label key={list.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={unit.oddOneOutLists.includes(list.id)}
                onChange={() => toggleOddOneOutList(unitId, list.id)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-text">
                {list.name}
                <span className="text-text-light ml-1">({list.items.length} items)</span>
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
