import { useState } from 'react';
import { motion } from 'framer-motion';
import type { GameConfig, PathLength, Density, DieRange } from './types';

interface SetupScreenProps {
  onStart: (config: GameConfig) => void;
}

function SegmentedButton<T extends string | number>({
  options,
  value,
  onChange,
  labels,
  icons,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
  labels?: Record<string, string>;
  icons?: Record<string, string>;
}) {
  return (
    <div className="flex gap-2">
      {options.map((opt) => {
        const selected = value === opt;
        return (
          <motion.button
            key={String(opt)}
            type="button"
            className={`flex-1 px-3 py-2.5 rounded-xl font-bold text-sm cursor-pointer border-3 transition-colors ${
              selected
                ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-card'
                : 'bg-white/60 text-amber-800 border-amber-200 hover:bg-amber-50 hover:border-amber-300'
            }`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            animate={selected ? { y: -2 } : { y: 0 }}
            onClick={() => onChange(opt)}
          >
            {icons?.[String(opt)] && (
              <span className="block text-lg mb-0.5">{icons[String(opt)]}</span>
            )}
            {labels?.[String(opt)] ?? String(opt)}
          </motion.button>
        );
      })}
    </div>
  );
}

function FloatingDecoration({ emoji, className }: { emoji: string; className: string }) {
  return (
    <motion.span
      className={`absolute text-3xl select-none pointer-events-none ${className}`}
      animate={{ y: [0, -8, 0], rotate: [-5, 5, -5] }}
      transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, ease: 'easeInOut' }}
    >
      {emoji}
    </motion.span>
  );
}

export function SetupScreen({ onStart }: SetupScreenProps) {
  const [teamName1, setTeamName1] = useState('Red Pirates');
  const [teamName2, setTeamName2] = useState('Blue Pirates');
  const [pathLength, setPathLength] = useState<PathLength>(30);
  const [density, setDensity] = useState<Density>('normal');
  const [dieRange, setDieRange] = useState<DieRange>(6);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({
      teamNames: [teamName1.trim() || 'Red Pirates', teamName2.trim() || 'Blue Pirates'],
      pathLength,
      density,
      dieRange,
    });
  };

  return (
    <div className="relative flex items-center justify-center h-full p-4 overflow-hidden">
      {/* Floating pirate decorations */}
      <FloatingDecoration emoji={'\u{1F3F4}\u{200D}\u{2620}\u{FE0F}'} className="top-[8%] left-[10%]" />
      <FloatingDecoration emoji={'\u{1F99C}'} className="top-[12%] right-[12%]" />
      <FloatingDecoration emoji={'\u{26F5}'} className="bottom-[15%] left-[8%]" />
      <FloatingDecoration emoji={'\u{1F3DD}\u{FE0F}'} className="bottom-[10%] right-[10%]" />
      <FloatingDecoration emoji={'\u{2693}'} className="top-[45%] left-[4%]" />
      <FloatingDecoration emoji={'\u{1F52D}'} className="top-[35%] right-[5%]" />

      <motion.form
        onSubmit={handleSubmit}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 180, damping: 18 }}
        className="relative w-full max-w-md rounded-3xl p-8 shadow-hover z-10"
        style={{
          background: 'linear-gradient(160deg, #FEF3C7, #F5E6C8, #FDEBC8)',
          border: '4px solid #D4A574',
          boxShadow: '0 8px 32px rgba(180, 120, 60, 0.25), inset 0 1px 0 rgba(255,255,255,0.5)',
        }}
      >
        {/* Title with pirate hat */}
        <div className="text-center mb-6">
          <motion.div
            className="text-5xl mb-2"
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            {'\u{1F3F4}\u{200D}\u{2620}\u{FE0F}'}
          </motion.div>
          <h2
            className="text-4xl text-amber-900 drop-shadow-sm"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Treasure Trail
          </h2>
          <p className="text-amber-700 text-sm mt-1 font-bold">Race to the treasure chest!</p>
        </div>

        {/* Team Names */}
        <div className="space-y-3 mb-5">
          <div>
            <label className="block text-sm font-bold text-amber-800 mb-1.5">
              {'\u{1F7E5}'} Team 1
            </label>
            <div className="flex items-center gap-2">
              <motion.span
                className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #EF4444, #DC2626)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <input
                type="text"
                value={teamName1}
                onChange={(e) => setTeamName1(e.target.value.slice(0, 20))}
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-xl border-3 border-amber-300 bg-white/90 font-bold text-amber-900 focus:outline-none focus:border-amber-500 focus:bg-white text-base shadow-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-amber-800 mb-1.5">
              {'\u{1F7E6}'} Team 2
            </label>
            <div className="flex items-center gap-2">
              <motion.span
                className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm border-2 border-white"
                style={{ background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1 }}
              />
              <input
                type="text"
                value={teamName2}
                onChange={(e) => setTeamName2(e.target.value.slice(0, 20))}
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-xl border-3 border-amber-300 bg-white/90 font-bold text-amber-900 focus:outline-none focus:border-amber-500 focus:bg-white text-base shadow-sm"
                style={{ fontFamily: 'var(--font-body)' }}
              />
            </div>
          </div>
        </div>

        {/* Path Length */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-amber-800 mb-2">
            {'\u{1F5FA}\u{FE0F}'} Map Size
          </label>
          <SegmentedButton
            options={[20, 30, 40] as PathLength[]}
            value={pathLength}
            onChange={setPathLength}
            labels={{ '20': 'Short', '30': 'Medium', '40': 'Long' }}
            icons={{ '20': '\u{1F3DD}\u{FE0F}', '30': '\u{26F5}', '40': '\u{1F30A}' }}
          />
        </div>

        {/* Special Square Density */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-amber-800 mb-2">
            {'\u{2728}'} Surprises
          </label>
          <SegmentedButton
            options={['few', 'normal', 'chaotic'] as Density[]}
            value={density}
            onChange={setDensity}
            labels={{ few: 'A Few', normal: 'Some', chaotic: 'Lots!' }}
            icons={{ few: '\u{1F60C}', normal: '\u{1F60E}', chaotic: '\u{1F92F}' }}
          />
        </div>

        {/* Die Range */}
        <div className="mb-6">
          <label className="block text-sm font-bold text-amber-800 mb-2">
            {'\u{1F3B2}'} Dice
          </label>
          <SegmentedButton
            options={[3, 4, 6] as DieRange[]}
            value={dieRange}
            onChange={setDieRange}
            labels={{ '3': '1 to 3', '4': '1 to 4', '6': '1 to 6' }}
          />
        </div>

        {/* Start Button */}
        <motion.button
          type="submit"
          className="w-full py-4 rounded-2xl font-bold text-2xl text-white cursor-pointer border-none shadow-hover"
          style={{
            background: 'linear-gradient(135deg, #F59E0B, #D97706, #B45309)',
            fontFamily: 'var(--font-heading)',
            textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          animate={{
            boxShadow: [
              '0 4px 20px rgba(245, 158, 11, 0.4)',
              '0 8px 30px rgba(245, 158, 11, 0.7)',
              '0 4px 20px rgba(245, 158, 11, 0.4)',
            ],
          }}
          transition={{ boxShadow: { repeat: Infinity, duration: 2 } }}
        >
          {'\u{26F5}'} Set Sail!
        </motion.button>
      </motion.form>
    </div>
  );
}
