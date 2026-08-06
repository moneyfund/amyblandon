import { Link } from 'react-router-dom';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { defaultBrandLogo } from '../../content/defaultBrandLogo';

export default function BrandLogo({ to = '/', className = '', image = false }) {
  const { images } = useSiteImages();

  if (image) {
    const logoSrc = images.brandLogo || defaultBrandLogo;
    return (
      <Link to={to} className={`brand-logo brand-logo--image ${className}`} aria-label="Amy Blandon, inicio">
        <span className="brand-logo__graphic" aria-hidden="true">
          <img
            className="brand-logo__image brand-logo__image--base"
            src={logoSrc}
            alt=""
            loading="eager"
            decoding="async"
          />
          <img
            className="brand-logo__image brand-logo__image--dark-tagline"
            src={logoSrc}
            alt=""
            loading="eager"
            decoding="async"
          />
        </span>
        <span className="sr-only">Amy Blandon — Asesora Inmobiliaria | Seguros | Inversiones</span>
      </Link>
    );
  }

  return (
    <Link to={to} className={`brand-logo ${className}`} aria-label="Amy Blandon, inicio">
      <span className="brand-logo__name">AMY BLANDON</span>
      <span className="brand-logo__tagline">Asesora Inmobiliaria | Seguros | Inversiones</span>
    </Link>
  );
}
