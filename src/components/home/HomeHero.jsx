import { MessageCircle } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { whatsappLink } from '../../utils/whatsapp';

const referenceHeroLines = ['Tu próxima', 'inversión,', 'comienza con', 'una buena', 'decisión'];
const referenceHeroTitle = homePageContent.hero.plainTitle.toLocaleLowerCase('es');

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
  const title = content?.heroTitle || homePageContent.hero.plainTitle;
  const hero = content
    ? {
      plainTitle: title,
      eyebrow: content.heroLabel || homePageContent.hero.eyebrow,
      titleLines: resolveHeroTitleLines(title),
      text: content.heroSubtitle || homePageContent.hero.text,
      button: homePageContent.hero.button,
    }
    : homePageContent.hero;

  return (
    <section className="home-hero" aria-label={hero.plainTitle}>
      <div className="home-hero__inner">
        <RevealOnScroll className="home-hero__copy">
          <p className="home-kicker">{hero.eyebrow}</p>
          <h1>{hero.titleLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</h1>
          <p>{hero.text}</p>
          <a className="amy-button" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)}>
            <MessageCircle size={20} />
            {hero.button}
          </a>
        </RevealOnScroll>

        <RevealOnScroll className="home-hero__media home-hero__media--layered" direction="right" delay={120}>
          <SafeImage
            className="home-hero__background"
            src={images.heroBackground}
            alt=""
            width="900"
            height="1120"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            objectPosition="center"
          />
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
