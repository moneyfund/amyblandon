import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';

export default function AboutAmy({ content }) {
  const { images } = useSiteImages();
  const about = content
    ? {
      label: homePageContent.about.label,
      titleLines: [content.aboutTitle],
      paragraphs: [content.aboutText],
    }
    : homePageContent.about;

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
          <h2>{about.titleLines.map((line) => <span key={line}>{line}</span>)}</h2>
          {about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </RevealOnScroll>
      </div>
    </section>
  );
}
