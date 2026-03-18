const TITLES = [
  'Mr.', 'Mrs.', 'Dr.', 'Professor', 'Captain', 'Sir', 'Princess', 'Lord', 'Chef', 'Detective',
];

const ADJECTIVES = [
  'Wiggly', 'Sparkle', 'Fuzzy', 'Bouncy', 'Giggly', 'Squishy', 'Wobbly', 'Bubbly', 'Cranky', 'Fancy',
];

const NOUNS = [
  'Banana', 'Noodle', 'Pickle', 'Muffin', 'Jellybean', 'Waffle', 'Taco', 'Marshmallow', 'Pretzel', 'Cupcake',
];

const SUFFIXES = [
  'Pants', 'Face', 'Boots', 'Belly', 'Toes', 'Fingers', 'Bottom', 'Whiskers', 'Cheeks', 'Nose',
];

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMonsterName(): string {
  return `${pickRandom(TITLES)} ${pickRandom(ADJECTIVES)} ${pickRandom(NOUNS)}${pickRandom(SUFFIXES)}`;
}
