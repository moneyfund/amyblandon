import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Bath,
  BedDouble,
  Building2,
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  MapPin,
  MessageCircle,
  Ruler,
  Sparkles,
  X,
} from 'lucide-react';
import { getProperties } from '../../services/propertyService';
import SimpleForm from '../../components/forms/SimpleForm';
import PropertyCard from '../../components/properties/PropertyCard';
import { money } from '../../utils/format';
import { downloadPropertyPDF } from '../../utils/pdf';
import { propertyWhatsApp } from '../../utils/whatsapp';
import SEO from '../../components/common/SEO';
import MapView from './MapView';
import {
  labelFor,
  operationTypeOptions,
  propertyTypeOptions,
} from '../../config/adminLabels.es';
import { getDynamicFields } from '../../config/propertyWorkspace.es';

const imageUrl = (image) => {
  if (typeof image === 'string') return image;
  return image?.url || '';
};

const listValue = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean);
  }
  return [];
};

const hasCoordinates = (property) => {
  const latitude = Number(property?.latitude);
  const longitude = Number(property?.longitude);
  return Number.isFinite(latitude)
    && Number.isFinite(longitude)
    && latitude >= -90
    && latitude <= 90
    && longitude >= -180
    && longitude <= 180
    && !(latitude === 0 && longitude === 0);
};

const hasValue = (value) => value !== undefined && value !== null && value !== '' && Number(value) !== 0;

const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value;
};

const optionLabel = (definition, value) => {
  if (!definition?.options?.length) return value;
  return definition.options.find(([optionValue]) => optionValue === value)?.[1] || value;
};

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setLightboxIndex(null);

    getProperties()
      .then((result) => {
        if (!active) return;
        const properties = Array.isArray(result) ? result : [];
        setAll(properties);
        setProperty(properties.find((item) => item.slug === slug || item.id === slug) || null);
      })
      .catch(() => {
        if (!active) return;
        setAll([]);
        setProperty(null);
        setError('No se pudo cargar la información de esta propiedad.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [slug]);

  const images = useMemo(() => {
    if (!property) return [];
    const gallery = Array.isArray(property.images) ? property.images : [property.images];
    return [property.coverImage, ...gallery]
      .map(imageUrl)
      .filter(Boolean)
      .filter((url, index, values) => values.indexOf(url) === index);
  }, [property]);

  useEffect(() => {
    if (lightboxIndex === null || images.length === 0) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
        return;
      }

      if (event.key === 'ArrowRight') {
        setLightboxIndex((current) => (current === null ? null : (current + 1) % images.length));
      }

      if (event.key === 'ArrowLeft') {
        setLightboxIndex((current) => (current === null ? null : (current - 1 + images.length) % images.length));
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, images.length]);

  if (loading) {
    return (
      <section className="property-detail-state">
        <span className="property-detail-state__loader" />
        <p>Cargando propiedad...</p>
      </section>
    );
  }

  if (!property) {
    return (
      <section className="property-detail-state">
        <Building2 />
        <h1>{error ? 'No pudimos cargar la propiedad' : 'Propiedad no encontrada'}</h1>
        <p>{error || 'Esta propiedad no existe o ya no se encuentra publicada.'}</p>
        <Link className="btn" to="/propiedades">Volver a propiedades</Link>
      </section>
    );
  }

  const amenities = [
    ...listValue(property.amenities),
    ...listValue(property.features),
    ...listValue(property.services),
  ].filter((item, index, values) => values.indexOf(item) === index);

  const propertyTypeLabel = labelFor(propertyTypeOptions, property.propertyType, 'Propiedad');
  const operation = normalizeOperation(property.operationType || property.transactionType);
  const operationLabel = labelFor(operationTypeOptions, operation, 'Disponible');
  const locationText = property.publicAddress
    || [property.sector, property.city, property.department].filter(Boolean).join(', ')
    || property.city
    || 'Nicaragua';
  const priceLabel = property.priceOnRequest ? 'Precio a consultar' : money(property.price, property.currency);

  const facts = [
    hasValue(property.bedrooms) && { icon: BedDouble, label: 'Habitaciones', value: property.bedrooms },
    hasValue(property.bathrooms) && { icon: Bath, label: 'Baños', value: property.bathrooms },
    hasValue(property.parkingSpaces) && { icon: Car, label: 'Parqueos', value: property.parkingSpaces },
    hasValue(property.constructionArea || property.builtArea) && {
      icon: Ruler,
      label: 'Construcción',
      value: `${property.constructionArea || property.builtArea} ${property.areaUnit || 'm²'}`,
    },
    hasValue(property.landArea) && {
      icon: Ruler,
      label: 'Terreno',
      value: `${property.landArea} ${property.areaUnit || 'm²'}`,
    },
    hasValue(property.yearBuilt) && { icon: CalendarDays, label: 'Año', value: property.yearBuilt },
  ].filter(Boolean);

  const dynamicDetails = getDynamicFields(property.propertyType)
    .map((definition) => {
      const value = property.propertyDetails?.[definition.key];
      if (!hasValue(value)) return null;
      return {
        label: definition.label,
        value: optionLabel(definition, value),
      };
    })
    .filter(Boolean);

  const similar = all
    .filter((item) => item.id !== property.id)
    .sort((a, b) => Number(b.propertyType === property.propertyType) - Number(a.propertyType === property.propertyType))
    .slice(0, 3);

  const showPreviousPhoto = () => {
    setLightboxIndex((current) => (current === null ? null : (current - 1 + images.length) % images.length));
  };

  const showNextPhoto = () => {
    setLightboxIndex((current) => (current === null ? null : (current + 1) % images.length));
  };

  return (
    <div className="property-detail-page">
      <SEO title={`${property.title} | Amy Blandón`} description={property.shortDescription || property.description} />

      <div className="property-detail-shell property-detail-breadcrumb">
        <Link to="/bienes-raices"><ArrowLeft size={17} /> Bienes raíces</Link>
        <span>/</span>
        <span>{propertyTypeLabel}</span>
      </div>

      <section className="property-detail-shell property-detail-head">
        <div className="property-detail-head__copy">
          <div className="property-detail-head__badges">
            <span>{operationLabel}</span>
            {property.featured && <span className="is-featured"><Sparkles size={14} /> Destacada</span>}
          </div>
          <p className="property-detail-head__type">{propertyTypeLabel}</p>
          <h1>{property.title}</h1>
          <p className="property-detail-head__location"><MapPin size={18} /> {locationText}</p>
        </div>
        <div className="property-detail-head__price">
          <small>{operation === 'rent' ? 'Precio de alquiler' : 'Precio de venta'}</small>
          <strong>{priceLabel}</strong>
          {property.priceNegotiable && <span>Precio negociable</span>}
        </div>
      </section>

      <section className={`property-detail-shell property-detail-gallery property-detail-gallery--${Math.min(images.length, 4)}`}>
        {images.length ? (
          <>
            <button
              className="property-detail-gallery__main"
              type="button"
              onClick={() => setLightboxIndex(0)}
              aria-label={`Abrir fotografía 1 de ${images.length}`}
            >
              <img src={images[0]} alt={property.title} />
              <span className="property-detail-gallery__count">{images.length} {images.length === 1 ? 'foto' : 'fotos'}</span>
            </button>
            {images.length > 1 && (
              <div className="property-detail-gallery__side">
                {images.slice(1, 4).map((image, index) => (
                  <button
                    className="property-detail-gallery__thumb"
                    type="button"
                    key={image}
                    onClick={() => setLightboxIndex(index + 1)}
                    aria-label={`Abrir fotografía ${index + 2} de ${images.length}`}
                  >
                    <img src={image} alt={`${property.title} ${index + 2}`} />
                    {index === 2 && images.length > 4 && <span>+{images.length - 4}</span>}
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="property-detail-gallery__empty">
            <Building2 />
            <span>Fotografías próximamente</span>
          </div>
        )}
      </section>

      {lightboxIndex !== null && images[lightboxIndex] && (
        <div
          className="property-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`Galería de ${property.title}`}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setLightboxIndex(null);
          }}
        >
          <div className="property-lightbox__topbar">
            <div>
              <strong>{property.title}</strong>
              <span>{lightboxIndex + 1} / {images.length}</span>
            </div>
            <button type="button" onClick={() => setLightboxIndex(null)} aria-label="Cerrar galería">
              <X />
            </button>
          </div>

          <div className="property-lightbox__stage">
            {images.length > 1 && (
              <button
                className="property-lightbox__arrow property-lightbox__arrow--prev"
                type="button"
                onClick={showPreviousPhoto}
                aria-label="Fotografía anterior"
              >
                <ChevronLeft />
              </button>
            )}

            <img src={images[lightboxIndex]} alt={`${property.title} ${lightboxIndex + 1}`} />

            {images.length > 1 && (
              <button
                className="property-lightbox__arrow property-lightbox__arrow--next"
                type="button"
                onClick={showNextPhoto}
                aria-label="Fotografía siguiente"
              >
                <ChevronRight />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="property-lightbox__thumbs" aria-label="Miniaturas de la galería">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={index === lightboxIndex ? 'is-active' : ''}
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`Ver fotografía ${index + 1}`}
                  aria-current={index === lightboxIndex ? 'true' : undefined}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {facts.length > 0 && (
        <section className="property-detail-shell property-detail-facts" aria-label="Datos principales">
          {facts.map(({ icon: Icon, label, value }) => (
            <div className="property-detail-fact" key={label}>
              <Icon />
              <span><small>{label}</small><strong>{value}</strong></span>
            </div>
          ))}
        </section>
      )}

      <div className="property-detail-shell property-detail-layout">
        <main className="property-detail-content">
          <section className="property-detail-section">
            <p className="property-detail-eyebrow">SOBRE LA PROPIEDAD</p>
            <h2>Descripción</h2>
            <div className="property-detail-description preline">{property.description || 'Descripción pendiente.'}</div>
          </section>

          {amenities.length > 0 && (
            <section className="property-detail-section">
              <p className="property-detail-eyebrow">LO QUE OFRECE</p>
              <h2>Características y servicios</h2>
              <div className="property-detail-amenities">
                {amenities.map((amenity) => <span key={amenity}><Check /> {amenity}</span>)}
              </div>
            </section>
          )}

          {dynamicDetails.length > 0 && (
            <section className="property-detail-section">
              <p className="property-detail-eyebrow">DETALLES</p>
              <h2>Información adicional</h2>
              <dl className="property-detail-specs">
                {dynamicDetails.map(({ label, value }) => (
                  <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
                ))}
              </dl>
            </section>
          )}
        </main>

        <aside className="property-detail-sidebar">
          <div className="property-detail-contact">
            <span className="property-detail-contact__mark">AB</span>
            <p className="property-detail-eyebrow">ASESORÍA PERSONALIZADA</p>
            <h2>Amy Blandón</h2>
            <p>Conversemos sobre esta propiedad y revisemos juntos si encaja con lo que estás buscando.</p>
            <a className="property-detail-contact__whatsapp" href={propertyWhatsApp(property)}>
              <MessageCircle /> Consultar por WhatsApp
            </a>
            <button type="button" onClick={() => downloadPropertyPDF(property)}>
              <Download /> Descargar ficha PDF
            </button>
          </div>

          <div className="property-detail-inquiry">
            <h3>Solicitar información</h3>
            <p>Déjame tus datos y me pondré en contacto contigo.</p>
            <SimpleForm collection="contacts" extra={{ propertyId: property.id, propertyTitle: property.title }} />
          </div>
        </aside>
      </div>

      <section className="property-detail-location-section">
        <div className="property-detail-shell">
          <div className="property-detail-section-heading">
            <div><p className="property-detail-eyebrow">UBICACIÓN</p><h2>Conoce el entorno</h2></div>
            <p>{locationText}</p>
          </div>
          {hasCoordinates(property) ? (
            <div className="property-detail-map"><MapView embedded properties={[property]} /></div>
          ) : (
            <div className="property-detail-map-empty"><MapPin /><p>La ubicación exacta todavía no tiene coordenadas válidas para mostrarse en el mapa.</p></div>
          )}
        </div>
      </section>

      {similar.length > 0 && (
        <section className="property-detail-shell property-detail-similar">
          <div className="property-detail-section-heading">
            <div><p className="property-detail-eyebrow">SIGUE EXPLORANDO</p><h2>Propiedades que podrían interesarte</h2></div>
            <Link to="/bienes-raices">Ver más propiedades</Link>
          </div>
          <div className="properties-grid">
            {similar.map((item) => <PropertyCard key={item.id || item.slug} property={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
