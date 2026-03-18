import { motion } from 'framer-motion';
import { BODY_PARTS } from './bodyParts';
import type { BodyPartCategory } from './types';
import { CATEGORY_LABELS } from './types';

interface PartSelectorProps {
  category: BodyPartCategory;
  onSelect: (variantId: string) => void;
}

export function PartSelector({ category, onSelect }: PartSelectorProps) {
  const variants = BODY_PARTS[category];

  return (
    <motion.div
      className="w-full px-4 py-3"
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <p
        className="text-center text-lg font-bold text-primary mb-3"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Choose {CATEGORY_LABELS[category]}!
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        {variants.map((variant) => (
          <motion.button
            key={variant.id}
            className="flex flex-col items-center gap-2 p-3 bg-white rounded-2xl shadow-card border-2 border-transparent hover:border-primary/40 cursor-pointer"
            style={{ width: 120 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(variant.id)}
          >
            <svg viewBox="-80 -80 160 160" width="80" height="80">
              {variant.render()}
            </svg>
            <span className="text-sm font-bold text-text">{variant.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
