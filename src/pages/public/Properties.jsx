import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Building2, ChartNoAxesCombined, Check, Compass, Home,
  List, Map, Search, ShieldCheck, Sparkles, UserRoundCheck,
} from 'lucide-react';
import PropertyCard from '../../components/properties/PropertyCard';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SectorSocialSection from '../../components/common/SectorSocialSection';
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

const quickCategories = [
  { value: '', label: 'Todas', hint: 'Ver portafolio', icon: Sparkles },
  { value: 'house', label: 'Casas', hint: 'Residencial', icon: Home },
  { value: 'land', label: 'Terrenos', hint: 'Inversión', icon: Map },
  { value: 'farm', label: 'Fincas', hint: 'Productivo', icon: Compass },
  { value: 'commercial', label: 'Local comercial', hint: 'Negocios', icon: Building2 },
];

const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value;
};

export default function Properties() {
  const { images } = useSiteImages();
  const [properties, setProperties] = useState([]);
  const [content, setContent] = useState(defaultSiteContent.realEstate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [operationType, setOperationType] = useState('');
  const [propertyType, setPropertyType] = useState('');
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
    const text = [
      property.title,
      property.city,
      property.state,
      property.department,
      property.sector,
      property.address,
      property.publicAddress,
      property.propertyType,
    ].filter(Boolean).join(' ').toLowerCase();
    const currentOperation = normalizeOperation(property.operationType || property.transactionType);

    return (!q || text.includes(q.toLowerCase().trim()))
      && (!operationType || currentOperation === operationType)
      && (!propertyType || property.propertyType === propertyType);
  }), [properties, q, operationType, propertyType]);

  const featured = filtered.filter((property) => property.featured);
  const standardProperties = featured.length ? filtered.filter((property) => !property.featured) : filtered;
  const hasSearch = Boolean(q || operationType || propertyType);
  const clear = () => {
    setQ('');
    setOperationType('');
    setPropertyType('');
  };
  const showResults = () => {
    document.getElementById('propiedades')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const submitSearch = (event) => {
    event.preventDefault();
    showResults();
  };
  const chooseCategory = (value) => {
    setPropertyType(value);
    window.setTimeout(showResults, 80);
  };
  const heroImage = images.realEstateHero || images.aboutPage;
  const resultLabel = loading
    ? 'Buscar propiedades'
    : `Ver ${filtered.length} ${filtered.length === 1 ? 'propiedad' : 'propiedades'}`;

  return <div className="real-estate-page">
    <SEO title="Bienes raíces | Amy Blandón" />

    <section className="re-search-hero">
      <div className="re-search-hero__decor re-search-hero__decor--one" aria-hidden="true" />
      <div className="re-search-hero__decor re-search-hero__decor--two" aria-hidden="true" />
      <div className="re-shell re-search-hero__inner">
        <RevealOnScroll className="re-search-hero__heading">
          <p className="re-eyebrow">PORTAFOLIO INMOBILIARIO</p>
          <h1>Encuentra una propiedad que encaje con tu próxima decisión.</h1>
          <p>Busca por ubicación, elige cómo quieres invertir y encuentra el tipo de propiedad que necesitas.</p>
        </RevealOnScroll>

        <RevealOnScroll as="form" className="re-search-panel" delay={90} aria-label="Buscar propiedades" onSubmit={submitSearch}>
          <div className="re-search-panel__top">
            <label className="re-search-panel__keyword">
              <span className="re-search-panel__icon"><Search aria-hidden="true" /></span>
              <span className="re-search-panel__keyword-copy">
                <small>¿Dónde quieres buscar?</small>
                <input
                  aria-label="Ubicación o palabra clave"
                  placeholder="Ciudad, zona o nombre de propiedad"
                  value={q}
                  onChange={(event) => setQ(event.target.value)}
                />
              </span>
            </label>

            <div className="re-search-panel__operation" role="group" aria-label="Tipo de operación">
              <span>¿Qué quieres hacer?</span>
              <div className="re-search-panel__segments">
                <button type="button" className={!operationType ? 'active' : ''} aria-pressed={!operationType} onClick={() => setOperationType('')}>Todas</button>
                <button type="button" className={operationType === 'sale' ? 'active' : ''} aria-pressed={operationType === 'sale'} onClick={() => setOperationType('sale')}>Comprar</button>
                <button type="button" className={operationType === 'rent' ? 'active' : ''} aria-pressed={operationType === 'rent'} onClick={() => setOperationType('rent')}>Alquilar</button>
              </div>
            </div>
          </div>

          <div className="re-search-panel__bottom">
            <label className="re-search-panel__type">
              <span><Building2 aria-hidden="true" /> Tipo de propiedad</span>
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                <option value="">Todos los tipos de propiedad</option>
                {propertyTypeOptions.map(([value, label]) => <option value={value} key={value}>{label}</option>)}
              </select>
            </label>
            <button className="re-search-panel__submit" type="submit"><Search size={19} /> {resultLabel}</button>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="re-quick-categories" delay={140}>
          <div className="re-quick-categories__heading">
            <span>Explora por categoría</span>
            {hasSearch && <button type="button" onClick={clear}>Limpiar filtros</button>}
          </div>
          <div className="re-quick-categories__grid">
            {quickCategories.map(({ value, label, hint, icon: Icon }) => {
              const active = propertyType === value;
              return <button
                type="button"
                key={label}
                className={`re-category-button ${active ? 'active' : ''}`}
                aria-pressed={active}
                onClick={() => chooseCategory(value)}
              >
                <span className="re-category-button__icon"><Icon /></span>
                <span><strong>{label}</strong><small>{hint}</small></span>
              </button>;
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>

    <section className="re-section re-catalog re-catalog--front" id="propiedades">
      <div className="re-shell">
        <div className="re-results__top">
          <div>
            <p className="re-eyebrow">PROPIEDADES</p>
            <h2>Propiedades disponibles</h2>
            <p>Explora las oportunidades que Amy ha seleccionado para venta o alquiler.</p>
          </div>
          <div className="re-view-toggle" aria-label="Cambiar vista">
            <button type="button" className={view === 'grid' ? 'active' : ''} onClick={() => setView('grid')}><List /> Lista</button>
            <button type="button" className={view === 'map' ? 'active' : ''} onClick={() => setView('map')}><Map /> Mapa</button>
          </div>
        </div>
        <div className="re-results__meta">
          <p className="re-results__count">{filtered.length} {filtered.length === 1 ? 'propiedad disponible' : 'propiedades disponibles'}</p>
          {hasSearch && <button type="button" onClick={clear}>Ver todo el portafolio</button>}
        </div>

        {loading ? <div className="re-empty"><span className="re-loader" /><h3>Buscando oportunidades...</h3></div>
          : error ? <div className="re-empty"><Compass /><h3>No pudimos conectar con el catálogo</h3><p>{error}</p></div>
            : filtered.length === 0 ? <div className="re-empty"><Search /><h3>No encontramos coincidencias</h3><p>Prueba con otra ubicación, operación o tipo de propiedad.</p><button type="button" className="btn re-btn--gold" onClick={clear}>Ver todas las propiedades</button></div>
              : view === 'map' ? <MapView embedded properties={filtered} /> : <>
                {featured.length > 0 && <div className="re-featured"><div className="re-subheading"><Sparkles /><div><h3>Propiedades destacadas</h3><p>Oportunidades que merecen una mirada especial.</p></div></div><div className="properties-grid">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div></div>}
                {standardProperties.length > 0 && <div className="properties-grid">{standardProperties.map((property) => <PropertyCard key={property.id} property={property} />)}</div>}
              </>}
      </div>
    </section>

    <section className="re-hero re-hero--advisory">
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
            <a className="btn re-btn--gold" href="#propiedades">Explorar propiedades <ArrowRight size={17} /></a>
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

    <SectorSocialSection sector="realEstate" />

    <section className="re-section re-process"><div className="re-shell"><RevealOnScroll className="re-heading re-heading--center"><p className="re-eyebrow">UNA RUTA CLARA</p><h2>Un acompañamiento inmobiliario más claro y estratégico</h2><p>Un proceso cercano, estructurado y enfocado en proteger tus intereses.</p></RevealOnScroll><div className="re-process__grid">{process.map(([number, title, text], index) => <RevealOnScroll as="article" key={number} delay={index * 80}><span>{number}</span><h3>{title}</h3><p>{text}</p></RevealOnScroll>)}</div></div></section>

    <section className="re-cta"><RevealOnScroll className="re-shell re-cta__inner"><div><p className="re-eyebrow">TU PRÓXIMO PASO</p><h2>{content.ctaTitle}</h2><p>{content.ctaText}</p></div><div className="re-cta__actions"><Link className="btn re-btn--gold" to="/contacto">Contactar ahora <ArrowRight /></Link><a className="btn re-btn--light" href="#propiedades">Ver propiedades</a></div></RevealOnScroll></section>
  </div>;
}
