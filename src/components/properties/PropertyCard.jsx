import { Bath, BedDouble, Car, Compass, Heart, Map as MapIcon, MapPin, Ruler, Share2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { money } from '../../utils/format';
import { useFavorites } from '../../hooks/useFavorites';
import { labelFor, operationTypeOptions, propertyStatusOptions } from '../../config/adminLabels.es';

const hasValue = (value) => value !== undefined && value !== null && value !== '' && Number(value) !== 0;
const imageUrl = (image) => typeof image === 'string' ? image : image?.url || '';

const firstText = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';

const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value;
};

const terminalStatuses = new Set(['sold', 'rented']);

const terrainValueLabels = {
  landType: { urban: 'Urbano', semiurban: 'Semiurbano', semirural: 'Semirrural', rural: 'Rural' },
  topography: { flat: 'Plana', semiflat: 'Semiplana', sloped: 'Inclinada', mixed: 'Mixta', irregular: 'Irregular' },
  landShape: { regular: 'Regular', irregular: 'Irregular', rectangular: 'Rectangular', corner: 'Esquinero' },
};

const propertyDetailValue = (property, key) => property?.[key] ?? property?.propertyDetails?.[key] ?? '';
const terrainValue = (key, value) => terrainValueLabels[key]?.[value] || value;

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

  const shareUrl = () => {
    const { origin, pathname, hash } = window.location;
    if (hash) return `${origin}${pathname}#${detailPath}`;
    return `${origin}${detailPath}`;
  };

  const areaFeatures = [
    hasValue(p.landArea || p.area) && {
      icon: Ruler,
      value: `${p.landArea || p.area} ${areaUnit}`,
      label: 'Área total',
    },
    hasValue(p.constructionArea || p.builtArea) && {
      icon: Ruler,
      value: `${p.constructionArea || p.builtArea} ${areaUnit}`,
      label: 'Área construida',
    },
  ].filter(Boolean);

  const roomFeatures = [
    hasValue(p.bedrooms) && { icon: BedDouble, value: p.bedrooms, label: 'Habitaciones' },
    hasValue(p.bathrooms) && { icon: Bath, value: p.bathrooms, label: 'Baños' },
    hasValue(p.parkingSpaces) && { icon: Car, value: p.parkingSpaces, label: 'Parqueo' },
  ].filter(Boolean);

  const isLandCard = ['land', 'lot'].includes(p.propertyType);
  const landType = propertyDetailValue(p, 'landType');
  const topography = propertyDetailValue(p, 'topography');
  const accessType = propertyDetailValue(p, 'accessType');
  const streetType = propertyDetailValue(p, 'streetType');
  const landShape = propertyDetailValue(p, 'landShape');
  const soilType = propertyDetailValue(p, 'soilType');
  const terrainFeatures = isLandCard ? [
    hasValue(p.landArea || p.area) && {
      icon: Ruler,
      value: `${p.landArea || p.area} ${areaUnit}`,
      label: 'Área total',
    },
    {
      icon: Compass,
      value: hasValue(landType) ? terrainValue('landType', landType) : p.propertyType === 'lot' ? 'Solar' : 'Terreno',
      label: 'Categoría',
    },
    hasValue(topography) && { icon: MapIcon, value: terrainValue('topography', topography), label: 'Topografía' },
    hasValue(accessType) && { icon: MapPin, value: accessType, label: 'Acceso' },
    hasValue(streetType) && { icon: Car, value: streetType, label: 'Calle' },
    hasValue(landShape) && { icon: MapIcon, value: terrainValue('landShape', landShape), label: 'Forma' },
    hasValue(soilType) && { icon: Compass, value: soilType, label: 'Suelo' },
  ].filter(Boolean).slice(0, 5) : [];

  const primaryFeatures = isLandCard ? terrainFeatures.slice(0, 2) : areaFeatures;
  const secondaryFeatures = isLandCard ? terrainFeatures.slice(2, 5) : roomFeatures;

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
        {(primaryFeatures.length > 0 || secondaryFeatures.length > 0) && (
          <div className="property-features">
            {primaryFeatures.length > 0 && (
              <div className="property-features__row property-features__row--areas">
                {primaryFeatures.map((feature) => <FeatureItem key={feature.label} {...feature} />)}
              </div>
            )}
            {secondaryFeatures.length > 0 && (
              <div className="property-features__row property-features__row--rooms">
                {secondaryFeatures.map((feature) => <FeatureItem key={feature.label} {...feature} />)}
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
