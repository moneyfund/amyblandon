import { Link } from 'react-router-dom';
import { useSiteImages } from '../../contexts/SiteImagesContext';
import { defaultBrandLogo } from '../../content/defaultBrandLogo';

export default function BrandLogo({ to = '/', className = '', image = false }) {
  const { images } = useSiteImages();

  if (image) {
    const logoSrc = images.brandLogo || defaultBrandLogo;
    return (
      <Link to={to} className={`brand-logo brand-logo--image ${className}`} aria-label="Amy Blandon, inicio">
        <img className="brand-logo__image" src={logoSrc} alt="Amy Blandon — Asesora Inmobiliaria | Seguros | Inversiones" />
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
