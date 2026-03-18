import { MemoryCard } from './MemoryCard';
import type { MemoryCard as MemoryCardType } from './types';

interface CardGridProps {
  cards: MemoryCardType[];
  onCardClick: (index: number) => void;
  noMatchIndices: number[];
}

export function CardGrid({ cards, onCardClick, noMatchIndices }: CardGridProps) {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6">
      <div className="grid grid-cols-4 gap-4 md:gap-6">
        {cards.map((card, index) => (
          <MemoryCard
            key={card.id}
            card={card}
            index={index}
            onClick={onCardClick}
            shake={noMatchIndices.includes(index)}
          />
        ))}
      </div>
    </div>
  );
}
