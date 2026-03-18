import type { BodyPartCategory } from './types';

export const ANCHOR_POINTS: Record<BodyPartCategory, { x: number; y: number }> = {
  eyes:      { x: 200, y: 130 },
  mouth:     { x: 200, y: 270 },
  nose:      { x: 200, y: 210 },
  ears:      { x: 200, y: 100 },
  arms:      { x: 200, y: 240 },
  legs:      { x: 200, y: 410 },
  accessory: { x: 200, y: 40 },
  extra:     { x: 200, y: 160 },
};

export function MonsterBase() {
  return (
    <g>
      {/* Main body blob — bean/potato shape */}
      <path
        d={`
          M 200 50
          C 290 50, 340 100, 345 170
          C 350 240, 340 310, 330 350
          C 320 390, 280 430, 200 430
          C 120 430, 80 390, 70 350
          C 60 310, 50 240, 55 170
          C 60 100, 110 50, 200 50
          Z
        `}
        fill="#E0E0E0"
        stroke="#9E9E9E"
        strokeWidth={3}
        strokeDasharray="8 6"
      />
      {/* Subtle belly highlight */}
      <ellipse
        cx="200" cy="250"
        rx="60" ry="70"
        fill="white"
        opacity="0.15"
      />
    </g>
  );
}
