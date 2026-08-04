import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';

export async function getUserProfile(uid) {
  if (!firebaseEnabled || !uid) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function upsertUserProfile(uid, data) {
  if (!firebaseEnabled || !uid) return null;
  return setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
