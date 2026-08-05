function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 8.6V6.8c0-.8.5-1 1-1h2.8V2.2L14.9 2C11.6 2 10 4 10 6.5v2.1H7v4.1h3V22h4v-9.3h3.4l.6-4.1H14Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="1" className="social-icon-dot" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.2 3c.4 2.1 1.7 3.5 3.8 3.9v3.2a8.5 8.5 0 0 1-3.8-1.2v6.4a6.3 6.3 0 1 1-5.5-6.2v3.3a3.1 3.1 0 1 0 2.3 3V3h3.2Z" />
    </svg>
  );
}

const networks = [
  ['facebook', 'Facebook', FacebookIcon],
  ['instagram', 'Instagram', InstagramIcon],
  ['tiktok', 'TikTok', TikTokIcon],
];

function normalizeSocialUrl(value) {
  const url = String(value || '').trim();
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  return `https://${url}`;
}

export default function SocialIcons({ links = {} }) {
  const available = networks
    .map(([key, label, Icon]) => ({ key, label, Icon, url: normalizeSocialUrl(links[key]) }))
    .filter((item) => item.url);

  if (!available.length) return null;

  return (
    <div className="public-footer__social" aria-label="Redes sociales">
      {available.map(({ key, label, Icon, url }) => (
        <a
          key={key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visitar ${label} de Amy Blandon`}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
