import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';

function splitParagraphs(value) {
  const text = String(value || '').trim();
  if (!text) return [];
  return text
    .split(/\n\s*\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function splitHeadline(value) {
  const text = String(value || '').trim();
  if (!text) return ['ASESORA INMOBILIARIA, SEGUROS', 'E INVERSIONES'];
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  return lines.length ? lines : [text];
}

export default function AboutAmy({ content }) {
  const { images } = useSiteImages();
  const fallbackText = homePageContent.about.paragraphs.join('\n\n');
  const about = {
    label: content?.homeAboutLabel || homePageContent.about.label,
    titleLines: splitHeadline(content?.homeAboutHeadline || 'ASESORA INMOBILIARIA, SEGUROS\nE INVERSIONES'),
    paragraphs: splitParagraphs(content?.homeAboutText || fallbackText),
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
          <p className="home-about__label content-preserve-format">{about.label}</p>
          <h2>{about.titleLines.map((line, index) => <span key={`${line}-${index}`}>{line}</span>)}</h2>
          <div className="home-about__paragraphs">
            {about.paragraphs.map((paragraph, index) => (
              <p className="content-preserve-format" key={`${index}-${paragraph}`}>{paragraph}</p>
            ))}
          </div>
          <div className={`home-about__signature ${images.signature ? 'home-about__signature--loaded' : ''}`} aria-label="Firma de Amy Blandon">
            {images.signature ? <img src={images.signature} alt="Firma de Amy Blandon" loading="lazy" decoding="async" /> : null}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
