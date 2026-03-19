import type { Square, Density, SpecialType } from './types';

function getDensityCount(density: Density, pathLength: number): number {
  const ratio = pathLength / 30;
  switch (density) {
    case 'few': return Math.round((2 + Math.random()) * ratio);
    case 'normal': return Math.round((4 + Math.random()) * ratio);
    case 'chaotic': return Math.round((7 + Math.random()) * ratio);
  }
}

const SPECIAL_WEIGHTS: { type: SpecialType; weight: number }[] = [
  { type: 'roll-again', weight: 35 },
  { type: 'warp', weight: 25 },
  { type: 'setback', weight: 25 },
  { type: 'swap', weight: 15 },
];

function pickSpecialType(index: number, pathLength: number): SpecialType {
  // Constraints: no setback on squares 1-2, no warp on last 3 squares
  const filtered = SPECIAL_WEIGHTS.filter(({ type }) => {
    if (type === 'setback' && index <= 2) return false;
    if (type === 'warp' && index >= pathLength - 3) return false;
    return true;
  });

  const totalWeight = filtered.reduce((sum, w) => sum + w.weight, 0);
  let roll = Math.random() * totalWeight;
  for (const { type, weight } of filtered) {
    roll -= weight;
    if (roll <= 0) return type;
  }
  return filtered[filtered.length - 1].type;
}

export function generateBoard(pathLength: number, density: Density): Square[] {
  const squares: Square[] = Array.from({ length: pathLength }, (_, i) => ({
    index: i,
    type: i === 0 ? 'start' : i === pathLength - 1 ? 'treasure' : 'normal',
  }));

  const specialCount = getDensityCount(density, pathLength);
  // Eligible indices: [2, pathLength - 3], avoiding start/treasure and buffer
  const eligible: number[] = [];
  for (let i = 2; i <= pathLength - 3; i++) {
    eligible.push(i);
  }

  // Shuffle eligible
  for (let i = eligible.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
  }

  // Pick indices with minimum 2-square spacing
  const chosen: number[] = [];
  for (const idx of eligible) {
    if (chosen.length >= specialCount) break;
    const tooClose = chosen.some(c => Math.abs(c - idx) < 2);
    if (!tooClose) {
      chosen.push(idx);
    }
  }

  // Assign special types
  for (const idx of chosen) {
    squares[idx] = { index: idx, type: pickSpecialType(idx, pathLength) };
  }

  return squares;
}
