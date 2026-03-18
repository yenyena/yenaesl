import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GAMES } from '../constants/games';
import { MONTHS } from '../constants/months';
import { useVocabStore } from '../stores/useVocabStore';
import { ArrowLeftIcon } from '../components/icons';

export function MonthSelect() {
  const { gameId } = useParams();
  const game = GAMES.find((g) => g.id === gameId);
  const { getUnitsByMonth } = useVocabStore();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to="/"
          className="no-underline hover:opacity-70 transition-opacity text-text"
        >
          <ArrowLeftIcon size={28} />
        </Link>
        <h1 className="text-3xl m-0 text-primary">
          {game?.name}
        </h1>
      </div>

      <h2 className="text-xl text-text-light mb-6 font-body font-semibold">
        Choose a month
      </h2>

      <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
        {MONTHS.map((month, i) => {
          const monthUnits = getUnitsByMonth(month.name);
          const wordCount = monthUnits.reduce((sum, u) => sum + u.words.length, 0);
          const hasWords = wordCount > 0;

          return (
            <motion.div
              key={month.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                to={`/game/${gameId}/week/${month.name}`}
                className="no-underline block"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-card shadow-card p-5 text-center cursor-pointer transition-shadow hover:shadow-hover bg-surface"
                  style={{
                    opacity: hasWords ? 1 : 0.5,
                  }}
                >
                  <span className="font-heading text-lg block text-text">
                    {month.name}
                  </span>
                  {!hasWords && (
                    <span className="text-text-light text-xs block mt-1">
                      No words yet
                    </span>
                  )}
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
