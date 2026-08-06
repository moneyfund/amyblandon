import RevealOnScroll from '../common/RevealOnScroll';
import { homePageContent } from '../../content/homePage.es';
import { useSiteImages } from '../../contexts/SiteImagesContext';

export default function StrategicBanner({ content }) {
  const { images } = useSiteImages();
  const banner = content
    ? { kicker: content.strategicLabel, title: content.strategicTitle }
    : homePageContent.strategicBanner;

  return (
    <section
      className="home-strategic"
      style={{ '--strategic-image': `url("${images.strategicBanner}")` }}
    >
      <RevealOnScroll>
        <p>{banner.kicker}</p>
        <h2>{banner.title}</h2>
      </RevealOnScroll>
    </section>
  );
}
