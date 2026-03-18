import { create } from 'zustand';
import type { Unit, CategoryList, ExportData } from '../types';
import * as db from '../db';
import {
  useSyncStore,
  syncUnitToFirestore,
  syncCategoryListToFirestore,
  deleteUnitFromFirestore,
  deleteCategoryListFromFirestore,
  pushAllToFirestore,
  clearFirestore,
  subscribeToFirestore,
} from '../services/syncService';

interface VocabState {
  units: Unit[];
  categoryLists: CategoryList[];
  isLoaded: boolean;

  // Load
  loadAll: () => Promise<void>;

  // Unit selectors
  getUnitsByMonth: (month: string) => Unit[];
  getUnit: (id: string) => Unit | undefined;
  getUnitByMonthWeek: (month: string, week: number) => Unit | undefined;

  // Unit mutations
  saveUnit: (unit: Unit) => Promise<void>;
  deleteUnit: (id: string) => Promise<void>;

  // Word mutations
  addWord: (unitId: string, word: Unit['words'][number]) => Promise<void>;
  updateWord: (unitId: string, wordId: string, updates: Partial<Unit['words'][number]>) => Promise<void>;
  deleteWord: (unitId: string, wordId: string) => Promise<void>;

  // Category list mutations
  saveCategoryList: (list: CategoryList) => Promise<void>;
  deleteCategoryList: (id: string) => Promise<void>;

  // Category item mutations
  addCategoryItem: (listId: string, item: CategoryList['items'][number]) => Promise<void>;
  updateCategoryItem: (listId: string, itemId: string, updates: Partial<CategoryList['items'][number]>) => Promise<void>;
  deleteCategoryItem: (listId: string, itemId: string) => Promise<void>;

  // Odd One Out toggle
  toggleOddOneOutList: (unitId: string, listId: string) => Promise<void>;

  // Data management
  exportData: () => Promise<ExportData>;
  importData: (data: ExportData, mode: 'merge' | 'replace') => Promise<void>;
  resetData: () => Promise<void>;
}

// Track whether we're applying a remote snapshot to avoid echo sync
let applyingRemote = false;

// Fire-and-forget sync helper — updates sync status
function fireAndForgetUnit(unit: Unit) {
  if (applyingRemote) return;
  const { setStatus, setLastSynced } = useSyncStore.getState();
  setStatus('syncing');
  syncUnitToFirestore(unit)
    .then(() => { setStatus('connected'); setLastSynced(new Date()); })
    .catch(() => { setStatus('error'); });
}

function fireAndForgetCategoryList(list: CategoryList) {
  if (applyingRemote) return;
  const { setStatus, setLastSynced } = useSyncStore.getState();
  setStatus('syncing');
  syncCategoryListToFirestore(list)
    .then(() => { setStatus('connected'); setLastSynced(new Date()); })
    .catch(() => { setStatus('error'); });
}

function fireAndForgetDeleteUnit(id: string) {
  if (applyingRemote) return;
  const { setStatus, setLastSynced } = useSyncStore.getState();
  setStatus('syncing');
  deleteUnitFromFirestore(id)
    .then(() => { setStatus('connected'); setLastSynced(new Date()); })
    .catch(() => { setStatus('error'); });
}

function fireAndForgetDeleteCategoryList(id: string) {
  if (applyingRemote) return;
  const { setStatus, setLastSynced } = useSyncStore.getState();
  setStatus('syncing');
  deleteCategoryListFromFirestore(id)
    .then(() => { setStatus('connected'); setLastSynced(new Date()); })
    .catch(() => { setStatus('error'); });
}

export const useVocabStore = create<VocabState>((set, get) => ({
  units: [],
  categoryLists: [],
  isLoaded: false,

  loadAll: async () => {
    // 1. Load from IndexedDB (fast local)
    const [units, categoryLists] = await Promise.all([
      db.getAllUnits(),
      db.getAllCategoryLists(),
    ]);
    set({ units, categoryLists, isLoaded: true });

    // 2. Set up Firestore real-time listeners
    const { setStatus, setLastSynced } = useSyncStore.getState();
    setStatus('syncing');

    let isFirstSnapshot = true;

    subscribeToFirestore(async (remoteUnits, remoteCategoryLists) => {
      if (isFirstSnapshot) {
        isFirstSnapshot = false;

        if (remoteUnits.length > 0 || remoteCategoryLists.length > 0) {
          // Firestore has data — update local
          applyingRemote = true;
          const importData: ExportData = {
            version: 1,
            exportedAt: new Date().toISOString(),
            units: remoteUnits,
            categoryLists: remoteCategoryLists,
          };
          await db.importAll(importData, 'replace');
          set({ units: remoteUnits, categoryLists: remoteCategoryLists });
          applyingRemote = false;
        } else {
          // Firestore is empty but local has data — push local to Firestore
          const localUnits = get().units;
          const localCategoryLists = get().categoryLists;
          if (localUnits.length > 0 || localCategoryLists.length > 0) {
            const localData = await db.exportAll();
            await pushAllToFirestore(localData);
          }
        }
      } else {
        // Subsequent snapshots — remote changes, update local
        applyingRemote = true;
        const importData: ExportData = {
          version: 1,
          exportedAt: new Date().toISOString(),
          units: remoteUnits,
          categoryLists: remoteCategoryLists,
        };
        await db.importAll(importData, 'replace');
        set({ units: remoteUnits, categoryLists: remoteCategoryLists });
        applyingRemote = false;
      }

      setStatus('connected');
      setLastSynced(new Date());
    });
  },

  getUnitsByMonth: (month) => get().units.filter((u) => u.month === month),
  getUnit: (id) => get().units.find((u) => u.id === id),
  getUnitByMonthWeek: (month, week) => get().units.find((u) => u.month === month && u.week === week),

  saveUnit: async (unit) => {
    await db.saveUnit(unit);
    set((s) => {
      const idx = s.units.findIndex((u) => u.id === unit.id);
      const units = [...s.units];
      if (idx >= 0) units[idx] = unit;
      else units.push(unit);
      return { units };
    });
    fireAndForgetUnit(unit);
  },

  deleteUnit: async (id) => {
    await db.deleteUnit(id);
    set((s) => ({ units: s.units.filter((u) => u.id !== id) }));
    fireAndForgetDeleteUnit(id);
  },

  addWord: async (unitId, word) => {
    const updated = await db.addWord(unitId, word);
    set((s) => ({ units: s.units.map((u) => (u.id === unitId ? updated : u)) }));
    fireAndForgetUnit(updated);
  },

  updateWord: async (unitId, wordId, updates) => {
    const updated = await db.updateWord(unitId, wordId, updates);
    set((s) => ({ units: s.units.map((u) => (u.id === unitId ? updated : u)) }));
    fireAndForgetUnit(updated);
  },

  deleteWord: async (unitId, wordId) => {
    const updated = await db.deleteWord(unitId, wordId);
    set((s) => ({ units: s.units.map((u) => (u.id === unitId ? updated : u)) }));
    fireAndForgetUnit(updated);
  },

  saveCategoryList: async (list) => {
    await db.saveCategoryList(list);
    set((s) => {
      const idx = s.categoryLists.findIndex((l) => l.id === list.id);
      const categoryLists = [...s.categoryLists];
      if (idx >= 0) categoryLists[idx] = list;
      else categoryLists.push(list);
      return { categoryLists };
    });
    fireAndForgetCategoryList(list);
  },

  deleteCategoryList: async (id) => {
    await db.deleteCategoryList(id);
    set((s) => ({
      categoryLists: s.categoryLists.filter((l) => l.id !== id),
      units: s.units.map((u) =>
        u.oddOneOutLists.includes(id)
          ? { ...u, oddOneOutLists: u.oddOneOutLists.filter((lid) => lid !== id) }
          : u,
      ),
    }));
    fireAndForgetDeleteCategoryList(id);
  },

  addCategoryItem: async (listId, item) => {
    const updated = await db.addCategoryItem(listId, item);
    set((s) => ({ categoryLists: s.categoryLists.map((l) => (l.id === listId ? updated : l)) }));
    fireAndForgetCategoryList(updated);
  },

  updateCategoryItem: async (listId, itemId, updates) => {
    const updated = await db.updateCategoryItem(listId, itemId, updates);
    set((s) => ({ categoryLists: s.categoryLists.map((l) => (l.id === listId ? updated : l)) }));
    fireAndForgetCategoryList(updated);
  },

  deleteCategoryItem: async (listId, itemId) => {
    const updated = await db.deleteCategoryItem(listId, itemId);
    set((s) => ({ categoryLists: s.categoryLists.map((l) => (l.id === listId ? updated : l)) }));
    fireAndForgetCategoryList(updated);
  },

  toggleOddOneOutList: async (unitId, listId) => {
    const unit = get().units.find((u) => u.id === unitId);
    if (!unit) return;
    const has = unit.oddOneOutLists.includes(listId);
    const updated: Unit = {
      ...unit,
      oddOneOutLists: has
        ? unit.oddOneOutLists.filter((id) => id !== listId)
        : [...unit.oddOneOutLists, listId],
    };
    await db.saveUnit(updated);
    set((s) => ({ units: s.units.map((u) => (u.id === unitId ? updated : u)) }));
    fireAndForgetUnit(updated);
  },

  exportData: () => db.exportAll(),

  importData: async (data, mode) => {
    await db.importAll(data, mode);
    const [units, categoryLists] = await Promise.all([
      db.getAllUnits(),
      db.getAllCategoryLists(),
    ]);
    set({ units, categoryLists });
    // Push imported data to Firestore
    const exportedData = await db.exportAll();
    const { setStatus, setLastSynced } = useSyncStore.getState();
    setStatus('syncing');
    pushAllToFirestore(exportedData)
      .then(() => { setStatus('connected'); setLastSynced(new Date()); })
      .catch(() => { setStatus('error'); });
  },

  resetData: async () => {
    await db.resetAll();
    set({ units: [], categoryLists: [] });
    // Clear Firestore
    const { setStatus, setLastSynced } = useSyncStore.getState();
    setStatus('syncing');
    clearFirestore()
      .then(() => { setStatus('connected'); setLastSynced(new Date()); })
      .catch(() => { setStatus('error'); });
  },
}));
