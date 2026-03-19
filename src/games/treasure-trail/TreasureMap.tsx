import { motion } from 'framer-motion';
import type { Square, PathPoint, TeamState } from './types';

interface TreasureMapProps {
  squares: Square[];
  pathPoints: PathPoint[];
  pathD: string;
  teams: [TeamState, TeamState];
  visualPositions: [number, number];
}

const SPECIAL_COLORS: Record<string, string> = {
  'roll-again': '#22C55E',
  warp: '#A855F7',
  setback: '#EF4444',
  swap: '#F59E0B',
};

const SPECIAL_GLOW: Record<string, string> = {
  'roll-again': 'rgba(34, 197, 94, 0.5)',
  warp: 'rgba(168, 85, 247, 0.5)',
  setback: 'rgba(239, 68, 68, 0.5)',
  swap: 'rgba(245, 158, 11, 0.5)',
};

const SPECIAL_ICONS: Record<string, string> = {
  'roll-again': '\u{1F3B2}',
  warp: '\u{2728}',
  setback: '\u{2693}',
  swap: '\u{1F500}',
};

function PirateShip({ x, y, color, offset, teamIndex }: { x: number; y: number; color: string; offset: number; teamIndex: number }) {
  const tx = x + offset;
  const ty = y;
  // Lighter version of color for sail accent
  const isRed = teamIndex === 0;

  return (
    <motion.g
      animate={{ x: tx, y: ty }}
      transition={{ type: 'spring', stiffness: 100, damping: 14 }}
    >
      <motion.g
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: teamIndex * 0.5 }}
      >
        {/* Water splash */}
        <ellipse cx="0" cy="16" rx="22" ry="4" fill="#60A5FA" opacity="0.25" />

        {/* Hull shadow */}
        <path
          d="M-22 6 Q-24 16 0 18 Q24 16 22 6 Z"
          fill="rgba(0,0,0,0.15)"
          transform="translate(2, 2)"
        />
        {/* Hull */}
        <path
          d="M-22 6 Q-24 16 0 18 Q24 16 22 6 Z"
          fill={color}
          stroke="#7C2D12"
          strokeWidth="1.5"
        />
        {/* Hull stripe */}
        <path
          d="M-18 10 Q0 14 18 10"
          fill="none"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Mast */}
        <line x1="0" y1="6" x2="0" y2="-22" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" />

        {/* Sail */}
        <path
          d="M1 -20 Q16 -12 1 -2"
          fill="white"
          stroke="#D1D5DB"
          strokeWidth="0.8"
        />
        {/* Sail stripe */}
        <path
          d="M2 -16 Q10 -12 2 -7"
          fill={isRed ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)'}
          stroke="none"
        />

        {/* Flag */}
        <motion.g
          animate={{ rotate: [-8, 8, -8] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          style={{ originX: '0px', originY: '-22px' }}
        >
          <path
            d="M0 -24 L10 -21 L0 -18"
            fill={color}
            stroke="#7C2D12"
            strokeWidth="0.5"
          />
        </motion.g>

        {/* Porthole */}
        <circle cx="-8" cy="9" r="2.5" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />
        <circle cx="8" cy="9" r="2.5" fill="#FDE68A" stroke="#92400E" strokeWidth="0.8" />
      </motion.g>
    </motion.g>
  );
}

function WaterWaves() {
  return (
    <g opacity="0.12">
      {/* Bottom waves */}
      <motion.g
        animate={{ x: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      >
        <path d="M0 475 Q30 465 60 475 Q90 485 120 475 Q150 465 180 475 Q210 485 240 475 Q270 465 300 475 Q330 485 360 475 Q390 465 420 475 Q450 485 480 475 Q510 465 540 475 Q570 485 600 475 Q630 465 660 475 Q690 485 720 475 Q750 465 780 475 Q810 485 840 475 Q870 465 900 475" fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      </motion.g>
      <motion.g
        animate={{ x: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      >
        <path d="M0 485 Q25 477 50 485 Q75 493 100 485 Q125 477 150 485 Q175 493 200 485 Q225 477 250 485 Q275 493 300 485 Q325 477 350 485 Q375 493 400 485 Q425 477 450 485 Q475 493 500 485 Q525 477 550 485 Q575 493 600 485 Q625 477 650 485 Q675 493 700 485 Q725 477 750 485 Q775 493 800 485 Q825 477 850 485 Q875 493 900 485" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
      {/* Top corner waves */}
      <motion.g
        animate={{ x: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      >
        <path d="M680 18 Q710 10 740 18 Q770 26 800 18 Q830 10 860 18 Q890 26 900 20" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" />
      </motion.g>
    </g>
  );
}

function PalmTree({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y}) scale(${scale})`}
      animate={{ rotate: [-2, 2, -2] }}
      transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
    >
      {/* Trunk */}
      <path d="M0 0 Q-3 -15 2 -35 Q4 -45 0 -50" fill="none" stroke="#92400E" strokeWidth="5" strokeLinecap="round" />
      {/* Coconuts */}
      <circle cx="-2" cy="-48" r="3" fill="#92400E" />
      <circle cx="4" cy="-46" r="2.5" fill="#78350F" />
      {/* Fronds */}
      <path d="M0 -50 Q-25 -60 -30 -45" fill="#22C55E" stroke="#16A34A" strokeWidth="1" />
      <path d="M0 -50 Q25 -58 30 -42" fill="#22C55E" stroke="#16A34A" strokeWidth="1" />
      <path d="M0 -50 Q-15 -68 -25 -55" fill="#4ADE80" stroke="#22C55E" strokeWidth="1" />
      <path d="M0 -50 Q15 -66 28 -50" fill="#4ADE80" stroke="#22C55E" strokeWidth="1" />
      <path d="M0 -50 Q0 -72 8 -58" fill="#86EFAC" stroke="#4ADE80" strokeWidth="0.8" />
    </motion.g>
  );
}

function CompassRose({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x}, ${y})`} opacity="0.35">
      <circle r="28" fill="none" stroke="#92400E" strokeWidth="1.5" />
      <circle r="22" fill="none" stroke="#92400E" strokeWidth="0.5" />
      {/* Points */}
      <polygon points="0,-24 3,-8 -3,-8" fill="#D97706" />
      <polygon points="0,24 3,8 -3,8" fill="#92400E" />
      <polygon points="-24,0 -8,3 -8,-3" fill="#92400E" />
      <polygon points="24,0 8,3 8,-3" fill="#92400E" />
      {/* Labels */}
      <text y="-14" textAnchor="middle" fontSize="7" fill="#92400E" fontWeight="bold" fontFamily="serif">N</text>
      <text y="19" textAnchor="middle" fontSize="6" fill="#92400E" fontFamily="serif">S</text>
      <text x="-15" y="3" textAnchor="middle" fontSize="6" fill="#92400E" fontFamily="serif">W</text>
      <text x="15" y="3" textAnchor="middle" fontSize="6" fill="#92400E" fontFamily="serif">E</text>
      <circle r="3" fill="#D97706" />
    </g>
  );
}

export function TreasureMap({ squares, pathPoints, pathD, teams, visualPositions }: TreasureMapProps) {
  if (pathPoints.length === 0) return null;

  const sameSquare = visualPositions[0] === visualPositions[1];
  const offsets: [number, number] = sameSquare ? [-18, 18] : [0, 0];

  return (
    <svg viewBox="0 0 900 500" className="w-full h-full" style={{ maxHeight: '100%' }}>
      {/* Animated glow filter for special squares */}
      <defs>
        <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glow-gold" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        {/* Parchment texture gradient */}
        <radialGradient id="parchment" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="40%" stopColor="#F5E6C8" />
          <stop offset="100%" stopColor="#E8D5B0" />
        </radialGradient>
        {/* Vignette */}
        <radialGradient id="vignette" cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="100%" stopColor="rgba(120, 70, 20, 0.12)" />
        </radialGradient>
      </defs>

      {/* Parchment background */}
      <rect x="0" y="0" width="900" height="500" rx="16" fill="url(#parchment)" />
      {/* Parchment vignette edges */}
      <rect x="0" y="0" width="900" height="500" rx="16" fill="url(#vignette)" />
      {/* Parchment border */}
      <rect x="3" y="3" width="894" height="494" rx="14" fill="none" stroke="#C4A574" strokeWidth="3" strokeDasharray="8 4" opacity="0.5" />

      {/* Water waves */}
      <WaterWaves />

      {/* Decorations */}
      <PalmTree x={55} y={455} scale={0.9} />
      <PalmTree x={845} y={460} scale={0.75} />
      <CompassRose x={820} y={55} />

      {/* Small island deco */}
      <g transform="translate(130, 465)" opacity="0.2">
        <ellipse cx="0" cy="0" rx="25" ry="6" fill="#D4A574" />
      </g>

      {/* Trail path — thick sandy rope */}
      <path
        d={pathD}
        fill="none"
        stroke="#D4A574"
        strokeWidth="14"
        strokeLinecap="round"
        opacity="0.3"
      />
      <path
        d={pathD}
        fill="none"
        stroke="#C4A574"
        strokeWidth="6"
        strokeDasharray="14 8"
        strokeLinecap="round"
        opacity="0.7"
      />

      {/* Square markers */}
      {squares.map((sq, i) => {
        const pt = pathPoints[i];
        if (!pt) return null;

        const isStart = sq.type === 'start';
        const isTreasure = sq.type === 'treasure';
        const isSpecial = !isStart && !isTreasure && sq.type !== 'normal';
        const radius = isStart || isTreasure ? 20 : isSpecial ? 17 : 13;

        let fill: string;
        let strokeColor = 'rgba(255,255,255,0.8)';
        let strokeW = 2.5;

        if (isStart) {
          fill = '#22C55E';
          strokeColor = '#16A34A';
          strokeW = 3;
        } else if (isTreasure) {
          fill = '#F59E0B';
          strokeColor = '#D97706';
          strokeW = 3;
        } else if (isSpecial) {
          fill = SPECIAL_COLORS[sq.type] ?? '#D4A574';
          strokeColor = 'rgba(255,255,255,0.9)';
        } else {
          fill = '#E8D5B0';
          strokeColor = '#C4A574';
          strokeW = 1.5;
        }

        return (
          <g key={i}>
            {/* Glow ring for special/start/treasure */}
            {(isSpecial || isStart || isTreasure) && (
              <circle
                cx={pt.x}
                cy={pt.y}
                r={radius + 5}
                fill="none"
                stroke={isStart ? 'rgba(34,197,94,0.3)' : isTreasure ? 'rgba(245,158,11,0.4)' : (SPECIAL_GLOW[sq.type] ?? 'transparent')}
                strokeWidth="3"
                opacity="0.6"
              >
                <animate attributeName="r" values={`${radius + 3};${radius + 7};${radius + 3}`} dur="2s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
            )}

            {/* Shadow */}
            <circle
              cx={pt.x + 1}
              cy={pt.y + 2}
              r={radius}
              fill="rgba(0,0,0,0.1)"
            />

            {/* Main circle */}
            <circle
              cx={pt.x}
              cy={pt.y}
              r={radius}
              fill={fill}
              stroke={strokeColor}
              strokeWidth={strokeW}
            />

            {/* Inner highlight */}
            {(isStart || isTreasure || isSpecial) && (
              <circle
                cx={pt.x - radius * 0.2}
                cy={pt.y - radius * 0.25}
                r={radius * 0.35}
                fill="rgba(255,255,255,0.3)"
              />
            )}

            {isStart && (
              <text x={pt.x} y={pt.y + 2} textAnchor="middle" dominantBaseline="central" fontSize="18">
                {'\u{26F5}'}
              </text>
            )}
            {isTreasure && (
              <text x={pt.x} y={pt.y + 2} textAnchor="middle" dominantBaseline="central" fontSize="20">
                {'\u{1F3C6}'}
              </text>
            )}
            {isSpecial && (
              <text x={pt.x} y={pt.y + 2} textAnchor="middle" dominantBaseline="central" fontSize="14">
                {SPECIAL_ICONS[sq.type] ?? ''}
              </text>
            )}
            {!isStart && !isTreasure && !isSpecial && (
              <text
                x={pt.x}
                y={pt.y + 1}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="9"
                fill="#92400E"
                fontWeight="bold"
                opacity="0.7"
              >
                {i}
              </text>
            )}
          </g>
        );
      })}

      {/* Team tokens */}
      {[0, 1].map((teamIdx) => {
        const pos = visualPositions[teamIdx];
        const pt = pathPoints[Math.min(pos, pathPoints.length - 1)];
        if (!pt) return null;
        return (
          <PirateShip
            key={teamIdx}
            x={pt.x}
            y={pt.y - 26}
            color={teams[teamIdx].color}
            offset={offsets[teamIdx]}
            teamIndex={teamIdx}
          />
        );
      })}
    </svg>
  );
}
