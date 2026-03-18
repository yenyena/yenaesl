import { useReducer, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useVocabStore } from '../../stores/useVocabStore';
import { oddOneOutReducer, initialState } from './reducer';
import { generateRound } from './generateRound';
import { OddOneOutCard } from './OddOneOutCard';
import { CategoryReveal } from './CategoryReveal';
import { useGameSounds } from './useGameSounds';
import type { CategoryList } from '../../types';

function getValidLists(
  categoryLists: CategoryList[],
  enabledIds: string[],
): { enabled: CategoryList[]; valid: CategoryList[] } {
  const enabled = categoryLists.filter((l) => enabledIds.includes(l.id));
  const valid = enabled.filter((l) => l.items.length >= 3);
  return { enabled, valid };
}

export function OddOneOut() {
  const { uid } = useParams();
  const { getUnit, categoryLists } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(oddOneOutReducer, initialState);
  const { play } = useGameSounds();

  const { enabled: enabledLists, valid: validLists } = unit
    ? getValidLists(categoryLists, unit.oddOneOutLists)
    : { enabled: [], valid: [] };

  const startRound = useCallback(
    (usedWordIds: string[]) => {
      if (!unit || validLists.length === 0 || unit.words.length === 0) return;
      const result = generateRound(unit.words, validLists, usedWordIds);
      dispatch({
        type: 'START_ROUND',
        gridItems: result.gridItems,
        oddOneOutId: result.oddOneOutId,
        categoryName: result.categoryName,
        usedWordIds: result.newUsedWordIds,
      });
      play('whoosh');
    },
    [unit, validLists, play],
  );

  // Auto-start first round
  useEffect(() => {
    if (
      state.phase === 'loading' &&
      unit &&
      validLists.length > 0 &&
      unit.words.length > 0
    ) {
      startRound([]);
    }
  }, [state.phase, unit, validLists.length, startRound]);

  const handleCardTap = useCallback(
    (id: string) => {
      if (state.phase !== 'playing' || state.shakingId !== null) return;

      if (id === state.oddOneOutId) {
        dispatch({ type: 'CORRECT_GUESS' });
        play('correct');
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FFD93D', '#2563EB', '#16A34A', '#F59E0B'],
        });
      } else {
        dispatch({ type: 'WRONG_GUESS', id });
        play('buzz');
        setTimeout(() => dispatch({ type: 'CLEAR_SHAKE' }), 400);
      }
    },
    [state.phase, state.shakingId, state.oddOneOutId, play],
  );

  const handleNextRound = useCallback(() => {
    startRound(state.usedWordIds);
  }, [startRound, state.usedWordIds]);

  // Error guards
  if (!unit) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">🔍</span>
          <p className="text-text-light text-lg">Unit not found.</p>
        </div>
      </div>
    );
  }

  if (enabledLists.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">📋</span>
          <h2 className="text-2xl text-primary mb-2">No Category Lists</h2>
          <p className="text-text-light text-lg mb-4">
            Enable at least 1 category list for this unit to play Odd One Out!
          </p>
          <Link
            to="/settings"
            className="text-primary font-bold underline text-lg"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  if (validLists.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">📋</span>
          <h2 className="text-2xl text-primary mb-2">Lists Too Small</h2>
          <p className="text-text-light text-lg mb-4">
            Your category lists need at least 3 items each to play Odd One Out!
          </p>
          <Link
            to="/settings"
            className="text-primary font-bold underline text-lg"
          >
            Go to Settings to add items
          </Link>
        </div>
      </div>
    );
  }

  if (unit.words.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">📝</span>
          <h2 className="text-2xl text-primary mb-2">Need Words</h2>
          <p className="text-text-light text-lg mb-4">
            Add at least 1 word to this unit to play Odd One Out!
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

  return (
    <div className="relative h-full flex flex-col items-center">
      {/* Round counter */}
      <div className="py-3 flex items-center gap-4">
        <span className="font-heading text-xl text-primary">
          Round {state.round}
        </span>
        {state.round > 0 && (
          <span className="text-text-light text-sm">
            {state.firstTryCorrect}/{state.round - (state.phase === 'correct' ? 0 : 1)} first try
          </span>
        )}
      </div>

      {/* 2×2 Card Grid */}
      <div className="flex-1 flex items-center justify-center w-full px-4">
        <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-lg w-full">
          {state.gridItems.map((item) => (
            <OddOneOutCard
              key={item.id}
              item={item}
              phase={state.phase}
              isShaking={state.shakingId === item.id}
              onClick={handleCardTap}
            />
          ))}
        </div>
      </div>

      {/* Category reveal */}
      <CategoryReveal
        visible={state.phase === 'correct'}
        categoryName={state.categoryName}
      />

      {/* Bottom area: next round button + variety tip */}
      <div className="h-20 flex flex-col items-center justify-center gap-1">
        {state.phase === 'correct' && (
          <button
            className="bg-primary text-white px-6 py-3 rounded-full font-bold text-lg shadow-card hover:shadow-hover transition-shadow cursor-pointer"
            onClick={handleNextRound}
          >
            Next Round
          </button>
        )}
        {unit.words.length === 1 && state.phase === 'playing' && (
          <p className="text-text-light text-sm">
            Tip: Add more words for more variety!
          </p>
        )}
      </div>
    </div>
  );
}
