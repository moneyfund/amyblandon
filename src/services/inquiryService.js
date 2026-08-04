import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';

const col = 'inquiries';
export async function createInquiry(data) {
  const payload = { ...data, status: 'new', createdAt: serverTimestamp(), updatedAt: serverTimestamp() };
  if (!firebaseEnabled) return { id: crypto.randomUUID(), ...payload };
  return addDoc(collection(db, col), payload);
}
export async function getInquiries() {
  if (!firebaseEnabled) return [];
  const snap = await getDocs(query(collection(db, col), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}
export async function updateInquiryStatus(id, status, notes) {
  if (!firebaseEnabled) return true;
  return updateDoc(doc(db, col, id), { status, ...(notes !== undefined ? { notes } : {}), updatedAt: serverTimestamp() });
}
