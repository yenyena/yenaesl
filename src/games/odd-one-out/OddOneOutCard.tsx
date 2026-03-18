import { motion } from 'framer-motion';
import type { GridItem, GamePhase } from './types';

interface OddOneOutCardProps {
  item: GridItem;
  phase: GamePhase;
  isShaking: boolean;
  onClick: (id: string) => void;
}

export function OddOneOutCard({ item, phase, isShaking, onClick }: OddOneOutCardProps) {
  const isCorrectPhase = phase === 'correct';
  const isOddAndCorrect = isCorrectPhase && item.isOddOneOut;
  const isCategoryAndCorrect = isCorrectPhase && !item.isOddOneOut;

  const handleClick = () => {
    if (phase !== 'playing') return;
    onClick(item.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.div
      className="aspect-square"
      animate={
        isShaking
          ? { x: [0, -8, 8, -8, 8, -8, 8, 0] }
          : isOddAndCorrect
            ? { rotate: [0, -5, 5, -5, 5, 0] }
            : undefined
      }
      transition={
        isShaking
          ? { duration: 0.2, ease: 'easeInOut' }
          : isOddAndCorrect
            ? { duration: 0.5, ease: 'easeInOut' }
            : undefined
      }
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`w-full h-full rounded-card shadow-card flex flex-col items-center justify-center p-3 overflow-hidden transition-all duration-300
          ${phase === 'playing' ? 'cursor-pointer hover:shadow-hover' : 'cursor-default'}
          ${isOddAndCorrect ? 'golden-glow-ooo' : ''}
          ${isCategoryAndCorrect ? 'ring-4 ring-correct bg-correct/5' : 'bg-surface'}
        `}
        aria-label={item.text}
      >
        {item.image ? (
          <img
            src={item.image}
            alt=""
            className="max-w-[80%] max-h-[65%] object-contain rounded-lg"
            draggable={false}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <span className="font-heading text-4xl md:text-5xl text-primary text-center break-words leading-tight">
              ?
            </span>
          </div>
        )}
        <span className="font-heading text-xl md:text-2xl text-text text-center mt-2 leading-tight truncate w-full">
          {item.text}
        </span>
      </div>
    </motion.div>
  );
}
