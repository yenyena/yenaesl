import { create } from 'zustand';

interface SettingsState {
  isMuted: boolean;
  toggleMute: () => void;
  zoomLevel: number;
  zoomIn: () => void;
  zoomOut: () => void;
}

const ZOOM_MIN = 0.1;
const ZOOM_MAX = 1.4;
const ZOOM_STEP = 0.1;

export const useSettingsStore = create<SettingsState>((set) => ({
  isMuted: false,
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  zoomLevel: 1,
  zoomIn: () =>
    set((state) => ({
      zoomLevel: Math.min(ZOOM_MAX, Math.round((state.zoomLevel + ZOOM_STEP) * 10) / 10),
    })),
  zoomOut: () =>
    set((state) => ({
      zoomLevel: Math.max(ZOOM_MIN, Math.round((state.zoomLevel - ZOOM_STEP) * 10) / 10),
    })),
}));
