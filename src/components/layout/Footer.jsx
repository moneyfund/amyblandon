import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import RevealOnScroll from '../common/RevealOnScroll';
import BrandLogo from './BrandLogo';
import SocialIcons from './SocialIcons';
import { amyContact, homePageContent } from '../../content/homePage.es';
import { getSiteContent } from '../../services/siteContentService';
import { whatsappLink } from '../../utils/whatsapp';

const defaultContact = {
  phone: amyContact.phone,
  whatsapp: amyContact.phone,
  email: amyContact.email,
  address: amyContact.location,
  facebook: '',
  instagram: '',
  tiktok: '',
};

function mapLink(address) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address || amyContact.location)}`;
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [contact, setContact] = useState(defaultContact);

  useEffect(() => {
    getSiteContent('contact')
      .then((content) => setContact((current) => ({ ...current, ...content })))
      .catch(() => setContact(defaultContact));
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
  const contactEmail = contact.email || amyContact.email;

  return (
    <footer className="public-footer">
      <div className="public-footer__grid">
        <RevealOnScroll as="div" className="public-footer__col" delay={0}>
          <BrandLogo className="brand-logo--footer" image />
          <a className="public-footer__line" href={mapLink(address)} target="_blank" rel="noreferrer">
            <MapPin size={18} />
            {address}
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
          <h2>{homePageContent.footer.question}</h2>
          <a className="public-footer__whatsapp" href={whatsappLink(amyContact.whatsappMessage, whatsapp)}>
            <MessageCircle size={20} />
            Ir a WhatsApp
          </a>
        </RevealOnScroll>

        <RevealOnScroll as="div" className="public-footer__col" delay={220}>
          <h3>{homePageContent.footer.subscribeTitle}</h3>
          <p>{homePageContent.footer.subscribeText}</p>
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
              placeholder="Correo electrónico"
              disabled={status === 'loading'}
              aria-describedby="subscribe-status"
            />
            <button type="submit" disabled={status === 'loading'}>
              {status === 'loading' ? 'Enviando...' : 'Enviar'}
            </button>
          </form>
          <p
            id="subscribe-status"
            className={`public-footer__status public-footer__status--${status}`}
            aria-live="polite"
          >
            {status === 'success'
              ? 'Gracias por suscribirte.'
              : status === 'error'
                ? 'Ingresa un correo electrónico válido.'
                : ''}
          </p>
        </RevealOnScroll>
      </div>
      <small>{homePageContent.footer.copyright}</small>
    </footer>
  );
}
