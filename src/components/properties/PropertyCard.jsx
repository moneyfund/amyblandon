import {
  Bath,
  BedDouble,
  Building2,
  Car,
  Compass,
  Heart,
  Home,
  Map as MapIcon,
  MapPin,
  Ruler,
  Share2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { money } from '../../utils/format';
import { useFavorites } from '../../hooks/useFavorites';
import {
  labelFor,
  operationTypeOptions,
  propertyStatusOptions,
  propertyTypeOptions,
} from '../../config/adminLabels.es';
import { getDynamicFields } from '../../config/propertyWorkspace.es';

const hasValue = (value) => value !== undefined && value !== null && value !== '' && Number(value) !== 0;
const imageUrl = (image) => typeof image === 'string' ? image : image?.url || '';

const firstText = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';

const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value;
};

const terminalStatuses = new Set(['sold', 'rented']);

const propertyDetailValue = (property, key) => property?.[key] ?? property?.propertyDetails?.[key] ?? '';

const compactValue = (value, maxLength = 20) => {
  const text = String(value ?? '').trim();
  if (!text) return '';
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}…` : text;
};

const featureIcons = {
  landArea: Ruler,
  constructionArea: Ruler,
  bedrooms: BedDouble,
  bathrooms: Bath,
  parkingSpaces: Car,
  yearBuilt: Building2,
  levels: Building2,
  livingRoom: Home,
  diningRoom: Home,
  kitchen: Home,
  patio: Home,
  terrace: Home,
  laundryArea: Home,
  furnished: Home,
  constructionStatus: Building2,
  security: ShieldCheck,
  floorLevel: Building2,
  elevator: Building2,
  balcony: Home,
  maintenanceFee: Sparkles,
  condoAmenities: Sparkles,
  pool: Sparkles,
  gardens: Compass,
  socialArea: Home,
  viewType: Compass,
  mainHouse: Home,
  caretakerHouse: Home,
  well: MapPin,
  vehicleAccess: Car,
  naturalEnvironment: Compass,
  potentialUse: Compass,
  landType: Compass,
  topography: MapIcon,
  landShape: MapIcon,
  soilType: Compass,
  streetType: Car,
  accessType: MapPin,
  documentation: ShieldCheck,
  currentUse: Compass,
  waterSource: MapPin,
  fences: ShieldCheck,
  paddocks: Compass,
  crops: Compass,
  existingInfrastructure: Building2,
  commercialFront: Ruler,
  trafficLevel: Car,
  commercialZone: MapPin,
  internalWarehouse: Building2,
  permittedUse: Compass,
  idealFor: Sparkles,
  height: Ruler,
  truckAccess: Car,
  internalOffices: Building2,
  threePhasePower: Sparkles,
  loadingArea: Car,
  industrialZone: MapPin,
  privateRooms: Home,
  meetingRoom: Home,
  reception: Home,
  connectivity: Sparkles,
  corporateLocation: MapPin,
  units: Home,
  commercialSpaces: Building2,
  occupancyStatus: Building2,
  currentIncome: Sparkles,
  rooms: BedDouble,
  restaurant: Home,
  conferenceRoom: Home,
  parkingCapacity: Car,
  investmentDetails: Sparkles,
  projectType: Building2,
  existingPermits: ShieldCheck,
  availableStudies: Sparkles,
  capitalGainProjection: Sparkles,
  mainRoadsProximity: MapPin,
  investorIdeal: Sparkles,
  beachDistance: MapPin,
  oceanView: Compass,
  rentalPotential: Sparkles,
  specificFeatures: Sparkles,
};

const featureLabels = {
  landArea: 'Área total',
  constructionArea: 'Construcción',
  bedrooms: 'Habitaciones',
  bathrooms: 'Baños',
  parkingSpaces: 'Parqueo',
  yearBuilt: 'Año',
  levels: 'Niveles',
  livingRoom: 'Sala',
  diningRoom: 'Comedor',
  kitchen: 'Cocina',
  patio: 'Patio',
  terrace: 'Terraza',
  laundryArea: 'Lavandería',
  furnished: 'Amueblada',
  constructionStatus: 'Construcción',
  security: 'Seguridad',
  floorLevel: 'Nivel',
  elevator: 'Ascensor',
  balcony: 'Balcón',
  maintenanceFee: 'Mantenimiento',
  condoAmenities: 'Amenidades',
  pool: 'Piscina',
  gardens: 'Jardines',
  socialArea: 'Área social',
  viewType: 'Vista',
  mainHouse: 'Casa principal',
  caretakerHouse: 'Casa cuidador',
  well: 'Pozo',
  vehicleAccess: 'Acceso vehicular',
  naturalEnvironment: 'Entorno',
  potentialUse: 'Uso potencial',
  landType: 'Categoría',
  topography: 'Topografía',
  landShape: 'Forma',
  soilType: 'Suelo',
  streetType: 'Calle',
  accessType: 'Acceso',
  documentation: 'Documentación',
  currentUse: 'Uso actual',
  waterSource: 'Agua',
  fences: 'Cercas',
  paddocks: 'Potreros',
  crops: 'Cultivos',
  existingInfrastructure: 'Infraestructura',
  commercialFront: 'Frente',
  trafficLevel: 'Tráfico',
  commercialZone: 'Zona',
  internalWarehouse: 'Bodega interna',
  permittedUse: 'Uso permitido',
  idealFor: 'Ideal para',
  height: 'Altura',
  truckAccess: 'Camiones',
  internalOffices: 'Oficinas',
  threePhasePower: 'Energía',
  loadingArea: 'Carga/descarga',
  industrialZone: 'Zona',
  privateRooms: 'Ambientes',
  meetingRoom: 'Sala reunión',
  reception: 'Recepción',
  connectivity: 'Conectividad',
  corporateLocation: 'Entorno',
  units: 'Unidades',
  commercialSpaces: 'Locales',
  occupancyStatus: 'Ocupación',
  currentIncome: 'Ingreso',
  rooms: 'Habitaciones',
  restaurant: 'Restaurante',
  conferenceRoom: 'Salón eventos',
  parkingCapacity: 'Parqueo',
  investmentDetails: 'Inversión',
  projectType: 'Proyecto',
  existingPermits: 'Permisos',
  availableStudies: 'Estudios',
  capitalGainProjection: 'Plusvalía',
  mainRoadsProximity: 'Vías principales',
  investorIdeal: 'Inversionista',
  beachDistance: 'Distancia al mar',
  oceanView: 'Vista al mar',
  rentalPotential: 'Alquiler vacacional',
  specificFeatures: 'Características',
};

const preferredFeatureKeys = {
  house: ['landArea', 'constructionArea', 'bedrooms', 'bathrooms', 'parkingSpaces', 'levels', 'terrace', 'security', 'yearBuilt'],
  apartment: ['constructionArea', 'bedrooms', 'bathrooms', 'parkingSpaces', 'floorLevel', 'elevator', 'balcony', 'furnished'],
  condo: ['constructionArea', 'bedrooms', 'bathrooms', 'parkingSpaces', 'floorLevel', 'elevator', 'balcony', 'furnished'],
  villa: ['landArea', 'constructionArea', 'bedrooms', 'bathrooms', 'parkingSpaces', 'pool', 'gardens', 'viewType'],
  quinta: ['landArea', 'constructionArea', 'mainHouse', 'pool', 'gardens', 'well', 'vehicleAccess', 'potentialUse'],
  beach_house: ['constructionArea', 'bedrooms', 'bathrooms', 'parkingSpaces', 'beachDistance', 'oceanView', 'pool', 'furnished'],
  land: ['landArea', 'landType', 'topography', 'accessType', 'streetType', 'landShape', 'soilType', 'potentialUse'],
  lot: ['landArea', 'landType', 'topography', 'accessType', 'streetType', 'landShape', 'soilType', 'potentialUse'],
  farm: ['landArea', 'currentUse', 'topography', 'accessType', 'waterSource', 'well', 'fences', 'crops', 'existingInfrastructure'],
  commercial: ['constructionArea', 'commercialFront', 'trafficLevel', 'streetType', 'parkingSpaces', 'commercialZone', 'internalWarehouse', 'permittedUse'],
  warehouse: ['constructionArea', 'height', 'truckAccess', 'loadingArea', 'threePhasePower', 'internalOffices', 'parkingSpaces', 'industrialZone'],
  office: ['constructionArea', 'privateRooms', 'meetingRoom', 'reception', 'elevator', 'parkingSpaces', 'furnished', 'connectivity'],
  building: ['constructionArea', 'levels', 'units', 'commercialSpaces', 'elevator', 'parkingSpaces', 'occupancyStatus', 'currentIncome'],
  hotel: ['rooms', 'parkingCapacity', 'pool', 'restaurant', 'conferenceRoom', 'furnished', 'occupancyStatus'],
  investment: ['landArea', 'projectType', 'potentialUse', 'mainRoadsProximity', 'existingPermits', 'availableStudies', 'capitalGainProjection'],
  other: ['constructionArea', 'landArea', 'parkingSpaces', 'yearBuilt', 'specificFeatures'],
};

const propertyLocationLabel = (property = {}) => {
  const country = firstText(property.country, 'Nicaragua');
  const department = firstText(
    property.department,
    property.state,
    property.region,
    property.province,
  );
  const neighborhood = firstText(
    property.sector,
    property.neighborhood,
    property.barrio,
    property.city,
  );

  return [neighborhood, department, country]
    .filter(Boolean)
    .filter((value, index, values) => (
      values.findIndex((item) => item.toLowerCase() === value.toLowerCase()) === index
    ))
    .join(', ');
};

const resolveCoreFeature = (property, key, areaUnit) => {
  if (key === 'landArea') {
    const value = property.landArea || property.area;
    return hasValue(value) ? { key, icon: Ruler, value: `${value} ${areaUnit}`, label: featureLabels[key] } : null;
  }
  if (key === 'constructionArea') {
    const value = property.constructionArea || property.builtArea;
    return hasValue(value) ? { key, icon: Ruler, value: `${value} ${areaUnit}`, label: featureLabels[key] } : null;
  }
  if (key === 'bedrooms') {
    return hasValue(property.bedrooms) ? { key, icon: BedDouble, value: property.bedrooms, label: featureLabels[key] } : null;
  }
  if (key === 'bathrooms') {
    return hasValue(property.bathrooms) ? { key, icon: Bath, value: property.bathrooms, label: featureLabels[key] } : null;
  }
  if (key === 'parkingSpaces') {
    return hasValue(property.parkingSpaces) ? { key, icon: Car, value: property.parkingSpaces, label: featureLabels[key] } : null;
  }
  if (key === 'yearBuilt') {
    return hasValue(property.yearBuilt) ? { key, icon: Building2, value: property.yearBuilt, label: featureLabels[key] } : null;
  }
  return null;
};

const resolveDynamicFeature = (property, key) => {
  const raw = propertyDetailValue(property, key);
  if (!hasValue(raw)) return null;

  const definition = getDynamicFields(property.propertyType).find((item) => item.key === key);
  const option = definition?.options?.find(([optionValue]) => String(optionValue) === String(raw));
  const displayValue = option?.[1] ?? raw;

  return {
    key,
    icon: featureIcons[key] || Sparkles,
    value: compactValue(displayValue),
    label: featureLabels[key] || definition?.label || 'Detalle',
  };
};

const buildCardFeatures = (property, areaUnit, operationLabel, statusLabel) => {
  const maxFeatures = property.propertyType === 'investment' ? 4 : 5;
  const preferred = preferredFeatureKeys[property.propertyType] || preferredFeatureKeys.other;
  const dynamicKeys = getDynamicFields(property.propertyType).map((item) => item.key);
  const orderedKeys = [...new Set([...preferred, ...dynamicKeys])];
  const features = [];
  const usedKeys = new Set();

  const addFeature = (feature) => {
    if (!feature || !hasValue(feature.value) || usedKeys.has(feature.key)) return;
    usedKeys.add(feature.key);
    features.push(feature);
  };

  orderedKeys.forEach((key) => {
    if (features.length >= maxFeatures) return;
    addFeature(resolveCoreFeature(property, key, areaUnit) || resolveDynamicFeature(property, key));
  });

  const genericFallbacks = [
    {
      key: 'propertyType',
      icon: Building2,
      value: labelFor(propertyTypeOptions, property.propertyType, 'Propiedad'),
      label: 'Tipo',
    },
    firstText(property.sector, property.city) && {
      key: 'city',
      icon: MapPin,
      value: compactValue(firstText(property.sector, property.city)),
      label: 'Ubicación',
    },
    firstText(property.department, property.state) && {
      key: 'department',
      icon: Compass,
      value: compactValue(firstText(property.department, property.state)),
      label: 'Departamento',
    },
    {
      key: 'status',
      icon: ShieldCheck,
      value: statusLabel,
      label: 'Estado',
    },
    !terminalStatuses.has(property.status) && {
      key: 'operation',
      icon: Sparkles,
      value: operationLabel,
      label: 'Operación',
    },
  ].filter(Boolean);

  genericFallbacks.forEach((feature) => {
    if (features.length < maxFeatures) addFeature(feature);
  });

  return features.slice(0, maxFeatures);
};

function UbiIcon() {
  return (
    <svg
      className="property-location__ubi-icon"
      viewBox="0 0 15 18"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="7.5" cy="5" r="3.25" />
      <path d="M7.5 8.25v7.25" />
    </svg>
  );
}

function FeatureItem({ icon: Icon, value, label }) {
  return (
    <div className="property-feature-item">
      <Icon size={16} aria-hidden="true" />
      <div>
        <b>{value}</b>
        <span>{label}</span>
      </div>
    </div>
  );
}

export default function PropertyCard({ property: p = {}, onSelect }) {
  const { toggle, isFavorite } = useFavorites();
  const location = useLocation();
  const identifier = p.slug || p.id;
  const detailPath = identifier ? `/properties/${encodeURIComponent(identifier)}` : '/propiedades';
  const coverImage = imageUrl(p.coverImage) || imageUrl(Array.isArray(p.images) ? p.images[0] : p.images);
  const locationLabel = propertyLocationLabel(p);
  const areaUnit = p.areaUnit || 'm²';
  const operationLabel = labelFor(operationTypeOptions, normalizeOperation(p.operationType || p.transactionType), 'Operación');
  const statusLabel = labelFor(propertyStatusOptions, p.status || 'available', 'Disponible');
  const cardFeatures = buildCardFeatures(p, areaUnit, operationLabel, statusLabel);
  const primaryFeatures = cardFeatures.slice(0, 2);
  const secondaryFeatures = cardFeatures.slice(2, 5);

  const shareUrl = () => {
    const { origin, pathname, hash } = window.location;
    if (hash) return `${origin}${pathname}#${detailPath}`;
    return `${origin}${detailPath}`;
  };

  const share = async () => {
    try {
      const url = shareUrl();
      if (navigator.share) await navigator.share({ title: p.title || 'Propiedad', url });
      else await navigator.clipboard?.writeText(url);
    } catch (error) {
      if (import.meta.env.DEV && error?.name !== 'AbortError') {
        console.warn('No se pudo compartir la propiedad.', error);
      }
    }
  };

  return (
    <article
      className="property-card"
      onMouseEnter={() => onSelect?.(p.id)}
      data-current-path={location.pathname}
    >
      <Link to={detailPath} className="property-image" aria-label={`Ver ${p.title || 'propiedad'}`}>
        <span className="property-card__badges">
          {!terminalStatuses.has(p.status) && <span className="property-card__badge">{operationLabel}</span>}
          <span className={`property-card__badge property-card__badge--${p.status || 'available'}`}>{statusLabel}</span>
        </span>
        {coverImage ? (
          <img src={coverImage} alt={p.title || 'Propiedad'} />
        ) : (
          <span className="property-image__placeholder">Imagen pendiente</span>
        )}
      </Link>
      <div className="property-body">
        <h3 className="property-card__title"><Link to={detailPath}>{p.title || 'Propiedad sin título'}</Link></h3>
        {locationLabel && (
          <p className="property-location">
            <UbiIcon />
            {locationLabel}
          </p>
        )}
        <div className="property-price-row">
          <strong className="property-price property-price--after-location">{money(p.price, p.currency)}</strong>
          {p.priceNegotiable && <span className="property-price-negotiable">Negociable</span>}
        </div>
        {cardFeatures.length > 0 && (
          <div className="property-features">
            {primaryFeatures.length > 0 && (
              <div className="property-features__row property-features__row--areas">
                {primaryFeatures.map((feature) => <FeatureItem key={feature.key} {...feature} />)}
              </div>
            )}
            {secondaryFeatures.length > 0 && (
              <div className="property-features__row property-features__row--rooms">
                {secondaryFeatures.map((feature) => <FeatureItem key={feature.key} {...feature} />)}
              </div>
            )}
          </div>
        )}
        <div className="property-actions">
          <Link className="text-link" to={detailPath}>Ver propiedad</Link>
          <button type="button" aria-label="Guardar" onClick={() => p.id && toggle(p.id)}>
            <Heart size={17} fill={p.id && isFavorite(p.id) ? 'currentColor' : 'none'} />
          </button>
          <button type="button" aria-label="Compartir" onClick={share}><Share2 size={17} /></button>
        </div>
      </div>
    </article>
  );
}
