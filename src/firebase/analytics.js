import { app, firebaseEnabled } from './firebase';

export async function initOptionalAnalytics() {
  if (!firebaseEnabled || typeof window === 'undefined') return null;
  try {
    const { getAnalytics, isSupported } = await import('firebase/analytics');
    return (await isSupported()) ? getAnalytics(app) : null;
  } catch (error) {
    if (import.meta.env.DEV) console.warn('Firebase Analytics no pudo iniciar.', error);
    return null;
  }
}
