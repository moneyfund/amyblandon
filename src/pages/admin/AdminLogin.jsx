import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { firebaseEnabled } from '../../firebase/firebase';
import { friendlyAuthError, loginEmail, loginGoogle } from '../../services/authService';

export default function AdminLogin() {
  const { user, admin, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (!loading && user && admin) return <Navigate to="/admin" replace />;

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await loginEmail(email, password);
      navigate(location.state?.from || '/admin');
    } catch (loginError) {
      setError(friendlyAuthError(loginError));
    } finally {
      setBusy(false);
    }
  }

  async function submitGoogle() {
    setBusy(true);
    setError('');
    try {
      await loginGoogle();
      navigate('/admin');
    } catch (loginError) {
      setError(friendlyAuthError(loginError));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="admin-login">
      <section>
        <p className="section-kicker">Panel privado</p>
        <h1>Acceso administrativo</h1>
        <p>Inicia sesión con una cuenta que tenga permisos de administración.</p>

        {!firebaseEnabled && (
          <p className="notice">
            Firebase no está configurado. El panel permanece bloqueado hasta que exista una conexión real.
          </p>
        )}

        <form className="form" onSubmit={submit}>
          <label>
            Correo electrónico
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Escribe tu contraseña"
              autoComplete="current-password"
              required
            />
          </label>

          <button className="btn primary" disabled={busy}>
            {busy ? 'Verificando acceso...' : 'Ingresar con correo y contraseña'}
          </button>
          <button type="button" className="btn secondary" disabled={busy} onClick={submitGoogle}>
            Ingresar con Google
          </button>

          {error && <p className="error">{error}</p>}
        </form>
      </section>
    </main>
  );
}
