import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { demoProperties } from '../data/demoData';
import { deleteStorageFile } from './storageService';

const c = 'properties';
const normalize = (d) => ({ ...d, images: d.images || [], features: d.features || [], services: d.services || [], publicationStatus: d.publicationStatus || (d.published ? 'published' : 'draft'), status: d.status || 'available' });

export async function getProperties({ admin = false } = {}) {
  if (!firebaseEnabled) return demoProperties.map(normalize);
  const constraints = admin ? [orderBy('updatedAt', 'desc')] : [where('publicationStatus', '==', 'published'), orderBy('displayOrder', 'asc')];
  const s = await getDocs(query(collection(db, c), ...constraints));
  return s.docs.map((d) => normalize({ id: d.id, ...d.data() }));
}
export async function getProperty(id) {
  if (!firebaseEnabled) return demoProperties.find((p) => p.id === id);
  const snap = await getDoc(doc(db, c, id));
  return snap.exists() ? normalize({ id: snap.id, ...snap.data() }) : null;
}
export async function saveProperty(data, id, uid) {
  const payload = { ...data, updatedBy: uid || data.updatedBy || '', updatedAt: serverTimestamp() };
  if (payload.publicationStatus === 'published' && !payload.publishedAt) payload.publishedAt = serverTimestamp();
  if (!firebaseEnabled) return { id: id || crypto.randomUUID(), ...payload };
  if (id) return updateDoc(doc(db, c, id), payload);
  return addDoc(collection(db, c), { ...payload, createdBy: uid || '', createdAt: serverTimestamp() });
}
export async function updatePropertyStatus(id, changes, uid) {
  return saveProperty(changes, id, uid);
}
export async function duplicateProperty(property, uid) {
  const { id, createdAt, updatedAt, publishedAt, ...copy } = property;
  return saveProperty({ ...copy, title: `${property.title} (copia)`, slug: `${property.slug || property.title}-copia-${Date.now()}`, publicationStatus: 'draft', status: 'available', featured: false }, null, uid);
}
export async function deleteProperty(id, images = []) {
  if (firebaseEnabled) await Promise.all((images || []).map((img) => deleteStorageFile(img.path).catch(() => null)));
  if (!firebaseEnabled) return true;
  return deleteDoc(doc(db, c, id));
}
