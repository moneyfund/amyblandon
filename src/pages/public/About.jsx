import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, Home, ShieldCheck, TrendingUp } from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SafeImage from '../../components/common/SafeImage';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { aboutContentDefaults } from '../../config/aboutRedesignContent';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

const initialAboutContent = { ...defaultSiteContent.about, ...aboutContentDefaults };

export default function About() {
  const { images } = useSiteImages();
  const [content, setContent] = useState(initialAboutContent);

  useEffect(() => {
    getSiteContent('about')
      .then((savedContent) => setContent({ ...initialAboutContent, ...(savedContent || {}) }))
      .catch(() => setContent(initialAboutContent));
  }, []);

  const workSteps = useMemo(() => [
    { number: '01', title: content.work1Title, lead: content.work1Lead, text: content.work1Text },
    { number: '02', title: content.work2Title, lead: content.work2Lead, text: content.work2Text },
    { number: '03', title: content.work3Title, lead: content.work3Lead, text: content.work3Text },
  ], [content]);

  const areas = useMemo(() => [
    { verb: content.area1Verb, title: content.area1Title, text: content.area1Text, icon: Home },
    { verb: content.area2Verb, title: content.area2Title, text: content.area2Text, icon: ShieldCheck },
    { verb: content.area3Verb, title: content.area3Title, text: content.area3Text, icon: TrendingUp },
  ], [content]);

  const heroImage = images.aboutPage || images.aboutHome;
  const philosophyImage = images.aboutPhilosophy || images.aboutHome || images.aboutPage;
  const purposeWords = [content.purposeWord1, content.purposeWord2, content.purposeWord3].filter(Boolean);

  return (
    <div className="about-home-style">
      <SEO
        title="Sobre Mi | Amy Blandon"
        description="Conoce la visión, el propósito y la forma de trabajar de Amy Blandón en bienes raíces, seguros e inversiones."
      />

      <section className="about-home-hero" aria-labelledby="about-home-title">
        <div className="about-home-shell about-home-hero__grid">
          <RevealOnScroll className="about-home-hero__copy">
            <p className="about-home-kicker about-home-kicker--light content-preserve-format">{content.heroKicker}</p>
            <h1 id="about-home-title" className="content-preserve-format">{content.heroTitle}</h1>
            <p className="about-home-hero__text content-preserve-format">{content.heroText}</p>

            <div className="about-home-hero__identity">
              <div>
                <p className="about-home-hero__name content-preserve-format">{content.heroName}</p>
                <p className="about-home-hero__role content-preserve-format">{content.heroRole}</p>
              </div>
              <a className="about-home-hero__cta" href="#mi-forma-de-trabajar">
                <span className="content-preserve-format">{content.heroCta}</span>
                <ArrowDownRight size={18} aria-hidden="true" />
              </a>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="about-home-hero__media" direction="right" delay={120}>
            <div className="about-home-hero__image-wrap">
              <SafeImage
                className="about-home-hero__image"
                src={heroImage}
                alt="Amy Blandón"
                width="760"
                height="920"
                loading="eager"
                fetchPriority="high"
                objectPosition="center top"
              />
              <div className="about-home-hero__monogram" aria-hidden="true">AB</div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-home-purpose" aria-labelledby="about-purpose-title">
        <div className="about-home-shell about-home-purpose__grid">
          <RevealOnScroll className="about-home-purpose__heading">
            <p className="about-home-kicker content-preserve-format">{content.purposeKicker}</p>
            <h2 id="about-purpose-title" className="content-preserve-format">{content.purposeTitle}</h2>
          </RevealOnScroll>

          <RevealOnScroll className="about-home-purpose__body" delay={90}>
            <p className="about-home-purpose__text content-preserve-format">{content.purposeText}</p>
            <div className="about-home-purpose__words" aria-label="Principios de asesoría">
              {purposeWords.map((word, index) => (
                <div className="about-home-purpose__word" key={word}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <strong className="content-preserve-format">{word}</strong>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-home-work" id="mi-forma-de-trabajar" aria-labelledby="about-work-title">
        <div className="about-home-shell">
          <RevealOnScroll className="about-home-section-heading">
            <p className="about-home-kicker content-preserve-format">{content.workKicker}</p>
            <h2 id="about-work-title" className="content-preserve-format">{content.workTitle}</h2>
          </RevealOnScroll>

          <div className="about-home-work__grid">
            {workSteps.map((step, index) => (
              <RevealOnScroll as="article" className="about-home-work__step" delay={index * 85} key={step.number}>
                <div className="about-home-work__step-top">
                  <span className="about-home-work__step-number">{step.number}</span>
                  <span className="about-home-work__step-line" aria-hidden="true" />
                </div>
                <p className="about-home-work__step-title content-preserve-format">{step.title}</p>
                <h3 className="content-preserve-format">{step.lead}</h3>
                <p className="about-home-work__step-text content-preserve-format">{step.text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="about-home-areas" aria-labelledby="about-areas-title">
        <div className="about-home-shell">
          <RevealOnScroll className="about-home-section-heading about-home-section-heading--light">
            <p className="about-home-kicker about-home-kicker--light content-preserve-format">{content.areasKicker}</p>
            <h2 id="about-areas-title" className="content-preserve-format">{content.areasTitle}</h2>
          </RevealOnScroll>

          <div className="about-home-areas__grid">
            {areas.map(({ verb, title, text, icon: Icon }, index) => (
              <RevealOnScroll as="article" className="about-home-area" delay={index * 90} key={title}>
                <div className="about-home-area__top">
                  <span className="about-home-area__icon" aria-hidden="true">
                    <Icon size={34} strokeWidth={1.45} />
                  </span>
                  <span className="about-home-area__index">0{index + 1}</span>
                </div>
                <span className="about-home-area__verb content-preserve-format">{verb}</span>
                <h3 className="content-preserve-format">{title}</h3>
                <p className="content-preserve-format">{text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="about-home-philosophy" aria-labelledby="about-philosophy-title">
        <div className="about-home-shell about-home-philosophy__grid">
          <RevealOnScroll className="about-home-philosophy__media" direction="left">
            <div className="about-home-philosophy__image-wrap">
              <SafeImage
                className="about-home-philosophy__image"
                src={philosophyImage}
                alt="Amy Blandón en una sesión de asesoría"
                width="720"
                height="880"
                objectPosition="center top"
              />
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="about-home-philosophy__copy" direction="right" delay={100}>
            <p className="about-home-kicker content-preserve-format">{content.philosophyKicker}</p>
            <span className="about-home-philosophy__quote-mark" aria-hidden="true">“</span>
            <h2 id="about-philosophy-title" className="content-preserve-format">{content.philosophyTitle}</h2>
            <p className="about-home-philosophy__text content-preserve-format">{content.philosophyText}</p>
            {images.signature ? (
              <div className="about-home-philosophy__signature" aria-label="Firma de Amy Blandón">
                <img src={images.signature} alt="Firma de Amy Blandón" loading="lazy" decoding="async" />
              </div>
            ) : null}
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
