import type { Word } from '../../types';

export type Phase = 'playing' | 'revealed' | 'summary';

export interface RoundResult {
  wordId: string;
  wordText: string;
  wordImage: string;
  squaresRemoved: number;
}

export interface SlowRevealState {
  phase: Phase;
  wordQueue: Word[];
  currentWord: Word | null;
  wordBank: Word[];
  squares: boolean[];         // true = covered
  squaresRemoved: number;
  results: RoundResult[];
  wrongGuessId: string | null;
  wordIndex: number;
  totalWords: number;
}

export type SlowRevealAction =
  | { type: 'INIT'; words: Word[] }
  | { type: 'REMOVE_SQUARE'; index: number }
  | { type: 'GUESS'; wordId: string }
  | { type: 'CLEAR_WRONG_GUESS' }
  | { type: 'NEXT_WORD'; allWords: Word[] }
  | { type: 'RESTART'; words: Word[] };
