import { motion, AnimatePresence } from 'framer-motion';

interface CloseEyesOverlayProps {
  visible: boolean;
}

export function CloseEyesOverlay({ visible }: CloseEyesOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 50%, #7C3AED 100%)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Animated stars */}
          {[...Array(8)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute text-4xl select-none"
              style={{
                top: `${15 + Math.random() * 70}%`,
                left: `${10 + Math.random() * 80}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6, 1],
                scale: [0, 1.2, 0.9, 1],
                rotate: [0, 15, -15, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            >
              ⭐
            </motion.span>
          ))}

          <motion.div
            className="text-center z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-8xl block mb-6">🙈</span>
            <h2
              className="text-5xl text-white drop-shadow-lg"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Close your eyes!
            </h2>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
