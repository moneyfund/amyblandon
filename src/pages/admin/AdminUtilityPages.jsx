import { Link } from 'react-router-dom';
export function Unauthorized() { return <main className="admin-login"><section><h1>Acceso no autorizado</h1><p>Tu cuenta inició sesión, pero no tiene permisos de administrador activo.</p><Link className="btn" to="/admin/login">Volver al inicio de sesión</Link></section></main>; }
export function ComingSoon({ title }) { return <div className="admin-card"><p className="badge">Próximamente</p><h1>{title}</h1><p>La navegación está preparada para activar este módulo privado sin romper rutas.</p></div>; }
