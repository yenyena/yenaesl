import type { Word } from '../../types';
import type { SlowRevealState, SlowRevealAction } from './types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function buildWordBank(currentWord: Word, allWords: Word[]): Word[] {
  const others = allWords.filter((w) => w.id !== currentWord.id);
  const distractorCount = allWords.length >= 6 ? 5 : 3;
  const distractors = shuffleArray(others).slice(
    0,
    Math.min(others.length, distractorCount),
  );
  return shuffleArray([currentWord, ...distractors]);
}

function freshSquares(): boolean[] {
  return Array(9).fill(true) as boolean[];
}

export const initialState: SlowRevealState = {
  phase: 'playing',
  wordQueue: [],
  currentWord: null,
  wordBank: [],
  squares: freshSquares(),
  squaresRemoved: 0,
  results: [],
  wrongGuessId: null,
  wordIndex: 0,
  totalWords: 0,
};

export function slowRevealReducer(
  state: SlowRevealState,
  action: SlowRevealAction,
): SlowRevealState {
  switch (action.type) {
    case 'INIT':
    case 'RESTART': {
      const shuffled = shuffleArray(action.words);
      const current = shuffled[0];
      const queue = shuffled.slice(1);
      return {
        ...initialState,
        currentWord: current,
        wordQueue: queue,
        wordBank: buildWordBank(current, action.words),
        squares: freshSquares(),
        totalWords: shuffled.length,
      };
    }

    case 'REMOVE_SQUARE': {
      if (state.phase !== 'playing') return state;
      if (!state.squares[action.index]) return state;
      const squares = [...state.squares];
      squares[action.index] = false;
      return {
        ...state,
        squares,
        squaresRemoved: state.squaresRemoved + 1,
      };
    }

    case 'GUESS': {
      if (state.phase !== 'playing' || !state.currentWord) return state;
      if (action.wordId === state.currentWord.id) {
        return {
          ...state,
          phase: 'revealed',
          squares: Array(9).fill(false) as boolean[],
          wrongGuessId: null,
          results: [
            ...state.results,
            {
              wordId: state.currentWord.id,
              wordText: state.currentWord.text,
              wordImage: state.currentWord.image,
              squaresRemoved: state.squaresRemoved,
            },
          ],
        };
      }
      return { ...state, wrongGuessId: action.wordId };
    }

    case 'CLEAR_WRONG_GUESS':
      return { ...state, wrongGuessId: null };

    case 'NEXT_WORD': {
      if (state.wordQueue.length === 0) {
        return { ...state, phase: 'summary' };
      }
      const next = state.wordQueue[0];
      const remaining = state.wordQueue.slice(1);
      return {
        ...state,
        phase: 'playing',
        currentWord: next,
        wordQueue: remaining,
        wordBank: buildWordBank(next, action.allWords),
        squares: freshSquares(),
        squaresRemoved: 0,
        wrongGuessId: null,
        wordIndex: state.wordIndex + 1,
      };
    }

    default:
      return state;
  }
}
