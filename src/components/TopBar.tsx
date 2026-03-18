import { Link } from 'react-router-dom';
import { useSettingsStore } from '../stores/useSettingsStore';
import { SpeakerIcon, SpeakerMuteIcon, GearIcon } from './icons';

export function TopBar() {
  const { isMuted, toggleMute } = useSettingsStore();

  return (
    <header className="bg-surface shadow-card px-6 py-3 flex items-center justify-between sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-2 no-underline">
        <span className="font-heading text-xl text-primary">ESL Games</span>
      </Link>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleMute}
          className="cursor-pointer bg-transparent border-none p-2 rounded-button hover:bg-bg transition-colors text-text-light"
          aria-label={isMuted ? 'Unmute sounds' : 'Mute sounds'}
        >
          {isMuted ? <SpeakerMuteIcon /> : <SpeakerIcon />}
        </button>
        <Link
          to="/settings"
          className="no-underline p-2 rounded-button hover:bg-bg transition-colors text-text-light"
          aria-label="Settings"
        >
          <GearIcon />
        </Link>
      </div>
    </header>
  );
}
