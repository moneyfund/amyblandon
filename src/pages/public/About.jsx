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

      <section className="about-home-intro" aria-labelledby="about-home-title">
        <div className="about-home-shell about-home-intro__grid">
          <RevealOnScroll className="about-home-intro__media" direction="left">
            <div className="about-home-intro__image">
              {heroImage ? <img src={heroImage} alt="Amy Blandón" /> : <div aria-hidden="true" />}
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="about-home-intro__copy" direction="right" delay={90}>
            <p className="about-home-kicker content-preserve-format">{content.heroKicker}</p>
            <h1 id="about-home-title" className="content-preserve-format">{content.heroTitle}</h1>

            <div className="about-home-intro__identity">
              <p className="about-home-intro__name content-preserve-format">{content.heroName}</p>
              <p className="about-home-intro__role content-preserve-format">{content.heroRole}</p>
            </div>

            <p className="about-home-intro__text content-preserve-format">{content.heroText}</p>
            <a className="about-home-intro__cta" href="#mi-forma-de-trabajar">
              <span className="content-preserve-format">{content.heroCta}</span>
              <ArrowDownRight size={18} aria-hidden="true" />
            </a>
          </RevealOnScroll>
        </div>
      </section>

      <section className="about-home-purpose" aria-labelledby="about-purpose-title">
        <div className="about-home-shell about-home-purpose__grid">
          <RevealOnScroll>
            <p className="about-home-kicker content-preserve-format">{content.purposeKicker}</p>
            <h2 id="about-purpose-title" className="content-preserve-format">{content.purposeTitle}</h2>
          </RevealOnScroll>

          <RevealOnScroll delay={90}>
            <p className="about-home-purpose__text content-preserve-format">{content.purposeText}</p>
            <div className="about-home-purpose__words" aria-label="Principios de asesoría">
              {purposeWords.map((word) => (
                <div className="about-home-purpose__word content-preserve-format" key={word}>{word}</div>
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
              <RevealOnScroll as="article" className="about-home-work__step" delay={index * 80} key={step.number}>
                <div className="about-home-work__step-head">
                  <span className="about-home-work__step-number">{step.number}</span>
                  <span className="about-home-work__step-title content-preserve-format">{step.title}</span>
                </div>
                <h3 className="content-preserve-format">{step.lead}</h3>
                <p className="content-preserve-format">{step.text}</p>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="about-home-areas" aria-labelledby="about-areas-title">
        <div className="about-home-shell">
          <RevealOnScroll className="about-home-section-heading about-home-section-heading--center">
            <p className="about-home-kicker content-preserve-format">{content.areasKicker}</p>
            <h2 id="about-areas-title" className="content-preserve-format">{content.areasTitle}</h2>
          </RevealOnScroll>

          <div className="about-home-areas__grid">
            {areas.map(({ verb, title, text, icon: Icon }, index) => (
              <RevealOnScroll as="article" className="about-home-area" delay={index * 85} key={title}>
                <span className="about-home-area__icon" aria-hidden="true">
                  <Icon size={62} strokeWidth={1.25} />
                </span>
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
          <RevealOnScroll className="about-home-philosophy__copy" direction="left">
            <p className="about-home-kicker content-preserve-format">{content.philosophyKicker}</p>
            <h2 id="about-philosophy-title" className="content-preserve-format">{content.philosophyTitle}</h2>
            <p className="content-preserve-format">{content.philosophyText}</p>
          </RevealOnScroll>

          <RevealOnScroll className="about-home-philosophy__media" direction="right" delay={90}>
            <div className="about-home-philosophy__image">
              {philosophyImage ? <img src={philosophyImage} alt="Amy Blandón en una sesión de asesoría" /> : <div aria-hidden="true" />}
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
