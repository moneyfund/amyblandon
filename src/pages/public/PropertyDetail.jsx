import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download, MapPin } from 'lucide-react';
import { getProperties } from '../../services/propertyService';
import SimpleForm from '../../components/forms/SimpleForm';
import PropertyCard from '../../components/properties/PropertyCard';
import { money } from '../../utils/format';
import { downloadPropertyPDF } from '../../utils/pdf';
import { propertyWhatsApp } from '../../utils/whatsapp';
import SEO from '../../components/common/SEO';
import MapView from './MapView';

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

export default function PropertyDetail() {
  const { slug } = useParams();
  const [property, setProperty] = useState(null);
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

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

  if (loading) {
    return <section className="page-hero"><p>Cargando propiedad...</p></section>;
  }

  if (!property) {
    return (
      <section className="page-hero">
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

  const facts = [
    ['Habitaciones', property.bedrooms],
    ['Baños', property.bathrooms],
    ['Parqueos', property.parkingSpaces],
    ['Área', property.builtArea || property.constructionArea
      ? `${property.builtArea || property.constructionArea} ${property.areaUnit || 'm²'}`
      : '—'],
    ['Año', property.yearBuilt || '—'],
    ['Tipo', property.propertyType || '—'],
  ];

  return (
    <>
      <SEO title={`${property.title} | Amy Blandon`} />
      <section className="page-hero">
        {images.length ? (
          <div className="gallery">
            <img src={images[0]} alt={property.title} />
            <div>
              {images.slice(1, 4).map((image, index) => (
                <img key={image} src={image} alt={`${property.title} ${index + 2}`} />
              ))}
            </div>
          </div>
        ) : (
          <div className="panel"><p>Esta propiedad todavía no tiene fotografías disponibles.</p></div>
        )}

        <h1>{property.title}</h1>
        <h2>{money(property.price, property.currency)}</h2>
        {(property.address || property.publicAddress || property.city) && (
          <p><MapPin size={18} /> {property.address || property.publicAddress || property.city}</p>
        )}
        <p className="preline">{property.description || 'Descripción pendiente.'}</p>

        <div className="grid three">
          {facts.map(([label, value]) => (
            <div className="panel" key={label}>
              <b>{label}</b>
              <span>{value ?? '—'}</span>
            </div>
          ))}
        </div>

        <h2>Amenidades</h2>
        {amenities.length ? (
          <ul>{amenities.map((amenity) => <li key={amenity}>{amenity}</li>)}</ul>
        ) : (
          <p>Las amenidades se agregarán próximamente.</p>
        )}

        {hasCoordinates(property) ? (
          <MapView embedded properties={[property]} />
        ) : (
          <div className="panel">
            <h2>Ubicación</h2>
            <p>La ubicación exacta todavía no tiene coordenadas válidas para mostrarse en el mapa.</p>
          </div>
        )}

        <div className="panel">
          <h2>Amy Blandón</h2>
          <p>Te acompaño a revisar esta propiedad con estrategia, claridad y visión patrimonial.</p>
          <a className="btn" href={propertyWhatsApp(property)}>WhatsApp</a>
          <button className="btn secondary" type="button" onClick={() => downloadPropertyPDF(property)}>
            <Download size={18} /> Descargar ficha PDF
          </button>
        </div>

        <SimpleForm collection="contacts" extra={{ propertyId: property.id, propertyTitle: property.title }} />

        <h2>Propiedades similares</h2>
        <div className="grid cards">
          {all
            .filter((item) => item.id !== property.id)
            .slice(0, 3)
            .map((item) => <PropertyCard key={item.id || item.slug} property={item} />)}
        </div>
      </section>
    </>
  );
}
