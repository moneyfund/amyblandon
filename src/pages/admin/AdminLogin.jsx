import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseEnabled } from '../../firebase/firebase';
import { loginEmail, loginGoogle } from '../../services/authService';

export default function AdminLogin() {
  const { user, admin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  if (!loading && user && admin) return <Navigate to="/admin" replace />;
  async function submit(e) { e.preventDefault(); setBusy(true); setError(''); try { await loginEmail(email, password); navigate(location.state?.from || '/admin'); } catch (err) { setError(err.message); } finally { setBusy(false); } }
  return <main className="admin-login"><section><p className="section-kicker">Panel privado</p><h1>Acceso administrativo</h1><p>Ingresa con una cuenta autorizada en Firestore como administradora activa.</p>{!firebaseEnabled && <p className="notice">Firebase no está configurado. El panel permanece bloqueado sin credenciales reales.</p>}<form className="form" onSubmit={submit}><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" autoComplete="email" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" autoComplete="current-password" /><button className="btn primary" disabled={busy}>{busy ? 'Verificando...' : 'Ingresar'}</button><button type="button" className="btn secondary" onClick={() => loginGoogle().then(() => navigate('/admin')).catch((e) => setError(e.message))}>Ingresar con Google</button>{error && <p className="error">{error}</p>}</form></section></main>;
}
