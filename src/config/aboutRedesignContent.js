export const aboutContentDefaults = {
  heroName: 'Amy Blandón',
  heroRole: 'Asesora Inmobiliaria | Seguros | Inversiones',

  introKicker: 'SOBRE MÍ',
  introTitle: 'Personas primero. Decisiones con propósito.',
  introText: 'Soy Amy Blandón. Acompaño a personas y familias a tomar decisiones importantes sobre su patrimonio con cercanía, claridad y estrategia. Mi trabajo no empieza con una propiedad, una póliza o una inversión; empieza escuchando lo que quieres construir, proteger y hacer crecer.',

  experienceKicker: 'MI EXPERIENCIA',
  experienceTitle: 'Diez años acompañando decisiones que construyen patrimonio.',
  experienceText: 'Hace 10 años inicié mi trayectoria profesional en el mundo de los seguros y la protección patrimonial. Ese camino me enseñó que detrás de cada decisión financiera hay una familia, un proyecto y algo que merece ser protegido.\n\nCon el tiempo, mi trabajo me llevó naturalmente al sector inmobiliario, donde descubrí que una propiedad no es solo una compra o una venta: puede ser hogar, patrimonio e inversión.\n\nHoy integro bienes raíces, seguros e inversiones en una misma asesoría para ayudarte a tomar decisiones con una visión más completa.',

  methodKicker: 'MI FORMA DE TRABAJAR',
  methodTitle: 'Una forma sencilla de acompañarte.',
  method1Title: 'Escuchar',
  method1Text: 'Entender lo que necesitas.',
  method2Title: 'Analizar',
  method2Text: 'Revisar opciones con claridad.',
  method3Title: 'Acompañar',
  method3Text: 'Estar presente en cada decisión.',

  editorialPhilosophyKicker: 'MI FILOSOFÍA',
  editorialPhilosophyTitle: 'Construir. Proteger. Hacer crecer.',
  editorialPhilosophyText: 'Creo que una buena asesoría debe ayudarte a mirar más allá de una decisión aislada. Construir patrimonio, proteger lo que ya has logrado y hacer crecer tus oportunidades forman parte de una misma visión.\n\nMi compromiso es acompañarte con información clara, criterio y cercanía para que cada decisión tenga sentido para ti y para el futuro que quieres construir.',

  closingKicker: 'UNA CONVERSACIÓN PUEDE SER EL PRIMER PASO',
  closingTitle: '¿Hablamos?',
  closingText: 'Cuéntame qué quieres construir, proteger o hacer crecer. Será un gusto escucharte y ayudarte a encontrar el siguiente paso.',
  closingCta: 'Conversemos por WhatsApp',
};

export const aboutEditorSection = {
  label: 'Sobre mí',
  route: '/sobre-mi',
  description: 'Historia profesional de Amy: presentación, experiencia, forma de trabajar, filosofía y cierre de contacto.',
  groups: [
    {
      title: 'Portada',
      description: 'Nombre y especialidades que aparecen en la portada editorial.',
      fields: [
        ['heroName', 'Nombre', 'text'],
        ['heroRole', 'Cargo / especialidades', 'text'],
      ],
    },
    {
      title: 'Presentación humana',
      fields: [
        ['introKicker', 'Etiqueta', 'text'],
        ['introTitle', 'Título', 'textarea', 2],
        ['introText', 'Presentación', 'textarea', 6],
      ],
    },
    {
      title: 'Mi experiencia',
      fields: [
        ['experienceKicker', 'Etiqueta', 'text'],
        ['experienceTitle', 'Título', 'textarea', 2],
        ['experienceText', 'Historia profesional', 'textarea', 10],
      ],
    },
    {
      title: 'Mi forma de trabajar',
      fields: [
        ['methodKicker', 'Etiqueta', 'text'],
        ['methodTitle', 'Título', 'textarea', 2],
        ['method1Title', 'Paso 1', 'text'],
        ['method1Text', 'Descripción 1', 'textarea', 3],
        ['method2Title', 'Paso 2', 'text'],
        ['method2Text', 'Descripción 2', 'textarea', 3],
        ['method3Title', 'Paso 3', 'text'],
        ['method3Text', 'Descripción 3', 'textarea', 3],
      ],
    },
    {
      title: 'Mi filosofía',
      fields: [
        ['editorialPhilosophyKicker', 'Etiqueta', 'text'],
        ['editorialPhilosophyTitle', 'Título', 'textarea', 2],
        ['editorialPhilosophyText', 'Filosofía profesional', 'textarea', 7],
      ],
    },
    {
      title: 'Cierre',
      fields: [
        ['closingKicker', 'Etiqueta', 'text'],
        ['closingTitle', 'Título', 'text'],
        ['closingText', 'Texto', 'textarea', 4],
        ['closingCta', 'Texto del botón', 'text'],
      ],
    },
  ],
};
