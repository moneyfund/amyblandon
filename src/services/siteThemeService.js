import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { defaultSiteTheme } from '../config/siteTheme';

const THEME_DOCUMENT = ['siteContent', 'theme'];
const HEX_PATTERN = /^#[0-9A-F]{6}$/i;
const colorKeys = [
  'primaryColor',
  'accentColor',
  'surfaceColor',
  'navbarBackground',
  'navbarText',
  'footerBackground',
  'footerText',
];

export function normalizeSiteTheme(data = {}) {
  const theme = { ...defaultSiteTheme, ...data };
  colorKeys.forEach((key) => {
    if (!HEX_PATTERN.test(String(theme[key] || ''))) theme[key] = defaultSiteTheme[key];
    else theme[key] = theme[key].toUpperCase();
  });
  theme.preset = String(theme.preset || 'custom');
  return theme;
}

export function subscribeSiteTheme(onTheme, onError) {
  if (!firebaseEnabled) {
    onTheme(defaultSiteTheme);
    return () => {};
  }

  return onSnapshot(
    doc(db, ...THEME_DOCUMENT),
    (snapshot) => onTheme(normalizeSiteTheme(snapshot.exists() ? snapshot.data() : {})),
    (error) => onError?.(error),
  );
}

export async function saveSiteTheme(theme) {
  const normalized = normalizeSiteTheme(theme);
  if (!firebaseEnabled) return normalized;

  await setDoc(
    doc(db, ...THEME_DOCUMENT),
    { ...normalized, updatedAt: serverTimestamp() },
    { merge: true },
  );
  return normalized;
}
