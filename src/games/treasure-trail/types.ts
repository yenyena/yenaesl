import type { Word } from '../../types';

export type SpecialType = 'roll-again' | 'warp' | 'setback' | 'swap';

export interface Square {
  index: number;
  type: 'start' | 'normal' | 'treasure' | SpecialType;
}

export interface PathPoint {
  x: number;
  y: number;
  angle: number;
}

export interface TeamState {
  name: string;
  position: number;
  wordsCorrect: number;
  color: string;
}

export type Phase =
  | 'setup'
  | 'challenge'
  | 'steal-chance'
  | 'reveal'
  | 'rolling'
  | 'moving'
  | 'special'
  | 'victory';

export type Density = 'few' | 'normal' | 'chaotic';
export type DieRange = 3 | 4 | 6;
export type PathLength = 20 | 30 | 40;

export interface GameConfig {
  teamNames: [string, string];
  pathLength: PathLength;
  density: Density;
  dieRange: DieRange;
}

export interface TreasureTrailState {
  phase: Phase;
  config: GameConfig;
  squares: Square[];
  pathPoints: PathPoint[];
  pathD: string;
  teams: [TeamState, TeamState];
  activeTeam: 0 | 1;
  moverTeam: 0 | 1;
  wordQueue: Word[];
  currentWordIndex: number;
  rollValue: number;
  currentSpecial: SpecialType | null;
  rollAgainChain: number;
  totalTurns: number;
}

export type TreasureTrailAction =
  | { type: 'START_GAME'; words: Word[]; config: GameConfig; squares: Square[]; pathPoints: PathPoint[]; pathD: string }
  | { type: 'CORRECT' }
  | { type: 'STEAL' }
  | { type: 'STEAL_CORRECT' }
  | { type: 'STEAL_MISS' }
  | { type: 'REVEAL' }
  | { type: 'ACKNOWLEDGE_REVEAL' }
  | { type: 'ROLL_COMPLETE'; value: number }
  | { type: 'MOVE_COMPLETE' }
  | { type: 'SPECIAL_RESOLVED' }
  | { type: 'PLAY_AGAIN' };
