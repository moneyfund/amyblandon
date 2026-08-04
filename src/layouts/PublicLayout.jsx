import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

export default function PublicLayout() {
  const footerRef = useRef(null);

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

  return <div className="public-site">
    <Navbar />
    <main className="public-main"><Outlet /></main>
    <div ref={footerRef} className="public-footer-reveal" aria-hidden="false">
      <Footer />
    </div>
  </div>;
}
