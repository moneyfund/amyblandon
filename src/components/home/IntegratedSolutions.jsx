import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import RevealOnScroll from '../common/RevealOnScroll';
import { homePageContent } from '../../content/homePage.es';

function BuildingIcon() {
  return (
    <svg viewBox="0 0 70 70" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M7 60h56v6H7zM14 31h15v29H14zM31 13h17v47H31zM50 23h10v37H50z" />
      <path fill="var(--amy-solution-card)" d="M19 38h5v7h-5zm0 11h5v7h-5zm18-27h5v7h-5zm0 11h5v7h-5zm0 11h5v7h-5zm18-14h3v7h-3zm0 11h3v7h-3z" />
    </svg>
  );
}

function InvestmentIcon() {
  return (
    <svg viewBox="0 0 70 70" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M8 46h9v17H8zm15-12h9v29h-9zm15 7h9v22h-9zm15-19h9v41h-9z" />
      <path fill="currentColor" d="M9 32 25 17l12 12 18-18-5-5h15v15l-5-5-23 23-12-12-11 11z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 70 70" aria-hidden="true" focusable="false">
      <path fill="currentColor" d="M35 5 60 14v18c0 16-9.8 27.7-25 34C19.8 59.7 10 48 10 32V14z" />
      <path fill="#fff" d="m29.5 45.5-11-11 6-6 5 5 15-15 6 6z" />
    </svg>
  );
}

const icons = {
  realEstate: BuildingIcon,
  investments: InvestmentIcon,
  insurance: ShieldIcon,
};

export default function IntegratedSolutions() {
  const carouselRef = useRef(null);

  const moveCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const card = carousel.querySelector('.home-solution');
    const distance = (card?.getBoundingClientRect().width || 320) + 15;
    carousel.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <section className="home-solutions" aria-labelledby="solutions-title">
      <RevealOnScroll className="home-section-heading">
        <p className="home-kicker">{homePageContent.servicesHeader.kicker}</p>
        <h2 id="solutions-title">{homePageContent.servicesHeader.title}</h2>
      </RevealOnScroll>

      <div className="home-solutions__carousel">
        <button
          type="button"
          className="home-solutions__arrow home-solutions__arrow--left"
          onClick={() => moveCarousel(-1)}
          aria-label="Ver solución anterior"
        >
          <ChevronLeft aria-hidden="true" />
        </button>

        <div className="home-solutions__grid" ref={carouselRef}>
          {homePageContent.services.map((service, index) => {
            const Icon = icons[service.key];
            return (
              <RevealOnScroll as="article" className="home-solution" key={service.key} delay={index * 110}>
                <span className="home-solution__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{service.title}</h3>
                <p>{service.text}</p>
              </RevealOnScroll>
            );
          })}
        </div>

        <button
          type="button"
          className="home-solutions__arrow home-solutions__arrow--right"
          onClick={() => moveCarousel(1)}
          aria-label="Ver siguiente solución"
        >
          <ChevronRight aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
