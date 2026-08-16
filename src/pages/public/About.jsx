import { useEffect, useMemo, useState } from 'react';
import { ArrowDownRight, Home, ShieldCheck, TrendingUp } from 'lucide-react';
import RevealOnScroll from '../../components/common/RevealOnScroll';
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
    {
      number: '01',
      title: content.work1Title,
      lead: content.work1Lead,
      text: content.work1Text,
    },
    {
      number: '02',
      title: content.work2Title,
      lead: content.work2Lead,
      text: content.work2Text,
    },
    {
      number: '03',
      title: content.work3Title,
      lead: content.work3Lead,
      text: content.work3Text,
    },
  ], [content]);

  const areas = useMemo(() => [
    {
      verb: content.area1Verb,
      title: content.area1Title,
      text: content.area1Text,
      icon: Home,
    },
    {
      verb: content.area2Verb,
      title: content.area2Title,
      text: content.area2Text,
      icon: ShieldCheck,
    },
    {
      verb: content.area3Verb,
      title: content.area3Title,
      text: content.area3Text,
      icon: TrendingUp,
    },
  ], [content]);

  const philosophyImage = images.aboutPhilosophy || images.aboutHome || images.aboutPage;
  const heroImage = images.aboutPage || images.aboutHome;

  return (
    <div className="about-page about-page--editorial">
      <SEO
        title="Sobre Mi | Amy Blandon"
        description="Conoce la visión, el propósito y la forma de trabajar de Amy Blandón en bienes raíces, seguros e inversiones."
      />

      <section className="about-editorial-hero" aria-labelledby="about-editorial-title">
        <div className="about-editorial-shell about-editorial-hero__grid">
          <RevealOnScroll className="about-editorial-hero__media" direction="left">
            <div className="about-editorial-hero__image-frame">
              <span className="about-editorial-hero__gold-line" aria-hidden="true" />
              <div className="about-editorial-hero__image">
                {heroImage ? <img src={heroImage} alt="Amy Blandón" /> : <div aria-hidden="true" />}
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="about-editorial-hero__copy" direction="right" delay={100}>
            <p className="about-editorial-kicker content-preserve-format">{content.heroKicker}</p>
            <h1 id="about-editorial-title" className="content-preserve-format">{content.heroTitle}</h1>
            <span className="about-editorial-hero__rule" aria-hidden="true" />
            <p className="about-editorial-hero__name content-preserve-format">{content.heroName}</p>
            <p className="about-editorial-hero__role content-preserve-format">{content.heroRole}</p>
            <p className="about-editorial-hero__text content-preserve-format">{content.heroText}</p>
            <a className="about-editorial-hero__cta" href="#mi-forma-de-trabajar">
              <span className="content-preserve-format">{content.heroCta}</span>
              <ArrowDownRight size={19} aria-hidden="true" />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-purpose" aria-labelledby="about-purpose-title">
        <div className="about-editorial-shell about-purpose__inner">
          <RevealOnScroll>
            <p className="about-editorial-kicker about-editorial-kicker--light content-preserve-format">{content.purposeKicker}</p>
            <h2 id="about-purpose-title" className="content-preserve-format">{content.purposeTitle}</h2>
            <p className="about-purpose__text content-preserve-format">{content.purposeText}</p>
          </RevealOnScroll>

          <RevealOnScroll className="about-purpose__mantra" delay={100}>
            {[content.purposeWord1, content.purposeWord2, content.purposeWord3].map((word, index) => (
              <div className="about-purpose__mantra-item" key={`${word}-${index}`}>
                {index > 0 && <span className="about-purpose__divider" aria-hidden="true" />}
                <strong className="content-preserve-format">{word}</strong>
              </div>
            ))}
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-work" id="mi-forma-de-trabajar" aria-labelledby="about-work-title">
        <div className="about-editorial-shell">
          <RevealOnScroll className="about-editorial-heading">
            <p className="about-editorial-kicker content-preserve-format">{content.workKicker}</p>
            <h2 id="about-work-title" className="content-preserve-format">{content.workTitle}</h2>
          </RevealOnScroll>

          <div className="about-work__grid">
            {workSteps.map((step, index) => (
              <RevealOnScroll as="article" className="about-work__step" delay={index * 90} key={step.number}>
                <div className="about-work__step-heading">
                  <span>{step.number}</span>
                  <strong className="content-preserve-format">{step.title}</strong>
                </div>
                <h3 className="content-preserve-format">{step.lead}</h3>
                <p className="content-preserve-format">{step.text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="about-areas" aria-labelledby="about-areas-title">
        <div className="about-editorial-shell">
          <RevealOnScroll className="about-editorial-heading about-editorial-heading--center">
            <p className="about-editorial-kicker content-preserve-format">{content.areasKicker}</p>
            <h2 id="about-areas-title" className="content-preserve-format">{content.areasTitle}</h2>
          </RevealOnScroll>

          <div className="about-areas__grid">
            {areas.map(({ verb, title, text, icon: Icon }, index) => (
              <RevealOnScroll as="article" className="about-areas__item" delay={index * 90} key={title}>
                <div className="about-areas__topline">
                  <Icon size={21} strokeWidth={1.6} aria-hidden="true" />
                  <span className="content-preserve-format">{verb}</span>
                </div>
                <h3 className="content-preserve-format">{title}</h3>
                <p className="content-preserve-format">{text}</p>
                <span className="about-areas__line" aria-hidden="true" />
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="about-philosophy" aria-labelledby="about-philosophy-title">
        <div className="about-editorial-shell about-philosophy__grid">
          <RevealOnScroll className="about-philosophy__media" direction="left">
            <div className="about-philosophy__image">
              {philosophyImage ? <img src={philosophyImage} alt="Amy Blandón en una sesión de asesoría" /> : <div aria-hidden="true" />}
            </div>
            <span className="about-philosophy__corner" aria-hidden="true" />
          </RevealOnScroll>

          <RevealOnScroll className="about-philosophy__copy" direction="right" delay={100}>
            <p className="about-editorial-kicker content-preserve-format">{content.philosophyKicker}</p>
            <h2 id="about-philosophy-title" className="content-preserve-format">{content.philosophyTitle}</h2>
            <span className="about-philosophy__rule" aria-hidden="true" />
            <p className="content-preserve-format">{content.philosophyText}</p>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
