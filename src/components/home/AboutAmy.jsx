import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';

function splitAboutParagraphs(value) {
  const text = String(value || '').trim();
  if (!text) return [];

  const explicitParagraphs = text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  if (explicitParagraphs.length > 1) return explicitParagraphs;

  const visionMarker = 'Trabajo con una visión clara:';
  const markerIndex = text.indexOf(visionMarker);
  if (markerIndex > 0) {
    return [
      text.slice(0, markerIndex).trim(),
      text.slice(markerIndex).trim(),
    ].filter(Boolean);
  }

  return explicitParagraphs;
}

export default function AboutAmy({ content }) {
  const { images } = useSiteImages();
  const about = content
    ? {
      label: homePageContent.about.label,
      titleLines: ['ASESORA INMOBILIARIA, SEGUROS', 'E INVERSIONES'],
      paragraphs: splitAboutParagraphs(content.aboutText),
    }
    : {
      ...homePageContent.about,
      titleLines: ['ASESORA INMOBILIARIA, SEGUROS', 'E INVERSIONES'],
    };

  return (
    <section className="home-about">
      <div className="home-about__inner">
        <RevealOnScroll className="home-about__image" direction="left">
          <SafeImage
            src={images.aboutHome}
            alt="Amy Blandon, asesora inmobiliaria, seguros e inversiones"
            width="520"
            height="650"
            objectPosition="center top"
          />
        </RevealOnScroll>
        <RevealOnScroll className="home-about__copy" direction="right" delay={100}>
          <p className="home-about__label">{about.label}</p>
          <h2>{about.titleLines.filter(Boolean).map((line) => <span key={line}>{line}</span>)}</h2>
          <div className="home-about__paragraphs">
            {about.paragraphs.map((paragraph, index) => <p key={`${index}-${paragraph}`}>{paragraph}</p>)}
          </div>
          <div className={`home-about__signature ${images.signature ? 'home-about__signature--loaded' : ''}`} aria-label="Firma de Amy Blandon">
            {images.signature ? <img src={images.signature} alt="Firma de Amy Blandon" loading="lazy" decoding="async" /> : null}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
