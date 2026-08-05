export const defaultFirebaseConfig = {
  apiKey: 'AIzaSyA--wbS6W7RnYwNJmF289yGA2J2TFtAVsM',
  authDomain: 'amyblandon.firebaseapp.com',
  projectId: 'amyblandon',
  storageBucket: 'amyblandon.firebasestorage.app',
  messagingSenderId: '853574594732',
  appId: '1:853574594732:web:3286ae01dc934c94fc2f09',
  measurementId: 'G-DXWWNZXZX8',
};

const env = import.meta.env;
const preferEnv = (key, fallback) => {
  const value = env[key];
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
};

export const firebaseConfig = {
  apiKey: preferEnv('VITE_FIREBASE_API_KEY', defaultFirebaseConfig.apiKey),
  authDomain: preferEnv('VITE_FIREBASE_AUTH_DOMAIN', defaultFirebaseConfig.authDomain),
  projectId: preferEnv('VITE_FIREBASE_PROJECT_ID', defaultFirebaseConfig.projectId),
  storageBucket: preferEnv('VITE_FIREBASE_STORAGE_BUCKET', defaultFirebaseConfig.storageBucket),
  messagingSenderId: preferEnv('VITE_FIREBASE_MESSAGING_SENDER_ID', defaultFirebaseConfig.messagingSenderId),
  appId: preferEnv('VITE_FIREBASE_APP_ID', defaultFirebaseConfig.appId),
  measurementId: preferEnv('VITE_FIREBASE_MEASUREMENT_ID', defaultFirebaseConfig.measurementId),
};

export const requiredFirebaseKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
export const hasRequiredFirebaseConfig = requiredFirebaseKeys.every((key) => typeof firebaseConfig[key] === 'string' && firebaseConfig[key].trim().length > 0);
