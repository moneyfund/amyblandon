export const THEME_SCHEMA_VERSION = 4;

export const defaultSiteTheme = {
  schemaVersion: THEME_SCHEMA_VERSION,
  preset: 'amy-original',
  primaryColor: '#042B3A',
  heroBackground: '#001929',
  accentColor: '#C99A44',
  surfaceColor: '#F4F6F4',
  navbarBackground: '#FFFFFF',
  navbarText: '#042B3A',
  footerBackground: '#001929',
  footerText: '#FFFFFF',
};

export const siteThemePresets = [
  {
    id: 'amy-original',
    name: 'Amy Blandón Original',
    description: 'Referencia exacta de amyblandon.com: hero y footer #001929, navbar blanco, azul petróleo y dorado.',
    values: { ...defaultSiteTheme, preset: 'amy-original' },
  },
  {
    id: 'ivory-premium',
    name: 'Marfil Premium',
    description: 'Marfil cálido, verde profundo y dorado suave para una imagen elegante y residencial.',
    values: {
      schemaVersion: THEME_SCHEMA_VERSION,
      preset: 'ivory-premium',
      primaryColor: '#263A35',
      heroBackground: '#172824',
      accentColor: '#B68A42',
      surfaceColor: '#F7F4ED',
      navbarBackground: '#FFFDF8',
      navbarText: '#263A35',
      footerBackground: '#1B2522',
      footerText: '#FAF8F1',
    },
  },
  {
    id: 'executive-navy',
    name: 'Azul Ejecutivo',
    description: 'Azul marino sobrio, blanco limpio y oro champán para una presencia corporativa.',
    values: {
      schemaVersion: THEME_SCHEMA_VERSION,
      preset: 'executive-navy',
      primaryColor: '#102A43',
      heroBackground: '#081C2C',
      accentColor: '#C7A55B',
      surfaceColor: '#F3F6F8',
      navbarBackground: '#FFFFFF',
      navbarText: '#102A43',
      footerBackground: '#0B1D2A',
      footerText: '#F8FAFC',
    },
  },
  {
    id: 'graphite-gold',
    name: 'Grafito Dorado',
    description: 'Grafito, blanco cálido y dorado envejecido para una estética moderna y exclusiva.',
    values: {
      schemaVersion: THEME_SCHEMA_VERSION,
      preset: 'graphite-gold',
      primaryColor: '#2C3033',
      heroBackground: '#17191B',
      accentColor: '#B8944E',
      surfaceColor: '#F5F3EF',
      navbarBackground: '#FAF9F6',
      navbarText: '#25292B',
      footerBackground: '#17191B',
      footerText: '#F7F5F0',
    },
  },
];

export const siteThemeFields = [
  ['primaryColor', 'Color principal', 'Títulos, botones y elementos principales de identidad.'],
  ['heroBackground', 'Fondo oscuro del hero', 'Color sólido del lado izquierdo del hero de Inicio y base de los bloques oscuros.'],
  ['accentColor', 'Dorado / acento', 'Líneas, estados activos, iconos, detalles premium y llamadas a la acción.'],
  ['surfaceColor', 'Fondos suaves', 'Fondos secundarios, tarjetas, bloques claros y variaciones de los héroes blancos.'],
  ['navbarBackground', 'Fondo del navbar', 'Fondo sólido del menú al desplazarse y del menú móvil.'],
  ['navbarText', 'Texto del navbar', 'Enlaces, subtítulo del logo y controles cuando el navbar tiene fondo claro.'],
  ['footerBackground', 'Fondo del footer', 'Color completo del pie de página y del área de revelado inferior.'],
  ['footerText', 'Texto del footer', 'Títulos, enlaces, datos de contacto y textos del pie de página.'],
];
