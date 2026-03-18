import { motion } from 'framer-motion';
import type { MemoryCard as MemoryCardType } from './types';

interface MemoryCardProps {
  card: MemoryCardType;
  index: number;
  onClick: (index: number) => void;
  shake: boolean;
}

export function MemoryCard({ card, index, onClick, shake }: MemoryCardProps) {
  const handleClick = () => {
    if (!card.isMatched && !card.isFlipped) {
      onClick(index);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      className="aspect-[3/4]"
      animate={
        shake
          ? { x: [0, -8, 8, -8, 8, 0] }
          : card.isMatched
            ? { scale: [1, 1.05, 1] }
            : undefined
      }
      transition={
        shake
          ? { duration: 0.4, ease: 'easeInOut' }
          : { duration: 0.3 }
      }
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`memory-card w-full h-full relative cursor-pointer ${card.isFlipped || card.isMatched ? 'flipped' : ''}`}
        aria-label={
          card.isFlipped || card.isMatched
            ? card.type === 'word'
              ? card.content
              : 'Picture card'
            : 'Hidden card'
        }
      >
        {/* Card Back */}
        <div className="memory-card-face memory-card-back absolute inset-0 rounded-card shadow-card flex items-center justify-center bg-[#FF6B6B]">
          <span className="text-7xl md:text-8xl font-heading text-[#FFD93D] select-none">
            ?
          </span>
        </div>

        {/* Card Front */}
        <div
          className={`memory-card-face memory-card-front absolute inset-0 rounded-card shadow-card flex items-center justify-center p-5 overflow-hidden ${
            card.isMatched
              ? 'ring-4 ring-correct bg-correct/5'
              : 'bg-surface'
          }`}
        >
          {card.type === 'picture' ? (
            <img
              src={card.content}
              alt=""
              className="max-w-[85%] max-h-[85%] object-contain rounded-lg"
              draggable={false}
            />
          ) : (
            <span className="font-heading text-2xl md:text-3xl lg:text-4xl text-primary text-center break-words leading-tight">
              {card.content}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
