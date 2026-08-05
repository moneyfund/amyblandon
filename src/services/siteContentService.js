import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from '../firebase/firebase';

export const defaultSiteContent = {
  home: {
    heroTitle: 'Decisiones inmobiliarias con estrategia y confianza',
    heroSubtitle: 'Te acompaño a comprar, vender e invertir con claridad.',
    heroLabel: 'Bienes raíces',
    aboutTitle: 'Sobre Amy Blandón',
    aboutText: 'Asesoría inmobiliaria, seguros e inversiones con visión patrimonial.',
    strategicTitle: 'Construyamos tu próxima decisión con estructura',
    strategicLabel: 'Estrategia patrimonial',
  },
  about: {
    title: 'Sobre Mi',
    subtitle: 'Asesora inmobiliaria, seguros e inversiones',
    biography: 'Mi propósito es acompañarte a tomar decisiones que te den tranquilidad hoy y construyan tu futuro mañana.',
    mission: 'Guiar decisiones inmobiliarias responsables.',
    values: 'Confianza, claridad, estrategia y servicio.',
  },
  contact: {
    phone: '+505 8832 4439',
    whatsapp: '+505 8832 4439',
    email: 'info@amyblandon.com',
    address: 'Matagalpa, Nicaragua',
    schedule: 'Lunes a viernes',
    facebook: '',
    instagram: '',
    tiktok: '',
  },
};

export async function getSiteContent(section) {
  if (!firebaseEnabled) return defaultSiteContent[section];
  const snap = await getDoc(doc(db, 'siteContent', section));
  return { ...defaultSiteContent[section], ...(snap.exists() ? snap.data() : {}) };
}

export async function saveSiteContent(section, data) {
  if (!firebaseEnabled) return data;
  return setDoc(doc(db, 'siteContent', section), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
