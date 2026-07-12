import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function ProtectedRoute({ role }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role];
    if (!user || !allowedRoles.includes(user.role)) {
      const destination = user?.role === 'admin'
        ? '/admin'
        : user?.role === 'gestor'
          ? '/gestor'
          : user?.role === 'cliente'
            ? '/cliente'
            : '/';
      return <Navigate to={destination} replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
