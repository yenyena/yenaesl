import type { MemoryMatchState, MemoryMatchAction } from './types';

export const COUNTDOWN_START = 5;

export const initialState: MemoryMatchState = {
  phase: 'loading',
  cards: [],
  flippedIndices: [],
  matchedPairs: 0,
  attempts: 0,
  countdown: COUNTDOWN_START,
};

export function memoryMatchReducer(
  state: MemoryMatchState,
  action: MemoryMatchAction,
): MemoryMatchState {
  switch (action.type) {
    case 'START_MEMORIZE':
      return {
        ...initialState,
        phase: 'memorize',
        cards: action.cards.map((c) => ({ ...c, isFlipped: true })),
        countdown: COUNTDOWN_START,
      };

    case 'TICK':
      if (state.phase !== 'memorize') return state;
      return { ...state, countdown: Math.max(0, state.countdown - 1) };

    case 'END_MEMORIZE':
      return {
        ...state,
        phase: 'playing',
        cards: state.cards.map((c) => ({ ...c, isFlipped: false })),
        countdown: 0,
      };

    case 'FLIP_CARD': {
      if (state.phase !== 'playing') return state;
      if (state.flippedIndices.length >= 2) return state;
      const card = state.cards[action.index];
      if (!card || card.isFlipped || card.isMatched) return state;

      const newCards = state.cards.map((c, i) =>
        i === action.index ? { ...c, isFlipped: true } : c,
      );
      return {
        ...state,
        cards: newCards,
        flippedIndices: [...state.flippedIndices, action.index],
      };
    }

    case 'MATCH_FOUND': {
      const [i, j] = state.flippedIndices;
      const newCards = state.cards.map((c, idx) =>
        idx === i || idx === j ? { ...c, isMatched: true } : c,
      );
      return {
        ...state,
        cards: newCards,
        flippedIndices: [],
        matchedPairs: state.matchedPairs + 1,
        attempts: state.attempts + 1,
      };
    }

    case 'NO_MATCH': {
      const [i, j] = state.flippedIndices;
      const newCards = state.cards.map((c, idx) =>
        idx === i || idx === j ? { ...c, isFlipped: false } : c,
      );
      return {
        ...state,
        cards: newCards,
        flippedIndices: [],
        attempts: state.attempts + 1,
      };
    }

    case 'VICTORY':
      return { ...state, phase: 'victory' };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}
