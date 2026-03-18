import type { BodyPartVariant, BodyPartCategory } from './types';

// Color palette
const CORAL = '#FF6B6B';
const TEAL = '#4ECDC4';
const YELLOW = '#FFD93D';
const PURPLE = '#A855F7';
const GREEN = '#16A34A';
const ORANGE = '#F59E0B';
const STROKE = '#1E293B';
const SW = 3; // stroke width

// ── EYES ──────────────────────────────────────────────

function BigRoundEyes() {
  return (
    <g>
      {/* Left eye */}
      <circle cx="-25" cy="0" r="20" fill="white" stroke={STROKE} strokeWidth={SW} />
      <circle cx="-20" cy="-2" r="9" fill={STROKE} />
      <circle cx="-17" cy="-5" r="3" fill="white" />
      {/* Right eye */}
      <circle cx="25" cy="0" r="20" fill="white" stroke={STROKE} strokeWidth={SW} />
      <circle cx="30" cy="-2" r="9" fill={STROKE} />
      <circle cx="33" cy="-5" r="3" fill="white" />
    </g>
  );
}

function SleepyEyes() {
  return (
    <g>
      {/* Left eye */}
      <ellipse cx="-25" cy="0" rx="20" ry="12" fill="white" stroke={STROKE} strokeWidth={SW} />
      <path d="-45,0 Q-25,-14 -5,0" fill="none" stroke={STROKE} strokeWidth={SW} />
      <circle cx="-22" cy="2" r="6" fill={STROKE} />
      {/* Right eye */}
      <ellipse cx="25" cy="0" rx="20" ry="12" fill="white" stroke={STROKE} strokeWidth={SW} />
      <path d="5,0 Q25,-14 45,0" fill="none" stroke={STROKE} strokeWidth={SW} />
      <circle cx="28" cy="2" r="6" fill={STROKE} />
    </g>
  );
}

function AngryEyes() {
  return (
    <g>
      {/* Left eye */}
      <circle cx="-25" cy="0" r="18" fill="white" stroke={STROKE} strokeWidth={SW} />
      <circle cx="-22" cy="0" r="8" fill={CORAL} />
      <circle cx="-22" cy="0" r="4" fill={STROKE} />
      <line x1="-43" y1="-12" x2="-10" y2="-6" stroke={STROKE} strokeWidth={4} strokeLinecap="round" />
      {/* Right eye */}
      <circle cx="25" cy="0" r="18" fill="white" stroke={STROKE} strokeWidth={SW} />
      <circle cx="28" cy="0" r="8" fill={CORAL} />
      <circle cx="28" cy="0" r="4" fill={STROKE} />
      <line x1="10" y1="-6" x2="43" y2="-12" stroke={STROKE} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function SpiralEyes() {
  return (
    <g>
      {/* Left eye */}
      <circle cx="-25" cy="0" r="18" fill="white" stroke={STROKE} strokeWidth={SW} />
      <path
        d="M-25,0 a3,3 0 0,1 6,0 a6,6 0 0,1 -12,0 a9,9 0 0,1 18,0 a12,12 0 0,1 -24,0"
        fill="none" stroke={PURPLE} strokeWidth={2.5} strokeLinecap="round"
      />
      {/* Right eye */}
      <circle cx="25" cy="0" r="18" fill="white" stroke={STROKE} strokeWidth={SW} />
      <path
        d="M25,0 a3,3 0 0,1 6,0 a6,6 0 0,1 -12,0 a9,9 0 0,1 18,0 a12,12 0 0,1 -24,0"
        fill="none" stroke={PURPLE} strokeWidth={2.5} strokeLinecap="round"
      />
    </g>
  );
}

// ── MOUTH ─────────────────────────────────────────────

function BigSmile() {
  return (
    <g>
      <path
        d="M-35,0 Q0,45 35,0"
        fill={CORAL} stroke={STROKE} strokeWidth={SW} strokeLinecap="round"
      />
      <path
        d="M-25,2 Q0,30 25,2"
        fill="white"
      />
    </g>
  );
}

function ToothyGrin() {
  return (
    <g>
      <path
        d="M-35,-5 Q0,35 35,-5"
        fill={CORAL} stroke={STROKE} strokeWidth={SW} strokeLinecap="round"
      />
      {/* Teeth */}
      <rect x="-20" y="-5" width="10" height="12" rx="2" fill="white" stroke={STROKE} strokeWidth={1.5} />
      <rect x="-8" y="-5" width="10" height="14" rx="2" fill="white" stroke={STROKE} strokeWidth={1.5} />
      <rect x="4" y="-5" width="10" height="12" rx="2" fill="white" stroke={STROKE} strokeWidth={1.5} />
    </g>
  );
}

function TongueOut() {
  return (
    <g>
      <path
        d="M-30,-3 Q0,30 30,-3"
        fill={CORAL} stroke={STROKE} strokeWidth={SW} strokeLinecap="round"
      />
      <ellipse cx="0" cy="22" rx="14" ry="18" fill="#FF8FAB" stroke={STROKE} strokeWidth={SW} />
      <line x1="0" y1="10" x2="0" y2="36" stroke={CORAL} strokeWidth={2} />
    </g>
  );
}

function SurprisedO() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="18" ry="22" fill={CORAL} stroke={STROKE} strokeWidth={SW} />
      <ellipse cx="0" cy="0" rx="10" ry="14" fill="#2D1B1B" />
    </g>
  );
}

// ── NOSE ──────────────────────────────────────────────

function ButtonNose() {
  return (
    <g>
      <circle cx="0" cy="0" r="12" fill={ORANGE} stroke={STROKE} strokeWidth={SW} />
      <circle cx="-4" cy="2" r="3" fill={STROKE} opacity="0.4" />
      <circle cx="4" cy="2" r="3" fill={STROKE} opacity="0.4" />
    </g>
  );
}

function PigSnout() {
  return (
    <g>
      <ellipse cx="0" cy="0" rx="20" ry="14" fill="#FFB6C1" stroke={STROKE} strokeWidth={SW} />
      <circle cx="-7" cy="2" r="4" fill={STROKE} opacity="0.5" />
      <circle cx="7" cy="2" r="4" fill={STROKE} opacity="0.5" />
    </g>
  );
}

function CarrotNose() {
  return (
    <g>
      <polygon points="0,-10 -10,20 10,20" fill={ORANGE} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      <line x1="-3" y1="2" x2="4" y2="0" stroke={STROKE} strokeWidth={1.5} opacity="0.3" />
      <line x1="-4" y1="8" x2="3" y2="7" stroke={STROKE} strokeWidth={1.5} opacity="0.3" />
    </g>
  );
}

// ── EARS ──────────────────────────────────────────────

function PointyElfEars() {
  return (
    <g>
      {/* Left ear */}
      <polygon points="-130,-20 -110,30 -80,-10" fill={TEAL} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
      {/* Right ear */}
      <polygon points="130,-20 110,30 80,-10" fill={TEAL} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round" />
    </g>
  );
}

function RoundBearEars() {
  return (
    <g>
      {/* Left ear */}
      <circle cx="-100" cy="-15" r="28" fill="#8B5E3C" stroke={STROKE} strokeWidth={SW} />
      <circle cx="-100" cy="-15" r="15" fill="#D4A574" />
      {/* Right ear */}
      <circle cx="100" cy="-15" r="28" fill="#8B5E3C" stroke={STROKE} strokeWidth={SW} />
      <circle cx="100" cy="-15" r="15" fill="#D4A574" />
    </g>
  );
}

function LongBunnyEars() {
  return (
    <g>
      {/* Left ear */}
      <ellipse cx="-70" cy="-50" rx="18" ry="50" fill="white" stroke={STROKE} strokeWidth={SW} />
      <ellipse cx="-70" cy="-50" rx="10" ry="38" fill="#FFB6C1" />
      {/* Right ear */}
      <ellipse cx="70" cy="-50" rx="18" ry="50" fill="white" stroke={STROKE} strokeWidth={SW} />
      <ellipse cx="70" cy="-50" rx="10" ry="38" fill="#FFB6C1" />
    </g>
  );
}

// ── ARMS ──────────────────────────────────────────────

function MusclyArms() {
  return (
    <g>
      {/* Left arm */}
      <g transform="translate(-170,0)">
        <path d="M60,0 Q30,-15 20,-35 Q10,-20 0,0 Q10,10 20,5 Z" fill={GREEN} stroke={STROKE} strokeWidth={SW} />
        <circle cx="15" cy="-40" r="12" fill={GREEN} stroke={STROKE} strokeWidth={SW} />
      </g>
      {/* Right arm */}
      <g transform="translate(110,0)">
        <path d="M0,0 Q10,-15 20,-35 Q30,-20 40,0 Q30,10 20,5 Z" fill={GREEN} stroke={STROKE} strokeWidth={SW} />
        <circle cx="25" cy="-40" r="12" fill={GREEN} stroke={STROKE} strokeWidth={SW} />
      </g>
    </g>
  );
}

function TentacleArms() {
  return (
    <g>
      {/* Left tentacle */}
      <path
        d="M-120,0 Q-145,-10 -160,10 Q-175,30 -155,35 Q-140,20 -150,5"
        fill="none" stroke={PURPLE} strokeWidth={8} strokeLinecap="round"
      />
      {[0, 1, 2, 3].map((i) => (
        <circle key={`l${i}`} cx={-130 - i * 8} cy={5 + i * 6} r="3" fill={TEAL} />
      ))}
      {/* Right tentacle */}
      <path
        d="M120,0 Q145,-10 160,10 Q175,30 155,35 Q140,20 150,5"
        fill="none" stroke={PURPLE} strokeWidth={8} strokeLinecap="round"
      />
      {[0, 1, 2, 3].map((i) => (
        <circle key={`r${i}`} cx={130 + i * 8} cy={5 + i * 6} r="3" fill={TEAL} />
      ))}
    </g>
  );
}

function StickGloveArms() {
  return (
    <g>
      {/* Left arm */}
      <line x1="-110" y1="0" x2="-160" y2="-10" stroke={STROKE} strokeWidth={4} strokeLinecap="round" />
      <circle cx="-165" cy="-12" r="14" fill="white" stroke={STROKE} strokeWidth={SW} />
      {/* Right arm */}
      <line x1="110" y1="0" x2="160" y2="-10" stroke={STROKE} strokeWidth={4} strokeLinecap="round" />
      <circle cx="165" cy="-12" r="14" fill="white" stroke={STROKE} strokeWidth={SW} />
    </g>
  );
}

// ── LEGS ──────────────────────────────────────────────

function ChickenLegs() {
  return (
    <g>
      {/* Left leg */}
      <line x1="-40" y1="0" x2="-45" y2="50" stroke={YELLOW} strokeWidth={5} strokeLinecap="round" />
      <path d="M-60,50 L-45,50 L-35,60 L-45,50 L-25,50" fill="none" stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
      {/* Right leg */}
      <line x1="40" y1="0" x2="45" y2="50" stroke={YELLOW} strokeWidth={5} strokeLinecap="round" />
      <path d="M25,50 L45,50 L55,60 L45,50 L60,50" fill="none" stroke={YELLOW} strokeWidth={4} strokeLinecap="round" />
    </g>
  );
}

function ShortStubbyLegs() {
  return (
    <g>
      {/* Left leg */}
      <rect x="-60" y="0" width="30" height="35" rx="10" fill={TEAL} stroke={STROKE} strokeWidth={SW} />
      <ellipse cx="-45" cy="35" rx="18" ry="8" fill={TEAL} stroke={STROKE} strokeWidth={SW} />
      {/* Right leg */}
      <rect x="30" y="0" width="30" height="35" rx="10" fill={TEAL} stroke={STROKE} strokeWidth={SW} />
      <ellipse cx="45" cy="35" rx="18" ry="8" fill={TEAL} stroke={STROKE} strokeWidth={SW} />
    </g>
  );
}

function SpringLegs() {
  return (
    <g>
      {/* Left leg spring */}
      <path
        d="M-40,0 Q-55,12 -40,20 Q-25,28 -40,36 Q-55,44 -40,52"
        fill="none" stroke={CORAL} strokeWidth={4} strokeLinecap="round"
      />
      <ellipse cx="-40" cy="58" rx="15" ry="8" fill={CORAL} stroke={STROKE} strokeWidth={SW} />
      {/* Right leg spring */}
      <path
        d="M40,0 Q55,12 40,20 Q25,28 40,36 Q55,44 40,52"
        fill="none" stroke={CORAL} strokeWidth={4} strokeLinecap="round"
      />
      <ellipse cx="40" cy="58" rx="15" ry="8" fill={CORAL} stroke={STROKE} strokeWidth={SW} />
    </g>
  );
}

// ── ACCESSORY ─────────────────────────────────────────

function TopHat() {
  return (
    <g>
      <rect x="-25" y="-45" width="50" height="40" rx="4" fill={STROKE} />
      <rect x="-40" y="-8" width="80" height="10" rx="4" fill={STROKE} />
      <rect x="-20" y="-40" width="40" height="6" rx="2" fill={CORAL} />
    </g>
  );
}

function Crown() {
  return (
    <g>
      <polygon
        points="-35,5 -35,-20 -20,-8 -10,-30 0,-10 10,-30 20,-8 35,-20 35,5"
        fill={YELLOW} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round"
      />
      <circle cx="-10" cy="-5" r="4" fill={CORAL} />
      <circle cx="10" cy="-5" r="4" fill={TEAL} />
      <circle cx="0" cy="-15" r="4" fill={PURPLE} />
    </g>
  );
}

function BowTie() {
  return (
    <g>
      <polygon points="-30,0 0,-15 0,15" fill={CORAL} stroke={STROKE} strokeWidth={SW} />
      <polygon points="30,0 0,-15 0,15" fill={CORAL} stroke={STROKE} strokeWidth={SW} />
      <circle cx="0" cy="0" r="6" fill={YELLOW} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function Sunglasses() {
  return (
    <g>
      <rect x="-45" y="-12" width="35" height="24" rx="6" fill={STROKE} opacity="0.85" />
      <rect x="10" y="-12" width="35" height="24" rx="6" fill={STROKE} opacity="0.85" />
      <line x1="-10" y1="0" x2="10" y2="0" stroke={STROKE} strokeWidth={3} />
      <line x1="-45" y1="-2" x2="-60" y2="-8" stroke={STROKE} strokeWidth={3} />
      <line x1="45" y1="-2" x2="60" y2="-8" stroke={STROKE} strokeWidth={3} />
    </g>
  );
}

// ── EXTRA ─────────────────────────────────────────────

function BatWings() {
  return (
    <g>
      {/* Left wing */}
      <path
        d="M-100,-20 Q-140,-60 -120,-80 Q-110,-60 -100,-65 Q-100,-90 -80,-95 Q-85,-70 -75,-70 Q-70,-90 -55,-80 L-80,-20 Z"
        fill={PURPLE} stroke={STROKE} strokeWidth={SW} fillOpacity="0.8"
      />
      {/* Right wing */}
      <path
        d="M100,-20 Q140,-60 120,-80 Q110,-60 100,-65 Q100,-90 80,-95 Q85,-70 75,-70 Q70,-90 55,-80 L80,-20 Z"
        fill={PURPLE} stroke={STROKE} strokeWidth={SW} fillOpacity="0.8"
      />
    </g>
  );
}

function DevilTail() {
  return (
    <g>
      <path
        d="M80,80 Q120,60 130,30 Q140,10 130,-10"
        fill="none" stroke={CORAL} strokeWidth={5} strokeLinecap="round"
      />
      <polygon points="125,-20 140,-10 130,0" fill={CORAL} stroke={STROKE} strokeWidth={2} />
    </g>
  );
}

function UnicornHorn() {
  return (
    <g>
      <polygon
        points="0,-60 -12,0 12,0"
        fill={YELLOW} stroke={STROKE} strokeWidth={SW} strokeLinejoin="round"
      />
      <line x1="-8" y1="-12" x2="5" y2="-18" stroke="white" strokeWidth={2.5} opacity="0.6" />
      <line x1="-6" y1="-28" x2="5" y2="-34" stroke="white" strokeWidth={2.5} opacity="0.6" />
      <line x1="-4" y1="-44" x2="3" y2="-48" stroke="white" strokeWidth={2.5} opacity="0.6" />
    </g>
  );
}

function Antenna() {
  return (
    <g>
      {/* Left antenna */}
      <path d="M-20,0 Q-30,-40 -15,-55" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
      <circle cx="-15" cy="-55" r="8" fill={TEAL} stroke={STROKE} strokeWidth={SW} />
      {/* Right antenna */}
      <path d="M20,0 Q30,-40 15,-55" fill="none" stroke={STROKE} strokeWidth={3} strokeLinecap="round" />
      <circle cx="15" cy="-55" r="8" fill={CORAL} stroke={STROKE} strokeWidth={SW} />
    </g>
  );
}

// ── REGISTRY ──────────────────────────────────────────

export const BODY_PARTS: Record<BodyPartCategory, BodyPartVariant[]> = {
  eyes: [
    { id: 'big-round', category: 'eyes', label: 'Big round', render: () => <BigRoundEyes /> },
    { id: 'sleepy', category: 'eyes', label: 'Sleepy', render: () => <SleepyEyes /> },
    { id: 'angry', category: 'eyes', label: 'Angry', render: () => <AngryEyes /> },
    { id: 'spiral', category: 'eyes', label: 'Spiral', render: () => <SpiralEyes /> },
  ],
  mouth: [
    { id: 'big-smile', category: 'mouth', label: 'Big smile', render: () => <BigSmile /> },
    { id: 'toothy-grin', category: 'mouth', label: 'Toothy grin', render: () => <ToothyGrin /> },
    { id: 'tongue-out', category: 'mouth', label: 'Tongue out', render: () => <TongueOut /> },
    { id: 'surprised-o', category: 'mouth', label: 'Surprised', render: () => <SurprisedO /> },
  ],
  nose: [
    { id: 'button', category: 'nose', label: 'Button', render: () => <ButtonNose /> },
    { id: 'pig-snout', category: 'nose', label: 'Pig snout', render: () => <PigSnout /> },
    { id: 'carrot', category: 'nose', label: 'Carrot', render: () => <CarrotNose /> },
  ],
  ears: [
    { id: 'pointy-elf', category: 'ears', label: 'Pointy elf', render: () => <PointyElfEars /> },
    { id: 'round-bear', category: 'ears', label: 'Round bear', render: () => <RoundBearEars /> },
    { id: 'long-bunny', category: 'ears', label: 'Long bunny', render: () => <LongBunnyEars /> },
  ],
  arms: [
    { id: 'muscly', category: 'arms', label: 'Muscly', render: () => <MusclyArms /> },
    { id: 'tentacle', category: 'arms', label: 'Tentacle', render: () => <TentacleArms /> },
    { id: 'stick-glove', category: 'arms', label: 'Stick glove', render: () => <StickGloveArms /> },
  ],
  legs: [
    { id: 'chicken', category: 'legs', label: 'Chicken', render: () => <ChickenLegs /> },
    { id: 'short-stubby', category: 'legs', label: 'Short stubby', render: () => <ShortStubbyLegs /> },
    { id: 'spring', category: 'legs', label: 'Spring', render: () => <SpringLegs /> },
  ],
  accessory: [
    { id: 'top-hat', category: 'accessory', label: 'Top hat', render: () => <TopHat /> },
    { id: 'crown', category: 'accessory', label: 'Crown', render: () => <Crown /> },
    { id: 'bow-tie', category: 'accessory', label: 'Bow tie', render: () => <BowTie /> },
    { id: 'sunglasses', category: 'accessory', label: 'Sunglasses', render: () => <Sunglasses /> },
  ],
  extra: [
    { id: 'bat-wings', category: 'extra', label: 'Bat wings', render: () => <BatWings /> },
    { id: 'devil-tail', category: 'extra', label: 'Devil tail', render: () => <DevilTail /> },
    { id: 'unicorn-horn', category: 'extra', label: 'Unicorn horn', render: () => <UnicornHorn /> },
    { id: 'antenna', category: 'extra', label: 'Antenna', render: () => <Antenna /> },
  ],
};
