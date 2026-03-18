import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '../../components/ui';

interface VictoryOverlayProps {
  visible: boolean;
  attempts: number;
  onPlayAgain: () => void;
  onBackToGames: () => void;
}

export function VictoryOverlay({
  visible,
  attempts,
  onPlayAgain,
  onBackToGames,
}: VictoryOverlayProps) {
  useEffect(() => {
    if (!visible) return;

    const colors = ['#2563EB', '#F59E0B', '#16A34A', '#FF6B6B', '#FFD93D'];
    let count = 0;
    const interval = setInterval(() => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6, x: 0.3 + Math.random() * 0.4 },
        colors,
      });
      count++;
      if (count >= 6) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-20 flex items-center justify-center bg-black/40"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="bg-surface rounded-card shadow-hover p-8 md:p-12 text-center max-w-md mx-4"
          >
            <span className="text-6xl block mb-4">&#11088;</span>
            <h2 className="text-3xl md:text-4xl text-primary mb-2">
              Great Job!
            </h2>
            <p className="text-text-light text-lg mb-6">
              Completed in {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="primary" size="lg" onClick={onPlayAgain}>
                Play Again
              </Button>
              <Button variant="ghost" size="lg" onClick={onBackToGames}>
                Back to Games
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
