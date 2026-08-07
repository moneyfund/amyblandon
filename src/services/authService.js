import { GoogleAuthProvider, browserLocalPersistence, onAuthStateChanged, setPersistence, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db, firebaseEnabled } from '../firebase/firebase';
import { isBootstrapAdminEmail, normalizeEmail } from '../config/adminConfig';

const authMessages = {
  'auth/invalid-credential': 'El correo o la contraseña no son correctos.',
  'auth/user-not-found': 'No existe una cuenta con este correo.',
  'auth/wrong-password': 'La contraseña no es correcta.',
  'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos antes de volver a intentar.',
  'auth/popup-closed-by-user': 'La ventana de Google se cerró antes de completar el ingreso.',
  'auth/unauthorized-domain': 'Este dominio no está autorizado en Firebase Authentication.',
  'auth/operation-not-allowed': 'Este método de acceso todavía no está habilitado en Firebase Authentication.',
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

function bootstrapDisplayName(user) {
  if (user?.displayName) return user.displayName;
  return normalizeEmail(user?.email) === 'amyblandon171@gmail.com' ? 'Amy Blandón' : 'Norvin García';
}

export async function ensureBootstrapAdminDocument(user) {
  if (!firebaseEnabled || !user?.uid || !isBootstrapAdminEmail(user.email)) return { ok: false, reason: 'not-bootstrap' };
  try {
    const email = normalizeEmail(user.email);
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const base = { name: bootstrapDisplayName(user), email, role: 'admin', active: true, updatedAt: serverTimestamp() };
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

  const bootstrapAdmin = isBootstrapAdminEmail(user.email);
  const normalizedUserEmail = normalizeEmail(user.email);
  const userRef = doc(db, 'users', user.uid);

  // Los administradores bootstrap se validan primero por la cuenta autenticada.
  // Esto evita que unas reglas de Firestore todavía no publicadas bloqueen el acceso inicial al panel.
  if (bootstrapAdmin) {
    let profile = null;
    let readError = null;

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        profile = { id: snap.id, ...snap.data() };
        const explicitlyAllowed = profile.role === 'admin' && profile.active === true;
        const explicitlyRevoked = profile.active === false || (profile.role && profile.role !== 'admin');

        if (explicitlyAllowed) {
          return { allowed: true, source: 'firestore', reason: 'admin-document', profile };
        }

        // Un documento existente permite revocar expresamente incluso a un correo bootstrap.
        if (explicitlyRevoked) {
          return { allowed: false, source: 'none', reason: 'inactive-or-not-admin', profile };
        }
      }
    } catch (error) {
      readError = error;
      if (import.meta.env.DEV) console.warn('No se pudo leer inicialmente el perfil bootstrap; se usará la autorización temporal.', error);
    }

    let legacyProfile = null;
    try {
      const legacyRef = doc(db, 'users', normalizedUserEmail);
      const legacySnap = await getDoc(legacyRef);
      if (legacySnap.exists()) legacyProfile = { id: legacySnap.id, ...legacySnap.data(), usesEmailDocumentId: true };
    } catch (legacyError) {
      if (import.meta.env.DEV) console.warn('No se pudo leer el documento administrador con correo como ID.', legacyError);
    }

    const write = await ensureBootstrapAdminDocument(user);
    return {
      allowed: true,
      source: 'bootstrap',
      reason: write.ok
        ? 'bootstrap-document-ensured'
        : (readError?.code === 'permission-denied' || write.reason === 'permission-denied'
          ? 'bootstrap-authorized-rules-pending'
          : write.reason),
      profile: profile || legacyProfile || {
        id: user.uid,
        name: bootstrapDisplayName(user),
        email: normalizedUserEmail,
        role: 'admin',
        active: true,
        temporaryBootstrap: true,
      },
      bootstrapWrite: write,
      readError,
    };
  }

  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      const profile = { id: snap.id, ...snap.data() };
      const allowed = profile.role === 'admin' && profile.active === true;
      return { allowed, source: allowed ? 'firestore' : 'none', reason: allowed ? 'admin-document' : 'inactive-or-not-admin', profile };
    }
    return { allowed: false, source: 'none', reason: 'missing-admin-document', profile: null };
  } catch (error) {
    if (import.meta.env.DEV) console.warn('Error verificando rol administrador.', error);
    return { allowed: false, source: 'none', reason: error?.code === 'permission-denied' ? 'permission-denied' : 'firestore-error', profile: null, error };
  }
}

export const isAdmin = getAdminAccess;
