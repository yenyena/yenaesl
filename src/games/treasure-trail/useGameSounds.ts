import { useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useSettingsStore } from '../../stores/useSettingsStore';

type SoundName =
  | 'correct'
  | 'steal'
  | 'stealMiss'
  | 'reveal'
  | 'dieRoll'
  | 'move'
  | 'rollAgain'
  | 'warp'
  | 'setback'
  | 'swap'
  | 'victory';

const SOUND_PATHS: Record<SoundName, string> = {
  correct: '/sounds/correct.mp3',
  steal: '/sounds/whoosh.mp3',
  stealMiss: '/sounds/no-match.mp3',
  reveal: '/sounds/whoosh.mp3',
  dieRoll: '/sounds/pop.mp3',
  move: '/sounds/pop.mp3',
  rollAgain: '/sounds/correct.mp3',
  warp: '/sounds/whoosh.mp3',
  setback: '/sounds/no-match.mp3',
  swap: '/sounds/match.mp3',
  victory: '/sounds/victory.mp3',
};

export function useGameSounds() {
  const sounds = useRef<Partial<Record<SoundName, Howl>>>({});

  const getSound = useCallback((name: SoundName): Howl => {
    if (!sounds.current[name]) {
      sounds.current[name] = new Howl({
        src: [SOUND_PATHS[name]],
        volume: 0.5,
        onloaderror: () => {
          // Gracefully handle missing sound files
        },
      });
    }
    return sounds.current[name];
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      const isMuted = useSettingsStore.getState().isMuted;
      if (isMuted) return;
      getSound(name).play();
    },
    [getSound],
  );

  return { play };
}
