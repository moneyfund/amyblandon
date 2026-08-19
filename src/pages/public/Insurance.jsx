import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  Handshake,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SectorSocialSection from '../../components/common/SectorSocialSection';
import SEO from '../../components/common/SEO';
import { insuranceCoverages } from '../../config/insuranceCoverages';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

const coverageVisuals = {
  'vida-salud': {
    image: 'https://images.unsplash.com/photo-1758691461935-202e2ef6b69f?auto=format&fit=crop&w=1400&q=82',
    position: '48% center',
  },
  'hogar-patrimonio': {
    image: 'https://images.unsplash.com/photo-1721222204126-e7042f2893b1?auto=format&fit=crop&w=1400&q=82',
    position: '48% center',
  },
  vehiculos: {
    image: 'https://images.unsplash.com/photo-1612378025826-472db1982308?auto=format&fit=crop&w=1400&q=82',
    position: '54% center',
  },
  negocios: {
    image: 'https://images.unsplash.com/photo-1758518730151-cf64fddb4f0a?auto=format&fit=crop&w=1400&q=82',
    position: '46% center',
  },
  familia: {
    image: 'https://images.unsplash.com/photo-1772510748770-8cf9eba8d229?auto=format&fit=crop&w=1400&q=82',
    position: '47% center',
  },
  'proteccion-integral': {
    image: 'https://images.unsplash.com/photo-1501987808855-ac803c7bb45e?auto=format&fit=crop&w=1400&q=82',
    position: '52% center',
  },
};

export default function Insurance() {
  const { images } = useSiteImages();
  const [content, setContent] = useState(defaultSiteContent.insurance);
  const heroImage = images.insuranceHero || images.aboutPage;

  useEffect(() => {
    getSiteContent('insurance').then(setContent).catch(() => setContent(defaultSiteContent.insurance));
  }, []);

  const guidancePoints = [content.guidancePoint1, content.guidancePoint2, content.guidancePoint3, content.guidancePoint4];

  return (
    <div className="insurance-page">
      <SEO
        title="Seguros | Amy Blandón"
        description="Asesoría en seguros para proteger tu familia, patrimonio, vehículo y negocio con soluciones claras y responsables."
      />

      <section className="insurance-hero">
        <div className="insurance-shell insurance-hero__grid">
          <RevealOnScroll className="insurance-hero__content">
            <p className="insurance-eyebrow content-preserve-format">{content.heroEyebrow}</p>
            <h1 className="content-preserve-format">{content.heroTitle}</h1>
            <p className="insurance-hero__lead content-preserve-format">{content.heroText}</p>
            <div className="insurance-hero__actions">
              <Link className="btn insurance-btn--gold" to="/insurance/quote">{content.heroPrimaryButton} <ArrowRight size={17} /></Link>
              <a className="insurance-text-link" href="#coberturas">{content.heroSecondaryButton} <ArrowRight size={16} /></a>
            </div>
            <div className="insurance-hero__trust">
              <span><Check size={15} /> {content.heroTrust1}</span>
              <span><Check size={15} /> {content.heroTrust2}</span>
              <span><Check size={15} /> {content.heroTrust3}</span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="insurance-hero__visual" direction="right" delay={100}>
            <div className="insurance-hero__image-wrap">
              {heroImage
                ? <img src={heroImage} alt="Amy Blandón, asesora de seguros" />
                : <div className="insurance-hero__placeholder"><ShieldCheck /><span>Protección que acompaña tus decisiones</span></div>}
            </div>
            <div className="insurance-hero__shield">
              <ShieldCheck />
              <span><b>{content.heroShieldTitle}</b><span className="content-preserve-format">{content.heroShieldText}</span></span>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="insurance-assurance">
        <div className="insurance-shell insurance-assurance__grid">
          <RevealOnScroll><ShieldCheck /><div><b>{content.assurance1Title}</b><span className="content-preserve-format">{content.assurance1Text}</span></div></RevealOnScroll>
          <RevealOnScroll delay={70}><Sparkles /><div><b>{content.assurance2Title}</b><span className="content-preserve-format">{content.assurance2Text}</span></div></RevealOnScroll>
          <RevealOnScroll delay={140}><Handshake /><div><b>{content.assurance3Title}</b><span className="content-preserve-format">{content.assurance3Text}</span></div></RevealOnScroll>
        </div>
      </section>

      <SectorSocialSection sector="insurance" />

      <section className="insurance-section insurance-coverages" id="coberturas">
        <div className="insurance-shell">
          <RevealOnScroll className="insurance-heading insurance-heading--center">
            <p className="insurance-eyebrow content-preserve-format">{content.coveragesEyebrow}</p>
            <h2 className="content-preserve-format">{content.coveragesTitle}</h2>
            <p className="content-preserve-format">{content.coveragesText}</p>
          </RevealOnScroll>

          <div className="insurance-coverages__grid">
            {insuranceCoverages.map(({ icon: Icon, slug, title, shortText }, cardIndex) => {
              const visual = coverageVisuals[slug];
              return (
                <RevealOnScroll
                  as={Link}
                  to={`/seguros/${slug}`}
                  className="insurance-coverage-card insurance-coverage-card--link insurance-coverage-card--visual"
                  key={slug}
                  delay={cardIndex * 55}
                  aria-label={`Conocer cobertura de ${title}`}
                  style={{
                    '--coverage-image': visual ? `url(\"${visual.image}\")` : 'none',
                    '--coverage-position': visual?.position || 'center',
                  }}
                >
                  <span className="insurance-coverage-card__photo" aria-hidden="true" />
                  <span className="insurance-coverage-card__photo-shade" aria-hidden="true" />
                  <span className="insurance-coverage-card__content">
                    <span className="insurance-coverage-card__icon"><Icon /></span>
                    <h3>{title}</h3>
                    <span className="insurance-coverage-card__ornament" aria-hidden="true"><i /></span>
                    <p>{shortText}</p>
                    <span className="insurance-coverage-card__cta">CONOCE MÁS <ArrowRight size={16} /></span>
                  </span>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="insurance-section insurance-guidance">
        <div className="insurance-shell insurance-guidance__grid">
          <RevealOnScroll className="insurance-guidance__content" direction="left">
            <p className="insurance-eyebrow content-preserve-format">{content.guidanceEyebrow}</p>
            <h2 className="content-preserve-format">{content.guidanceTitle}</h2>
            <p className="content-preserve-format">{content.guidanceText}</p>
            <ul>
              {guidancePoints.map((point, index) => (
                <li key={`${index}-${point}`}><Check /><span className="content-preserve-format">{point}</span></li>
              ))}
            </ul>
            <Link className="btn insurance-btn--navy" to="/insurance/quote">{content.guidanceButton} <ArrowRight size={17} /></Link>
          </RevealOnScroll>

          <RevealOnScroll className="insurance-guidance__panel" direction="right" delay={100}>
            <div className="insurance-guidance__orb"><ShieldCheck /></div>
            <p className="insurance-guidance__quote content-preserve-format">{content.guidanceQuote}</p>
            <div className="insurance-guidance__metric"><strong>01</strong><span className="content-preserve-format">{content.guidanceMetric1}</span></div>
            <div className="insurance-guidance__metric"><strong>02</strong><span className="content-preserve-format">{content.guidanceMetric2}</span></div>
            <div className="insurance-guidance__metric"><strong>03</strong><span className="content-preserve-format">{content.guidanceMetric3}</span></div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
