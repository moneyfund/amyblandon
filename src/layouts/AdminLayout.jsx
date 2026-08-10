import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSiteImages } from '../contexts/SiteImagesContext';
import { firebaseEnabled } from '../firebase/firebase';
import { logout } from '../services/authService';

const AVALUOS_PLATFORM_URL = 'https://avaluos-platform.vercel.app/?tenant=amyblandon&source=amy-admin';

const links = [
  ['Panel principal', '/admin'],
  ['Propiedades', '/admin/properties'],
  ['Contenido de la web', '/admin/content'],
  ['Imágenes', '/admin/images'],
  ['Personalización', '/admin/customization'],
  ['Consultas de clientes', '/admin/inquiries'],
  ['Configuración', '/admin/settings'],
];

export default function AdminLayout() {
  const { user, profile } = useAuth();
  const { images } = useSiteImages();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const publicUrl = window.location.hostname.endsWith('github.io')
    ? `${window.location.origin}${import.meta.env.BASE_URL}#/`
    : `${window.location.origin}/`;

  const signOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell">
      <aside className={open ? 'open' : ''}>
        <div className="admin-brand">
          <div className="admin-brand__logo">
            {images.brandLogo
              ? <img src={images.brandLogo} alt="Amy Blandón" />
              : <span>AMY BLANDON</span>}
          </div>
          <small>Panel administrativo</small>
        </div>

        <nav aria-label="Navegación del panel administrativo">
          {links.map(([label, to]) => (
            <NavLink key={to} end={to === '/admin'} to={to} onClick={() => setOpen(false)}>
              {label}
            </NavLink>
          ))}
          <a
            href={AVALUOS_PLATFORM_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
            aria-label="Abrir sistema de avalúos de Amy Blandon"
          >
            <span>Avalúos</span>
            <ExternalLink size={15} aria-hidden="true" />
          </a>
        </nav>

        <a className="link-button" href={publicUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> Ver web pública
        </a>
        <button className="link-button" type="button" onClick={signOut}>
          <LogOut size={16} /> Cerrar sesión
        </button>
      </aside>

      <main>
        <header className="admin-top">
          <button
            className="icon-button"
            type="button"
            aria-label={open ? 'Cerrar menú administrativo' : 'Abrir menú administrativo'}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </button>
          <div>
            <strong>{profile?.name || user?.displayName || 'Administración'}</strong>
            <span>{user?.email}</span>
          </div>
        </header>

        {!firebaseEnabled && (
          <p className="notice">
            Firebase no está configurado. El panel muestra datos vacíos o de demostración y no puede guardar cambios reales.
          </p>
        )}

        <Outlet />
      </main>
    </div>
  );
}
