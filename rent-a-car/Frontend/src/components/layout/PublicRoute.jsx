import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function PublicRoute() {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
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