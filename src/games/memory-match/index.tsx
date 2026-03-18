import { useReducer, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useVocabStore } from '../../stores/useVocabStore';
import { memoryMatchReducer, initialState } from './reducer';
import { CardGrid } from './CardGrid';
import { CountdownOverlay } from './CountdownOverlay';
import { VictoryOverlay } from './VictoryOverlay';
import { useGameSounds } from './useGameSounds';
import type { MemoryCard } from './types';
import type { Word } from '../../types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildCards(words: Word[]): MemoryCard[] {
  const selected = shuffleArray(words).slice(0, 4);
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
  const { play } = useGameSounds();

  const evaluatingRef = useRef(false);
  const noMatchIndicesRef = useRef<number[]>([]);
  const [, forceRender] = useReducer((x: number) => x + 1, 0);

  const startGame = useCallback(
    (words: Word[]) => {
      const cards = buildCards(words);
      dispatch({ type: 'START_MEMORIZE', cards });
    },
    [],
  );

  // Start game on mount / when unit loads
  useEffect(() => {
    if (unit && unit.words.length >= 4) {
      startGame(unit.words);
    }
  }, [unit, startGame]);

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
    if (state.phase !== 'playing' || state.matchedPairs < 4) return;

    const timeout = setTimeout(() => {
      dispatch({ type: 'VICTORY' });
      play('victory');
    }, 800);

    return () => clearTimeout(timeout);
  }, [state.matchedPairs, state.phase, play]);

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
      startGame(unit.words);
    }
  }, [unit, startGame]);

  const handleBackToGames = useCallback(() => {
    navigate('/');
  }, [navigate]);

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

  return (
    <div className="relative h-full flex flex-col items-center justify-center">
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
