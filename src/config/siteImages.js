import { defaultBrandLogo } from '../content/defaultBrandLogo';

export const siteImages = {
  favicon: '',
  brandLogo: defaultBrandLogo,
  heroBackground: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1800&q=85',
  // No se usa una persona predeterminada: Firebase debe proporcionar la imagen real del hero.
  heroPerson: '',
  aboutHome: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
  aboutPage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=85',
  aboutPhilosophy: '',
  signature: '',
  strategicBanner: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=85',
  realEstateHero: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=85',
  insuranceHero: '',
  propertyOne: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1000&q=80',
  propertyTwo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80',
  propertyThree: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80',
};

// Alias temporales para componentes antiguos que todavía puedan usar estas claves.
siteImages.hero = siteImages.heroPerson;
siteImages.aboutAmy = siteImages.aboutHome;

export const siteImageSlots = [
  {
    key: 'favicon',
    label: 'Favicon del sitio',
    shortLabel: 'Icono de la pestaña',
    description: 'Icono que aparece en la pestaña del navegador, favoritos y accesos directos. Se carga desde Firebase Storage y se aplica automáticamente en la web pública.',
    recommendation: 'PNG o WEBP cuadrado. Recomendado: 512 × 512 px, con el símbolo centrado y poco margen alrededor para que se distinga bien en tamaños pequeños.',
    preview: 'transparent',
  },
  {
    key: 'brandLogo',
    label: 'Logo principal',
    shortLabel: 'Nombre AMY BLANDON',
    description: 'Imagen utilizada únicamente para el nombre gráfico “AMY BLANDON” del navbar. El subtítulo se genera como texto desde la web y cambia de color según el fondo del navbar.',
    recommendation: 'Sube solo “AMY BLANDON”, sin el texto inferior. PNG o WEBP con fondo transparente y formato horizontal. Recomendado: 1400 × 280 px, con el nombre ocupando casi todo el lienzo y poco margen transparente.',
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
    key: 'insuranceHero',
    label: 'Hero Seguros',
    shortLabel: 'Hero de seguros',
    description: 'Fotografía principal utilizada en la portada de la página de Seguros. Si no se carga una imagen específica, la web utiliza temporalmente la fotografía de la página Sobre mí.',
    recommendation: 'JPG, PNG o WEBP vertical. Recomendado: 1200 × 1500 px o superior, con espacio alrededor del rostro para permitir el recorte responsive.',
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
    key: 'signature',
    label: 'Firma de Amy',
    shortLabel: 'Firma',
    description: 'Firma gráfica que aparece al final del bloque “Sobre mí” de la página de inicio y queda disponible para reutilizarla en otras secciones de la web.',
    recommendation: 'PNG o WEBP con fondo transparente. Recomendado: 1000 × 320 px, firma centrada y con poco margen transparente alrededor.',
    preview: 'transparent',
  },
  {
    key: 'aboutPage',
    label: 'Imagen Sobre mí — Página interna',
    shortLabel: 'Sobre mí interna',
    description: 'Fotografía principal de la nueva portada de la página completa “Sobre mí”.',
    recommendation: 'JPG, PNG o WEBP vertical. Recomendado: 1000 × 1300 px o superior.',
    preview: 'portrait',
  },
  {
    key: 'aboutPhilosophy',
    label: 'Imagen Sobre mí — Mi filosofía',
    shortLabel: 'Foto de filosofía',
    description: 'Segunda fotografía, más natural, utilizada junto al bloque “Mi filosofía”. Ideal para la fotografía de Amy con la tablet.',
    recommendation: 'JPG, PNG o WEBP vertical. Recomendado: 1000 × 1300 px o superior. Si no se carga, se reutiliza temporalmente la imagen “Sobre mí — Inicio”.',
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
