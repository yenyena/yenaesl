import { useReducer, useEffect, useCallback, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useVocabStore } from '../../stores/useVocabStore';
import { freezeAndFindReducer, initialState } from './reducer';
import { useGameSounds } from './useGameSounds';
import { useBubblePhysics } from './useBubblePhysics';
import { FloatingBubble } from './FloatingBubble';
import { FreezeOverlay } from './FreezeOverlay';
import type { BubbleData } from './types';

const MIN_WORDS = 4;
const MAX_BUBBLES = 8;

export function FreezeAndFind() {
  const { uid } = useParams();
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(freezeAndFindReducer, initialState);
  const { play } = useGameSounds();

  const containerRef = useRef<HTMLDivElement>(null);
  const [speed, setSpeed] = useState(1);
  const frozen = state.phase !== 'drifting' && state.phase !== 'resuming';
  const { bubbleRefs, initPositions } = useBubblePhysics(
    containerRef,
    state.bubbles.length,
    frozen,
    speed,
  );
  const [freezeFlash, setFreezeFlash] = useState(false);
  const [shakeId, setShakeId] = useState<string | null>(null);

  // Initialize game
  const startGame = useCallback(() => {
    if (!unit || unit.words.length < MIN_WORDS) return;
    const words = unit.words.slice(0, MAX_BUBBLES);
    const bubbles: BubbleData[] = words.map((w) => ({
      id: w.id,
      wordId: w.id,
      text: w.text,
      image: w.image,
    }));
    dispatch({ type: 'INIT', bubbles });
  }, [unit]);

  useEffect(() => {
    startGame();
  }, [startGame]);

  // Init positions once bubbles are set
  useEffect(() => {
    if (state.bubbles.length > 0 && state.phase === 'drifting') {
      // Small delay to ensure container is measured
      const t = setTimeout(initPositions, 50);
      return () => clearTimeout(t);
    }
  }, [state.bubbles.length]); // eslint-disable-line react-hooks/exhaustive-deps

  // Select a target word, cycling through all words
  const selectTarget = useCallback(() => {
    const available = state.bubbles.filter(
      (b) => !state.usedTargetIds.includes(b.wordId),
    );
    const pool = available.length > 0 ? available : state.bubbles;
    const target = pool[Math.floor(Math.random() * pool.length)];
    return target;
  }, [state.bubbles, state.usedTargetIds]);

  // FREEZE action
  const handleFreeze = useCallback(() => {
    if (state.phase !== 'drifting') return;
    const target = selectTarget();
    if (!target) return;

    dispatch({ type: 'FREEZE', targetWordId: target.wordId, targetWordText: target.text });
    play('freeze');
    setFreezeFlash(true);

    // After flash, begin finding phase
    setTimeout(() => {
      setFreezeFlash(false);
      dispatch({ type: 'BEGIN_FINDING' });
    }, 200);
  }, [state.phase, selectTarget, play]);

  // Keyboard: spacebar to freeze
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && state.phase === 'drifting') {
        e.preventDefault();
        handleFreeze();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [state.phase, handleFreeze]);

  // Result → resume after 3 seconds
  useEffect(() => {
    if (state.phase !== 'result') return;
    const timer = setTimeout(() => {
      dispatch({ type: 'BEGIN_RESUME' });
    }, 3000);
    return () => clearTimeout(timer);
  }, [state.phase]);

  // Resuming → drifting after 500ms thaw
  useEffect(() => {
    if (state.phase !== 'resuming') return;
    play('resume');
    const timer = setTimeout(() => {
      dispatch({ type: 'RESUME' });
    }, 500);
    return () => clearTimeout(timer);
  }, [state.phase, play]);

  // Bubble tap handler
  const handleBubbleTap = useCallback(
    (bubble: BubbleData) => {
      if (state.phase !== 'finding') return;
      if (bubble.wordId === state.targetWordId) {
        dispatch({ type: 'CORRECT_TAP' });
        play('correct');

        // Confetti burst from bubble position
        const bubbleIndex = state.bubbles.findIndex((b) => b.wordId === bubble.wordId);
        const el = bubbleIndex >= 0 ? bubbleRefs.current[bubbleIndex] : null;
        if (el) {
          const rect = el.getBoundingClientRect();
          const x = (rect.left + rect.width / 2) / window.innerWidth;
          const y = (rect.top + rect.height / 2) / window.innerHeight;
          confetti({
            particleCount: 60,
            spread: 50,
            origin: { x, y },
            colors: ['#FFD93D', '#2563EB', '#16A34A', '#F59E0B'],
          });
        }
      } else {
        play('wrong');
        // Shake animation via ref
        setShakeId(bubble.id);
        setTimeout(() => setShakeId(null), 400);
      }
    },
    [state.phase, state.targetWordId, state.bubbles, play, bubbleRefs],
  );

  // Guard: insufficient data
  if (!unit || unit.words.length < MIN_WORDS) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8">
          <span className="text-6xl block mb-4">🧊</span>
          <h2 className="text-2xl text-primary mb-2">Need More Words</h2>
          <p className="text-text-light text-lg mb-4">
            This game needs at least {MIN_WORDS} words with images.
          </p>
          <Link to="/settings" className="text-primary font-bold underline">
            Go to Settings
          </Link>
        </div>
      </div>
    );
  }

  const showTarget =
    state.phase === 'frozen' ||
    state.phase === 'finding' ||
    state.phase === 'result';

  return (
    <div className="flex flex-col h-[calc(100vh-120px)]">
      {/* Score bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-surface/80 border-b border-primary/10">
        <div className="flex items-center gap-4">
          <span className="font-heading text-lg text-primary">
            Score: {state.score}
          </span>
          <span className="text-text-light text-sm">
            Round {state.totalRounds}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-text-light">
            🐢
            <input
              type="range"
              min={0.25}
              max={2.5}
              step={0.25}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-24 accent-primary"
            />
            🐇
          </label>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_LABELS' })}
            className="cursor-pointer bg-primary/10 text-primary border-none px-3 py-1.5 rounded-button text-sm font-bold hover:bg-primary/20 transition-colors"
            title={state.showLabels ? 'Hide labels' : 'Show labels'}
          >
            {state.showLabels ? '👁 Labels' : '👁‍🗨 Hidden'}
          </button>
        </div>
      </div>

      {/* Status area above game — FREEZE button, target word, result */}
      <div className="flex items-center justify-center pb-0 pt-2 h-[72px] shrink-0">
        {/* FREEZE button */}
        {state.phase === 'drifting' && (
          <button
            onClick={handleFreeze}
            className="
              cursor-pointer border-none
              bg-blue-400 hover:bg-blue-500
              text-white font-heading text-xl
              px-8 py-3 rounded-full
              shadow-hover
              transition-all duration-200
              hover:scale-105
            "
            style={{
              animation: 'freeze-pulse 2s ease-in-out infinite',
            }}
          >
            ❄️ FREEZE!
          </button>
        )}

        {/* Target word banner */}
        {showTarget && state.targetWordText && (
          <div className="bg-surface shadow-hover rounded-card px-8 py-3 text-center">
            <p className="text-text-light text-sm mb-1">🔍 Find this word:</p>
            <p className="font-heading text-3xl text-primary">
              {state.targetWordText}
            </p>
          </div>
        )}

        {/* Result feedback */}
        {state.phase === 'result' && (
          <div className="bg-surface shadow-hover rounded-card px-10 py-4 text-center border-3 border-correct ml-4">
            <p className="font-heading text-3xl text-correct">
              Correct! +1 ⭐
            </p>
          </div>
        )}

        {/* Resuming indicator */}
        {state.phase === 'resuming' && (
          <p className="font-heading text-xl text-primary animate-pulse">
            Resuming...
          </p>
        )}
      </div>

      {/* Game area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full h-full max-w-[1280px] max-h-[720px] overflow-hidden"
        style={{ touchAction: 'none' }}
      >
        {/* Floating bubbles */}
        {state.bubbles.map((bubble, i) => (
          <FloatingBubble
            key={bubble.id}
            ref={(el) => {
              bubbleRefs.current[i] = el;
            }}
            bubble={bubble}
            frozen={frozen}
            showLabel={state.showLabels}
            isTarget={bubble.wordId === state.targetWordId}
            isShaking={shakeId === bubble.id}
            isCorrectResult={state.phase === 'result' && bubble.wordId === state.targetWordId}
            onClick={() => handleBubbleTap(bubble)}
          />
        ))}
      </div>
      </div>

      {/* Freeze overlay */}
      <FreezeOverlay trigger={freezeFlash} />
    </div>
  );
}
