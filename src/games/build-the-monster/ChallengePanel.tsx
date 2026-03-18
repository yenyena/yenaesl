import { motion } from 'framer-motion';
import type { Word } from '../../types';
import type { GamePhase } from './types';
import { CATEGORY_ORDER, CATEGORY_LABELS } from './types';

interface ChallengePanelProps {
  word: Word;
  phase: GamePhase;
  categoryIndex: number;
  wordsCompleted: number;
  totalWords: number;
  onCorrect: () => void;
  onShowAnswer: () => void;
  onNextWord: () => void;
}

export function ChallengePanel({
  word,
  phase,
  categoryIndex,
  wordsCompleted,
  totalWords,
  onCorrect,
  onShowAnswer,
  onNextWord,
}: ChallengePanelProps) {
  const partsEarned = Math.min(categoryIndex, CATEGORY_ORDER.length);
  const isShowAnswer = phase === 'show-answer';

  return (
    <div className="flex flex-col items-center gap-4 p-4 h-full justify-center">
      {/* Progress indicators */}
      <div className="flex gap-4 text-sm font-bold text-text-light">
        <span>Word {wordsCompleted + 1} of {totalWords}</span>
        <span>Parts: {partsEarned} / {CATEGORY_ORDER.length}</span>
      </div>

      {/* Current category label */}
      <div
        className="text-lg font-bold text-primary"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Earn: {CATEGORY_LABELS[CATEGORY_ORDER[Math.min(categoryIndex, CATEGORY_ORDER.length - 1)]]}
      </div>

      {/* Vocabulary image */}
      <motion.div
        key={word.id}
        className="w-48 h-48 bg-white rounded-2xl shadow-card flex items-center justify-center overflow-hidden"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        <img
          src={word.image}
          alt={isShowAnswer ? word.text : 'What is this?'}
          className="max-w-full max-h-full object-contain p-3"
          draggable={false}
        />
      </motion.div>

      {/* Prompt */}
      <p
        className="text-xl text-text"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        {isShowAnswer ? '' : 'What is this?'}
      </p>

      {/* Answer reveal */}
      {isShowAnswer && (
        <motion.p
          className="text-2xl font-bold text-primary"
          style={{ fontFamily: 'var(--font-heading)' }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {word.text}
        </motion.p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 mt-2">
        {phase === 'challenge' && (
          <>
            <motion.button
              className="px-6 py-3 rounded-full font-bold text-white text-lg shadow-card"
              style={{ background: 'var(--color-correct)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCorrect}
            >
              Correct!
            </motion.button>
            <motion.button
              className="px-6 py-3 rounded-full font-bold text-text-light text-lg border-2 border-text-light/30 bg-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onShowAnswer}
            >
              Show Answer
            </motion.button>
          </>
        )}
        {isShowAnswer && (
          <motion.button
            className="px-6 py-3 rounded-full font-bold text-white text-lg shadow-card bg-primary"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onNextWord}
          >
            Next Word
          </motion.button>
        )}
      </div>
    </div>
  );
}
