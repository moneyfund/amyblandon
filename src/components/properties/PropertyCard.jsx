import { Bath, BedDouble, Car, Heart, Ruler, Share2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { money } from '../../utils/format';
import { useFavorites } from '../../hooks/useFavorites';
import { labelFor, operationTypeOptions } from '../../config/adminLabels.es';

const hasValue = (value) => value !== undefined && value !== null && value !== '' && Number(value) !== 0;
const imageUrl = (image) => typeof image === 'string' ? image : image?.url || '';

const firstText = (...values) => values.find((value) => typeof value === 'string' && value.trim())?.trim() || '';

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
          <span className="property-card__badge">{labelFor(operationTypeOptions, p.operationType || p.transactionType, 'Disponible')}</span>
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
        {(areaFeatures.length > 0 || roomFeatures.length > 0) && (
          <div className="property-features">
            {areaFeatures.length > 0 && (
              <div className="property-features__row property-features__row--areas">
                {areaFeatures.map((feature) => <FeatureItem key={feature.label} {...feature} />)}
              </div>
            )}
            {roomFeatures.length > 0 && (
              <div className="property-features__row property-features__row--rooms">
                {roomFeatures.map((feature) => <FeatureItem key={feature.label} {...feature} />)}
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
