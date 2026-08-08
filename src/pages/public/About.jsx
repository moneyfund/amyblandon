import { Landmark, MapPin, MessageCircle, ShieldCheck, TrendingUp } from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import building from '../../assets/icons/building.svg';
import graph from '../../assets/icons/graph.svg';
import secure from '../../assets/icons/secure.svg';
import SEO from '../../components/common/SEO';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { whatsappLink } from '../../utils/whatsapp';

const icons = { realEstate: building, investments: graph, insurance: secure };

const impactStats = [
  { value: '1:1', label: 'Atención personalizada', icon: ShieldCheck },
  { value: '3', label: 'Áreas de asesoría integradas', icon: Landmark },
  { value: '360°', label: 'Visión patrimonial', icon: TrendingUp },
];

const mapPoints = [
  { x: 152, y: 86, label: 'Norte' },
  { x: 178, y: 157, label: 'Centro' },
  { x: 126, y: 232, label: 'Pacífico' },
];

export default function About() {
  const { images } = useSiteImages();

  return <div className="about-page">
    <SEO title="Sobre Mi | Amy Blandon" description="Asesoría inmobiliaria, seguros e inversiones con una visión estratégica para proteger y hacer crecer tu patrimonio." />

    <section className="about-page__hero">
      <div className="about-page__hero-glow about-page__hero-glow--one" aria-hidden="true" />
      <div className="about-page__hero-glow about-page__hero-glow--two" aria-hidden="true" />
      <div className="about-page__hero-inner">
        <RevealOnScroll className="about-page__portrait-wrap" direction="left">
          <div className="about-page__portrait-frame">
            <span className="about-page__portrait-line" aria-hidden="true" />
            <div className="about-page__portrait">
              <img src={images.aboutPage} alt="Amy Blandón" />
            </div>
            <div className="about-page__portrait-badge">
              <span>Asesoría</span>
              <strong>Estratégica</strong>
            </div>
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="about-page__content" direction="right" delay={120}>
          <p className="about-page__label">Sobre Amy Blandón</p>
          <h1>{homePageContent.about.titleLines.map((line) => <span key={line}>{line}</span>)}</h1>
          <div className="about-page__intro-copy">
            {homePageContent.about.paragraphs.map((text) => <p key={text}>{text}</p>)}
          </div>
          <div className="about-page__hero-tags" aria-label="Áreas de especialidad">
            <span>Bienes raíces</span>
            <span>Seguros</span>
            <span>Inversiones</span>
          </div>
          <a className="btn about-page__button" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)}>
            <MessageCircle size={18} />Ir a WhatsApp
          </a>
        </RevealOnScroll>
      </div>
    </section>

    <section className="about-page__purpose">
      <RevealOnScroll>
        <p className="section-kicker">Propósito profesional</p>
        <h2>Decisiones con estructura, calma y visión de futuro.</h2>
        <p>Mi propósito es acompañarte a tomar decisiones que te den tranquilidad hoy y construyan tu futuro mañana.</p>
      </RevealOnScroll>
    </section>

    <section className="about-page__services">
      <div className="about-page__section-heading">
        <p className="section-kicker">Áreas de asesoría</p>
        <h2>Soluciones integrales para tu patrimonio</h2>
      </div>
      <div className="about-page__service-grid">
        {homePageContent.services.map((service, index) => (
          <RevealOnScroll as="article" className="about-page__service" delay={index * 100} key={service.key}>
            <div className="about-page__service-icon"><img src={icons[service.key]} alt="" width="54" /></div>
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>

    <section className="about-page__impact">
      <div className="about-page__impact-inner">
        <RevealOnScroll className="about-page__impact-copy" direction="left">
          <p className="section-kicker">Nicaragua · Visión estratégica</p>
          <h2>Una asesoría conectada con tus decisiones y con el territorio.</h2>
          <p>
            Cada decisión patrimonial merece contexto. Integro bienes raíces, seguros e inversiones para construir una
            estrategia clara, personalizada y preparada para crecer contigo.
          </p>

          <div className="about-page__impact-stats">
            {impactStats.map(({ value, label, icon: Icon }) => (
              <article className="about-page__impact-stat" key={label}>
                <Icon size={20} aria-hidden="true" />
                <strong>{value}</strong>
                <span>{label}</span>
              </article>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll className="about-page__map-card" direction="right" delay={100}>
          <div className="about-page__map-heading">
            <div>
              <span className="about-page__map-kicker">Cobertura estratégica</span>
              <strong>Nicaragua</strong>
            </div>
            <MapPin size={24} aria-hidden="true" />
          </div>

          <div className="about-page__map-stage">
            <span className="about-page__map-orbit about-page__map-orbit--one" aria-hidden="true" />
            <span className="about-page__map-orbit about-page__map-orbit--two" aria-hidden="true" />
            <svg className="about-page__nicaragua" viewBox="0 0 320 340" role="img" aria-label="Croquis estilizado de Nicaragua con puntos de cobertura">
              <defs>
                <linearGradient id="nicaraguaGold" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#f4d58e" />
                  <stop offset="48%" stopColor="#c99a44" />
                  <stop offset="100%" stopColor="#9c6d22" />
                </linearGradient>
                <filter id="mapGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <path
                className="about-page__map-outline"
                d="M133 27l33 11 27 27 24 15 8 26-13 27 12 27-6 27-24 21-8 33-22 27-10 32-20 17-18-12-5-31-17-18 2-31-15-22 7-30-13-21 8-28-7-27 19-22 9-30 25-9z"
              />
              <path
                className="about-page__map-route"
                d="M151 73c18 33 18 67 20 93 2 31-14 51-27 75-10 18-12 35-9 53"
              />
              {mapPoints.map((point, index) => (
                <g className="about-page__map-marker" key={point.label} style={{ '--delay': `${index * 0.55}s` }}>
                  <circle className="about-page__map-pulse" cx={point.x} cy={point.y} r="13" />
                  <circle className="about-page__map-dot" cx={point.x} cy={point.y} r="5" filter="url(#mapGlow)" />
                  <text x={point.x + 17} y={point.y + 5}>{point.label}</text>
                </g>
              ))}
            </svg>
          </div>

          <div className="about-page__map-footer">
            <span className="about-page__map-live"><i /> Presencia en movimiento</span>
            <span>Asesoría que trasciende una sola operación.</span>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  </div>;
}
