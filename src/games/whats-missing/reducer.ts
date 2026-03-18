import type { WhatsMissingState, WhatsMissingAction } from './types';

export const COUNTDOWN_START = 10;

export const initialState: WhatsMissingState = {
  phase: 'display',
  roundWords: [],
  guessLayout: [],
  removedWordIds: [],
  countdown: COUNTDOWN_START,
  round: 0,
  difficulty: 'easy',
};

export function whatsMissingReducer(
  state: WhatsMissingState,
  action: WhatsMissingAction,
): WhatsMissingState {
  switch (action.type) {
    case 'START_ROUND':
      return {
        ...state,
        phase: 'display',
        roundWords: action.roundWords,
        guessLayout: [],
        removedWordIds: [],
        countdown: COUNTDOWN_START,
        round: state.round + 1,
      };

    case 'TICK':
      if (state.phase !== 'display') return state;
      return { ...state, countdown: Math.max(0, state.countdown - 1) };

    case 'BEGIN_CLOSE_EYES':
      return {
        ...state,
        phase: 'close-eyes',
        removedWordIds: action.removedWordIds,
        guessLayout: action.guessLayout,
      };

    case 'BEGIN_GUESS':
      return { ...state, phase: 'guess' };

    case 'REVEAL':
      if (state.phase !== 'guess') return state;
      return { ...state, phase: 'reveal' };

    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.difficulty };

    default:
      return state;
  }
}
