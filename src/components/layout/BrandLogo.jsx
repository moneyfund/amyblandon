import { Link } from 'react-router-dom';

export default function BrandLogo({ to = '/', className = '' }) {
  return <Link to={to} className={`brand-logo ${className}`} aria-label="Amy Blandon, inicio"><span className="brand-logo__name">AMY BLANDON</span><span className="brand-logo__tagline">Asesora Inmobiliaria | Seguros | Inversiones</span></Link>;
}
