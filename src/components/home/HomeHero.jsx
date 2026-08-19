import { useEffect, useMemo, useState } from 'react';
import { MessageCircle } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { whatsappLink } from '../../utils/whatsapp';

const referenceHeroLines = ['Tu próxima', 'inversión,', 'comienza con', 'una buena', 'decisión'];
const referenceHeroTitle = homePageContent.hero.plainTitle.toLocaleLowerCase('es');
const HERO_SLIDE_INTERVAL = 3000;

function resolveHeroTitleLines(value) {
  const title = String(value || '').trim();
  if (!title) return referenceHeroLines;

  const explicitLines = title
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (explicitLines.length > 1) return explicitLines;

  const normalized = title.replace(/\s+/g, ' ').toLocaleLowerCase('es');
  if (normalized === referenceHeroTitle) return referenceHeroLines;

  return [title];
}

export default function HomeHero({ content }) {
  const { images } = useSiteImages();
  const [activeBackground, setActiveBackground] = useState(0);
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

  useEffect(() => {
    setActiveBackground(0);
  }, [heroBackgrounds]);

  useEffect(() => {
    if (heroBackgrounds.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setActiveBackground((current) => (current + 1) % heroBackgrounds.length);
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
          {heroBackgrounds.map((src, index) => (
            <SafeImage
              key={src}
              className={`home-hero__background home-hero__background-slide ${index === activeBackground ? 'is-active' : ''}`}
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
