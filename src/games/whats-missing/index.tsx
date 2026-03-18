import { useReducer, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useVocabStore } from '../../stores/useVocabStore';
import { whatsMissingReducer, initialState } from './reducer';
import { ImageGrid } from './ImageGrid';
import { CloseEyesOverlay } from './CloseEyesOverlay';
import { GameControls } from './GameControls';
import { useGameSounds } from './useGameSounds';
import type { GridItem } from './types';
import type { Word } from '../../types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function wordsToGridItems(words: Word[]): GridItem[] {
  return words.map((word) => ({ word }));
}

export function WhatsMissing() {
  const { uid } = useParams();
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(whatsMissingReducer, initialState);
  const { play } = useGameSounds();

  const startRound = useCallback(
    (words: Word[]) => {
      const count = Math.min(6, words.length);
      const selected = shuffleArray(words).slice(0, count);
      const roundWords = wordsToGridItems(selected);
      dispatch({ type: 'START_ROUND', roundWords });
      play('newRound');
    },
    [play],
  );

  // Start game on mount / when unit loads
  useEffect(() => {
    if (unit && unit.words.length >= 4) {
      startRound(unit.words);
    }
  }, [unit, startRound]);

  // Display phase countdown
  useEffect(() => {
    if (state.phase !== 'display') return;

    const interval = setInterval(() => {
      dispatch({ type: 'TICK' });
      play('tick');
    }, 1000);

    return () => clearInterval(interval);
  }, [state.phase, play]);

  // Countdown hits 0 → transition to close-eyes
  useEffect(() => {
    if (state.phase !== 'display' || state.countdown > 0) return;

    const timeout = setTimeout(() => {
      const removeCount = state.difficulty === 'hard' ? 2 : 1;
      const shuffledItems = shuffleArray(state.roundWords);
      const removedWordIds = shuffledItems
        .slice(0, removeCount)
        .map((item) => item.word.id);

      const guessLayout = state.roundWords.filter(
        (item) => !removedWordIds.includes(item.word.id),
      );

      dispatch({ type: 'BEGIN_CLOSE_EYES', removedWordIds, guessLayout });
      play('transition');
    }, 500);

    return () => clearTimeout(timeout);
  }, [state.phase, state.countdown, state.difficulty, state.roundWords, play]);

  // Close-eyes → guess after 2s
  useEffect(() => {
    if (state.phase !== 'close-eyes') return;

    const timeout = setTimeout(() => {
      dispatch({ type: 'BEGIN_GUESS' });
    }, 2000);

    return () => clearTimeout(timeout);
  }, [state.phase]);

  // Reveal confetti
  useEffect(() => {
    if (state.phase !== 'reveal') return;

    play('reveal');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD93D', '#2563EB', '#16A34A', '#F59E0B'],
    });
  }, [state.phase, play]);

  const handleReveal = useCallback(() => {
    dispatch({ type: 'REVEAL' });
  }, []);

  const handlePlayAgain = useCallback(() => {
    if (unit) {
      startRound(unit.words);
    }
  }, [unit, startRound]);

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
            This unit needs at least 4 words to play What&apos;s Missing!
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

  // Determine what to show in the grid
  const revealIds = new Set(
    state.phase === 'reveal' ? state.removedWordIds : [],
  );

  // In reveal phase, show all original items (guess items + removed ones appended)
  let gridItems: GridItem[];
  if (state.phase === 'reveal') {
    const removedItems = state.roundWords.filter((item) =>
      state.removedWordIds.includes(item.word.id),
    );
    gridItems = [...state.guessLayout, ...removedItems];
  } else if (state.phase === 'guess') {
    gridItems = state.guessLayout;
  } else {
    gridItems = state.roundWords;
  }

  const showLabels =
    state.phase === 'display' ||
    state.phase === 'reveal' ||
    state.difficulty === 'easy';

  return (
    <div className="relative h-full flex flex-col items-center">
      <GameControls
        difficulty={state.difficulty}
        round={state.round}
        countdown={state.countdown}
        phase={state.phase}
        removedCount={state.removedWordIds.length}
        onSetDifficulty={(d) => dispatch({ type: 'SET_DIFFICULTY', difficulty: d })}
        onReveal={handleReveal}
      />

      <div className="flex-1 flex items-center justify-center w-full">
        <ImageGrid
          items={gridItems}
          showLabels={showLabels}
          revealIds={revealIds}
        />
      </div>

      <CloseEyesOverlay visible={state.phase === 'close-eyes'} />

      <div className="h-16 flex items-center justify-center">
        {state.phase === 'reveal' && (
          <button
            className="bg-primary text-white px-6 py-3 rounded-full font-bold text-lg shadow-card hover:shadow-hover transition-shadow"
            onClick={handlePlayAgain}
          >
            Play Again
          </button>
        )}
      </div>
    </div>
  );
}
