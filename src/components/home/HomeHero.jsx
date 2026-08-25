import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { whatsappLink } from '../../utils/whatsapp';

const referenceHeroLines = ['Tu próxima', 'inversión,', 'comienza con', 'una buena', 'decisión'];
const HERO_SLIDE_INTERVAL = 3000;

function normalizeComparableTitle(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[¡!¿?.,;:–—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLocaleLowerCase('es');
}

const referenceHeroTitle = normalizeComparableTitle(homePageContent.hero.plainTitle);

function resolveHeroTitleLines(value) {
  const title = String(value || '').trim();
  if (!title) return referenceHeroLines;

  const explicitLines = title
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (explicitLines.length > 1) return explicitLines;

  // Firestore puede guardar la misma frase con mayúsculas o puntuación distinta.
  // Si semánticamente es el título aprobado, mantenemos siempre sus 5 filas exactas.
  if (normalizeComparableTitle(title) === referenceHeroTitle) return referenceHeroLines;

  return [title];
}

export default function HomeHero({ content }) {
  const { images } = useSiteImages();
  const [slideIndex, setSlideIndex] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const title = content?.heroTitle || homePageContent.hero.plainTitle;
  const hero = {
    plainTitle: title,
    eyebrow: content?.heroLabel || homePageContent.hero.eyebrow,
    titleLines: resolveHeroTitleLines(title),
    text: content?.heroSubtitle || homePageContent.hero.text,
    button: content?.heroButton || homePageContent.hero.button,
  };

  const heroBackgrounds = useMemo(() => {
    const managedSlides = [
      images.heroHome1,
      images.heroHome2,
      images.heroHome3,
      images.heroHome4,
    ]
      .map((value) => String(value || '').trim())
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

    if (managedSlides.length) return managedSlides;
    return images.heroBackground ? [images.heroBackground] : [];
  }, [
    images.heroBackground,
    images.heroHome1,
    images.heroHome2,
    images.heroHome3,
    images.heroHome4,
  ]);

  const renderedBackgrounds = useMemo(() => {
    if (heroBackgrounds.length < 2) return heroBackgrounds;
    return [...heroBackgrounds, heroBackgrounds[0]];
  }, [heroBackgrounds]);

  useEffect(() => {
    setIsJumping(true);
    setSlideIndex(0);
    const frame = window.requestAnimationFrame(() => setIsJumping(false));
    return () => window.cancelAnimationFrame(frame);
  }, [heroBackgrounds]);

  useEffect(() => {
    if (heroBackgrounds.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setIsJumping(false);
      setSlideIndex((current) => current + 1);
    }, HERO_SLIDE_INTERVAL);

    return () => window.clearInterval(timer);
  }, [heroBackgrounds.length]);

  useEffect(() => {
    heroBackgrounds.slice(1).forEach((src) => {
      const image = new Image();
      image.decoding = 'async';
      image.src = src;
    });
  }, [heroBackgrounds]);

  const handleTrackTransitionEnd = (event) => {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;
    if (heroBackgrounds.length < 2 || slideIndex !== heroBackgrounds.length) return;

    setIsJumping(true);
    setSlideIndex(0);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setIsJumping(false));
    });
  };

  return (
    <section className="home-hero" aria-label={hero.plainTitle}>
      <div className="home-hero__inner">
        <RevealOnScroll className="home-hero__copy">
          <p className="home-kicker content-preserve-format">{hero.eyebrow}</p>
          <h1>{hero.titleLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</h1>
          <p className="content-preserve-format">{hero.text}</p>
          <a className="amy-button" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)}>
            <MessageCircle size={20} />
            {hero.button}
          </a>
        </RevealOnScroll>

        <RevealOnScroll className="home-hero__media home-hero__media--layered" direction="right" delay={120}>
          <div className="home-hero__background-viewport" aria-hidden="true">
            <div
              className={`home-hero__background-track ${isJumping ? 'is-jumping' : ''}`}
              style={{ transform: `translate3d(-${slideIndex * 100}%, 0, 0)` }}
              onTransitionEnd={handleTrackTransitionEnd}
            >
              {renderedBackgrounds.map((src, index) => (
                <SafeImage
                  key={`${src}-${index}`}
                  className="home-hero__background home-hero__background-slide"
                  src={src}
                  alt=""
                  width="900"
                  height="1120"
                  loading={index === 0 ? 'eager' : 'lazy'}
                  fetchPriority={index === 0 ? 'high' : 'auto'}
                  decoding="async"
                  objectPosition="center"
                />
              ))}
            </div>
          </div>

          <SafeImage
            className="home-hero__person"
            src={images.heroPerson}
            alt="Asesora profesional de Amy Blandon"
            width="900"
            height="1280"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            objectFit="contain"
            objectPosition="center bottom"
          />
        </RevealOnScroll>
      </div>
    </section>
  );
}
