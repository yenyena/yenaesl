import { forwardRef } from 'react';
import type { BubbleData } from './types';

interface FloatingBubbleProps {
  bubble: BubbleData;
  frozen: boolean;
  showLabel: boolean;
  isTarget: boolean;
  isShaking: boolean;
  isCorrectResult: boolean;
  onClick: () => void;
}

export const FloatingBubble = forwardRef<HTMLDivElement, FloatingBubbleProps>(
  function FloatingBubble({ bubble, frozen, showLabel, isShaking, isCorrectResult, onClick }, ref) {
    return (
      <div
        ref={ref}
        onClick={onClick}
        className={`absolute w-[160px] h-[160px] cursor-pointer select-none ${frozen ? 'frost-border' : ''}`}
        style={{
          willChange: 'transform',
          top: 0,
          left: 0,
        }}
      >
        <div
          className={`
            w-full h-full rounded-[20px] overflow-hidden
            flex flex-col items-center justify-center
            bg-surface shadow-card border-3
            transition-shadow duration-300
            ${isCorrectResult ? 'border-correct shadow-[0_0_20px_6px_rgba(22,163,74,0.5)]' : 'border-primary/20'}
          `}
          style={isShaking ? { animation: 'bubble-shake 0.4s ease' } : undefined}
        >
          <img
            src={bubble.image}
            alt={bubble.text}
            className="w-[120px] h-[100px] object-contain pointer-events-none"
            draggable={false}
          />
          {showLabel && (
            <span className="text-sm font-bold text-text mt-1 truncate max-w-[140px] px-1">
              {bubble.text}
            </span>
          )}
        </div>
      </div>
    );
  },
);
