import { motion, AnimatePresence } from 'framer-motion';
import type { Word } from '../../types';
import type { Phase, TeamState } from './types';

interface ChallengePanelProps {
  word: Word;
  phase: Phase;
  activeTeam: TeamState;
  stealingTeam: TeamState;
  onCorrect: () => void;
  onSteal: () => void;
  onStealCorrect: () => void;
  onStealMiss: () => void;
  onReveal: () => void;
  onAcknowledgeReveal: () => void;
}

export function ChallengePanel({
  word,
  phase,
  activeTeam,
  stealingTeam,
  onCorrect,
  onSteal,
  onStealCorrect,
  onStealMiss,
  onReveal,
  onAcknowledgeReveal,
}: ChallengePanelProps) {
  const isChallenge = phase === 'challenge';
  const isSteal = phase === 'steal-chance';
  const isReveal = phase === 'reveal';

  const bannerTeam = isSteal ? stealingTeam : activeTeam;

  return (
    <div className="flex flex-col items-center gap-3 p-4 h-full justify-center">
      {/* Team turn banner */}
      <AnimatePresence mode="wait">
        <motion.div
          key={bannerTeam.name + phase}
          initial={{ scale: 0.8, opacity: 0, y: -10 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="w-full py-3 px-5 rounded-2xl text-center relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${bannerTeam.color}, ${bannerTeam.color}DD)`,
            boxShadow: `0 4px 20px ${bannerTeam.color}40`,
          }}
        >
          {/* Shimmer */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
            }}
          />
          <span
            className="text-white text-2xl font-bold relative z-10 drop-shadow-sm"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {isSteal
              ? `${'\u{1F3F4}\u{200D}\u{2620}\u{FE0F}'} ${stealingTeam.name} steals!`
              : `${'\u{2694}\u{FE0F}'} ${activeTeam.name}'s turn`}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Prompt */}
      <motion.p
        className="text-lg text-amber-800 font-bold"
        style={{ fontFamily: 'var(--font-heading)' }}
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {isReveal ? '' : 'What is this?'}
      </motion.p>

      {/* Vocab image */}
      <motion.div
        key={word.id}
        className="w-48 h-48 rounded-2xl flex items-center justify-center overflow-hidden relative"
        style={{
          background: 'linear-gradient(145deg, #FFFFFF, #FEF3C7)',
          boxShadow: '0 6px 24px rgba(180, 120, 60, 0.2), inset 0 1px 0 rgba(255,255,255,1)',
          border: '3px solid #E8D5B0',
        }}
        initial={{ scale: 0.7, opacity: 0, rotate: -5 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <img
          src={word.image}
          alt={isReveal ? word.text : 'What is this?'}
          className="max-w-full max-h-full object-contain p-3"
          draggable={false}
        />
      </motion.div>

      {/* Reveal word text */}
      <AnimatePresence>
        {isReveal && (
          <motion.div
            className="text-center"
            initial={{ scale: 0, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          >
            <p
              className="text-3xl font-bold text-amber-800"
              style={{
                fontFamily: 'var(--font-heading)',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {word.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2.5 justify-center mt-1">
        {isChallenge && (
          <>
            <motion.button
              className="px-5 py-3 rounded-2xl font-bold text-white text-lg cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                fontFamily: 'var(--font-heading)',
              }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={onCorrect}
            >
              {'\u{2705}'} Correct!
              <kbd className="ml-1.5 text-[10px] opacity-60 bg-white/20 px-1.5 py-0.5 rounded-md font-mono">Space</kbd>
            </motion.button>
            <motion.button
              className="px-5 py-3 rounded-2xl font-bold text-white text-lg cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #F97316, #EA580C)',
                boxShadow: '0 4px 14px rgba(234, 88, 12, 0.35)',
                fontFamily: 'var(--font-heading)',
              }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={onSteal}
            >
              {'\u{1F3F4}\u{200D}\u{2620}\u{FE0F}'} Steal
              <kbd className="ml-1.5 text-[10px] opacity-60 bg-white/20 px-1.5 py-0.5 rounded-md font-mono">S</kbd>
            </motion.button>
            <motion.button
              className="px-5 py-3 rounded-2xl font-bold text-amber-800 text-lg border-3 border-amber-300 bg-amber-50 cursor-pointer"
              style={{ fontFamily: 'var(--font-heading)' }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={onReveal}
            >
              {'\u{1F441}\u{FE0F}'} Reveal
              <kbd className="ml-1.5 text-[10px] opacity-60 bg-amber-200 px-1.5 py-0.5 rounded-md font-mono">R</kbd>
            </motion.button>
          </>
        )}

        {isSteal && (
          <>
            <motion.button
              className="px-6 py-3 rounded-2xl font-bold text-white text-lg cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                boxShadow: '0 4px 14px rgba(22, 163, 74, 0.35)',
                fontFamily: 'var(--font-heading)',
              }}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={onStealCorrect}
            >
              {'\u{1F389}'} Got it!
              <kbd className="ml-1.5 text-[10px] opacity-60 bg-white/20 px-1.5 py-0.5 rounded-md font-mono">Space</kbd>
            </motion.button>
            <motion.button
              className="px-6 py-3 rounded-2xl font-bold text-white text-lg cursor-pointer border-none"
              style={{
                background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
                fontFamily: 'var(--font-heading)',
              }}
              initial={{ scale: 0, rotate: 10 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.93 }}
              onClick={onStealMiss}
            >
              {'\u{274C}'} Missed!
            </motion.button>
          </>
        )}

        {isReveal && (
          <motion.button
            className="px-6 py-3 rounded-2xl font-bold text-white text-lg cursor-pointer border-none"
            style={{
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
              fontFamily: 'var(--font-heading)',
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.93 }}
            onClick={onAcknowledgeReveal}
          >
            {'\u{27A1}\u{FE0F}'} Next Turn
          </motion.button>
        )}
      </div>
    </div>
  );
}
