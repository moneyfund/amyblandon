import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Car,
  Check,
  FileSearch,
  Handshake,
  HeartPulse,
  Home,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Umbrella,
  UsersRound,
} from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SectorSocialSection from '../../components/common/SectorSocialSection';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';

const coverageOptions = [
  {
    icon: HeartPulse,
    title: 'Vida y salud',
    text: 'Protección pensada para cuidar tu estabilidad y la de quienes dependen de ti ante situaciones inesperadas.',
    note: 'Bienestar · Respaldo familiar',
  },
  {
    icon: Home,
    title: 'Hogar y patrimonio',
    text: 'Coberturas orientadas a proteger tu vivienda, bienes y patrimonio frente a riesgos que pueden afectar tu tranquilidad.',
    note: 'Vivienda · Bienes',
  },
  {
    icon: Car,
    title: 'Vehículos',
    text: 'Alternativas para proteger tu vehículo y contar con respaldo ante accidentes, daños o responsabilidades frente a terceros.',
    note: 'Auto · Responsabilidad',
  },
  {
    icon: BriefcaseBusiness,
    title: 'Negocios',
    text: 'Soluciones para empresas, oficinas y actividades comerciales que necesitan continuidad y protección frente a riesgos operativos.',
    note: 'Empresa · Continuidad',
  },
  {
    icon: UsersRound,
    title: 'Familia',
    text: 'Opciones de protección diseñadas para acompañar las distintas etapas de tu familia y ayudarte a planificar con mayor seguridad.',
    note: 'Familia · Previsión',
  },
  {
    icon: Umbrella,
    title: 'Protección integral',
    text: 'Evaluamos tus prioridades para construir una combinación de coberturas coherente con tu realidad, patrimonio y objetivos.',
    note: 'Asesoría · Estrategia',
  },
];

const process = [
  { icon: PhoneCall, number: '01', title: 'Conocemos tu necesidad', text: 'Conversamos sobre lo que quieres proteger, tus prioridades y el nivel de respaldo que necesitas.' },
  { icon: FileSearch, number: '02', title: 'Revisamos alternativas', text: 'Analizamos opciones y coberturas para que puedas entender diferencias, alcances y condiciones.' },
  { icon: SlidersHorizontal, number: '03', title: 'Diseñamos una propuesta', text: 'Organizamos una solución clara y proporcional a tu situación, evitando coberturas innecesarias.' },
  { icon: Handshake, number: '04', title: 'Te acompañamos', text: 'Recibes orientación durante la contratación y seguimiento cuando necesites revisar o actualizar tu protección.' },
];

const principles = [
  ['Claridad antes de decidir', 'Te explico cada alternativa en un lenguaje sencillo para que sepas qué estás contratando y por qué.'],
  ['Protección con propósito', 'La meta no es tener más pólizas, sino contar con coberturas que realmente respondan a tus riesgos.'],
  ['Acompañamiento cercano', 'Cada recomendación parte de tu contexto, tus prioridades y la protección que necesitas construir.'],
];

export default function Insurance() {
  const { images } = useSiteImages();
  const heroImage = images.insuranceHero || images.aboutPage;

  return (
    <div className="insurance-page">
      <SEO
        title="Seguros | Amy Blandón"
        description="Asesoría en seguros para proteger tu familia, patrimonio, vehículo y negocio con soluciones claras y responsables."
      />

      <section className="insurance-hero">
        <div className="insurance-shell insurance-hero__grid">
          <RevealOnScroll className="insurance-hero__content">
            <p className="insurance-eyebrow">PROTECCIÓN CON VISIÓN</p>
            <h1>Protege lo que has construido con decisiones más claras</h1>
            <p className="insurance-hero__lead">
              Te acompaño a evaluar riesgos, entender coberturas y elegir soluciones de seguro que cuiden tu patrimonio, tu familia y tu tranquilidad.
            </p>
            <div className="insurance-hero__actions">
              <Link className="btn insurance-btn--gold" to="/insurance/quote">Solicitar cotización <ArrowRight size={17} /></Link>
              <a className="insurance-text-link" href="#coberturas">Conocer coberturas <ArrowRight size={16} /></a>
            </div>
            <div className="insurance-hero__trust">
              <span><Check size={15} /> Asesoría personalizada</span>
              <span><Check size={15} /> Explicación clara</span>
              <span><Check size={15} /> Seguimiento cercano</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="insurance-hero__visual" direction="right" delay={100}>
            <div className="insurance-hero__image-wrap">
              {heroImage
                ? <img src={heroImage} alt="Amy Blandón, asesora de seguros" />
                : <div className="insurance-hero__placeholder"><ShieldCheck /><span>Protección que acompaña tus decisiones</span></div>}
            </div>
            <div className="insurance-hero__shield"><ShieldCheck /><span><b>Respaldo profesional</b>Protección para cada etapa</span></div>
            <div className="insurance-hero__mini-card"><BadgeCheck /><span><b>Enfoque personalizado</b>Coberturas según tu realidad</span></div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="insurance-assurance">
        <div className="insurance-shell insurance-assurance__grid">
          <RevealOnScroll><ShieldCheck /><div><b>Protección patrimonial</b><span>Soluciones pensadas para cuidar lo que has construido.</span></div></RevealOnScroll>
          <RevealOnScroll delay={70}><Sparkles /><div><b>Decisiones informadas</b><span>Compara y entiende antes de contratar.</span></div></RevealOnScroll>
          <RevealOnScroll delay={140}><Handshake /><div><b>Acompañamiento humano</b><span>Orientación cercana durante todo el proceso.</span></div></RevealOnScroll>
        </div>
      </section>

      <SectorSocialSection sector="insurance" />

      <section className="insurance-section insurance-coverages" id="coberturas">
        <div className="insurance-shell">
          <RevealOnScroll className="insurance-heading insurance-heading--center">
            <p className="insurance-eyebrow">SOLUCIONES DE PROTECCIÓN</p>
            <h2>Coberturas para distintas áreas de tu vida</h2>
            <p>Analizamos cada necesidad de forma individual para construir una protección coherente, comprensible y útil.</p>
          </RevealOnScroll>

          <div className="insurance-coverages__grid">
            {coverageOptions.map(({ icon: Icon, title, text, note }, index) => (
              <RevealOnScroll as="article" className="insurance-coverage-card" key={title} delay={index * 55}>
                <span className="insurance-coverage-card__icon"><Icon /></span>
                <span className="insurance-coverage-card__index">0{index + 1}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <small>{note}</small>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-section insurance-guidance">
        <div className="insurance-shell insurance-guidance__grid">
          <RevealOnScroll className="insurance-guidance__content" direction="left">
            <p className="insurance-eyebrow">ASESORÍA ANTES QUE VENTA</p>
            <h2>No se trata de contratar más. Se trata de estar mejor protegido.</h2>
            <p>
              Una póliza debe responder a una necesidad concreta. Por eso el proceso comienza entendiendo tu situación, tus riesgos y lo que realmente necesitas proteger.
            </p>
            <ul>
              <li><Check /> Revisamos tus prioridades antes de recomendar una opción.</li>
              <li><Check /> Explicamos exclusiones, alcances y condiciones relevantes.</li>
              <li><Check /> Buscamos equilibrio entre protección, utilidad y presupuesto.</li>
              <li><Check /> Puedes revisar tu estrategia cuando tus necesidades cambien.</li>
            </ul>
            <Link className="btn insurance-btn--navy" to="/insurance/quote">Evaluar mi protección <ArrowRight size={17} /></Link>
          </RevealOnScroll>

          <RevealOnScroll className="insurance-guidance__panel" direction="right" delay={100}>
            <div className="insurance-guidance__orb"><ShieldCheck /></div>
            <p className="insurance-guidance__quote">“Una buena protección empieza con una decisión bien entendida.”</p>
            <div className="insurance-guidance__metric"><strong>01</strong><span>Identificar lo que realmente quieres proteger.</span></div>
            <div className="insurance-guidance__metric"><strong>02</strong><span>Conocer los riesgos que podrían afectar tu estabilidad.</span></div>
            <div className="insurance-guidance__metric"><strong>03</strong><span>Elegir una cobertura alineada con tus prioridades.</span></div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="insurance-section insurance-process">
        <div className="insurance-shell">
          <RevealOnScroll className="insurance-heading insurance-heading--center">
            <p className="insurance-eyebrow">UN PROCESO SIMPLE</p>
            <h2>De la necesidad a una protección bien estructurada</h2>
            <p>Un acompañamiento ordenado para que avances con confianza, claridad y sin complicaciones innecesarias.</p>
          </RevealOnScroll>

          <div className="insurance-process__grid">
            {process.map(({ icon: Icon, number, title, text }, index) => (
              <RevealOnScroll as="article" className="insurance-process__step" key={number} delay={index * 80}>
                <div className="insurance-process__top"><span>{number}</span><Icon /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-section insurance-principles">
        <div className="insurance-shell insurance-principles__grid">
          <RevealOnScroll className="insurance-principles__intro">
            <p className="insurance-eyebrow">MI FORMA DE ASESORAR</p>
            <h2>Seguros con información, criterio y acompañamiento</h2>
            <p>La confianza se construye cuando entiendes tus opciones y puedes elegir con seguridad.</p>
          </RevealOnScroll>
          <div className="insurance-principles__list">
            {principles.map(([title, text], index) => (
              <RevealOnScroll as="article" key={title} delay={index * 70}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-cta">
        <RevealOnScroll className="insurance-shell insurance-cta__inner">
          <div>
            <p className="insurance-eyebrow">TU TRANQUILIDAD TAMBIÉN SE PLANIFICA</p>
            <h2>Encuentra una protección que tenga sentido para ti</h2>
            <p>Cuéntame qué quieres proteger y revisemos juntos las alternativas disponibles.</p>
          </div>
          <div className="insurance-cta__actions">
            <Link className="btn insurance-btn--gold" to="/insurance/quote">Solicitar cotización <ArrowRight /></Link>
            <Link className="btn insurance-btn--light" to="/contacto">Hablar con Amy</Link>
          </div>
        </RevealOnScroll>
      </section>
    </div>
  );
}
