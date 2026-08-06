import { MessageCircle } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { whatsappLink } from '../../utils/whatsapp';

export default function HomeHero({ content }) {
  const { images } = useSiteImages();
  const hero = content
    ? {
      plainTitle: content.heroTitle,
      eyebrow: content.heroLabel,
      titleLines: [content.heroTitle],
      text: content.heroSubtitle,
      button: homePageContent.hero.button,
    }
    : homePageContent.hero;

  return (
    <section className="home-hero" aria-label={hero.plainTitle}>
      <div className="home-hero__inner">
        <RevealOnScroll className="home-hero__copy">
          <p className="home-kicker">{hero.eyebrow}</p>
          <h1>{hero.titleLines.map((line) => <span key={line}>{line}</span>)}</h1>
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
