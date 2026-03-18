import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { GameDef } from '../types';

interface GameCardProps {
  game: GameDef;
  index: number;
}

export function GameCard({ game, index }: GameCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <Link to={`/game/${game.id}/month`} className="no-underline block">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-card shadow-card p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-shadow hover:shadow-hover bg-primary text-white aspect-square"
        >
          <h3 className="text-lg m-0 text-center text-white">
            {game.name}
          </h3>
          <p className="text-sm text-white/80 text-center m-0 font-body">
            {game.subtitle}
          </p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
