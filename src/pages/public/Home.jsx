import SEO from '../../components/common/SEO';
import AboutAmy from '../../components/home/AboutAmy';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import HomeHero from '../../components/home/HomeHero';
import IntegratedSolutions from '../../components/home/IntegratedSolutions';
import StrategicBanner from '../../components/home/StrategicBanner';
import { homePageContent } from '../../content/homePage.es';

export default function Home(){return <div className="home-page"><SEO title={homePageContent.seo.title} description={homePageContent.seo.description}/><HomeHero/><IntegratedSolutions/><AboutAmy/><StrategicBanner/><FeaturedProperties/></div>}
