import { AnimatePresence } from 'framer-motion';
import { OverlaySquare } from './OverlaySquare';
import type { Phase } from './types';

interface RevealGridProps {
  imageSrc: string;
  imageAlt: string;
  squares: boolean[];
  phase: Phase;
  dissolve: boolean;
  onRemoveSquare: (index: number) => void;
}

export function RevealGrid({
  imageSrc,
  imageAlt,
  squares,
  phase,
  dissolve,
  onRemoveSquare,
}: RevealGridProps) {
  return (
    <div
      className={`relative aspect-square w-full max-w-[450px] rounded-2xl overflow-hidden bg-surface shadow-card ${
        phase === 'revealed' ? 'golden-pulse' : ''
      }`}
    >
      {/* Vocabulary image */}
      <img
        src={imageSrc}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-contain p-2"
        draggable={false}
      />

      {/* 3x3 overlay grid — always render all 9 cells so positions stay fixed */}
      <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-1 p-1">
        {squares.map((covered, i) => (
          <div key={i} className="relative">
            <AnimatePresence>
              {covered && (
                <OverlaySquare
                  key={`sq-${i}`}
                  index={i}
                  dissolve={dissolve}
                  onRemove={onRemoveSquare}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
