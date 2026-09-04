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
  ExternalLink,
  MapPin,
  MessageCircle,
  PlayCircle,
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
  propertyStatusOptions,
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

const getVideoMeta = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();

    if (host === 'tiktok.com' || host.endsWith('.tiktok.com')) {
      return { url: raw, platform: 'TikTok', action: 'Ver video en TikTok' };
    }

    if (host === 'youtu.be' || host === 'youtube.com' || host.endsWith('.youtube.com')) {
      return { url: raw, platform: 'YouTube', action: 'Ver video en YouTube' };
    }

    return { url: raw, platform: 'Video de la propiedad', action: 'Ver video' };
  } catch {
    return null;
  }
};

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    setGalleryIndex(0);
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
    if (galleryIndex >= images.length) setGalleryIndex(0);
  }, [galleryIndex, images.length]);

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
        <Link className="btn" to="/bienes-raices">Volver a propiedades</Link>
      </section>
    );
  }

  const structuredAmenities = [
    ...listValue(property.features),
    ...listValue(property.services),
  ].filter((item, index, values) => values.indexOf(item) === index);

  const amenities = property._hasStructuredAmenities
    ? structuredAmenities
    : [...listValue(property.amenities), ...structuredAmenities]
      .filter((item, index, values) => values.indexOf(item) === index);

  const videoMeta = getVideoMeta(property.videoUrl);
  const propertyTypeLabel = labelFor(propertyTypeOptions, property.propertyType, 'Propiedad');
  const operation = normalizeOperation(property.operationType || property.transactionType);
  const operationLabel = labelFor(operationTypeOptions, operation, 'Operación');
  const statusLabel = labelFor(propertyStatusOptions, property.status || 'available', 'Disponible');
  const locationText = property.publicAddress
    || [property.sector, property.city, property.department].filter(Boolean).join(', ')
    || property.city
    || 'Nicaragua';
  const priceLabel = property.priceOnRequest ? 'Precio a consultar' : money(property.price, property.currency);

  const facts = [
    hasValue(property.bedrooms) && { icon: BedDouble, label: 'Habitaciones', value: property.bedrooms },
    hasValue(property.bathrooms) && { icon: Bath, label: 'Baños', value: property.bathrooms },
    hasValue(property.parkingSpaces) && { icon: Car, label: 'Estacionamientos', value: property.parkingSpaces },
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
      return { label: definition.label, value: optionLabel(definition, value) };
    })
    .filter(Boolean);

  const technicalDetails = [
    { label: 'Tipo de propiedad', value: propertyTypeLabel },
    { label: 'Operación', value: operationLabel },
    { label: 'Estado', value: statusLabel },
    hasValue(property.constructionArea || property.builtArea) && {
      label: 'Área de construcción',
      value: `${property.constructionArea || property.builtArea} ${property.areaUnit || 'm²'}`,
    },
    hasValue(property.landArea) && {
      label: 'Tamaño del terreno',
      value: `${property.landArea} ${property.areaUnit || 'm²'}`,
    },
    hasValue(property.bedrooms) && { label: 'Dormitorios', value: property.bedrooms },
    hasValue(property.bathrooms) && { label: 'Baños', value: property.bathrooms },
    hasValue(property.parkingSpaces) && { label: 'Estacionamientos', value: property.parkingSpaces },
    hasValue(property.yearBuilt) && { label: 'Año de construcción', value: property.yearBuilt },
    ...dynamicDetails,
  ].filter(Boolean).filter((item, index, values) => values.findIndex((candidate) => candidate.label === item.label) === index);

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

  const moveGallery = (direction) => {
    if (images.length < 2) return;
    setGalleryIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <div className="property-detail-page property-detail-reference">
      <SEO title={`${property.title} | Amy Blandón`} description={property.shortDescription || property.description} />

      <div className="pd-ref-shell pd-ref-breadcrumb">
        <Link to="/"><span>Inicio</span></Link>
        <span>/</span>
        <Link to="/bienes-raices">Bienes raíces</Link>
        <span>/</span>
        <span>{propertyTypeLabel}</span>
        <span>/</span>
        <strong>{property.title}</strong>
      </div>

      <section className="pd-ref-shell pd-ref-showcase">
        <div className="pd-ref-gallery">
          <div className="pd-ref-gallery__stage">
            {images.length ? (
              <>
                <button
                  type="button"
                  className="pd-ref-gallery__main"
                  onClick={() => setLightboxIndex(galleryIndex)}
                  aria-label={`Abrir fotografía ${galleryIndex + 1} de ${images.length}`}
                >
                  <img src={images[galleryIndex]} alt={property.title} />
                </button>
                {images.length > 1 && (
                  <>
                    <button type="button" className="pd-ref-gallery__arrow pd-ref-gallery__arrow--prev" onClick={() => moveGallery(-1)} aria-label="Fotografía anterior">
                      <ChevronLeft />
                    </button>
                    <button type="button" className="pd-ref-gallery__arrow pd-ref-gallery__arrow--next" onClick={() => moveGallery(1)} aria-label="Fotografía siguiente">
                      <ChevronRight />
                    </button>
                  </>
                )}
                <span className="pd-ref-gallery__counter">{galleryIndex + 1} / {images.length}</span>
              </>
            ) : (
              <div className="pd-ref-gallery__empty"><Building2 /><span>Fotografías próximamente</span></div>
            )}
          </div>

          {images.length > 1 && (
            <div className="pd-ref-gallery__thumbs" aria-label="Miniaturas de la propiedad">
              {images.map((image, index) => (
                <button
                  type="button"
                  key={image}
                  className={index === galleryIndex ? 'is-active' : ''}
                  onClick={() => setGalleryIndex(index)}
                  aria-label={`Ver fotografía ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <aside className="pd-ref-summary">
          <div className="pd-ref-summary__badges">
            {!['sold', 'rented'].includes(property.status) && <span>{operationLabel}</span>}
            <span>{statusLabel}</span>
            {property.featured && <span className="is-featured"><Sparkles size={13} /> Destacada</span>}
          </div>
          <h1>{property.title}</h1>
          <p className="pd-ref-summary__location"><MapPin /> {locationText}</p>

          <div className="pd-ref-summary__price">
            <small>{operation === 'rent' ? 'Precio de alquiler' : 'Precio'}</small>
            <strong>{priceLabel}</strong>
            {property.priceNegotiable && <span>Precio negociable</span>}
          </div>

          {facts.length > 0 && (
            <div className="pd-ref-summary__facts">
              {facts.slice(0, 4).map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <Icon />
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pd-ref-summary__actions">
            <a className="pd-ref-action pd-ref-action--primary" href={propertyWhatsApp(property)}>
              <MessageCircle /> Consultar por WhatsApp
            </a>
            <a className="pd-ref-action pd-ref-action--secondary" href="#solicitar-informacion">
              <CalendarDays /> Agendar visita
            </a>
            <button type="button" className="pd-ref-action pd-ref-action--text" onClick={() => downloadPropertyPDF(property)}>
              <Download /> Descargar ficha PDF
            </button>
          </div>
        </aside>
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
            <div><strong>{property.title}</strong><span>{lightboxIndex + 1} / {images.length}</span></div>
            <button type="button" onClick={() => setLightboxIndex(null)} aria-label="Cerrar galería"><X /></button>
          </div>
          <div className="property-lightbox__stage">
            {images.length > 1 && <button className="property-lightbox__arrow property-lightbox__arrow--prev" type="button" onClick={showPreviousPhoto} aria-label="Fotografía anterior"><ChevronLeft /></button>}
            <img src={images[lightboxIndex]} alt={`${property.title} ${lightboxIndex + 1}`} />
            {images.length > 1 && <button className="property-lightbox__arrow property-lightbox__arrow--next" type="button" onClick={showNextPhoto} aria-label="Fotografía siguiente"><ChevronRight /></button>}
          </div>
          {images.length > 1 && (
            <div className="property-lightbox__thumbs" aria-label="Miniaturas de la galería">
              {images.map((image, index) => (
                <button type="button" key={image} className={index === lightboxIndex ? 'is-active' : ''} onClick={() => setLightboxIndex(index)} aria-label={`Ver fotografía ${index + 1}`} aria-current={index === lightboxIndex ? 'true' : undefined}>
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <section className="pd-ref-shell pd-ref-info-grid">
        <article className="pd-ref-panel pd-ref-description">
          <p className="pd-ref-eyebrow">DESCRIPCIÓN</p>
          <span className="pd-ref-accent" />
          <div className="preline">{property.description || 'Descripción pendiente.'}</div>
        </article>

        <article className="pd-ref-panel pd-ref-details">
          <p className="pd-ref-eyebrow">DETALLES DE LA PROPIEDAD</p>
          <span className="pd-ref-accent" />
          <dl>
            {technicalDetails.map(({ label, value }) => (
              <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
            ))}
          </dl>
        </article>
      </section>

      <section className="pd-ref-shell pd-ref-secondary-grid">
        <article className="pd-ref-panel pd-ref-amenities">
          <p className="pd-ref-eyebrow">ÁREAS Y CARACTERÍSTICAS</p>
          <span className="pd-ref-accent" />
          {amenities.length > 0 ? (
            <div className="pd-ref-amenities__grid">
              {amenities.map((amenity) => <span key={amenity}><Check /> {amenity}</span>)}
            </div>
          ) : (
            <p className="pd-ref-empty-copy">Las características adicionales de esta propiedad se actualizarán próximamente.</p>
          )}
        </article>

        <article className="pd-ref-panel pd-ref-location">
          <p className="pd-ref-eyebrow">UBICACIÓN</p>
          <span className="pd-ref-accent" />
          {hasCoordinates(property) ? (
            <div className="pd-ref-map"><MapView embedded properties={[property]} /></div>
          ) : (
            <div className="pd-ref-map-empty"><MapPin /><span>{locationText}</span></div>
          )}
          <p className="pd-ref-location__text"><MapPin size={16} /> {locationText}</p>
        </article>
      </section>

      {videoMeta && (
        <section className="pd-ref-shell pd-ref-video">
          <div className="pd-ref-video__icon"><PlayCircle /></div>
          <div>
            <p className="pd-ref-eyebrow">RECORRIDO EN VIDEO</p>
            <h2>Conoce la propiedad con más detalle</h2>
            <p>Abre el recorrido publicado por Amy y explora los espacios antes de coordinar tu visita.</p>
          </div>
          <a href={videoMeta.url} target="_blank" rel="noopener noreferrer">{videoMeta.action} <ExternalLink /></a>
        </section>
      )}

      <section className="pd-ref-shell pd-ref-cta">
        <div className="pd-ref-cta__mark">AB</div>
        <div>
          <p>¿Te imaginas viviendo o invirtiendo aquí?</p>
          <span>Contáctame para más información o agenda una visita personalizada.</span>
        </div>
        <a href={propertyWhatsApp(property)}><MessageCircle /> Consultar por WhatsApp <ChevronRight /></a>
      </section>

      <section className="pd-ref-contact-section" id="solicitar-informacion">
        <div className="pd-ref-shell pd-ref-contact-grid">
          <div className="pd-ref-contact-copy">
            <p className="pd-ref-eyebrow">ASESORÍA PERSONALIZADA</p>
            <h2>Agenda una visita con Amy Blandón</h2>
            <p>Cuéntame qué necesitas y coordinamos una visita o una conversación para revisar esta propiedad con calma.</p>
            <a href={propertyWhatsApp(property)}><MessageCircle /> Escribir por WhatsApp</a>
          </div>
          <div className="pd-ref-form-card">
            <h3>Solicitar información</h3>
            <SimpleForm collection="contacts" extra={{ propertyId: property.id, propertyTitle: property.title }} />
          </div>
        </div>
      </section>

      {similar.length > 0 && (
        <section className="pd-ref-shell pd-ref-similar">
          <div className="pd-ref-section-heading">
            <div><p className="pd-ref-eyebrow">SIGUE EXPLORANDO</p><h2>Propiedades que podrían interesarte</h2></div>
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
