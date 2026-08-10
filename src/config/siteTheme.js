export const defaultSiteTheme = {
  preset: 'amy-classic',
  primaryColor: '#042B3A',
  accentColor: '#C99A44',
  surfaceColor: '#F4F6F4',
  navbarBackground: '#FFFFFF',
  navbarText: '#042B3A',
  footerBackground: '#05090B',
  footerText: '#FFFFFF',
};

export const siteThemePresets = [
  {
    id: 'amy-classic',
    name: 'Amy Clásico',
    description: 'Blanco, azul petróleo y dorado. Conserva la identidad actual con una apariencia premium.',
    values: { ...defaultSiteTheme, preset: 'amy-classic' },
  },
  {
    id: 'ivory-premium',
    name: 'Marfil Premium',
    description: 'Marfil cálido, verde profundo y dorado suave para una imagen elegante y residencial.',
    values: {
      preset: 'ivory-premium',
      primaryColor: '#263A35',
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
      preset: 'executive-navy',
      primaryColor: '#102A43',
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
      preset: 'graphite-gold',
      primaryColor: '#2C3033',
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
  ['primaryColor', 'Color principal', 'Botones, textos destacados y elementos principales de la identidad.'],
  ['accentColor', 'Dorado / acento', 'Líneas, estados activos, detalles premium y llamadas a la acción.'],
  ['surfaceColor', 'Fondos suaves', 'Tarjetas y superficies secundarias claras de la web.'],
  ['navbarBackground', 'Fondo del navbar', 'Color del navbar cuando aparece su fondo sólido.'],
  ['navbarText', 'Texto del navbar', 'Color de los enlaces sobre el navbar claro.'],
  ['footerBackground', 'Fondo del footer', 'Color principal del pie de página.'],
  ['footerText', 'Texto del footer', 'Color del contenido del pie de página.'],
];
