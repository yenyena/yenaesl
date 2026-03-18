import { useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useSettingsStore } from '../../stores/useSettingsStore';

type SoundName = 'tick' | 'transition' | 'reveal' | 'newRound';

const SOUND_PATHS: Record<SoundName, string> = {
  tick: '/sounds/tick.mp3',
  transition: '/sounds/transition.mp3',
  reveal: '/sounds/reveal.mp3',
  newRound: '/sounds/new-round.mp3',
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
