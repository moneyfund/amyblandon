import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig, hasRequiredFirebaseConfig } from './firebaseConfig';

export const firebaseEnabled = hasRequiredFirebaseConfig;
export const firebaseProjectId = firebaseConfig.projectId || '';
export const app = firebaseEnabled ? (getApps().length ? getApp() : initializeApp(firebaseConfig)) : undefined;
export const auth = firebaseEnabled ? getAuth(app) : undefined;
export const db = firebaseEnabled ? getFirestore(app) : undefined;
export const storage = firebaseEnabled ? getStorage(app) : undefined;
