import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Clock3,
  Handshake,
  Quote,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react';
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

  const values = useMemo(() => [
    { title: content.value1Title, text: content.value1Text, icon: UserRound },
    { title: content.value2Title, text: content.value2Text, icon: Handshake },
    { title: content.value3Title, text: content.value3Text, icon: Target },
    { title: content.value4Title, text: content.value4Text, icon: ShieldCheck },
    { title: content.value5Title, text: content.value5Text, icon: TrendingUp },
  ], [content]);

  const heroImage = images.aboutPage || images.aboutHome || images.heroPerson || images.realEstateHero;
  const quoteImage = images.aboutHome || images.realEstateHero || images.aboutPage || images.heroPerson;

  return (
    <div className="amy-about-page">
      <SEO
        title="Sobre mí | Amy Blandón"
        description="Conoce la historia, experiencia y forma de trabajar de Amy Blandón en bienes raíces, seguros e inversiones."
      />

      <section className="amy-about-hero" aria-labelledby="amy-about-title">
        <div className="amy-about-shell amy-about-hero__grid">
          <RevealOnScroll className="amy-about-hero__copy" direction="left">
            <p className="amy-about-kicker content-preserve-format">{content.heroEyebrow}</p>
            <h1 id="amy-about-title">
              <span className="content-preserve-format">{content.heroTitleLine1}</span>
              <span className="amy-about-hero__accent content-preserve-format">{content.heroTitleAccent}</span>
              <span className="content-preserve-format">{content.heroTitleLine3}</span>
            </h1>
            <p className="amy-about-hero__lead content-preserve-format">{content.heroLead}</p>
            <p className="amy-about-hero__role content-preserve-format">{content.heroRole}</p>

            <div className="amy-about-credentials" aria-label="Experiencia y reconocimientos principales">
              <div className="amy-about-credential">
                <Award aria-hidden="true" />
                <span><strong className="content-preserve-format">{content.credential1Title}</strong><small className="content-preserve-format">{content.credential1Text}</small></span>
              </div>
              <div className="amy-about-credential">
                <Clock3 aria-hidden="true" />
                <span><strong className="content-preserve-format">{content.credential2Title}</strong><small className="content-preserve-format">{content.credential2Text}</small></span>
              </div>
            </div>
          </RevealOnScroll>

          <RevealOnScroll className="amy-about-hero__media" direction="right" delay={80}>
            <SafeImage
              className="amy-about-hero__image"
              src={heroImage}
              alt="Amy Blandón"
              width="1080"
              height="1240"
              loading="eager"
              fetchPriority="high"
              objectPosition="center top"
            />
            <span className="amy-about-hero__media-line" aria-hidden="true" />
          </RevealOnScroll>
        </div>
      </section>

      <section className="amy-about-history" aria-labelledby="amy-about-history-title">
        <div className="amy-about-shell amy-about-history__grid">
          <RevealOnScroll className="amy-about-history__heading" direction="left">
            <p className="amy-about-kicker content-preserve-format">{content.historyKicker}</p>
            <h2 id="amy-about-history-title" className="content-preserve-format">{content.historyTitle}</h2>
          </RevealOnScroll>
          <RevealOnScroll className="amy-about-history__copy" direction="right" delay={80}>
            <span className="amy-about-history__rule" aria-hidden="true" />
            <p className="content-preserve-format">{content.historyText}</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="amy-about-values" aria-labelledby="amy-about-values-title">
        <div className="amy-about-shell">
          <RevealOnScroll className="amy-about-section-heading">
            <p className="amy-about-kicker content-preserve-format">{content.valuesKicker}</p>
            <h2 id="amy-about-values-title" className="content-preserve-format">{content.valuesTitle}</h2>
          </RevealOnScroll>

          <div className="amy-about-values__list">
            {values.map((item, index) => {
              const Icon = item.icon;
              return (
                <RevealOnScroll as="article" className="amy-about-value" key={item.title} delay={index * 55}>
                  <Icon aria-hidden="true" />
                  <h3 className="content-preserve-format">{item.title}</h3>
                  <p className="content-preserve-format">{item.text}</p>
                </RevealOnScroll>
              );
            })}
          </div>
        </div>
      </section>

      <section className="amy-about-recognition" aria-labelledby="amy-about-recognition-title">
        <div className="amy-about-shell amy-about-recognition__grid">
          <RevealOnScroll className="amy-about-recognition__mark" direction="left">
            <Award aria-hidden="true" />
            <div>
              <span className="content-preserve-format">{content.recognitionYear}</span>
              <small className="content-preserve-format">{content.recognitionKicker}</small>
            </div>
          </RevealOnScroll>
          <RevealOnScroll className="amy-about-recognition__copy" direction="right" delay={80}>
            <h2 id="amy-about-recognition-title" className="content-preserve-format">{content.recognitionTitle}</h2>
            <p className="content-preserve-format">{content.recognitionText}</p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="amy-about-quote" aria-labelledby="amy-about-quote-title">
        <div className="amy-about-shell amy-about-quote__grid">
          <RevealOnScroll className="amy-about-quote__media" direction="left">
            <SafeImage
              className="amy-about-quote__image"
              src={quoteImage}
              alt="Amy Blandón"
              width="1000"
              height="1180"
              objectPosition="center top"
            />
          </RevealOnScroll>
          <RevealOnScroll className="amy-about-quote__copy" direction="right" delay={80}>
            <Quote aria-hidden="true" />
            <p className="amy-about-kicker content-preserve-format">{content.quoteKicker}</p>
            <blockquote id="amy-about-quote-title" className="content-preserve-format">{content.quoteText}</blockquote>
          </RevealOnScroll>
        </div>
      </section>

      <section className="amy-about-mission" aria-labelledby="amy-about-mission-title">
        <div className="amy-about-shell amy-about-mission__inner">
          <RevealOnScroll className="amy-about-mission__belief" direction="left">
            <p className="amy-about-kicker content-preserve-format">{content.missionKicker}</p>
            <blockquote id="amy-about-mission-title" className="content-preserve-format">{content.missionBelief}</blockquote>
          </RevealOnScroll>
          <RevealOnScroll className="amy-about-mission__copy" direction="right" delay={80}>
            <p className="content-preserve-format">{content.missionText}</p>
            {images.signature ? (
              <img className="amy-about-mission__signature" src={images.signature} alt="Firma de Amy Blandón" loading="lazy" decoding="async" />
            ) : (
              <span className="amy-about-mission__signature-fallback">Amy Blandón</span>
            )}
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
