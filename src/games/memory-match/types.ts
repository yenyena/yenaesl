export interface MemoryCard {
  id: string;
  wordId: string;
  type: 'picture' | 'word';
  content: string; // image data URL for picture, text for word
  isFlipped: boolean;
  isMatched: boolean;
}

export type GamePhase = 'loading' | 'memorize' | 'playing' | 'victory';

export interface MemoryMatchState {
  phase: GamePhase;
  cards: MemoryCard[];
  flippedIndices: number[];
  matchedPairs: number;
  attempts: number;
  countdown: number;
}

export type MemoryMatchAction =
  | { type: 'START_MEMORIZE'; cards: MemoryCard[] }
  | { type: 'TICK' }
  | { type: 'END_MEMORIZE' }
  | { type: 'FLIP_CARD'; index: number }
  | { type: 'MATCH_FOUND' }
  | { type: 'NO_MATCH' }
  | { type: 'VICTORY' }
  | { type: 'RESET' };
