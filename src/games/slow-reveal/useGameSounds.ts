import { useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useSettingsStore } from '../../stores/useSettingsStore';

type SoundName = 'squareRemove' | 'wrongGuess' | 'correctGuess' | 'nextWord';

const SOUND_PATHS: Record<SoundName, string> = {
  squareRemove: '/sounds/pop.mp3',
  wrongGuess: '/sounds/buzz.mp3',
  correctGuess: '/sounds/chime.mp3',
  nextWord: '/sounds/whoosh.mp3',
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
