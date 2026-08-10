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

  const themeStyle = {
    '--amy-navy': theme.primaryColor,
    '--amy-gold': theme.accentColor,
    '--amy-surface': theme.surfaceColor,
    '--site-navbar-bg': theme.navbarBackground,
    '--site-navbar-text': theme.navbarText,
    '--site-footer-bg': theme.footerBackground,
    '--site-footer-text': theme.footerText,
  };

  return <div className={pageClass} style={themeStyle}>
    <Navbar />
    <main className="public-main"><Outlet /></main>
    <div ref={footerRef} className="public-footer-reveal" aria-hidden="false">
      <Footer />
    </div>
  </div>;
}
