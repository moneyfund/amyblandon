import { createContext, useContext, useEffect, useState } from 'react';
import { getAdminAccess, listenAuth } from '../services/authService';

const C = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState('comprobando sesión');
  const [adminAccess, setAdminAccess] = useState({ allowed: false, source: 'none', reason: 'loading' });

  useEffect(() => listenAuth(async (u) => {
    setLoading(true);
    setAuthStatus('comprobando sesión');
    setUser(u);
    if (!u) {
      setProfile(null); setAdmin(false); setAdminAccess({ allowed: false, source: 'none', reason: 'anonymous' }); setAuthStatus('sin sesión'); setLoading(false); return;
    }
    setAuthStatus('verificando rol');
    const access = await getAdminAccess(u);
    setProfile(access.profile);
    setAdmin(access.allowed);
    setAdminAccess(access);
    setAuthStatus(access.allowed ? 'autorizado' : (access.reason?.includes('permission') || access.reason?.includes('error') ? 'error de conexión' : 'no autorizado'));
    setLoading(false);
  }), []);

  return <C.Provider value={{ user, profile, admin, loading, authStatus, adminAccess }}>{children}</C.Provider>;
}
export const useAuth = () => useContext(C);
