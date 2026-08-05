import { Bath, BedDouble, Car, Heart, MapPin, Ruler, Share2, Waves } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { money } from '../../utils/format';
import { useFavorites } from '../../hooks/useFavorites';

const hasValue = (value) => value !== undefined && value !== null && value !== '' && Number(value) !== 0;
const imageUrl = (image) => typeof image === 'string' ? image : image?.url || '';

export default function PropertyCard({ property: p = {}, onSelect }) {
  const { toggle, isFavorite } = useFavorites();
  const location = useLocation();
  const identifier = p.slug || p.id;
  const detailPath = identifier ? `/properties/${encodeURIComponent(identifier)}` : '/propiedades';
  const coverImage = imageUrl(p.coverImage) || imageUrl(Array.isArray(p.images) ? p.images[0] : p.images);

  const shareUrl = () => {
    const { origin, pathname, hash } = window.location;
    if (hash) return `${origin}${pathname}#${detailPath}`;
    return `${origin}${detailPath}`;
  };

  const features = [
    hasValue(p.bedrooms) && { icon: BedDouble, value: p.bedrooms, label: 'Habitaciones' },
    hasValue(p.bathrooms) && { icon: Bath, value: p.bathrooms, label: 'Baños' },
    hasValue(p.parkingSpaces) && { icon: Car, value: p.parkingSpaces, label: 'Parqueo' },
    hasValue(p.pool) && { icon: Waves, value: p.pool, label: 'Piscina' },
    hasValue(p.builtArea || p.constructionArea || p.area) && {
      icon: Ruler,
      value: p.builtArea || p.constructionArea || p.area,
      label: 'Área total',
    },
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
        {coverImage ? (
          <img src={coverImage} alt={p.title || 'Propiedad'} />
        ) : (
          <span className="property-image__placeholder">Imagen pendiente</span>
        )}
      </Link>
      <div className="property-body">
        <strong className="property-price">{money(p.price, p.currency)}</strong>
        <h3><Link to={detailPath}>{p.title || 'Propiedad sin título'}</Link></h3>
        {(p.address || p.publicAddress || p.city || p.state) && (
          <p className="property-location">
            <MapPin size={15} />
            {p.address || p.publicAddress || [p.city, p.state].filter(Boolean).join(', ')}
          </p>
        )}
        {features.length > 0 && (
          <div className="property-features">
            {features.map(({ icon: Icon, value, label }) => (
              <span key={label}><Icon size={16} /><b>{value}</b>{label}</span>
            ))}
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
