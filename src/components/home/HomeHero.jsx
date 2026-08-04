import { MessageCircle } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import SafeImage from '../common/SafeImage';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { siteImages } from '../../config/siteImages';
import { whatsappLink } from '../../utils/whatsapp';
export default function HomeHero(){const {hero}=homePageContent;return <section className="home-hero" aria-label={hero.plainTitle}><div className="home-hero__inner"><RevealOnScroll className="home-hero__copy"><p className="home-kicker">{hero.eyebrow}</p><h1>{hero.titleLines.map(line => <span key={line}>{line}</span>)}</h1><p>{hero.text}</p><a className="amy-button" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)}><MessageCircle size={20}/>{hero.button}</a></RevealOnScroll><RevealOnScroll className="home-hero__media" direction="right" delay={120}><SafeImage src={siteImages.hero} alt="Asesora profesional de Amy Blandon" width="540" height="690" loading="eager" fetchPriority="high" decoding="async" objectPosition="center top" /></RevealOnScroll></div></section>}
