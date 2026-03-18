import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  type Unsubscribe,
} from 'firebase/firestore';
import {
  ref,
  uploadString,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import { firestoreDb, storage } from './firebase';
import type { Unit, CategoryList, ExportData } from '../types';

// ─── Image handling ───

async function uploadImage(dataUrl: string, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  await uploadString(storageRef, dataUrl, 'data_url');
  return getDownloadURL(storageRef);
}

async function processUnitImages(unit: Unit): Promise<Unit> {
  const words = await Promise.all(
    unit.words.map(async (word) => {
      if (word.image && word.image.startsWith('data:')) {
        const url = await uploadImage(word.image, `images/words/${word.id}`);
        return { ...word, image: url };
      }
      return word;
    }),
  );
  return { ...unit, words };
}

async function processCategoryListImages(list: CategoryList): Promise<CategoryList> {
  const items = await Promise.all(
    list.items.map(async (item) => {
      if (item.image && item.image.startsWith('data:')) {
        const url = await uploadImage(item.image, `images/items/${item.id}`);
        return { ...item, image: url };
      }
      return item;
    }),
  );
  return { ...list, items };
}

// ─── Firestore CRUD ───

const unitsCol = () => collection(firestoreDb, 'units');
const categoryListsCol = () => collection(firestoreDb, 'categoryLists');

export async function syncUnitToFirestore(unit: Unit): Promise<void> {
  const processed = await processUnitImages(unit);
  await setDoc(doc(firestoreDb, 'units', unit.id), processed);
}

export async function syncCategoryListToFirestore(list: CategoryList): Promise<void> {
  const processed = await processCategoryListImages(list);
  await setDoc(doc(firestoreDb, 'categoryLists', list.id), processed);
}

export async function deleteUnitFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(firestoreDb, 'units', id));
  // Best-effort cleanup of word images
  try {
    const folderRef = ref(storage, 'images/words');
    const result = await listAll(folderRef);
    // We don't track which words belonged to this unit in storage,
    // so we skip per-unit cleanup — orphaned images are harmless.
    void result;
  } catch {
    // Storage cleanup is best-effort
  }
}

export async function deleteCategoryListFromFirestore(id: string): Promise<void> {
  await deleteDoc(doc(firestoreDb, 'categoryLists', id));
}

export async function pushAllToFirestore(data: ExportData): Promise<void> {
  // Process images for all units and category lists
  const [processedUnits, processedLists] = await Promise.all([
    Promise.all(data.units.map(processUnitImages)),
    Promise.all(data.categoryLists.map(processCategoryListImages)),
  ]);

  // Batch write (Firestore batches limited to 500 ops)
  const batchSize = 450;
  const allOps: Array<{ path: string; colName: string; data: Unit | CategoryList }> = [
    ...processedUnits.map((u) => ({ path: u.id, colName: 'units' as const, data: u })),
    ...processedLists.map((l) => ({ path: l.id, colName: 'categoryLists' as const, data: l })),
  ];

  for (let i = 0; i < allOps.length; i += batchSize) {
    const batch = writeBatch(firestoreDb);
    const chunk = allOps.slice(i, i + batchSize);
    for (const op of chunk) {
      batch.set(doc(firestoreDb, op.colName, op.path), op.data);
    }
    await batch.commit();
  }
}

export async function clearFirestore(): Promise<void> {
  // Delete all docs in both collections
  const [unitSnap, catSnap] = await Promise.all([
    getDocs(unitsCol()),
    getDocs(categoryListsCol()),
  ]);

  const allDocs = [...unitSnap.docs, ...catSnap.docs];
  const batchSize = 450;

  for (let i = 0; i < allDocs.length; i += batchSize) {
    const batch = writeBatch(firestoreDb);
    const chunk = allDocs.slice(i, i + batchSize);
    for (const d of chunk) {
      batch.delete(d.ref);
    }
    await batch.commit();
  }

  // Best-effort: clear all images from storage
  try {
    const imagesRef = ref(storage, 'images');
    const result = await listAll(imagesRef);
    // listAll returns prefixes (folders) and items (files)
    for (const prefix of result.prefixes) {
      const subResult = await listAll(prefix);
      await Promise.all(subResult.items.map((item) => deleteObject(item)));
    }
    await Promise.all(result.items.map((item) => deleteObject(item)));
  } catch {
    // Storage cleanup is best-effort
  }
}

// ─── Real-time listeners ───

export function subscribeToFirestore(
  onUpdate: (units: Unit[], categoryLists: CategoryList[]) => void,
): Unsubscribe {
  let latestUnits: Unit[] = [];
  let latestCategoryLists: CategoryList[] = [];
  let unitsReady = false;
  let categoryListsReady = false;

  function emit() {
    if (unitsReady && categoryListsReady) {
      onUpdate(latestUnits, latestCategoryLists);
    }
  }

  const unsubUnits = onSnapshot(unitsCol(), (snapshot) => {
    // Skip snapshots from our own local writes
    if (snapshot.metadata.hasPendingWrites) return;
    latestUnits = snapshot.docs.map((d) => d.data() as Unit);
    unitsReady = true;
    emit();
  });

  const unsubCats = onSnapshot(categoryListsCol(), (snapshot) => {
    if (snapshot.metadata.hasPendingWrites) return;
    latestCategoryLists = snapshot.docs.map((d) => d.data() as CategoryList);
    categoryListsReady = true;
    emit();
  });

  return () => {
    unsubUnits();
    unsubCats();
  };
}
