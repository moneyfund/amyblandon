import { MessageCircle } from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import building from '../../assets/icons/building.svg';
import graph from '../../assets/icons/graph.svg';
import secure from '../../assets/icons/secure.svg';
import SEO from '../../components/common/SEO';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { whatsappLink } from '../../utils/whatsapp';

const icons = { realEstate: building, investments: graph, insurance: secure };

export default function About() {
  const { images } = useSiteImages();

  return <div className="about-page">
    <SEO title="Sobre Mi | Amy Blandon" description="Asesoría inmobiliaria, seguros e inversiones con una visión estratégica para proteger y hacer crecer tu patrimonio." />
    <section className="about-page__hero">
      <div className="about-page__hero-inner">
        <RevealOnScroll className="about-page__portrait" direction="left">
          <img src={images.aboutPage} alt="Amy Blandón" />
        </RevealOnScroll>
        <RevealOnScroll className="about-page__content" direction="right" delay={120}>
          <p className="about-page__label">Sobre Mi</p>
          <h1>{homePageContent.about.titleLines.map((line) => <span key={line}>{line}</span>)}</h1>
          {homePageContent.about.paragraphs.map((text) => <p key={text}>{text}</p>)}
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
            <img src={icons[service.key]} alt="" width="54" />
            <h3>{service.title}</h3>
            <p>{service.text}</p>
          </RevealOnScroll>
        ))}
      </div>
    </section>
    <section className="about-page__cta">
      <RevealOnScroll>
        <p className="section-kicker">Acompañamiento</p>
        <h2>Construyamos una estrategia clara para tu próxima decisión.</h2>
        <a className="btn" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)}>
          <MessageCircle size={18} />Conversemos
        </a>
      </RevealOnScroll>
    </section>
  </div>;
}
