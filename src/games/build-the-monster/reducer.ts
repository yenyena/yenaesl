import type { BuildTheMonsterState, BuildTheMonsterAction } from './types';
import { CATEGORY_ORDER } from './types';
import { generateMonsterName } from './nameGenerator';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const initialState: BuildTheMonsterState = {
  phase: 'challenge',
  wordQueue: [],
  currentWordIndex: 0,
  currentCategory: CATEGORY_ORDER[0],
  categoryIndex: 0,
  selectedParts: [],
  monsterName: '',
  wordsCompleted: 0,
  wordsCorrect: 0,
};

function advanceWord(state: BuildTheMonsterState): { wordQueue: typeof state.wordQueue; currentWordIndex: number } {
  let nextIndex = state.currentWordIndex + 1;
  let wordQueue = state.wordQueue;
  if (nextIndex >= wordQueue.length) {
    wordQueue = shuffleArray(wordQueue);
    nextIndex = 0;
  }
  return { wordQueue, currentWordIndex: nextIndex };
}

export function buildTheMonsterReducer(
  state: BuildTheMonsterState,
  action: BuildTheMonsterAction,
): BuildTheMonsterState {
  switch (action.type) {
    case 'INIT': {
      const shuffled = shuffleArray(action.words);
      return {
        ...initialState,
        phase: 'challenge',
        wordQueue: shuffled,
        currentWordIndex: 0,
        currentCategory: CATEGORY_ORDER[0],
        categoryIndex: 0,
        monsterName: generateMonsterName(),
      };
    }

    case 'CORRECT': {
      const nextCatIndex = state.categoryIndex + 1;
      if (nextCatIndex >= CATEGORY_ORDER.length) {
        // All categories filled — go to selecting last part first
        return {
          ...state,
          phase: 'selecting-part',
          wordsCompleted: state.wordsCompleted + 1,
          wordsCorrect: state.wordsCorrect + 1,
        };
      }
      return {
        ...state,
        phase: 'selecting-part',
        wordsCompleted: state.wordsCompleted + 1,
        wordsCorrect: state.wordsCorrect + 1,
      };
    }

    case 'SHOW_ANSWER': {
      return {
        ...state,
        phase: 'show-answer',
        wordsCompleted: state.wordsCompleted + 1,
      };
    }

    case 'NEXT_WORD': {
      const { wordQueue, currentWordIndex } = advanceWord(state);
      return {
        ...state,
        phase: 'challenge',
        wordQueue,
        currentWordIndex,
      };
    }

    case 'SELECT_PART': {
      return {
        ...state,
        phase: 'attaching',
        selectedParts: [
          ...state.selectedParts,
          { category: state.currentCategory, variantId: action.variantId },
        ],
      };
    }

    case 'ATTACH_COMPLETE': {
      const nextCatIndex = state.categoryIndex + 1;
      if (nextCatIndex >= CATEGORY_ORDER.length) {
        return {
          ...state,
          phase: 'complete',
        };
      }
      const { wordQueue, currentWordIndex } = advanceWord(state);
      return {
        ...state,
        phase: 'challenge',
        categoryIndex: nextCatIndex,
        currentCategory: CATEGORY_ORDER[nextCatIndex],
        wordQueue,
        currentWordIndex,
      };
    }

    case 'SET_NAME': {
      return { ...state, monsterName: action.name };
    }

    case 'RESET': {
      const shuffled = shuffleArray(state.wordQueue);
      return {
        ...initialState,
        phase: 'challenge',
        wordQueue: shuffled,
        currentWordIndex: 0,
        currentCategory: CATEGORY_ORDER[0],
        categoryIndex: 0,
        monsterName: generateMonsterName(),
      };
    }

    default:
      return state;
  }
}
