import { defaultBrandLogo } from '../content/defaultBrandLogo';

export const siteImages = {
  brandLogo: defaultBrandLogo,
  heroBackground: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
  // No se usa una persona predeterminada: Firebase debe proporcionar la imagen real del hero.
  heroPerson: '',
  aboutHome: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
  aboutPage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
  strategicBanner: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
  realEstateHero: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
  propertyOne: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
  propertyTwo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  propertyThree: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
};

// Alias temporales para componentes antiguos que todavía puedan usar estas claves.
siteImages.hero = siteImages.heroPerson;
siteImages.aboutAmy = siteImages.aboutHome;

export const siteImageSlots = [
  {
    key: 'brandLogo',
    label: 'Logo principal',
    shortLabel: 'Logo del navbar',
    description: 'Logo gráfico utilizado en la esquina superior izquierda de la navegación pública.',
    recommendation: 'PNG o WEBP con fondo transparente y formato horizontal. Recomendado: 1000 × 200 px aproximadamente.',
    preview: 'transparent',
  },
  {
    key: 'realEstateHero',
    label: 'Hero Bienes Raíces',
    shortLabel: 'Hero inmobiliario',
    description: 'Fotografía principal de Amy para la portada de la sección de Bienes Raíces.',
    recommendation: 'JPG, PNG o WEBP vertical. Recomendado: 1200 × 1500 px o superior.',
    preview: 'portrait',
  },
  {
    key: 'heroBackground',
    label: 'Portada Hero 1 — Fondo',
    shortLabel: 'Fondo del hero',
    description: 'Imagen panorámica que se muestra detrás de la persona en la portada principal.',
    recommendation: 'JPG o WEBP horizontal. Recomendado: 1920 × 1200 px o superior.',
    preview: 'background',
  },
  {
    key: 'heroPerson',
    label: 'Portada Hero 2 — Persona',
    shortLabel: 'Persona del hero',
    description: 'Imagen independiente que se superpone sobre el fondo del hero.',
    recommendation: 'PNG o WEBP con fondo transparente. Recomendado: 1000 × 1400 px o superior.',
    preview: 'transparent',
  },
  {
    key: 'aboutHome',
    label: 'Imagen Sobre mí — Inicio',
    shortLabel: 'Sobre mí en inicio',
    description: 'Fotografía utilizada en la sección “Sobre mí” de la página de inicio.',
    recommendation: 'JPG, PNG o WEBP vertical. Recomendado: 1000 × 1300 px.',
    preview: 'portrait',
  },
  {
    key: 'aboutPage',
    label: 'Imagen Sobre mí — Página interna',
    shortLabel: 'Sobre mí interna',
    description: 'Fotografía principal de la página completa “Sobre mí”.',
    recommendation: 'JPG, PNG o WEBP vertical. Recomendado: 1000 × 1300 px.',
    preview: 'portrait',
  },
  {
    key: 'strategicBanner',
    label: 'Fondo del banner estratégico',
    shortLabel: 'Banner estratégico',
    description: 'Imagen panorámica situada detrás del mensaje estratégico de la página de inicio.',
    recommendation: 'JPG o WEBP horizontal. Recomendado: 1920 × 900 px o superior.',
    preview: 'background',
  },
];

export const siteImageSlotKeys = new Set(siteImageSlots.map(({ key }) => key));
