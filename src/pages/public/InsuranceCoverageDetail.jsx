import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SEO from '../../components/common/SEO';
import { insuranceCoverageBySlug } from '../../config/insuranceCoverages';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

const normalizeWhatsappNumber = (value) => String(value || '').replace(/\D/g, '');

export default function InsuranceCoverageDetail() {
  const { slug } = useParams();
  const coverage = insuranceCoverageBySlug[slug];
  const [contact, setContact] = useState(defaultSiteContent.contact);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    getSiteContent('contact').then(setContact).catch(() => {});
  }, [slug]);

  const whatsappUrl = useMemo(() => {
    if (!coverage) return '';
    const number = normalizeWhatsappNumber(contact.whatsapp || contact.phone);
    if (!number) return '';
    const message = [
      'Hola Amy, vi esta cobertura en tu página web y me gustaría recibir asesoría.',
      '',
      `Seguro consultado: ${coverage.title}`,
      'Quisiera conocer las opciones disponibles, beneficios, condiciones y cuál alternativa podría ajustarse mejor a mi necesidad.',
    ].join('\n');
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  }, [contact.phone, contact.whatsapp, coverage]);

  if (!coverage) return <Navigate to="/seguros" replace />;

  const CoverageIcon = coverage.icon;

  return (
    <div className="insurance-detail-page">
      <SEO
        title={`${coverage.title} | Seguros | Amy Blandón`}
        description={`${coverage.shortText} Conoce beneficios, criterios de protección y solicita asesoría personalizada con Amy Blandón.`}
      />

      <section className="insurance-detail-hero">
        <div className="insurance-detail-shell insurance-detail-hero__grid">
          <RevealOnScroll className="insurance-detail-hero__content" direction="left">
            <Link className="insurance-detail-back" to="/seguros#coberturas">
              <ArrowLeft size={16} /> Volver a Seguros
            </Link>
            <p className="insurance-detail-eyebrow">{coverage.eyebrow}</p>
            <h1>{coverage.heroTitle}</h1>
            <p className="insurance-detail-hero__lead">{coverage.heroText}</p>
            <div className="insurance-detail-hero__actions">
              {whatsappUrl && (
                <a className="btn insurance-detail-btn--gold" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={18} /> Consultar este seguro
                </a>
              )}
              <a className="insurance-detail-text-link" href="#beneficios">
                Ver beneficios <ArrowRight size={16} />
              </a>
            </div>
            <div className="insurance-detail-hero__trust">
              <span><Check /> Asesoría personalizada</span>
              <span><Check /> Explicación clara</span>
              <span><Check /> Evaluación según tu necesidad</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="insurance-detail-hero__visual" direction="right" delay={110}>
            <div className="insurance-detail-hero__orb"><CoverageIcon /></div>
            <span className="insurance-detail-hero__number">{coverage.index}</span>
            <div className="insurance-detail-hero__card">
              <ShieldCheck />
              <div>
                <small>PROTECCIÓN CON PROPÓSITO</small>
                <strong>{coverage.title}</strong>
                <p>{coverage.note}</p>
              </div>
            </div>
            <div className="insurance-detail-hero__seal"><BadgeCheck /><span>Orientación profesional antes de contratar</span></div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="insurance-detail-intro">
        <div className="insurance-detail-shell insurance-detail-intro__grid">
          <RevealOnScroll className="insurance-detail-intro__copy">
            <p className="insurance-detail-eyebrow">ENTENDER ANTES DE ELEGIR</p>
            <h2>{coverage.overviewTitle}</h2>
            <p>{coverage.overviewText}</p>
          </RevealOnScroll>
          <div className="insurance-detail-pillars">
            {coverage.pillars.map(([title, text], index) => (
              <RevealOnScroll as="article" key={title} delay={index * 75}>
                <span>0{index + 1}</span>
                <div><h3>{title}</h3><p>{text}</p></div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-detail-benefits" id="beneficios">
        <div className="insurance-detail-shell">
          <RevealOnScroll className="insurance-detail-heading insurance-detail-heading--center">
            <p className="insurance-detail-eyebrow">BENEFICIOS DE UNA DECISIÓN INFORMADA</p>
            <h2>¿Qué aporta una protección bien seleccionada?</h2>
            <p>El objetivo es que entiendas el valor de la cobertura y cómo puede integrarse a tu realidad antes de tomar una decisión.</p>
          </RevealOnScroll>
          <div className="insurance-detail-benefits__grid">
            {coverage.benefits.map((benefit, index) => (
              <RevealOnScroll as="article" key={benefit} delay={index * 55}>
                <span><Check /></span>
                <p>{benefit}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-detail-fit">
        <div className="insurance-detail-shell insurance-detail-fit__grid">
          <RevealOnScroll className="insurance-detail-fit__panel" direction="left">
            <span className="insurance-detail-fit__icon"><CoverageIcon /></span>
            <p className="insurance-detail-eyebrow">¿PARA QUIÉN PUEDE TENER SENTIDO?</p>
            <h2>Una cobertura debe responder a una necesidad real</h2>
            <p>Estas son algunas situaciones en las que vale la pena evaluar este tipo de protección con mayor detalle.</p>
          </RevealOnScroll>
          <div className="insurance-detail-fit__list">
            {coverage.idealFor.map((item, index) => (
              <RevealOnScroll as="article" key={item} direction="right" delay={index * 70}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <p>{item}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-detail-questions">
        <div className="insurance-detail-shell">
          <RevealOnScroll className="insurance-detail-heading">
            <p className="insurance-detail-eyebrow">ANTES DE CONTRATAR</p>
            <h2>Tres preguntas que ayudan a tomar una mejor decisión</h2>
          </RevealOnScroll>
          <div className="insurance-detail-questions__grid">
            {coverage.questions.map(([title, text], index) => (
              <RevealOnScroll as="article" key={title} delay={index * 90}>
                <div className="insurance-detail-questions__top"><span>0{index + 1}</span><Sparkles /></div>
                <h3>{title}</h3>
                <p>{text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-detail-advice">
        <div className="insurance-detail-shell insurance-detail-advice__grid">
          <RevealOnScroll>
            <p className="insurance-detail-eyebrow">ASESORÍA PERSONALIZADA</p>
            <h2>No tienes que interpretar una póliza por tu cuenta</h2>
            <p>Conversamos sobre lo que quieres proteger, revisamos alternativas y aclaramos los puntos relevantes para que puedas elegir con mayor seguridad.</p>
          </RevealOnScroll>
          <RevealOnScroll className="insurance-detail-advice__steps" direction="right">
            <div><span>01</span><p><strong>Cuéntame tu necesidad</strong>Identificamos qué quieres proteger y cuáles son tus prioridades.</p></div>
            <div><span>02</span><p><strong>Revisamos opciones</strong>Comparamos alternativas, alcance, condiciones y aspectos importantes.</p></div>
            <div><span>03</span><p><strong>Decides con claridad</strong>Recibes orientación para elegir una opción alineada con tu situación.</p></div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="insurance-detail-cta">
        <RevealOnScroll className="insurance-detail-shell insurance-detail-cta__inner">
          <div>
            <p className="insurance-detail-eyebrow">HABLEMOS DE TU PROTECCIÓN</p>
            <h2>Consulta con Amy sobre {coverage.title.toLowerCase()}</h2>
            <p>Al tocar WhatsApp, el mensaje indicará automáticamente que llegaste desde esta cobertura para que la atención comience con el contexto correcto.</p>
          </div>
          <div className="insurance-detail-cta__actions">
            {whatsappUrl && (
              <a className="btn insurance-detail-btn--gold" href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={19} /> Consultar por WhatsApp
              </a>
            )}
            <Link className="btn insurance-detail-btn--light" to="/seguros">Ver otros seguros</Link>
          </div>
        </RevealOnScroll>
        <div className="insurance-detail-shell">
          <p className="insurance-detail-disclaimer">La disponibilidad, alcance, primas, deducibles, límites, exclusiones y demás condiciones dependen de la aseguradora y del producto finalmente contratado. La información de esta página es orientativa y no sustituye las condiciones particulares de una póliza.</p>
        </div>
      </section>
    </div>
  );
}
