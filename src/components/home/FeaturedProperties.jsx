import { useEffect, useState } from 'react';
import { ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../common/RevealOnScroll';
import PropertyCard from '../properties/PropertyCard';
import { getProperties } from '../../services/propertyService';

export default function FeaturedProperties({ content }) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;

    getProperties()
      .then((items) => {
        if (!active) return;
        setProperties(items.filter((property) => Boolean(property.featured)));
        setError(false);
      })
      .catch(() => {
        if (!active) return;
        setProperties([]);
        setError(true);
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const eyebrow = content?.featuredEyebrow || 'SELECCIÓN ESPECIAL';
  const title = content?.featuredTitle || 'Propiedades destacadas';
  const viewAll = content?.featuredViewAll || 'Ver más propiedades';

  return (
    <section className="home-featured" aria-labelledby="home-featured-title">
      <div className="home-featured__heading">
        <div>
          <p className="home-featured__eyebrow content-preserve-format">{eyebrow}</p>
          <h2 id="home-featured-title" className="content-preserve-format">{title}</h2>
        </div>
        <Link className="home-featured__view-all" to="/bienes-raices">
          {viewAll} <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>

      {loading ? (
        <div className="home-featured__track" aria-label="Cargando propiedades destacadas">
          {[0, 1, 2].map((item) => (
            <div className="home-featured__skeleton" key={item} aria-hidden="true">
              <span />
              <div><i /><i /><i /></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="home-featured__empty" role="status">
          <Building2 aria-hidden="true" />
          <div>
            <h3>No pudimos cargar las propiedades destacadas.</h3>
            <p>Puedes explorar el portafolio completo desde la sección de Bienes Raíces.</p>
          </div>
          <Link to="/bienes-raices">Ver propiedades</Link>
        </div>
      ) : properties.length === 0 ? (
        <div className="home-featured__empty">
          <Building2 aria-hidden="true" />
          <div>
            <h3>Próximamente nuevas propiedades destacadas.</h3>
            <p>Las propiedades marcadas como “Destacar en inicio” desde el panel aparecerán automáticamente aquí.</p>
          </div>
          <Link to="/bienes-raices">Ver portafolio</Link>
        </div>
      ) : (
        <div className="home-featured__track">
          {properties.map((property, index) => (
            <RevealOnScroll
              as="div"
              className="home-featured__item"
              delay={Math.min(index, 5) * 70}
              key={property.id}
            >
              <PropertyCard property={property} />
            </RevealOnScroll>
          ))}
        </div>
      )}
    </section>
  );
}
