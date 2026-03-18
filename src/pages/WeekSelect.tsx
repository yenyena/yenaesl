import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GAMES } from '../constants/games';
import { Badge } from '../components/ui';
import { useVocabStore } from '../stores/useVocabStore';
import { ArrowLeftIcon } from '../components/icons';

const WEEKS = [1, 2, 3, 4, 5];

export function WeekSelect() {
  const { gameId, m } = useParams();
  const game = GAMES.find((g) => g.id === gameId);
  const { getUnitByMonthWeek } = useVocabStore();
  const minWords = game?.minWords ?? 1;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Link
          to={`/game/${gameId}/month`}
          className="no-underline hover:opacity-70 transition-opacity text-text"
        >
          <ArrowLeftIcon size={28} />
        </Link>
        <div>
          <h1 className="text-3xl m-0 text-primary">
            {game?.name}
          </h1>
          <p className="text-text-light m-0 mt-1 font-body">{m}</p>
        </div>
      </div>

      <h2 className="text-xl text-text-light mb-6 font-body font-semibold">
        Choose a week
      </h2>

      <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
        {WEEKS.map((week, i) => {
          const unit = m ? getUnitByMonthWeek(m, week) : undefined;
          const wordCount = unit?.words.length ?? 0;
          const hasEnough = unit && wordCount >= minWords;
          const linkTarget = unit
            ? `/game/${gameId}/play/${unit.id}`
            : `/game/${gameId}/week/${m}`;

          return (
            <motion.div
              key={week}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                to={linkTarget}
                className="no-underline block"
                onClick={(e) => { if (!hasEnough) e.preventDefault(); }}
              >
                <motion.div
                  whileHover={hasEnough ? { scale: 1.05 } : undefined}
                  whileTap={hasEnough ? { scale: 0.97 } : undefined}
                  className="rounded-card shadow-card p-6 text-center transition-shadow bg-surface"
                  style={{
                    opacity: hasEnough ? 1 : 0.5,
                    cursor: hasEnough ? 'pointer' : 'default',
                  }}
                >
                  <span className="font-heading text-2xl text-text block mb-2">
                    Week {week}
                  </span>
                  <span className="text-text-light text-sm block mb-3">
                    {unit?.label ?? '—'}
                  </span>
                  <Badge>
                    {unit ? `${wordCount} word${wordCount !== 1 ? 's' : ''}` : 'No words added'}
                  </Badge>
                  {unit && wordCount < minWords && (
                    <span className="text-incorrect text-xs block mt-2">
                      Needs {minWords} words
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
