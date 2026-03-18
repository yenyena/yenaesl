import type { ReactNode } from 'react';
import type { Word } from '../../types';

export type BodyPartCategory = 'eyes' | 'mouth' | 'nose' | 'ears' | 'arms' | 'legs' | 'accessory' | 'extra';

export const CATEGORY_ORDER: BodyPartCategory[] = [
  'eyes', 'mouth', 'nose', 'ears', 'arms', 'legs', 'accessory', 'extra',
];

export const CATEGORY_LABELS: Record<BodyPartCategory, string> = {
  eyes: 'Eyes',
  mouth: 'Mouth',
  nose: 'Nose',
  ears: 'Ears',
  arms: 'Arms',
  legs: 'Legs',
  accessory: 'Accessory',
  extra: 'Extra',
};

export interface BodyPartVariant {
  id: string;
  category: BodyPartCategory;
  label: string;
  render: () => ReactNode;
}

export interface SelectedPart {
  category: BodyPartCategory;
  variantId: string;
}

export type GamePhase = 'challenge' | 'show-answer' | 'selecting-part' | 'attaching' | 'complete';

export interface BuildTheMonsterState {
  phase: GamePhase;
  wordQueue: Word[];
  currentWordIndex: number;
  currentCategory: BodyPartCategory;
  categoryIndex: number;
  selectedParts: SelectedPart[];
  monsterName: string;
  wordsCompleted: number;
  wordsCorrect: number;
}

export type BuildTheMonsterAction =
  | { type: 'INIT'; words: Word[] }
  | { type: 'CORRECT' }
  | { type: 'SHOW_ANSWER' }
  | { type: 'NEXT_WORD' }
  | { type: 'SELECT_PART'; variantId: string }
  | { type: 'ATTACH_COMPLETE' }
  | { type: 'SET_NAME'; name: string }
  | { type: 'RESET' };
