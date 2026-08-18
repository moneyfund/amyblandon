import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Handshake, MessageCircle, Search } from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SafeImage from '../../components/common/SafeImage';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { aboutContentDefaults } from '../../config/aboutRedesignContent';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

const initialAboutContent = { ...defaultSiteContent.about, ...aboutContentDefaults };
const stripSectionNumber = (value = '') => String(value).replace(/^\s*\d{1,2}\s*[—–-]\s*/u, '').trim();

export default function About() {
  const { images } = useSiteImages();
  const [content, setContent] = useState(initialAboutContent);

  useEffect(() => {
    getSiteContent('about')
      .then((savedContent) => setContent({ ...initialAboutContent, ...(savedContent || {}) }))
      .catch(() => setContent(initialAboutContent));
  }, []);

  const methodSteps = useMemo(() => [
    { title: content.method1Title, text: content.method1Text, icon: MessageCircle },
    { title: content.method2Title, text: content.method2Text, icon: Search },
    { title: content.method3Title, text: content.method3Text, icon: Handshake },
  ], [content]);

  const heroVisual = images.heroBackground || images.strategicBanner;
  const closingImage = images.aboutPage || images.aboutHome || images.realEstateHero;
  const heroDisplayName = String(content.heroName || 'AMY BLANDON')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();

  return (
    <div className="about-editorial-page">
      <SEO
        title="Sobre Mi | Amy Blandon"
        description="Conoce la experiencia, la filosofía y la forma de trabajar de Amy Blandón en bienes raíces, seguros e inversiones."
      />

      <section className="about-editorial-hero" aria-labelledby="about-editorial-title">
        <div className="about-editorial-hero__headline">
          <RevealOnScroll>
            <h1 id="about-editorial-title" className="content-preserve-format">{heroDisplayName}</h1>
            <p className="about-editorial-hero__role content-preserve-format">{content.heroRole}</p>
          </RevealOnScroll>
        </div>

        <span className="about-editorial-hero__gold-line" aria-hidden="true" />

        <RevealOnScroll className="about-editorial-hero__media" delay={90}>
          <SafeImage
            className="about-editorial-hero__image"
            src={heroVisual}
            alt="Bienes raíces, protección patrimonial e inversiones"
            width="1800"
            height="900"
            loading="eager"
            fetchPriority="high"
            objectPosition="center center"
          />
          <div className="about-editorial-hero__media-overlay" aria-hidden="true" />
          <div className="about-editorial-hero__media-labels" aria-label="Áreas de asesoría">
            <span>Bienes Raíces</span>
            <span>Seguros</span>
            <span>Inversiones</span>
          </div>
        </RevealOnScroll>
      </section>

      <section className="about-editorial-intro" aria-labelledby="about-editorial-intro-title">
        <div className="about-editorial-shell about-editorial-intro__grid">
          <RevealOnScroll className="about-editorial-intro__copy" delay={80}>
            <p className="about-editorial-kicker content-preserve-format">{stripSectionNumber(content.introKicker)}</p>
            <h2 id="about-editorial-intro-title" className="content-preserve-format">{content.introTitle}</h2>
            <p className="about-editorial-body about-editorial-body--lead content-preserve-format">{content.introText}</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-editorial-experience" aria-labelledby="about-editorial-experience-title">
        <div className="about-editorial-shell about-editorial-experience__grid">
          <RevealOnScroll className="about-editorial-experience__heading" direction="left">
            <p className="about-editorial-kicker content-preserve-format">{stripSectionNumber(content.experienceKicker)}</p>
            <h2 id="about-editorial-experience-title" className="content-preserve-format">{content.experienceTitle}</h2>
          </RevealOnScroll>

          <RevealOnScroll className="about-editorial-experience__story" direction="right" delay={90}>
            <span className="about-editorial-experience__rule" aria-hidden="true" />
            <p className="about-editorial-body content-preserve-format">{content.experienceText}</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-editorial-method" aria-labelledby="about-editorial-method-title">
        <div className="about-editorial-shell">
          <RevealOnScroll className="about-editorial-method__heading">
            <p className="about-editorial-kicker about-editorial-kicker--light content-preserve-format">{stripSectionNumber(content.methodKicker)}</p>
            <h2 id="about-editorial-method-title" className="content-preserve-format">{content.methodTitle}</h2>
          </RevealOnScroll>

          <div className="about-editorial-method__steps">
            {methodSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <RevealOnScroll as="article" className="about-editorial-method__step" delay={index * 85} key={step.title}>
                  <span className="about-editorial-method__icon" aria-hidden="true"><Icon size={18} strokeWidth={1.45} /></span>
                  <h3 className="content-preserve-format">{step.title}</h3>
                  <p className="content-preserve-format">{step.text}</p>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-editorial-philosophy" aria-labelledby="about-editorial-philosophy-title">
        <div className="about-editorial-shell about-editorial-philosophy__grid">
          <RevealOnScroll className="about-editorial-philosophy__copy" delay={80}>
            <p className="about-editorial-kicker content-preserve-format">{stripSectionNumber(content.editorialPhilosophyKicker)}</p>
            <h2 id="about-editorial-philosophy-title" className="content-preserve-format">{content.editorialPhilosophyTitle}</h2>
            <span className="about-editorial-philosophy__rule" aria-hidden="true" />
            <p className="about-editorial-body content-preserve-format">{content.editorialPhilosophyText}</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-editorial-closing" aria-labelledby="about-editorial-closing-title">
        <RevealOnScroll className="about-editorial-closing__media" direction="left">
          <SafeImage
            className="about-editorial-closing__image"
            src={closingImage}
            alt="Amy Blandón"
            width="1100"
            height="1300"
            objectPosition="center top"
          />
        </RevealOnScroll>

        <RevealOnScroll className="about-editorial-closing__copy" direction="right" delay={90}>
          <p className="about-editorial-kicker about-editorial-kicker--light content-preserve-format">{content.closingKicker}</p>
          <h2 id="about-editorial-closing-title" className="content-preserve-format">{content.closingTitle}</h2>
          <p className="content-preserve-format">{content.closingText}</p>

          {images.signature ? (
            <div className="about-editorial-closing__signature" aria-label="Firma de Amy Blandón">
              <img src={images.signature} alt="Firma de Amy Blandón" loading="lazy" decoding="async" />
            </div>
          ) : (
            <span className="about-editorial-closing__signature-fallback">Amy Blandón</span>
          )}

          <a
            className="about-editorial-closing__cta"
            href="https://wa.me/50588324439"
            target="_blank"
            rel="noreferrer"
          >
            <span>{content.closingCta}</span>
            <ArrowRight size={18} strokeWidth={1.7} aria-hidden="true" />
          </a>
        </RevealOnScroll>
      </section>
    </div>
  );
}
