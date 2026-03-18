import { motion } from 'framer-motion';

const SQUARE_COLORS = [
  '#FF6B6B', // coral
  '#2EC4B6', // teal
  '#FFD93D', // yellow
  '#A855F7', // purple
  '#22C55E', // green
  '#F97316', // orange
  '#EC4899', // pink
  '#3B82F6', // blue
  '#84CC16', // lime
];

// Offset directions for dissolve-fly-out (based on 3x3 grid position)
const EXIT_OFFSETS: [number, number][] = [
  [-120, -120], [0, -140], [120, -120],
  [-140, 0],    [0, 0],    [140, 0],
  [-120, 120],  [0, 140],  [120, 120],
];

interface OverlaySquareProps {
  index: number;
  dissolve: boolean;
  onRemove: (index: number) => void;
}

export function OverlaySquare({ index, dissolve, onRemove }: OverlaySquareProps) {
  const color = SQUARE_COLORS[index % SQUARE_COLORS.length];
  const [ox, oy] = EXIT_OFFSETS[index];

  return (
    <motion.button
      initial={{ scale: 1, opacity: 1 }}
      exit={
        dissolve
          ? { scale: 0, opacity: 0, x: ox, y: oy, transition: { duration: 0.5, ease: 'easeOut' } }
          : { scale: 1.15, opacity: 0, transition: { duration: 0.3, ease: 'easeOut' } }
      }
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onRemove(index)}
      className="absolute inset-0 rounded-lg cursor-pointer shadow-md"
      style={{ backgroundColor: color }}
      aria-label={`Remove square ${index + 1}`}
    />
  );
}
