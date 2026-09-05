export const nicaraguaDepartments = [
  'Boaco',
  'Carazo',
  'Chinandega',
  'Chontales',
  'Costa Caribe Norte',
  'Costa Caribe Sur',
  'Estelí',
  'Granada',
  'Jinotega',
  'León',
  'Madriz',
  'Managua',
  'Masaya',
  'Matagalpa',
  'Nueva Segovia',
  'Río San Juan',
  'Rivas',
];

export const areaUnitOptions = [
  ['m²', 'Metros cuadrados (m²)'],
  ['varas²', 'Varas cuadradas (vrs²)'],
  ['manzanas', 'Manzanas'],
  ['hectáreas', 'Hectáreas'],
  ['pies²', 'Pies cuadrados (ft²)'],
];

export const rentPeriodOptions = [
  ['monthly', 'Mensual'],
  ['daily', 'Diario'],
  ['weekly', 'Semanal'],
  ['yearly', 'Anual'],
];

export const highlightTagOptions = [
  ['new', 'Nueva'],
  ['featured', 'Destacada'],
  ['opportunity', 'Oportunidad'],
  ['reduced', 'Precio reducido'],
  ['exclusive', 'Exclusiva'],
  ['investment', 'Ideal para inversión'],
];

const residentialFeatures = [
  'Piscina',
  'Terraza',
  'Jardín',
  'Balcón',
  'Área social',
  'Vista panorámica',
  'Aire acondicionado',
  'Amueblada',
  'Cuarto de servicio',
  'Área de lavandería',
  'Bodega',
  'Cerca perimetral',
  'Seguridad 24/7',
  'Acceso controlado',
];

const residentialServices = [
  'Agua potable',
  'Energía eléctrica',
  'Internet',
  'Alcantarillado sanitario',
  'Drenaje pluvial',
  'Recolección de basura',
  'Calle pavimentada',
  'Calle adoquinada',
  'Transporte público cercano',
];

export const featurePresetsByType = {
  house: residentialFeatures,
  apartment: [
    'Balcón', 'Terraza', 'Área social', 'Piscina común', 'Gimnasio', 'Ascensor',
    'Aire acondicionado', 'Amueblado', 'Área de lavandería', 'Lobby',
    'Seguridad 24/7', 'Acceso controlado', 'Pet friendly',
  ],
  condo: [
    'Balcón', 'Terraza', 'Área social', 'Piscina común', 'Gimnasio', 'Ascensor',
    'Aire acondicionado', 'Amueblado', 'Área de lavandería', 'Casa club',
    'Seguridad 24/7', 'Acceso controlado', 'Pet friendly',
  ],
  villa: [
    'Piscina', 'Terraza', 'Jardines', 'Área social', 'Vista panorámica',
    'Aire acondicionado', 'Amueblada', 'Área de lavandería', 'Casa de huéspedes',
    'Seguridad 24/7', 'Acceso controlado',
  ],
  quinta: [
    'Casa principal', 'Casa de cuidador', 'Piscina', 'Jardines', 'Árboles frutales',
    'Área social', 'Rancho', 'Cerca perimetral', 'Pozo propio', 'Vista panorámica',
    'Acceso vehicular', 'Espacio para ampliación',
  ],
  beach_house: [
    'Vista al mar', 'Acceso a playa', 'Piscina', 'Terraza', 'Balcón', 'Jardín',
    'Área social', 'Aire acondicionado', 'Amueblada', 'Área de lavandería',
    'Potencial de alquiler vacacional', 'Seguridad 24/7',
  ],
  land: [
    'Esquinero', 'Frente a calle', 'Vista panorámica', 'Cerca perimetral',
    'Topografía aprovechable', 'Listo para construir', 'Acceso vehicular',
    'Zona urbanizada', 'Potencial comercial', 'Potencial residencial',
    'Potencial para lotificación', 'Plusvalía proyectada',
  ],
  lot: [
    'Esquinero', 'Frente a calle', 'Vista panorámica', 'Cerca perimetral',
    'Topografía aprovechable', 'Listo para construir', 'Acceso vehicular',
    'Zona urbanizada', 'Potencial residencial', 'Potencial comercial',
  ],
  farm: [
    'Casa hacienda', 'Casa de cuidador', 'Corrales', 'Potreros', 'Beneficio',
    'Bodega agrícola', 'Áreas de cultivo', 'Bosque', 'Río o quebrada', 'Manantial',
    'Pozo propio', 'Cercas', 'Acceso vehicular', 'Vista panorámica',
  ],
  commercial: [
    'Frente comercial', 'Vitrina', 'Área de exhibición', 'Área de carga y descarga',
    'Bodega interna', 'Oficinas internas', 'Aire acondicionado', 'Extractores',
    'Acceso universal', 'Seguridad 24/7', 'Alto flujo vehicular', 'Alto flujo peatonal',
  ],
  warehouse: [
    'Andén de carga', 'Área de carga y descarga', 'Acceso para camiones',
    'Patio de maniobras', 'Oficinas internas', 'Baños para personal', 'Mezanine',
    'Piso industrial', 'Techo de gran altura', 'Sistema contra incendios',
    'Cerca perimetral', 'Seguridad 24/7',
  ],
  building: [
    'Locales comerciales', 'Apartamentos', 'Oficinas', 'Ascensor', 'Escaleras de emergencia',
    'Recepción', 'Área común', 'Terraza', 'Planta eléctrica', 'Tanque de agua',
    'Seguridad 24/7', 'Acceso controlado',
  ],
  office: [
    'Recepción', 'Sala de reuniones', 'Oficinas privadas', 'Área abierta de trabajo',
    'Cocineta', 'Aire acondicionado', 'Amueblada', 'Cableado de red', 'Ascensor',
    'Acceso universal', 'Seguridad 24/7', 'Acceso controlado',
  ],
  hotel: [
    'Recepción', 'Restaurante', 'Bar', 'Piscina', 'Salón de eventos', 'Terraza',
    'Lavandería', 'Cocina industrial', 'Aire acondicionado', 'Ascensor',
    'Área administrativa', 'Seguridad 24/7', 'Equipado y amueblado',
  ],
  investment: [
    'Proyecto aprobado', 'Permisos disponibles', 'Estudios disponibles',
    'Infraestructura existente', 'Frente a vía principal', 'Alta plusvalía',
    'Potencial comercial', 'Potencial residencial', 'Potencial turístico',
    'Potencial para desarrollo mixto',
  ],
  other: [
    'Acceso vehicular', 'Cerca perimetral', 'Vista panorámica', 'Seguridad',
    'Infraestructura existente', 'Potencial de ampliación',
  ],
};

export const servicePresetsByType = {
  house: residentialServices,
  apartment: [...residentialServices, 'Planta eléctrica', 'Elevador con respaldo eléctrico'],
  condo: [...residentialServices, 'Planta eléctrica', 'Elevador con respaldo eléctrico'],
  villa: [...residentialServices, 'Pozo propio', 'Tanque de agua'],
  quinta: [
    'Agua potable', 'Energía eléctrica', 'Internet', 'Pozo propio', 'Tanque de agua',
    'Acceso todo el año', 'Calle adoquinada', 'Calle de macadán', 'Señal celular',
  ],
  beach_house: [
    'Agua potable', 'Energía eléctrica', 'Internet', 'Alcantarillado sanitario',
    'Pozo propio', 'Tanque de agua', 'Acceso todo el año', 'Calle pavimentada',
    'Seguridad privada en la zona',
  ],
  land: [
    'Agua potable disponible', 'Energía eléctrica disponible', 'Internet en la zona',
    'Alcantarillado sanitario', 'Drenaje pluvial', 'Calle pavimentada',
    'Calle adoquinada', 'Calle de macadán', 'Acceso todo el año',
    'Transporte público cercano',
  ],
  lot: [
    'Agua potable disponible', 'Energía eléctrica disponible', 'Internet en la zona',
    'Alcantarillado sanitario', 'Drenaje pluvial', 'Calle pavimentada',
    'Calle adoquinada', 'Acceso todo el año', 'Transporte público cercano',
  ],
  farm: [
    'Energía eléctrica', 'Agua potable', 'Pozo propio', 'Río o quebrada', 'Manantial',
    'Internet o señal celular', 'Acceso todo el año', 'Camino de macadán',
    'Energía trifásica',
  ],
  commercial: [
    'Agua potable', 'Energía eléctrica', 'Internet', 'Alcantarillado sanitario',
    'Energía trifásica', 'Planta eléctrica', 'Calle pavimentada',
    'Transporte público cercano', 'Recolección de basura',
  ],
  warehouse: [
    'Agua potable', 'Energía eléctrica', 'Energía trifásica', 'Internet',
    'Drenaje pluvial', 'Sistema contra incendios', 'Acceso todo el año',
    'Calle pavimentada', 'Acceso para transporte pesado',
  ],
  building: [
    'Agua potable', 'Energía eléctrica', 'Internet', 'Alcantarillado sanitario',
    'Drenaje pluvial', 'Planta eléctrica', 'Tanque de agua', 'Recolección de basura',
  ],
  office: [
    'Agua potable', 'Energía eléctrica', 'Internet de alta velocidad',
    'Alcantarillado sanitario', 'Planta eléctrica', 'Calle pavimentada',
    'Transporte público cercano',
  ],
  hotel: [
    'Agua potable', 'Energía eléctrica', 'Internet', 'Alcantarillado sanitario',
    'Planta eléctrica', 'Tanque de agua', 'Pozo propio', 'Recolección de basura',
    'Calle pavimentada',
  ],
  investment: [
    'Agua potable disponible', 'Energía eléctrica disponible', 'Internet en la zona',
    'Alcantarillado sanitario', 'Drenaje pluvial', 'Calle pavimentada',
    'Acceso todo el año',
  ],
  other: [
    'Agua potable', 'Energía eléctrica', 'Internet', 'Alcantarillado sanitario',
    'Acceso todo el año',
  ],
};

export let featurePresets = featurePresetsByType.house;
export let servicePresets = servicePresetsByType.house;

const yesNo = [
  ['yes', 'Sí'],
  ['no', 'No'],
];

const field = (key, label, type = 'text', options = [], help = '') => ({
  key,
  label,
  type,
  options,
  help,
});

export const dynamicPropertyFields = {
  house: [
    field('levels', 'Niveles', 'number'),
    field('livingRoom', 'Sala', 'select', yesNo),
    field('diningRoom', 'Comedor', 'select', yesNo),
    field('kitchen', 'Cocina', 'select', yesNo),
    field('patio', 'Patio', 'select', yesNo),
    field('terrace', 'Terraza', 'select', yesNo),
    field('laundryArea', 'Área de lavandería', 'select', yesNo),
    field('serviceRoom', 'Cuarto de servicio', 'select', yesNo),
    field('waterTank', 'Tanque de agua', 'select', yesNo),
    field('hotWater', 'Agua caliente', 'select', yesNo),
    field('furnished', 'Amueblada', 'select', yesNo),
    field('roofType', 'Tipo de techo'),
    field('constructionStatus', 'Estado de la construcción'),
    field('security', 'Sistema de seguridad'),
  ],
  apartment: [
    field('floorLevel', 'Piso o nivel'),
    field('elevator', 'Ascensor', 'select', yesNo),
    field('balcony', 'Balcón', 'select', yesNo),
    field('furnished', 'Amueblado', 'select', yesNo),
    field('maintenanceFee', 'Cuota de mantenimiento', 'number'),
    field('commonPool', 'Piscina común', 'select', yesNo),
    field('gym', 'Gimnasio', 'select', yesNo),
    field('petFriendly', 'Acepta mascotas', 'select', yesNo),
    field('backupPower', 'Respaldo eléctrico', 'select', yesNo),
    field('condoAmenities', 'Amenidades del edificio', 'textarea'),
    field('security', 'Seguridad'),
  ],
  condo: [
    field('floorLevel', 'Piso o nivel'),
    field('elevator', 'Ascensor', 'select', yesNo),
    field('balcony', 'Balcón', 'select', yesNo),
    field('furnished', 'Amueblado', 'select', yesNo),
    field('maintenanceFee', 'Cuota de condominio', 'number'),
    field('commonPool', 'Piscina común', 'select', yesNo),
    field('clubHouse', 'Casa club', 'select', yesNo),
    field('gym', 'Gimnasio', 'select', yesNo),
    field('petFriendly', 'Acepta mascotas', 'select', yesNo),
    field('condoAmenities', 'Amenidades del condominio', 'textarea'),
    field('security', 'Seguridad'),
  ],
  villa: [
    field('levels', 'Niveles', 'number'),
    field('pool', 'Piscina', 'select', yesNo),
    field('gardens', 'Jardines', 'select', yesNo),
    field('socialArea', 'Área social', 'select', yesNo),
    field('guestHouse', 'Casa de huéspedes', 'select', yesNo),
    field('furnished', 'Amueblada', 'select', yesNo),
    field('viewType', 'Tipo de vista'),
    field('waterTank', 'Tanque de agua', 'select', yesNo),
    field('security', 'Seguridad'),
  ],
  quinta: [
    field('pool', 'Piscina', 'select', yesNo),
    field('gardens', 'Jardines', 'select', yesNo),
    field('fruitTrees', 'Árboles frutales', 'select', yesNo),
    field('socialArea', 'Área social', 'select', yesNo),
    field('mainHouse', 'Casa principal', 'select', yesNo),
    field('caretakerHouse', 'Casa de cuidador', 'select', yesNo),
    field('well', 'Pozo', 'select', yesNo),
    field('waterSource', 'Fuente adicional de agua'),
    field('vehicleAccess', 'Acceso vehicular'),
    field('naturalEnvironment', 'Entorno natural'),
    field('potentialUse', 'Uso potencial', 'textarea'),
  ],
  land: [
    field('landType', 'Categoría del terreno', 'select', [
      ['urban', 'Urbano'],
      ['semiurban', 'Semiurbano'],
      ['semirural', 'Semirrural'],
      ['rural', 'Rural'],
    ]),
    field('frontage', 'Frente del terreno'),
    field('depth', 'Fondo aproximado'),
    field('topography', 'Topografía', 'select', [
      ['flat', 'Plana'],
      ['semiflat', 'Semiplana'],
      ['sloped', 'Inclinada'],
      ['mixed', 'Mixta'],
      ['irregular', 'Irregular'],
    ]),
    field('landShape', 'Forma del terreno', 'select', [
      ['regular', 'Regular'],
      ['irregular', 'Irregular'],
      ['rectangular', 'Rectangular'],
      ['corner', 'Esquinero'],
    ]),
    field('soilType', 'Tipo de suelo'),
    field('slopePercentage', 'Pendiente aproximada (%)', 'number'),
    field('streetType', 'Tipo de calle'),
    field('accessType', 'Tipo de acceso'),
    field('roadFrontage', 'Frente a vía principal', 'select', yesNo),
    field('utilitiesAtLot', 'Servicios al pie del terreno', 'textarea'),
    field('drainage', 'Condición de drenaje'),
    field('floodRisk', 'Riesgo de inundación', 'select', yesNo),
    field('zoning', 'Uso de suelo / zonificación'),
    field('potentialUse', 'Uso potencial', 'textarea'),
    field('documentation', 'Documentación disponible', 'textarea'),
  ],
  lot: [
    field('landType', 'Categoría del solar', 'select', [
      ['urban', 'Urbano'],
      ['semiurban', 'Semiurbano'],
      ['semirural', 'Semirrural'],
      ['rural', 'Rural'],
    ]),
    field('frontage', 'Frente del solar'),
    field('depth', 'Fondo aproximado'),
    field('topography', 'Topografía'),
    field('landShape', 'Forma del solar'),
    field('cornerLot', 'Esquinero', 'select', yesNo),
    field('soilType', 'Tipo de suelo'),
    field('streetType', 'Tipo de calle'),
    field('accessType', 'Acceso'),
    field('utilitiesAtLot', 'Servicios al pie del solar', 'textarea'),
    field('zoning', 'Uso de suelo / zonificación'),
    field('documentation', 'Documentación disponible', 'textarea'),
    field('potentialUse', 'Uso potencial', 'textarea'),
  ],
  farm: [
    field('currentUse', 'Uso actual', 'select', [
      ['cattle', 'Ganadería'],
      ['agriculture', 'Agricultura'],
      ['coffee', 'Café'],
      ['forestry', 'Forestal'],
      ['mixed', 'Mixto'],
      ['investment', 'Inversión'],
    ]),
    field('altitude', 'Altitud aproximada'),
    field('topography', 'Topografía'),
    field('accessType', 'Tipo de acceso'),
    field('streetType', 'Tipo de camino'),
    field('mainRoadDistance', 'Distancia a vía principal'),
    field('well', 'Pozo', 'select', yesNo),
    field('waterSource', 'Río, quebrada o fuente de agua'),
    field('fences', 'Cercas', 'select', yesNo),
    field('paddocks', 'Cantidad / distribución de potreros'),
    field('crops', 'Cultivos actuales'),
    field('productiveArea', 'Área productiva aproximada'),
    field('forestArea', 'Área de bosque aproximada'),
    field('existingInfrastructure', 'Infraestructura existente', 'textarea'),
    field('documentation', 'Documentación', 'textarea'),
    field('potentialUse', 'Potencial de la finca', 'textarea'),
  ],
  commercial: [
    field('commercialFront', 'Frente comercial'),
    field('trafficLevel', 'Nivel de tráfico'),
    field('pedestrianFlow', 'Flujo peatonal'),
    field('streetType', 'Tipo de calle'),
    field('commercialZone', 'Zona comercial'),
    field('restrooms', 'Baños / servicios sanitarios', 'number'),
    field('internalWarehouse', 'Bodega interna', 'select', yesNo),
    field('loadingArea', 'Área de carga y descarga', 'select', yesNo),
    field('threePhasePower', 'Energía trifásica', 'select', yesNo),
    field('permittedUse', 'Uso permitido'),
    field('idealFor', 'Ideal para', 'textarea'),
    field('security', 'Seguridad'),
  ],
  warehouse: [
    field('height', 'Altura libre'),
    field('floorCapacity', 'Capacidad / tipo de piso'),
    field('truckAccess', 'Acceso para camiones', 'select', yesNo),
    field('loadingDocks', 'Andenes de carga', 'number'),
    field('maneuveringYard', 'Patio de maniobras', 'select', yesNo),
    field('internalOffices', 'Oficinas internas', 'select', yesNo),
    field('restrooms', 'Baños para personal', 'number'),
    field('threePhasePower', 'Energía trifásica', 'select', yesNo),
    field('loadingArea', 'Área de carga y descarga', 'select', yesNo),
    field('fireSystem', 'Sistema contra incendios', 'select', yesNo),
    field('industrialZone', 'Zona industrial o comercial'),
    field('constructionStatus', 'Estado de la construcción'),
    field('security', 'Seguridad'),
  ],
  office: [
    field('privateRooms', 'Oficinas o ambientes privados', 'number'),
    field('restrooms', 'Baños / servicios sanitarios', 'number'),
    field('meetingRoom', 'Sala de reuniones', 'select', yesNo),
    field('reception', 'Recepción', 'select', yesNo),
    field('kitchenette', 'Cocineta', 'select', yesNo),
    field('elevator', 'Ascensor', 'select', yesNo),
    field('furnished', 'Amueblada', 'select', yesNo),
    field('networkWiring', 'Cableado de red', 'select', yesNo),
    field('connectivity', 'Internet y conectividad'),
    field('corporateLocation', 'Entorno corporativo'),
    field('security', 'Seguridad'),
  ],
  building: [
    field('levels', 'Cantidad de niveles', 'number'),
    field('units', 'Cantidad total de unidades', 'number'),
    field('residentialUnits', 'Unidades residenciales', 'number'),
    field('officeUnits', 'Oficinas', 'number'),
    field('commercialSpaces', 'Locales comerciales', 'number'),
    field('elevator', 'Ascensor', 'select', yesNo),
    field('emergencyStairs', 'Escaleras de emergencia', 'select', yesNo),
    field('occupancyStatus', 'Estado de ocupación'),
    field('occupancyPercentage', 'Ocupación aproximada (%)', 'number'),
    field('currentIncome', 'Ingreso mensual actual', 'number'),
    field('maintenanceCondition', 'Estado general de mantenimiento'),
    field('potentialUse', 'Uso potencial', 'textarea'),
  ],
  hotel: [
    field('rooms', 'Cantidad de habitaciones', 'number'),
    field('suites', 'Cantidad de suites', 'number'),
    field('occupancyStatus', 'Estado de operación'),
    field('occupancyPercentage', 'Ocupación promedio (%)', 'number'),
    field('reception', 'Recepción', 'select', yesNo),
    field('restaurant', 'Restaurante', 'select', yesNo),
    field('pool', 'Piscina', 'select', yesNo),
    field('conferenceRoom', 'Salón de eventos', 'select', yesNo),
    field('laundry', 'Lavandería', 'select', yesNo),
    field('parkingCapacity', 'Capacidad de estacionamiento', 'number'),
    field('furnished', 'Equipado y amueblado', 'select', yesNo),
    field('currentIncome', 'Ingreso mensual aproximado', 'number'),
    field('investmentDetails', 'Información para inversionistas', 'textarea'),
  ],
  investment: [
    field('projectType', 'Tipo de proyecto'),
    field('projectStage', 'Etapa actual del proyecto'),
    field('potentialUse', 'Uso potencial'),
    field('zoning', 'Uso de suelo / zonificación'),
    field('existingPermits', 'Permisos existentes'),
    field('availableStudies', 'Estudios disponibles'),
    field('infrastructureStatus', 'Infraestructura disponible'),
    field('capitalGainProjection', 'Proyección de plusvalía'),
    field('mainRoadsProximity', 'Cercanía a vías principales'),
    field('documentation', 'Documentación', 'textarea'),
    field('investorIdeal', 'Perfil de inversionista ideal', 'textarea'),
  ],
  beach_house: [
    field('beachDistance', 'Distancia al mar'),
    field('beachAccess', 'Acceso directo a playa', 'select', yesNo),
    field('oceanView', 'Vista al mar', 'select', yesNo),
    field('pool', 'Piscina', 'select', yesNo),
    field('furnished', 'Amueblada', 'select', yesNo),
    field('airConditioning', 'Aire acondicionado', 'select', yesNo),
    field('rentalPotential', 'Potencial de alquiler vacacional', 'textarea'),
    field('accessType', 'Tipo de acceso'),
    field('coastalProtection', 'Condición / protección costera'),
  ],
  other: [
    field('specificFeatures', 'Características específicas', 'textarea'),
    field('potentialUse', 'Uso potencial', 'textarea'),
    field('documentation', 'Documentación disponible', 'textarea'),
  ],
};

export const propertySections = [
  ['basic', 'Información principal'],
  ['commercial', 'Precio y publicación'],
  ['location', 'Ubicación y mapa'],
  ['details', 'Medidas y características'],
  ['media', 'Fotografías y multimedia'],
  ['marketing', 'Presentación y posicionamiento'],
];

const syncWorkspacePresetContext = (propertyType) => {
  const resolvedType = dynamicPropertyFields[propertyType] ? propertyType : 'other';
  featurePresets = featurePresetsByType[resolvedType] || featurePresetsByType.other;
  servicePresets = servicePresetsByType[resolvedType] || servicePresetsByType.other;

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.propertyType = resolvedType;
  }

  return resolvedType;
};

export const getDynamicFields = (propertyType) => {
  const resolvedType = syncWorkspacePresetContext(propertyType);
  return dynamicPropertyFields[resolvedType] || dynamicPropertyFields.other;
};
