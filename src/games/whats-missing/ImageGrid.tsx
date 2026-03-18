import { motion, AnimatePresence } from 'framer-motion';
import type { GridItem } from './types';

interface ImageGridProps {
  items: GridItem[];
  showLabels: boolean;
  revealIds?: Set<string>;
}

export function ImageGrid({ items, showLabels, revealIds = new Set() }: ImageGridProps) {
  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      <div className="grid grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.word.id}
              className={`aspect-square flex flex-col items-center justify-center rounded-2xl bg-white shadow-card overflow-hidden ${
                revealIds.has(item.word.id) ? 'sparkle-glow' : ''
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              layout
            >
              <div className="flex-1 flex items-center justify-center p-3 w-full">
                <img
                  src={item.word.image}
                  alt={item.word.text}
                  className="max-w-full max-h-full object-contain"
                  draggable={false}
                  style={{ maxHeight: '140px' }}
                />
              </div>
              {showLabels && (
                <div
                  className="pb-3 text-center text-primary text-lg"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {item.word.text}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
