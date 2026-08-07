import { Mail, MapPin, Phone } from 'lucide-react';
import { demoArticles } from '../../data/demoData';
import { Link, useParams } from 'react-router-dom';
import SimpleForm from '../../components/forms/SimpleForm';
import amyPortrait from '../../assets/images/amy-portrait.svg';
import building from '../../assets/icons/building.svg';
import graph from '../../assets/icons/graph.svg';
import secure from '../../assets/icons/secure.svg';

export function RealEstate() {
  return <section className="page-hero"><h1>Bienes Raíces</h1><p>Encuentra oportunidades inmobiliarias estratégicas que generen valor, estabilidad y crecimiento en el tiempo.</p><div className="grid three"><article className="panel"><img src={building} alt="" width="58"/><h3>Compra con estrategia</h3><p>Analizamos ubicación, propósito y potencial para que inviertas con seguridad.</p></article><article className="panel"><img src={graph} alt="" width="58"/><h3>Venta con presentación</h3><p>Preparamos tu propiedad para conectar con compradores calificados.</p></article><article className="panel"><img src={secure} alt="" width="58"/><h3>Acompañamiento integral</h3><p>Te asesoro en cada paso para tomar decisiones claras y rentables.</p></article></div></section>;
}

export function About() {
  return <section className="about-split"><div className="about-image"><img src={amyPortrait} alt="Amy Blandón"/></div><div><p className="about-label">Sobre Mi</p><h1>ASESORA INMOBILIARIA, SEGUROS E INVERSIONES</h1><p>Mi propósito es acompañarte a tomar decisiones que te den tranquilidad hoy y construyan tu futuro mañana.</p><p>Trabajo con una visión clara: ayudarte a proteger, estructurar y hacer crecer tu patrimonio de forma estratégica, sin improvisaciones y con total confianza.</p></div></section>;
}

export function Resources() {
  return <section className="page-hero"><h1>Recursos</h1><p>Información valiosa sobre bienes raíces, seguros e inversiones para tomar mejores decisiones financieras.</p><div className="grid cards">{demoArticles.map((a) => <article className="panel" key={a.slug}><span className="section-kicker">{a.category} · {a.readTime}</span><h3>{a.title}</h3><p>{a.excerpt}</p><Link className="btn small" to={`/resources/${a.slug}`}>Leer más</Link></article>)}</div></section>;
}

export function Article() {
  const { slug } = useParams();
  const a = demoArticles.find((x) => x.slug === slug);
  return <section className="page-hero"><h1>{a?.title || 'Recurso no encontrado'}</h1><p>{a?.date} · {a?.author} · {a?.readTime}</p><p>{a?.body}</p></section>;
}

export function Contact() {
  return (
    <section className="contact-page">
      <div className="contact-shell">
        <div className="contact-heading">
          <p className="contact-eyebrow">HABLEMOS</p>
          <h1>Contacto</h1>
          <p>Conversemos sobre la decisión que quieres tomar hoy para construir tu futuro mañana.</p>
        </div>

        <div className="contact-layout">
          <aside className="contact-card">
            <div className="contact-card__intro">
              <span className="contact-card__icon"><MapPin /></span>
              <div>
                <p className="contact-card__label">Ubicación</p>
                <h2>Matagalpa, Nicaragua</h2>
              </div>
            </div>

            <div className="contact-card__details">
              <a href="mailto:info@amyblandon.com">
                <span className="contact-card__detail-icon"><Mail /></span>
                <span><small>Correo electrónico</small><b>info@amyblandon.com</b></span>
              </a>
              <a href="tel:+50588324439">
                <span className="contact-card__detail-icon"><Phone /></span>
                <span><small>Teléfono</small><b>+505 8832 4439</b></span>
              </a>
            </div>

            <p className="contact-card__note">Atención personalizada para bienes raíces, seguros e inversiones.</p>
          </aside>

          <div className="contact-form-card">
            <div className="contact-form-card__heading">
              <p className="contact-eyebrow">CUÉNTAME SOBRE TU SOLICITUD</p>
              <h2>¿Cómo puedo ayudarte?</h2>
              <p>Completa tus datos y recibirás seguimiento lo antes posible.</p>
            </div>
            <SimpleForm collection="contacts" />
          </div>
        </div>
      </div>
    </section>
  );
}

export function NotFound() {
  return <section className="page-hero"><h1>Página no encontrada</h1><Link className="btn" to="/">Volver al inicio</Link></section>;
}
