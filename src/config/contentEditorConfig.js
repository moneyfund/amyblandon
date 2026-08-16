export const contentEditorSections = {
  home: {
    label: 'Inicio',
    route: '/',
    description: 'Textos principales de la página de inicio, soluciones, presentación de Amy y propiedades destacadas.',
    groups: [
      {
        title: 'Hero principal',
        description: 'Controla el mensaje principal que aparece al abrir la web.',
        fields: [
          ['heroLabel', 'Etiqueta superior', 'text'],
          ['heroTitle', 'Título principal', 'textarea', 3, 'Puedes usar Enter para decidir dónde cortar el título.'],
          ['heroSubtitle', 'Texto descriptivo', 'textarea', 4],
          ['heroButton', 'Texto del botón de WhatsApp', 'text'],
        ],
      },
      {
        title: 'Soluciones integrales',
        description: 'Encabezado y contenido de las tres áreas de servicio de la página de inicio.',
        fields: [
          ['solutionsKicker', 'Etiqueta de la sección', 'text'],
          ['solutionsTitle', 'Título de la sección', 'text'],
          ['solutionRealEstateTitle', 'Bienes Raíces — Título', 'text'],
          ['solutionRealEstateText', 'Bienes Raíces — Descripción', 'textarea', 4],
          ['solutionInsuranceTitle', 'Seguros — Título', 'text'],
          ['solutionInsuranceText', 'Seguros — Descripción', 'textarea', 4],
          ['solutionInvestmentsTitle', 'Inversiones — Título', 'text'],
          ['solutionInvestmentsText', 'Inversiones — Descripción', 'textarea', 4],
        ],
      },
      {
        title: 'Presentación de Amy',
        description: 'Textos que acompañan la fotografía de Amy en la página de inicio.',
        fields: [
          ['homeAboutLabel', 'Etiqueta superior', 'text'],
          ['homeAboutHeadline', 'Título', 'textarea', 3, 'Usa Enter para controlar las líneas del título.'],
          ['homeAboutText', 'Texto de presentación', 'textarea', 7, 'Los saltos de línea se conservarán en la web.'],
        ],
      },
      {
        title: 'Franja estratégica',
        fields: [
          ['strategicLabel', 'Etiqueta superior', 'text'],
          ['strategicTitle', 'Frase principal', 'textarea', 3],
        ],
      },
      {
        title: 'Propiedades destacadas',
        fields: [
          ['featuredEyebrow', 'Etiqueta superior', 'text'],
          ['featuredTitle', 'Título', 'text'],
          ['featuredViewAll', 'Texto de “ver más”', 'text'],
        ],
      },
    ],
  },

  about: {
    label: 'Sobre mí',
    route: '/sobre-mi',
    description: 'Contenido completo del hero, propósito, áreas de asesoría y sección de impacto de Amy.',
    groups: [
      {
        title: 'Hero de Sobre mí',
        description: 'El título mantiene el diseño en azul + dorado + azul mediante tres campos independientes.',
        fields: [
          ['heroTitlePrimary', 'Título azul — Primera línea', 'textarea', 2],
          ['heroTitleGold', 'Palabra / frase dorada', 'text'],
          ['heroTitleSecondary', 'Título azul — Última línea', 'textarea', 2],
          ['heroIntroLead', 'Frase introductoria destacada', 'textarea', 2],
          ['heroIntro1', 'Párrafo 1', 'textarea', 4],
          ['heroIntro2', 'Párrafo 2', 'textarea', 5],
          ['heroIntro3', 'Párrafo 3', 'textarea', 4],
          ['specialtyRealEstate', 'Etiqueta — Bienes raíces', 'text'],
          ['specialtyInsurance', 'Etiqueta — Seguros', 'text'],
          ['specialtyInvestments', 'Etiqueta — Inversiones', 'text'],
          ['whatsappButton', 'Texto del botón de WhatsApp', 'text'],
        ],
      },
      {
        title: 'Propósito profesional',
        fields: [
          ['purposeKicker', 'Etiqueta superior', 'text'],
          ['purposeTitle', 'Título', 'textarea', 3],
          ['purposeText', 'Descripción', 'textarea', 4],
        ],
      },
      {
        title: 'Áreas de asesoría',
        fields: [
          ['servicesKicker', 'Etiqueta superior', 'text'],
          ['servicesTitle', 'Título', 'textarea', 2],
          ['serviceRealEstateTitle', 'Bienes Raíces — Título', 'text'],
          ['serviceRealEstateText', 'Bienes Raíces — Descripción', 'textarea', 4],
          ['serviceInsuranceTitle', 'Seguros — Título', 'text'],
          ['serviceInsuranceText', 'Seguros — Descripción', 'textarea', 4],
          ['serviceInvestmentsTitle', 'Inversiones — Título', 'text'],
          ['serviceInvestmentsText', 'Inversiones — Descripción', 'textarea', 4],
        ],
      },
      {
        title: 'Impacto y cobertura',
        fields: [
          ['impactKicker', 'Etiqueta superior', 'text'],
          ['impactTitle', 'Título', 'textarea', 3],
          ['impactText', 'Descripción', 'textarea', 5],
          ['stat1Value', 'Indicador 1 — Valor', 'text'],
          ['stat1Label', 'Indicador 1 — Texto', 'text'],
          ['stat2Value', 'Indicador 2 — Valor', 'text'],
          ['stat2Label', 'Indicador 2 — Texto', 'text'],
          ['stat3Value', 'Indicador 3 — Valor', 'text'],
          ['stat3Label', 'Indicador 3 — Texto', 'text'],
          ['mapKicker', 'Mapa — Etiqueta', 'text'],
          ['mapTitle', 'Mapa — Título', 'text'],
          ['mapLiveLabel', 'Mapa — Estado', 'text'],
          ['mapFooterText', 'Mapa — Texto inferior', 'textarea', 2],
        ],
      },
    ],
  },

  realEstate: {
    label: 'Bienes raíces',
    route: '/bienes-raices',
    description: 'Controla el buscador principal, catálogo, bloque de asesoría, servicios, proceso y CTA inmobiliario.',
    groups: [
      {
        title: 'Hero con buscador',
        fields: [
          ['searchHeroEyebrow', 'Etiqueta superior', 'text'],
          ['searchHeroTitle', 'Título', 'textarea', 3],
          ['searchHeroText', 'Subtítulo', 'textarea', 3],
        ],
      },
      {
        title: 'Catálogo de propiedades',
        fields: [
          ['catalogEyebrow', 'Etiqueta superior', 'text'],
          ['catalogTitle', 'Título', 'text'],
          ['catalogText', 'Descripción', 'textarea', 3],
          ['featuredTitle', 'Título de propiedades destacadas', 'text'],
          ['featuredText', 'Texto de propiedades destacadas', 'textarea', 2],
        ],
      },
      {
        title: 'Bloque de asesoría inmobiliaria',
        fields: [
          ['heroEyebrow', 'Etiqueta superior', 'text'],
          ['heroTitle', 'Título', 'textarea', 3],
          ['heroText', 'Descripción', 'textarea', 5],
          ['heroPrimaryButton', 'Botón principal', 'text'],
          ['heroSecondaryButton', 'Botón secundario', 'text'],
          ['heroBadgeTitle', 'Tarjeta sobre imagen — Título', 'text'],
          ['heroBadgeText', 'Tarjeta sobre imagen — Texto', 'text'],
          ['heroTrust1', 'Sello de confianza 1', 'text'],
          ['heroTrust2', 'Sello de confianza 2', 'text'],
        ],
      },
      {
        title: 'Servicios inmobiliarios',
        fields: [
          ['servicesKicker', 'Etiqueta superior', 'text'],
          ['servicesTitle', 'Título', 'text'],
          ['servicesText', 'Descripción', 'textarea', 3],
          ['service1Title', 'Servicio 1 — Título', 'text'],
          ['service1Text', 'Servicio 1 — Descripción', 'textarea', 3],
          ['service2Title', 'Servicio 2 — Título', 'text'],
          ['service2Text', 'Servicio 2 — Descripción', 'textarea', 3],
          ['service3Title', 'Servicio 3 — Título', 'text'],
          ['service3Text', 'Servicio 3 — Descripción', 'textarea', 3],
          ['service4Title', 'Servicio 4 — Título', 'text'],
          ['service4Text', 'Servicio 4 — Descripción', 'textarea', 3],
        ],
      },
      {
        title: 'Proceso de acompañamiento',
        fields: [
          ['processKicker', 'Etiqueta superior', 'text'],
          ['processTitle', 'Título', 'textarea', 2],
          ['processText', 'Descripción', 'textarea', 3],
          ['process1Title', 'Paso 1 — Título', 'text'],
          ['process1Text', 'Paso 1 — Descripción', 'textarea', 3],
          ['process2Title', 'Paso 2 — Título', 'text'],
          ['process2Text', 'Paso 2 — Descripción', 'textarea', 3],
          ['process3Title', 'Paso 3 — Título', 'text'],
          ['process3Text', 'Paso 3 — Descripción', 'textarea', 3],
          ['process4Title', 'Paso 4 — Título', 'text'],
          ['process4Text', 'Paso 4 — Descripción', 'textarea', 3],
        ],
      },
      {
        title: 'Llamada a la acción final',
        fields: [
          ['ctaEyebrow', 'Etiqueta superior', 'text'],
          ['ctaTitle', 'Título', 'textarea', 3],
          ['ctaText', 'Descripción', 'textarea', 3],
          ['ctaPrimaryButton', 'Botón principal', 'text'],
          ['ctaSecondaryButton', 'Botón secundario', 'text'],
        ],
      },
    ],
  },

  insurance: {
    label: 'Seguros',
    route: '/seguros',
    description: 'Textos del hero, coberturas, orientación, proceso y principios de asesoría de Seguros.',
    groups: [
      {
        title: 'Hero de Seguros',
        fields: [
          ['heroEyebrow', 'Etiqueta superior', 'text'],
          ['heroTitle', 'Título', 'textarea', 3],
          ['heroText', 'Descripción', 'textarea', 5],
          ['heroPrimaryButton', 'Botón principal', 'text'],
          ['heroSecondaryButton', 'Enlace secundario', 'text'],
          ['heroTrust1', 'Sello 1', 'text'],
          ['heroTrust2', 'Sello 2', 'text'],
          ['heroTrust3', 'Sello 3', 'text'],
          ['heroShieldTitle', 'Tarjeta sobre imagen — Título', 'text'],
          ['heroShieldText', 'Tarjeta sobre imagen — Texto', 'text'],
        ],
      },
      {
        title: 'Beneficios rápidos',
        fields: [
          ['assurance1Title', 'Beneficio 1 — Título', 'text'],
          ['assurance1Text', 'Beneficio 1 — Texto', 'textarea', 3],
          ['assurance2Title', 'Beneficio 2 — Título', 'text'],
          ['assurance2Text', 'Beneficio 2 — Texto', 'textarea', 3],
          ['assurance3Title', 'Beneficio 3 — Título', 'text'],
          ['assurance3Text', 'Beneficio 3 — Texto', 'textarea', 3],
        ],
      },
      {
        title: 'Sección de coberturas',
        fields: [
          ['coveragesEyebrow', 'Etiqueta superior', 'text'],
          ['coveragesTitle', 'Título', 'textarea', 2],
          ['coveragesText', 'Descripción', 'textarea', 4],
        ],
      },
      {
        title: 'Asesoría antes que venta',
        fields: [
          ['guidanceEyebrow', 'Etiqueta superior', 'text'],
          ['guidanceTitle', 'Título', 'textarea', 3],
          ['guidanceText', 'Descripción', 'textarea', 4],
          ['guidancePoint1', 'Punto 1', 'textarea', 2],
          ['guidancePoint2', 'Punto 2', 'textarea', 2],
          ['guidancePoint3', 'Punto 3', 'textarea', 2],
          ['guidancePoint4', 'Punto 4', 'textarea', 2],
          ['guidanceButton', 'Texto del botón', 'text'],
          ['guidanceQuote', 'Frase destacada', 'textarea', 3],
          ['guidanceMetric1', 'Paso visual 01', 'textarea', 2],
          ['guidanceMetric2', 'Paso visual 02', 'textarea', 2],
          ['guidanceMetric3', 'Paso visual 03', 'textarea', 2],
        ],
      },
      {
        title: 'Proceso',
        fields: [
          ['processEyebrow', 'Etiqueta superior', 'text'],
          ['processTitle', 'Título', 'textarea', 2],
          ['processText', 'Descripción', 'textarea', 3],
          ['process1Title', 'Paso 1 — Título', 'text'],
          ['process1Text', 'Paso 1 — Descripción', 'textarea', 3],
          ['process2Title', 'Paso 2 — Título', 'text'],
          ['process2Text', 'Paso 2 — Descripción', 'textarea', 3],
          ['process3Title', 'Paso 3 — Título', 'text'],
          ['process3Text', 'Paso 3 — Descripción', 'textarea', 3],
          ['process4Title', 'Paso 4 — Título', 'text'],
          ['process4Text', 'Paso 4 — Descripción', 'textarea', 3],
        ],
      },
      {
        title: 'Forma de asesorar',
        fields: [
          ['principlesEyebrow', 'Etiqueta superior', 'text'],
          ['principlesTitle', 'Título', 'textarea', 2],
          ['principlesText', 'Descripción', 'textarea', 3],
          ['principle1Title', 'Principio 1 — Título', 'text'],
          ['principle1Text', 'Principio 1 — Descripción', 'textarea', 3],
          ['principle2Title', 'Principio 2 — Título', 'text'],
          ['principle2Text', 'Principio 2 — Descripción', 'textarea', 3],
          ['principle3Title', 'Principio 3 — Título', 'text'],
          ['principle3Text', 'Principio 3 — Descripción', 'textarea', 3],
        ],
      },
    ],
  },

  contact: {
    label: 'Contacto',
    route: '/contacto',
    description: 'Texto de la página de contacto, datos generales y redes sociales por rubro.',
    groups: [
      {
        title: 'Página de Contacto',
        fields: [
          ['pageEyebrow', 'Etiqueta superior', 'text'],
          ['pageTitle', 'Título', 'text'],
          ['pageText', 'Descripción', 'textarea', 4],
          ['locationLabel', 'Etiqueta de ubicación', 'text'],
          ['contactNote', 'Nota inferior', 'textarea', 3],
          ['formEyebrow', 'Formulario — Etiqueta', 'text'],
          ['formTitle', 'Formulario — Título', 'text'],
          ['formText', 'Formulario — Descripción', 'textarea', 3],
        ],
      },
      {
        title: 'Datos generales',
        description: 'Estos datos se reutilizan en navbar, contacto, footer y botones de WhatsApp.',
        fields: [
          ['phone', 'Teléfono general', 'tel'],
          ['whatsapp', 'WhatsApp general', 'tel'],
          ['email', 'Correo general', 'email'],
          ['address', 'Dirección / ubicación', 'textarea', 2],
          ['schedule', 'Horario de atención', 'textarea', 2],
        ],
      },
      {
        title: 'Redes generales del footer',
        fields: [
          ['facebook', 'Facebook', 'url'],
          ['instagram', 'Instagram', 'url'],
          ['tiktok', 'TikTok', 'url'],
        ],
      },
      {
        title: 'Redes de Bienes Raíces',
        fields: [
          ['realEstateEmail', 'Correo de Bienes Raíces', 'email'],
          ['realEstateFacebook', 'Facebook de Bienes Raíces', 'url'],
          ['realEstateInstagram', 'Instagram de Bienes Raíces', 'url'],
          ['realEstateTiktok', 'TikTok de Bienes Raíces', 'url'],
        ],
      },
      {
        title: 'Redes de Seguros',
        fields: [
          ['insuranceEmail', 'Correo de Seguros', 'email'],
          ['insuranceFacebook', 'Facebook de Seguros', 'url'],
          ['insuranceInstagram', 'Instagram de Seguros', 'url'],
          ['insuranceTiktok', 'TikTok de Seguros', 'url'],
        ],
      },
    ],
  },

  footer: {
    label: 'Footer',
    route: '/',
    description: 'Mensajes, suscripción y copyright del pie de página visible en toda la web.',
    groups: [
      {
        title: 'Llamada a WhatsApp',
        fields: [
          ['question', 'Pregunta principal', 'textarea', 2],
          ['whatsappButton', 'Texto del botón', 'text'],
        ],
      },
      {
        title: 'Suscripción',
        fields: [
          ['subscribeTitle', 'Título', 'text'],
          ['subscribeText', 'Descripción', 'textarea', 5],
          ['subscribePlaceholder', 'Texto dentro del campo de correo', 'text'],
          ['submitLabel', 'Texto del botón Enviar', 'text'],
          ['successMessage', 'Mensaje de éxito', 'text'],
          ['errorMessage', 'Mensaje de correo inválido', 'text'],
        ],
      },
      {
        title: 'Pie legal',
        fields: [
          ['copyright', 'Copyright', 'textarea', 2],
        ],
      },
    ],
  },
};

export const contentSectionOrder = ['home', 'about', 'realEstate', 'insurance', 'contact', 'footer'];
