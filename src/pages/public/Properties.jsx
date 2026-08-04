import { useEffect, useMemo, useState } from 'react';
import PropertyCard from '../../components/properties/PropertyCard';
import { getProperties } from '../../services/propertyService';
import MapView from './MapView';
import SEO from '../../components/common/SEO';

export default function Properties() {
  const [props, setProps] = useState([]);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [view, setView] = useState('grid');
  useEffect(() => { getProperties().then(setProps); }, []);
  const filtered = useMemo(() => props.filter(p => {
    const text = [p.title, p.city, p.state, p.address].filter(Boolean).join(' ').toLowerCase();
    return (!q || text.includes(q.toLowerCase())) && (!type || p.transactionType === type) && (!beds || Number(p.bedrooms) >= Number(beds)) && (!baths || Number(p.bathrooms) >= Number(baths));
  }), [props, q, type, beds, baths]);
  const clear = () => { setQ(''); setType(''); setBeds(''); setBaths(''); };
  return <><SEO title="Propiedades | Amy Blandon" /><section className="properties-page page-hero"><div className="properties-page__intro"><p className="section-kicker">Propiedades</p><h1>Propiedades</h1><p>Oportunidades seleccionadas para invertir, vivir y construir patrimonio con visión.</p></div><div className="property-filters" aria-label="Filtros de propiedades"><input placeholder="Ciudad, título o zona" value={q} onChange={e => setQ(e.target.value)} /><select value={type} onChange={e => setType(e.target.value)}><option value="">Comprar o rentar</option><option value="venta">Venta</option><option value="renta">Renta</option></select><select value={beds} onChange={e => setBeds(e.target.value)}><option value="">Habitaciones</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select><select value={baths} onChange={e => setBaths(e.target.value)}><option value="">Baños</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select><button className="btn secondary" type="button" onClick={clear}>Limpiar</button><button className="btn" type="button" onClick={() => setView(view === 'grid' ? 'map' : 'grid')}>{view === 'grid' ? 'Mapa + lista' : 'Ver grid'}</button></div><p className="properties-page__count">{filtered.length} propiedades disponibles.</p>{view === 'map' ? <MapView embedded properties={filtered} /> : <div className="properties-grid">{filtered.map(p => <PropertyCard key={p.id} property={p} />)}</div>}</section></>;
}
