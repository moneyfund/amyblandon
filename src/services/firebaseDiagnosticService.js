import { doc, getDoc } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import { auth, db, firebaseEnabled, firebaseProjectId, storage } from '../firebase/firebase';
import { getAdminAccess } from './authService';
import { normalizeEmail, primaryBootstrapAdminEmail } from '../config/adminConfig';

export async function runFirebaseDiagnostic(user) {
  const result = { projectId: firebaseProjectId, appConnected: firebaseEnabled, authAvailable: Boolean(auth), firestore: db ? 'Disponible' : 'No disponible', storage: storage ? 'Disponible' : 'No habilitado', userEmail: user?.email || '', uid: user?.uid || '', role: 'Sin autorización', userDocument: 'No consultado', permissionError: '', legacyEmailDocument: false, migrationMessage: '' };
  if (storage) { try { ref(storage, 'diagnostics/ping'); } catch { result.storage = 'No habilitado'; } }
  if (!firebaseEnabled || !db) return result;
  if (!user?.uid) return { ...result, userDocument: 'Sin usuario autenticado' };
  const access = await getAdminAccess(user);
  result.role = access.allowed ? 'Administrador' : 'Sin autorización';
  if (access.reason === 'permission-denied') { result.firestore = 'Error de permisos'; result.permissionError = 'Firestore rechazó la lectura. Publica las reglas incluidas en este repositorio.'; return result; }
  try {
    const snap = await getDoc(doc(db, 'users', user.uid));
    result.userDocument = snap.exists() ? 'Existe users/{uid}' : 'No existe users/{uid}';
    if (!snap.exists() && normalizeEmail(user.email) === primaryBootstrapAdminEmail) {
      const legacy = await getDoc(doc(db, 'users', primaryBootstrapAdminEmail));
      if (legacy.exists() && legacy.data()?.role === 'admin' && legacy.data()?.active === true) {
        result.legacyEmailDocument = true;
        result.migrationMessage = 'El documento administrativo utiliza el correo como identificador. Debe migrarse al UID de Authentication.';
      }
    }
  } catch (error) {
    result.firestore = error?.code === 'permission-denied' ? 'Error de permisos' : 'Error de lectura';
    result.permissionError = error?.code === 'permission-denied' ? 'Firestore rechazó la lectura. Publica las reglas de Firestore.' : 'No se pudo leer Firestore.';
  }
  return result;
}
