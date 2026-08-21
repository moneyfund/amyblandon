import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  Clock3,
  Handshake,
  Home,
  ShieldCheck,
  Target,
  TrendingUp,
  UserRound,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import RevealOnScroll from '../../components/common/RevealOnScroll';
import SafeImage from '../../components/common/SafeImage';
import SEO from '../../components/common/SEO';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { aboutContentDefaults } from '../../config/aboutRedesignContent';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

const initialAboutContent = { ...defaultSiteContent.about, ...aboutContentDefaults };
const ABOUT_HERO_SLIDE_INTERVAL = 3000;

export default function About() {
  const { images } = useSiteImages();
  const [content, setContent] = useState(initialAboutContent);
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [heroIsJumping, setHeroIsJumping] = useState(false);

  useEffect(() => {
    getSiteContent('about')
      .then((savedContent) => setContent({ ...initialAboutContent, ...(savedContent || {}) }))
      .catch(() => setContent(initialAboutContent));
  }, []);

  const commitments = useMemo(() => [
    { title: content.commitment1Title, text: content.commitment1Text, icon: ShieldCheck },
    { title: content.commitment2Title, text: content.commitment2Text, icon: Home },
    { title: content.commitment3Title, text: content.commitment3Text, icon: TrendingUp },
    { title: content.commitment4Title, text: content.commitment4Text, icon: Handshake },
  ], [content]);

  const values = useMemo(() => [
    { title: content.value1Title, text: content.value1Text, icon: UserRound },
    { title: content.value2Title, text: content.value2Text, icon: Handshake },
    { title: content.value3Title, text: content.value3Text, icon: Target },
    { title: content.value4Title, text: content.value4Text, icon: ShieldCheck },
    { title: content.value5Title, text: content.value5Text, icon: TrendingUp },
  ], [content]);

  const heroImage = images.aboutPage || images.aboutHome || images.heroPerson || images.realEstateHero;

  const aboutHeroPeople = useMemo(() => [
    images.aboutHeroAmy1,
    images.aboutHeroAmy2,
    images.aboutHeroAmy3,
    images.aboutHeroAmy4,
  ]
    .map((value) => String(value || '').trim())
    .filter(Boolean)
    .filter((value, index, valuesList) => valuesList.indexOf(value) === index), [
    images.aboutHeroAmy1,
    images.aboutHeroAmy2,
    images.aboutHeroAmy3,
    images.aboutHeroAmy4,
  ]);

  const renderedAboutHeroPeople = useMemo(() => {
    if (aboutHeroPeople.length < 2) return aboutHeroPeople;
    return [...aboutHeroPeople, aboutHeroPeople[0]];
  }, [aboutHeroPeople]);

  const useManagedAboutHero = aboutHeroPeople.length > 0;
  const aboutHeroBackground = images.aboutHeroBackground;

  useEffect(() => {
    setHeroIsJumping(true);
    setHeroSlideIndex(0);
    const frame = window.requestAnimationFrame(() => setHeroIsJumping(false));
    return () => window.cancelAnimationFrame(frame);
  }, [aboutHeroPeople]);

  useEffect(() => {
    if (aboutHeroPeople.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setHeroIsJumping(false);
      setHeroSlideIndex((current) => current + 1);
    }, ABOUT_HERO_SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [aboutHeroPeople.length]);

  useEffect(() => {
    aboutHeroPeople.slice(1).forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }, [aboutHeroPeople]);

  const handleAboutHeroTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    if (aboutHeroPeople.length < 2 || heroSlideIndex !== aboutHeroPeople.length) return;

    setHeroIsJumping(true);
    setHeroSlideIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setHeroIsJumping(false));
    });
  };

  const renderValueCards = (duplicate = false) => values.map((item, index) => {
    const Icon = item.icon;
    return (
      <RevealOnScroll
        as="article"
        className="amy-about-value"
        key={`${duplicate ? 'duplicate-' : ''}${item.title}`}
        delay={duplicate ? 0 : index * 55}
      >
        <Icon aria-hidden="true" />
        <h3 className="content-preserve-format">{item.title}</h3>
        <p className="content-preserve-format">{item.text}</p>
      </RevealOnScroll>
    );
  });

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
            <div className="amy-about-hero__divider" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
          </RevealOnScroll>

          <RevealOnScroll
            className={`amy-about-hero__media ${useManagedAboutHero ? 'amy-about-hero__media--managed' : ''}`}
            direction="right"
            delay={80}
          >
            {useManagedAboutHero ? (
              <>
                <SafeImage
                  className="amy-about-hero__managed-background"
                  src={aboutHeroBackground}
                  alt=""
                  width="1200"
                  height="1000"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  objectFit="cover"
                  objectPosition="center"
                />
                <div className="amy-about-hero__people-viewport">
                  <div
                    className={`amy-about-hero__people-track ${heroIsJumping ? 'is-jumping' : ''}`}
                    style={{ transform: `translate3d(-${heroSlideIndex * 100}%, 0, 0)` }}
                    onTransitionEnd={handleAboutHeroTransitionEnd}
                  >
                    {renderedAboutHeroPeople.map((src, index) => (
                      <SafeImage
                        key={`${src}-${index}`}
                        className="amy-about-hero__person-slide"
                        src={src}
                        alt={index < aboutHeroPeople.length ? 'Amy Blandón' : ''}
                        width="1080"
                        height="1400"
                        loading={index === 0 ? 'eager' : 'lazy'}
                        fetchPriority={index === 0 ? 'high' : 'auto'}
                        decoding="async"
                        objectFit="contain"
                        objectPosition="center bottom"
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
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
            )}
            <span className="amy-about-hero__media-line" aria-hidden="true" />

            <div className="amy-about-photo-credentials" aria-label="Experiencia y reconocimientos principales">
              <article className="amy-about-photo-credential">
                <Award aria-hidden="true" />
                <span>
                  <strong className="content-preserve-format">{content.credential1Title}</strong>
                  <small className="content-preserve-format">{content.credential1Text}</small>
                </span>
              </article>
              <article className="amy-about-photo-credential">
                <Clock3 aria-hidden="true" />
                <span>
                  <strong className="content-preserve-format">{content.credential2Title}</strong>
                  <small className="content-preserve-format">{content.credential2Text}</small>
                </span>
              </article>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="amy-about-history" aria-labelledby="amy-about-history-title">
        <div className="amy-about-shell amy-about-history__combined">
          <RevealOnScroll className="amy-about-history__story" direction="left">
            <p className="amy-about-kicker content-preserve-format">{content.historyKicker}</p>
            <h2 id="amy-about-history-title" className="content-preserve-format">{content.historyTitle}</h2>
            <span className="amy-about-history__rule" aria-hidden="true" />
            <p className="amy-about-history__text content-preserve-format">{content.historyText}</p>
            <Link className="amy-about-history__recognitions" to="/sobre-mi/reconocimientos">
              <span>Conoce mis reconocimientos</span>
              <span className="amy-about-history__recognitions-arrow" aria-hidden="true">→</span>
            </Link>
          </RevealOnScroll>

          <RevealOnScroll className="amy-about-commitments" direction="right" delay={80}>
            <div className="amy-about-commitments__heading">
              <span aria-hidden="true" />
              <p className="content-preserve-format">{content.commitmentsKicker}</p>
              <i aria-hidden="true" />
              <span aria-hidden="true" />
            </div>
            <div className="amy-about-commitments__grid">
              {commitments.map(({ title, text, icon: Icon }) => (
                <article className="amy-about-commitment" key={title}>
                  <Icon aria-hidden="true" />
                  <h3 className="content-preserve-format">{title}</h3>
                  <p className="content-preserve-format">{text}</p>
                </article>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="amy-about-values" aria-labelledby="amy-about-values-title">
        <div className="amy-about-shell">
          <RevealOnScroll className="amy-about-section-heading">
            <p className="amy-about-kicker content-preserve-format">{content.valuesKicker}</p>
            <h2 id="amy-about-values-title" className="content-preserve-format">{content.valuesTitle}</h2>
          </RevealOnScroll>

          <div className="amy-about-values__viewport">
            <div className="amy-about-values__track">
              <div className="amy-about-values__list">
                {renderValueCards(false)}
              </div>
              <div className="amy-about-values__list amy-about-values__list--duplicate" aria-hidden="true">
                {renderValueCards(true)}
              </div>
            </div>
          </div>
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

      <section className="amy-about-client-quote" aria-label="Frase de Amy Blandón">
        <div className="amy-about-shell">
          <RevealOnScroll className="amy-about-client-quote__panel">
            <span className="amy-about-client-quote__mark" aria-hidden="true">“</span>
            <blockquote className="content-preserve-format">{content.closingQuote}</blockquote>
          </RevealOnScroll>
        </div>
      </section>
    </div>
  );
}
