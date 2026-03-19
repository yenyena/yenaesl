export interface MemoryCard {
  id: string;
  wordId: string;
  type: 'picture' | 'word';
  content: string; // image data URL for picture, text for word
  isFlipped: boolean;
  isMatched: boolean;
}

export type Difficulty = 'normal' | 'hard';

export type GamePhase = 'loading' | 'memorize' | 'playing' | 'victory';

export const PAIRS_BY_DIFFICULTY: Record<Difficulty, number> = {
  normal: 4,
  hard: 5,
};

export interface MemoryMatchState {
  phase: GamePhase;
  cards: MemoryCard[];
  flippedIndices: number[];
  matchedPairs: number;
  totalPairs: number;
  attempts: number;
  countdown: number;
}

export type MemoryMatchAction =
  | { type: 'START_MEMORIZE'; cards: MemoryCard[]; totalPairs: number }
  | { type: 'TICK' }
  | { type: 'END_MEMORIZE' }
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'MATCH_FOUND' }
  | { type: 'NO_MATCH' }
  | { type: 'VICTORY' }
  | { type: 'RESET' };
