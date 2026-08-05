import { GoogleAuthProvider, browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from '../firebase/firebase';
import { isBootstrapAdminEmail, normalizeEmail, primaryBootstrapAdminEmail } from '../config/adminConfig';

const authMessages = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'La contraseña no es correcta.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos antes de volver a intentar.',
  'auth/popup-closed-by-user': 'La ventana de Google se cerró antes de completar el ingreso.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase Authentication.',
  'auth/network-request-failed': 'No se pudo conectar con Firebase. Revisa tu conexión.',
};

export function friendlyAuthError(error) {
  return authMessages[error?.code] || error?.message || 'No se pudo completar el inicio de sesión.';
}

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

export async function ensureBootstrapAdminDocument(user) {
  if (!firebaseEnabled || !user?.uid || normalizeEmail(user.email) !== primaryBootstrapAdminEmail) return { ok: false, reason: 'not-bootstrap' };
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const base = { name: user.displayName || 'Norvin García', email: primaryBootstrapAdminEmail, role: 'admin', active: true, updatedAt: serverTimestamp() };
    await setDoc(ref, snap.exists() ? base : { ...base, createdAt: serverTimestamp() }, { merge: true });
    return { ok: true, reason: snap.exists() ? 'updated' : 'created' };
  } catch (error) {
    if (import.meta.env.DEV) console.warn('No se pudo garantizar el documento administrador bootstrap.', error);
    return { ok: false, reason: error?.code === 'permission-denied' ? 'permission-denied' : 'write-failed', error };
  }
}

export async function getAdminAccess(user) {
  if (!user) return { allowed: false, source: 'none', reason: 'anonymous', profile: null };
  if (!firebaseEnabled) return { allowed: false, source: 'none', reason: 'firebase-disabled', profile: null };
  try {
    const userRef = doc(db, 'users', user.uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const profile = { id: snap.id, ...snap.data() };
      const allowed = profile.role === 'admin' && profile.active === true;
      return { allowed, source: allowed ? 'firestore' : 'none', reason: allowed ? 'admin-document' : 'inactive-or-not-admin', profile };
    }
    if (isBootstrapAdminEmail(user.email)) {
      const legacyRef = doc(db, 'users', primaryBootstrapAdminEmail);
      let legacyProfile = null;
      try {
        const legacySnap = await getDoc(legacyRef);
        if (legacySnap.exists()) legacyProfile = { id: legacySnap.id, ...legacySnap.data(), usesEmailDocumentId: true };
      } catch (legacyError) {
        if (import.meta.env.DEV) console.warn('No se pudo leer el documento administrador con correo como ID.', legacyError);
      }
      const write = await ensureBootstrapAdminDocument(user);
      return { allowed: true, source: 'bootstrap', reason: write.ok ? 'bootstrap-document-ensured' : write.reason, profile: legacyProfile, bootstrapWrite: write };
    }
    return { allowed: false, source: 'none', reason: 'missing-admin-document', profile: null };
  } catch (error) {
    if (import.meta.env.DEV) console.warn('Error verificando rol administrador.', error);
    return { allowed: false, source: 'none', reason: error?.code === 'permission-denied' ? 'permission-denied' : 'firestore-error', profile: null, error };
  }
}

export const isAdmin = getAdminAccess;
