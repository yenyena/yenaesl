import { openDB, type IDBPDatabase } from 'idb';
import type { Unit, CategoryList, ExportData } from '../types';

const DB_NAME = 'esl-games-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase> | null = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const unitStore = db.createObjectStore('units', { keyPath: 'id' });
        unitStore.createIndex('month', 'month');
        unitStore.createIndex('week', 'week');
        unitStore.createIndex('month-week', ['month', 'week']);

        db.createObjectStore('categoryLists', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

// --- Units ---

export async function getAllUnits(): Promise<Unit[]> {
  const db = await getDb();
  return db.getAll('units');
}

export async function getUnit(id: string): Promise<Unit | undefined> {
  const db = await getDb();
  return db.get('units', id);
}

export async function getUnitsByMonth(month: string): Promise<Unit[]> {
  const db = await getDb();
  return db.getAllFromIndex('units', 'month', month);
}

export async function getUnitByMonthWeek(month: string, week: number): Promise<Unit | undefined> {
  const db = await getDb();
  return db.getFromIndex('units', 'month-week', [month, week]);
}

export async function saveUnit(unit: Unit): Promise<void> {
  const db = await getDb();
  await db.put('units', unit);
}

export async function deleteUnit(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('units', id);
}

// --- Words (read-modify-write on unit) ---

export async function addWord(unitId: string, word: Unit['words'][number]): Promise<Unit> {
  const db = await getDb();
  const unit = await db.get('units', unitId);
  if (!unit) throw new Error(`Unit ${unitId} not found`);
  unit.words.push(word);
  await db.put('units', unit);
  return unit;
}

export async function updateWord(unitId: string, wordId: string, updates: Partial<Unit['words'][number]>): Promise<Unit> {
  const db = await getDb();
  const unit = await db.get('units', unitId);
  if (!unit) throw new Error(`Unit ${unitId} not found`);
  const idx = unit.words.findIndex((w: Unit['words'][number]) => w.id === wordId);
  if (idx === -1) throw new Error(`Word ${wordId} not found`);
  unit.words[idx] = { ...unit.words[idx], ...updates };
  await db.put('units', unit);
  return unit;
}

export async function deleteWord(unitId: string, wordId: string): Promise<Unit> {
  const db = await getDb();
  const unit = await db.get('units', unitId);
  if (!unit) throw new Error(`Unit ${unitId} not found`);
  unit.words = unit.words.filter((w: Unit['words'][number]) => w.id !== wordId);
  await db.put('units', unit);
  return unit;
}

// --- Category Lists ---

export async function getAllCategoryLists(): Promise<CategoryList[]> {
  const db = await getDb();
  return db.getAll('categoryLists');
}

export async function getCategoryList(id: string): Promise<CategoryList | undefined> {
  const db = await getDb();
  return db.get('categoryLists', id);
}

export async function saveCategoryList(list: CategoryList): Promise<void> {
  const db = await getDb();
  await db.put('categoryLists', list);
}

export async function deleteCategoryList(id: string): Promise<void> {
  const db = await getDb();
  // Remove references from all units
  const units = await db.getAll('units');
  const tx = db.transaction('units', 'readwrite');
  for (const unit of units) {
    if (unit.oddOneOutLists.includes(id)) {
      unit.oddOneOutLists = unit.oddOneOutLists.filter((lid: string) => lid !== id);
      await tx.store.put(unit);
    }
  }
  await tx.done;
  await db.delete('categoryLists', id);
}

// --- Category Items (read-modify-write) ---

export async function addCategoryItem(listId: string, item: CategoryList['items'][number]): Promise<CategoryList> {
  const db = await getDb();
  const list = await db.get('categoryLists', listId);
  if (!list) throw new Error(`CategoryList ${listId} not found`);
  list.items.push(item);
  await db.put('categoryLists', list);
  return list;
}

export async function updateCategoryItem(listId: string, itemId: string, updates: Partial<CategoryList['items'][number]>): Promise<CategoryList> {
  const db = await getDb();
  const list = await db.get('categoryLists', listId);
  if (!list) throw new Error(`CategoryList ${listId} not found`);
  const idx = list.items.findIndex((i: CategoryList['items'][number]) => i.id === itemId);
  if (idx === -1) throw new Error(`CategoryItem ${itemId} not found`);
  list.items[idx] = { ...list.items[idx], ...updates };
  await db.put('categoryLists', list);
  return list;
}

export async function deleteCategoryItem(listId: string, itemId: string): Promise<CategoryList> {
  const db = await getDb();
  const list = await db.get('categoryLists', listId);
  if (!list) throw new Error(`CategoryList ${listId} not found`);
  list.items = list.items.filter((i: CategoryList['items'][number]) => i.id !== itemId);
  await db.put('categoryLists', list);
  return list;
}

// --- Bulk operations ---

export async function exportAll(): Promise<ExportData> {
  const [units, categoryLists] = await Promise.all([
    getAllUnits(),
    getAllCategoryLists(),
  ]);
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    units,
    categoryLists,
  };
}

export async function importAll(data: ExportData, mode: 'merge' | 'replace'): Promise<void> {
  const db = await getDb();
  if (mode === 'replace') {
    await db.clear('units');
    await db.clear('categoryLists');
  }
  const txUnits = db.transaction('units', 'readwrite');
  for (const unit of data.units) {
    await txUnits.store.put(unit);
  }
  await txUnits.done;

  const txCats = db.transaction('categoryLists', 'readwrite');
  for (const list of data.categoryLists) {
    await txCats.store.put(list);
  }
  await txCats.done;
}

export async function resetAll(): Promise<void> {
  const db = await getDb();
  await db.clear('units');
  await db.clear('categoryLists');
}

// --- Validation ---

export function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (typeof d.version !== 'number') return false;
  if (typeof d.exportedAt !== 'string') return false;
  if (!Array.isArray(d.units)) return false;
  if (!Array.isArray(d.categoryLists)) return false;
  return true;
}
