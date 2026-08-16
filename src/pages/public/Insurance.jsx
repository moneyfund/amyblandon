import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  FileSearch,
  Handshake,
  PhoneCall,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
} from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SectorSocialSection from '../../components/common/SectorSocialSection';
import SEO from '../../components/common/SEO';
import { insuranceCoverages } from '../../config/insuranceCoverages';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

const processFor = (content) => [
  { icon: PhoneCall, number: '01', title: content.process1Title, text: content.process1Text },
  { icon: FileSearch, number: '02', title: content.process2Title, text: content.process2Text },
  { icon: SlidersHorizontal, number: '03', title: content.process3Title, text: content.process3Text },
  { icon: Handshake, number: '04', title: content.process4Title, text: content.process4Text },
];

const principlesFor = (content) => [
  [content.principle1Title, content.principle1Text],
  [content.principle2Title, content.principle2Text],
  [content.principle3Title, content.principle3Text],
];

export default function Insurance() {
  const { images } = useSiteImages();
  const [content, setContent] = useState(defaultSiteContent.insurance);
  const heroImage = images.insuranceHero || images.aboutPage;

  useEffect(() => {
    getSiteContent('insurance').then(setContent).catch(() => setContent(defaultSiteContent.insurance));
  }, []);

  const process = processFor(content);
  const principles = principlesFor(content);
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
            {insuranceCoverages.map(({ icon: Icon, slug, index, title, shortText, note }, cardIndex) => (
              <RevealOnScroll
                as={Link}
                to={`/seguros/${slug}`}
                className="insurance-coverage-card insurance-coverage-card--link"
                key={slug}
                delay={cardIndex * 55}
                aria-label={`Conocer cobertura de ${title}`}
              >
                <span className="insurance-coverage-card__icon"><Icon /></span>
                <span className="insurance-coverage-card__index">{index}</span>
                <h3>{title}</h3>
                <p>{shortText}</p>
                <small>{note}</small>
                <span className="insurance-coverage-card__cta">Conocer cobertura <ArrowRight size={15} /></span>
              </RevealOnScroll>
            ))}
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

      <section className="insurance-section insurance-process">
        <div className="insurance-shell">
          <RevealOnScroll className="insurance-heading insurance-heading--center">
            <p className="insurance-eyebrow content-preserve-format">{content.processEyebrow}</p>
            <h2 className="content-preserve-format">{content.processTitle}</h2>
            <p className="content-preserve-format">{content.processText}</p>
          </RevealOnScroll>

          <div className="insurance-process__grid">
            {process.map(({ icon: Icon, number, title, text }, index) => (
              <RevealOnScroll as="article" className="insurance-process__step" key={number} delay={index * 80}>
                <div className="insurance-process__top"><span>{number}</span><Icon /></div>
                <h3 className="content-preserve-format">{title}</h3>
                <p className="content-preserve-format">{text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="insurance-section insurance-principles">
        <div className="insurance-shell insurance-principles__grid">
          <RevealOnScroll className="insurance-principles__intro">
            <p className="insurance-eyebrow content-preserve-format">{content.principlesEyebrow}</p>
            <h2 className="content-preserve-format">{content.principlesTitle}</h2>
            <p className="content-preserve-format">{content.principlesText}</p>
          </RevealOnScroll>
          <div className="insurance-principles__list">
            {principles.map(([title, text], index) => (
              <RevealOnScroll as="article" key={`${index}-${title}`} delay={index * 70}>
                <span>0{index + 1}</span>
                <div><h3 className="content-preserve-format">{title}</h3><p className="content-preserve-format">{text}</p></div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
