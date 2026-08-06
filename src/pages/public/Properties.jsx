import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, ChartNoAxesCombined, Check, Compass, Home,
  List, Map, Search, ShieldCheck, Sparkles, UserRoundCheck,
} from 'lucide-react';
import PropertyCard from '../../components/properties/PropertyCard';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { propertyTypeOptions } from '../../config/adminLabels.es';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';
import { getProperties } from '../../services/propertyService';
import MapView from './MapView';

const services = [
  { icon: Home, title: 'Compra de propiedades', text: 'Encuentra oportunidades alineadas con tu presupuesto, estilo de vida o visión de inversión.' },
  { icon: Building2, title: 'Venta de propiedades', text: 'Te acompaño en la comercialización, presentación y captación de compradores potenciales.' },
  { icon: ChartNoAxesCombined, title: 'Inversión inmobiliaria', text: 'Analizamos oportunidades con potencial de valorización, rentabilidad y seguridad patrimonial.' },
  { icon: UserRoundCheck, title: 'Asesoría personalizada', text: 'Recibe orientación estratégica y clara antes de tomar una decisión inmobiliaria importante.' },
];

const process = [
  ['01', 'Escucho tu objetivo', 'Entendemos qué buscas y qué resultado quieres conseguir.'],
  ['02', 'Analizo oportunidades', 'Evaluamos opciones con criterio, contexto y visión patrimonial.'],
  ['03', 'Te acompaño en la decisión', 'Resolvemos dudas para que avances con claridad y confianza.'],
  ['04', 'Damos seguimiento', 'Estoy presente durante la negociación y cada etapa del proceso.'],
];

export default function Properties() {
  const { images } = useSiteImages();
  const [properties, setProperties] = useState([]);
  const [content, setContent] = useState(defaultSiteContent.realEstate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [operationType, setOperationType] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    Promise.all([getProperties(), getSiteContent('realEstate')])
      .then(([items, pageContent]) => {
        setProperties(items);
        setContent(pageContent);
      })
      .catch(() => setError('No pudimos cargar las propiedades en este momento. Intenta nuevamente.'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => properties.filter((property) => {
    const text = [property.title, property.city, property.state, property.department, property.sector,
      property.address, property.publicAddress].filter(Boolean).join(' ').toLowerCase();
    const currentOperation = property.operationType || property.transactionType;
    return (!q || text.includes(q.toLowerCase().trim()))
      && (!operationType || currentOperation === operationType)
      && (!propertyType || property.propertyType === propertyType)
      && (!beds || Number(property.bedrooms) >= Number(beds))
      && (!baths || Number(property.bathrooms) >= Number(baths));
  }), [properties, q, operationType, propertyType, beds, baths]);

  const featured = filtered.filter((property) => property.featured);
  const standardProperties = featured.length ? filtered.filter((property) => !property.featured) : filtered;
  const clear = () => {
    setQ(''); setOperationType(''); setPropertyType(''); setBeds(''); setBaths('');
  };
  const heroImage = images.realEstateHero || images.aboutPage;

  return <div className="real-estate-page">
    <SEO title="Bienes raíces | Amy Blandón" />

    <section className="re-hero">
      <div className="re-shell re-hero__grid">
        <RevealOnScroll className="re-hero__media" direction="left">
          <div className="re-hero__image">
            {heroImage ? <img src={heroImage} alt="Amy Blandón, asesora inmobiliaria" /> : <div className="re-hero__image-placeholder"><Building2 /><span>Asesoría inmobiliaria profesional</span></div>}
          </div>
          <div className="re-hero__badge"><ShieldCheck /><span><b>Asesoría personalizada</b>Compra · Venta · Inversión</span></div>
        </RevealOnScroll>
        <RevealOnScroll className="re-hero__content" direction="right" delay={100}>
          <p className="re-eyebrow">{content.heroEyebrow}</p>
          <h1>{content.heroTitle}</h1>
          <p className="re-hero__lead">{content.heroText}</p>
          <div className="re-hero__actions">
            <a className="btn re-btn--gold" href="#propiedades">Ver propiedades <ArrowRight size={17} /></a>
            <Link className="btn re-btn--outline" to="/contacto">Agendar asesoría</Link>
          </div>
          <div className="re-hero__trust"><Check /> Atención cercana <span /> <Check /> Decisiones informadas</div>
        </RevealOnScroll>
      </div>
    </section>

    <section className="re-section re-services">
      <div className="re-shell">
        <RevealOnScroll className="re-heading re-heading--center"><p className="re-eyebrow">SERVICIO INTEGRAL</p><h2>¿Cómo puedo ayudarte?</h2><p>Soluciones inmobiliarias pensadas para acompañar tus objetivos con claridad y experiencia.</p></RevealOnScroll>
        <div className="re-services__grid">{services.map(({ icon: Icon, title, text }, index) => <RevealOnScroll as="article" className="re-service" key={title} delay={index * 70}><span className="re-service__icon"><Icon /></span><h3>{title}</h3><p>{text}</p><span className="re-service__line" /></RevealOnScroll>)}</div>
      </div>
    </section>

    <section className="re-section re-catalog" id="propiedades">
      <div className="re-shell">
        <RevealOnScroll className="re-heading"><p className="re-eyebrow">PORTAFOLIO INMOBILIARIO</p><h2>Encuentra tu próxima propiedad</h2><p>Filtra las oportunidades disponibles según lo que necesitas.</p></RevealOnScroll>
        <RevealOnScroll as="form" className="re-filters" aria-label="Filtros de propiedades" onSubmit={(event) => event.preventDefault()}>
          <label className="re-filter re-filter--search"><span>Ubicación o palabra clave</span><div><Search /><input aria-label="Ciudad, título o zona" placeholder="Ciudad, título o zona" value={q} onChange={(event) => setQ(event.target.value)} /></div></label>
          <label className="re-filter"><span>Operación</span><select value={operationType} onChange={(event) => setOperationType(event.target.value)}><option value="">Comprar o alquilar</option><option value="sale">Venta</option><option value="rent">Alquiler</option><option value="venta">Venta (anterior)</option><option value="renta">Alquiler (anterior)</option></select></label>
          <label className="re-filter"><span>Tipo</span><select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}><option value="">Todos los tipos</option>{propertyTypeOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          <label className="re-filter"><span>Habitaciones</span><select value={beds} onChange={(event) => setBeds(event.target.value)}><option value="">Cualquiera</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option><option value="4">4+</option></select></label>
          <label className="re-filter"><span>Baños</span><select value={baths} onChange={(event) => setBaths(event.target.value)}><option value="">Cualquiera</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></select></label>
          <button className="btn re-filter__submit" type="submit"><Search size={17} /> Buscar propiedades</button>
          <button className="re-filter__clear" type="button" onClick={clear}>Limpiar filtros</button>
        </RevealOnScroll>

        <div className="re-results__top">
          <div><p className="re-eyebrow">SELECCIÓN DE AMY</p><h2>Propiedades disponibles</h2><p>Explora oportunidades seleccionadas por Amy Blandón.</p></div>
          <div className="re-view-toggle" aria-label="Cambiar vista"><button type="button" className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><List /> Lista</button><button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Map /> Mapa</button></div>
        </div>
        <p className="re-results__count">{filtered.length} {filtered.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}</p>
        {loading ? <div className="re-empty"><span className="re-loader" /><h3>Buscando oportunidades...</h3></div>
          : error ? <div className="re-empty"><Compass /><h3>No pudimos conectar con el catálogo</h3><p>{error}</p></div>
            : filtered.length === 0 ? <div className="re-empty"><Search /><h3>No encontramos coincidencias</h3><p>Prueba con otros criterios o limpia los filtros para ver todo el portafolio.</p><button type="button" className="btn re-btn--gold" onClick={clear}>Ver todas las propiedades</button></div>
              : view === 'map' ? <MapView embedded properties={filtered} /> : <>
                {featured.length > 0 && <div className="re-featured"><div className="re-subheading"><Sparkles /><div><h3>Propiedades destacadas</h3><p>Oportunidades que merecen una mirada especial.</p></div></div><div className="properties-grid">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div></div>}
                {standardProperties.length > 0 && <div className="properties-grid">{standardProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div>}
              </>}
      </div>
    </section>

    <section className="re-section re-process"><div className="re-shell"><RevealOnScroll className="re-heading re-heading--center"><p className="re-eyebrow">UNA RUTA CLARA</p><h2>Un acompañamiento inmobiliario más claro y estratégico</h2><p>Un proceso cercano, estructurado y enfocado en proteger tus intereses.</p></RevealOnScroll><div className="re-process__grid">{process.map(([number, title, text], index) => <RevealOnScroll as="article" key={number} delay={index * 80}><span>{number}</span><h3>{title}</h3><p>{text}</p></RevealOnScroll>)}</div></div></section>

    <section className="re-cta"><RevealOnScroll className="re-shell re-cta__inner"><div><p className="re-eyebrow">TU PRÓXIMO PASO</p><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div><div className="re-cta__actions"><Link className="btn re-btn--gold" to="/contacto">Contactar ahora <ArrowRight /></Link><a className="btn re-btn--light" href="#propiedades">Ver propiedades</a></div></RevealOnScroll></section>
  </div>;
}
