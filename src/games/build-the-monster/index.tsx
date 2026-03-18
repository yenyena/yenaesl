import { useReducer, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useVocabStore } from '../../stores/useVocabStore';
import { buildTheMonsterReducer, initialState } from './reducer';
import { MonsterCanvas } from './MonsterCanvas';
import { ChallengePanel } from './ChallengePanel';
import { PartSelector } from './PartSelector';
import { CompletionScreen } from './CompletionScreen';
import { useGameSounds } from './useGameSounds';

export function BuildTheMonster() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(buildTheMonsterReducer, initialState);
  const { play } = useGameSounds();
  const monsterRef = useRef<HTMLDivElement>(null);

  // Init game when unit loads
  useEffect(() => {
    if (unit && unit.words.length >= 5) {
      dispatch({ type: 'INIT', words: unit.words });
    }
  }, [unit]);

  const handleCorrect = useCallback(() => {
    play('correct');
    dispatch({ type: 'CORRECT' });
  }, [play]);

  const handleShowAnswer = useCallback(() => {
    play('showAnswer');
    dispatch({ type: 'SHOW_ANSWER' });
  }, [play]);

  const handleNextWord = useCallback(() => {
    dispatch({ type: 'NEXT_WORD' });
  }, []);

  const handleSelectPart = useCallback(
    (variantId: string) => {
      play('partSelect');
      dispatch({ type: 'SELECT_PART', variantId });
      // Auto-advance after attachment animation
      setTimeout(() => {
        play('partAttach');
        dispatch({ type: 'ATTACH_COMPLETE' });
      }, 600);
    },
    [play],
  );

  const handleSetName = useCallback((name: string) => {
    dispatch({ type: 'SET_NAME', name });
  }, []);

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleExit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Not enough words guard
  if (!unit || unit.words.length < 5) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">👾</span>
          <h2 className="text-2xl text-primary mb-2">Need More Words</h2>
          <p className="text-text-light text-lg mb-4">
            This unit needs at least 5 words to play Build the Monster!
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

  const currentWord = state.wordQueue[state.currentWordIndex];
  if (!currentWord && state.phase !== 'complete') return null;

  return (
    <div className="relative h-full flex flex-col">
      {/* Main layout: Monster + Challenge */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-2 px-4 py-2 min-h-0">
        {/* Monster canvas — left/center */}
        <div className="flex-1 flex items-center justify-center max-w-lg w-full min-h-0">
          <MonsterCanvas
            ref={monsterRef}
            selectedParts={state.selectedParts}
            phase={state.phase}
            latestCategory={
              state.phase === 'attaching'
                ? state.currentCategory
                : undefined
            }
          />
        </div>

        {/* Challenge panel — right side */}
        {state.phase !== 'complete' && currentWord && (
          <div className="flex-shrink-0 w-full lg:w-80">
            <ChallengePanel
              word={currentWord}
              phase={state.phase}
              categoryIndex={state.categoryIndex}
              wordsCompleted={state.wordsCompleted}
              totalWords={unit.words.length}
              onCorrect={handleCorrect}
              onShowAnswer={handleShowAnswer}
              onNextWord={handleNextWord}
            />
          </div>
        )}
      </div>

      {/* Part selector — bottom */}
      <AnimatePresence>
        {state.phase === 'selecting-part' && (
          <PartSelector
            category={state.currentCategory}
            onSelect={handleSelectPart}
          />
        )}
      </AnimatePresence>

      {/* Completion overlay */}
      {state.phase === 'complete' && (
        <CompletionScreen
          monsterName={state.monsterName}
          selectedParts={state.selectedParts}
          wordsCorrect={state.wordsCorrect}
          wordsCompleted={state.wordsCompleted}
          onSetName={handleSetName}
          onPlayAgain={handlePlayAgain}
          onExit={handleExit}
          monsterRef={monsterRef}
        />
      )}
    </div>
  );
}
