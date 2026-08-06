import { deleteField, doc, getDoc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { siteImages, siteImageSlotKeys, siteImageSlots } from '../config/siteImages';

const DOCUMENT_PATH = ['siteContent', 'images'];

function assertValidSlot(key) {
  if (!siteImageSlotKeys.has(key)) throw new Error('El espacio de imagen solicitado no existe.');
}

function defaultRecord(key) {
  return {
    url: siteImages[key],
    path: '',
    name: '',
    type: '',
    size: 0,
    isDefault: true,
  };
}

function normalizeRecord(key, value) {
  if (!value?.url) return defaultRecord(key);
  return {
    url: value.url,
    path: value.path || '',
    name: value.name || '',
    type: value.type || '',
    size: Number(value.size || 0),
    updatedBy: value.updatedBy || '',
    isDefault: false,
  };
}

export function normalizeSiteImageRecords(data = {}) {
  return siteImageSlots.reduce((records, { key }) => {
    records[key] = normalizeRecord(key, data[key]);
    return records;
  }, {});
}

export function recordsToUrls(records) {
  return Object.fromEntries(siteImageSlots.map(({ key }) => [key, records[key]?.url || siteImages[key]]));
}

export async function getSiteImageRecords() {
  if (!firebaseEnabled) return normalizeSiteImageRecords();
  const snapshot = await getDoc(doc(db, ...DOCUMENT_PATH));
  return normalizeSiteImageRecords(snapshot.exists() ? snapshot.data() : {});
}

export function subscribeSiteImages(onImages, onError) {
  if (!firebaseEnabled) {
    onImages({ ...siteImages });
    return () => {};
  }

  return onSnapshot(
    doc(db, ...DOCUMENT_PATH),
    (snapshot) => onImages(recordsToUrls(normalizeSiteImageRecords(snapshot.exists() ? snapshot.data() : {}))),
    (error) => {
      // El proveedor decide si conserva la última imagen válida o usa los valores predeterminados.
      onError?.(error);
    },
  );
}

export async function saveSiteImageSlot(key, image) {
  assertValidSlot(key);
  if (!image?.url) throw new Error('La imagen no contiene una URL válida.');
  if (!firebaseEnabled) return image;

  const record = {
    url: image.url,
    path: image.path || '',
    name: image.name || '',
    type: image.type || '',
    size: Number(image.size || 0),
    updatedBy: image.updatedBy || '',
    updatedAt: serverTimestamp(),
  };

  await setDoc(
    doc(db, ...DOCUMENT_PATH),
    { [key]: record, updatedAt: serverTimestamp() },
    { merge: true },
  );

  return normalizeRecord(key, record);
}

export async function resetSiteImageSlot(key) {
  assertValidSlot(key);
  if (firebaseEnabled) {
    await setDoc(
      doc(db, ...DOCUMENT_PATH),
      { [key]: deleteField(), updatedAt: serverTimestamp() },
      { merge: true },
    );
  }
  return defaultRecord(key);
}
