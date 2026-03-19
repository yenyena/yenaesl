import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DieRange } from './types';

interface DieRollProps {
  visible: boolean;
  dieRange: DieRange;
  onComplete: (value: number) => void;
}

function DieFace({ value, settled }: { value: number; settled: boolean }) {
  const dots: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[28, 28], [72, 72]],
    3: [[28, 28], [50, 50], [72, 72]],
    4: [[28, 28], [72, 28], [28, 72], [72, 72]],
    5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
    6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]],
  };

  const positions = dots[value] ?? dots[1];

  return (
    <svg viewBox="0 0 100 100" className="w-36 h-36 drop-shadow-lg">
      <defs>
        <linearGradient id="die-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
        <filter id="die-shadow" x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#92400E" floodOpacity="0.2" />
        </filter>
      </defs>
      {/* Die body */}
      <rect
        x="4" y="4" width="92" height="92" rx="16"
        fill="url(#die-bg)"
        stroke="#D97706"
        strokeWidth="3.5"
        filter="url(#die-shadow)"
      />
      {/* Inner border */}
      <rect
        x="10" y="10" width="80" height="80" rx="12"
        fill="none"
        stroke="#FDE68A"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {/* Dots */}
      {positions.map(([cx, cy], i) => (
        <g key={i}>
          {/* Dot shadow */}
          <circle cx={cx + 1} cy={cy + 1} r={settled ? 10 : 8} fill="rgba(0,0,0,0.1)" />
          {/* Dot */}
          <circle cx={cx} cy={cy} r={settled ? 10 : 8} fill="#78350F" />
          {/* Dot highlight */}
          <circle cx={cx - 2} cy={cy - 2} r={settled ? 3 : 2} fill="rgba(255,255,255,0.3)" />
        </g>
      ))}
    </svg>
  );
}

export function DieRoll({ visible, dieRange, onComplete }: DieRollProps) {
  const [displayValue, setDisplayValue] = useState(1);
  const [settled, setSettled] = useState(false);
  const finalValueRef = useRef(0);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    if (!visible) {
      hasCompletedRef.current = false;
      setSettled(false);
      return;
    }

    const finalValue = Math.floor(Math.random() * dieRange) + 1;
    finalValueRef.current = finalValue;
    hasCompletedRef.current = false;

    const cycleInterval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * dieRange) + 1);
    }, 80);

    const settleTimeout = setTimeout(() => {
      clearInterval(cycleInterval);
      setDisplayValue(finalValue);
      setSettled(true);
    }, 800);

    const completeTimeout = setTimeout(() => {
      if (!hasCompletedRef.current) {
        hasCompletedRef.current = true;
        onComplete(finalValue);
      }
    }, 1500);

    return () => {
      clearInterval(cycleInterval);
      clearTimeout(settleTimeout);
      clearTimeout(completeTimeout);
    };
  }, [visible, dieRange, onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-30 flex flex-col items-center justify-center"
          style={{ background: 'radial-gradient(ellipse, rgba(0,0,0,0.5), rgba(0,0,0,0.3))' }}
        >
          {/* Label */}
          <motion.p
            className="text-white text-2xl font-bold mb-4 drop-shadow-lg"
            style={{ fontFamily: 'var(--font-heading)' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {settled ? `Rolled a ${displayValue}!` : 'Rolling...'}
          </motion.p>

          {/* Die */}
          <motion.div
            initial={{ scale: 0.3, rotate: -30 }}
            animate={
              settled
                ? { scale: [1.35, 1], rotate: 0 }
                : { scale: 1, rotate: [0, 15, -15, 10, -10, 0] }
            }
            transition={
              settled
                ? { type: 'spring', stiffness: 300, damping: 12 }
                : { repeat: Infinity, duration: 0.4 }
            }
          >
            <DieFace value={displayValue} settled={settled} />
          </motion.div>

          {/* Burst sparkles on settle */}
          {settled && (
            <>
              {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const dist = 70 + Math.random() * 20;
                return (
                  <motion.span
                    key={i}
                    className="absolute text-xl"
                    initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
                    animate={{
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist - 30,
                      opacity: 0,
                      scale: 1.5,
                    }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    {'\u{2728}'}
                  </motion.span>
                );
              })}
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
