import { motion } from 'framer-motion';
import type { RoundResult } from './types';

function getStars(squaresRemoved: number): number {
  if (squaresRemoved <= 2) return 3;
  if (squaresRemoved <= 5) return 2;
  if (squaresRemoved <= 8) return 1;
  return 0;
}

function StarRating({ count }: { count: number }) {
  return (
    <span className="text-secondary text-lg">
      {'★'.repeat(count)}
      {'☆'.repeat(3 - count)}
    </span>
  );
}

interface SummaryScreenProps {
  results: RoundResult[];
  onPlayAgain: () => void;
}

export function SummaryScreen({ results, onPlayAgain }: SummaryScreenProps) {
  const totalStars = results.reduce((sum, r) => sum + getStars(r.squaresRemoved), 0);
  const maxStars = results.length * 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-6 w-full max-w-lg mx-auto"
    >
      <h2 className="font-heading text-3xl text-primary">Round Complete!</h2>

      <div className="text-center">
        <span className="text-5xl block mb-1">
          {totalStars}/{maxStars}
        </span>
        <span className="text-text-light">Total Stars</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
        {results.map((result) => (
          <motion.div
            key={result.wordId}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-surface rounded-xl p-3 shadow-card flex flex-col items-center gap-2"
          >
            <img
              src={result.wordImage}
              alt={result.wordText}
              className="w-16 h-16 object-contain"
            />
            <span className="font-heading text-lg text-text">
              {result.wordText}
            </span>
            <span className="text-text-light text-sm">
              {result.squaresRemoved} removed
            </span>
            <StarRating count={getStars(result.squaresRemoved)} />
          </motion.div>
        ))}
      </div>

      <button
        onClick={onPlayAgain}
        className="bg-primary text-white px-8 py-3 rounded-full font-bold text-lg shadow-card hover:shadow-hover transition-shadow"
      >
        Play Again
      </button>
    </motion.div>
  );
}
