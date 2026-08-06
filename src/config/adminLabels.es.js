export const propertyTypeOptions = [
  ['house', 'Casa'],
  ['apartment', 'Apartamento'],
  ['condo', 'Condominio'],
  ['villa', 'Villa'],
  ['quinta', 'Quinta'],
  ['beach_house', 'Casa cerca del mar'],
  ['land', 'Terreno'],
  ['lot', 'Solar'],
  ['farm', 'Finca'],
  ['commercial', 'Local comercial'],
  ['warehouse', 'Bodega'],
  ['building', 'Edificio'],
  ['office', 'Oficina'],
  ['hotel', 'Hotel'],
  ['investment', 'Proyecto de inversión'],
  ['other', 'Otro tipo de propiedad'],
];

export const operationTypeOptions = [
  ['sale', 'Venta'],
  ['rent', 'Alquiler'],
];

export const propertyStatusOptions = [
  ['available', 'Disponible'],
  ['reserved', 'Reservada'],
  ['sold', 'Vendida'],
  ['rented', 'Alquilada'],
];

export const publicationStatusOptions = [
  ['draft', 'Borrador'],
  ['published', 'Publicada'],
  ['archived', 'Archivada'],
];

export const currencyOptions = [
  ['USD', 'Dólares estadounidenses (USD)'],
  ['NIO', 'Córdobas nicaragüenses (NIO)'],
];

export const inquiryStatusLabels = {
  new: 'Nueva',
  contacted: 'Contactada',
  resolved: 'Resuelta',
  archived: 'Archivada',
};

export const contentSectionLabels = {
  home: 'Página de inicio',
  about: 'Sobre mí',
  contact: 'Contacto',
};

export const contentFieldLabels = {
  heroTitle: 'Título principal del hero',
  heroSubtitle: 'Texto descriptivo del hero',
  heroLabel: 'Etiqueta superior del hero',
  aboutTitle: 'Título de la sección Sobre mí',
  aboutText: 'Texto de la sección Sobre mí',
  strategicTitle: 'Título de la franja estratégica',
  strategicLabel: 'Etiqueta de la franja estratégica',
  title: 'Título',
  subtitle: 'Subtítulo',
  biography: 'Biografía',
  mission: 'Propósito o misión',
  values: 'Valores',
  phone: 'Teléfono',
  whatsapp: 'WhatsApp',
  email: 'Correo electrónico',
  address: 'Dirección',
  schedule: 'Horario de atención',
  facebook: 'URL de Facebook',
  instagram: 'URL de Instagram',
  tiktok: 'URL de TikTok',
};

export const labelFor = (options, value, fallback = '—') =>
  options.find(([optionValue]) => optionValue === value)?.[1] || value || fallback;
