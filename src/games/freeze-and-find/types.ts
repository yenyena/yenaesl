export type Phase = 'drifting' | 'frozen' | 'finding' | 'result' | 'resuming';

export interface BubbleData {
  id: string;
  wordId: string;
  text: string;
  image: string;
}

export interface BubblePhysics {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export interface FreezeAndFindState {
  phase: Phase;
  bubbles: BubbleData[];
  targetWordId: string | null;
  targetWordText: string | null;
  score: number;
  totalRounds: number;
  correct: number;
  showLabels: boolean;
  usedTargetIds: string[];
}

export type FreezeAndFindAction =
  | { type: 'INIT'; bubbles: BubbleData[] }
  | { type: 'FREEZE'; targetWordId: string; targetWordText: string }
  | { type: 'BEGIN_FINDING' }
  | { type: 'CORRECT_TAP' }
  | { type: 'BEGIN_RESUME' }
  | { type: 'RESUME' }
  | { type: 'TOGGLE_LABELS' };
