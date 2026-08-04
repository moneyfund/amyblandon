import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedAdminRoute() {
  const { user, admin, loading } = useAuth();
  const location = useLocation();
  if (loading) return <main className="admin-loading"><span className="spinner" /> Verificando acceso seguro...</main>;
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  if (!admin) return <Navigate to="/admin/unauthorized" replace />;
  return <Outlet />;
}
