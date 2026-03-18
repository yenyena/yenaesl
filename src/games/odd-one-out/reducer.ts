import type { OddOneOutState, OddOneOutAction } from './types';

export const initialState: OddOneOutState = {
  phase: 'loading',
  gridItems: [],
  oddOneOutId: '',
  categoryName: '',
  round: 0,
  firstTryCorrect: 0,
  attemptsThisRound: 0,
  usedWordIds: [],
  shakingId: null,
};

export function oddOneOutReducer(state: OddOneOutState, action: OddOneOutAction): OddOneOutState {
  switch (action.type) {
    case 'START_ROUND':
      return {
        ...state,
        phase: 'playing',
        gridItems: action.gridItems,
        oddOneOutId: action.oddOneOutId,
        categoryName: action.categoryName,
        usedWordIds: action.usedWordIds,
        round: state.round + 1,
        attemptsThisRound: 0,
        shakingId: null,
      };

    case 'WRONG_GUESS':
      return {
        ...state,
        shakingId: action.id,
        attemptsThisRound: state.attemptsThisRound + 1,
      };

    case 'CLEAR_SHAKE':
      return {
        ...state,
        shakingId: null,
      };

    case 'CORRECT_GUESS':
      return {
        ...state,
        phase: 'correct',
        firstTryCorrect: state.attemptsThisRound === 0
          ? state.firstTryCorrect + 1
          : state.firstTryCorrect,
      };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
