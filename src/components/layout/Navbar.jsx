import { useEffect, useRef, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { whatsappLink } from '../../utils/whatsapp';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const updateScrolled = () => setScrolled(window.scrollY > 44);
    updateScrolled();
    window.addEventListener('scroll', updateScrolled, { passive: true });
    return () => window.removeEventListener('scroll', updateScrolled);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = event => { if (event.key === 'Escape') setOpen(false); };
    const onPointer = event => { if (headerRef.current && !headerRef.current.contains(event.target)) setOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointer);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointer);
    };
  }, [open]);

  return <header ref={headerRef} className={`public-navbar ${scrolled ? 'public-navbar--scrolled' : ''} ${open ? 'public-navbar--open' : ''}`}>
    <div className="public-navbar__inner">
      <BrandLogo />
      <nav id="public-menu" className={`public-navbar__menu ${open ? 'is-open' : ''}`} aria-label="Navegación principal">
        {homePageContent.nav.map(item => <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)}>{item.label}</NavLink>)}
        <a className="public-navbar__phone" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)} onClick={() => setOpen(false)}>
          <Phone size={15} aria-hidden="true" />
          <span>{amyContact.phone}</span>
        </a>
      </nav>
      <button className="public-navbar__toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="public-menu" onClick={() => setOpen(v => !v)}>
        {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        <span>Menú</span>
      </button>
    </div>
  </header>;
}
