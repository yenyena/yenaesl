import type { Word, CategoryList } from '../../types';
import type { GridItem } from './types';

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface RoundResult {
  gridItems: GridItem[];
  oddOneOutId: string;
  categoryName: string;
  newUsedWordIds: string[];
}

export function generateRound(
  words: Word[],
  validLists: CategoryList[],
  usedWordIds: string[],
): RoundResult {
  // 1. Pick a random category list
  const list = validLists[Math.floor(Math.random() * validLists.length)];

  // 2. Shuffle category items, take first 3
  const categoryItems = shuffleArray(list.items).slice(0, 3);
  const categoryTextsLower = new Set(categoryItems.map((item) => item.text.toLowerCase()));

  // 3. Pick a unit word not in usedWordIds, and not colliding with category items
  let available = words.filter(
    (w) => !usedWordIds.includes(w.id) && !categoryTextsLower.has(w.text.toLowerCase()),
  );

  // Reset cycle if all words used (or all collide)
  let newUsedWordIds = [...usedWordIds];
  if (available.length === 0) {
    newUsedWordIds = [];
    available = words.filter((w) => !categoryTextsLower.has(w.text.toLowerCase()));
  }

  // If still no available words (all collide with category), just pick any word
  if (available.length === 0) {
    available = [...words];
    newUsedWordIds = [];
  }

  const oddWord = available[Math.floor(Math.random() * available.length)];
  newUsedWordIds.push(oddWord.id);

  // 4. Build 4 GridItems and shuffle
  const gridItems: GridItem[] = shuffleArray([
    ...categoryItems.map((item) => ({
      id: `cat-${item.id}`,
      text: item.text,
      image: item.image,
      isOddOneOut: false,
    })),
    {
      id: `word-${oddWord.id}`,
      text: oddWord.text,
      image: oddWord.image,
      isOddOneOut: true,
    },
  ]);

  return {
    gridItems,
    oddOneOutId: `word-${oddWord.id}`,
    categoryName: list.name,
    newUsedWordIds,
  };
}
