import { useRef, useCallback } from 'react';
import { Howl } from 'howler';
import { useSettingsStore } from '../../stores/useSettingsStore';

type SoundName = 'correct' | 'showAnswer' | 'partSelect' | 'partAttach' | 'complete';

const SOUND_PATHS: Record<SoundName, string> = {
  correct: '/sounds/correct.mp3',
  showAnswer: '/sounds/whoosh.mp3',
  partSelect: '/sounds/pop.mp3',
  partAttach: '/sounds/match.mp3',
  complete: '/sounds/victory.mp3',
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
