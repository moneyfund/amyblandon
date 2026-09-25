import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import RevealOnScroll from '../common/RevealOnScroll';
import BrandLogo from './BrandLogo';
import SocialIcons from './SocialIcons';
import { amyContact } from '../../content/homePage.es';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';
import { whatsappLink } from '../../utils/whatsapp';

const PROFESSIONAL_EMAIL = 'asesoria@amyblandon.com';

function mapLink(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || amyContact.location)}`;
}

export default function Footer() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [contact, setContact] = useState(defaultSiteContent.contact);
  const [footer, setFooter] = useState(defaultSiteContent.footer);

  useEffect(() => {
    Promise.all([getSiteContent('contact'), getSiteContent('footer')])
      .then(([contactContent, footerContent]) => {
        setContact(contactContent);
        setFooter(footerContent);
      })
      .catch(() => {
        setContact(defaultSiteContent.contact);
        setFooter(defaultSiteContent.footer);
      });
  }, []);

  const submit = (event) => {
    event.preventDefault();
    if (status === 'loading') return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('error');
      return;
    }
    setStatus('loading');
    window.setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 650);
  };

  const phone = contact.phone || amyContact.phone;
  const whatsapp = contact.whatsapp || phone;
  const address = contact.address || amyContact.location;
  const contactEmail = PROFESSIONAL_EMAIL;
  const isRealEstateContext = location.pathname === '/propiedades'
    || location.pathname === '/properties'
    || location.pathname === '/real-estate'
    || location.pathname === '/bienes-raices'
    || location.pathname.startsWith('/properties/');

  return (
    <footer className="public-footer">
      <div className="public-footer__grid">
        <RevealOnScroll as="div" className="public-footer__col" delay={0}>
          <BrandLogo className="brand-logo--footer" image />
          {isRealEstateContext && (
            <span className="public-footer__license">Carnet inmobiliario · 0153-2026-A-1</span>
          )}
          <a className="public-footer__line" href={mapLink(address)} target="_blank" rel="noreferrer">
            <MapPin size={18} />
            <span className="content-preserve-format">{address}</span>
          </a>
          <a className="public-footer__line" href={`mailto:${contactEmail}`}>
            <Mail size={18} />
            Correo: {contactEmail}
          </a>
          <a className="public-footer__line" href={`tel:${phone.replace(/\s/g, '')}`}>
            <Phone size={18} />
            Teléfono: {phone}
          </a>
          <SocialIcons links={contact} />
        </RevealOnScroll>

        <RevealOnScroll as="div" className="public-footer__col public-footer__question" delay={110}>
          <h2 className="content-preserve-format">{footer.question}</h2>
          <a className="public-footer__whatsapp" href={whatsappLink(amyContact.whatsappMessage, whatsapp)}>
            <MessageCircle size={20} />
            {footer.whatsappButton}
          </a>
        </RevealOnScroll>

        <RevealOnScroll as="div" className="public-footer__col" delay={220}>
          <h3 className="content-preserve-format">{footer.subscribeTitle}</h3>
          <p className="content-preserve-format">{footer.subscribeText}</p>
          <form className="public-footer__form" onSubmit={submit} noValidate>
            <label className="sr-only" htmlFor="subscribe-email">Correo electrónico</label>
            <input
              id="subscribe-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder={footer.subscribePlaceholder}
              disabled={status === 'loading'}
              aria-describedby="subscribe-status"
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Enviando...' : footer.submitLabel}
            </button>
          </form>
          <p
            id="subscribe-status"
            className={`public-footer__status public-footer__status--${status}`}
            aria-live="polite"
          >
            {status === 'success'
              ? footer.successMessage
              : status === 'error'
                ? footer.errorMessage
                : ''}
          </p>
        </RevealOnScroll>
      </div>

      <div className="public-footer__legal">
        <strong>Legal</strong>
        <nav aria-label="Información legal">
          <Link to="/politica-de-privacidad">Política de privacidad</Link>
          <span aria-hidden="true">·</span>
          <Link to="/condiciones-de-uso">Condiciones de uso</Link>
        </nav>
      </div>

      <small className="content-preserve-format">
        © 2026 - Amy Blandón.com | Powered by{' '}
        <a href="https://xarcon-creative.vercel.app/" target="_blank" rel="noopener noreferrer">Xarcon</a>
      </small>
    </footer>
  );
}
