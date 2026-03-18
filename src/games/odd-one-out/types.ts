export interface GridItem {
  id: string;
  text: string;
  image: string;
  isOddOneOut: boolean;
}

export type GamePhase = 'loading' | 'playing' | 'correct';

export interface OddOneOutState {
  phase: GamePhase;
  gridItems: GridItem[];
  oddOneOutId: string;
  categoryName: string;
  round: number;
  firstTryCorrect: number;
  attemptsThisRound: number;
  usedWordIds: string[];
  shakingId: string | null;
}

export type OddOneOutAction =
  | { type: 'START_ROUND'; gridItems: GridItem[]; oddOneOutId: string; categoryName: string; usedWordIds: string[] }
  | { type: 'WRONG_GUESS'; id: string }
  | { type: 'CLEAR_SHAKE' }
  | { type: 'CORRECT_GUESS' }
  | { type: 'RESET' };
