import { create } from 'zustand';

export type SyncStatus = 'disconnected' | 'connected' | 'syncing' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSynced: Date | null;
  setStatus: (status: SyncStatus) => void;
  setLastSynced: (date: Date) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  status: 'disconnected',
  lastSynced: null,
  setStatus: (status) => set({ status }),
  setLastSynced: (date) => set({ lastSynced: date }),
}));

// Re-export Firebase sync functions for use by vocab store
export {
  syncUnitToFirestore,
  syncCategoryListToFirestore,
  deleteUnitFromFirestore,
  deleteCategoryListFromFirestore,
  pushAllToFirestore,
  clearFirestore,
  subscribeToFirestore,
  fetchAllFromFirestore,
} from './firebaseSync';
