import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseEnabled } from '../firebase/firebase';
import { logout } from '../services/authService';

const links = [
  ['Dashboard', '/admin'], ['Propiedades', '/admin/properties'], ['Contenido web', '/admin/content'], ['Consultas', '/admin/inquiries'],
  ['Clientes — Próximamente', '/admin/clients'], ['Captaciones — Próximamente', '/admin/property-leads'], ['Avalúos — Próximamente', '/admin/valuations'], ['Configuración', '/admin/settings'],
];
export default function AdminLayout() {
  const { user, profile } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const signOut = async () => { await logout(); navigate('/admin/login'); };
  return <div className="admin-shell"><aside className={open ? 'open' : ''}><h2>Amy Admin</h2>{links.map(([label, to]) => <NavLink key={to} end={to === '/admin'} to={to} onClick={() => setOpen(false)}>{label}</NavLink>)}<button className="link-button" onClick={signOut}><LogOut size={16} /> Cerrar sesión</button></aside><main><header className="admin-top"><button className="icon-button" onClick={() => setOpen(!open)}><Menu /></button><div><strong>{profile?.name || user?.displayName || 'Administración'}</strong><span>{user?.email}</span></div></header>{!firebaseEnabled && <p className="notice">Firebase no está configurado: se muestran estados vacíos o de demostración sin escribir datos reales.</p>}<Outlet /></main></div>;
}
