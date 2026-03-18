import { motion, AnimatePresence } from 'framer-motion';

interface CategoryRevealProps {
  visible: boolean;
  categoryName: string;
}

export function CategoryReveal({ visible, categoryName }: CategoryRevealProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="text-center py-3"
        >
          <p className="font-heading text-2xl md:text-3xl text-primary">
            These are all{' '}
            <span className="text-secondary">{categoryName}</span>!
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
