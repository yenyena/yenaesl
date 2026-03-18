import type { Difficulty, Phase } from './types';

interface GameControlsProps {
  difficulty: Difficulty;
  round: number;
  countdown: number;
  phase: Phase;
  removedCount: number;
  onSetDifficulty: (d: Difficulty) => void;
  onReveal: () => void;
}

export function GameControls({
  difficulty,
  round,
  countdown,
  phase,
  removedCount,
  onSetDifficulty,
  onReveal,
}: GameControlsProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
      {/* Difficulty toggle */}
      <div className="flex rounded-full overflow-hidden border-2 border-primary/20">
        <button
          className={`px-4 py-1.5 text-sm font-bold transition-colors ${
            difficulty === 'easy'
              ? 'bg-primary text-white'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
          onClick={() => onSetDifficulty('easy')}
        >
          Easy
        </button>
        <button
          className={`px-4 py-1.5 text-sm font-bold transition-colors ${
            difficulty === 'hard'
              ? 'bg-primary text-white'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          }`}
          onClick={() => onSetDifficulty('hard')}
        >
          Hard
        </button>
      </div>

      {/* Center info */}
      <div className="text-center flex-1">
        {phase === 'display' && (
          <span className="text-2xl font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {countdown}
          </span>
        )}
        {phase === 'guess' && (
          <span className="text-lg font-bold text-primary" style={{ fontFamily: 'var(--font-heading)' }}>
            {removedCount === 1 ? "What's missing?" : 'Two things disappeared!'}
          </span>
        )}
        {phase === 'reveal' && (
          <span className="text-lg font-bold text-correct" style={{ fontFamily: 'var(--font-heading)' }}>
            There it is!
          </span>
        )}
      </div>

      {/* Right side: round counter + reveal button */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-text-light font-bold">
          Round {round}
        </span>
        {phase === 'guess' && (
          <button
            className="bg-secondary text-white px-5 py-2 rounded-full font-bold text-sm shadow-card hover:shadow-hover transition-shadow"
            onClick={onReveal}
          >
            Reveal
          </button>
        )}
      </div>
    </div>
  );
}
