import type { Word } from '../../types';

export type Phase = 'display' | 'close-eyes' | 'guess' | 'reveal';
export type Difficulty = 'easy' | 'hard';

export interface GridItem {
  word: Word;
}

export interface WhatsMissingState {
  phase: Phase;
  roundWords: GridItem[];      // all items for this round
  guessLayout: GridItem[];     // remaining items (removed ones filtered out)
  removedWordIds: string[];    // 1 (easy) or 2 (hard) IDs
  countdown: number;           // 10 → 0
  round: number;
  difficulty: Difficulty;
}

export type WhatsMissingAction =
  | { type: 'START_ROUND'; roundWords: GridItem[] }
  | { type: 'TICK' }
  | { type: 'BEGIN_CLOSE_EYES'; removedWordIds: string[]; guessLayout: GridItem[] }
  | { type: 'BEGIN_GUESS' }
  | { type: 'REVEAL' }
  | { type: 'SET_DIFFICULTY'; difficulty: Difficulty };
