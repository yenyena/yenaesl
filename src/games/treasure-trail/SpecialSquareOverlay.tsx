import { motion, AnimatePresence } from 'framer-motion';
import type { SpecialType } from './types';

interface SpecialSquareOverlayProps {
  visible: boolean;
  specialType: SpecialType | null;
  onDone: () => void;
}

const SPECIAL_INFO: Record<SpecialType, {
  emoji: string;
  title: string;
  description: string;
  color: string;
  bgGradient: string;
  sparkles: string[];
}> = {
  'roll-again': {
    emoji: '\u{1F3B2}',
    title: 'Roll Again!',
    description: 'Bonus roll \u2014 keep moving!',
    color: '#16A34A',
    bgGradient: 'linear-gradient(145deg, #F0FDF4, #DCFCE7)',
    sparkles: ['\u{1F3B2}', '\u{2728}', '\u{1F389}'],
  },
  warp: {
    emoji: '\u{2728}',
    title: 'Warp Speed!',
    description: 'Zoom ahead 3 spaces!',
    color: '#7C3AED',
    bgGradient: 'linear-gradient(145deg, #F5F3FF, #EDE9FE)',
    sparkles: ['\u{1F680}', '\u{2B50}', '\u{2728}'],
  },
  setback: {
    emoji: '\u{2693}',
    title: 'Oh no! Setback!',
    description: 'Go back 2 spaces!',
    color: '#DC2626',
    bgGradient: 'linear-gradient(145deg, #FEF2F2, #FECACA)',
    sparkles: ['\u{1F30A}', '\u{1F4A8}', '\u{2693}'],
  },
  swap: {
    emoji: '\u{1F500}',
    title: 'Swap Places!',
    description: 'Trade positions with the other crew!',
    color: '#D97706',
    bgGradient: 'linear-gradient(145deg, #FFFBEB, #FEF3C7)',
    sparkles: ['\u{1F4AB}', '\u{1F300}', '\u{1F500}'],
  },
};

export function SpecialSquareOverlay({ visible, specialType, onDone }: SpecialSquareOverlayProps) {
  const info = specialType ? SPECIAL_INFO[specialType] : null;

  return (
    <AnimatePresence>
      {visible && info && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex items-center justify-center"
          style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.45), rgba(0,0,0,0.25))' }}
          onClick={onDone}
        >
          {/* Burst ring */}
          <motion.div
            className="absolute rounded-full"
            style={{ border: `4px solid ${info.color}30` }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          {/* Floating sparkles */}
          {info.sparkles.map((sparkle, i) => {
            const angle = (i / info.sparkles.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <motion.span
                key={i}
                className="absolute text-3xl pointer-events-none"
                initial={{ scale: 0, rotate: 0 }}
                animate={{
                  scale: [0, 1.3, 1],
                  rotate: [0, 20, -10],
                  x: Math.cos(angle) * 120,
                  y: Math.sin(angle) * 100 - 20,
                }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.5, type: 'spring' }}
              >
                {sparkle}
              </motion.span>
            );
          })}

          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: [0, 1.15, 1], rotate: [- 10, 3, 0] }}
            exit={{ scale: 0, rotate: 10 }}
            transition={{ type: 'spring', stiffness: 220, damping: 14 }}
            className="rounded-3xl p-8 text-center max-w-sm mx-4 cursor-pointer relative overflow-hidden"
            style={{
              background: info.bgGradient,
              boxShadow: `0 8px 40px ${info.color}30, 0 2px 8px rgba(0,0,0,0.1)`,
              border: `4px solid ${info.color}40`,
            }}
          >
            {/* Colored top bar */}
            <div
              className="absolute top-0 left-0 right-0 h-1.5"
              style={{ background: info.color }}
            />

            <motion.span
              className="text-7xl block mb-3"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
            >
              {info.emoji}
            </motion.span>
            <h2
              className="text-4xl mb-2"
              style={{
                fontFamily: 'var(--font-heading)',
                color: info.color,
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
              }}
            >
              {info.title}
            </h2>
            <p
              className="text-lg mb-3 font-bold"
              style={{ color: `${info.color}CC`, fontFamily: 'var(--font-body)' }}
            >
              {info.description}
            </p>
            <motion.p
              className="text-sm opacity-50"
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              Tap to continue
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
