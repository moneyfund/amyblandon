import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSiteTheme } from '../contexts/SiteThemeContext';

export default function PublicLayout() {
  const footerRef = useRef(null);
  const location = useLocation();
  const { theme } = useSiteTheme();
  const isAboutPage = location.pathname === '/sobre-mi' || location.pathname === '/about';
  const isRealEstatePage = location.pathname === '/propiedades'
    || location.pathname === '/properties'
    || location.pathname === '/real-estate'
    || location.pathname === '/bienes-raices';
  const isInsurancePage = location.pathname === '/seguros' || location.pathname === '/insurance';

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) return undefined;

    const setFooterHeight = () => {
      document.documentElement.style.setProperty('--public-footer-height', `${footer.offsetHeight}px`);
    };

    setFooterHeight();
    const observer = new ResizeObserver(setFooterHeight);
    observer.observe(footer);
    window.addEventListener('resize', setFooterHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', setFooterHeight);
      document.documentElement.style.removeProperty('--public-footer-height');
    };
  }, []);

  const pageClass = [
    'public-site',
    isAboutPage ? 'public-site--about' : '',
    isRealEstatePage ? 'public-site--real-estate' : '',
    isInsurancePage ? 'public-site--insurance' : '',
  ].filter(Boolean).join(' ');

  const primaryDeep = `color-mix(in srgb, ${theme.primaryColor} 78%, #000000)`;
  const primaryHero = `color-mix(in srgb, ${theme.primaryColor} 84%, #000000)`;
  const primaryHeroLight = `color-mix(in srgb, ${theme.primaryColor} 72%, #FFFFFF)`;
  const accentLight = `color-mix(in srgb, ${theme.accentColor} 68%, #FFFFFF)`;
  const mutedText = `color-mix(in srgb, ${theme.primaryColor} 48%, #7E8A8F)`;
  const border = `color-mix(in srgb, ${theme.primaryColor} 14%, #FFFFFF)`;

  const themeStyle = {
    '--site-primary': theme.primaryColor,
    '--site-primary-deep': primaryDeep,
    '--site-accent': theme.accentColor,
    '--site-accent-light': accentLight,
    '--site-surface': theme.surfaceColor,
    '--site-body-text': primaryDeep,
    '--site-muted-text': mutedText,
    '--site-border': border,
    '--site-navbar-bg': theme.navbarBackground,
    '--site-navbar-text': theme.navbarText,
    '--site-footer-bg': theme.footerBackground,
    '--site-footer-text': theme.footerText,
    '--amy-navy': theme.primaryColor,
    '--amy-navy-deep': primaryDeep,
    '--amy-hero-navy': primaryHero,
    '--amy-hero-blue': primaryHeroLight,
    '--amy-hero-blue-deep': primaryDeep,
    '--amy-gold': theme.accentColor,
    '--amy-gold-light': accentLight,
    '--amy-surface': theme.surfaceColor,
    '--amy-text': primaryDeep,
    '--amy-muted': mutedText,
    '--amy-border': border,
  };

  return <div className={pageClass} style={themeStyle} data-theme-preset={theme.preset}>
    <Navbar />
    <main className="public-main"><Outlet /></main>
    <div ref={footerRef} className="public-footer-reveal" aria-hidden="false">
      <Footer />
    </div>
  </div>;
}
