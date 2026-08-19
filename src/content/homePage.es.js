import { siteImages } from '../config/siteImages';

export const amyContact = {
  phone: '+505 8832 4439',
  email: 'asesoria@amyblandon.com',
  location: 'Matagalpa, Nicaragua',
  whatsappMessage: 'Hola Amy, me gustaría recibir asesoría sobre bienes raíces, inversiones o seguros.'
};

export const homePageContent = {
  seo: {
    title: 'Amy Blandon | Asesora Inmobiliaria, Seguros e Inversiones',
    description: 'Asesoría en bienes raíces, inversiones y seguros para proteger, construir y hacer crecer tu patrimonio con seguridad y visión de futuro.'
  },
  nav: [
    { label: 'Inicio', to: '/' },
    { label: 'Sobre mí', to: '/sobre-mi' },
    { label: 'Bienes raíces', to: '/propiedades' },
    { label: 'Seguros', to: '/seguros' },
    { label: 'Contacto', to: '/contacto' }
  ],
  hero: {
    eyebrow: 'Estrategia – Experiencia – Resultados',
    titleLines: ['Tu próxima', 'inversión,', 'comienza con', 'una buena', 'decisión'],
    plainTitle: 'Tu próxima inversión, comienza con una buena decisión',
    text: 'Te acompaño a tomar decisiones inteligentes que te permitan proteger, construir y multiplicar tu patrimonio con seguridad y visión de futuro',
    button: 'Ir a WhatsApp'
  },
  servicesHeader: {
    kicker: 'SOLUCIONES INTEGRALES',
    title: 'Para tu crecimiento financiero'
  },
  services: [
    { key: 'realEstate', title: 'Bienes Raíces', text: 'Encuentra oportunidades inmobiliarias estratégicas que generen valor, estabilidad y crecimiento en el tiempo. Te asesoro en cada paso para que tomes decisiones seguras y rentables.' },
    { key: 'insurance', title: 'Seguros', text: 'Protege lo que has construido con soluciones diseñadas para resguardar tu patrimonio, tu familia y tu tranquilidad.' },
    { key: 'investments', title: 'Inversiones', text: 'Diseñamos estrategias personalizadas para hacer crecer tu dinero con visión, control y propósito. Invertir bien no es suerte, es estructura.' }
  ],
  about: {
    label: 'Sobre Mi',
    titleLines: ['ASESORA INMOBILIARIA, SEGUROS', 'E INVERSIONES'],
    paragraphs: [
      'Mi propósito es acompañarte a tomar decisiones que te den tranquilidad hoy y construyan tu futuro mañana.',
      'Trabajo con una visión clara: ayudarte a proteger, estructurar y hacer crecer tu patrimonio de forma estratégica, sin improvisaciones y con total confianza.'
    ]
  },
  strategicBanner: {
    kicker: 'SOLUCIONES INTEGRALES',
    title: 'Decisiones que hoy te dan paz, mañana te dan futuro.'
  },
  properties: {
    title: 'Featured Properties',
    viewAll: 'View All',
    items: [
      { id: 'luxury-villa-with-pool', price: '$800,000', title: 'Luxury Villa With Pool', location: '853 Dino Shores, Bartellborough', bedrooms: 5, bathrooms: 3, pool: 1, area: 500, image: siteImages.propertyOne },
      { id: 'cozy-high-tech-villa', price: '$500,000', title: 'Cozy High-Tech Villa', location: 'Sed vel maximus ante quis mattis neque', bedrooms: 5, bathrooms: 3, pool: 1, area: 400, image: siteImages.propertyTwo },
      { id: 'gorgeous-minimalist-villa', price: '$300,000', title: 'Gorgeous Minimalist Villa', location: 'Nulla tellus nunc malesuada at scelerisque', bedrooms: 3, bathrooms: 2, pool: 1, area: 150, image: siteImages.propertyThree }
    ]
  },
  footer: {
    question: 'Cual será tu próxima inversion?',
    subscribeTitle: 'Suscribete',
    subscribeText: 'Sé parte de nuestra comunidad y recibe información valiosa sobre bienes raíces, seguros e inversiones. Aprende, mantente informado y toma mejores decisiones financieras.',
    copyright: 'Copyright © 2026 - Amy Blandón.com | Powered by Xarcon'
  }
};
