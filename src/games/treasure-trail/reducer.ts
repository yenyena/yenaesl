import type { TreasureTrailState, TreasureTrailAction } from './types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function advanceWord(state: TreasureTrailState): Pick<TreasureTrailState, 'wordQueue' | 'currentWordIndex'> {
  let nextIndex = state.currentWordIndex + 1;
  let wordQueue = state.wordQueue;
  if (nextIndex >= wordQueue.length) {
    wordQueue = shuffleArray(wordQueue);
    nextIndex = 0;
  }
  return { wordQueue, currentWordIndex: nextIndex };
}

function swapTeam(team: 0 | 1): 0 | 1 {
  return team === 0 ? 1 : 0;
}

export const initialState: TreasureTrailState = {
  phase: 'setup',
  config: {
    teamNames: ['Red Pirates', 'Blue Pirates'],
    pathLength: 30,
    density: 'normal',
    dieRange: 6,
  },
  squares: [],
  pathPoints: [],
  pathD: '',
  teams: [
    { name: 'Red Pirates', position: 0, wordsCorrect: 0, color: '#EF4444' },
    { name: 'Blue Pirates', position: 0, wordsCorrect: 0, color: '#3B82F6' },
  ],
  activeTeam: 0,
  moverTeam: 0,
  wordQueue: [],
  currentWordIndex: 0,
  rollValue: 0,
  currentSpecial: null,
  rollAgainChain: 0,
  totalTurns: 0,
};

export function treasureTrailReducer(
  state: TreasureTrailState,
  action: TreasureTrailAction,
): TreasureTrailState {
  switch (action.type) {
    case 'START_GAME': {
      const { words, config, squares, pathPoints, pathD } = action;
      const shuffled = shuffleArray(words);
      return {
        ...initialState,
        phase: 'challenge',
        config,
        squares,
        pathPoints,
        pathD,
        teams: [
          { name: config.teamNames[0], position: 0, wordsCorrect: 0, color: '#EF4444' },
          { name: config.teamNames[1], position: 0, wordsCorrect: 0, color: '#3B82F6' },
        ],
        activeTeam: 0,
        moverTeam: 0,
        wordQueue: shuffled,
        currentWordIndex: 0,
        rollValue: 0,
        currentSpecial: null,
        rollAgainChain: 0,
        totalTurns: 0,
      };
    }

    case 'CORRECT': {
      const teams = [...state.teams] as [typeof state.teams[0], typeof state.teams[1]];
      teams[state.activeTeam] = {
        ...teams[state.activeTeam],
        wordsCorrect: teams[state.activeTeam].wordsCorrect + 1,
      };
      const { wordQueue, currentWordIndex } = advanceWord(state);
      return {
        ...state,
        phase: 'rolling',
        teams,
        moverTeam: state.activeTeam,
        wordQueue,
        currentWordIndex,
        totalTurns: state.totalTurns + 1,
      };
    }

    case 'STEAL': {
      return {
        ...state,
        phase: 'steal-chance',
      };
    }

    case 'STEAL_CORRECT': {
      const stealingTeam = swapTeam(state.activeTeam);
      const teams = [...state.teams] as [typeof state.teams[0], typeof state.teams[1]];
      teams[stealingTeam] = {
        ...teams[stealingTeam],
        wordsCorrect: teams[stealingTeam].wordsCorrect + 1,
      };
      const { wordQueue, currentWordIndex } = advanceWord(state);
      return {
        ...state,
        phase: 'rolling',
        teams,
        moverTeam: stealingTeam,
        wordQueue,
        currentWordIndex,
        totalTurns: state.totalTurns + 1,
      };
    }

    case 'STEAL_MISS': {
      const { wordQueue, currentWordIndex } = advanceWord(state);
      return {
        ...state,
        phase: 'challenge',
        activeTeam: swapTeam(state.activeTeam),
        wordQueue,
        currentWordIndex,
        totalTurns: state.totalTurns + 1,
      };
    }

    case 'REVEAL': {
      return {
        ...state,
        phase: 'reveal',
      };
    }

    case 'ACKNOWLEDGE_REVEAL': {
      const { wordQueue, currentWordIndex } = advanceWord(state);
      return {
        ...state,
        phase: 'challenge',
        activeTeam: swapTeam(state.activeTeam),
        wordQueue,
        currentWordIndex,
        totalTurns: state.totalTurns + 1,
      };
    }

    case 'ROLL_COMPLETE': {
      const lastSquare = state.config.pathLength - 1;
      const mover = state.teams[state.moverTeam];
      let newPos = mover.position + action.value;

      // Bounce-back
      if (newPos > lastSquare) {
        const overshoot = newPos - lastSquare;
        newPos = lastSquare - overshoot;
        if (newPos < 1) newPos = 1;
      }

      return {
        ...state,
        phase: 'moving',
        rollValue: action.value,
        teams: state.teams.map((t, i) =>
          i === state.moverTeam ? { ...t, position: newPos } : t,
        ) as [typeof state.teams[0], typeof state.teams[1]],
      };
    }

    case 'MOVE_COMPLETE': {
      const mover = state.teams[state.moverTeam];
      const landedSquare = state.squares[mover.position];

      // Check for victory
      if (mover.position === state.config.pathLength - 1) {
        return { ...state, phase: 'victory' };
      }

      // Check for special square
      if (
        landedSquare &&
        landedSquare.type !== 'normal' &&
        landedSquare.type !== 'start' &&
        landedSquare.type !== 'treasure'
      ) {
        return {
          ...state,
          phase: 'special',
          currentSpecial: landedSquare.type,
        };
      }

      // Normal square: next team's turn
      return {
        ...state,
        phase: 'challenge',
        activeTeam: swapTeam(state.activeTeam),
        rollAgainChain: 0,
      };
    }

    case 'SPECIAL_RESOLVED': {
      const special = state.currentSpecial;
      const mover = state.teams[state.moverTeam];
      const lastSquare = state.config.pathLength - 1;

      if (special === 'roll-again') {
        const newChain = state.rollAgainChain + 1;
        if (newChain >= 3) {
          // Max chain reached, treat as normal
          return {
            ...state,
            phase: 'challenge',
            activeTeam: swapTeam(state.activeTeam),
            currentSpecial: null,
            rollAgainChain: 0,
          };
        }
        return {
          ...state,
          phase: 'rolling',
          currentSpecial: null,
          rollAgainChain: newChain,
        };
      }

      if (special === 'warp') {
        let newPos = mover.position + 3;
        // Clamp: can't warp to finish
        if (newPos >= lastSquare) newPos = lastSquare - 1;
        if (newPos < 1) newPos = 1;

        const teams = state.teams.map((t, i) =>
          i === state.moverTeam ? { ...t, position: newPos } : t,
        ) as [typeof state.teams[0], typeof state.teams[1]];

        return {
          ...state,
          phase: 'challenge',
          teams,
          activeTeam: swapTeam(state.activeTeam),
          currentSpecial: null,
          rollAgainChain: 0,
        };
      }

      if (special === 'setback') {
        let newPos = mover.position - 2;
        if (newPos < 1) newPos = 1;

        const teams = state.teams.map((t, i) =>
          i === state.moverTeam ? { ...t, position: newPos } : t,
        ) as [typeof state.teams[0], typeof state.teams[1]];

        return {
          ...state,
          phase: 'challenge',
          teams,
          activeTeam: swapTeam(state.activeTeam),
          currentSpecial: null,
          rollAgainChain: 0,
        };
      }

      if (special === 'swap') {
        const otherTeam = swapTeam(state.moverTeam);
        const otherPos = state.teams[otherTeam].position;
        const myPos = mover.position;

        const teams = state.teams.map((t, i) => {
          if (i === state.moverTeam) return { ...t, position: otherPos };
          return { ...t, position: myPos };
        }) as [typeof state.teams[0], typeof state.teams[1]];

        return {
          ...state,
          phase: 'challenge',
          teams,
          activeTeam: swapTeam(state.activeTeam),
          currentSpecial: null,
          rollAgainChain: 0,
        };
      }

      // Fallback
      return {
        ...state,
        phase: 'challenge',
        activeTeam: swapTeam(state.activeTeam),
        currentSpecial: null,
        rollAgainChain: 0,
      };
    }

    case 'PLAY_AGAIN': {
      return { ...initialState };
    }

    default:
      return state;
  }
}
