import { Clock, Home, MapPin, MessageCircle, Users } from 'lucide-react';
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
  { value: '+5', label: 'Años de experiencia', icon: Clock },
  { value: '+220', label: 'Personas aseguradas', icon: Users },
  { value: '+20', label: 'Propiedades vendidas', icon: Home },
];

// Frontera real de Nicaragua basada en coordenadas cartográficas de Natural Earth.
// Se proyecta al SVG conservando sus proporciones, en lugar de dibujar una silueta aproximada.
const nicaraguaBoundary = [
  [-85.71254, 11.088445],
  [-86.058488, 11.403439],
  [-86.52585, 11.806877],
  [-86.745992, 12.143962],
  [-87.167516, 12.458258],
  [-87.668493, 12.90991],
  [-87.557467, 13.064552],
  [-87.392386, 12.914018],
  [-87.316654, 12.984686],
  [-87.005769, 13.025794],
  [-86.880557, 13.254204],
  [-86.733822, 13.263093],
  [-86.755087, 13.754845],
  [-86.520708, 13.778487],
  [-86.312142, 13.771356],
  [-86.096264, 14.038187],
  [-85.801295, 13.836055],
  [-85.698665, 13.960078],
  [-85.514413, 14.079012],
  [-85.165365, 14.35437],
  [-85.148751, 14.560197],
  [-85.052787, 14.551541],
  [-84.924501, 14.790493],
  [-84.820037, 14.819587],
  [-84.649582, 14.666805],
  [-84.449336, 14.621614],
  [-84.228342, 14.748764],
  [-83.975721, 14.749436],
  [-83.628585, 14.880074],
  [-83.489989, 15.016267],
  [-83.147219, 14.995829],
  [-83.233234, 14.899866],
  [-83.284162, 14.676624],
  [-83.182126, 14.310703],
  [-83.4125, 13.970078],
  [-83.519832, 13.567699],
  [-83.552207, 13.127054],
  [-83.498515, 12.869292],
  [-83.473323, 12.419087],
  [-83.626104, 12.32085],
  [-83.719613, 11.893124],
  [-83.650858, 11.629032],
  [-83.85547, 11.373311],
  [-83.808936, 11.103044],
  [-83.655612, 10.938764],
  [-83.895054, 10.726839],
  [-84.190179, 10.79345],
  [-84.355931, 10.999226],
  [-84.673069, 11.082657],
  [-84.903003, 10.952303],
  [-85.561852, 11.217119],
  [-85.71254, 11.088445],
];

const MAP_VIEW = { width: 320, height: 340, padding: 28 };
const longitudes = nicaraguaBoundary.map(([longitude]) => longitude);
const latitudes = nicaraguaBoundary.map(([, latitude]) => latitude);
const minLongitude = Math.min(...longitudes);
const maxLongitude = Math.max(...longitudes);
const minLatitude = Math.min(...latitudes);
const maxLatitude = Math.max(...latitudes);
const longitudeSpan = maxLongitude - minLongitude;
const latitudeSpan = maxLatitude - minLatitude;
const projectionScale = Math.min(
  (MAP_VIEW.width - (MAP_VIEW.padding * 2)) / longitudeSpan,
  (MAP_VIEW.height - (MAP_VIEW.padding * 2)) / latitudeSpan,
);
const projectedWidth = longitudeSpan * projectionScale;
const projectedHeight = latitudeSpan * projectionScale;
const projectionOffsetX = (MAP_VIEW.width - projectedWidth) / 2;
const projectionOffsetY = (MAP_VIEW.height - projectedHeight) / 2;

function projectNicaraguaPoint(longitude, latitude) {
  return {
    x: projectionOffsetX + ((longitude - minLongitude) * projectionScale),
    y: projectionOffsetY + ((maxLatitude - latitude) * projectionScale),
  };
}

const nicaraguaPolygonPoints = nicaraguaBoundary
  .map(([longitude, latitude]) => {
    const point = projectNicaraguaPoint(longitude, latitude);
    return `${point.x.toFixed(2)},${point.y.toFixed(2)}`;
  })
  .join(' ');

const mapPoints = [
  { longitude: -85.917, latitude: 12.925, label: 'Norte' },
  { longitude: -86.251, latitude: 12.136, label: 'Centro' },
  { longitude: -85.826, latitude: 11.438, label: 'Pacífico' },
].map((point) => ({ ...point, ...projectNicaraguaPoint(point.longitude, point.latitude) }));

const mapRoutePoints = mapPoints.map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(' ');

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
            <svg className="about-page__nicaragua" viewBox={`0 0 ${MAP_VIEW.width} ${MAP_VIEW.height}`} role="img" aria-label="Croquis geográfico de Nicaragua con puntos de cobertura">
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

              <polygon className="about-page__map-outline" points={nicaraguaPolygonPoints} />
              <polyline className="about-page__map-route" points={mapRoutePoints} />

              {mapPoints.map((point, index) => (
                <g className="about-page__map-marker" key={point.label} style={{ '--delay': `${index * 0.55}s` }}>
                  <circle className="about-page__map-pulse" cx={point.x} cy={point.y} r="13" />
                  <circle className="about-page__map-dot" cx={point.x} cy={point.y} r="5" filter="url(#mapGlow)" />
                  <text x={point.x + 15} y={point.y + 5}>{point.label}</text>
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
