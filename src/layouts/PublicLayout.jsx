import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useSiteTheme } from '../contexts/SiteThemeContext';
import { subscribeProperties } from '../services/propertyService';

export default function PublicLayout() {
  const footerRef = useRef(null);
  const location = useLocation();
  const { theme } = useSiteTheme();
  const [propertyRevision, setPropertyRevision] = useState(0);
  const isHomePage = location.pathname === '/';
  const isAboutPage = location.pathname === '/sobre-mi' || location.pathname === '/about';
  const isRealEstatePage = location.pathname === '/propiedades'
    || location.pathname === '/properties'
    || location.pathname === '/real-estate'
    || location.pathname === '/bienes-raices';
  const isInsurancePage = location.pathname === '/seguros' || location.pathname === '/insurance';
  const isPropertyDetailPage = location.pathname.startsWith('/properties/');

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

  useEffect(() => {
    if (!isPropertyDetailPage) return undefined;

    let initialSnapshot = true;
    const unsubscribe = subscribeProperties(
      {},
      () => {
        if (initialSnapshot) {
          initialSnapshot = false;
          return;
        }
        setPropertyRevision((current) => current + 1);
      },
      () => {},
    );

    return () => unsubscribe?.();
  }, [isPropertyDetailPage]);

  const pageClass = [
    'public-site',
    isHomePage ? 'public-site--home' : 'public-site--inner',
    isAboutPage ? 'public-site--about' : '',
    isRealEstatePage ? 'public-site--real-estate' : '',
    isInsurancePage ? 'public-site--insurance' : '',
  ].filter(Boolean).join(' ');

  const primaryDeep = `color-mix(in srgb, ${theme.primaryColor} 78%, #000000)`;
  const heroDeep = `color-mix(in srgb, ${theme.heroBackground} 80%, #000000)`;
  const heroLight = `color-mix(in srgb, ${theme.heroBackground} 68%, #FFFFFF)`;
  const accentLight = `color-mix(in srgb, ${theme.accentColor} 68%, #FFFFFF)`;
  const mutedText = `color-mix(in srgb, ${theme.primaryColor} 48%, #7E8A8F)`;
  const border = `color-mix(in srgb, ${theme.primaryColor} 14%, #FFFFFF)`;

  const themeStyle = {
    '--site-primary': theme.primaryColor,
    '--site-primary-deep': primaryDeep,
    '--site-hero-bg': theme.heroBackground,
    '--site-hero-deep': heroDeep,
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
    '--amy-hero-navy': theme.heroBackground,
    '--amy-hero-blue': heroLight,
    '--amy-hero-blue-deep': heroDeep,
    '--amy-gold': theme.accentColor,
    '--amy-gold-light': accentLight,
    '--amy-surface': theme.surfaceColor,
    '--amy-text': primaryDeep,
    '--amy-muted': mutedText,
    '--amy-border': border,
  };

  return <div className={pageClass} style={themeStyle} data-theme-preset={theme.preset}>
    <Navbar />
    <main className="public-main">
      <Outlet key={isPropertyDetailPage ? propertyRevision : 'public'} />
    </main>
    <div ref={footerRef} className="public-footer-reveal" aria-hidden="false">
      <Footer />
    </div>
  </div>;
}
