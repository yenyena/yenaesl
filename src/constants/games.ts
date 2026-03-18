import type { GameDef } from '../types';

export const GAMES: GameDef[] = [
  {
    id: 'memory-match',
    name: 'Memory Match',
    subtitle: 'Match pictures to words!',
    minWords: 4,
  },
  {
    id: 'whats-missing',
    name: "What's Missing?",
    subtitle: 'Which picture disappeared?',
    minWords: 4,
  },
  {
    id: 'slow-reveal',
    name: 'Slow Reveal',
    subtitle: 'Guess the hidden picture!',
    minWords: 4,
  },
  {
    id: 'odd-one-out',
    name: 'Odd One Out',
    subtitle: 'Which one doesn\'t belong?',
    minWords: 1,
  },
  {
    id: 'freeze-and-find',
    name: 'Freeze & Find',
    subtitle: 'Freeze the screen and find the word!',
    minWords: 4,
  },
  {
    id: 'bomb-countdown',
    name: 'Bomb Countdown',
    subtitle: 'Score points, but avoid the bombs!',
    minWords: 4,
  },
  {
    id: 'spinning-wheel',
    name: 'Spinning Wheel',
    subtitle: 'Spin and say the word!',
    minWords: 3,
  },
  {
    id: 'hot-and-cold',
    name: 'Hot & Cold',
    subtitle: 'Find the secret word!',
    minWords: 6,
  },
  {
    id: 'picture-race',
    name: 'Picture Race',
    subtitle: 'Team vs team — who knows it first?',
    minWords: 5,
  },
  {
    id: 'build-the-monster',
    name: 'Build the Monster',
    subtitle: 'Say the word, add a body part!',
    minWords: 5,
  },
];
