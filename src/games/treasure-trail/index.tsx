import { useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useVocabStore } from '../../stores/useVocabStore';
import { treasureTrailReducer, initialState } from './reducer';
import { generateBoard } from './mapGenerator';
import { generatePath } from './pathGeometry';
import { SetupScreen } from './SetupScreen';
import { TreasureMap } from './TreasureMap';
import { ChallengePanel } from './ChallengePanel';
import { DieRoll } from './DieRoll';
import { SpecialSquareOverlay } from './SpecialSquareOverlay';
import { VictoryScreen } from './VictoryScreen';
import { useGameSounds } from './useGameSounds';
import type { GameConfig } from './types';

function ScoreBar({ teams, activeTeam }: { teams: [{ name: string; position: number; wordsCorrect: number; color: string }, { name: string; position: number; wordsCorrect: number; color: string }]; activeTeam: 0 | 1 }) {
  return (
    <div className="flex items-center justify-center gap-3 px-3 py-1.5">
      {teams.map((team, i) => {
        const isActive = i === activeTeam;
        return (
          <motion.div
            key={i}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-bold"
            style={{
              background: isActive ? `${team.color}20` : 'transparent',
              border: isActive ? `2px solid ${team.color}50` : '2px solid transparent',
              color: team.color,
              fontFamily: 'var(--font-heading)',
            }}
            animate={isActive ? { scale: [1, 1.04, 1] } : { scale: 1 }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <span
              className="w-3.5 h-3.5 rounded-full shadow-sm"
              style={{ background: team.color }}
            />
            <span className="truncate max-w-24">{team.name}</span>
            <span className="bg-white/80 px-2 py-0.5 rounded-lg text-xs">
              {'\u{2705}'} {team.wordsCorrect}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

export function TreasureTrail() {
  const { uid } = useParams();
  const navigate = useNavigate();
  const { getUnit } = useVocabStore();
  const unit = uid ? getUnit(uid) : undefined;

  const [state, dispatch] = useReducer(treasureTrailReducer, initialState);
  const { play } = useGameSounds();

  // Visual positions for hop animation
  const [visualPositions, setVisualPositions] = useState<[number, number]>([0, 0]);
  const animatingRef = useRef(false);

  // Sync visual positions when not animating
  useEffect(() => {
    if (!animatingRef.current && state.phase !== 'moving') {
      setVisualPositions([state.teams[0].position, state.teams[1].position]);
    }
  }, [state.teams, state.phase]);

  // Hop animation for token movement
  useEffect(() => {
    if (state.phase !== 'moving') return;

    const moverIdx = state.moverTeam;
    const targetPos = state.teams[moverIdx].position;
    const currentVisual = visualPositions[moverIdx];

    if (currentVisual === targetPos) {
      dispatch({ type: 'MOVE_COMPLETE' });
      return;
    }

    animatingRef.current = true;
    const direction = targetPos > currentVisual ? 1 : -1;
    let pos = currentVisual;

    const hop = () => {
      pos += direction;
      play('move');
      setVisualPositions((prev) => {
        const next = [...prev] as [number, number];
        next[moverIdx] = pos;
        return next;
      });

      if (pos === targetPos) {
        animatingRef.current = false;
        setTimeout(() => dispatch({ type: 'MOVE_COMPLETE' }), 200);
      } else {
        setTimeout(hop, 150);
      }
    };

    const timer = setTimeout(hop, 150);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase === 'moving' && state.rollValue]);

  // Auto-dismiss special square overlay
  useEffect(() => {
    if (state.phase !== 'special') return;

    if (state.currentSpecial === 'roll-again') {
      play('rollAgain');
    } else if (state.currentSpecial === 'warp') {
      play('warp');
    } else if (state.currentSpecial === 'setback') {
      play('setback');
    } else if (state.currentSpecial === 'swap') {
      play('swap');
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'SPECIAL_RESOLVED' });
    }, 1500);

    return () => clearTimeout(timer);
  }, [state.phase, state.currentSpecial, play]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        if (state.phase === 'challenge') {
          handleCorrect();
        } else if (state.phase === 'steal-chance') {
          handleStealCorrect();
        }
      } else if (e.code === 'KeyS' && state.phase === 'challenge') {
        e.preventDefault();
        handleSteal();
      } else if (e.code === 'KeyR' && state.phase === 'challenge') {
        e.preventDefault();
        handleReveal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleStart = useCallback((config: GameConfig) => {
    if (!unit) return;
    const squares = generateBoard(config.pathLength, config.density);
    const { pathD, points } = generatePath(config.pathLength);
    dispatch({
      type: 'START_GAME',
      words: unit.words,
      config,
      squares,
      pathPoints: points,
      pathD,
    });
    setVisualPositions([0, 0]);
  }, [unit]);

  const handleCorrect = useCallback(() => {
    play('correct');
    dispatch({ type: 'CORRECT' });
  }, [play]);

  const handleSteal = useCallback(() => {
    play('steal');
    dispatch({ type: 'STEAL' });
  }, [play]);

  const handleStealCorrect = useCallback(() => {
    play('correct');
    dispatch({ type: 'STEAL_CORRECT' });
  }, [play]);

  const handleStealMiss = useCallback(() => {
    play('stealMiss');
    dispatch({ type: 'STEAL_MISS' });
  }, [play]);

  const handleReveal = useCallback(() => {
    play('reveal');
    dispatch({ type: 'REVEAL' });
  }, [play]);

  const handleAcknowledgeReveal = useCallback(() => {
    dispatch({ type: 'ACKNOWLEDGE_REVEAL' });
  }, []);

  const handleRollComplete = useCallback((value: number) => {
    dispatch({ type: 'ROLL_COMPLETE', value });
  }, []);

  const handleSpecialDone = useCallback(() => {
    dispatch({ type: 'SPECIAL_RESOLVED' });
  }, []);

  const handlePlayAgain = useCallback(() => {
    dispatch({ type: 'PLAY_AGAIN' });
  }, []);

  const handleBackToGames = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Not enough words guard
  if (!unit || unit.words.length < 5) {
    return (
      <div className="flex items-center justify-center h-full">
        <motion.div
          className="text-center p-10 rounded-3xl max-w-md mx-4"
          style={{
            background: 'linear-gradient(145deg, #FEF3C7, #F5E6C8)',
            border: '3px solid #D4A574',
            boxShadow: '0 8px 32px rgba(180,120,60,0.2)',
          }}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <motion.span
            className="text-7xl block mb-4"
            animate={{ rotate: [-5, 5, -5], y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            {'\u{1F3F4}\u{200D}\u{2620}\u{FE0F}'}
          </motion.span>
          <h2
            className="text-3xl text-amber-900 mb-3"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Need More Words!
          </h2>
          <p className="text-amber-800 text-lg mb-5 font-bold">
            This unit needs at least 5 words to set sail!
            <br />
            <span className="text-amber-600">Currently: {unit?.words.length ?? 0} words</span>
          </p>
          <Link
            to="/settings"
            className="inline-block px-6 py-3 rounded-xl text-white font-bold text-lg no-underline"
            style={{
              background: 'linear-gradient(135deg, #D97706, #B45309)',
              fontFamily: 'var(--font-heading)',
            }}
          >
            {'\u{2699}\u{FE0F}'} Add Words
          </Link>
        </motion.div>
      </div>
    );
  }

  // Setup phase
  if (state.phase === 'setup') {
    return <SetupScreen onStart={handleStart} />;
  }

  const currentWord = state.wordQueue[state.currentWordIndex];
  if (!currentWord && state.phase !== 'victory') return null;

  const stealingTeam = state.teams[state.activeTeam === 0 ? 1 : 0];
  const isInteractivePhase = state.phase === 'challenge' || state.phase === 'steal-chance' || state.phase === 'reveal';

  return (
    <div
      className="relative h-full flex flex-col"
      style={{ background: 'linear-gradient(180deg, #FEF9EE, #F5E6C8 60%, #E8D5B0)' }}
    >
      {/* Score bar */}
      <ScoreBar teams={state.teams} activeTeam={state.activeTeam} />

      {/* Main content: map + panel */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Map area */}
        <div className="flex-1 min-h-0 p-2">
          <TreasureMap
            squares={state.squares}
            pathPoints={state.pathPoints}
            pathD={state.pathD}
            teams={state.teams}
            visualPositions={visualPositions}
          />
        </div>

        {/* Side panel */}
        {isInteractivePhase && currentWord && (
          <motion.div
            className="w-full lg:w-80 flex-shrink-0 lg:border-l-0"
            style={{
              background: 'linear-gradient(180deg, rgba(254,249,238,0.95), rgba(245,230,200,0.95))',
              borderLeft: '3px solid #E8D5B0',
            }}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <ChallengePanel
              word={currentWord}
              phase={state.phase}
              activeTeam={state.teams[state.activeTeam]}
              stealingTeam={stealingTeam}
              onCorrect={handleCorrect}
              onSteal={handleSteal}
              onStealCorrect={handleStealCorrect}
              onStealMiss={handleStealMiss}
              onReveal={handleReveal}
              onAcknowledgeReveal={handleAcknowledgeReveal}
            />
          </motion.div>
        )}

        {/* Moving phase indicator */}
        {state.phase === 'moving' && (
          <div className="w-full lg:w-80 flex-shrink-0 flex items-center justify-center" style={{ borderLeft: '3px solid #E8D5B0' }}>
            <motion.div
              className="text-center p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.span
                className="text-5xl block mb-2"
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                {'\u{26F5}'}
              </motion.span>
              <p
                className="text-amber-800 text-xl font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Sailing...
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Overlays */}
      <DieRoll
        visible={state.phase === 'rolling'}
        dieRange={state.config.dieRange}
        onComplete={handleRollComplete}
      />

      <SpecialSquareOverlay
        visible={state.phase === 'special'}
        specialType={state.currentSpecial}
        onDone={handleSpecialDone}
      />

      <VictoryScreen
        visible={state.phase === 'victory'}
        winnerTeam={state.teams[state.moverTeam]}
        teams={state.teams}
        totalTurns={state.totalTurns}
        onPlayAgain={handlePlayAgain}
        onBackToGames={handleBackToGames}
      />
    </div>
  );
}
