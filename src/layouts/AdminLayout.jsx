import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { ExternalLink, LogOut, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useSiteImages } from '../contexts/SiteImagesContext';
import { useSiteTheme } from '../contexts/SiteThemeContext';
import { firebaseEnabled } from '../firebase/firebase';
import { logout } from '../services/authService';

const AVALUOS_PLATFORM_URL = 'https://avaluos-platform.vercel.app/?tenant=amyblandon&source=amy-admin';
const SIDEBAR_STORAGE_KEY = 'amy-admin-sidebar-collapsed';

const links = [
  ['Panel principal', '/admin'],
  ['Propiedades', '/admin/properties'],
  ['Contenido de la web', '/admin/content'],
  ['Imágenes', '/admin/images'],
  ['Personalización', '/admin/customization'],
  ['Consultas de clientes', '/admin/inquiries'],
  ['Configuración', '/admin/settings'],
];

const readCollapsedPreference = () => {
  try {
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export default function AdminLayout() {
  const { user, profile } = useAuth();
  const { images } = useSiteImages();
  const { theme } = useSiteTheme();
  const [open, setOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(readCollapsedPreference);
  const [showIntro, setShowIntro] = useState(true);
  const [introLeaving, setIntroLeaving] = useState(false);
  const navigate = useNavigate();
  const publicUrl = window.location.hostname.endsWith('github.io')
    ? `${window.location.origin}${import.meta.env.BASE_URL}#/`
    : `${window.location.origin}/`;

  useEffect(() => {
    try {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarCollapsed));
    } catch {
      // El panel sigue funcionando aunque el navegador bloquee el almacenamiento local.
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    const fadeTimer = window.setTimeout(() => setIntroLeaving(true), 2450);
    const hideTimer = window.setTimeout(() => setShowIntro(false), 2850);

    return () => {
      window.clearTimeout(fadeTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  const signOut = async () => {
    await logout();
    navigate('/admin/login');
  };

  const adminThemeStyle = {
    '--admin-sidebar-bg': theme.footerBackground || '#001929',
  };

  const adminIntroStyle = {
    '--admin-intro-bg': theme.footerBackground || '#001929',
  };

  return (
    <div
      className={`admin-shell ${sidebarCollapsed ? 'admin-shell--sidebar-collapsed' : ''}`}
      style={adminThemeStyle}
    >
      {showIntro && (
        <div
          className={`admin-intro-loader ${introLeaving ? 'admin-intro-loader--leaving' : ''}`}
          style={adminIntroStyle}
          role="status"
          aria-label="Cargando panel privado de Amy Blandón"
        >
          <div className="admin-intro-loader__content">
            <div className="admin-intro-loader__logo">
              {images.brandLogo
                ? <img src={images.brandLogo} alt="Amy Blandón" />
                : <span>AMY BLANDON</span>}
            </div>
            <p>Construyendo confianza, creando oportunidades.</p>
            <div className="admin-intro-loader__progress" aria-hidden="true">
              <span />
            </div>
          </div>
        </div>
      )}

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
          <span className="admin-top__menu-controls">
            <button
              className="icon-button admin-mobile-menu-toggle"
              type="button"
              aria-label={open ? 'Cerrar menú administrativo' : 'Abrir menú administrativo'}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Menu />
            </button>
            <button
              className="admin-sidebar-collapse-toggle"
              type="button"
              aria-label={sidebarCollapsed ? 'Mostrar menú administrativo' : 'Ocultar menú administrativo'}
              aria-pressed={sidebarCollapsed}
              title={sidebarCollapsed ? 'Mostrar menú administrativo' : 'Ocultar menú administrativo'}
              onClick={() => setSidebarCollapsed((current) => !current)}
            >
              {sidebarCollapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
              <span>{sidebarCollapsed ? 'Mostrar menú' : 'Ocultar menú'}</span>
            </button>
          </span>
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
