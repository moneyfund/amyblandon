import { useEffect, useState } from 'react';
import SEO from '../../components/common/SEO';
import AboutAmy from '../../components/home/AboutAmy';
import FeaturedProperties from '../../components/home/FeaturedProperties';
import HomeHero from '../../components/home/HomeHero';
import IntegratedSolutions from '../../components/home/IntegratedSolutions';
import StrategicBanner from '../../components/home/StrategicBanner';
import { homePageContent } from '../../content/homePage.es';
import { getSiteContent } from '../../services/siteContentService';

export default function Home(){const[content,setContent]=useState(null);useEffect(()=>{getSiteContent('home').then(setContent).catch(()=>setContent(null));},[]);return <div className="home-page"><SEO title={homePageContent.seo.title} description={homePageContent.seo.description}/><HomeHero content={content}/><IntegratedSolutions/><AboutAmy content={content}/><StrategicBanner content={content}/><FeaturedProperties/></div>}
