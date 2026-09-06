import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';

const COLLECTION = 'siteContent';
const PREFIX = 'sharedList_';

const timestampValue = (value) => {
  if (value?.toMillis) return value.toMillis();
  if (value instanceof Date) return value.getTime();
  return Number(value) || 0;
};

const makeToken = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID().replace(/-/g, '').slice(0, 24);
  }

  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
};

const docIdFor = (token) => `${PREFIX}${String(token || '').trim()}`;

export const sharedListUrl = (token) => {
  const safeToken = encodeURIComponent(String(token || '').trim());
  if (typeof window === 'undefined') return `/seleccion/${safeToken}`;

  if (window.location.hostname.endsWith('github.io')) {
    return `${window.location.origin}${import.meta.env.BASE_URL}#/seleccion/${safeToken}`;
  }

  return `${window.location.origin}/seleccion/${safeToken}`;
};

export async function createSharedList({ listName, clientName, propertyIds }, uid = '') {
  const token = makeToken();
  const normalizedIds = [...new Set((propertyIds || []).filter(Boolean))];
  const payload = {
    contentType: 'sharedList',
    token,
    listName: String(listName || '').trim(),
    clientName: String(clientName || '').trim(),
    propertyIds: normalizedIds,
    active: true,
    createdBy: uid || '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (!firebaseEnabled) return { ...payload, token };

  await setDoc(doc(db, COLLECTION, docIdFor(token)), payload);
  return { ...payload, token };
}

export async function getSharedList(token) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken || !firebaseEnabled) return null;

  const snapshot = await getDoc(doc(db, COLLECTION, docIdFor(cleanToken)));
  if (!snapshot.exists()) return null;

  const data = snapshot.data();
  if (data?.contentType !== 'sharedList' || data?.active === false) return null;

  return { id: snapshot.id, ...data, token: data.token || cleanToken };
}

export async function listSharedLists() {
  if (!firebaseEnabled) return [];

  const snapshot = await getDocs(query(
    collection(db, COLLECTION),
    where('contentType', '==', 'sharedList'),
  ));

  return snapshot.docs
    .map((item) => ({ id: item.id, ...item.data() }))
    .sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
}

export async function deleteSharedList(token) {
  const cleanToken = String(token || '').trim();
  if (!cleanToken || !firebaseEnabled) return true;
  await deleteDoc(doc(db, COLLECTION, docIdFor(cleanToken)));
  return true;
}
