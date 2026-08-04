import { Mail, MapPin, Phone } from 'lucide-react';
import { useState } from 'react';
import RevealOnScroll from '../common/RevealOnScroll';
import BrandLogo from './BrandLogo';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { whatsappLink } from '../../utils/whatsapp';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const submit = event => {
    event.preventDefault();
    if (status === 'loading') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus('error'); return; }
    setStatus('loading');
    window.setTimeout(() => { setStatus('success'); setEmail(''); }, 650);
  };
  return <footer className="public-footer">
    <div className="public-footer__grid">
      <RevealOnScroll as="div" className="public-footer__col" delay={0}>
        <BrandLogo className="brand-logo--footer" />
        <a className="public-footer__line" href="https://www.google.com/maps/search/?api=1&query=Matagalpa%2C%20Nicaragua" target="_blank" rel="noreferrer"><MapPin size={18} />{amyContact.location}</a>
        <a className="public-footer__line" href={`mailto:${amyContact.email}`}><Mail size={18} />Email: {amyContact.email}</a>
        <a className="public-footer__line" href={`tel:${amyContact.phone.replace(/\s/g, '')}`}><Phone size={18} />Phone: {amyContact.phone}</a>
      </RevealOnScroll>
      <RevealOnScroll as="div" className="public-footer__col public-footer__question" delay={110}><h2>{homePageContent.footer.question}</h2><a className="public-footer__whatsapp" href={whatsappLink(amyContact.whatsappMessage, amyContact.phone)}>Ir a WhatsApp</a></RevealOnScroll>
      <RevealOnScroll as="div" className="public-footer__col" delay={220}>
        <h3>{homePageContent.footer.subscribeTitle}</h3><p>{homePageContent.footer.subscribeText}</p>
        <form className="public-footer__form" onSubmit={submit} noValidate>
          <label className="sr-only" htmlFor="subscribe-email">Correo electrónico</label>
          <input id="subscribe-email" type="email" value={email} onChange={e => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }} placeholder="Email" disabled={status === 'loading'} aria-describedby="subscribe-status" />
          <button type="submit" disabled={status === 'loading'}>{status === 'loading' ? 'Enviando...' : 'Enviar'}</button>
        </form>
        <p id="subscribe-status" className={`public-footer__status public-footer__status--${status}`} aria-live="polite">{status === 'success' ? 'Gracias por suscribirte.' : status === 'error' ? 'Ingresa un correo electrónico válido.' : ''}</p>
      </RevealOnScroll>
    </div><small>{homePageContent.footer.copyright}</small>
  </footer>;
}
