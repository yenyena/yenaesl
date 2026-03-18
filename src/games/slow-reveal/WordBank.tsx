import { motion } from 'framer-motion';
import type { Word } from '../../types';
import type { Phase } from './types';

interface WordBankProps {
  words: Word[];
  phase: Phase;
  wrongGuessId: string | null;
  correctWordId: string | null;
  onGuess: (wordId: string) => void;
}

export function WordBank({
  words,
  phase,
  wrongGuessId,
  correctWordId,
  onGuess,
}: WordBankProps) {
  const disabled = phase !== 'playing';

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {words.map((word) => {
        const isWrong = wrongGuessId === word.id;
        const isCorrect = phase === 'revealed' && correctWordId === word.id;

        return (
          <motion.button
            key={word.id}
            onClick={() => onGuess(word.id)}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.08 }}
            whileTap={disabled ? {} : { scale: 0.95 }}
            animate={
              isWrong
                ? { x: [0, -8, 8, -8, 8, 0] }
                : { x: 0 }
            }
            transition={isWrong ? { duration: 0.4 } : {}}
            className={`
              px-6 py-3 rounded-full font-heading text-2xl text-white
              shadow-card transition-colors cursor-pointer
              ${isWrong ? 'bg-incorrect' : ''}
              ${isCorrect ? 'bg-correct ring-4 ring-correct/40' : ''}
              ${!isWrong && !isCorrect ? 'bg-primary hover:bg-primary/90' : ''}
              ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
            `}
          >
            {word.text}
          </motion.button>
        );
      })}
    </div>
  );
}
