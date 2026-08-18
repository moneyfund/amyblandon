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
import { subscribeProperties } from '../../services/propertyService';
import MapView from './MapView';

const quickCategories = [
  { value: '', label: 'Todas', hint: 'Ver portafolio', icon: Sparkles },
  { value: 'house', label: 'Casas', hint: 'Residencial', icon: Home },
  { value: 'land', label: 'Terrenos', hint: 'Inversión', icon: Map },
  { value: 'farm', label: 'Fincas', hint: 'Productivo', icon: Compass },
  { value: 'quinta', label: 'Quintas', hint: 'Descanso', icon: Home },
  { value: 'commercial', label: 'Local comercial', hint: 'Negocios', icon: Building2 },
];

const normalizeOperation = (value) => {
  if (value === 'venta') return 'sale';
  if (value === 'renta') return 'rent';
  return value;
};

const servicesFor = (content) => [
  { icon: Home, title: content.service1Title, text: content.service1Text },
  { icon: Building2, title: content.service2Title, text: content.service2Text },
  { icon: ChartNoAxesCombined, title: content.service3Title, text: content.service3Text },
  { icon: UserRoundCheck, title: content.service4Title, text: content.service4Text },
];

const processFor = (content) => [
  ['01', content.process1Title, content.process1Text],
  ['02', content.process2Title, content.process2Text],
  ['03', content.process3Title, content.process3Text],
  ['04', content.process4Title, content.process4Text],
];

export default function Properties() {
  const { images } = useSiteImages();
  const [properties, setProperties] = useState([]);
  const [content, setContent] = useState(defaultSiteContent.realEstate);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [operationType, setOperationType] = useState('sale');
  const [propertyType, setPropertyType] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    let active = true;

    getSiteContent('realEstate')
      .then((pageContent) => active && setContent(pageContent))
      .catch(() => {});

    const unsubscribe = subscribeProperties(
      {},
      (items) => {
        if (!active) return;
        setProperties(items);
        setError('');
        setLoading(false);
      },
      () => {
        if (!active) return;
        setError('No pudimos cargar las propiedades en este momento. Intenta nuevamente.');
        setLoading(false);
      },
    );

    return () => {
      active = false;
      unsubscribe?.();
    };
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
  const hasSearch = Boolean(q || propertyType || operationType === 'rent');
  const clear = () => {
    setQ('');
    setOperationType('sale');
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
  const services = servicesFor(content);
  const process = processFor(content);

  return <div className="real-estate-page">
    <SEO title="Bienes raíces | Amy Blandón" />

    <section className="re-search-hero">
      <div className="re-search-hero__decor re-search-hero__decor--one" aria-hidden="true" />
      <div className="re-search-hero__decor re-search-hero__decor--two" aria-hidden="true" />
      <div className="re-shell re-search-hero__inner">
        <RevealOnScroll className="re-search-hero__heading">
          <p className="re-eyebrow content-preserve-format">{content.searchHeroEyebrow}</p>
          <h1 className="content-preserve-format">{content.searchHeroTitle}</h1>
          <p className="content-preserve-format">{content.searchHeroText}</p>
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

            <label className="re-search-panel__operation re-search-panel__operation--select">
              <select
                aria-label="Tipo de operación"
                value={operationType}
                onChange={(event) => setOperationType(event.target.value)}
              >
                <option value="sale">Venta</option>
                <option value="rent">Alquilar</option>
              </select>
            </label>
          </div>

          <div className="re-search-panel__bottom">
            <label className="re-search-panel__type">
              <span><Building2 aria-hidden="true" /> Tipo de propiedad</span>
              <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                <option value="">Propiedades</option>
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
            <p className="re-eyebrow content-preserve-format">{content.catalogEyebrow}</p>
            <h2 className="content-preserve-format">{content.catalogTitle}</h2>
            <p className="content-preserve-format">{content.catalogText}</p>
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
                {featured.length > 0 && <div className="re-featured"><div className="re-subheading"><Sparkles /><div><h3 className="content-preserve-format">{content.featuredTitle}</h3><p className="content-preserve-format">{content.featuredText}</p></div></div><div className="properties-grid">{featured.map((property) => <PropertyCard key={property.id} property={property} />)}</div></div>}
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
          <div className="re-hero__badge"><ShieldCheck /><span><b>{content.heroBadgeTitle}</b>{content.heroBadgeText}</span></div>
        </RevealOnScroll>
        <RevealOnScroll className="re-hero__content" direction="right" delay={100}>
          <p className="re-eyebrow content-preserve-format">{content.heroEyebrow}</p>
          <h1 className="content-preserve-format">{content.heroTitle}</h1>
          <p className="re-hero__lead content-preserve-format">{content.heroText}</p>
          <div className="re-hero__actions">
            <a className="btn re-btn--gold" href="#propiedades">{content.heroPrimaryButton} <ArrowRight size={17} /></a>
            <Link className="btn re-btn--outline" to="/contacto">{content.heroSecondaryButton}</Link>
          </div>
          <div className="re-hero__trust"><Check /> {content.heroTrust1} <span /> <Check /> {content.heroTrust2}</div>
        </RevealOnScroll>
      </div>
    </section>

    <section className="re-section re-services">
      <div className="re-shell">
        <RevealOnScroll className="re-heading re-heading--center">
          <p className="re-eyebrow content-preserve-format">{content.servicesKicker}</p>
          <h2 className="content-preserve-format">{content.servicesTitle}</h2>
          <p className="content-preserve-format">{content.servicesText}</p>
        </RevealOnScroll>
        <div className="re-services__grid">{services.map(({ icon: Icon, title, text }, index) => <RevealOnScroll as="article" className="re-service" key={`${index}-${title}`} delay={index * 70}><span className="re-service__icon"><Icon /></span><h3 className="content-preserve-format">{title}</h3><p className="content-preserve-format">{text}</p><span className="re-service__line" /></RevealOnScroll>)}</div>
      </div>
    </section>

    <SectorSocialSection sector="realEstate" />

    <section className="re-section re-process">
      <div className="re-shell">
        <RevealOnScroll className="re-heading re-heading--center">
          <p className="re-eyebrow content-preserve-format">{content.processKicker}</p>
          <h2 className="content-preserve-format">{content.processTitle}</h2>
          <p className="content-preserve-format">{content.processText}</p>
        </RevealOnScroll>
        <div className="re-process__grid">{process.map(([number, title, text], index) => <RevealOnScroll as="article" key={number} delay={index * 80}><span>{number}</span><h3 className="content-preserve-format">{title}</h3><p className="content-preserve-format">{text}</p></RevealOnScroll>)}</div>
      </div>
    </section>

    <section className="re-cta">
      <RevealOnScroll className="re-shell re-cta__inner">
        <div>
          <p className="re-eyebrow content-preserve-format">{content.ctaEyebrow}</p>
          <h2 className="content-preserve-format">{content.ctaTitle}</h2>
          <p className="content-preserve-format">{content.ctaText}</p>
        </div>
        <div className="re-cta__actions">
          <Link className="btn re-btn--gold" to="/contacto">{content.ctaPrimaryButton} <ArrowRight /></Link>
          <a className="btn re-btn--light" href="#propiedades">{content.ctaSecondaryButton}</a>
        </div>
      </RevealOnScroll>
    </section>
  </div>;
}
