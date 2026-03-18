import { GAMES } from '../constants/games';
import { GameCard } from '../components/GameCard';

export function Home() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl text-primary mb-2">ESL Classroom Games</h1>
        <p className="text-text-light text-lg">
          Pick a game and start learning!
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {GAMES.map((game, i) => (
          <GameCard key={game.id} game={game} index={i} />
        ))}
      </div>
    </div>
  );
}
