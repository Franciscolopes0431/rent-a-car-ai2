import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function PublicRoute() {
  const { isAuthenticated, user, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <div className="min-vh-100 d-flex align-items-center justify-content-center text-secondary">A validar sessão...</div>;

  if (isAuthenticated && ['/login', '/registo'].includes(location.pathname)) {
    const destination = user?.role === 'admin'
      ? '/admin'
      : user?.role === 'gestor'
        ? '/gestor'
        : '/cliente';

    return <Navigate to={destination} replace />;
  }

  return <Outlet />;
}

export default PublicRoute;
