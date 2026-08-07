import { useEffect, useMemo, useState } from 'react';
import { Mail } from 'lucide-react';
import RevealOnScroll from './RevealOnScroll';
import { defaultSiteContent, getSiteContent } from '../../services/siteContentService';

function FacebookIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.6V6.8c0-.8.5-1 1-1h2.8V2.2L14.9 2C11.6 2 10 4 10 6.5v2.1H7v4.1h3V22h4v-9.3h3.4l.6-4.1H14Z" /></svg>;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" ry="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1" className="sector-social__icon-dot" /></svg>;
}

function TikTokIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.2 3c.4 2.1 1.7 3.5 3.8 3.9v3.2a8.5 8.5 0 0 1-3.8-1.2v6.4a6.3 6.3 0 1 1-5.5-6.2v3.3a3.1 3.1 0 1 0 2.3 3V3h3.2Z" /></svg>;
}

const sectorConfig = {
  realEstate: {
    eyebrow: 'CONECTA CON AMY · BIENES RAÍCES',
    title: 'Sígueme para descubrir oportunidades inmobiliarias',
    text: 'Propiedades, inversión, consejos y novedades del mercado inmobiliario en los canales dedicados a Bienes Raíces.',
    fields: {
      facebook: 'realEstateFacebook',
      instagram: 'realEstateInstagram',
      tiktok: 'realEstateTiktok',
      email: 'realEstateEmail',
    },
  },
  insurance: {
    eyebrow: 'CONECTA CON AMY · SEGUROS',
    title: 'Información de seguros en mis canales especializados',
    text: 'Consejos de protección, coberturas y orientación para tomar decisiones más claras sobre tu patrimonio y tranquilidad.',
    fields: {
      facebook: 'insuranceFacebook',
      instagram: 'insuranceInstagram',
      tiktok: 'insuranceTiktok',
      email: 'insuranceEmail',
    },
  },
};

const networkMeta = {
  facebook: { label: 'Facebook', caption: 'Visitar página', Icon: FacebookIcon },
  instagram: { label: 'Instagram', caption: 'Ver perfil', Icon: InstagramIcon },
  tiktok: { label: 'TikTok', caption: 'Ver contenido', Icon: TikTokIcon },
  email: { label: 'Correo', caption: 'Escribir a Amy', Icon: Mail },
};

function normalizeUrl(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function SectorSocialSection({ sector }) {
  const config = sectorConfig[sector];
  const [contact, setContact] = useState(defaultSiteContent.contact);

  useEffect(() => {
    getSiteContent('contact').then(setContact).catch(() => setContact(defaultSiteContent.contact));
  }, []);

  const links = useMemo(() => {
    if (!config) return [];
    return Object.entries(config.fields).map(([network, field]) => {
      const value = String(contact?.[field] || '').trim();
      if (!value) return null;
      const meta = networkMeta[network];
      return {
        network,
        ...meta,
        href: network === 'email' ? `mailto:${value}` : normalizeUrl(value),
        external: network !== 'email',
      };
    }).filter(Boolean);
  }, [config, contact]);

  if (!config || !links.length) return null;

  return (
    <section className={`sector-social sector-social--${sector}`} aria-label={`Redes de ${sector === 'realEstate' ? 'Bienes Raíces' : 'Seguros'}`}>
      <div className="sector-social__shell">
        <RevealOnScroll className="sector-social__heading">
          <p>{config.eyebrow}</p>
          <h2>{config.title}</h2>
          <span>{config.text}</span>
        </RevealOnScroll>

        <div className="sector-social__links">
          {links.map(({ network, label, caption, Icon, href, external }, index) => (
            <RevealOnScroll as="a" className="sector-social__link" href={href} key={network} delay={index * 60} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
              <span className="sector-social__icon"><Icon /></span>
              <span className="sector-social__label"><b>{label}</b><small>{caption}</small></span>
              <span className="sector-social__arrow" aria-hidden="true">↗</span>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
