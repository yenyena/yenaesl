import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../../components/ui';
import type { TeamState } from './types';

interface VictoryScreenProps {
  visible: boolean;
  winnerTeam: TeamState;
  teams: [TeamState, TeamState];
  totalTurns: number;
  onPlayAgain: () => void;
  onBackToGames: () => void;
}

export function VictoryScreen({
  visible,
  winnerTeam,
  teams,
  totalTurns,
  onPlayAgain,
  onBackToGames,
}: VictoryScreenProps) {
  useEffect(() => {
    if (!visible) return;

    const colors = ['#D4A574', '#F59E0B', '#FFD93D', '#B45309', '#FDE68A'];
    let count = 0;
    const interval = setInterval(() => {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55, x: 0.25 + Math.random() * 0.5 },
        colors,
        shapes: ['circle', 'square'],
      });
      count++;
      if (count >= 6) clearInterval(interval);
    }, 350);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 flex items-center justify-center"
          style={{ backdropFilter: 'blur(6px)', background: 'radial-gradient(ellipse, rgba(120,70,20,0.5), rgba(0,0,0,0.5))' }}
        >
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 40 }}
            animate={{ scale: [0, 1.08, 1], opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 14 }}
            className="rounded-3xl p-8 md:p-12 text-center max-w-md mx-4 relative overflow-hidden"
            style={{
              background: 'linear-gradient(160deg, #FFFBEB, #FEF3C7, #FDE68A)',
              boxShadow: '0 12px 48px rgba(180, 120, 60, 0.4), inset 0 1px 0 rgba(255,255,255,0.8)',
              border: '4px solid #D4A574',
            }}
          >
            {/* Golden shimmer accent */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(110deg, transparent 25%, rgba(255,217,61,0.15) 50%, transparent 75%)',
              }}
              animate={{ x: [-400, 400] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />

            {/* Treasure chest */}
            <motion.div
              initial={{ scale: 0, rotate: -15 }}
              animate={{ scale: [0, 1.3, 1], rotate: [- 15, 5, 0] }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 10 }}
              className="relative z-10"
            >
              <svg viewBox="0 0 120 100" className="w-32 h-28 mx-auto mb-2">
                {/* Glow */}
                <ellipse cx="60" cy="50" rx="55" ry="35" fill="#FFD93D" opacity="0.2" />

                {/* Chest body */}
                <rect x="15" y="45" width="90" height="45" rx="6" fill="#B45309" stroke="#7C2D12" strokeWidth="2.5" />
                {/* Body bands */}
                <rect x="15" y="55" width="90" height="4" fill="#92400E" opacity="0.5" />
                <rect x="15" y="70" width="90" height="4" fill="#92400E" opacity="0.3" />

                {/* Chest lid (open) */}
                <path d="M12 45 Q60 8 108 45" fill="#D97706" stroke="#7C2D12" strokeWidth="2.5" />
                {/* Lid detail */}
                <path d="M20 43 Q60 16 100 43" fill="none" stroke="#B45309" strokeWidth="1" opacity="0.5" />

                {/* Gold glow from inside */}
                <ellipse cx="60" cy="42" rx="28" ry="12" fill="#FFD93D" opacity="0.6" />
                <ellipse cx="60" cy="40" rx="18" ry="6" fill="#FDE68A" opacity="0.8" />

                {/* Lock */}
                <rect x="52" y="52" width="16" height="14" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
                <circle cx="60" cy="59" r="2.5" fill="#7C2D12" />
                <line x1="60" y1="59" x2="60" y2="63" stroke="#7C2D12" strokeWidth="1.5" />

                {/* Gold coins bursting out */}
                <circle cx="38" cy="32" r="7" fill="#FFD93D" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="38" y="35" textAnchor="middle" fontSize="7" fill="#B45309" fontWeight="bold">$</text>
                <circle cx="60" cy="27" r="8" fill="#FDE68A" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="60" y="31" textAnchor="middle" fontSize="8" fill="#B45309" fontWeight="bold">$</text>
                <circle cx="82" cy="32" r="7" fill="#FFD93D" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="82" y="35" textAnchor="middle" fontSize="7" fill="#B45309" fontWeight="bold">$</text>
                {/* Extra coins */}
                <circle cx="46" cy="24" r="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />
                <circle cx="74" cy="24" r="5" fill="#FCD34D" stroke="#F59E0B" strokeWidth="1" />

                {/* Sparkles */}
                <text x="25" y="20" fontSize="10" opacity="0.8">{'\u{2728}'}</text>
                <text x="90" y="18" fontSize="8" opacity="0.7">{'\u{2B50}'}</text>
                <text x="55" y="14" fontSize="9" opacity="0.9">{'\u{2728}'}</text>
              </svg>
            </motion.div>

            {/* Title with bounce-in */}
            <motion.h2
              className="text-4xl md:text-5xl mb-1 relative z-10"
              style={{
                fontFamily: 'var(--font-heading)',
                color: winnerTeam.color,
                textShadow: `0 2px 8px ${winnerTeam.color}40`,
              }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, type: 'spring' }}
            >
              {winnerTeam.name}
            </motion.h2>
            <motion.p
              className="text-2xl text-amber-700 font-bold mb-4 relative z-10"
              style={{ fontFamily: 'var(--font-heading)' }}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.55 }}
            >
              {'\u{1F3C6}'} Found the Treasure! {'\u{1F3C6}'}
            </motion.p>

            {/* Stats */}
            <motion.div
              className="flex justify-center gap-4 mb-5 relative z-10"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              {teams.map((team, i) => (
                <div
                  key={i}
                  className="text-center px-4 py-3 rounded-xl"
                  style={{
                    background: `${team.color}15`,
                    border: `2px solid ${team.color}30`,
                  }}
                >
                  <div
                    className="font-bold text-base mb-0.5"
                    style={{ color: team.color, fontFamily: 'var(--font-heading)' }}
                  >
                    {team.name}
                  </div>
                  <div className="text-amber-800 font-bold text-lg">
                    {team.wordsCorrect} {'\u{2705}'}
                  </div>
                </div>
              ))}
            </motion.div>

            <motion.p
              className="text-amber-700/70 text-sm mb-5 font-bold relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.85 }}
            >
              {'\u{26F5}'} Voyage: {totalTurns} turns
            </motion.p>

            <motion.div
              className="flex gap-3 justify-center relative z-10"
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.95 }}
            >
              <Button variant="primary" size="lg" onClick={onPlayAgain}>
                {'\u{1F3F4}\u{200D}\u{2620}\u{FE0F}'} Play Again
              </Button>
              <Button variant="ghost" size="lg" onClick={onBackToGames}>
                Back to Games
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
