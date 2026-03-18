import { useEffect, useRef, type RefObject } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { InlineEdit } from '../../components/ui';
import type { SelectedPart } from './types';
import { MonsterCanvas } from './MonsterCanvas';

interface CompletionScreenProps {
  monsterName: string;
  selectedParts: SelectedPart[];
  wordsCorrect: number;
  wordsCompleted: number;
  onSetName: (name: string) => void;
  onPlayAgain: () => void;
  onExit: () => void;
  monsterRef: RefObject<HTMLDivElement | null>;
}

export function CompletionScreen({
  monsterName,
  selectedParts,
  wordsCorrect,
  wordsCompleted,
  onSetName,
  onPlayAgain,
  onExit,
  monsterRef,
}: CompletionScreenProps) {
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 },
        colors: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#A855F7', '#16A34A', '#F59E0B'],
      });
    }
  }, []);

  const handleSave = async () => {
    if (!monsterRef.current) return;
    try {
      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(monsterRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      const link = document.createElement('a');
      link.download = `${monsterName.replace(/[^a-zA-Z0-9 ]/g, '')}.png`;
      link.href = canvas.toDataURL();
      link.click();
    } catch {
      // html2canvas not available — ignore
    }
  };

  // Split name into words for pop-in animation
  const nameWords = monsterName.split(' ');
  const accentColors = ['#FF6B6B', '#4ECDC4', '#A855F7', '#FFD93D', '#16A34A'];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Monster display */}
      <div className="w-72 h-80 mb-4">
        <MonsterCanvas
          ref={monsterRef}
          selectedParts={selectedParts}
          phase="complete"
        />
      </div>

      {/* Name with pop-in */}
      <div className="flex flex-wrap justify-center gap-2 mb-2">
        {nameWords.map((word, i) => (
          <motion.span
            key={i}
            className="text-3xl"
            style={{
              fontFamily: 'var(--font-heading)',
              color: accentColors[i % accentColors.length],
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.2, type: 'spring', stiffness: 300, damping: 15 }}
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Editable name */}
      <div className="mb-4 text-sm text-text-light">
        <InlineEdit value={monsterName} onSave={onSetName} />
      </div>

      {/* Stats */}
      <p className="text-text-light mb-6">
        {wordsCorrect} / {wordsCompleted} words correct
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <motion.button
          className="px-5 py-3 rounded-full font-bold text-white text-lg shadow-card bg-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
        >
          Save Monster
        </motion.button>
        <motion.button
          className="px-5 py-3 rounded-full font-bold text-white text-lg shadow-card"
          style={{ background: 'var(--color-correct)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgain}
        >
          Play Again
        </motion.button>
        <motion.button
          className="px-5 py-3 rounded-full font-bold text-text-light text-lg border-2 border-text-light/30 bg-white"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExit}
        >
          Back to Games
        </motion.button>
      </div>
    </motion.div>
  );
}
