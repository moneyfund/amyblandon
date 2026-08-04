import { createContext, useContext, useEffect, useState } from 'react';
import { getAdminAccess, listenAuth } from '../services/authService';

const C = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => listenAuth(async (u) => {
    setLoading(true);
    setUser(u);
    const access = await getAdminAccess(u);
    setProfile(access.profile);
    setAdmin(access.allowed);
    setLoading(false);
  }), []);

  return <C.Provider value={{ user, profile, admin, loading }}>{children}</C.Provider>;
}
export const useAuth = () => useContext(C);
