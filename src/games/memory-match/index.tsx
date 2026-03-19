import { useReducer, useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useVocabStore } from '../../stores/useVocabStore';
import { memoryMatchReducer, initialState } from './reducer';
import { CardGrid } from './CardGrid';
import { CountdownOverlay } from './CountdownOverlay';
import { VictoryOverlay } from './VictoryOverlay';
import { useGameSounds } from './useGameSounds';
import type { MemoryCard, Difficulty } from './types';
import { PAIRS_BY_DIFFICULTY } from './types';
import type { Word } from '../../types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildCards(words: Word[], pairCount: number): MemoryCard[] {
  const selected = shuffleArray(words).slice(0, pairCount);
  const cards: MemoryCard[] = [];

  for (const word of selected) {
    cards.push({
      id: `pic-${word.id}`,
      wordId: word.id,
      type: 'picture',
      content: word.image,
      isFlipped: false,
      isMatched: false,
    });
    cards.push({
      id: `word-${word.id}`,
      wordId: word.id,
      type: 'word',
      content: word.text,
      isFlipped: false,
      isMatched: false,
    });
  }

  return shuffleArray(cards);
}

export function MemoryMatch() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(memoryMatchReducer, initialState);
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');
  const { play } = useGameSounds();

  const evaluatingRef = useRef(false);
  const noMatchIndicesRef = useRef<number[]>([]);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const pairCount = PAIRS_BY_DIFFICULTY[difficulty];

  const startGame = useCallback(
    (words: Word[], pairs: number) => {
      const cards = buildCards(words, pairs);
      dispatch({ type: 'START_MEMORIZE', cards, totalPairs: pairs });
    },
    [],
  );

  // Start game on mount / when unit loads / when difficulty changes
  useEffect(() => {
    if (unit && unit.words.length >= pairCount) {
      startGame(unit.words, pairCount);
    }
  }, [unit, startGame, pairCount]);

  // Memorize phase countdown
  useEffect(() => {
    if (state.phase !== 'memorize') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
      play('tick');
    }, 1000);

    return () => clearInterval(interval);
  }, [state.phase, play]);

  // End memorize when countdown reaches 0
  useEffect(() => {
    if (state.phase !== 'memorize' || state.countdown > 0) return;

    const timeout = setTimeout(() => {
      dispatch({ type: 'END_MEMORIZE' });
      play('flip');
    }, 500);

    return () => clearTimeout(timeout);
  }, [state.phase, state.countdown, play]);

  // Evaluate when 2 cards are flipped
  useEffect(() => {
    if (state.flippedIndices.length !== 2) return;

    evaluatingRef.current = true;
    const [i, j] = state.flippedIndices;
    const cardA = state.cards[i];
    const cardB = state.cards[j];
    const isMatch =
      cardA.wordId === cardB.wordId && cardA.type !== cardB.type;

    if (isMatch) {
      setTimeout(() => {
        dispatch({ type: 'MATCH_FOUND' });
        play('match');
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.7 },
          colors: ['#16A34A', '#FFD93D'],
        });
        evaluatingRef.current = false;
      }, 600);
    } else {
      play('noMatch');
      noMatchIndicesRef.current = [i, j];
      forceRender();

      setTimeout(() => {
        noMatchIndicesRef.current = [];
        dispatch({ type: 'NO_MATCH' });
        evaluatingRef.current = false;
        forceRender();
      }, 1200);
    }
  }, [state.flippedIndices, state.cards, play]);

  // Victory check
  useEffect(() => {
    if (state.phase !== 'playing' || state.matchedPairs < state.totalPairs) return;

    const timeout = setTimeout(() => {
      dispatch({ type: 'VICTORY' });
      play('victory');
    }, 800);

    return () => clearTimeout(timeout);
  }, [state.matchedPairs, state.totalPairs, state.phase, play]);

  const handleCardClick = useCallback(
    (index: number) => {
      if (evaluatingRef.current) return;
      play('flip');
      dispatch({ type: 'FLIP_CARD', index });
    },
    [play],
  );

  const handlePlayAgain = useCallback(() => {
    if (unit) {
      startGame(unit.words, pairCount);
    }
  }, [unit, startGame, pairCount]);

  const handleBackToGames = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleDifficultyChange = useCallback(
    (d: Difficulty) => {
      if (d === difficulty) return;
      if (!unit || unit.words.length < PAIRS_BY_DIFFICULTY[d]) return;
      setDifficulty(d);
    },
    [difficulty, unit],
  );

  // Not enough words guard
  if (!unit || unit.words.length < 4) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">📝</span>
          <h2 className="text-2xl text-primary mb-2">
            Need More Words
          </h2>
          <p className="text-text-light text-lg mb-4">
            This game needs at least 4 words with images.
            <br />
            This unit has {unit?.words.length ?? 0}.
          </p>
          <Link
            to="/settings"
            className="text-primary font-bold underline text-lg"
          >
            Go to Settings to add words
          </Link>
        </div>
      </div>
    );
  }

  const canPlayHard = unit.words.length >= PAIRS_BY_DIFFICULTY.hard;

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
      <div className="flex items-center gap-2 mb-2">
        {(['normal', 'hard'] as const).map((d) => {
          const isActive = difficulty === d;
          const disabled = d === 'hard' && !canPlayHard;
          return (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              disabled={disabled}
              className={`px-4 py-1.5 rounded-full font-heading text-sm transition-colors ${
                isActive
                  ? 'bg-primary text-white shadow-card'
                  : disabled
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-surface text-text-light hover:bg-gray-100'
              }`}
              title={disabled ? 'Need at least 5 words for Hard mode' : undefined}
            >
              {d === 'normal' ? 'Normal (8)' : 'Hard (10)'}
            </button>
          );
        })}
      </div>

      <CountdownOverlay
        countdown={state.countdown}
        visible={state.phase === 'memorize'}
      />

      <CardGrid
        cards={state.cards}
        onCardClick={handleCardClick}
        noMatchIndices={noMatchIndicesRef.current}
      />

      <VictoryOverlay
        visible={state.phase === 'victory'}
        attempts={state.attempts}
        onPlayAgain={handlePlayAgain}
        onBackToGames={handleBackToGames}
      />
    </div>
  );
}
