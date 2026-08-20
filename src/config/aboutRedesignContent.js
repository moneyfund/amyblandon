export const aboutContentDefaults = {
  heroEyebrow: 'SOBRE MÍ',
  heroTitleLine1: 'Mi historia,',
  heroTitleAccent: 'mi propósito,',
  heroTitleLine3: 'tu tranquilidad.',
  heroLead: 'Más que una asesora, soy tu aliada en la toma de decisiones.',
  heroRole: 'Asesora Estratégica en Bienes Raíces, Seguros e Inversiones',

  credential1Title: 'Agente Diamante',
  credential1Text: 'Diamantes Realty Group',
  credential2Title: 'Más de 10 años',
  credential2Text: 'de experiencia en seguros, bienes raíces e inversiones',

  historyKicker: 'MI HISTORIA',
  historyTitle: 'Una trayectoria construida alrededor de la confianza.',
  historyText: 'Inicié mi camino en el mundo de los seguros hace más de 10 años, motivada por la necesidad de brindar protección, respaldo y tranquilidad a las familias que confían en mí. Esa experiencia me permitió desarrollar una visión más amplia sobre la importancia de cuidar lo que con tanto esfuerzo se construye.\n\nCon el tiempo, mi pasión por ayudar a las personas a construir un futuro más sólido me llevó al mundo de los bienes raíces y las inversiones, combinando hoy la protección, la planificación y el crecimiento financiero en una asesoría integral y personalizada.',

  valuesKicker: 'LO QUE ME DEFINE',
  valuesTitle: 'Una forma de trabajar basada en relaciones de largo plazo.',
  value1Title: 'Cercanía',
  value1Text: 'Escucho, entiendo y acompaño cada situación como si fuera propia.',
  value2Title: 'Confianza',
  value2Text: 'Construyo relaciones sólidas basadas en honestidad y transparencia.',
  value3Title: 'Estrategia',
  value3Text: 'Cada decisión que tomamos juntos tiene un propósito y un plan claro.',
  value4Title: 'Compromiso',
  value4Text: 'Me involucro a fondo en cada proceso porque tu tranquilidad es mi prioridad.',
  value5Title: 'Resultados',
  value5Text: 'Me enfoco en generar valor real y en ayudarte a alcanzar tus metas.',

  recognitionKicker: 'RECONOCIMIENTOS',
  recognitionYear: '2026',
  recognitionTitle: 'Reconocida de manera consecutiva como Agente Diamante.',
  recognitionText: 'Este reconocimiento refleja la confianza de mis clientes y mi compromiso constante con la excelencia, el acompañamiento y los resultados.',

  quoteKicker: 'LO QUE ME MUEVE',
  quoteText: 'Mi mayor satisfacción es ver a mis clientes alcanzar tranquilidad, seguridad y crecimiento, sabiendo que están construyendo un futuro sólido para los suyos.',

  missionKicker: 'MI PROPÓSITO',
  missionBelief: 'Creo que las mejores decisiones financieras no se toman por impulso, sino con estrategia, información y la asesoría correcta.',
  missionText: 'Mi misión es ayudarte a proteger tu patrimonio, identificar oportunidades y construir estabilidad, crecimiento y tranquilidad para el presente, el futuro y lo que sigue.',
};

export const aboutEditorSection = {
  label: 'Sobre mí',
  route: '/sobre-mi',
  description: 'Historia profesional de Amy: portada, experiencia, valores, reconocimiento y propósito.',
  groups: [
    {
      title: 'Portada',
      description: 'Mensaje principal, especialidad y credenciales que aparecen junto a la fotografía de Amy.',
      fields: [
        ['heroEyebrow', 'Etiqueta', 'text'],
        ['heroTitleLine1', 'Título — línea 1', 'text'],
        ['heroTitleAccent', 'Título — línea destacada', 'text'],
        ['heroTitleLine3', 'Título — línea 3', 'text'],
        ['heroLead', 'Frase principal', 'textarea', 3],
        ['heroRole', 'Cargo / especialidades', 'text'],
        ['credential1Title', 'Credencial 1 — título', 'text'],
        ['credential1Text', 'Credencial 1 — detalle', 'text'],
        ['credential2Title', 'Credencial 2 — título', 'text'],
        ['credential2Text', 'Credencial 2 — detalle', 'textarea', 2],
      ],
    },
    {
      title: 'Mi historia',
      fields: [
        ['historyKicker', 'Etiqueta', 'text'],
        ['historyTitle', 'Título', 'textarea', 2],
        ['historyText', 'Historia profesional', 'textarea', 10],
      ],
    },
    {
      title: 'Lo que me define',
      description: 'Cinco principios que Amy seleccionó para representar su forma de trabajar.',
      fields: [
        ['valuesKicker', 'Etiqueta', 'text'],
        ['valuesTitle', 'Título', 'textarea', 2],
        ['value1Title', 'Valor 1', 'text'],
        ['value1Text', 'Descripción 1', 'textarea', 3],
        ['value2Title', 'Valor 2', 'text'],
        ['value2Text', 'Descripción 2', 'textarea', 3],
        ['value3Title', 'Valor 3', 'text'],
        ['value3Text', 'Descripción 3', 'textarea', 3],
        ['value4Title', 'Valor 4', 'text'],
        ['value4Text', 'Descripción 4', 'textarea', 3],
        ['value5Title', 'Valor 5', 'text'],
        ['value5Text', 'Descripción 5', 'textarea', 3],
      ],
    },
    {
      title: 'Reconocimiento',
      fields: [
        ['recognitionKicker', 'Etiqueta', 'text'],
        ['recognitionYear', 'Año', 'text'],
        ['recognitionTitle', 'Título', 'textarea', 2],
        ['recognitionText', 'Descripción', 'textarea', 4],
      ],
    },
    {
      title: 'Frase con fotografía',
      fields: [
        ['quoteKicker', 'Etiqueta', 'text'],
        ['quoteText', 'Frase principal', 'textarea', 5],
      ],
    },
    {
      title: 'Propósito y cierre',
      fields: [
        ['missionKicker', 'Etiqueta', 'text'],
        ['missionBelief', 'Creencia profesional', 'textarea', 5],
        ['missionText', 'Misión', 'textarea', 5],
      ],
    },
  ],
};
