import { useReducer, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useVocabStore } from '../../stores/useVocabStore';
import { slowRevealReducer, initialState } from './reducer';
import { RevealGrid } from './RevealGrid';
import { WordBank } from './WordBank';
import { SummaryScreen } from './SummaryScreen';
import { useGameSounds } from './useGameSounds';

export function SlowReveal() {
  const { uid } = useParams();
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(slowRevealReducer, initialState);
  const { play } = useGameSounds();
  const dissolveRef = useRef(false);

  // Init on mount
  useEffect(() => {
    if (unit && unit.words.length >= 4) {
      dispatch({ type: 'INIT', words: unit.words });
    }
  }, [unit]);

  // Clear wrong guess after 500ms
  useEffect(() => {
    if (!state.wrongGuessId) return;
    play('wrongGuess');
    const timeout = setTimeout(() => {
      dispatch({ type: 'CLEAR_WRONG_GUESS' });
    }, 500);
    return () => clearTimeout(timeout);
  }, [state.wrongGuessId, play]);

  // Correct guess — confetti + sound
  useEffect(() => {
    if (state.phase !== 'revealed') {
      dissolveRef.current = false;
      return;
    }
    play('correctGuess');
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFD93D', '#2563EB', '#16A34A', '#F59E0B'],
    });
  }, [state.phase, play]);

  const handleRemoveSquare = useCallback(
    (index: number) => {
      if (state.phase !== 'playing') return;
      dispatch({ type: 'REMOVE_SQUARE', index });
      play('squareRemove');
    },
    [state.phase, play],
  );

  const handleRemoveRandom = useCallback(() => {
    if (state.phase !== 'playing') return;
    const coveredIndices = state.squares
      .map((covered, i) => (covered ? i : -1))
      .filter((i) => i !== -1);
    if (coveredIndices.length === 0) return;
    const randomIndex =
      coveredIndices[Math.floor(Math.random() * coveredIndices.length)];
    dispatch({ type: 'REMOVE_SQUARE', index: randomIndex });
    play('squareRemove');
  }, [state.phase, state.squares, play]);

  const handleGuess = useCallback(
    (wordId: string) => {
      if (state.phase !== 'playing') return;
      const isCorrect = state.currentWord?.id === wordId;
      if (isCorrect) {
        dissolveRef.current = true;
      }
      dispatch({ type: 'GUESS', wordId });
    },
    [state.phase, state.currentWord],
  );

  const handleNextWord = useCallback(() => {
    if (!unit) return;
    dispatch({ type: 'NEXT_WORD', allWords: unit.words });
    play('nextWord');
  }, [unit, play]);

  const handlePlayAgain = useCallback(() => {
    if (!unit) return;
    dispatch({ type: 'RESTART', words: unit.words });
  }, [unit]);

  // Not enough words guard
  if (!unit || unit.words.length < 4) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">📝</span>
          <h2 className="text-2xl text-primary mb-2">Need More Words</h2>
          <p className="text-text-light text-lg mb-4">
            This unit needs at least 4 words to play Slow Reveal!
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

  if (state.phase === 'summary') {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <SummaryScreen results={state.results} onPlayAgain={handlePlayAgain} />
      </div>
    );
  }

  const coveredCount = state.squares.filter(Boolean).length;

  return (
    <div className="h-full flex flex-col items-center gap-4 p-4">
      {/* Top controls */}
      <div className="flex items-center gap-4 flex-wrap justify-center">
        <span className="font-heading text-lg text-text-light">
          Word {state.wordIndex + 1} / {state.totalWords}
        </span>
        <span className="text-text-light">
          {coveredCount} / 9 covered
        </span>
        {state.phase === 'playing' && coveredCount > 0 && (
          <button
            onClick={handleRemoveRandom}
            className="bg-secondary text-white px-4 py-2 rounded-full font-bold text-sm shadow-card hover:shadow-hover transition-shadow"
          >
            Remove Random
          </button>
        )}
        {state.phase === 'revealed' && (
          <button
            onClick={handleNextWord}
            className="bg-primary text-white px-6 py-2 rounded-full font-bold text-lg shadow-card hover:shadow-hover transition-shadow"
          >
            {state.wordQueue.length > 0 ? 'Next Word' : 'See Results'}
          </button>
        )}
      </div>

      {/* Reveal grid */}
      <div className="flex-1 flex items-center justify-center w-full">
        {state.currentWord && (
          <RevealGrid
            imageSrc={state.currentWord.image}
            imageAlt={state.currentWord.text}
            squares={state.squares}
            phase={state.phase}
            dissolve={dissolveRef.current}
            onRemoveSquare={handleRemoveSquare}
          />
        )}
      </div>

      {/* Word bank */}
      <div className="pb-4">
        <WordBank
          words={state.wordBank}
          phase={state.phase}
          wrongGuessId={state.wrongGuessId}
          correctWordId={state.currentWord?.id ?? null}
          onGuess={handleGuess}
        />
      </div>
    </div>
  );
}
