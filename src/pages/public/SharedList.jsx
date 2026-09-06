import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, LockKeyhole, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import PropertyCard from '../../components/properties/PropertyCard';
import SEO from '../../components/common/SEO';
import { getProperties } from '../../services/propertyService';
import { getSharedList } from '../../services/sharedListService';
import '../../styles/shared-lists.css';

export default function SharedList() {
  const { token } = useParams();
  const [list, setList] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');

    Promise.all([getSharedList(token), getProperties()])
      .then(([sharedList, publishedProperties]) => {
        if (!active) return;
        if (!sharedList) {
          setList(null);
          setProperties([]);
          setError('Esta selección no existe, fue eliminada o ya no está disponible.');
          return;
        }

        setList(sharedList);
        setProperties(Array.isArray(publishedProperties) ? publishedProperties : []);
      })
      .catch(() => {
        if (!active) return;
        setList(null);
        setProperties([]);
        setError('No pudimos abrir esta selección en este momento.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  const selectedProperties = useMemo(() => {
    if (!list?.propertyIds?.length) return [];
    const byId = new Map(properties.map((property) => [property.id, property]));
    return list.propertyIds.map((id) => byId.get(id)).filter(Boolean);
  }, [list, properties]);

  if (loading) {
    return (
      <section className="shared-list-public shared-list-public--state">
        <div className="shared-list-public__state-card">
          <span className="shared-list-public__loader" />
          <h1>Preparando tu selección</h1>
          <p>Estamos cargando las propiedades que Amy eligió para ti.</p>
        </div>
      </section>
    );
  }

  if (!list) {
    return (
      <section className="shared-list-public shared-list-public--state">
        <SEO title="Selección no disponible | Amy Blandón" />
        <div className="shared-list-public__state-card">
          <LockKeyhole />
          <h1>Selección no disponible</h1>
          <p>{error}</p>
          <Link className="shared-list-public__back" to="/bienes-raices"><ArrowLeft /> Ver propiedades</Link>
        </div>
      </section>
    );
  }

  return (
    <div className="shared-list-public">
      <SEO
        title={`${list.listName || 'Selección de propiedades'} | Amy Blandón`}
        description={`Selección inmobiliaria privada preparada para ${list.clientName || 'un cliente'}.`}
      />

      <section className="shared-list-public__hero">
        <div className="shared-list-public__hero-inner">
          <Link className="shared-list-public__back" to="/bienes-raices"><ArrowLeft /> Bienes raíces</Link>
          <div className="shared-list-public__eyebrow"><Sparkles /> Selección inmobiliaria personalizada</div>
          <p className="shared-list-public__client">Preparada para <strong>{list.clientName || 'ti'}</strong></p>
          <h1>{list.listName || 'Propiedades seleccionadas para ti'}</h1>
          <p className="shared-list-public__lead">
            Amy Blandón ha preparado esta selección de propiedades para que puedas revisarlas con calma, comparar opciones y abrir cada ficha con todos sus detalles.
          </p>
          <div className="shared-list-public__summary">
            <strong>{selectedProperties.length}</strong>
            <span>{selectedProperties.length === 1 ? 'propiedad seleccionada' : 'propiedades seleccionadas'}</span>
          </div>
        </div>
      </section>

      <section className="shared-list-public__catalog">
        <div className="shared-list-public__shell">
          <div className="shared-list-public__catalog-heading">
            <div>
              <p>SELECCIÓN PRIVADA</p>
              <h2>Explora las propiedades</h2>
            </div>
            <span>Abre cualquier propiedad para ver fotografías, ubicación y detalles completos.</span>
          </div>

          {selectedProperties.length ? (
            <div className="properties-grid shared-list-public__grid">
              {selectedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="shared-list-public__empty">
              <h3>Esta selección no tiene propiedades disponibles en este momento.</h3>
              <p>Es posible que alguna propiedad haya dejado de estar publicada.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
