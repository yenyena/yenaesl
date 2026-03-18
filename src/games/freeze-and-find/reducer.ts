import type { FreezeAndFindState, FreezeAndFindAction } from './types';

export const initialState: FreezeAndFindState = {
  phase: 'drifting',
  bubbles: [],
  targetWordId: null,
  targetWordText: null,
  score: 0,
  totalRounds: 0,
  correct: 0,
  showLabels: false,
  usedTargetIds: [],
};

export function freezeAndFindReducer(
  state: FreezeAndFindState,
  action: FreezeAndFindAction,
): FreezeAndFindState {
  switch (action.type) {
    case 'INIT':
      return {
        ...initialState,
        bubbles: action.bubbles,
        showLabels: state.showLabels,
      };

    case 'FREEZE': {
      const newUsed = [...state.usedTargetIds, action.targetWordId];
      // Reset if all words have been used
      const resetUsed =
        newUsed.length >= state.bubbles.length ? [action.targetWordId] : newUsed;
      return {
        ...state,
        phase: 'frozen',
        targetWordId: action.targetWordId,
        targetWordText: action.targetWordText,
        totalRounds: state.totalRounds + 1,
        usedTargetIds: resetUsed,
      };
    }

    case 'BEGIN_FINDING':
      return { ...state, phase: 'finding' };

    case 'CORRECT_TAP':
      return {
        ...state,
        phase: 'result',
        score: state.score + 1,
        correct: state.correct + 1,
      };

    case 'BEGIN_RESUME':
      return {
        ...state,
        phase: 'resuming',
        targetWordId: null,
        targetWordText: null,
      };

    case 'RESUME':
      return { ...state, phase: 'drifting' };

    case 'TOGGLE_LABELS':
      return { ...state, showLabels: !state.showLabels };

    default:
      return state;
  }
}
