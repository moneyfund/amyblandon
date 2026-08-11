import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { defaultSiteTheme, THEME_SCHEMA_VERSION } from '../config/siteTheme';

const THEME_DOCUMENT = ['siteContent', 'theme'];
const HEX_PATTERN = /^#[0-9A-F]{6}$/i;
const colorKeys = [
  'primaryColor',
  'heroBackground',
  'accentColor',
  'surfaceColor',
  'navbarBackground',
  'navbarText',
  'footerBackground',
  'footerText',
];

function migrateTheme(data = {}) {
  const schemaVersion = Number(data.schemaVersion || 1);
  const preset = String(data.preset || '');

  // El preset oficial debe reproducir siempre la referencia de amyblandon.com.
  // Si Amy modifica cualquier color desde el panel, el editor cambia el preset a `custom`,
  // por lo que sus cambios manuales siguen respetándose normalmente.
  if (preset === 'amy-original' || preset === 'amy-classic') {
    return { ...defaultSiteTheme };
  }

  if (schemaVersion < THEME_SCHEMA_VERSION) {
    return {
      ...data,
      schemaVersion: THEME_SCHEMA_VERSION,
      heroBackground: data.heroBackground || data.footerBackground || data.primaryColor || defaultSiteTheme.heroBackground,
    };
  }

  return data;
}

export function normalizeSiteTheme(data = {}) {
  const source = migrateTheme(data);
  const theme = {
    schemaVersion: THEME_SCHEMA_VERSION,
    preset: String(source.preset || defaultSiteTheme.preset),
  };

  colorKeys.forEach((key) => {
    const value = String(source[key] || defaultSiteTheme[key]).toUpperCase();
    theme[key] = HEX_PATTERN.test(value) ? value : defaultSiteTheme[key];
  });

  if (theme.preset === 'amy-classic') theme.preset = 'amy-original';
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
