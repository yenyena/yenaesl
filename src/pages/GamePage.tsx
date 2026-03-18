import { useParams } from 'react-router-dom';
import type { ComponentType } from 'react';
import { GAMES } from '../constants/games';
import { MemoryMatch } from '../games/memory-match';
import { WhatsMissing } from '../games/whats-missing';
import { SlowReveal } from '../games/slow-reveal';
import { OddOneOut } from '../games/odd-one-out';
import { FreezeAndFind } from '../games/freeze-and-find';
import { BuildTheMonster } from '../games/build-the-monster';

const GAME_COMPONENTS: Record<string, ComponentType> = {
  'memory-match': MemoryMatch,
  'whats-missing': WhatsMissing,
  'slow-reveal': SlowReveal,
  'odd-one-out': OddOneOut,
  'freeze-and-find': FreezeAndFind,
  'build-the-monster': BuildTheMonster,
};

export function GamePage() {
  const { gameId } = useParams();
  const game = GAMES.find((g) => g.id === gameId);
  const GameComponent = gameId ? GAME_COMPONENTS[gameId] : undefined;

  if (GameComponent) {
    return <GameComponent />;
  }

  return (
    <div className="flex items-center justify-center h-full bg-primary/5">
      <div className="text-center p-8">
        <h2 className="text-2xl mb-2 text-primary">
          {game?.name}
        </h2>
        <p className="text-text-light text-lg">will load here</p>
      </div>
    </div>
  );
}
