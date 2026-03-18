import { useEffect } from 'react';
import { motion, useAnimationControls } from 'framer-motion';

interface CountdownOverlayProps {
  countdown: number;
  visible: boolean;
}

export function CountdownOverlay({ countdown, visible }: CountdownOverlayProps) {
  const controls = useAnimationControls();

  useEffect(() => {
    if (visible) {
      controls.start({
        scale: [1, 1.15, 1],
        transition: { duration: 0.3, ease: 'easeInOut' },
      });
    }
  }, [countdown, visible, controls]);

  return (
    <div className={`flex items-center justify-center gap-4 py-3 ${visible ? '' : 'invisible'}`}>
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={visible ? { scale: 1, opacity: 1 } : {}}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center shadow-hover"
      >
        <motion.span
          animate={controls}
          className="font-heading text-4xl md:text-5xl text-white"
        >
          {countdown}
        </motion.span>
      </motion.div>
      <motion.p
        initial={{ opacity: 0, x: -10 }}
        animate={visible ? { opacity: 1, x: 0 } : {}}
        className="font-heading text-2xl md:text-3xl text-primary"
      >
        Memorize the cards!
      </motion.p>
    </div>
  );
}
