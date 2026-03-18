import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { MonsterBase, ANCHOR_POINTS } from './monsterBase';
import { BODY_PARTS } from './bodyParts';
import type { SelectedPart, GamePhase } from './types';

interface MonsterCanvasProps {
  selectedParts: SelectedPart[];
  phase: GamePhase;
  latestCategory?: string;
}

export const MonsterCanvas = forwardRef<HTMLDivElement, MonsterCanvasProps>(
  function MonsterCanvas({ selectedParts, phase, latestCategory }, ref) {
    const isComplete = phase === 'complete';
    const isAttaching = phase === 'attaching';

    return (
      <motion.div
        ref={ref}
        className="flex items-center justify-center"
        animate={
          isComplete
            ? {
                rotate: [0, -5, 5, -5, 5, 0],
                y: [0, -8, 0, -8, 0],
              }
            : isAttaching
              ? { rotate: [0, -3, 3, -2, 1, 0] }
              : {}
        }
        transition={
          isComplete
            ? { duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }
            : { duration: 0.5 }
        }
      >
        <svg
          viewBox="0 0 400 480"
          width="100%"
          height="100%"
          style={{ maxWidth: 360, maxHeight: 440 }}
        >
          {/* Render extra/wings behind the body */}
          {selectedParts
            .filter((p) => p.category === 'extra')
            .map((part) => {
              const anchor = ANCHOR_POINTS[part.category];
              const variants = BODY_PARTS[part.category];
              const variant = variants.find((v) => v.id === part.variantId);
              if (!variant) return null;
              const isNew = latestCategory === part.category;
              return (
                <g key={part.category} transform={`translate(${anchor.x}, ${anchor.y})`}>
                  <motion.g
                    initial={isNew ? { scale: 0, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {variant.render()}
                  </motion.g>
                </g>
              );
            })}

          {/* Monster body */}
          <MonsterBase />

          {/* Render all non-extra parts on top of body */}
          {selectedParts
            .filter((p) => p.category !== 'extra')
            .map((part) => {
              const anchor = ANCHOR_POINTS[part.category];
              const variants = BODY_PARTS[part.category];
              const variant = variants.find((v) => v.id === part.variantId);
              if (!variant) return null;
              const isNew = latestCategory === part.category;
              return (
                <g key={part.category} transform={`translate(${anchor.x}, ${anchor.y})`}>
                  <motion.g
                    initial={isNew ? { scale: 0, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {variant.render()}
                  </motion.g>
                </g>
              );
            })}
        </svg>
      </motion.div>
    );
  },
);
