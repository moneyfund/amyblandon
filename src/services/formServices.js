import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { createInquiry } from './inquiryService';
export async function submitToCollection(name, data) {
  if (name === 'contacts' || name === 'inquiries') return createInquiry({ ...data, source: name });
  if (!firebaseEnabled) return { id: crypto.randomUUID(), ...data };
  return addDoc(collection(db, name), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
