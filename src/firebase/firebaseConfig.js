export const defaultFirebaseConfig = {
  apiKey: 'AIzaSyA--wbS6W7RnYwNJmF289yGA2J2TFtAVsM',
  authDomain: 'amyblandon.firebaseapp.com',
  projectId: 'amyblandon',
  storageBucket: 'amyblandon.firebasestorage.app',
  messagingSenderId: '853574594732',
  appId: '1:853574594732:web:3286ae01dc934c94fc2f09',
  measurementId: 'G-DXWWNZXZX8',
};

// La web pública y el panel se sirven desde varios hosts (Vercel, GitHub Pages
// y el dominio propio). Todos deben autenticarse contra el MISMO proyecto de
// Firebase. No permitimos que variables VITE_FIREBASE_* de un proveedor de
// despliegue sustituyan silenciosamente esta configuración y apunten Auth a
// otro proyecto con una lista distinta de dominios autorizados.
export const firebaseConfig = { ...defaultFirebaseConfig };

export const requiredFirebaseKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
export const hasRequiredFirebaseConfig = requiredFirebaseKeys.every((key) => typeof firebaseConfig[key] === 'string' && firebaseConfig[key].trim().length > 0);
