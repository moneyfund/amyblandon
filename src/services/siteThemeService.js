import { doc, onSnapshot, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';
import { defaultSiteTheme, THEME_SCHEMA_VERSION } from '../config/siteTheme';

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

const LEGACY_AMY_CLASSIC = {
  primaryColor: '#042B3A',
  accentColor: '#C99A44',
  surfaceColor: '#F4F6F4',
  navbarBackground: '#FFFFFF',
  navbarText: '#042B3A',
  footerBackground: '#05090B',
  footerText: '#FFFFFF',
};

function isLegacyAmyClassic(data = {}) {
  if (data.preset !== 'amy-classic') return false;
  return colorKeys.every((key) => String(data[key] || '').toUpperCase() === LEGACY_AMY_CLASSIC[key]);
}

export function normalizeSiteTheme(data = {}) {
  const source = isLegacyAmyClassic(data) ? defaultSiteTheme : data;
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
