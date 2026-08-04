import { GoogleAuthProvider, browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth, firebaseEnabled } from '../firebase/firebase';
import { getUserProfile } from './userService';

const unavailable = () => Promise.reject(new Error('Firebase no está configurado. El acceso administrativo permanece protegido.'));

export async function loginEmail(email, password) {
  if (!firebaseEnabled) return unavailable();
  await setPersistence(auth, browserLocalPersistence);
  return signInWithEmailAndPassword(auth, email, password);
}

export async function loginGoogle() {
  if (!firebaseEnabled) return unavailable();
  await setPersistence(auth, browserLocalPersistence);
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export const logout = () => (firebaseEnabled ? signOut(auth) : Promise.resolve());
export const listenAuth = (cb) => {
  if (!firebaseEnabled) { cb(null); return () => {}; }
  return onAuthStateChanged(auth, cb);
};

export async function getAdminAccess(user) {
  if (!user) return { allowed: false, profile: null, reason: 'anonymous' };
  const profile = await getUserProfile(user.uid);
  const allowed = profile?.role === 'admin' && profile?.active === true;
  return { allowed, profile, reason: allowed ? 'allowed' : 'unauthorized' };
}
