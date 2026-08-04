import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { whatsappLink } from '../../utils/whatsapp';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 8); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { document.body.classList.toggle('nav-open', open); return () => document.body.classList.remove('nav-open'); }, [open]);
  return <header className={`public-navbar ${scrolled ? 'public-navbar--scrolled' : ''}`}><div className="public-navbar__inner"><BrandLogo/><nav id="public-menu" className={`public-navbar__menu ${open ? 'is-open' : ''}`}>{homePageContent.nav.map(item => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>)}<a className="public-navbar__phone" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)} onClick={() => setOpen(false)}><Phone size={15}/>{amyContact.phone}</a></nav><button className="public-navbar__toggle" type="button" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="public-menu" onClick={() => setOpen(v => !v)}>{open ? <X size={24}/> : <Menu size={24}/>}<span>Menú</span></button></div></header>;
}
