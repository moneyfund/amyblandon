import { Building2, ShieldCheck, TrendingUp } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import { homePageContent } from '../../content/homePage.es';
const icons={realEstate:Building2,investments:TrendingUp,insurance:ShieldCheck};
export default function IntegratedSolutions(){return <section className="home-solutions"><RevealOnScroll className="home-section-heading"><p className="home-kicker">{homePageContent.servicesHeader.kicker}</p><h2>{homePageContent.servicesHeader.title}</h2></RevealOnScroll><div className="home-solutions__grid">{homePageContent.services.map((service,index)=>{const Icon=icons[service.key];return <RevealOnScroll as="article" className="home-solution" key={service.key} delay={index*110}><span className="home-solution__icon"><Icon size={58} strokeWidth={1.45}/></span><h3>{service.title}</h3><p>{service.text}</p></RevealOnScroll>})}</div></section>}
